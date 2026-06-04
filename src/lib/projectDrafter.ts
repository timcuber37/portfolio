import Anthropic from '@anthropic-ai/sdk'
import type { RepoDetails } from './github'

// Shared description of the output JSON shape, reused by both prompts.
const SHAPE = `Return ONLY a JSON object (no markdown, no code fences, no commentary) with exactly these keys:
- "title": a short, human-friendly project name. Capitalize properly and preserve well-known acronyms in uppercase (e.g. "SpeedCubeMuse", "API Gateway").
- "description": one or two sentences describing what the project is and does. Neutral, specific, no marketing fluff.
- "bullets": an array of 3–4 strings. Each is a single resume-style accomplishment beginning with a strong past-tense verb (Built, Engineered, Implemented, Designed, Deployed). Be concrete and technical.
- "tech": an array of 5–8 display-friendly technology names (e.g. "Next.js", "PostgreSQL", "Docker").`

// Stable instruction blocks — placed first and cache-controlled so repeated
// calls reuse the prefix (the per-request content is the volatile part).
const DRAFT_SYSTEM = `You write concise, recruiter-facing entries for a software engineer's portfolio, based only on a GitHub repository's metadata and README.

${SHAPE}

Rules:
- Use ONLY facts supported by the provided metadata and README. Never invent metrics, users, or features.
- If the README is sparse, keep the description short and write fewer, more conservative bullets rather than padding.
- "title": do not just echo the lowercase repo slug.
- Prefer specific nouns over adjectives. No emojis. No first person.`

const REFINE_SYSTEM = `You revise an existing portfolio project entry for a software engineer. You are given the current entry as JSON and an instruction describing the desired change. Apply the instruction and return the full updated entry.

${SHAPE}

Rules:
- Apply the instruction faithfully, but preserve every factual claim (technologies, metrics, scope) from the current entry unless the instruction explicitly says to change it.
- Never invent new facts, metrics, or technologies that aren't in the current entry or directly implied by it.
- Keep all four keys even if the instruction only targets one of them — return the others unchanged.
- No emojis. No first person.`

export type DraftedProject = {
  title: string
  description: string
  bullets: string[]
  tech: string[]
}

function buildUserPrompt(details: RepoDetails): string {
  const { repo, languages, readme } = details
  const truncatedReadme = readme.slice(0, 12000)
  return [
    `Repository: ${repo.full_name}`,
    repo.description ? `GitHub description: ${repo.description}` : null,
    `Primary language: ${repo.language ?? 'unknown'}`,
    languages.length ? `Languages (by bytes): ${languages.join(', ')}` : null,
    repo.topics.length ? `Topics: ${repo.topics.join(', ')}` : null,
    repo.homepage ? `Homepage: ${repo.homepage}` : null,
    '',
    '--- README ---',
    truncatedReadme || '(no README provided)',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

// Pull a JSON object out of the model's text, tolerating stray fences/prose.
function parseDraft(text: string): DraftedProject {
  let raw = text.trim()
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) raw = fence[1].trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Model did not return JSON')
  const parsed = JSON.parse(raw.slice(start, end + 1))

  const asStrings = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0) : []

  return {
    title: typeof parsed.title === 'string' ? parsed.title.trim() : '',
    description: typeof parsed.description === 'string' ? parsed.description.trim() : '',
    bullets: asStrings(parsed.bullets).slice(0, 4),
    tech: asStrings(parsed.tech).slice(0, 8),
  }
}

// One Claude call: cached system prompt + volatile user content → parsed entry.
async function generate(system: string, user: string): Promise<DraftedProject> {
  const client = new Anthropic() // reads ANTHROPIC_API_KEY

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 6000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
  })

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n')

  return parseDraft(text)
}

export async function draftProject(details: RepoDetails): Promise<DraftedProject> {
  return generate(DRAFT_SYSTEM, buildUserPrompt(details))
}

export async function refineProject(
  current: DraftedProject,
  instruction: string
): Promise<DraftedProject> {
  const user = `Current entry:\n${JSON.stringify(current, null, 2)}\n\nInstruction: ${instruction}`
  return generate(REFINE_SYSTEM, user)
}

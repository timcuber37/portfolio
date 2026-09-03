// Minimal GitHub REST client for the portfolio importer (server-only).
// A GITHUB_TOKEN (optional) raises the rate limit from 60 to 5000 req/hr.

const API = 'https://api.github.com'

// Blank-but-present values are common (an unset Vercel var, a quoted empty
// string in .env), and sending `Bearer ` 401s every call — treat them as absent.
function token(): string | null {
  const raw = (process.env.GITHUB_TOKEN ?? '').trim().replace(/^['"]|['"]$/g, '').trim()
  return raw || null
}

function headers(auth: boolean): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-importer',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const t = token()
  if (auth && t) h.Authorization = `Bearer ${t}`
  return h
}

async function gh<T>(path: string): Promise<T> {
  let res = await fetch(`${API}${path}`, { headers: headers(true), cache: 'no-store' })

  // An expired or malformed token 401s even on public endpoints that need no
  // auth. The importer reads public repos, so drop the token and retry once
  // rather than failing outright.
  if (res.status === 401 && token()) {
    console.warn(`GitHub rejected GITHUB_TOKEN (401) — retrying ${path} unauthenticated. Rotate or unset the token.`)
    res = await fetch(`${API}${path}`, { headers: headers(false), cache: 'no-store' })
  }

  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    if ((res.status === 403 || res.status === 429) && remaining === '0') {
      throw new Error('GitHub API rate limit reached. Set a valid GITHUB_TOKEN to raise the limit (60 -> 5000/hr).')
    }
    if (res.status === 401) {
      throw new Error('GitHub rejected the request (401). GITHUB_TOKEN is invalid or expired — rotate it, or clear it to use public access.')
    }
    if (res.status === 404) throw new Error(`GitHub resource not found: ${path}`)
    throw new Error(`GitHub API error ${res.status} for ${path}`)
  }
  return res.json() as Promise<T>
}

export type GitHubRepo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  fork: boolean
  archived: boolean
  stargazers_count: number
  created_at: string
  pushed_at: string
}

export type RepoDetails = {
  repo: GitHubRepo
  languages: string[]
  readme: string
}

// List a user's own (non-fork) repositories, most recently pushed first.
export async function listRepos(user: string): Promise<GitHubRepo[]> {
  const repos = await gh<GitHubRepo[]>(
    `/users/${encodeURIComponent(user)}/repos?per_page=100&sort=pushed&type=owner`
  )
  return repos.filter((r) => !r.fork)
}

export async function getRepoDetails(owner: string, repo: string): Promise<RepoDetails> {
  const repoData = await gh<GitHubRepo>(`/repos/${owner}/${repo}`)

  const langMap = await gh<Record<string, number>>(`/repos/${owner}/${repo}/languages`)
  // Languages come back keyed by name, ordered by bytes — keep that order.
  const languages = Object.keys(langMap)

  let readme = ''
  try {
    const r = await gh<{ content?: string; encoding?: string }>(`/repos/${owner}/${repo}/readme`)
    if (r.content) {
      readme = Buffer.from(r.content, (r.encoding as BufferEncoding) || 'base64').toString('utf-8')
    }
  } catch {
    // No README is fine — the drafter falls back to metadata only.
  }

  return { repo: repoData, languages, readme }
}

// Format "2026-05-01T..." → "May 2026" for the project's start/end dates.
export function monthYear(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}

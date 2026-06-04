// Minimal GitHub REST client for the portfolio importer (server-only).
// A GITHUB_TOKEN (optional) raises the rate limit from 60 to 5000 req/hr.

const API = 'https://api.github.com'

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-importer',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: headers(), cache: 'no-store' })
  if (!res.ok) {
    const remaining = res.headers.get('x-ratelimit-remaining')
    if (res.status === 403 && remaining === '0') {
      throw new Error('GitHub API rate limit reached. Set GITHUB_TOKEN to raise the limit.')
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

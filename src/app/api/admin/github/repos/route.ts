import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'
import { listRepos } from '@/lib/github'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Resolve the GitHub username from the site's configured profile URL.
  const setting = await prisma.siteSetting.findUnique({ where: { key: 'github' } })
  const url = setting?.value ?? 'https://github.com/timcuber37'
  const user = url.replace(/\/+$/, '').split('/').pop() || 'timcuber37'

  try {
    const repos = await listRepos(user)
    return Response.json(
      repos.map((r) => ({
        full_name: r.full_name,
        name: r.name,
        description: r.description,
        language: r.language,
        topics: r.topics,
        stargazers_count: r.stargazers_count,
        archived: r.archived,
        pushed_at: r.pushed_at,
        html_url: r.html_url,
      }))
    )
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'GitHub fetch failed' }, { status: 502 })
  }
}

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'
import { getRepoDetails, monthYear } from '@/lib/github'
import { draftProject } from '@/lib/projectDrafter'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

// Fallback title from a repo slug, used only if the model returns no title.
function titleFromSlug(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { full_name } = await req.json()
  if (typeof full_name !== 'string' || !full_name.includes('/')) {
    return Response.json({ error: 'Expected { full_name: "owner/repo" }' }, { status: 400 })
  }
  const [owner, repo] = full_name.split('/')

  let details
  let draft
  try {
    details = await getRepoDetails(owner, repo)
    draft = await draftProject(details)
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Import failed' }, { status: 502 })
  }

  const githubUrl = details.repo.html_url
  const liveUrl = details.repo.homepage?.trim() ? details.repo.homepage.trim() : null
  const startDate = monthYear(details.repo.created_at)
  const endDate = details.repo.archived ? monthYear(details.repo.pushed_at) : null
  const title = draft.title || titleFromSlug(details.repo.name)

  // Upsert by GitHub URL so re-importing refreshes the AI-drafted fields
  // without clobbering manually-curated screenshots, visibility, or order.
  const existing = await prisma.project.findFirst({ where: { githubUrl } })

  const shared = {
    title,
    description: draft.description,
    tech: JSON.stringify(draft.tech),
    bullets: JSON.stringify(draft.bullets),
    startDate,
    endDate,
    githubUrl,
    liveUrl,
  }

  const project = existing
    ? await prisma.project.update({ where: { id: existing.id }, data: shared })
    : await prisma.project.create({
        data: { ...shared, screenshots: '[]', visible: true, order: await prisma.project.count() },
      })

  return Response.json({
    ...project,
    tech: JSON.parse(project.tech),
    bullets: JSON.parse(project.bullets),
    screenshots: JSON.parse(project.screenshots),
    _action: existing ? 'updated' : 'created',
  })
}

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'
import { refineProject } from '@/lib/projectDrafter'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function POST(req: NextRequest, ctx: RouteContext<'/api/admin/projects/[id]/refine'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { instruction } = await req.json()
  if (typeof instruction !== 'string' || !instruction.trim()) {
    return Response.json({ error: 'An instruction is required' }, { status: 400 })
  }

  const existing = await prisma.project.findUnique({ where: { id: Number(id) } })
  if (!existing) return Response.json({ error: 'Project not found' }, { status: 404 })

  let draft
  try {
    draft = await refineProject(
      {
        title: existing.title,
        description: existing.description,
        tech: JSON.parse(existing.tech),
        bullets: JSON.parse(existing.bullets),
      },
      instruction.trim()
    )
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Refine failed' }, { status: 502 })
  }

  // Only the AI-authored fields change; dates, URLs, screenshots, visibility,
  // and ordering are preserved.
  const project = await prisma.project.update({
    where: { id: existing.id },
    data: {
      title: draft.title || existing.title,
      description: draft.description || existing.description,
      tech: JSON.stringify(draft.tech.length ? draft.tech : JSON.parse(existing.tech)),
      bullets: JSON.stringify(draft.bullets.length ? draft.bullets : JSON.parse(existing.bullets)),
    },
  })

  return Response.json({
    ...project,
    tech: JSON.parse(project.tech),
    bullets: JSON.parse(project.bullets),
    screenshots: JSON.parse(project.screenshots),
  })
}

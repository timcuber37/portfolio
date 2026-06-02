import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/admin/projects/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  const data = await req.json()
  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
      tech: JSON.stringify(data.tech ?? []),
      bullets: JSON.stringify(data.bullets ?? []),
      // Only overwrite screenshots when explicitly provided, so partial updates
      // (e.g. the admin visibility toggle) don't wipe existing images.
      ...(data.screenshots !== undefined
        ? { screenshots: JSON.stringify(data.screenshots) }
        : {}),
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      githubUrl: data.githubUrl ?? null,
      liveUrl: data.liveUrl ?? null,
      visible: data.visible ?? true,
    },
  })
  return Response.json({
    ...project,
    tech: JSON.parse(project.tech),
    bullets: JSON.parse(project.bullets),
    screenshots: JSON.parse(project.screenshots),
  })
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/admin/projects/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  await prisma.project.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}

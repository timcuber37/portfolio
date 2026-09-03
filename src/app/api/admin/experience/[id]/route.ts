import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/admin/experience/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  const data = await req.json()
  const exp = await prisma.experience.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      company: data.company,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      bullets: JSON.stringify(data.bullets ?? []),
      gpa: data.gpa || null,
      type: data.type ?? 'work',
      visible: data.visible ?? true,
    },
  })
  return Response.json({ ...exp, bullets: data.bullets })
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/admin/experience/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  await prisma.experience.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}

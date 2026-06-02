import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/admin/skills/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  const data = await req.json()
  const skill = await prisma.skill.update({
    where: { id: Number(id) },
    data: { name: data.name, category: data.category, visible: data.visible ?? true },
  })
  return Response.json(skill)
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/admin/skills/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  await prisma.skill.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}

import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/admin/sections/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  const data = await req.json()
  const section = await prisma.customSection.update({
    where: { id: Number(id) },
    data: {
      label: data.label ?? '',
      heading: data.heading ?? '',
      body: data.body ?? '',
      visible: data.visible ?? true,
    },
  })
  return Response.json(section)
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/admin/sections/[id]'>) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await ctx.params
  await prisma.customSection.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}

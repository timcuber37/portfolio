import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  return Response.json(await prisma.skill.findMany({ orderBy: { order: 'asc' } }))
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const count = await prisma.skill.count()
  const skill = await prisma.skill.create({
    data: { name: data.name, category: data.category, visible: data.visible ?? true, order: count },
  })
  return Response.json(skill, { status: 201 })
}

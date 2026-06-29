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
  return Response.json(await prisma.customSection.findMany({ orderBy: { order: 'asc' } }))
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const count = await prisma.customSection.count()
  const section = await prisma.customSection.create({
    data: {
      label: data.label ?? '',
      heading: data.heading ?? '',
      body: data.body ?? '',
      visible: data.visible ?? true,
      order: count,
    },
  })
  return Response.json(section, { status: 201 })
}

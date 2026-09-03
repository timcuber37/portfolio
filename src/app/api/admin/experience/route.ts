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
  const rows = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  return Response.json(rows.map((e) => ({ ...e, bullets: JSON.parse(e.bullets) })))
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const count = await prisma.experience.count()
  const exp = await prisma.experience.create({
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
      order: count,
    },
  })
  return Response.json({ ...exp, bullets: data.bullets }, { status: 201 })
}

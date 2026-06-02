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
  const rows = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  return Response.json(
    rows.map((p) => ({
      ...p,
      tech: JSON.parse(p.tech),
      bullets: JSON.parse(p.bullets),
      screenshots: JSON.parse(p.screenshots),
    }))
  )
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const count = await prisma.project.count()
  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      tech: JSON.stringify(data.tech ?? []),
      bullets: JSON.stringify(data.bullets ?? []),
      screenshots: JSON.stringify(data.screenshots ?? []),
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      githubUrl: data.githubUrl ?? null,
      liveUrl: data.liveUrl ?? null,
      visible: data.visible ?? true,
      order: count,
    },
  })
  return Response.json(
    { ...project, tech: data.tech, bullets: data.bullets, screenshots: data.screenshots ?? [] },
    { status: 201 }
  )
}

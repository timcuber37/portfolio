import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!isValidAdminToken(token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [events, total, downloads, messages] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.analyticsEvent.count({ where: { type: 'pageview' } }),
    prisma.analyticsEvent.count({ where: { type: 'resume_download' } }),
    prisma.contactMessage.count(),
  ])

  const byDay: Record<string, number> = {}
  for (const e of events) {
    if (e.type !== 'pageview') continue
    const day = e.createdAt.toISOString().slice(0, 10)
    byDay[day] = (byDay[day] ?? 0) + 1
  }

  const byCountry: Record<string, number> = {}
  for (const e of events) {
    if (e.type !== 'pageview' || !e.country) continue
    byCountry[e.country] = (byCountry[e.country] ?? 0) + 1
  }

  const recentMessages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return Response.json({
    total,
    downloads,
    messageCount: messages,
    byDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    byCountry: Object.entries(byCountry)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    recentMessages,
  })
}

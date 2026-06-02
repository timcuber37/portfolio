import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') ?? 'unknown'

    let country: string | null = null
    if (ip && ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,status`, {
          signal: AbortSignal.timeout(2000),
        })
        if (geo.ok) {
          const data = await geo.json()
          if (data.status === 'success') country = data.country ?? null
        }
      } catch {}
    }

    await prisma.analyticsEvent.create({
      data: { type: 'resume_download', ip, country, page: '/resume' },
    })
  } catch {}

  return new Response(null, { status: 204 })
}

import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const headersList = await headers()

    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') ?? 'unknown'
    const userAgent = headersList.get('user-agent') ?? ''

    let country: string | null = null
    let city: string | null = null
    let region: string | null = null

    if (ip && ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName,status`, {
          signal: AbortSignal.timeout(2000),
        })
        if (geo.ok) {
          const data = await geo.json()
          if (data.status === 'success') {
            country = data.country ?? null
            city = data.city ?? null
            region = data.regionName ?? null
          }
        }
      } catch {
        // geo lookup failed silently
      }
    }

    await prisma.analyticsEvent.create({
      data: {
        type: body.type ?? 'pageview',
        page: body.page ?? '/',
        ip,
        userAgent,
        country,
        city,
        region,
      },
    })

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 204 })
  }
}

import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'

const LOCAL_IPS = new Set(['unknown', '127.0.0.1', '::1', '::ffff:127.0.0.1'])

// Convert an ISO 3166-1 alpha-2 code (e.g. "US") to a full name ("United States")
// so header-derived countries group with the ip-api ones.
function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

function safeDecode(v: string | null): string | null {
  if (!v) return null
  try {
    return decodeURIComponent(v)
  } catch {
    return v
  }
}

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

    // 1. Prefer the hosting platform's geo header (Vercel / Cloudflare):
    //    instant, no external request, no rate limit. CF uses "XX"/"T1" for unknown/Tor.
    const headerCountry = headersList.get('x-vercel-ip-country') ?? headersList.get('cf-ipcountry')
    if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
      country = countryName(headerCountry)
      city = safeDecode(headersList.get('x-vercel-ip-city'))
      region = safeDecode(headersList.get('x-vercel-ip-country-region'))
    }

    // 2. Fall back to an IP geolocation lookup when no platform header is present
    //    and we have a real, public IP to resolve.
    if (!country && !LOCAL_IPS.has(ip)) {
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

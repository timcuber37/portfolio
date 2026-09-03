import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { del } from '@vercel/blob'
import { isValidAdminToken } from '@/lib/auth'
import { isBlobUrl } from '@/lib/media'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

// Permanently removes an uploaded file from the Blob store. Only ever called for
// blobs we uploaded — committed files under public/ and YouTube URLs are dropped
// from the project's list without touching anything.
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await req.json()
  if (typeof url !== 'string' || !isBlobUrl(url)) {
    return Response.json({ error: 'Not an uploaded file' }, { status: 400 })
  }

  try {
    await del(url)
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Delete failed' },
      { status: 502 }
    )
  }
  return new Response(null, { status: 204 })
}

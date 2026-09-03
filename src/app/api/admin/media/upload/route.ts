import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { cookies } from 'next/headers'
import { isValidAdminToken } from '@/lib/auth'
import { MAX_UPLOAD_BYTES, UPLOAD_CONTENT_TYPES } from '@/lib/media'

// Issues short-lived client tokens so the admin panel uploads straight to Vercel
// Blob. Going through this route instead of posting the file to the server keeps
// uploads clear of Vercel's ~4.5MB function body limit, which no real video clears.
async function isAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  // This route is called twice: by the browser to mint a token (admin cookie
  // present), and by Blob's servers to report completion (no cookie, its own
  // signature checked inside handleUpload). So auth is gated on the branch
  // rather than the whole handler — a blanket check would 401 the callback.
  //
  // It has to happen out here, before handleUpload: handleUpload resolves the
  // BLOB_READ_WRITE_TOKEN first and fails on a missing one *without* ever
  // invoking onBeforeGenerateToken, which would answer an unauthenticated
  // caller with a config error instead of a 401.
  if (body.type === 'blob.generate-client-token' && !(await isAdmin())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await handleUpload({
      body,
      request,
      // Kept as defense in depth: the only path that mints a token re-checks.
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error('Unauthorized')
        return {
          allowedContentTypes: [...UPLOAD_CONTENT_TYPES],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
        }
      },
    })
    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return Response.json({ error: message }, { status: message === 'Unauthorized' ? 401 : 400 })
  }
}

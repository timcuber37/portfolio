import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Invalid password' }, { status: 401 })
  }

  const res = Response.json({ ok: true })
  res.headers.set(
    'Set-Cookie',
    `admin_session=${process.env.ADMIN_SESSION_TOKEN}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`,
  )
  return res
}

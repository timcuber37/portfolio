import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { isValidAdminToken } from '@/lib/auth'

async function requireAdmin() {
  const store = await cookies()
  return isValidAdminToken(store.get('admin_session')?.value)
}

// Body: { ids: number[] } in the desired display order; sets order = index.
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { ids } = await req.json()
  if (!Array.isArray(ids)) return Response.json({ error: 'Expected { ids: number[] }' }, { status: 400 })
  await Promise.all(
    ids.map((id: number, i: number) =>
      prisma.customSection.update({ where: { id: Number(id) }, data: { order: i } })
    )
  )
  return Response.json({ ok: true })
}

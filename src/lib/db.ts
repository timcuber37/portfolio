import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrisma() {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'
  // A token is required for hosted libSQL (Turso) in production; local file URLs use none.
  const authToken = process.env.DATABASE_AUTH_TOKEN
  const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url })
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])
}

export const prisma = globalForPrisma.prisma ?? createPrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

import { config } from 'dotenv'
import { execSync } from 'node:child_process'
import { createClient } from '@libsql/client'

// Load env like Next.js: real shell env wins, then .env.local, then .env.
config({ path: '.env.local' })
config({ path: '.env' })

// Applies the Prisma schema to the database in DATABASE_URL.
// Unlike `prisma db push` (whose SQLite engine only accepts file: URLs), this
// goes through the libSQL client, so it works against a hosted Turso database
// (libsql:// + DATABASE_AUTH_TOKEN) as well as a local file — no Turso CLI needed.

const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!url) {
  console.error('DATABASE_URL is not set (add it to .env.local or the command environment).')
  process.exit(1)
}

async function main() {
  // Generate CREATE TABLE/INDEX SQL from the schema (offline; no DB connection).
  const ddl = execSync('npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script', {
    encoding: 'utf-8',
  })
    .replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "')
    .replace(/CREATE (UNIQUE )?INDEX "/g, 'CREATE $1INDEX IF NOT EXISTS "')

  const client = createClient(authToken ? { url: url!, authToken } : { url: url! })
  await client.executeMultiple(ddl)
  console.log(`✓ Schema applied to ${url!.startsWith('libsql') ? 'remote libSQL/Turso database' : url}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

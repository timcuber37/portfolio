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

// Pulls each table's column definitions out of Prisma's generated CREATE TABLE
// statements, so existing tables can be compared against the schema.
function parseTables(ddl: string): Map<string, Map<string, string>> {
  const tables = new Map<string, Map<string, string>>()
  const re = /CREATE TABLE (?:IF NOT EXISTS )?"(\w+)"\s*\(([\s\S]*?)\n\);/g
  for (const [, table, body] of ddl.matchAll(re)) {
    const columns = new Map<string, string>()
    for (const line of body.split('\n')) {
      const def = line.trim().replace(/,$/, '')
      const name = /^"(\w+)"\s+(.+)$/.exec(def)
      // Skip table-level constraints (PRIMARY KEY (...), FOREIGN KEY ...).
      if (name) columns.set(name[1], name[2])
    }
    tables.set(table, columns)
  }
  return tables
}

async function main() {
  // Generate CREATE TABLE/INDEX SQL from the schema (offline; no DB connection).
  const rawDdl = execSync('npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script', {
    encoding: 'utf-8',
  })
  const ddl = rawDdl
    .replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "')
    .replace(/CREATE (UNIQUE )?INDEX "/g, 'CREATE $1INDEX IF NOT EXISTS "')

  const client = createClient(authToken ? { url: url!, authToken } : { url: url! })
  await client.executeMultiple(ddl)

  // CREATE TABLE IF NOT EXISTS is a no-op on a table that already exists, so it
  // can never introduce a column added to the schema later. Diff each existing
  // table against the schema and ALTER in whatever is missing.
  const added: string[] = []
  for (const [table, wanted] of parseTables(rawDdl)) {
    const info = await client.execute(`PRAGMA table_info("${table}")`)
    const existing = new Set(info.rows.map((r) => String(r.name)))
    if (existing.size === 0) continue // table was just created with every column

    for (const [column, definition] of wanted) {
      if (existing.has(column)) continue
      // SQLite rejects ADD COLUMN for anything NOT NULL without a default, and
      // for a PRIMARY KEY — those need a table rebuild, so surface them instead
      // of failing halfway through.
      if (/NOT NULL/.test(definition) && !/DEFAULT/.test(definition)) {
        throw new Error(
          `Cannot add "${table}"."${column}" (${definition}) — SQLite requires a DEFAULT ` +
            `for a NOT NULL column. Give it a default or make it optional in schema.prisma.`
        )
      }
      await client.execute(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${definition}`)
      added.push(`${table}.${column}`)
    }
  }

  const target = url!.startsWith('libsql') ? 'remote libSQL/Turso database' : url
  console.log(`✓ Schema applied to ${target}`)
  if (added.length) console.log(`  added column(s): ${added.join(', ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

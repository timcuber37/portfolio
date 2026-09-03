// One-off utility: export the live site's editable content (settings, projects,
// experience, skills, custom sections) to a JSON file so prisma/seed.ts can be
// regenerated to match production. Runtime-only tables (analytics, contact
// messages) are intentionally excluded.
//
// Usage — point it at your hosted Turso DB with production credentials:
//   DATABASE_URL="libsql://<db>-<org>.turso.io" DATABASE_AUTH_TOKEN="<token>" \
//     npx tsx scripts/export-content.ts [outfile]
//
// Defaults to writing ./db-export.json. It refuses to run against a local
// file: DB so you can't accidentally export dev.db.
import { writeFileSync } from 'node:fs'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

// Read credentials only from the inline command environment (not .env.local),
// so the local file: DB can never be picked up by accident.
const url = process.env.DATABASE_URL
const authToken = process.env.DATABASE_AUTH_TOKEN

if (!url || url.startsWith('file:')) {
  console.error('Refusing to run: DATABASE_URL is not a hosted Turso DB (got: ' + (url ?? 'unset') + ').')
  console.error('Run it with your production credentials, e.g.:')
  console.error('  DATABASE_URL="libsql://<db>-<org>.turso.io" DATABASE_AUTH_TOKEN="<token>" npx tsx scripts/export-content.ts')
  process.exit(1)
}

const outfile = process.argv[2] ?? 'db-export.json'
const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.error('Exporting content from:', url)

  const [settingsRows, projectRows, experienceRows, skillRows, sectionRows] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.project.findMany({ orderBy: { order: 'asc' } }),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.customSection.findMany({ orderBy: { order: 'asc' } }),
  ])

  const data = {
    settings: settingsRows.map((s) => ({ key: s.key, value: s.value })),
    projects: projectRows.map((p) => ({
      title: p.title,
      description: p.description,
      tech: JSON.parse(p.tech) as string[],
      bullets: JSON.parse(p.bullets) as string[],
      screenshots: JSON.parse(p.screenshots) as string[],
      startDate: p.startDate,
      endDate: p.endDate,
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl,
      visible: p.visible,
      order: p.order,
    })),
    experience: experienceRows.map((e) => ({
      title: e.title,
      company: e.company,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: JSON.parse(e.bullets) as string[],
      gpa: e.gpa,
      minor: e.minor,
      type: e.type,
      visible: e.visible,
      order: e.order,
    })),
    skills: skillRows.map((s) => ({ name: s.name, category: s.category, visible: s.visible, order: s.order })),
    customSections: sectionRows.map((c) => ({
      label: c.label,
      heading: c.heading,
      body: c.body,
      visible: c.visible,
      order: c.order,
    })),
  }

  writeFileSync(outfile, JSON.stringify(data, null, 2))
  console.error(
    `✓ Wrote ${outfile}: ${data.settings.length} settings, ${data.projects.length} projects, ` +
      `${data.experience.length} experience, ${data.skills.length} skills, ${data.customSections.length} sections`
  )
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

import { prisma } from './db'

export async function getProjects() {
  const rows = await prisma.project.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  return rows.map((p) => ({
    ...p,
    tech: JSON.parse(p.tech) as string[],
    bullets: JSON.parse(p.bullets) as string[],
    screenshots: JSON.parse(p.screenshots) as string[],
  }))
}

export async function getAllProjects() {
  const rows = await prisma.project.findMany({ orderBy: { order: 'asc' } })
  return rows.map((p) => ({
    ...p,
    tech: JSON.parse(p.tech) as string[],
    bullets: JSON.parse(p.bullets) as string[],
    screenshots: JSON.parse(p.screenshots) as string[],
  }))
}

export async function getExperience() {
  const rows = await prisma.experience.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  return rows.map((e) => ({
    ...e,
    bullets: JSON.parse(e.bullets) as string[],
  }))
}

export async function getAllExperience() {
  const rows = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  return rows.map((e) => ({
    ...e,
    bullets: JSON.parse(e.bullets) as string[],
  }))
}

export async function getSkills() {
  return prisma.skill.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
}

export async function getAllSkills() {
  return prisma.skill.findMany({ orderBy: { order: 'asc' } })
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany()
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export type ParsedProject = Awaited<ReturnType<typeof getProjects>>[number]
export type ParsedExperience = Awaited<ReturnType<typeof getExperience>>[number]
export type ParsedSkill = Awaited<ReturnType<typeof getSkills>>[number]

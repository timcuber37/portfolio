import 'dotenv/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const adapter = new PrismaLibSql({ url })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  // Clear existing data
  await prisma.contactMessage.deleteMany()
  await prisma.analyticsEvent.deleteMany()
  await prisma.project.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.siteSetting.deleteMany()

  // Site settings
  const settings = [
    { key: 'name', value: 'Timothy Yang' },
    { key: 'tagline', value: 'Full Stack Software Engineer' },
    {
      key: 'bio',
      value:
        "I'm a full-stack software engineer and Computer Science graduate student at Southern Connecticut State University. I build production-grade applications across AI, distributed systems, cloud, and high-performance graphics — from an AI tool that translates natural language into SQL over millions of rows, to an event-driven CQRS platform on Kafka and Cassandra, to real-time GPU black hole simulations. I care about clean architecture, scalable data systems, and shipping software that works.",
    },
    { key: 'email', value: 'timcuber37@gmail.com' },
    { key: 'github', value: 'https://github.com/timcuber37' },
    { key: 'linkedin', value: 'https://linkedin.com/in/timyang37' },
    { key: 'phone', value: '475-238-2704' },
    // Editable section copy (also editable via the admin Content panel).
    { key: 'heroRoles', value: "Full Stack Software Engineer\nCS Graduate Student\nRubik's Cube Competitor" },
    { key: 'aboutHeading', value: 'A little about me' },
    {
      key: 'aboutPara2',
      value:
        'My experience spans cloud infrastructure, AI-powered tools, and high-performance graphics — from deploying containerized apps on Fly.io and AWS to engineering GLSL shaders for real-time black hole simulations.',
    },
    {
      key: 'aboutPara3',
      value:
        "Outside of code, I compete in Rubik's Cube events and am ranked in the top 100 in the United States for 3×3 average time through the World Cube Association.",
    },
    { key: 'projectsHeading', value: "Things I've built" },
    { key: 'skillsHeading', value: 'Technologies I work with' },
    { key: 'experienceHeading', value: 'Work & Education' },
    { key: 'beyondHeading', value: 'Life outside the editor' },
    { key: 'beyondIntro', value: "What I get up to when I'm not building software." },
    {
      key: 'beyondCubingDesc',
      value:
        'Ranked top 100 in the United States for 3×3 average through the World Cube Association. I compete at official events and share solves and tutorials on YouTube.',
    },
    { key: 'beyondKoreanTitle', value: 'Korean Club Co-Founder' },
    {
      key: 'beyondKoreanDesc',
      value:
        'Co-founded and serve as Vice President of the SCSU Korean Club, organizing cultural events and building a welcoming community on campus.',
    },
    { key: 'youtubeUrl', value: 'https://www.youtube.com/@timcuber37' },
    { key: 'wcaUrl', value: 'https://www.worldcubeassociation.org/persons/2019YANT03' },
    { key: 'contactHeading', value: 'Get in touch' },
    {
      key: 'contactIntro',
      value: "Have a question, opportunity, or just want to say hello? Drop me a message and I'll get back to you.",
    },
  ]
  for (const s of settings) {
    await prisma.siteSetting.create({ data: s })
  }

  // Projects
  await prisma.project.createMany({
    data: [
      {
        title: 'SpeedCubeMuse',
        description:
          'A full-stack AI web application that translates natural language questions into SQL queries against a 6.3M+ row WCA competition database, reducing the barrier to data access for non-technical users.',
        tech: JSON.stringify([
          'Python',
          'Flask',
          'Claude',
          'TiDB Serverless',
          'Supabase',
          'Docker',
          'Fly.io',
          'Voyage AI',
          'pgvector',
          'GitHub Actions',
          'pytest',
          'Discord',
        ]),
        bullets: JSON.stringify([
          'Built a natural language query interface for 6.3M+ WCA competition records by integrating Claude AI to translate plain-English questions into validated, read-only SQL, enabling non-technical users to query a complex relational database without writing code',
          'Developed a Retrieval-Augmented Generation chatbot for WCA regulation lookups by implementing a semantic search pipeline with Voyage AI embeddings, pgvector similarity search, and a reranker over 697 regulations, producing grounded answers with direct citations to official documentation',
          "Reduced manual database maintenance from a 4-step process to a single command by writing an automated pipeline that fetches the WCA export API, streams and parses multi-GB TSV/SQL zips, bulk-loads all tables into TiDB Serverless, and patches the live site's stat cards and export date automatically",
          'Hardened the application against injection and abuse by implementing a strict Content-Security-Policy, per-endpoint rate limiting with authenticated-user exemptions, and SQL query validation that rejects any non-SELECT statements before execution',
          'Deployed a multi-process Docker container serving both the web app and Discord bot by configuring supervisord with per-process log routing, integrated into a GitHub Actions CI/CD pipeline that automatically deploys to Fly.io on every push to main',
          'Validated database integrity after each data load by building an 89-test pytest suite covering row count minimums, referential integrity, WCA ID format correctness, cross-table consistency, and known world record spot-checks against live TiDB',
        ]),
        screenshots: JSON.stringify([
          '/screenshots/scm1.png',
          '/screenshots/scm2.png',
          '/screenshots/scm3.png',
        ]),
        startDate: 'Jan 2026',
        endDate: null,
        githubUrl: null,
        liveUrl: 'https://speedcubemuse.fly.dev/',
        visible: true,
        order: 0,
      },
      {
        title: 'Black Hole Sim',
        description:
          'A full-stack user platform featuring real-time ray-marching black hole simulations with save/load functionality, authentication, and an educational content system covering 20+ astrophysics topics.',
        tech: JSON.stringify(['C++', 'GLSL', 'TypeScript', 'React', 'Node', 'Express', 'PostgreSQL', 'AWS']),
        bullets: JSON.stringify([
          'Built a full-stack platform with React + Vite frontend and Express 5 REST API backed by Supabase PostgreSQL with JWT auth.',
          'Deployed production-grade app via AWS Amplify hosting and CloudFront CDN, with backend on Elastic Beanstalk.',
          'Engineered performance-critical GLSL ray-marching shaders with adaptive step sizing achieving interactive real-time frame rates.',
          'Developed educational content system covering 20+ astrophysics topics with NASA imagery integration.',
        ]),
        screenshots: JSON.stringify([
          '/screenshots/bhs1.png',
          '/screenshots/bhs2.png',
          '/screenshots/bhs3.png',
        ]),
        startDate: 'Sep 2025',
        endDate: 'Dec 2025',
        githubUrl: 'https://github.com/Adrian1131/blackhole-sim-v2',
        liveUrl: null,
        visible: true,
        order: 3,
      },
      {
        title: 'Poke-Collect',
        description:
          'A Pokémon TCG collection manager built on a CQRS architecture with a distributed Python/Flask backend, real-time TCGPlayer price enrichment, and event-driven Kafka consumers projecting into denormalized Cassandra read models.',
        tech: JSON.stringify(['Python', 'Flask', 'MySQL', 'Cassandra', 'PostgreSQL', 'Kafka']),
        bullets: JSON.stringify([
          'Built a Pokémon TCG collection manager on a CQRS architecture using Python/Flask, MySQL (writes), Apache Cassandra (read models), PostgreSQL + pgvector (vector search), and Apache Kafka as the event bus.',
          'Engineered a rate-limit-aware sync service pulling 146 Pokémon TCG sets from the PokéWallet REST API, writing idempotent upserts to Cassandra and PostgreSQL within a 100 req/hour budget.',
          'Built event-driven Kafka consumers projecting write-side events into denormalized Cassandra read models, enabling JOIN-free collection queries across 4 cooperating distributed Python processes.',
          'Designed lazy TCGPlayer price enrichment that fetches live prices on collection add and caches them via COALESCE upserts, surfacing per-card and total portfolio value in the Jinja2 UI.',
        ]),
        screenshots: JSON.stringify([
          '/screenshots/pc1.png',
          '/screenshots/pc2.png',
          '/screenshots/pc3.png',
        ]),
        startDate: 'Mar 2026',
        endDate: null,
        githubUrl: 'https://github.com/timcuber37/poke-collect',
        liveUrl: null,
        visible: true,
        order: 1,
      },
      {
        title: 'Developer Portfolio',
        description:
          "A full-stack portfolio platform with a session-authenticated headless CMS, a custom visitor-analytics dashboard, and an interactive animated UI — the site you're currently viewing.",
        tech: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind CSS', 'Framer Motion']),
        bullets: JSON.stringify([
          'Built a full-stack site on Next.js 16 (App Router) and React 19 in TypeScript, with server components reading from a Prisma-managed SQLite database via a libSQL adapter.',
          'Implemented a session-authenticated admin CMS with REST route handlers for live CRUD of projects, skills, experience, and settings — content updates require no redeploys.',
          'Engineered a custom analytics pipeline that persists page views and visitor geo data, surfaced in an admin dashboard built with Recharts.',
          "Designed an interactive, themeable UI in Framer Motion: parallax cursor-reactive geometry, 3D-tilt project cards, an image lightbox, and a draggable Rubik's-cube motif.",
          'Added a validated contact pipeline (form to API route to persisted messages) and middleware-based protection for the admin area.',
        ]),
        screenshots: JSON.stringify(['/screenshots/por1.png', '/screenshots/por2.png']),
        startDate: 'May 2026',
        endDate: null,
        githubUrl: 'https://github.com/timcuber37/portfolio',
        liveUrl: null,
        visible: true,
        order: 2,
      },
    ],
  })

  // Experience — work
  await prisma.experience.createMany({
    data: [
      {
        title: 'AV/TV Technician',
        company: 'Southern Connecticut State University',
        location: 'New Haven, CT',
        startDate: 'Apr 2026',
        endDate: null,
        bullets: JSON.stringify([
          'Diagnosed and resolved 5–10 daily AV service tickets, troubleshooting projectors, speakers, and control systems.',
          'Maintained equipment reliability by conducting regular maintenance on AV systems across 50+ classrooms.',
          'Collaborated with IT staff to coordinate AV infrastructure troubleshooting, reducing repeat incidents.',
        ]),
        type: 'work',
        visible: true,
        order: 0,
      },
      {
        title: 'Information Technology Intern',
        company: 'Connex Credit Union',
        location: 'North Haven, CT',
        startDate: 'May 2023',
        endDate: 'Aug 2023',
        bullets: JSON.stringify([
          'Provided helpdesk support resolving 5–10 tickets daily across hardware, software, and network issues.',
          'Collaborated with 5-person IT team to resolve technical issues across 6 branches, supporting 100+ employees.',
          'Imaged and deployed 50+ workstations using Acronis across office desktop towers and laptops.',
        ]),
        type: 'work',
        visible: true,
        order: 1,
      },
      // Education
      {
        title: 'Master of Science in Computer Science',
        company: 'Southern Connecticut State University',
        location: 'New Haven, CT',
        startDate: 'Jan 2026',
        endDate: 'Dec 2027',
        bullets: JSON.stringify([]),
        type: 'education',
        visible: true,
        order: 2,
      },
      {
        title: 'Bachelor of Science in Computer Science',
        company: 'Southern Connecticut State University',
        location: 'New Haven, CT',
        startDate: 'Jan 2024',
        endDate: 'Dec 2025',
        bullets: JSON.stringify(['Minor in Mathematics']),
        type: 'education',
        visible: true,
        order: 3,
      },
      {
        title: 'Rensselaer Polytechnic Institute',
        company: 'RPI',
        location: 'Troy, NY',
        startDate: 'Aug 2020',
        endDate: 'Dec 2023',
        bullets: JSON.stringify([]),
        type: 'education',
        visible: true,
        order: 4,
      },
    ],
  })

  // Skills
  const skillData = [
    // Languages
    { name: 'Python', category: 'Languages', order: 0 },
    { name: 'TypeScript', category: 'Languages', order: 1 },
    { name: 'JavaScript', category: 'Languages', order: 2 },
    { name: 'Java', category: 'Languages', order: 3 },
    { name: 'C/C++', category: 'Languages', order: 4 },
    { name: 'SQL', category: 'Languages', order: 5 },
    { name: 'HTML/CSS', category: 'Languages', order: 6 },
    { name: 'Haskell', category: 'Languages', order: 7 },
    // Frameworks
    { name: 'React', category: 'Frameworks', order: 8 },
    { name: 'Next.js', category: 'Frameworks', order: 9 },
    { name: 'Node.js', category: 'Frameworks', order: 10 },
    { name: 'Flask', category: 'Frameworks', order: 11 },
    { name: 'Spring', category: 'Frameworks', order: 12 },
    { name: 'TensorFlow', category: 'Frameworks', order: 13 },
    { name: 'NumPy', category: 'Frameworks', order: 14 },
    // Tools & Cloud
    { name: 'Docker', category: 'Tools & Cloud', order: 15 },
    { name: 'AWS', category: 'Tools & Cloud', order: 16 },
    { name: 'GCP', category: 'Tools & Cloud', order: 17 },
    { name: 'Fly.io', category: 'Tools & Cloud', order: 18 },
    { name: 'Supabase', category: 'Tools & Cloud', order: 19 },
    { name: 'TiDB', category: 'Tools & Cloud', order: 20 },
    { name: 'Git/GitHub', category: 'Tools & Cloud', order: 21 },
    { name: 'Linux', category: 'Tools & Cloud', order: 22 },
    // Practices
    { name: 'Machine Learning', category: 'Practices', order: 23 },
    { name: 'DevOps', category: 'Practices', order: 24 },
    { name: 'Agile/Scrum', category: 'Practices', order: 25 },
    { name: 'OOP', category: 'Practices', order: 26 },
    { name: 'Unit Testing', category: 'Practices', order: 27 },
    { name: 'CUDA', category: 'Practices', order: 28 },
  ]

  await prisma.skill.createMany({
    data: skillData.map((s) => ({ ...s, visible: true })),
  })

  console.log('✓ Database seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

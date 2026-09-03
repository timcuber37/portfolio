import { config } from 'dotenv'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'

// Regenerated from PRODUCTION data via scripts/export-content.ts.
// Three edits applied on top of the prod snapshot:
//   1. MyndHaven experience moved to lead the Work column (order 0).
//   2. bio updated to mention the current MyndHaven internship.
//   3. Cubing Companion added at order 0, pushing the other projects down one.
// Array columns (tech/bullets/screenshots) are stored as JSON strings.
// `screenshots` is the project media list: images, self-hosted video files, and
// YouTube URLs in one array — see src/lib/media.ts for how each kind is detected.

// Load env like Next.js: real shell env wins, then .env.local, then .env.
config({ path: '.env.local' })
config({ path: '.env' })

const url = process.env.DATABASE_URL ?? 'file:./dev.db'
const authToken = process.env.DATABASE_AUTH_TOKEN
const adapter = new PrismaLibSql(authToken ? { url, authToken } : { url })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

const settings = [
  {
    "key": "name",
    "value": "Timothy Yang"
  },
  {
    "key": "tagline",
    "value": "Full Stack Software Engineer"
  },
  {
    "key": "bio",
    "value": "I'm Tim, a full-stack software engineer and Computer Science graduate student at Southern Connecticut State University. Right now I'm a software engineer intern at MyndHaven, building the backend authentication and cloud infrastructure for a mental-wellness platform. I'm drawn to problems without an obvious answer: translating plain-English questions into SQL across millions of rows, coordinating event-driven services on Kafka and Cassandra, or rendering real-time black holes on the GPU. Across all of it, I care about clean architecture, scalable data, and building software that genuinely works."
  },
  {
    "key": "email",
    "value": ""
  },
  {
    "key": "github",
    "value": "https://github.com/timcuber37"
  },
  {
    "key": "linkedin",
    "value": "https://linkedin.com/in/timyang37"
  },
  {
    "key": "phone",
    "value": ""
  },
  {
    "key": "heroRoles",
    "value": "Full Stack Software Engineer\nCS Graduate Student\nRubik's Cube Competitor"
  },
  {
    "key": "aboutHeading",
    "value": "A little about me"
  },
  {
    "key": "aboutPara2",
    "value": "My stack is broad because my curiosity is. I reach for Python and Flask for AI and distributed back ends, TypeScript with React and Next.js on the front end, and SQL across PostgreSQL, MySQL, Cassandra, and TiDB to back it all. I like owning the whole lifecycle: designing data models, building RAG and ML pipelines, containerizing with Docker, and deploying to AWS, Fly.io, and Vercel."
  },
  {
    "key": "aboutPara3",
    "value": "My obsession with solving things started with a Rubik's cube. I compete through the World Cube Association, rank in the top 100 in the U.S. for 3×3 and Megaminx, and break down solves on my YouTube channel — the same methodical, split-it-into-steps mindset I bring to every project. Away from the keyboard, I co-founded and serve as Vice President of my university's Korean Club. I'm always chasing the next hard, interesting thing to build and the next problem to solve."
  },
  {
    "key": "projectsHeading",
    "value": "Things I've built"
  },
  {
    "key": "skillsHeading",
    "value": "Technologies I work with"
  },
  {
    "key": "experienceHeading",
    "value": "Work & Education"
  },
  {
    "key": "beyondHeading",
    "value": "Life outside the editor"
  },
  {
    "key": "beyondIntro",
    "value": ""
  },
  {
    "key": "beyondCubingDesc",
    "value": "I am a competitive Rubik's Cube Speedsolver and have been competing in WCA competitions since 2019. I am currently ranked top 100 in the US in both 3x3 and Megaminx. "
  },
  {
    "key": "beyondKoreanTitle",
    "value": "Korean Club Co-Founder"
  },
  {
    "key": "beyondKoreanDesc",
    "value": "I Co-founded and served as Vice President of the SCSU Korean Club, organizing cultural events and building a welcoming community on campus."
  },
  {
    "key": "youtubeUrl",
    "value": "https://www.youtube.com/@timcuber37"
  },
  {
    "key": "wcaUrl",
    "value": "https://www.worldcubeassociation.org/persons/2019YANT03"
  },
  {
    "key": "contactHeading",
    "value": "Get in touch"
  },
  {
    "key": "contactIntro",
    "value": "Have a question, opportunity, or just want to say hello? Drop me a message and I'll get back to you."
  }
]

const projects = [
  {
    "title": "Cubing Companion",
    "description": "A speedcubing analysis app that syncs a Bluetooth smart cube over Web Bluetooth, segments each solve into CFOP phases, and diffs every decision against a PyTorch imitation-learning ranker trained on 9,865 world-class competition solves and served in-browser with ONNX Runtime Web.",
    "tech": "[\"TypeScript\",\"Python\",\"PyTorch\",\"ONNX Runtime Web\",\"Next.js\",\"React\",\"Web Bluetooth\",\"Web Workers\",\"IndexedDB\",\"Tailwind CSS\",\"Vitest\",\"GitHub Actions\"]",
    "bullets": "[\"Trained a PyTorch listwise ranking model on 15,607 decision points mined from 9,865 reconstructed competition solves that predicts which F2L pair a world-class solver fills next with 69.5% accuracy against a 58.7% fewest-moves baseline, held out by solver so no per-solver habit could leak.\",\"Deployed the trained models to the browser via ONNX Runtime Web in a Web Worker for zero-cost, offline-capable inference, with a self-test page that re-scores held-out fixtures through the shipped loader to catch feature-order drift between training and serving.\",\"Built a rate-limited, resumable crawler and parsing pipeline that turned 13,087 scraped community solve reconstructions into a corpus of 9,865 engine-verified CFOP solves, rejecting 2,910 by solving method or event and 164 whose moves provably do not solve the cube.\",\"Implemented the candidate enumerators the model trains against: an exhaustive BFS over all 190,080 cross positions giving exact optimal distances, and an IDA* search for pair insertion under a max-of-admissible-lower-bounds heuristic, validated against 7,725 real crosses and 1,482 real insertions with zero violations.\",\"Built a state-predicate segmenter that splits a solve into CFOP phases for any cross color, achieving 97.1% agreement with 5,475 human-labelled reconstructions and validated independently by reproducing the corpus's xcross rate to within 1.6 points from a completely different signal.\",\"Integrated a GAN Bluetooth smart cube over Web Bluetooth, recovering per-move timing from a lossy, batched BLE stream by least-squares fitting the cube's clock onto the host's, with a test pinning the fit as two orders of magnitude better than a fixed offset over 100 moves at 2% clock skew.\",\"Built the differentiating feature on top of the ranker: at each decision point it compares the user's choice against the model's and explains the gap by counterfactual attribution, substituting one feature value at a time and re-scoring to find which difference actually moved the decision.\",\"Architected a 9-package TypeScript monorepo around one rule (analysis code may never import the hardware adapter) so the smart cube is one input among several and the entire 543-test suite runs in CI in under 4 seconds with no hardware.\"]",
    "screenshots": "[]",
    "startDate": "Aug 2026",
    "endDate": null,
    "githubUrl": "https://github.com/timcuber37/cubing-companion",
    "liveUrl": null,
    "visible": true,
    "order": 0
  },
  {
    "title": "TCG-Tracker",
    "description": "A TCG collection manager built on a CQRS architecture with a distributed Java/Spring Boot backend, real-time TCGPlayer price enrichment, and event-driven Kafka consumers projecting into denormalized Cassandra read models.",
    "tech": "[\"Java\",\"Spring Boot\",\"React\",\"TypeScript\",\"MySQL\",\"Cassandra\",\"PostgreSQL\",\"Kafka\",\"Supabase\",\"Docker\",\"nginx\",\"CQRS\"]",
    "bullets": "[\"Architected a TCG collection manager on a CQRS design with Java 23 / Spring Boot 4, separating writes (MySQL/JPA) from reads (Apache Cassandra) via an Apache Kafka event bus across web, consumer, and sync roles.\",\"Built a stateless REST API secured as an OAuth2 resource server, validating Supabase-issued ES256 JWTs against a JWKS endpoint so the React client authenticates directly with zero password handling server-side.\",\"Engineered a three-datasource Spring backend — MySQL (JPA), Supabase PostgreSQL (JdbcTemplate catalog search over 7K+ cards), and Cassandra (Spring Data) — coexisting in one application context.\",\"Developed a React 19 + TypeScript (Vite) SPA with client-side Supabase auth, paginated search, live-priced collection management, and a reusable component architecture consuming the typed API.\",\"Implemented event-driven projection with a Spring @KafkaListener consumer materializing collection_by_user read models, keeping JSON event schemas wire-compatible across a Python→Java migration.\",\"Integrated a rate-limited PokéWallet client (RestClient) for live TCGPlayer pricing and image proxying with disk caching, plus a @Scheduled daily catalog sync respecting a 100 req/hour free-tier budget.\",\"Containerized the full stack with Docker Compose — one Spring image run as three profile-driven services behind an nginx-served SPA — provisioning MySQL, Cassandra, and Kafka with health-gated startup ordering.\",\"Migrated a production Python/Flask app to Java/Spring + React across six verified phases, preserving the distributed architecture while adding type-safe REST contracts and a decoupled SPA frontend.\",\"Tested the CQRS core with Spock/Groovy and JUnit specs covering write-side persistence, event publishing, Kafka→Cassandra projection routing, and a @WebMvcTest slice asserting JWT-protected endpoint behavior.\",\"Instrumented the service with Micrometer → InfluxDB and Grafana, exposing command and projection counters plus price-fetch and catalog-search latency timers (p95) tagged by service role on a Docker-verified dashboard.\",\"Built a polyglot-persistence backend across MySQL (JPA), Supabase Postgres (catalog search over 7K+ cards), and Cassandra, using denormalized read models for JOIN-free, single-partition lookups.\"]",
    "screenshots": "[\"/screenshots/pc1.png\",\"/screenshots/pc2.png\",\"/screenshots/pc3.png\",\"https://www.youtube.com/watch?v=FJ0DFkJ_M2o\",\"https://www.youtube.com/watch?v=p74vQ9VKnpg\"]",
    "startDate": "Mar 2026",
    "endDate": null,
    "githubUrl": "https://github.com/timcuber37/tcg-tracker",
    "liveUrl": null,
    "visible": true,
    "order": 1
  },
  {
    "title": "SpeedCubeMuse",
    "description": "A full-stack AI web application that translates natural language questions into SQL queries against a 6.3M+ row WCA competition database, reducing the barrier to data access for non-technical users.",
    "tech": "[\"Python\",\"Flask\",\"Claude\",\"TiDB Serverless\",\"Supabase\",\"Docker\",\"Fly.io\",\"Voyage AI\",\"pgvector\",\"GitHub Actions\",\"pytest\",\"Discord\"]",
    "bullets": "[\"Built a natural language query interface for 6.3M+ WCA competition records by integrating Claude AI to translate plain-English questions into validated, read-only SQL, enabling non-technical users to query a complex relational database without writing code\",\"Developed a Retrieval-Augmented Generation chatbot for WCA regulation lookups by implementing a semantic search pipeline with Voyage AI embeddings, pgvector similarity search, and a reranker over 697 regulations, producing grounded answers with direct citations to official documentation\",\"Reduced manual database maintenance from a 4-step process to a single command by writing an automated pipeline that fetches the WCA export API, streams and parses multi-GB TSV/SQL zips, bulk-loads all tables into TiDB Serverless, and patches the live site's stat cards and export date automatically\",\"Hardened the application against injection and abuse by implementing a strict Content-Security-Policy, per-endpoint rate limiting with authenticated-user exemptions, and SQL query validation that rejects any non-SELECT statements before execution\",\"Deployed a multi-process Docker container serving both the web app and Discord bot by configuring supervisord with per-process log routing, integrated into a GitHub Actions CI/CD pipeline that automatically deploys to Fly.io on every push to main\",\"Validated database integrity after each data load by building an 89-test pytest suite covering row count minimums, referential integrity, WCA ID format correctness, cross-table consistency, and known world record spot-checks against live TiDB\"]",
    "screenshots": "[\"/screenshots/scm1.png\",\"/screenshots/scm2.png\",\"/screenshots/scm3.png\"]",
    "startDate": "Jan 2026",
    "endDate": null,
    "githubUrl": null,
    "liveUrl": "https://speedcubemuse.fly.dev/",
    "visible": true,
    "order": 2
  },
  {
    "title": "Developer Portfolio",
    "description": "A full-stack portfolio platform with a session-authenticated headless CMS, a custom visitor-analytics dashboard, and an interactive animated UI — the site you're currently viewing.",
    "tech": "[\"Next.js\",\"React\",\"TypeScript\",\"Prisma\",\"SQLite\",\"Tailwind CSS\",\"Framer Motion\",\"Anthropic Claude\",\"Turso\",\"Recharts\",\"Vercel\"]",
    "bullets": "[\"Built a full-stack portfolio with a session-authenticated headless CMS on Next.js 16 (App Router) and React 19 in TypeScript, deployed on Vercel with a hosted Turso (libSQL) database through the Prisma driver adapter.\",\"Integrated the Anthropic Claude API to auto-draft project entries from a selected GitHub repo's README and to rewrite existing copy from natural-language instructions, using prompt caching and adaptive thinking.\",\"Designed an interactive, themeable UI in Framer Motion — a self-scrambling-and-solving CSS-3D Rubik's cube driven by rotation-matrix layer turns, cursor-reactive parallax geometry, 3D-tilt project cards, and an image lightbox.\",\"Implemented an admin dashboard with REST route handlers for live CRUD of projects, experience, skills, and all section copy — every piece of site text is editable with no redeploy.\",\"Engineered a custom visitor-analytics pipeline (page views, résumé downloads, contact messages) with country detection from platform geo headers, surfaced in a Recharts dashboard.\",\"Secured the admin area with edge-middleware token auth and a validated contact pipeline (form → API route → persisted messages).\"]",
    "screenshots": "[\"/screenshots/por1.png\",\"/screenshots/por2.png\",\"/screenshots/por3.png\"]",
    "startDate": "May 2026",
    "endDate": null,
    "githubUrl": "https://github.com/timcuber37/portfolio",
    "liveUrl": "timothyyang.vercel.app",
    "visible": true,
    "order": 3
  },
  {
    "title": "Black Hole Sim",
    "description": "A full-stack user platform featuring real-time ray-marching black hole simulations with save/load functionality, authentication, and an educational content system covering 20+ astrophysics topics.",
    "tech": "[\"GLSL\",\"TypeScript\",\"React\",\"Node\",\"Express\",\"PostgreSQL\",\"AWS\"]",
    "bullets": "[\"Built a full-stack platform with React + Vite frontend and Express 5 REST API backed by Supabase PostgreSQL with JWT auth.\",\"Deployed production-grade app via AWS Amplify hosting and CloudFront CDN, with backend on Elastic Beanstalk.\",\"Engineered performance-critical GLSL ray-marching shaders with adaptive step sizing achieving interactive real-time frame rates.\",\"Developed educational content system covering 20+ astrophysics topics with NASA imagery integration.\"]",
    "screenshots": "[\"/screenshots/bhs1.png\",\"/screenshots/bhs2.png\",\"/screenshots/bhs3.png\"]",
    "startDate": "Sep 2025",
    "endDate": "Dec 2025",
    "githubUrl": "https://github.com/Adrian1131/blackhole-sim-v2",
    "liveUrl": null,
    "visible": true,
    "order": 4
  }
]

const experience = [
  {
    "title": "Software Engineer Intern",
    "company": "MyndHaven",
    "location": "Remote",
    "startDate": "Jun 2026",
    "endDate": null,
    "bullets": "[\"Shipped a provider-agnostic OAuth 2.0 / OpenID Connect layer in Go, adding Google, Apple, and Facebook Sign-In across the iOS app and Next.js dashboard with PKCE and verified account linking.\",\"Integrated the Next.js/React therapist dashboard with the Go microservices backend through an authenticating API gateway, using role-based JWT claims and httpOnly cookie sessions with single-flight refresh.\",\"Built a keyless CI/CD pipeline (GitHub Actions → Workload Identity Federation → GCP Cloud Run) deploying four Go microservices, reaching private, IAM-gated services via Google-signed ID tokens.\",\"Hardened session security with bounded dashboard sessions (15-minute access, 8-hour absolute) and a constant-time-verified, server-only client credential guarding dashboard-token issuance.\"]",
    "type": "work",
    "visible": true,
    "order": 0
  },
  {
    "title": "AV/IT Technician",
    "company": "Southern Connecticut State University",
    "location": "New Haven, CT",
    "startDate": "Apr 2026",
    "endDate": null,
    "bullets": "[\"Diagnosed and resolved 5–10 daily AV service tickets, troubleshooting projectors, speakers, and control systems.\",\"Maintained equipment reliability by conducting regular maintenance on AV systems across 50+ classrooms.\",\"Collaborated with IT staff to coordinate AV infrastructure troubleshooting, reducing repeat incidents.\",\"Created a dynamic visual dashboard using PowerBI and VBScript to monitor classroom and student usage hours.\"]",
    "type": "work",
    "visible": true,
    "order": 1
  },
  {
    "title": "Information Technology Intern",
    "company": "Connex Credit Union",
    "location": "North Haven, CT",
    "startDate": "May 2023",
    "endDate": "Aug 2023",
    "bullets": "[\"Provided helpdesk support resolving 5–10 tickets daily across hardware, software, and network issues.\",\"Collaborated with 5-person IT team to resolve technical issues across 6 branches, supporting 100+ employees.\",\"Imaged and deployed 50+ workstations using Acronis across office desktop towers and laptops.\"]",
    "type": "work",
    "visible": true,
    "order": 2
  },
  {
    "title": "Master of Science in Computer Science",
    "company": "Southern Connecticut State University",
    "location": "New Haven, CT",
    "startDate": "Jan 2026",
    "endDate": "Dec 2027",
    "bullets": "[]",
    "type": "education",
    "visible": true,
    "order": 3
  },
  {
    "title": "Bachelor of Science in Computer Science",
    "company": "Southern Connecticut State University",
    "location": "New Haven, CT",
    "startDate": "Jan 2024",
    "endDate": "Dec 2025",
    "bullets": "[\"Minor in Mathematics\"]",
    "type": "education",
    "visible": true,
    "order": 4
  },
  {
    "title": "Rensselaer Polytechnic Institute",
    "company": "RPI",
    "location": "Troy, NY",
    "startDate": "Aug 2020",
    "endDate": "Dec 2023",
    "bullets": "[]",
    "type": "education",
    "visible": true,
    "order": 5
  }
]

const skills = [
  {
    "name": "Python",
    "category": "Languages",
    "visible": true,
    "order": 0
  },
  {
    "name": "TypeScript",
    "category": "Languages",
    "visible": true,
    "order": 1
  },
  {
    "name": "JavaScript",
    "category": "Languages",
    "visible": true,
    "order": 2
  },
  {
    "name": "Java",
    "category": "Languages",
    "visible": true,
    "order": 3
  },
  {
    "name": "C/C++",
    "category": "Languages",
    "visible": true,
    "order": 4
  },
  {
    "name": "SQL",
    "category": "Languages",
    "visible": true,
    "order": 5
  },
  {
    "name": "HTML/CSS",
    "category": "Languages",
    "visible": true,
    "order": 6
  },
  {
    "name": "Haskell",
    "category": "Languages",
    "visible": true,
    "order": 7
  },
  {
    "name": "React",
    "category": "Frameworks",
    "visible": true,
    "order": 8
  },
  {
    "name": "Next.js",
    "category": "Frameworks",
    "visible": true,
    "order": 9
  },
  {
    "name": "Node.js",
    "category": "Frameworks",
    "visible": true,
    "order": 10
  },
  {
    "name": "Flask",
    "category": "Frameworks",
    "visible": true,
    "order": 11
  },
  {
    "name": "Spring",
    "category": "Frameworks",
    "visible": true,
    "order": 12
  },
  {
    "name": "TensorFlow",
    "category": "Frameworks",
    "visible": true,
    "order": 13
  },
  {
    "name": "NumPy",
    "category": "Frameworks",
    "visible": true,
    "order": 14
  },
  {
    "name": "Docker",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 15
  },
  {
    "name": "AWS",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 16
  },
  {
    "name": "GCP",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 17
  },
  {
    "name": "Fly.io",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 18
  },
  {
    "name": "Supabase",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 19
  },
  {
    "name": "TiDB",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 20
  },
  {
    "name": "Git/GitHub",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 21
  },
  {
    "name": "Linux",
    "category": "Tools & Cloud",
    "visible": true,
    "order": 22
  },
  {
    "name": "Machine Learning",
    "category": "Practices",
    "visible": true,
    "order": 23
  },
  {
    "name": "DevOps",
    "category": "Practices",
    "visible": true,
    "order": 24
  },
  {
    "name": "Agile/Scrum",
    "category": "Practices",
    "visible": true,
    "order": 25
  },
  {
    "name": "OOP",
    "category": "Practices",
    "visible": true,
    "order": 26
  },
  {
    "name": "Unit Testing",
    "category": "Practices",
    "visible": true,
    "order": 27
  },
  {
    "name": "CUDA",
    "category": "Practices",
    "visible": true,
    "order": 28
  }
]

async function main() {
  // Clear existing data
  await prisma.contactMessage.deleteMany()
  await prisma.analyticsEvent.deleteMany()
  await prisma.project.deleteMany()
  await prisma.experience.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.siteSetting.deleteMany()

  await prisma.siteSetting.createMany({ data: settings })
  await prisma.project.createMany({ data: projects })
  await prisma.experience.createMany({ data: experience })
  await prisma.skill.createMany({ data: skills })

  console.log('✓ Database seeded successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

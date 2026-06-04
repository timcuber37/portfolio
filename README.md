# Timothy Yang — Portfolio

A full-stack developer portfolio with an authenticated headless CMS, visitor analytics, AI-assisted content tools, and an animated Rubik's-cube-themed UI. Built with Next.js 16 (App Router) and React 19.

**Live site:** the public page renders projects, skills, experience, an extracurriculars section, and a contact form. **`/admin`** is a password-protected dashboard for managing all of it without redeploys.

## Features

- **Editable content via the admin panel** — projects, skills, experience, and all section copy (Hero roles, About paragraphs, section headings, Beyond cards, Contact text) are stored in the database and edited at `/admin`. No code changes or redeploys needed.
- **GitHub project importer** — select repositories and let Claude draft a title, description, résumé-style bullets, and tech list from each repo's README.
- **Refine with AI** — rewrite any existing project's copy from a plain-English instruction (e.g. "make the bullets more concise").
- **Visitor analytics** — page views, résumé downloads, and contact messages, with country breakdown (via platform geo headers, falling back to IP lookup), shown on an admin dashboard.
- **Interactive UI** — a CSS-3D Rubik's cube that scrambles and solves itself, cursor-reactive parallax geometry, 3D-tilt project cards, an image lightbox, and a draggable cube cluster. Respects `prefers-reduced-motion`.

## Tech stack

- **Framework:** Next.js 16 (App Router, route handlers, middleware) · React 19 · TypeScript
- **Styling / animation:** Tailwind CSS 4 · Framer Motion
- **Data:** Prisma 7 with SQLite via the libSQL adapter (`@prisma/adapter-libsql`)
- **Charts:** Recharts (admin analytics)
- **AI:** Anthropic SDK (`claude-opus-4-8`) for the importer and refine tools

## Getting started

Requires Node.js 20+.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local      # then edit the values

# 3. Create the database schema and seed content
npx prisma db push
npx tsx prisma/seed.ts

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment variables

See [`.env.example`](.env.example). Copy it to `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLite database location, e.g. `file:./dev.db`. |
| `ADMIN_PASSWORD` | Yes | Password for the `/admin` login. |
| `ADMIN_SESSION_TOKEN` | Yes | Opaque token stored in the `admin_session` cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `ANTHROPIC_API_KEY` | No | Enables the GitHub importer and "Refine with AI". Without it those buttons return an error; everything else works. |
| `GITHUB_TOKEN` | No | Raises GitHub's API rate limit (60 → 5000/hr) and allows private repos in the importer. |

## Database

The schema lives in [`prisma/schema.prisma`](prisma/schema.prisma); the Prisma client is generated to `src/generated/prisma`. The `dev.db` file is **git-ignored** — rebuild it from the seed script, which reflects the current production content:

```bash
npx prisma db push      # apply the schema
npx tsx prisma/seed.ts  # (re)seed projects, experience, skills, and settings
```

Inspect or hand-edit data with `npx prisma studio`.

## Admin panel (`/admin`)

Log in with `ADMIN_PASSWORD`, then use **Content** to manage:

- **Settings** — name, bio, links, Hero roles, and all section copy.
- **Projects** — full editor (title, description, bullets, tech, dates, URLs, visibility), plus GitHub import and AI refine.
- **Experience** — add/edit work & education entries.
- **Skills** — add, rename, recategorize.

**Analytics** shows page views, résumé downloads, message count, country breakdown, and recent messages.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm start` | Run the production build. |
| `npm run lint` | ESLint. |
| `npx tsx prisma/seed.ts` | Seed the database. |

## Deployment

Set the environment variables on your host, run `npx prisma db push` and the seed (or restore your data), then `npm run build` / `npm start`. Country analytics use platform geo headers (`x-vercel-ip-country` / `cf-ipcountry`) when present, so they populate automatically on Vercel or Cloudflare with no external dependency.

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
npm run db:push      # apply the schema to DATABASE_URL
npm run db:seed      # seed projects, experience, skills, and settings

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment variables

See [`.env.example`](.env.example). Copy it to `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | libSQL database. Local: `file:./dev.db`. Production: a hosted libSQL/Turso URL (`libsql://…turso.io`). |
| `DATABASE_AUTH_TOKEN` | Prod only | Auth token for hosted libSQL/Turso. Leave unset for a local file DB. |
| `ADMIN_PASSWORD` | Yes | Password for the `/admin` login. |
| `ADMIN_SESSION_TOKEN` | Yes | Opaque token stored in the `admin_session` cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `ANTHROPIC_API_KEY` | No | Enables the GitHub importer and "Refine with AI". Without it those buttons return an error; everything else works. |
| `GITHUB_TOKEN` | No | Raises GitHub's API rate limit (60 → 5000/hr) and allows private repos in the importer. |

## Database

The schema lives in [`prisma/schema.prisma`](prisma/schema.prisma); the Prisma client is generated to `src/generated/prisma`. The `dev.db` file is **git-ignored** — rebuild it from the seed, which reflects the current production content:

```bash
npm run db:push      # apply the schema to DATABASE_URL (local file or remote Turso)
npm run db:seed      # (re)seed projects, experience, skills, and settings
```

`db:push` applies the schema through the libSQL client (`scripts/db-push.ts`) so it works with both a local `file:` URL and a remote `libsql://` Turso URL. (`prisma db push` is **not** used — its SQLite engine only accepts `file:` URLs and resolves them relative to the `prisma/` folder.) Inspect data with `npx prisma studio`.

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
| `npm run db:push` | Apply the schema to `DATABASE_URL` (local file or remote Turso). |
| `npm run db:seed` | Seed the database. |

## Deployment (Vercel + Turso)

Vercel's filesystem is read-only and ephemeral, so the local SQLite file can't be the production database. Use a hosted libSQL database — [Turso](https://turso.tech) — which the libSQL adapter already supports. No code changes are needed; only environment variables differ between local and production.

**1. Create the production database (one-time)** — no CLI required, use the Turso dashboard:

- Sign in at **[turso.tech](https://turso.tech)** (the dashboard is at `app.turso.tech`).
- **Create Database** → name it (e.g. `portfolio`) and pick a region near your Vercel deployment.
- Copy the database **URL** (`libsql://portfolio-<org>.turso.io`) → this is `DATABASE_URL`.
- Under **Tokens**, **Create Token** with read & write access → this is `DATABASE_AUTH_TOKEN`.

(If you prefer the terminal, the [Turso CLI](https://docs.turso.tech/cli) `turso db create` / `db show --url` / `db tokens create` produce the same two values.)

**2. Apply the schema and seed it** against Turso from your machine — this uses the project's npm scripts (libSQL client), not the Turso CLI:

```bash
# macOS / Linux
DATABASE_URL="libsql://…turso.io" DATABASE_AUTH_TOKEN="…" npm run db:push
DATABASE_URL="libsql://…turso.io" DATABASE_AUTH_TOKEN="…" npm run db:seed
```

```powershell
# Windows PowerShell
$env:DATABASE_URL="libsql://…turso.io"; $env:DATABASE_AUTH_TOKEN="…"
npm run db:push
npm run db:seed
```

**3. Import the project to Vercel** and set the environment variables in the project settings: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN`, and optionally `ANTHROPIC_API_KEY` / `GITHUB_TOKEN`. Vercel auto-detects Next.js; the `build` script runs `prisma generate` before `next build`, so the generated client is created during the build.

**4. Deploy.** The home page is rendered per request (`force-dynamic`), so content edited in `/admin` appears immediately without a redeploy. Country analytics read Vercel's `x-vercel-ip-country` header automatically — no external geo lookup required.

> For other Node hosts (Fly.io, a VM, etc.) the same applies: set the env vars, ensure `prisma generate` runs at build, point `DATABASE_URL`/`DATABASE_AUTH_TOKEN` at your libSQL database, then `npm run build` / `npm start`.

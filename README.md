This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## What this project does

A job-market analyzer: paste in job postings, it extracts required skills from the text
(keyword/regex matching in [`app/lib/skillAnalysis.ts`](app/lib/skillAnalysis.ts) — no AI
involved), and compares them against skills you say you have to surface gaps and build a
learning roadmap. Single-user for now, no auth. See [ROADMAP.md](ROADMAP.md) for direction.

## Tech stack

- **React** — UI components. `useState` holds data that re-renders the screen when it
  changes; `useEffect` runs code (usually a `fetch`) right after a component appears.
- **Next.js (App Router)** — the framework around React. Two ideas matter most here:
  - **File-based routing**: the folder structure *is* the routing table, e.g.
    `app/dashboard/page.tsx` → `/dashboard`, `app/postings/[id]/page.tsx` → `/postings/<id>`.
  - **Server vs. Client components**: components run on the server by default (fast, no
    interactivity). Adding `'use client'` at the top of a file ships it to the browser so it
    can use `useState`/`useEffect`/click handlers — every interactive page in this app has it.
- **API routes** (`app/api/**/route.ts`) — server-only functions that respond to HTTP
  requests, like a small backend bundled into the same project. This is the only layer
  allowed to talk to the database; the browser never queries Supabase directly.
- **TypeScript** — adds type annotations (e.g. `type Posting = { id: string; ... }`) that
  are checked by the editor/compiler and stripped away before the code runs — catches typos
  and shape mismatches before you'd see them as bugs in the UI.
- **Supabase** — hosted Postgres database ([`supabase/schema.sql`](supabase/schema.sql))
  with a JS client library ([`app/lib/supabase.ts`](app/lib/supabase.ts)) so API routes can
  write `.from('table').insert(...)` instead of raw SQL.

## How a request flows end to end

Example: submitting a job posting on the "Stillinger" page.

```
Browser (Client Component)
  JobPostingForm.tsx → fetch('/api/job-postings', { method: 'POST', body })
        │  HTTP request
        ▼
Next.js server (API route)
  app/api/job-postings/route.ts → POST()
  → extracts skills via skillAnalysis.ts (plain TS, no network)
  → supabase.from('job_postings').insert(...)
        │  network call to Supabase
        ▼
Supabase (Postgres)
  Row inserted into job_postings, then extracted_skills
        │  JSON response flows back up
        ▼
Browser: setPostings(...) → React re-renders the list
```

There are effectively two separate JS environments in this one codebase: code that runs in
the visitor's browser (client components) and code that runs on a server you don't see (API
routes, and any component without `'use client'`). Supabase is only ever reachable from the
server side.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

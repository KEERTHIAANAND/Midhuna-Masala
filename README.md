# Midhuna Masala

Full-stack e-commerce app.

## Tech stack

- Frontend: Next.js (React) + TypeScript
- Backend API: Express + TypeScript
- Auth: Firebase Auth (client) + Firebase Admin (server verification)
- Database: Supabase Postgres
- Images: Cloudinary (optional helper script)

## Project structure

- `midhunamasala/` — Next.js storefront + admin UI (see `midhunamasala/README.md`)
- `midhunamasala/backend/` — Express API + SQL migrations (see `midhunamasala/backend/README.md`)

## Prerequisites

- Node.js 18+ (recommended)
- A Supabase project (Postgres)
- A Firebase project (Auth)

## Quickstart (local development)

### 1) Database (Supabase)

SQL migrations live in `midhunamasala/backend/src/db/`.

Recommended (repeatable): run migrations via the migration runner.

1) Copy env template:

```bash
cd midhunamasala/backend
copy .env.example .env
```

2) Fill these in `midhunamasala/backend/.env`:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

3) Install + migrate:

```bash
npm install
npm run db:migrate
```

If the runner can’t connect (common on restricted networks), use Supabase SQL Editor:

- Run `midhunamasala/backend/src/db/migrations.sql`

### 2) Backend API

1) In `midhunamasala/backend/.env`, configure Firebase Admin using ONE method:

- Local dev: `FIREBASE_SERVICE_ACCOUNT_PATH` (path to Admin SDK JSON)
- Production: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`

2) Start the API:

```bash
cd midhunamasala/backend
npm run dev
```

Health check:

- `GET http://localhost:5000/api/health`

### 3) Frontend (Next.js)

1) Create `midhunamasala/.env.local`:

```bash
cd midhunamasala
copy .env.local.example .env.local
```

2) Fill:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_FIREBASE_*`

3) Start the app:

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000`

## Admin access

- Admin permissions are enforced by the database user role (`users.role = 'admin'`).
- (Recommended) Set `ADMIN_EMAILS` in `midhunamasala/backend/.env` (comma-separated emails) so `/api/auth/sync-user` can promote admins during login.

## Optional: upload product images to Cloudinary

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `midhunamasala/.env.local`, then:

```bash
cd midhunamasala
node scripts/upload-to-cloudinary.mjs
```

## Security notes

- Do **not** commit `.env`, `.env.local`, or service account JSON files.
- Backend uses the Supabase **service role** (server-only). Never expose it to the frontend.
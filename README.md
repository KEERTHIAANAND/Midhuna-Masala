# Midhuna Masala

Full-stack e-commerce app.

## Repo structure

- `midhunamasala/` — Next.js frontend
- `midhunamasala/backend/` — Express + TypeScript API

## Prerequisites

- Node.js 18+ (recommended)
- A Supabase project (Postgres)
- A Firebase project (Auth)

## Phase 1 — MVP baseline (local setup)

### 1) Database (Supabase)

This repo includes numbered SQL migrations in `midhunamasala/backend/src/db/`.

Recommended (repeatable): run migrations with the migration runner.

1. Go to Supabase → **Connect → Direct**
	- Prefer **Session pooler** (port `5432`) or **Transaction pooler** (port `6543`) if your network blocks the direct DB host.
	- Enter your **database password** in the password field (Supabase cannot show it back to you) so the copied URI contains the correct password.
2. In a terminal:

```bash
cd midhunamasala/backend
copy .env.example .env
```

3. Fill these in `backend/.env`:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Install + migrate:

```bash
npm install
npm run db:migrate
```

Manual fallback: You can also run `midhunamasala/backend/src/db/migrations.sql` and/or the numbered `00x_*.sql` files directly in Supabase SQL Editor.

### 2) Backend API

1. In `midhunamasala/backend/.env` fill Firebase Admin credentials using ONE method:
- Local dev: `FIREBASE_SERVICE_ACCOUNT_PATH` (path to Admin SDK JSON)
- Production: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`

2. Run the API:

```bash
cd midhunamasala/backend
npm run dev
```

Health check:
- `GET http://localhost:5000/api/health`

### 3) Frontend (Next.js)

1. Create `midhunamasala/.env.local`:

```bash
cd midhunamasala
copy .env.local.example .env.local
```

2. Fill Firebase Web config (`NEXT_PUBLIC_FIREBASE_*`) and confirm `NEXT_PUBLIC_API_URL`.

3. Run the app:

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000`

## One-time: upload images to Cloudinary (optional)

Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `midhunamasala/.env.local`, then:

```bash
cd midhunamasala
node scripts/upload-to-cloudinary.mjs
```

## Notes

- Do **not** commit `.env`, `.env.local`, or service account JSON files.
- Backend uses Supabase **service role** (server-only). Never expose it to the frontend.
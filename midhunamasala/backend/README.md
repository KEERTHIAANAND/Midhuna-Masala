## Midhuna Masala — Backend API

Express + TypeScript API for auth, products, cart, addresses, and orders.

### Local setup

1) Create `.env`

```bash
copy .env.example .env
```

2) Fill required values in `.env`

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- Firebase Admin credentials (one of):
  - `FIREBASE_SERVICE_ACCOUNT_PATH`
  - OR `FIREBASE_ADMIN_PROJECT_ID` + `FIREBASE_ADMIN_CLIENT_EMAIL` + `FIREBASE_ADMIN_PRIVATE_KEY`

3) (Recommended) Apply database migrations

```bash
npm install
npm run db:migrate
```

4) Run API

```bash
npm run dev
```

Health:
- `GET /api/health`

### Notes

- This backend uses the Supabase service role key (server-only). Do not expose it to the frontend.
- CORS origin is controlled by `CORS_ORIGIN`.

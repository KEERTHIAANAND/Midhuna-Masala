## Midhuna Masala — Frontend

Next.js storefront + admin UI.

### Local setup

1) Create `.env.local`

```bash
copy .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_FIREBASE_*` values

2) Install + run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Backend dependency

This frontend expects the API server running (default):
- `http://localhost:5000`

See `backend/.env.example` for backend configuration.

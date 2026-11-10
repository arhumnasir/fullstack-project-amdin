# Shop.Co Admin – connect to the existing Shop.Co backend

This admin frontend uses the existing Shop.Co API. It does not contain or replace a backend.

## 1. Keep using your existing backend

Run the same `shopco-backend` folder you already use:

```bash
npm run dev
```

In that backend folder's existing `.env`, keep your current `MONGO_URI`, `JWT_SECRET`, and `PORT`. Set CORS to allow both the storefront and this admin app:

```env
CLIENT_URL=http://localhost:5173,http://localhost:3000
```

Restart the backend after changing `.env`.

## 2. Run this admin frontend

Copy `.env.example` to `.env` (or create `.env`) and set:

```env
VITE_API_URL=http://localhost:4000/api
```

Then:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Admin account requirement

Sign in with an account that already exists in the same MongoDB database and has `role: "admin"`. The current backend's public registration endpoint creates customer accounts; it does not create admin accounts. Do not expose admin creation through public signup.

## Connected features

- Product list, create, update, stock adjustment, and delete use `/api/products`.
- Orders list and status updates use `/api/orders`.
- Admin login and session validation use `/api/auth/login` and `/api/auth/me`.
- User directory is intentionally not populated with mock data: the existing backend has no admin users-list endpoint.
- Analytics charts and activity logs remain presentation/demo data because the existing backend has no analytics or audit-log endpoints.

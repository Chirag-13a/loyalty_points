# Café Loyalty Points

A full-stack MERN loyalty desk for café staff. Members earn points from purchases, move from Bronze to Silver to Gold, and redeem a small catalogue of rewards. The React SPA includes a public landing page, staff authentication, a counter dashboard, member directory, member profile, and public rewards view.

## Run locally

Prerequisites: Node.js 18+. MongoDB 6+ is recommended for production, but the app automatically uses the persistent local JSON store at `server/data/store.json` when MongoDB is not installed or cannot be reached.

```bash
cp .env.example .env
# Set JWT_SECRET in .env; add MONGODB_URI when MongoDB is available
npm install
npm install --prefix client
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`. The first API start seeds the three tiers and four reward items. For a production build, run `npm run build && NODE_ENV=production npm start`.

## Rules

- Base earning rate is 1 point per ₹10 (`POINTS_PER_RUPEE=0.1`). Points are floored to whole points.
- Bronze earns 1x, Silver 1.25x, and Gold 1.5x.
- Silver starts at 500 lifetime points and Gold at 1,500 lifetime points.
- Lifetime points never decrease. The spendable balance decreases only when a reward is redeemed.
- Every earn and redemption creates a transaction. Redemption is rejected when the balance is below the reward cost.

## API endpoints

All member and reward-changing endpoints require `Authorization: Bearer <jwt>` unless marked public.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create a staff account |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/member/auth/register` | Create a member account with phone/password |
| POST | `/api/member/auth/login` | Login as a member and receive member JWT |
| GET | `/api/menu` | Public café menu with categories and image URLs |
| GET | `/api/rewards` | List tiers and available redemption items |
| POST | `/api/rewards` | Add a redemption item (authenticated staff) |
| PATCH | `/api/rewards/:id` | Edit a redemption item (authenticated staff) |
| GET | `/api/dashboard/summary` | Total members, points issued, and today's redemptions |
| GET | `/api/members?search=&page=&limit=&sort=&direction=` | Search, paginate, and sort members |
| POST | `/api/members` | Create a member |
| GET | `/api/members/:id` | Get the current member snapshot |
| POST | `/api/members/:id/purchases` | Record spend and calculate points |
| POST | `/api/members/:id/redemptions` | Redeem a reward and deduct points |
| GET | `/api/members/:id/transactions?page=&type=&from=&to=` | Paginated, filtered transaction history |
| GET | `/api/member/home` | Member balance, tier, and recent transactions |
| GET | `/api/member/rewards` | Member-visible visual redemption catalog |
| POST | `/api/member/redeem` | Redeem a reward using the member token |
| GET | `/api/member/offers` | Member offers and promotions |
| GET | `/api/members/me/transactions` | Member-only self-scoped purchase/visit history |

## Routes

`/` landing page, `/register` and `/login` staff auth, `/dashboard` counter workflow, `/redeem` dedicated reward redemption workflow, `/members` searchable directory, `/members/:id` member profile, `/profile` staff profile, `/logout` logout action, `/catalog` staff reward management, and `/rewards` public tier/reward catalogue. The separate member portal has `/member/login`, `/member/register`, `/member/home`, `/member/redeem` (view-only), `/member/visits`, `/member/menu`, `/member/offers`, and `/member/about`. Staff and member JWTs are role-checked and cannot access each other's protected APIs. Members cannot redeem online; redemption is counter-only.

## Debugging

Use `npm run server:dev` and `npm run client:dev` in separate terminals when isolating one side. Check `GET /api/health`, confirm MongoDB is reachable, and inspect the browser network tab for API responses. `npm run build` is the production client check.
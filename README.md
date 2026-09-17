# Café Loyalty Points (MERN SPA)

Café Loyalty Points is a full-stack MERN single-page application for café counter staff to manage loyalty points, tier upgrades, and redemptions.

## Tech Stack
- **Frontend:** React, React Router, Tailwind CSS, Axios, Vite
- **Backend:** Node.js, Express, JWT Auth, bcrypt
- **Database:** MongoDB + Mongoose

## SPA Routes
- `/` — Landing page (overview, target users, benefits, next planned features)
- `/register` — Staff registration
- `/login` — Staff login
- `/dashboard` — Protected counter dashboard (member lookup, purchase, redeem)
- `/members` — Protected member directory (search, pagination, sorting)
- `/members/:id` — Protected member profile (balance, tier badge, transaction history)
- `/rewards` — Public tiers and rewards catalog

## Core Loyalty Logic
- Base points formula: **1 point per ₹10 spent** (configurable via `POINTS_PER_10_RUPEES`)
- Tier multipliers:
  - Bronze: x1
  - Silver: x1.25
  - Gold: x1.5
- Tier thresholds (lifetime earned points):
  - Bronze: 0–499
  - Silver: 500–1499
  - Gold: 1500+
- Redemption is blocked if points balance is insufficient.
- Every purchase/redemption creates a `Transaction` record.
- Current points balance is derived from transaction history (`sum(points)`).

## Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cafe_loyalty_points
JWT_SECRET=replace_with_secure_secret
POINTS_PER_10_RUPEES=1
```

## Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Create `frontend/.env` (optional if using Vite proxy):
```env
VITE_API_BASE_URL=/api
```

## API Endpoints

### Health
- `GET /api/health` — service health check

### Auth
- `POST /api/auth/register` — register staff user
  - body: `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login` — login staff user
  - body: `{ "email": "...", "password": "..." }`

### Rewards
- `GET /api/rewards/tiers` — list tiers (public)
- `GET /api/rewards/items` — list active redemption items (public)
- `POST /api/rewards/items` — add reward item (protected)
  - body: `{ "name": "...", "pointsCost": 150 }`

### Members (Protected)
- `POST /api/members` — create member
  - body: `{ "name": "...", "phone": "..." }`
- `GET /api/members` — list members with search/pagination/sorting
  - query: `search`, `page`, `limit`, `sortBy(name|phone|createdAt|updatedAt)`, `sortOrder(asc|desc)`
- `GET /api/members/:id` — member profile with derived summary
- `GET /api/members/:id/transactions` — transaction history with pagination/sorting
  - query: `page`, `limit`, `sortBy(amount|points|createdAt|type)`, `sortOrder(asc|desc)`
- `POST /api/members/:id/purchase` — record purchase and add points
  - body: `{ "amount": 450 }`
- `POST /api/members/:id/redeem` — redeem reward item
  - body: `{ "itemId": "<rewardId>", "quantity": 1 }`

## Data Models
- `StaffUser` — staff authentication identity
- `Member` — loyalty member
- `Tier` — multiplier and threshold definition
- `RedemptionItem` — reward catalog items
- `Transaction` — immutable purchase/redemption ledger

## Debugging Notes
- If login/register fails, ensure `JWT_SECRET` is set.
- If backend fails to boot, verify `MONGODB_URI` is reachable.
- If frontend cannot hit backend in development, either:
  - run backend on port `5000` (Vite proxy default), or
  - set `VITE_API_BASE_URL` to backend URL.

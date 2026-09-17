# Reasoning

## Design decisions

The application is split into a small Express API and a Vite React SPA. Mongoose models keep the domain objects explicit: `Member`, `Tier`, `Transaction`, `RedemptionItem`, and `StaffUser`. The frontend talks only to the REST API, so the same business rules apply to the dashboard and future clients.

The important invariant is that an earn transaction is recorded before the member snapshot is updated, and redemption is refused before a negative transaction can be created. `lifetimePoints` is used for tier qualification and never decreases; `balance` is the spendable ledger. The transaction history remains the audit trail for both operations.

## Testing performed

- Ran `node --check` against the server entry point and core route modules.
- Installed dependencies with npm.
- Ran `npm run build` for the React client; Vite completed successfully.
- The API includes `/api/health` for a cheap environment check. Full persistence checks require a MongoDB URI in `.env`.
- Added backend validation for credentials, phone numbers, purchase amounts, reward costs, and required fields.
- Added server-side member pagination/sorting, transaction filters, dashboard aggregates, and catalog CRUD endpoints.
- Added client-side debounce, loading/empty states, toast feedback, confirmation dialogs, fresh post-transaction member reads, and a 404 route.

## Bugs found and fixed

- Directory sorting previously omitted tier and the UI fired a request on every keystroke; tier sorting and a 350ms debounce now run through the backend.
- Profile loading expected transactions from the member endpoint, which made the profile stale after the API was split; the profile now fetches a fresh member snapshot and filtered transaction endpoint independently.
- Purchase and redemption feedback could leave stale balances in the UI; purchase now performs a fresh member read and both mutation responses return the saved member.
- Auth and member forms previously relied only on browser validation; shared backend validation now returns clear 400/409/401 messages.
- Reward catalog management had no API or screen; authenticated POST/PATCH endpoints and a staff catalog page were added.
- Registration returned a 400 with unclear behavior when MongoDB was unavailable; the API now reports validation errors clearly and falls back to a persistent JSON store so local development can complete the full workflow without MongoDB.
- Added staff profile and logout routes, plus a new sage/forest color system for clearer navigation and account state.
- Member authentication is separate from staff authentication because member tokens should only read the member's own balance/history and redeem rewards; staff tokens retain the counter operations. Role middleware enforces that boundary server-side.
- The local JSON store intentionally mirrors the MongoDB collections, allowing the member portal and staff counter to run in Codespaces without MongoDB while keeping the same REST contracts for a later MongoDB deployment.
- Member redemption was deliberately removed from the member API. Members can view rewards and their balance, but only the staff purchase/counter APIs can mutate loyalty state. The backend returns 403 for member tokens on staff routes, independent of hidden frontend controls.
- Member visits use `/api/members/me/transactions`, deriving the member identity from the member JWT rather than accepting an arbitrary member id. Menu data is public and informational only; it has no ordering or points mutation path.

## Tradeoffs

The app keeps the member snapshot (`balance`, `lifetimePoints`, and `tier`) for fast counter reads while also writing every ledger event to `Transaction`. For a high-concurrency production deployment, purchase and redemption updates should be wrapped in MongoDB transactions or atomic conditional updates, and the snapshot should be periodically reconciled from transactions.
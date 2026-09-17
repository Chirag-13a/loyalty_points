# REASONING

## Design decisions
1. Built a minimal MERN split (`backend/`, `frontend/`) because the repository was empty except for a placeholder README.
2. Implemented points, tier, and redemption as transaction-ledger logic so the balance is derived from history and cannot drift.
3. Used tier thresholds based on lifetime earned points and automatic re-evaluation after every purchase/redemption.
4. Added phone/name search with server-side pagination and sorting on member directory and transaction history for scalability.
5. Used JWT-based protected routes in both backend middleware and React route guards.

## Validation approach
- Backend source syntax validation with `node --check` over all backend JS files.
- Frontend production build with Vite to validate route components and API integration compile.
- Manual API/UI behavior aligned to required flow:
  - search member by phone
  - purchase adds points using current tier multiplier
  - redemption blocks insufficient balance and deducts exact points
  - profile/dashboard show derived balance and tier progress

## Issues found and fixed while implementing
- Initial `frontend/src/api.js` authorization header generation was malformed during file write; corrected to `'Bearer ' + token`.

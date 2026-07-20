backend-api — Express + TypeScript REST API

To run locally:
1. cd backend-api
2. npm install
3. Copy .env.example to .env and set MONGO_URI and other keys
4. npm run dev

Endpoints (scaffold):
- GET /            - health
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/properties
- GET  /api/properties/:id
- POST /api/properties  (requires auth header)

Notes:
- Connect frontend and admin to this API base URL via environment variables.

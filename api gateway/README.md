# API Gateway

Central auth gateway for the AlgoQuest platform. Responsible for user management and acting as the entry-point for clients. It also holds configuration for other services used by the platform.

## Overview

- **Purpose:** Authentication, user management and a thin API gateway for the platform.
- **Stack:** Node.js + TypeScript, Express, MongoDB (Mongoose), JWT for auth.

## Key Concepts

- **Auth routes:** Exposes signup/signin and user lookup.
- **Middleware:** `authRequest` middleware verifies JWT tokens for protected routes.
- **User model:** Stores basic user information and submission count.

## API Endpoints

All endpoints are mounted under `/api/v1` when served by the server.

- `POST /api/v1/signup` — Create a new user. Expects JSON body: `{ username, email, password }`.
- `POST /api/v1/signin` — Authenticate a user. Expects `{ email, password }`. Returns JWT on success.
- `GET /api/v1/user/:id` — Return user details by ID (public).
- `GET /api/v1/` — Example protected route to verify `authRequest` middleware.

Example: Sign in

```bash
curl -X POST http://localhost:5000/api/v1/signin \
  -H 'Content-Type: application/json' \
  -d '{"email":"dev@example.com","password":"secret"}'
```

## DB Model (User)

- `username` (string, unique, required)
- `email` (string, unique, required)
- `password` (string, required — stored hashed by service)
- `submission_count` (number, default 0)

(See `src/model/user.model.ts` for full Mongoose schema.)

## Environment Variables

- `PORT` (default: 5000)
- `MONGO_URI` (default: `mongodb://localhost:27017/algoquest_auth`)
- `JWT_SECRET` (default: `trishit`)
- `JWT_EXPIRY` (default: `7d`)
- `PROBLEM_SERVICE`, `SUBMISSION_SERVICE`, `LEADERBOARD`, `API_GATEWAY` — other services' base URLs

## Run Locally

1. Install dependencies

```bash
cd "api gateway"
npm install
```

2. Add a `.env` file with the environment keys above.

3. Start services required by this gateway:
- MongoDB (docker or local) e.g. `docker run -d -p 27017:27017 --name mongo mongo:latest`

4. Run the gateway

```bash
npm run dev
# or npm start for production
```

## Extensions & Notes

- JWT signing/verification is handled by `src/utils/auth.ts`.
- Auth routes are in `src/router/v1Router/auth.router.ts`.
- Controller logic lives in `src/controllers/user.controller.ts`.

---

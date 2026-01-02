# Leaderboard Service

Redis-based leaderboard service used by AlgoQuest to maintain user scores and rankings.

## Overview

- **Purpose:** Maintain a global leaderboard using Redis sorted sets and provide endpoints to add users, update scores, and stream leaderboard data.
- **Stack:** Node.js + TypeScript, Express, Redis (`ioredis`), using `ZREVRANGE` / `ZADD` / `ZINCRBY` operations.

## API Endpoints

All endpoints are mounted under `/api` (router depends on server configuration):

- `GET /` — Health / example endpoint
- `PUT /adduser` — Add user to the leaderboard
  - Body: `{ userData: string, score: number }`
- `POST /increment` — Increment score for an existing user
  - Body: `{ userData: string, score: number }`
- `GET /leaderboard` — Get top leaderboard entries (reads sorted set)

Example: add a user

```bash
curl -X PUT http://localhost:4501/api/adduser \
 -H 'Content-Type: application/json' \
 -d '{"userData":"alice","score":10}'
```

## Redis Schema

- Uses a single sorted set (key configured through `serverConfig.KEY`).
- Stored values: member = `userData` (string), score = numeric score.
- Retrieval: `ZREVRANGE key 0 100 WITHSCORES` returns alternating [member, score].

## Implementation Notes

- `src/repository/leaderboard.repository.ts` handles the Redis operations via `ioredis`:
  - `zadd` to add users
  - `zincrby` to increment score
  - `zrevrange ... WITHSCORES` to stream leaderboard

- `src/service/leaderboard.service.ts` transforms Redis raw output into an array of `{ user, score }` objects.

## Environment Variables

- `PORT` (default: 4501)
- `REDIS_HOST` (default: `localhost`)
- `REDIS_PORT` (default: 6379)
- `KEY` (name of the leaderboard sorted set — must be set for production)

## Run Locally

1. Start Redis (docker example)

```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

2. Install & run

```bash
cd leaderboard
npm install
npm run dev
```

## Testing and Validation

- Validate `ZADD` and `ZINCRBY` behavior using `redis-cli`:

```bash
redis-cli ZRANGE <KEY> 0 -1 WITHSCORES
```

---

If you want, I can add example Postman / curl collections for the endpoints and a small integration test script that hits `adduser` and `increment`.
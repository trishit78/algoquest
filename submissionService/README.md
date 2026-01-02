# Submission Service

Detailed documentation for Submission Service — handles submission persistence, queuing for evaluation, and exposing endpoints used by clients and the evaluation worker.

## Overview

- **Purpose:** Accept and store code submissions, validate them, enqueue for evaluation, expose submission query/update endpoints used by frontend/evaluation service.
- **Stack:** Node.js + TypeScript, Express, MongoDB (Mongoose), Redis + BullMQ, Zod validation, Winston logging.
- **Key files:**
  - `src/models/submission.model.ts` — Submission schema & enums
  - `src/producers/submission.producer.ts` — Adds jobs to the `submission` queue
  - `src/queues/submission.queues.ts` — BullMQ queue configuration (attempts/backoff)
  - `src/controllers/submission.controller.ts` — HTTP handlers
  - `src/services/submission.service.ts` — Business logic (creates DB record + enqueues job)
  - `openapi.yaml` — Service API specification

---

## API Reference (summary)
Base path: `/api/v1`

> Authentication: `create` and `GET /` (user-specific) endpoints expect an authenticated request (controller reads `req.user.id`, set by auth middleware). The README assumes an API gateway handles auth in front of this service.

### Create Submission
- `POST /api/v1/submissions/create`
- Request body (example):
```json
{
  "problemId": "6420a...",
  "code": "print(sum(map(int, input().split())))",
  "language": "python"
}
```
- Note: `userId` is populated server-side from the authenticated request (controller merges `req.user.id`).
- Response: `201` with created submission document (status defaults to `pending`).

### Get Submissions for Authenticated User (filter by problemId)
- `GET /api/v1/submissions?problemId=<id>`  (or body/query)
- Requires auth; returns submissions for the authenticated user filtered by problemId.

### Get Submissions by Problem ID (admin/public)
- `GET /api/v1/submissions/problem/:problemId`
- Returns list of submissions for a given problem.

### Get Submission Data (detailed results)
- `GET /api/v1/submissions/:submissionId`
- Returns submission details and `submissionData` which contains per-test results.

### Update Submission Status (used by evaluation worker)
- `PATCH /api/v1/submissions/:id/status`
- Request body (example):
```json
{
  "status": "completed",
  "submissionData": {"<testCaseId>": "AC", "<testCaseId2>": "WA"}
}
```
- This endpoint is used by the evaluation service to update status and per-test results after running tests.

### Delete Submission
- `DELETE /api/v1/submissions/:id` — Removes a submission record.

---

## Models & DB

### Submission schema (high level)
- `problemId` (string, required)
- `userId` (string, required)
- `code` (string, required)
- `language` (enum: `cpp|python`)
- `status` (enum: `pending | completed | attempted | failed`, defaults to `pending`)
- `submissionData` (object storing per-test case outcomes `{ testCaseId: status }`)
- `createdAt`, `updatedAt`

Notes:
- `src/models/submission.model.ts` defines `SubmissionLanguage` and `SubmissionStatus` enums used throughout validation and services.
- `submissionData` is flexible (stored as an object) to allow storing `{ testCaseId: "AC" | "WA" | "TLE" | "Error" }`.

---

## Queueing & Evaluation Job Flow

1. A client calls `POST /submissions/create` (authenticated).
2. `createSubmissionService` validates problem existence (calls `Problem Service`), inserts DB record, and calls `addSubmissionJob()` to push a job to the Redis-backed `submission` queue.
3. Job payload (shape sent to queue):
```json
{
  "submissionId": "<mongo-id>",
  "problem": { "id": "...", "testcases": [{"_id":"...","input":"...","output":"..."}, ...] },
  "code": "...",
  "language": "python",
  "userId": "<user-id>"
}
```
4. Evaluation worker (Evaluation Service) consumes the job, runs testcases, and calls `PATCH /submissions/:id/status` to update results and status.

Queue configuration:
- Configured in `submission.queues.ts` using BullMQ with default job options:
  - `attempts: 3` (retries)
  - `backoff`: exponential starting at `2000ms`

---

## Validation
- Request validation uses Zod schemas in `src/validators/submission.validator.ts`:
  - `createSubmissionSchema` requires `problemId`, `code`, `language`
  - `updateSubmissionStatusSchema` validates the `status` enum and `submissionData`

---

## Environment Variables
- `PORT` (default: 3001)
- `MONGO_URI` (default: `mongodb://localhost:27017/submissionService`)
- `PROBLEM_SERVICE` (URL of Problem Service used to verify problems)
- `JWT_SECRET` — for token validation if auth is applied at this service layer
- `REDIS_HOST`, `REDIS_PORT` — for BullMQ

---

## Examples
- Create submission (curl; assume JWT auth header required by middleware):
```bash
curl -X POST http://localhost:3001/api/v1/submissions/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{"problemId":"6420...","code":"print(1)","language":"python"}'
```

- Patch submission status (used by evaluation worker):
```bash
curl -X PATCH http://localhost:3001/api/v1/submissions/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed","submissionData":{"<testId>":"AC"}}'
```

---

## Running & Dev
1. Start MongoDB and Redis
2. `npm install`
3. `npm run dev`

---

## Next steps & suggestions
- Add an endpoint or event stream to support real-time updates (websocket or SSE) for submission status updates.
- Add Postman collection and example job JSON for manual queue insertion to aid integration testing.

If you'd like, I can add example Postman/Insomnia collections and a small smoke test script for the create→queue→update flow.

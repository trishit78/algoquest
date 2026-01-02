# Evaluation Service

Service responsible for executing user code in isolated container environments and returning evaluation results. This service is the "runner" for submissions and interacts with the submission service and problem service.

## Overview

- **Purpose:** Run user submissions against testcases and publish results.
- **Stack:** Node.js + TypeScript, Express, BullMQ (queue), Redis (ioredis), Docker containers for language runtimes.
- **Key files:**
  - `src/workers/evaluation.worker.ts` — worker processing logic (runs tests and updates submission status)
  - `src/utils/containers/*` — utilities to pull images and run code inside containers
  - `src/config` — service configuration
  - `openapi.yaml` — documented public API surface


## Worker / Queue Details

- Uses `BullMQ` to subscribe to the `SUBMISSION_QUEUE` and process incoming jobs.
- Jobs are produced by `submissionService` (see `src/producers/submission.producer.ts`), and the queue is configured with retry/backoff defaults (`attempts: 3`, exponential backoff) in `submissionService/src/queues/submission.queues.ts`.

### Job payload (shape)

Jobs contain the full evaluation payload (see `src/interfaces/evaluation.interface.ts`):

```ts
{
  submissionId: string,
  code: string,
  language: 'python' | 'cpp',
  problem: { id, title, testcases: [{ _id, input, output }, ...] },
  userId: string
}
```

### How evaluation works (step-by-step)

1. Producer (submission service) creates a job and pushes it into Redis-backed `submission` queue.
2. Worker (`src/workers/evaluation.worker.ts`) receives the job and retrieves the payload.
3. Worker fetches the submitting user's info (via `getUserByID`) so results can update leaderboard or be attributed properly.
4. For each testcase in `problem.testcases` the worker calls `runCode({...})` in parallel (using `Promise.all`) with:
   - `code`, `language`
   - `timeout` and `imageName` from `src/config/language.config.ts`
   - `input` set to the testcase input
5. `runCode` (in `src/utils/containers/codeRunner.ts`) performs the following:
   - Builds a language-specific shell command (`src/utils/containers/commands.utils.ts`) that writes source and input into the container and runs it.
   - Creates a Docker container (`createNewDockerContainer`) with strict HostConfig options: limited memory, CPU quota, PIDs limit, `NetworkMode: 'none'` and `SecurityOpt: ['no-new-privileges']`.
   - Starts the container, enforces a per-test timeout (kills container on TLE), collects stdout/stderr logs, sanitizes them, and returns `{ status, output }` where `status` is `success` / `fail` / `time_limit_exceeded`.
6. The worker maps per-test results to short status labels using `matchTestCasesWithResults` logic:
   - `time_limit_exceeded` -> `TLE`
   - `fail` (non-zero exit) -> `Error`
   - `success` with output equal to expected -> `AC` (Accepted)
   - `success` with different output -> `WA` (Wrong Answer)
   Comparison currently is a string equality check on the sanitized `stdout` (see `processLogs()` in `codeRunner.ts`).
7. After mapping all testcases, the worker aggregates results:
   - If all tests are `AC` → mark the submission `completed` and call `addScoresToLeaderboard`.
   - If some tests `AC` → mark `attempted`.
   - If no tests `AC` → mark `failed`.
   The worker updates submission state by calling `updateSubmission(submissionId, status, output)` which PATCHes the Submission Service.
8. Worker emits logs and events (`completed`, `failed`) and the queue honours the retry/backoff policy if a job throws an uncaught error.

### Concurrency, retries, and scaling

- The current worker uses BullMQ `Worker` without an explicit `concurrency` option (default is 1); you can increase concurrency by passing a concurrency parameter when creating the worker to process multiple jobs simultaneously.
- Queue-level retries are configured in the producer (`attempts: 3`, exponential backoff). Failed jobs will be retried according to those settings.

### Security & resource safety

- Containers are created with `NetworkMode: 'none'` and `no-new-privileges` to prevent networking and privilege escalation.
- CPU and memory quotas are enforced and PIDs are limited to guard against fork bombs.
- Logs are sanitized to remove binary/control chars before comparison to avoid false mismatches.

### Troubleshooting tips

- Check worker logs (configured via `src/config/logger.config.ts`) for job lifecycle messages and errors.
- If test outputs look wrong, inspect raw container logs captured in `runCode` (they are processed by `processLogs`).
- For TLEs, consider increasing the timeout in `src/config/language.config.ts` for the affected language.
- If containers fail to start or `docker` errors appear, ensure Docker daemon is running and the image (e.g., `python:3.8-slim` or `gcc`) is pullable.

This section aims to make it easy to reason about how a submission moves from creation → queue → worker → container → result update. If you want, I can also add a sequence diagram and a small example job (JSON) you can paste into a Redis CLI for manual testing.

## Containers

- The service pulls language runtime images on start (see `pullImage.util.ts` and `pullALLImages()` call during server start).
- `codeRunner` executes code in an image, with `input` and `timeout` controls.
- Running the service requires Docker available locally (or a remote daemon accessible from this host).

## Environment Variables (see `src/config/index.ts`)

- `PORT` (default: 3002)
- `PROBLEM_SERIVCE` — base URL for Problem Service
- `SUBMISSION_SERIVCE` — base URL for Submission Service
- `API_GATEWAY` — optional gateway URL used for cross-service calls

## Redis & BullMQ

- The worker creates a connection using `createNewRedisConnection()` and listens on `SUBMISSION_QUEUE`.
- Errors in jobs are logged and retried (see worker config). Worker emits `completed` / `failed` events for observability.

## Running Locally

Prerequisites: Docker, Redis, Node 18+, and the other services running (submissionService & problemService).

```bash
# start Redis
docker run -d -p 6379:6379 --name redis redis:latest

# install
npm install

# run service
npm run dev
```

## Notes & Troubleshooting

- Ensure Docker has permissions and enough resources to start container runtimes.
- If container images can't be pulled, check network and Docker registry credentials.
- Use logs from `src/config/logger.config.ts` to debug job failures.

---

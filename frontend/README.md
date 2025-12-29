# AlgoQuest Frontend

This folder contains a Next.js 16 frontend scaffold for the AlgoQuest code submission platform.

Quick start (requires Node 18+):

1. cd into the frontend folder

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```


3. Run the dev server (defaults to port 5000)

```bash
npm run dev
```

4. Open http://localhost:5000

Notes:
- The UI expects the backend microservices to run locally at:
  - Problem Service: `http://localhost:3000/v1`
  - Submission Service: `http://localhost:3001/v1`
  - Evaluation Service: `http://localhost:3002/v1`
- The editor uses `@monaco-editor/react` with client-side rendering only.
- This is a scaffold: extend the components and styling with ShadCN tokens or your design system as desired.

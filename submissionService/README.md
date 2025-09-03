# Submission Service

A Node.js/Express TypeScript microservice for handling code submission management and evaluation queue processing. This service manages code submissions, integrates with external problem services, and processes submissions through a Redis-based queue system.

## Features

- **Submission Management**: Create, retrieve, update, and delete code submissions
- **Queue Processing**: Redis-based submission evaluation using BullMQ
- **Problem Integration**: Fetches problem details from external problem service
- **Request Correlation**: Correlation ID tracking for distributed tracing
- **Structured Logging**: Winston-based logging with daily rotation
- **Data Validation**: Zod schema validation for request/response
- **MongoDB Integration**: Mongoose ODM for data persistence
- **Error Handling**: Custom error classes with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Queue**: Redis with BullMQ
- **Validation**: Zod
- **Logging**: Winston with daily rotation
- **Development**: Nodemon for hot reloading

## API Endpoints

### Submissions
- `POST /api/v1/submissions/create` - Create a new submission
- `GET /api/v1/submissions/:id` - Get submission by ID
- `GET /api/v1/submissions/problem/:problemId` - Get submissions by problem ID
- `PATCH /api/v1/submissions/:id/status` - Update submission status
- `DELETE /api/v1/submissions/:id` - Delete submission

## Data Models

### Submission Schema
```typescript
{
  problemId: string,        // Required: Problem identifier
  code: string,            // Required: Submission code
  language: "cpp" | "python", // Required: Programming language
  status: "pending" | "compiling" | "running" | "accepted" | "wrong_answer",
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001

# Database
MONGO_URI=mongodb://localhost:27017/submissionService

# External Services
PROBLEM_SERVICE=http://localhost:3000/api/v1

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd submissionService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or use local MongoDB installation
   mongod --dbpath /your/db/path
   ```

5. **Start Redis**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 --name redis redis:latest
   
   # Or use local Redis installation
   redis-server
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Build and run production**
   ```bash
   npm run start
   ```

## Project Structure

```
submissionService/
├── src/
│   ├── apis/                 # External API integrations
│   │   └── problem.api.ts   # Problem service integration
│   ├── config/              # Configuration files
│   │   ├── index.ts         # Environment configuration
│   │   ├── db.ts           # MongoDB connection
│   │   ├── redis.config.ts  # Redis configuration
│   │   └── logger.config.ts # Winston logging setup
│   ├── controllers/         # Route handlers
│   │   ├── ping.controller.ts
│   │   └── submission.controller.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── correlation.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/              # Database schemas
│   │   └── submission.model.ts
│   ├── producers/           # Queue job producers
│   │   └── submission.producer.ts
│   ├── queues/              # Queue configurations
│   │   └── submission.queues.ts
│   ├── repositories/        # Database operations
│   │   └── submission.repository.ts
│   ├── routers/             # Route definitions
│   │   └── v1/
│   │       ├── index.router.ts
│   │       ├── ping.router.ts
│   │       └── submission.router.ts
│   ├── services/            # Business logic
│   │   └── submission.service.ts
│   ├── utils/               # Utility functions
│   │   ├── errors/          # Custom error classes
│   │   └── helpers/         # Helper functions
│   ├── validators/          # Request validation schemas
│   │   ├── index.ts
│   │   ├── ping.validator.ts
│   │   └── submission.validator.ts
│   └── server.ts           # Application entry point
├── logs/                   # Application logs (auto-generated)
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```


## Queue Processing

The service uses BullMQ for processing submission evaluation jobs:

- Submissions are automatically queued for evaluation after creation
- Queue processes jobs with exponential backoff retry strategy
- Failed jobs are retried up to 3 times
- Queue events are logged for monitoring

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run build` - Build TypeScript to JavaScript

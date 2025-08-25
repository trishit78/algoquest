# Problem Service

A Node.js/Express TypeScript microservice for managing coding problems in the AlgoQuest platform. This service provides CRUD operations for algorithmic problems including test cases, difficulty levels, and problem descriptions.

## Features

- 🔧 **CRUD Operations**: Create, read, update, and delete coding problems
- 📊 **MongoDB Integration**: Persistent storage with Mongoose ODM
- 🔍 **Request Tracing**: Correlation ID middleware for tracking requests
- 📝 **Structured Logging**: Winston logger with daily rotating files
- ✅ **Input Validation**: Zod schema validation for request bodies
- 🎯 **TypeScript**: Full TypeScript support with strict type checking
- 🚀 **Express.js**: RESTful API endpoints
- 🛡️ **Error Handling**: Custom error classes and centralized error middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Logging**: Winston with daily rotate file
- **Dev Tools**: Nodemon, ts-node

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── db.ts           # Database connection
│   ├── index.ts        # Environment configuration
│   └── logger.config.ts # Winston logger setup
├── controllers/         # Request handlers
│   ├── ping.controller.ts
│   └── problem.controller.ts
├── dtos/               # Data Transfer Objects
│   └── problem.dto.ts
├── middlewares/        # Express middlewares
│   ├── correlation.middleware.ts
│   └── error.middleware.ts
├── models/             # Mongoose schemas
│   └── problem.ts
├── repositories/       # Data access layer
│   └── problem.repositories.ts
├── routers/           # Route definitions
│   └── v1/
│       ├── index.router.ts
│       ├── ping.router.ts
│       └── problem.router.ts
├── services/          # Business logic layer
│   └── problem.service.ts
├── utils/             # Utility functions
│   ├── errors/        # Custom error classes
│   └── helpers/       # Helper functions
├── validators/        # Zod schemas
│   ├── index.ts
│   └── ping.validator.ts
└── server.ts          # Application entry point
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trishit78/algoquest.git
   cd problemService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

4. **Environment Variables**
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/problemService
   ```

## Usage

### Development
```bash
npm run dev
```

The server will start on `http://localhost:3001` (or your configured PORT).

## API Endpoints
### Problems
- `POST /api/v1/problems/create` - Create a new problem
- `GET /api/v1/problems` - Get all problems
- `GET /api/v1/problems/:id` - Get a specific problem
- `PUT /api/v1/problems/:id` - Update a problem
- `DELETE /api/v1/problems/:id` - Delete a problem

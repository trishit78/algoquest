# AlgoQuest - Code Submission Platform

<div align="center">

<img width="857" height="473" alt="image" src="https://github.com/user-attachments/assets/e218f6de-0503-4f79-ae7d-45162994f765" />


**A Modern, Fast, LeetCode-Style Code Submission Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[Features](#-features) • [Demo](#-video-demo) • [Architecture](#️-architecture) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Tech Stack](#-tech-stack)

</div>

---


## 📹 Video Demo


https://github.com/user-attachments/assets/5ce39dd4-7828-41d7-a790-31017a407ff2


---

## 🌟 Features

### For Users
- 🎯 **Problem Library** - Curated coding problems with difficulty levels (Easy, Medium, Hard)
- 💻 **Multi-Language Support** - Write solutions in Python, C++, and JavaScript
- ⚡ **Real-Time Evaluation** - Instant feedback with test case results
- 📊 **Leaderboard** - Compete with other users and track your progress
- 🔐 **Secure Authentication** - JWT-based authentication system
- 📝 **Code Editor** - Monaco editor with syntax highlighting
- 🎨 **Modern UI** - Clean, responsive design with dark mode

### For System
- 🐳 **Isolated Execution** - Docker containers for secure code execution
- 🔄 **Queue-Based Processing** - BullMQ for reliable job processing
- 🛡️ **Security Features** - Network isolation, resource limits, privilege restrictions
- 📈 **Scalable Architecture** - Microservices-based design
- 🔍 **Request Tracing** - Correlation IDs for debugging
- 📊 **Structured Logging** - Winston logger with daily rotation

---

## 🎯 How It Works

AlgoQuest follows a sophisticated microservices architecture to provide a seamless code evaluation experience:

### 1️⃣ User Submission Flow
```
User writes code → Frontend sends to API Gateway → Submission Service validates & queues → Evaluation Worker executes → Results returned
```

### 2️⃣ Code Evaluation Process
1. **Submission Creation**: User submits code through the frontend
2. **Validation**: Problem existence is verified via Problem Service
3. **Queueing**: Submission is added to Redis queue with retry logic
4. **Container Creation**: Docker container is created with security constraints
5. **Execution**: Code runs against test cases with timeout enforcement
6. **Result Processing**: Output is compared and status is determined (AC/WA/TLE/Error)
7. **Database Update**: Results are stored and leaderboard is updated
8. **Real-Time Updates**: Frontend polls for results every 2 seconds

---

## 🏗️ Architecture

### System Architecture Diagram
<img width="795" height="874" alt="image" src="https://github.com/user-attachments/assets/27b5c012-d683-401d-ad5a-2c0266caf043" />


### Code Evaluation Flow
<img width="1077" height="862" alt="image" src="https://github.com/user-attachments/assets/d2df9e7e-e378-4cef-b4cb-6bb9a429aba5" />


### Microservices Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│                    (React + Next.js Frontend)                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                             │
│              (Port 5000 - Auth & Route Proxying)               │
└─────────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Problem Service  │  │Submission Service│  │Leaderboard Service│
│   (Port 3000)    │  │   (Port 3001)    │  │   (Port 4501)    │
│   - MongoDB      │  │   - MongoDB      │  │   - Redis        │
└──────────────────┘  └──────────────────┘  └──────────────────┘
                              ↓
                      ┌──────────────────┐
                      │  Redis Queue     │
                      │   (BullMQ)       │
                      └──────────────────┘
                              ↓
                      ┌──────────────────┐
                      │Evaluation Service│
                      │   (Port 3002)    │
                      │   - Docker       │
                      └──────────────────┘
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v5.0 or higher)
- **Redis** (v6.0 or higher)
- **Docker** (v20.10 or higher)
- **npm** or **yarn**

### Quick Start

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/algoquest.git
cd algoquest
```

#### 2. Start Infrastructure Services
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:latest

# Start Redis
docker run -d -p 6379:6379 --name redis redis:latest
```

#### 3. Configure Environment Variables

Create `.env` files in each service directory:

**API Gateway** (`api gateway/.env`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/algoquest_auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
PROBLEM_SERVICE=http://localhost:3000
SUBMISSION_SERVICE=http://localhost:3001
LEADERBOARD=http://localhost:4501
```

**Problem Service** (`problemService/.env`):
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/problemService
```

**Submission Service** (`submissionService/.env`):
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/submissionService
PROBLEM_SERVICE=http://localhost:3000/api/v1
JWT_SECRET=your_jwt_secret_here
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Evaluation Service** (`evaluationService/.env`):
```env
PORT=3002
PROBLEM_SERVICE=http://localhost:3000/api/v1
SUBMISSION_SERVICE=http://localhost:3001/api/v1
API_GATEWAY=http://localhost:5000
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Leaderboard Service** (`leaderboard/.env`):
```env
PORT=4501
REDIS_HOST=localhost
REDIS_PORT=6379
KEY=algoquest_leaderboard
```

#### 4. Install Dependencies & Start Services

```bash
# Terminal 1 - API Gateway
cd "api gateway"
npm install
npm run dev

# Terminal 2 - Problem Service
cd problemService
npm install
npm run dev

# Terminal 3 - Submission Service
cd submissionService
npm install
npm run dev

# Terminal 4 - Evaluation Service
cd evaluationService
npm install
npm run dev

# Terminal 5 - Leaderboard Service
cd leaderboard
npm install
npm run dev

# Terminal 6 - Frontend
cd frontend
npm install
npm run dev
```

#### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000 (or configured port)
- **API Gateway**: http://localhost:5000

---

## 📚 API Documentation

### API Gateway (Port 5000)

#### Authentication Endpoints

##### Sign Up
```http
POST /api/v1/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User signed up successfully",
  "data": {
    "userId": "...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

##### Sign In
```http
POST /api/v1/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User signed in successfully",
  "data": {
    "userDetails": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

##### Get User by ID
```http
GET /api/v1/user/:id
Authorization: Bearer <token>
```

---

### Problem Service (Port 3000)

#### Problem Management

##### Create Problem
```http
POST /api/v1/problems/create
Content-Type: application/json

{
  "title": "Two Sum",
  "description": "Given an array of integers...",
  "difficulty": "easy",
  "testcases": [
    { "input": "2 7 11 15\n9", "output": "0 1" }
  ],
  "editorial": "## Approach 1: Hash Map..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Problem created successfully",
  "data": {
    "_id": "...",
    "title": "Two Sum",
    "difficulty": "easy"
  }
}
```

##### Get All Problems
```http
GET /api/v1/problems
```

**Response:**
```json
{
  "success": true,
  "message": "All Problems fetched",
  "data": [
    {
      "_id": "...",
      "title": "Two Sum",
      "difficulty": "easy"
    }
  ]
}
```

##### Get Problem by ID
```http
GET /api/v1/problems/:id
```

##### Update Problem
```http
PUT /api/v1/problems/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "difficulty": "medium"
}
```

##### Delete Problem
```http
DELETE /api/v1/problems/:id
```

##### Get Problems by Difficulty
```http
GET /api/v1/problems/difficulty/:difficulty
# difficulty: easy | medium | hard
```

##### Search Problems
```http
GET /api/v1/problems/search?query=array
```

---

### Submission Service (Port 3001)

#### Submission Management

##### Create Submission
```http
POST /api/v1/submissions/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "problemId": "6420a...",
  "code": "def solution():\n    return sum(map(int, input().split()))",
  "language": "python"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Problem submitted successfully",
  "data": {
    "_id": "...",
    "status": "pending",
    "problemId": "6420a...",
    "userId": "...",
    "language": "python",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

##### Get User Submissions
```http
GET /api/v1/submissions?problemId=<id>
Authorization: Bearer <token>
```

##### Get Submission by ID
```http
GET /api/v1/submissions/:submissionId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "completed",
    "submissionData": {
      "testcase_1": "AC",
      "testcase_2": "WA"
    }
  }
}
```

##### Update Submission Status (Internal)
```http
PATCH /api/v1/submissions/:id/status
Content-Type: application/json

{
  "status": "completed",
  "submissionData": {
    "testcase_1": "AC",
    "testcase_2": "WA"
  }
}
```

##### Delete Submission
```http
DELETE /api/v1/submissions/:id
Authorization: Bearer <token>
```

---

### Leaderboard Service (Port 4501)

#### Leaderboard Management

##### Add User to Leaderboard
```http
PUT /api/v1/adduser
Content-Type: application/json

{
  "userData": "johndoe",
  "score": "0"
}
```

##### Increment User Score
```http
POST /api/v1/increment
Content-Type: application/json

{
  "userData": "johndoe",
  "score": "10"
}
```

##### Get Leaderboard
```http
GET /api/v1/leaderboard
```

**Response:**
```json
{
  "success": true,
  "message": "Leaderboard data fetched",
  "data": [
    { "user": "alice", "score": 100 },
    { "user": "bob", "score": 90 }
  ]
}
```

---

## 🔑 Authentication Flow

1. User signs up via `POST /api/v1/signup`
2. User signs in via `POST /api/v1/signin` and receives JWT token
3. Token is stored in localStorage
4. All authenticated requests include `Authorization: Bearer <token>` header
5. API Gateway validates token before forwarding to services

---

## 🧪 Testing the Platform

### 1. Create a Test User
```bash
curl -X POST http://localhost:5000/api/v1/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Sign In
```bash
curl -X POST http://localhost:5000/api/v1/signin \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a Problem
```bash
curl -X POST http://localhost:3000/api/v1/problems/create \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Sum of Two Numbers",
    "description": "Given two integers, return their sum",
    "difficulty": "easy",
    "testcases": [
      {"input": "5\n10", "output": "15"},
      {"input": "1\n1", "output": "2"}
    ]
  }'
```

### 4. Submit a Solution
```bash
curl -X POST http://localhost:5000/submissionservice/api/v1/submissions/create \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "problemId": "PROBLEM_ID",
    "code": "a = int(input())\nb = int(input())\nprint(a + b)",
    "language": "python"
  }'
```

---

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 16, React 18
- **Styling**: Tailwind CSS, Framer Motion
- **Code Editor**: Monaco Editor
- **State Management**: React Hooks
- **HTTP Client**: Axios

### Backend Services
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod

### Databases
- **MongoDB**: User data, problems, submissions
- **Redis**: Job queue, leaderboard (sorted sets)

### Queue System
- **BullMQ**: Job processing with retry logic
- **ioredis**: Redis client

### Code Execution
- **Docker**: Isolated container execution
- **Images**: 
  - Python: `python:3.8-slim`
  - C++: `gcc:latest`
  - JavaScript: `node:18-alpine`

### Logging & Monitoring
- **Winston**: Structured logging
- **Daily Rotate File**: Log rotation
- **Correlation IDs**: Request tracing

---

## 📂 Project Structure

```
algoquest/
├── api gateway/              # Authentication & API Gateway
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # User model
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── problemService/          # Problem Management
│   ├── src/
│   │   ├── controllers/     # Problem CRUD
│   │   ├── models/          # Problem schema
│   │   ├── repositories/    # Data access
│   │   ├── services/        # Business logic
│   │   └── validators/      # Zod schemas
│   └── package.json
│
├── submissionService/       # Submission Management
│   ├── src/
│   │   ├── controllers/     # Submission handlers
│   │   ├── models/          # Submission schema
│   │   ├── producers/       # Queue producers
│   │   ├── queues/          # BullMQ configuration
│   │   └── services/        # Business logic
│   └── package.json
│
├── evaluationService/       # Code Evaluation
│   ├── src/
│   │   ├── workers/         # BullMQ workers
│   │   ├── utils/
│   │   │   └── containers/  # Docker utilities
│   │   └── config/          # Service config
│   └── package.json
│
├── leaderboard/            # Leaderboard Service
│   ├── src/
│   │   ├── repository/     # Redis operations
│   │   └── service/        # Business logic
│   └── package.json
│
└── frontend/               # Next.js Frontend
    ├── app/                # App router pages
    ├── components/         # React components
    └── package.json
```

---

## 🔒 Security Features

### Container Security
- **Network Isolation**: `NetworkMode: 'none'`
- **Memory Limit**: 1GB per container
- **CPU Quota**: 50% CPU usage (50000/100000)
- **Process Limit**: Max 100 PIDs (prevents fork bombs)
- **No Privilege Escalation**: `no-new-privileges` flag
- **Timeout Enforcement**: 5-second execution limit

### Application Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured CORS policies
- **Error Handling**: Centralized error middleware

### Code Execution Safety
- **Log Sanitization**: Removes control characters
- **Resource Monitoring**: CPU and memory tracking
- **Container Cleanup**: Automatic removal after execution
- **Retry Logic**: 3 attempts with exponential backoff

---

## 📊 Data Flow

### Submission to Result Flow

```
┌─────────────┐
│ User Submits│
│    Code     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Gateway │
│    Auth     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Submission  │
│   Service   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌──────────────┐
│  Validate   │────▶│   Problem    │
│   Problem   │     │   Service    │
└──────┬──────┘     └──────────────┘
       │
       ▼
┌─────────────┐
│  Save to    │
│   MongoDB   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Add to    │
│ Redis Queue │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Evaluation  │
│   Worker    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Create    │
│   Docker    │
│  Container  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Execute   │
│    Code     │
└──────┬──────┘
       │
       ▼
   ┌──────┐
   │Tests?│
   └──┬───┘
      │
      ├─Yes──▶┌────────────┐
      │        │  Completed │
      │        └─────┬──────┘
      │              │
      ├─Partial─▶┌──────────┐
      │           │Attempted │
      │           └────┬─────┘
      │                │
      └─None───▶┌──────────┐
                 │  Failed  │
                 └────┬─────┘
                      │
                      ▼
              ┌──────────────┐
              │    Update    │
              │  Leaderboard │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │    Update    │
              │   MongoDB    │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   Frontend   │
              │ Polls Status │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   Display    │
              │   Results    │
              └──────────────┘
```

---

## 🎮 Usage Examples

### Example Problem: Two Sum

**Problem Statement:**
```
Given an array of integers nums and an integer target, 
return indices of the two numbers such that they add up to target.

Input: nums = [2,7,11,15], target = 9
Output: [0,1]
```

**Python Solution:**
```python
nums = list(map(int, input().split()))
target = int(input())

seen = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        print(seen[complement], i)
        break
    seen[num] = i
```

**C++ Solution:**
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums;
    int n, target;
    while (cin >> n) nums.push_back(n);
    target = nums.back();
    nums.pop_back();
    
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            cout << seen[complement] << " " << i;
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
```

**JavaScript Solution:**
```javascript
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const nums = lines[0].split(' ').map(Number);
    const target = parseInt(lines[1]);
    
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            console.log(seen.get(complement), i);
            return;
        }
        seen.set(nums[i], i);
    }
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker containers not starting
```bash
# Check Docker daemon
docker ps

# Check Docker logs
docker logs evaluation-service

# Restart Docker service
sudo systemctl restart docker
```

#### 2. MongoDB connection errors
```bash
# Verify MongoDB is running
docker ps | grep mongo

# Check connection string
echo $MONGO_URI

# Test connection
mongosh mongodb://localhost:27017
```

#### 3. Redis connection errors
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# Check Redis logs
docker logs redis
```

#### 4. Evaluation service timeout
- Increase timeout in `evaluationService/src/config/language.config.ts`
- Check Docker resource limits
- Verify container has adequate memory

#### 5. Frontend not connecting to backend
- Verify all services are running
- Check CORS configuration in API Gateway
- Verify API Gateway port (5000)
- Check browser console for errors

#### 6. Port conflicts
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### 7. Queue jobs not processing
```bash
# Check Redis queue
redis-cli
KEYS *

# Monitor queue
npm run dev -- --inspect
```

---

## 🚀 Deployment

### Using Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: algoquest-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - algoquest-network

  redis:
    image: redis:latest
    container_name: algoquest-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - algoquest-network

  api-gateway:
    build:
      context: ./api gateway
      dockerfile: Dockerfile
    container_name: algoquest-gateway
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/algoquest_auth
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis
    networks:
      - algoquest-network

  problem-service:
    build:
      context: ./problemService
      dockerfile: Dockerfile
    container_name: algoquest-problems
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/problemService
    depends_on:
      - mongodb
    networks:
      - algoquest-network

  submission-service:
    build:
      context: ./submissionService
      dockerfile: Dockerfile
    container_name: algoquest-submissions
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/submissionService
      - REDIS_HOST=redis
    depends_on:
      - mongodb
      - redis
    networks:
      - algoquest-network

  evaluation-service:
    build:
      context: ./evaluationService
      dockerfile: Dockerfile
    container_name: algoquest-evaluation
    ports:
      - "3002:3002"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis
    networks:
      - algoquest-network

  leaderboard-service:
    build:
      context: ./leaderboard
      dockerfile: Dockerfile
    container_name: algoquest-leaderboard
    ports:
      - "4501:4501"
    environment:
      - REDIS_HOST=redis
    depends_on:
      - redis
    networks:
      - algoquest-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: algoquest-frontend
    ports:
      - "80:3000"
    depends_on:
      - api-gateway
    networks:
      - algoquest-network

volumes:
  mongo-data:
  redis-data:

networks:
  algoquest-network:
    driver: bridge
```

Start all services:
```bash
docker-compose up -d
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

### Production Considerations

#### Infrastructure
- Use environment-specific `.env` files
- Implement proper logging and monitoring (ELK Stack, Prometheus + Grafana)
- Set up CI/CD pipelines (GitHub Actions, Jenkins)
- Configure reverse proxy (Nginx, Traefik)
- Enable HTTPS with SSL certificates (Let's Encrypt)
- Implement rate limiting
- Set up database backups
- Use managed services for MongoDB and Redis (AWS, GCP, Azure)

#### Security
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Implement API key rotation
- Enable DDoS protection
- Add Web Application Firewall (WAF)
- Regular security audits
- Dependency vulnerability scanning

#### Scalability
- Implement horizontal pod autoscaling (Kubernetes)
- Use load balancers (AWS ELB, Nginx)
- Database read replicas
- Redis clustering
- CDN for static assets (CloudFront, Cloudflare)

#### Monitoring
- Application Performance Monitoring (New Relic, Datadog)
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Log aggregation (ELK Stack)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages (Conventional Commits)
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Run linters before committing
- Ensure all tests pass

### Code Style

- Use ESLint and Prettier
- Follow Airbnb style guide
- Use async/await over promises
- Write descriptive variable names
- Add JSDoc comments for complex functions

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Inspired by LeetCode, HackerRank, and CodeForces
- Built with modern web technologies
- Community feedback and contributions
- Open source libraries and tools

---



<div align="center">

**Made with ❤️ by the AlgoQuest Team**

⭐ Star us on GitHub — it helps!

[⬆ Back to Top](#algoquest---code-submission-platform)

</div>

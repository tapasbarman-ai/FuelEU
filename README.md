# FuelEU Maritime Compliance Platform

A full-stack monorepo platform designed to manage and track FuelEU Maritime regulation compliance. It handles the baseline setting, intensity comparison, banking (Article 20), and pooling (Article 21) processes.

## Architecture Map

```mermaid
graph TD
    subgraph Frontend [Frontend (React + Vite)]
        UI[Pages & Tabs] --> Hooks[Adapters/Hooks]
        Hooks --> ApiAdapter[API Ports/Axios]
        Hooks --> CoreFE[Core Use Cases]
    end

    subgraph Backend [Backend (Node + Express)]
        RouteAdapter[HTTP Routers] --> Services[Core Use Cases / Services]
        Services --> CoreBE[Core Domain & Value Objects]
        Services --> RepoAdapter[Prisma Repositories]
    end

    ApiAdapter -->|HTTP / JSON| RouteAdapter
    RepoAdapter --> DB[(PostgreSQL)]
```

## Prerequisites
- Node.js 20+
- PostgreSQL 15+ (can use `docker-compose up -d`)
- `npm` v10+

## Setup Instructions

1. **Install dependencies:**  
   Navigate to the root directory and run:
   ```bash
   npm install --workspaces
   ```

2. **Start Database:**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup (Migrations & Seed):**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run seed
   cd ..
   ```

4. **Run Development Server:**
   From the root of the project:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:3001`

5. **Run Tests:**
   From the root of the project:
   ```bash
   npm run test
   ```

## Sample cURL Requests

**Routes**
```bash
curl -X GET http://localhost:3001/routes
```

**Compliance**
```bash
curl -X GET "http://localhost:3001/compliance/cb?shipId=R002&year=2024"
```

**Banking**
```bash
curl -X POST http://localhost:3001/banking/bank \
     -H "Content-Type: application/json" \
     -d '{"shipId": "R002", "year": 2024}'
```

**Pooling**
```bash
curl -X POST http://localhost:3001/pools \
     -H "Content-Type: application/json" \
     -d '{"year": 2024, "members": [{"shipId": "R001", "allocationCb": -263082240}, {"shipId": "R002", "allocationCb": 263082240}]}'
```

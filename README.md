# 🚢 FuelEU Maritime Compliance Platform

> A production-grade full-stack monorepo platform for managing **FuelEU Maritime Regulation** compliance — built with a strict **Hexagonal Architecture (Ports & Adapters)** pattern.

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [What Is This Project?](#-what-is-this-project)
- [FuelEU Regulation Overview](#-fueleu-regulation-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Run (Quick Start)](#-how-to-run-quick-start)
- [How to Run (With Database)](#-how-to-run-with-database)
- [Running Tests](#-running-tests)
- [CI/CD Pipeline & DevOps](#-cicd-pipeline--devops)
- [Architecture Overview](#-architecture-overview)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)

---

## 🌍 What Is This Project?

The **FuelEU Maritime Compliance Platform** is a digital tool designed to help shipping companies and port authorities **calculate, track, and manage compliance** with the European Union's **FuelEU Maritime Regulation**.

Effective from **2025**, FuelEU Maritime mandates that ships calling at European ports must progressively reduce their average annual GHG (Greenhouse Gas) intensity. This platform provides the tools to:

- Set a **reference baseline** route for intensity comparisons
- **Compare** all routes / voyages against the baseline
- Manage **GHG Credit Banking** (Article 20) — carry over surplus credits to next year
- Manage **Compliance Pooling** (Article 21) — allow multiple vessels to share their compliance balance

---

## 📜 FuelEU Regulation Overview

| Year | GHG Reduction Target (vs 2020 baseline) |
|------|------------------------------------------|
| 2025 | -2%   |
| 2030 | -6%   |
| 2035 | -14.5%|
| 2040 | -31%  |
| 2045 | -62%  |
| 2050 | -80%  |

The platform calculates the **Compliance Balance (Cb)** for each ship:

```
Cb = (GHG_limit − GHG_actual) × Energy_consumed
```

- **Positive Cb** → Surplus (ship is compliant, can bank or pool the balance)
- **Negative Cb** → Deficit (ship is non-compliant, must offset via pooling or pay penalty)

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| **Routes** | View all registered voyage routes with fuel type, GHG intensity, and emissions |
| **Baseline** | Set any route as the FuelEU baseline for percentage comparisons |
| **Compare** | Side-by-side GHG intensity comparison of all routes against the baseline |
| **Banking** | Bank surplus GHG credits (Article 20) and apply them to future years |
| **Pooling** | Create compliance pools across multiple vessels (Article 21) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript (strict), TailwindCSS, Recharts |
| **Backend** | Node.js 20, TypeScript (strict), Express.js |
| **ORM** | Prisma 5 |
| **Database** | PostgreSQL 15 (Docker) |
| **Frontend Tests** | Vitest + React Testing Library |
| **Backend Tests** | Jest + Supertest |
| **Containerization** | Docker & Docker Compose (Multi-stage optimized) |
| **CI/CD** | GitHub Actions (6-Stage Pipeline) |
| **Security Scanning** | Trivy (Vulnerabilities), Gitleaks (Secrets), CodeQL (SAST) |
| **Quality Gate** | SonarCloud / SonarQube |
| **Registry** | Docker Hub |

---

## 📁 Project Structure

```
├── package.json                      ← Root workspace config (npm workspaces)
├── Dockerfile                        ← Multi-stage optimized production build
├── docker-compose.yml                ← Full stack (DB + App) orchestration
├── sonar-project.properties          ← SonarQube analysis config
├── .github/
│   └── workflows/
│       └── ci.yml                    ← 6-Stage GitHub Actions pipeline config
├── .gitignore
├── README.md
│
├── backend/                          ← Node.js + Express API
│   ├── src/
│   │   ├── core/                     ← Pure domain logic (NO framework deps)
│   │   │   ├── domain/
│   │   │   │   ├── entities/         ← Route, ShipCompliance, BankEntry, Pool
│   │   │   │   ├── value-objects/    ← GhgIntensity, ComplianceBalance
│   │   │   │   └── errors/           ← DomainError, ValidationError, NotFoundError
│   │   │   └── application/
│   │   │       ├── ports/
│   │   │       │   ├── inbound/      ← Service interfaces (IRouteService, IBankingService…)
│   │   │       │   └── outbound/     ← Repository interfaces (IRouteRepository…)
│   │   │       └── use-cases/        ← RouteService, ComplianceService, BankingService, PoolService
│   │   │
│   │   ├── adapters/
│   │   │   ├── inbound/
│   │   │   │   └── http/
│   │   │   │       ├── routes/       ← Express routers (routeRouter, bankingRouter…)
│   │   │   │       ├── middleware/   ← errorHandler, validateSchema (Zod)
│   │   │   │       └── dto/          ← Zod validation schemas
│   │   │   └── outbound/
│   │   │       ├── postgres/
│   │   │       │   └── repositories/ ← PrismaRouteRepo, PrismaBankEntryRepo…
│   │   │       └── mock/             ← MockRouteRepo, MockBankEntryRepo… (no DB needed)
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── container/            ← Dependency injection container
│   │   │   ├── db/prisma/seed.ts     ← Database seed script
│   │   │   └── server/               ← Express app + server bootstrap
│   │   └── shared/
│   │       └── constants.ts          ← FuelEU baseline limit constants
│   │
│   ├── tests/
│   │   ├── unit/                     ← Pure domain logic tests
│   │   └── integration/              ← HTTP endpoint tests (Supertest)
│   ├── prisma/schema.prisma          ← Database schema
│   ├── .env                          ← Local environment variables
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/                         ← React 18 SPA
    ├── src/
    │   ├── core/                     ← Pure frontend domain logic
    │   │   ├── domain/               ← Frontend types and value objects
    │   │   ├── application/
    │   │   │   └── use-cases/        ← computeComparison, validatePool
    │   │   └── ports/                ← Frontend port interfaces
    │   │
    │   └── adapters/
    │       └── ui/
    │           ├── pages/            ← DashboardPage (root layout)
    │           ├── tabs/             ← RoutesTab, CompareTab, BankingTab, PoolingTab
    │           ├── components/       ← DataTable, FilterBar, Charts
    │           └── hooks/            ← useRoutes, useCompliance, useBanking, usePooling
    │
    ├── tests/
    │   └── unit/                     ← Vitest unit tests
    ├── .env                          ← Frontend environment variables
    └── package.json
```

---

## ⚡ How to Run (Quick Start — No Database Needed)

The platform ships with a **Mock Data Mode** so you can run it without Docker or PostgreSQL.

### Prerequisites
- [Node.js 20+](https://nodejs.org/en/download)
- npm 9+

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/tapasbarman-ai/FuelEU.git
cd FuelEU
```

**2. Install all dependencies**
```bash
npm install
```

**3. Ensure Mock Mode is enabled**

Check that `backend/.env` contains:
```env
USE_MOCK_DATA=true
```

**4. Start the full application**
```bash
npm run dev
```

**5. Open in your browser**

| Service | URL |
|---------|-----|
| 🖥️ Frontend (UI) | http://localhost:5173 |
| 🔌 Backend API   | http://localhost:3001 |

> If port `5173` is in use, Vite will automatically try `5174`, `5175`, etc.

### ⚠️ If you get "Port already in use" errors
Kill all running Node processes and retry:
```powershell
# Windows PowerShell
Get-Process -Name node | Stop-Process -Force
npm run dev
```

---

## 🐋 How to Run (With Docker — Pre-built from Docker Hub)

The easiest way to run the entire production-ready stack is using the pre-built image from Docker Hub.

**1. Set your Docker Hub username environment variable:**
```powershell
# Windows
$env:DOCKERHUB_USERNAME="tapas132"
```

**2. Start the full stack:**
```bash
docker-compose up -d
```
This will:
- Pull the latest `fueleu-app` image from Docker Hub.
- Start a `postgres:15` database.
- Automatically connect the app to the database.
- Serve the **Frontend** and **Backend** on a single port (**3001**).

**3. Open in your browser:**
- URL: [http://localhost:3001](http://localhost:3001)

---

## 🚀 CI/CD Pipeline & DevOps

This project features a robust **6-stage automated pipeline** via GitHub Actions:

```mermaid
graph LR
    Push[Push Code] --> Lint[Stage 1: Lint]
    Lint --> Test[Stage 2: Tests]
    Test --> Security[Stage 3: Security]
    Test --> Sonar[Stage 4: Sonar]
    Security --> Build[Stage 5: Docker Build]
    Sonar --> Build
    Build --> Trivy[Stage 6: Trivy Scan]
    Trivy --> PushHub[Push to Docker Hub]
```

### Pipeline Details:
1.  **Lint**: Enforces TypeScript/React code standards using ESLint.
2.  **Unit Tests**: Runs Vitest (Frontend) and Jest (Backend) suites.
3.  **Security**:
    *   **Gitleaks**: Scans for hardcoded secrets/keys.
    *   **GitHub CodeQL**: Automated SAST (Static Application Security Testing).
    *   **npm audit**: Checks for high/critical vulnerabilities in dependencies.
4.  **SonarCloud**: Deep code quality analysis, coverage tracking, and technical debt monitoring.
5.  **Build Docker**: Creates a multi-stage optimized image using Docker Buildx.
6.  **Trivy Scan**: Scans the final Docker image for OS and library vulnerabilities (high/critical) before it is allowed into production.

---

## 🧪 Running Tests

```bash
# Run backend tests (Jest)
npm run test:backend

# Run frontend tests (Vitest)
npm run test:frontend

# Run all tests
npm test
```

### Backend Test Coverage
| Test File | What It Tests |
|-----------|--------------|
| `computeCB.test.ts` | Compliance Balance calculation |
| `bankSurplus.test.ts` | Banking surplus GHG credits |
| `applyBanked.test.ts` | Applying banked credits |
| `createPool.test.ts` | Pool creation and validation |
| `setBaseline.test.ts` | Setting the baseline route |
| `pools.integration.test.ts` | Full HTTP pool API integration |

### Frontend Test Coverage
| Test File | What It Tests |
|-----------|--------------|
| `computeComparison.test.ts` | GHG intensity comparison logic |
| `validatePool.test.ts` | Pool member validation rules |

---

## 🏛 Architecture Overview

This platform uses **Hexagonal Architecture (Ports & Adapters)**, keeping the business logic completely isolated from infrastructure concerns (Express, Prisma, HTTP, etc.).

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│   Tabs → Hooks → Use Cases → Port Interfaces        │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP (REST API)
┌─────────────────────▼───────────────────────────────┐
│                    BACKEND                           │
│                                                      │
│  ┌──────────────┐   ┌─────────────────────────────┐ │
│  │  Inbound     │   │       CORE (Domain)          │ │
│  │  Adapters    │──▶│  Entities + Value Objects    │ │
│  │  (HTTP/REST) │   │  Use Cases (Services)        │ │
│  └──────────────┘   │  Port Interfaces             │ │
│                     └──────────────┬────────────────┘ │
│  ┌──────────────────────────────── ▼─────────────────┐│
│  │         Outbound Adapters                          ││
│  │   Prisma Repos (PostgreSQL) OR Mock Repos          ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Key Design Principles
- **Domain is pure**: No Express, Prisma, or HTTP code in `src/core/`
- **Dependency Inversion**: Services depend on `IRepository` interfaces, not concrete classes
- **Swappable Infrastructure**: Toggle `USE_MOCK_DATA=true` to swap PostgreSQL for in-memory repos
- **Zod validation**: All incoming HTTP requests are validated via Zod schemas before entering the domain

---

## 🔌 API Reference

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/routes` | Get all voyage routes |
| `POST` | `/routes/:routeId/baseline` | Set a route as the FuelEU baseline |
| `GET` | `/routes/comparison` | Get all routes compared against the baseline |

### Compliance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/compliance/:shipId/:year` | Get Compliance Balance (Cb) for a ship |
| `GET` | `/compliance/:shipId/:year/adjusted` | Get adjusted Cb after banking |

### Banking (Article 20)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/banking/:shipId/:year` | Get all bank entries for a ship/year |
| `POST` | `/banking/:shipId/:year/bank` | Bank surplus GHG credits |
| `POST` | `/banking/:shipId/:year/apply` | Apply banked credits to reduce deficit |

### Pooling (Article 21)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pools` | Create a compliance pool with member ships |

---

## 🔐 Environment Variables

### `backend/.env`
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fueleu"
PORT=3001
NODE_ENV=development
USE_MOCK_DATA=true      # Set to 'false' to use a real PostgreSQL database
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://localhost:3001
```

---

## 📑 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run dev` | Start both frontend and backend (recommended) |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm test` | Run all tests |
| `npm run test:backend` | Run backend Jest tests |
| `npm run test:frontend` | Run frontend Vitest tests |
| `cd backend && npm run migrate` | Run Prisma DB migrations |
| `cd backend && npm run seed` | Seed initial route data |
| `cd backend && npm run build` | Compile backend TypeScript |

---

## 👤 Author

**Tapas Barman**
- GitHub: [@tapasbarman-ai](https://github.com/tapasbarman-ai)
- Email: tapasb.dev@gmail.com

---

> Built on top of the official [FuelEU Maritime Regulation (EU 2023/1805)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1805) calculation methodologies.

# AI Agent Workflow Log

> This document records how **Antigravity (Google DeepMind)** was used as the primary AI coding agent to design, implement, and validate the FuelEU Maritime Compliance Platform.

---

## Agents Used

| Agent | Role |
|-------|------|
| **Antigravity (Google DeepMind)** | Primary agent — full-stack code generation, architecture design, debugging, Git operations |
| **GitHub (repository hosting)** | Version control and code review via incremental commits |

---

## Phase 1 — Architecture Design

### Prompt
```
You are a senior full-stack engineer implementing a production-grade FuelEU Maritime
compliance platform. Build a monorepo with two workspaces: /frontend and /backend.
Tech stack: React 18 + TypeScript strict + TailwindCSS + Recharts | Node.js 20 +
TypeScript strict + Express + Prisma + PostgreSQL. Testing: Vitest + RTL (FE), 
Jest + Supertest (BE). Architecture: Hexagonal (Ports & Adapters). 
Commit history must show incremental progress.
```

### Output
The agent produced the complete directory scaffold:
```
backend/src/
  core/       ← Pure domain: entities, value-objects, errors, use-cases, port interfaces
  adapters/   ← Express HTTP (inbound) + Prisma repositories (outbound)
  infrastructure/ ← DI container, server bootstrap
  shared/     ← computeCB(), percentDiff(), isCompliant() constants
```

### Agent Rationale
By defining hexagonal boundaries upfront, the agent ensured no coupling between Express/Prisma and business logic. The `core/` folder has zero Node/Express imports.

---

## Phase 2 — Domain Modeling

### Prompt
```
Define the Prisma schema for: Route, ShipCompliance, BankEntry, Pool, PoolMember.
Seed R001–R005 routes. Set R001 as baseline. Use the FuelEU Article 20/21 formulas.
```

### Generated: `prisma/schema.prisma`
```prisma
model Route {
  id              String   @id @default(uuid())
  routeId         String   @unique
  vesselType      String
  fuelType        String
  year            Int
  ghgIntensity    Float
  fuelConsumption Float
  distance        Float
  totalEmissions  Float
  isBaseline      Boolean  @default(false)
  createdAt       DateTime @default(now())
}

model ShipCompliance {
  id        String   @id @default(uuid())
  shipId    String
  year      Int
  cbGco2eq  Float
  createdAt DateTime @default(now())

  @@unique([shipId, year])
}
```

### Generated: `shared/constants.ts`
```typescript
export const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ (2% below 91.16)
export const ENERGY_FACTOR = 41_000;     // MJ per tonne of fuel

export function computeCB(ghgIntensity: number, fuelConsumption: number): number {
    const energyInScope = fuelConsumption * ENERGY_FACTOR;
    return (TARGET_INTENSITY - ghgIntensity) * energyInScope;
}

export function percentDiff(baseline: number, comparison: number): number {
    return ((comparison / baseline) - 1) * 100;
}
```

---

## Phase 3 — Backend Use-Cases

### Prompt
```
Implement: RouteService, ComplianceService, BankingService, PoolService.
All must implement their inbound port interfaces. No Express in core/.
ComplianceService computes CB using computeCB() from shared constants.
BankingService validates: you cannot bank if CB <= 0. Cannot apply more than available.
PoolService: greedy allocation. Sort desc by CB. Transfer surplus to deficits.
Enforce: sum(CB) >= 0, deficit ship cannot exit worse, surplus ship cannot exit negative.
```

### Refined Output — PoolService greedy allocator:
```typescript
members.sort((a, b) => b.cbBefore - a.cbBefore);
let surplusPool = members.filter(m => m.cbBefore > 0)
                         .reduce((s, m) => s + m.cbBefore, 0);
for (const m of members) {
    if (m.cbBefore >= 0) {
        m.cbAfter = 0; // surplus ships exit at 0 (transfer surplus)
        continue;
    }
    const transfer = Math.min(-m.cbBefore, surplusPool);
    m.cbAfter = m.cbBefore + transfer;
    surplusPool -= transfer;
}
```

---

## Phase 4 — Backend HTTP Adapters

### Prompt
```
Create Express routers for: /routes, /compliance, /banking, /pools.
Use Zod validation middleware. Wire to services via DI container.
```

### Key Endpoints Generated
```typescript
// /routes
GET  /routes            → routeService.getAllRoutes()
POST /routes/:id/baseline → routeService.setBaseline(routeId)
GET  /routes/comparison   → routeService.getComparison()

// /compliance
GET  /compliance/cb           → complianceService.getCB(shipId, year)
GET  /compliance/adjusted-cb  → complianceService.getAdjustedCB(shipId, year)

// /banking
GET  /banking/records → bankingService.getRecords(shipId, year)
POST /banking/bank    → bankingService.bankSurplus(shipId, year)
POST /banking/apply   → bankingService.applyBanked(shipId, year, amount)

// /pools
POST /pools → poolService.createPool(year, members)
```

---

## Phase 5 — Frontend Architecture

### Prompt
```
Mirror backend hexagonal architecture in React. Create:
core/ (domain, application/use-cases, ports), adapters/ui (tabs, hooks, components),
adapters/infrastructure (API clients). Tabs: Routes, Compare, Banking, Pooling.
Use TailwindCSS for styling, Recharts for charts.
```

### Generated Hook Pattern
```typescript
// useRoutes.ts — outbound port implemented
export function useRoutes() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        routesApi.getAll()
            .then(setRoutes)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const setBaseline = async (routeId: string) => {
        await routesApi.setBaseline(routeId);
        // re-fetch
    };
    return { routes, loading, error, setBaseline };
}
```

---

## Phase 6 — Mock Data Mode

### Problem
Docker was not running on macOS/Windows, so `npm run dev` crashed on DB connect.

### Prompt
```
Create MockRouteRepo, MockComplianceRepo, MockBankEntryRepo, MockPoolRepo implementing
the outbound port interfaces with in-memory data. Wire via USE_MOCK_DATA=true in .env.
Update the DI Container to switch between Prisma and Mock repos based on env flag.
```

### Generated Container Switch
```typescript
const useMock = process.env.USE_MOCK_DATA === 'true';
if (useMock) {
    this.routeRepo = new MockRouteRepo();
    // ...
} else {
    this.routeRepo = new PrismaRouteRepo(this.prisma);
    // ...
}
```

**Outcome**: Platform runs fully offline with `npm run dev` — no Docker required.

---

## Phase 7 — Tests

### Prompt
```
Write Jest unit tests for: computeCB, bankSurplus, applyBanked, createPool, setBaseline.
Write Vitest tests for: computeComparison, validatePool.
Test edge cases: negative CB, over-apply banking, invalid pool (deficit exits worse).
```

### Sample Generated Test
```typescript
// computeCB.test.ts
it('should compute positive CB for an efficient ship', () => {
    // R002: LNG, intensity 88.0, fuel 4800t
    const cb = computeCB(88.0, 4800);
    const expected = (89.3368 - 88.0) * (4800 * 41_000);
    expect(cb).toBeCloseTo(expected, 2);
    expect(cb).toBeGreaterThan(0); // Surplus
});
```

**Test Results**: 16/16 backend tests passed, 5/5 frontend tests passed.

---

## Validation / Corrections

| Issue | Root Cause | Fix Applied |
|-------|-----------|-------------|
| `Cannot find module '../../../core'` | Incorrect relative depth for 5-level nested adapters | Corrected all imports to `../../../../core` via systematic Python script |
| `EADDRINUSE :::3001` | Multiple `npm run dev` instances running | `taskkill /F /PID` identified via `netstat`, then restart |
| `.env` encoding corruption | PowerShell `echo >>` wrote UTF-16 instead of UTF-8 | Rewrote file with `write_to_file` tool using UTF-8 encoding |
| `create-vite` interactive prompts | CLI tool requires TTY interaction | Manually scaffolded all config files using `write_to_file` |
| `dist/` tracked in Git | `node_modules` was committed accidentally | `git rm -r --cached node_modules` + `.gitignore` enforcement |

---

## Observations

### Where the Agent Saved Time
- **Boilerplate generation**: Prisma schema, Express routers, Zod validators, React hooks — written in seconds with correct patterns
- **Architecture enforcement**: hexagonal boundaries maintained throughout (no domain-framework coupling)
- **Cross-cutting fixes**: batch-fixed 8 files with wrong import depths simultaneously
- **Mock infrastructure**: complete offline mode implemented in one prompt iteration

### Where It Required Human Correction
- **Path depth calculation**: In deeply nested directories (5 levels), the agent initially miscounted `../` levels — required manual verification
- **PowerShell vs Bash**: Agent defaulted to Linux-style `&&` chaining which fails in PowerShell — corrected to `;` separator
- **Encoding issues**: PowerShell's `echo >>` operator uses UTF-16 encoding, corrupting `.env` — needed tool-based file writing

### Combined Tool Usage
```
Antigravity → Code Generation & Architecture
Git CLI     → Incremental commit history (8 semantic commits)
Python      → Systematic bulk-fix of import paths
netstat     → Port conflict debugging
Docker      → PostgreSQL containerization (when available)
```

---

## Best Practices Followed

1. **Hexagonal Architecture First**: Defined port interfaces before any adapter implementation
2. **Schema-first DB Design**: Prisma schema defined before any service code was written
3. **Test-Driven Edge Cases**: Unit tests written to cover negative CB, over-banking, invalid pools
4. **Environment-Switchable Infra**: Mock mode allows instant startup without any external dependencies
5. **Incremental Git History**: 8 semantic commits (chore → feat → fix → docs) showing clear progression
6. **Zod Validation**: All HTTP inputs validated at the adapter boundary, never in domain
7. **Dependency Injection**: Manual DI container keeps core decoupled from infrastructure

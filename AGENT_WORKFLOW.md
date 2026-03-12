# Backend Workflow
- Used `write_to_file` to scaffold `package.json`, `tsconfig.json`, `.env`
- Defined Prisma schema for domain models (`Route`, `ShipCompliance`, `BankEntry`, `Pool`, `PoolMember`)
- Created Value Objects (`GhgIntensity`, `ComplianceBalance`, `Year`, `PercentDiff`) and error classes
- Set up domain entities (pure TypeScript rules and interfaces)
- Implemented Use Cases matching requirements (`RouteService`, `ComplianceService`, `BankingService`, `PoolService`) respecting hexagonal architecture boundaries
- Implemented Prisma adapters for the outbound repository ports
- Created HTTP Express adapters for the inbound routes, with `zod` for validation
- Integrated Dependency Injection container manually
- Wrote Jest unit tests and supertest integration tests
- Built Docker Compose file to bootstrap PostgreSQL locally
- Scoped DB seeding strictly

# Frontend Workflow
- Avoided `vite create` interactive prompts by manually creating essential files (`package.json`, `vite.config.ts`, `index.html`) using `write_to_file`
- Setup strict TypeScript, Tailwind CSS, Recharts for visual charts
- Handled Ports & Adapters on FE exactly mirroring backend structure: core domain entities and use cases (`validatePool`, `computeComparison`) separated from React components
- Implemented API adapters using `axios`
- Created shared components (`KpiCard`, `DataTable`, `FilterBar`, `StatusBadge`) with proper accessible `aria-labels`
- Developed specific Tabs (`RoutesTab`, `CompareTab`, `BankingTab`, `PoolingTab`) with decoupled custom hooks managing state and API lifecycle
- Addressed validations, chart plotting, and condition highlighting across tables

## Validation & Corrections
1. **Interactive Prompt Blocking**: `create-vite` started asking interactive prompts (like "Use Vite 8 Beta?"). I terminated the sub-process using `send_command_input` and manually scaffolded to ensure idempotent and automated workflow execution.
2. **Postgres Connection string**: I ensured the `DATABASE_URL` matches the deployed docker configuration exactly before applying `prisma migrate`.
3. **PowerShell Operators**: Realized PowerShell execution block with `&&` chain failed, adapted by separating steps with `;`.

## Observations
- Using precise `write_to_file` is much safer and faster than running a large series of terminal scripts that often break or require standard input processing.
- Having a robust initial architecture prompt (hexagonal boundaries provided upfront) massively simplifies code writing because the scope of each file is predictable and clearly bounded.

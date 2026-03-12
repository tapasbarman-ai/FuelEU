# Reflection — FuelEU Maritime Compliance Platform

> AI Agent: **Antigravity (Google DeepMind)**
> Assignment: FuelEU Maritime Full-Stack Developer Assignment

---

## What I Learned Using AI Agents

The most striking insight from this project is how **architectural clarity upfront amplifies AI agent productivity exponentially**. When I provided the explicit hexagonal boundaries in the initial prompt — defining what belongs in `core/` (zero framework imports) vs `adapters/` (Express/Prisma) — the agent generated structurally correct code consistently for all 40+ files created.

By contrast, when I asked for ad-hoc implementations without clear architectural constraints, the agent defaulted to simpler, framework-coupled patterns (business logic mixed into Express route handlers, for example). The lesson: **the quality of AI output is bounded by the precision of the architectural spec you provide**.

The second major learning was about **tool selection for scaffolding**. Running `create-vite` via CLI in an automated environment fails because the tool assumes an interactive terminal (TTY). The agent resolved this by switching to direct `write_to_file` — manually crafting all config files from scratch. This is more reliable than any CLI scaffolding tool in agentic workflows.

---

## Efficiency Gains vs Manual Coding

| Task | Manual Estimate | With AI Agent | Gain |
|------|----------------|---------------|------|
| Prisma schema + seed | 45 min | 3 min | 15× |
| 4 service use-cases with port interfaces | 3 hours | 20 min | 9× |
| 4 Express routers + Zod validators | 2 hours | 15 min | 8× |
| 4 React tabs + hooks + API clients | 4 hours | 30 min | 8× |
| 16 unit + integration tests | 2 hours | 15 min | 8× |
| Mock infrastructure layer | 1 hour | 8 min | 7.5× |
| **Total** | **~13 hours** | **~91 minutes** | **~8.5×** |

The biggest gains were in **boilerplate-heavy tasks**: interface definitions, repository implementations, React hooks with loading/error state management, and Zod schema declarations. These tasks are highly formulaic and the agent handled them almost perfectly.

---

## Friction Points

### 1. Relative Import Depth Miscalculation
The deepest adapter files sit 5 levels below `src/` (e.g., `src/adapters/inbound/http/middleware/`). The agent initially generated `../../../core` (3 levels up) instead of `../../../../core` (4 levels up). This failed at runtime. We resolved it by writing a systematic Python script to batch-correct all paths.

**Lesson**: For deeply nested directory structures, always verify relative imports by counting levels manually or using path aliases (`@core/*` in `tsconfig.json`) from the start.

### 2. PowerShell vs Bash Operator Differences
The agent's default command chaining (`cmd1 && cmd2`) works in Bash but fails silently in PowerShell. This required systematically replacing all `&&` with `;` separators. A simple `.npmrc` or `cross-env` could have avoided this entirely.

### 3. Encoding Issues with `.env`
PowerShell's `echo >> file` operator writes UTF-16 files, which Node.js `dotenv` cannot parse, causing `USE_MOCK_DATA` to remain undefined. The agent resolved this by using `write_to_file` directly instead of shell redirection.

---

## Improvements I'd Make Next Time

1. **Path aliases from day one**: Configure `tsconfig.json` with `@core/*`, `@adapters/*` aliases instead of relative paths. This eliminates the entire class of import depth bugs.

2. **Mock layer from the start**: Don't wait until Docker fails to create mock repositories. Build them in parallel with Prisma repos — the interfaces are identical, and it gives you a faster development loop from minute one.

3. **Environment validation**: Use a library like `zod-env` or `@t3-oss/env-core` to validate all environment variables on startup. This would have surfaced the `USE_MOCK_DATA` encoding issue immediately with a clear error message.

4. **Playwright E2E tests**: Add one Playwright test per tab that runs the full user journey (load data → interact → verify UI state). The current unit test coverage is solid, but E2E coverage would close the gap between isolated logic tests and real user flows.

5. **Structured agent logging**: Use a task tracker (like `tasks.md`) from the start to log each agent prompt, its output, and any corrections made. This makes generating `AGENT_WORKFLOW.md` trivial retrospectively and improves prompt iteration discipline.

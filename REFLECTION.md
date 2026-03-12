# AI Implementation Reflection

## Efficiency Gains
- **Monorepo Strategy**: Building the entire structure (backend ports, application logic, and then corresponding frontend views and decoupled logic) locally via tools resulted in an immediate working prototype without manual context switching.
- **Architectural Constraints**: Having a rigid Ports and Adapters architecture specification forced the logic out of standard framework bindings (like Express and React). Writing pure TS use cases for pooling math and comparison logic on both ends means they were exceptionally easy to unit test directly.

## Friction Points & Learnings
- **Tooling Defaults**: Bootstrapping tools like `create-vite` often assume interactivity. Supplying `write_to_file` manually is significantly more predictable structure-wise than wrangling PTY interactive shells.
- **Complexity in Pooling Rules**: The FuelEU pooling rules (e.g., verifying sum limits and exit conditions) require careful domain modeling. The explicit constraints outlined in the prompt (must equal 0, deficit can't exit worse) were successfully converted into purely deterministic logic.

## Future Improvements
- The backend `sumByShipAndYear` aggregates all historical items including negative applications. I modeled application as negative injection, ensuring it cleanly maintains the ledger balance without complex state management. In a real-world scenario, we'd augment this with concurrent locking mechanisms for banking.
- On the Frontend, I would add deeper End-to-End coverage using Playwright to ensure the Tab interactions cleanly connect all the way to the DB layer with full browser validation testing.

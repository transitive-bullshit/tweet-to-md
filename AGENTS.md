# AGENTS.md

Instructions for AI agents working in this codebase.

---

- this project uses `pnpm`
- simple typescript
- no semicolons
- esm (no commonjs)
- prettier for formatting (`pnpm format`)
- use the `ky` NPM module as a wrapper around `fetch` for HTTP requests
- use `zod` v4 for validating external data, and prefer derived types from the zod schemas

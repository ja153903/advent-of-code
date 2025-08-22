# AGENTS.md - Development Guidelines

## Build/Test Commands
- **Run main entry**: `bun run index.ts`
- **Install deps**: `bun install`
- **Run single solution**: `bun run src/years/YYYY/DD.ts`
- **Test runner**: `bun test` (if tests exist)
- **Type check**: `bun run typecheck`
- **Lint**: `bun run lint` (check) / `bun run lint:fix` (auto-fix)
- **Format**: `bun run format` (write) / `bun run format:check` (check only)

## Code Style Guidelines
- **Runtime**: Uses Bun as JavaScript runtime and package manager
- **TypeScript**: Strict mode enabled, ESNext target, bundler module resolution
- **Imports**: Use .ts extensions allowed (`allowImportingTsExtensions: true`)
- **File structure**: Solutions in `src/years/YYYY/DD.ts`, utilities in `src/lib/`
- **Functions**: Use async/await for file operations, export functions for reusability
- **File I/O**: Use `Bun.file()` API for reading input files (see `src/lib/file-io.ts`)
- **Naming**: Use descriptive function names, camelCase for variables/functions
- **Types**: Leverage TypeScript strict typing, avoid `any`
- **Error handling**: Use neverthrow's `Result<T, E>` and `ResultAsync<T, E>` types for all error-prone operations instead of try/catch or throwing exceptions
- **Comments**: Minimal commenting, let code be self-documenting
- **Formatting**: ESLint + Prettier configured with TypeScript support, single quotes, semicolons
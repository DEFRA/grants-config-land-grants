# Repository Guidelines

## Project Structure & Module Organization

Land grant configuration lives in `configurations/land-grants/`. Action definitions are under `configurations/land-grants/actions/`. Service code and release helpers live in `src/` and `ci/`; test notes are in `test/`.

## Build, Test, and Development Commands

- `npm install`: install dependencies and set up Husky.
- `npm run version`: create a Changeset for configuration changes.
- `npm run dev`: run the local watcher.
- `npm test`: run Vitest with coverage.
- `npm run lint` / `npm run lint:fix`: check or fix linting.
- `npm run format:check` / `npm run format`: check or apply formatting.

## Coding Style & Naming Conventions

Use ES modules and the local Prettier/ESLint settings. Preserve action codes and payment identifiers exactly; they are domain contracts, not display labels.

## Domain Language

Use `CONTEXT.md` as the source of truth for land grant configuration language. Prefer those terms in configuration, tests, docs, and generated changes.

## Developer Addenda

Developers can add their own `AGENTS.local.md` and should be read as an addendum to this file. Keep that file local to your machine and do not commit it.

## Testing Guidelines

For configuration changes, run `npm run version` when required by the release process, then the relevant tests, `npm run lint`, and `npm run format:check`.

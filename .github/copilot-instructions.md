# GitHub Copilot – Repository Instructions

## Project overview

This is a **.NET 10 + Vue 3** full-stack monorepo.

| Area | Path | Stack |
|------|------|-------|
| Frontend | `src/frontend/` | Vue 3 (Composition API, `<script setup>`), TypeScript strict, Vite, ESLint flat-config, Prettier |
| Backend | `src/backend/` | .NET 10, C# latest, nullable enabled, Roslyn analyzers (StyleCop, SonarAnalyzer, Roslynator), CSharpier |
| Container | `.devcontainer/` | Docker + devcontainer spec |

## Code style

### Frontend (`src/frontend/`)
- All Vue components **must** use `<script setup>` Composition API
- Component names must be multi-word (e.g. `UserProfile`, not `Profile`)
- TypeScript strict mode is enforced — no `any`, no unchecked nulls
- ESLint config is in `src/frontend/eslint.config.js`; Prettier config in `src/frontend/.prettierrc.json`
- `defineProps`, `defineEmits`, `defineOptions` must come before template logic
- Block order in `.vue` files: `<script>` → `<template>` → `<style>`

### Backend (`src/backend/`)
- C# latest language version, file-scoped namespaces
- Nullable reference types enabled — every nullable must be explicitly annotated
- Interfaces must be prefixed with `I` (e.g. `IUserService`)
- Private fields use camelCase (no underscore prefix)
- CSharpier is the formatter — 120-char line width
- StyleCop ordering: system usings first, outside namespace

## Security
- No hardcoded secrets, passwords, tokens, or API keys in any committed file
- SQL injection prevention: always use parameterised queries (CA2100)
- XSS prevention: sanitise all user input before rendering (CA3002)
- Cryptography: no MD5, DES, or 3DES (CA5350, CA5351)

## Testing
- Every new C# class must have a corresponding `*Tests.cs` file
- Every new Vue component / TypeScript module must have a `*.spec.ts` file alongside it
- Tests should cover happy path, edge cases, and error paths

## Definition of Done
A PR is ready to merge when:
1. The PR description explains **what** changed and **why** (with enough context for an unfamiliar reviewer)
2. The PR is not a draft
3. No `TODO`, `FIXME`, `HACK`, or `XXX` comments remain in changed files
4. All new source files have corresponding test files
5. No secrets are committed
6. Code passes the relevant Copilot code review agents (see `.github/`)

## Code review agents

When asked to review this repository's code, use the appropriate agent instruction file from `.github/agents/`:

| Agent file | When to use |
|------------|-------------|
| `.github/agents/vue3-analysis-agent.agent.md` | Reviewing `src/frontend/**` changes |
| `.github/agents/dotnet-analysis-agent.agent.md` | Reviewing `src/backend/**` changes |
| `.github/agents/docker-security-agent.agent.md` | Reviewing `Dockerfile`, `docker-compose`, or `.devcontainer` changes |
| `.github/agents/project-quality-agent.agent.md` | Reviewing any PR for definition-of-done compliance |

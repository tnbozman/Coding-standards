# Coding Standards

This repository captures shared coding standards, tooling configuration, and GitHub Copilot code-review agents for a **.NET 10 + Vue 3** full-stack project.

---

## Repository Structure

```
.
├── .devcontainer/                  ← Fat DevContainer (dotnet 10 + Vue 3 + security tools)
│   ├── Dockerfile
│   ├── devcontainer.json
│   └── post-create.sh
├── .vscode/
│   ├── extensions.json             ← Recommended VSCode extensions
│   └── settings.json               ← Workspace editor settings
├── .editorconfig                   ← Root EditorConfig (all file types)
├── .github/
│   ├── copilot-instructions.md     ← Repository-wide Copilot context (auto-applied)
│   ├── vue3-analysis-agent.md      ← Copilot Agent 1: Vue3 static analysis
│   ├── dotnet-analysis-agent.md    ← Copilot Agent 2: .NET static analysis
│   ├── docker-security-agent.md    ← Copilot Agent 3: Docker security analysis
│   └── project-quality-agent.md   ← Copilot Agent 4: Definition of Done
├── src/
│   ├── frontend/                   ← Vue 3 / TypeScript project root
│   │   ├── eslint.config.js        ← ESLint flat-config (Vue3 + TS + Prettier)
│   │   ├── .prettierrc.json        ← Prettier config
│   │   ├── tsconfig.json           ← TypeScript strict config
│   │   └── package.json            ← Dev-dependency manifest
│   └── backend/                    ← .NET 10 solution root
│       ├── .editorconfig           ← Roslyn / C# code-style rules
│       ├── Directory.Build.props   ← MSBuild: Roslyn analyzers (StyleCop, Sonar, Roslynator)
│       ├── stylecop.json           ← StyleCop settings
│       └── .csharpierrc.json       ← CSharpier formatter config
```

---

## DevContainer

The **fat DevContainer** (`/.devcontainer`) provides a single, self-contained development environment with everything pre-installed:

| Stack | Tooling |
|-------|---------|
| .NET 10 (preview) | SDK, `dotnet-ef`, `dotnet-format`, `csharpier`, `dotnet-sonarscanner` |
| Node 22 / Vue 3 | `@vue/cli`, `vite`, `typescript`, `eslint`, `prettier` |
| Security | Trivy, Hadolint |
| VSCode extensions | SonarLint, Volar, ESLint, Prettier, C# Dev Kit, GitLens, EditorConfig |

Open the repo in VSCode and choose **Reopen in Container** to get started.

---

## Frontend – Vue 3 / TypeScript (`src/frontend`)

| Tool | Config file | Purpose |
|------|-------------|---------|
| ESLint | `eslint.config.js` | Flat config with `typescript-eslint` + `eslint-plugin-vue` + Vue3 recommended rules |
| Prettier | `.prettierrc.json` | Consistent formatting for `.vue`, `.ts`, `.json` |
| TypeScript | `tsconfig.json` | Strict mode, `noEmit`, path aliases (`@/*`) |

Run locally:
```bash
cd src/frontend
npm ci
npm run lint          # ESLint (fails on any warning)
npm run format:check  # Prettier dry-run
npm run type-check    # vue-tsc
```

---

## Backend – .NET 10 / C# (`src/backend`)

| Tool | Config file | Purpose |
|------|-------------|---------|
| Roslyn (built-in) | `.editorconfig` | C# code style, naming, nullable, `AnalysisMode=AllEnabledByDefault` |
| StyleCop.Analyzers | `Directory.Build.props` + `stylecop.json` | Style, ordering, documentation rules |
| SonarAnalyzer.CSharp | `Directory.Build.props` | Security, reliability, maintainability |
| Roslynator.Analyzers | `Directory.Build.props` | Extended diagnostics |
| CSharpier | `.csharpierrc.json` | Opinionated C# formatter (replaces `dotnet-format` for style) |

Run locally:
```bash
cd src/backend
dotnet build -warnaserror             # Build with all Roslyn analyzers
dotnet csharpier check .              # Verify formatting
dotnet format --verify-no-changes     # Verify editorconfig style
```

---

## GitHub Copilot Code Review Agents

Four **GitHub Copilot agent instruction files** live in `.github/`. Each file defines a detailed review checklist that GitHub Copilot follows when you ask it to review a pull request diff against `main`.

These are **AI-driven reviews** — Copilot reads the diff and evaluates it against the checklist, posting findings as review comments. They are not CI pipelines.

### How to use

On any pull request, tag Copilot with the relevant agent:

| Scenario | Command |
|----------|---------|
| Vue/TypeScript code changed | `@copilot review the frontend changes using the vue3-analysis-agent` |
| C# / .NET code changed | `@copilot review the backend changes using the dotnet-analysis-agent` |
| Dockerfile / compose changed | `@copilot review the Docker changes using the docker-security-agent` |
| Any PR (pre-merge check) | `@copilot check this PR against the definition of done using the project-quality-agent` |

GitHub Copilot will respond with a structured report following the checklist defined in the agent file.

---

### Agent 1 – Vue3 Static Code Analysis

**File:** `.github/vue3-analysis-agent.md`

Reviews `src/frontend/**` changes for:
- Vue 3 Composition API / `<script setup>` compliance
- TypeScript strict-mode violations (`any`, non-null assertions, missing types)
- Reactivity correctness (`ref` vs `reactive`, watch cleanup, prop mutation)
- Composable naming and pattern conventions
- Performance (lazy loading, `:key` stability, `v-if` vs `v-show`)
- Accessibility (ARIA, `alt` attributes, form labels)
- Code hygiene (no `console.log`, no `TODO`/`FIXME`, Prettier formatting)

---

### Agent 2 – .NET Static Code Analysis

**File:** `.github/dotnet-analysis-agent.md`

Reviews `src/backend/**` changes for:
- Nullable reference type correctness
- Roslyn code-style rules (var usage, braces, file-scoped namespaces, expression bodies)
- Naming conventions (I-prefix interfaces, camelCase fields, `Async` suffix)
- Security (CA2100 SQL injection, CA3001–CA3012 injection family, CA5350/5351 weak crypto)
- Async/threading best practices (no `async void`, `CancellationToken` propagation, no `.Result` blocking)
- Exception handling, LINQ safety, DI lifetime correctness
- CSharpier formatting (120-char width)

---

### Agent 3 – Docker Security Analysis

**File:** `.github/docker-security-agent.md`

Reviews `Dockerfile*`, `docker-compose*.yml`, and `.devcontainer/**` changes for:
- Base image pinning (no `latest` tag)
- Non-root user enforcement
- Hadolint rules (layer caching, `--no-install-recommends`, `COPY` vs `ADD`)
- Secret / credential hygiene (no `ENV`/`ARG` secrets baked into layers)
- Docker Compose resource limits, restart policies, secret handling
- DevContainer-specific checks (non-root `vscode` user, security extensions installed)
- Supply-chain hygiene (`curl | bash` pinning, binary checksums)

---

### Agent 4 – Project Quality (Definition of Done)

**File:** `.github/project-quality-agent.md`

Applies to **every PR** before merge:
- PR description is meaningful (≥ 10 words, explains what + why)
- PR is not a draft; linked to an issue
- No `TODO`/`FIXME`/`HACK`/`XXX` in changed source files
- New source files have corresponding test files
- No hardcoded secrets or sensitive data in the diff
- Public APIs and new features are documented
- EditorConfig compliance
- Advisory code-quality metrics (method length, file length, duplication)

The agent produces a **Definition of Done summary table** listing each check with ✅ / ❌ / ⚠️ status.

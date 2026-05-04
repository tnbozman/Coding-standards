# Coding Standards

This repository captures shared coding standards, tooling configuration, and automated code-review agents for a **.NET 10 + Vue 3** full-stack project.

---

## Repository Structure

```
.
├── .devcontainer/              ← Fat DevContainer (dotnet 10 + Vue 3 + security tools)
│   ├── Dockerfile
│   ├── devcontainer.json
│   └── post-create.sh
├── .vscode/
│   ├── extensions.json         ← Recommended VSCode extensions
│   └── settings.json           ← Workspace editor settings
├── .editorconfig               ← Root EditorConfig (all file types)
├── src/
│   ├── frontend/               ← Vue 3 / TypeScript project root
│   │   ├── eslint.config.js    ← ESLint flat-config (Vue3 + TS + Prettier)
│   │   ├── .prettierrc.json    ← Prettier config
│   │   ├── tsconfig.json       ← TypeScript strict config
│   │   └── package.json        ← Dev-dependency manifest
│   └── backend/                ← .NET 10 solution root
│       ├── .editorconfig       ← Roslyn / C# code-style rules
│       ├── Directory.Build.props ← MSBuild: Roslyn analyzers (StyleCop, Sonar, Roslynator)
│       ├── stylecop.json       ← StyleCop settings
│       └── .csharpierrc.json   ← CSharpier formatter config
└── .github/workflows/
    ├── agent-vue3-analysis.yml         ← Agent 1: Vue3 static analysis
    ├── agent-dotnet-analysis.yml       ← Agent 2: .NET static analysis
    ├── agent-docker-security.yml       ← Agent 3: Docker security analysis
    └── agent-project-quality.yml       ← Agent 4: Definition of Done
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

## Code Review Agents (GitHub Actions)

Four GitHub Actions workflows trigger on every PR targeting `main` and post a summary comment:

### Agent 1 – Vue3 Static Code Analysis
**Workflow:** `.github/workflows/agent-vue3-analysis.yml`
- Scopes to changed `src/frontend/**` files
- Runs `vue-tsc` type-check, ESLint (SARIF → Code Scanning tab), Prettier check

### Agent 2 – .NET Static Code Analysis
**Workflow:** `.github/workflows/agent-dotnet-analysis.yml`
- Scopes to changed `src/backend/**` files
- `dotnet build` with full Roslyn analyzer suite, CSharpier check, `dotnet-format` verify
- Optional: SonarScanner (activated when `SONAR_TOKEN` secret is set)

### Agent 3 – Docker Security Analysis
**Workflow:** `.github/workflows/agent-docker-security.yml`
- Scopes to changed `Dockerfile*`, `docker-compose*`, `.devcontainer/**`
- Hadolint (Dockerfile best-practices), Trivy (image + IaC), Checkov (security policies)
- All results uploaded to **Security → Code Scanning**

### Agent 4 – Project Quality (Definition of Done)
**Workflow:** `.github/workflows/agent-project-quality.yml`
- Runs on every PR to `main`
- Checks: PR description ≥ 10 words, not a draft, no TODO/FIXME, new files have tests, no hardcoded secrets, EditorConfig compliance
- Posts a DoD summary table as a PR comment

---

## Required Repository Secrets

| Secret | Used by | Description |
|--------|---------|-------------|
| `SONAR_TOKEN` | Agent 2 (optional) | SonarCloud/SonarQube authentication token |
| `SONAR_HOST_URL` | Agent 2 (optional) | SonarQube server URL (defaults to `https://sonarcloud.io`) |

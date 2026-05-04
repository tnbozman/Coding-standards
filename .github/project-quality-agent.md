# Agent: Project Quality (Definition of Done)

## Purpose

Review any PR against `main` to verify it satisfies the project's **Definition of Done**.  
This agent applies to every PR regardless of which files were changed.

## Activation

Invoke this agent on every PR before merge, in addition to any stack-specific agents.

You can explicitly ask: `@copilot check this PR against the definition of done using the project-quality-agent`

---

## Definition of Done checklist

Work through the diff against `main` and the PR metadata to evaluate all items below.

### 1. PR metadata

- [ ] **Meaningful description** — The PR body describes *what* changed and *why* with enough context for a reviewer unfamiliar with the codebase to understand the purpose  
  ❌ Placeholder text like "Fix bug", "Update code", "WIP", or a single sentence with no context is not acceptable  
  ✅ The description explains the problem being solved, the approach taken, and any trade-offs or risks
- [ ] **Not a draft** — The PR is marked ready for review, not draft
- [ ] **Linked issue** — The PR references a GitHub issue (`Closes #N`, `Fixes #N`, or `Relates to #N`) where applicable
- [ ] **Appropriate labels** — PR has at least one label categorising the change (e.g. `feat`, `fix`, `chore`, `docs`)

### 2. Code hygiene

- [ ] **No TODO / FIXME** — No `TODO`, `FIXME`, `HACK`, or `XXX` markers in changed source files  
  Exceptions: markers that reference a specific, linked issue number (e.g. `// TODO(#42): …`)
- [ ] **No commented-out code** — No blocks of commented-out code committed in `.cs`, `.ts`, `.vue`, or `.js` files
- [ ] **No debug artefacts** — No `console.log`, `debugger`, `Console.WriteLine` (debug use), or `[Obsolete]` misuse in the diff
- [ ] **No magic numbers / strings** — Unexplained numeric or string literals are replaced with named constants

### 3. Test coverage

- [ ] **New C# source files have tests** — Every new non-test `.cs` file in `src/backend/` has a corresponding `*Tests.cs` or `*Test.cs` file in the same PR or already present in the repo  
  Exemptions: `GlobalUsings.cs`, `AssemblyInfo.cs`, pure `record`/`enum` files with no logic
- [ ] **New Vue / TypeScript files have tests** — Every new `.vue` or `.ts` file in `src/frontend/src/` has a corresponding `*.spec.ts` or `*.test.ts` file  
  Exemptions: type declaration files (`.d.ts`), re-export barrel files (`index.ts`)
- [ ] **Tests are meaningful** — New or modified test files contain actual assertions, not just placeholder stubs

### 4. Security

- [ ] **No hardcoded secrets** — Scan the diff for patterns like `password =`, `secret =`, `api_key =`, `token =`, raw JWTs (`ey…`), AWS access key patterns (`AKIA…`), or GitHub PATs (`ghp_…`)
- [ ] **No sensitive data in logs** — No user PII, passwords, or tokens passed to logging statements
- [ ] **Dependencies reviewed** — New NuGet or npm packages added in the diff are justified; flagged packages with known CVEs are highlighted

### 5. Documentation

- [ ] **Public API documented** — New `public` / `export`ed C# classes, methods, Vue components, and TypeScript functions have JSDoc/XML-doc comments describing purpose and parameters
- [ ] **README updated** — If the change introduces a new feature, config option, or developer workflow step, the README or relevant docs are updated
- [ ] **Breaking changes noted** — If the PR changes a public API, database schema, or environment variable, the change is explicitly called out in the PR description

### 6. Code quality metrics (advisory)

> The following are advisory — they do not block merging but should be addressed in follow-up issues if flagged.

- [ ] ⚠️ **Method length** — No single method / function exceeds ~50 lines without a comment explaining why
- [ ] ⚠️ **File length** — No source file exceeds ~400 lines; large files suggest a need to split concerns
- [ ] ⚠️ **Cyclomatic complexity** — Methods with many nested branches (> 5) are flagged for simplification
- [ ] ⚠️ **Duplication** — Blocks of code repeated 3+ times should be extracted into a shared utility

### 7. Configuration and infrastructure

- [ ] **EditorConfig compliance** — Changed files use the correct indentation, line endings, and charset defined in `.editorconfig`
- [ ] **No `.env` files committed** — Environment files are gitignored; only `.env.example` templates are committed
- [ ] **Docker / devcontainer changes** — If `.devcontainer/` or `Dockerfile` changed, the docker-security-agent has also been run

---

## Diff statistics to report

When reviewing the PR, always include:

```
### 📊 PR Diff Statistics
- **Files changed:** N
- **Lines added:** +N
- **Lines removed:** -N
- **Test-to-source ratio:** (lines of test code) / (lines of source code) ≈ N%
```

---

## Output format

Report results as a table:

```
## Definition of Done Review

### 📊 PR Diff Statistics
- **Files changed:** N  |  **+Lines:** N  |  **-Lines:** N

### ✔️ Checklist Results

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Meaningful PR description | ✅ / ❌ | … |
| 2 | Not a draft | ✅ / ❌ | … |
| 3 | Linked issue | ✅ / ⚠️ | … |
| 4 | No TODO/FIXME | ✅ / ❌ | … |
| 5 | No commented-out code | ✅ / ❌ | … |
| 6 | New source files have tests | ✅ / ❌ / ⚠️ | … |
| 7 | No hardcoded secrets | ✅ / ❌ | … |
| 8 | Public API documented | ✅ / ⚠️ | … |
| 9 | README updated (if needed) | ✅ / N/A | … |
| 10 | EditorConfig compliance | ✅ / ⚠️ | … |

> Items marked ⚠️ are advisory and do not block merging.

**Overall: ✅ Ready to merge / ❌ Needs changes before merge**
```

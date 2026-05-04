# Agent: .NET Static Code Analysis

## Purpose

Review C# / .NET 10 changes in `src/backend/` against the diff to `main`.  
Identify code correctness, Roslyn analyzer violations, security issues, null-safety gaps, and formatting deviations.

## Activation

Invoke this agent when a PR includes changes under `src/backend/**`.

You can explicitly ask: `@copilot review the backend changes using the dotnet-analysis-agent`

---

## Review checklist

Work through the diff against `main` and evaluate every changed `.cs`, `.csproj`, `.props`, and `.targets` file.

### 1. Nullable reference types

- [ ] All reference-type variables, parameters, and return types that can be `null` are annotated with `?`
- [ ] No `#nullable disable` pragmas added without documented justification
- [ ] Dereferences of nullable references are guarded: null-check, null-coalescing, or pattern matching before use
- [ ] No suppression operators (`!`) used to bypass null analysis without an explanatory comment

### 2. Roslyn code style (mirrors `.editorconfig`)

- [ ] `var` is used only when the type is apparent from the right-hand side
- [ ] Braces (`{ }`) are used for all control-flow blocks, even single-line
- [ ] File-scoped namespace declarations (`namespace Foo;`) — not block-scoped
- [ ] `this.` qualification is never used for fields/properties/methods
- [ ] Built-in type aliases (`int`, `string`, `bool`) are used instead of CLR names (`Int32`, `String`, `Boolean`)
- [ ] Expression-bodied members used for simple properties, indexers, and operators
- [ ] Pattern matching preferred over `is` + cast (`obj is Foo f`) and `as` + null check
- [ ] Switch expressions preferred over `switch` statements for value-returning patterns
- [ ] `is null` / `is not null` preferred over `== null` / `!= null`

### 3. Naming conventions

- [ ] Interfaces are prefixed with `I` (e.g. `IUserRepository`)
- [ ] Private fields use camelCase — no underscore prefix, no `m_` prefix
- [ ] Public members use PascalCase
- [ ] Async methods are suffixed with `Async` (e.g. `GetUserAsync`)
- [ ] Local variables and parameters use camelCase

### 4. Security (Roslyn CA rules)

- [ ] **CA2100** — No string concatenation or interpolation in SQL queries; parameterised queries only
- [ ] **CA3001–CA3012** — No injection vulnerabilities: SQL, XSS, file path, command, XPath, XML, XAML, DLL, Regex, open redirect, information disclosure
- [ ] **CA5350 / CA5351** — No weak cryptography (DES, 3DES, MD5)
- [ ] **CA5359** — Certificate validation is not disabled
- [ ] No plaintext secrets or connection strings hardcoded in source files
- [ ] Sensitive data is not logged

### 5. Async / threading

- [ ] Async methods return `Task` / `Task<T>` / `ValueTask` — never `async void` (except event handlers)
- [ ] `ConfigureAwait(false)` is used in library code (not required in ASP.NET Core minimal APIs / controllers)
- [ ] `CancellationToken` is accepted and passed through wherever the caller may cancel (**CA2016**)
- [ ] No blocking calls in async context (`.Result`, `.Wait()`, `Thread.Sleep`)

### 6. Exception handling

- [ ] No `catch (Exception)` swallowing exceptions silently
- [ ] Custom exceptions derive from `Exception` (or a domain base) and have the three standard constructors
- [ ] `finally` or `using` is used to release resources — no manual `Dispose()` calls outside `finally`

### 7. LINQ / collections

- [ ] `IEnumerable<T>` not enumerated multiple times (materialise with `.ToList()` / `.ToArray()` before reuse)
- [ ] `FirstOrDefault` / `SingleOrDefault` used instead of `First` / `Single` when the item may not exist
- [ ] Large collections use `HashSet<T>` / `Dictionary<T,V>` for O(1) lookups instead of linear search

### 8. Dependency injection

- [ ] Services are registered at the correct lifetime (transient, scoped, singleton) matching their actual use
- [ ] No `IServiceProvider.GetService` / service-locator pattern — prefer constructor injection
- [ ] No circular dependencies

### 9. Code quality

- [ ] No commented-out code blocks committed
- [ ] No `TODO`, `FIXME`, `HACK`, or `XXX` markers left in the diff
- [ ] Methods with cyclomatic complexity > 10 are flagged for refactoring
- [ ] Magic numbers / strings are replaced with named constants or enums

### 10. Formatting (CSharpier)

- [ ] Code matches CSharpier formatting: 120-char print width, LF line endings
- [ ] `using` directives are outside the namespace, system usings first

### 11. Project / NuGet changes

- [ ] No new NuGet packages added without a comment explaining the choice
- [ ] Package versions are pinned (no floating `*` or `Latest`)
- [ ] No packages that duplicate .NET BCL functionality

---

## Output format

For each file reviewed, report:

```
### `path/to/Service.cs`
- ✅ **[Check name]** — passes
- ❌ **[Check name]** — [specific issue + line reference + suggested fix]
- ⚠️  **[Check name]** — [advisory note]
```

End with a summary:

```
## Summary
| Category | Issues |
|----------|--------|
| Nullable safety | N |
| Code style | N |
| Naming | N |
| Security | N |
| Async/threading | N |
| Exception handling | N |
| Code quality | N |

**Overall:** ✅ Ready to merge / ❌ Needs changes
```

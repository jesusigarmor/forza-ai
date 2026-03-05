# Code Review Rules

## Linting and Formatting

This project uses **oxlint** (not ESLint) and **oxfmt** (not Prettier).

- Do NOT suggest ESLint configuration, `eslint-disable` comments, or ESLint plugins
- Do NOT suggest Prettier configuration or `.prettierrc` changes
- If a lint disable is needed, use `// oxlint-disable-next-line <rule> -- <reason>`

## Type Safety

### No `as` Type Assertions

```typescript
// FORBIDDEN
const x = someValue as string;
const y = data as unknown as TargetType;

// ALLOWED
const z = { key: 'value' } as const;

// USE INSTEAD: type guards
function isString(val: unknown): val is string {
  return typeof val === 'string';
}
```

### No `any` Type

```typescript
// FORBIDDEN
function process(data: any): any { ... }

// USE INSTEAD
function process(data: unknown): Result { ... }
function process<T extends Record<string, unknown>>(data: T): ProcessedData { ... }
```

### Strict Boolean Expressions

```typescript
// FORBIDDEN — truthy/falsy coercion
if (str) { ... }
if (arr.length) { ... }

// CORRECT — explicit comparisons
if (str.length > 0) { ... }
if (arr.length > 0) { ... }
if (obj !== null && obj !== undefined) { ... }
```

### Nullish Coalescing Over Logical OR

```typescript
// WRONG — || coerces 0, '', false
const port = config.port || 3000;

// CORRECT — ?? only coalesces null/undefined
const port = config.port ?? 3000;
```

## Async Patterns

### No Sequential Awaits in Loops

```typescript
// FORBIDDEN — sequential, O(n) latency
for (const item of items) {
  await processItem(item);
}

// CORRECT — parallel
await Promise.all(items.map((item) => processItem(item)));
```

### Every Promise Must Be Handled

```typescript
// FORBIDDEN — floating promise
fetchData();

// CORRECT
await fetchData();
void fetchData(); // explicitly discarded
return fetchData();
```

## String-Based Type Discrimination is Forbidden

```typescript
// FORBIDDEN
if (action.type.includes('error')) { ... }
if (status.toLowerCase() === 'active') { ... }

// CORRECT — typed const objects validated at the boundary
const ActionType = { Error: 'error', Success: 'success' } as const;
type ActionType = typeof ActionType[keyof typeof ActionType];
```

## Dead Code and Cruft

- Delete dead code immediately — no commented-out code
- No `_unusedVar` prefixes — remove the variable entirely
- No `@deprecated` annotations for code introduced on the current branch
- No unused imports, parameters, or stubs

## File Organization

- Max 1000 lines per TypeScript file — split by responsibility
- No barrel files / re-exports — import from the source directly

## Security

- No hardcoded secrets, API keys, or tokens in source code
- Validate all external inputs with Zod schemas at the boundary
- No `eval()`, `new Function()`, or `setTimeout/setInterval` with string arguments

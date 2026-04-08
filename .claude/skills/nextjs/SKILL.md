---
name: nextjs
description: Next.js App Router patterns and best practices. Auto-loaded when writing, reviewing, or discussing Next.js code, components, routing, data fetching, or performance optimization.
---

# Next.js Best Practices (App Router)

## Server vs Client Components

- **Default to Server Components** — they run on the server, have no JS bundle cost, and can directly access databases/APIs
- Only use `"use client"` when you need: browser APIs, event handlers, `useState`, `useEffect`, or third-party client libraries
- Keep Client Components as leaf nodes — push `"use client"` as far down the tree as possible
- Pass Server Component data as props to Client Components; never fetch in Client Components what you can fetch on the server

```tsx
// Good: data fetched server-side, passed to client leaf
async function Page() {
  const data = await db.query(...)
  return <ClientChart data={data} />
}
```

## Data Fetching

- Fetch in Server Components using `async/await` directly
- Use `fetch()` with Next.js cache options: `cache: 'force-cache'` (static), `next: { revalidate: 60 }` (ISR), `cache: 'no-store'` (dynamic)
- For parallel fetches, use `Promise.all()` — don't waterfall
- Use `React.cache()` to deduplicate repeated fetches within a render

```tsx
// Parallel fetching — not sequential
const [user, posts] = await Promise.all([getUser(id), getPosts(id)])
```

## Routing & File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI, makes route publicly accessible |
| `layout.tsx` | Shared UI, persists across navigations |
| `loading.tsx` | Streaming loading UI (Suspense boundary) |
| `error.tsx` | Error boundary for the segment |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint (Route Handler) |

- Use route groups `(groupName)` for shared layouts without affecting URL structure
- Use parallel routes `@slot` for simultaneous views (modals, dashboards)
- Use intercepting routes `(.)path` for modal patterns that show content in-context

## Performance

- Use `next/image` for all images — automatic optimization, lazy loading, size hints
- Use `next/font` for fonts — zero layout shift, self-hosted automatically
- Use `next/link` for all internal navigation — prefetches on hover
- Lazy-load heavy Client Components: `const Chart = dynamic(() => import('./Chart'), { ssr: false })`
- Use `Suspense` boundaries to stream UI progressively

## Metadata & SEO

```tsx
// Static metadata
export const metadata: Metadata = { title: '...', description: '...' }

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id)
  return { title: product.name }
}
```

## Server Actions

- Use Server Actions for form mutations — no API route needed
- Mark with `"use server"` directive
- Validate input server-side always
- Use `revalidatePath()` or `revalidateTag()` after mutations

```tsx
async function createPost(formData: FormData) {
  "use server"
  const title = formData.get('title') as string
  await db.post.create({ data: { title } })
  revalidatePath('/posts')
}
```

## Common Mistakes to Avoid

- Don't use `useEffect` for data fetching — use Server Components
- Don't put sensitive logic (API keys, DB queries) in Client Components
- Don't use `getServerSideProps` / `getStaticProps` — those are Pages Router patterns
- Don't nest `<Link>` inside `<a>` tags
- Don't forget `loading.tsx` for routes with slow data fetches

# ImpactSoluce v2 — Migration Notice

## Status: MIGRATED TO MONOREPO

The source code from this repository has been **migrated into** the unified monorepo at [`agrosoluce-impact-clean`](https://github.com/Facely1er/agrosoluce-impact-clean) as `apps/impact/`.

---

## What Changed

ImpactSoluce is now developed as a **first-class app** inside the AgroSoluce monorepo, not as a standalone repository.

```
agrosoluce-impact-clean/
├── apps/
│   ├── web/      ← AgroSoluce (cooperative/farmer portal)  🌿 Green/Orange
│   ├── impact/   ← ImpactSoluce (ESG intelligence)         ◈ Teal/Blue  ← you are here
│   └── mobile/   ← Field-agent PWA
└── packages/
    ├── ui/          ← Shared primitive components (Button, Card, Alert…)
    ├── compliance/  ← Shared EUDR constants, readiness scoring logic
    ├── types/       ← Shared TypeScript types
    └── supabase/    ← Shared Supabase client factory
```

---

## Benefits of the Migration

| Before | After |
|---|---|
| Standalone SPA, no code sharing | Monorepo workspace — shared packages available |
| Own Supabase client (manual) | Uses `@agrosoluce/supabase` factory |
| EUDR logic duplicated | Uses `@agrosoluce/compliance` |
| Separate CI/CD | Single Turbo pipeline, one PR workflow |
| Duplicate Button/Card/Badge | Uses `@agrosoluce/ui` primitives |
| Vite 5.4.2 | Stays on Vite 5.4.2 — no forced upgrade |

---

## For Developers

```bash
# Work in the monorepo:
git clone https://github.com/Facely1er/agrosoluce-impact-clean.git
cd agrosoluce-impact-clean

# ImpactSoluce dev server (port 5174):
npm run dev:impact

# Or run all apps together with Turbo:
npm run dev
```

### Env setup for ImpactSoluce

```bash
cd apps/impact
cp .env.example .env
# Edit .env with your Supabase credentials
# VITE_SUPABASE_SCHEMA=impactsoluce  ← important: separate schema from AgroSoluce
```

---

## What Stays the Same

- All 44 pages, 14 component categories, 20+ utility modules — **unchanged**
- Teal `#0F766E` + Blue `#3B82F6` brand palette — **unchanged**
- i18n (EN/FR), React Query, Zod, Lucide — **unchanged**
- Supabase `impactsoluce` schema — **unchanged**, data-isolated from AgroSoluce
- Standalone mode (localStorage fallback) — **unchanged**
- All existing tests — **unchanged**

---

## What Changed in the Code

Only one file was modified during migration:

**`apps/impact/src/lib/supabase.ts`** — the `createClient()` call now uses the shared factory:

```ts
// Before:
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient<Database>(url, key, { db: { schema }, … });

// After:
import { createAppClient } from '@agrosoluce/supabase';
export const supabase = createAppClient<Database>({ url, key, schema, debug });
```

Everything else is identical.

---

## Architecture Docs (in primary repo)

- `docs/strategic/MONOREPO_STRATEGY.md` — Full consolidation rationale and roadmap
- `docs/strategic/UI_UX_BRAND_SEPARATION.md` — Brand distinction guidelines (teal vs green)
- `docs/architecture/SYSTEM_DIAGRAM.md` — System topology with Supabase schema separation

---

## This Repo

This standalone repository may be kept for historical reference but **should not receive new features or bug fixes**. All development happens in `agrosoluce-impact-clean/apps/impact/`.

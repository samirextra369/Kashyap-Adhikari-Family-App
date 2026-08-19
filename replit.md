# Kashyap Adhikari Family Platform

Kashyap Family helps Nepal's Kashyap Adhikari community preserve genealogy, discover family connections, and carry cultural knowledge forward.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/kashyap-family` — Expo mobile app for the member experience.
- `artifacts/api-server` — shared Express API foundation for later server-backed phases.
- `lib/api-spec/openapi.yaml` — source of truth for future API contracts.
- `artifacts/kashyap-family/constants/colors.ts` — mobile semantic theme tokens.

## Architecture decisions

- The product is being delivered in phases; the first mobile build focuses on the family-first experience before social features.
- Genealogy remains a separate domain from community posts and chat in the planned architecture.
- The mobile foundation uses Expo Router and a light, culturally respectful visual language with Nepali/English readiness.

## Product

Phase 1 mobile foundation includes Home, Family, Culture, and Profile tabs; fictional family-tree demo data; relative search; relationship-finder entry point; culture articles; notification and language preferences; and AsyncStorage-backed preferences.

## User preferences

- Build incrementally from the supplied requirements, prioritizing verified genealogy data, privacy, and clarity over secondary social features.

## Gotchas

- Keep demo genealogy fictional until real data governance and backend approval workflows are implemented.
- The mobile preview is an Expo app and should be run through its managed workflow rather than direct Expo shell commands.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

# AI-Native Knowledge Layer — Implementation Plan & Task Tracker

## Status Legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Done

---

## Phase 1 — Entity Data Layer (`lib/data/`)
- [x] `lib/data/person.ts` — Canonical Person entity
- [x] `lib/data/projects.ts` — Static project entities
- [x] `lib/data/technologies.ts` — Technology entities
- [x] `lib/data/services.ts` — Services offered
- [x] `lib/data/faqs.ts` — Semantic FAQs
- [x] `lib/data/graph.ts` — Knowledge graph builder

## Phase 2 — TypeScript Types (`lib/types/`)
- [x] `lib/types/entities.ts` — All entity interfaces + API response type

## Phase 3 — Schema Generators (`lib/schema/`)
- [x] `lib/schema/generate-schema.ts` — Central schema factory
- [x] `components/JsonLd.tsx` — Enrich existing + add FAQJsonLd, ProjectJsonLd

## Phase 4 — Knowledge API (`app/api/v1/`)
- [x] `app/api/v1/person/route.ts`
- [x] `app/api/v1/projects/route.ts`
- [x] `app/api/v1/skills/route.ts`
- [x] `app/api/v1/services/route.ts`
- [x] `app/api/v1/faq/route.ts`
- [x] `app/api/v1/graph/route.ts`

## Phase 5 — Crawler & Discovery
- [x] `app/robots.ts` — Add AI crawler allow rules
- [x] `app/sitemap.ts` — Add API endpoints
- [x] `public/llms.txt` — Add API links section
- [x] `public/llms-full.txt` — Add FAQs, Key Facts, API refs

## Phase 6 — Content Governance
- [x] `scripts/validate-content.ts` — Validation CLI
- [x] `package.json` — Add `validate` script

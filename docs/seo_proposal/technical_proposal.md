# Technical Proposal: AI-Native Knowledge Layer for pasindusampath.com

**Project:** Implementation of an AI-Native Knowledge and LLM Integration Layer  
**Site:** [pasindusampath.com](https://pasindusampath.com)  
**Document Type:** Technical Implementation Proposal  
**Version:** 1.0  
**Date:** 2026-07-25  
**Stack:** Next.js · TypeScript · JSON-LD · Schema.org · REST API

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Objective](#2-objective)
3. [Architecture Overview](#3-architecture-overview)
4. [Technology Stack](#4-technology-stack)
5. [Implementation Phases](#5-implementation-phases)
   - [Phase 1 – Knowledge Audit](#phase-1--knowledge-audit)
   - [Phase 2 – Entity Modeling](#phase-2--entity-modeling)
   - [Phase 3 – Internal Knowledge Graph](#phase-3--internal-knowledge-graph)
   - [Phase 4 – Schema.org Implementation](#phase-4--schemaorg-implementation)
   - [Phase 5 – AI Metadata Layer](#phase-5--ai-metadata-layer)
   - [Phase 6 – LLM Optimization](#phase-6--llm-optimization)
   - [Phase 7 – Knowledge API](#phase-7--knowledge-api)
   - [Phase 8 – Semantic Search](#phase-8--semantic-search)
   - [Phase 9 – AI Content Pipeline](#phase-9--ai-content-pipeline)
   - [Phase 10 – Content Relationship Engine](#phase-10--content-relationship-engine)
   - [Phase 11 – Performance](#phase-11--performance)
   - [Phase 12 – AI Crawler Accessibility](#phase-12--ai-crawler-accessibility)
   - [Phase 13 – Content Governance](#phase-13--content-governance)
   - [Phase 14 – Future Extensibility](#phase-14--future-extensibility)
6. [File & Directory Structure](#6-file--directory-structure)
7. [API Reference](#7-api-reference)
8. [Deliverables](#8-deliverables)
9. [Success Criteria](#9-success-criteria)
10. [Development Principles](#10-development-principles)

---

## 1. Executive Summary

This document is the **technical blueprint** for transforming `pasindusampath.com` from a conventional portfolio website into a fully **AI-native knowledge platform**. The platform will be optimized for consumption by LLMs, AI search engines (Google AI Overviews, Perplexity, ChatGPT, Claude, Gemini, Microsoft Copilot), and future AI indexing systems.

The approach centers on four pillars:

| Pillar | Description |
|---|---|
| **Structured Data** | Schema.org JSON-LD across all page types |
| **Knowledge Graph** | Canonical entity relationships across all content |
| **Machine-Readable APIs** | Versioned JSON endpoints for all major entities |
| **AI Content Layer** | LLM-optimized summaries, FAQs, and key facts per page |

All implementations will use open standards and avoid vendor lock-in.

---

## 2. Objective

Transform the website so that **Pasindu Sampath** is recognized as a clearly defined, semantically rich entity across all major AI search and retrieval systems.

### Target AI Platforms

- Google AI Overviews
- Perplexity AI
- ChatGPT (web browsing / search)
- Claude (Anthropic)
- Gemini (Google)
- Microsoft Copilot
- Future LLM indexing systems

### Target Consumers

- Search engine crawlers
- AI crawlers and indexers
- Knowledge graph builders (Google Knowledge Panel, Wikidata)
- Semantic search systems
- RAG (Retrieval-Augmented Generation) pipelines

---

## 3. Architecture Overview

```
+----------------------------------------------------------+
|                  pasindusampath.com                      |
|                                                          |
|  +--------------+   +--------------+  +--------------+  |
|  |  HTML Pages  |   |  JSON-LD /   |  |  Knowledge   |  |
|  |  (Semantic)  |   |  Schema.org  |  |     API      |  |
|  +------+-------+   +------+-------+  +------+-------+  |
|         |                  |                  |          |
|  +------v------------------v------------------v-------+  |
|  |              Internal Knowledge Graph              |  |
|  |   Person <-> Projects <-> Articles <-> Technologies|  |
|  |   Services <-> Case Studies <-> Research <-> FAQs  |  |
|  +----------------------------+-----------------------+  |
|                               |                          |
|  +----------------------------v-----------------------+  |
|  |             AI Metadata & LLM Layer               |  |
|  |  Summaries . Key Facts . FAQs . Content Version   |  |
|  +---------------------------------------------------+  |
+----------------------------------------------------------+
```

---

## 4. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | SSG/SSR, native metadata API, file-based routing |
| Language | TypeScript | Type safety for entity models and API contracts |
| Structured Data | JSON-LD + Schema.org | Industry standard, natively parsed by Google & AI crawlers |
| Search | Fuse.js / FlexSearch | Lightweight lexical search, no external dependency |
| Content | MDX / JSON data files | Version-controlled, easily machine-readable |
| API | Next.js Route Handlers | `/api/*` endpoints, versioned JSON responses |
| Sitemap | `next-sitemap` or `app/sitemap.ts` | Automatic generation on build |
| Validation | Zod | Schema validation for entity models and API responses |
| Performance | Next.js Image + Turbopack | Optimal asset delivery |

---

## 5. Implementation Phases

---

### Phase 1 – Knowledge Audit

**Goal:** Understand the current state of the codebase before making any changes.

#### Tasks

- [ ] Enumerate all existing pages and routes
- [ ] Map all components and their metadata responsibilities
- [ ] Identify existing structured data (if any)
- [ ] Audit `sitemap.ts`, `robots.ts`, `llms.txt`, `humans.txt`
- [ ] Check for duplicate content and missing canonical URLs
- [ ] Identify performance bottlenecks (Core Web Vitals baseline)
- [ ] Evaluate RSS feed presence
- [ ] Review internal link structure

#### Output

A `docs/audit/audit-report.md` file documenting findings, gaps, and recommendations before implementation begins.

---

### Phase 2 – Entity Modeling

**Goal:** Define the canonical data model for Pasindu Sampath as a Person entity — the central node of the knowledge graph.

#### Person Entity Schema

```typescript
interface Person {
  id: string;                    // e.g. "pasindu-sampath"
  name: string;
  url: string;                   // canonical: "https://pasindusampath.com"
  occupation: string[];
  headline: string;
  biography: {
    short: string;               // ~50 words
    medium: string;              // ~150 words
    full: string;                // ~500 words
  };
  skills: Skill[];
  expertise: string[];
  technologies: Technology[];
  projects: ProjectRef[];
  publications: Publication[];
  certifications: Certification[];
  awards: Award[];
  socialProfiles: SocialProfile[];
  organizations: Organization[];
  contact: ContactInfo;
  areasOfSpecialization: string[];
  lastModified: string;          // ISO 8601
}
```

#### Implementation Files

| File | Purpose |
|---|---|
| `lib/data/person.ts` | Canonical Person entity definition |
| `lib/types/entities.ts` | TypeScript interfaces for all entity types |
| `lib/schema/person-schema.ts` | JSON-LD generator for Person schema |

---

### Phase 3 – Internal Knowledge Graph

**Goal:** Model all content as connected entities with typed relationships.

#### Entity Types

| Entity | Description |
|---|---|
| `Person` | Pasindu Sampath — root node |
| `Project` | Portfolio projects |
| `Article` | Blog posts and technical articles |
| `Technology` | Programming languages, tools, frameworks |
| `Service` | Offered professional services |
| `CaseStudy` | Detailed project case studies |
| `Research` | Research papers or investigations |
| `Tool` | Custom-built or used tools |
| `Video` | Tutorial or presentation videos |
| `Event` | Talks, conferences, workshops |
| `FAQ` | Frequently asked questions |

#### Relationship Model

```
Person
  |-- authored --> Article[]
  |-- built --> Project[]
  |-- offers --> Service[]
  |-- skilled in --> Technology[]
  |-- published --> Research[]
  |-- participated in --> Event[]
  `-- answered --> FAQ[]

Project
  |-- uses --> Technology[]
  |-- documented by --> CaseStudy
  |-- referenced in --> Article[]
  `-- demonstrated by --> Video[]

Article
  |-- relates to --> Project[]
  |-- covers --> Technology[]
  `-- references --> Research[]
```

#### Each Entity Must Include

```typescript
interface BaseEntity {
  id: string;                  // Unique slug
  canonicalUrl: string;        // Stable absolute URL
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  relatedEntities: EntityRef[];
  publishedAt: string;         // ISO 8601
  updatedAt: string;           // ISO 8601
  version: number;
}
```

#### Implementation Files

| File | Purpose |
|---|---|
| `lib/data/graph.ts` | Knowledge graph builder |
| `lib/data/projects.ts` | Project entity definitions |
| `lib/data/articles.ts` | Article entity definitions |
| `lib/data/technologies.ts` | Technology entity definitions |
| `lib/data/services.ts` | Service entity definitions |
| `lib/data/faqs.ts` | FAQ entity definitions |

---

### Phase 4 – Schema.org Implementation

**Goal:** Implement comprehensive JSON-LD structured data, dynamically generated from the underlying content models.

#### Schema Types Required

| Schema Type | Applied On |
|---|---|
| `Person` | Homepage, About page |
| `Organization` | Homepage |
| `WebSite` + `SearchAction` | Homepage |
| `WebPage` | All pages |
| `Article` / `BlogPosting` | Blog posts, technical articles |
| `FAQPage` | FAQ sections |
| `BreadcrumbList` | All inner pages |
| `ImageObject` | Profile images, project screenshots |
| `VideoObject` | Tutorial or talk pages |
| `CreativeWork` | Projects, open-source work |
| `CollectionPage` | Projects index, blog index |

#### JSON-LD Generator Pattern

```typescript
// lib/schema/generate-schema.ts
export function generatePersonSchema(person: Person): WithContext<SchemaPerson> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://pasindusampath.com/#person",
    name: person.name,
    url: person.url,
    jobTitle: person.occupation[0],
    description: person.biography.short,
    knowsAbout: person.expertise,
    sameAs: person.socialProfiles.map(p => p.url),
    // ... additional fields
  };
}
```

#### Implementation Files

| File | Purpose |
|---|---|
| `lib/schema/generate-schema.ts` | Central schema generator |
| `lib/schema/person-schema.ts` | Person JSON-LD |
| `lib/schema/article-schema.ts` | Article/BlogPosting JSON-LD |
| `lib/schema/project-schema.ts` | CreativeWork JSON-LD for projects |
| `lib/schema/faq-schema.ts` | FAQPage JSON-LD |
| `lib/schema/breadcrumb-schema.ts` | BreadcrumbList JSON-LD |
| `components/JsonLd.tsx` | React component to inject JSON-LD into `<head>` |

---

### Phase 5 – AI Metadata Layer

**Goal:** Each page exposes rich metadata in both HTML `<meta>` tags and JSON-LD, enabling AI crawlers to understand context without parsing the full DOM.

#### Per-Page Metadata Contract

```typescript
interface PageAIMetadata {
  purpose: string;             // What this page is about
  primaryEntity: EntityRef;    // Main entity described
  relatedEntities: EntityRef[];
  keywords: string[];
  topics: string[];
  readingTimeMinutes: number;
  contentVersion: number;
  lastUpdated: string;
  author: PersonRef;
  contentType: 'page' | 'article' | 'project' | 'service' | 'faq';
}
```

#### HTML Meta Tags (per page)

```html
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<meta name="author" content="Pasindu Sampath" />
<meta name="content-type" content="article" />
<meta name="reading-time" content="5" />
<meta name="last-modified" content="2026-07-25" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

#### Implementation

- Use Next.js `generateMetadata()` on every page
- Metadata generated from the same data source as JSON-LD (single source of truth)

---

### Phase 6 – LLM Optimization

**Goal:** Provide AI-consumable summaries, key facts, and FAQs for every major page.

#### AI Summary Structure (per page)

```typescript
interface AIPageSummary {
  brief: string;       // ~50 words — for AI snippet extraction
  standard: string;    // ~150 words — for AI overview generation
  extended: string;    // ~500 words — for deep RAG retrieval
}
```

> **Rule:** Summaries must remain synchronized with primary content. Automated validation will flag drift.

#### Key Facts Format

```json
{
  "entity": "Pasindu Sampath",
  "facts": [
    { "question": "Who is Pasindu Sampath?", "answer": "..." },
    { "question": "What are his areas of expertise?", "answer": "..." },
    { "question": "What technologies does he work with?", "answer": "..." },
    { "question": "What services does he offer?", "answer": "..." },
    { "question": "What are his current projects?", "answer": "..." }
  ]
}
```

#### FAQ Generation

- Semantic FAQs generated for: Homepage, About, Projects, Services, Blog
- Each FAQ uses `FAQPage` JSON-LD schema
- Stored in `lib/data/faqs.ts` as typed data

---

### Phase 7 – Knowledge API

**Goal:** Expose machine-readable, versioned JSON endpoints for all major entities.

#### API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/person` | GET | Full person entity |
| `/api/v1/projects` | GET | All projects |
| `/api/v1/projects/[id]` | GET | Single project |
| `/api/v1/articles` | GET | All articles |
| `/api/v1/articles/[id]` | GET | Single article |
| `/api/v1/skills` | GET | Skills and proficiency levels |
| `/api/v1/services` | GET | All services offered |
| `/api/v1/publications` | GET | Research and publications |
| `/api/v1/research` | GET | Research entities |
| `/api/v1/faq` | GET | All FAQs |
| `/api/v1/graph` | GET | Full knowledge graph (entity map) |

#### Response Format

```typescript
interface ApiResponse<T> {
  version: "1.0";
  generated: string;         // ISO 8601 timestamp
  entity: string;            // Entity type name
  canonicalUrl: string;
  data: T;
}
```

#### Example: `/api/v1/person`

```json
{
  "version": "1.0",
  "generated": "2026-07-25T13:00:00Z",
  "entity": "Person",
  "canonicalUrl": "https://pasindusampath.com",
  "data": {
    "id": "pasindu-sampath",
    "name": "Pasindu Sampath",
    "url": "https://pasindusampath.com",
    "biography": {
      "short": "...",
      "medium": "...",
      "full": "..."
    },
    "skills": [],
    "projects": [],
    "socialProfiles": []
  }
}
```

#### Implementation Files

| File | Purpose |
|---|---|
| `app/api/v1/person/route.ts` | Person API handler |
| `app/api/v1/projects/route.ts` | Projects API handler |
| `app/api/v1/articles/route.ts` | Articles API handler |
| `app/api/v1/skills/route.ts` | Skills API handler |
| `app/api/v1/services/route.ts` | Services API handler |
| `app/api/v1/faq/route.ts` | FAQ API handler |
| `app/api/v1/graph/route.ts` | Full knowledge graph API |

---

### Phase 8 – Semantic Search

**Goal:** Implement a search system that supports entity-aware, semantically meaningful queries.

#### Search Capabilities

| Mode | Description |
|---|---|
| Full-text | Standard keyword matching across all content |
| Tag search | Filter by tags across all entity types |
| Topic search | Search by topic category |
| Technology search | Find content by technology used |
| Entity search | Query specific entity types (projects, articles, etc.) |
| Related content | Surface related entities for any given page |

#### Technical Approach

```typescript
// Hybrid search: lexical + faceted filtering
const searchEngine = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "description", "tags", "topics", "content"],
    store: ["id", "title", "canonicalUrl", "description", "type"]
  }
});
```

- Search index built at build time from entity data files
- Client-side search with pre-built index (no server required for basic search)
- Faceted filters: `type`, `tag`, `technology`, `topic`

#### Implementation Files

| File | Purpose |
|---|---|
| `lib/search/build-index.ts` | Build-time search index generator |
| `lib/search/search.ts` | Search utilities and query handlers |
| `app/api/v1/search/route.ts` | Optional server-side search API |
| `components/Search.tsx` | UI search component |

---

### Phase 9 – AI Content Generation Pipeline

**Goal:** Build tooling that assists with content maintenance using AI suggestions — all requiring human review.

#### Pipeline Capabilities

| Capability | Description |
|---|---|
| Outdated content detection | Flag pages not updated in > 90 days |
| Internal link suggestions | Identify unlinked entity mentions |
| Schema improvement recommendations | Detect missing or incomplete JSON-LD |
| Thin content flagging | Pages with word count below threshold |
| Topic gap analysis | Identify expertise areas lacking articles |
| New article opportunities | Suggest topics based on existing knowledge graph |

#### Implementation Approach

```typescript
// scripts/content-audit.ts
interface ContentAuditReport {
  outdatedPages: PageRef[];
  missingInternalLinks: LinkSuggestion[];
  schemaIssues: SchemaIssue[];
  thinContentPages: PageRef[];
  topicGaps: string[];
  articleOpportunities: ArticleSuggestion[];
}
```

- Runs as a CLI script: `npx ts-node scripts/content-audit.ts`
- Generates a markdown report at `docs/content-audit/report.md`
- Does NOT auto-publish — all suggestions require human review

---

### Phase 10 – Content Relationship Engine

**Goal:** Automatically identify and maintain bidirectional relationships between content entities.

#### Relationship Map

| From | Relationship | To |
|---|---|---|
| Articles | references | Projects |
| Projects | uses | Technologies |
| Services | demonstrated by | Case Studies |
| Research | published as | Articles |
| Videos | explains | Tutorials |
| Skills | demonstrated in | Projects |

#### Bidirectional Enforcement

```typescript
// Validate bidirectional links at build time
function validateRelationships(graph: KnowledgeGraph): ValidationResult {
  const errors: RelationshipError[] = [];
  for (const [entity, refs] of Object.entries(graph.relationships)) {
    for (const ref of refs) {
      const target = graph.entities[ref.id];
      if (!target.relatedEntities.find(r => r.id === entity)) {
        errors.push({ entity, ref, issue: "Missing reverse relationship" });
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
```

---

### Phase 11 – Performance

**Goal:** Maintain excellent Core Web Vitals throughout all implementations.

#### Targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID / INP (Interaction to Next Paint) | < 200ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTFB (Time to First Byte) | < 800ms |
| Lighthouse Performance Score | >= 90 |

#### Strategies

- **Static Generation (SSG):** All content pages pre-rendered at build time
- **Image Optimization:** Next.js `<Image>` component with WebP/AVIF
- **Lazy Loading:** Off-screen images and non-critical components
- **Minimal JS:** API route handlers serve JSON; no heavy client-side JS for content
- **Efficient Caching:** `Cache-Control` headers on all `/api/v1/*` responses
- **Bundle Analysis:** Regular `next-bundle-analyzer` audits

---

### Phase 12 – AI Crawler Accessibility

**Goal:** Ensure all major AI crawlers can efficiently discover and process the site's content.

#### Required Files

| File | Location | Purpose |
|---|---|---|
| `sitemap.xml` | `/sitemap.xml` | All pages with priority and change frequency |
| `robots.txt` | `/robots.txt` | Crawler rules — allow AI crawlers by default |
| `llms.txt` | `/llms.txt` | LLM-optimized site overview (Markdown) |
| `llms-full.txt` | `/llms-full.txt` | Complete content dump for LLM ingestion |
| RSS feed | `/feed.xml` | Articles and blog posts |

#### robots.txt Policy

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GoogleOther
Allow: /

Sitemap: https://pasindusampath.com/sitemap.xml
```

#### llms.txt Structure

```markdown
# Pasindu Sampath

> [Brief description — who Pasindu is, what he does]

## Key Pages
- [About](/about): ...
- [Projects](/projects): ...
- [Services](/services): ...
- [Blog](/blog): ...

## Machine-Readable Data
- [Full Knowledge API](/api/v1/person)
```

---

### Phase 13 – Content Governance

**Goal:** Automated validation ensures quality and consistency of all content metadata at build time.

#### Validation Rules

| Rule | Scope |
|---|---|
| Every page has a `<title>` | All pages |
| Every page has a `<meta name="description">` | All pages |
| Every page has valid JSON-LD | All pages |
| Every `<img>` has descriptive `alt` text | All pages |
| All internal `href` links resolve | All pages |
| All entity `canonicalUrl` values are stable | All entities |
| No two pages share the same `<title>` | All pages |
| Metadata matches JSON-LD content | All pages |

#### Implementation

```typescript
// scripts/validate-content.ts
async function validateAllPages(): Promise<ValidationReport> {
  const pages = await getAllPages();
  const results = await Promise.all(pages.map(validatePage));
  return buildReport(results);
}
```

Runs as a pre-build check: `npm run validate` — build fails if critical rules are violated.

---

### Phase 14 – Future Extensibility

**Goal:** Architect the system so the following extensions require minimal refactoring.

#### Planned Extension Points

| Feature | Readiness Requirement |
|---|---|
| Public API (external consumers) | Versioned `/api/v1/*` endpoints (already built) |
| Knowledge graph visualization | Graph data model exported as JSON |
| Vector search | Entity descriptions embeddings-ready (clean text fields) |
| RAG pipeline | `llms-full.txt` + `/api/v1/graph` as ingestion source |
| MCP integration | JSON-LD context compatible; API endpoints machine-readable |
| AI assistant on first-party content | Structured data + full-text export already available |
| Multilingual content | i18n-aware routing via Next.js `app/[locale]/` pattern |

---

## 6. File & Directory Structure

```
pasindusampath.com/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── person/route.ts
│   │       ├── projects/route.ts
│   │       ├── articles/route.ts
│   │       ├── skills/route.ts
│   │       ├── services/route.ts
│   │       ├── publications/route.ts
│   │       ├── research/route.ts
│   │       ├── faq/route.ts
│   │       ├── graph/route.ts
│   │       └── search/route.ts
│   ├── sitemap.ts
│   └── robots.ts
│
├── lib/
│   ├── data/
│   │   ├── person.ts
│   │   ├── projects.ts
│   │   ├── articles.ts
│   │   ├── technologies.ts
│   │   ├── services.ts
│   │   ├── faqs.ts
│   │   ├── research.ts
│   │   └── graph.ts
│   ├── schema/
│   │   ├── generate-schema.ts
│   │   ├── person-schema.ts
│   │   ├── article-schema.ts
│   │   ├── project-schema.ts
│   │   ├── faq-schema.ts
│   │   └── breadcrumb-schema.ts
│   ├── search/
│   │   ├── build-index.ts
│   │   └── search.ts
│   └── types/
│       └── entities.ts
│
├── components/
│   ├── JsonLd.tsx
│   └── Search.tsx
│
├── public/
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── humans.txt
│   └── feed.xml
│
├── scripts/
│   ├── content-audit.ts
│   └── validate-content.ts
│
└── docs/
    ├── seo_proposal/
    │   ├── proposal.md
    │   └── technical_proposal.md
    └── audit/
        └── audit-report.md
```

---

## 7. API Reference

### Base URL

```
https://pasindusampath.com/api/v1
```

### Authentication

All endpoints are **public** and read-only. No authentication required.

### Caching

All responses include:

```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

### Endpoints Summary

| Method | Path | Response |
|---|---|---|
| GET | `/api/v1/person` | Full person entity |
| GET | `/api/v1/projects` | Array of all projects |
| GET | `/api/v1/projects/[id]` | Single project by ID |
| GET | `/api/v1/articles` | Array of all articles |
| GET | `/api/v1/articles/[id]` | Single article by ID |
| GET | `/api/v1/skills` | Skills with proficiency |
| GET | `/api/v1/services` | Services offered |
| GET | `/api/v1/publications` | Publications list |
| GET | `/api/v1/research` | Research entities |
| GET | `/api/v1/faq` | All FAQs |
| GET | `/api/v1/graph` | Complete knowledge graph |
| GET | `/api/v1/search?q=...` | Search across all entities |

---

## 8. Deliverables

| # | Deliverable | Description |
|---|---|---|
| 1 | AI-ready website architecture | All phases implemented and documented |
| 2 | Comprehensive structured data | JSON-LD for all page types, validated |
| 3 | Internal knowledge graph | Typed entity model with relationships |
| 4 | Machine-readable APIs | `/api/v1/*` endpoints, versioned JSON |
| 5 | Semantic search | Full-text + faceted entity search |
| 6 | Content validation | Build-time governance checks |
| 7 | AI metadata generation | Per-page summaries, key facts, FAQs |
| 8 | Technical documentation | Architecture docs + maintenance guide |

---

## 9. Success Criteria

The project will be considered **complete** when all of the following are true:

- [ ] `pasindusampath.com` is recognized as a distinct, well-defined Person entity in Google Search Console
- [ ] All pages pass Google Rich Results Test without errors
- [ ] All `/api/v1/*` endpoints return valid, schema-validated JSON
- [ ] Lighthouse Performance score >= 90 on all major pages
- [ ] Content validation script passes with zero critical errors
- [ ] `llms.txt` and `llms-full.txt` accurately represent the full site content
- [ ] Knowledge graph includes all content types with bidirectional relationships
- [ ] AI crawlers (GPTBot, ClaudeBot, PerplexityBot) are permitted in `robots.txt`
- [ ] Architecture supports RAG, vector search, and MCP integration without redesign

---

## 10. Development Principles

1. **Open Standards First** — Prefer Schema.org, JSON-LD, and W3C standards over proprietary solutions
2. **Single Source of Truth** — Entity data defined once in `lib/data/`, consumed everywhere
3. **Machine-Readable by Default** — Every piece of content should have a machine-readable representation
4. **Human-First UX** — AI optimization must not degrade the human visitor experience
5. **Validate at Build Time** — Content governance enforced in CI, not as an afterthought
6. **Stable Identifiers** — Entity IDs and canonical URLs must not change once published
7. **Versioned APIs** — All API responses include version fields; breaking changes get a new version
8. **Human Review Required** — All AI-generated content suggestions require explicit human approval before publishing

---

*Technical Proposal — pasindusampath.com AI-Native Knowledge Layer*  
*Prepared: 2026-07-25 | Version: 1.0*

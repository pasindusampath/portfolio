// components/JsonLd.tsx
// JSON-LD structured data components — all generated from lib/schema/generate-schema.ts
// which in turn reads from the canonical lib/data/* entity files.

import {
  generatePersonSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateProjectSchema,
  generateWebPageSchema,
  generateOrganizationSchema,
} from "@/lib/schema/generate-schema";
import type { ProjectEntity } from "@/lib/types/entities";

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Person ───────────────────────────────────────────────

export function PersonJsonLd() {
  return <JsonLdScript data={generatePersonSchema()} />;
}

// ─── WebSite + SearchAction ───────────────────────────────

export function WebSiteJsonLd() {
  return <JsonLdScript data={generateWebSiteSchema()} />;
}

// ─── Organization ─────────────────────────────────────────

export function OrganizationJsonLd() {
  return <JsonLdScript data={generateOrganizationSchema()} />;
}

// ─── WebPage ──────────────────────────────────────────────

export function WebPageJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return (
    <JsonLdScript
      data={generateWebPageSchema({
        title,
        description,
        url,
        datePublished,
        dateModified,
      })}
    />
  );
}

// ─── BreadcrumbList ───────────────────────────────────────

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return <JsonLdScript data={generateBreadcrumbSchema(items)} />;
}

// ─── FAQPage ──────────────────────────────────────────────

/**
 * Renders FAQ structured data for a specific page path.
 * @param pageFilter - e.g. "/" for homepage FAQs, "/about" for about page FAQs.
 *                     If omitted, renders all FAQs.
 */
export function FAQJsonLd({ pageFilter }: { pageFilter?: string }) {
  return <JsonLdScript data={generateFAQSchema(pageFilter)} />;
}

// ─── Project (CreativeWork) ───────────────────────────────

export function ProjectJsonLd({ project }: { project: ProjectEntity }) {
  return <JsonLdScript data={generateProjectSchema(project)} />;
}

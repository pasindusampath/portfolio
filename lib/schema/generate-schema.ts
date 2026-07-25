// lib/schema/generate-schema.ts
// Central schema factory — typed JSON-LD generators for all Schema.org types

import { person } from "@/lib/data/person";
import { faqItems } from "@/lib/data/faqs";
import type { ProjectEntity } from "@/lib/types/entities";

const BASE_URL = "https://pasindusampath.com";

// ─── Person ───────────────────────────────────────────────

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: person.name,
    url: person.canonicalUrl,
    image: {
      "@type": "ImageObject",
      url: person.image,
      width: 400,
      height: 400,
    },
    jobTitle: person.occupation[0],
    description: person.biography.brief,
    birthDate: person.birthDate,
    nationality: {
      "@type": "Country",
      name: person.nationality,
    },
    knowsAbout: person.expertise,
    sameAs: person.socialProfiles.map((p) => p.url),
    email: person.email,
    worksFor: {
      "@type": "Organization",
      name: person.workExperiences.find((w) => w.current)?.company ?? person.organizations[0]?.name,
      url: person.workExperiences.find((w) => w.current)?.companyUrl ?? person.organizations[0]?.url,
    },
    alumniOf: {
      "@type": "Organization",
      name: "CodeSchool.lk",
      url: "https://codeschool.lk",
    },
    hasOccupation: person.workExperiences.map((exp) => ({
      "@type": "Role",
      roleName: exp.role,
      startDate: exp.startDate,
      ...(exp.endDate && { endDate: exp.endDate }),
      hasOccupation: {
        "@type": "Occupation",
        name: exp.level,
        occupationLocation: {
          "@type": "Country",
          name: "Sri Lanka",
        },
      },
    })),
  };
}


// ─── WebSite ──────────────────────────────────────────────

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Pasindu Sampath — Portfolio",
    url: BASE_URL,
    description:
      "Personal portfolio and knowledge platform of Pasindu Sampath — Software Engineer, Educator & Content Creator from Sri Lanka.",
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: person.name,
    },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── WebPage ──────────────────────────────────────────────

export function generateWebPageSchema({
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
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: title,
    description,
    url,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    author: { "@id": `${BASE_URL}/#person` },
    datePublished: datePublished ?? "2024-08-01",
    dateModified: dateModified ?? new Date().toISOString().split("T")[0],
    inLanguage: "en",
  };
}

// ─── BreadcrumbList ───────────────────────────────────────

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── FAQPage ──────────────────────────────────────────────

export function generateFAQSchema(pageFilter?: string) {
  const items = pageFilter
    ? faqItems.filter((faq) => faq.appliesTo.includes(pageFilter))
    : faqItems;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── CreativeWork (Project) ───────────────────────────────

export function generateProjectSchema(project: ProjectEntity) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${project.canonicalUrl}#project`,
    name: project.title,
    description: project.description,
    url: project.canonicalUrl,
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: person.name,
    },
    creator: { "@id": `${BASE_URL}/#person` },
    datePublished: project.publishedAt,
    dateModified: project.updatedAt,
    keywords: project.tags.join(", "),
    ...(project.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: project.imageUrl,
      },
    }),
    ...(project.demoUrl && { sameAs: project.demoUrl }),
  };
}

// ─── Organization ─────────────────────────────────────────

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://codeschool.lk/#organization",
    name: "CodeSchool.lk",
    url: "https://codeschool.lk",
    description:
      "Online programming education platform founded by Pasindu Sampath. Teaches Java, Spring Boot, React, and more to university students in Sri Lanka.",
    founder: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: person.name,
    },
  };
}

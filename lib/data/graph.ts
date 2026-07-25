// lib/data/graph.ts
// Knowledge graph builder — exports the full entity relationship map

import type { KnowledgeGraph, EntityRef } from "@/lib/types/entities";
import { person } from "./person";
import { technologies } from "./technologies";
import { services } from "./services";
import { projects } from "./projects";

const BASE_URL = "https://pasindusampath.com";

function buildEntitiesMap(): Record<string, EntityRef> {
  const entities: Record<string, EntityRef> = {};

  // Person (root)
  entities[person.id] = {
    id: person.id,
    title: person.name,
    canonicalUrl: person.canonicalUrl,
    type: "person",
  };

  // Technologies
  for (const tech of technologies) {
    entities[tech.id] = {
      id: tech.id,
      title: tech.title,
      canonicalUrl: tech.canonicalUrl,
      type: "technology",
    };
  }

  // Services
  for (const svc of services) {
    entities[svc.id] = {
      id: svc.id,
      title: svc.title,
      canonicalUrl: svc.canonicalUrl,
      type: "service",
    };
  }

  // Projects
  for (const proj of projects) {
    entities[proj.id] = {
      id: proj.id,
      title: proj.title,
      canonicalUrl: proj.canonicalUrl,
      type: "project",
    };
  }

  // Pages
  const pages: Array<{ id: string; title: string; path: string }> = [
    { id: "page-home", title: "Home", path: "/" },
    { id: "page-about", title: "About", path: "/about" },
    { id: "page-projects", title: "Projects", path: "/projects" },
    { id: "page-contact", title: "Contact", path: "/contact" },
  ];
  for (const page of pages) {
    entities[page.id] = {
      id: page.id,
      title: page.title,
      canonicalUrl: `${BASE_URL}${page.path}`,
      type: "page",
    };
  }

  return entities;
}

export function buildKnowledgeGraph(): KnowledgeGraph {
  const entities = buildEntitiesMap();
  const now = new Date().toISOString();

  return {
    version: "1.0",
    generated: now,
    rootEntity: person.id,
    entities,
    relationships: [
      // Person → Technologies
      ...technologies.map((tech) => ({
        from: person.id,
        to: tech.id,
        relation: "skilled_in",
        bidirectional: false,
      })),

      // Person → Services
      ...services.map((svc) => ({
        from: person.id,
        to: svc.id,
        relation: "offers",
        bidirectional: false,
      })),

      // Person → Projects
      ...projects.map((proj) => ({
        from: person.id,
        to: proj.id,
        relation: "built",
        bidirectional: false,
      })),

      // Projects → Technologies
      {
        from: "portfolio",
        to: "nextjs",
        relation: "uses",
        bidirectional: false,
      },
      {
        from: "portfolio",
        to: "typescript",
        relation: "uses",
        bidirectional: false,
      },
      {
        from: "portfolio",
        to: "tailwind-css",
        relation: "uses",
        bidirectional: false,
      },
      {
        from: "portfolio",
        to: "react",
        relation: "uses",
        bidirectional: false,
      },
      {
        from: "portfolio",
        to: "vercel",
        relation: "deployed_on",
        bidirectional: false,
      },
      {
        from: "portfolio",
        to: "cloudinary",
        relation: "uses",
        bidirectional: false,
      },
      {
        from: "codeschool",
        to: "java",
        relation: "teaches",
        bidirectional: false,
      },
      {
        from: "codeschool",
        to: "spring-boot",
        relation: "teaches",
        bidirectional: false,
      },

      // Service → Projects
      {
        from: "programming-education",
        to: "codeschool",
        relation: "delivered_through",
        bidirectional: false,
      },
      {
        from: "software-engineering",
        to: "portfolio",
        relation: "demonstrated_by",
        bidirectional: false,
      },
    ],
  };
}

// Export a pre-built static snapshot for fast API responses
export const knowledgeGraph = buildKnowledgeGraph();

// lib/types/entities.ts
// Central TypeScript interfaces for the AI-Native Knowledge Layer

export type ContentType =
  | "page"
  | "article"
  | "project"
  | "service"
  | "faq"
  | "technology"
  | "person";

export interface EntityRef {
  id: string;
  title: string;
  canonicalUrl: string;
  type: ContentType;
}

export interface BaseEntity {
  id: string;
  canonicalUrl: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  relatedEntities: EntityRef[];
  publishedAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  version: number;
}

// ─── Person ───────────────────────────────────────────────

export interface SocialProfile {
  platform: string;
  url: string;
  handle?: string;
}

export interface Biography {
  brief: string; // ~50 words
  standard: string; // ~150 words
  extended: string; // ~500 words
}

export interface PersonEntity {
  id: string;
  name: string;
  canonicalUrl: string;
  image: string;
  occupation: string[];
  headline: string;
  biography: Biography;
  expertise: string[];
  technologies: string[];
  skills: SkillCategory[];
  socialProfiles: SocialProfile[];
  email: string;
  birthDate: string;
  nationality: string;
  location: string;
  organizations: OrganizationRef[];
  areasOfSpecialization: string[];
  workExperiences: WorkExperience[];
  lastModified: string;          // ISO 8601
}

export interface OrganizationRef {
  name: string;
  url: string;
  role: string;
}

// ─── Work Experience ──────────────────────────────────────

export interface WorkExperience {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  level: string;                // e.g. "Backend Engineer", "Junior Software Engineer", "ASE"
  startDate: string;            // ISO 8601 "YYYY-MM"
  endDate?: string;             // ISO 8601 "YYYY-MM" | undefined = present
  current: boolean;
  location: string;             // e.g. "Sri Lanka (Remote)"
  type: "full-time" | "part-time" | "contract" | "internship" | "collaborative";
  summary: string;
  highlights: string[];         // Key achievements / contributions
  skills: string[];             // Skills gained / used
  projects?: string[];          // Notable project IDs or names
}

// ─── Skill ────────────────────────────────────────────────

export interface SkillCategory {
  category: string;
  items: string[];
}

// ─── Technology ───────────────────────────────────────────

export type TechnologyCategory =
  | "language"
  | "framework"
  | "database"
  | "tool"
  | "platform"
  | "pattern";

export interface TechnologyEntity extends BaseEntity {
  type: ContentType;
  techCategory: TechnologyCategory;
  usedIn: string[]; // project IDs
}

// ─── Project ──────────────────────────────────────────────

export interface ProjectEntity extends BaseEntity {
  type: ContentType;
  imageUrl: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: "live" | "archived" | "in-progress";
}

// ─── Service ──────────────────────────────────────────────

export interface ServiceEntity extends BaseEntity {
  type: ContentType;
  deliverables: string[];
  audience: string[];
}

// ─── FAQ ──────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  appliesTo: string[]; // page paths e.g. "/", "/about"
}

export interface FAQEntity {
  entity: string;
  items: FAQItem[];
  lastModified: string;
}

// ─── Knowledge Graph ──────────────────────────────────────

export interface GraphRelationship {
  from: string; // entity id
  to: string; // entity id
  relation: string;
  bidirectional: boolean;
}

export interface KnowledgeGraph {
  version: string;
  generated: string;
  rootEntity: string;
  entities: Record<string, EntityRef>;
  relationships: GraphRelationship[];
}

// ─── AI Page Summary ──────────────────────────────────────

export interface AIPageSummary {
  brief: string; // ~50 words
  standard: string; // ~150 words
  extended: string; // ~500 words
}

// ─── API Response ─────────────────────────────────────────

export interface ApiResponse<T> {
  version: "1.0";
  generated: string; // ISO 8601
  entity: string;
  canonicalUrl: string;
  data: T;
}

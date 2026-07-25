// lib/data/services.ts
// Services offered by Pasindu Sampath — drives /api/v1/services and schema generation

import type { ServiceEntity } from "@/lib/types/entities";

export const services: ServiceEntity[] = [
  {
    id: "software-engineering",
    canonicalUrl: "https://pasindusampath.com/contact",
    title: "Software Engineering",
    description:
      "Full-stack web application development using Java (Spring Boot, Hibernate), React, Next.js, TypeScript, and MySQL. Specializing in REST API development, database design, and production-grade enterprise applications.",
    type: "service",
    categories: ["engineering", "development"],
    tags: [
      "java",
      "spring-boot",
      "react",
      "nextjs",
      "fullstack",
      "rest-api",
      "mysql",
    ],
    relatedEntities: [],
    deliverables: [
      "REST API development",
      "Full-stack web applications",
      "Database schema design",
      "Code review and consultation",
      "Production deployment on Vercel",
    ],
    audience: [
      "Startups",
      "Small businesses",
      "Individuals needing web applications",
    ],
    publishedAt: "2024-08-01",
    updatedAt: "2026-07-25",
    version: 1,
  },
  {
    id: "programming-education",
    canonicalUrl: "https://codeschool.lk",
    title: "Programming Education & Tutoring",
    description:
      "Online programming education through CodeSchool.lk — teaching Java, OOP, Data Structures, Spring Boot, Hibernate, MySQL, JavaScript, React, and JavaFX to university students across Sri Lanka. Known for making complex concepts simple and approachable.",
    type: "service",
    categories: ["education", "teaching", "tutoring"],
    tags: [
      "java",
      "teaching",
      "codeschool",
      "online-education",
      "programming",
    ],
    relatedEntities: [],
    deliverables: [
      "Recorded video courses",
      "Live tutoring sessions",
      "Step-by-step curriculum",
      "Practical project-based learning",
      "Student community support",
    ],
    audience: [
      "University students in Sri Lanka",
      "Self-taught developers",
      "Beginners to programming",
      "Intermediate developers learning Java/Spring Boot",
    ],
    publishedAt: "2022-01-01",
    updatedAt: "2026-07-25",
    version: 1,
  },
  {
    id: "content-creation",
    canonicalUrl: "https://pasindusampath.com",
    title: "Comedy & Tech Content Creation",
    description:
      "Creating comedy and tech-related content that makes people smile. Specializes in developer humor, relatable programming memes, and engaging storytelling around tech culture.",
    type: "service",
    categories: ["content", "media", "entertainment"],
    tags: ["comedy", "tech-content", "memes", "entertainment"],
    relatedEntities: [],
    deliverables: [
      "Short-form comedy content",
      "Tech humor posts",
      "Developer relatable content",
      "Educational entertainment",
    ],
    audience: [
      "Developers",
      "Tech enthusiasts",
      "Programming students",
    ],
    publishedAt: "2022-01-01",
    updatedAt: "2026-07-25",
    version: 1,
  },
];

// lib/data/projects.ts
// Static project entity definitions — curated seed data for the knowledge graph
// Dynamic project data (from Google Sheets) is fetched via the existing API routes

import type { ProjectEntity } from "@/lib/types/entities";

export const projects: ProjectEntity[] = [
  {
    id: "portfolio",
    canonicalUrl: "https://pasindusampath.com",
    title: "pasindusampath.com — Personal Portfolio",
    description:
      "A full-stack portfolio website and personal knowledge platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Features an admin dashboard, dynamic content management via Google Sheets API, interactive visitor footprint canvas, survival counter, student testimonials, and Cloudinary image hosting. Deployed on Vercel at $0/month.",
    type: "project",
    imageUrl:
      "https://res.cloudinary.com/dkrxyiio0/image/upload/v1784234154/portfolio/fpwitz2b2kkvnjiemzkc.png",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Google Sheets API",
      "Cloudinary",
      "JWT",
      "Vercel",
    ],
    demoUrl: "https://pasindusampath.com",
    repoUrl: "https://github.com/pasindusampath",
    featured: true,
    status: "live",
    categories: ["fullstack", "portfolio", "web"],
    tags: ["nextjs", "typescript", "portfolio", "admin-panel", "framer-motion"],
    relatedEntities: [
      {
        id: "nextjs",
        title: "Next.js",
        canonicalUrl: "https://pasindusampath.com/projects#nextjs",
        type: "technology",
      },
      {
        id: "typescript",
        title: "TypeScript",
        canonicalUrl: "https://pasindusampath.com/projects#typescript",
        type: "technology",
      },
    ],
    publishedAt: "2024-08-01",
    updatedAt: "2026-07-25",
    version: 1,
  },
  {
    id: "codeschool",
    canonicalUrl: "https://codeschool.lk",
    title: "CodeSchool.lk — Online Programming Education Platform",
    description:
      "An online programming education platform founded by Pasindu Sampath. Teaches Java, OOP, Data Structures, Spring Boot, Hibernate, MySQL, JavaScript, React, and JavaFX to university students across Sri Lanka. Known for making complex programming concepts simple and engaging.",
    type: "project",
    imageUrl: "",
    technologies: ["Java", "Spring Boot", "React", "MySQL"],
    demoUrl: "https://codeschool.lk",
    featured: true,
    status: "live",
    categories: ["education", "platform", "web"],
    tags: ["java", "education", "codeschool", "teaching", "platform"],
    relatedEntities: [
      {
        id: "java",
        title: "Java",
        canonicalUrl: "https://pasindusampath.com/projects#java",
        type: "technology",
      },
    ],
    publishedAt: "2022-01-01",
    updatedAt: "2026-07-25",
    version: 1,
  },
];

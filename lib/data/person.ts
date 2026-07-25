// lib/data/person.ts
// Canonical Person entity — single source of truth for Pasindu Sampath

import type { PersonEntity } from "@/lib/types/entities";

export const person: PersonEntity = {
  id: "pasindu-sampath",
  name: "Pasindu Sampath",
  canonicalUrl: "https://pasindusampath.com",
  image:
    "https://res.cloudinary.com/dkrxyiio0/image/upload/v1784234154/portfolio/fpwitz2b2kkvnjiemzkc.png",

  occupation: [
    "Software Engineer",
    "Educator",
    "Content Creator",
  ],

  headline:
    "Software Engineer, Educator & Content Creator from Sri Lanka",

  biography: {
    brief:
      "Pasindu Sampath is a self-taught Software Engineer, Educator, and Content Creator from Sri Lanka. Founder of CodeSchool.lk, he teaches programming to university students and creates comedy and tech content.",

    standard:
      "Pasindu Sampath is a self-taught Software Engineer based in Sri Lanka, born on October 8, 2002. He began his programming journey in April 2021 with no formal computer science background, learning fundamentals, data structures, OOP, enterprise Java frameworks, and databases entirely through self-study. In August 2024, he secured his first professional Software Engineer role. He is the founder of CodeSchool.lk, an online programming education platform where he teaches Java, Spring Boot, React, and related technologies to university students across Sri Lanka. He is also a content creator known for his humor and relatable tech content.",

    extended:
      "Pasindu Sampath is a self-taught Software Engineer, Educator, and Content Creator from Sri Lanka, born on October 8, 2002. His programming journey began in April 2021 from absolute zero — no formal computer science education, no prior experience, just pure curiosity and determination. He methodically taught himself programming fundamentals, data representation, string manipulation, bitwise operations, control flow, recursion, and arrays in his first year. Between 2021 and 2022, he mastered Object-Oriented Programming and Data Structures. From 2022 to 2023, he moved into enterprise Java development, learning Spring Boot and Hibernate to build production-grade applications. In 2023–2024, he mastered database design, querying, and data management with MySQL. In August 2024, years of self-study culminated in his first professional Software Engineer role, where he grew through real-world team collaboration, debugging, and customer communication. Beyond engineering, Pasindu is the founder of CodeSchool.lk, an online platform where he teaches Java, OOP, Data Structures, Spring Boot, Hibernate, MySQL, JavaScript, React, and JavaFX to university students across Sri Lanka — from the University of Colombo School of Computing, University of Jaffna, NSBM Green University, University of Westminster (IIT), and Java Institute. He is recognized for his exceptional teaching style: making complex concepts simple, approachable, and engaging. He is also a content creator who produces comedy and tech-related content, self-described as a 'Meme Lord' and 'Sarcasm Expert' whose core mission is making people smile.",
  },

  expertise: [
    "Full-Stack Web Development",
    "Java Enterprise Development",
    "Spring Boot",
    "React & Next.js",
    "Software Engineering",
    "Programming Education",
    "Content Creation",
    "Database Design",
    "REST API Development",
    "Object-Oriented Programming",
    "Data Structures & Algorithms",
  ],

  technologies: [
    "Java",
    "JavaScript",
    "TypeScript",
    "SQL",
    "Spring Boot",
    "Hibernate",
    "Node.js",
    "React",
    "Next.js",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Framer Motion",
    "MySQL",
    "Google Sheets API",
    "Git",
    "GitHub",
    "Vercel",
    "Cloudinary",
    "JWT",
  ],

  skills: [
    {
      category: "Programming Languages",
      items: ["Java", "JavaScript", "TypeScript", "SQL"],
    },
    {
      category: "Backend Development",
      items: ["Spring Boot", "Hibernate", "Node.js", "Next.js API Routes"],
    },
    {
      category: "Frontend Development",
      items: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Framer Motion"],
    },
    {
      category: "Databases",
      items: ["MySQL", "Google Sheets API"],
    },
    {
      category: "Tools & Platforms",
      items: ["Git", "GitHub", "Vercel", "Cloudinary", "JWT Authentication"],
    },
    {
      category: "Architecture Patterns",
      items: ["SSR", "ISR", "REST APIs", "MVC", "OOP", "Full-Stack Web Applications"],
    },
  ],

  socialProfiles: [
    {
      platform: "GitHub",
      url: "https://github.com/pasindusampath",
      handle: "pasindusampath",
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/pasindu-tb/",
      handle: "pasindu-tb",
    },
    {
      platform: "CodeSchool",
      url: "https://codeschool.lk",
    },
  ],

  email: "hello@pasindusampath.com",
  birthDate: "2002-10-08",
  nationality: "Sri Lankan",
  location: "Sri Lanka",

  organizations: [
    {
      name: "CodeSchool.lk",
      url: "https://codeschool.lk",
      role: "Founder & Lead Instructor",
    },
  ],

  areasOfSpecialization: [
    "Full-Stack Web Development",
    "Java Enterprise Development",
    "Programming Education",
    "Software Engineering",
    "Content Creation",
  ],

  lastModified: "2026-07-25",
};

// lib/data/faqs.ts
// Semantic FAQs — drives FAQPage JSON-LD schema and /api/v1/faq endpoint

import type { FAQEntity, FAQItem } from "@/lib/types/entities";

export const faqItems: FAQItem[] = [
  // ─── Identity & Background ──────────────────────────────
  {
    id: "who-is-pasindu-sampath",
    question: "Who is Pasindu Sampath?",
    answer:
      "Pasindu Sampath is a self-taught Software Engineer, Educator, and Content Creator from Sri Lanka. Born on October 8, 2002, he began programming in April 2021 with no formal computer science background. He secured his first professional Software Engineer role in August 2024. He is also the founder of CodeSchool.lk, an online platform where he teaches programming to university students across Sri Lanka.",
    category: "identity",
    tags: ["pasindu-sampath", "bio", "introduction"],
    appliesTo: ["/", "/about"],
  },
  {
    id: "where-is-pasindu-from",
    question: "Where is Pasindu Sampath from?",
    answer:
      "Pasindu Sampath is from Sri Lanka. He is a self-taught developer who built his programming skills entirely through self-study and determination, without a formal computer science degree.",
    category: "identity",
    tags: ["location", "sri-lanka", "background"],
    appliesTo: ["/", "/about"],
  },
  {
    id: "pasindu-journey",
    question: "How did Pasindu Sampath start his programming journey?",
    answer:
      "Pasindu started his self-study journey in April 2021 from absolute zero. He learned programming fundamentals, OOP, and Data Structures (2021–2022), then Spring Boot and Hibernate (2022–2023), followed by MySQL and database design (2023–2024). In August 2024, he landed his first professional Software Engineer role, turning years of self-study into real-world impact.",
    category: "journey",
    tags: ["journey", "self-taught", "career"],
    appliesTo: ["/", "/about"],
  },

  // ─── Skills & Expertise ─────────────────────────────────
  {
    id: "what-technologies-pasindu",
    question: "What technologies does Pasindu Sampath work with?",
    answer:
      "Pasindu works with Java, JavaScript, TypeScript, and SQL as programming languages. On the backend he uses Spring Boot, Hibernate, and Node.js. On the frontend he uses React and Next.js. For databases he uses MySQL. He also works with Git, Vercel, Cloudinary, and JWT authentication.",
    category: "skills",
    tags: ["technologies", "skills", "stack", "java", "react", "nextjs"],
    appliesTo: ["/", "/about", "/projects"],
  },
  {
    id: "pasindu-areas-of-expertise",
    question: "What are Pasindu Sampath's areas of expertise?",
    answer:
      "Pasindu specializes in Full-Stack Web Development, Java Enterprise Development (Spring Boot, Hibernate), React and Next.js development, REST API design, Database design with MySQL, Programming Education, and Software Engineering. He is particularly strong in Object-Oriented Programming and Data Structures.",
    category: "skills",
    tags: ["expertise", "specialization", "skills"],
    appliesTo: ["/", "/about"],
  },

  // ─── CodeSchool & Teaching ──────────────────────────────
  {
    id: "what-is-codeschool",
    question: "What is CodeSchool.lk?",
    answer:
      "CodeSchool.lk is an online programming education platform founded by Pasindu Sampath. It offers courses in Java Fundamentals, OOP, Data Structures, Spring Boot, Hibernate, MySQL, JavaScript, React, and JavaFX. Students from universities including UCSC, University of Jaffna, NSBM Green University, and University of Westminster (IIT) have taken his courses.",
    category: "codeschool",
    tags: ["codeschool", "education", "teaching", "platform"],
    appliesTo: ["/", "/about"],
  },
  {
    id: "what-does-pasindu-teach",
    question: "What does Pasindu Sampath teach?",
    answer:
      "Pasindu teaches Java Fundamentals, Object-Oriented Programming (OOP), Data Structures, Spring Boot, Hibernate, MySQL Databases, JavaScript, React, and JavaFX through CodeSchool.lk. His teaching style is recognized for making complex concepts simple, clear, and approachable for beginners while still offering depth for experienced developers.",
    category: "codeschool",
    tags: ["teaching", "courses", "curriculum"],
    appliesTo: ["/", "/about"],
  },

  // ─── Portfolio & Projects ────────────────────────────────
  {
    id: "pasindu-portfolio-tech",
    question: "What technology is this portfolio website built with?",
    answer:
      "This portfolio (pasindusampath.com) is built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and Framer Motion for animations. It uses Google Sheets API as a free database backend, Cloudinary for image hosting, JWT authentication for the admin panel, and is deployed on Vercel.",
    category: "portfolio",
    tags: ["portfolio", "nextjs", "tech-stack", "website"],
    appliesTo: ["/", "/projects"],
  },
  {
    id: "pasindu-current-projects",
    question: "What projects has Pasindu Sampath built?",
    answer:
      "Pasindu has built several projects including this portfolio website (pasindusampath.com) which is a full-stack Next.js application with admin panel, interactive visitor canvas, and dynamic content from Google Sheets. He has also built enterprise Java applications and web applications using Spring Boot and React. More projects are listed on the /projects page.",
    category: "projects",
    tags: ["projects", "portfolio", "work"],
    appliesTo: ["/projects"],
  },

  // ─── Contact & Services ──────────────────────────────────
  {
    id: "how-to-contact-pasindu",
    question: "How can I contact Pasindu Sampath?",
    answer:
      "You can contact Pasindu via email at hello@pasindusampath.com, through the contact form at pasindusampath.com/contact, on LinkedIn at linkedin.com/in/pasindu-tb/, or on GitHub at github.com/pasindusampath.",
    category: "contact",
    tags: ["contact", "email", "linkedin", "hire"],
    appliesTo: ["/contact", "/"],
  },
  {
    id: "pasindu-services",
    question: "What services does Pasindu Sampath offer?",
    answer:
      "Pasindu offers three main services: (1) Software Engineering — full-stack web application development using Java, Spring Boot, React, and Next.js; (2) Programming Education & Tutoring through CodeSchool.lk; (3) Comedy & Tech Content Creation. For collaboration or hiring inquiries, contact hello@pasindusampath.com.",
    category: "services",
    tags: ["services", "hire", "collaboration", "freelance"],
    appliesTo: ["/contact", "/"],
  },
];

export const faqEntity: FAQEntity = {
  entity: "Pasindu Sampath",
  items: faqItems,
  lastModified: "2026-07-25",
};

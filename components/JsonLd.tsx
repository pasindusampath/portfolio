export function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pasindu Sampath",
    url: "https://pasindusampath.com",
    image:
      "https://res.cloudinary.com/dkrxyiio0/image/upload/v1784234154/portfolio/fpwitz2b2kkvnjiemzkc.png",
    jobTitle: "Software Engineer",
    description:
      "Self-taught Software Engineer, Educator, and Content Creator from Sri Lanka. Founder of CodeSchool.lk.",
    birthDate: "2002-10-08",
    nationality: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    knowsAbout: [
      "Java",
      "Spring Boot",
      "Hibernate",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "MySQL",
      "Tailwind CSS",
      "OOP",
      "Data Structures",
      "Software Engineering",
    ],
    sameAs: [
      "https://github.com/pasindusampath",
      "https://www.linkedin.com/in/pasindu-tb/",
      "https://codeschool.lk",
    ],
    email: "hello@pasindusampath.com",
    alumniOf: {
      "@type": "Organization",
      name: "CodeSchool.lk",
      url: "https://codeschool.lk",
    },
    worksFor: {
      "@type": "Organization",
      name: "CodeSchool.lk",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pasindu Sampath — Portfolio",
    url: "https://pasindusampath.com",
    description:
      "Personal portfolio of Pasindu Sampath — Software Engineer, Educator & Content Creator from Sri Lanka.",
    author: {
      "@type": "Person",
      name: "Pasindu Sampath",
      url: "https://pasindusampath.com",
    },
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

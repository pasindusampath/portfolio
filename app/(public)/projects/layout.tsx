import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore software projects by Pasindu Sampath — full-stack web applications, Java projects, and more. Built with Next.js, Spring Boot, React, and modern technologies.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects by Pasindu Sampath",
    description:
      "A collection of software projects showcasing full-stack development with Next.js, Spring Boot, React, and modern web technologies.",
    url: "https://pasindusampath.com/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://pasindusampath.com" },
          { name: "Projects", url: "https://pasindusampath.com/projects" },
        ]}
      />
      {children}
    </>
  );
}

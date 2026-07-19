import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Pasindu Sampath — a self-taught Software Engineer from Sri Lanka, founder of CodeSchool.lk, and programming instructor. Discover his skills, journey, and technical expertise.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Pasindu Sampath",
    description:
      "Self-taught developer turned Software Engineer. Founder of CodeSchool.lk. Teaching Java, Spring Boot, React, and more to university students across Sri Lanka.",
    url: "https://pasindusampath.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://pasindusampath.com" },
          { name: "About", url: "https://pasindusampath.com/about" },
        ]}
      />
      {children}
    </>
  );
}

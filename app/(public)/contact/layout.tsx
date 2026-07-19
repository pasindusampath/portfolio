import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Pasindu Sampath — Software Engineer and founder of CodeSchool.lk. Open for opportunities, collaborations, and conversations.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Pasindu Sampath",
    description:
      "Reach out for opportunities, collaborations, or just to say hi. Currently open for new projects and roles.",
    url: "https://pasindusampath.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://pasindusampath.com" },
          { name: "Contact", url: "https://pasindusampath.com/contact" },
        ]}
      />
      {children}
    </>
  );
}

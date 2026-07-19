import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/JsonLd";

const outfit = Outfit({ subsets: ["latin"] });

const BASE_URL = "https://pasindusampath.com";
const OG_IMAGE =
  "https://res.cloudinary.com/dkrxyiio0/image/upload/v1784234154/portfolio/fpwitz2b2kkvnjiemzkc.png";

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:
      "Pasindu Sampath — Software Engineer, Educator & Content Creator",
    template: "%s | Pasindu Sampath",
  },

  description:
    "Personal portfolio of Pasindu Sampath — a self-taught Software Engineer, founder of CodeSchool.lk, and content creator from Sri Lanka. Explore projects, skills, and the journey from self-study to professional engineering.",

  keywords: [
    "Pasindu Sampath",
    "Software Engineer",
    "Sri Lanka",
    "CodeSchool.lk",
    "Java developer",
    "Spring Boot",
    "React developer",
    "Next.js",
    "full-stack developer",
    "self-taught programmer",
    "programming teacher Sri Lanka",
    "web developer portfolio",
  ],

  authors: [{ name: "Pasindu Sampath", url: BASE_URL }],
  creator: "Pasindu Sampath",
  publisher: "Pasindu Sampath",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Pasindu Sampath — Portfolio",
    title: "Pasindu Sampath — Software Engineer, Educator & Content Creator",
    description:
      "Self-taught Software Engineer from Sri Lanka. Founder of CodeSchool.lk. Building software, teaching programming, and making people smile.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Pasindu Sampath — Software Engineer Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Pasindu Sampath — Software Engineer, Educator & Content Creator",
    description:
      "Self-taught Software Engineer from Sri Lanka. Founder of CodeSchool.lk. Building software, teaching programming, and making people smile.",
    images: [OG_IMAGE],
    creator: "@pasindusampath",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  manifest: "/manifest.json",

  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="author" href="/humans.txt" />
        <PersonJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={outfit.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

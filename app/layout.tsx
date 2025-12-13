import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevPortfolio | Software Engineer",
  description: "Professional Portfolio showcasing software engineering projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={outfit.className}>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Software Engineer Portfolio. Built with Next.js.
          </footer>
        </div>
      </body>
    </html>
  );
}

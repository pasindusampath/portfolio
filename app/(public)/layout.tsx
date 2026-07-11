"use client";

import Navbar from "@/components/Navbar";
import GridBackground from "@/components/GridBackground";
import Footer from "@/components/Footer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen relative flex flex-col">
            <GridBackground />
            <Navbar />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}

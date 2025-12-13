"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

import { StarsBackground } from "@/components/ui/stars-background";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center space-y-10 overflow-hidden bg-black">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6 max-w-4xl z-10"
      >
        <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium tracking-wide">
          Software Engineer
        </span>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white">
          Building Digital <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Experiences
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
          Specializing in accessible, pixel-perfect, and performant web applications.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
      >
        <Link
          href="/projects"
          className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors w-full sm:w-auto"
        >
          View Projects <ArrowRight size={18} />
        </Link>
        <Link
          href="/contact"
          className="inline-flex justify-center items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 text-white hover:bg-white/10 font-medium rounded-full transition-colors w-full sm:w-auto"
        >
          Contact Me
        </Link>
      </motion.div>

      {/* Antigravity Hero Background */}
      <div className="absolute inset-0 z-0">
        <StarsBackground />
        <ShootingStars />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-6 pt-8 text-muted-foreground"
      >
        <a href="https://github.com" target="_blank" className="hover:text-foreground transition-colors">
          <Github size={24} />
        </a>
        <a href="https://linkedin.com" target="_blank" className="hover:text-foreground transition-colors">
          <Linkedin size={24} />
        </a>
        <a href="mailto:hello@example.com" className="hover:text-foreground transition-colors">
          <Mail size={24} />
        </a>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-xl md:text-2xl font-medium text-primary">
          Hello, I'm a Software Engineer
        </h2>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Building Digital <br /> Experiences
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl">
          I specialize in building exceptional digital experiences. Currently, I'm tailored towards
          building accessible, pixel-perfect, and performant web applications.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex gap-4"
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity"
        >
          View Projects <ArrowRight size={18} />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium rounded-full transition-colors"
        >
          Contact Me
        </Link>
      </motion.div>

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

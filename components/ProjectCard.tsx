"use client";

import { Project } from "@/types";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                        {project.description}
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {project.demoUrl && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                            <ExternalLink size={16} /> Live Demo
                        </a>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                        >
                            <Github size={16} /> View Code
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

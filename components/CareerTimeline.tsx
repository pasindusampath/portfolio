'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import { Experience } from '@/types';

interface CareerTimelineProps {
    experiences: Experience[];
}

export default function CareerTimeline({ experiences }: CareerTimelineProps) {
    if (!experiences || experiences.length === 0) {
        return null;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center md:text-left border-b pb-4">
                Career Journey
            </h2>

            <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                <div className="space-y-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={`${exp.company}-${exp.position}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative pl-20 md:pl-28"
                        >
                            {/* Icon */}
                            <div className="absolute left-0 md:left-2 top-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Briefcase size={20} className="text-primary" />
                            </div>

                            {/* Timeline dot */}
                            <div className="absolute left-[0.01rem] md:left-[0.5rem] top-[0.03rem] w-10 h-10 rounded-full bg-primary border-4 border-background shadow-lg" />

                            {/* Content card */}
                            <div className="bg-card border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg group">
                                <div className="space-y-3">
                                    {/* Company and position */}
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                            {exp.position}
                                        </h3>
                                        <p className="text-lg text-primary font-medium">{exp.company}</p>
                                    </div>

                                    {/* Date range */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar size={16} />
                                        <span>
                                            {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? exp.endDate : formatDate(exp.endDate)}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {exp.description && (
                                        <p className="text-muted-foreground leading-relaxed pt-2">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Helper function to format dates
function formatDate(dateStr: string): string {
    if (!dateStr || dateStr === 'Present') return dateStr;

    try {
        const [year, month] = dateStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

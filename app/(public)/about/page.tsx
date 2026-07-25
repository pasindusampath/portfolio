import { getProfile, getSkills, getDailyNotes } from '@/lib/google-sheets';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Facebook, Instagram, Hash, Briefcase, MapPin, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import DailyNotes from "./DailyNotes";
import { person } from "@/lib/data/person";

export const revalidate = 60;

export default async function AboutPage() {
    const [profile, skills, dailyNotes] = await Promise.all([getProfile(), getSkills(), getDailyNotes()]);

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <h1 className="text-3xl font-bold">About Me</h1>
                <p className="text-muted-foreground">Profile data not found. Please configure the CMS.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-16 px-4 py-8">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-muted flex-shrink-0 animate-in fade-in zoom-in duration-500">
                    {profile.avatarUrl ? (
                        <Image
                            src={profile.avatarUrl}
                            alt={profile.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary">
                            {profile.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="space-y-6 text-center md:text-left flex-1">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
                        <h2 className="text-xl text-primary font-medium mt-2">{profile.role}</h2>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {profile.bio}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        {profile.socials.github && (
                            <a href={profile.socials.github} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                                <Github size={20} />
                            </a>
                        )}
                        {profile.socials.linkedin && (
                            <a href={profile.socials.linkedin} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                                <Linkedin size={20} />
                            </a>
                        )}
                        {profile.socials.twitter && (
                            <a href={profile.socials.twitter} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                                <Twitter size={20} />
                            </a>
                        )}
                        {profile.socials.facebook && (
                            <a href={profile.socials.facebook} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                                <Facebook size={20} />
                            </a>
                        )}
                        {profile.socials.instagram && (
                            <a href={profile.socials.instagram} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110">
                                <Instagram size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Work Experience Section */}
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 fill-mode-both delay-100">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <Briefcase size={24} className="text-zinc-400" />
                    <h2 className="text-3xl font-bold">Work Experience</h2>
                </div>

                <div className="relative space-y-0">
                    {/* Vertical timeline line */}
                    <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-zinc-600 via-zinc-700 to-transparent hidden sm:block" />

                    {person.workExperiences.map((exp, idx) => (
                        <div key={exp.id} className="relative sm:pl-16 pb-10 last:pb-0">
                            {/* Timeline dot */}
                            <div className={cn(
                                "absolute left-0 top-1.5 hidden sm:flex w-10 h-10 rounded-full items-center justify-center border z-10",
                                exp.current
                                    ? "bg-emerald-950/60 border-emerald-700/60 shadow-[0_0_16px_rgba(16,185,129,0.25)]"
                                    : "bg-zinc-900 border-zinc-700"
                            )}>
                                <Briefcase size={16} className={exp.current ? "text-emerald-400" : "text-zinc-500"} />
                            </div>

                            {/* Card */}
                            <div className={cn(
                                "rounded-2xl border p-6 space-y-4 transition-all duration-300 hover:border-white/20 group",
                                exp.current
                                    ? "bg-gradient-to-br from-emerald-950/30 via-zinc-900/60 to-zinc-900/80 border-emerald-800/40"
                                    : "bg-zinc-900/50 border-zinc-800/60"
                            )}>
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                                            {exp.current && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 tracking-wide">
                                                    CURRENT
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-base font-medium text-zinc-300">{exp.role}</p>
                                        <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap">
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={12} />
                                                {exp.location}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                                {exp.startDate.replace("-", " / ")} – {exp.current ? "Present" : (exp.endDate?.replace("-", " / ") ?? "")}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "self-start px-3 py-1 rounded-lg text-[11px] font-medium border capitalize whitespace-nowrap",
                                        exp.type === "full-time"
                                            ? "bg-blue-950/40 text-blue-400 border-blue-800/40"
                                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                    )}>
                                        {exp.type.replace("-", " ")}
                                    </span>
                                </div>

                                {/* Summary */}
                                <p className="text-sm text-zinc-400 leading-relaxed">{exp.summary}</p>

                                {/* Highlights */}
                                <div className="space-y-2">
                                    {exp.highlights.map((h, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                                            <CheckCircle2 size={14} className={cn("mt-0.5 flex-shrink-0", exp.current ? "text-emerald-500" : "text-zinc-600")} />
                                            <span>{h}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {exp.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.05] text-zinc-400 border border-white/[0.07] hover:text-zinc-200 hover:border-white/[0.15] transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Section */}
            {skills.length > 0 && (
                <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 fill-mode-both delay-200">
                    <h2 className="text-3xl font-bold text-center md:text-left border-b pb-4">Technical Skills</h2>
                    <div className="grid gap-8 md:grid-cols-2">
                        {skills.map((skillGroup, idx) => (
                            <div
                                key={skillGroup.category}
                                className="space-y-4 p-6 bg-card border rounded-xl hover:border-primary/50 transition-colors"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                                    <Hash size={20} />
                                    {skillGroup.category}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skillGroup.items.map((item) => (
                                        <span
                                            key={item}
                                            className="px-3 py-1 bg-muted/50 text-sm rounded-md border border-transparent hover:border-primary/20 transition-colors"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        <DailyNotes notes={dailyNotes} />
        </div>
    );
}

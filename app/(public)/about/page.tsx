import { getProfile, getSkills } from '@/lib/google-sheets';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Facebook, Instagram, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export const revalidate = 60;

export default async function AboutPage() {
    const [profile, skills] = await Promise.all([getProfile(), getSkills()]);

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
        </div>
    );
}

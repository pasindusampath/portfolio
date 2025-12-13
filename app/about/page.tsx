import { getProfile } from '@/lib/google-sheets';
import Image from 'next/image';
import { Github, Linkedin, Twitter } from 'lucide-react';

export const revalidate = 60;

export default async function AboutPage() {
    const profile = await getProfile();

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <h1 className="text-3xl font-bold">About Me</h1>
                <p className="text-muted-foreground">Profile data not found. Please configure the CMS.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-muted flex-shrink-0">
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

                <div className="space-y-6 text-center md:text-left">
                    <div>
                        <h1 className="text-4xl font-bold">{profile.name}</h1>
                        <h2 className="text-xl text-primary font-medium mt-2">{profile.role}</h2>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {profile.bio}
                    </p>

                    <div className="flex gap-4 justify-center md:justify-start">
                        {profile.socials.github && (
                            <a href={profile.socials.github} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Github size={20} />
                            </a>
                        )}
                        {profile.socials.linkedin && (
                            <a href={profile.socials.linkedin} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Linkedin size={20} />
                            </a>
                        )}
                        {profile.socials.twitter && (
                            <a href={profile.socials.twitter} target="_blank" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                                <Twitter size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

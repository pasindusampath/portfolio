import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-md mt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="text-center md:text-left space-y-2">
                        <h3 className="font-bold text-lg">Portfolio</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Building digital experiences with passion and precision.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://github.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with <Heart size={14} className="text-red-500 fill-red-500" /> using Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}

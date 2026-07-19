import Link from "next/link";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-background/50 backdrop-blur-md mt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="text-center md:text-left space-y-2">
                        {/* <h3 className="font-bold text-lg">Pasindu Sampath</h3> */}
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Building digital experiences with passion and precision.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://github.com/pasindusampath" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                            <Github size={20} />
                        </a>
                        <a href="https://www.linkedin.com/in/pasindu-tb/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:hello@pasindusampath.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Pasindu Sampath. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with <Heart size={14} className="text-red-500 fill-red-500" /> using Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
}


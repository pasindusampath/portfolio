"use client";

import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12 text-center">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Get In Touch</h1>
                <p className="text-muted-foreground text-lg">
                    I'm currently open for new opportunities. Whether you have a question or just want to say hi,
                    I'll try my best to get back to you!
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-8 border rounded-2xl bg-card hover:border-primary/50 transition-colors"
                >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Email Me</h3>
                    <a href="mailto:hello@pasindusampath.com" className="text-muted-foreground hover:text-primary transition-colors">
                        hello@pasindusampath.com
                    </a>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-8 border rounded-2xl bg-card hover:border-primary/50 transition-colors"
                >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <p className="text-muted-foreground">
                        Remote / Worldwide
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

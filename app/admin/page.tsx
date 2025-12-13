"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        technologies: "",
        demoUrl: "",
        repoUrl: "",
        featured: false,
    });
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password) setIsAuthenticated(true); // In real app, verify with API first, but here we send pass with every request
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password, // Send password to verify on server
                    ...formData,
                    technologies: formData.technologies.split(",").map(t => t.trim()), // Send as array? No, logic in sheets handles it if string? API expects object. 
                    // Wait, lib logic: project.technologies?.join(', ') || ''
                    // So if we send string, we might need to adjust client or server.
                    // Let's check api logic. API calls addProject. addProject expects Partial<Project>. Project has technologies: string[].
                    // So we should send array.
                    imageBase64,
                }),
            });

            if (res.ok) {
                alert("Project added successfully!");
                setFormData({
                    title: "",
                    description: "",
                    technologies: "",
                    demoUrl: "",
                    repoUrl: "",
                    featured: false,
                });
                setImageBase64(null);
            } else {
                const data = await res.json();
                alert(data.error || "Failed to add project");
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 border rounded-xl bg-card shadow-lg"
                >
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Enter Admin Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-md bg-background border border-input focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
                        >
                            Enter Dashboard
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    Logout
                </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Plus size={20} /> Add New Project
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-xl bg-card">
                        <div>
                            <label className="block text-sm font-medium mb-1">Project Title</label>
                            <input
                                required
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 rounded-md bg-background border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                required
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-2 rounded-md bg-background border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
                            <input
                                type="text"
                                placeholder="React, Next.js, TypeScript"
                                value={formData.technologies}
                                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                                className="w-full p-2 rounded-md bg-background border"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Demo URL</label>
                                <input
                                    type="url"
                                    value={formData.demoUrl}
                                    onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                                    className="w-full p-2 rounded-md bg-background border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Repo URL</label>
                                <input
                                    type="url"
                                    value={formData.repoUrl}
                                    onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                                    className="w-full p-2 rounded-md bg-background border"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Project Image</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-dashed rounded-md hover:bg-muted transition-colors">
                                    <Upload size={16} className="mr-2" />
                                    Choose Image
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                                {imageBase64 && <span className="text-xs text-green-500">Image selected</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Add Project"}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Preview</h2>
                    <div className="p-6 border rounded-xl bg-muted/20 flex items-center justify-center h-[400px]">
                        <p className="text-muted-foreground">Recent projects list will appear here (Not implemented in this demo)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

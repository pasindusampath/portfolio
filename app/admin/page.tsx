"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, Plus, LayoutDashboard, FolderKanban, Settings, LogOut, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getDeviceId } from "@/lib/device";

// Types
import { Project } from "@/types";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Check auth on load
    const [password, setPassword] = useState(""); // Kept for typing in form
    const [email, setEmail] = useState("admin@example.com"); // Hardcoded for now, or add input
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    // View State
    const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "settings">("projects");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Auth 
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const refreshSession = useCallback(async () => {
        try {
            const deviceId = getDeviceId();
            const res = await fetch("/api/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId })
            });
            if (res.ok) {
                const data = await res.json();
                setAccessToken(data.accessToken);
                setIsAuthenticated(true);
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }, []);

    // Initial check
    useEffect(() => {
        refreshSession().then((success) => {
            if (!success) setIsAuthenticated(false);
            setIsLoading(false);
        });
    }, [refreshSession]);

    // Fetch projects when authenticated
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchProjects();
        }
    }, [isAuthenticated, accessToken]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const deviceId = getDeviceId();
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, deviceId })
            });

            if (res.ok) {
                const data = await res.json();
                setAccessToken(data.accessToken);
                setIsAuthenticated(true);
            } else {
                alert("Invalid Credentials");
            }
        } catch (error) {
            console.error(error);
            alert("Login Failed");
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setAccessToken(null);
        setIsAuthenticated(false);
    };

    const fetchProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const res = await fetch("/api/projects", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            } else {
                // Handle unauthorized or other errors
                if (res.status === 401) {
                    setIsAuthenticated(false);
                    setAccessToken(null);
                    alert("Session expired. Please log in again.");
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    if (isLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-black"><Loader2 className="animate-spin text-primary" /></div>;
    }

    if (!isAuthenticated) {
        return <AdminLogin email={email} setEmail={setEmail} password={password} setPassword={setPassword} onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-black/40 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-card/30 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Admin Portal
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={activeTab === "dashboard"}
                        onClick={() => setActiveTab("dashboard")}
                    />
                    <SidebarItem
                        icon={FolderKanban}
                        label="Projects"
                        active={activeTab === "projects"}
                        onClick={() => setActiveTab("projects")}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === "settings"}
                        onClick={() => setActiveTab("settings")}
                    />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black/20 p-8">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {activeTab === 'projects' ? 'Project Management' :
                                activeTab === 'dashboard' ? 'Dashboard Overview' : 'Settings'}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Manage your portfolio content via Google Sheets
                        </p>
                    </div>

                    {activeTab === 'projects' && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                        >
                            <Plus size={18} />
                            Add Project
                        </button>
                    )}
                </header>

                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        {/* Projects Grid */}
                        {isLoadingProjects ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-20 bg-card/20 rounded-2xl border border-white/5 border-dashed">
                                <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                                <h3 className="text-lg font-medium">No projects found</h3>
                                <p className="text-muted-foreground text-sm mb-4">Get started by creating your first project.</p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="text-primary hover:underline text-sm"
                                >
                                    Add New Project
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <ProjectAdminCard key={project.id || project.title} project={project} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} />
                        <StatCard label="Total Views" value="--" icon={Search} />
                        <StatCard label="Auth Status" value={accessToken ? "Active" : "Inactive"} icon={Settings} />
                    </div>
                )}
            </main>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddProjectModal
                        accessToken={accessToken}
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={() => {
                            setIsAddModalOpen(false);
                            fetchProjects();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function AdminLogin({ email, setEmail, password, setPassword, onLogin }: any) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] relative overflow-hidden bg-black/90">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-50px] left-[-100px] w-[200px] h-[200px] bg-primary rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-[-50px] right-[-100px] w-[200px] h-[200px] bg-blue-500 rounded-full blur-[100px] animate-blob animation-delay-2000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl shadow-2xl relative"
            >
                <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />

                <div className="text-center mb-8 space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin Portal</h1>
                    <p className="text-sm text-muted-foreground">Secure Login</p>
                </div>

                <form onSubmit={onLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Access Dashboard
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                active
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function StatCard({ label, value, icon: Icon }: any) {
    return (
        <div className="p-6 rounded-2xl bg-card/40 border border-white/5 backdrop-blur-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground mb-1">{label}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={24} />
            </div>
        </div>
    );
}

function ProjectAdminCard({ project }: { project: Project }) {
    return (
        <div className="group relative bg-card/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/30 transition-all">
            <div className="relative aspect-video w-full bg-muted/50">
                {project.imageUrl ? (
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-xs">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-semibold truncate">{project.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-3">
                    {project.description}
                </p>
                <div className="flex gap-2 text-xs">
                    {project.demoUrl && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded">Live</span>}
                    {project.featured && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">Featured</span>}
                </div>
            </div>
        </div>
    );
}

function AddProjectModal({ accessToken, onClose, onSuccess }: any) {
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImageBase64(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    // Sending in body as fallback or if API expects it there, but ideally header.
                    // Updated api/projects to look for Access Token?
                    // The old code looked for 'password'. Access Token logic needs to be added to api/projects.
                    ...formData,
                    technologies: formData.technologies.split(",").map(t => t.trim()),
                    imageBase64,
                }),
            });

            if (res.ok) {
                onSuccess();
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-card border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-card z-10">
                    <h3 className="text-xl font-semibold">New Project</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Project Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 rounded-xl bg-secondary/50 border border-white/5 focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. E-Commerce Platform"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 rounded-xl bg-secondary/50 border border-white/5 focus:ring-1 focus:ring-primary outline-none"
                            placeholder="Describe the project..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Technologies</label>
                        <input
                            type="text"
                            placeholder="React, Next.js, TypeScript"
                            value={formData.technologies}
                            onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                            className="w-full p-3 rounded-xl bg-secondary/50 border border-white/5 focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Demo URL</label>
                            <input
                                type="url"
                                value={formData.demoUrl}
                                onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-white/5 focus:ring-1 focus:ring-primary outline-none"
                                placeholder="https://"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Repo URL</label>
                            <input
                                type="url"
                                value={formData.repoUrl}
                                onChange={e => setFormData({ ...formData, repoUrl: e.target.value })}
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-white/5 focus:ring-1 focus:ring-primary outline-none"
                                placeholder="https://"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Project Image</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 hover:bg-secondary/20 transition-colors text-center cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {imageBase64 ? (
                                <div className="relative h-40 w-full">
                                    <Image src={imageBase64} alt="Preview" fill className="object-contain" />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="mb-2 text-muted-foreground" size={24} />
                                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <label htmlFor="featured" className="text-sm font-medium">Featured Project (Show on Home)</label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Project"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

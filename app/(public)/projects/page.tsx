import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/google-sheets";
import { Project } from "@/types";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    A collection of projects showcasing my journey and technical capabilities.
                </p>
            </div>

            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                        No projects found. Use the Admin dashboard to add some!
                    </p>
                </div>
            )}
        </div>
    );
}

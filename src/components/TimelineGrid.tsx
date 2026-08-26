import { useEffect, useState } from "react"
import type { Project } from "../types/project"
import { getProjects } from "../services/projects";

export default function TimelineGrid() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function load() {
            setProjects(await getProjects());
        }

        load();
    })

    return (
        <main className="timeline">
            <div className="project-header">
                {projects.map(project =>
                    <div
                        key={project.id}
                        className="project-column"
                    >
                        {project.title}
                    </div>
                )}
            </div>
        </main>
    )
}
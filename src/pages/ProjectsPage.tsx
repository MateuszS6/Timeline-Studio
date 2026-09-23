import { useEffect, useState } from "react";
import { getProjectsForUniverse } from "../services/projects";
import type { Project } from "../types/project";

interface ProjectsPageProps {
    universeId: number;
}

export default function ProjectsPage({
    universeId
}: ProjectsPageProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadAttempt, setLoadAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadProjects() {
            try {
                const data = await getProjectsForUniverse(universeId);

                if (cancelled) return;

                setProjects(data);
            } catch {
                if (cancelled) return;

                console.error(error);
                setError("Could not load projects.")
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadProjects();

        return () => {
            cancelled = true;
        }
    }, [universeId, loadAttempt])

    function retry() {
        setError(null);
        setLoading(true);
        setLoadAttempt((current) => current + 1);
    }

    if (loading) {
        return (
            <p className="status-message" role="status">
                Loading projects...
            </p>
        )
    }

    if (error) {
        return (
            <div className="status-message status-error" role="alert">
                <p>{error}</p>
                <button
                    type="button"
                    className="utility-button"
                    onClick={retry}
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <section className="management-page" aria-label="Projects">
            <p className="management-summary">
                {projects.length}{" "}
                {projects.length === 1 ? "project" : "projects"}
                {" · In chronological order"}
            </p>

            {projects.length === 0 ? (
                <p className="status-message">
                    No projects are linked to this universe.
                </p>
            ) : (
                <div className="management-table-container">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th scope="col">Project</th>
                                <th scope="col">Release date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>{project.title}</td>
                                    <td>{project.release_date ?? "Not set"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
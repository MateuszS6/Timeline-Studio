import { supabase } from '../config/supabase'
import type { Project } from '../types/project';

interface UniverseProjectLink {
    project_id: number;
    timeline_position: number;
}

export async function getProjectsForUniverse(
    universeId: number
): Promise<Project[]> {
    
    const { data: links, error: linksError } = await supabase
        .from("universe_projects")
        .select("project_id, timeline_position")
        .eq("universe_id", universeId)
        .order("timeline_position");

    if (linksError) throw linksError;

    if (!links || links.length === 0) {
        return [];
    }

    const projectIds = (links as UniverseProjectLink[]).map(
        (link) => link.project_id
    );

    const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .in("id", projectIds);

    if (projectsError) throw projectsError;

    const projectMap = new Map(
        (projects ?? []).map((project) => [
            project.id,
            project
        ])
    );

    return links.flatMap((link) => {
        const project =
            projectMap.get(link.project_id);

        return project ? [project] : [];
    })
}
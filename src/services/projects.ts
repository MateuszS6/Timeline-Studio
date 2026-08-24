import { supabase } from '../config/supabase'

export async function getProjects() {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("release_date");

    if (error) throw error;

    return data.map(project => ({
        ...project,
        // PostgreSQL dates arrive from Supabase as YYYY-MM-DD strings.
        // Parse at local midnight to avoid a possible timezone date shift.
        release_date: new Date(`${project.release_date}T00:00:00`),
    }));
}
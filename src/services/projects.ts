import { supabase } from '../config/supabase'
import type { Project } from '../types/project';

export async function getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("release_date", { ascending: true });

    if (error) throw error;

    return data ?? [];
}
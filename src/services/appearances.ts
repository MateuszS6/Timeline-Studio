import { supabase } from "../config/supabase";
import type { Appearance } from "../types/appearance";

export async function getAppearances(): Promise<Appearance[]> {
    const { data, error } = await supabase
        .from("appearances")
        .select("*");

    if (error) throw error;

    return data ?? [];
}

export async function createAppearance(
    characterId: number,
    projectId: number,
    appearanceType = "standard"
): Promise<Appearance> {
    const { data, error } = await supabase
        .from("appearances")
        .insert({
            character_id: characterId,
            project_id: projectId,
            appearance_type: appearanceType
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateAppearance(
    characterId: number,
    projectId: number,
    appearanceType: string
): Promise<Appearance> {
    const { data, error } = await supabase
        .from("appearances")
        .update({
            appearance_type: appearanceType
        })
        .eq("character_id", characterId)
        .eq("project_id", projectId)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function deleteAppearance(
    characterId: number,
    projectId: number
): Promise<void> {
    const { error } = await supabase
        .from("appearances")
        .delete()
        .eq("character_id", characterId)
        .eq("project_id", projectId);

    if (error) throw error;
}
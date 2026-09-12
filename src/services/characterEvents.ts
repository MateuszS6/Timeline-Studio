import { supabase } from "../config/supabase";
import type { CharacterEvent, CharacterEventPosition, CharacterEventType } from "../types/characterEvent";

export async function getCharacterEvents(): Promise<CharacterEvent[]> {
    const { data, error } = await supabase
        .from("character_events")
        .select("*");

    if (error) throw error;

    return data ?? [];
}

export async function saveCharacterEvent(
    characterId: number,
    projectId: number,
    eventType: CharacterEventType,
    eventPosition: CharacterEventPosition
): Promise<CharacterEvent> {
    const { data, error } = await supabase
        .from("character_events")
        .upsert(
            {
                character_id: characterId,
                project_id: projectId,
                event_type: eventType,
                event_position: eventPosition
            },
            {
                onConflict: "character_id,project_id"
            }
        )
        .select()
        .single();

    if (error) throw error;

    return data ?? [];
}

export async function deleteCharacterEvent(
    characterId: number,
    projectId: number
): Promise<void> {
    const { error } = await supabase
        .from("character_events")
        .delete()
        .eq("character_id", characterId)
        .eq("project_id", projectId);

    if (error) throw error;
}
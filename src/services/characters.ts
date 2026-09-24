import { supabase } from "../config/supabase";
import type { Character, CharacterInput } from "../types/character";

export async function getCharactersByIds(
    characterIds: number[]
): Promise<Character[]> {
    if (characterIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from("characters")
        .select("*")
        .in("id", characterIds)
        .order("alias");

    if (error) throw error;

    return data ?? [];
}

export async function getCharactersByOriginUniverse(
    universeId: number
): Promise<Character[]> {
    const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("origin_universe_id", universeId)
        .order("alias");

    if (error) throw error;

    return data ?? [];
}

export async function createCharacter(
    input: CharacterInput
): Promise<Character> {
    const { data, error } = await supabase
        .from("characters")
        .insert(input)
        .select()
        .single();

    if (error) throw error;

    return data;
}

export async function updateCharacter(
    id: number,
    input: CharacterInput
): Promise<Character> {
    const { data, error } = await supabase
        .from("characters")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}
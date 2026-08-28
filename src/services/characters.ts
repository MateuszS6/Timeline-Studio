import { supabase } from "../config/supabase";
import type { Character } from "../types/character";

export async function getCharacters(): Promise<Character[]> {
    const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("alias", { ascending: true });

    if (error) throw error;

    return data ?? [];
}
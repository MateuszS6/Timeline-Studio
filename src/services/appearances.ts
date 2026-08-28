import { supabase } from "../config/supabase";
import type { Appearance } from "../types/appearance";

export async function getAppearances(): Promise<Appearance[]> {
    const { data, error } = await supabase
        .from("appearances")
        .select("*");

    if (error) throw error;

    return data ?? [];
}
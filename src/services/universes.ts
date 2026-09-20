import { supabase } from "../config/supabase";
import type { Universe } from "../types/universe";

export async function getUniversesByFranchise(
    franchiseId: number
): Promise<Universe[]> {
    const { data, error } = await supabase
        .from("universes")
        .select("*")
        .eq("franchise_id", franchiseId)
        .order("code")

    if (error) throw error;

    return data ?? [];
}
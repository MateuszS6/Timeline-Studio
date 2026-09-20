import { supabase } from "../config/supabase";
import type { Franchise } from "../types/franchise";

export async function getFranchises(): Promise<Franchise[]> {
    const { data, error } = await supabase
        .from("franchises")
        .select("*")
        .order("name");

    if (error) throw error;

    return data ?? [];
}
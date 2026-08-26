import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
	const value = import.meta.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

const supabaseUrl = getRequiredEnv("VITE_SUPABASE_URL");
const supabaseKey = getRequiredEnv("VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseKey);
export interface Character {
    id: number;
    alias: string;
    real_name: string | null;
    origin_universe_id: number | null;
}

export interface CharacterInput {
    alias: string;
    real_name: string | null;
    origin_universe_id: number;
}
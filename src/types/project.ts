export interface Project {
    id: number;
    title: string;
    release_date: string | null;
    primary_universe_id: number | null;
}

export interface ProjectInput {
    title: string;
    release_date: string | null;
    primary_universe_id: number | null;
}
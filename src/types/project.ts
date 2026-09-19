export interface Project {
    id: number;
    title: string;
    release_date: string | null;
    timeline_order: number | null;
    primary_universe_id: number | null;
}
export interface Timeline {
    id: number;
    universe_id: number;
    name: string;
    is_default: boolean;
}

export interface TimelineProject {
    timeline_id: number;
    project_id: number;
    position: number;
}
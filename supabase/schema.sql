create table
    projects (
        id bigint generated always as identity primary key,
        title text not null,
        release_date date,
        timeline_order integer
    );

create table
    characters (
        id bigint generated always as identity primary key,
        alias text not null unique
    );

create table
    appearances (
        character_id bigint not null references characters (id) on delete cascade,
        project_id bigint not null references projects (id) on delete cascade,
        appearance_type text not null default 'Standard',
        primary key (character_id, project_id)
    );
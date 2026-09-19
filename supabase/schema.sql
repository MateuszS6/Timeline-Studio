create table
    franchises (
        id bigint generated always as identity primary key,
        name text not null unique
    );

create table
    universes (
        id bigint generated always as identity primary key,
        franchise_id bigint not null references franchises (id),
        name text not null,
        code text,
        unique (franchise_id, name)
    );

create table
    timelines (
        id bigint generated always as identity primary key,
        universe_id bigint not null references universes (id),
        name text not null,
        is_default boolean not null default false,
        unique (universe_id, name)
    );

create unique index one_default_timeline_per_universe on timelines (universe_id)
where
    is_default;

create table
    projects (
        id bigint generated always as identity primary key,
        title text not null,
        release_date date,
        timeline_order integer,
        primary_universe_id bigint references universes (id) on delete set null
    );

create table
    timeline_projects (
        timeline_id bigint not null references timelines (id) on delete cascade,
        project_id bigint not null references projects (id) on delete cascade,
        position integer not null check (position > 0),
        primary key (timeline_id, project_id),
        unique (timeline_id, position)
    );

create table
    characters (
        id bigint generated always as identity primary key,
        alias text not null unique,
        origin_universe_id bigint references universes (id) on delete set null
    );

create table
    appearances (
        character_id bigint not null references characters (id) on delete cascade,
        project_id bigint not null references projects (id) on delete cascade,
        appearance_type text not null default 'standard',
        is_detached boolean not null default false,
        primary key (character_id, project_id)
    );

create table
    character_events (
        id bigint generated always as identity primary key,
        character_id bigint not null references characters (id) on delete cascade,
        project_id bigint not null references projects (id) on delete cascade,
        event_type text not null check (
            event_type in ('death', 'revival', 'blip', 'return')
        ),
        event_position text not null default 'at' check (event_position in ('at', 'after')),
        unique (character_id, project_id)
    );
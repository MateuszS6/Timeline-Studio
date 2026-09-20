import { useEffect, useState } from "react";
import { createAppearance, deleteAppearance, getAppearancesForProjects, updateAppearance } from "../../services/appearances";
import { getCharactersByIds } from "../../services/characters";
import { getProjectsForUniverse } from "../../services/projects";
import type { Appearance, AppearanceUpdate } from "../../types/appearance";
import type { Character } from "../../types/character";
import type { CharacterEvent, CharacterEventPosition, CharacterEventType } from "../../types/characterEvent";
import type { Project } from "../../types/project";
import CharacterRow from "./CharacterRow";
import TimelineHeader from "./TimelineHeader";
import { deleteCharacterEvent, getCharacterEventsForProjects, saveCharacterEvent } from "../../services/characterEvents";

interface TimelineGridProps {
    universeId: number;
}

export default function TimelineGrid({
    universeId
}: TimelineGridProps) {
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [appearances, setAppearances] = useState<Appearance[]>([]);
    const [characterEvents, setCharacterEvents] = useState<CharacterEvent[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTimeline() {
            try {
                setLoading(true);

                const projectsData = await getProjectsForUniverse(universeId);

                const projectIds = projectsData.map((project) => project.id);

                const [
                    appearancesData,
                    characterEventsData
                ] = await Promise.all([
                    getAppearancesForProjects(projectIds),
                    getCharacterEventsForProjects(projectIds)
                ]);

                const characterIds = Array.from(
                    new Set([
                        ...appearancesData.map(
                            (appearance) => appearance.character_id
                        ),
                        ...characterEventsData.map(
                            (event) => event.character_id
                        )
                    ])
                );

                const charactersData = await getCharactersByIds(characterIds);

                setProjects(projectsData);
                setCharacters(charactersData);
                setAppearances(appearancesData);
                setCharacterEvents(characterEventsData);
            } catch (error) {
                console.error(error);

                setError("Could not load timeline.")
            } finally {
                setLoading(false);
            }
        }

        loadTimeline();
    }, [universeId]);

    async function handleCreateAppearance(
        characterId: number,
        projectId: number
    ) {
        try {
            const newAppearance = await createAppearance(
                characterId,
                projectId
            );

            setAppearances((current) => [
                ...current,
                newAppearance
            ]);
        } catch (error) {
            console.error(error);
        }
    }

    async function handleUpdateAppearance(
        characterId: number,
        projectId: number,
        updates: AppearanceUpdate
    ) {
        try {
            const updatedAppearance =
                await updateAppearance(
                    characterId,
                    projectId,
                    updates
                )

            setAppearances((current) =>
                current.map((appearance) =>
                    appearance.character_id === characterId &&
                        appearance.project_id === projectId
                        ? updatedAppearance
                        : appearance
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteAppearance(
        characterId: number,
        projectId: number
    ) {
        try {
            await deleteAppearance(characterId, projectId);

            setAppearances((current) =>
                current.filter((appearance) =>
                    !(
                        appearance.character_id === characterId &&
                        appearance.project_id === projectId
                    )
                )
            );
        } catch (error) {
            console.error(error)
        }
    }

    async function handleSaveCharacterEvent(
        characterId: number,
        projectId: number,
        eventType: CharacterEventType,
        eventPosition: CharacterEventPosition
    ) {
        try {
            const savedEvent = await saveCharacterEvent(
                characterId,
                projectId,
                eventType,
                eventPosition
            );

            setCharacterEvents((current) => {
                const alreadyExists = current.some(
                    (event) =>
                        event.character_id === characterId &&
                        event.project_id === projectId
                );

                if (!alreadyExists) return [...current, savedEvent];

                return current.map((event) =>
                    event.character_id === characterId &&
                        event.project_id === projectId
                        ? savedEvent
                        : event
                )
            })
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteCharacterEvent(
        characterId: number,
        projectId: number
    ) {
        try {
            await deleteCharacterEvent(
                characterId,
                projectId
            );

            setCharacterEvents((current) =>
                current.filter(
                    (event) =>
                        !(
                            event.character_id === characterId &&
                            event.project_id === projectId
                        )
                )
            );
        } catch (error) {
            console.log(error);
        }
    }

    if (!universeId) {
        return <p>Select a universe to load the timeline.</p>;
    }

    if (loading) return <p>Loading timeline...</p>

    if (error) return <p>{error}</p>;

    return (
        <section className="timeline-container">
            <div className="timeline-grid">
                <TimelineHeader projects={projects} />

                {characters.map((character) => (
                    <CharacterRow
                        key={character.id}
                        character={character}
                        projects={projects}
                        appearances={appearances}
                        characterEvents={characterEvents} // TODO
                        onCreateAppearance={handleCreateAppearance}
                        onUpdateAppearance={handleUpdateAppearance}
                        onDeleteAppearance={handleDeleteAppearance}
                        onSaveCharacterEvent={handleSaveCharacterEvent} // TODO
                        onDeleteCharacterEvent={handleDeleteCharacterEvent} // TODO
                    />
                ))}
            </div>
        </section>
    )
}
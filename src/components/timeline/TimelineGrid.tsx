import { useEffect, useRef, useState } from "react";
import { createAppearance, deleteAppearance, getAppearancesForProjects, updateAppearance } from "../../services/appearances";
import { deleteCharacterEvent, getCharacterEventsForProjects, saveCharacterEvent } from "../../services/characterEvents";
import { getProjectsForUniverse } from "../../services/projects";
import type { Appearance, AppearanceUpdate } from "../../types/appearance";
import type { Character } from "../../types/character";
import type { CharacterEvent, CharacterEventPosition, CharacterEventType } from "../../types/characterEvent";
import type { Project } from "../../types/project";
import CharacterRow from "./CharacterRow";
import TimelineHeader from "./TimelineHeader";
import { getTimelineCharacters, hideCharacterFromTimeline, showCharacterOnTimeline } from "../../services/timelineCharacters";

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

    const [loadAttempt, setLoadAttempt] = useState(0);
    const [actionError, setActionError] = useState<string | null>(null);

    const [hidingCharacterId, setHidingCharacterId] = useState<number | null>(null);
    const hidingRef = useRef(false);
    const [hiddenCharacter, setHiddenCharacter] = useState<Character | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTimeline() {
            try {
                const projectsData = await getProjectsForUniverse(universeId);

                if (cancelled) return;

                const projectIds = projectsData.map((project) => project.id);

                const [
                    appearancesData,
                    characterEventsData,
                    charactersData
                ] = await Promise.all([
                    getAppearancesForProjects(projectIds),
                    getCharacterEventsForProjects(projectIds),
                    getTimelineCharacters(universeId)
                ]);

                if (cancelled) return;

                setProjects(projectsData);
                setCharacters(charactersData);
                setAppearances(appearancesData);
                setCharacterEvents(characterEventsData);
                setError(null);
            } catch (error) {
                if (cancelled) return;

                console.error(error);
                setError("Could not load timeline.")
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadTimeline();

        return () => {
            cancelled = true;
        }
    }, [universeId, loadAttempt]);

    function retryTimeline() {
        setError(null);
        setLoading(true);
        setLoadAttempt((current) => current + 1);
    }

    // Appearance handlers

    async function handleCreateAppearance(
        characterId: number,
        projectId: number
    ) {
        setActionError(null);

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
            setActionError("Could not add the appearance. Please try again.");
        }
    }

    async function handleUpdateAppearance(
        characterId: number,
        projectId: number,
        updates: AppearanceUpdate
    ) {
        setActionError(null);

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
            setActionError("Could not update the appearance. Please try again.");
        }
    }

    async function handleDeleteAppearance(
        characterId: number,
        projectId: number
    ) {
        setActionError(null);

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
            console.error(error);
            setActionError("Could not remove the appearance. Please try again.");
        }
    }

    // Event handlers

    async function handleSaveCharacterEvent(
        characterId: number,
        projectId: number,
        eventType: CharacterEventType,
        eventPosition: CharacterEventPosition
    ) {
        setActionError(null);

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
            setActionError("Could not save the event. Please try again.");
        }
    }

    async function handleDeleteCharacterEvent(
        characterId: number,
        projectId: number
    ) {
        setActionError(null);

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
            setActionError("Could not remove the event. Please try again.");
        }
    }

    // Character handler

    async function handleHideCharacter(characterId: number) {
        if (hidingRef.current) return;

        const character = characters.find((item) => item.id === characterId);
        if (!character) return;

        hidingRef.current = true;
        setHidingCharacterId(characterId);
        setActionError(null);

        try {
            await hideCharacterFromTimeline(universeId, characterId);

            setCharacters((current) =>
                current.filter((item) => item.id !== characterId)
            );

            setHiddenCharacter(character);
        } catch (caughtError) {
            console.error(caughtError);
            setActionError("Could not hide the character. Please try again.")
        } finally {
            hidingRef.current = false;
            setHidingCharacterId(null);
        }
    }

    async function handleUndoHide() {
        if (!hiddenCharacter || hidingRef.current) return;

        const character = hiddenCharacter;

        hidingRef.current = true;
        setHidingCharacterId(character.id);
        setActionError(null);

        try {
            await showCharacterOnTimeline(universeId, character.id);

            setCharacters((current) =>
                [...current.filter((item) => item.id !== character.id), character]
                    .sort((first, second) =>
                        first.alias.localeCompare(second.alias) ||
                        first.id - second.id
                    )
            );

            setHiddenCharacter(null);
        } catch (caughtError) {
            console.error(caughtError);
            setActionError("Could not restore the character. Please try again.")
        } finally {
            hidingRef.current = false;
            setHidingCharacterId(null);
        }
    }

    if (loading) {
        return (
            <p className="status-message" role="status">
                Loading timeline...
            </p>
        );
    }

    if (error) {
        return (
            <div className="status-message status-error" role="alert">
                <p>{error}</p>

                <button
                    type="button"
                    className="utility-button"
                    onClick={retryTimeline}
                >
                    Try again
                </button>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <p className="status-message">
                No projects have been added to this universe.
            </p>
        );
    }

    return (
        <>
            {hiddenCharacter && (
                <div className="management-toolbar">
                    <p className="management-notice" role="status">
                        {hiddenCharacter.alias} hidden. Their appearances and events are saved.
                    </p>

                    <button
                        type="button"
                        className="utility-button"
                        disabled={hidingCharacterId !== null}
                        onClick={handleUndoHide}
                    >
                        Undo
                    </button>
                </div>
            )}

            {actionError && (
                <div className="status-message status-error" role="alert">
                    <p>{actionError}</p>

                    <button
                        type="button"
                        className="utility-button"
                        onClick={() => setActionError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {characters.length === 0 && (
                <p className="status-message">
                    No characters are shown on this timeline.
                    Open Characters and choose "Show on timeline".
                </p>
            )}

            <section className="timeline-container" aria-label="Character timeline">
                <div className="timeline-grid">
                    <TimelineHeader projects={projects} />

                    {characters.map((character) => (
                        <CharacterRow
                            key={character.id}
                            character={character}
                            projects={projects}
                            appearances={appearances}
                            characterEvents={characterEvents}
                            onCreateAppearance={handleCreateAppearance}
                            onUpdateAppearance={handleUpdateAppearance}
                            onDeleteAppearance={handleDeleteAppearance}
                            onSaveCharacterEvent={handleSaveCharacterEvent}
                            onDeleteCharacterEvent={handleDeleteCharacterEvent}
                            onHideCharacter={handleHideCharacter}
                            hideDisabled={hidingCharacterId !== null}
                        />
                    ))}
                </div>
            </section>
        </>
    )
}
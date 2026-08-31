import { useEffect, useState } from "react";
import { createAppearance, deleteAppearance, getAppearances, updateAppearance } from "../../services/appearances";
import { getCharacters } from "../../services/characters";
import { getProjects } from "../../services/projects";
import type { Appearance } from "../../types/appearance";
import type { Character } from "../../types/character";
import type { Project } from "../../types/project";
import CharacterRow from "./CharacterRow";
import TimelineHeader from "./TimelineHeader";

export default function TimelineGrid() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [appearances, setAppearances] = useState<Appearance[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        appearanceType: string
    ) {
        try {
            const updatedAppearance =
                await updateAppearance(
                    characterId,
                    projectId,
                    appearanceType
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


    useEffect(() => {
        async function loadTimeline() {
            try {
                setLoading(true);

                const [
                    projectsData,
                    charactersData,
                    appearancesData
                ] = await Promise.all([
                    getProjects(),
                    getCharacters(),
                    getAppearances()
                ]);

                setProjects(projectsData);
                setCharacters(charactersData);
                setAppearances(appearancesData);
            } catch (error) {
                console.error(error);

                setError("Could not load timeline.")
            } finally {
                setLoading(false);
            }
        }

        loadTimeline();
    }, []);

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
                        onCreateAppearance={handleCreateAppearance}
                        onUpdateAppearance={handleUpdateAppearance}
                        onDeleteAppearance={handleDeleteAppearance}
                    />
                ))}
            </div>
        </section>
    )
}
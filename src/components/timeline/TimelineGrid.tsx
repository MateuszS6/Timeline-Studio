import { useEffect, useState } from "react"
import { getProjects } from "../../services/projects";
import { getCharacters } from "../../services/characters";
import { getAppearances } from "../../services/appearances";
import type { Project } from "../../types/project"
import type { Character } from "../../types/character";
import type { Appearance } from "../../types/appearance";
import TimelineHeader from "./TimelineHeader"
import CharacterRow from "./CharacterRow";

export default function TimelineGrid() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [appearances, setAppearances] = useState<Appearance[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    />
                ))}
            </div>
        </section>
    )
}
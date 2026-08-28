import type { Appearance } from "../../types/appearance";
import type { Character } from "../../types/character";
import type { Project } from "../../types/project";

import TimelineCell from "./TimelineCell";

interface CharacterRowProps {
    character: Character;
    projects: Project[];
    appearances: Appearance[];
}

export default function CharacterRow({
    character,
    projects,
    appearances
}: CharacterRowProps) {
    return (
        <div className="timeline-row">
            <div className="character-column">
                {character.alias}
            </div>

            {projects.map((project) => {
                const appearance = appearances.find(
                    (item) =>
                        item.character_id === character.id &&
                        item.project_id === project.id
                );

                return (
                    <TimelineCell
                        key={project.id}
                        appearance={appearance}
                    />
                );
            })}
        </div>
    )
}
import type { Appearance } from "../../types/appearance";
import type { Character } from "../../types/character";
import type { Project } from "../../types/project";

import TimelineCell from "./TimelineCell";

interface CharacterRowProps {
    character: Character;
    projects: Project[];
    appearances: Appearance[];

    onCreateAppearance: (
        characterId: number,
        projectId: number
    ) => void;

    onUpdateAppearance: (
        characterId: number,
        projectId: number,
        appearanceType: string
    ) => void;

    onDeleteAppearance: (
        characterId: number,
        projectId: number
    ) => void;
}

export default function CharacterRow({
    character,
    projects,
    appearances,
    onCreateAppearance,
    onUpdateAppearance,
    onDeleteAppearance
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
                        characterId={character.id}
                        projectId={project.id}
                        appearance={appearance}
                        onCreate={onCreateAppearance}
                        onUpdate={onUpdateAppearance}
                        onDelete={onDeleteAppearance}
                    />
                );
            })}
        </div>
    )
}
import type { Appearance, AppearanceUpdate } from "../../types/appearance";
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
        updates: AppearanceUpdate
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
    const rowAppearances = projects.map((project) =>
        appearances.find(
            (appearance) =>
                appearance.character_id === character.id &&
                appearance.project_id === project.id
        )
    );

    const connectedIndexes = rowAppearances
        .map((appearance, index) =>
            appearance && !appearance.is_detached
                ? index
                : -1
        )
        .filter((index) => index !== -1);

    const firstConnectedIndex =
        connectedIndexes.length > 0
            ? connectedIndexes[0]
            : -1;

    const lastConnectedIndex =
        connectedIndexes.length > 0
            ? connectedIndexes[connectedIndexes.length - 1]
            : -1;

    return (
        <div className="timeline-row">
            <div className="character-column">
                {character.alias}
            </div>

            {projects.map((project, index) => {
                const appearance = rowAppearances[index];

                const hasLifeline = firstConnectedIndex !== -1;

                const lineLeft =
                    hasLifeline &&
                    index > firstConnectedIndex &&
                    index <= lastConnectedIndex;

                const lineRight =
                    hasLifeline &&
                    index >= firstConnectedIndex &&
                    index < lastConnectedIndex;

                const isFirstConnected =
                    index === firstConnectedIndex;

                return (
                    <TimelineCell
                        key={project.id}
                        characterId={character.id}
                        projectId={project.id}
                        appearance={appearance}
                        lineLeft={lineLeft}
                        lineRight={lineRight}
                        isFirstConnected={isFirstConnected}
                        onCreate={onCreateAppearance}
                        onUpdate={onUpdateAppearance}
                        onDelete={onDeleteAppearance}
                    />
                );
            })}
        </div>
    )
}
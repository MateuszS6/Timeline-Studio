import { getCharacterEvents } from "../../services/characterEvents";
import type { Appearance, AppearanceUpdate } from "../../types/appearance";
import type { Character } from "../../types/character";
import type { CharacterEvent, CharacterEventPosition, CharacterEventType } from "../../types/characterEvent";
import type { Project } from "../../types/project";
import { buildLifelineSegments } from "../../utils/buildLifelineSegments";

import TimelineCell from "./TimelineCell";

interface CharacterRowProps {
    character: Character;
    projects: Project[];
    appearances: Appearance[];
    characterEvents: CharacterEvent[];

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

    onSaveCharacterEvent: (
        characterId: number,
        projectId: number,
        eventType: CharacterEventType,
        eventPosition: CharacterEventPosition
    ) => void;

    onDeleteCharacterEvent: (
        characterId: number,
        projectId: number
    ) => void;
}

export default function CharacterRow({
    character,
    projects,
    appearances,
    characterEvents,
    onCreateAppearance,
    onUpdateAppearance,
    onDeleteAppearance,
    onSaveCharacterEvent,
    onDeleteCharacterEvent
}: CharacterRowProps) {
    const rowAppearances = projects.map((project) =>
        appearances.find(
            (appearance) =>
                appearance.character_id === character.id &&
                appearance.project_id === project.id
        )
    );

    const rowEvents = projects.map((project) =>
        characterEvents.find(
            (event) =>
                event.character_id === character.id &&
                event.project_id === project.id
        )
    );

    const lifelineSegments =
        buildLifelineSegments(
            rowAppearances,
            rowEvents
        );

    const firstConnectedIndex =
        rowAppearances.findIndex(
            (appearance) =>
                appearance !== undefined &&
                !appearance.is_detached
        )

    return (
        <div className="timeline-row">
            <div className="character-column">
                {character.alias}
            </div>

            {projects.map((project, index) => {
                const appearance = rowAppearances[index];
                const characterEvent = rowEvents[index];

                const lineLeft = lifelineSegments.some(
                    (segment) =>
                        segment.start < index &&
                        segment.end >= index
                )

                const lineRight = lifelineSegments.some(
                    (segment) =>
                        segment.start <= index &&
                        segment.end > index
                )

                const isFirstConnected =
                    index === firstConnectedIndex;

                return (
                    <TimelineCell
                        key={project.id}
                        characterId={character.id}
                        projectId={project.id}
                        appearance={appearance}
                        characterEvent={characterEvent}
                        lineLeft={lineLeft}
                        lineRight={lineRight}
                        isFirstConnected={isFirstConnected}
                        onCreate={onCreateAppearance}
                        onUpdate={onUpdateAppearance}
                        onDelete={onDeleteAppearance}
                        onSaveCharacterEvent={onSaveCharacterEvent}
                        onDeleteCharacterEvent={onDeleteCharacterEvent}
                    />
                );
            })}
        </div>
    )
}
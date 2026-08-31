import { useState } from "react";
import type { Appearance } from "../../types/appearance";

interface TimelineCellProps {
    characterId: number;
    projectId: number;
    appearance?: Appearance;

    onCreate: (
        characterId: number,
        projectId: number
    ) => void;

    onUpdate: (
        characterId: number,
        projectId: number,
        appearanceType: string
    ) => void;

    onDelete: (
        characterId: number,
        projectId: number
    ) => void;
}

export default function TimelineCell({
    characterId,
    projectId,
    appearance,
    onCreate,
    onUpdate,
    onDelete
}: TimelineCellProps) {
    const [editorOpen, setEditorOpen] = useState(false);

    function handleLeftClick() {
        if (!appearance) {
            onCreate(characterId, projectId);
            return;
        }

        setEditorOpen((open) => !open);
    }

    function handleRightClick(
        event: React.MouseEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        if (!appearance) return;

        onDelete(characterId, projectId);
        setEditorOpen(false);
    }

    function handleTypeChange(type: string) {
        onUpdate(
            characterId,
            projectId,
            type
        );

        setEditorOpen(false);
    }

    return (
        <div
            className="timeline-cell"
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
        >
            {appearance && (
                <div
                    className={`appearance-dot appearance-${appearance.appearance_type}`}
                    title={appearance.appearance_type}
                />
            )}

            {editorOpen && appearance && (
                <div
                    className="appearance-editor"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <button
                        onClick={() => handleTypeChange("standard")}
                    >
                        Standard
                    </button>

                    <button
                        onClick={() => handleTypeChange("flashback")}
                    >
                        Flashback
                    </button>

                    <button
                        onClick={() => handleTypeChange("footage")}
                    >
                        Footage
                    </button>
                </div>
            )}
        </div>
    );
}
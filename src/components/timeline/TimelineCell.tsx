import { useEffect, useRef, useState } from "react";
import type { Appearance, AppearanceType, AppearanceUpdate } from "../../types/appearance";

interface TimelineCellProps {
    characterId: number;
    projectId: number;

    appearance?: Appearance;

    lineLeft: boolean;
    lineRight: boolean;
    isFirstConnected: boolean;

    onCreate: (
        characterId: number,
        projectId: number
    ) => void;

    onUpdate: (
        characterId: number,
        projectId: number,
        updates: AppearanceUpdate
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
    lineLeft,
    lineRight,
    isFirstConnected,
    onCreate,
    onUpdate,
    onDelete
}: TimelineCellProps) {
    const [editorOpen, setEditorOpen] = useState(false);
    const cellRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editorOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                cellRef.current &&
                !cellRef.current.contains(event.target as Node)
            ) {
                setEditorOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setEditorOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [editorOpen])

    function handleLeftClick() {
        if (!appearance) {
            onCreate(characterId, projectId);
            return;
        }

        onDelete(characterId, projectId);
        setEditorOpen(false);
    }

    function handleRightClick(
        event: React.MouseEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        if (!appearance) return;

        setEditorOpen((open) => !open);
    }

    function handleTypeChange(type: AppearanceType) {
        onUpdate(
            characterId,
            projectId,
            {
                appearance_type: type
            }
        );

        setEditorOpen(false);
    }

    function handleDetachedToggle(
        event: React.MouseEvent
    ) {
        event.stopPropagation();

        if (!appearance) return;

        onUpdate(
            characterId,
            projectId,
            {
                is_detached: !appearance.is_detached
            }
        );
    }

    return (
        <div
            ref={cellRef}
            className="timeline-cell"
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
        >
            {lineLeft && (
                <span className="timeline-line timeline-line-left" />
            )}

            {lineRight && (
                <span className="timeline-line timeline-line-right" />
            )}

            {isFirstConnected && (
                <span
                    className="timeline-start-marker"
                    title="Start of main timeline"
                />
            )}

            {appearance && (
                <div
                    className={`
                        appearance-marker
                        appearance-${appearance.appearance_type}
                        ${appearance.is_detached ? "appearance-detached" : ""}
                    `}
                    title={
                        appearance.is_detached
                            ? `${appearance.appearance_type} - detached`
                            : appearance.appearance_type
                    }
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

                    <div className="appearance-editor-divider" />

                    <button
                        className={
                            appearance.is_detached
                                ? "appearance-editor-option active"
                                : "appearance-editor-option"
                        }
                        onClick={handleDetachedToggle}
                    >
                        {appearance.is_detached
                            ? "✓ Detached from lifeline"
                            : "Detach from lifeline"}
                    </button>
                </div>
            )}
        </div>
    );
}
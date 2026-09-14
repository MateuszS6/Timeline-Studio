import { useEffect, useRef, useState } from "react";
import type { Appearance, AppearanceType, AppearanceUpdate } from "../../types/appearance";
import type { CharacterEvent, CharacterEventPosition, CharacterEventType } from "../../types/characterEvent";

interface TimelineCellProps {
    characterId: number;
    projectId: number;

    appearance?: Appearance;
    characterEvent?: CharacterEvent;

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

    onSaveEvent: (
        characterId: number,
        projectId: number,
        eventType: CharacterEventType,
        eventPosition: CharacterEventPosition
    ) => void;

    onDeleteEvent: (
        characterId: number,
        projectId: number
    ) => void;
}

export default function TimelineCell({
    characterId,
    projectId,
    appearance,
    characterEvent,
    lineLeft,
    lineRight,
    isFirstConnected,
    onCreate,
    onUpdate,
    onDelete,
    onSaveEvent,
    onDeleteEvent
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

        setEditorOpen((open) => !open);
    }

    function handleRightClick(
        event: React.MouseEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        if (appearance) {
            onDelete(characterId, projectId);
            setEditorOpen(false);
            return;
        }

        // Empty cell can still contain/edit a timeline event.
        setEditorOpen((open) => !open);
    }

    function handleAppearanceTypeChange(type: AppearanceType) {
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

    function handleEventTypeChange(
        type: CharacterEventType
    ) {
        onSaveEvent(
            characterId,
            projectId,
            type,
            characterEvent?.event_position ?? "at"
        );
    }

    function handleEventPositionChange(
        position: CharacterEventPosition
    ) {
        if (!characterEvent) return;

        onSaveEvent(
            characterId,
            projectId,
            characterEvent.event_type,
            position
        );
    }

    function handleDeleteEvent(
        event: React.MouseEvent
    ) {
        event.stopPropagation();

        onDeleteEvent(
            characterId,
            projectId
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

            {editorOpen && (
                appearance ? (
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
                ) : (
                    <button
                        onClick={() => {
                            onCreate(characterId, projectId);
                            setEditorOpen(false);
                        }}
                    >
                        Add standard appearance
                    </button>
                )
            )}
        </div>
    );
}
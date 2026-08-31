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
    return (
        <div className="timeline-cell">
            {appearance && (
                <div
                    className={`appearance-dot appearance-${appearance.appearance_type}`}
                    title={appearance.appearance_type}
                />
            )}
        </div>
    )
}
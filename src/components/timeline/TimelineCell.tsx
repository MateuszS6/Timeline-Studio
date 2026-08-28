import type { Appearance } from "../../types/appearance";

interface TimelineCellProps {
    appearance?: Appearance;
}

export default function TimelineCell({
    appearance
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
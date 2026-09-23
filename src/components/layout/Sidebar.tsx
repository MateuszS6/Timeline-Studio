import { useWorkspace } from "../../context/WorkspaceContext";
import type { WorkspaceView } from "../../types/workspace";

interface SidebarProps {
    activeView: WorkspaceView;
    onViewChange: (view: WorkspaceView) => void;
}

export default function Sidebar({
    activeView,
    onViewChange
}: SidebarProps) {
    const {
        franchises,
        universes,
        selectedFranchiseId,
        selectedUniverseId,
        setSelectedFranchiseId,
        setSelectedUniverseId,
        loading
    } = useWorkspace();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-logo">T</span>
                <span>Timeline Studio</span>
            </div>

            <div className="workspace-selectors">

                <label>
                    <span>Franchise</span>

                    <select
                        value={selectedFranchiseId ?? ""}
                        disabled={franchises.length === 0}
                        onChange={(event) =>
                            setSelectedFranchiseId(Number(event.target.value))
                        }
                    >
                        <option value="" disabled>
                            {loading ? "Loading..." : "No franchises"}
                        </option>

                        {franchises.map((franchise) => (
                            <option key={franchise.id} value={franchise.id}>
                                {franchise.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Universe</span>

                    <select
                        value={selectedUniverseId ?? ""}
                        disabled={loading || universes.length === 0}
                        onChange={(event) =>
                            setSelectedUniverseId(Number(event.target.value))
                        }
                    >
                        <option value="" disabled>
                            {loading ? "Loading..." : "No universes"}
                        </option>

                        {universes.map((universe) => (
                            <option key={universe.id} value={universe.id} >
                                {universe.name}
                            </option>
                        ))}
                    </select>
                </label>

            </div>

            <nav className="sidebar-nav" aria-label="Workspace">
                <button
                    type="button"
                    className={
                        activeView === "timeline"
                            ? "sidebar-item active"
                            : "sidebar-item"
                    }
                    aria-current={activeView === "timeline" ? "page" : undefined}
                    onClick={() => onViewChange("timeline")}
                >
                    Timeline
                </button>

                <button
                    type="button"
                    className={
                        activeView === "characters"
                            ? "sidebar-item active"
                            : "sidebar-item"
                    }
                    aria-current={activeView === "characters" ? "page" : undefined}
                    onClick={() => onViewChange("characters")}
                >
                    Characters
                </button>

                <button
                    type="button"
                    className={
                        activeView === "characters"
                            ? "sidebar-item active"
                            : "sidebar-item"
                    }
                    aria-current={activeView === "projects" ? "page" : undefined}
                    onClick={() => onViewChange("projects")}
                >
                    Projects
                </button>
            </nav>
        </aside>
    )
}
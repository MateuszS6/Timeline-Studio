import { useWorkspace } from "../../context/WorkspaceContext"

export default function Sidebar() {
    const {
        franchises,
        universes,

        selectedFranchiseId,
        setSelectedUniverseId,

        setSelectedFranchiseId,
        selectedUniverseId
    } = useWorkspace();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-logo">
                    M
                </span>
                <span>Timelines</span>
            </div>

            <div className="workspace-selectors">

                <label>
                    Franchise

                    <select
                        value={selectedFranchiseId ?? ""}
                        onChange={(event) =>
                            setSelectedFranchiseId(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                    >
                        {franchises.map(
                            (franchise) => (
                                <option
                                    key={franchise.id}
                                    value={franchise.id}
                                >
                                    {franchise.name}
                                </option>
                            )
                        )}
                    </select>
                </label>

                <label>
                    Universe

                    <select
                        value={selectedUniverseId ?? ""}
                        onChange={(event) =>
                            setSelectedUniverseId(
                                Number(
                                    event.target.value
                                )
                            )
                        }
                    >
                        {universes.map(
                            (universe) => (
                                <option
                                    key={universe.id}
                                    value={universe.id}
                                >
                                    {universe.name}
                                </option>
                            )
                        )}
                    </select>
                </label>
                
            </div>

            <nav className="sidebar-nav">
                <button className="sidebar-item active">
                    Timeline
                </button>

                <button className="sidebar-item">
                    Characters
                </button>

                <button className="sidebar-item">
                    Projects
                </button>
            </nav>
        </aside>
    )
}
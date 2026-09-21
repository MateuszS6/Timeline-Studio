import Sidebar from '../components/layout/Sidebar';
import TimelineGrid from '../components/timeline/TimelineGrid';
import { useWorkspace } from '../context/WorkspaceContext';

export default function TimelinePage() {
  const {
    universes,
    selectedUniverseId
  } = useWorkspace();

  const selectedUniverse = universes.find(
    (universe) => universe.id === selectedUniverseId
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <header className="page-header">
          <h1>
            {selectedUniverse?.name ?? "Timeline"}
          </h1>

          <p>Character lifelines showing appearances across projects</p>
        </header>

        {selectedUniverseId !== null && (
          <TimelineGrid universeId={selectedUniverseId} />
        )}
      </main>
    </div>
  );
}
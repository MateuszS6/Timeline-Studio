import TimelineGrid from '../components/timeline/TimelineGrid';
import { useWorkspace } from '../context/WorkspaceContext';

export default function TimelinePage() {
  const {
    franchises,
    universes,
    selectedFranchiseId,
    selectedUniverseId,
    loading,
    error,
    retryWorkspace
  } = useWorkspace();

  const selectedFranchise = franchises.find(
    (franchise) => franchise.id === selectedFranchiseId
  );

  const selectedUniverse = universes.find(
    (universe) => universe.id === selectedUniverseId
  );

  return (
    <main className='main-content'>
      <header className='page-header'>
        <h1>{selectedUniverse?.name ?? "Timeline"}</h1>
        {selectedFranchise?.name === "Marvel" && selectedUniverse?.code ? (
          <p>
            Character lifelines for Earth-{selectedUniverse?.code}
          </p>
        ) : (
          <p>
            Character lifelines showing appearances across projects
          </p>
        )}
      </header>

      {loading ? (
        <p className='status-message' role='status'>
          Loading workspace...
        </p>
      ) : error ? (
        <div className='status-message status-error' role='alert'>
          <p>{error}</p>
          <button
            type='button'
            className='utility-button'
            onClick={retryWorkspace}
          >
            Try again
          </button>
        </div>
      ) : selectedUniverseId === null ? (
        <p className='status-message'>
          {franchises.length === 0
            ? "No franchises are available."
            : "No universes are available for this franchise."
          }
        </p>
      ) : (
        <TimelineGrid
          key={selectedUniverseId}
          universeId={selectedUniverseId}
        />
      )}
    </main>
  );
}
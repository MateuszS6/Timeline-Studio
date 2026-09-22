import { useEffect, useState, type ReactNode } from "react";
import { getFranchises } from "../services/franchises";
import { getUniversesByFranchise } from "../services/universes";
import type { Franchise } from "../types/franchise";
import type { Universe } from "../types/universe";
import { WorkspaceContext } from "./WorkspaceContext";

export function WorkspaceProvider({
    children
}: {
    children: ReactNode;
}) {
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [universes, setUniverses] = useState<Universe[]>([]);

    const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);
    const [selectedUniverseId, setSelectedUniverseId] = useState<number | null>(null);

    const [franchisesLoading, setFranchisesLoading] = useState(true);
    const [universesLoading, setUniversesLoading] = useState(false);

    const [franchisesError, setFranchisesError] = useState<string | null>(null);
    const [universesError, setUniversesError] = useState<string | null>(null);

    const [loadAttempt, setLoadAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadFranchises() {
            try {
                const data = await getFranchises();

                if (cancelled) return;

                const firstFranchiseId = data[0]?.id ?? null;

                setFranchises(data);
                setSelectedFranchiseId(firstFranchiseId);
                setUniversesLoading(firstFranchiseId !== null);
            } catch (error) {
                if (cancelled) return;

                console.error(error);
                setFranchisesError("Could not load franchises.");
            } finally {
                if (!cancelled) setFranchisesLoading(false);
            }
        }

        void loadFranchises();

        return () => {
            cancelled = true;
        };
    }, [loadAttempt])

    useEffect(() => {
        if (selectedFranchiseId === null) return;

        const franchiseId = selectedFranchiseId;
        let cancelled = false;

        async function loadUniverses() {
            try {
                const data = await getUniversesByFranchise(franchiseId);

                if (cancelled) return;

                setUniverses(data);
                setSelectedUniverseId(data[0]?.id ?? null);
            } catch (error) {
                if (cancelled) return;

                console.error(error);
                setUniversesError("Could not load universes.");
            } finally {
                if (!cancelled) setUniversesLoading(false);
            }
        }

        void loadUniverses();

        return () => {
            cancelled = true;
        }
    }, [selectedFranchiseId]);

    function selectFranchise(id: number) {
        if (id === selectedFranchiseId) return;

        setSelectedFranchiseId(id);
        setUniverses([]);
        setSelectedUniverseId(null);
        setUniversesError(null);
        setUniversesLoading(true);
    }

    function retryWorkspace() {
        setFranchises([]);
        setUniverses([]);
        setSelectedFranchiseId(null);
        setSelectedUniverseId(null);

        setFranchisesError(null);
        setUniversesError(null);
        setFranchisesLoading(true);
        setUniversesLoading(false);

        setLoadAttempt((current) => current + 1);
    }

    return (
        <WorkspaceContext.Provider
            value={{
                franchises,
                universes,
                selectedFranchiseId,
                selectedUniverseId,
                loading: franchisesLoading || universesLoading,
                error: franchisesError || universesError,
                setSelectedFranchiseId: selectFranchise,
                setSelectedUniverseId,
                retryWorkspace
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

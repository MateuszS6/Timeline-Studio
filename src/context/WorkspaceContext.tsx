import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Franchise } from "../types/franchise";
import type { Universe } from "../types/universe";
import { getUniversesByFranchise } from "../services/universes";
import { getFranchises } from "../services/franchises";

interface WorkspaceContextValue {
    franchises: Franchise[];
    universes: Universe[];

    selectedFranchiseId: number | null;
    selectedUniverseId: number | null;

    setSelectedFranchiseId: (
        id: number
    ) => void;

    setSelectedUniverseId: (
        id: number
    ) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
    children
}: {
    children: ReactNode;
}) {
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [universes, setUniverses] = useState<Universe[]>([]);

    const [selectedFranchiseId, setSelectedFranchiseId] = useState<number | null>(null);
    const [selectedUniverseId, setSelectedUniverseId] = useState<number | null>(null);

    useEffect(() => {
        async function loadFranchises() {
            const data = await getFranchises();

            setFranchises(data);

            setSelectedFranchiseId(data[0]?.id ?? null);
        }

        loadFranchises();
    }, [])

    useEffect(() => {
        if (selectedFranchiseId === null) {
            setUniverses([]);
            setSelectedUniverseId(null);
            return;
        }

        async function loadUniverses() {
            const data = await getUniversesByFranchise(selectedFranchiseId!);

            setUniverses(data);

            setSelectedUniverseId(data[0]?.id ?? null);
        }

        loadUniverses();
    }, [selectedFranchiseId]);

    return (
        <WorkspaceContext.Provider
            value={{
                franchises,
                universes,
                selectedFranchiseId,
                selectedUniverseId,
                setSelectedFranchiseId,
                setSelectedUniverseId
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);

    if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");

    return context;
}
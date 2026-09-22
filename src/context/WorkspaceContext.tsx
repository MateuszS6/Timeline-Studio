import { createContext, useContext } from "react";
import type { Franchise } from "../types/franchise";
import type { Universe } from "../types/universe";

interface WorkspaceContextValue {
    franchises: Franchise[];
    universes: Universe[];

    selectedFranchiseId: number | null;
    selectedUniverseId: number | null;

    loading: boolean;
    error: string | null;

    setSelectedFranchiseId: (id: number) => void;
    setSelectedUniverseId: (id: number) => void;
    retryWorkspace: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
    const context = useContext(WorkspaceContext);

    if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");

    return context;
}
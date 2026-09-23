import { useEffect, useState } from "react";
import type { Character } from "../types/character";
import { getCharactersByOriginUniverse } from "../services/characters";

interface CharactersPageProps {
    universeId: number;
}

export default function CharactersPage({
    universeId
}: CharactersPageProps) {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadAttempt, setLoadAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadCharacters() {
            try {
                const data = await getCharactersByOriginUniverse(universeId);

                if (cancelled) return;

                setCharacters(data);
            } catch (error) {
                if (cancelled) return;

                console.error(error);
                setError("Could not load characters.")
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadCharacters();

        return () => {
            cancelled = true;
        }
    }, [universeId, loadAttempt])

    function retry() {
        setError(null);
        setLoading(true);
        setLoadAttempt((current) => current + 1);
    }

    if (loading) {
        return (
            <p className="status-message" role="status">
                Loading characters...
            </p>
        )
    }

    if (error) {
        return (
            <div className="status-message status-error" role="alert">
                <p>{error}</p>
                <button
                    type="button"
                    className="utility-button"
                    onClick={retry}
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <section className="management-page" aria-label="Characters">
            <p className="management-summary">
                {characters.length}{" "}
                {characters.length === 1 ? "character" : "characters"}
            </p>

            {characters.length === 0 ? (
                <p className="status-message">
                    No characters have this universe assigned as their origin.
                </p>
            ) : (
                <div className="management-table-container">
                    <table className="management-table">
                        <thead>
                            <tr>
                                <th scope="col">Character</th>
                            </tr>
                        </thead>

                        <tbody>
                            {characters.map((character) => (
                                <tr key={character.id}>
                                    <td>{character.alias}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
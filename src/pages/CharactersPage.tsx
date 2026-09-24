import { useEffect, useState } from "react";
import type { Character, CharacterInput } from "../types/character";
import { createCharacter, getCharactersByOriginUniverse, updateCharacter } from "../services/characters";
import { useWorkspace } from "../context/WorkspaceContext";
import CharacterForm from "../components/characters/CharacterForm";

interface CharactersPageProps {
    universeId: number;
}

function sortCharacters(characters: Character[]): Character[] {
    return [...characters].sort(
        (first, second) =>
            first.alias.localeCompare(second.alias) ||
            first.id - second.id
    );
}

export default function CharactersPage({
    universeId
}: CharactersPageProps) {
    const { universes } = useWorkspace();

    const [characters, setCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadAttempt, setLoadAttempt] = useState(0);

    const [editor, setEditor] = useState<Character | "new" | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCharacters() {
            try {
                const data = await getCharactersByOriginUniverse(universeId);

                if (cancelled) return;

                setCharacters(data);
            } catch (caughtError) {
                if (cancelled) return;

                console.error(caughtError);
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

    function openEditor(value: Character | "new") {
        setNotice(null);
        setEditor(value);
    }

    async function handleSave(input: CharacterInput): Promise<void> {
        if (editor === null) {
            throw new Error("No character editor is open.")
        }

        const savedCharacter =
            editor === "new"
                ? await createCharacter(input)
                : await updateCharacter(editor.id, input);

        setCharacters((current) => {
            const remaining = current.filter(
                (character) => character.id !== savedCharacter.id
            );

            if (savedCharacter.origin_universe_id !== universeId) {
                return remaining;
            }

            return sortCharacters([...remaining, savedCharacter]);
        });

        const originName = universes.find(
            (universe) => universe.id === savedCharacter.origin_universe_id
        )?.name;

        setNotice(
            savedCharacter.origin_universe_id === universeId
                ? `${savedCharacter.alias} saved.`
                : `${savedCharacter.alias} saved under ${originName ?? "another universe"
                }. Switch to that universe to see the character in this list.`
        );

        setEditor(null);
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
            <div className="management-toolbar">
                <p className="management-summary">
                    {characters.length}{" "}
                    {characters.length === 1 ? "character" : "characters"}
                </p>

                <button
                    type="button"
                    className="utility-button"
                    disabled={editor !== null}
                    onClick={() => openEditor("new")}
                >
                    Add character
                </button>
            </div>

            {editor && (
                <p className="management-notice" role="status">
                    {notice}
                </p>
            )}

            {editor !== null && (
                <CharacterForm
                    key={editor === "new" ? "new" : editor.id}
                    character={editor === "new" ? null : editor}
                    defaultUniverseId={universeId}
                    universes={universes}
                    onSave={handleSave}
                    onCancel={() => setEditor(null)}
                />
            )}

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
                                <th scope="col">Real name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {characters.map((character) => (
                                <tr key={character.id}>
                                    <td>{character.alias}</td>
                                    <td>{character.real_name ?? "?"}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="utility-button"
                                            disabled={editor !== null}
                                            aria-label={`Edit ${character.alias}`}
                                            onClick={() => openEditor(character)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
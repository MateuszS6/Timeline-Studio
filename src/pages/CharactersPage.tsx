import { useEffect, useRef, useState } from "react";
import type { Character, CharacterInput } from "../types/character";
import { createCharacter, deleteCharacter, getCharactersByOriginUniverse, updateCharacter } from "../services/characters";
import { useWorkspace } from "../context/WorkspaceContext";
import CharacterForm from "../components/characters/CharacterForm";
import { getTimelineCharactersIds, hideCharacterFromTimeline, showCharacterOnTimeline } from "../services/timelineCharacters";

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

    const [timelineCharacterIds, setTimelineCharacterIds] = useState<number[]>([]);
    const [changingCharacterId, setChangingCharacterId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const changingRef = useRef(false);
    const controlsDisabled = editor !== null || changingCharacterId !== null;

    useEffect(() => {
        let cancelled = false;

        async function loadCharacters() {
            try {
                const [data, selectedIds] = await Promise.all([
                    getCharactersByOriginUniverse(universeId),
                    getTimelineCharactersIds(universeId)
                ]);

                if (cancelled) return;

                setCharacters(sortCharacters(data));
                setTimelineCharacterIds(selectedIds);

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

    async function handleTimelineToggle(character: Character) {
        if (changingRef.current) return;

        const isShown = timelineCharacterIds.includes(character.id);

        changingRef.current = true;
        setChangingCharacterId(character.id);
        setActionError(null);
        setNotice(null);

        try {
            if (isShown) {
                await hideCharacterFromTimeline(universeId, character.id);

                setTimelineCharacterIds((current: number[]) =>
                    current.filter((id) => id !== character.id)
                );

                setNotice(
                    `${character.alias} hidden from this timeline. ` +
                    "Their appearances and events are still saved."
                );
            } else {
                await showCharacterOnTimeline(universeId, character.id);

                setTimelineCharacterIds((current: number[]) =>
                    current.includes(character.id)
                        ? current
                        : [...current, character.id]
                );

                setNotice(
                    `${character.alias} shown on this timeline. ` +
                    "Open Timeline to edit their appearances and events."
                );
            }
        } catch (caughtError) {
            console.error(caughtError);
            setActionError("Could not change timeline visibility. Please try again.")
        } finally {
            changingRef.current = false;
            setChangingCharacterId(null);
        }
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

    async function handleDeleteCharacter(character: Character) {
        if (changingRef.current || editor !== null) return;

        const confirmed = window.confirm(
            `Permanently delete "${character.alias}"?\n\n` +
            "This also deletes all their appearances, events, and timeline " +
            "selections across every universe. \n\n" +
            "This cannot be undone."
        )

        if (!confirmed) return;

        changingRef.current = true;
        setChangingCharacterId(character.id);
        setActionError(null);
        setNotice(null);

        try {
            await deleteCharacter(character.id);

            setCharacters((current) =>
                current.filter((item) => item.id !== character.id)
            );

            setTimelineCharacterIds((current) =>
                current.filter((id) => id !== character.id)
            );

            setNotice(`${character.alias} deleted.`)
        } catch (caughtError) {
            console.error(caughtError);
            setActionError("Could not delete the character. Please try again.");
        } finally {
            changingRef.current = false;
            setChangingCharacterId(null);
        }
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
                    disabled={controlsDisabled}
                    onClick={() => openEditor("new")}
                >
                    Add character
                </button>
            </div>

            {notice && (
                <p className="management-notice" role="status">
                    {notice}
                </p>
            )}

            {actionError && (
                <p className="form-error" role="alert">
                    {actionError}
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
                                <th scope="col">Timeline</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {characters.map((character) => {
                                const isShown = timelineCharacterIds.includes(character.id);
                                const isChanging = changingCharacterId === character.id;

                                return (
                                    <tr key={character.id}>
                                        <td>{character.alias}</td>
                                        <td>{character.real_name ?? "?"}</td>
                                        <td>{isShown ? "Shown" : "Hidden"}</td>

                                        <td>
                                            <div className="management-row-actions">
                                                <button
                                                    type="button"
                                                    className="utility-button"
                                                    disabled={controlsDisabled}
                                                    aria-label={`Edit ${character.alias}`}
                                                    onClick={() => openEditor(character)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="utility-button"
                                                    disabled={controlsDisabled}
                                                    onClick={() => handleTimelineToggle(character)}
                                                >
                                                    {isChanging
                                                        ? "Saving..."
                                                        : isShown
                                                            ? "Hide from timeline"
                                                            : "Show on timeline"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="utility-button utility-button-danger"
                                                    disabled={controlsDisabled}
                                                    aria-label={`Delete ${character.alias}`}
                                                    onClick={() => handleDeleteCharacter(character)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
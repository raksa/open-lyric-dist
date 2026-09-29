/**
 * Chord positions from `@tombatossals/chords-db` (MIT): ranking a chord's
 * positions from easiest to hardest and turning one into SVGuitar data. Shared
 * by the editor's chord popup (guitar) and the strum player (guitar, ukulele).
 *
 * A position lists one fret per string, lowest string first (`-1` muted,
 * `0` open), relative to `baseFret`; `barres` names the relative frets a
 * finger lays across.
 */
export interface ChordDatabasePosition {
    frets: number[];
    fingers?: number[];
    baseFret?: number;
    barres?: number[];
    capo?: boolean;
    midi?: number[];
}
export interface ChordDatabaseEntry {
    key: string;
    suffix: string;
    positions: ChordDatabasePosition[];
}
export interface ChordDatabase {
    chords: Record<string, ChordDatabaseEntry[]>;
}
export interface ChordDatabaseSearch {
    datasetRoot: string;
    suffixCandidates: string[];
}
declare function getLowestPitchClass(position: ChordDatabasePosition): number | null;
/** Lower is easier: low on the neck, few barres, a small span, open strings. */
declare function scorePosition(position: ChordDatabasePosition): number;
/**
 * Easiest first; with a slash chord's bass pitch class, positions whose lowest
 * note is that bass come first.
 */
declare function rankChordPositions<T extends ChordDatabasePosition>(positions: T[], bassPitchClass?: number | null): T[];
declare function deriveBarres(position: ChordDatabasePosition): {
    fromString: number;
    toString: number;
    fret: number;
    style: "arc";
    text: string | undefined;
}[];
/** SVGuitar's `{ fingers, barres, position }` for a position. */
declare function createSvguitarData(position: ChordDatabasePosition): {
    fingers: [number, number | "x", (string | undefined)?][];
    position: number;
    barres: {
        fromString: number;
        toString: number;
        fret: number;
        style: "arc";
        text: string | undefined;
    }[];
};
/**
 * The database entry for the first suffix candidate it has. By default a chord
 * it has no suffix for falls back to the plain major entry (what the editor's
 * popup shows); `allowMajorFallback: false` returns `null` instead.
 */
declare function resolveMatchingChordEntry(database: ChordDatabase | null | undefined, search: ChordDatabaseSearch, { allowMajorFallback }?: {
    allowMajorFallback?: boolean;
}): ChordDatabaseEntry | null;
export { createSvguitarData, deriveBarres, getLowestPitchClass, rankChordPositions, resolveMatchingChordEntry, scorePosition, };

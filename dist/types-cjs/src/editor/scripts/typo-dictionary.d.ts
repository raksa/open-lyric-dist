/**
 * Hunspell dictionaries through typo-js, knowing nothing of the editor's
 * plugin registry: building one from its two files (fetched or given),
 * merging suggestions across several, prefix lookups, and the snapshot that
 * carries a loaded dictionary into a worker.
 *
 * `spellcheck-common.ts` re-exports these for the editor; the Khmer engine
 * (`src/khmer-lint/`) imports them directly, so the `khmer-lint` package
 * carries none of the registry.
 */
/** The slice of a typo-js dictionary these helpers rely on. */
interface TypoDictionary {
    loaded: boolean;
    dictionaryTable?: unknown;
    check(word: string): boolean;
    suggest(word: string, limit?: number): string[];
}
/** A dictionary's two Hunspell files and its name. */
interface TypoDictionaryConfig {
    /** URL (or, for a file loader, path) of the `.aff` file. */
    affUrl: string;
    /** URL (or path) of the `.dic` file. */
    dicUrl: string;
    dictionaryName: string;
    languageCode?: string | null;
}
/** A dictionary flattened to JSON-safe data — see {@link createDictionarySnapshot}. */
type TypoDictionarySnapshot = Record<string, unknown>;
/**
 * What the helpers accept: anything dictionary-shaped — each one checks
 * `loaded` and the methods it needs before using them.
 */
type TypoDictionaryLike = Partial<TypoDictionary> | null | undefined;
type TypoDictionaryInput = TypoDictionaryLike | ReadonlyArray<TypoDictionaryLike>;
/** A typo-js dictionary from the text of its `.aff` and `.dic` files. */
declare function createTypoDictionary(dictionaryName: string, affData: string, dicData: string): TypoDictionary;
declare function mergeDictionarySuggestions(dictionaries: TypoDictionaryInput, word: string, limit?: number): string[];
/**
 * typo-js 1.3.2 keeps `dictionaryTable` as a `Map`; earlier releases — and
 * the plain-JSON side of a snapshot made before the upgrade — used a plain
 * word→flags object. Everything that reads a table goes through these two
 * helpers so both shapes behave identically, whichever a dictionary or a
 * restored snapshot happens to carry.
 */
declare function dictionaryTableHas(dictionaryTable: unknown, word: string): boolean;
declare function getDictionaryPrefixSuggestions(dictionaries: TypoDictionaryInput, prefix: string, limit?: number): string[];
declare function fetchDictionaryText(url: string): Promise<string>;
/** Fetch a dictionary's two files by URL and build it. */
declare function loadDictionaryFromConfig(dictionaryConfig: TypoDictionaryConfig | null | undefined): Promise<TypoDictionary | null>;
declare function createDictionarySnapshot(dictionary: TypoDictionaryLike): TypoDictionarySnapshot | null;
declare function restoreDictionaryFromSnapshot(dictionarySnapshot: unknown): TypoDictionary | null;
export { createDictionarySnapshot, createTypoDictionary, dictionaryTableHas, fetchDictionaryText, getDictionaryPrefixSuggestions, loadDictionaryFromConfig, mergeDictionarySuggestions, restoreDictionaryFromSnapshot, };
export type { TypoDictionary, TypoDictionaryConfig, TypoDictionarySnapshot };

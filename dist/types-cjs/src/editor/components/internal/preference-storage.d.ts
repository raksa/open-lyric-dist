/**
 * Where the previews keep what they remember between visits: the reader's
 * settings, the export dialogs' choices and sections, saved presets, a
 * plugin's own picks (the strum player's instrument, the Khmer label
 * language). The page's `localStorage` unless the host gives another.
 *
 * A host whose page forgets its `localStorage` — a VS Code webview gets a new
 * origin each time a panel opens — hands the previews a storage that lasts
 * ({@link setOpenLyricPreferenceStorage}), before they mount. It works as
 * `localStorage` does: string values, read and written synchronously, and
 * either may throw (full, or refused), which every caller already handles.
 *
 * One storage per page. The plugin packages reach this same module through
 * the core package (`open-lyric/internal`), so a host's storage serves them
 * too.
 */
/** The part of `Storage` the previews use. */
interface OpenLyricPreferenceStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
/**
 * Keep the previews' preferences in `storage` from now on; `null` goes back
 * to the page's `localStorage`. Set it before the previews mount: what they
 * have already read stays as read.
 */
declare function setOpenLyricPreferenceStorage(storage: OpenLyricPreferenceStorage | null): void;
/**
 * The storage preferences go to: the host's, else the page's `localStorage`;
 * `undefined` where there is none (or the page may not use it).
 */
declare function getOpenLyricPreferenceStorage(): OpenLyricPreferenceStorage | undefined;
export { getOpenLyricPreferenceStorage, setOpenLyricPreferenceStorage };
export type { OpenLyricPreferenceStorage };

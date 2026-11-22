/**
 * Presets of the reader's own, for the export dialogs. A dialog keeps its
 * whole set of options under a name in browser storage
 * (`createOpenLyricSavedPresetStore`), and lists them after its built-in
 * presets with **Save preset**, **Rename** and **Delete** beside the list,
 * and **Export presets** / **Import presets** to carry them as a file to
 * another computer, browser or editor (`openLyricPresetFieldMarkup` +
 * `mountOpenLyricPresetControls`).
 *
 * A saved preset holds everything the dialog has — unlike a built-in one,
 * which may leave some choices be — so picking it brings all of it back. A
 * picture it holds (a slide background) is kept once in storage however many
 * presets show it, since one can be megabytes.
 */
declare const OPEN_LYRIC_PRESET_NAME_MAX_LENGTH = 60;
declare const OPEN_LYRIC_MAX_SAVED_PRESETS = 50;
/** What an exported presets file says it is. */
declare const OPEN_LYRIC_PRESETS_FILE_TYPE = "open-lyric-presets";
interface OpenLyricSavedPreset<T> {
    id: string;
    name: string;
    value: T;
}
interface OpenLyricSavedPresetStore<T> {
    readonly storageKey: string;
    /**
     * The presets `value` holds, in order: entries without an id, a name or a
     * value are dropped, and so is a later one reusing an id or a name.
     */
    normalize(value: unknown): OpenLyricSavedPreset<T>[];
    /** The presets kept; none when storage is missing or unreadable. */
    read(): OpenLyricSavedPreset<T>[];
    /** Keep `presets`; `false` when storage refused them (full, or locked). */
    write(presets: readonly OpenLyricSavedPreset<T>[]): boolean;
    /**
     * `presets` with `value` saved under `name`: in place of the preset already
     * named so (whatever its case), else at the end. `null` for an empty name,
     * or a new one when the list is full. `presets` itself is left alone.
     */
    save(presets: readonly OpenLyricSavedPreset<T>[], name: string, value: unknown, createId?: () => string): {
        presets: OpenLyricSavedPreset<T>[];
        preset: OpenLyricSavedPreset<T>;
    } | null;
    /** The saved preset `value` is, or `undefined`. */
    find(presets: readonly OpenLyricSavedPreset<T>[], value: T): OpenLyricSavedPreset<T> | undefined;
    /**
     * `presets` with the one `id` names called `name`. `null` for an empty
     * name, an id not in the list, or a name another preset already has.
     */
    rename(presets: readonly OpenLyricSavedPreset<T>[], id: string, name: string): {
        presets: OpenLyricSavedPreset<T>[];
        preset: OpenLyricSavedPreset<T>;
    } | null;
    /** `presets` as the text of a presets file, pictures and all. */
    toFile(presets: readonly OpenLyricSavedPreset<T>[]): string;
    /**
     * `presets` with a presets file's added: one named as a preset already is
     * saves over it, the rest go at the end while there is room. `null` when
     * `text` is not a presets file of this store's.
     */
    fromFile(presets: readonly OpenLyricSavedPreset<T>[], text: string, createId?: () => string): {
        presets: OpenLyricSavedPreset<T>[];
        imported: number;
        total: number;
    } | null;
}
/** `value` as a preset name: trimmed, one space between words, capped. */
declare function normalizeOpenLyricPresetName(value: unknown): string;
/**
 * The saved presets kept under `storageKey`. `normalizeValue` makes a whole,
 * valid value of whatever storage held; `isSameValue` says whether two values
 * make the same export (what the list matches the dialog's options against).
 */
declare function createOpenLyricSavedPresetStore<T>({ storageKey, normalizeValue, isSameValue, pictureFields, }: {
    storageKey: string;
    normalizeValue: (value: unknown) => T;
    isSameValue: (a: T, b: T) => boolean;
    /**
     * The value's fields that hold a picture (`data:` URI): kept once in
     * storage however many presets have the same one.
     */
    pictureFields?: readonly string[];
}): OpenLyricSavedPresetStore<T>;
/**
 * The preset field: `label`, the list (`builtIns` under **Built-in**, then the
 * reader's own under **My presets**, then a disabled **Custom**), **Save
 * preset**, **Rename** and **Delete**, the name row Save preset and Rename
 * open, **Export presets** / **Import presets**, and a status line. Mount it
 * with `mountOpenLyricPresetControls`.
 */
declare function openLyricPresetFieldMarkup({ uid, label, builtIns, }: {
    uid: string;
    label: string;
    builtIns: ReadonlyArray<readonly [value: string, label: string]>;
}): string;
interface OpenLyricPresetControlsOptions<T> {
    store: OpenLyricSavedPresetStore<T>;
    /** The dialog's options as they stand. */
    getValue: () => T;
    /** The built-in preset `value` is, or `'custom'`. */
    matchBuiltIn: (value: T) => string;
    /** A built-in preset was picked from the list. */
    onBuiltIn: (name: string) => void;
    /** A preset of the reader's own was picked: everything it holds. */
    onSaved: (value: T) => void;
    /** What Export presets names its file. */
    exportFileName?: string;
    /** Hands the exported file on; a download by default. */
    download?: (blob: Blob, fileName: string) => void;
}
interface OpenLyricPresetControls {
    /** Show the preset the dialog's options are now, after they changed. */
    sync(): void;
}
/**
 * Wire the field `openLyricPresetFieldMarkup` drew. The saved presets are read
 * once, here, and written back on every save and delete.
 */
declare function mountOpenLyricPresetControls<T>(field: HTMLElement, { store, getValue, matchBuiltIn, onBuiltIn, onSaved, exportFileName, download, }: OpenLyricPresetControlsOptions<T>): OpenLyricPresetControls;
export { createOpenLyricSavedPresetStore, OPEN_LYRIC_PRESETS_FILE_TYPE, mountOpenLyricPresetControls, normalizeOpenLyricPresetName, openLyricPresetFieldMarkup, OPEN_LYRIC_MAX_SAVED_PRESETS, OPEN_LYRIC_PRESET_NAME_MAX_LENGTH, };
export type { OpenLyricPresetControls, OpenLyricPresetControlsOptions, OpenLyricSavedPreset, OpenLyricSavedPresetStore, };

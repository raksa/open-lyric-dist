/**
 * The subset of a standalone `Editor` this readout reads. Structural on
 * purpose: passing the component keeps `selection-stats.ts` out of the
 * component's import graph (and out of every bundle that never installs it).
 */
interface EditorSelectionStatsEditorLike {
    container: HTMLElement | null;
    surfaceKind: string;
    activeTextarea: HTMLTextAreaElement | null;
    monacoEditor: any;
    getValue(): string;
    on(event: any, handler: () => void): () => void;
}
interface EditorSelectionStatsOptions {
    /**
     * Read counts from this standalone `Editor` instead of the app shell's
     * surface state. Pass it on a page that mounts an `Editor` of its own
     * (`ol-lyric-editor.html`); omit it on the app pages, where the readout
     * follows whichever surface the shell is editing through.
     */
    editor?: EditorSelectionStatsEditorLike;
    /** Mount target override; defaults to the source's editor panel body. */
    container?: HTMLElement | null;
}
/**
 * Install the live "words / characters" readout on an editor surface.
 *
 * Every piece of per-install state lives in this closure, so a page may
 * install one readout per editor it shows (the app shell's editor panel, plus
 * any standalone `Editor` embeds). Returns its teardown; it also runs on
 * `pagehide`.
 */
declare function installEditorSelectionStats(options?: EditorSelectionStatsOptions): () => void;
export { installEditorSelectionStats };
export type { EditorSelectionStatsOptions };

/**
 * Export actions: what a host adds to the export dialogs beside Download — a
 * "Save to Documents" that files the deck in the host's own list, an "Open in
 * PowerPoint", anything that wants the finished file rather than a download.
 *
 * A host registers one on a preview component (`addExportAction`). The
 * Presentation and image options dialogs then show it as a button after
 * Download (an action for the HTML slide show, after Download as HTML; one
 * for the Word document, as a menu item after the standalone Markdown
 * preview's Download as Docx).
 * Choosing it builds exactly the file Download would, from the same
 * choices, and hands it to the action's `run` instead of downloading it; the
 * export's progress line reports how that went. The dialogs and the export
 * code read the list when a dialog opens, so an action added or removed later
 * shows from the next dialog on.
 */
/**
 * Which file an action takes: `'powerpoint'` the `.pptx` and `'image'` the
 * picture, each from its dialog; `'html'` the slide show page the
 * Presentation options dialog writes with **Download as HTML**; `'docx'` the
 * Word document the standalone Markdown preview's **Download as Docx** writes.
 */
type OpenLyricExportKind = 'powerpoint' | 'image' | 'html' | 'docx';
/** The finished file an export action receives. */
interface OpenLyricExportFile {
    kind: OpenLyricExportKind;
    /** The file's bytes, carrying its media type. */
    blob: Blob;
    /**
     * The name Download would have saved it under (`Song.pptx`, `Song.jpg`,
     * `Song.html`, `Song-markdown-preview.docx`).
     */
    fileName: string;
    /**
     * `blob.type`: the `.pptx` media type, `image/jpeg`, `image/png`,
     * `text/html;charset=utf-8` or the `.docx` media type.
     */
    mimeType: string;
}
/** A button a host adds to the export dialogs, after Download. */
interface OpenLyricExportAction {
    /** Unique per component; adding another with the same id replaces it. */
    id: string;
    /**
     * The button's text, in the host's language: shown as given, never passed
     * through the preview's label localizer. A function is asked each time a
     * dialog opens, so a host whose language changes stays current.
     */
    label: string | (() => string);
    /** The button's tooltip. */
    title?: string | (() => string);
    /**
     * The files it takes. Omit for the `.pptx` and the picture; the HTML slide
     * show and the Word document only when listed (`['powerpoint', 'html']`,
     * `['docx']`). Each kind gets its own
     * button — one listing both shows twice in the Presentation options
     * dialog, after Download and after Download as HTML — so give it a label
     * that says which file it is.
     */
    kinds?: readonly OpenLyricExportKind[];
    /**
     * Do what the button says with the file. A returned (or resolved) string is
     * shown as the finished status ("Saved to Documents"); otherwise the status
     * reads "Done". A throw (or rejection) is reported as "Export failed".
     */
    run(file: OpenLyricExportFile): unknown;
}
/** What a dialog draws for one action: its id, text and tooltip, resolved. */
interface OpenLyricExportDialogAction {
    id: string;
    label: string;
    title?: string;
}
/** The finished status when an action returns no text of its own. */
declare const OPEN_LYRIC_EXPORT_ACTION_DONE_LABEL = "Done";
/** The status when an action throws. */
declare const OPEN_LYRIC_EXPORT_ACTION_FAILED_LABEL = "Export failed";
/** A component's export actions, in the order they were first added. */
declare class OpenLyricExportActionList {
    private readonly actions;
    /**
     * Add `action`, or replace the one with its id. Returns a function that
     * removes it again — and only it: once replaced, the old remover does
     * nothing.
     */
    add(action: OpenLyricExportAction): () => void;
    remove(id: string): void;
    /**
     * The actions for one kind of file, or every action. One without `kinds`
     * takes the `.pptx` and the picture, never the HTML page or the Word
     * document.
     */
    list(kind?: OpenLyricExportKind): OpenLyricExportAction[];
}
/**
 * The buttons a dialog draws for `actions`: labels and tooltips resolved now,
 * an action left out while its label is empty.
 */
declare function toOpenLyricExportDialogActions(actions: readonly OpenLyricExportAction[] | null | undefined): OpenLyricExportDialogAction[];
/**
 * Put a button for each of `actions` after `download`, in order, calling
 * `onChoose(id)` when one is clicked. They look like Download — each finishes
 * the dialog the way Download does — and carry the host's text as given
 * (`data-ol-no-translate`).
 */
declare function appendOpenLyricExportActionButtons(download: HTMLElement, actions: readonly OpenLyricExportDialogAction[] | null | undefined, onChoose: (id: string) => void): void;
/**
 * Hand `file` to `action` and say how it went through `report`, which the
 * export's progress line shows: busy while it runs, then its own finished
 * text (or "Done"), or "Export failed". Never throws; resolves `true` once the
 * action has finished without error.
 */
declare function deliverOpenLyricExportToAction(action: OpenLyricExportAction, file: Omit<OpenLyricExportFile, 'mimeType'> & {
    mimeType?: string;
}, report: (label: string, state: 'busy' | 'complete' | 'error') => void): Promise<boolean>;
/** The action a dialog resolved with, out of the list it was opened with. */
declare function findOpenLyricExportAction(actions: readonly OpenLyricExportAction[], id: string | undefined): OpenLyricExportAction | undefined;
export { appendOpenLyricExportActionButtons, deliverOpenLyricExportToAction, findOpenLyricExportAction, OPEN_LYRIC_EXPORT_ACTION_DONE_LABEL, OPEN_LYRIC_EXPORT_ACTION_FAILED_LABEL, OpenLyricExportActionList, toOpenLyricExportDialogActions, };
export type { OpenLyricExportAction, OpenLyricExportDialogAction, OpenLyricExportFile, OpenLyricExportKind, };

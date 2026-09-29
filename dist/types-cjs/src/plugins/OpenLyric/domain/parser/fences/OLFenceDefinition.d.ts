declare function formatDeclaredPartName(header: any, indexText?: string): any;
/**
 * How many source lines sit between the fence's opening and closing lines.
 *
 * Deliberately *not* {@link OLFenceDefinition.getPreviewLines}: that drops
 * comment lines, and a line range written back into the document has to count
 * every line the source actually has. A non-empty body always ends in the
 * newline before the closing fence, so that terminator is not a line of its
 * own — but a body of a single blank line is one line, which is why the
 * empty-string check comes first.
 */
declare function countFenceBodySourceLines(body: any): number;
/**
 * The rename glyph beside a section card's title
 * (`ol-preview-fence__rename`) — a luggage-tag outline.
 *
 * Deliberately *not* {@link PREVIEW_EDIT_ICON_SVG}: the same header already
 * carries a pencil for "edit this section's lyrics", and two identical pencils
 * a few centimetres apart is exactly the ambiguity a reader who never opens the
 * text panel cannot resolve.
 */
declare const PREVIEW_RENAME_ICON_SVG = "<svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M2 2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 2zm0 1h4.586l7 7-4.586 4.586-7-7zm2.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m0 1a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1\"/></svg>";
/**
 * The bin glyph in a section card header (`ol-preview-fence__delete`).
 *
 * Icon-only like its neighbours, and last in the header: a destructive control
 * a reader can reach by mistake is worse than one they have to aim at.
 */
declare const PREVIEW_DELETE_ICON_SVG = "<svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.5 1a.5.5 0 0 0-.5.5V2H2.5a.5.5 0 0 0 0 1H3v10.5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5V3h.5a.5.5 0 0 0 0-1H10v-.5a.5.5 0 0 0-.5-.5zM7 2h2v-.5H7zM4 3h8v10.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm2 2a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6A.5.5 0 0 1 6 5m4 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6A.5.5 0 0 1 10 5\"/></svg>";
/** The pencil in a section card header (`ol-preview-fence__edit`). */
declare const PREVIEW_EDIT_ICON_SVG = "<svg viewBox=\"0 0 16 16\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325\"/></svg>";
declare class OLFenceDefinition {
    constructor({ className, header, kind, description, tokenState, allowsNumbering, required, links, allowDuplicateDeclarations, }: {
        className: any;
        header: any;
        kind: any;
        description: any;
        tokenState: any;
        allowsNumbering?: boolean | undefined;
        required?: boolean | undefined;
        links?: never[] | undefined;
        allowDuplicateDeclarations?: boolean | undefined;
    });
    createHeaderInfo(indexText?: string): {
        definition: OLFenceDefinition;
        className: any;
        header: any;
        label: any;
        kind: any;
        indexText: string;
        partName: any;
    };
    parseHeader(info: any): {
        definition: OLFenceDefinition;
        className: any;
        header: any;
        label: any;
        kind: any;
        indexText: string;
        partName: any;
    } | null;
    getTokenizerRootRule(): any[];
    getTokenizerStateRules(context: any): any;
    getSnippetHeaders(): any[];
    getSnippetDefinitions(): {
        definition: OLFenceDefinition;
        header: any;
        documentation: any;
    }[];
    getSnippetBodyLines(): string[];
    allowsDuplicateDeclaredPart(): any;
    getLinkedFenceHeaders(): any;
    getLinkedFences(registry: any): any;
    getPreviewTitle(parsedHeader: any): any;
    getPreviewLines(body: any): string[];
    renderPreviewBody(context: any): any;
    renderPreview(context: any): string;
    /**
     * Whether this section's body can be edited as raw notation from the
     * preview. `Config` says no: it renders one purpose-built control per field
     * already, and a second, free-text way to rewrite the same lines would put
     * two editors on one source range.
     */
    isPreviewBodyEditable(): boolean;
    /**
     * How the section editor's chord picker writes a chord into this body.
     *
     * - `annotation` — `[G]` before the syllable (lyric and free-text bodies).
     * - `progression` — a bare, space-separated `G` (a body that is one chord
     *   progression, where a bracket would be an invalid token).
     * - `mixed` — decided per line: bare on a line that already reads as a
     *   progression (a `|` beside a chord, or a `{c:}`/`{p:}` cue), `[G]`
     *   everywhere else.
     */
    getPreviewChordInsertStyle(): string;
    /**
     * The pencil at the right end of the section card header — the entry point
     * for editing this section's lyrics without opening the text panel.
     *
     * It carries the body's own source line range rather than a DOM hook, so the
     * controller seeds its editor from the document and writes back to the same
     * lines. `data-preview-body-end-line` is one *below* the start line when the
     * body is empty, which the write-back reads as "insert here".
     */
    renderPreviewEditAction(context: any): string;
    /**
     * Whether this section's ```` ```ol:… ```` header can be renamed from the
     * preview. Follows {@link isPreviewBodyEditable} by default, so `Config` —
     * which cannot be numbered or suffixed at all — never grows a rename
     * control.
     */
    isPreviewTitleEditable(): boolean;
    /**
     * The rename control beside a section card's title — how `Verse 1` becomes
     * `Verse 3` without opening the text panel.
     *
     * Only the header's own source line number travels on it, plus the part name
     * the card was rendered from. The write-back
     * (`preview/controller/section-naming.ts`) re-reads that line and checks it
     * still declares this part before replacing it, so a control left behind by
     * stale markup renames nothing.
     */
    renderPreviewRenameAction(context: any): string;
    /**
     * Whether this section can be deleted from the preview. Follows
     * {@link isPreviewBodyEditable}, so `Config` — which every song must have —
     * never grows a bin.
     */
    isPreviewSectionDeletable(): boolean;
    /**
     * The bin at the end of a section card header.
     *
     * It carries the fence's *whole* source range — its opening line through its
     * closing line — because deleting is the one edit that consumes the header
     * too. The body line count is the same count
     * {@link renderPreviewEditAction} uses, plus one for the closing fence.
     *
     * The part name rides along so the write-back can re-read the header line and
     * check it still declares this section before removing anything, the same
     * stale-markup guard the rename uses.
     */
    renderPreviewDeleteAction(context: any): string;
    /**
     * Markup this fence contributes *after* its own card, in the gap before the
     * next one. Empty for every section; `Config` uses it for the "Add Lyric"
     * control, which is why the hook exists rather than a central switch in the
     * panel renderer.
     */
    renderPreviewAfterCard(): string;
    /**
     * Markup the markdown preview shows for a document with nothing in it.
     * Empty for every section; `Config` — the one required part — uses it for
     * the "Start a new song" control (`renderOpenLyricEmptyDocumentHtml`).
     */
    renderPreviewEmptyDocument(_context?: any): string;
    validateBody(): void;
}
export { OLFenceDefinition, PREVIEW_DELETE_ICON_SVG, PREVIEW_EDIT_ICON_SVG, PREVIEW_RENAME_ICON_SVG, countFenceBodySourceLines, formatDeclaredPartName, };

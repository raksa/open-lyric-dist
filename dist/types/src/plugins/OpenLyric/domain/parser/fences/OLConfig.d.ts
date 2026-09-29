import { OLFenceDefinition } from './OLFenceDefinition.js';
declare class OLConfig extends OLFenceDefinition {
    constructor();
    /**
     * `Config` keeps its per-field controls as the only way to edit it from the
     * preview — see {@link OLFenceDefinition.isPreviewBodyEditable}.
     */
    isPreviewBodyEditable(): boolean;
    /**
     * The "Add Lyric" control, in the gap between the `Config` card and the
     * first section card.
     *
     * It sits here — rather than at the end of the sections, or in a panel
     * toolbar — because that gap is where a reader looks once the song's details
     * are filled in and the next thing to do is write a verse. It carries no
     * source position: the section it adds goes after the *last* fence in the
     * document, which only the controller can work out, and only at the moment
     * of the click.
     *
     * Rendered on every markdown-preview surface and revealed by CSS only where
     * the panel advertises a document to write back to, the same rule the
     * section pencils follow.
     */
    renderPreviewAfterCard(context: any): string;
    /**
     * What the markdown preview shows for a document with nothing in it: one
     * card with a single "Start a new song" control.
     *
     * `Config` owns it because the song it starts is, first of all, a `Config`
     * fence — the one part the language requires. Like "Add Lyric" it carries no
     * source position (there is nothing to point at yet) and is revealed by CSS
     * only where the panel advertises a document to write back to, so a
     * standalone preview embed keeps rendering a blank document as blank.
     */
    renderPreviewEmptyDocument(context: any): string;
    /**
     * The `Config` body "Start a new song" writes.
     *
     * Only the required fields, each with a value — an empty single-line field
     * is itself a diagnostic ("<Field> must provide a value on the same line"),
     * and a preview-only reader could not see it. The optional fields stay out
     * rather than arrive empty; the Config card's add-field menu brings them in.
     *
     * `Structure` is required too and must name a declared part, so it names
     * {@link getStarterSectionPartName} — the controller writes that section
     * alongside, and the pair validates clean as written.
     */
    getStarterBodyLines(): string[];
    /** The section a started song opens with; the `V1` in its `Structure`. */
    getStarterSectionPartName(): string;
    getSnippetBodyLines(): string[];
    validateBody(context: any): void;
    renderPreviewBody(context: any): any;
}
export { OLConfig };

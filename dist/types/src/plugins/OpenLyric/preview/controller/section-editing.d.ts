/**
 * In-preview editing of a section's lyric text.
 *
 * The pencil in each section card header (`ol-preview-fence__edit`, rendered by
 * `OLFenceDefinition.renderPreviewEditAction`) swaps that card's rendered body
 * for a textarea holding the section's *source* lines. Save writes those lines
 * back over the same source range through `replaceDocumentLineRange`, and the
 * panel re-renders from the new document text — the preview never keeps a DOM
 * mutation of its own, so the two panels and Monaco's undo stack stay in step.
 *
 * One textarea per section rather than one control per line is deliberate:
 * editing a line, adding one and removing one are then the same gesture, and
 * the panel only re-renders once, on Save — so no caret is lost mid-word.
 *
 * Markdown panel only. The lyric/presentation panel shares these delegated
 * listeners, so every lookup here is scoped to `refs.preview`.
 */
declare const SECTION_EDITOR_HINT_TEXT = "One line per lyric line. Use \"Insert chord\" to add a chord at the cursor, or type it in square brackets, like [G].";
declare function applyPreviewControllerSectionEditingMethods(PreviewControllerClass: any): void;
export { SECTION_EDITOR_HINT_TEXT, applyPreviewControllerSectionEditingMethods, };

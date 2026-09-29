/**
 * Undo / Redo on the markdown preview panel.
 *
 * The editor panel's toolbar already has both, but a reader who works only in
 * the preview never sees that toolbar — and the in-preview gestures (delete a
 * section, rename one, save a verse) are exactly the ones they will want to
 * take back. These buttons sit in the panel's own floating tool row and walk
 * the **document's** history through `undoDocumentEdit`/`redoDocumentEdit`
 * (`editor/scripts/shared.ts`): Monaco's model history where Monaco is live —
 * the same stack the toolbar and Ctrl+Z in the text panel walk — and the
 * snapshot pairs the in-preview writes record everywhere else. An undo is a
 * text edit like any other, so the panel re-renders from the restored text.
 *
 * Markdown panel only: the controls are markup in `#previewPanel`, and the
 * keyboard shortcut is bound on that panel, so the lyric/presentation panel
 * grows neither.
 */
declare const PREVIEW_HISTORY_OPEN_EDITOR_MESSAGE = "Save or cancel the open edit before using Undo or Redo.";
/**
 * Which history command a keydown asks for, if any — Ctrl/Cmd+Z undo,
 * Ctrl/Cmd+Shift+Z or Ctrl+Y redo, matching the text panel's bindings.
 */
declare function getPreviewHistoryShortcutCommand(event: any): "undo" | "redo" | null;
declare function applyPreviewControllerHistoryMethods(PreviewControllerClass: any): void;
export { applyPreviewControllerHistoryMethods, getPreviewHistoryShortcutCommand, PREVIEW_HISTORY_OPEN_EDITOR_MESSAGE, };

/**
 * Install the shared markdown preview panel (`#previewPanel`) into the
 * page's `<template id="previewPanelMount">` placeholder — the same pattern
 * as {@link installEditorPanelMarkup} and the OpenLyric lyric panel.
 *
 * The DOCX export pieces (file-name override field + Download-as-Docx
 * action) are opt-in: only the editor-only entry (`main-editor.ts`)
 * composes them. The app consumes them through null-guarded `refs`, so
 * their presence in the DOM before the app boots is exactly what enables
 * the feature per page.
 *
 * The owning surface class exposes this as
 * `OpenLyricMarkdownManager.installShellMarkup()`, which the page entries
 * call before composing and booting the app (the static also refreshes
 * the app's captured element refs).
 */
declare function installPreviewPanelMarkup({ includeDocxExport }?: {
    includeDocxExport?: boolean | undefined;
}): void;
export { installPreviewPanelMarkup };

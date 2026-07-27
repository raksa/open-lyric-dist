/**
 * Install the shared editor panel (`#editorPanel`) into the page's
 * `<template id="editorPanelMount">` placeholder. Both shells
 * (`open-lyric.html`, `editor.html`) render the SAME panel from this one
 * fragment — mirroring how the OpenLyric plugin mounts its lyric panel from
 * `plugins/OpenLyric/html/panel.html`.
 *
 * Page-specific pieces are NOT part of the common fragment:
 * - the chord-bars action is OpenLyric shell markup
 *   (`plugins/OpenLyric/html/editor-actions.html`, installed by
 *   `OpenLyric.installShellMarkup()` into `#openLyricEditorActionsMount`
 *   — full page only);
 * - the selection-stats readout is created by `scripts/selection-stats.ts`
 *   itself (editor-only page).
 *
 * The owning surface class exposes this as `Editor.installShellMarkup()`,
 * which the page entries (`main-open-lyric.ts`, `main-editor.ts`) call
 * before composing and booting the app (the static also refreshes the
 * app's captured element refs). Install order on the full page: editor
 * panel first, then the OpenLyric shell markup — its actions mount lives
 * inside this panel.
 */
declare function installEditorPanelMarkup(): void;
export { installEditorPanelMarkup };

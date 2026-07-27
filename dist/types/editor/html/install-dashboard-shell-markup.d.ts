/**
 * The handle the app resolves its shell root by (`refs.app` — the element
 * that carries `app-booting` / `app-ready`). It is stamped on at install time
 * rather than baked into `dashboard-shell.html` so the fragment stays free of
 * *any* identifying attribute: the file describes structure, the installer
 * assigns identity. The scope class stays in the markup — `display: none`
 * until `.app-ready` hangs off it, so it has to match from the first paint.
 */
declare const DASHBOARD_SHELL_ROOT_REF = "app";
/**
 * Install the dashboard shell (the topbar, `#shell` with the three panel
 * mounts, and every app-level dialog) from the shared `?raw` fragment, the
 * same pattern as
 * {@link installEditorPanelMarkup} and {@link installPreviewPanelMarkup}.
 *
 * Two install targets, in order:
 * 1. a `<template data-ol-mount="dashboardShell">` placeholder anywhere in
 *    the document — every app page (`open-lyric.html`, `editor.html`,
 *    `ol-dashboard.html`) ships exactly that and nothing else, so this
 *    fragment is the single source for all three shells;
 * 2. otherwise `container` — a bare host element the fragment is appended
 *    to, which is how an embed with no Open Lyric markup of its own gets a
 *    shell.
 *
 * Skipped wholesale when the shell root already exists, so a host that
 * inlines a shell of its own is untouched and a double install is a no-op.
 *
 * The owning surface class exposes this as
 * `OpenLyricDashboard.installShellMarkup()`. Because the per-panel mounts
 * (`data-ol-mount="editorPanel"`, `"previewPanel"`, `"builtInPluginPanel"`)
 * live *inside* this fragment, it must run BEFORE the panel installs —
 * `OpenLyricDashboard.mount()` also runs it as a safety net, but by then a
 * page entry's `Editor.installShellMarkup()` would already have found no
 * mount to replace.
 *
 * The Parse-from-Raw-Text pieces are opt-in via `includeRawTextImport` (see
 * {@link installRawTextImportMarkup}).
 *
 * @returns whether anything was inserted — the caller refreshes the app's
 * captured element refs only then, so mounting onto a page that already has
 * its shell stays free of ref side effects.
 */
declare function installDashboardShellMarkup({ container, includeRawTextImport, }?: {
    container?: HTMLElement | null;
    includeRawTextImport?: boolean;
}): boolean;
export { DASHBOARD_SHELL_ROOT_REF, installDashboardShellMarkup };

/**
 * Stamp the resolved theme (stored preference → legacy key → system → dark)
 * onto `<html>` before the app boots. Formerly an inline `<head>` script on
 * both pages; it now runs as the page entries' FIRST statement, so the
 * static markup's dark default is only visible while the entry module
 * loads. The app's `ThemeController` re-resolves the same preference and
 * binds the system/UI listeners during boot; this only covers the pre-boot
 * window.
 */
declare function initializePageTheme(): void;
/**
 * The page-environment shims shared by both page entries
 * (`editor/main-open-lyric.ts`, `editor/main-editor.ts`): a
 * `navigator.clipboard.write` compatibility shim for browsers that only
 * implement `writeText`, the plain-text copy interceptor, the mobile
 * viewport-zoom lock, and the mobile Eruda console (`?debug=true`).
 * Component composition stays in the page entries — this is the browser
 * environment noise around it.
 */
declare function preparePageEnvironment(): void;
export { initializePageTheme, preparePageEnvironment };

/**
 * The app-page shell stylesheets, installed by the surface classes'
 * `installShellStyle()` statics the same way `installShellMarkup()` installs
 * the shell markup: the class that owns a piece of chrome is what puts its
 * CSS on the page, so the HTML pages ship no `<link rel="stylesheet">` of
 * their own (they carry only a splash and the `dashboardShell` mount).
 *
 * Every sheet is a `<link>` (not inlined CSS) via the same reasoning as
 * `font-styles.ts`: the compiled sheets stay cacheable stylesheet requests
 * and out of the JS bundle, and each injection is keyed by element id so any
 * number of surface classes can ask for the same sheet and share one node.
 *
 * **Order is load-bearing.** The sheets cascade at equal specificity in
 * places — `responsive.scss`'s narrow-viewport rules override `shell.scss`
 * and `preview.scss` selectors purely by document order — so the canonical
 * sequence below (theme → shell → preview → dialogs → responsive, exactly the
 * order the pages used to link) must survive whatever order the classes
 * install in. `injectShellStylesheets` therefore never plain-appends: a sheet
 * is inserted before the first already-present sheet that follows it in the
 * canonical list.
 */
type ShellStylesheetKey = 'theme' | 'shell' | 'preview' | 'dialogs' | 'responsive';
/** Head markers for the shell stylesheet links, keyed by sheet. */
export declare const SHELL_STYLE_ELEMENT_IDS: Readonly<Record<ShellStylesheetKey, string>>;
/**
 * The dashboard shell's sheets: the page-level theme tokens + loading splash
 * (`theme.scss`), the shell chrome for all four scopes (`shell.scss`), the
 * app-level dialogs (`dialogs.scss`), and the narrow-viewport overrides
 * (`responsive.scss`). `OpenLyricDashboard.installShellStyle()`.
 */
export declare function ensureDashboardShellStylesInjected(): void;
/**
 * The editor panel's sheets — its chrome lives in `shell.scss` (with the
 * theme tokens it consumes and the responsive overrides that reflow it).
 * `Editor.installShellStyle()`; the Latin font faces come separately via
 * `ensureFontFacesInjected`.
 */
export declare function ensureEditorShellStylesInjected(): void;
/**
 * A preview panel's sheets: the shared shell/panel chrome plus the render
 * styles (`preview.scss` — the markdown render root, the Open Lyric song
 * view, and the Monaco popup sizing). `OpenLyric.installShellStyle()` and
 * `OpenLyricMarkdownManager.installShellStyle()`.
 */
export declare function ensurePreviewShellStylesInjected(): void;
export {};

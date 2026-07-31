import { OpenLyricPreviewComponent } from './internal/OpenLyricPreviewComponent.js';
import type { OpenLyricPreviewOptions, OpenLyricSurface } from './internal/types.js';
export interface OpenLyricMarkdownOptions extends OpenLyricPreviewOptions {
    /**
     * Hide the preview's floating controls — the settings gear and the `⋮` menu
     * (Download as Image, Print, Go to Markdown Doc). A standalone (non-adopt)
     * embed always renders the preview panel chrome — floating tools plus the
     * export-progress bar; this only hides the interactive controls, which show
     * by default. On an adopt-mode embed it hides the settings gear the host's
     * panel mount asked for (the host owns everything else there). Toggle later
     * via the `isControlHidden` accessor.
     */
    isControlHidden?: boolean;
}
export interface OpenLyricMarkdownInfo {
    /** Best-effort document title (OL Config title, first heading, or line). */
    title: string;
    /** Filename-safe base derived from the title, for exports. */
    exportBaseName: string;
}
/**
 * `OpenLyricMarkdownManager` — the standalone markdown preview (`gmp`).
 *
 * Behaves almost identically to {@link OpenLyric}: it renders the mixed
 * markdown + `ol:` fence document, is fully standalone, and can bridge to an
 * editor for double-click → caret jumps. Backed by the pure
 * `renderMarkdownPreview` in `editor/scripts/preview.ts`.
 *
 * A standalone (non-adopt) embed also builds the markdown preview panel's own
 * chrome around itself — the settings popup (font size + font-family override +
 * Reset), the floating actions (`⋮`) menu with Download as Image, Print, and Go
 * to Markdown Doc, plus the export-progress bar (see
 * `internal/OpenLyricMarkdownStandaloneChrome.ts`); `isControlHidden` hides the
 * controls, `resetPreviewSetting()` is the popup's Reset from code.
 *
 * An adopt-mode embed leaves the panel to its host — except for that settings
 * popup, which it renders into the host's `markdownPreviewSettings` mount when
 * the host ships one (the app pages' panel fragment does), so the popup has one
 * implementation rather than a page-side copy.
 */
export declare class OpenLyricMarkdownManager extends OpenLyricPreviewComponent {
    readonly surface: OpenLyricSurface;
    private controlHiddenValue;
    private standaloneChrome;
    constructor(options?: OpenLyricMarkdownOptions);
    protected handleMount(container: HTMLElement): void;
    protected handleUnmount(): void;
    /**
     * Whether the standalone chrome's floating actions (`⋮`) control is hidden.
     * Only affects a standalone (non-adopt) embed; a no-op where the host owns
     * the chrome.
     */
    get isControlHidden(): boolean;
    set isControlHidden(next: boolean);
    /**
     * Restore the preview settings to their defaults — the programmatic
     * equivalent of the standalone chrome's "Reset" button, and the markdown
     * counterpart of {@link OpenLyric.resetPreviewSetting}. This surface has no
     * chord controls, so the settings are the typography ones: the font size
     * returns to the preview default and the font-family override clears. On a
     * standalone embed the settings popup drives the reset (so its controls and
     * persisted typography reset too); where the host owns the chrome, this
     * clears the component's own font overrides.
     */
    resetPreviewSetting(): void;
    /**
     * Install the page-shell markdown preview panel markup (`#previewPanel`)
     * into the page's `<template id="previewPanelMount">` placeholder — the
     * markdown preview surface owns its shell panel. The page entries
     * (`main-open-lyric.ts`, `main-editor.ts`) call this before composing
     * and booting the app; the app's captured element refs refresh
     * afterwards. The DOCX export pieces are opt-in (only the editor-only
     * entry composes them). Idempotent, and a no-op on pages without the
     * mount.
     */
    static installShellMarkup(options?: {
        includeDocxExport?: boolean;
    }): void;
    /**
     * Link the app-page stylesheets the markdown panel needs — the theme
     * tokens, the shared panel chrome in `shell.scss`, the preview render
     * sheet (`preview.scss`, which carries the markdown render root and the
     * Monaco popup sizing), and the narrow-viewport overrides — into
     * `document.head`, the CSS counterpart of {@link installShellMarkup}.
     * Shared, idempotent, canonical cascade order (see
     * `internal/shell-styles.ts`); page entries call one `installShellStyle()`
     * per composed surface class, so the HTML pages ship no
     * `<link rel="stylesheet">` of their own. A standalone (non-adopt) embed
     * needs none of this — it injects its own scoped sheets on construction
     * instead.
     */
    static installShellStyle(): void;
    /** Whole-document rendered HTML string. */
    getRenderedHtml(): string;
    /** Image sources referenced by the rendered markdown. */
    getImageList(): string[];
    /** Document metadata (title / export base name). */
    getInfo(): OpenLyricMarkdownInfo;
    protected rootClassName(): string;
    protected renderMarkup(value: string, options: Record<string, unknown>): string;
    private deriveTitle;
}

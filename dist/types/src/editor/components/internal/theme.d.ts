import type { OpenLyricTheme, OpenLyricThemeBase } from './types.js';
/**
 * The `--ol-*` theming contract from the redesign doc: `theme` picks a preset,
 * and every visual the components own is consumed through a CSS custom
 * property with the preset value as fallback. A host overrides per-embed by
 * setting `--ol-bg` / `--ol-fg` / `--ol-accent` / `--ol-chord-color` /
 * `--ol-font-family` / `--ol-font-size` on the container (or any ancestor) —
 * no stylesheet forking, no `!important`.
 *
 * Four presets, two per base: the original `light`/`dark` pair, plus a
 * `light-bs`/`dark-bs` pair painted in Bootstrap's own palette for pages that
 * already ship `bootstrap.min.css`. The `-bs` themes are not modifiers on the
 * first two — each is a complete palette with its own SCSS token block
 * (`styles/_theme-tokens.scss`), Monaco theme (`scripts/monaco-theme.ts`) and
 * song-view palette (`plugins/OpenLyric/preview/_theme-variants.scss`).
 */
export interface OpenLyricThemePreset {
    bg: string;
    fg: string;
    accent: string;
    chordColor: string;
}
/** Every theme, in the order the app's picker lists them. */
export declare const OPEN_LYRIC_THEMES: readonly ["light", "dark", "light-bs", "dark-bs"];
/** Human labels for the picker, so the app and the embeds agree on naming. */
export declare const OPEN_LYRIC_THEME_LABELS: Record<OpenLyricTheme, string>;
export declare const OPEN_LYRIC_THEME_PRESETS: Record<OpenLyricTheme, OpenLyricThemePreset>;
/** Narrow an unknown value to a supported theme without throwing. */
export declare function isOpenLyricTheme(theme: unknown): theme is OpenLyricTheme;
/**
 * Reject any theme that is not one of the four supported presets. The static
 * type already constrains TS callers, but the standalone component API is
 * driven from plain JS on the `ol-*-preview` pages, so a runtime guard is what
 * actually stops a typo like `theme: 'lite'` from silently rendering as dark.
 */
export declare function assertOpenLyricTheme(theme: unknown): asserts theme is OpenLyricTheme;
/**
 * The light/dark half of a theme.
 *
 * Everything that only understands two values keys off this rather than off
 * the theme name: `color-scheme`, Bootstrap's own `data-bs-theme` (which knows
 * `light`/`dark` and nothing else), and Monaco's `vs`/`vs-dark` base.
 */
export declare function getOpenLyricThemeBase(theme: OpenLyricTheme): OpenLyricThemeBase;
/** Whether a theme paints in Bootstrap's palette rather than the native one. */
export declare function isBootstrapTheme(theme: OpenLyricTheme): boolean;
/**
 * The opaque panel surface of each theme — the SCSS `--surface` token, as a
 * literal.
 *
 * Exports need a real colour, not a variable: a raster or a PowerPoint slide
 * has nothing to resolve `var(--surface)` against. Every export path that
 * finds the live surface computed-transparent falls back to this. Keep in step
 * with `--surface` in `styles/_theme-tokens.scss`.
 */
export declare const OPEN_LYRIC_THEME_SURFACES: Record<OpenLyricTheme, string>;
/** {@link OPEN_LYRIC_THEME_SURFACES}, tolerant of an unknown/absent theme. */
export declare function getOpenLyricThemeSurface(theme: unknown): string;
/**
 * Style a component-owned root so it reads only `--ol-*` variables, falling
 * back to the active preset. Inline on the owned root (never the host's
 * container), so teardown stays complete and host variables still win.
 */
export declare function applyThemeSurfaceStyles(root: HTMLElement, theme: OpenLyricTheme): void;

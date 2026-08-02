import type { OpenLyricTheme } from './types.js';
/**
 * The `--ol-*` theming contract from the redesign doc: `theme` picks a preset,
 * and every visual the components own is consumed through a CSS custom
 * property with the preset value as fallback. A host overrides per-embed by
 * setting `--ol-bg` / `--ol-fg` / `--ol-accent` / `--ol-chord-color` /
 * `--ol-font-family` / `--ol-font-size` on the container (or any ancestor) —
 * no stylesheet forking, no `!important`.
 */
export interface OpenLyricThemePreset {
    bg: string;
    fg: string;
    accent: string;
    chordColor: string;
}
export declare const OPEN_LYRIC_THEME_PRESETS: Record<OpenLyricTheme, OpenLyricThemePreset>;
/**
 * Reject any theme that is not one of the two supported presets. The static
 * type already constrains TS callers, but the standalone component API is
 * driven from plain JS on the `ol-*-preview` pages, so a runtime guard is what
 * actually stops a typo like `theme: 'lite'` from silently rendering as dark.
 */
export declare function assertOpenLyricTheme(theme: unknown): asserts theme is OpenLyricTheme;
/**
 * Style a component-owned root so it reads only `--ol-*` variables, falling
 * back to the active preset. Inline on the owned root (never the host's
 * container), so teardown stays complete and host variables still win.
 */
export declare function applyThemeSurfaceStyles(root: HTMLElement, theme: OpenLyricTheme): void;

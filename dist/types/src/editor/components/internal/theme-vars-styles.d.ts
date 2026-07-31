/**
 * Inject the base theme custom properties (`--surface`, `--accent`,
 * `--heading`, …) into `document.head` exactly once, so a standalone embed —
 * which loads no app stylesheet — still resolves the palette the injected
 * `preview/styles.scss` and the chord popup reference.
 *
 * Only meaningful for a bare embed: the app pages already ship these via
 * `styles/theme.scss`, so the preview components call this in standalone
 * (non-adopt) mode only and never duplicate the app's palette at runtime.
 */
export declare function ensureThemeVarsInjected(): void;

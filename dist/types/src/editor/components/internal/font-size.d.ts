/**
 * The one place the components agree on what a `fontSize` value means.
 *
 * Shared by the previews (`OpenLyricPreviewComponent`, which forwards it to
 * `--ol-font-size`) and `Editor` (which forwards it to Monaco and the
 * textareas), so `16` means the same thing on every surface.
 */
/**
 * A bare number (e.g. `component.fontSize = 12`) is not a valid CSS length on
 * its own, so treat it as pixels — that way the rendered text and the
 * standalone chrome's font-size control agree on what `12` means. Any value
 * that already carries a unit (`16px`, `1.5rem`, `120%`) passes through
 * untouched.
 */
declare function normalizeFontSize(next: unknown): string;
/**
 * The size an element actually renders at, in pixels. Computed `font-size` is
 * always reported in pixels, so this is also how a CSS length in any unit gets
 * resolved: write it onto the element, then read it back here and let the
 * browser do the unit math against the element's real context.
 *
 * Returns 0 when there is nothing to measure, which callers read as "no size".
 */
declare function measureFontSizePx(element: HTMLElement | null): number;
/**
 * The pixel number an API that takes no units needs (Monaco's `fontSize`
 * option) for a CSS length already written onto `probeEl` — 0 when there is no
 * length to resolve.
 */
declare function resolveFontSizePx(value: string, probeEl: HTMLElement | null): number;
export { measureFontSizePx, normalizeFontSize, resolveFontSizePx };

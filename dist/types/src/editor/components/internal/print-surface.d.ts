/**
 * What the page Print writes needs from the surface beyond its markup.
 *
 * Kept apart from `print-page.ts`, which the chromes import only when a host
 * prints through `onPrint`: this one runs on every Print.
 */
/**
 * The `style` attribute that keeps the printed surface in the face the song is
 * drawn in on screen. The face reaches the surface from outside its markup --
 * `--ol-font-family` on the render root (the Font family setting, a song's
 * own), or the host page around it -- and the page Print writes copies the
 * markup only, so the paper fell back to the browser's serif. `''` when there
 * is no surface or no face to carry.
 */
export declare function genPrintSurfaceFontStyleAttribute(renderRoot: Element | null): string;

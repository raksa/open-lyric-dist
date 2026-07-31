/**
 * The app-shipped Latin family, owned in TypeScript rather than in a
 * stylesheet.
 *
 * This replaces the former `styles/font.scss`. The faces are declared from the
 * `?url`-imported font files here, which buys three things a `.scss` file
 * could not:
 *
 * 1. **A real load promise.** {@link loadGoogleSansFontFaces} resolves once the
 *    files are in, so `Editor` can await the family *before* Monaco measures
 *    character widths. A stylesheet gives no such signal: Monaco would measure
 *    against the fallback face and render every column at the wrong offset
 *    until something forced a `remeasureFonts()`.
 * 2. **Absolute `url(…)`.** A stylesheet resolves its `url(…)` against its own
 *    address, which is why the sheet had to stay a `<link>` and why the
 *    print/export windows re-linked it by URL. Absolute URLs are portable, so
 *    the same declarations can be inlined into any document —
 *    {@link buildGoogleSansFontFaceCss} is what the print windows now embed.
 * 3. **One source of truth.** The family name is a constant the editor surface,
 *    the app's initial font wait, and the export paths all import, instead of
 *    the string `editor-GoogleSans` repeated across a stylesheet and three
 *    call sites.
 *
 * The faces are still *declared* as CSS (a `<style>` element, see
 * `components/internal/font-styles.ts`) rather than constructed as `FontFace`
 * objects: the image export collects `@font-face` rules out of
 * `document.styleSheets` (`PreviewController.getOpenLyricFontEmbedCss`, and
 * html-to-image's own `getFontEmbedCSS` does the same), and faces added through
 * `document.fonts.add()` alone appear in no stylesheet at all — a PNG export
 * would silently lose the family. Declaring in CSS and loading through
 * `document.fonts.load()` keeps both halves working off the same rules.
 */
/** The family name every Open Lyric surface asks for by name. */
export declare const GOOGLE_SANS_FONT_FAMILY = "editor-GoogleSans";
/** Latin sample the load probes ask for — the family covers it. */
export declare const GOOGLE_SANS_SAMPLE_TEXT = "Open Lyric";
/**
 * How long a mount waits on the font files before giving up and rendering with
 * the fallback face. Mirrors the app shell's own initial font wait
 * (`OpenLyricEditorApplication.waitForInitialFonts`): a stalled font request
 * must never be what keeps an editor from appearing.
 */
export declare const GOOGLE_SANS_LOAD_TIMEOUT_MS = 2000;
interface GoogleSansFaceSpec {
    /** Bundled file URL (hashed by Vite; module-relative in the package build). */
    url: string;
    weight: number;
    style: 'normal' | 'italic';
}
/** The eight static faces, in the order the stylesheet declared them. */
export declare const GOOGLE_SANS_FACE_SPECS: readonly GoogleSansFaceSpec[];
/**
 * The family's `@font-face` rules as CSS text, with absolute `url(…)`.
 *
 * Built on each call rather than cached: `document.baseURI` is only knowable at
 * runtime, and a print window asks for this once per export.
 */
export declare function buildGoogleSansFontFaceCss(): string;
/**
 * Fetch every face, resolving when they are usable — or when
 * {@link GOOGLE_SANS_LOAD_TIMEOUT_MS} runs out, whichever lands first. Never
 * rejects: a font that fails to load is a fallback face, not a broken editor.
 *
 * The caller declares the rules first ({@link buildGoogleSansFontFaceCss} via
 * `ensureFontFacesInjected`); `document.fonts.load()` matches against declared
 * faces, so probing an undeclared family resolves with no matches.
 *
 * Environments with no `FontFaceSet` (jsdom, SSR) resolve immediately.
 */
export declare function loadGoogleSansFontFaces(): Promise<void>;
export {};

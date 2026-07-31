/** Head marker for the component-declared Latin `@font-face` rules. */
export declare const FONT_FACE_STYLE_ELEMENT_ID = "open-lyric-font-faces";
/**
 * Declare the app-shipped Latin faces — `editor-GoogleSans`, built in
 * `styles/google-sans-font.ts` — into `document.head` exactly once.
 *
 * The components own them, the same way a language plugin owns its own
 * faces: composing a surface is what puts the faces on the page, so no page
 * entry imports a font stylesheet. Both surfaces that render text call this —
 * `Editor` (whose Monaco asks for `editor-GoogleSans` by name, and a host may
 * set the same face through `Editor.fontFamily`) and a standalone preview
 * (which loads no app stylesheet at all, and whose print/export windows embed
 * these same rules). An adopt-mode preview inherits the faces from its host
 * page instead, exactly as it does the theme tokens.
 *
 * A `<style>` rather than a linked stylesheet: the rules are generated with
 * absolute `url(…)`, which removes the one reason `@font-face` had to stay a
 * real stylesheet request (see {@link injectStyleOnce}). The declarations must
 * stay CSS rather than becoming `document.fonts.add()` calls — the image export
 * harvests `@font-face` rules out of `document.styleSheets`, and a
 * script-registered face appears in none of them.
 *
 * Declaring is not loading. This is called at page-entry time
 * (`Editor.installShellMarkup()`) so the browser can start fetching as early as
 * possible; {@link ensureFontFacesLoaded} is what waits for the result.
 */
export declare function ensureFontFacesInjected(): void;
/**
 * Declare the Latin faces and wait for the files, so a surface that measures
 * text (Monaco) is built against the real family rather than the fallback.
 *
 * Resolves either way — bounded by the loader's own timeout, and never
 * rejecting — so a slow or blocked font request costs a fallback face, never
 * the mount.
 */
export declare function ensureFontFacesLoaded(): Promise<void>;

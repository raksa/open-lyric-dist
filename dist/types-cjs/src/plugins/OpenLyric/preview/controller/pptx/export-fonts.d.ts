/**
 * The fonts an exported deck names, and the ones a slide show page carries.
 *
 * **Names.** A web font a plugin ships goes by a name of the page's own
 * (`editor-Battambang`) so it never clashes with a face the computer has
 * installed. Nothing outside the page is called that: a `.pptx` naming it
 * finds no font anywhere. The plugin says what the face is really called
 * (`language.fontNames` / the registry's `fonts.names`), and the deck is
 * written with that name ({@link withOpenLyricExportFontNames}).
 *
 * **Faces.** The HTML slide show is one file, so the fonts its text is set in
 * travel inside it ({@link embedOpenLyricPresentationFonts}): each face the
 * deck's text names, copied from the `@font-face` rule this page loads it
 * with — under the deck's name or the page's own for it — as a `data:` URI.
 * Only the weights the text uses are copied. A face the page cannot read the
 * file of — one the computer has installed, or one another site serves
 * without letting others download it — stays named only.
 */
import type { OpenLyricPresentationData } from './presentation.js';
/** A face's page name → the name it goes by outside the page. */
type OpenLyricFontNames = Readonly<Record<string, string>>;
/** The most font data one page carries; faces past it stay named only. */
declare const OPEN_LYRIC_HTML_FONTS_MAX_BYTES: number;
/** `"Name"` or `'Name'` as `Name`. */
declare function unquoteFontFamily(value: unknown): string;
/** Only `{ page name: real name }` pairs of non-empty strings, both trimmed. */
declare function normalizeOpenLyricFontNames(value: unknown): Record<string, string>;
/** Every table in `tables` as one; the first to name a face wins. */
declare function mergeOpenLyricFontNames(tables: readonly unknown[]): Record<string, string>;
/** The name `face` goes by outside the page: its entry in `names`, else itself. */
declare function toOpenLyricExportFontName(face: unknown, names?: OpenLyricFontNames): string;
/** `typography` with its faces under the names they go by outside the page. */
declare function withOpenLyricExportFontNames<T extends {
    chromeFontFace: string;
    lyricFontFace: string;
}>(typography: T, names?: OpenLyricFontNames): T;
/** One `@font-face` rule, its file's address resolved. */
interface OpenLyricFontFaceRule {
    family: string;
    /** The file, as an absolute URL or a `data:` URI. */
    source: string;
    /** Its `format()`, lower case, or `''`. */
    format: string;
    weight: string;
    style: string;
    unicodeRange: string;
}
/** The `@font-face` rules of a style sheet's text, addresses read against `baseUrl`. */
declare function parseOpenLyricFontFaceCss(cssText: string, baseUrl: string): OpenLyricFontFaceRule[];
/** The faces the deck's text names, each with whether any of it is bold. */
declare function listOpenLyricPresentationFontFaces(data: Pick<OpenLyricPresentationData, 'slides'>): Array<{
    family: string;
    isBold: boolean;
}>;
interface OpenLyricEmbedFontsOptions {
    /** The page names of faces (`editor-Battambang` → `Battambang`). */
    fontNames?: OpenLyricFontNames;
    /** The page whose style sheets load the faces; this one by default. */
    document?: Document;
    /** Fetches with; the page's own `fetch` by default. */
    fetch?: typeof fetch;
    /** The most font data to copy in, in bytes. */
    maxBytes?: number;
}
/**
 * `@font-face` rules for the faces the deck's text is set in, each file in
 * the rule as a `data:` URI, named the way the deck names the face. `''`
 * when there is nothing this page can copy: every failure only leaves a face
 * named, as the page was before.
 */
declare function embedOpenLyricPresentationFonts(data: Pick<OpenLyricPresentationData, 'slides'>, options?: OpenLyricEmbedFontsOptions): Promise<string>;
/**
 * For each of `faces`, the `@font-face` rules of `rules` that set its text: its
 * own name's and the page's names for it (`fontNames`), at the weights the
 * text uses (regular, and bold when any of it is). A face no rule names is
 * left out.
 */
declare function chooseOpenLyricFontFaceRules(faces: ReadonlyArray<{
    family: string;
    isBold: boolean;
}>, rules: readonly OpenLyricFontFaceRule[], fontNames?: OpenLyricFontNames): Array<{
    face: {
        family: string;
        isBold: boolean;
    };
    rules: OpenLyricFontFaceRule[];
}>;
/**
 * `@font-face` rules for `faces` (a family, and whether any of its text is
 * bold), each file as a `data:` URI — what {@link embedOpenLyricPresentationFonts}
 * does for a deck, for any page a host carries off (the print page, say).
 */
declare function embedOpenLyricFontFaces(faces: ReadonlyArray<{
    family: string;
    isBold: boolean;
}>, { fontNames, document: doc, fetch: fetchImpl, maxBytes, }?: OpenLyricEmbedFontsOptions): Promise<string>;
/** One font file a face is set in, as the page loads it. */
interface OpenLyricFontFile {
    /** The face's name outside the page — the one asked for. */
    family: string;
    weight: string;
    style: string;
    unicodeRange: string;
    /** `truetype`, `opentype`, `woff2`, `woff`, or `''`. */
    format: string;
    bytes: Uint8Array;
}
/**
 * The files `faces` are set in, read from the `@font-face` rules this page
 * loads them with — for a file format that carries a font itself (a Word
 * document). One entry per file, however many style sheets declare it; a
 * file the page cannot read, or past `maxBytes`, is left out.
 */
declare function readOpenLyricFontFiles(faces: ReadonlyArray<{
    family: string;
    isBold: boolean;
}>, { fontNames, document: doc, fetch: fetchImpl, maxBytes, }?: OpenLyricEmbedFontsOptions): Promise<OpenLyricFontFile[]>;
/**
 * Whether `bytes` is a TrueType font (glyph outlines a Word document can
 * embed) whose maker lets it travel inside a document: its `OS/2` table's
 * `fsType` neither restricts embedding (bit 1) nor allows bitmaps only
 * (bit 9). A font with no `OS/2` table states no restriction.
 */
declare function isEmbeddableTrueTypeFont(bytes: Uint8Array): boolean;
export { chooseOpenLyricFontFaceRules, embedOpenLyricFontFaces, embedOpenLyricPresentationFonts, isEmbeddableTrueTypeFont, listOpenLyricPresentationFontFaces, mergeOpenLyricFontNames, normalizeOpenLyricFontNames, OPEN_LYRIC_HTML_FONTS_MAX_BYTES, parseOpenLyricFontFaceCss, readOpenLyricFontFiles, unquoteFontFamily, toOpenLyricExportFontName, withOpenLyricExportFontNames, };
export type { OpenLyricEmbedFontsOptions, OpenLyricFontFaceRule, OpenLyricFontFile, OpenLyricFontNames, };

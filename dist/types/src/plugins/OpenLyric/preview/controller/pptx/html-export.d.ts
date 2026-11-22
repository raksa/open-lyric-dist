/**
 * **Download as HTML**, the browser half: what the slide show page needs
 * from the page that exports it, before `buildOpenLyricPresentationHtml`
 * writes it.
 *
 * - **Fonts.** The faces the deck's text is set in, copied in where this page
 *   loads them as web fonts (`./export-fonts.ts`), so a Khmer title reads in
 *   its own face on a computer that has none.
 * - **Pictures.** Each slide picture as a WebP when this browser can write
 *   one and it comes out smaller — a lyric slide's transparent PNG shrinks to
 *   a fraction. A browser without a WebP encoder (Safari) keeps the PNGs.
 * - **Words.** The viewer's own text in the language the dialog showed, from
 *   the same translator.
 *
 * Every step only improves the page: one that fails leaves it as the plain
 * writer makes it.
 */
import type { OpenLyricFontNames } from './export-fonts.js';
import type { OpenLyricPresentationData, PptxPresentation } from './presentation.js';
/** How closely a WebP copy keeps the picture: text edges stay clean. */
declare const OPEN_LYRIC_HTML_WEBP_QUALITY = 0.9;
/** Turns a picture's `data:` URI into another, or hands back the same. */
type OpenLyricPictureEncoder = (dataUri: string) => Promise<string>;
/**
 * `dataUri` as a WebP `data:` URI, when this browser writes WebP and the copy
 * is smaller; the picture as it was otherwise. Pictures already in WebP, and
 * anything that is not a PNG or JPEG, are left alone.
 */
declare function encodeOpenLyricWebpPicture(dataUri: string): Promise<string>;
/**
 * `data` with every picture — slide backgrounds and pictures alike — passed
 * through `encode` once however often it shows. A picture `encode` fails on
 * stays as it was.
 */
declare function shrinkOpenLyricPresentationPictures(data: OpenLyricPresentationData, encode?: OpenLyricPictureEncoder): Promise<OpenLyricPresentationData>;
interface OpenLyricHtmlExportOptions {
    /** The page's title: the song's. */
    title?: string;
    /** The page's language, as `<html lang>`. */
    lang?: string;
    /** The viewer's words translated, as the dialog's were. */
    translate?: (text: string) => string;
    /** The page names of faces the deck names by their own. */
    fontNames?: OpenLyricFontNames;
    /** The page whose style sheets load the fonts; this one by default. */
    document?: Document;
    fetch?: typeof fetch;
    /** Makes the pictures smaller; WebP where the browser writes it by default. */
    encodePicture?: OpenLyricPictureEncoder;
}
/** What a slide show page takes from the preview it is exported from. */
interface OpenLyricHtmlExportSource {
    adoptContainer?: boolean;
    resolvedLabels?: Readonly<Record<string, string>>;
    resolvedLabelLocale?: string;
    fontNames?: OpenLyricFontNames;
}
/**
 * The page's language, translator and font names from `component`: its
 * viewer speaks the language the dialog did. A preview in a host's own panel
 * (`adoptContainer`) leaves its dialogs in English, and so does the page.
 * `fontNames` adds tables the host knows of besides the component's.
 */
declare function getOpenLyricHtmlExportOptions(component: OpenLyricHtmlExportSource | null | undefined, fontNames?: readonly unknown[]): Pick<OpenLyricHtmlExportOptions, 'lang' | 'translate' | 'fontNames'>;
/** The deck `pptx` as its slide show page, fonts and smaller pictures in, ready to download. */
declare function exportOpenLyricPresentationHtml(pptx: Pick<PptxPresentation, 'toData'>, { title, lang, translate, fontNames, document: doc, fetch: fetchImpl, encodePicture, }?: OpenLyricHtmlExportOptions): Promise<Blob>;
export { encodeOpenLyricWebpPicture, exportOpenLyricPresentationHtml, getOpenLyricHtmlExportOptions, OPEN_LYRIC_HTML_WEBP_QUALITY, shrinkOpenLyricPresentationPictures, };
export type { OpenLyricHtmlExportOptions, OpenLyricHtmlExportSource, OpenLyricPictureEncoder, };

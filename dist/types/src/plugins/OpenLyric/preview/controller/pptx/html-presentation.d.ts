/**
 * **Download as HTML**: the deck as one self-contained web page — a slide
 * show that runs in any browser, offline, with nothing beside it.
 *
 * It is the very deck the `.pptx` gets (`PptxPresentation.toData()`): the
 * same backgrounds, pictures, text boxes, notes and transitions, laid out in
 * pixels of a 1920×1080 slide. Every picture is in the page as a `data:` URI,
 * once however many slides show it. The page's script is two functions'
 * own source: the slideshow viewer (`./html-slideshow-runtime.ts`) and the
 * transition engine the PowerPoint dialog's stage plays
 * (`./transition-preview.ts`) — so a transition looks there as it did on the
 * stage.
 *
 * Building the page needs no DOM; only the page itself does, when opened.
 */
import { type OpenLyricHtmlDeck } from './html-slideshow-runtime.js';
import type { OpenLyricPresentationData, PptxPresentation } from './presentation.js';
declare const HTML_MIME_TYPE = "text/html;charset=utf-8";
interface OpenLyricPresentationHtmlOptions {
    /** The page's title: the song's. */
    title?: string;
    /** When the page was made, as the top bar shows it; now by default. */
    exportedAt?: string | Date;
    /** The page's language (`<html lang>`), a BCP-47 tag; `en` by default. */
    lang?: string;
    /**
     * The viewer's own words in another language: given each English string
     * ({@link listOpenLyricHtmlViewerStrings}), its translation, or the string
     * itself where there is none. `{0}`-style placeholders must survive it.
     */
    translate?: (text: string) => string;
    /**
     * `@font-face` rules the page carries, so its text is set in the deck's
     * own faces on any computer (`embedOpenLyricPresentationFonts`).
     */
    fontCss?: string;
}
/**
 * Every English string the viewer shows — its markup's and its script's — as
 * `translate` is asked for them. A language plugin that translates them all
 * exports a page with no English left in it.
 */
declare function listOpenLyricHtmlViewerStrings(): string[];
/**
 * The deck `data` as the page carries it: geometry in pixels, colours and
 * fonts as CSS, pictures once each in `media`, each transition resolved.
 */
declare function buildOpenLyricHtmlDeck(data: OpenLyricPresentationData, { title, exportedAt, translate }?: OpenLyricPresentationHtmlOptions): OpenLyricHtmlDeck;
/**
 * The deck `data` as one self-contained HTML page, as a string: the
 * slideshow viewer, the deck's pictures and the transitions all in it.
 */
declare function buildOpenLyricPresentationHtml(data: OpenLyricPresentationData, options?: OpenLyricPresentationHtmlOptions): string;
/** The deck `pptx` as one self-contained HTML slide show, as a blob ready to download. */
declare function writeOpenLyricPresentationHtml(pptx: Pick<PptxPresentation, 'toData'>, options?: OpenLyricPresentationHtmlOptions): Blob;
/** `fileName` with `.html` in place of its extension. */
declare function toOpenLyricHtmlFileName(fileName: string): string;
export { buildOpenLyricHtmlDeck, buildOpenLyricPresentationHtml, HTML_MIME_TYPE as OPEN_LYRIC_HTML_MIME_TYPE, listOpenLyricHtmlViewerStrings, toOpenLyricHtmlFileName, writeOpenLyricPresentationHtml, };
export type { OpenLyricPresentationHtmlOptions };

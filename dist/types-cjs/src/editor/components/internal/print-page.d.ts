/**
 * The print page made to travel: what a host's `onPrint` receives.
 *
 * The page Print writes into a window of its own links the preview's style
 * sheets and loads its fonts by URL. That is fine for a window of the same
 * page, and of no use to a browser the host opens the page in: a VS Code
 * webview's resources, for one, are served to the webview alone.
 * {@link buildOpenLyricPortablePrintPage} writes each linked style sheet it
 * can read into the page, and adds the faces the song is set in as `data:`
 * URIs, so the page prints the same anywhere.
 */
/** What Print hands a host's {@link OpenLyricPrintHandler}. */
export interface OpenLyricPrintPage {
    /** The whole page, self-contained. It prints itself once it has loaded. */
    html: string;
    /** A file name for it, such as `Amazing-Grace-print.html`. */
    fileName: string;
    /** The song's title, or `''`. */
    title: string;
}
/**
 * Prints the page its own way, such as by opening it in a browser. A promise
 * it returns is waited on; a throw or a rejection reads "Print failed".
 */
export type OpenLyricPrintHandler = (page: OpenLyricPrintPage) => void | Promise<void>;
interface OpenLyricPortablePrintPageOptions {
    /** The rendered song the page copies: its fonts are the ones carried. */
    surface?: Element | null;
    /** The page whose style sheets load those fonts; this one by default. */
    document?: Document;
    /** Fetches with; the page's own `fetch` by default. */
    fetch?: typeof fetch;
}
/**
 * `html` (the page Print writes) as a page that needs nothing from this one:
 * its linked style sheets written in, the faces `surface` is set in embedded.
 * A sheet or a face this page cannot read stays as it was, linked or named.
 */
export declare function buildOpenLyricPortablePrintPage(html: string, { surface, document: doc, fetch: fetchImpl, }?: OpenLyricPortablePrintPageOptions): Promise<string>;
/** The file name a print page goes by: `Song` → `Song-print.html`. */
export declare function toOpenLyricPrintFileName(baseName: string): string;
export {};

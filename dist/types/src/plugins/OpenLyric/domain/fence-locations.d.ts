/**
 * Where the fences of a document sit in its source, and how the previews key
 * them.
 *
 * Deliberately dependency-light — the parser registry and nothing else — so a
 * surface that renders no preview (a bare `Editor`, the editor-only page) can
 * ask "which line is `Chorus 1` on?" without pulling the markdown render
 * pipeline (`marked`, the preview helpers) into its bundle. The preview layer
 * imports the same functions rather than keeping its own copies, so a fence id
 * computed here is exactly the id the preview rendered.
 */
/** One complete ```` ```ol:… ```` block: header info and body captured. */
declare const OL_FENCE_BLOCK_RE: RegExp;
/** Column the part name starts at in a ```` ```ol:Chorus 1 ```` opening line. */
declare const OL_FENCE_HEADER_CONTENT_COLUMN: number;
/** A fence block as it was found in the source. */
export interface OpenLyricFenceBlock {
    info: string;
    raw: string;
    body: string;
    parsedHeader: any;
    startLineNumber: number;
    endLineNumber: number;
}
/** A fence of the current document, keyed the way the previews key it. */
export interface OpenLyricFenceLocation {
    /** Markdown-preview fence element id — `ol-preview-target-chorus-1`. */
    id: string;
    /** Lyric-preview section element id — `ol-song-view-target-chorus-1`. */
    songViewId: string;
    /** Declared part name — `Chorus 1`. */
    partName: string;
    /** Fence kind — `chorus`, `verse`, `config`, … */
    kind: string;
    /** Fence header without its index — `Chorus`. */
    header: string;
    /** 1-based line of the ```` ```ol: ```` opening line. */
    startLine: number;
    /** 1-based line of the closing ``` line. */
    endLine: number;
}
declare function createPreviewTargetId(value: unknown): string;
declare function createSongViewTargetId(partName: unknown): string;
/**
 * The canonical fence id for anything that names a fence — either preview's
 * element id, or the part name itself. Lets a caller that only kept
 * `'Chorus 1'`, or an id it read off the lyric view, still address the fence
 * the markdown preview keys as `ol-preview-target-chorus-1`.
 */
declare function toOpenLyricFenceTargetId(value: unknown): string;
declare function getLineNumberAtOffset(text: string, offset: number): number;
declare function getLineNumberAtEndOffset(text: string, endOffset: number): number;
declare function parseOpenLyricFences(markdown: unknown): OpenLyricFenceBlock[];
/**
 * Every recognized fence the document declares, in source order.
 *
 * Only fences whose header the registry knows are listed — the same rule the
 * previews render by, so `id`/`songViewId` always name an element the
 * corresponding preview actually emitted (an unrecognized ```` ```ol:… ````
 * block renders as an "unknown" fence and is skipped here too).
 */
declare function listOpenLyricFences(markdown: unknown): OpenLyricFenceLocation[];
export { OL_FENCE_BLOCK_RE, OL_FENCE_HEADER_CONTENT_COLUMN, createPreviewTargetId, createSongViewTargetId, getLineNumberAtEndOffset, getLineNumberAtOffset, listOpenLyricFences, parseOpenLyricFences, toOpenLyricFenceTargetId, };

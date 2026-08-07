/**
 * The Config `Attachments` field, read as data.
 *
 * A song's attachments are written as one URL per line — bare
 * (`https://example.com/demo.mp3`) or as a Markdown link whose target is a URL
 * (`[Piano Chart](file:///C:/Charts/chart.pdf)`); `validation.ts` enforces
 * exactly those two shapes. The preview renders them as text, but a host
 * embedding the preview usually wants them as records it can act on — build a
 * player, a download list, a thumbnail strip — which is what this module
 * produces and {@link OpenLyric.getAttachments} answers with.
 */
/**
 * What an attachment points at, as far as its URL can say. Kind first
 * (`youtube` beats the media guess for a `youtu.be` link, which carries no file
 * extension at all), then the file extension, then `other` — the honest answer
 * for a link whose target is only known by fetching it.
 */
export type OpenLyricAttachmentType = 'youtube' | 'audio' | 'video' | 'pdf' | 'image' | 'other';
export interface OpenLyricAttachment {
    /**
     * A label for the link: the Markdown link's text when the line is one,
     * otherwise derived from the URL — its last path segment (`demo.mp3`,
     * `ZSsOrph7rJs`), or its host when the path carries nothing.
     */
    title: string;
    type: OpenLyricAttachmentType;
    /** The URL itself, exactly as written. */
    link: string;
}
/**
 * What the link points at. The query string is deliberately not consulted: a
 * `?list=…` or a signed-download token says nothing about the file, and the
 * extension of the *path* is the only part of a URL that does.
 */
export declare function getOpenLyricAttachmentType(link: string): OpenLyricAttachmentType;
/**
 * One attachment line as a record, or `null` when the line is blank. Anything
 * that is not a URL still comes back — as `other`, titled with the text itself
 * — because a song is edited live and half-typed lines are normal; it is
 * `validation.ts` that tells the writer about them, not this reader.
 */
export declare function parseOpenLyricAttachmentLine(line: string): OpenLyricAttachment | null;
/** Every attachment line of a Config, in the order they are written. */
export declare function createOpenLyricAttachments(lines: readonly string[]): OpenLyricAttachment[];

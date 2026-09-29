/**
 * The whole document "Start a new song" writes, as lines, or `null` when the
 * language has no `Config` definition to build it from.
 *
 * Both halves come from the `Config` fence definition, which is what keeps its
 * `- Structure:` step and the section written beside it naming the same part.
 */
declare function buildStarterDocumentLines(): string[] | null;
declare function isBlankDocument(markdown: any): boolean;
/** How many lines the blank document has — the range the starter replaces. */
declare function countDocumentLines(markdown: any): number;
declare function applyPreviewControllerSongStartingMethods(PreviewControllerClass: any): void;
export { applyPreviewControllerSongStartingMethods, buildStarterDocumentLines, countDocumentLines, isBlankDocument, };

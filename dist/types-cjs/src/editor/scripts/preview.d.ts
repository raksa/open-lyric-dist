import { DEFAULT_STRUMMING_PATTERN_TEXT, createChordedLyricTextLines, createPreviewHelpers, createPreviewLineEntries, createStrummingPatternPreviewContextFromConfigBody, createStrummingPatternPreviewContextFromMarkdown, escapeHtml, getPreviewSourceLocation, normalizeMarkdownRenderableUrls, parseStrummingPatterns, parseStrummingPatternSteps, previewHelpers, renderInlineTextPlainText, renderStrummingPatternGrid, sanitizeHtml } from '../../plugins/OpenLyric/preview/helpers.js';
declare function createPreviewSegments(markdown: any): ({
    type: string;
    raw: string;
    markdown: string;
    startLineNumber: any;
    endLineNumber: any;
    info?: undefined;
    body?: undefined;
} | {
    type: string;
    raw: string;
    info: string;
    body: string;
    startLineNumber: any;
    endLineNumber: any;
    markdown?: undefined;
})[];
declare function renderMarkdownPreview(markdown: any, options?: {}): any;
declare function renderMarkdownPreviewSegment(segment: any, options?: {}): string;
export { DEFAULT_STRUMMING_PATTERN_TEXT, createChordedLyricTextLines, createPreviewHelpers, createPreviewLineEntries, createPreviewSegments, createStrummingPatternPreviewContextFromConfigBody, createStrummingPatternPreviewContextFromMarkdown, escapeHtml, getPreviewSourceLocation, normalizeMarkdownRenderableUrls, parseStrummingPatterns, parseStrummingPatternSteps, previewHelpers, renderInlineTextPlainText, renderMarkdownPreview, renderMarkdownPreviewSegment, renderStrummingPatternGrid, sanitizeHtml, };

declare const SHARED_MARKDOWN_QUERY_PARAM = "md-text";
declare const SHARED_MARKDOWN_DATE_QUERY_PARAM = "md-date";
declare const SHARED_MARKDOWN_FILE_NAME = "shared-link.md";
declare const SHARED_MARKDOWN_QUERY_PARAM_MAX_CHARACTERS = 8000;
declare const SHARED_MARKDOWN_QUERY_PARAM_WARNING_SUFFIX = "This is over the 8,000-character warning threshold, but the link can still be copied.";
declare const SHARED_MARKDOWN_PASSWORD_PREFIX = "pwdecrypted:";
/**
 * A compressed plain link's value: this, then the song's UTF-8 squeezed with
 * `deflate-raw` and written in base64url. A link from before carries plain
 * base64, which never holds a `.`, so it can never start with this.
 */
declare const SHARED_MARKDOWN_COMPRESSED_PREFIX = "z1.";
declare const SHARED_MARKDOWN_PASSWORD_DIALOG_MESSAGE = "Enter the password to open this shared link.";
declare const SHARED_MARKDOWN_PASSWORD_REQUIRED_MESSAGE = "Password is required before this link can be opened.";
declare const SHARED_MARKDOWN_PASSWORD_RETRY_MESSAGE = "Password was incorrect or the encrypted link is invalid. Try again or cancel.";
declare const INVALID_MARKDOWN_CONFIRMATION_MESSAGE = "There are some errors in the markdown. Do you still want to open it?";
declare const SHARE_COPY_BUTTON_LABELS: {
    idle: string;
    copying: string;
    success: string;
    error: string;
};
declare const SHARE_QR_GENERATING_MESSAGE = "Generating QR code...";
declare const SHARE_QR_LINK_READY_MESSAGE = "Scan this code with your phone camera to open the shared link.";
declare const SHARE_QR_LINK_PENDING_MESSAGE = "QR code will appear when the share link is ready.";
declare const SHARE_QR_LINK_ERROR_MESSAGE = "QR code could not be generated for this link. Use the link text below instead.";
declare const SHARE_QR_LINK_FULLSCREEN_READY_MESSAGE = "Scan this fullscreen QR code with your phone camera.";
declare const SHARE_QR_TEXT_READY_MESSAGE = "Scan this code to read the raw Open Lyric markdown text.";
declare const SHARE_QR_TEXT_PENDING_MESSAGE = "QR code will appear when the Open Lyric markdown text is ready.";
declare const SHARE_QR_TEXT_ERROR_MESSAGE = "QR code could not be generated from this markdown text. The text may be too large.";
declare const SHARE_QR_TEXT_FULLSCREEN_READY_MESSAGE = "Scan this fullscreen QR code to read the raw Open Lyric markdown text.";
declare const SHARE_QR_TEXT_DEFAULT_CHARACTERS_PER_CHUNK = 500;
declare const SHARE_COPY_BUTTON_RESET_DELAY_MS = 1800;
declare const SHARE_LINK_REFRESH_DELAY_MS = 250;
declare function loadDraftExamplesModule(): Promise<any>;
declare function encodeBase64Utf8(text: any): string;
declare function decodeBase64Utf8(base64Text: any): string;
/** Whether this browser has `deflate-raw` compression streams both ways. */
declare function isShareCompressionSupported(): boolean;
/**
 * The plain share link's value for `markdown`: compressed
 * ({@link SHARED_MARKDOWN_COMPRESSED_PREFIX}) where the browser can, and
 * where that comes out shorter in the URL than plain base64 — which needs its
 * `+ / =` percent-encoded — else plain base64, as links always were.
 */
declare function encodeSharedMarkdownQueryValue(markdown: any): Promise<string>;
/** The markdown a plain share link's value holds, compressed or not. */
declare function decodeSharedMarkdownQueryValue(value: any): Promise<string>;
declare function renderQrCodeToCanvas(canvas: any, shareLink: any, width: any): Promise<any>;
declare function normalizeShareQrTextChunkLength(value: any): number;
declare function splitTextIntoQrChunks(text: any, maxCharactersPerChunk: any): Promise<string[]>;
declare function formatShareDateForUrl(date?: Date): string;
declare function normalizeSharedMarkdownParam(value: any): string;
declare function isShareEncryptionSupported(): boolean;
declare function encryptSharedMarkdown(markdown: any, password: any): Promise<string>;
declare function decryptSharedMarkdown(encryptedValue: any, password: any): Promise<string>;
export { INVALID_MARKDOWN_CONFIRMATION_MESSAGE, SHARE_COPY_BUTTON_LABELS, SHARE_COPY_BUTTON_RESET_DELAY_MS, SHARE_LINK_REFRESH_DELAY_MS, SHARE_QR_GENERATING_MESSAGE, SHARE_QR_LINK_ERROR_MESSAGE, SHARE_QR_LINK_FULLSCREEN_READY_MESSAGE, SHARE_QR_LINK_PENDING_MESSAGE, SHARE_QR_LINK_READY_MESSAGE, SHARE_QR_TEXT_DEFAULT_CHARACTERS_PER_CHUNK, SHARE_QR_TEXT_ERROR_MESSAGE, SHARE_QR_TEXT_FULLSCREEN_READY_MESSAGE, SHARE_QR_TEXT_PENDING_MESSAGE, SHARE_QR_TEXT_READY_MESSAGE, SHARED_MARKDOWN_DATE_QUERY_PARAM, SHARED_MARKDOWN_FILE_NAME, SHARED_MARKDOWN_PASSWORD_DIALOG_MESSAGE, SHARED_MARKDOWN_COMPRESSED_PREFIX, SHARED_MARKDOWN_PASSWORD_PREFIX, SHARED_MARKDOWN_PASSWORD_REQUIRED_MESSAGE, SHARED_MARKDOWN_PASSWORD_RETRY_MESSAGE, SHARED_MARKDOWN_QUERY_PARAM, SHARED_MARKDOWN_QUERY_PARAM_MAX_CHARACTERS, SHARED_MARKDOWN_QUERY_PARAM_WARNING_SUFFIX, decodeBase64Utf8, decodeSharedMarkdownQueryValue, decryptSharedMarkdown, encodeBase64Utf8, encodeSharedMarkdownQueryValue, encryptSharedMarkdown, formatShareDateForUrl, isShareCompressionSupported, isShareEncryptionSupported, loadDraftExamplesModule, normalizeShareQrTextChunkLength, normalizeSharedMarkdownParam, renderQrCodeToCanvas, splitTextIntoQrChunks, };

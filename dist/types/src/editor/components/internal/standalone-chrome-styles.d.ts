/** Head marker for the chrome stylesheet both standalone panels share. */
export declare const STANDALONE_CHROME_STYLE_ELEMENT_ID = "open-lyric-standalone-chrome-styles";
/**
 * Inject the compiled standalone panel-chrome stylesheet into `document.head`
 * exactly once. Both preview chromes — `OpenLyricStandaloneChrome` (lyric) and
 * `OpenLyricMarkdownStandaloneChrome` (markdown) — render the same
 * `.ol-standalone-preview` panel, so they share the one node.
 */
export declare function ensureStandaloneChromeStylesInjected(): void;

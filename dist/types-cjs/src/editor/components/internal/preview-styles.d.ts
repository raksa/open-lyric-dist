/** Head marker for the component-injected preview stylesheet. */
export declare const PREVIEW_STYLE_ELEMENT_ID = "open-lyric-preview-component-styles";
/**
 * The compiled Open Lyric preview stylesheet (the song view plus the
 * `.ol-preview-*` fence cards) as a raw CSS string — exactly what
 * {@link ensurePreviewStylesInjected} injects. Exposed so a host can inject it
 * itself (paired with the `isSkipStyleInjection` option), e.g. into a shadow
 * root or a scoped node.
 */
export declare function getInjectablePreviewStyleCss(): string;
/**
 * Inject the compiled Open Lyric preview stylesheet (the song view plus the
 * `.ol-preview-*` fence cards both previews render) into `document.head`
 * exactly once, so a bare embed needs no stylesheet import of its own. Every
 * preview instance — `OpenLyric` and `OpenLyricMarkdownManager` alike — shares
 * the one node; the app pages, which also ship the same rules via
 * `styles/preview.scss`, just carry a harmless duplicate.
 */
export declare function ensurePreviewStylesInjected(): void;

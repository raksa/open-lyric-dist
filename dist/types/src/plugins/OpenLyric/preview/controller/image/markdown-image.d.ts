/**
 * Drawing the Markdown preview as an image, for the options the image dialog
 * collects — the Markdown panel's counterpart of the lyric panel's
 * `getValue({ type: 'png-image' })`, shared by its two hosts (the app panel
 * and the standalone chrome).
 *
 * The Markdown preview has no getter that re-renders it, so the picture is of
 * the markup on screen (`readExportMarkup`, without the controls plugins add):
 * a shallow copy of the live root — its classes and its `data-ol-theme`
 * marker, which is where the theme's colours come from — carrying that
 * markup, inside a surface that holds the margin and the background. It is
 * laid out off-screen at the image's size, drawn smaller to fit when asked
 * (`fit-surface.ts`), and rasterized.
 */
import { type OpenLyricImageExportOptions } from './image-options.js';
interface OpenLyricMarkdownImageSource {
    /** The live Markdown render root. */
    root: HTMLElement | null;
    /** The theme the preview is showing (the root's `data-ol-theme`). */
    theme: string;
    /** The panel's own background, used while the theme is followed. */
    backgroundColor: string;
    /** The markup to draw; defaults to `readExportMarkup(root)`. */
    markup?: string;
}
/**
 * A PNG data URI of the Markdown preview drawn as `options` describe, at
 * `pixelRatio` image pixels per layout pixel (the download's 2, or less for
 * a preview of it) — or `null` when the preview has nothing to draw.
 */
declare function drawOpenLyricMarkdownImage(source: OpenLyricMarkdownImageSource, options: OpenLyricImageExportOptions, { pixelRatio }?: {
    pixelRatio?: number;
}): Promise<string | null>;
export { drawOpenLyricMarkdownImage };
export type { OpenLyricMarkdownImageSource };

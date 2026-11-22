/**
 * A picture the reader chooses for the slide background, made fit to keep:
 * scaled down to just cover the 1920×1080 slide raster and re-encoded, so a
 * phone photo of several megabytes becomes a few hundred kilobytes — small
 * enough for the style to remember between exports, and for every slide
 * picture to carry without slowing the export down.
 */
/**
 * The scale that makes a `width` × `height` picture just cover the slide, and
 * never enlarges it.
 */
declare function coverScale(width: number, height: number): number;
/**
 * `file` as a `data:` URI the slide style keeps (`backgroundImage`): at most
 * the size that covers the slide, a JPEG unless it was a PNG. Rejects for a
 * file that is not a picture the browser can read.
 */
declare function readOpenLyricPowerPointPicture(file: Blob): Promise<string>;
export { coverScale, readOpenLyricPowerPointPicture };

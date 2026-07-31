/**
 * Lazy raster helpers shared by the preview components' image getters.
 *
 * `html-to-image` is imported on first use only, so a read-only text/HTML
 * embed never pays for the raster dependency (the redesign's "previews stay
 * small" goal). Rasterization needs a laid-out node, so callers must be
 * mounted before invoking these.
 */
export declare function rasterizeNodeToBlob(node: HTMLElement): Promise<Blob>;
export interface RasterizeToPngOptions {
    /** Fill behind transparent pixels (e.g. the preview surface colour). */
    backgroundColor?: string;
    /** Target CSS width/height; defaults to the node's laid-out size. */
    width?: number;
    height?: number;
    /** Device-pixel multiplier for the raster (defaults to 2). */
    pixelRatio?: number;
}
export declare function rasterizeNodeToDataUrl(node: HTMLElement, options?: RasterizeToPngOptions): Promise<string>;

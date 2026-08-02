/**
 * A `.pptx` writer, small enough to read in one sitting.
 *
 * It covers exactly what the Open Lyric deck asks for — a 16:9 presentation
 * whose slides carry a solid background, text boxes, and full-bleed pictures —
 * and nothing else: no charts, no tables, no notes, no animation. That is the
 * whole reason it exists in place of a general-purpose library.
 *
 * The shape of the API deliberately mirrors the handful of calls the exports
 * already made (`addSlide`, `slide.addText`, `slide.addImage`, `write`), so the
 * two call sites read the same as before.
 *
 * Geometry is in inches, type in points, colours as bare `RRGGBB` — the units
 * PowerPoint's own UI uses. They are converted to EMU (914400 per inch) and
 * hundredths of a point on the way out, which is what the file format wants.
 */
declare const PPTX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
type Measure = number | string;
interface ShapeBox {
    x?: Measure;
    y?: Measure;
    w?: Measure;
    h?: Measure;
}
interface TextOptions extends ShapeBox {
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    color?: string;
    fill?: {
        color?: string;
    } | null;
    fit?: 'shrink' | 'none';
    fontFace?: string;
    fontSize?: number;
    /** Inner padding in points, as `[left, right, bottom, top]` or one number. */
    margin?: number | number[];
    valign?: 'top' | 'middle' | 'bottom';
    line?: {
        color?: string;
        width?: number;
    } | null;
}
interface ImageOptions extends ShapeBox {
    /** A `data:image/png;base64,…` URI. */
    data: string;
}
declare class PptxSlide {
    /** `{ color }` — the solid fill painted behind the whole slide. */
    background: {
        color?: string;
    } | null;
    /** Default run colour for text that names none. */
    color: string;
    private readonly shapes;
    private readonly imageRelationshipIds;
    private readonly addMedia;
    constructor(addMedia: (dataUri: string) => string);
    addText(text: unknown, options?: TextOptions): void;
    addImage(options: ImageOptions): void;
    toXml(): string;
    private buildTransform;
}
declare class PptxPresentation {
    private readonly slides;
    private readonly mediaParts;
    private readonly mediaIdsByData;
    private readonly relationshipIdsBySlide;
    private currentSlide;
    addSlide(): PptxSlide;
    /** The finished deck, as a `.pptx` blob ready to hand to a download. */
    write({ compression, }?: {
        compression?: boolean;
    }): Promise<Blob>;
    private registerMedia;
    private buildParts;
    private buildPresentationXml;
}
/** A new, empty 16:9 deck. */
declare function createOpenLyricPresentation(): PptxPresentation;
export { createOpenLyricPresentation, PPTX_MIME_TYPE };
export type { ImageOptions, PptxPresentation, PptxSlide, TextOptions };

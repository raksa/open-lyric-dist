/**
 * A `.pptx` writer, small enough to read in one sitting.
 *
 * It covers exactly what the Open Lyric deck asks for — a 16:9 presentation
 * whose slides carry a solid or picture background, text boxes, full-bleed pictures,
 * plain-text speaker notes, a transition into the slide, and a picture coming
 * on or leaving as the slide starts (the lyrics moving alone) — and nothing
 * else: no charts, no tables, no animation on a click. That is the whole
 * reason it exists in place of a general-purpose library.
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
/** How a slide comes on screen in the slideshow. */
interface SlideTransition {
    /** A transition of `./transitions.ts` (`'morph'`, `'push'`, `'vortex'`, …). */
    type: string;
    speed?: 'slow' | 'med' | 'fast';
    /** Its direction (`'u'`, `'horz'`, `'vert-out'`, …); its own default when it takes no such one. */
    direction?: string;
}
/**
 * A picture coming on, or leaving, as its slide starts — with no click: every
 * picture leaving goes first, all together, then every picture coming on.
 * What the deck does when only the lyrics move: the slide cuts in showing
 * the lyrics before it, they leave the way they came, and its own come on.
 */
interface OpenLyricPresentationAnimation {
    /** `in`: hidden until it comes on. `out`: shown until it leaves. */
    type: 'in' | 'out';
    /** A text effect of `./transitions.ts` (`'fly'`, `'wipe'`, `'fade'`, …). */
    effect: string;
    /** Its direction, in the transitions' terms (`'u'` comes up from the bottom). */
    direction?: string;
    /** How long it takes, in ms. */
    durationMs: number;
}
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
    /**
     * The picture's shape name (`Image <n>` by default). Morph matches shapes
     * by it; a `!!` prefix makes the match insist.
     */
    name?: string;
    /**
     * The picture's alternative text (`descr`), which screen readers speak
     * and PowerPoint shows under Alt Text: a lyrics picture's words.
     */
    description?: string;
    /**
     * Marked decorative (PowerPoint's *Mark as decorative*): a picture that
     * says nothing, such as the card behind the lyrics. Ignored with a
     * `description`.
     */
    isDecorative?: boolean;
    /** How it comes on or leaves as its slide starts; see {@link OpenLyricPresentationAnimation}. */
    animation?: OpenLyricPresentationAnimation;
}
/** What fills a slide behind everything on it. */
interface SlideBackground {
    /** `RRGGBB`: a solid fill. */
    color?: string;
    /**
     * A `data:image/…;base64,…` picture stretched over the whole slide, in place
     * of `color`. It is the slide's background (`<p:bg>`), not a picture lying
     * on the slide, so a viewer that leaves slide backgrounds out leaves it out
     * too.
     */
    data?: string;
}
/** One thing on a slide, as given to `addText` or `addImage`. */
type OpenLyricPresentationElement = {
    kind: 'text';
    text: string;
    options: TextOptions;
} | {
    kind: 'image';
    options: ImageOptions;
};
/**
 * A slide as plain data — what the HTML export draws: the same background,
 * shapes, notes and transition the `.pptx` gets.
 */
interface OpenLyricPresentationSlideData {
    background: SlideBackground | null;
    /** Default run colour for text that names none, `RRGGBB` or `''`. */
    color: string;
    elements: OpenLyricPresentationElement[];
    notes: string;
    /** How the slide comes on: its own, or the deck's. */
    transition: SlideTransition | null;
}
/** The whole deck as plain data, slides in order. */
interface OpenLyricPresentationData {
    /** The slide size, in inches (13.333 × 7.5). */
    width: number;
    height: number;
    slides: OpenLyricPresentationSlideData[];
}
declare class PptxSlide {
    /** Default run colour for text that names none. */
    color: string;
    /** Speaker notes, plain text; each line a paragraph. */
    notes: string;
    /**
     * How the slide comes on; `null` follows the deck's
     * {@link PptxPresentation.transition}, and `false` cuts in, whatever the
     * deck's — for a slide whose pictures come on by themselves.
     */
    transition: SlideTransition | false | null;
    private readonly shapes;
    private readonly builds;
    private readonly shapeData;
    private readonly imageRelationshipIds;
    private readonly addMedia;
    private slideBackground;
    private backgroundRelationshipId;
    constructor(addMedia: (dataUri: string) => string);
    /** What is on the slide, in the order it was added. */
    get elements(): readonly OpenLyricPresentationElement[];
    /** What fills the whole slide behind its shapes; see {@link SlideBackground}. */
    get background(): SlideBackground | null;
    set background(background: SlideBackground | null);
    addText(text: unknown, options?: TextOptions): void;
    addImage(options: ImageOptions): void;
    toXml(deckTransition?: SlideTransition | null): string;
    /** The `<p:bg>` element, or `''` for a slide that names no background. */
    private buildBackgroundXml;
    private buildTransform;
}
declare class PptxPresentation {
    /** How every slide comes on that names no transition of its own. */
    transition: SlideTransition | null;
    private readonly slides;
    private readonly mediaParts;
    private readonly mediaIdsByData;
    private readonly relationshipIdsBySlide;
    /** How many slides the deck has so far. */
    get slideCount(): number;
    addSlide(): PptxSlide;
    /**
     * The deck as plain data: each slide's background, shapes, notes and the
     * transition into it (the slide's own, or the deck's) — what
     * `writeOpenLyricPresentationHtml` draws.
     */
    toData(): OpenLyricPresentationData;
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
export type { SlideTransition as OpenLyricPresentationTransition };
export type { ImageOptions, OpenLyricPresentationAnimation, OpenLyricPresentationData, OpenLyricPresentationElement, OpenLyricPresentationSlideData, PptxPresentation, PptxSlide, SlideBackground, TextOptions, };

/**
 * The Open Lyric PowerPoint deck's text slides — title, lyric and message
 * slides built from the song's presentation data
 * (`createOpenLyricPresentationData`), with no page, preview or canvas behind
 * them.
 *
 * The preview controller's PowerPoint export
 * (`../export-powerpoint.ts`) delegates its text-slide methods here, and a host
 * with no live preview — the `open-lyric-mcp` server rendering in Node — builds
 * the whole deck through {@link buildOpenLyricTextPresentation}. The picture
 * slides (one rasterized section per slide) stay in the controller: they need
 * a rendered preview to photograph.
 */
import { type OpenLyricPresentationTransition, type PptxPresentation, type PptxSlide } from './presentation.js';
import type { OpenLyricPowerPointTextEffect } from './transitions.js';
/**
 * How a lyric slide's lyrics change when only the text moves: the lyrics
 * before them leave by `effect` played backwards, then theirs come on by it,
 * each in `durationMs`.
 */
interface OpenLyricPowerPointTextTransition {
    effect: OpenLyricPowerPointTextEffect;
    /** The way the lyrics move coming on, in the transitions' terms; `''` for none. */
    direction: string;
    /** Each half — the old lyrics leaving, the new coming on — in ms. */
    durationMs: number;
}
interface OpenLyricPowerPointTheme {
    accent: string;
    background: string;
    body: string;
    muted: string;
    surface: string;
    surfaceBorder: string;
    title: string;
}
interface OpenLyricPowerPointTypography {
    chromeFontFace: string;
    lyricFontFace: string;
    lyricFontSize: number;
}
type OpenLyricPowerPointThemeName = 'light' | 'dark';
/** How a text slide sets its lyrics across their box. */
type OpenLyricTextSlideAlign = 'left' | 'center' | 'right';
/** What {@link buildOpenLyricTextPresentation} lays the deck out with. */
interface OpenLyricTextPresentationOptions {
    theme?: OpenLyricPowerPointTheme;
    typography?: OpenLyricPowerPointTypography;
    /**
     * The most lines of lyrics a slide holds, 1 to
     * `OPEN_LYRIC_POWERPOINT_MAX_LINES_PER_SLIDE` (the default). A line and the
     * chord row over it stay together, and count as two.
     */
    linesPerSlide?: number;
    /** How the lyrics sit across their box; `left` by default. */
    textAlign?: OpenLyricTextSlideAlign;
    /** How every slide comes on; none by default. */
    transition?: OpenLyricPresentationTransition | null;
}
interface OpenLyricPowerPointSectionData {
    partName?: string;
    repeatText?: string;
    heading?: string;
    lineGroups?: string[][];
    /**
     * A song note the Structure leaves out, listed after the flow — which a
     * slide deck carries or not by its `isWithNotes`.
     */
    isNote?: boolean;
}
interface OpenLyricPowerPointPresentationData {
    title?: string;
    secondaryText?: string;
    metaLine?: string;
    sections?: OpenLyricPowerPointSectionData[];
}
interface OpenLyricPowerPointSlideDescriptor {
    chunkIndex: number;
    lines: string[];
    sectionData: OpenLyricPowerPointSectionData;
    totalChunks: number;
}
/** The deck's palettes, keyed by the preview theme they follow. */
declare const OPEN_LYRIC_POWERPOINT_THEMES: Readonly<Record<OpenLyricPowerPointThemeName, Readonly<OpenLyricPowerPointTheme>>>;
declare function getOpenLyricPowerPointTheme(themeName: OpenLyricPowerPointThemeName): OpenLyricPowerPointTheme;
/** Inner padding in points, in the `[left, right, bottom, top]` order the writer takes. */
declare function getOpenLyricPowerPointTextBoxMargin({ left, right, top, bottom, }?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}): number[];
/**
 * The words a picture slide shows, for its alternative text: the section's
 * name, then the lines in the window `chunkIndex` of `linesPerSlide` covers
 * (every line for `0`). `lineWords` are the words of each line the slide
 * counts, as the deck draws the part (`readOpenLyricPowerPointLineWords`);
 * without them the section's own lines stand in, each the words without the
 * chord row over them and with directives dropped, a blank line taking no
 * place. `''` when there is nothing to say.
 */
declare function describeOpenLyricPowerPointSlideText(sectionData: OpenLyricPowerPointSectionData | null | undefined, { chunkIndex, linesPerSlide, lineWords, }?: {
    chunkIndex?: number;
    linesPerSlide?: number;
    lineWords?: readonly string[];
}): string;
declare function chunkOpenLyricPowerPointLineGroups(lineGroups: unknown, maxLinesPerSlide?: number): string[][][];
declare function flattenOpenLyricPowerPointChunk(chunk: unknown): string[];
declare function buildOpenLyricPowerPointSlideTitle(sectionData: OpenLyricPowerPointSectionData | null | undefined, chunkIndex: number, totalChunks: number): string;
/**
 * The deck's opening slide, centred the way the preview heads the song: the
 * title, the subtitle, then the Key/Time/Tempo line. With `backgroundImage`
 * (the picture decks' slide fill) as its background it matches the slides
 * that follow; the text stays text, editable in the deck.
 */
declare function addOpenLyricPowerPointTitleSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, presentationData: OpenLyricPowerPointPresentationData, typography: OpenLyricPowerPointTypography, { backgroundImage, notes, }?: {
    /**
     * A `data:image/…` picture as the slide's background, in place of the
     * theme's colour.
     */
    backgroundImage?: string;
    /** The slide's speaker notes. */
    notes?: string;
}): PptxSlide;
/**
 * The card picture's shape name on every lyric slide. Morph matches shapes of
 * one name across slides, and the `!!` prefix makes it insist (PowerPoint's
 * forced match), so the card holds still while the lyrics change.
 */
declare const OPEN_LYRIC_POWERPOINT_CARD_SHAPE_NAME = "!!Card";
/**
 * A slide's lyrics picture's shape name: its own on every slide, so Morph
 * fades one slide's lyrics into the next rather than matching them.
 */
declare function getOpenLyricPowerPointLyricsShapeName(slideId: string): string;
/**
 * The shape name of the lyrics before a slide's own, which leave as it
 * starts (`textTransition`).
 */
declare function getOpenLyricPowerPointLeavingLyricsShapeName(slideId: string): string;
/**
 * A picture deck's slide (`OpenLyricPowerPointSlideImage`): the style's own
 * fill as its background (the theme's colour when it has none), then, full
 * bleed, the card alone when the lyrics are apart, then the picture. The
 * picture already carries the section title, the lyrics and the preview's
 * styling, so nothing is laid over it. An empty slide has no picture.
 *
 * The card is one picture, named {@link OPEN_LYRIC_POWERPOINT_CARD_SHAPE_NAME}
 * on every slide, and each picture is named for its slide, so a Morph between
 * two lyric slides holds the card still and fades only the lyrics.
 *
 * The lyrics picture carries `altText` (the slide's words) as its
 * alternative text; the card, and a picture with nothing to say, are marked
 * decorative.
 *
 * With `textTransition` and `previousImageData` (the lyrics of the slide
 * before, over the same card) only the lyrics move, with no click: the slide
 * cuts in — no transition of its own, whatever the deck's — showing the
 * lyrics before, which leave the way they came, then its own come on. In
 * PowerPoint's editor, which plays nothing, the slide shows both.
 */
declare function addOpenLyricPowerPointImageSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, { id, imageData, backgroundImageData, cardImageData, previousImageData, textTransition, notes, altText, }: {
    id?: string;
    imageData: string;
    backgroundImageData?: string;
    cardImageData?: string;
    /** The lyrics picture of the slide before, leaving as this one starts. */
    previousImageData?: string;
    /** How the lyrics change, when only the text moves. */
    textTransition?: OpenLyricPowerPointTextTransition | null;
    notes?: string;
    /** The words the picture shows, for screen readers. */
    altText?: string;
}): PptxSlide;
declare function addOpenLyricPowerPointMessageSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, presentationData: OpenLyricPowerPointPresentationData, typography: OpenLyricPowerPointTypography, { title, message, slideNumber, totalSlides, }: {
    title: string;
    message: string;
    slideNumber: number;
    totalSlides: number;
}): void;
declare function addOpenLyricPowerPointLyricSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, presentationData: OpenLyricPowerPointPresentationData, typography: OpenLyricPowerPointTypography, { sectionData, chunkIndex, lines, slideNumber, totalSlides, totalChunks, textAlign, }: OpenLyricPowerPointSlideDescriptor & {
    slideNumber: number;
    totalSlides: number;
    textAlign?: OpenLyricTextSlideAlign;
}): void;
declare function buildOpenLyricPowerPointSlideDescriptors(presentationData: OpenLyricPowerPointPresentationData | null | undefined, maxLinesPerSlide?: number): OpenLyricPowerPointSlideDescriptor[];
/**
 * The whole deck as text slides: a title slide, then one lyric slide per
 * chunk of each section in structure order — or a single message slide when
 * the song has no sections to show. The same slides the preview's PowerPoint
 * export falls back to when it cannot rasterize the preview.
 */
declare function buildOpenLyricTextPresentation(presentationData: OpenLyricPowerPointPresentationData, { theme, typography, linesPerSlide, textAlign, transition, }?: OpenLyricTextPresentationOptions): PptxPresentation;
export { addOpenLyricPowerPointImageSlide, addOpenLyricPowerPointLyricSlide, addOpenLyricPowerPointMessageSlide, addOpenLyricPowerPointTitleSlide, buildOpenLyricPowerPointSlideDescriptors, buildOpenLyricPowerPointSlideTitle, buildOpenLyricTextPresentation, chunkOpenLyricPowerPointLineGroups, describeOpenLyricPowerPointSlideText, flattenOpenLyricPowerPointChunk, getOpenLyricPowerPointLeavingLyricsShapeName, getOpenLyricPowerPointLyricsShapeName, getOpenLyricPowerPointTextBoxMargin, OPEN_LYRIC_POWERPOINT_CARD_SHAPE_NAME, getOpenLyricPowerPointTheme, OPEN_LYRIC_POWERPOINT_THEMES, };
export type { OpenLyricPowerPointPresentationData, OpenLyricPowerPointSectionData, OpenLyricPowerPointSlideDescriptor, OpenLyricPowerPointTheme, OpenLyricPowerPointThemeName, OpenLyricPowerPointTypography, OpenLyricPowerPointTextTransition, OpenLyricTextPresentationOptions, OpenLyricTextSlideAlign, };

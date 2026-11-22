/**
 * The slideshow inside the HTML export: the script the saved page runs.
 *
 * `openLyricHtmlSlideshowRuntime` is written into the file as its own source
 * (`String(openLyricHtmlSlideshowRuntime)`), called with the transition
 * engine's source beside it — so its body is self-contained: it names
 * nothing from outside it but the page's globals. Keep it so: no imports
 * but types, no module-level names inside.
 *
 * It reads the deck the page carries (`<script id="ol-deck">`, an
 * {@link OpenLyricHtmlDeck}) and offers what a slide-deck viewer does: the
 * slides with their notes, a grid of all of them, a full-screen slide show
 * playing each slide's transition, and a presenter view with the next slide,
 * the notes, a timer and an audience window it drives.
 */
import type { OpenLyricTransitionEngine } from './transition-preview.js';
/** A text box, in pixels of the slide. */
interface OpenLyricHtmlTextElement {
    kind: 'text';
    x: number;
    y: number;
    w: number;
    h: number;
    /** One entry per line; an empty one is an empty line. */
    paragraphs: string[];
    /** A CSS font-family list. */
    fontFamily: string;
    /** In pixels of the slide. */
    fontSize: number;
    bold: boolean;
    /** A CSS colour. */
    color: string;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    /** Top, right, bottom, left, in pixels. */
    padding: [number, number, number, number];
    /** A CSS colour, or `''` for none. */
    fill: string;
    border: {
        color: string;
        width: number;
    } | null;
    /** Drawn smaller until it fits its box (PowerPoint's shrink on overflow). */
    isShrinking: boolean;
}
/** A picture, in pixels of the slide. */
interface OpenLyricHtmlImageElement {
    kind: 'image';
    x: number;
    y: number;
    w: number;
    h: number;
    /** Its index in {@link OpenLyricHtmlDeck.media}. */
    media: number;
    /** The words it shows, for screen readers; `''` (or absent) for none. */
    alt?: string;
    /**
     * How it comes on (`in`, hidden until then) or leaves (`out`, then hidden)
     * as its slide starts — every `out` first, then every `in` — by a text
     * effect of the transition engine. A slide drawn without its build (a
     * thumbnail, a step back) shows as it ends.
     */
    animation?: {
        type: 'in' | 'out';
        effect: string;
        direction: string;
        durationMs: number;
    };
}
/** How a slide comes on in the show. */
interface OpenLyricHtmlTransition {
    type: string;
    /** Its name, as the PowerPoint dialog lists it. */
    label: string;
    /** Resolved (`'l'`, `'horz'`, …), or `''` for one without. */
    direction: string;
    durationMs: number;
}
interface OpenLyricHtmlSlide {
    /** A CSS colour, or a picture by its index in {@link OpenLyricHtmlDeck.media}. */
    background: {
        color?: string;
        media?: number;
    };
    elements: Array<OpenLyricHtmlTextElement | OpenLyricHtmlImageElement>;
    notes: string;
    transition: OpenLyricHtmlTransition | null;
    /**
     * When only the lyrics move into it: how, for the labels (`type` the text
     * effect, `durationMs` the whole build). Its pictures' `animation`s play
     * it; the slide itself cuts in.
     */
    textTransition?: OpenLyricHtmlTransition | null;
}
/** The deck the page carries. */
interface OpenLyricHtmlDeck {
    title: string;
    /** Who and when, for the top bar: `'Open Lyric'`, the export time. */
    generator: string;
    exportedAt: string;
    /** The slide size, in pixels. */
    width: number;
    height: number;
    /** Every picture once, as a `data:` URI; slides point at them by index. */
    media: string[];
    /** Per transition that takes a direction: its default, then every choice. */
    directions: Record<string, string[]>;
    slides: OpenLyricHtmlSlide[];
    /**
     * The viewer's own words translated, keyed by the English
     * ({@link OPEN_LYRIC_HTML_VIEWER_STRINGS}); absent or partial is English.
     */
    strings?: Record<string, string>;
}
/**
 * Run the slideshow on the page it is in. `createEngine` is
 * `createOpenLyricTransitionEngine` (`./transition-preview.ts`).
 */
declare function openLyricHtmlSlideshowRuntime(createEngine: () => OpenLyricTransitionEngine): void;
export { openLyricHtmlSlideshowRuntime };
export type { OpenLyricHtmlDeck, OpenLyricHtmlImageElement, OpenLyricHtmlSlide, OpenLyricHtmlTextElement, OpenLyricHtmlTransition, };

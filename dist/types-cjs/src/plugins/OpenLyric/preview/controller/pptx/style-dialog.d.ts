/**
 * The PowerPoint export's options dialog — what **Download as Presentation**
 * opens on both preview surfaces before it writes a deck.
 *
 * A preset (Default, Classic, Centered, Large lyrics, Movie subtitles) seeds
 * every field; each field — the switches, size, lines per slide, alignment,
 * text colours, the slide's and the card's backgrounds (the theme's, a solid
 * colour, a gradient or a pattern; the card's at a transparency), and the
 * card's size against the slide — can then be moved on its own, and the
 * preset reads **Custom** until the fields match one again. **Save preset**
 * keeps the whole style under a name of the reader's own (font, picture and
 * transition included); those presets are listed under **My presets** and
 * can be deleted again. The fields sit in collapsible sections, which stay
 * the way the reader left them the next time the dialog opens.
 *
 * Beside them, every slide of the deck is listed top to bottom in a column of
 * its own, each drawn through the same element map the export renders with,
 * so what the dialog shows is what the deck gets. A change redraws the list,
 * keeping each old picture (dimmed) until its new one lands. The title slide
 * shows its centred title over the slide background, as the deck has it.
 *
 * Under each slide sit its own choices: **Omit content** (a lyric slide kept
 * but left empty), **Notes** (the slide's speaker notes, written in a box the
 * switch opens) and **Blank slides after** (that many empty slides inserted
 * after it, listed in place). They belong to the song, not to the style: the
 * dialog opens on `initialChoices` and resolves with the choices made.
 *
 * Self-contained: it builds its own `<dialog>` into `host` — inside the panel,
 * so the panel's chrome stylesheet (`_preview-panel-chrome.scss`) and its
 * label translations reach it — and removes it again when it closes.
 */
import { type OpenLyricFontFaceSource } from '../font-picker.js';
import { type OpenLyricExportDialogAction } from '../../../../../editor/components/internal/export-actions.js';
import { type OpenLyricPowerPointPreviewSlide, type OpenLyricPowerPointSlideChoices, type OpenLyricPowerPointSlideStyle } from './slide-style.js';
interface OpenLyricPowerPointStyleDialogOptions {
    /** Where the dialog is built — the preview panel it belongs to. */
    host: HTMLElement;
    /** The style the fields open on; anything invalid falls back to Classic. */
    initialStyle?: unknown;
    /**
     * The faces the Font field lists, in titled groups — what the preview's
     * settings popup lists (`() => listOpenLyricExportFontFaces(component)`).
     * A function is asked each time the list opens, so faces a host fills in
     * late (the system's fonts) show. Any face can be typed in as well; empty
     * keeps the preview's font.
     */
    fontFaces?: OpenLyricFontFaceSource;
    /**
     * The song's slide choices the list opens on — what the last Download of
     * this song resolved with (`readOpenLyricPowerPointSlideChoices`).
     */
    initialChoices?: unknown;
    /**
     * The deck's lyric slides in `style`, in order
     * (`listOpenLyricPowerPointPreviewSlides`). Asked again only when the lines
     * per slide or the song notes switch change — nothing else moves a slide.
     * Without it, or without `renderPreviewSlide`, the dialog lists no slides.
     */
    listPreviewSlides?: (style: OpenLyricPowerPointSlideStyle) => Promise<OpenLyricPowerPointPreviewSlide[]>;
    /**
     * A picture of `slide` in `style` — a data URI — or nothing when there is
     * none to show (`renderOpenLyricPowerPointPreviewSlide`). Asked once per
     * key: a part sung again shows the same picture.
     */
    renderPreviewSlide?: (style: OpenLyricPowerPointSlideStyle, slide: OpenLyricPowerPointPreviewSlide & {
        /** The slide with its content left out: the slide background alone. */
        isContentOmitted?: boolean;
        /**
         * One layer of it, for the stage when only the lyrics move: `'card'`
         * (nothing on the card) or `'text'` (the lyrics alone, over a clear
         * slide).
         */
        layer?: 'card' | 'text';
    }, 
    /**
     * `pixelRatio` against the 1920×1080 slide: absent for the list's
     * thumbnails, `1` for the stage when it fills the screen (Present).
     */
    options?: {
        pixelRatio?: number;
    }) => Promise<string | null | undefined>;
    /** The CSS colour behind each slide: the deck's slide background. */
    resolvePreviewBackground?: (style: OpenLyricPowerPointSlideStyle) => string;
    /**
     * What the title slide says, and in which colours, in `style` — drawn
     * centred over the slide background the way the deck lays it out.
     * Without it the title slide shows as a placeholder.
     */
    resolvePreviewTitle?: (style: OpenLyricPowerPointSlideStyle) => OpenLyricPowerPointPreviewTitle;
    /** How long the list waits for the fields to settle before redrawing. */
    previewDelayMs?: number;
    /**
     * A chosen file as the picture the style keeps — a `data:` URI. Defaults
     * to `readOpenLyricPowerPointPicture`, which scales it down to the slide.
     */
    readPicture?: (file: Blob) => Promise<string>;
    /**
     * Buttons after Download — the host's export actions
     * (`toOpenLyricExportDialogActions(component.getExportActions('powerpoint'))`).
     * Each finishes the dialog the way Download does, naming itself in the
     * result's `action`.
     */
    actions?: readonly OpenLyricExportDialogAction[];
    /**
     * Buttons for the HTML slide show, after the others —
     * `toOpenLyricExportDialogActions(component.getExportActions('html'))`.
     * Each finishes the dialog the way Download as HTML does: the result names
     * it in `action`, with `format: 'html'`.
     */
    htmlActions?: readonly OpenLyricExportDialogAction[];
}
/**
 * What **Download** resolves with: the style, and the song's slide choices
 * for the slides listed — what `buildOpenLyricPowerPointStyledSlideImages`
 * takes as `omittedSlideIds`, `slideNotes` and `blankSlidesAfter`.
 */
interface OpenLyricPowerPointStyleDialogResult extends OpenLyricPowerPointSlideChoices {
    style: OpenLyricPowerPointSlideStyle;
    /** The export action chosen instead of Download, by id; absent for Download. */
    action?: string;
    /**
     * `'html'` for **Download as HTML** — the deck as one self-contained web
     * page (`writeOpenLyricPresentationHtml`); absent for the `.pptx`.
     */
    format?: 'html';
}
/** The title slide's text and colours (any CSS colour) for its preview. */
interface OpenLyricPowerPointPreviewTitle {
    title: string;
    subtitle?: string;
    /** The Key/Time/Tempo line. */
    details?: string;
    color?: string;
    subtitleColor?: string;
    detailsColor?: string;
}
/**
 * Open the dialog. Resolves with the style the reader downloads with and the
 * slides they left empty, or `null` when they cancel (the Cancel button,
 * Escape, or a click on the backdrop). The dialog is gone from the DOM by the
 * time it resolves.
 */
declare function openOpenLyricPowerPointStyleDialog({ host, initialStyle, fontFaces, initialChoices, listPreviewSlides, renderPreviewSlide, resolvePreviewBackground, resolvePreviewTitle, previewDelayMs, readPicture, actions, htmlActions, }: OpenLyricPowerPointStyleDialogOptions): Promise<OpenLyricPowerPointStyleDialogResult | null>;
export { openOpenLyricPowerPointStyleDialog };
export type { OpenLyricPowerPointPreviewTitle, OpenLyricPowerPointStyleDialogOptions, OpenLyricPowerPointStyleDialogResult, };

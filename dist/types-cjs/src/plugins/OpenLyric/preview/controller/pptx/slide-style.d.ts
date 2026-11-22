/**
 * How the PowerPoint export's lyric slides look — the choices the export's
 * options dialog (`./style-dialog.ts`) edits, and the one path both preview
 * surfaces render them through: the app panel (`../export-powerpoint.ts`) and
 * the standalone preview (`OpenLyricStandaloneChrome`).
 *
 * A lyric slide is a picture of the section the preview renders
 * (`OpenLyric.getElementMap`), so a style is never a second renderer. It is the
 * map's own options — `fontSize`, `isWithKeyNote`, `isShowingIndex`, `theme` —
 * plus a `css` sheet scoped to the export surface, which is what that option
 * exists for: centre the lines, hide the titles, recolour, outline, set the
 * lyrics in capitals, fill the slide with a colour, a gradient, a pattern or
 * a picture of the reader's own (shaded so the lyrics read over it), fill the
 * card the same way or with frosted glass, size the card. The live preview is
 * never touched. A style also carries how the slides come on in the
 * slideshow (`transition`), which the deck writes as PowerPoint's own.
 *
 * `linesPerSlide` splits a section over several slides (subtitles show two
 * lines at a time). Each slide is the same section rendered again with the
 * lines outside its window hidden by that sheet, so a split slide is still
 * exactly what the preview draws, only fewer lines of it.
 */
import type { OpenLyricElementMapOptions } from '../../../../../editor/components/OpenLyric.js';
import type { OpenLyricPresentationTransition } from './presentation.js';
import { type OpenLyricPowerPointPresentationData, type OpenLyricPowerPointSectionData, type OpenLyricPowerPointTextTransition, type OpenLyricPowerPointTheme, type OpenLyricPowerPointThemeName } from './text-slides.js';
type OpenLyricPowerPointPresetName = 'default' | 'classic' | 'centered' | 'large' | 'subtitle';
type OpenLyricPowerPointTextAlign = 'left' | 'center' | 'right';
type OpenLyricPowerPointVerticalAlign = 'top' | 'middle' | 'bottom';
/** `'auto'` follows the preview's own theme. */
type OpenLyricPowerPointThemeChoice = 'auto' | OpenLyricPowerPointThemeName;
/**
 * What paints the slide or the card: `'theme'` keeps the theme's own colour,
 * the others use the style's colours.
 */
type OpenLyricPowerPointFill = 'theme' | 'solid' | 'gradient' | 'pattern';
/**
 * The card has one fill more: `'glass'`, frosted — what lies behind the card
 * blurred, under a sheen tinted with the card colour.
 */
type OpenLyricPowerPointCardFill = OpenLyricPowerPointFill | 'glass';
type OpenLyricPowerPointGradient = 'vertical' | 'horizontal' | 'diagonal' | 'radial';
type OpenLyricPowerPointPattern = 'dots' | 'stripes' | 'grid' | 'checks';
/**
 * The slide has one fill more than the card: `'picture'`, a picture of the
 * reader's own (`backgroundImage`) covering the slide.
 */
type OpenLyricPowerPointSlideFill = OpenLyricPowerPointFill | 'picture';
/**
 * How each slide comes on in the slideshow: `'none'`, or a transition of
 * `./transitions.ts` — every one PowerPoint offers. `'morph'` (PowerPoint's
 * Morph) carries the previous slide's last frame into the next one, holding
 * still what the two share and fading what changed.
 */
type OpenLyricPowerPointTransition = string;
type OpenLyricPowerPointTransitionSpeed = 'slow' | 'medium' | 'fast';
/**
 * What a transition moves: `'card'`, the card with its lyrics; `'text'`, the
 * lyrics alone, the card a picture of its own, the same on every slide.
 */
type OpenLyricPowerPointTransitionScope = 'card' | 'text';
interface OpenLyricPowerPointSlideStyle {
    /** The preset the fields match, or `'custom'` once they match none. */
    preset: OpenLyricPowerPointPresetName | 'custom';
    /** The `[chord]` key notes over the lyrics. */
    isWithKeyNote: boolean;
    isShowingSectionTitle: boolean;
    /** The flow-index badge in the card's corner. */
    isShowingSectionNumber: boolean;
    /** The section card's rounded frame and shadow. */
    isShowingCard: boolean;
    /** The deck's opening slide: title, subtitle and the Key/Time/Tempo line. */
    isWithTitleSlide: boolean;
    /**
     * The song notes the Structure leaves out — `ol:Note` fences it does not
     * name — as slides at the end of the deck. A note the Structure names is a
     * slide where it stands in the flow either way.
     */
    isWithNotes: boolean;
    /** A dark (or light) edge around the text, the way film subtitles carry one. */
    isTextOutlined: boolean;
    /** The lyrics and section titles in capitals; the chords keep their case. */
    isUppercase: boolean;
    textAlign: OpenLyricPowerPointTextAlign;
    verticalAlign: OpenLyricPowerPointVerticalAlign;
    /** CSS pixels on the 1920×1080 slide raster. */
    fontSize: number;
    /** Lyric lines on one slide; `0` keeps each section whole. */
    linesPerSlide: number;
    theme: OpenLyricPowerPointThemeChoice;
    /** `#rrggbb`, or `''` for the theme's own colour. */
    textColor: string;
    chordColor: string;
    /**
     * What fills the slide behind the card. `'picture'` covers it with
     * `backgroundImage` (the theme's fill until one is chosen).
     */
    backgroundFill: OpenLyricPowerPointSlideFill;
    /** `#rrggbb`: the solid fill, the gradient's start, the pattern's ground. */
    backgroundColor: string;
    /** `#rrggbb`: the gradient's end, the pattern's marks. */
    backgroundColor2: string;
    backgroundGradient: OpenLyricPowerPointGradient;
    backgroundPattern: OpenLyricPowerPointPattern;
    /**
     * What fills the section card; its colours work as the slide's do, and
     * `'glass'` tints the frosted card with `cardColor`.
     */
    cardFill: OpenLyricPowerPointCardFill;
    cardColor: string;
    cardColor2: string;
    cardGradient: OpenLyricPowerPointGradient;
    cardPattern: OpenLyricPowerPointPattern;
    /**
     * `0` (opaque) to `100` (clear): how much of the slide shows through the
     * card's fill. The text and chords keep their own colours.
     */
    cardTransparency: number;
    /**
     * The card's width and height as a percentage of the slide's
     * (`OPEN_LYRIC_POWERPOINT_CARD_SIZE_RANGE`). `100` fills it; a smaller card
     * sits where `textAlign` / `verticalAlign` put the text.
     */
    cardWidth: number;
    cardHeight: number;
    /**
     * A font face the preview offers, or `''` for the preview's own. Not part
     * of a preset: the slides' look and the face they are set in are separate
     * choices, so picking a preset keeps it.
     */
    fontFamily: string;
    /**
     * The slide's picture under the `'picture'` fill: a `data:image/…;base64,`
     * URI (`./picture.ts` scales a chosen file down to the slide), or `''`.
     * Kept when the fill changes, so going back to *Picture* brings it back —
     * and, like the font, not part of a preset.
     */
    backgroundImage: string;
    /**
     * `0`–`90` (`OPEN_LYRIC_POWERPOINT_SHADE_RANGE`): how far the picture is
     * darkened, so light lyrics read over a busy photo.
     */
    backgroundShade: number;
    /** How each slide comes on in the slideshow. Not part of a preset. */
    transition: OpenLyricPowerPointTransition;
    /**
     * The transition's direction (`'u'`, `'horz'`, `'vert-out'`, …), for one
     * that takes it; `''`, or one it does not take, means its own default.
     */
    transitionDirection: string;
    transitionSpeed: OpenLyricPowerPointTransitionSpeed;
    /**
     * `'card'` moves the whole slide, the card and its lyrics as one picture.
     * `'text'` draws them as two pictures, the card the same on every slide
     * (named `OPEN_LYRIC_POWERPOINT_CARD_SHAPE_NAME`), and holds it still
     * between two lyric slides: Morph fades one slide's lyrics into the next;
     * every other transition plays as the lyrics' own exit and entrance
     * (`getOpenLyricPowerPointTextTransition`) — the lyrics leave the way they
     * came, then the next ones come on.
     */
    transitionScope: OpenLyricPowerPointTransitionScope;
}
/**
 * The fields that are the reader's own rather than a look: the font, the
 * picture and its shade, the transition. A preset leaves them as they were.
 */
type OpenLyricPowerPointOwnField = 'fontFamily' | 'backgroundImage' | 'backgroundShade' | 'transition' | 'transitionDirection' | 'transitionSpeed' | 'transitionScope';
/** The fields a preset sets — everything but its own name and the reader's own. */
type OpenLyricPowerPointStyleFields = Omit<OpenLyricPowerPointSlideStyle, 'preset' | OpenLyricPowerPointOwnField>;
type OpenLyricPowerPointOwnFields = Pick<OpenLyricPowerPointSlideStyle, OpenLyricPowerPointOwnField>;
declare const OPEN_LYRIC_POWERPOINT_FONT_SIZE_RANGE: Readonly<{
    min: 24;
    max: 120;
    step: 2;
}>;
declare const OPEN_LYRIC_POWERPOINT_LINES_PER_SLIDE_CHOICES: readonly number[];
declare const OPEN_LYRIC_POWERPOINT_CARD_SIZE_RANGE: Readonly<{
    min: 10;
    max: 100;
    step: 5;
}>;
declare const OPEN_LYRIC_POWERPOINT_SHADE_RANGE: Readonly<{
    min: 0;
    max: 90;
    step: 5;
}>;
/**
 * The longest picture a style holds, in characters of its data URI — far
 * above what `./picture.ts` makes of any photo, well under what browser
 * storage takes.
 */
declare const OPEN_LYRIC_POWERPOINT_MAX_PICTURE_LENGTH = 4000000;
declare const OPEN_LYRIC_POWERPOINT_SLIDE_STYLE_STORAGE_KEY = "openLyric.powerPointSlideStyle";
/**
 * `default` is what a fresh dialog opens on and Reset goes back to: two
 * outlined lines centred at the bottom of the slide, on a see-through
 * gradient band over a grid, with Morph moving the lyrics alone (its
 * transition is in `DEFAULT_OWN_FIELDS`, since presets leave the transition
 * be). `classic` is the deck the export always wrote before — the section
 * card as the preview draws it, lyrics only — so its sheet is empty, and its
 * neutral values are what a stored style missing a field falls back on.
 */
declare const OPEN_LYRIC_POWERPOINT_PRESETS: Readonly<Record<OpenLyricPowerPointPresetName, Readonly<OpenLyricPowerPointStyleFields>>>;
declare const OPEN_LYRIC_POWERPOINT_PRESET_NAMES: readonly OpenLyricPowerPointPresetName[];
/** `#rgb` / `#rrggbb` as lower-case `#rrggbb`, anything else as `''`. */
declare function normalizeHexColor(value: unknown): string;
/**
 * The preset whose every field `fields` matches, or `'custom'`. A fill detail
 * the fill leaves unused does not count: a colour picked under *Solid* and
 * left behind by going back to *Default* changes nothing on the slide.
 */
declare function matchOpenLyricPowerPointPreset(fields: OpenLyricPowerPointStyleFields): OpenLyricPowerPointPresetName | 'custom';
/** `style`'s own fields — what a preset change carries over. */
declare function pickOpenLyricPowerPointOwnFields(style: OpenLyricPowerPointSlideStyle): OpenLyricPowerPointOwnFields;
/**
 * A fresh, mutable copy of a preset — the default style for no name or an
 * unknown one, which brings its transition along.
 */
declare function createOpenLyricPowerPointSlideStyle(preset?: unknown): OpenLyricPowerPointSlideStyle;
/**
 * A complete, valid style from whatever `value` holds — a stored record, a
 * partial override, garbage. Nothing at all (not an object) is the default
 * style. Otherwise missing or invalid fields come from the preset `value`
 * names (`classic`'s neutral values when it names none, so a style stored
 * before a field existed keeps the look it had), and `preset` is re-derived
 * from the result, so it can never claim a preset the fields left.
 */
declare function normalizeOpenLyricPowerPointSlideStyle(value: unknown): OpenLyricPowerPointSlideStyle;
/**
 * How the lyrics change between two lyric slides when only the text moves:
 * `transitionScope: 'text'` with any transition but None, Cut and Morph
 * (which holds the card still by itself). Its text effect and direction
 * (`getOpenLyricPowerPointTextAnimation`; Random picks one with `random`),
 * and half the transition's length for each half — the old lyrics leaving,
 * the new coming on — so the change takes as long as the transition would.
 * `null` when the whole slide moves.
 */
declare function getOpenLyricPowerPointTextTransition(style: Pick<OpenLyricPowerPointSlideStyle, 'transition' | 'transitionSpeed' | 'transitionDirection' | 'transitionScope'>, random?: () => number): OpenLyricPowerPointTextTransition | null;
/**
 * The deck's slide transition for `style`, as the writer takes it
 * (`./presentation.ts`), or `null` for none. Every slide gets it, so each one
 * morphs out of the one before — but for a lyric slide whose lyrics come on
 * by themselves (`getOpenLyricPowerPointTextTransition`), which cuts in.
 */
declare function toOpenLyricPowerPointTransition(style: Pick<OpenLyricPowerPointSlideStyle, 'transition' | 'transitionSpeed' | 'transitionDirection'>): OpenLyricPresentationTransition | null;
/**
 * The style the reader last exported with, or `null`. Best-effort, like every
 * preference the previews keep: storage that is missing, locked or holding
 * something else reads as "nothing saved".
 */
declare function readOpenLyricPowerPointSlideStyle(): OpenLyricPowerPointSlideStyle | null;
declare function writeOpenLyricPowerPointSlideStyle(style: unknown): void;
declare const OPEN_LYRIC_POWERPOINT_SAVED_PRESETS_STORAGE_KEY = "openLyric.powerPointPresets";
/**
 * Whether `a` and `b` make the same deck: every field alike, the font, the
 * picture and the transition included — a colour its fill leaves unused
 * aside.
 */
declare function isSameOpenLyricPowerPointSlideStyle(a: OpenLyricPowerPointSlideStyle, b: OpenLyricPowerPointSlideStyle): boolean;
/**
 * The reader's own slide styles (`../saved-presets.ts`): whole styles, the
 * font, picture and transition included — each picture kept once however many
 * presets show it.
 */
declare const openLyricPowerPointPresetStore: import("../saved-presets.js").OpenLyricSavedPresetStore<OpenLyricPowerPointSlideStyle>;
/**
 * What the reader chose slide by slide — the slides left empty, the speaker
 * notes, the empty slides added — by slide id (`<step>:<window>`, `'title'`,
 * `<id>+<n>`). They belong to one song, so unlike the style they are
 * kept per song, by its title.
 */
interface OpenLyricPowerPointSlideChoices {
    /** Lyric slides kept in the deck with their content left out. */
    omittedSlideIds: string[];
    /** Speaker notes, only the slides that have some. */
    slideNotes: Record<string, string>;
    /** How many empty slides follow a slide, only those followed by some. */
    blankSlidesAfter: Record<string, number>;
}
declare const OPEN_LYRIC_POWERPOINT_SLIDE_CHOICES_STORAGE_KEY = "openLyric.powerPointSlideChoices";
/** `value` as slide choices: anything malformed or empty dropped. */
declare function normalizeOpenLyricPowerPointSlideChoices(value: unknown): OpenLyricPowerPointSlideChoices;
/** The choices last exported with the song titled `song`. */
declare function readOpenLyricPowerPointSlideChoices(song: unknown): OpenLyricPowerPointSlideChoices;
declare function writeOpenLyricPowerPointSlideChoices(song: unknown, choices: unknown): void;
/**
 * The light/dark palette the slides are drawn in: the style's own pick, or
 * `previewThemeName` (the theme the preview is showing) for `'auto'`.
 */
declare function resolveOpenLyricPowerPointThemeName(style: OpenLyricPowerPointSlideStyle, previewThemeName: OpenLyricPowerPointThemeName): OpenLyricPowerPointThemeName;
/**
 * The deck palette for `style`: `previewTheme` (the surface's palette for the
 * theme on screen) under `'auto'`, the named palette otherwise, with the
 * style's own colours laid over it — so the title slide and the slide
 * background agree with the lyric slides. The card's fill colour stands in
 * for the surface (the title slide's info box).
 */
declare function resolveOpenLyricPowerPointDeckTheme(style: OpenLyricPowerPointSlideStyle, previewTheme: OpenLyricPowerPointTheme): OpenLyricPowerPointTheme;
/**
 * The sheet `style` lays over the export surface — only what differs from the
 * section card the preview draws, so `classic` (and any style that keeps its
 * look) adds nothing at all.
 *
 * `chunkIndex` selects one window of `linesPerSlide` lines; without it (or
 * with `linesPerSlide` at `0`) every line stays.
 */
declare function buildOpenLyricPowerPointSlideCss(style: OpenLyricPowerPointSlideStyle, { themeName, chunkIndex, isContentOmitted, isBackgroundOmitted, isTextOmitted, isCardOmitted, }?: {
    themeName?: OpenLyricPowerPointThemeName;
    chunkIndex?: number;
    /** A slide kept with nothing on it but the slide background. */
    isContentOmitted?: boolean;
    /**
     * The card and all it holds over a clear slide: the slide's fill left out,
     * for a deck that lays it as the slide background instead.
     */
    isBackgroundOmitted?: boolean;
    /** The card alone: its fill, frame and frost, with nothing it holds. */
    isTextOmitted?: boolean;
    /**
     * What the card holds alone: the card's fill, frame and frost made clear.
     * Paint only, so every line lands where it does on the whole card.
     */
    isCardOmitted?: boolean;
}): string;
/**
 * The element-map options one slide (or the preview thumbnail) is rendered
 * with. `classic` asks for exactly what the export always did.
 */
declare function buildOpenLyricPowerPointElementMapOptions(style: OpenLyricPowerPointSlideStyle, { themeName, chunkIndex, isContentOmitted, isBackgroundOmitted, isTextOmitted, isCardOmitted, key, pixelRatio, type, }?: {
    themeName?: OpenLyricPowerPointThemeName;
    chunkIndex?: number;
    isContentOmitted?: boolean;
    isBackgroundOmitted?: boolean;
    isTextOmitted?: boolean;
    isCardOmitted?: boolean;
    key?: string;
    pixelRatio?: number;
    type?: OpenLyricElementMapOptions['type'];
}): OpenLyricElementMapOptions;
interface OpenLyricPowerPointElementMapSource {
    getElementMap(options: OpenLyricElementMapOptions): Promise<Record<string, string>>;
}
interface OpenLyricPowerPointSlideImage {
    /** The slide's place in the deck — see {@link OpenLyricPowerPointPreviewSlide.id}. */
    id: string;
    /**
     * The picture laid over the whole slide, or `''` for none: an empty slide
     * and the title slide show the background alone.
     */
    imageData: string;
    /**
     * The style's own slide fill as a picture, for the slide's background, or
     * `''` for the theme's fill (the deck's solid background colour). The same
     * picture on every slide of the deck.
     */
    backgroundImageData: string;
    /**
     * With `transitionScope: 'text'`, the card alone, laid under `imageData`
     * (then the lyrics alone): one picture, the same on every lyric slide.
     * `''` otherwise, and on the title and empty slides.
     */
    cardImageData: string;
    /**
     * When only the text moves (`textTransition`): the lyrics of the slide
     * before, a lyric slide too, which leave as this one starts. `''`
     * otherwise.
     */
    previousImageData: string;
    /**
     * How this slide's lyrics take over from `previousImageData`'s, or `null`
     * when the slide comes on with the deck's transition.
     */
    textTransition: OpenLyricPowerPointTextTransition | null;
    sectionData: OpenLyricPowerPointSectionData;
    chunkIndex: number;
    totalChunks: number;
    /** Kept in the deck with its content left out (`omittedSlideIds`). */
    isContentOmitted: boolean;
    /** The slide's speaker notes (`slideNotes`), `''` for none. */
    notes: string;
    /**
     * The words `imageData` shows — the section's name, then its lines — for
     * screen readers (`describeOpenLyricPowerPointSlideText`); `''` for an empty
     * or title slide.
     */
    altText: string;
}
/** One lyric slide of the deck, as the options dialog lists it. */
interface OpenLyricPowerPointPreviewSlide {
    /**
     * The slide's place in the deck: `<step>:<window>`, the step its index in
     * the structure (`presentationData.sections`). Unique per slide — what
     * `omittedSlideIds` names.
     */
    id: string;
    /**
     * The part and the window: two slides with one key are one picture — the
     * same part sung again.
     */
    key: string;
    partName: string;
    chunkIndex: number;
    totalChunks: number;
}
/**
 * The title slide's id. A lyric window's is `<step>:<window>`; the empty
 * slides inserted after a slide are `<its id>+<n>`
 * ({@link getOpenLyricPowerPointBlankSlideId}).
 */
/**
 * `typography` with the style's font, if it names one, as the face of the
 * deck's text — the title slide's, which stays editable text. PowerPoint
 * takes one family name, so a stack gives its first.
 */
declare function withOpenLyricPowerPointFontFamily<T extends {
    chromeFontFace: string;
    lyricFontFace: string;
}>(typography: T, style: Pick<OpenLyricPowerPointSlideStyle, 'fontFamily'>): T;
declare const OPEN_LYRIC_POWERPOINT_TITLE_SLIDE_ID = "title";
/** The most empty slides one slide can be followed by. */
declare const OPEN_LYRIC_POWERPOINT_MAX_BLANK_SLIDES_AFTER = 10;
/** The id of the `index`th (from 1) empty slide inserted after `slideId`. */
declare function getOpenLyricPowerPointBlankSlideId(slideId: string, index: number): string;
/** A 480×270 thumbnail of the 1920×1080 slide. */
declare const OPEN_LYRIC_POWERPOINT_PREVIEW_PIXEL_RATIO = 0.25;
/** Non-blank lyric lines in one section's rendered HTML. */
declare function countOpenLyricPowerPointLines(html: string): number;
/**
 * The words of each line a slide counts in `html` — a part as the deck draws
 * it (`getElementMap` with `type: 'html'`) — in the order the slides window
 * them: the chord labels over the words, `{p:}` / `{c:}` cues and hidden
 * bars left out, a progression's own chords and a comment kept as shown.
 * `''` for a counted line with nothing left.
 */
declare function readOpenLyricPowerPointLineWords(html: string): string[];
/**
 * The sections the deck sets out in `style`, in order: the flow's, then —
 * unless `isWithNotes` is off — the song notes the Structure leaves out
 * (`isNote`), which the presentation data lists after it.
 */
declare function listOpenLyricPowerPointSections(presentationData: OpenLyricPowerPointPresentationData | null | undefined, style: Pick<OpenLyricPowerPointSlideStyle, 'isWithNotes'>): OpenLyricPowerPointSectionData[];
/**
 * `presentationData` with only the sections the deck sets out in `style` —
 * for the text slides, which walk the data themselves.
 */
declare function selectOpenLyricPowerPointSections<T extends OpenLyricPowerPointPresentationData>(presentationData: T, style: Pick<OpenLyricPowerPointSlideStyle, 'isWithNotes'>): T;
/**
 * The parts of `presentationData` the deck sets out in `style`, in the order
 * they are first sung, each once — what the map is keyed by, and what the
 * dialog's preview steps through.
 */
declare function listOpenLyricPowerPointParts(presentationData: OpenLyricPowerPointPresentationData | null | undefined, style: Pick<OpenLyricPowerPointSlideStyle, 'isWithNotes'>): OpenLyricPowerPointSectionData[];
/**
 * How many slides each part takes in `style`, by part name in first-sung
 * order: one each unsplit; split into windows of `linesPerSlide`, a part's
 * non-blank lines counted off an HTML map — the very markup the pictures are
 * taken of. A part the map has no section for takes none.
 */
declare function countOpenLyricPowerPointSlidesPerPart(source: OpenLyricPowerPointElementMapSource, presentationData: OpenLyricPowerPointPresentationData | null | undefined, style: OpenLyricPowerPointSlideStyle, { themeName, htmlByPart: renderedHtmlByPart, }?: {
    themeName?: OpenLyricPowerPointThemeName;
    /** The parts as HTML, when the caller has rendered them already. */
    htmlByPart?: Record<string, string>;
}): Promise<Map<string, number>>;
/**
 * The deck's lyric slides in `style`, in order — a part sung again comes round
 * again, under the same key — for the options dialog to list. Unsplit this
 * renders nothing; split, it is one HTML map.
 */
declare function listOpenLyricPowerPointPreviewSlides(source: OpenLyricPowerPointElementMapSource, presentationData: OpenLyricPowerPointPresentationData | null | undefined, style: OpenLyricPowerPointSlideStyle, options?: {
    themeName?: OpenLyricPowerPointThemeName;
}): Promise<OpenLyricPowerPointPreviewSlide[]>;
/**
 * A thumbnail of one slide in `style` — the map the export renders, scoped to
 * the slide's part and window and drawn at `pixelRatio` — or `null`.
 */
declare function renderOpenLyricPowerPointPreviewSlide(source: OpenLyricPowerPointElementMapSource, style: OpenLyricPowerPointSlideStyle, slide: Pick<OpenLyricPowerPointPreviewSlide, 'partName' | 'chunkIndex'> & {
    /** Draw the slide with its content left out: the slide background alone. */
    isContentOmitted?: boolean;
    /**
     * One layer of the slide, for a stage that moves the lyrics alone:
     * `'card'`, the slide with nothing on the card, or `'text'`, the lyrics
     * alone over a clear slide, each line where it is on the whole card.
     */
    layer?: 'card' | 'text';
}, { themeName, pixelRatio, }?: {
    themeName?: OpenLyricPowerPointThemeName;
    pixelRatio?: number;
}): Promise<string | null>;
/**
 * One picture per slide, in structure order: each section once per time it is
 * sung, split into windows of `linesPerSlide` lines when the style asks.
 *
 * Unsplit, the whole deck is one element map. Split, a first HTML map counts
 * each part's lines (the very markup the pictures are taken of), then each
 * window is a map scoped to its part, so every picture rendered is a slide.
 *
 * The slide's fill is the slide background, kept apart from the lyrics. A
 * fill of the style's own is drawn once, alone (the card and all it holds
 * hidden), as every slide's `backgroundImageData`. The sections are then
 * drawn without it: the card and its lyrics over a clear slide. So a viewer
 * that leaves slide backgrounds out shows the lyrics alone. A glass card is a
 * frosted picture of the fill behind it, so its pictures keep the fill. The
 * theme's fill needs no picture: it is the deck's solid colour, and the
 * section pictures are already clear around the card.
 *
 * With `transitionScope: 'text'` (and a transition other than Cut) the card
 * is kept apart from its lyrics too. It is drawn once, with nothing it holds, as every
 * lyric slide's `cardImageData` (a glass card with the fill it frosts). The
 * sections are then drawn with the card's paint made clear: the lyrics
 * alone, each line where it stands on the whole card. One picture for the
 * whole deck rather than one per part: the card is the slide's size whatever
 * it holds, but the theme tints its faint shadow by the section, and a card
 * that differs from slide to slide would move with the lyrics.
 */
declare function buildOpenLyricPowerPointStyledSlideImages(source: OpenLyricPowerPointElementMapSource, presentationData: OpenLyricPowerPointPresentationData | null | undefined, style: OpenLyricPowerPointSlideStyle, { themeName, omittedSlideIds, slideNotes, blankSlidesAfter, onProgress, }?: {
    themeName?: OpenLyricPowerPointThemeName;
    /**
     * Slides (`<step>:<window>`, as the dialog lists them) kept in the deck
     * with their content left out — the slide background alone.
     */
    omittedSlideIds?: Iterable<string>;
    /** Speaker notes by slide id, the empty slides' ids included. */
    slideNotes?: Readonly<Record<string, string>>;
    /**
     * Empty slides to put after a slide, by its id — the title slide's
     * (`'title'`) included.
     */
    blankSlidesAfter?: Readonly<Record<string, number>>;
    onProgress?: (done: number, total: number) => void;
}): Promise<OpenLyricPowerPointSlideImage[]>;
export { buildOpenLyricPowerPointElementMapOptions, buildOpenLyricPowerPointSlideCss, buildOpenLyricPowerPointStyledSlideImages, countOpenLyricPowerPointLines, readOpenLyricPowerPointLineWords, countOpenLyricPowerPointSlidesPerPart, createOpenLyricPowerPointSlideStyle, isSameOpenLyricPowerPointSlideStyle, listOpenLyricPowerPointParts, listOpenLyricPowerPointSections, listOpenLyricPowerPointPreviewSlides, matchOpenLyricPowerPointPreset, normalizeHexColor, normalizeOpenLyricPowerPointSlideStyle, openLyricPowerPointPresetStore, pickOpenLyricPowerPointOwnFields, selectOpenLyricPowerPointSections, toOpenLyricPowerPointTransition, OPEN_LYRIC_POWERPOINT_CARD_SIZE_RANGE, OPEN_LYRIC_POWERPOINT_MAX_PICTURE_LENGTH, OPEN_LYRIC_POWERPOINT_SHADE_RANGE, OPEN_LYRIC_POWERPOINT_MAX_BLANK_SLIDES_AFTER, OPEN_LYRIC_POWERPOINT_FONT_SIZE_RANGE, OPEN_LYRIC_POWERPOINT_LINES_PER_SLIDE_CHOICES, OPEN_LYRIC_POWERPOINT_PRESET_NAMES, OPEN_LYRIC_POWERPOINT_PRESETS, OPEN_LYRIC_POWERPOINT_SAVED_PRESETS_STORAGE_KEY, OPEN_LYRIC_POWERPOINT_PREVIEW_PIXEL_RATIO, OPEN_LYRIC_POWERPOINT_SLIDE_CHOICES_STORAGE_KEY, OPEN_LYRIC_POWERPOINT_SLIDE_STYLE_STORAGE_KEY, OPEN_LYRIC_POWERPOINT_TITLE_SLIDE_ID, getOpenLyricPowerPointBlankSlideId, getOpenLyricPowerPointTextTransition, normalizeOpenLyricPowerPointSlideChoices, readOpenLyricPowerPointSlideChoices, readOpenLyricPowerPointSlideStyle, renderOpenLyricPowerPointPreviewSlide, resolveOpenLyricPowerPointDeckTheme, resolveOpenLyricPowerPointThemeName, withOpenLyricPowerPointFontFamily, writeOpenLyricPowerPointSlideChoices, writeOpenLyricPowerPointSlideStyle, };
export type { OpenLyricPowerPointCardFill, OpenLyricPowerPointFill, OpenLyricPowerPointOwnFields, OpenLyricPowerPointSlideFill, OpenLyricPowerPointTransition, OpenLyricPowerPointTransitionSpeed, OpenLyricPowerPointTransitionScope, OpenLyricPowerPointGradient, OpenLyricPowerPointPattern, OpenLyricPowerPointPreviewSlide, OpenLyricPowerPointElementMapSource, OpenLyricPowerPointPresetName, OpenLyricPowerPointSlideChoices, OpenLyricPowerPointSlideImage, OpenLyricPowerPointSlideStyle, OpenLyricPowerPointStyleFields, OpenLyricPowerPointTextAlign, OpenLyricPowerPointThemeChoice, OpenLyricPowerPointVerticalAlign, };

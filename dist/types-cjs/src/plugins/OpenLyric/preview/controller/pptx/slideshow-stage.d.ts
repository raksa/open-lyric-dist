/**
 * The PowerPoint dialog's stage: the deck one slide at a time, the way it runs
 * when it is presented. Each step forward plays the deck's transition
 * (`./transition-preview.ts`); a step back cuts, as PowerPoint's does, and a
 * click during a transition ends it. **Present** fills the screen with the
 * stage — what the audience sees — and the slideshow keys move through it,
 * from black into the first slide shown and to an end screen after the last.
 *
 * The stage draws the slide list's own pictures: each slide is a copy of its
 * row's picture box, refreshed when the row's picture changes. Presenting, a
 * host can hand it sharper pictures for the full screen. While it presents,
 * a screen wake lock keeps the display from sleeping (`./screen-wake-lock.ts`).
 *
 * When only the lyrics move, a step into a lyric slide from the one before
 * plays as the deck does: the card holds still, the lyrics before leave the
 * way they came, then the slide's own come on — a build
 * (`playOpenLyricPowerPointTextBuild`), drawn from the host's pictures of
 * the card alone and of each slide's lyrics alone. Until those are drawn,
 * the whole slide moves.
 */
/** The transition into a slide. */
interface OpenLyricPowerPointStageTransition {
    type: string;
    direction?: string;
    durationMs: number;
    /**
     * When only the lyrics move: how they leave and come on between two lyric
     * slides (a text effect of `./transitions.ts`, each half `durationMs`).
     */
    text?: {
        effect: string;
        direction?: string;
        durationMs: number;
    } | null;
}
/** A lyric slide in two pictures, each a data URI: the card alone, the lyrics alone. */
interface OpenLyricPowerPointStageTextLayers {
    card: string;
    text: string;
}
/** Where the stage stands. */
interface OpenLyricPowerPointStageState {
    /** The slide shown, from 0. */
    index: number;
    /** How many slides the deck has. */
    count: number;
    isPresenting: boolean;
    /** Past the last slide, on the end screen. */
    isAtEnd: boolean;
}
interface OpenLyricPowerPointStageOptions {
    /** What Present fills the screen with; a click on it moves on. */
    screen: HTMLElement;
    /** The 16:9 box inside `screen` the slides are drawn in. */
    view: HTMLElement;
    /** The slide list: its rows, in deck order, are the slides. */
    list: HTMLElement;
    /** The transition into a slide, or `null` for none. */
    getTransition: () => OpenLyricPowerPointStageTransition | null;
    /**
     * A sharper picture of `row` for the full screen — a data URI — or `null`
     * while there is none yet; `onReady` is called once one lands.
     */
    getSharpPicture?: (row: HTMLElement, onReady: () => void) => string | null;
    /**
     * `row` in two pictures, for a transition that moves the lyrics alone, or
     * `null` — a row that is not a lyric slide, or whose pictures are not drawn
     * yet; `onReady` is called once they land.
     */
    getTextLayers?: (row: HTMLElement, onReady: () => void) => OpenLyricPowerPointStageTextLayers | null;
    /** Told whenever the slide shown, the deck or presenting changes. */
    onChange?: (state: OpenLyricPowerPointStageState) => void;
    /** The end screen's text. */
    endText?: string;
    /**
     * Whether motion is to be kept down — by default, what the system's
     * `prefers-reduced-motion` asks. While it is, a step cuts (a show starts
     * without fading in from black) and only {@link OpenLyricPowerPointStage.replay}
     * plays a transition, since that is asked for in so many words.
     */
    isMotionReduced?: () => boolean;
}
interface OpenLyricPowerPointStage {
    readonly index: number;
    readonly isPresenting: boolean;
    /** The next slide, with its transition; past the last, the end screen. */
    next(): void;
    /** The slide before, without a transition. */
    previous(): void;
    /** Slide `index`, with its transition unless `isAnimated` is false. */
    goTo(index: number, options?: {
        isAnimated?: boolean;
    }): void;
    /** The slide shown, coming on again from the one before (or black). */
    replay(): void;
    /** Fill the screen with the stage, the show starting from black. */
    present(): Promise<void>;
    /** Leave the full screen. */
    stop(): void;
    /**
     * Presenting, or just stopped: an Escape the dialog hears now was meant
     * for the show.
     */
    isEscapeForShow(): boolean;
    destroy(): void;
}
/** Does the system ask for less motion (`prefers-reduced-motion: reduce`)? */
declare function prefersOpenLyricReducedMotion(): boolean;
declare function createOpenLyricPowerPointStage({ screen, view, list, getTransition, getSharpPicture, getTextLayers, onChange, endText, isMotionReduced, }: OpenLyricPowerPointStageOptions): OpenLyricPowerPointStage;
export { createOpenLyricPowerPointStage, prefersOpenLyricReducedMotion };
export type { OpenLyricPowerPointStage, OpenLyricPowerPointStageOptions, OpenLyricPowerPointStageState, OpenLyricPowerPointStageTextLayers, OpenLyricPowerPointStageTransition, };

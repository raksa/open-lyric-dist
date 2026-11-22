/**
 * Transitions played in the browser: how the PowerPoint dialog's stage moves
 * from one slide to the next, as close to PowerPoint's own as a page draws
 * it.
 *
 * Each transition of the catalogue (`./transitions.ts`) is an effect: a
 * function from the transition's progress (0 to 1) to the styles of the two
 * slides, `in` (the slide coming on) and `out` (the one leaving). It moves,
 * fades and clips whole slides. The few that PowerPoint breaks into pieces
 * (Curtains, Doors, Window, Page curl, Fracture, Comb) take copies of a slide,
 * each clipped to its piece. `playOpenLyricPowerPointTransition` runs one
 * between two layers.
 *
 * These are previews: PowerPoint's 3D ones (Vortex, Origami, Airplane, …) are
 * drawn after their outline, not frame for frame.
 *
 * When only the lyrics move, a slide change is a *build* instead
 * (`playOpenLyricPowerPointTextBuild`): pictures inside one slide coming on
 * or leaving by a text effect (`getOpenLyricPowerPointTextAnimation` in
 * `./transitions.ts`) — the lyrics before leave, the effect played
 * backwards, then the slide's own come on — while the rest of the slide
 * holds still. As PowerPoint plays the deck's animations.
 *
 * The effects and the player are one self-contained engine
 * (`createOpenLyricTransitionEngine`): the HTML export writes its source into
 * the file it saves, so the slideshow there plays the very same transitions.
 */
/** One slide's look at one moment of a transition. */
interface OpenLyricTransitionLayerStyle {
    transform?: string;
    transformOrigin?: string;
    opacity?: number;
    clipPath?: string;
    filter?: string;
}
/** Both slides at one moment of a transition. */
interface OpenLyricTransitionFrame {
    in?: OpenLyricTransitionLayerStyle;
    out?: OpenLyricTransitionLayerStyle;
    /**
     * The incoming slide in pieces: one copy of it per entry, each under its
     * own style. The count stays the same through the transition.
     */
    inPieces?: OpenLyricTransitionLayerStyle[];
    /** The outgoing slide in pieces, the same way. */
    outPieces?: OpenLyricTransitionLayerStyle[];
    /** The outgoing slide drawn over the incoming one. */
    isOutOnTop?: boolean;
    /** A colour laid over both slides (Flash's white), and how much of it. */
    overlay?: {
        color: string;
        opacity: number;
    };
}
/** What an effect knows about the stage it plays on. */
interface OpenLyricTransitionContext {
    /** The stage, in CSS pixels. */
    width: number;
    height: number;
    /** The direction, resolved (`'u'`, `'horz'`, `'vert-out'`, …). */
    direction: string;
    /** Which way the slides move: `[x, y]`, each -1, 0 or 1 (y down). */
    vector: readonly [number, number];
    /** A number in [0, 1) for each index, the same all through one play. */
    random: (index: number) => number;
}
type OpenLyricTransitionEffect = (t: number, context: OpenLyricTransitionContext) => OpenLyricTransitionFrame;
/** A transition under way. */
interface OpenLyricPowerPointTransitionPlayback {
    /** The transition playing: Random's pick, for Random. */
    type: string;
    /** Settles once the incoming slide stands alone. */
    finished: Promise<void>;
    /** Jump to the end: the incoming slide shown, the outgoing one gone. */
    finish(): void;
}
interface OpenLyricPowerPointTransitionPlayOptions {
    /** A transition id of the catalogue; one it does not know plays as Fade. */
    type: string;
    /** The direction chosen; the transition's own default otherwise. */
    direction?: string;
    durationMs: number;
    /** Random numbers in [0, 1): Random's pick, and the pieces' order. */
    random?: () => number;
}
/** What the engine's `play` takes beyond the public options. */
interface OpenLyricTransitionEnginePlayOptions extends OpenLyricPowerPointTransitionPlayOptions {
    /**
     * The direction transition `type` plays in, given the `direction` chosen
     * — asked after Random has picked. Without it, `direction` as given.
     */
    resolveDirection?: (type: string, direction: string | undefined) => string;
    /** The class of the colour laid over both slides (Flash's white). */
    overlayClassName?: string;
}
/** One picture coming on, or leaving, in a build. */
interface OpenLyricTransitionBuildStep {
    /** The picture: absolutely placed over its slide, which holds still. */
    element: HTMLElement;
    /** A text effect of `./transitions.ts`; one the engine does not know fades. */
    effect: string;
    /** The way it moves coming on, in the transitions' terms. */
    direction?: string;
    durationMs: number;
}
/** The pictures of a slide that come on or leave as it starts. */
interface OpenLyricTransitionBuild {
    /** First, all together: each plays its effect backwards, then is hidden. */
    exits: OpenLyricTransitionBuildStep[];
    /** Then, all together: each hidden until it plays its effect. */
    entrances: OpenLyricTransitionBuildStep[];
}
/** The transitions: their effects, and a player for them. */
interface OpenLyricTransitionEngine {
    /** The context an effect plays in, in `direction` (resolved), on a `width` × `height` stage. */
    createContext(direction: string, width: number, height: number, seed?: number): OpenLyricTransitionContext;
    /** The effect a transition plays: its own, or Fade for one without. */
    getEffect(type: string): OpenLyricTransitionEffect;
    /** Whether `type` has an effect of its own (Random picks one). */
    hasEffect(type: string): boolean;
    /** Play a transition between two layers; see `playOpenLyricPowerPointTransition`. */
    play(view: HTMLElement, outgoing: HTMLElement | null, incoming: HTMLElement, options: OpenLyricTransitionEnginePlayOptions): OpenLyricPowerPointTransitionPlayback;
    /** Play a build; see `playOpenLyricPowerPointTextBuild`. */
    playBuild(view: HTMLElement, build: OpenLyricTransitionBuild, options?: {
        random?: () => number;
    }): OpenLyricPowerPointTransitionPlayback;
}
/**
 * The engine. Its body is self-contained — it names nothing from outside it
 * but the page's globals — because `String(createOpenLyricTransitionEngine)`
 * is the copy the HTML export runs. Keep it so: no imports, no module-level
 * names inside.
 */
declare function createOpenLyricTransitionEngine(): OpenLyricTransitionEngine;
/** The effect a transition plays: its own, or Fade for one without. */
declare function getOpenLyricPowerPointTransitionEffect(type: string): OpenLyricTransitionEffect;
/** Whether `type` has an effect of its own (Random picks one). */
declare function hasOpenLyricPowerPointTransitionEffect(type: string): boolean;
/** The context transition `type` plays in, in `direction` or its own default, on a `width` × `height` stage. */
declare function createOpenLyricTransitionContext(type: string, direction: string | undefined, width: number, height: number, seed?: number): OpenLyricTransitionContext;
/**
 * Play transition `type` in `view`, from `outgoing` (a layer already in it,
 * or none — then the incoming slide just shows) to `incoming` (likewise in
 * it, drawn after). Both are absolutely placed over the whole view. When it
 * ends — or `finish()` ends it — the outgoing layer and any pieces are gone
 * and the incoming layer is left as it was.
 */
declare function playOpenLyricPowerPointTransition(view: HTMLElement, outgoing: HTMLElement | null, incoming: HTMLElement, options: OpenLyricPowerPointTransitionPlayOptions): OpenLyricPowerPointTransitionPlayback;
/**
 * Play a build in `view`: the slide shown holds still while `exits` (its
 * pictures already showing — the lyrics before) leave, each its text effect
 * played backwards, and then `entrances` (hidden until then — its own
 * lyrics) come on. When it ends — or `finish()` ends it — every exit is
 * hidden (`visibility: hidden`) and every entrance shows as it is.
 */
declare function playOpenLyricPowerPointTextBuild(view: HTMLElement, build: OpenLyricTransitionBuild, options?: {
    random?: () => number;
}): OpenLyricPowerPointTransitionPlayback;
export { createOpenLyricTransitionEngine, createOpenLyricTransitionContext, getOpenLyricPowerPointTransitionEffect, hasOpenLyricPowerPointTransitionEffect, playOpenLyricPowerPointTextBuild, playOpenLyricPowerPointTransition, };
export type { OpenLyricTransitionBuild, OpenLyricTransitionBuildStep, OpenLyricTransitionEngine, OpenLyricTransitionEnginePlayOptions, OpenLyricPowerPointTransitionPlayback, OpenLyricPowerPointTransitionPlayOptions, OpenLyricTransitionContext, OpenLyricTransitionEffect, OpenLyricTransitionFrame, OpenLyricTransitionLayerStyle, };

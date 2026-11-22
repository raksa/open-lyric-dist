/**
 * Every slide transition PowerPoint offers, as the deck writes it — the one
 * catalogue the writer (`./presentation.ts`), the style (`./slide-style.ts`)
 * and the options dialog (`./style-dialog.ts`) all read.
 *
 * Each is PresentationML's own element inside `<p:transition>`: the ECMA-376
 * set (`p:`), the PowerPoint 2010 set (`p14:`), the PowerPoint 2013 presets
 * (`p15:prstTrans`) and Morph (`p159:morph`, PowerPoint 2019). The writer
 * wraps every one the way PowerPoint 2010 and later write theirs — an
 * `mc:AlternateContent` whose choice carries the length in `p14:dur` and
 * whose fallback is a fade — so a viewer that does not know one fades
 * instead of cutting.
 *
 * Directions are PresentationML's own `dir` values: the way the new slide
 * moves (`u` comes up from the bottom).
 */
/** Where a transition sits in the dialog's list, as PowerPoint groups them. */
type OpenLyricPowerPointTransitionGroup = 'subtle' | 'exciting' | 'dynamic';
/** The direction choices a transition takes. */
type OpenLyricPowerPointDirectionSet = 'side' | 'leftRight' | 'eight' | 'diagonal' | 'orientation' | 'inOut' | 'split' | 'center';
interface OpenLyricPowerPointTransitionSpec {
    /** The style's `transition` value. */
    id: string;
    /** Its name in the dialog. */
    label: string;
    group: OpenLyricPowerPointTransitionGroup;
    /** The qualified name of its element in `<p:transition>`. */
    tag: string;
    /** Fixed attributes of that element. */
    attributes?: Readonly<Record<string, string>>;
    /** The directions it takes, if any. */
    directions?: OpenLyricPowerPointDirectionSet;
    /** Its direction when the style names none it takes. */
    defaultDirection?: string;
    /**
     * Shown by Open Worship's converter (pptx-to-html-conv) as itself; the
     * others show there as the fallback fade.
     */
    isInOpenWorship?: boolean;
}
declare const OPEN_LYRIC_POWERPOINT_DIRECTION_SETS: Readonly<Record<OpenLyricPowerPointDirectionSet, ReadonlyArray<[string, string]>>>;
declare const OPEN_LYRIC_POWERPOINT_TRANSITION_GROUPS: ReadonlyArray<[
    OpenLyricPowerPointTransitionGroup,
    string
]>;
declare const OPEN_LYRIC_POWERPOINT_TRANSITION_SPECS: readonly OpenLyricPowerPointTransitionSpec[];
/** Every direction value any transition takes. */
declare const OPEN_LYRIC_POWERPOINT_TRANSITION_DIRECTIONS: readonly string[];
declare function getOpenLyricPowerPointTransitionSpec(id: unknown): OpenLyricPowerPointTransitionSpec | null;
/** The `[value, label]` directions transition `id` takes; none for most. */
declare function listOpenLyricPowerPointTransitionDirections(id: unknown): ReadonlyArray<[string, string]>;
/**
 * `direction` if transition `id` takes it, else its own default; `''` for a
 * transition with no direction.
 */
declare function resolveOpenLyricPowerPointTransitionDirection(id: unknown, direction: unknown): string;
/**
 * The PowerPoint version that first plays transition `id`: `0` for the
 * ECMA-376 set, which every version plays, 2010 for the `p14:` set, 2013 for
 * the presets, 2019 for Morph.
 */
declare function getOpenLyricPowerPointTransitionVersion(id: unknown): number;
/** How long transition `id` takes at `speed` (`med` and `medium` alike), in ms. */
declare function getOpenLyricPowerPointTransitionDurationMs(id: unknown, speed: unknown): number;
/**
 * How a slide's lyrics come on when only the text moves (Animate *Text
 * only*, every transition but Morph): one of PowerPoint's entrance
 * animations, which played backwards is its exit. The deck writes the
 * PowerPoint effect (`./presentation.ts`), and the dialog's stage and the HTML
 * export play the same one (`./transition-preview.ts`). Each is an effect
 * Open Worship's converter plays as well, Dissolve aside (a fade there).
 */
type OpenLyricPowerPointTextEffect = 'fade' | 'fly' | 'wipe' | 'split' | 'circle' | 'diamond' | 'plus' | 'randomBars' | 'clock' | 'wheel' | 'wedge' | 'dissolve' | 'checkerboard' | 'blinds' | 'strips' | 'zoom';
/** A text effect and the way it moves. */
interface OpenLyricPowerPointTextAnimation {
    effect: OpenLyricPowerPointTextEffect;
    /**
     * In the transitions' own terms: the way the lyrics move as they come on
     * (`u` comes up from the bottom), `horz` / `vert` bars, `vert-out` for a
     * split, a corner for strips; `''` for an effect without one.
     */
    direction: string;
}
/** The directions each text effect takes, its default first; none for most. */
declare const OPEN_LYRIC_POWERPOINT_TEXT_EFFECT_DIRECTIONS: Readonly<Record<OpenLyricPowerPointTextEffect, readonly string[]>>;
declare const OPEN_LYRIC_POWERPOINT_TEXT_EFFECTS: readonly OpenLyricPowerPointTextEffect[];
/** Each text effect's name, as PowerPoint's Animation pane has it. */
declare const OPEN_LYRIC_POWERPOINT_TEXT_EFFECT_LABELS: Readonly<Record<OpenLyricPowerPointTextEffect, string>>;
/** `direction` if text effect `effect` takes it, else its default; `''` for one without. */
declare function resolveOpenLyricPowerPointTextDirection(effect: unknown, direction: unknown): string;
/**
 * What transition `id` plays when only the lyrics move, in `direction` (the
 * one chosen for the transition) — or `null` for Morph, which holds the card
 * still by itself, for Cut and None, which change nothing gradually, and for
 * an id the catalogue does not know. Random picks a text effect, and a
 * direction it takes, with `random`.
 */
declare function getOpenLyricPowerPointTextAnimation(id: unknown, direction?: unknown, random?: () => number): OpenLyricPowerPointTextAnimation | null;
export { getOpenLyricPowerPointTextAnimation, getOpenLyricPowerPointTransitionDurationMs, getOpenLyricPowerPointTransitionSpec, getOpenLyricPowerPointTransitionVersion, listOpenLyricPowerPointTransitionDirections, OPEN_LYRIC_POWERPOINT_DIRECTION_SETS, OPEN_LYRIC_POWERPOINT_TEXT_EFFECT_DIRECTIONS, OPEN_LYRIC_POWERPOINT_TEXT_EFFECT_LABELS, OPEN_LYRIC_POWERPOINT_TEXT_EFFECTS, OPEN_LYRIC_POWERPOINT_TRANSITION_DIRECTIONS, OPEN_LYRIC_POWERPOINT_TRANSITION_GROUPS, OPEN_LYRIC_POWERPOINT_TRANSITION_SPECS, resolveOpenLyricPowerPointTextDirection, resolveOpenLyricPowerPointTransitionDirection, };
export type { OpenLyricPowerPointDirectionSet, OpenLyricPowerPointTextAnimation, OpenLyricPowerPointTextEffect, OpenLyricPowerPointTransitionGroup, OpenLyricPowerPointTransitionSpec, };

/**
 * Vertical rules — the column guides `Editor.setVerticalLines()` draws down the
 * editing surface (Monaco calls them "rulers").
 *
 * The one place the two editor surfaces agree on what a rule *is*, so a panel
 * renders the same guides whether the user is on Monaco or the Simple Editor
 * textarea. They are drawn by different mechanisms — Monaco has a first-class
 * `rulers` option, a textarea has none — so this module normalizes the host's
 * request once and then hands each surface the form it takes:
 *
 * - {@link toMonacoRulers} → the editor option (column + color).
 * - {@link buildVerticalLineWidthCss} → the CSS that thickens a rule, because
 *   Monaco's option has no width and renders every ruler exactly 1px wide.
 * - {@link buildVerticalLineBackground} → gradient layers a textarea paints
 *   its rules with, so no overlay element has to be positioned and scrolled.
 *
 * A column is counted in characters, as Monaco counts them: the width of one
 * `x` in the surface's font. On a proportional face that is an approximation —
 * the same approximation Monaco's own rulers make, which is what keeps the two
 * surfaces drawing the guide in the same place.
 */
/** One rule, as a host asks for it. */
export interface EditorVerticalLine {
    /** Column to draw at, counted in characters from the start of the line. */
    characters: number;
    /** Thickness in pixels. Defaults to 1 — the only width Monaco itself draws. */
    width?: number;
    /**
     * Any CSS color (`#000000FF`, `rgb(0 0 0 / 50%)`, a custom property).
     * Empty (the default) leaves each surface its own faint ruler color.
     */
    color?: string;
}
/** One rule after normalization — what {@link Editor.verticalLines} reports. */
export interface ResolvedEditorVerticalLine {
    characters: number;
    width: number;
    /** `''` means "the surface's own ruler color", never a literal color. */
    color: string;
}
/** The four longhands a textarea paints its rules with. */
export interface VerticalLineBackgroundStyle {
    backgroundImage: string;
    backgroundPosition: string;
    backgroundRepeat: string;
    backgroundSize: string;
}
/** Attribute stamped on the scope element the width CSS keys off. */
export declare const VERTICAL_LINES_SCOPE_ATTRIBUTE = "data-ol-vertical-lines";
/** A fresh per-instance scope id for {@link VERTICAL_LINES_SCOPE_ATTRIBUTE}. */
export declare function nextVerticalLinesScopeId(): string;
/**
 * Validate and order a host's rules: entries that name no usable column are
 * dropped, the rest are clamped the way Monaco clamps its own option and sorted
 * by column.
 *
 * Sorting here rather than leaving it to Monaco is what lets the width CSS
 * address a rule by position (`:nth-child`) — Monaco sorts the option itself,
 * so an already-sorted array reaches the DOM in exactly this order.
 *
 * A bare number is accepted as shorthand for `{ characters: n }`, as in
 * Monaco's own option.
 */
export declare function normalizeVerticalLines(input: unknown): ResolvedEditorVerticalLine[];
/** The rules as Monaco's `rulers` option (`null` color = its theme's own). */
export declare function toMonacoRulers(lines: readonly ResolvedEditorVerticalLine[]): Array<{
    column: number;
    color: string | null;
}>;
/**
 * CSS that gives Monaco's rulers the thickness its option cannot: each ruler is
 * a `1ch`-wide node whose visible line is a 1px inset box-shadow, both written
 * inline by Monaco — hence `!important`, the only way to reach an inline style.
 *
 * Rules of the default width produce nothing, so the common case injects no CSS
 * at all and Monaco renders exactly as it always did.
 *
 * `lines` must be in the order {@link normalizeVerticalLines} produced, since
 * that is the order the ruler nodes sit in.
 */
export declare function buildVerticalLineWidthCss(scopeSelector: string, lines: readonly ResolvedEditorVerticalLine[]): string;
/**
 * The rules as background layers for a textarea — one flat gradient per rule,
 * sized to its width and positioned at its column.
 *
 * A background rather than an overlay element deliberately: it needs no
 * wrapper, no `position` on anything the host owns, and no scroll syncing, and
 * it cannot come between the caret and a click. The layers are placed against
 * the padding box, so `textStartOffsetPx` is where the text itself begins
 * (the surface's left padding).
 *
 * Returns null when there is nothing to draw — no rules, or a character width
 * that could not be measured — which callers apply as "clear the background".
 */
export declare function buildVerticalLineBackground(lines: readonly ResolvedEditorVerticalLine[], characterWidthPx: number, textStartOffsetPx?: number): VerticalLineBackgroundStyle | null;
/**
 * The width of one character in `element`'s font, measured the way Monaco
 * measures its own: a run of `x` in the live page, divided by its length.
 *
 * Returns 0 when there is nothing to measure (no element, or a layout engine
 * that reports no width — jsdom), which callers read as "draw no rules" rather
 * than piling every rule at column 0.
 */
export declare function measureCharacterWidthPx(element: HTMLElement | null): number;
/** Where text starts inside `element` — its left padding, in pixels. */
export declare function measureTextStartOffsetPx(element: HTMLElement | null): number;

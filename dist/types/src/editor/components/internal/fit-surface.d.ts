/**
 * Fitting an export surface into a fixed height — what an image export with
 * a fixed size uses to keep a long song whole instead of cutting it off at
 * the bottom.
 *
 * The whole picture is drawn smaller, not just its text: a song view is more
 * than text (a title, pattern cards, section cards, chips — sized in their
 * own units), and shrinking the font alone leaves those as large as they
 * were. So the surface's children take a CSS `zoom`, which scales everything
 * in them at once, while their boxes still fill the surface's width — the
 * text rewraps to the wider room it now has. The surface itself keeps its
 * size and its padding (the margin an export asks for).
 *
 * The raster and the HTML serializer both copy computed styles, and a
 * browser reports lengths under a `zoom` UNzoomed — so their copies carry the
 * zoom once and draw the same picture.
 *
 * The surface is already staged and laid out, so the search is plain layout
 * work: set a zoom, read the height. No raster is drawn while searching.
 */
/** The smallest a fit draws the song, as a share of its own size. */
export declare const OPEN_LYRIC_MIN_FIT_SCALE = 0.25;
/**
 * Scale a computed `line-height` alongside a font-size change. Only a `px`
 * value needs it — those were resolved against the old size. `normal` and a
 * unitless ratio already follow the font size, so they are returned untouched.
 */
export declare function scaleLineHeight(lineHeight: string, ratio: number): string;
/**
 * Zoom `surface`'s children out until its laid-out height is at most
 * `height` CSS pixels, for the largest zoom (to a thousandth) that fits. It
 * never zooms in, and stops at {@link OPEN_LYRIC_MIN_FIT_SCALE} even if the
 * song still does not fit (the rest is then cut off, as without a fit).
 *
 * Returns the zoom it settled on, or `null` when the song already fitted and
 * nothing was changed.
 */
export declare function fitSurfaceToSize(surface: HTMLElement, height: number): number | null;

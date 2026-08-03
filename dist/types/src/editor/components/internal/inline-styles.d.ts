/**
 * Serialize a laid-out node as **self-contained** HTML: every element keeps its
 * tag, its classes, and every other attribute it had, and carries its own
 * resolved styles inline.
 *
 * This is what makes `getValue({ type: 'html' })` / `getElementMap({ type:
 * 'html' })` answer with the same thing `type: 'png-image'` draws. The PNG is
 * rasterized off an off-screen export surface staged inside a shadow root
 * (`export-stage.ts`), where the document's stylesheets have been replicated —
 * `html-to-image` then clones that surface with every computed style written
 * onto the clone, which is why the image looks right with no stylesheet
 * attached to it. An HTML getter that handed back the raw markup instead would
 * be describing the same song in a form that renders differently everywhere:
 * no export width, no `fontSize` / `theme` / `css` override, and nothing but
 * class names to carry the look. So the HTML getters serialize the SAME staged
 * node the rasterizer receives, through the same "inline what the browser
 * resolved" rule the raster is built on.
 *
 * What is deliberately NOT inlined: a property whose value the element already
 * inherits from its own parent **within this subtree**. The parent is part of
 * the returned string and carries the value, so inheritance reproduces it
 * exactly — while a `font-family` repeated on every lyric segment is most of
 * the output. The root element keeps everything, so the tree is anchored no
 * matter what document it is dropped into.
 *
 * What it cannot carry: the font FILES. The families are named exactly as they
 * resolved, but a document that ships neither the faces nor the plugin
 * stylesheet that declares them renders the fallback face — pair the HTML with
 * the plugin's font stylesheet when that matters. Pseudo-element content
 * (`::before` / `::after`) is not reproduced either; the Open Lyric song view
 * draws none, though the editor chrome around it does.
 */
/**
 * `node`'s HTML with its resolved styles written inline through the whole
 * subtree — the string form of what a rasterizer would draw from `node`.
 *
 * `node` has to be laid out (in the document, or in an off-screen stage) for
 * the browser to have styles to resolve; a detached node yields the markup with
 * whatever little `getComputedStyle` answers for it.
 */
export declare function serializeNodeWithInlineStyles(node: HTMLElement): string;
/**
 * A detached deep clone of `node` carrying its resolved styles inline. Every
 * attribute survives the copy (`class`, `data-ol-part-name`, `data-ol-theme`,
 * …) — the inline styles are added to the markup, they do not replace it.
 */
export declare function cloneWithInlineStyles(node: HTMLElement): HTMLElement;

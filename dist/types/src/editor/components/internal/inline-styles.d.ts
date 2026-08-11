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
 * What is deliberately NOT inlined:
 *
 * - **What the element inherits from its own parent within this subtree.** The
 *   parent is part of the returned string and carries the value, so inheritance
 *   reproduces it exactly — while a `font-family` repeated on every lyric
 *   segment is most of the output. The root keeps every inherited property,
 *   default or not, so the tree stays anchored against whatever the host
 *   document hands down to it.
 * - **What the element's tag resolves by DEFAULT.** `getComputedStyle` answers
 *   with the engine's entire property list — some 340 declarations per element
 *   in Chrome, nearly all of them untouched initial values (`unicode-bidi:
 *   normal`, `user-select: auto`, `trigger-scope: none`, every `mask-*`,
 *   `grid-*`, `animation-*`, …). Writing those out says nothing the receiving
 *   document's UA stylesheet does not already say, and buries the handful of
 *   declarations that DO carry the look. See {@link openDefaultStyleProbe} for
 *   how the default is measured rather than tabulated.
 * - **The logical half of a logical/physical pair.** The list carries both
 *   (`block-size` beside `height`, `padding-block-end` beside
 *   `padding-bottom`), and while the element's writing mode maps them onto each
 *   other one for one, the second copy says the first one again — see
 *   {@link LOGICAL_TWINS}.
 * - **A custom property the element merely inherits.** `var()` is substituted
 *   at computed-value time, so every value in the output is already resolved
 *   and nothing left in the markup reads a token. The page's whole `--*` theme
 *   set otherwise lands on the root, which is inherited-and-unused twice over;
 *   what an element declares itself is kept, since that IS the element.
 *
 * So what survives is what the author CSS — the preview stylesheet, the plugin
 * sheets, and the export's own `fontSize` / `theme` / `css` overrides —
 * actually contributed on top of a bare browser.
 *
 * The one thing that rule gives up: a host page that overrides a default for
 * OUR elements (a `* { box-sizing: border-box }` reset, say) now reaches the
 * serialized markup, where dumping every declaration would have shut it out.
 * That is the same deal every other element on that page gets, and it is what
 * "effective styles only" costs.
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

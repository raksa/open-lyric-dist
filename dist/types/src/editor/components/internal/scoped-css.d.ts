/**
 * Confine a host-supplied stylesheet to one element's subtree.
 *
 * The image getters' `css` override has to reach the off-screen export surface
 * and nothing else. The shadow root that surface is staged in (see
 * `export-stage.ts`) is what makes that airtight — a `<style>` inside a shadow
 * tree cannot style anything outside it. This is the second layer: within that
 * tree the surface shares the stage with the replicated document stylesheets,
 * and on the fallback path (an engine with no shadow DOM, where the stage IS
 * the live document) it is the only layer — there a plain `<style>` carrying
 * `.ol-song-view__section-title { display: none }` would repaint the visible
 * preview, and every other embed on the page, for the duration of the raster.
 *
 * The rewrite runs through the browser's own CSS parser rather than regexes
 * over the source text: the rules are parsed by a `<style>` element whose
 * `media` matches nothing (parsed, never applied), each selector is prefixed
 * with the scope, and the probe is dropped again.
 */
/**
 * Stamp `root` with a fresh scope marker and append a `<style>` carrying `css`
 * rewritten to apply inside `root` only. Returns the injected element (removed
 * with the root it lives in), or `null` when there is nothing to inject.
 *
 * The scoped sheet wins over the preview stylesheet by specificity, but NOT
 * over the inline styles the components set themselves (the chord and section
 * title colours); those take `!important` to override.
 */
export declare function attachScopedStyle(root: HTMLElement, css: string): HTMLStyleElement | null;
/**
 * `css` with every selector rewritten to match inside `scopeSelector` only.
 *
 * A selector that can attach to the scope root (`.card`, `[data-x]`, `:hover`)
 * yields both forms — `scope sel` and `scope+sel` — so a rule can restyle the
 * export surface itself as well as what it contains. A leading `&` names the
 * scope root explicitly.
 */
export declare function scopeCssText(css: string, scopeSelector: string, document_?: Document): string;

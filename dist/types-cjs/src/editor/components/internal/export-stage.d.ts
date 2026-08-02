/**
 * The off-screen stage the image getters lay out in — a **shadow root**.
 *
 * Rasterization needs a laid-out node, and only the live document lays nodes
 * out, so the export surface (and the virtual render root it mirrors) has to be
 * put on the page for the duration of the raster. Doing that in the light DOM
 * puts a second copy of the whole song into the document: its ids collide with
 * the live preview's, page rules and host `css` overrides reach across, and
 * anything watching the document — a `MutationObserver`, a `querySelector` that
 * expects one `.ol-song-view`, an `:nth-child` rule — sees the staged markup.
 *
 * So the stage host attaches a shadow root and the node goes inside it. Nothing
 * staged is reachable from `document.querySelector`, no id can collide, and no
 * rule written for the export can escape to the visible preview.
 *
 * The cost of that boundary is the cascade: document stylesheets do not cross
 * into a shadow root, and an unstyled surface would rasterize as unstyled text.
 * {@link replicateDocumentStyles} carries them over, so the staged node resolves
 * exactly the styles it would have in the light DOM:
 *
 * - `<style>`-backed sheets are copied into **constructed** stylesheets and
 *   adopted — parsed once and cached per source sheet, since a page carrying
 *   Monaco's stylesheet would otherwise re-parse it on every export.
 * - `<link>`-backed sheets have their element **cloned** instead. A linked sheet
 *   resolves its `url(…)` assets against its own address, so re-serializing its
 *   rules into a constructed sheet would re-base them on the document and 404
 *   (this is exactly the case `injectStylesheetLinkOnce` exists for — the
 *   plugin-shipped script fonts). The clone re-fetches from cache; the load is
 *   awaited through {@link waitForStageStyles}.
 * - Custom properties need no help: `:root` cannot match inside a shadow tree,
 *   but `--ol-*` are inherited properties, so they flow from `<html>` through
 *   the stage host and across the boundary on their own.
 *
 * Where shadow DOM is unavailable (an old engine, a DOM shim), the node is
 * staged in the host element itself and the previous light-DOM behaviour stands
 * — the id stripping and the CSS scoping the callers already do keep that path
 * as safe as it was.
 */
/**
 * Mount `node` far off-screen so it lays out for rasterization, inside a shadow
 * root carrying the document's styles. Returns the stage host — `remove()` it
 * to take the whole stage, shadow root and all, back out.
 */
export declare function mountOffscreen(node: HTMLElement): HTMLElement;
/**
 * Resolve once every stylesheet the stage cloned has loaded — so a caller that
 * is about to measure (`getComputedStyle`, `offsetWidth`) or rasterize sees the
 * finished cascade rather than a half-styled surface. Resolves immediately when
 * nothing had to be cloned, which is the common case.
 */
export declare function waitForStageStyles(stage: HTMLElement): Promise<void>;

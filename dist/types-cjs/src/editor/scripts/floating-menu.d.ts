/**
 * Viewport-anchored positioning for the chrome's dropdown panels.
 *
 * Every popup panel the editor opens — the preview settings popup, the `⋮`
 * options menus, the topbar actions menu, the topbar info disclosure — used to
 * be `position: absolute` inside the wrapper that holds its trigger. That is
 * fine on our own pages, where the wrapper's panel is tall enough, but it makes
 * the panel a hostage of every ancestor's `overflow`: embed an `Editor` or an
 * `OpenLyric` preview in a host UI whose column scrolls or clips, and the menu
 * is cut off at the container edge instead of floating over it.
 *
 * So the panels are `position: fixed` and this module places them: measure the
 * trigger, place the panel just below it (flipping above when the space below
 * is both too small and smaller than the space above), clamp into the viewport,
 * and cap `max-height` to the room actually available so a long menu scrolls
 * rather than running off-screen.
 *
 * `openFloatingMenu()` also keeps the panel glued to its trigger while it is
 * open — a page scroll, a window resize, or a panel drag-resize repositions it
 * instead of leaving it stranded (a fixed box does not scroll with its anchor).
 *
 * The same shape as `positionDeclarePartPopup()` in the Open Lyric preview's
 * `config-popups.ts`, which has always positioned its body-level popups this
 * way; these panels stay in their wrapper (so the `contains()`-based focusout
 * and outside-pointerdown checks still see them) and only borrow the geometry.
 *
 * ## The `position: fixed` escape hatch has one requirement
 *
 * A fixed box escapes ancestor clipping only while no ancestor establishes a
 * containing block for it — `transform`, `filter`, `backdrop-filter`,
 * `perspective`, `will-change`, `contain: layout|paint`, and `container-type`
 * all do. Our own chrome is kept clear of those on the menus' ancestors (see
 * the note on `.preview-panel__body--floating-tools` in
 * `_preview-panel-chrome.scss`); a host page that wraps an embed in a
 * transformed element is beyond what CSS can rescue.
 */
/** Gap kept between a panel and the viewport edge. */
declare const FLOATING_MENU_MARGIN_PX = 8;
/** Gap between a panel and the trigger it hangs off. */
declare const FLOATING_MENU_OFFSET_PX = 6;
/**
 * `'end'` pins the panel's right edge to the anchor's right edge (the default —
 * these triggers sit at the right of their toolbars), `'start'` its left edge
 * to the anchor's left edge.
 */
type FloatingMenuAlign = 'start' | 'end';
interface FloatingMenuOptions {
    align?: FloatingMenuAlign;
    offsetPx?: number;
    marginPx?: number;
}
/**
 * Whether the panel is actually floating right now.
 *
 * The stylesheet — not this module — decides: `.topbar-meta__content` is only
 * `position: fixed` in the stacked (mobile) layout, and an embed that failed to
 * load our stylesheet gets no inline geometry rather than a panel pinned to the
 * top-left corner.
 */
declare function isFloatingMenu(menu: Element): boolean;
/** Drop the geometry so the panel measures naturally the next time it opens. */
declare function clearFloatingMenuPosition(menu: Element | null | undefined): void;
/**
 * Place `menu` against `anchor` in viewport coordinates.
 *
 * The panel must already be visible (`hidden = false`) — it is measured, so an
 * unrendered box would report a zero rect. Returns whether geometry was
 * written.
 */
declare function positionFloatingMenu(menu: Element | null | undefined, anchor: Element | null | undefined, options?: FloatingMenuOptions): boolean;
/** Re-place every panel currently open, dropping any that left the document. */
declare function repositionOpenFloatingMenus(): void;
/**
 * Position `menu` against `anchor` and keep it there until
 * `closeFloatingMenu()`.
 *
 * Call it *after* revealing the panel (`menu.hidden = false`), and pair every
 * call with `closeFloatingMenu()` in the matching close path.
 */
declare function openFloatingMenu(menu: Element | null | undefined, anchor: Element | null | undefined, options?: FloatingMenuOptions): boolean;
/** Stop tracking `menu` and (unless told otherwise) drop its geometry. */
declare function closeFloatingMenu(menu: Element | null | undefined, options?: {
    keepPosition?: boolean;
}): void;
export { FLOATING_MENU_MARGIN_PX, FLOATING_MENU_OFFSET_PX, clearFloatingMenuPosition, closeFloatingMenu, isFloatingMenu, openFloatingMenu, positionFloatingMenu, repositionOpenFloatingMenus, };
export type { FloatingMenuAlign, FloatingMenuOptions };

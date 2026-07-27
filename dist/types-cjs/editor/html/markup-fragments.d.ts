/**
 * Shared helpers for installing static shell markup from `?raw` HTML
 * fragments into `<template id="…Mount">` placeholders. Deliberately
 * dependency-free (no `shared.ts`): each surface class wraps its installer
 * in a static `installShellMarkup()` that runs before the app boots and
 * then refreshes the app's captured element refs (`refreshElementRefs`).
 */
declare function createHtmlFragment(html: string): DocumentFragment;
/**
 * Look up a shell element by its `data-ol-ref` handle.
 *
 * The fragments carry no `id` at all — a page-global id in reusable markup
 * makes a second instance illegal on arrival, so every JS handle is an
 * instance-agnostic attribute instead. `root` is what scopes a lookup to one
 * instance; it defaults to the document for the wrap-phase single-instance
 * app. (The ids the fragments still *reference* — `for`, `aria-controls`,
 * `aria-labelledby` — are generated per install by `linkFragmentIds()`.)
 */
declare function queryRef<T extends Element = HTMLElement>(name: string, root?: ParentNode): T | null;
/**
 * Replace the `data-ol-mount="<name>"` template with the fragment, unless the
 * element it installs (`data-ol-ref="<existingRefName>"`) is already present
 * — idempotent across double calls and pages that inline the markup
 * statically.
 */
declare function replaceMountWithFragment(mountName: string, existingRefName: string, html: string, root?: ParentNode): void;
/**
 * Style scopes for the four components' roots — the runtime mirror of
 * `editor/styles/_scopes.scss`. Every app-page rule a component owns is
 * emitted under one of these classes, so a root without its class renders
 * unstyled.
 */
declare const OPEN_LYRIC_SCOPE_CLASS: {
    readonly dashboard: "ol-dashboard";
    readonly editor: "ol-editor-panel";
    readonly lyric: "ol-lyric-panel";
    readonly markdown: "ol-markdown-panel";
};
/**
 * Re-assert a component's scope class on its root. The shipped fragments (and
 * the page markup for `#app`) already carry it — this is the safety net for a
 * host that inlines the panel markup by hand, in which case
 * {@link replaceMountWithFragment} skips the install entirely and the class
 * would otherwise never be applied.
 */
declare function ensureScopeClass(refName: string, scopeClass: string, root?: ParentNode): void;
/**
 * Attributes that must hold a real element **id**, so the browser can wire the
 * relationship the markup describes: label→control activation, the Bootstrap
 * `btn-check` radios (whose `<label for>` IS the visible control), the
 * datalist binding, and the accessibility relationships screen readers follow.
 */
declare const ID_REFERENCE_ATTRIBUTES: readonly ["for", "list", "aria-controls", "aria-labelledby", "aria-describedby"];
/**
 * Give every element that another element *points at* a unique id, and rewrite
 * the pointers to match.
 *
 * This is what lets the fragments ship with no ids while keeping the markup's
 * semantics. In the files, a pointer still names its target by that target's
 * `data-ol-ref` handle (`for="simpleEditorToggle"` → the control carrying
 * `data-ol-ref="simpleEditorToggle"`). At install time this resolves each
 * pointer inside `root`, mints one collision-proof id per target
 * (`ol-<n>-<handle>`), and points the attribute at it — so a second instance
 * on the same page gets its own ids and its labels activate its own controls,
 * instead of both instances fighting over one global name.
 *
 * Runs after ALL of an instance's fragments are installed: pointers cross
 * fragment boundaries (the topbar's `aria-controls="editorPanel"` targets the
 * separately installed editor panel). Idempotent — a target that already has
 * an id keeps it.
 */
declare function linkFragmentIds(root?: ParentNode): void;
export { createHtmlFragment, ensureScopeClass, ID_REFERENCE_ATTRIBUTES, linkFragmentIds, OPEN_LYRIC_SCOPE_CLASS, queryRef, replaceMountWithFragment, };

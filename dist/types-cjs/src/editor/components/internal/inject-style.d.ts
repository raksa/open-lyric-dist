/**
 * Inject a `<style>` element carrying `css` into `document.head` exactly once,
 * keyed by `id`: a second call with the same id is a no-op, so any number of
 * component instances can call it and share a single stylesheet node.
 *
 * SSR-safe (embedding rule 6): with no `document` it does nothing and never
 * throws, so component constructors/mounts can call it unconditionally.
 *
 * The node is kept for the lifetime of the page — with the sheet shared across
 * instances there is no single owner to remove it, and re-injection is cheap to
 * guard against. App pages that already ship the same rules via their own
 * stylesheet just carry a harmless duplicate.
 */
export declare function injectStyleOnce(id: string, css: string): void;
/**
 * Link a stylesheet URL into `document.head` exactly once, keyed by `id` — the
 * `<link>` twin of {@link injectStyleOnce}, with the same guarantees (SSR-safe,
 * idempotent, node kept for the page's lifetime).
 *
 * For sheets that have to stay a real stylesheet request rather than inlined
 * CSS text: a compiled sheet resolves its `url(…)` assets against the
 * stylesheet's own address, so inlining one into a `<style>` would resolve
 * those paths against the document instead and 404. It also keeps the rules out
 * of the JS bundle, which is how the plugin registry ships its own faces.
 *
 * The core's own Latin faces are the exception that proves the rule: they are
 * generated in TypeScript with absolute `url(…)` (`styles/google-sans-font.ts`),
 * which is exactly what frees them to go through {@link injectStyleOnce} — and
 * to be inlined into a print window, which no linked sheet could be.
 */
export declare function injectStylesheetLinkOnce(id: string, href: string): void;

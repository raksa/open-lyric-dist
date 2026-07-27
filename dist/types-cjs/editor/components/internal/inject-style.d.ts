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

/**
 * `open-lyric`'s own version, read from this package's `package.json`.
 *
 * The manifest is the single source of truth — importing it (rather than
 * restating the number here) makes it impossible for the exported value to
 * drift from what `npm run pack` archives and publishes.
 *
 * The import is a NAMED one on purpose. Vite's JSON plugin compiles a small
 * manifest to one `export const` per top-level key plus a default export of
 * the whole object, so `import manifest from …` pins that object and inlines
 * every field — the dependency ranges, the keywords, all of it — into the
 * shipped bundle. Taking `version` alone lets the rest tree-shake away.
 * (The plugin only emits those named exports while it leaves the JSON
 * unstringified, which it does below a 10 kB manifest; a manifest that ever
 * grew past that would fail this import at build time, loudly.)
 *
 * The explicit `: string` annotation is for the declaration emit: without it
 * `tsc` would widen the literal into the `.d.ts` and reference a JSON module
 * that is not part of the published `dist/`.
 */
export declare const version: string;

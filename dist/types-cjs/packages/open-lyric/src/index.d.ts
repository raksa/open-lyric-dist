/**
 * `open-lyric` — the public entry point.
 *
 * Deliberately a re-export of the in-repo barrel rather than a copy: the
 * component layer described in `research/editor-structure-implemented.md`
 * (§"Exposed components") IS the package surface, so the app pages and the
 * published package can never drift.
 */
export * from '../../../editor/components/index.js';

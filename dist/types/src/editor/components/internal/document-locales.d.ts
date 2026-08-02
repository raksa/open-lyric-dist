/**
 * The locales a document declares — the `Locales` field of its `ol:Config`
 * fence, in the order written.
 *
 * This is the seam that keeps a language plugin's font off documents that are
 * not in its language: a plugin claims locales, the document declares them,
 * and the preview matches the two ({@link documentDeclaresLocale}) instead of
 * restyling every document the moment the plugin is composed.
 *
 * Reads the first `Locales` entry only — a second one is a duplicate-field
 * error the validator already reports, and the first is the one it keeps.
 */
declare function getDocumentLocales(value: string): string[];
/**
 * Whether two locale tags mean the same language for styling purposes:
 * equal ignoring case, or one a subtag-boundary prefix of the other — so a
 * document that declares `km` still matches a plugin keyed `km-KH`, and a
 * plugin keyed `km` still matches a `km-KH` document.
 */
declare function localesMatch(documentLocale: string, claimedLocale: string): boolean;
/** True when the document declares any of the locales a plugin claims. */
declare function documentDeclaresLocale(documentLocales: readonly string[], claimedLocales: readonly string[]): boolean;
export { documentDeclaresLocale, getDocumentLocales, localesMatch };

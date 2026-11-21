/**
 * How a misspelling reads — in a marker message and in a quick-fix title.
 * Dependency-free on purpose: the VS Code extension host formats its
 * spellcheck diagnostics with these without loading any of the editor core.
 *
 * Languages that separate words with an invisible character
 * (`hasInvisibleWordSeparators`, Khmer's ZWSP) get the word spelled out, with
 * ZWSP / ZWNJ / ZWJ shown as `[ZWSP]` / `[ZWNJ]` / `[ZWJ]`.
 */
declare function formatSpellcheckSuggestionDisplayText(suggestion: any): string;
/** How a flagged word appears in a misspelling message. */
declare function formatSpellcheckMarkerMessageWord(word: any, hasInvisibleWordSeparators?: boolean): string;
/** A quick-fix title for one suggestion (see {@link formatSpellcheckMarkerMessageWord}). */
declare function formatSpellcheckSuggestionLabel(suggestion: any, hasInvisibleWordSeparators?: boolean): string;
declare function formatAddToCustomDictionaryLabel(word: any): string;
export { formatAddToCustomDictionaryLabel, formatSpellcheckMarkerMessageWord, formatSpellcheckSuggestionDisplayText, formatSpellcheckSuggestionLabel, };

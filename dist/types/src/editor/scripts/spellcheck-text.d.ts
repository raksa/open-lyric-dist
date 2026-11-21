import { type SpellcheckNotationSplice } from './spellcheck-notation.js';
/** Config fields whose values are notation or identifiers, never prose. */
declare const SPELLCHECK_SKIPPED_CONFIG_FIELDS: Set<string>;
interface SpellcheckIgnoredRange {
    start: number;
    end: number;
}
/**
 * Receives one stretch of checkable text: `text` starts at 1-based
 * `columnOffset` on `lineNumber`. Words overlapping `ignoredRanges` (offsets
 * into `text`) are links, code or directives — not words. `notationRanges` are
 * chord annotations and bar markers a word reads *through*: they are left out
 * before words are matched, so `ឧ|[D]ត្តម` is the one word `ឧត្តម`.
 */
type SpellcheckSegmentVisitor = (text: string, lineNumber: number, columnOffset: number, ignoredRanges: SpellcheckIgnoredRange[], notationRanges: SpellcheckIgnoredRange[]) => void;
interface SpellcheckTokenPattern {
    languageCode: string;
    pattern: RegExp;
}
interface SpellcheckOccurrence {
    languageCode: string;
    /** The word as read — notation inside it left out. */
    word: string;
    lineNumber: number;
    /** 1-based, inclusive. */
    startColumn: number;
    /** 1-based, exclusive. The range covers any notation inside the word. */
    endColumn: number;
    /**
     * The notation inside the range, by offset into `word` — present only when
     * there is some. `restoreSpellcheckNotation` puts it back into a
     * replacement.
     */
    notation?: SpellcheckNotationSplice[];
}
/** One word {@link matchSpellcheckWords} found — offsets into the scanned text. */
interface SpellcheckWordMatch {
    word: string;
    start: number;
    /** Exclusive; covers any notation inside the word. */
    end: number;
    notation: SpellcheckNotationSplice[];
}
declare function overlapsIgnoredRange(start: any, end: any, ranges: any): any;
/**
 * Every match of `pattern` (global) in `text` that is a word to check. The
 * text is read with `notationRanges` left out, so notation written mid-word
 * joins the two halves; a match overlapping `ignoredRanges` is dropped.
 */
declare function matchSpellcheckWords(text: string, pattern: RegExp, ignoredRanges?: readonly SpellcheckIgnoredRange[], notationRanges?: readonly SpellcheckIgnoredRange[]): SpellcheckWordMatch[];
/**
 * Walk a document's lines fence by fence and hand every checkable stretch of
 * text to `visit`: markdown prose (minus code, links, URLs, HTML), lyric and
 * free-text lines (minus `{directives}`, read through `[chords]` and `|` bar
 * markers), sung outro lines, and prose config values. Generic code fences
 * and notation-only config fields are skipped. `targetLineNumbers` limits
 * which lines are visited while still tracking fence state from the top of the
 * document.
 */
declare function visitSpellcheckSegments(lines: readonly string[], visit: SpellcheckSegmentVisitor, targetLineNumbers?: Set<number> | null): void;
declare function getGlobalPattern(pattern: RegExp): RegExp;
/**
 * Every word of every given language in the document's checkable text, in
 * document order — the occurrence list a host checks against its providers.
 */
declare function collectSpellcheckOccurrences(lines: readonly string[], tokenPatterns: readonly SpellcheckTokenPattern[]): SpellcheckOccurrence[];
export { collectSpellcheckOccurrences, getGlobalPattern, matchSpellcheckWords, overlapsIgnoredRange, SPELLCHECK_SKIPPED_CONFIG_FIELDS, visitSpellcheckSegments, };
export type { SpellcheckIgnoredRange, SpellcheckOccurrence, SpellcheckSegmentVisitor, SpellcheckTokenPattern, SpellcheckWordMatch, };

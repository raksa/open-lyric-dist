/**
 * Notation inside a sung word. A chord annotation or a bar marker written
 * mid-word — `ឧ|[D]ត្តម`, `be[C]cause` — marks where the chord or the bar
 * lands; the word sung is the text on either side of it, joined. Spellcheck
 * reads that joined word (`ឧត្តម`, `because`) and, when a quick fix writes a
 * replacement over the word, puts the notation back into it — a fix never
 * drops a chord.
 *
 * Imports nothing: the editor's scan (`spellcheck-text.ts`) and quick fixes
 * use it, and so does the VS Code extension host, which loads none of the
 * editor's DOM modules.
 */
/** A stretch of a text — UTF-16 offsets, `end` exclusive. */
interface SpellcheckTextRange {
    start: number;
    end: number;
}
/** Notation set aside from a word: `offset` counts the word's UTF-16 units before it. */
interface SpellcheckNotationSplice {
    offset: number;
    text: string;
}
/** A text with notation set aside — see {@link joinAroundNotation}. */
interface SpellcheckJoinedText {
    /** The text without the notation. */
    text: string;
    /** For each UTF-16 unit of `text`, its offset in the source. */
    sourceOffsets: number[];
    /** Each range set aside: where it sat in `text`, and its source range. */
    splices: (SpellcheckNotationSplice & SpellcheckTextRange)[];
}
/**
 * The lyric notation a word reads through: `[…]` chord annotations (any
 * bracket pair on one line — judging the chord is the validator's job) and the
 * bar tokens `|`, `||`, `|:`, `:|`, `||:`, `:||`.
 */
declare const LYRIC_INLINE_NOTATION_RE: RegExp;
/** The inline notation ranges of one lyric line (see {@link LYRIC_INLINE_NOTATION_RE}). */
declare function findLyricNotationRanges(text: string): SpellcheckTextRange[];
/**
 * `source` with `ranges` taken out, so the text on either side of each range
 * joins up. Overlapping or empty ranges are skipped.
 */
declare function joinAroundNotation(source: string, ranges: readonly SpellcheckTextRange[]): SpellcheckJoinedText;
/** Splices at the same offset become one (`|` + `[D]` → `|[D]`), in order. */
declare function mergeNotationSplices(splices: readonly SpellcheckNotationSplice[]): SpellcheckNotationSplice[];
/**
 * A flagged word as it stands in the document (`ឧ|[D]ត្តម`) split into the
 * word read (`ឧត្តម`) and the notation inside it. Text without notation comes
 * back as is, with no splices.
 */
declare function splitSpellcheckNotation(text: string): {
    word: string;
    notation: SpellcheckNotationSplice[];
};
/**
 * `replacement` for `word`, with the notation that sat inside the word put
 * back — the text a quick fix writes over the flagged range. Without notation
 * the replacement is returned unchanged.
 *
 * `restoreSpellcheckNotation('ឧត្តម', 'ឧ​ត្តម', [{ offset: 1, text: '|[D]' }])`
 * → `'ឧ​|[D]ត្តម'`.
 */
declare function restoreSpellcheckNotation(word: string, replacement: string, notation: readonly SpellcheckNotationSplice[] | null | undefined): string;
export { findLyricNotationRanges, joinAroundNotation, LYRIC_INLINE_NOTATION_RE, mergeNotationSplices, restoreSpellcheckNotation, splitSpellcheckNotation, };
export type { SpellcheckJoinedText, SpellcheckNotationSplice, SpellcheckTextRange, };

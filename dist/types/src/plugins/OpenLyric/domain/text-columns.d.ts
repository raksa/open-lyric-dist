/**
 * Columns in Open Lyric's plain-text layout, where a chord row sits over its
 * lyric line in a monospace font. A chord's column is where its syllable
 * starts *on screen*, not its UTF-16 index: marks that sit on a letter
 * (Khmer vowel signs above or below, Thai tone marks, decomposed accents),
 * invisible format characters (the zero-width word break U+200B, ZWNJ, ZWJ)
 * and a Khmer subscript consonant — written COENG (U+17D2) + consonant,
 * drawn under the letter before — take no column of their own. Every other
 * character takes one.
 *
 * The text renderer measures with {@link getTextColumnWidth} and the
 * plain-text import maps back with {@link getIndexAtTextColumn}, so a song
 * rendered to text and imported again keeps its chords on their syllables.
 */
/** The columns a text takes in a monospace chord-over-lyric layout. */
declare function getTextColumnWidth(text: string): number;
/**
 * The UTF-16 index in `text` where something placed at `column` goes: before
 * the first character that starts at or after that column — never between a
 * letter and the marks drawn on it. Past the end of the text, the text's
 * length (the caller pads to reach the column).
 */
declare function getIndexAtTextColumn(text: string, column: number): number;
export { getIndexAtTextColumn, getTextColumnWidth };

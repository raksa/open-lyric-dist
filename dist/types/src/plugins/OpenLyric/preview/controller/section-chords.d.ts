/**
 * The chord picker inside the in-preview section editor.
 *
 * A reader editing a section's lyrics in the markdown preview should not have
 * to know that a chord is written `[C#m]`. The "Insert chord" button under the
 * section textarea opens a panel of chords to tap — the ones the song already
 * uses, the chords of the song's key, and a root + quality + bass builder for
 * anything else — and a tap writes the chord *into the textarea* at the caret.
 *
 * Nothing here touches the document. The textarea is the section editor's
 * draft; the reader's Save is still the one write-back
 * (`section-editing.ts` → `replaceDocumentLineRange`), so a chord inserted and
 * saved is one undo step together with the rest of the edit, and Cancel
 * throws it away like any other typing.
 *
 * Notation is decided by the section (`OLFenceDefinition
 * .getPreviewChordInsertStyle`, carried on the pencil as
 * `data-preview-chord-style`): lyric bodies get `[G]` before the syllable, a
 * progression body gets a bare, space-separated `G`, and a mixed body decides
 * per line. The caret sitting on an existing chord swaps that chord rather
 * than stacking a second one on the same syllable.
 */
type ChordInsertStyle = 'annotation' | 'progression' | 'mixed';
type ChordInsertion = {
    text: string;
    start: number;
    end: number;
    insertText: string;
    caret: number;
    replaced: string;
};
/**
 * The builder's qualities. Each suffix is one decoration group the chord
 * grammar accepts on its own, so root + quality + optional bass is always a
 * valid chord symbol.
 */
declare const CHORD_QUALITIES: {
    suffix: string;
    label: string;
    description: string;
}[];
/** Root + quality + optional slash bass, or `''` when that is not a chord. */
declare function buildChordSymbol(root: any, quality?: string, bass?: string): string;
/**
 * Every chord the song already uses, in first-appearance order, deduplicated.
 *
 * `draftText` is the open section editor's textarea — not saved yet, but a
 * chord the reader has just inserted there is one they will want again on the
 * next line.
 */
declare function collectSongChords(markdown: any, draftText?: string, limit?: number): string[];
/** The `Key` value of the document's `Config`, as written (`''` if none). */
declare function readConfigKeyText(markdown: any): string;
/**
 * The chords of the song's key, filtered to what the chord grammar accepts.
 * `null` when the `Key` is missing or unreadable.
 */
declare function getKeyChordSuggestions(keyText: any): {
    keyLabel: string;
    chords: string[];
} | null;
/** The twelve roots, spelled the way the song's key spells accidentals. */
declare function getRootSpellings(keyText: any): string[];
/**
 * Where a chord goes in `text` for a caret at `selectionStart`, and what the
 * text becomes. Pure, so the notation rule is testable on its own.
 *
 * The chord lands at the caret; a selection is not overwritten (it is lyric
 * text the reader meant to keep). When the caret touches an existing chord —
 * inside `[E]`, or right before/after it — that chord is replaced instead,
 * since two chords on one syllable is never what was meant.
 */
declare function computeChordInsertion(text: any, selectionStart: any, chord: any, style?: ChordInsertStyle): ChordInsertion | null;
declare function applyPreviewControllerSectionChordMethods(PreviewControllerClass: any): void;
export { CHORD_QUALITIES, applyPreviewControllerSectionChordMethods, buildChordSymbol, collectSongChords, computeChordInsertion, getKeyChordSuggestions, getRootSpellings, readConfigKeyText, };

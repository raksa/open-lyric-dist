/**
 * Every code point worth flagging: C0/C1 controls, the Unicode space and
 * separator blocks, and the format (`Cf`) category — ZWSP, ZWNJ, ZWJ, BOM, the
 * bidi controls, and friends.
 */
export declare const INVISIBLE_CHARACTER_REGEX: RegExp;
/** Tab, newline, and plain space: invisible, but not worth flagging. */
export declare const ALLOWED_INVISIBLE_CHARACTER_CODE_POINTS: Set<number>;
/** Upper bound on decorations per pass, so a pathological document can't stall. */
export declare const MAX_INVISIBLE_CHARACTER_DECORATIONS = 5000;
export declare const SINGLE_INVISIBLE_CHARACTER_DECORATION_CLASS = "unicode-highlight";
export declare const START_LINE_INVISIBLE_CHARACTER_DECORATION_CLASS = "unicode-highlight start-line";
export declare const MULTIPLE_INVISIBLE_CHARACTER_DECORATION_CLASS = "unicode-highlight unicode-highlight--multiple";
export declare const START_LINE_MULTIPLE_INVISIBLE_CHARACTER_DECORATION_CLASS = "unicode-highlight unicode-highlight--multiple start-line";
/** The decoration `description` both surfaces tag their decorations with. */
export declare const INVISIBLE_CHARACTER_DECORATION_DESCRIPTION = "open-lyric-invisible-character-highlight";
/** One highlighted run: consecutive invisible characters on a single line. */
export interface InvisibleCharacterRun {
    lineNumber: number;
    /** 1-based, Monaco column convention. */
    startColumn: number;
    endColumn: number;
    className: string;
}
/** The slice of a Monaco text model the scan needs. */
export interface InvisibleCharacterModel {
    getLineCount(): number;
    getLineContent(lineNumber: number): string;
}
/** A fresh regex per caller — `lastIndex` is per-instance state. */
export declare function createInvisibleCharacterRegex(): RegExp;
/** Matches two or more adjacent invisible characters (what Format collapses). */
export declare function createDuplicateInvisibleCharacterRunRegex(): RegExp;
/**
 * Scan `model` and return one run per group of adjacent invisible characters.
 *
 * Adjacent characters merge into a single run so a stretch of them reads as one
 * block rather than a picket fence; a run of more than one gets the "multiple"
 * class (a filled warning box), and a run that starts at column 1 with a ZWSP
 * gets `start-line` so the marker isn't nudged off the left edge.
 */
export declare function collectInvisibleCharacterRuns(model: InvisibleCharacterModel, maxRuns?: number): InvisibleCharacterRun[];

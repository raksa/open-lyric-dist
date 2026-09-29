/**
 * Every section type the language defines, in registry order.
 *
 * `Config` is excluded: it is metadata, it is required, and exactly one of it
 * may exist — none of which the "add a section" gesture means.
 */
declare function getSectionTypeOptions(): any;
/** The part names the document already declares — `Config` aside. */
declare function collectDeclaredSectionPartNames(markdown: any): Set<string>;
/**
 * The lowest index this header has no fence for yet.
 *
 * `Verse 1` and `Verse 2` present means the reader is offered `Verse 3` — the
 * number they were going to type anyway, and the one that cannot collide.
 */
declare function getNextFreeSectionIndexText(declaredPartNames: any, header: any, option: any): string;
/**
 * The document edit that adds an empty section.
 *
 * It lands after the last fence in the document rather than at the click's own
 * position: a song grows at the end, and inserting under `Config` would build
 * every song backwards. Returns `null` when the name is not one the parser
 * accepts, so a picker that somehow produced nonsense writes nothing.
 */
declare function buildSectionInsertion(markdown: any, partName: any): {
    startLineNumber: number;
    endLineNumber: number;
    nextLines: string[];
    partName: any;
} | null;
/**
 * The fence's opening line as it should read once renamed, or `null`.
 *
 * `expectedPartName` is the name the control was rendered with; the line is
 * refused when it no longer declares it, so markup a re-render left behind
 * renames nothing. The indentation and the ```` ```ol: ```` prefix the document
 * already had are always preserved — a rename can only ever replace the header
 * info.
 */
declare function buildRenamedFenceHeaderLine(sourceLine: any, expectedPartName: any, nextPartName: any): string | null;
/**
 * Where the `Config` fence declares `- Structure:`, if it declares it on one
 * line. A value continued onto a second line is left alone rather than
 * half-rewritten.
 */
declare function findConfigStructureFieldLine(markdown: any): {
    lineNumber: number;
    prefix: string;
    separator: string;
    valueText: string;
} | null;
/**
 * The `- Structure:` line with every step naming `partName` re-coded to
 * `nextPartName`, and how many steps that was.
 *
 * Each step keeps whatever followed its code in the source — a repeat suffix
 * such as `x2` — so renaming a part never quietly drops a repeat. A value the
 * structure parser cannot read, or a part with no structure code of its own, is
 * left untouched (`null`): a rename must not be the thing that rewrites a
 * `Structure` the reader has not fixed yet.
 */
declare function buildRenamedStructureLine(sourceLine: any, partName: any, nextPartName: any): {
    changedCount: number;
    line: string;
} | null;
/**
 * The one document edit a rename is: the fence's opening line, plus the
 * `- Structure:` line when it names the part, and every line between them
 * written back unchanged.
 *
 * One range rather than two writes is the whole point — one user action stays
 * one undo step, and the document can never be left half-renamed.
 */
declare function buildSectionRenameEdit(markdown: any, headerLineNumber: any, partName: any, nextPartName: any): {
    startLineNumber: any;
    endLineNumber: any;
    nextLines: string[];
    structureStepCount: number;
} | null;
/** How many `- Structure:` steps name `partName` right now. */
declare function countStructureStepsForPart(markdown: any, partName: any): number;
/**
 * The `- Structure:` line with every step naming `partName` taken out, and how
 * many steps that was.
 *
 * The surviving steps are re-emitted from their parsed parts rather than
 * spliced out of the raw text, because removing a step can leave its two
 * neighbours identical and adjacent — `V1CV1` minus the `Chorus` is the verse
 * sung twice, which the notation spells `V1x2`, not `V1V1` (that is the
 * "cannot place X twice in a row" diagnostic). Merging sums the repeat counts,
 * so the song still runs the same number of times.
 *
 * An emptied value keeps the field declared (`- Structure:` with nothing after
 * it), the same thing clearing a free-text `Config` field does — and an empty
 * `Structure` is not a diagnostic, since the validator only checks the value
 * when there is one.
 */
declare function buildRemovedStructureLine(sourceLine: any, partName: any): {
    removedStepCount: number;
    line: string;
} | null;
/**
 * The one document edit a delete is: the fence's whole source range, one blank
 * line beside it, and the `- Structure:` line when it names the part — with
 * every line between them written back unchanged.
 *
 * One range rather than two writes, for the same reason the rename uses one:
 * one user action stays one undo step, and the song can never be left with a
 * running order pointing at a section that is gone.
 *
 * Refuses (`null`) when the range no longer opens and closes this fence, so a
 * control left behind by stale markup deletes nothing.
 */
declare function buildSectionDeleteEdit(markdown: any, fenceStartLineNumber: any, fenceEndLineNumber: any, partName: any): {
    startLineNumber: number;
    endLineNumber: number;
    nextLines: string[];
    structureStepCount: number;
} | null;
/**
 * The section just before `partName` in the document, so focus has somewhere to
 * land once the card under the reader's pointer is gone.
 */
declare function getPrecedingSectionPartName(markdown: any, partName: any): string;
/**
 * The second line of the confirmation — what else goes when this section does.
 *
 * Named rather than counted silently: removing a section quietly shortens the
 * running order, and a reader who never opens the text panel would have no
 * other way to find that out.
 */
declare function describeSectionDeletion(structureStepCount: any): string;
declare function applyPreviewControllerSectionNamingMethods(PreviewControllerClass: any): void;
export { applyPreviewControllerSectionNamingMethods, buildRemovedStructureLine, buildRenamedFenceHeaderLine, buildRenamedStructureLine, buildSectionDeleteEdit, buildSectionInsertion, buildSectionRenameEdit, collectDeclaredSectionPartNames, countStructureStepsForPart, describeSectionDeletion, findConfigStructureFieldLine, getNextFreeSectionIndexText, getPrecedingSectionPartName, getSectionTypeOptions, };

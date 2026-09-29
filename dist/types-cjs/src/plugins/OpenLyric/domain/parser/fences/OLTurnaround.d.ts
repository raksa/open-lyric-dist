import { OLFenceDefinition } from './OLFenceDefinition.js';
/**
 * The short connective passage that carries one section into the next.
 *
 * Distinct from `Instrumental` on purpose: chart convention treats an
 * instrumental as a whole section without lyrics, while a turnaround (`TA` in
 * chart shorthand) is the in-between music joining two sections. It is usually
 * played, occasionally sung over, so it takes the same per-line reading as
 * `Intro` and `Outro` rather than being progression-only.
 */
declare class OLTurnaround extends OLFenceDefinition {
    constructor();
    validateBody(context: any): void;
    getPreviewChordInsertStyle(): string;
    renderPreviewBody(context: any): any;
}
export { OLTurnaround };

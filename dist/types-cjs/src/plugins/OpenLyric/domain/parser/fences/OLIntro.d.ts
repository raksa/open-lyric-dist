import { OLFenceDefinition } from './OLFenceDefinition.js';
declare class OLIntro extends OLFenceDefinition {
    constructor();
    validateBody(context: any): void;
    getPreviewChordInsertStyle(): string;
    renderPreviewBody(context: any): any;
}
export { OLIntro };

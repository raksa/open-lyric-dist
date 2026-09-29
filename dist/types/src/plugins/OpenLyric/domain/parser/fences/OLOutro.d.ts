import { OLFenceDefinition } from './OLFenceDefinition.js';
declare class OLOutro extends OLFenceDefinition {
    constructor();
    validateBody(context: any): void;
    getPreviewChordInsertStyle(): string;
    renderPreviewBody(context: any): any;
}
export { OLOutro };

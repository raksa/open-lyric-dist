import { OLFenceDefinition } from './OLFenceDefinition.js';
declare class OLInstrumentalFence extends OLFenceDefinition {
    constructor(options: any);
    validateBody(context: any): void;
    getPreviewChordInsertStyle(): string;
    renderPreviewBody(context: any): any;
}
export { OLInstrumentalFence };

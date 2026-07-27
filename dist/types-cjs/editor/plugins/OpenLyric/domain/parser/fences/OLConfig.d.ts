import { OLFenceDefinition } from './OLFenceDefinition.js';
declare class OLConfig extends OLFenceDefinition {
    constructor();
    getSnippetBodyLines(): string[];
    validateBody(context: any): void;
    renderPreviewBody(context: any): any;
}
export { OLConfig };

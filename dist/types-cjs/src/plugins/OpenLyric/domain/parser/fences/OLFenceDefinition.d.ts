declare function formatDeclaredPartName(header: any, indexText?: string): any;
declare class OLFenceDefinition {
    constructor({ className, header, kind, description, tokenState, allowsNumbering, required, links, allowDuplicateDeclarations, }: {
        className: any;
        header: any;
        kind: any;
        description: any;
        tokenState: any;
        allowsNumbering?: boolean | undefined;
        required?: boolean | undefined;
        links?: never[] | undefined;
        allowDuplicateDeclarations?: boolean | undefined;
    });
    createHeaderInfo(indexText?: string): {
        definition: OLFenceDefinition;
        className: any;
        header: any;
        label: any;
        kind: any;
        indexText: string;
        partName: any;
    };
    parseHeader(info: any): {
        definition: OLFenceDefinition;
        className: any;
        header: any;
        label: any;
        kind: any;
        indexText: string;
        partName: any;
    } | null;
    getTokenizerRootRule(): any[];
    getTokenizerStateRules(context: any): any;
    getSnippetHeaders(): any[];
    getSnippetDefinitions(): {
        definition: OLFenceDefinition;
        header: any;
        documentation: any;
    }[];
    getSnippetBodyLines(): string[];
    allowsDuplicateDeclaredPart(): any;
    getLinkedFenceHeaders(): any;
    getLinkedFences(registry: any): any;
    getPreviewTitle(parsedHeader: any): any;
    getPreviewLines(body: any): string[];
    renderPreviewBody(context: any): any;
    renderPreview(context: any): string;
    validateBody(): void;
}
export { OLFenceDefinition, formatDeclaredPartName };

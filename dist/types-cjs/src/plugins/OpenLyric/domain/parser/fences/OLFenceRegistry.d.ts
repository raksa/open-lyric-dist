declare class OLFenceRegistry {
    constructor(definitions: any);
    getDefinitions(): any;
    findByHeader(header: any): any;
    parseHeader(info: any): any;
    getFenceBlockKind(info: any): any;
    getRequiredDeclaredPartNames(): any;
    getSnippetDefinitions(): any;
    findHeaderPrefix(info: any): any;
    getFenceHeaderError(info: any): string;
}
export { OLFenceRegistry };

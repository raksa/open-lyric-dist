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
    /**
     * The header to put in place of an `info` that is not one — `Config` for
     * `config`, the {@link suggestHeader} match otherwise — or `''` when there
     * is none to offer (a valid header, a numbered `Config`, a bad index).
     */
    getFenceHeaderFix(info: any): any;
    /**
     * The header `info` was most likely meant to be — `Verse 2` for `Vers 2`,
     * `Pre-Chorus 1` for `pre chorus 1` — or `''` when no header is close. A
     * header of four letters or fewer allows one slip, a longer one two.
     */
    suggestHeader(info: any): any;
}
export { OLFenceRegistry };

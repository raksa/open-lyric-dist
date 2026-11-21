/**
 * Should this line be read as a progression rather than a chorded lyric?
 *
 * `Instrumental` is progression by definition. The mixed sections (`Intro`,
 * `Outro`) have to be asked line by line, because either kind of line may
 * appear in them — reading a sung line as a progression would transpose the
 * words that happen to spell chords.
 */
declare function isProgressionSectionText(text: any, sectionKind: any): boolean;
declare function transposeSectionText(text: any, sectionKind: any, transposition: any): string;
declare function createOpenLyricStructureControlState(markdown: any, options?: {}): {
    keyOptions: string[];
    nextKeyText: any;
    previousKeyText: any;
    selectedKeyText: any;
    structureKeyId: string;
    title: string;
} | null;
declare function parseConfigEntries(configFence: any): {
    key: any;
    lineEntry: {
        isComment?: boolean | undefined;
        text: string;
        lineNumber: any;
        column: number;
    };
    values: {
        text: string;
        lineEntry: {
            isComment?: boolean | undefined;
            text: string;
            lineNumber: any;
            column: number;
        };
        valueColumn: number;
    }[];
}[];
declare function renderOpenLyricPreviewSectionsForLine(markdown: any, lineNumber: any, options?: {}): {
    header: any;
    partName: any;
    html: string;
} | null;
declare function renderSongSectionPlainTextData(sectionData: any): any;
declare function createOpenLyricPresentationData(markdown: any, options?: {}): {
    attachments: import("open-lyric").OpenLyricAttachment[];
    configFieldLines: string[];
    title: any;
    secondaryText: string;
    metaLine: string;
    strummingPatternLines: any[];
    structureLine: string;
    sections: any;
} | null;
declare function renderOpenLyricPlainText(markdown: any, options?: {}): string;
declare function renderOpenLyricPreview(markdown: any, options?: {}): any;
export { createOpenLyricPresentationData, createOpenLyricStructureControlState, isProgressionSectionText, parseConfigEntries, renderOpenLyricPlainText, renderOpenLyricPreview, renderOpenLyricPreviewSectionsForLine, renderSongSectionPlainTextData, transposeSectionText, };

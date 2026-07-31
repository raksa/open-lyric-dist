declare function createOpenLyricStructureControlState(markdown: any, options?: {}): {
    keyOptions: string[];
    nextKeyText: any;
    previousKeyText: any;
    selectedKeyText: any;
    structureKeyId: string;
    title: string;
} | null;
declare function renderOpenLyricPreviewSectionsForLine(markdown: any, lineNumber: any, options?: {}): {
    header: any;
    partName: any;
    html: string;
} | null;
declare function renderSongSectionPlainTextData(sectionData: any): any;
declare function createOpenLyricPresentationData(markdown: any, options?: {}): {
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
export { createOpenLyricPresentationData, createOpenLyricStructureControlState, renderOpenLyricPlainText, renderOpenLyricPreview, renderOpenLyricPreviewSectionsForLine, renderSongSectionPlainTextData, };

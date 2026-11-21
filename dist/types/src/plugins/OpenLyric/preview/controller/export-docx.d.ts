declare function convertNodeListToDocxBlocks(docxModule: any, nodes: any, context?: {}): any[];
/**
 * Build the `docx` `Document` for a rendered Markdown preview — the Markdown
 * preview's "Download DOCX" document, without the panel around it: the caller
 * supplies the rendered preview root (any element whose children are the
 * preview's blocks) and the fonts, so a host with no live preview — a Node
 * process rendering through `renderMarkdownPreview` — builds the same file.
 */
declare function createMarkdownPreviewDocxDocument(docxModule: any, previewRoot: any, { title, bodyFontFamily, codeFontFamily, }?: {
    title?: string;
    bodyFontFamily?: string;
    codeFontFamily?: string;
}): any;
declare function applyPreviewControllerDocxExportMethods(PreviewControllerClass: any): void;
export { applyPreviewControllerDocxExportMethods, convertNodeListToDocxBlocks, createMarkdownPreviewDocxDocument, };

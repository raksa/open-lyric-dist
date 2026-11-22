import { type OpenLyricEmbedFontsOptions, type OpenLyricFontNames } from './pptx/export-fonts.js';
declare function loadDocxModule(): any;
declare function convertNodeListToDocxBlocks(docxModule: any, nodes: any, context?: {}): any[];
/**
 * The fonts a Word document of a rendered Markdown preview names: the first
 * real family of `fontFamilyValue` (the preview's computed `font-family`),
 * under the name it goes by outside the page (`fontNames`, else with the
 * page's `editor-` prefix dropped), and the code face.
 */
declare function getMarkdownPreviewDocxFontFamilies(fontFamilyValue: unknown, fontNames?: OpenLyricFontNames): {
    bodyFontFamily: any;
    codeFontFamily: any;
};
/** A font file a Word document carries, under the name its text uses. */
interface MarkdownPreviewDocxFont {
    name: string;
    data: Uint8Array;
}
/**
 * The font file a Word document of the preview carries, so it reads in the
 * preview's face on a computer without it: the body face's regular file, as
 * this page loads it (`@font-face`), under the name the document's text uses.
 * Only a TrueType file whose maker allows embedding
 * ({@link isEmbeddableTrueTypeFont}), and only when one file holds the whole
 * face — Word embeds one regular file per name, so a face split into
 * `unicode-range` subsets stays named only, as does an installed font. Word
 * draws the bold from it. `[]` whenever there is nothing to carry.
 */
declare function readMarkdownPreviewDocxFonts(fontFamilyValue: unknown, { fontNames, ...options }?: Omit<OpenLyricEmbedFontsOptions, 'maxBytes'>): Promise<MarkdownPreviewDocxFont[]>;
/**
 * The files to pack over `docx`'s own for `documentFile` (`Packer.toBlob(…,
 * undefined, overrides)`): `word/fontTable.xml` again, each embedded font's
 * key (`w:fontKey`) in capitals, when the document carries fonts. `docx`
 * writes the key in lower case, which the schema's GUID type does not allow,
 * and LibreOffice then leaves the font unused (checked: the same file shows
 * Battambang once its key is in capitals). The font file itself is
 * obfuscated with that key whatever its case, so only the table changes.
 */
declare function getMarkdownPreviewDocxPackOverrides(documentFile: any): {
    path: string;
    data: string;
}[];
/**
 * Build the `docx` `Document` for a rendered Markdown preview — the Markdown
 * preview's "Download DOCX" document, without the panel around it: the caller
 * supplies the rendered preview root (any element whose children are the
 * preview's blocks) and the fonts, so a host with no live preview — a Node
 * process rendering through `renderMarkdownPreview` — builds the same file.
 * `fonts` are carried in the file ({@link readMarkdownPreviewDocxFonts}).
 */
declare function createMarkdownPreviewDocxDocument(docxModule: any, previewRoot: any, { title, bodyFontFamily, codeFontFamily, fonts, }?: {
    title?: string;
    bodyFontFamily?: string;
    codeFontFamily?: string;
    fonts?: readonly MarkdownPreviewDocxFont[];
}): any;
declare function applyPreviewControllerDocxExportMethods(PreviewControllerClass: any): void;
export { applyPreviewControllerDocxExportMethods, convertNodeListToDocxBlocks, createMarkdownPreviewDocxDocument, getMarkdownPreviewDocxPackOverrides, getMarkdownPreviewDocxFontFamilies, loadDocxModule, readMarkdownPreviewDocxFonts, };
export type { MarkdownPreviewDocxFont };

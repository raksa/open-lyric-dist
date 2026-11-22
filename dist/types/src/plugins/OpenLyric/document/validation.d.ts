declare function collectMarkdownOlMarkersFromLines(lines: any): any[];
declare function splitMarkdownOlText(text: any): string[];
declare function checkOLMarkdown(text: any): boolean;
declare function getMarkdownOlMarkerFixes(model: any): any;
declare function validateMarkdownOlModel(model: any): void;
declare function scheduleValidation(): void;
export { checkOLMarkdown, collectMarkdownOlMarkersFromLines, getMarkdownOlMarkerFixes, scheduleValidation, splitMarkdownOlText, validateMarkdownOlModel, };

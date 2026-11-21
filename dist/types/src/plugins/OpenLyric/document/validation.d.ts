declare function collectMarkdownOlMarkersFromLines(lines: any): {
    severity: any;
    source: string;
    message: any;
    startLineNumber: any;
    startColumn: number;
    endLineNumber: any;
    endColumn: number;
}[];
declare function splitMarkdownOlText(text: any): string[];
declare function checkOLMarkdown(text: any): boolean;
declare function validateMarkdownOlModel(model: any): void;
declare function scheduleValidation(): void;
export { checkOLMarkdown, collectMarkdownOlMarkersFromLines, scheduleValidation, splitMarkdownOlText, validateMarkdownOlModel, };

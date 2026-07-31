declare function parseOpenLyricPlainText(rawText: any): {
    hasConflictingDuplicates: boolean;
    markdown: string;
    matchesPlainTextFormat: boolean;
    placeholdersUsed: string[];
};
export { parseOpenLyricPlainText };

declare function parseOpenLyricPlainText(rawText: any): {
    hasConflictingDuplicates: boolean;
    markdown: string;
    renamedSections: {
        from: any;
        to: any;
    }[];
    matchesPlainTextFormat: boolean;
    placeholdersUsed: string[];
};
export { parseOpenLyricPlainText };

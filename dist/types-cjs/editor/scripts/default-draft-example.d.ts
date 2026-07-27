declare const DEFAULT_FULL_DRAFT_EXAMPLE: {
    id: string;
    fileName: string;
    title: string;
    description: string;
    content: string;
    editorShellModes: string[];
};
declare function getDefaultDraftExample(): {
    id: string;
    fileName: string;
    title: string;
    description: string;
    content: string;
    editorShellModes: string[];
};
declare const DEFAULT_DRAFT_EXAMPLE: {
    id: string;
    fileName: string;
    title: string;
    description: string;
    content: string;
    editorShellModes: string[];
};
export { DEFAULT_DRAFT_EXAMPLE, DEFAULT_FULL_DRAFT_EXAMPLE, getDefaultDraftExample, };

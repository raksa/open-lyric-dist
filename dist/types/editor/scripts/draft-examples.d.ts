declare const DRAFT_EXAMPLES: {
    id: string;
    fileName: string;
    title: string;
    description: string;
    content: string;
    editorShellModes: string[];
}[];
declare function getDraftExamples(): any[];
declare function getDraftExampleById(exampleId: any): any;
export { DRAFT_EXAMPLES, getDraftExampleById, getDraftExamples };

declare const STRUCTURE_TOKEN_DEFINITIONS: {
    code: string;
    header: string;
    allowsNumbering: boolean;
}[];
declare const STRUCTURE_SYNTAX_EXAMPLE = "IV1x2CV1V2CO";
declare const STRUCTURE_CODE_LIST: string;
declare function formatStructureStepLabel(step: any): any;
declare function findAdjacentDuplicateStructureError(steps: any): {
    startOffset: any;
    endOffset: number;
    message: any;
} | null;
declare function parseStructureValue(value: any): {
    text: string;
    steps: {
        code: string;
        definition: {
            code: string;
            header: string;
            allowsNumbering: boolean;
        };
        displayText: string;
        endOffset: number;
        header: string;
        indexText: string;
        parsedHeader: any;
        partName: any;
        partText: string;
        rawText: string;
        repeatText: string;
        startOffset: number;
    }[];
    error: {
        startOffset: any;
        endOffset: number;
        message: any;
    };
} | {
    text: string;
    steps: {
        code: string;
        definition: {
            code: string;
            header: string;
            allowsNumbering: boolean;
        };
        displayText: string;
        endOffset: number;
        header: string;
        indexText: string;
        parsedHeader: any;
        partName: any;
        partText: string;
        rawText: string;
        repeatText: string;
        startOffset: number;
    }[];
    error: null;
};
export { STRUCTURE_CODE_LIST, STRUCTURE_SYNTAX_EXAMPLE, STRUCTURE_TOKEN_DEFINITIONS, findAdjacentDuplicateStructureError, formatStructureStepLabel, parseStructureValue, };

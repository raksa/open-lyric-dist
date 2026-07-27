import { createKhmerSpellcheckProvider } from './spellcheck-khmer-provider.js';
declare function normalizeKhmerWord(word: any): string;
declare const olEditorPluginData: {
    id: string;
    keyboard: {
        actionLabel: string;
        create: ({ editor, monaco, onStateChange, ownerDocument, ownerWindow, preferences, refs, }: {
            editor: any;
            monaco: any;
            onStateChange: any;
            ownerDocument: any;
            ownerWindow: any;
            preferences: any;
            refs: any;
        }) => {
            close(): void;
            destroy(): void;
            getState(): {
                isOpen: boolean;
                isMinimized: boolean;
                layoutId: string;
                layoutLabel: string;
                mode: string;
                position: {
                    left: any;
                    top: any;
                } | null;
                size: {
                    height: number;
                    width: number;
                } | null;
                targetKind: any;
            };
            open(): void;
            toggle(): void;
        };
        displayName: string;
        id: string;
    };
    spellChecker: {
        actionLabel: string;
        af: string;
        aliases: string[];
        baseLetterPattern: RegExp;
        defaultEnabled: boolean;
        dictionaryName: string;
        dict: string;
        displayName: string;
        exactWordPattern: RegExp;
        languageCode: string;
        normalizeWord: typeof normalizeKhmerWord;
        providerFactory: typeof createKhmerSpellcheckProvider;
        suggestAffUrls: string[];
        wordPattern: RegExp;
    };
    style: string[];
    pptxStyle: {
        fontFamilyChoices: string[];
        fontDetectionSampleText: string;
        fontSize: number;
    };
};
export { olEditorPluginData };

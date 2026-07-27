declare function createEnglishSpellcheckProvider(): {
    languageCode: string;
    checkWords: (words: any) => Promise<Map<any, any>>;
    dispose: () => void;
    getPrefixSuggestions: (word: any, limit?: number) => Promise<any>;
    getSuggestions: (word: any) => Promise<any>;
    initialize: () => Promise<any>;
    isReady: () => boolean;
    shouldCheckWord: (word: any) => boolean;
};
export { createEnglishSpellcheckProvider };

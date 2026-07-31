declare function createPluginSpellcheckProvider(specification: any): {
    checkWords: (words: any) => Promise<Map<any, any>>;
    dispose: () => void;
    getPrefixSuggestions: (word: any, limit?: number) => Promise<any>;
    getSuggestions: (word: any) => Promise<any>;
    initialize: () => Promise<any>;
    isReady: () => boolean;
    languageCode: any;
    shouldCheckWord: (word: any) => boolean;
};
export { createPluginSpellcheckProvider };

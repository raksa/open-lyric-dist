declare function createKhmerSpellcheckProvider(specification?: {}): {
    languageCode: string;
    checkWords: (words: any) => Promise<Map<any, any>>;
    dispose: () => void;
    getPrefixSuggestions: (word: any, limit?: number) => Promise<any>;
    getSegmentationSuggestion: (word: any) => Promise<any>;
    getSuggestions: (word: any) => Promise<any>;
    initialize: () => Promise<any>;
    isReady: () => boolean;
    postProcessTranscriptText: (text: any, options?: {}) => Promise<string>;
    shouldCheckWord: (word: any) => boolean;
};
export { createKhmerSpellcheckProvider };

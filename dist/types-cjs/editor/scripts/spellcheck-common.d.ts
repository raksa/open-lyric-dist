declare function getAvailableSpellcheckSpecifications(): {
    actionLabel: string;
    aff: string;
    aliases: string[];
    defaultEnabled: boolean;
    dictionaryName: string;
    dict: string;
    displayName: string;
    exactWordPattern: RegExp;
    languageCode: string;
    normalizeWord(word: any): string;
    wordPattern: RegExp;
}[];
declare function normalizeLanguageCode(languageCode: any): string | null;
declare function getSpellcheckSpecification(languageCode: any): any;
declare function getDictionaryConfig(languageCodeOrSpecification: any): {
    affUrl: string;
    dicUrl: string;
    dictionaryName: any;
    languageCode: any;
} | null;
declare function getSuggestionDictionaryConfigs(languageCodeOrSpecification: any): {
    affUrl: any;
    dicUrl: any;
    dictionaryName: any;
    languageCode: any;
}[];
declare function mergeDictionarySuggestions(dictionaries: any, word: any, limit?: number): any[];
declare function getDictionaryPrefixSuggestions(dictionaries: any, prefix: any, limit?: number): any[];
declare function hasWordBaseCharacter(word: any, languageCode: any): boolean;
declare function hasKhmerBaseLetter(word: any): boolean;
declare function detectLanguageCode(word: any): string | null;
declare function normalizeWord(word: any, languageCode: any): any;
declare function normalizeSpellcheckLookupWord(word: any, languageCode: any): any;
declare function getSpellcheckTokenPatterns(): {
    languageCode: string;
    pattern: RegExp;
}[];
declare function loadDictionary(languageCodeOrSpecification: any): Promise<any>;
declare function createDictionarySnapshot(dictionary: any): any;
declare function restoreDictionaryFromSnapshot(dictionarySnapshot: any): any;
export { createDictionarySnapshot, detectLanguageCode, getAvailableSpellcheckSpecifications, getDictionaryPrefixSuggestions, getDictionaryConfig, getSuggestionDictionaryConfigs, getSpellcheckSpecification, getSpellcheckTokenPatterns, hasKhmerBaseLetter, hasWordBaseCharacter, loadDictionary, mergeDictionarySuggestions, normalizeSpellcheckLookupWord, normalizeLanguageCode, normalizeWord, restoreDictionaryFromSnapshot, };

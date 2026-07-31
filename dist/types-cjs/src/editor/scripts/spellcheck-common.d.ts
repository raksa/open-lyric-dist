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
/**
 * typo-js 1.3.2 keeps `dictionaryTable` as a `Map`; earlier releases — and
 * the plain-JSON side of a snapshot made before the upgrade — used a plain
 * word→flags object. Everything that reads a table goes through these two
 * helpers so both shapes behave identically, whichever a dictionary or a
 * restored snapshot happens to carry.
 */
declare function dictionaryTableHas(dictionaryTable: any, word: any): boolean;
declare function getDictionaryPrefixSuggestions(dictionaries: any, prefix: any, limit?: number): any[];
declare function hasWordBaseCharacter(word: any, languageCode: any): boolean;
/**
 * True when the word carries a base letter of ANY registered language whose
 * script the core would otherwise have had to know about.
 *
 * Replaces the old `hasKhmerBaseLetter`: the caller is never asking "is this
 * Khmer?", it is asking "is this a script whose word boundaries the plain-text
 * rules do not describe?" — the question the segmentation, ZWSP-separator and
 * re-segmentation paths all want answered. English (and any other plain,
 * space-separated language) declares no `baseLetterPattern`, so it never
 * matches here and those paths stay off, exactly as before.
 */
declare function hasAnyWordBaseCharacter(word: any): boolean;
/**
 * The character this language puts between words — a zero-width space for
 * scripts that separate invisibly, a plain space otherwise (the default).
 */
declare function getWordSeparator(languageCode: any): string;
/** Every registered language that separates words with an invisible mark. */
declare function getInvisibleWordSeparators(): any[];
/**
 * `{ pattern, separator }` for every language that can repair typed whitespace
 * between its words — see `normalizeWordSeparators` in `shared.ts`.
 */
declare function getWordSeparatorRewrites(): {
    pattern: any;
    separator: any;
}[];
/**
 * The menu label for a language's re-segmentation command, or `''` when it
 * offers none.
 *
 * This is the declarative opt-in that replaced the core's `=== 'km'` gates:
 * a language that can re-split a run of text into words names the command
 * here, and its provider backs it with `getSegmentationSuggestion` /
 * `postProcessTranscriptText`. No caller needs to know which language it is.
 */
declare function getSegmentationActionLabel(languageCode: any): string;
/** Every registered language offering a re-segmentation command. */
declare function getSegmentationCapableSpecifications(): {
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
/** Autocomplete trigger characters contributed by registered languages. */
declare function getWordSuggestTriggerCharacters(): any[];
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
export { createDictionarySnapshot, detectLanguageCode, dictionaryTableHas, getAvailableSpellcheckSpecifications, getDictionaryPrefixSuggestions, getDictionaryConfig, getSuggestionDictionaryConfigs, getSpellcheckSpecification, getSpellcheckTokenPatterns, getInvisibleWordSeparators, getSegmentationActionLabel, getSegmentationCapableSpecifications, getWordSeparator, getWordSeparatorRewrites, getWordSuggestTriggerCharacters, hasAnyWordBaseCharacter, hasWordBaseCharacter, loadDictionary, mergeDictionarySuggestions, normalizeSpellcheckLookupWord, normalizeLanguageCode, normalizeWord, restoreDictionaryFromSnapshot, };

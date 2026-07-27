declare const ADD_TO_CUSTOM_DICTIONARY_COMMAND_ID = "open-lyric.add-to-custom-dictionary";
declare function getModelSpellcheckMarkers(model: any): any[];
declare function setSpellcheckCustomDictionaryWords(languageCode: any, words: any): unknown[];
declare function setSpellcheckExcludedWords(languageCode: any, words: any): unknown[];
declare function pruneSpellcheckCustomDictionaryWords(languageCode: any, words: any): Promise<unknown[]>;
declare function checkSpellcheckWordValidity(languageCode: any, word: any): Promise<boolean | null>;
declare function postProcessTranscriptText(languageCode: any, text: any): Promise<any>;
declare function clearSpellcheckMarkers(model?: any): void;
declare function handleSpellcheckContentChange(model?: any, contentChangeEvent?: null): boolean;
declare function scheduleSpellcheck(): void;
declare function refreshSpellcheckNow(model?: any): Promise<void>;
declare function applyKhmerSegmentationMarkerEdit(editor: any, marker: any): Promise<boolean>;
declare function loadAutocompleteSpellcheckSuggestions(word: any, { languageCodes, limit }?: {
    languageCodes?: (string | null)[] | undefined;
    limit?: number | undefined;
}): Promise<any[]>;
export { ADD_TO_CUSTOM_DICTIONARY_COMMAND_ID, applyKhmerSegmentationMarkerEdit, checkSpellcheckWordValidity, clearSpellcheckMarkers, getModelSpellcheckMarkers, handleSpellcheckContentChange, loadAutocompleteSpellcheckSuggestions, postProcessTranscriptText, pruneSpellcheckCustomDictionaryWords, refreshSpellcheckNow, scheduleSpellcheck, setSpellcheckCustomDictionaryWords, setSpellcheckExcludedWords, };

/**
 * Owns browser persistence for the editor shell so controllers do not each
 * duplicate localStorage keys, fallback rules, or normalization logic.
 */
declare class EditorPreferencesStore {
    constructor(storage?: any, draftStorage?: any, persistentDraftStorage?: any);
    getDefaultPanelSizeWeight(): number;
    normalizePanelVisibilityPreference(value: any): {
        editorVisible: any;
        previewVisible: any;
        openLyricVisible: any;
    };
    loadPanelVisibilityPreference(): {
        editorVisible: any;
        previewVisible: any;
        openLyricVisible: any;
    } | null;
    savePanelVisibilityPreference(value: any): void;
    normalizePanelSizeWeights(value: any): {
        editor: number;
        preview: number;
        openLyric: number;
    };
    loadPanelSizePreference(): {
        editor: number;
        preview: number;
        openLyric: number;
    } | null;
    savePanelSizePreference(panelSizeWeights: any): void;
    normalizeDraftRecord(value: any): {
        content: any;
        fileName: any;
        sharedDocumentDate: any;
        updatedAt: number;
    } | null;
    loadDraftFromStorage(storage: any): {
        content: any;
        fileName: any;
        sharedDocumentDate: any;
        updatedAt: number;
    } | null;
    getPreferredDraftRecord(sessionDraft: any, persistentDraft: any): any;
    saveDraftToStorage(storage: any, draftRecord: any): void;
    syncDraftRecord(draftRecord: any): void;
    clearDraftStorage(storage: any): void;
    loadDraft(): any;
    saveDraft(content: any, fileName: any, { sharedDocumentDate }?: {
        sharedDocumentDate?: string | undefined;
    }): void;
    clearDraft(): void;
    loadInvisibleCharacterPreference(): boolean | null;
    saveInvisibleCharacterPreference(enabled: any): void;
    loadAutoSuggestPreference(): boolean;
    saveAutoSuggestPreference(enabled: any): void;
    getKeyboardWindowStorageKey(keyboardId: any): string;
    normalizeKeyboardWindowPreference(value: any): {
        isMinimized: boolean;
        isOpen: boolean;
        position: {
            left: number;
            top: number;
        } | null;
        size: {
            height: number;
            width: number;
        } | null;
    };
    loadKeyboardWindowPreference(keyboardId: any): {
        isMinimized: boolean;
        isOpen: boolean;
        position: {
            left: number;
            top: number;
        } | null;
        size: {
            height: number;
            width: number;
        } | null;
    } | null;
    saveKeyboardWindowPreference(keyboardId: any, value: any): void;
    normalizeWordWrapPreference(value: any): "off" | "on";
    loadWordWrapPreference(): "off" | "on";
    saveWordWrapPreference(value: any): void;
    normalizeSpellcheckLanguage(languageCode: any): string | null;
    getSpellcheckStorageKey(languageCode: any): string;
    getSpellcheckCustomDictionaryStorageKey(languageCode: any): string;
    getSpellcheckExcludedWordsStorageKey(languageCode: any): string;
    normalizeSpellcheckCustomDictionaryWord(languageCode: any, word: any): any;
    normalizeSpellcheckCustomDictionaryTimestamp(value: any, fallbackValue?: number): number;
    normalizeSpellcheckCustomDictionaryEntries(languageCode: any, entries: any, existingEntries?: never[]): any[];
    normalizeSpellcheckCustomDictionaryWords(languageCode: any, words: any): any[];
    normalizeSpellcheckExcludedWord(languageCode: any, word: any): any;
    normalizeSpellcheckExcludedWordEntries(languageCode: any, entries: any, existingEntries?: never[]): any[];
    normalizeSpellcheckExcludedWords(languageCode: any, words: any): any[];
    isSupportedSpellcheckCustomDictionaryVersion(version: any): boolean;
    isSupportedSpellcheckExcludedWordsVersion(version: any): boolean;
    loadSpellcheckPreference(languageCode: any, defaultEnabled?: boolean): boolean;
    saveSpellcheckPreference(languageCode: any, enabled: any): void;
    loadSpellcheckCustomDictionaryEntries(languageCode: any): any[];
    loadSpellcheckCustomDictionaryWords(languageCode: any): any[];
    saveSpellcheckCustomDictionaryEntries(languageCode: any, entries: any): any[];
    saveSpellcheckCustomDictionaryWords(languageCode: any, words: any): any[];
    addSpellcheckCustomDictionaryWord(languageCode: any, word: any): any[];
    loadSpellcheckExcludedWordEntries(languageCode: any): any[];
    loadSpellcheckExcludedWords(languageCode: any): any[];
    saveSpellcheckExcludedWordEntries(languageCode: any, entries: any): any[];
    saveSpellcheckExcludedWords(languageCode: any, words: any): any[];
    addSpellcheckExcludedWord(languageCode: any, word: any): any[];
    loadTranscriptLocalePreference(defaultLocale?: string): string;
    saveTranscriptLocalePreference(locale: any): void;
    loadTranscriptUploadApiKeyPreference(defaultValue?: string): string;
    saveTranscriptUploadApiKeyPreference(apiKey: any): void;
    getDefaultPreviewTypographyPreference(): {
        fontSizePx: 16;
        fontFamily: "";
    };
    normalizePreviewTypographyPreference(value: any): {
        fontSizePx: number;
        fontFamily: any;
    };
    loadPreviewTypographyPreference(): {
        fontSizePx: number;
        fontFamily: any;
    };
    savePreviewTypographyPreference(value: any): void;
    loadOpenLyricPluginEnabledPreference(): boolean;
    saveOpenLyricPluginEnabledPreference(enabled: any): void;
    normalizeEditorMode(mode: any): "monaco" | "simple";
    loadEditorModePreference(): "monaco" | "simple";
    saveEditorModePreference(mode: any): void;
    normalizeTheme(theme: any): any;
    loadStoredThemePreference(): any;
    hasStoredThemePreference(): boolean;
    loadThemePreference(): any;
    saveThemePreference(theme: any): void;
}
export { EditorPreferencesStore };

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
        tabId?: any;
        content: any;
        fileName: any;
        sharedDocumentDate: any;
        updatedAt: number;
    } | null;
    loadDraftFromStorage(storage: any): {
        tabId?: any;
        content: any;
        fileName: any;
        sharedDocumentDate: any;
        updatedAt: number;
    } | null;
    /**
     * Whether drafts live in two places: this tab's own (`sessionStorage`,
     * which a reload keeps) and the one shared by every tab (`localStorage`,
     * which a new tab starts from). Only then do tabs have drafts of their own
     * to keep apart.
     */
    hasTabDrafts(): boolean;
    /**
     * This tab's id, kept in its `sessionStorage` so a reload keeps it. Every
     * draft the tab writes carries it, which is how a tab tells its own shared
     * draft from one another tab wrote. `''` without tab drafts.
     */
    getDraftTabId(): any;
    /**
     * The shared draft this tab started from, when it opened with none of its
     * own (`tabId` and `updatedAt` of that record). Writing over that same
     * record is the tab carrying on with it, not replacing another tab's work.
     */
    loadAdoptedDraftMark(): any;
    saveAdoptedDraftMark(draftRecord: any): void;
    /**
     * The draft to restore: this tab's own whenever it has one — a reload
     * brings back what the tab was showing, however recently another tab
     * wrote — else the shared one, which is how a new tab (or the other page)
     * picks up where the last one left off.
     */
    getPreferredDraftRecord(sessionDraft: any, persistentDraft: any): any;
    saveDraftToStorage(storage: any, draftRecord: any): void;
    /**
     * Whether writing `draftRecord` as the shared draft would drop `existing`:
     * another tab's draft, with other text, that this tab did not start from.
     */
    wouldReplaceOtherTabDraft(existing: any, draftRecord: any): boolean;
    syncDraftRecord(draftRecord: any): void;
    /**
     * Drop the kept copies of this tab's own draft: another tab kept one when
     * it wrote over it, but the tab is still here and has written since.
     */
    forgetKeptDraftsOfTab(tabId: any): void;
    clearDraftStorage(storage: any): void;
    loadDraft(): any;
    saveDraft(content: any, fileName: any, { sharedDocumentDate }?: {
        sharedDocumentDate?: string | undefined;
    }): void;
    clearDraft(): void;
    /**
     * Drafts another tab wrote that this one would have written over, newest
     * first: a tab restores its own draft, so the shared one it replaces is
     * kept here instead of lost (`keptAt`: when). At most
     * {@link KEPT_DRAFTS_LIMIT}, one per tab.
     */
    loadKeptDrafts(): ({
        keptAt: number;
        tabId?: any;
        content: any;
        fileName: any;
        sharedDocumentDate: any;
        updatedAt: number;
    } | null)[];
    saveKeptDrafts(keptDrafts: any): boolean;
    /** Put `draftRecord` on the kept list, replacing that tab's earlier one. */
    keepDraft(draftRecord: any): void;
    /** Drop one kept draft — the one {@link loadKeptDrafts} listed with `keptAt`. */
    removeKeptDraft(keptAt: any): void;
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
    /**
     * The simple editor (SE) is deliberately not remembered: every page load
     * starts on Monaco, whatever the last session switched to. Older builds
     * stored the switch, which kept a reader who once turned SE on in it for
     * good — so the stored value is deleted rather than read.
     */
    clearStoredEditorModePreference(): void;
    normalizeTheme(theme: any): import("open-lyric").OpenLyricTheme;
    loadStoredThemePreference(): import("open-lyric").OpenLyricTheme | null;
    hasStoredThemePreference(): boolean;
    loadThemePreference(): import("open-lyric").OpenLyricTheme;
    saveThemePreference(theme: any): void;
}
export { EditorPreferencesStore };

/**
 * Encapsulates Monaco-only behavior such as editor actions, context keys,
 * invisible-character decorations, and spellcheck toggles.
 */
declare class MonacoFeatureController {
    constructor({ monaco, preferences }: {
        monaco: any;
        preferences: any;
    });
    setMonaco(monaco: any): void;
    initializePreferenceState(): void;
    isAutoSuggestAvailable(): boolean;
    isAutoSuggestEnabled(): any;
    syncAutoSuggestContextKey(): void;
    normalizeWordWrapMode(wordWrapMode: any): "off" | "on";
    normalizeWrappingStrategy(wrappingStrategy: any): "simple" | "advanced";
    getWrappingStrategyForValue(value: any): "simple" | "advanced";
    getResolvedWrappingStrategy(model?: null): "simple" | "advanced";
    syncWrappingStrategy(model?: null): void;
    normalizeOccurrencesHighlightMode(mode: any): "off" | "singleFile";
    getActiveEditorWordAtSelection(editor?: null): string;
    getOccurrencesHighlightModeForWord(word: any): "off" | "singleFile";
    syncOccurrencesHighlightForActiveWord(editor?: null): void;
    getResolvedWordWrapMode(): "off" | "on";
    bindEvents(): void;
    bindSpellcheckCustomDictionaryInputEvents(addButton: any, wordInput: any, languageSelect: any, wordKind: any): void;
    isMonacoEditorActive(): boolean;
    isApplePlatform(): boolean;
    updateChordBarsToggleButton(): void;
    updateFormatDocumentButton(): void;
    setAutoSuggestEnabled(enabled: any): void;
    getSpellcheckSpecifications(): {
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
    getSpellcheckEnabledLanguageCodes(): string[];
    hasAvailableSpellcheckLanguages(): boolean;
    getSpellcheckActionLabel(specification: any): any;
    getSpellcheckDisplayName(specification: any): any;
    getSpellcheckContextKeyName(languageCode: any): string;
    ensureSpellcheckPreferenceState(specification: any): any;
    ensureSpellcheckContextKey(editor: any, languageCode: any, enabled: any): void;
    updateSpellcheckEnabledContextKey(): void;
    updateSpellcheckToggleButton(): void;
    disposeSpellcheckActions(languageCode: any): void;
    disposeSpellcheckMenuItems(): void;
    disposeDictionaryMenuItems(): void;
    resolveDictionaryLookupEntry(word: any): {
        key: string;
        languageCode: string;
        urlPrefix: "https://en.wiktionary.org/wiki/" | "https://km.wiktionary.org/wiki/";
        word: any;
    } | null;
    getManualEditorWordAtPosition(model: any, position: any): string;
    getDirectEditorWordAtPosition(model: any, position: any): string;
    getEditorWordAtPosition(model: any, position: any): string;
    getDictionaryLookupEntryAtPosition(position: any): {
        key: string;
        languageCode: string;
        urlPrefix: "https://en.wiktionary.org/wiki/" | "https://km.wiktionary.org/wiki/";
        word: any;
    } | null;
    getDictionaryLookupEntryFromRange(range: any): {
        key: string;
        languageCode: string;
        urlPrefix: "https://en.wiktionary.org/wiki/" | "https://km.wiktionary.org/wiki/";
        word: any;
    } | null;
    compareEditorPositions(leftPosition: any, rightPosition: any): number;
    selectionContainsPosition(selection: any, position: any): any;
    getSelectionScopedDictionaryLookupEntryFromMouseTarget(target: any): {
        key: string;
        languageCode: string;
        urlPrefix: "https://en.wiktionary.org/wiki/" | "https://km.wiktionary.org/wiki/";
        word: any;
    } | null;
    getDictionaryLookupEntryFromMouseTarget(target: any): {
        key: string;
        languageCode: string;
        urlPrefix: "https://en.wiktionary.org/wiki/" | "https://km.wiktionary.org/wiki/";
        word: any;
    } | null | undefined;
    setDictionaryLookupEntry(entry: any): void;
    refreshDictionaryMenuForPosition(position: any): void;
    refreshDictionaryMenuForMouseTarget(target: any): void;
    refreshDictionaryMenuForActivePosition(): void;
    openDictionaryWord(entry: any): boolean;
    getSpellcheckMenuCommandId(commandSuffix: any): string;
    getLanguageSpellcheckMenuCommandId(languageCode: any, enabled: any): string;
    getSpellcheckToggleKeybinding(): number;
    registerSpellcheckMenuCommand({ actionId, commandId, label, keybinding, order, precondition, }: {
        actionId: any;
        commandId: any;
        label: any;
        keybinding: any;
        order: any;
        precondition: any;
    }): void;
    registerSpellcheckMenuItems(): void;
    registerSpellcheckActions(specification: any): void;
    syncSpellcheckRegistrations(): void;
    getSpellcheckCustomDictionaryEntries(): {
        displayName: any;
        languageCode: string;
        wordEntries: any;
        words: any;
    }[];
    getSpellcheckExcludedWordEntries(): {
        displayName: any;
        languageCode: string;
        wordEntries: any;
        words: any;
    }[];
    getSpellcheckCustomDictionaryReportEntries(): {
        category: string;
        displayName: any;
        languageCode: string;
        wordEntries: any;
        words: any;
    }[];
    getSpellcheckCustomDictionaryStaleCutoff(now?: number): number;
    isSpellcheckCustomDictionaryEntryStale(entry: any, now?: number): boolean;
    getStaleSpellcheckCustomDictionaryEntries(now?: number): any[];
    hasStaleSpellcheckCustomDictionaryEntries(): boolean;
    syncSpellcheckCustomDictionaryAlertIndicators(): void;
    formatSpellcheckCustomDictionaryTimestamp(timestamp: any): string;
    isSpellcheckCustomDictionaryDialogOpen(): boolean;
    setSpellcheckCustomDictionaryMessage(message: any, tone?: string): void;
    getDefaultSpellcheckCustomDictionaryLanguageCode(): any;
    syncSpellcheckCustomDictionaryInputControls(): void;
    normalizeSpellcheckCustomDictionaryInputWord(word: any): string;
    getSpellcheckCustomDictionaryInputWordValidity(wordInput: any, languageSelect: any): Promise<{
        languageCode: any;
        normalizedWord: any;
        valid: boolean | null;
    }>;
    syncSpellcheckCustomDictionaryInputValidation(wordInput: any, languageSelect: any, addButton: any, wordKind: any): Promise<void>;
    renderSpellcheckCustomDictionaryEntrySections(entries: any, listElement: any, removeAction: any): void;
    renderSpellcheckCustomDictionaryDialog(): {
        category: string;
        displayName: any;
        languageCode: string;
        wordEntries: any;
        words: any;
    }[];
    formatSpellcheckCustomDictionaryCopyText(entries: any): any;
    createSpellcheckCustomDictionaryReportMailtoUrl(entries: any): string;
    addSpellcheckCustomDictionaryInputWord(wordInput?: Element | null, languageSelect?: Element | null, wordKind?: string): Promise<boolean>;
    openSpellcheckCustomDictionaryDialog(): boolean;
    copySpellcheckCustomDictionary(): Promise<boolean>;
    copySpellcheckCustomDictionaryEmail(): Promise<boolean>;
    reportSpellcheckCustomDictionary(): Promise<boolean>;
    removeSpellcheckCustomDictionaryWord(languageCode: any, word: any): Promise<boolean>;
    removeSpellcheckExcludedWord(languageCode: any, word: any): Promise<boolean>;
    clearSpellcheckCustomDictionary(): Promise<boolean>;
    handleSpellcheckCustomDictionaryListClick(event: any): Promise<void>;
    getSegmentationSelectedEntries(): {
        entries: any;
        hasNonEmptySelection: boolean;
    };
    getSegmentationLineEntryAtPosition(position: any): {
        range: {
            startLineNumber: number;
            startColumn: number;
            endLineNumber: number;
            endColumn: any;
        };
        text: any;
    } | null;
    getSegmentationLineEntryFromMouseTarget(target: any): {
        range: {
            startLineNumber: number;
            startColumn: number;
            endLineNumber: number;
            endColumn: any;
        };
        text: any;
    } | null;
    getSegmentationFallbackEntry(): any;
    getSegmentationSelections(): any;
    updateSegmentationContextMenuTarget(target: any): void;
    clearSegmentationContextMenuTarget(): void;
    updateSegmentationSelectionContextKey(): void;
    createEditorOptions(initialValue: any, editorTheme: any, { language }?: {
        language?: string | undefined;
    }): {
        wordWrap: string;
        wrappingStrategy: string;
        wordSeparators: string;
        occurrencesHighlight: string;
        snippetSuggestions: string;
        scrollBeyondLastLine: boolean;
        fixedOverflowWidgets: boolean;
        quickSuggestions: {
            other: boolean;
            comments: boolean;
            strings: boolean;
        };
        suggest: {
            snippetsPreventQuickSuggestions: boolean;
            showWords: boolean;
        };
        unicodeHighlight: {
            invisibleCharacters: boolean;
        };
        padding: {
            top: number;
            bottom: number;
        };
        lineNumbersMinChars: number;
        lineDecorationsWidth: number;
        value: any;
        language: string;
        theme: any;
        automaticLayout: boolean;
        minimap: {
            enabled: boolean;
        };
        renderWhitespace: string;
        fontSize: number;
        fontFamily: string;
        lineHeight: number;
    };
    isStackedViewport(): boolean;
    getViewportLayoutOptions(): {
        padding: {
            top: number;
            bottom: number;
        };
        lineNumbersMinChars: number;
        lineDecorationsWidth: number;
    };
    getEditorPadding(): {
        top: number;
        bottom: number;
    };
    syncViewportPadding(): void;
    getManualWordSuggestionNow(): number;
    isSuggestWidgetVisible(): boolean;
    beginManualWordSuggestionSession(): void;
    extendManualWordSuggestionSession(): void;
    clearManualWordSuggestionSession(): void;
    shouldProvideManualWordSuggestions(): any;
    shapeManualWordSuggestion(fragment: any, suggestion: any): string;
    collectDocumentWordSuggestions(model: any, fragment: any): import("../word-suggest.js").WordSuggestionEntry[];
    resolveManualWordSuggestionSuffix(languageCode: any, model: any, position: any): string;
    getManualWordSuggestionContext(model: any, position: any): import("../word-suggest.js").WordSuggestionContext | null;
    buildManualWordSuggestions(model: any, position: any, token: any): Promise<{
        incomplete: boolean;
        suggestions: any[];
    }>;
    registerManualWordCompletionProvider(): void;
    triggerManualWordSuggestions(): boolean;
    attachEditor(editor: any): void;
    getNativeCommandPaletteAction(): any;
    getNativeTriggerSuggestAction(): any;
    patchNativeCommandPaletteAction(): void;
    patchNativeTriggerSuggestAction(): void;
    shouldHandleNativePasteAction(): boolean;
    patchNativePasteAction(): void;
    registerNativePasteKeybinding(): void;
    registerNativeSelectAllKeybinding(): void;
    registerNativeCutKeybinding(): void;
    registerNativeCopyKeybinding(): void;
    ensureSpellcheckCustomDictionaryCommand(): void;
    hasWordListChanged(currentWords: any, nextWords: any): any;
    pruneStoredSpellcheckCustomDictionaryWords(languageCode: any): Promise<boolean>;
    prunePendingSpellcheckCustomDictionaryWords(): Promise<boolean>;
    runNativeCommandPaletteAction(): Promise<boolean>;
    registerActions(): void;
    getEditorMenuActions(): ({
        disabled: boolean;
        id: string;
        iconClass: string;
        label: string;
        scope: string;
        shortcutLabel?: undefined;
        pressed?: undefined;
    } | {
        disabled: boolean;
        id: string;
        iconClass: string;
        label: string;
        shortcutLabel: string;
        pressed: boolean;
        scope: string;
    } | {
        disabled: boolean;
        id: string;
        iconClass: string;
        label: string;
        pressed: boolean;
        scope: string;
        shortcutLabel?: undefined;
    })[];
    getEditorClipboardRange(): any;
    getEditorClipboardText(): {
        range: any;
        text: any;
    } | null;
    copyTextToClipboard(text: any): Promise<boolean>;
    copyEditorSelection(): Promise<boolean>;
    cutEditorSelection(): Promise<boolean>;
    readTextFromClipboard(): Promise<string>;
    pasteEditorClipboardText(): Promise<boolean>;
    getPasteNormalizationContext(selection: any): {
        leadingText?: undefined;
        trailingText?: undefined;
    } | {
        leadingText: any;
        trailingText: any;
    };
    runEditorMenuAction(actionId: any): Promise<boolean>;
    getInvisibleCharacterDecorationOptions(className?: string): {
        description: string;
        className: string;
        showIfCollapsed: boolean;
        stickiness: any;
        overviewRuler: null;
        minimap: null;
    };
    createInvisibleCharacterDecoration(lineNumber: any, startColumn: any, endColumn: any, options: any): {
        range: any;
        options: any;
    };
    collectInvisibleCharacterDecorations(model: any): {
        range: any;
        options: any;
    }[];
    updateInvisibleCharacterHighlightDecorations(): void;
    isWordWrapEnabled(): boolean;
    setWordWrap(wordWrapMode: any): void;
    toggleWordWrap(): void;
    formatDocument(): boolean;
    /**
     * Re-segment the current selection(s) with the first registered language
     * that offers a segmentation command. Nothing to do when none does.
     */
    applySegmentationToSelection(): Promise<any>;
    formatLineWhitespace(lineContent: any): any;
    toggleChordBars(): boolean;
    applyInvisibleCharacterHighlight(enabled: any): void;
    setInvisibleCharacterHighlight(enabled: any): void;
    hasEnabledSpellcheckLanguages(): boolean;
    applySpellcheckEnabledState(languageCode: any, enabled: any): any;
    refreshSpellcheckValidation(): Promise<void>;
    setSpellcheckEnabled(languageCode: any, enabled: any): Promise<void>;
    setAllSpellcheckEnabled(enabled: any): Promise<void>;
    toggleSpellcheck(): Promise<void>;
    handleEditorContentChange(contentChangeEvent?: null): void;
    syncSpellcheckState(): void;
}
export { MonacoFeatureController };

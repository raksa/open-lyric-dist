/**
 * Composition root for the editor application. It wires smaller controllers
 * together and keeps startup order explicit.
 */
declare class OpenLyricEditorApplication {
    constructor({ loadMonacoResources }: {
        loadMonacoResources: any;
    });
    initialize(): Promise<void>;
    getEditor(): null;
    /**
     * The shared mutable app state THIS application instance operates on.
     * Callers that already hold the instance (the dashboard, the e2e probe)
     * use this instead of importing `shared.ts` — a dynamic import can yield a
     * second module instance under Vite's HMR-stamped dev graph.
     */
    getSharedState(): {
        editor: null;
        editorMode: string;
        currentDocumentContent: string;
        lastSavedContent: string;
        fileName: string;
        sharedDocumentDate: string;
        openLyricPluginAvailable: boolean;
        openLyricHideKeys: boolean;
        openLyricHideLeadingBars: boolean;
        openLyricSimplifyChords: boolean;
        openLyricShowComments: boolean;
        openLyricStructureKeys: {};
        theme: string;
        highlightInvisibleCharacters: boolean;
        panelSizeWeights: {
            editor: number;
            preview: number;
            openLyric: number;
        };
        editorVisible: boolean;
        openLyricVisible: boolean;
        previewVisible: boolean;
        spellcheckLanguageStates: {
            en: boolean;
        };
        dirty: boolean;
        dragDepth: number;
        errorCount: number;
        validationTimer: number;
    };
    /** The live built-in OpenLyric notation registration (null if disabled). */
    getOpenLyricPluginRegistration(): {
        draftExamples: any;
        disposed: boolean;
        fonts: any;
        id: any;
        keyboardIds: any;
        openLyricIds: any[];
        openLyricSpecification: any;
        pluginData: any;
        pptxStyle: any;
        spellcheckLanguageCodes: any;
        styleEntries: never[];
        transcriptIds: any;
        transcriptLocales: any;
    } | null;
    /**
     * The app's own faces plus every face registered plugins contribute. A face
     * with no `@font-face` rule (the system fallbacks in a plugin's stack)
     * resolves immediately with no matches, so probing the whole contributed
     * list costs nothing and keeps the core free of any script's face name.
     */
    getInitialFontLoadSpecs(): any[];
    waitForInitialFonts(): Promise<void>;
    getEditorMode(): string;
    listAllSpellErrorLines(): Set<any>;
    getSimpleEditor(): Element | null;
    loadEditorModePreference(): void;
    getEditorLanguageId(): "markdown-ol" | "markdown";
    focusActiveEditorSurface(): void;
    shouldUseEditorActionsMenuForModeToggle(): boolean;
    syncEditorModeTogglePlacement(): void;
    syncEditorModeUi({ markdown }?: {
        markdown?: string | undefined;
    }): void;
    supportsSimpleEditorHistoryCommands(): boolean;
    canRunSimpleEditorHistoryCommand(): boolean;
    syncEditorHistoryButtons(): void;
    canClearActiveEditorText(): any;
    syncEditorClearTextButton(): void;
    canCopyActiveEditorText(): any;
    syncEditorCopyTextButton(): void;
    setEditorMode(nextMode: any, { focus }?: {
        focus?: boolean | undefined;
    }): Promise<void>;
    setLoadingState(message: any, stateName?: string): void;
    prepareAppShellForBoot(): void;
    completeBoot(): void;
    failBoot(message: any): void;
    initializeApplicationShell(): Promise<void>;
    bindEvents(): void;
    getEventTargetElement(event: any): Element | null;
    getMonacoTouchTargetPosition(clientX: any, clientY: any): any;
    isMonacoEditorPointerTarget(target: any): boolean;
    extendMonacoSelectionToTouchPosition(clientX: any, clientY: any): boolean;
    scheduleTouchShiftSelectionRestore(selection: any, targetPosition: any): void;
    clearTouchShiftSelectionState(): void;
    isLikelyIosOrIpadOsBrowser(): boolean;
    isLikelyIosOrAndroidBrowser(): boolean;
    isTextEntryFocusableElement(element: any): boolean;
    focusElement(element: any, { preventScroll, skipTouchIosForButtons }?: {
        preventScroll?: boolean | undefined;
        skipTouchIosForButtons?: boolean | undefined;
    }): void;
    getKeyboardTranscriptNow(): number;
    isKeyboardTranscriptInputEvent(event: any): boolean;
    isLikelyKeyboardTranscriptText(text: any, { allowShortText }?: {
        allowShortText?: boolean | undefined;
    }): boolean;
    isMobileKeyboardTranscriptFallbackEvent(event: any): boolean;
    shouldTrackKeyboardTranscriptInputEvent(event: any): boolean;
    createMobileKeyboardTranscriptFallbackInput(text: any, mode: any): {
        data: string;
        locale: any;
        mode: any;
        time: number;
    } | null;
    resolveKeyboardTranscriptLocale(): any;
    trackKeyboardTranscriptInput(event: any, { mode }?: {
        mode?: string | undefined;
    }): {
        data: any;
        locale: any;
        mode: string;
        time: number;
    } | null;
    pruneKeyboardTranscriptInputs(): void;
    consumeKeyboardTranscriptInput({ insertedText, mode, }?: {
        insertedText?: string | undefined;
        mode?: string | undefined;
    }): any;
    handleEditorBeforeInput(event: any): void;
    handleSimpleEditorBeforeInput(event: any): void;
    getChangedTextRange(previousValue: any, nextValue: any): {
        end: number;
        start: number;
        text: string;
    };
    consumeSimpleKeyboardTranscriptInput(event: any): {
        locale: any;
        end: number;
        start: number;
        text: string;
    } | null;
    hasPendingKeyboardTranscriptSegmentation(): boolean;
    scheduleKeyboardTranscriptSegmentation(): void;
    cancelPendingKeyboardTranscriptSegmentation(): void;
    flushKeyboardTranscriptSegmentation(): any;
    queueKeyboardTranscriptSimpleSegmentation(change: any): any;
    applyKeyboardTranscriptSimpleSegmentation(change: any): Promise<void>;
    handleSimpleEditorInput(event: any): void;
    handleSimpleEditorPaste(event: any): void;
    handleSimpleEditorToggleChange(event: any): void;
    runSimpleEditorHistoryCommand(command: any): boolean;
    runEditorHistoryCommand(command: any): boolean;
    clearMonacoEditorText(): boolean;
    clearSimpleEditorText(): boolean;
    clearActiveEditorText(): boolean;
    copyActiveEditorText(): Promise<boolean>;
    handleEditorClearTextClick(event: any): void;
    handleEditorCopyTextClick(event: any): void;
    handleEditorUndoClick(): void;
    handleEditorRedoClick(): void;
    canFormatActiveEditor(): any;
    syncFormatDocumentButton(): void;
    insertSimpleEditorText(text: any): boolean;
    formatActiveEditorDocument(): any;
    formatSimpleEditorDocument(): boolean;
    createEditorMenuIcon(iconClass?: string): HTMLSpanElement;
    createEditorMenuGroup(scope: any, { split }?: {
        split?: boolean | undefined;
    }): HTMLDivElement;
    isEditorActionsElement(element: any): boolean;
    isMonacoCommandPaletteMenuItemElement(element: any): boolean;
    closeEditorActionsMenu(): void;
    clearEditorActionsMenuViewportBounds(): void;
    /**
     * Re-place the open menu — the toolbar wraps, the panel drag-resizes, and the
     * menu's own content changes as actions come and go.
     *
     * The menu is `position: fixed` (see `styles/_editor-panel-chrome.scss`), so
     * `floating-menu.ts` owns both the placement and the `max-height` that keeps
     * a long menu inside the viewport. It no longer has to stop at the enclosing
     * `.panel`: overhanging that panel is the point, so an editor embedded in a
     * host UI that clips or scrolls it still shows the whole menu.
     */
    syncEditorActionsMenuViewportBounds(): void;
    renderEditorContextMenuActions(): void;
    syncEditorActionsMenu(): void;
    openEditorActionsMenu(): void;
    handleEditorActionsToggleClick(event: any): void;
    handleEditorActionsFocusOut(event: any): void;
    handleEditorActionsMenuClick(event: any): Promise<void>;
    handleDocumentPointerDown(event: any): void;
    handleDocumentTouchShiftSelectionPointerDown(event: any): void;
    handleDocumentTouchShiftSelectionFollowUpEvent(event: any): void;
    handleWindowBeforeUnload(event: any): void;
    handleWindowDragEnter(event: any): void;
    handleWindowDragOver(event: any): void;
    handleWindowDragLeave(event: any): void;
    handleWindowDrop(event: any): void;
    handleWindowKeydown(event: any): void;
    handleWindowKeyup(event: any): void;
    handleWindowBlur(): void;
    handleWindowResize(): void;
    handlePanelVisibilityChange(panelVisibility: any): void;
    syncEditorLanguage(): void;
    clearOpenLyricValidationState(): void;
    syncOpenLyricPluginAvailability({ updateUi }?: {
        updateUi?: boolean | undefined;
    }): void;
    handleOpenLyricPluginEnabledChange(nextEnabled: any): void;
    disposeKeyboardController(keyboardId: any): void;
    disposeTranscriptController(): void;
    getPrimaryKeyboardSpecification(): any;
    getPrimaryTranscriptSpecification(): any;
    getKeyboardActionLabel(): any;
    getKeyboardControllers(): unknown[];
    hasKeyboardController(): boolean;
    isKeyboardOpen(): boolean;
    openPrimaryKeyboard(): void;
    closeOpenKeyboards(): void;
    toggleKeyboard(): void;
    syncKeyboardToggleButton(): void;
    handleKeyboardPluginStateChange(): void;
    handleTranscriptPluginStateChange(): void;
    syncKeyboardPlugins(): void;
    syncTranscriptPlugins(): void;
    handlePluginRegistryChange(event: any): void;
    handleEditorContentChange(contentChangeEvent?: null): void;
    handleKeyboardTranscriptMonacoContentChange(contentChangeEvent: any): void;
    queueKeyboardTranscriptMonacoSegmentation(targets: any, locale: any): any;
    applyKeyboardTranscriptMonacoSegmentation(targets: any): Promise<void>;
    initializeEditor({ showLoadingState }?: {
        showLoadingState?: boolean | undefined;
    }): Promise<void>;
    loadMonacoRuntime(): Promise<void>;
    ensureMonacoLoaded({ showLoadingState }?: {
        showLoadingState?: boolean | undefined;
    }): Promise<void>;
}
export { OpenLyricEditorApplication };

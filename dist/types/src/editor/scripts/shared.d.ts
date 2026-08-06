import { CONFIG_LOCALE_VALUES } from './config-locales.js';
declare function escapeRegex(value: any): any;
declare const LANGUAGE_ID = "markdown-ol";
declare const LANGUAGE_THEME = "open-lyric-light";
declare const DARK_LANGUAGE_THEME = "open-lyric-dark";
declare const BS_LANGUAGE_THEME = "open-lyric-light-bs";
declare const BS_DARK_LANGUAGE_THEME = "open-lyric-dark-bs";
/** Registered Monaco theme per app theme — the only place the mapping lives. */
declare const MONACO_THEME_BY_APP_THEME: {
    light: string;
    dark: string;
    'light-bs': string;
    'dark-bs': string;
};
declare const DEFAULT_THEME = "dark";
declare const THEME_STORAGE_KEY = "open-lyric-editor-theme";
declare const LEGACY_THEME_STORAGE_KEY = "editor-theme";
declare const MARKER_OWNER = "open-lyric-lexical";
declare const VALIDATION_DELAY_MS = 150;
declare const ZERO_WIDTH_SPACE = "\u200B";
declare const MONACO_WORD_SEPARATORS = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?\u200B";
declare const MONACO_WORD_PATTERN: RegExp;
declare const FORM_SECTION_NAMES: string[];
declare const LYRIC_SECTION_NAMES: string[];
declare const INSTRUMENTAL_SECTION_NAMES: string[];
declare const FREE_TEXT_SECTION_NAMES: string[];
declare const NUMBERED_SECTION_NAMES: string[];
declare const CONFIG_FIELD_NAMES: string[];
declare const CONFIG_FIELD_ALIASES: {
    'Strumming Pattern': string;
};
declare const CONFIG_FIELD_MATCH_NAMES: string[];
declare const CONFIG_REQUIRED_FIELD_NAMES: string[];
declare const CONFIG_MULTILINE_FIELD_NAMES: string[];
declare const CONFIG_KEY_VALUES: string[];
declare const CONFIG_ENUM_FIELD_VALUES: {
    Key: string[];
    Time: string[];
};
declare const CONFIG_PATTERN_FIELD_VALUES: {
    Tempo: RegExp;
};
declare const CONFIG_LOCALE_SEPARATOR = ",";
/**
 * True when the text is written in a script a REGISTERED language plugin
 * claims, via that plugin's `baseLetterPattern`.
 *
 * Registry-driven, with no pattern of its own: with no language plugin
 * composed this is always false, and every "does this text need
 * script-specific handling?" branch below stays off. That is the point — the
 * core carries no script's character range.
 */
declare function hasScriptBaseLetter(value: any): boolean;
/**
 * True when the text carries a registered language's invisible word separator
 * AND is written in that language's script — i.e. those zero-width characters
 * are real word boundaries, not stray invisible junk to strip.
 */
declare function shouldAllowInvisibleWordSeparators(value: any, contextValue?: any): boolean;
/**
 * Repair whitespace typed between words of a script that separates them
 * invisibly, rewriting each run to the language's own separator.
 *
 * The rule comes entirely from the plugin — `wordSeparatorPattern` (whose
 * first capture group is the character to keep) plus `wordSeparator`. Used by
 * paste handling and the Format action; a no-op with no such language
 * registered.
 */
declare function normalizeWordSeparators(value: any, options?: {}): any;
declare function isSpaceLikeCharacter(character: any, allowZeroWidthSpace?: boolean): boolean;
declare function getLeadingSpaceLikeLength(value: any, allowZeroWidthSpace?: boolean): number;
declare function trimSpaceLikeStart(value: any, allowZeroWidthSpace?: boolean): string;
declare function trimSpaceLikeEnd(value: any, allowZeroWidthSpace?: boolean): string;
declare function trimSpaceLikeText(value: any, allowZeroWidthSpace?: boolean): string;
declare function collapseSpaceLikeText(value: any, replacement?: string, allowZeroWidthSpace?: boolean): string;
declare function normalizeConfigFieldName(fieldName: any): any;
/**
 * Split a `Locales` value into its comma-separated tags, each with the offsets
 * it occupies inside the value text.
 *
 * The offsets are what make this shared: validation turns them into marker
 * columns, and the Monaco completion turns them into a replace range. Empty
 * segments (a stray or trailing comma) are kept rather than dropped — an empty
 * entry is a thing to report, so it must survive the parse.
 */
declare function parseConfigLocaleEntries(value: any, allowZeroWidthSpace?: boolean): {
    text: string;
    startOffset: number;
    endOffset: number;
}[];
declare function isSupportedConfigLocale(value: any): boolean;
/**
 * The supported tag that only differs from `value` in case — `''` when the tag
 * is unknown however it is cased. Locale tags are written `en-US`, so a typed
 * `en-us` is a casing slip worth naming in the message rather than a different
 * value.
 */
declare function findCanonicalConfigLocale(value: any): string;
declare function normalizeStrummingPatternValue(value: any, allowZeroWidthSpace?: boolean): string;
declare function isValidStrummingPatternValue(value: any, allowZeroWidthSpace?: boolean): boolean;
declare const CHORD_KEY_GROUPS: {
    name: any;
    keys: any;
}[];
declare const CONFIG_HEADER_RE: RegExp;
declare const INTRO_HEADER_RE: RegExp;
declare const INSTRUMENTAL_HEADER_RE: RegExp;
declare const LYRIC_HEADER_RE: RegExp;
declare const FREE_TEXT_HEADER_RE: RegExp;
declare const CHORD_SYMBOL_SOURCE: string;
declare const CHORD_SYMBOL_RE: RegExp;
declare const CHORD_ANNOTATION_RE: RegExp;
declare const INTRO_DIRECTIVE_RE: RegExp;
declare const INSTRUMENTAL_DIRECTIVE_RE: RegExp;
declare const INTRO_OR_CUE_DIRECTIVE_RE: RegExp;
declare const REPEAT_SUFFIX_RE: RegExp;
declare function hasChordProgressionText(value: any, allowZeroWidthSpace?: boolean): boolean;
declare const DEFAULT_CONTENT: string;
declare const DEFAULT_PANEL_VISIBILITY: {
    editorVisible: boolean;
    previewVisible: boolean;
    openLyricVisible: boolean;
};
declare const DRAFT_STORAGE_KEY = "open-lyric-editor-draft";
declare const DEFAULT_EDITOR_MODE = "monaco";
declare const state: {
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
declare const runtime: {
    editorActivityCount: number;
    unsavedChangesToastTimer: number;
    unloadAttemptCount: number;
    unloadAttemptResetTimer: number;
    languageRegistered: boolean;
    monacoBooted: boolean;
    autoSuggestEnabledContextKey: null;
    invisibleCharacterDecorations: null;
    invisibleCharacterHighlightContextKey: null;
    segmentationSelectionContextKey: null;
    dictionaryMenuDisposables: never[];
    dictionaryLookupKey: string;
    lineCommentMenuDisposable: null;
    manualWordCompletionProviderDisposable: null;
    manualWordSuggestionInitialExpiryMs: number;
    manualWordSuggestionSessionExpiryMs: number;
    spellcheckActionDisposables: Map<any, any>;
    spellcheckMenuDisposables: never[];
    spellcheckCustomDictionaryCommandDisposable: null;
    spellcheckContextKeys: Map<any, any>;
    spellcheckEnabledContextKey: null;
};
declare const refs: {
    app: Element | null;
    appLoading: HTMLElement | null;
    appLoadingMessage: HTMLElement | null;
    topbar: Element | null;
    cancelSharedLinkPasswordBtn: Element | null;
    closeResetExampleDialogBtn: Element | null;
    closeShareLinkBtn: Element | null;
    closeShareLinkQrFullscreenBtn: Element | null;
    closeSpellcheckCustomDictionaryBtn: Element | null;
    addSpellcheckCustomDictionaryWordBtn: Element | null;
    addSpellcheckCustomDictionaryExtraWordBtn: Element | null;
    copyShareLinkBtn: Element | null;
    copySpellcheckCustomDictionaryBtn: Element | null;
    copySpellcheckCustomDictionaryEmailBtn: Element | null;
    reportSpellcheckCustomDictionaryBtn: Element | null;
    editorActions: Element | null;
    editorActionsBtn: Element | null;
    editorActionsContextMenu: Element | null;
    editorActionsDivider: Element | null;
    editorActionsMenu: Element | null;
    editorModeToggleMenuSlot: Element | null;
    editorModeToggleToolbarSlot: Element | null;
    editorTranscriptLocaleSelect: Element | null;
    editorTranscriptUploadBtn: Element | null;
    editorTranscriptUploadDialog: Element | null;
    editorTranscriptUploadForm: Element | null;
    editorTranscriptUploadFileInput: Element | null;
    editorTranscriptUploadApiKeyInput: Element | null;
    editorTranscriptUploadLocaleSelect: Element | null;
    editorTranscriptUploadMessage: Element | null;
    editorTranscriptUploadPermissionTip: Element | null;
    editorTranscriptUploadPermissionInstructionBtn: Element | null;
    editorTranscriptUploadPermissionDialog: Element | null;
    closeEditorTranscriptUploadPermissionDialogBtn: Element | null;
    closeEditorTranscriptUploadBtn: Element | null;
    submitEditorTranscriptUploadBtn: Element | null;
    editorTranscriptBrowserWarning: Element | null;
    editorTranscriptDownloadChromeWarning: Element | null;
    editorTranscriptStatus: Element | null;
    editorTranscriptToggleBtn: Element | null;
    editorClearTextBtn: Element | null;
    editorCopyTextBtn: Element | null;
    editorRedoBtn: Element | null;
    editorResetBtn: Element | null;
    editorSaveBtn: Element | null;
    editorHost: Element | null;
    editorUndoBtn: Element | null;
    simpleEditorTextarea: Element | null;
    simpleEditorToggleControl: Element | null;
    simpleEditorToggle: Element | null;
    fileInput: Element | null;
    keyboardToggleBtn: Element | null;
    loadBlankExampleBtn: Element | null;
    loadSelectedExampleBtn: Element | null;
    openBtn: Element | null;
    parseRawTextBtn: Element | null;
    parseRawTextSubmitBtn: Element | null;
    resetExampleDialog: Element | null;
    resetExampleList: Element | null;
    rawTextImportDialog: Element | null;
    rawTextImportForm: Element | null;
    rawTextImportMessage: Element | null;
    rawTextImportTextarea: Element | null;
    clearSpellcheckCustomDictionaryBtn: Element | null;
    closeRawTextImportBtn: Element | null;
    saveBtn: Element | null;
    shareLinkBtn: Element | null;
    shareLinkDialog: Element | null;
    shareLinkEncryptionFields: Element | null;
    shareLinkEncryptionToggle: Element | null;
    shareLinkMessage: Element | null;
    shareLinkModeLinkInput: Element | null;
    shareLinkModeQrLinkInput: Element | null;
    shareLinkModeQrTextInput: Element | null;
    shareLinkPasswordConfirmInput: Element | null;
    shareLinkPasswordInput: Element | null;
    shareLinkQrTextChunkFields: Element | null;
    shareLinkQrTextChunkLengthInput: Element | null;
    shareLinkQrFullscreenDialog: Element | null;
    shareLinkQrFullscreenItems: Element | null;
    shareLinkQrFullscreenMessage: Element | null;
    shareLinkQrFullscreenPlaceholder: Element | null;
    shareLinkQrItems: Element | null;
    shareLinkQrMessage: Element | null;
    shareLinkQrPanel: Element | null;
    shareLinkQrPlaceholder: Element | null;
    shareLinkTextarea: Element | null;
    sharedLinkPasswordDialog: Element | null;
    sharedLinkPasswordForm: Element | null;
    sharedLinkPasswordInput: Element | null;
    sharedLinkPasswordMessage: Element | null;
    submitSharedLinkPasswordBtn: Element | null;
    downloadBtn: Element | null;
    copyOpenLyricTextBtn: Element | null;
    downloadOpenLyricImageBtn: Element | null;
    downloadOpenLyricPowerPointBtn: Element | null;
    editorVersionBadge: Element | null;
    openLyricOptions: Element | null;
    openLyricOptionsBtn: Element | null;
    openLyricOptionsMenu: Element | null;
    openLyricExportProgress: Element | null;
    openLyricExportProgressBar: Element | null;
    openLyricExportProgressLabel: Element | null;
    markdownPreviewOptions: Element | null;
    markdownPreviewOptionsBtn: Element | null;
    markdownPreviewOptionsMenu: Element | null;
    markdownPreviewExportProgress: Element | null;
    markdownPreviewExportProgressBar: Element | null;
    markdownPreviewExportProgressLabel: Element | null;
    markdownPreviewDocxFileNameInput: Element | null;
    downloadMarkdownPreviewImageBtn: Element | null;
    downloadMarkdownPreviewDocxBtn: Element | null;
    goToMarkdownDocBtn: Element | null;
    printOpenLyricBtn: Element | null;
    printMarkdownPreviewBtn: Element | null;
    previewOpenLyricHideBarsBtn: Element | null;
    previewOpenLyricHideKeysBtn: Element | null;
    previewOpenLyricShowCommentsToggle: Element | null;
    previewOpenLyricSimplifyBtn: Element | null;
    previewSettings: Element | null;
    previewSettingsBtn: Element | null;
    previewSettingsMenu: Element | null;
    previewStructureKeyNextBtn: Element | null;
    previewStructureKeyPreviousBtn: Element | null;
    previewStructureKeySelect: Element | null;
    formatDocumentBtn: Element | null;
    resetBtn: Element | null;
    resetPreviewTypographyBtn: Element | null;
    toggleChordBarsBtn: Element | null;
    toggleEditorBtn: Element | null;
    shellResizeHandles: Element | null;
    spellcheckToggleBtn: Element | null;
    toggleOpenLyricBtn: Element | null;
    togglePreviewBtn: Element | null;
    themeToggleBtn: Element | null;
    themeMenu: Element | null;
    topbarMeta: Element | null;
    topbarActions: Element | null;
    topbarActionsBtn: Element | null;
    topbarActionsMenu: Element | null;
    topbarResetBtn: Element | null;
    topbarSaveBtn: Element | null;
    editorPanel: Element | null;
    openLyricPanel: Element | null;
    openLyricPreview: Element | null;
    preview: Element | null;
    previewPanel: Element | null;
    shell: Element | null;
    spellcheckCustomDictionaryDialog: Element | null;
    spellcheckExcludedWordsList: Element | null;
    spellcheckCustomDictionaryEmptyState: Element | null;
    spellcheckCustomDictionaryLanguageSelect: Element | null;
    spellcheckCustomDictionaryExtraLanguageSelect: Element | null;
    spellcheckCustomDictionaryList: Element | null;
    spellcheckCustomDictionaryMessage: Element | null;
    spellcheckCustomDictionaryWordInput: Element | null;
    spellcheckCustomDictionaryExtraWordInput: Element | null;
    sharedDocumentDate: Element | null;
    status: Element | null;
    unsavedChangesToast: Element | null;
    unsavedChangesToastAttempts: Element | null;
};
/**
 * Re-resolve element refs after shell panel markup lands in the DOM.
 *
 * `refs` and the panel-visibility defaults are captured when this module
 * first evaluates, which may be before the surface classes install their
 * shell panel markup (`Editor.installShellMarkup()` and friends). Those
 * installers call this afterwards to fill in refs that were still null and
 * to re-seed the default panel visibility for panels that just appeared.
 * Refs that already resolved are left untouched, and the visibility
 * defaults are only re-seeded when they actually changed, so late or
 * repeated calls cannot clobber user panel toggles.
 */
declare function refreshElementRefs(): void;
declare function setSharedDocumentDate(value: any): void;
declare function setStatus(message: any): void;
declare function supportsClipboardCopy(): boolean;
declare function supportsClipboardPaste(): boolean;
declare function syncEditorActivityState(): void;
declare function startEditorActivity(): () => void;
/**
 * Mirror the unsaved-changes flag onto the editor panel as `data-dirty`, which
 * is what paints the panel's red top border (`styles/shell.scss`), and onto
 * the editor tools menu's document group, whose Reset and Save buttons are
 * enabled only while there is something to discard or write.
 *
 * It tracks `state.dirty` exactly, so both markers mean the same condition the
 * unload guard prompts on — see
 * `OpenLyricEditorApplication.handleWindowBeforeUnload`. "Dirty" here means
 * *not written to disk*: every keystroke still autosaves the draft to browser
 * storage, so a reload restores the text either way.
 */
declare function syncEditorDirtyState(): void;
/**
 * Count one unload attempt and report how many more the guard will block.
 *
 * `0` means "let this one through" — the caller must not cancel the event.
 * The streak lapses `UNLOAD_ATTEMPT_RESET_MS` after the last attempt; the
 * timer only starts ticking once the native dialog is dismissed, because the
 * dialog blocks the renderer's event loop, so the window is measured from the
 * user's answer rather than from the keypress.
 */
declare function registerUnloadAttempt(): number;
/**
 * Drop the unload streak — on the reset timer, and whenever the document
 * stops being dirty (a save answers the question the streak was asking).
 */
declare function resetUnloadAttempts(): void;
/**
 * Show the unsaved-changes toast for an unload attempt.
 *
 * A `beforeunload` handler cannot put its own wording in the browser's dialog
 * — that text is fixed by the browser — so this is the only way to explain
 * *why* the reload was interrupted, and the only place the escape hatch can be
 * advertised. It paints behind the native dialog and stays up afterwards,
 * which is what the user sees when they cancel.
 */
declare function showUnsavedChangesToast(remainingAttempts?: number): void;
declare function hideUnsavedChangesToast(): void;
declare function updateStatus(): void;
declare function setErrorCount(nextErrorCount: any): void;
declare function getCurrentValue(): any;
declare function setCurrentDocumentContent(value: any): void;
declare function setSimpleEditorValue(value: any): void;
declare function markDirty(nextDirty: any): void;
declare function setDropActive(active: any): void;
declare const constants: {
    LANGUAGE_ID: string;
    LANGUAGE_THEME: string;
    DARK_LANGUAGE_THEME: string;
    BS_LANGUAGE_THEME: string;
    BS_DARK_LANGUAGE_THEME: string;
    MONACO_THEME_BY_APP_THEME: {
        light: string;
        dark: string;
        'light-bs': string;
        'dark-bs': string;
    };
    DEFAULT_THEME: string;
    THEME_STORAGE_KEY: string;
    MARKER_OWNER: string;
    VALIDATION_DELAY_MS: number;
    MONACO_WORD_PATTERN: RegExp;
    MONACO_WORD_SEPARATORS: string;
    DEFAULT_CONTENT: string;
    DEFAULT_PANEL_VISIBILITY: {
        editorVisible: boolean;
        previewVisible: boolean;
        openLyricVisible: boolean;
    };
    DRAFT_STORAGE_KEY: string;
    DEFAULT_EDITOR_MODE: string;
    CHORD_SYMBOL_SOURCE: string;
    CHORD_SYMBOL_RE: RegExp;
    CHORD_ANNOTATION_RE: RegExp;
    INTRO_DIRECTIVE_RE: RegExp;
    INTRO_OR_CUE_DIRECTIVE_RE: RegExp;
    INSTRUMENTAL_DIRECTIVE_RE: RegExp;
    REPEAT_SUFFIX_RE: RegExp;
};
declare const grammar: {
    FORM_SECTION_NAMES: string[];
    LYRIC_SECTION_NAMES: string[];
    INSTRUMENTAL_SECTION_NAMES: string[];
    FREE_TEXT_SECTION_NAMES: string[];
    NUMBERED_SECTION_NAMES: string[];
    CONFIG_FIELD_ALIASES: {
        'Strumming Pattern': string;
    };
    CONFIG_FIELD_NAMES: string[];
    CONFIG_FIELD_MATCH_NAMES: string[];
    CONFIG_REQUIRED_FIELD_NAMES: string[];
    CONFIG_MULTILINE_FIELD_NAMES: string[];
    CONFIG_KEY_VALUES: string[];
    CONFIG_LOCALE_SEPARATOR: string;
    CONFIG_LOCALE_VALUES: string[];
    CONFIG_ENUM_FIELD_VALUES: {
        Key: string[];
        Time: string[];
    };
    CONFIG_PATTERN_FIELD_VALUES: {
        Tempo: RegExp;
    };
    CHORD_KEY_GROUPS: {
        name: any;
        keys: any;
    }[];
    CONFIG_HEADER_RE: RegExp;
    INTRO_HEADER_RE: RegExp;
    INSTRUMENTAL_HEADER_RE: RegExp;
    LYRIC_HEADER_RE: RegExp;
    FREE_TEXT_HEADER_RE: RegExp;
};
declare const helpers: {
    escapeRegex: typeof escapeRegex;
    startEditorActivity: typeof startEditorActivity;
    setStatus: typeof setStatus;
    syncEditorActivityState: typeof syncEditorActivityState;
    updateStatus: typeof updateStatus;
    setErrorCount: typeof setErrorCount;
    getCurrentValue: typeof getCurrentValue;
    markDirty: typeof markDirty;
    setCurrentDocumentContent: typeof setCurrentDocumentContent;
    setSimpleEditorValue: typeof setSimpleEditorValue;
    setSharedDocumentDate: typeof setSharedDocumentDate;
    setDropActive: typeof setDropActive;
    supportsClipboardCopy: typeof supportsClipboardCopy;
    supportsClipboardPaste: typeof supportsClipboardPaste;
};
export { CHORD_ANNOTATION_RE, CHORD_KEY_GROUPS, CHORD_SYMBOL_RE, CHORD_SYMBOL_SOURCE, collapseSpaceLikeText, CONFIG_ENUM_FIELD_VALUES, CONFIG_FIELD_ALIASES, CONFIG_FIELD_NAMES, CONFIG_FIELD_MATCH_NAMES, CONFIG_HEADER_RE, CONFIG_KEY_VALUES, CONFIG_LOCALE_SEPARATOR, CONFIG_LOCALE_VALUES, CONFIG_MULTILINE_FIELD_NAMES, CONFIG_PATTERN_FIELD_VALUES, CONFIG_REQUIRED_FIELD_NAMES, BS_DARK_LANGUAGE_THEME, BS_LANGUAGE_THEME, DARK_LANGUAGE_THEME, MONACO_THEME_BY_APP_THEME, DEFAULT_CONTENT, DEFAULT_EDITOR_MODE, DEFAULT_PANEL_VISIBILITY, DEFAULT_THEME, DRAFT_STORAGE_KEY, FORM_SECTION_NAMES, FREE_TEXT_HEADER_RE, FREE_TEXT_SECTION_NAMES, getLeadingSpaceLikeLength, hasScriptBaseLetter, INSTRUMENTAL_DIRECTIVE_RE, INSTRUMENTAL_HEADER_RE, INSTRUMENTAL_SECTION_NAMES, INTRO_DIRECTIVE_RE, INTRO_OR_CUE_DIRECTIVE_RE, INTRO_HEADER_RE, isSpaceLikeCharacter, isValidStrummingPatternValue, LANGUAGE_ID, LANGUAGE_THEME, LEGACY_THEME_STORAGE_KEY, LYRIC_HEADER_RE, LYRIC_SECTION_NAMES, MARKER_OWNER, MONACO_WORD_PATTERN, MONACO_WORD_SEPARATORS, NUMBERED_SECTION_NAMES, normalizeWordSeparators, normalizeStrummingPatternValue, REPEAT_SUFFIX_RE, THEME_STORAGE_KEY, VALIDATION_DELAY_MS, ZERO_WIDTH_SPACE, constants, escapeRegex, findCanonicalConfigLocale, getCurrentValue, grammar, hasChordProgressionText, helpers, hideUnsavedChangesToast, isSupportedConfigLocale, markDirty, normalizeConfigFieldName, parseConfigLocaleEntries, refreshElementRefs, refs, registerUnloadAttempt, resetUnloadAttempts, runtime, shouldAllowInvisibleWordSeparators, showUnsavedChangesToast, startEditorActivity, setCurrentDocumentContent, setDropActive, setErrorCount, setSimpleEditorValue, setSharedDocumentDate, setStatus, state, supportsClipboardCopy, supportsClipboardPaste, syncEditorActivityState, syncEditorDirtyState, trimSpaceLikeEnd, trimSpaceLikeStart, trimSpaceLikeText, updateStatus, };

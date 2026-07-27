import type { Editor } from '../Editor.js';
export declare class EditorStandaloneChrome {
    private readonly component;
    private readonly uid;
    private readonly preferences;
    private container;
    private rootEl;
    private panel;
    private dialog;
    private els;
    private wordWrapEnabled;
    private invisibleCharactersHighlighted;
    /** Monaco decorations collection backing the invisible-character markers. */
    private invisibleCharacterDecorations;
    private autoSuggestEnabled;
    private dictionaryLanguage;
    private statusTimer;
    /** Registry handles for spellcheck specs this chrome published globally. */
    private readonly spellcheckRegistrations;
    private spellcheckBound;
    private previousGlobalEditor;
    /** The Ctrl/Cmd+Space window that answers while auto-suggest is off. */
    private readonly wordSuggestionSession;
    /** Monaco-level registrations (completion provider, action, listeners). */
    private readonly monacoDisposables;
    private readonly unsubscribes;
    private readonly documentListeners;
    constructor(component: Editor);
    /**
     * Wrap the component-owned root in the panel chrome. `rootEl` is the
     * element the component created inside `container`; it moves into the
     * panel body and is handed back untouched on {@link destroy}.
     */
    attach(rootEl: HTMLElement, container: HTMLElement): void;
    destroy(): void;
    /** The component switched surface (simple ⇄ Monaco): re-sync every control. */
    syncSurfaceState(): void;
    /** The document changed: refresh button availability and spellcheck. */
    handleValueChange(): void;
    private buildPanel;
    private panelMarkup;
    private captureRefs;
    private wire;
    private get isMenuOpen();
    private toggleMenu;
    private openMenu;
    private closeMenu;
    /**
     * On a narrow viewport the mode switch lives inside the tools menu (the
     * toolbar has no room for it) — the same placement rule as the app shell.
     */
    private syncModeTogglePlacement;
    private renderMenu;
    private createDivider;
    private createMenuButton;
    private runMenuAction;
    private buildMenuActions;
    private get isMonacoActive();
    /** The document the panel lives in — an embed may sit in another frame. */
    private get ownerDocument();
    private get canEditText();
    private get monacoEditor();
    private get keyboardPlugin();
    private toggleKeyboard;
    /**
     * The app's Format action: normalize Khmer word separators to ZWSP, collapse
     * repeated invisible characters, and drop trailing whitespace — per line,
     * as one undoable edit.
     */
    private formatDocument;
    private formatLine;
    private selectAll;
    /**
     * The Monaco selection, falling back to the caret's whole line (matching the
     * app's clipboard behavior with an empty selection).
     */
    private getClipboardRange;
    private copySelection;
    private cutSelection;
    private pasteFromClipboard;
    private replaceTextareaSelection;
    private loadEditorPreferences;
    /** Push the stored document preferences onto the live Monaco instance. */
    private applyEditorPreferences;
    private getInvisibleCharacterDecorationOptions;
    /**
     * Redraw the invisible-character markers.
     *
     * The scan is shared with the app (`scripts/invisible-characters.ts`), so a
     * standalone editor flags exactly the runs the app pages do.
     */
    private updateInvisibleCharacterDecorations;
    private setWordWrap;
    private setInvisibleCharacterHighlight;
    private setAutoSuggestEnabled;
    /**
     * The dictionary + document word completions the app pages get, wired to
     * this component's Monaco instance: the shared provider from
     * `scripts/word-suggest.ts`, the Ctrl/Cmd+Space manual trigger, and the
     * session bookkeeping that stops a lapsed trigger from popping the widget
     * on a later keystroke.
     */
    private registerWordSuggestions;
    /**
     * Monaco registers completion providers per language, page-wide, so every
     * standalone editor's provider is asked about every model. Answering only
     * for our own keeps a second embed on the page out of this one's results.
     */
    private shouldProvideWordSuggestions;
    /** Open the suggest widget on demand, whatever the auto-suggest setting. */
    private triggerWordSuggestions;
    private get spellcheckSpecifications();
    /**
     * Publish the spellcheck specs attached plugins contribute (the km-KH
     * Hunspell spec, …) to the page-global plugin registry the spellcheck engine
     * resolves through, and remember the registrations so teardown removes
     * exactly what this chrome added.
     */
    private registerPluginSpellcheckSpecifications;
    private unregisterPluginSpellcheckSpecifications;
    /** Point the (still page-global) spellcheck runtime at this component. */
    private bindSpellcheckRuntime;
    private unbindSpellcheckRuntime;
    private clearSpellcheckMarkersNow;
    private loadSpellcheckPreferences;
    private applySpellcheckWordLists;
    private isSpellcheckEnabled;
    private setSpellcheckEnabled;
    private setAllSpellcheckEnabled;
    private refreshSpellcheck;
    /**
     * The ranges "Try Khmer Segmentation" would re-segment: every non-empty
     * selection holding Khmer text, or the caret's line when nothing is selected.
     */
    private getKhmerSegmentationRanges;
    private applyKhmerSegmentation;
    private buildDictionaryDialog;
    private openDictionaryDialog;
    private closeDictionaryDialog;
    private renderDictionaryLists;
    private renderDictionaryList;
    private addDictionaryWord;
    private handleDictionaryListClick;
    private copyDictionary;
    private clearDictionary;
    private syncAll;
    private syncToolbarButtons;
    /** Transient one-line feedback under the surface (copy/paste outcomes). */
    private flashStatus;
    private clearStatusTimer;
    private handleDocumentPointerDown;
    private handleDocumentKeyDown;
}

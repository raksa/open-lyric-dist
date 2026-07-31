/** The Monaco action id both surfaces expose in the command palette. */
export declare const WORD_SUGGEST_ACTION_ID = "open-lyric.trigger-suggest";
/** Monaco's own "trigger suggest", which the manual shortcut delegates to. */
export declare const MONACO_TRIGGER_SUGGEST_ACTION_ID = "editor.action.triggerSuggest";
export declare const WORD_SUGGEST_SHORTCUT_LABEL = "Ctrl/Cmd+Space";
/**
 * How long a manual trigger keeps answering. The initial window covers the
 * first request Monaco makes right after the shortcut; the session window is
 * refreshed on every answered request, so the widget keeps up as the user
 * narrows the fragment but lapses once they move on.
 */
export declare const WORD_SUGGEST_INITIAL_TTL_MS = 250;
export declare const WORD_SUGGEST_SESSION_TTL_MS = 1500;
export declare const WORD_SUGGEST_MAX_DOCUMENT_RESULTS = 20;
export declare const WORD_SUGGEST_MAX_DICTIONARY_RESULTS = 40;
/** `markdown` too, so the plain-markdown fallback model still gets words. */
export declare const WORD_SUGGEST_LANGUAGE_IDS: readonly string[];
/**
 * Autocomplete trigger characters, taken from the registered languages'
 * `suggestTriggerCharacters`.
 *
 * A script that runs without spaces has no separator keystroke to trigger on,
 * so every one of its letters has to be a trigger. Which letters those are is
 * the language plugin's business — each contributes its own range — so this
 * module carries no character range of its own.
 */
export declare function getWordSuggestTriggerCharacters(): string[];
/** The slice of a Monaco text model the suggestion pass needs. */
export interface WordSuggestionModel {
    getValue(): string;
    getLineContent(lineNumber: number): string;
}
export interface WordSuggestionPosition {
    lineNumber: number;
    column: number;
}
/** The partial word under the caret, and the range it occupies. */
export interface WordSuggestionContext {
    fragment: string;
    /** 1-based, Monaco column convention. */
    startColumn: number;
    endColumn: number;
}
export interface WordSuggestionEntry {
    detail: string;
    /** `null` when no registered spellcheck spec claims the word. */
    languageCode: string | null;
    suggestion: string;
}
/** One dictionary hit, as `scripts/spellcheck.ts` reports it. */
export interface DictionarySuggestion {
    sourceLabel?: string;
    suggestion: string;
}
export type LoadDictionarySuggestions = (word: string, options: {
    limit?: number;
}) => Promise<DictionarySuggestion[]> | DictionarySuggestion[];
export interface CancellationTokenLike {
    isCancellationRequested?: boolean;
}
/** Elapsed-time source: monotonic where available, so a clock change can't strand a session. */
export declare function wordSuggestionNow(): number;
/**
 * Match the fragment's casing so an ALL-CAPS or Capitalized prefix does not
 * come back lowercased from the dictionary.
 */
export declare function shapeWordSuggestion(fragment: string, suggestion: string): string;
/**
 * The word being typed, taken from the caret's own line.
 *
 * Monaco's `getWordUntilPosition` is not usable here: it splits on
 * `wordSeparators`, which for an invisibly separated script means the whole
 * run reads as one word.
 * Re-scanning the line with {@link MONACO_WORD_PATTERN} keeps both surfaces on
 * the same definition of a word as the language configuration.
 */
export declare function getWordSuggestionContext(model: WordSuggestionModel | null | undefined, position: WordSuggestionPosition | null | undefined): WordSuggestionContext | null;
/**
 * Words already in the document that extend the fragment — the fastest way to
 * stay consistent with terms this song has established, dictionary or not.
 * Shortest first, so the nearest completion is the default pick.
 */
export declare function collectDocumentWordSuggestions(model: WordSuggestionModel | null | undefined, fragment: string, limit?: number): WordSuggestionEntry[];
/**
 * What to append after an accepted word at end of line: the language's own
 * word separator (an invisible one for scripts that declare it, a plain space
 * otherwise). Mid-line acceptances append nothing — the following text already
 * provides the boundary.
 */
export declare function resolveWordSuggestionSuffix(languageCode: string | null, model: WordSuggestionModel | null | undefined, position: WordSuggestionPosition | null | undefined): string;
/** Where a session keeps its two expiry stamps (the app backs this with `runtime`). */
export interface WordSuggestionSessionStore {
    initialExpiryMs: number;
    sessionExpiryMs: number;
}
export interface WordSuggestionSession {
    /** A manual trigger fired: start answering. */
    begin(): void;
    /** A request was answered: keep answering while the user narrows the word. */
    extend(): void;
    clear(): void;
    isActive(): boolean;
}
export declare function createWordSuggestionSession(store?: WordSuggestionSessionStore, now?: () => number): WordSuggestionSession;
/**
 * Whether Monaco's suggest widget is on screen. Once it is open the user is in
 * a suggestion flow, so keep answering even with auto-suggest off.
 */
export declare function isSuggestWidgetVisible(ownerDocument?: Document | null | undefined): boolean;
/**
 * The manual-trigger chords. Apple hardware keeps Cmd+Space for the OS input
 * switcher / Spotlight, so plain Ctrl+Space is registered alongside it there.
 */
export declare function resolveWordSuggestKeybindings(monaco: any): number[];
export interface BuildWordSuggestionsOptions {
    monaco: any;
    model: WordSuggestionModel | null | undefined;
    position: WordSuggestionPosition | null | undefined;
    token?: CancellationTokenLike | null;
    session?: WordSuggestionSession | null;
    loadDictionarySuggestions?: LoadDictionarySuggestions;
    maxDocumentResults?: number;
    maxDictionaryResults?: number;
}
/**
 * Build the completion list for the word under the caret: document words
 * first (`zz1-` sort keys), then dictionary suggestions (`zz2-`), both after
 * anything the Open Lyric language itself contributes.
 */
export declare function buildWordSuggestions({ monaco, model, position, token, session, loadDictionarySuggestions, maxDocumentResults, maxDictionaryResults, }: BuildWordSuggestionsOptions): Promise<{
    incomplete: boolean;
    suggestions: any[];
}>;
export interface WordSuggestionProviderOptions extends Omit<BuildWordSuggestionsOptions, 'model' | 'position' | 'token'> {
    /**
     * Gate consulted per request — auto-suggest state, an active session, and
     * (for a standalone embed) whether the model is even this editor's, since
     * Monaco keeps completion providers page-globally.
     */
    shouldProvide?: (model: WordSuggestionModel, position: WordSuggestionPosition) => boolean;
}
export declare function createWordSuggestionProvider(options: WordSuggestionProviderOptions): any;
export interface RegisterWordSuggestionProviderOptions extends WordSuggestionProviderOptions {
    languageIds?: readonly string[];
}
/**
 * Register the provider for every supported language id. Monaco keeps
 * completion providers page-globally, so the returned disposable is what scopes
 * it to the caller's lifetime.
 */
export declare function registerWordSuggestionProvider({ languageIds, ...options }: RegisterWordSuggestionProviderOptions): {
    dispose(): void;
};

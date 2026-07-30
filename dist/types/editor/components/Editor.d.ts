import { OpenLyricComponent } from './internal/OpenLyricComponent.js';
import { type LoadMonacoResources } from './internal/monaco-boot.js';
import type { OpenLyricComponentOptions, OpenLyricEditorLike, OpenLyricSurface, OpenLyricTheme } from './internal/types.js';
/** Which surface a mounted `Editor` is currently editing through. */
export type EditorSurfaceKind = 'monaco' | 'textarea' | 'none';
export interface EditorOptions extends OpenLyricComponentOptions {
    /** Initial editor content. */
    value?: string;
    /** Override the Monaco runtime loader (defaults to the lazy chunk). */
    loadMonacoResources?: LoadMonacoResources;
    /** Model language id (defaults to the Open Lyric language). */
    language?: string;
    readOnly?: boolean;
    /**
     * Build the standalone editor chrome — the toolbar (Simple Editor switch,
     * undo/redo/clear/copy) and the `⋮` tools menu (Format, Keyboard, clipboard
     * actions, word wrap, invisible characters, auto-suggest, spellcheck, custom
     * dictionary) — around the surface. Defaults to `true`; pass `false` for a
     * bare surface whose chrome the host provides. Never built in shared-surface
     * (facade) mode, where the host application owns the chrome.
     */
    chrome?: boolean;
}
/**
 * Wrap-phase bridge to an editor surface owned by something else (the
 * application shell). All members are live accessors, so surface swaps on
 * the host side (Monaco ⇄ simple textarea) stay transparent.
 */
export interface EditorSharedSurfaceBridge {
    getValue(): string;
    setValue(next: string): void;
    focusRange(line: number, column: number): void;
    focus?(): void;
    getMonaco?(): unknown;
    getMonacoEditor?(): unknown;
}
/**
 * `Editor` — the standalone code editor (`gep`).
 *
 * Lazily boots Monaco with the Open Lyric language + theme into its own
 * container, with a plain-textarea fallback when Monaco cannot load. It
 * implements {@link OpenLyricEditorLike}, so it is exactly what the previews
 * bridge to: `editor` change events drive the preview, and a preview
 * double-click calls `focusRange` here to move the caret.
 *
 * Self-contained: it reuses the shared Monaco runtime chunk but wires nothing
 * into the global app (`state`/`refs`). Advanced editor features (spellcheck,
 * keyboard, transcript) arrive via the generic plugin system.
 *
 * Wrap phase: {@link attachSharedSurface} turns an instance into a live
 * facade over an editor surface the application owns — value reads/writes,
 * `focusRange`, the Monaco getters, and `change` events all work against the
 * real surface, but the component mounts nothing of its own and its plugins
 * stay dormant (the application provides those features through its shell).
 */
export declare class Editor extends OpenLyricComponent implements OpenLyricEditorLike {
    readonly surface: OpenLyricSurface;
    /**
     * Install the page-shell editor panel markup (`#editorPanel`) into the
     * page's `<template id="editorPanelMount">` placeholder — the editor
     * surface owns its shell panel. The page entries (`main-open-lyric.ts`,
     * `main-editor.ts`) call this before composing and booting the app; the
     * app's captured element refs refresh afterwards.
     * Idempotent, and a no-op on pages without the mount. On pages that also
     * compose the lyric preview, call this before
     * `OpenLyric.installShellMarkup()` — the OpenLyric shell mounts one of
     * its actions inside this panel.
     */
    static installShellMarkup(): void;
    private valueText;
    private readonly language;
    private readonly readOnly;
    private readonly loadMonacoResources;
    private readonly chromeEnabled;
    private monaco;
    private editorInstance;
    private model;
    private rootEl;
    private surfaceEl;
    private textareaEl;
    private simpleTextareaEl;
    private simpleModeEnabled;
    private chrome;
    private sharedSurfaceBridge;
    private readonly disposables;
    private lastEmittedValue;
    constructor(options?: EditorOptions);
    get value(): string;
    set value(next: string);
    getValue(): string;
    /** True when Monaco failed to load and the textarea fallback is active. */
    get isFallback(): boolean;
    /** Which surface edits currently go through. */
    get surfaceKind(): EditorSurfaceKind;
    /** True while the plain-textarea "Simple Editor" surface is showing. */
    get isSimpleMode(): boolean;
    /** The textarea edits currently go through (simple mode or fallback). */
    get activeTextarea(): HTMLTextAreaElement | null;
    /** True when the standalone toolbar + tools menu are mounted. */
    get hasChrome(): boolean;
    /** The attached plugin instances, in attach order. */
    get plugins(): import("./index.js").OpenLyricPlugin[];
    /** Every attached plugin's contribution for one kind (e.g. `language`). */
    pluginContributions<T = unknown>(kind: string): T[];
    /** True while this instance is a facade over a host-owned surface. */
    get isSharedSurface(): boolean;
    /**
     * The booted Monaco namespace (null before mount or in fallback mode).
     * For editor-surface plugins that wire Monaco-level features (on-screen
     * keyboards, actions); prefer the component API where it suffices.
     */
    get monacoNamespace(): any;
    /** The live Monaco editor instance (null before mount / fallback mode). */
    get monacoEditor(): any;
    /**
     * The Monaco runtime loader this instance was configured with (the shared
     * lazy chunk unless `loadMonacoResources` was passed).
     *
     * `Editor` owns Monaco loading for every surface it drives: an owned mount
     * boots through it in `handleMount()`, and in wrap phase
     * `OpenLyricDashboard` reads it here so the application it wraps loads the
     * runtime through this same loader. Overriding Monaco for a page therefore
     * means `new Editor({ loadMonacoResources })` — there is no second knob.
     */
    get monacoLoader(): LoadMonacoResources;
    protected getOwnedRoot(): HTMLElement | null;
    /** Move the caret to a source position, reveal it, and focus the surface. */
    focusRange(line: number, column: number): void;
    focus(): void;
    /**
     * Swap between the Monaco surface and the plain "Simple Editor" textarea,
     * carrying the document across. Monaco stays alive (and keeps its undo
     * stack) behind the hidden surface, exactly as the app shell does.
     */
    setSimpleMode(enabled: boolean): void;
    /** Undo one step on whichever surface is active. */
    undo(): boolean;
    /** Redo one step on whichever surface is active. */
    redo(): boolean;
    /** Empty the document through the active surface (one undoable edit). */
    clearText(): boolean;
    /** Copy the whole document to the clipboard. */
    copyAllText(): Promise<boolean>;
    /**
     * Clipboard write with the legacy `execCommand` fallback, so the chrome's
     * copy/cut actions work on browsers without the async clipboard API.
     */
    writeClipboardText(text: string): Promise<boolean>;
    private runHistoryCommand;
    private ensureSimpleTextarea;
    /**
     * Wrap phase: become a live facade over an editor surface the host owns
     * (see {@link EditorSharedSurfaceBridge}). Mutually exclusive with
     * `mount()` — a facade never builds a surface of its own, and its plugins
     * stay dormant (no `onMount`/`onValueChange`; attached plugins act as the
     * host's composition manifest and are still contract-validated).
     *
     * The host must call {@link notifySharedSurfaceValueChange} when the
     * shared document changes so `change` events fire here too.
     */
    attachSharedSurface(bridge: EditorSharedSurfaceBridge): void;
    /** Drop the facade bridge; the instance becomes an ordinary component. */
    detachSharedSurface(): void;
    /** Host notification that the shared surface's document changed. */
    notifySharedSurfaceValueChange(): void;
    protected handleMount(container: HTMLElement): Promise<void>;
    /**
     * Build the standalone toolbar + tools menu around the mounted surface. A
     * chrome failure must never take the editor down with it — the surface stays
     * usable without its panel.
     */
    private installChrome;
    protected handleUnmount(): void;
    protected handleDestroy(): void;
    protected handleReload(): void;
    protected handleThemeChange(theme: OpenLyricTheme): void;
    private bootMonaco;
    private bootTextarea;
    private setValueInternal;
    private emitValueChange;
    private lineColumnToOffset;
}

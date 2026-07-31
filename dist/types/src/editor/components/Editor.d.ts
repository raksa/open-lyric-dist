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
     * Font family the editor surfaces render with. Empty (the default) means
     * "whatever the attached plugins contribute, else the base stack" — see
     * {@link Editor.resolvedFontFamily}.
     */
    fontFamily?: string;
    /**
     * Font size the editor surfaces render text at — any CSS length, or a bare
     * number read as pixels. Empty (the default) leaves Monaco's own size and
     * the panel stylesheet's in charge. See {@link Editor.fontSize}.
     */
    fontSize?: string | number;
    /**
     * Build the standalone editor chrome — the toolbar (Simple Editor switch,
     * undo/redo/clear/copy) and the `⋮` tools menu (Format, Keyboard, clipboard
     * actions, word wrap, invisible characters, auto-suggest, spellcheck, custom
     * dictionary, and the Word Count + Font Size settings row) — around the
     * surface. Defaults to `true`; pass `false` for a
     * bare surface whose chrome the host provides. Never built in shared-surface
     * (facade) mode, where the host application owns the chrome.
     */
    chrome?: boolean;
    /**
     * Show the live selection readout ("All: 128 words / 687 chars") in the
     * corner of the editor panel. Defaults to `false`; see
     * {@link Editor.isSelectionStateEnabled}, which toggles it at any time.
     */
    selectionState?: boolean;
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
 * into the global app (`state`/`refs`), and it ships the Latin `@font-face`
 * declarations the surface renders with (`internal/editor-font-styles.ts`), so
 * neither a page entry nor an embed imports a font stylesheet. Advanced editor
 * features (spellcheck, keyboard, transcript) arrive via the generic plugin
 * system.
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
     *
     * Also links the Latin `@font-face` sheet the editor surface renders with
     * (`internal/editor-font-styles.ts`), as early in page life as the entry
     * calls this — a page entry needs no font import of its own.
     */
    static installShellMarkup(): void;
    /**
     * Link the app-page stylesheets the editor panel's shell chrome needs —
     * the theme tokens, the panel chrome in `shell.scss`, and the
     * narrow-viewport overrides — into `document.head`, the CSS counterpart of
     * {@link installShellMarkup}. The page entries call one `installShellStyle()`
     * per composed surface class; the sheets are shared, idempotent, and always
     * land in canonical cascade order (see `internal/shell-styles.ts`), so the
     * pages ship no `<link rel="stylesheet">` of their own.
     *
     * Deliberately NOT called from {@link installShellMarkup}: a bare embed page
     * (e.g. `ol-lyric-editor.html`) runs the markup install for its font faces
     * alone, and the app-shell sheets would restyle that host's page. The Latin
     * `@font-face` sheet is included here too, so calling this static is enough
     * on a page that installs no markup.
     */
    static installShellStyle(): void;
    private valueText;
    private readonly language;
    private readonly readOnly;
    private readonly loadMonacoResources;
    private readonly chromeEnabled;
    private fontFamilyValue;
    /** True once a stack was pushed onto the surfaces (see applyFontFamily). */
    private fontFamilyApplied;
    private fontSizeValue;
    /** True once a size was pushed onto the surfaces (see applyFontSize). */
    private fontSizeApplied;
    /** Monaco's own font size, captured before we ever override it. */
    private monacoDefaultFontSizePx;
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
    private selectionStateEnabled;
    private selectionStateTeardown;
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
    /**
     * The live selection readout in the corner of the editor panel — "All: 128
     * words / 687 chars" for the whole document, "Selected: …" once there is a
     * selection. Off by default; assigning toggles it immediately, and the
     * setting survives unmount/mount (the readout is rebuilt with the panel).
     *
     * It follows whichever surface this instance drives: its own Monaco or
     * Simple Editor textarea when mounted, and the application's editor panel
     * when the instance is a shared-surface facade (the app pages), where the
     * host owns the surfaces and swaps between them.
     */
    get isSelectionStateEnabled(): boolean;
    set isSelectionStateEnabled(next: boolean);
    /** The attached plugin instances, in attach order. */
    get plugins(): import("./index.js").OpenLyricPlugin[];
    /**
     * Host override for the face the surfaces render with. Empty (the default)
     * means "the stylesheet's own font" — see {@link resolvedFontFamily}.
     * Assigning re-applies immediately.
     */
    get fontFamily(): string;
    set fontFamily(next: string);
    /**
     * Font size the editor surfaces render text at — Monaco and the textareas
     * together, so both surfaces of one panel stay legible at the same scale.
     *
     * Any CSS length works (`18px`, `1.2rem`, `120%`); a bare number is read as
     * pixels, the same convention the previews use, so `editor.fontSize = 18`
     * and `editor.fontSize = '18px'` mean the same thing and the getter always
     * reports the normalized string. Assigning re-applies immediately.
     *
     * Empty (the default) is "no override": Monaco keeps its own size and the
     * textareas keep the panel stylesheet's, and clearing back to `''` after a
     * size was set really does restore them rather than freezing the last value.
     */
    get fontSize(): string;
    set fontSize(next: string | number);
    /**
     * The size the surfaces actually render at, in pixels — the {@link fontSize}
     * override resolved against the live page, or, with no override, whatever
     * Monaco and the panel stylesheet chose. 0 before there is any surface to
     * measure.
     *
     * This is what a host's size control seeds itself from, so it starts on the
     * real value instead of an assumed one.
     */
    get resolvedFontSizePx(): number;
    /**
     * The stack the surfaces actually render with: the {@link fontFamily}
     * override the host set, ahead of {@link EDITOR_FONT_BASE_STACK} so text the
     * override's face lacks still lands on the panel's usual monospace look.
     *
     * **Plugin-contributed faces are deliberately NOT part of this.** A language
     * plugin's `language.fontFaces` styles the *previews* (and the app pages'
     * font pickers) only — the editing surfaces keep their own font whatever is
     * composed, so attaching a language plugin never restyles the code the user
     * is typing. A host that does want that plugin's face in the editor asks for
     * it explicitly by assigning {@link fontFamily}.
     *
     * Empty without an override: nothing is pushed onto the surfaces then,
     * leaving the panel stylesheet and Monaco's own defaults in charge.
     */
    get resolvedFontFamily(): string;
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
     * Build or tear down the selection readout so it matches
     * {@link isSelectionStateEnabled} and the current lifecycle state.
     *
     * Called from every transition that changes what there is to read from:
     * mount (the panel now exists), unmount/destroy (it no longer does), and
     * attach/detach of a shared surface (the app's panel takes over). A readout
     * failure must never take the editor down with it.
     */
    private syncSelectionState;
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
    /**
     * Push {@link resolvedFontFamily} onto whichever surfaces exist — Monaco
     * through `updateOptions`, the fallback and Simple Editor textareas inline,
     * so both surfaces of one panel agree. Called on mount, when the host
     * assigns {@link fontFamily}, and when a surface is built late.
     *
     * With nothing to apply it does nothing unless it had pushed a stack before,
     * in which case it clears back to the stylesheet's own font — that is what
     * `fontFamilyApplied` tracks, so clearing the override really does undo it
     * instead of leaving the last stack stuck on the surfaces.
     */
    private applyFontFamily;
    /**
     * Push {@link fontSize} onto whichever surfaces exist. The CSS length goes
     * inline onto the Monaco host and the textareas; Monaco itself takes a
     * unitless pixel number, which is read back off the host it was just written
     * to — so `rem`/`%`/`em` resolve against the real page instead of an assumed
     * root size, and Monaco's glyph cell matches what the textareas render.
     *
     * Mirrors {@link applyFontFamily}: with nothing to apply it does nothing
     * unless it had pushed a size before, in which case it clears back to the
     * stylesheet's own size and hands Monaco back the size it booted with.
     */
    private applyFontSize;
    private setValueInternal;
    private emitValueChange;
    private lineColumnToOffset;
}

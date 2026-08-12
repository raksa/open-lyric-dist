import { OpenLyricComponent } from './internal/OpenLyricComponent.js';
import { type LoadMonacoResources } from './internal/monaco-boot.js';
import type { OpenLyricComponentOptions, OpenLyricEditorLike, OpenLyricSurface, OpenLyricTheme } from './internal/types.js';
import { type OpenLyricFenceLocation } from '../../plugins/OpenLyric/domain/fence-locations.js';
import { type EditorVerticalLine, type ResolvedEditorVerticalLine } from './internal/vertical-lines.js';
/** Which surface a mounted `Editor` is currently editing through. */
export type EditorSurfaceKind = 'monaco' | 'textarea' | 'none';
export type { EditorVerticalLine, ResolvedEditorVerticalLine, } from './internal/vertical-lines.js';
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
    /**
     * Own the Ctrl/Cmd+S keystroke on the mounted surface: swallow the browser's
     * "Save page" dialog and emit the `save` event instead. Defaults to `true` —
     * an editor that lets Ctrl+S offer to download the page is never what a host
     * wants, and the event is inert until something listens for it. Pass `false`
     * to leave the keystroke untouched. See
     * {@link Editor.isSaveShortcutEnabled}, which toggles it at any time.
     */
    saveShortcut?: boolean;
    /**
     * Vertical rules down the editing surface, at a column each — the guides a
     * host draws a line length at. See {@link Editor.setVerticalLines}, which
     * replaces them at any time; empty (the default) draws none.
     */
    verticalLines?: Array<EditorVerticalLine | number>;
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
/** Where inside a fence {@link Editor.focusFence} leaves the caret. */
export type EditorFenceFocusTarget = 'header' | 'body';
export interface EditorFenceFocusOptions {
    /**
     * Which match to use when more than one fence answers — a document that
     * declares the same part twice. Validation flags that, but the caret still
     * has to be able to reach the second one. 1-based; defaults to the first.
     */
    occurrence?: number;
    /**
     * `'header'` (the default) lands on the part name in the ```` ```ol: ````
     * opening line — where double-clicking a preview section title lands.
     * `'body'` lands at the start of the first body line, falling back to the
     * header line for a fence with no body.
     */
    target?: EditorFenceFocusTarget;
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
    private verticalLineList;
    /** True once rules were pushed onto the surfaces (see applyVerticalLines). */
    private verticalLinesApplied;
    /** The width-override sheet, built only for a rule thicker than Monaco's. */
    private verticalLinesStyleEl;
    /** Ties that sheet to this instance's surface, and to no other on the page. */
    private readonly verticalLinesScopeId;
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
    private saveShortcutEnabled;
    private saveShortcutTeardown;
    private readonly disposables;
    private lastEmittedValue;
    /** The text {@link isDirty} compares against — see {@link markSaved}. */
    private savedValueText;
    private dirtyFlag;
    constructor(options?: EditorOptions);
    get value(): string;
    /**
     * Assigning replaces the document *and* the {@link isDirty} baseline: a
     * host writing here is loading a document, not editing one, exactly as the
     * app shell's `applyDocumentContent()` marks a restored document clean (it
     * keeps the flag only for the ones it fabricates — example, blank, import).
     * Use {@link revertToSaved} to go back to the baseline instead of replacing
     * it.
     */
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
    /**
     * Whether Ctrl/Cmd+S over the mounted surface emits `save` instead of
     * reaching the browser's "Save page" dialog. On by default; assigning
     * toggles it immediately, and the setting survives unmount/mount.
     *
     * Only ever wired on an owned mount. A shared-surface facade installs
     * nothing — the host application owns key handling on its own panel — but
     * {@link requestSave} still works there.
     */
    get isSaveShortcutEnabled(): boolean;
    set isSaveShortcutEnabled(next: boolean);
    /**
     * Ask the host to persist the document — the programmatic form of the
     * Ctrl/Cmd+S shortcut, for a host that drives saving from its own chrome.
     * Emits `save` with the current value; the component persists nothing
     * itself, but it does {@link markSaved} — see there for why issuing the
     * command, not the host's acknowledgement, is what clears the flag.
     */
    requestSave(): void;
    /**
     * Whether the document differs from the last saved text — what the chrome's
     * Reset/Save pair is enabled by and what paints the panel's red top edge.
     *
     * Per instance: unlike the app shell's page-global `state.dirty`, two
     * standalone editors on one page track their own. It is a comparison, not a
     * latch, so editing and then undoing back to the saved text reads clean —
     * exactly the case where {@link revertToSaved} would do nothing.
     */
    get isDirty(): boolean;
    /**
     * Declare the current text saved: it becomes the {@link revertToSaved}
     * baseline and {@link isDirty} goes false.
     *
     * Called for you when a `save` is emitted (Ctrl/Cmd+S, {@link requestSave},
     * the chrome's Save) and when a host assigns {@link value}. As in the app
     * shell, the flag means "the user asked to save this document", not "the
     * host acknowledged" — a host that persists asynchronously and wants the
     * stricter reading can hold the mark until its write resolves by
     * re-assigning `value`.
     */
    markSaved(): void;
    /**
     * Reset — put the document back to the last saved text, dropping the edits
     * since. The counterpart of the save command, and a no-op when
     * {@link isDirty} is false.
     *
     * @returns whether anything was reverted.
     */
    revertToSaved(): boolean;
    /** The attached plugin instances, in attach order. */
    get plugins(): import("open-lyric").OpenLyricPlugin[];
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
    /**
     * The vertical rules currently drawn, normalized and ordered by column —
     * what {@link setVerticalLines} last accepted. A copy, so a host cannot edit
     * the live list behind the component's back.
     */
    get verticalLines(): ResolvedEditorVerticalLine[];
    /**
     * Draw vertical rules down the editing surface, one per entry, at a column
     * counted in characters:
     *
     * ```ts
     * editor.setVerticalLines([{ characters: 80, width: 1, color: '#000000FF' }]);
     * ```
     *
     * `width` (pixels, default 1) and `color` (any CSS color; default is the
     * surface's own faint ruler color) are optional, and a bare number is
     * shorthand for a rule at that column. Replaces the whole set, so an empty
     * array — or no argument — clears them. Applies immediately, and the setting
     * survives unmount/mount as the typography settings do.
     *
     * Both surfaces draw them, so flipping to the Simple Editor keeps the guides:
     * Monaco through its own `rulers`, the textareas through a background layer
     * per rule. A column is the width of one `x` in the surface's font, which is
     * how Monaco itself counts — exact on a monospace face, an approximation on
     * any other, and the same approximation on both surfaces.
     *
     * In shared-surface (facade) mode the rules are pushed onto the host
     * application's Monaco, which is the surface this instance is speaking for —
     * so call this once that surface exists (after the dashboard's `mount()`
     * resolves, say). A facade is never `mounted` in the component's own sense,
     * which is why there is no later hook that would re-assert them for you.
     */
    setVerticalLines(lines?: ReadonlyArray<EditorVerticalLine | number>): void;
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
     * Every Open Lyric fence the current document declares, in source order,
     * keyed the way the previews key them: `id` is the markdown preview's fence
     * element id and `songViewId` the lyric preview's, so the same value
     * addresses a fence in either direction — hand it to `focusFence` here, or
     * to `document.getElementById` / `PreviewController.jumpToPreviewFence` over
     * there.
     *
     * Read from the live document text on each call, so it is always current;
     * unrecognized ```` ```ol:… ```` headers are skipped, exactly as the
     * previews skip them.
     */
    getFences(): OpenLyricFenceLocation[];
    /**
     * Move the caret to a fence named by id, and return whether one matched.
     *
     * Tolerant about what "id" means: either preview's element id
     * (`ol-preview-target-chorus-1`, `ol-song-view-target-chorus-1`) or the part
     * name itself (`Chorus 1`) all resolve to the same fence, so a host can pass
     * back whatever it happens to be holding — the id it read off a clicked
     * preview element, or a name from {@link getFences}.
     */
    focusFence(fenceId: string, options?: EditorFenceFocusOptions): boolean;
    /**
     * Move the caret to the fence declaring `partName` (`'Chorus 1'`, `'Verse
     * 2'`, `'Config'`), and return whether one matched. Matching ignores case
     * and surrounding/repeated whitespace.
     */
    focusPart(partName: string, options?: EditorFenceFocusOptions): boolean;
    /**
     * The shared half of `focusFence`/`focusPart`: pick the requested occurrence
     * and hand the source position to {@link focusRange}, which is what makes
     * both work on every surface — Monaco, the simple textarea, and the shared
     * surface of a dashboard facade.
     */
    private focusMatchingFence;
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
     * Wire or drop the Ctrl/Cmd+S handler so it matches
     * {@link isSaveShortcutEnabled} and the current lifecycle state. Mirrors
     * {@link syncSelectionState}: called from mount, unmount and destroy.
     *
     * One DOM listener rather than a Monaco action, deliberately — it is the
     * only form that covers all three surfaces this component can be editing
     * through (Monaco, the fallback textarea, the Simple Editor textarea), and
     * a Monaco action alongside it would fire the event twice.
     */
    private syncSaveShortcut;
    private emitSave;
    /**
     * Mirror the dirty flag onto the chrome (the Reset/Save pair's enabled
     * state and the panel's red top edge). No-op when unchanged, so the chrome
     * is not re-rendered on every keystroke of an already-dirty document.
     */
    private setDirtyState;
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
     * Wire the value/focus/blur events a textarea surface emits, and register the
     * matching disposers. Shared by both textarea surfaces — the fallback one
     * {@link bootTextarea} builds when Monaco is unavailable, and the simple-mode
     * one {@link ensureSimpleTextarea} builds lazily.
     */
    private wireTextareaEvents;
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
    /**
     * Draw {@link verticalLines} on whichever surfaces exist — Monaco through its
     * `rulers` option, the textareas as background layers, so both surfaces of
     * one panel guide the eye to the same columns.
     *
     * Mirrors {@link applyFontFamily}: with nothing to draw it does nothing
     * unless rules were drawn before, in which case it clears them — that is what
     * `verticalLinesApplied` tracks, so an empty `setVerticalLines([])` really
     * does erase the guides instead of leaving the last set painted on.
     *
     * The textarea half measures, so it must run after the surfaces are in the
     * DOM they will render in (the chrome moves them into its panel, whose
     * stylesheet sets the font they are measured in).
     */
    private applyVerticalLines;
    /**
     * Keep the width-override sheet in step with the rules — built on the first
     * rule thicker than the 1px Monaco draws, and dropped again when none is
     * left, so the default case ships no CSS at all.
     */
    private syncVerticalLineWidthStyle;
    /**
     * What the width CSS is scoped to: this instance's own surface host when it
     * has one, else — facade mode — the host application's Monaco root, which is
     * the surface the rules were pushed onto. Null when there is neither, and the
     * sheet is then not built at all.
     */
    private getVerticalLineScopeElement;
    /**
     * Drop everything the rules put outside this component — the width sheet in
     * `document.head`, and the scope marker, which in facade mode sits on an
     * element the host owns and must be handed back clean.
     */
    private teardownVerticalLines;
    private setValueInternal;
    private emitValueChange;
    private lineColumnToOffset;
}

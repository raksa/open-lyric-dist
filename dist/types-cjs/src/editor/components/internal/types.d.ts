/**
 * Public contracts for the standalone Open Lyric component layer.
 *
 * This module is the additive, framework-free API surface described in
 * `research/editor-structure-implemented.md`. It intentionally holds only types
 * plus a couple of shared constants so it can be imported from anywhere
 * (including SSR code paths) without touching the DOM.
 */
/** The four component kinds a plugin (or the bridge) can target. */
export type OpenLyricSurface = 'editor' | 'markdown' | 'lyric' | 'dashboard';
/**
 * Theme preset selector. Every visual is driven by `--ol-*` variables
 * underneath.
 *
 * The `-bs` pair repaints the same token set in Bootstrap's own palette
 * (`#0d6efd` primary, `#212529`/`#fff` bodies, `#dee2e6`/`#495057` borders …)
 * so a page that already ships `bootstrap.min.css` reads as one design. They
 * are full themes, not modifiers: each has its own token block, Monaco theme,
 * and preview palette.
 */
export type OpenLyricTheme = 'light' | 'dark' | 'light-bs' | 'dark-bs';
/**
 * The light/dark half of a theme. Anything that only understands two values —
 * `color-scheme`, Bootstrap's own `data-bs-theme`, the Monaco `vs`/`vs-dark`
 * base — keys off this rather than off the theme name.
 */
export type OpenLyricThemeBase = 'light' | 'dark';
/** Lifecycle phase of a component, mirroring the state diagram in the redesign doc. */
export type OpenLyricLifecycleState = 'created' | 'mounted' | 'unmounted' | 'destroyed';
export interface OpenLyricChangePayload {
    oldValue: string;
    newValue: string;
}
/**
 * A request to persist the document. The component stores nothing itself — it
 * reports that a save was asked for and hands over the value; the host does
 * the writing (and any dirty-state bookkeeping around it).
 */
export interface OpenLyricSavePayload {
    /** The document as it stood when the save was requested. */
    value: string;
    /** What asked for it: the Ctrl/Cmd+S shortcut, or `requestSave()`. */
    source: 'shortcut' | 'api';
}
export interface OpenLyricThemeChangePayload {
    theme: OpenLyricTheme;
}
export interface OpenLyricPartDblclickPayload {
    line: number;
    column: number;
    partName: string;
}
export interface OpenLyricPluginChangePayload {
    type: 'added' | 'removed';
    id: string;
}
export interface OpenLyricTypographyChangePayload {
    /** The component's current `fontSize` (a CSS length string, e.g. `16px`). */
    fontSize: string;
    /** The component's current `fontFamily` (empty for the preview default). */
    fontFamily: string;
}
/** The lyric-preview song-display options (chord/bar/key visibility + key). */
export interface OpenLyricDisplayChangePayload {
    isSimplified: boolean;
    isBarsHidden: boolean;
    isKeyNotesHidden: boolean;
    /** The transposition override; empty means the Config's original key. */
    keyNote: string;
}
/** The unified event surface every component exposes through `on(event, handler)`. */
export interface OpenLyricEventMap {
    ready: Record<string, never>;
    change: OpenLyricChangePayload;
    save: OpenLyricSavePayload;
    'theme-change': OpenLyricThemeChangePayload;
    'typography-change': OpenLyricTypographyChangePayload;
    'display-change': OpenLyricDisplayChangePayload;
    focus: Record<string, never>;
    blur: Record<string, never>;
    'part-dblclick': OpenLyricPartDblclickPayload;
    'plugin-change': OpenLyricPluginChangePayload;
    destroy: Record<string, never>;
}
export type OpenLyricEventName = keyof OpenLyricEventMap;
export type OpenLyricEventHandler<E extends OpenLyricEventName> = (payload: OpenLyricEventMap[E]) => void;
/** Every subscription returns its own unsubscribe function. */
export type Unsubscribe = () => void;
/** Legacy alias shape kept for `addOnChangeEventListener`. */
export type OpenLyricChangeListener = (oldValue: string, newValue: string) => void;
/**
 * The minimal event surface shared by every component. Used so the previews
 * can bridge to any editor implementation without importing its concrete type.
 */
export interface OpenLyricEmitter {
    on<E extends OpenLyricEventName>(event: E, handler: OpenLyricEventHandler<E>): Unsubscribe;
}
/**
 * The bridge target a preview attaches to via `editor`. The standalone
 * `Editor` implements this; anything that satisfies it works too.
 */
export interface OpenLyricEditorLike extends OpenLyricEmitter {
    getValue(): string;
    /** Move caret to a source position, reveal it and focus the surface. */
    focusRange(line: number, column: number): void;
    /** Theme bridged from the preview/dashboard onto the editor. */
    theme?: OpenLyricTheme;
    /** Idempotent teardown; the preview listens for `destroy` to drop its ref. */
    destroy(): void;
}
export interface OpenLyricComponentOptions {
    /** Root element the component owns. Required before `mount()`. */
    container?: HTMLElement | null;
    theme?: OpenLyricTheme;
}
/**
 * A titled group of font faces offered in the font-family picker, e.g.
 * `{ title: 'Khmer Font', fontFaces: [...] }`. The title is
 * the section heading the picker panel renders above its entries.
 */
export interface OpenLyricFontFaceSection {
    title: string;
    fontFaces: string[];
}
/**
 * What `fontFaces` accepts: a flat list of face names, titled sections, or a
 * mix of both. Bare strings collapse into one untitled leading section, so
 * `['Arial', 'Georgia']` and `[{ title: '', fontFaces: [...] }]` are equivalent.
 */
export type OpenLyricFontFaceList = Array<string | OpenLyricFontFaceSection>;
/**
 * The preview setting a standalone `OpenLyric` remembers between visits — what
 * `loadSetting()` returns and `saveSetting()` writes. Both keys are optional:
 * an absent one means "not persisted", so the reader keeps its own default.
 * Unlike the component's `fontSize` accessor (a CSS length string) the size
 * here is a plain pixel number, the unit the settings popup's slider works in.
 */
export interface OpenLyricPreviewSetting {
    /** Font family the preview renders with; empty = the preview default. */
    fontFamily?: string;
    /** Font size in pixels. */
    fontSize?: number;
}
export interface OpenLyricPreviewOptions extends OpenLyricComponentOptions {
    /** The Open Lyric markdown source. */
    value?: string;
    /** Font family the preview renders with (maps to `--ol-font-family`). */
    fontFamily?: string;
    /** Font size the preview renders with (maps to `--ol-font-size`). */
    fontSize?: string;
    /**
     * Font faces offered for picking — a flat list or titled sections. A
     * standalone embed lists them in the settings popup's font-family picker.
     */
    fontFaces?: OpenLyricFontFaceList;
    /**
     * Adopt `container` as the render root instead of creating one inside it.
     * For hosts that own the element's styling and need the rendered markup to
     * be the container's direct children (CSS child selectors, exporters). The
     * component then applies no `--ol-*` surface styles or theme decorations —
     * visuals are entirely the host's — and teardown clears the container's
     * content. The container must be empty (or expendable) at `mount()`.
     */
    adoptContainer?: boolean;
}
export declare const OPEN_LYRIC_PLUGIN_API_VERSION: 1;
/** Scoped CSS a plugin installs while attached and that is removed on detach. */
export interface OpenLyricStyleContribution {
    href?: string;
    cssText?: string;
    media?: string;
}
/** Spellcheck part of a `language` contribution. `en` is reserved/built-in. */
export interface OpenLyricSpellcheckContributionSpec {
    languageCode: string;
    [key: string]: unknown;
}
/** On-screen keyboard part of a `language` contribution. */
export interface OpenLyricKeyboardContributionSpec {
    id: string;
    [key: string]: unknown;
}
/**
 * Language support (the language-plugin kind): keyboard, spellcheck, fonts.
 * Only the keys the host validates are typed; the rest is plugin-defined.
 */
export interface OpenLyricLanguageContribution {
    spellcheck?: OpenLyricSpellcheckContributionSpec;
    keyboard?: OpenLyricKeyboardContributionSpec;
    fontFaces?: string[];
    /**
     * Font stack the PREVIEW surfaces render with while the document declares
     * one of {@link locales} — never merely because the plugin is attached. A
     * host's own `fontFamily` still outranks it.
     */
    fontFamily?: string;
    /**
     * BCP-47 tags this contribution serves, matched against the document's
     * `ol:Config` `Locales` field. Defaults to the plugin's own id, so a plugin
     * keyed `km-KH` needs no locale list of its own.
     */
    locales?: readonly string[];
    [key: string]: unknown;
}
/**
 * A custom renderer the previews invoke on matching rendered elements after
 * every render (e.g. chord diagrams for `key-note` markers). Re-renders wipe
 * and re-apply, so `render` must not assume it runs once.
 */
export interface OpenLyricRendererContribution {
    /** Surface-defined hook name, e.g. `'key-note'` or `'section'`. */
    target: string;
    render(text: string, element: HTMLElement): void;
}
/** How a surface resolves a renderer `target` to rendered DOM. */
export interface OpenLyricRendererTargetSpec {
    selector: string;
    getText(element: Element): string;
}
/**
 * Typed contribution bag. `style`, `renderers`, and the validated keys of
 * `language`/`transcript`/`notation` are wired; the open index keeps the shape
 * forward-compatible with the remaining kinds (exportStyle, examples, storage,
 * actions, …).
 */
export interface OpenLyricContributions {
    style?: OpenLyricStyleContribution | OpenLyricStyleContribution[];
    language?: OpenLyricLanguageContribution;
    /** Singleton kind: at most one transcript plugin per component. */
    transcript?: unknown;
    /** Singleton kind: at most one notation plugin per component. */
    notation?: unknown;
    renderers?: OpenLyricRendererContribution[];
    [contributionPoint: string]: unknown;
}
/** What `onBeforeRender`/`onAfterRender` receive for a mounted render pass. */
export interface OpenLyricRenderContext {
    /** The source value being rendered. */
    value: string;
    /** The component's mounted render root. */
    root: HTMLElement;
}
/** What a plugin receives on install — a stable, read-only view of its host. */
export interface OpenLyricComponentHost extends OpenLyricEmitter {
    readonly surface: OpenLyricSurface;
    readonly container: HTMLElement | null;
    readonly theme: OpenLyricTheme;
}
export interface OpenLyricPlugin {
    /** Stable key, e.g. `'example-lang'`. */
    readonly id: string;
    /** Plugin API major version — the host rejects mismatches. */
    readonly apiVersion?: typeof OPEN_LYRIC_PLUGIN_API_VERSION;
    /** Surfaces this plugin may attach to. Omitting it allows any surface. */
    readonly surfaces?: readonly OpenLyricSurface[];
    readonly contributes?: OpenLyricContributions;
    install?(host: OpenLyricComponentHost): void | Promise<void>;
    uninstall?(host: OpenLyricComponentHost): void;
    onMount?(host: OpenLyricComponentHost): void;
    onUnmount?(host: OpenLyricComponentHost): void;
    onValueChange?(host: OpenLyricComponentHost, oldValue: string, newValue: string): void;
    onThemeChange?(host: OpenLyricComponentHost, theme: OpenLyricTheme): void;
    onBeforeRender?(host: OpenLyricComponentHost, context: OpenLyricRenderContext): void;
    onAfterRender?(host: OpenLyricComponentHost, context: OpenLyricRenderContext): void;
}

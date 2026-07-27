import type { Editor } from './Editor.js';
import { OpenLyricComponent } from './internal/OpenLyricComponent.js';
import type { OpenLyricPreviewComponent } from './internal/OpenLyricPreviewComponent.js';
import type { OpenLyricComponentOptions, OpenLyricSurface, OpenLyricTheme } from './internal/types.js';
/** A draft the `loadValue` hook may return (a bare string works too). */
export interface OpenLyricDashboardDraft {
    content: string;
    fileName?: string;
    sharedDocumentDate?: string;
}
/** Extra document metadata handed to the `saveValue` hook. */
export interface OpenLyricDashboardDraftContext {
    fileName: string;
    sharedDocumentDate: string;
}
export type OpenLyricDashboardLoadValue = () => Promise<OpenLyricDashboardDraft | string | null> | OpenLyricDashboardDraft | string | null;
export type OpenLyricDashboardSaveValue = (value: string, context: OpenLyricDashboardDraftContext) => void | Promise<void>;
export interface OpenLyricDashboardOptions extends OpenLyricComponentOptions {
    /** Show web-only chrome (`gif` info disclosure, share-link menu entry). */
    isWeb?: boolean;
    /** Override the Monaco runtime loader (defaults to the lazy chunk). */
    loadMonacoResources?: () => Promise<unknown> | unknown;
    /** Injectable persistence backend — replaces the localStorage drafts. */
    loadValue?: OpenLyricDashboardLoadValue;
    saveValue?: OpenLyricDashboardSaveValue;
}
/**
 * The dashboard currently wrapping the page application, if any.
 *
 * This is the sanctioned way to reach a running dashboard from code that did
 * not compose it (debugging, tests, late-loading integrations) — the page
 * entry publishes nothing to `globalThis`. Module scope, not global scope:
 * the caller must import this module to see it.
 */
export declare function getActiveOpenLyricDashboard(): OpenLyricDashboard | null;
/**
 * `OpenLyricDashboard` — the shell component (`gdb`) from the redesign doc,
 * in its **wrap phase**: it drives the existing composition root
 * (`OpenLyricEditorApplication`) through the standalone component contract
 * (options bag, `mount()` → `ready`, unified `on()` events, `theme`,
 * `loadValue`/`saveValue` injection, `isWeb` chrome gating).
 *
 * The page entries (`editor/main-open-lyric.ts`, `editor/main-editor.ts`)
 * are the canonical consumers — the live app boots through this class, so
 * the pages themselves are the integration examples.
 *
 * Wrap-phase constraints (all documented in the components README):
 * - The shell markup must be inside `container` before boot: the dashboard
 *   installs it from `html/dashboard-shell.html` when absent, and otherwise
 *   adopts whatever shell the host inlined, rather than building panels from
 *   the standalone components.
 * - Single instance: the wrapped application uses page-global state.
 * - `unmount()` is unsupported (the app has no teardown yet); `destroy()`
 *   detaches the dashboard facade — bridges, hooks, markers — and leaves the
 *   underlying app running.
 */
export declare class OpenLyricDashboard extends OpenLyricComponent {
    /**
     * Install the shell markup this component owns — the shell root: the
     * topbar, the panel host with its three panel mounts, and every app-level
     * dialog — from `html/dashboard-shell.html`, then refresh the app's
     * captured element refs. (The transcript browser-warning banner is *not*
     * part of it: `EditorPluginTranscript` ships and mounts its own.)
     *
     * The counterpart to `Editor.installShellMarkup()` and friends, and the
     * one that must run FIRST: their `data-ol-mount` placeholders live inside
     * this fragment. It targets a `<template data-ol-mount="dashboardShell">`
     * placeholder when the page has one — which is all any app page ships —
     * otherwise appends to `container`; either way it is skipped when the shell
     * root already exists, so a host with a shell of its own is untouched.
     *
     * `mount()` calls this too, so a host that composes nothing but a
     * dashboard needs no separate call.
     *
     * `includeRawTextImport` opts the page into the Parse-from-Raw-Text action
     * and its dialog — the same per-page opt-in shape as
     * `OpenLyricMarkdownManager.installShellMarkup({ includeDocxExport })`. The
     * full shells pass it; `main-editor.ts` leaves it off.
     */
    static installShellMarkup(options?: {
        container?: HTMLElement | null;
        includeRawTextImport?: boolean;
    }): void;
    readonly surface: OpenLyricSurface;
    /** Injectable persistence hooks; may also be passed as options. */
    loadValue: OpenLyricDashboardLoadValue | null;
    saveValue: OpenLyricDashboardSaveValue | null;
    private openLyricRef;
    private openLyricMarkdownManagerRef;
    private editorRef;
    private isWebValue;
    private readonly explicitTheme;
    private readonly loadMonacoResourcesOption;
    private applicationInstance;
    private lastValueText;
    private destroying;
    /** Undo functions for every patch the mount installed, LIFO. */
    private readonly patchRestorers;
    constructor(options?: OpenLyricDashboardOptions);
    /**
     * The wrapped composition root (lazily constructed). An escape hatch for
     * hosts/tests that need app internals the component contract does not
     * cover yet; prefer the dashboard members where they exist.
     */
    get application(): any;
    /**
     * The owned lyric preview (`glpp`). Assign a `new OpenLyric()` before
     * `mount()`; the dashboard mounts it in adopt mode on the real
     * `#openLyricPreview` panel, and the app's full re-renders flow through it.
     */
    get openLyric(): OpenLyricPreviewComponent | null;
    set openLyric(next: OpenLyricPreviewComponent | null);
    /** The owned markdown preview (`gmp`); same contract as {@link openLyric}. */
    get openLyricMarkdownManager(): OpenLyricPreviewComponent | null;
    set openLyricMarkdownManager(next: OpenLyricPreviewComponent | null);
    /**
     * The owned editor (`gep`) — the page's editor composition. Assign a
     * `new Editor()` with its plugins attached before `mount()`. Wrap phase:
     * the attached plugin set is the composition manifest deciding which
     * built-in shell plugins register before boot (`editor.html` composes
     * km-KH + transcript; `open-lyric.html` adds the Open Lyric notation
     * plugin), and after boot the instance becomes a live facade over the
     * application's editor surface — `value` reads/writes, `focusRange`, the
     * Monaco getters, and `change` events all work against the real surface.
     */
    get editor(): Editor | null;
    set editor(next: Editor | null);
    get isWeb(): boolean;
    set isWeb(next: boolean);
    /** The current document markdown (empty until mounted). */
    get value(): string;
    protected handleMount(container: HTMLElement): Promise<void>;
    unmount(): void;
    destroy(): void;
    protected handleUnmount(): void;
    protected handleReload(): void;
    /** Host-driven theme → app (`ThemeController` persists it like the UI). */
    protected handleThemeChange(theme: OpenLyricTheme): void;
    /**
     * Push the dashboard's theme onto the previews it owns. They are adopt-mode
     * embeds, so their `[data-ol-theme]` marker sits on the real panel and is
     * what themes the rendered song view / fence cards
     * (`plugins/OpenLyric/preview/styles.scss` keys its dark variants off the
     * page attribute **or** that marker). Without this the panels keep the theme
     * they were constructed with while the app switches around them.
     */
    private syncOwnedPreviewThemes;
    /**
     * Mount an owned preview component on a real panel container in adopt
     * mode. Skipped silently when the page has no such panel (editor-only
     * shell) or no component was assigned.
     */
    private mountOwnedPreview;
    /**
     * Wrap phase: the owned editor's attached plugins are the page's
     * composition manifest — they decide which built-in shell plugins register
     * with the legacy registry before boot. `editor.html` composes km-KH +
     * transcript; `open-lyric.html` adds the Open Lyric notation plugin (its
     * runtime enable/disable preference still applies inside the registrar).
     * Without an owned editor the legacy default applies: every built-in, the
     * notation plugin per page shell mode.
     */
    private registerBuiltInPluginsFromComposition;
    /**
     * Bridge the owned editor to the application's live surface (see
     * `Editor.attachSharedSurface`). Every accessor is live, so the app's
     * Monaco ⇄ simple-textarea swaps stay transparent; writes route through
     * the app's own document pipeline (previews, draft save, dirty marker).
     */
    private attachOwnedEditorFacade;
    /**
     * Replace the app's draft backend with the host's `loadValue`/`saveValue`.
     * `loadValue` is resolved once, up front, because the app reads the draft
     * synchronously during boot; `saveValue` runs synchronously up to its
     * first await, which keeps the beforeunload save path intact.
     */
    private installDraftPersistenceHooks;
    /**
     * Document value → dashboard `change` events (one-way mirror). Two entry
     * points cover every path: the editor edit pipeline
     * (`handleEditorContentChange`: typing in Monaco or the simple textarea)
     * and programmatic loads (`applyDocumentContent`: open file, reset
     * example, share import — which bypass the edit pipeline when no editor
     * surface is live).
     */
    private installChangeBridge;
    /** App-driven theme changes (UI toggle, system) → dashboard events. */
    private installThemeBridge;
    private applyWebOnlyChrome;
    private normalizeDraft;
}

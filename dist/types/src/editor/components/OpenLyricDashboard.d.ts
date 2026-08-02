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
/** Extra document metadata handed to the `onValueChange`/`saveValue` hooks. */
export interface OpenLyricDashboardDraftContext {
    fileName: string;
    sharedDocumentDate: string;
}
export type OpenLyricDashboardLoadValue = () => Promise<OpenLyricDashboardDraft | string | null> | OpenLyricDashboardDraft | string | null;
export type OpenLyricDashboardOnValueChange = (value: string, context: OpenLyricDashboardDraftContext) => void | Promise<void>;
export type OpenLyricDashboardSaveValue = (value: string, context: OpenLyricDashboardDraftContext) => void | Promise<void>;
export interface OpenLyricDashboardOptions extends OpenLyricComponentOptions {
    /**
     * Show web-only chrome (`gif` info disclosure, share-link menu entry,
     * topbar theme toggle).
     */
    isWeb?: boolean;
    /** Injectable persistence backend — replaces the localStorage drafts. */
    loadValue?: OpenLyricDashboardLoadValue;
    onValueChange?: OpenLyricDashboardOnValueChange;
    /** Explicit user save (Ctrl/Cmd+S, Save) — replaces the disk download. */
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
 * `loadValue`/`onValueChange`/`saveValue` injection, `isWeb` chrome gating).
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
     * captured element refs.
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
    /**
     * Link the stylesheets the dashboard shell owns — the page-level theme
     * tokens and loading splash (`theme.scss`), the shell chrome
     * (`shell.scss`), the app-level dialogs (`dialogs.scss`), and the
     * narrow-viewport overrides (`responsive.scss`) — into `document.head`,
     * the CSS counterpart of {@link installShellMarkup}.
     *
     * The page entries call one `installShellStyle()` per composed surface
     * class, this one first, so the HTML pages ship no
     * `<link rel="stylesheet">` at all. The sheets are shared with the other
     * surfaces' statics: each link is injected once, keyed by element id, and
     * always in canonical cascade order (see `internal/shell-styles.ts`).
     * The preview render sheet is not here — it comes with
     * `OpenLyric.installShellStyle()` / `OpenLyricMarkdownManager.installShellStyle()`,
     * exactly as those classes own their panels' markup.
     */
    static installShellStyle(): void;
    readonly surface: OpenLyricSurface;
    /** Injectable persistence hooks; may also be passed as options. */
    loadValue: OpenLyricDashboardLoadValue | null;
    onValueChange: OpenLyricDashboardOnValueChange | null;
    /**
     * The **explicit save command** — Ctrl/Cmd+S over the app, either topbar
     * Save button (the overflow menu's and the document-actions group's), or
     * Save in the editor tools menu. Assign it and the app stops downloading a
     * `.md` file and hands the document to this hook instead; leave it unset
     * and the built-in save-to-disk stays exactly as it is.
     *
     * Distinct from {@link onValueChange}, which is the *draft* path and fires
     * on every edit. This one fires only when the user asked to save. The
     * signature is identical, so a host that wants both can assign the same
     * function to each. "Download" (the menu entry that prompts for a file
     * name) is a separate intent and keeps writing a file either way.
     */
    saveValue: OpenLyricDashboardSaveValue | null;
    private openLyricRef;
    private openLyricMarkdownManagerRef;
    private editorRef;
    private isWebValue;
    private readonly explicitTheme;
    private applicationInstance;
    private lastValueText;
    private destroying;
    /** Undo functions for every patch the mount installed, LIFO. */
    private readonly patchRestorers;
    /** Topbar slots this dashboard created (see {@link getSlot}), to remove on teardown. */
    private readonly ownedSlots;
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
     * transcript; `open-lyric.html` adds the Open Lyric notation plugin), and
     * after boot the instance becomes a live facade over the
     * application's editor surface — `value` reads/writes, `focusRange`, the
     * Monaco getters, and `change` events all work against the real surface.
     */
    get editor(): Editor | null;
    set editor(next: Editor | null);
    /**
     * A host-owned slot in the dashboard topbar, keyed by number.
     *
     * The first call for a number appends a `<div data-slot="N">` to the
     * topbar's slot row (`.ol-db-header-slots`, left of the Reset/Save pair) and
     * returns it; every later call for the same number returns that same
     * element, so a host can call it from anywhere without tracking the handle:
     *
     * ```ts
     * dashboard.getSlot(0).innerHTML = '<button class="btn btn-sm">Sync</button>';
     * ```
     *
     * The element is the host's to fill and empty — the dashboard only
     * guarantees identity, placement and DOM order (slots sort by number, not by
     * the order they were asked for). A slot already present in the host's own
     * shell markup is adopted rather than duplicated; slots this dashboard
     * created are removed again on `destroy()`.
     *
     * Requires the shell markup to be installed (i.e. after
     * `OpenLyricDashboard.installShellMarkup()` or `mount()`).
     */
    getSlot(slotNumber: number): HTMLDivElement;
    get isWeb(): boolean;
    set isWeb(next: boolean);
    /** The current document markdown (empty until mounted). */
    get value(): string;
    /** The previews this dashboard owns, in mount order. */
    private get ownedPreviews();
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
     * Shadow a **prototype** method on a live app object for the lifetime of
     * the mount, and queue its undo.
     *
     * This is how the wrap phase drives the running application: it intercepts
     * the app's own methods rather than forking them. Every target here is a
     * class instance whose methods sit on the prototype, so the shadow is an
     * own property and `delete` uncovers the original exactly.
     */
    private shadowMethod;
    /**
     * Swap an **own** member — a callback slot, or a method the target carries
     * itself — putting the previous value back on teardown.
     *
     * The counterpart of {@link shadowMethod}, for targets where `delete` would
     * remove the member outright instead of revealing an original underneath.
     */
    private swapMember;
    /**
     * Wrap phase: the owned editor's attached plugins are the page's
     * composition manifest. The one built-in the dashboard still registers is
     * the Open Lyric notation plugin (its runtime enable/disable preference
     * still applies inside the registrar) — the notation IS the core, so its
     * data lives in this bundle. Other plugins (transcript, any language
     * plugin) publish their own registry data from their component plugins'
     * `install()`, i.e. at `addPlugin()` time in the page entry, before this
     * runs — plugins that self-register need no entry here. Without an owned editor the notation
     * plugin follows the page shell mode.
     */
    private registerBuiltInPluginsFromComposition;
    /**
     * Load the Monaco runtime for the wrapped application — through the owned
     * `Editor`'s loader, because Monaco is the editor component's concern:
     * a page overrides it with `new Editor({ loadMonacoResources })` and the
     * app it boots picks up the same loader, whether the editor mounts its own
     * surface (standalone) or facades the app's (here).
     *
     * Resolved per call rather than at construction: `editor` is assigned after
     * the dashboard is built, and the application only loads Monaco during
     * `mount()`. A dashboard with no editor assigned falls back to the shared
     * lazy chunk.
     */
    private loadMonacoResources;
    /**
     * Bridge the owned editor to the application's live surface (see
     * `Editor.attachSharedSurface`). Every accessor is live, so the app's
     * Monaco ⇄ simple-textarea swaps stay transparent; writes route through
     * the app's own document pipeline (previews, draft save, dirty marker).
     */
    private attachOwnedEditorFacade;
    /**
     * Replace the app's draft backend with the host's
     * `loadValue`/`onValueChange`. `loadValue` is resolved once, up front,
     * because the app reads the draft synchronously during boot;
     * `onValueChange` runs synchronously up to its first await, which keeps the
     * beforeunload save path intact.
     */
    private installDraftPersistenceHooks;
    /**
     * Report a host hook's rejection without letting it escape into the app.
     * Both persistence hooks may be async and neither is awaited — the app's
     * own call sites are synchronous (the draft save runs on the beforeunload
     * path), so a failure is logged, never thrown.
     */
    private runHook;
    /**
     * Route the app's **explicit save command** into the host's `saveValue`.
     *
     * Every way a user can issue it — the topbar overflow menu's Save, the
     * document-actions Save beside it, the editor tools menu's Save, and the
     * window-level Ctrl/Cmd+S handler, which clicks the first of those — lands
     * on `DocumentController.saveCurrentDocument()`, so shadowing that one
     * prototype method covers the whole command without touching the
     * keystroke. The default it displaces is the `.md` download; the separate
     * Download entry (which prompts for a file name) is left alone, and so is
     * the draft path — {@link installDraftPersistenceHooks} owns that.
     */
    private installSaveCommandHook;
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
    /**
     * The topbar row the numbered slots live in.
     *
     * `html/dashboard-shell.html` ships it, so on every app page this is a
     * lookup; a host that inlined a shell of its own without one gets it created
     * at the head of the document-actions group, ahead of Reset/Save.
     */
    private resolveSlotHost;
    /**
     * Show or hide the topbar chrome only a web host wants: the info
     * disclosure, the share-link entry, and the theme toggle — a native host
     * owns the OS/app theme, so the toggle goes with the rest.
     *
     * Resolved from `refs` on each call rather than captured, so teardown acts
     * on whatever the page has by then.
     */
    private applyWebOnlyChrome;
    private normalizeDraft;
}

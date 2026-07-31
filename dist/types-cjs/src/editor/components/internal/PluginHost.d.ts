import { type OpenLyricComponentHost, type OpenLyricPlugin, type OpenLyricRenderContext, type OpenLyricRendererTargetSpec, type OpenLyricSurface, type OpenLyricTheme } from './types.js';
/**
 * Accessors the host component gives the plugin host, so the host stays
 * decoupled from the concrete component implementation.
 */
export interface PluginHostContext {
    getSurface(): OpenLyricSurface;
    /** The read-only host view passed to every plugin method. */
    readonly host: OpenLyricComponentHost;
    getContainer(): HTMLElement | null;
    /**
     * Where plugin style nodes are installed. Defaults to the container; an
     * adopt-mode component redirects to `document.head` because its container
     * is host-owned content whose `innerHTML` the render pipeline replaces
     * (and whose emptiness hosts inspect — e.g. export availability).
     */
    getStyleHost(): HTMLElement | null;
    isMounted(): boolean;
    emitPluginChange(type: 'added' | 'removed', id: string): void;
    /** Map a renderer contribution `target` to this surface's rendered DOM. */
    resolveRendererTarget(target: string): OpenLyricRendererTargetSpec | null;
    /** Ask the component to re-render (renderer contributions changed). */
    requestRender(): void;
}
/**
 * Per-component plugin manager. Enforces the redesign's attach rules
 * (surfaces, apiVersion, duplicate ids), installs a plugin's scoped `style`
 * contribution into the host container only while mounted, and fans the
 * lifecycle hooks (mount/unmount/value/theme) out to attached plugins.
 *
 * Style scoping today is by locality: nodes live inside the component
 * container and are torn down on unmount/detach/destroy, so nothing leaks
 * into `document.head` and nothing survives teardown.
 */
export declare class PluginHost {
    private readonly context;
    private readonly records;
    constructor(context: PluginHostContext);
    get ids(): string[];
    has(id: string): boolean;
    /** The attached plugin instances, in attach order. */
    get plugins(): OpenLyricPlugin[];
    get(id: string): OpenLyricPlugin | null;
    /**
     * Every attached plugin's contribution for one kind, in attach order —
     * how surface chrome discovers what its composition provides (a notation
     * plugin's `Format`, a language plugin's keyboard/spellcheck, …) without
     * hard-coding plugin ids.
     */
    collectContributions<T = unknown>(kind: string): T[];
    /**
     * Attach a plugin. Validation (id / apiVersion / surface / duplicate) is
     * synchronous so misconfiguration surfaces immediately. A plugin whose
     * `install()` returns a promise finishes wiring asynchronously; if it
     * rejects, the plugin is rolled back and nothing is emitted.
     */
    add(id: string, plugin: OpenLyricPlugin): void;
    remove(id: string): boolean;
    /** Called from the component's `mount()`. */
    handleMount(): void;
    /** Called from the component's `unmount()`. */
    handleUnmount(): void;
    handleValueChange(oldValue: string, newValue: string): void;
    handleThemeChange(theme: OpenLyricTheme): void;
    handleBeforeRender(context: OpenLyricRenderContext): void;
    /** Fan out `onAfterRender`, then apply `renderers` contributions to the
     * freshly rendered DOM (each render pass starts from clean markup). */
    handleAfterRender(context: OpenLyricRenderContext): void;
    /** Called from the component's `destroy()`. Detaches every plugin quietly. */
    destroyAll(): void;
    /**
     * The redesign's conflict & uniqueness rules, enforced per component:
     * singleton kinds (`transcript`, `notation`), reserved built-in `en`
     * spellcheck, and duplicate spellcheck/keyboard keys across attached
     * plugins. Runs before the plugin is recorded, so a violation leaves the
     * host untouched.
     */
    private assertContributionRules;
    private hasRenderers;
    private installStyles;
    private teardownStyles;
    private safe;
}

import { OpenLyricEventEmitter } from './EventEmitter.js';
import { PluginHost } from './PluginHost.js';
import { type OpenLyricChangeListener, type OpenLyricComponentHost, type OpenLyricComponentOptions, type OpenLyricEventHandler, type OpenLyricEventName, type OpenLyricLifecycleState, type OpenLyricPlugin, type OpenLyricRendererTargetSpec, type OpenLyricSurface, type OpenLyricTheme, type Unsubscribe } from './types.js';
/**
 * Shared lifecycle base for every Open Lyric component.
 *
 * It owns the `created → mounted ⇄ unmounted → destroyed` state machine, the
 * unified `on()` event surface, the per-instance plugin host, and the theme
 * marker. It holds **no** global state and touches the DOM only from `mount()`
 * onward, satisfying the redesign's embedding rules (no globals, SSR-safe
 * construction, complete teardown).
 *
 * Concrete components (previews now; editor/dashboard later) override the
 * protected `handle*` hooks; they never re-implement the state machine.
 */
export declare abstract class OpenLyricComponent implements OpenLyricComponentHost {
    /** Which contribution surface this component represents. */
    abstract readonly surface: OpenLyricSurface;
    protected readonly emitter: OpenLyricEventEmitter;
    protected readonly pluginHost: PluginHost;
    private lifecycleState;
    /** Bumped by mount/unmount/destroy so an in-flight async mount can detect
     * that it was superseded and clean up after itself. */
    private mountGeneration;
    private containerElement;
    private themeValue;
    private readonly changeListenerUnsubscribes;
    constructor(options?: OpenLyricComponentOptions);
    get container(): HTMLElement | null;
    set container(next: HTMLElement | null);
    get theme(): OpenLyricTheme;
    set theme(next: OpenLyricTheme);
    get state(): OpenLyricLifecycleState;
    get isMounted(): boolean;
    get isDestroyed(): boolean;
    on<E extends OpenLyricEventName>(event: E, handler: OpenLyricEventHandler<E>): Unsubscribe;
    /** Back-compat alias for `on('change', …)`; returns an unsubscribe fn. */
    addOnChangeEventListener(listener: OpenLyricChangeListener): Unsubscribe;
    removeOnChangeEventListener(listener: OpenLyricChangeListener): void;
    addPlugin(id: string, plugin: OpenLyricPlugin): void;
    removePlugin(id: string): void;
    hasPlugin(id: string): boolean;
    mount(): Promise<void>;
    unmount(): void;
    reload(): void;
    destroy(): void;
    /** Build the DOM inside `container` and start the runtime. */
    protected handleMount(_container: HTMLElement): void | Promise<void>;
    /** Remove DOM and detach listeners, keeping the instance reusable. */
    protected handleUnmount(): void;
    /** Re-render from current value/options without a teardown. */
    protected handleReload(): void;
    /** Final, permanent cleanup (bridge detach, owned children, object URLs). */
    protected handleDestroy(): void;
    /** React to a theme change while mounted (e.g. re-render). */
    protected handleThemeChange(_theme: OpenLyricTheme): void;
    /**
     * The element this component created inside `container` (render root,
     * editor surface). Theme preset styles are applied here — never to the
     * host's container — so teardown leaves the container pristine.
     */
    protected getOwnedRoot(): HTMLElement | null;
    /**
     * Map a `renderers` contribution target to this surface's rendered DOM.
     * Surfaces without renderer hooks return null (the target is skipped).
     */
    protected resolveRendererTarget(_target: string): OpenLyricRendererTargetSpec | null;
    /** A plugin with renderer contributions attached/detached: re-render. */
    protected handlePluginRenderRequest(): void;
    /** Where plugin `style` contributions are installed (see PluginHost). */
    protected getPluginStyleHost(): HTMLElement | null;
    protected applyThemeMarker(): void;
    /**
     * Reverse {@link applyThemeMarker} so a host's container is left exactly as
     * it was handed over. Idempotent; takes an explicit target because
     * `destroy()` clears the container reference.
     */
    protected removeThemeMarker(target?: HTMLElement | null): void;
    protected assertNotDestroyed(): void;
}

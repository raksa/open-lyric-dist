import { OpenLyricComponent } from './OpenLyricComponent.js';
import { type OpenLyricEditorLike, type OpenLyricFontFaceList, type OpenLyricFontFaceSection, type OpenLyricPreviewOptions, type OpenLyricTheme } from './types.js';
/**
 * Shared base for the two read-only previews (`OpenLyric`, the lyric preview,
 * and `OpenLyricMarkdownManager`, the markdown preview).
 *
 * Adds to {@link OpenLyricComponent}:
 * - a `value` setter + render pipeline backed by a subclass `renderMarkup()`
 * - the editor **bridge** (`editor` / `isWeakRef`): one-way value+theme mirror,
 *   double-click → `focusRange`, and destroy-driven ref cleanup
 * - settable typography exposed as `--ol-*` custom properties
 *
 * Both previews are Monaco-free and fully standalone; attaching an editor is
 * optional and never required to render.
 */
export declare abstract class OpenLyricPreviewComponent extends OpenLyricComponent {
    /**
     * Host-supplied options merged over this component's own render options on
     * every render (host keys win). Lets an embedding shell thread renderer
     * context (e.g. pattern-preview targets, per-structure keys) through the
     * component without subclassing.
     */
    extraRenderOptions: Record<string, unknown> | null;
    private valueText;
    private renderRoot;
    private adoptContainerValue;
    private editorRef;
    private weakRef;
    private readonly editorBridgeUnsubscribes;
    private fontFamilyValue;
    private fontSizeValue;
    private fontFacesValue;
    private readonly boundDoubleClick;
    constructor(options?: OpenLyricPreviewOptions);
    /** See {@link OpenLyricPreviewOptions.adoptContainer}. */
    get adoptContainer(): boolean;
    set adoptContainer(next: boolean);
    get value(): string;
    set value(next: string);
    /**
     * Adopt a value the HOST has already rendered itself — no re-render, no
     * `change` event.
     *
     * The app panels keep incremental single-line fast paths that patch one
     * segment of the adopted DOM directly and never route through
     * `renderNow()`. Without this the component's view of the document would sit
     * at whatever the last full render passed it, and everything resolved FROM
     * the document — today the locale-matched font of
     * {@link resolvedFontFamily} — would lag a `- Locales:` edit until some
     * other change forced a full render. Costs a string assignment and one
     * typography pass.
     *
     * With an editor attached the editor is authoritative (`value` reads
     * through it), so only the typography is refreshed.
     */
    syncRenderedValue(next: string): void;
    get editor(): OpenLyricEditorLike | null;
    set editor(next: OpenLyricEditorLike | null);
    get isWeakRef(): boolean;
    set isWeakRef(next: boolean);
    /**
     * The font faces offered for picking. Round-trips whatever shape the host
     * assigned — a flat list of names, titled sections, or a mix; use
     * {@link getFontFaceSections} for the normalized sectioned view.
     */
    get fontFaces(): OpenLyricFontFaceList;
    set fontFaces(next: OpenLyricFontFaceList);
    /**
     * `fontFaces` normalized into titled sections — what the standalone chrome's
     * font-family picker lists. Bare names collapse into one untitled section;
     * blanks, duplicates, and empty sections drop out.
     *
     * Attached plugins' `language.fontFaces` are appended after the host's own
     * list, the preview counterpart of {@link Editor.resolvedFontFamily}: a
     * language plugin ships its faces that way, so composing it is all an embed
     * needs for them to appear in the picker — no page has to name a face
     * itself. A host that sets `fontFaces` still leads the list; assigning it
     * no longer hides what the plugins contribute.
     */
    getFontFaceSections(): OpenLyricFontFaceSection[];
    get fontFamily(): string;
    /**
     * The stack this preview actually renders with (`--ol-font-family`): the
     * host's `fontFamily` when set, else the font of a composed language plugin
     * whose locale THIS document declares, else empty — the stylesheet's own.
     *
     * The document decides, not the composition: attaching a language plugin no
     * longer restyles every song on the surface, so a Latin song stays on the
     * page's font while a `- Locales: km-KH` song renders in the Khmer face,
     * both through the same attached plugin. Re-resolved on every render, so
     * typing the `Locales` line switches the font as it is typed.
     */
    get resolvedFontFamily(): string;
    /**
     * The first attached plugin that claims a locale this document declares and
     * contributes a font stack for it. A plugin's claimed locales default to its
     * own id (`km-KH`), so the usual case needs no `locales` list.
     */
    private resolvePluginFontFamily;
    set fontFamily(next: string);
    get fontSize(): string;
    set fontSize(next: string);
    /**
     * Announce a typography change so host UI (and the standalone chrome's
     * settings controls) can mirror a programmatic `fontSize`/`fontFamily` set,
     * the same way `theme-change` lets listeners follow `theme`.
     */
    private emitTypographyChange;
    /** The scoped root class (e.g. `ol-lyric-preview`). */
    protected abstract rootClassName(): string;
    /** Render the current value to an HTML string using the subclass backing. */
    protected abstract renderMarkup(value: string, options: Record<string, unknown>): string;
    /** Options bag passed to `renderMarkup` (chord/key toggles, etc.). */
    protected getRenderOptions(): Record<string, unknown>;
    /** The mounted render root, so concrete getters can query rendered DOM. */
    protected getRenderRoot(): HTMLElement | null;
    /**
     * A **virtual** render root — a detached stand-in carrying everything
     * `handleMount()` would give the real one (the root classes, the theme
     * marker and surface styles, the `--ol-*` typography, the injected token and
     * font-face sheets, and the attached plugins' `style` contributions).
     *
     * It exists so the getters that need a laid-out surface — the PNG
     * rasterizers — can work off a component that was never mounted: a batch
     * export or a thumbnail job needs a DOM to stage in, not a visible embed.
     *
     * The caller owns the handle: stage `root` in the document (rasterization
     * needs layout), then call `dispose()` to take the plugin styles back out.
     * `dispose()` only removes what this call installed, so it can never strip a
     * live embed's styles.
     *
     * `width` is explicit because there is no host container to take one from,
     * and `theme` because an export may be asked for in the OTHER theme than the
     * one this component is showing — the virtual root is then what carries the
     * requested theme's tokens, since the live root cannot.
     */
    protected createVirtualRenderRoot(width?: number, theme?: OpenLyricTheme): {
        root: HTMLElement;
        dispose: () => void;
    };
    protected getOwnedRoot(): HTMLElement | null;
    protected getPluginStyleHost(): HTMLElement | null;
    /** Render the current value to a detached string (used by getters). */
    protected renderCurrentHtml(): string;
    /**
     * Re-render into the mounted root; safe to call any time. Each pass fires
     * the plugin render hooks (`onBeforeRender` → render → `onAfterRender`) and
     * re-applies `renderers` contributions on the fresh markup.
     */
    protected renderNow(): void;
    /**
     * Style freshly rendered markup from `--ol-*` variables (theme-aware).
     *
     * `theme` is the component's own unless the caller names another — an image
     * export rendering in the opposite theme decorates its off-screen surface
     * with THAT theme's preset fallbacks, without touching the live preview.
     */
    protected decorateRenderedDom(_root: HTMLElement, _theme?: OpenLyricTheme): void;
    protected handlePluginRenderRequest(): void;
    protected resolveRendererTarget(target: string): {
        selector: string;
        getText: (element: Element) => string;
    } | null;
    protected handleMount(container: HTMLElement): void;
    protected handleUnmount(): void;
    private rootClassNames;
    protected handleReload(): void;
    protected handleDestroy(): void;
    private applyValue;
    private applyTypography;
    private attachEditorBridge;
    private detachEditorBridge;
    protected handleThemeChange(theme: OpenLyricTheme): void;
    private handleDoubleClick;
    /** Nearest rendered block carrying a source anchor to the pointer. */
    private resolveSourceElement;
}

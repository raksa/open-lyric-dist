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
    /** Style freshly rendered markup from `--ol-*` variables (theme-aware). */
    protected decorateRenderedDom(_root: HTMLElement): void;
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

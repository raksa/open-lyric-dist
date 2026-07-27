import { OpenLyricPreviewComponent } from './internal/OpenLyricPreviewComponent.js';
import type { OpenLyricPreviewOptions, OpenLyricSurface } from './internal/types.js';
export interface OpenLyricSectionInfo {
    partName: string;
    repeatText: string;
    heading: string;
}
export interface OpenLyricInfo {
    title: string;
    secondaryText: string;
    key: string;
    metaLine: string;
    structureLine: string;
    sections: OpenLyricSectionInfo[];
}
export interface OpenLyricElementMapOptions {
    /** Map each section to its plain-text body (the default). */
    isText?: boolean;
    /** Map each section to its rendered HTML (`<section …>…</section>`). */
    isHtml?: boolean;
    /**
     * Map each section to a `data:image/png;base64,…` URI of the rasterized
     * section. Requires a mounted preview.
     */
    isPngImageData?: boolean;
    /**
     * Keep the inline key notes — the `[chord]` markers and the leading `|`
     * bars. Off by default, so the map holds lyrics only.
     */
    isWithKeyNote?: boolean;
}
export interface OpenLyricValueOptions {
    /** Produce the whole-song plain text — the default (= "Copy as Text"). */
    isText?: boolean;
    /** Produce the whole-song rendered HTML. */
    isHtml?: boolean;
    /**
     * Produce a `data:image/png;base64,…` URI of the whole song — the same
     * rendered image the preview panel's **Download as Image** action captures
     * (background, fonts, and full width), as PNG. Requires a mounted preview.
     */
    isPngImageData?: boolean;
    /**
     * Override the inline key notes — the `[chord]` markers and leading `|`
     * bars. `true` forces them on, `false` forces them off. Omit to follow the
     * preview's current Hide Keys / Hide Bars state (what Copy as Text /
     * Download as Image reproduce).
     */
    isWithKeyNote?: boolean;
}
export interface OpenLyricOptions extends OpenLyricPreviewOptions {
    /** Simplify chord symbols (drop extensions). */
    isSimplified?: boolean;
    /** Hide leading `|` bar markers in lyric lines. */
    isBarsHidden?: boolean;
    /** Hide inline `[chord]` key markers. */
    isKeyNotesHidden?: boolean;
    /** Transpose the song to this key (empty = original Config key). */
    keyNote?: string;
    /**
     * Hide the standalone preview's floating controls — the settings gear (font
     * size/family, plugin toggle, key transpose, Simply / Hide Bars / Hide Keys)
     * and the actions `⋮` menu (Copy as Text, Download as Image, Print, Download
     * as PowerPoint). A standalone (non-adopt) embed always renders the preview
     * panel chrome — floating tools, export-progress bar, and guitar chord hover
     * popover; this only hides the interactive controls, which show by default.
     * No effect when the component adopts a host-owned container
     * (`adoptContainer`), where the host page owns the chrome. Toggle later via
     * the `isControlHidden` accessor.
     */
    isControlHidden?: boolean;
    /**
     * Skip injecting the default Open Lyric preview styles into the document.
     * Useful if the host page already includes them or wants to manage styles
     * manually. Only affects the standalone preview; has no effect on adopted
     * containers.
     */
    isSkipStyleInjection?: boolean;
}
/**
 * `OpenLyric` — the standalone lyric preview (`glpp`).
 *
 * Renders the Open Lyric song view from markdown with no editor and no
 * dashboard required. Attaching an editor (see `editor` / `isWeakRef` on the
 * base) upgrades double-clicks into caret jumps; without one, double-clicks
 * still emit `part-dblclick` for the host to handle.
 *
 * Backed by the pure render/analysis functions in
 * `editor/plugins/OpenLyric/preview/index.ts`.
 */
export declare class OpenLyric extends OpenLyricPreviewComponent {
    readonly surface: OpenLyricSurface;
    /**
     * Install the OpenLyric page-shell markup — the lyric panel
     * (`#openLyricPanel`), its topbar toggle, the preview-settings fields,
     * and the chord-bars action inside the editor panel — the lyric preview
     * surface owns its shell markup. The full page entry
     * (`main-open-lyric.ts`) calls this before composing and booting the
     * app; the app's captured element refs refresh afterwards.
     * Idempotent, and a no-op on pages without the mounts. Call
     * `Editor.installShellMarkup()` first — the chord-bars action mounts
     * inside the editor panel.
     */
    static installShellMarkup(): void;
    /**
     * The Open Lyric preview stylesheet (the song view + `.ol-preview-*` fence
     * cards) as a raw CSS string — exactly what a standalone embed injects into
     * `<head>` on construction. Pass `isSkipStyleInjection: true` to suppress the
     * automatic injection, then inject this yourself (e.g. into a shadow root or
     * a scoped `<style>`).
     */
    static getInjectableStyle(): string;
    private simplifyChordsValue;
    private barsHiddenValue;
    private keyNotesHiddenValue;
    private keyNoteValue;
    private controlHiddenValue;
    private standaloneChrome;
    constructor(options?: OpenLyricOptions);
    protected handleMount(container: HTMLElement): void;
    protected handleUnmount(): void;
    get isSimplified(): boolean;
    set isSimplified(next: boolean);
    get isBarsHidden(): boolean;
    set isBarsHidden(next: boolean);
    get isKeyNotesHidden(): boolean;
    set isKeyNotesHidden(next: boolean);
    /**
     * Whether the standalone chrome's floating controls (the settings gear and
     * the actions `⋮` menu) are hidden. Only affects a standalone (non-adopt)
     * embed; a no-op where the host owns the chrome.
     */
    get isControlHidden(): boolean;
    set isControlHidden(next: boolean);
    /**
     * Restore the preview settings to their defaults — the programmatic
     * equivalent of the standalone chrome's "Reset" button: clears chord
     * simplification, hidden bars/keys, and transposition, and returns the font
     * size/family to the preview defaults. On a standalone embed the settings
     * popup drives the reset (so its controls and persisted typography reset too);
     * where the host owns the chrome, this resets the component's own state and
     * clears any font overrides.
     */
    resetPreviewSetting(): void;
    /** Selectable musical keys for transposition (empty if there is no Config). */
    getKeys(): string[];
    get keyNote(): string;
    set keyNote(next: string);
    /**
     * Announce a song-display change (chord simplification, hidden bars/keys, or
     * transposition) so host UI and the standalone chrome's settings controls can
     * mirror a programmatic set — the display counterpart to `typography-change`.
     */
    private emitDisplayChange;
    /**
     * The song's structure — the ordered list of section (part) names as they
     * appear in the Config `Structure`, e.g. `['Intro', 'Verse 1', 'Chorus',
     * 'Verse 2', 'Outro']`. A part repeated in the flow appears once per step.
     * Empty when there is no Config/Structure.
     */
    getStructure(): string[];
    /**
     * A map from section (part) name to that section's rendered content — one
     * entry per unique part in the structure. The value's form is chosen by the
     * option flag:
     *
     * - `{ isText: true }` (default) — the section body as plain text.
     * - `{ isHtml: true }` — the section's rendered HTML (`<section …>…`).
     * - `{ isPngImageData: true }` — a `data:image/png;base64,…` URI of the
     *   rasterized section (requires a mounted preview).
     *
     * By default the map holds lyrics only — the inline key notes (the `[chord]`
     * markers and leading `|` bars) are stripped. Pass `{ isWithKeyNote: true }`
     * to keep them.
     *
     * Always async: PNG rasterization is deferred, and the text/HTML variants
     * resolve on the same contract so callers have one uniform call shape.
     */
    getElementMap(options?: OpenLyricElementMapOptions): Promise<Record<string, string>>;
    /**
     * The whole song rendered as a single value — the counterpart to
     * {@link getElementMap} (which returns one entry per section). The value's
     * form is chosen by the option flag:
     *
     * - `{ isText: true }` (default) — the full plain-text render, identical to
     *   the preview panel's **Copy as Text** action (title, meta, structure, and
     *   every section joined).
     * - `{ isHtml: true }` — the whole-song rendered HTML.
     * - `{ isPngImageData: true }` — a `data:image/png;base64,…` URI of the
     *   whole song, the same image the **Download as Image** action captures
     *   (surface background, loaded fonts, full width), as PNG. Requires a
     *   mounted preview.
     *
     * The inline key notes (the `[chord]` markers and leading `|` bars) follow
     * the preview's current Hide Keys / Hide Bars state by default — so these
     * mirror the app's Copy as Text / Download as Image output. Pass
     * `isWithKeyNote: true` to force them on or `false` to force them off.
     *
     * Async for the same reason as {@link getElementMap}: image rasterization is
     * deferred, so every variant resolves on one uniform call shape.
     */
    getValue(options?: OpenLyricValueOptions): Promise<string>;
    /** Song metadata: title, sections, key, structure. */
    getInfo(): OpenLyricInfo | null;
    protected rootClassName(): string;
    protected resolveRendererTarget(target: string): {
        selector: string;
        getText: (element: Element) => string;
    } | null;
    protected decorateRenderedDom(root: HTMLElement): void;
    protected renderMarkup(value: string, options: Record<string, unknown>): string;
    protected getRenderOptions(): Record<string, unknown>;
    private getStructureControlState;
    /**
     * The render options for the content getters. `keyNote` controls the inline
     * key notes — the `[chord]` markers and leading `|` bars:
     * - `'inherit'` — leave them to the component's current Hide Keys / Hide Bars
     *   state (what the preview shows, and what Copy as Text / Download as Image
     *   reproduce).
     * - `true` — force the key notes on.
     * - `false` — force them off, leaving the lyrics only.
     */
    private getContentRenderOptions;
    private buildTextElementMap;
    private buildHtmlElementMap;
    private buildImageElementMap;
    /**
     * The whole song as a PNG data URI, matching the **Download as Image**
     * action: the surface carries its resolved background and typography, fonts
     * finish loading before the raster, and the output spans the full rendered
     * width/height.
     */
    private buildPngImageData;
    /**
     * An off-screen clone of the render root carrying `renderOptions`' markup —
     * the surface both image getters rasterize. It mirrors the live root's
     * resolved typography and background and lays out at the full preview width,
     * so the raster matches what **Download as Image** captures.
     */
    private buildImageExportSurface;
    /**
     * The colour to fill behind the rasterized song — the live root's own
     * (non-transparent) background, else the theme's default surface — so the
     * exported image is never see-through.
     */
    private resolveSurfaceBackground;
}

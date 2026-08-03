import { OpenLyricPreviewComponent } from './internal/OpenLyricPreviewComponent.js';
import type { OpenLyricPreviewOptions, OpenLyricPreviewSetting, OpenLyricSurface, OpenLyricTheme } from './internal/types.js';
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
/**
 * What a content getter answers with — the one option
 * {@link OpenLyric.getElementMap} and {@link OpenLyric.getValue} require, since
 * nothing about a song says which of its forms a caller wants.
 *
 * - `'text'` — plain text.
 * - `'html'` — the rendered markup, styles resolved inline.
 * - `'png-image'` — a `data:image/png;base64,…` URI of that markup rasterized.
 */
export type OpenLyricContentType = 'text' | 'html' | 'png-image';
/**
 * How an image getter sizes and fills its raster — and, since `'html'` answers
 * with the very surface the raster is drawn from, how the HTML variant is sized
 * and filled too. Both are ignored by the `'text'` variant.
 */
export interface OpenLyricImageOptions {
    /**
     * The CSS pixel width the song is laid out at before it is rasterized — so
     * the lines wrap the way they would in a preview that wide, rather than at
     * whatever width this embed happens to have. Defaults to the mounted
     * preview's own width, or the virtual root's when unmounted.
     */
    width?: number;
    /**
     * The CSS pixel height of the output. Defaults to the song's own rendered
     * height; a taller value pads with the background, a shorter one crops.
     */
    height?: number;
    /**
     * `0`–`1` opacity for the image's background fill: `1` is the opaque surface
     * colour (the default — what **Download as Image** produces), `0` a fully
     * transparent PNG to drop onto a slide or another backdrop, and anything
     * between tints it. Only the background is affected; the lyrics and chords
     * keep their own colours.
     *
     * A background the browser reports as a named colour (`papayawhip`) cannot
     * be re-alpha'd and is used as-is unless the value is `0`.
     */
    backgroundAlpha?: number;
}
export interface OpenLyricElementMapOptions extends OpenLyricImageOptions {
    /**
     * Image and HTML. The CSS pixel width of ONE SECTION tile — not the page's,
     * the difference from {@link OpenLyricImageOptions.width}. The section is
     * laid out at that width, so its lines wrap for the tile being asked for.
     *
     * Omit it and the sections keep the width they have in this preview, lines
     * breaking exactly where the panel breaks them.
     */
    width?: number;
    /**
     * Image and HTML. The CSS pixel height every section tile comes out at — a
     * uniform tile size. The sections are laid out that tall (what the panel's
     * own grid does to every section in a row), so a short section pads with its
     * background and a long one crops.
     *
     * Omit it and each tile keeps its section's own height.
     */
    height?: number;
    /**
     * What each entry's value is — required, because nothing about a song says
     * which of its forms the caller is after.
     *
     * - `'text'` — the section's plain-text body.
     * - `'html'` — the section's rendered HTML: the SAME node `'png-image'`
     *   rasterizes, serialized instead of drawn — the section inside its tile,
     *   sized by `width` / `height`, shaped by `fontSize`, `theme`, `css` and
     *   `backgroundAlpha`, and carrying the styles the browser resolved for it
     *   inline (with every class and `data-*` attribute kept). So the markup is
     *   what the image is a picture OF, and needs no stylesheet attached to
     *   render that way — only the fonts, which stay a family name.
     * - `'png-image'` — a `data:image/png;base64,…` URI of the rasterized
     *   section. Renders off a virtual root when the preview is not mounted, so
     *   no mount is required — only a DOM to stage in.
     */
    type: OpenLyricContentType;
    /**
     * Keep the inline key notes — the `[chord]` markers and the leading `|`
     * bars. Off by default, so the map holds lyrics only.
     */
    isWithKeyNote?: boolean;
    /**
     * Scope the map to ONE section (part) name — `'Verse 1'` yields
     * `{ 'Verse 1': … }`. The render pipeline is scoped too, so the rest of the
     * song is never built (and, for images, never rasterized): this is the cheap
     * way to ask for one section. An empty map when the song has no such part.
     *
     * A part repeated in the structure (`IV1CV2CO` plays Chorus twice) is one
     * entry either way, so it renders once.
     *
     * `'Info'` is the one name that is not a part: it narrows the map to the
     * song's information card (see {@link isWithInfo}) — `{ Info: … }` — and,
     * unlike a part, it is not dropped by {@link isWithInfo} being off, since
     * asking for it by name is the request.
     */
    key?: string;
    /**
     * Include the song's information as an `Info` entry — the header (title,
     * subtitle · artist, description, copyright, details) and, when the map is
     * carrying key notes ({@link isWithKeyNote}), the Key / Time / Tempo line:
     * the parts of the preview that describe the song rather than sing it. On by
     * default, and the map's FIRST entry, so a caller walking the map lays the
     * information out ahead of the sections the way the panel does.
     *
     * Without the key notes the card drops that line with them — a lyrics-only
     * map that still announced the key would be the one chord left standing.
     *
     * For the image (and HTML) variant it is one more tile: the same card box a
     * section comes out as, at the same `width` / `height`, with its content
     * centred — a title slide beside the lyric slides. Pass `false` to skip it
     * (and skip building it) when only the sections are wanted.
     *
     * A map scoped to one part with {@link key} never carries it: that map is
     * about the section, and the render behind it drops the song-level header
     * for the same reason.
     */
    isWithInfo?: boolean;
    /**
     * Image and HTML. The font size, in CSS pixels, the sections are rendered at
     * — overriding whatever this preview is displaying at, so a thumbnail can be
     * drawn small and a slide large from the same embed. The line height scales
     * with it, and `width` still decides where the lines wrap. Omit it to keep
     * the preview's own size.
     */
    fontSize?: number;
    /**
     * Image and HTML. The font family the sections are rendered in — a CSS
     * `font-family` value (`'Georgia, serif'`), overriding whatever face this
     * preview is displaying in, so a slide can be drawn in one face and the
     * embed keep another.
     *
     * It replaces the whole stack: both the surface's own `font-family` and the
     * `--ol-font-family` variable the rules below it read — how a language
     * plugin ships its script face — so a section that would have rendered in
     * the plugin's Khmer face renders in this one instead. Name a fallback of
     * your own (`'Moul, editor-Battambang'`) when the override cannot cover
     * every script in the song.
     *
     * The face still has to be loaded in the document; this names one, it does
     * not fetch one. Omit it (or pass a blank string) to keep the preview's own
     * face — {@link OpenLyric.resolvedFontFamily}.
     */
    fontFamily?: string;
    /**
     * `0`–`1` opacity for each section tile's background fill, with one
     * difference from {@link OpenLyricImageOptions.backgroundAlpha}: a section
     * has **no** background unless this asks for one. Omit it and every section
     * comes out transparent — a section is a piece of the song, not a page —
     * while `1` fills it with the opaque surface colour and anything between
     * tints it.
     */
    backgroundAlpha?: number;
    /**
     * Image and HTML. Render the sections in this theme instead of the one this
     * preview is displaying — light section images off a dark embed, without
     * touching what the reader is looking at. The whole theme follows: the
     * `--ol-*` tokens, the surface colour `backgroundAlpha` tints, and the chord
     * and section-title accents.
     *
     * The live preview cannot supply another theme's colours, so an override
     * renders off a virtual root carrying the requested theme (the same one an
     * unmounted component uses), laid out at this preview's width. Omit it to
     * follow the component's own `theme`.
     */
    theme?: OpenLyricTheme;
    /**
     * Image and HTML. Extra CSS applied to the export surface — the way to shape
     * the export without restyling the page: centre the lines for a slide, hide
     * the section titles, drop the chords.
     *
     * The rules cannot reach the visible preview or another embed: the export
     * surface lays out inside a **shadow root** — see `internal/export-stage.ts`
     * — and they are scoped to the surface within it on top of that. Write them
     * against the rendered markup's own classes
     * (`.ol-song-view__section-title`, `.ol-preview-lines`,
     * `.ol-preview-lyric-segment__chord`, …); a selector starting with `&` names
     * the surface itself.
     *
     * They win over the preview stylesheet, but not over the inline colours the
     * component sets on chords and section titles — those take `!important`.
     *
     * For the HTML variant they are resolved rather than shipped: the rules are
     * applied to the surface, and what they made of it is what the inline styles
     * carry.
     */
    css?: string;
}
export interface OpenLyricValueOptions extends OpenLyricImageOptions {
    /**
     * What the value is — required, because nothing about a song says which of
     * its forms the caller is after.
     *
     * - `'text'` — the whole-song plain text (= "Copy as Text").
     * - `'html'` — the whole-song rendered HTML: the SAME export surface
     *   `'png-image'` rasterizes, serialized instead of drawn — laid out at
     *   `width`, filled to `backgroundAlpha`, shaped by `theme` and `css`, and
     *   carrying the styles the browser resolved for it inline (with every class
     *   and `data-*` attribute kept). So the markup is what the image is a
     *   picture OF, and needs no stylesheet attached to render that way — only
     *   the fonts, which stay a family name.
     * - `'png-image'` — a `data:image/png;base64,…` URI of the whole song, the
     *   same rendered image the preview panel's **Download as Image** action
     *   captures (background, fonts, and full width), as PNG. Renders off a
     *   virtual root when the preview is not mounted, so no mount is required —
     *   only a DOM to stage in.
     */
    type: OpenLyricContentType;
    /**
     * Override the inline key notes — the `[chord]` markers and leading `|`
     * bars. `true` forces them on, `false` forces them off. Omit to follow the
     * preview's current Hide Keys / Hide Bars state (what Copy as Text /
     * Download as Image reproduce).
     */
    isWithKeyNote?: boolean;
    /**
     * Image and HTML. The font family the song is rendered in — a CSS
     * `font-family` value (`'Georgia, serif'`), overriding whatever face this
     * preview is displaying in, so a slide can be drawn in one face and the
     * embed keep another.
     *
     * It replaces the whole stack: both the surface's own `font-family` and the
     * `--ol-font-family` variable the rules below it read — how a language
     * plugin ships its script face — so a song that would have rendered in the
     * plugin's Khmer face renders in this one instead. Name a fallback of your
     * own (`'Moul, editor-Battambang'`) when the override cannot cover every
     * script in the song.
     *
     * The face still has to be loaded in the document; this names one, it does
     * not fetch one. Omit it (or pass a blank string) to keep the preview's own
     * face — {@link OpenLyric.resolvedFontFamily}.
     *
     * The section counterpart is {@link OpenLyricElementMapOptions.fontFamily}.
     */
    fontFamily?: string;
    /**
     * Image only. Render the song in this theme instead of the one this preview
     * is displaying — a light slide image off a dark embed, without touching
     * what the reader is looking at. The whole theme follows: the `--ol-*`
     * tokens, the surface colour `backgroundAlpha` tints, and the chord and
     * section-title accents.
     *
     * The live preview cannot supply another theme's colours, so an override
     * renders off a virtual root carrying the requested theme (the same one an
     * unmounted component uses), laid out at this preview's width. Omit it to
     * follow the component's own `theme`.
     *
     * The section counterpart is {@link OpenLyricElementMapOptions.theme}.
     */
    theme?: OpenLyricTheme;
    /**
     * Image only. Extra CSS applied to the export surface — the way to shape the
     * exported image without restyling the page: centre the lines for a slide,
     * hide the section titles, drop the chords.
     *
     * The rules cannot reach the visible preview or another embed: the export
     * surface lays out inside a **shadow root** — see `internal/export-stage.ts`
     * — and they are scoped to the surface within it on top of that. Write them
     * against the rendered markup's own classes
     * (`.ol-song-view__section-title`, `.ol-preview-lines`,
     * `.ol-preview-lyric-segment__chord`, …); a selector starting with `&` names
     * the surface itself.
     *
     * They win over the preview stylesheet, but not over the inline colours the
     * component sets on chords and section titles — those take `!important`.
     *
     * The section counterpart is {@link OpenLyricElementMapOptions.css}.
     */
    css?: string;
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
     * Link the app-page stylesheets the lyric panel needs — the theme tokens,
     * the shared panel chrome in `shell.scss`, the preview render sheet
     * (`preview.scss`, which carries the Open Lyric song view), and the
     * narrow-viewport overrides — into `document.head`, the CSS counterpart of
     * {@link installShellMarkup}. Shared, idempotent, canonical cascade order
     * (see `internal/shell-styles.ts`); page entries call one
     * `installShellStyle()` per composed surface class, so the HTML pages ship
     * no `<link rel="stylesheet">` of their own. A standalone (non-adopt)
     * embed needs none of this — it injects its own scoped sheets on
     * construction instead.
     */
    static installShellStyle(): void;
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
    /**
     * A re-render replaces every rendered node, so an open guitar chord popover
     * would be left anchored to an element that no longer exists — and it could
     * not dismiss itself either, because its hide is delegated off the render
     * root's `mouseout`, which never fires for a removed node. Every other render
     * path already hides it first (the chrome's `change` listener, its key /
     * display controls, and the app's `renderPanels`); `reload()` is the one that
     * did not.
     */
    protected handleReload(): void;
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
    /**
     * The preview setting persisted for this page — the font size (in pixels)
     * and font family the settings popup last left behind — or `null` when
     * nothing has been saved yet, or browser storage is unavailable or holds
     * something unusable. A `null` return is the signal to fall back to the
     * defaults, which is what a standalone embed does when it loads its setting
     * on mount.
     *
     * One record covers every standalone embed on the page: the settings popup
     * is a reader preference, not a per-song one. Adopt-mode embeds are not part
     * of it — there the host page owns preferences (the app's own store).
     *
     * Override this (and {@link saveSetting}) in a subclass to keep the setting
     * somewhere else — a server, a host profile — without touching the chrome.
     */
    loadSetting(): OpenLyricPreviewSetting | null;
    /**
     * Persist the preview setting. Called by the standalone chrome whenever a
     * preview setting changes — the font-size slider, the font-family input or
     * picker, Reset, and a programmatic `fontSize`/`fontFamily` set — so the
     * next mount restores it through {@link loadSetting}.
     *
     * Partial by design: only the keys present are written, merged over what is
     * already stored, so `saveSetting({ fontSize: 20 })` keeps the saved family.
     * An empty `fontFamily` is a value, not an omission — it stores "use the
     * preview default".
     *
     * Persistence only. It does not restyle the preview; assign `fontSize` /
     * `fontFamily` for that.
     */
    saveSetting(setting: OpenLyricPreviewSetting): void;
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
     * required `type` option:
     *
     * - `{ type: 'text' }` — the section body as plain text.
     * - `{ type: 'html' }` — the section's rendered HTML (`<section …>…`).
     * - `{ type: 'png-image' }` — a `data:image/png;base64,…` URI of the
     *   rasterized section (no mount required — see {@link getValue}).
     *
     * By default the map holds lyrics only — the inline key notes (the `[chord]`
     * markers and leading `|` bars) are stripped. Pass `{ isWithKeyNote: true }`
     * to keep them.
     *
     * Its first entry is the song's information rather than a section: `Info`
     * carries the header (title, subtitle · artist, description, copyright,
     * details) and the Key / Time / Tempo line, as text, as one card's HTML, or
     * as one more image in the same card box the sections come out in. See
     * {@link OpenLyricElementMapOptions.isWithInfo} to leave it out.
     *
     * `{ key: 'Verse 1' }` narrows it to that one entry and renders only that
     * section, so asking for one part costs one part's work; `{ key: 'Info' }`
     * narrows it to the information card the same way.
     *
     * The image variant can also be asked for in another look than the one on
     * screen: `{ theme }` renders it in that theme's colours and `{ css }` adds
     * rules scoped to the export surface alone — both leave the live preview
     * untouched.
     *
     * Always async: PNG rasterization is deferred, and the text/HTML variants
     * resolve on the same contract so callers have one uniform call shape.
     */
    getElementMap(options: OpenLyricElementMapOptions): Promise<Record<string, string>>;
    /**
     * The whole song rendered as a single value — the counterpart to
     * {@link getElementMap} (which returns one entry per section). The value's
     * form is chosen by the required `type` option:
     *
     * - `{ type: 'text' }` — the full plain-text render, identical to the
     *   preview panel's **Copy as Text** action (title, meta, structure, and
     *   every section joined).
     * - `{ type: 'html' }` — the whole-song rendered HTML.
     * - `{ type: 'png-image' }` — a `data:image/png;base64,…` URI of the
     *   whole song, the same image the **Download as Image** action captures
     *   (surface background, loaded fonts, full width), as PNG. `width` /
     *   `height` size the output and `backgroundAlpha` controls how opaque its
     *   background is (`0` for a transparent PNG).
     *
     * The inline key notes (the `[chord]` markers and leading `|` bars) follow
     * the preview's current Hide Keys / Hide Bars state by default — so these
     * mirror the app's Copy as Text / Download as Image output. Pass
     * `isWithKeyNote: true` to force them on or `false` to force them off.
     *
     * The image can also be asked for in another look than the one on screen:
     * `{ theme }` renders it in that theme's colours and `{ css }` adds rules
     * scoped to the export surface alone — both leave the live preview untouched.
     *
     * For one section rather than the whole song, use {@link getElementMap}'s
     * `key` — it scopes the render pipeline too, so only that part is built.
     *
     * Async for the same reason as {@link getElementMap}: image rasterization is
     * deferred, so every variant resolves on one uniform call shape.
     */
    getValue(options: OpenLyricValueOptions): Promise<string>;
    /** Song metadata: title, sections, key, structure. */
    getInfo(): OpenLyricInfo | null;
    protected rootClassName(): string;
    protected resolveRendererTarget(target: string): {
        selector: string;
        getText: (element: Element) => string;
    } | null;
    protected decorateRenderedDom(root: HTMLElement, theme?: OpenLyricTheme): void;
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
     *
     * `partName` is the getters' `key`: it scopes the render pipeline to that one
     * section, so only that part is built. It is applied over
     * `extraRenderOptions` — a host's standing render context cannot pin the
     * getter to a different section than the one it asked for.
     */
    private getContentRenderOptions;
    private buildTextElementMap;
    /**
     * The section map's shared path: stage the export surface as a column of
     * section tiles and hand each tile to `readTile`, which turns the one node
     * into that entry's value — a PNG data URI, or the same node as HTML.
     *
     * Both forms come off the SAME node for the same reason the getters take the
     * same options: an HTML map that answered with the raw render would describe
     * a different picture than the image map does — no `width` / `height` tile,
     * no `fontSize`, `theme` or `css` override, and none of the resolved styling
     * the raster carries (see `internal/inline-styles.ts`).
     */
    private buildSectionElementMap;
    /**
     * The whole song as HTML — the same export surface {@link buildPngImageData}
     * rasterizes, serialized instead of drawn (`internal/inline-styles.ts`).
     *
     * So the two answer for one picture: the same `width` / `height`, the same
     * `theme` and `css` overrides, the same background `backgroundAlpha` asked
     * for, and the same resolved typography — one as pixels, one as markup that
     * still carries its classes and `data-*` attributes. What the HTML does not
     * carry is the font FILES; see the module note on the serializer.
     */
    private buildHtmlValue;
    /**
     * The whole song as a PNG data URI, matching the **Download as Image**
     * action: the surface carries its resolved background and typography, fonts
     * finish loading before the raster, and the output spans the full rendered
     * width/height — unless `imageOptions` names its own `width`/`height`, or
     * dials the background back with `backgroundAlpha`. A `theme` / `css`
     * override reshapes the surface it rasterizes, never the live preview.
     */
    private buildPngImageData;
    /**
     * Stage the export surface for `renderOptions` off-screen and hand it to
     * `use`, tearing everything down afterwards.
     *
     * The surface mirrors the mounted preview when there is one. Without a mount
     * there is nothing to mirror, so the component stands a **virtual** render
     * root in for it — same classes, theme, typography, and plugin styles a
     * mount would give it — and mirrors that instead. That is what lets the
     * image getters run on a component that was never mounted (a batch export, a
     * thumbnail job): they need a DOM to lay out in, not a visible embed.
     *
     * A `theme` override takes the same road for a different reason: the live
     * root resolves the colours of the theme it is SHOWING, so an export in the
     * other theme has nothing to mirror there either and mirrors a virtual root
     * carrying the requested one — laid out at the live root's width, so only
     * the colours change.
     */
    private withImageExportSurface;
    /**
     * An off-screen clone of the render root carrying `renderOptions`' markup —
     * the surface both image getters rasterize. It mirrors the reference root's
     * resolved typography and background and lays out at `width`, or at the full
     * preview width, so the raster matches what **Download as Image** captures.
     * `fontSize` overrides the type size the clone renders at, `theme` the
     * colours it resolves, and `css` adds rules that reach this surface only.
     */
    private buildImageExportSurface;
    /**
     * Re-lay the export surface as a column of section **tiles** — the nodes the
     * section image map rasterizes, one per section.
     *
     * Two things the map needs that the page surface does not:
     *
     * - **`width` / `height` size one section, not the page.** So the surface
     *   drops its page padding and holds a single grid column, and each tile
     *   takes the requested size. The section then LAYS OUT at that size — its
     *   lines wrap for the image being asked for, and a short section is
     *   stretched the way the panel's own `align-items: stretch` stretches it to
     *   its row. Sizing the raster instead would resize the node after layout and
     *   reflow the section inside the image at a width it was never measured at.
     * - **The card has to survive.** See {@link SECTION_TILE_BLEED}: the section's
     *   box shadow is painted outside its border box, so only a node AROUND the
     *   section can capture it. `backgroundAlpha` is painted onto the card for
     *   the same reason — filling the raster instead would put a square of
     *   colour behind the rounded card and square its corners off.
     *
     * Without `width` the surface keeps the live root's width and its own grid,
     * so the sections wrap exactly where the panel wraps them.
     */
    private applySectionTiles;
    /**
     * Put `card` — a section, or the `Info` card — inside a tile of its own,
     * where the tile is what gets rasterized: it carries the requested image size
     * and the bleed that keeps the card's shadow (see {@link SECTION_TILE_BLEED}),
     * and `cardBackground` is painted onto the card itself so a rounded card
     * stays rounded instead of sitting on a filled rectangle.
     */
    private wrapInSectionTile;
    /**
     * The background the export surface itself is painted in, which is not quite
     * the colour the raster is filled with.
     *
     * `backgroundAlpha` is a property of the *output*, and the two outputs paint
     * it in different places. The raster fills the canvas BEHIND the surface (see
     * {@link buildPngImageData}), which is what lets a `height` taller than the
     * song keep the same fill in the padded strip — so a tinted surface on top of
     * it would stack the alpha twice and come out darker than asked for. The
     * surface stays clear there and the fill alone carries the tint. The HTML
     * variant has no canvas under it, so the surface is where the tint has to
     * live for the two to agree.
     *
     * `undefined` (and the opaque `1`) mean the same in both: the resolved
     * surface colour, exactly as **Download as Image** has always painted it. A
     * section-tile surface is not part of either output — only its tiles are —
     * so it keeps the plain colour; {@link applySectionTiles} paints the alpha
     * onto the cards instead.
     */
    private resolveExportSurfaceBackground;
    /**
     * The colour to fill behind the rasterized song — the reference root's own
     * (non-transparent) background, else the theme's default surface — so the
     * exported image is never see-through.
     */
    private resolveSurfaceBackground;
    /**
     * The theme an image export renders in: the caller's override, else this
     * component's own. Validated like the `theme` setter — the getters are
     * called from plain JS on the `ol-*-preview` pages, where a typo would
     * otherwise silently pick the dark preset.
     */
    private resolveExportTheme;
}

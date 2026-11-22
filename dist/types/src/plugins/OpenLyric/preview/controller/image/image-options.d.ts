/**
 * The image export's options — what **Download as Image** asks for, on both
 * preview surfaces, before it draws the song: the image's size (a preset or
 * the reader's own width and height), its colour theme and text size, what it
 * includes, and the file it becomes.
 *
 * The drawing itself is the Open Lyric component's own
 * (`getValue({ type: 'png-image' })`), so the options only translate into the
 * value options it takes ({@link buildOpenLyricImageValueOptions}); a JPEG is
 * that PNG re-encoded ({@link convertOpenLyricImageDataUrl}).
 *
 * Sizes are the image's own pixels, the way an image is asked for ("a
 * 1080 × 1080 post"). The song is laid out at half that and drawn at twice the
 * density ({@link OPEN_LYRIC_IMAGE_PIXEL_RATIO}), so the text stays crisp and
 * reads at the size a phone or a slide shows it; **Text size** is how big it
 * reads.
 */
import type { OpenLyricFontFaceSection } from '../../../../../editor/components/internal/types.js';
type OpenLyricImageTheme = 'auto' | 'light' | 'dark';
type OpenLyricImageFormat = 'png' | 'jpeg';
/**
 * `'preview'` keeps the preview's own width and the whole song's height;
 * `'custom'` takes `width` / `height`; the rest are fixed sizes.
 */
type OpenLyricImageSize = 'preview' | 'square' | 'portrait' | 'story' | 'landscape' | 'custom';
interface OpenLyricImageExportOptions {
    size: OpenLyricImageSize;
    /** The image's width in pixels; `0` is the preview's own width. */
    width: number;
    /**
     * The image's height in pixels; `0` is the whole song. A fixed height pads
     * a short song with the background and cuts a long one off.
     */
    height: number;
    /**
     * With a fixed height, shrink the text until the whole song fits in it
     * rather than cutting a long song off at the bottom.
     */
    isShrinkingToFit: boolean;
    /** `'auto'` follows the theme the preview is showing. */
    theme: OpenLyricImageTheme;
    /** The text size in CSS pixels at the layout width; `0` is the preview's. */
    fontSize: number;
    /** A font face the preview offers, or `''` for the preview's own. */
    fontFamily: string;
    /** The space around the song, in image pixels. */
    margin: number;
    /** The `[chord]` key notes and `|` bars over the lyrics. */
    isWithKeyNote: boolean;
    isShowingSectionTitle: boolean;
    /** The `// …` authoring notes inside the sections. */
    isShowingCommentText: boolean;
    /** The song notes the Structure leaves out, under the song. */
    isShowingNotes: boolean;
    /** The Config `Attachments` links under the header. */
    isShowingAttachments: boolean;
    isShowingStrummingPatterns: boolean;
    format: OpenLyricImageFormat;
    /** A PNG with no background, for dropping onto something else. */
    isTransparent: boolean;
}
declare const OPEN_LYRIC_IMAGE_OPTIONS_STORAGE_KEY = "openLyric.imageExportOptions";
/** The Markdown panel keeps its own: the two previews make different pictures. */
declare const OPEN_LYRIC_MARKDOWN_IMAGE_OPTIONS_STORAGE_KEY = "openLyric.markdownImageExportOptions";
/** How many image pixels one layout (CSS) pixel becomes. */
declare const OPEN_LYRIC_IMAGE_PIXEL_RATIO = 2;
declare const OPEN_LYRIC_IMAGE_WIDTH_RANGE: {
    readonly min: 320;
    readonly max: 8000;
};
declare const OPEN_LYRIC_IMAGE_HEIGHT_RANGE: {
    readonly min: 320;
    readonly max: 16000;
};
declare const OPEN_LYRIC_IMAGE_FONT_SIZE_RANGE: {
    readonly min: 10;
    readonly max: 64;
    readonly step: 1;
};
declare const OPEN_LYRIC_IMAGE_MARGIN_RANGE: {
    readonly min: 0;
    readonly max: 400;
    readonly step: 8;
};
/** The text size the Text size field starts on when switched on. */
declare const DEFAULT_FONT_SIZE = 18;
/** The fixed sizes, in image pixels. */
declare const OPEN_LYRIC_IMAGE_SIZES: Readonly<Record<Exclude<OpenLyricImageSize, 'custom'>, Readonly<{
    width: number;
    height: number;
}>>>;
/** What the image download produced before it had options: a JPEG of the preview. */
declare function createOpenLyricImageExportOptions(): OpenLyricImageExportOptions;
/**
 * The image dialog's built-in presets. **Default** brings every option back
 * to where the dialog starts; the others set the size, look and contents an
 * image for one place wants and keep the reader's own font.
 */
type OpenLyricImagePresetName = 'default' | 'post' | 'story' | 'slide' | 'sheet';
declare const OPEN_LYRIC_IMAGE_PRESETS: ReadonlyArray<readonly [name: OpenLyricImagePresetName, label: string]>;
/**
 * The options the built-in preset `name` makes, `fontFamily` kept (every
 * preset but Default keeps the reader's font). An unknown name is Default.
 */
declare function createOpenLyricImagePreset(name: string, fontFamily?: string): OpenLyricImageExportOptions;
/** The built-in preset `options` are, or `'custom'`. */
declare function matchOpenLyricImagePreset(options: OpenLyricImageExportOptions): OpenLyricImagePresetName | 'custom';
/**
 * `value` as image options: anything missing or malformed takes the default.
 * A fixed size sets its own width and height; a custom one needs a width (a
 * height of `0` is the whole song). Only a PNG can be transparent.
 */
declare function normalizeOpenLyricImageExportOptions(value: unknown): OpenLyricImageExportOptions;
/** The options last downloaded with, or `null`. Best-effort, like every stored preference. */
declare function readOpenLyricImageExportOptions(storageKey?: string): OpenLyricImageExportOptions | null;
declare function writeOpenLyricImageExportOptions(options: unknown, storageKey?: string): void;
/** The reader's own image presets, shared by the lyric and Markdown previews. */
declare const OPEN_LYRIC_IMAGE_PRESETS_STORAGE_KEY = "openLyric.imagePresets";
/** Whether `a` and `b` make the same image: every option alike. */
declare function isSameOpenLyricImageExportOptions(a: OpenLyricImageExportOptions, b: OpenLyricImageExportOptions): boolean;
/** The reader's own image presets (`../saved-presets.ts`): whole options. */
declare const openLyricImagePresetStore: import("../saved-presets.js").OpenLyricSavedPresetStore<OpenLyricImageExportOptions>;
/**
 * The component theme a Color theme choice renders in: nothing for `'auto'`
 * (the component's own), else Light or Dark in the family the preview is in —
 * a Bootstrap-palette preview (`'dark-bs'`) keeps its palette.
 */
declare function resolveOpenLyricImageTheme(theme: OpenLyricImageTheme, previewTheme?: string): string | undefined;
/**
 * The `getValue` options that draw the image `options` describe:
 * `{ type: 'png-image', width, height, … }`, laid out at half the image's
 * pixels and drawn at {@link OPEN_LYRIC_IMAGE_PIXEL_RATIO} — or at
 * `pixelRatio` for a preview of it. `previewTheme` is the component's own
 * theme, for {@link resolveOpenLyricImageTheme}.
 */
declare function buildOpenLyricImageValueOptions(options: OpenLyricImageExportOptions, { pixelRatio, previewTheme, }?: {
    pixelRatio?: number;
    previewTheme?: string;
}): Record<string, unknown>;
/**
 * The font faces an export's Font field offers: what the preview `component`
 * offers in its own settings popup (`getFontFaceSections()` — the host's
 * `fontFaces` and the attached language plugins'), or a few common ones.
 */
declare function listOpenLyricExportFontFaces(component: {
    getFontFaceSections?: () => OpenLyricFontFaceSection[];
} | null): OpenLyricFontFaceSection[];
/** The file extension and media type of `format`. */
declare function getOpenLyricImageFileType(format: OpenLyricImageFormat): {
    extension: string;
    mimeType: string;
};
/**
 * The PNG `dataUrl` the component drew, as the file `format` asks for: the
 * PNG itself, or re-encoded as a JPEG (quality 0.96) through a canvas.
 */
declare function convertOpenLyricImageDataUrl(dataUrl: string, format: OpenLyricImageFormat): Promise<Blob>;
export { buildOpenLyricImageValueOptions, convertOpenLyricImageDataUrl, createOpenLyricImageExportOptions, createOpenLyricImagePreset, DEFAULT_FONT_SIZE as OPEN_LYRIC_IMAGE_DEFAULT_FONT_SIZE, getOpenLyricImageFileType, isSameOpenLyricImageExportOptions, listOpenLyricExportFontFaces, matchOpenLyricImagePreset, normalizeOpenLyricImageExportOptions, OPEN_LYRIC_IMAGE_FONT_SIZE_RANGE, OPEN_LYRIC_IMAGE_HEIGHT_RANGE, OPEN_LYRIC_IMAGE_MARGIN_RANGE, OPEN_LYRIC_IMAGE_OPTIONS_STORAGE_KEY, OPEN_LYRIC_IMAGE_PIXEL_RATIO, OPEN_LYRIC_IMAGE_PRESETS, OPEN_LYRIC_IMAGE_PRESETS_STORAGE_KEY, openLyricImagePresetStore, OPEN_LYRIC_IMAGE_SIZES, OPEN_LYRIC_IMAGE_WIDTH_RANGE, OPEN_LYRIC_MARKDOWN_IMAGE_OPTIONS_STORAGE_KEY, readOpenLyricImageExportOptions, resolveOpenLyricImageTheme, writeOpenLyricImageExportOptions, };
export type { OpenLyricImageExportOptions, OpenLyricImageFormat, OpenLyricImagePresetName, OpenLyricImageSize, OpenLyricImageTheme, };

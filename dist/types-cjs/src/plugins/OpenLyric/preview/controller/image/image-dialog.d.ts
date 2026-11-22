/**
 * The image export's options dialog — what **Download as Image** opens on both
 * preview surfaces before it draws the song.
 *
 * Beside the fields, a preview of the image, drawn through the same component
 * call the download makes (`renderPreview`), at a lower density, so what the
 * dialog shows is what the file gets; it redraws once the fields settle and
 * says how many pixels the image will be. The fields sit in collapsible
 * sections — Size, Look, Include, File — which stay the way the reader left
 * them. Above them, **Preset** lists Default and the reader's own presets,
 * which **Save preset** keeps (`../saved-presets.ts`, shared with the
 * Markdown preview's dialog).
 *
 * It is built on the Presentation options dialog's markup and stylesheet (the
 * `ol-pptx-dialog__*` rules in `_preview-panel-chrome.scss`), marked
 * `ol-image-dialog`, and, like it, builds itself into `host` and removes
 * itself when it closes.
 */
import { type OpenLyricImageExportOptions } from './image-options.js';
import { type OpenLyricFontFaceSource } from '../font-picker.js';
import { type OpenLyricExportDialogAction } from '../../../../../editor/components/internal/export-actions.js';
/**
 * What Download (or an export action) resolves with: the options chosen, and
 * the action's id when one was chosen instead of Download.
 */
type OpenLyricImageDialogResult = OpenLyricImageExportOptions & {
    action?: string;
};
interface OpenLyricImageDialogOptions {
    /** Where the dialog is built — the preview panel it belongs to. */
    host: HTMLElement;
    /** The options the fields open on; anything invalid takes the default. */
    initialOptions?: unknown;
    /**
     * The faces the Font field lists, in titled groups — what the preview's
     * settings popup lists (`() => listOpenLyricExportFontFaces(component)`).
     * A function is asked each time the list opens, so faces a host fills in
     * late (the system's fonts) show. Any face can be typed in as well; empty
     * keeps the preview's font.
     */
    fontFaces?: OpenLyricFontFaceSource;
    /**
     * The Include switches the image offers, of `isWithKeyNote`,
     * `isShowingSectionTitle`, `isShowingCommentText`, `isShowingNotes`,
     * `isShowingAttachments` and `isShowingStrummingPatterns` — all of them by
     * default (the lyric preview). Without any, the Include section is left
     * out (the Markdown preview, which draws what it shows).
     */
    includeFields?: readonly OpenLyricImageIncludeField[];
    /**
     * Buttons after Download — the host's export actions
     * (`toOpenLyricExportDialogActions(component.getExportActions('image'))`).
     * Each finishes the dialog the way Download does, naming itself in the
     * result's `action`.
     */
    actions?: readonly OpenLyricExportDialogAction[];
    /**
     * A PNG data URI of the image `options` describe, drawn at `pixelRatio`
     * image pixels per layout pixel — `buildOpenLyricImageValueOptions` into
     * the component's `getValue`. Without it the dialog shows no preview.
     */
    renderPreview?: (options: OpenLyricImageExportOptions, { pixelRatio }: {
        pixelRatio: number;
    }) => Promise<string | null | undefined>;
    /** How long the preview waits for the fields to settle before redrawing. */
    previewDelayMs?: number;
}
type OpenLyricImageIncludeField = 'isWithKeyNote' | 'isShowingSectionTitle' | 'isShowingCommentText' | 'isShowingNotes' | 'isShowingAttachments' | 'isShowingStrummingPatterns';
/**
 * Open the dialog. Resolves with the options the reader downloads with, or
 * `null` when they cancel (the Cancel button, Escape, or a click on the
 * backdrop). The dialog is gone from the DOM by the time it resolves.
 */
declare function openOpenLyricImageDialog({ host, initialOptions, fontFaces, includeFields, renderPreview, previewDelayMs, actions, }: OpenLyricImageDialogOptions): Promise<OpenLyricImageDialogResult | null>;
export { openOpenLyricImageDialog };
export type { OpenLyricImageDialogOptions, OpenLyricImageDialogResult, OpenLyricImageIncludeField, };

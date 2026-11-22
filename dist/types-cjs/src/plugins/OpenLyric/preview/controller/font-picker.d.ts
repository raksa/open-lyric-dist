/**
 * The Font field of the export dialogs (PowerPoint and image): the same
 * control as the preview's settings popup — a text box any face can be typed
 * into, and a list of the faces the preview offers, in its groups, opened
 * from the caret. Typed or picked, the box holds the value; empty is the
 * preview's own font ("Use preview default").
 *
 * The list is asked for each time it opens (`fontFaces` may be a function),
 * so a host that fills the preview's faces late — the system's fonts, read
 * when they arrive — offers them here as the settings popup does.
 */
import type { OpenLyricFontFaceSection } from '../../../../editor/components/internal/types.js';
type OpenLyricFontFaceSource = readonly OpenLyricFontFaceSection[] | (() => readonly OpenLyricFontFaceSection[]);
interface OpenLyricFontPickerOptions {
    /** The faces the list offers, in titled groups — or how to ask for them. */
    fontFaces?: OpenLyricFontFaceSource;
    /** The face the box opens on; `''` is the preview's own. */
    value?: string;
    /** Called with the face, trimmed, as it is typed or picked. */
    onChange: (value: string) => void;
}
interface OpenLyricFontPicker {
    /** The face in the box. Setting it changes nothing else. */
    value: string;
    destroy(): void;
}
/** The picker's markup, for a dialog's own template; `mountOpenLyricFontPicker` wires it. */
declare function openLyricFontPickerMarkup(id: string): string;
/** Wire the picker `openLyricFontPickerMarkup` drew inside `root`. */
declare function mountOpenLyricFontPicker(root: HTMLElement, { fontFaces, value, onChange }: OpenLyricFontPickerOptions): OpenLyricFontPicker;
export { mountOpenLyricFontPicker, openLyricFontPickerMarkup };
export type { OpenLyricFontFaceSource, OpenLyricFontPicker, OpenLyricFontPickerOptions, };

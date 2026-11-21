/**
 * The bundled example songs as menu entries — id, file name, title,
 * description and text — with no editor imports, so every host lists the same
 * set: the notation plugin's `examples` slot (`open-lyric_ol_editor.ts`) and
 * the VS Code extension's "Open Example" picker.
 */
declare const OPEN_LYRIC_EXAMPLE_GROUP_TITLE = "Open Lyric .md Examples";
declare const OPEN_LYRIC_EXAMPLES: {
    id: string;
    fileName: string;
    title: string;
    description: string;
    content: string;
}[];
export { OPEN_LYRIC_EXAMPLES, OPEN_LYRIC_EXAMPLE_GROUP_TITLE };

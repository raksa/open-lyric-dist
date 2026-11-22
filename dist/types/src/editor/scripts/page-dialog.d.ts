/**
 * Ask in the page instead of with `prompt()` / `confirm()`. A host page can
 * block those: in an iframe sandboxed without `allow-modals` the browser
 * answers `null` / `false` without asking, so a command that depends on them
 * silently does nothing. The question is a modal `<dialog>` built inside
 * `root` — so the styles scoped to that root reach it — and removed once it
 * is answered.
 *
 * `block` names the BEM block the dialog's parts are classed under: the
 * dashboard's dialogs use `share-link-dialog` (`styles/dialogs.scss`), the
 * standalone `Editor` chrome `ol-editor-dictionary-dialog`.
 */
interface PageDialogOptions {
    /** Where the dialog goes: inside the component's scope root. */
    root: Element | null | undefined;
    /** The BEM block its parts are classed under. */
    block: string;
    /** `--modifier` classes added to the block on the dialog. */
    modifiers?: readonly string[];
    title: string;
    /** A line under the title. */
    message?: string;
    confirmLabel: string;
    cancelLabel?: string;
    /** Classes of the confirm button. */
    confirmClass?: string;
}
interface PageTextDialogOptions extends PageDialogOptions {
    /** The text field's label. */
    inputLabel: string;
    /** What the field starts with (selected, so typing replaces it). */
    value: string;
    /** Classes of the text field, for the block's own input style. */
    inputClass?: string;
}
/** Whether `root` can hold a modal in-page dialog. */
declare function canShowPageDialog(root: Element | null | undefined): boolean;
/** Ask a yes/no question in the page: `true` when confirmed. */
declare function confirmInPage(options: PageDialogOptions): Promise<boolean>;
/** Ask for a line of text in the page: the text, or `null` when cancelled. */
declare function askTextInPage(options: PageTextDialogOptions): Promise<string | null>;
export { askTextInPage, canShowPageDialog, confirmInPage };
export type { PageDialogOptions, PageTextDialogOptions };

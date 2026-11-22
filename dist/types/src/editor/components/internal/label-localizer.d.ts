/**
 * Translates the fixed text of a standalone preview — its settings popup,
 * actions menu, tooltips, section names — in the DOM, from the same `labels`
 * table a language plugin contributes (`language.labels`, keyed by the English
 * text).
 *
 * The renderers already print the song header's labels translated; this covers
 * everything the preview builds as markup or by hand around it, without each
 * of those places knowing a translation exists. It is a pass over the mounted
 * container:
 *
 * - **Text** is translated only where the preview itself wrote it: inside a
 *   control (`button`, `label`, `option`, …), the popup and menus, a section
 *   title, a structure step — see {@link isTranslatableTextParent}. Lyrics, field
 *   values and everything else the author wrote are never looked at.
 * - **`title`, `aria-label`, `placeholder` and `label`** (an `<optgroup>`'s
 *   heading, an `<option>`'s short form) are translated on any element.
 * - A string is translated when the table has it exactly, or through a
 *   **pattern** entry — a key with `{0}` / `{1}` placeholders
 *   (`'Edit {0}'`), whose captures are translated in turn. A trailing colon
 *   is carried over (`Verse 1:`), and anything with no entry stays as it is.
 *
 * The originals are remembered, so a table that changes (the reader picks
 * another label language, the song's `Locales` change) re-translates from the
 * English, and an empty table restores it. A `MutationObserver` keeps text the
 * preview writes later (a toggle's caption, an export's progress) translated.
 */
type Labels = Readonly<Record<string, string>>;
/** Opt an element (and its subtree) out: `data-ol-no-translate`. */
declare const NO_TRANSLATE_ATTRIBUTE = "data-ol-no-translate";
/**
 * `labels` as one function, translating the way the localizer does — exact
 * entries, `{0}` patterns, a trailing colon — for text the preview writes
 * outside its own DOM: an exported slide show's viewer, say.
 */
declare function createLabelTranslator(labels: Labels): (text: string) => string;
declare class LabelLocalizer {
    private readonly root;
    private readonly getLabels;
    private labels;
    private patterns;
    private textTranslations;
    private attributeTranslations;
    /** Whether anything is, or may still be, shown translated. */
    private active;
    /** The table's content, to tell a changed table from a re-read one. */
    private signature;
    private tableChanged;
    private observer;
    private readonly excluded;
    private scheduled;
    private destroyed;
    /** Mutations seen since the last pass — the only nodes it has to revisit. */
    private pending;
    /**
     * `options.exclude` names direct children of `root` that are someone else's
     * to translate — a page-level localizer leaves out the previews mounted on
     * the page, each of which runs its own. They are neither walked nor watched.
     */
    constructor(root: HTMLElement, getLabels: () => Labels, options?: {
        exclude?: readonly Element[];
    });
    /**
     * Watch the root for text the preview writes later. Only while the root is
     * in the document: a root that has been taken out of it is not being read
     * by anyone, so the watch is dropped and picked up again by the next
     * {@link refresh} that finds it attached.
     */
    private observe;
    private watchChild;
    private unobserve;
    /** Translate (or restore) everything under the root for the current table. */
    refresh(): void;
    /**
     * Take the current table. Returns whether it has entries; recompiles the
     * patterns only when its content actually changed (a host hands back a new
     * object on every read).
     */
    private adoptLabels;
    private finishPass;
    /**
     * After the preview changed something on its own: revisit just what changed.
     * A table that changed meanwhile (the song's `Locales` were edited) needs
     * every node again.
     */
    private flush;
    destroy(): void;
    /** The translation of one string; the string itself when there is none. */
    translate(text: string): string;
    private schedule;
    /**
     * What a node should read: the translation of its English. A node the
     * preview has rewritten since the last pass no longer shows what was put
     * there, so what it shows now is the new English.
     */
    private resolve;
    private translateSubtree;
    private translateText;
    private translateElementAttributes;
}
/**
 * The strings under `root` the localizer would consider — for building and
 * checking a translation table against what a preview actually shows.
 */
declare function collectTranslatableStrings(root: HTMLElement): string[];
export { LabelLocalizer, NO_TRANSLATE_ATTRIBUTE, collectTranslatableStrings, createLabelTranslator, };

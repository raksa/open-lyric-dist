/** The kind of the action that applies every fix at once (Fix All, on save). */
declare const FIX_ALL_KIND = "source.fixAll.openLyric";
/** The code action kinds {@link createMarkdownOlQuickFixProvider} offers. */
declare const QUICK_FIX_CODE_ACTION_KINDS: string[];
/**
 * Quick fixes for Open Lyric diagnostics: a marker the validator could say
 * the fix for (`Did you mean ol:Verse 2?`, `Try [G].`, `(2x)`) gets a
 * preferred `quickfix` action — the light bulb, Ctrl/Cmd+. — that puts the
 * suggested text in place of the marker's range. Offered only while the text
 * there is still what was validated, so a fix never lands on a moved word.
 *
 * While two or more fixes apply in the document, the light bulb also offers
 * **Fix all N Open Lyric problems**, one edit for all of them; asked for
 * `source.fixAll` (Monaco's Fix All, a save action) the provider answers with
 * that action alone, kind `source.fixAll.openLyric`. Fixes whose ranges
 * overlap go one at a time; validation offers the rest afterwards.
 */
declare function createMarkdownOlQuickFixProvider(): {
    provideCodeActions(model: any, _range: any, context: any): {
        actions: ({
            title: string;
            kind: any;
            edit: {
                edits: any;
            };
        } | {
            title: any;
            kind: string;
            diagnostics: any[];
            isPreferred: boolean;
            edit: {
                edits: {
                    resource: any;
                    versionId: any;
                    textEdit: {
                        range: {
                            startLineNumber: any;
                            startColumn: any;
                            endLineNumber: any;
                            endColumn: any;
                        };
                        text: any;
                    };
                }[];
            };
        })[];
        dispose(): void;
    };
};
export { createMarkdownOlQuickFixProvider, FIX_ALL_KIND, QUICK_FIX_CODE_ACTION_KINDS, };

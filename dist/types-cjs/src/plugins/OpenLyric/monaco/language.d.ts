declare function createMarkdownOlTokensProvider(): {
    defaultToken: string;
    tokenizer: {
        root: any[];
        codeblock: ((string | RegExp)[] | (RegExp | {
            token: string;
            next: string;
        })[])[];
        olUnknown: ((string | RegExp)[] | (RegExp | {
            token: string;
            next: string;
        })[])[];
    };
};
declare function createFenceSnippetText(definition: any, header: any, indentation: any): string;
/**
 * Every completion provider of the notation, in registration order, each with
 * an id so a host can leave one out. Creating them touches no `monaco` global;
 * only `provideCompletionItems` does (for `Range` and the item enums), so a
 * host with another editor can run these same providers behind a small shim.
 * The VS Code extension does that in its core worker.
 */
declare function createMarkdownOlCompletionProviders(): {
    id: string;
    provider: {
        triggerCharacters: string[];
        provideCompletionItems(model: any, position: any): {
            suggestions: any;
        };
    };
}[];
/**
 * The language configuration Monaco gets for `markdown-ol` — plain data, so a
 * host with its own editor (the VS Code extension's generated
 * `language-configuration.json`) reads the same brackets, comment and word
 * rules instead of restating them.
 */
declare const MARKDOWN_OL_LANGUAGE_CONFIGURATION: {
    comments: {
        lineComment: string;
    };
    brackets: string[][];
    wordPattern: RegExp;
    autoClosingPairs: {
        open: string;
        close: string;
    }[];
    surroundingPairs: {
        open: string;
        close: string;
    }[];
};
declare function registerMarkdownOlLanguage(): void;
export { createFenceSnippetText, createMarkdownOlCompletionProviders, createMarkdownOlTokensProvider, MARKDOWN_OL_LANGUAGE_CONFIGURATION, registerMarkdownOlLanguage, };

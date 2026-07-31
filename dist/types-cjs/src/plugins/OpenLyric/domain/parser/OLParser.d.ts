/**
 * Runs markdown through a configurable pipeline:
 * raw markdown -> pre-processors -> markdown parser -> post-processors -> HTML.
 */
declare class OLParser {
    constructor(options?: {});
    setMarkdownParser(markdownParser: any): this;
    clearMarkdownParser(): this;
    setPreProcessors(processors: any): this;
    setBeforeMarkedProcessors(processors: any): this;
    setPostProcessors(processors: any): this;
    setAfterMarkedProcessors(processors: any): this;
    addPreProcessor(processor: any): this;
    addBeforeMarkedProcessor(processor: any): this;
    addPostProcessor(processor: any): this;
    addAfterMarkedProcessor(processor: any): this;
    addBeforeParseProcessor(processor: any): this;
    addAfterParseProcessor(processor: any): this;
    clearPreProcessors(): this;
    clearBeforeMarkedProcessors(): this;
    clearPostProcessors(): this;
    clearAfterMarkedProcessors(): this;
    use(stage: any, processor: any): this;
    createContext(rawText?: string, extraContext?: {}): object;
    preprocess(rawText: any, context?: {}): any;
    beforeMarked(rawText: any, context?: {}): any;
    postprocess(htmlText: any, context?: {}): any;
    afterMarked(htmlText: any, context?: {}): any;
    parse(rawText: any, options?: {}): any;
    parseToResult(rawText: any, options?: {}): {
        rawText: any;
        markdownText: any;
        parsedHtml: string;
        htmlText: any;
        context: object;
    };
    getMarkdownParser(overrideParser: any): any;
    renderMarkdown(markdownText: any, markdownParser?: any, context?: {}): string;
    runProcessorChain(value: any, processors: any, stage: any, context: any): any;
}
export { OLParser };

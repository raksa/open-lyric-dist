declare function isBuiltInOpenLyricPluginEnabled(): boolean;
/** The live OpenLyric notation registration, or null while disabled. */
declare function getBuiltInOpenLyricPluginRegistration(): {
    draftExamples: any;
    disposed: boolean;
    fonts: any;
    id: any;
    keyboardIds: any;
    openLyricIds: any[];
    openLyricSpecification: any;
    pluginData: any;
    pptxStyle: any;
    spellcheckLanguageCodes: any;
    styleEntries: never[];
    transcriptIds: any;
    transcriptLocales: any;
} | null;
declare function setBuiltInOpenLyricPluginEnabled(enabled: any): {
    draftExamples: any;
    disposed: boolean;
    fonts: any;
    id: any;
    keyboardIds: any;
    openLyricIds: any[];
    openLyricSpecification: any;
    pluginData: any;
    pptxStyle: any;
    spellcheckLanguageCodes: any;
    styleEntries: never[];
    transcriptIds: any;
    transcriptLocales: any;
} | null;
/**
 * Register the built-in Open Lyric notation plugin with the legacy registry
 * (its runtime enable/disable preference still applies inside). The other
 * former built-ins register themselves when the page composes them — see the
 * module doc above.
 */
declare function registerBuiltInEditorPlugins({ includeOpenLyricPlugin }?: {
    includeOpenLyricPlugin?: boolean | undefined;
}): {
    openLyricPluginRegistration: {
        draftExamples: any;
        disposed: boolean;
        fonts: any;
        id: any;
        keyboardIds: any;
        openLyricIds: any[];
        openLyricSpecification: any;
        pluginData: any;
        pptxStyle: any;
        spellcheckLanguageCodes: any;
        styleEntries: never[];
        transcriptIds: any;
        transcriptLocales: any;
    } | null;
};
export { getBuiltInOpenLyricPluginRegistration, isBuiltInOpenLyricPluginEnabled, registerBuiltInEditorPlugins, setBuiltInOpenLyricPluginEnabled, };

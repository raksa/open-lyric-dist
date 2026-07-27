declare function isBuiltInOpenLyricPluginEnabled(): boolean;
/** The live OpenLyric notation registration, or null while disabled. */
declare function getBuiltInOpenLyricPluginRegistration(): {
    draftExamples: any;
    disposed: boolean;
    id: any;
    keyboardIds: any;
    openLyricIds: any[];
    openLyricSpecification: any;
    pluginData: any;
    pptxStyle: any;
    spellcheckLanguageCodes: any;
    styleEntries: never[];
    transcriptIds: any;
} | null;
declare function setBuiltInOpenLyricPluginEnabled(enabled: any): {
    draftExamples: any;
    disposed: boolean;
    id: any;
    keyboardIds: any;
    openLyricIds: any[];
    openLyricSpecification: any;
    pluginData: any;
    pptxStyle: any;
    spellcheckLanguageCodes: any;
    styleEntries: never[];
    transcriptIds: any;
} | null;
declare function registerBuiltInEditorPlugins({ includeOpenLyricPlugin, includeKhmerPlugin, includeTranscriptPlugin, }?: {
    includeOpenLyricPlugin?: boolean | undefined;
    includeKhmerPlugin?: boolean | undefined;
    includeTranscriptPlugin?: boolean | undefined;
}): {
    khmerPluginRegistration: {
        draftExamples: any;
        disposed: boolean;
        id: any;
        keyboardIds: any;
        openLyricIds: any[];
        openLyricSpecification: any;
        pluginData: any;
        pptxStyle: any;
        spellcheckLanguageCodes: any;
        styleEntries: never[];
        transcriptIds: any;
    } | null;
    openLyricPluginRegistration: {
        draftExamples: any;
        disposed: boolean;
        id: any;
        keyboardIds: any;
        openLyricIds: any[];
        openLyricSpecification: any;
        pluginData: any;
        pptxStyle: any;
        spellcheckLanguageCodes: any;
        styleEntries: never[];
        transcriptIds: any;
    } | null;
    transcriptPluginRegistration: {
        draftExamples: any;
        disposed: boolean;
        id: any;
        keyboardIds: any;
        openLyricIds: any[];
        openLyricSpecification: any;
        pluginData: any;
        pptxStyle: any;
        spellcheckLanguageCodes: any;
        styleEntries: never[];
        transcriptIds: any;
    } | null;
};
export { getBuiltInOpenLyricPluginRegistration, isBuiltInOpenLyricPluginEnabled, registerBuiltInEditorPlugins, setBuiltInOpenLyricPluginEnabled, };

declare function registerPlugin(pluginData: any): {
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
};
declare function unregisterPlugin(registeredData: any): boolean;
declare function getRegisteredSpellcheckSpecification(languageCode: any): any;
declare function getRegisteredSpellcheckSpecifications(): any[];
declare function getRegisteredKeyboardSpecifications(): any[];
declare function getRegisteredTranscriptSpecifications(): any[];
declare function getRegisteredOpenLyricSpecification(): any;
declare function getRegisteredOpenLyricSpecifications(): any[];
declare function getRegisteredPluginStyles(): any[];
declare function getRegisteredPluginDraftExamples(): any[];
/**
 * Every registered plugin's `fonts` contribution, in registration order.
 *
 * The core reads faces from here rather than naming any itself: the app's
 * initial font wait probes `{ faces, sampleText }`, and the preview
 * font-family pickers list `faces` above their own script-neutral defaults. A
 * page that registers no language plugin therefore ships no script-specific
 * face name.
 */
declare function getRegisteredPluginFonts(): any[];
/**
 * Every BCP-47 locale registered plugins add to the transcript locale picker,
 * in registration order. The first is the transcript surface's default; with
 * none registered it stays on Auto (see `transcript-locale.ts`).
 */
declare function getRegisteredTranscriptLocales(): any[];
declare function getRegisteredPowerPointStyles(): any[];
declare function subscribeToPluginRegistry(listener: any): () => void;
export { getRegisteredKeyboardSpecifications, getRegisteredOpenLyricSpecification, getRegisteredOpenLyricSpecifications, getRegisteredPluginDraftExamples, getRegisteredPluginFonts, getRegisteredPluginStyles, getRegisteredPowerPointStyles, getRegisteredSpellcheckSpecification, getRegisteredSpellcheckSpecifications, getRegisteredTranscriptLocales, getRegisteredTranscriptSpecifications, registerPlugin, subscribeToPluginRegistry, unregisterPlugin, };

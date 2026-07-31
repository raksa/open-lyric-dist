import type { OpenLyricComponentHost, OpenLyricContributions, OpenLyricPlugin, OpenLyricSurface } from '../../editor/components/index.js';
declare class EditorOpenLyricPlugin implements OpenLyricPlugin {
    readonly id = "open-lyric";
    readonly apiVersion: 1;
    readonly surfaces: readonly OpenLyricSurface[];
    readonly contributes: OpenLyricContributions;
    private validationTimer;
    install(): void;
    uninstall(): void;
    onMount(host: OpenLyricComponentHost): void;
    onUnmount(host: OpenLyricComponentHost): void;
    onValueChange(host: OpenLyricComponentHost): void;
    /** The real notation API (parser, validation, preview, music theory). */
    getOpenLyricApi(): {
        document: {
            checkMarkdown: typeof import("./document/validation.js").checkOLMarkdown;
            parsePlainText: typeof import("./document/plain-text-import.js").parseOpenLyricPlainText;
            scheduleValidation: typeof import("./document/validation.js").scheduleValidation;
            validation: typeof import("./document/validation.js");
        };
        domain: {
            musicTheory: typeof import("./domain/music-theory.js");
            parser: {
                OLBridge: typeof import("./domain/parser/fences.js").OLBridge;
                OLBreakdown: typeof import("./domain/parser/fences.js").OLBreakdown;
                OLChorus: typeof import("./domain/parser/fences.js").OLChorus;
                OLConfig: typeof import("./domain/parser/fences.js").OLConfig;
                OLFenceDefinition: typeof import("./domain/parser/fences.js").OLFenceDefinition;
                OLFinalChorus: typeof import("./domain/parser/fences.js").OLFinalChorus;
                OLFreeTextFence: typeof import("./domain/parser/fences.js").OLFreeTextFence;
                OLInstrumental: typeof import("./domain/parser/fences.js").OLInstrumental;
                OLInstrumentalFence: typeof import("./domain/parser/fences.js").OLInstrumentalFence;
                OLInterlude: typeof import("./domain/parser/fences.js").OLInterlude;
                OLIntro: typeof import("./domain/parser/fences.js").OLIntro;
                OLLyricFence: typeof import("./domain/parser/fences.js").OLLyricFence;
                OLOutro: typeof import("./domain/parser/fences.js").OLOutro;
                OLPostChorus: typeof import("./domain/parser/fences.js").OLPostChorus;
                OLPreChorus: typeof import("./domain/parser/fences.js").OLPreChorus;
                OLRefrain: typeof import("./domain/parser/fences.js").OLRefrain;
                OLSolo: typeof import("./domain/parser/fences.js").OLSolo;
                OLTag: typeof import("./domain/parser/fences.js").OLTag;
                OLVamp: typeof import("./domain/parser/fences.js").OLVamp;
                OLVerse: typeof import("./domain/parser/fences.js").OLVerse;
                definitions: (import("./domain/parser/fences.js").OLBridge | import("./domain/parser/fences.js").OLBreakdown | import("./domain/parser/fences.js").OLChorus | import("./domain/parser/fences.js").OLConfig | import("./domain/parser/fences.js").OLFinalChorus | import("./domain/parser/fences.js").OLInstrumental | import("./domain/parser/fences.js").OLInterlude | import("./domain/parser/fences.js").OLIntro | import("./domain/parser/fences.js").OLOutro | import("./domain/parser/fences.js").OLPostChorus | import("./domain/parser/fences.js").OLPreChorus | import("./domain/parser/fences.js").OLRefrain | import("./domain/parser/fences.js").OLSolo | import("./domain/parser/fences.js").OLTag | import("./domain/parser/fences.js").OLVamp | import("./domain/parser/fences.js").OLVerse)[];
                definitionsByClassName: any;
                findFenceDefinition: typeof import("./domain/parser/fences.js").findFenceDefinition;
                formatDeclaredPartName: typeof import("./domain/parser/fences.js").formatDeclaredPartName;
                getFenceBlockKind: typeof import("./domain/parser/fences.js").getFenceBlockKind;
                getFenceHeaderError: typeof import("./domain/parser/fences.js").getFenceHeaderError;
                getFenceSnippetDefinitions: typeof import("./domain/parser/fences.js").getFenceSnippetDefinitions;
                getRequiredDeclaredPartNames: typeof import("./domain/parser/fences.js").getRequiredDeclaredPartNames;
                parseFenceHeader: typeof import("./domain/parser/fences.js").parseFenceHeader;
                parser: {
                    types: {
                        OLFenceDefinition: typeof import("./domain/parser/fences.js").OLFenceDefinition;
                        OLConfig: typeof import("./domain/parser/fences.js").OLConfig;
                        OLIntro: typeof import("./domain/parser/fences.js").OLIntro;
                        OLFinalChorus: typeof import("./domain/parser/fences.js").OLFinalChorus;
                        OLPreChorus: typeof import("./domain/parser/fences.js").OLPreChorus;
                        OLPostChorus: typeof import("./domain/parser/fences.js").OLPostChorus;
                        OLRefrain: typeof import("./domain/parser/fences.js").OLRefrain;
                        OLBridge: typeof import("./domain/parser/fences.js").OLBridge;
                        OLChorus: typeof import("./domain/parser/fences.js").OLChorus;
                        OLVerse: typeof import("./domain/parser/fences.js").OLVerse;
                        OLTag: typeof import("./domain/parser/fences.js").OLTag;
                        OLOutro: typeof import("./domain/parser/fences.js").OLOutro;
                        OLInstrumental: typeof import("./domain/parser/fences.js").OLInstrumental;
                        OLInterlude: typeof import("./domain/parser/fences.js").OLInterlude;
                        OLBreakdown: typeof import("./domain/parser/fences.js").OLBreakdown;
                        OLVamp: typeof import("./domain/parser/fences.js").OLVamp;
                        OLSolo: typeof import("./domain/parser/fences.js").OLSolo;
                    };
                    registry: import("./domain/parser/fences/OLFenceRegistry.js").OLFenceRegistry;
                    definitions: any;
                    definitionsByClassName: any;
                    findFenceDefinition: (header: any) => any;
                    parseFenceHeader: (info: any) => any;
                    getFenceBlockKind: (info: any) => any;
                    getFenceHeaderError: (info: any) => string;
                    getFenceSnippetDefinitions: () => any;
                    getRequiredDeclaredPartNames: () => any;
                    formatDeclaredPartName: typeof import("./domain/parser/fences.js").formatDeclaredPartName;
                };
                registry: import("./domain/parser/fences/OLFenceRegistry.js").OLFenceRegistry;
                types: {
                    OLFenceDefinition: typeof import("./domain/parser/fences.js").OLFenceDefinition;
                    OLConfig: typeof import("./domain/parser/fences.js").OLConfig;
                    OLIntro: typeof import("./domain/parser/fences.js").OLIntro;
                    OLFinalChorus: typeof import("./domain/parser/fences.js").OLFinalChorus;
                    OLPreChorus: typeof import("./domain/parser/fences.js").OLPreChorus;
                    OLPostChorus: typeof import("./domain/parser/fences.js").OLPostChorus;
                    OLRefrain: typeof import("./domain/parser/fences.js").OLRefrain;
                    OLBridge: typeof import("./domain/parser/fences.js").OLBridge;
                    OLChorus: typeof import("./domain/parser/fences.js").OLChorus;
                    OLVerse: typeof import("./domain/parser/fences.js").OLVerse;
                    OLTag: typeof import("./domain/parser/fences.js").OLTag;
                    OLOutro: typeof import("./domain/parser/fences.js").OLOutro;
                    OLInstrumental: typeof import("./domain/parser/fences.js").OLInstrumental;
                    OLInterlude: typeof import("./domain/parser/fences.js").OLInterlude;
                    OLBreakdown: typeof import("./domain/parser/fences.js").OLBreakdown;
                    OLVamp: typeof import("./domain/parser/fences.js").OLVamp;
                    OLSolo: typeof import("./domain/parser/fences.js").OLSolo;
                };
                OLParser: typeof import("./domain/parser/OLParser.js").OLParser;
            };
            structure: typeof import("./domain/structure.js");
        };
        monaco: {
            language: {
                registerMarkdownOlLanguage: typeof import("./monaco/language.js").registerMarkdownOlLanguage;
                checkOLMarkdown: typeof import("./document/validation.js").checkOLMarkdown;
                scheduleValidation: typeof import("./document/validation.js").scheduleValidation;
                validateMarkdownOlModel: typeof import("./document/validation.js").validateMarkdownOlModel;
            };
        };
        preview: typeof import("./preview/index.js");
    };
    /** The bundled example documents (same set the app's Reset dialog shows). */
    getExamples(): {
        id: string;
        fileName: string;
        title: string;
        description: string;
        content: string;
    }[];
    private validateNow;
    private resolveModel;
    private clearValidationTimer;
}
export { EditorOpenLyricPlugin };

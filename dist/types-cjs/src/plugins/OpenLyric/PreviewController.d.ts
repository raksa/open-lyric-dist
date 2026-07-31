/**
 * Owns preview rendering, preview-to-editor navigation, and chord popup
 * interactions for both preview panes.
 */
declare class PreviewController {
    [key: string]: any;
    constructor({ getCurrentValue, onOpenLyricPluginEnabledChange, preferences, }: {
        getCurrentValue: any;
        onOpenLyricPluginEnabledChange?: null | undefined;
        preferences?: null | undefined;
    });
}
export { PreviewController };

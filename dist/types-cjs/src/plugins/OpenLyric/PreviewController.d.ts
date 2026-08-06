/**
 * Owns preview rendering, preview-to-editor navigation, and chord popup
 * interactions for both preview panes.
 */
declare class PreviewController {
    [key: string]: any;
    constructor({ getCurrentValue, preferences }: {
        getCurrentValue: any;
        preferences?: null | undefined;
    });
}
export { PreviewController };

/**
 * Manages the active markdown document: file open/save flows, draft recovery,
 * resets, and dirty-state persistence.
 */
declare class DocumentController {
    [key: string]: any;
    constructor({ preferences, previewController }: {
        preferences: any;
        previewController: any;
    });
}
export { DocumentController };

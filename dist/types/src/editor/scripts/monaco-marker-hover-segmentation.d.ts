declare function attachMobileSpellcheckMarkerHoverSelection(editor: {
    getAction?: (actionId: string) => {
        run?: () => Promise<void> | void;
    } | null;
    getSelection?: () => unknown;
    onDidChangeCursorSelection?: (listener: (event: {
        selection?: unknown;
    }) => void) => {
        dispose?: () => void;
    };
}): {
    dispose(): void;
};
declare function patchMarkerHoverAction(): void;
export { attachMobileSpellcheckMarkerHoverSelection, patchMarkerHoverAction };

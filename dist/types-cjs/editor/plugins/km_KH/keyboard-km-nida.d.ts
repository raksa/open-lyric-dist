declare function createNativeTextInputAdapter(inputElement: any): {
    kind: string;
    acceptSelectedSuggestionIfVisible(): boolean;
    focus: () => void;
    insertText: (text: any) => void;
    deleteBackward: () => void;
    moveCursor: (direction: any, options?: {}) => void;
    isFocused: () => boolean;
    ownsPhysicalKeyboardEvent: (event: any) => boolean;
    containsNode: (node: any) => boolean;
    destroy(): void;
};
declare function createMonacoInputAdapter(editor: any, options?: {}): {
    kind: string;
    acceptSelectedSuggestionIfVisible: () => boolean;
    focus: () => void;
    insertText: (text: any) => void;
    deleteBackward: () => void;
    moveCursor: (direction: any, options?: {}) => void;
    isFocused: () => any;
    ownsPhysicalKeyboardEvent: (event: any) => any;
    containsNode: (node: any) => boolean;
    destroy(): void;
};
declare function createKhmerNidaKeyboard(options: any): {
    elements: {
        anchorElement: any;
        input: any;
        toggleButton: any;
        closeButton: any;
        minimizeButton: any;
        keyboard: any;
        keyboardFooter: any;
        keyboardTitle: any;
        keyboardRows: any;
        keyboardMode: any;
        layoutMenu: any;
        layoutTrigger: any;
        spaceMode: any;
        navigationButtons: any;
        resizeHandle: any;
    };
    focusTarget: () => void;
    open(): void;
    close(): void;
    toggle(): void;
    setTarget: (nextTarget: any) => void;
    render(): void;
    restoreState(nextState: any): void;
    getState(): {
        isOpen: boolean;
        isMinimized: boolean;
        layoutId: string;
        layoutLabel: string;
        mode: string;
        position: {
            left: any;
            top: any;
        } | null;
        size: {
            height: number;
            width: number;
        } | null;
        targetKind: any;
    };
    destroy(): void;
};
declare function bootstrapKhmerNidaDemo(rootDocument?: any): {
    elements: {
        anchorElement: any;
        input: any;
        toggleButton: any;
        closeButton: any;
        minimizeButton: any;
        keyboard: any;
        keyboardFooter: any;
        keyboardTitle: any;
        keyboardRows: any;
        keyboardMode: any;
        layoutMenu: any;
        layoutTrigger: any;
        spaceMode: any;
        navigationButtons: any;
        resizeHandle: any;
    };
    focusTarget: () => void;
    open(): void;
    close(): void;
    toggle(): void;
    setTarget: (nextTarget: any) => void;
    render(): void;
    restoreState(nextState: any): void;
    getState(): {
        isOpen: boolean;
        isMinimized: boolean;
        layoutId: string;
        layoutLabel: string;
        mode: string;
        position: {
            left: any;
            top: any;
        } | null;
        size: {
            height: number;
            width: number;
        } | null;
        targetKind: any;
    };
    destroy(): void;
} | null;
declare const api: {
    bootstrapKhmerNidaDemo: typeof bootstrapKhmerNidaDemo;
    createKhmerNidaKeyboard: typeof createKhmerNidaKeyboard;
    createMonacoInputAdapter: typeof createMonacoInputAdapter;
    createNativeTextInputAdapter: typeof createNativeTextInputAdapter;
};
export { bootstrapKhmerNidaDemo, createKhmerNidaKeyboard, createMonacoInputAdapter, createNativeTextInputAdapter, };
export default api;

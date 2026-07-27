declare function mountKhmerNiDAKeyboard({ editor, monaco, onStateChange, ownerDocument, ownerWindow, preferences, refs, }: {
    editor: any;
    monaco: any;
    onStateChange: any;
    ownerDocument: any;
    ownerWindow: any;
    preferences: any;
    refs: any;
}): {
    close(): void;
    destroy(): void;
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
    open(): void;
    toggle(): void;
};
declare const kmKhKeyboardPluginData: {
    actionLabel: string;
    create: typeof mountKhmerNiDAKeyboard;
    displayName: string;
    id: string;
};
export { kmKhKeyboardPluginData };

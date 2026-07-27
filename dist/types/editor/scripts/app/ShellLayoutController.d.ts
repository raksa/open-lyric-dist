/**
 * Owns shell presentation: visible panels, persisted widths, resize handles,
 * and editor relayout after the shell changes.
 */
declare class ShellLayoutController {
    constructor({ preferences, onOpenLyricEnableRequest, onPanelVisibilityChange, }: {
        preferences: any;
        onOpenLyricEnableRequest?: null | undefined;
        onPanelVisibilityChange?: null | undefined;
    });
    loadPreferences(): void;
    bindEvents(): void;
    isOpenLyricPanelAvailable(): boolean;
    hasSupplementalShellPanels(): boolean;
    getEffectivePanelVisibility(): {
        editorVisible: boolean;
        previewVisible: boolean;
        openLyricVisible: boolean;
    };
    getPanelDefinitions(): {
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[];
    scheduleEditorLayout(): void;
    handleViewportResize(): void;
    isStackedShellLayout(): boolean;
    getShellColumnGap(): number;
    getVisibleShellPanels(): {
        element: Element | null;
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[];
    getShellResizeMetrics(visiblePanels?: {
        element: Element | null;
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[]): {
        visiblePanels: {
            element: Element | null;
            key: string;
            label: string;
            minWidth: number;
            isVisible: () => boolean;
            getElement: () => Element | null;
        }[];
        visiblePanelCount: number;
        shellWidth: number;
        columnGap: number;
        availableWidth: number;
        minimumRequiredWidth: number;
    };
    getVisiblePanelWeights(visiblePanels?: {
        element: Element | null;
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[], sourceWeights?: {
        editor: number;
        preview: number;
        openLyric: number;
    }): any[];
    buildShellColumnsValue(visiblePanels: any, visiblePanelWeights: any): any;
    canResizeShellPanels(visiblePanels?: {
        element: Element | null;
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[]): boolean;
    applyPanelSizePreference(): void;
    getResizeHandleKey(leftPanelKey: any, rightPanelKey: any): string;
    getShellResizeHandleMap(): Map<any, Element>;
    createPanelResizeHandle(leftPanel: any, rightPanel: any): HTMLDivElement;
    getPanelPairFromHandle(handle: any, visiblePanels?: {
        element: Element | null;
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[]): {
        leftPanel: {
            element: Element | null;
            key: string;
            label: string;
            minWidth: number;
            isVisible: () => boolean;
            getElement: () => Element | null;
        };
        rightPanel: {
            element: Element | null;
            key: string;
            label: string;
            minWidth: number;
            isVisible: () => boolean;
            getElement: () => Element | null;
        };
    } | null;
    getPanelPairMetrics(leftPanel: any, rightPanel: any): {
        columnGap: number;
        currentLeftWidth: any;
        maxLeftWidth: number;
        minLeftWidth: any;
        pairWidth: any;
    };
    getPanelResizeIntent(rawLeftPanelWidth: any, minLeftWidth: any, maxLeftWidth: any): "hide-left" | "hide-right" | "resize";
    setPanelResizeHandleIntent(handle: any, intent: any, panelPair?: null): void;
    getBalancedLeftPanelWidth(leftPanel: any, rightPanel: any): any;
    updatePanelResizeHandlePosition(handle: any, leftPanel: any, rightPanel: any): void;
    updatePanelResizeHandles(): void;
    captureVisiblePanelWidths(visiblePanels?: {
        element: Element | null;
        key: string;
        label: string;
        minWidth: number;
        isVisible: () => boolean;
        getElement: () => Element | null;
    }[]): {};
    setPanelSizeWeights(nextPanelSizeWeights: any, { persist }?: {
        persist?: boolean | undefined;
    }): void;
    setPanelPairWidths(leftPanel: any, rightPanel: any, leftPanelWidth: any, rightPanelWidth: any, options: any): void;
    resetPanelPairWidths(leftPanel: any, rightPanel: any, options: any): void;
    getPanelResizeState(clientX: any, leftPanel: any, rightPanel: any): {
        nextLeftPanelWidth: any;
        pairWidth: any;
        resizeIntent: string;
    } | null;
    updatePanelPairFromPointer(clientX: any, handle: any, options: any): {
        nextLeftPanelWidth: any;
        pairWidth: any;
        resizeIntent: string;
        panelPair: {
            leftPanel: {
                element: Element | null;
                key: string;
                label: string;
                minWidth: number;
                isVisible: () => boolean;
                getElement: () => Element | null;
            };
            rightPanel: {
                element: Element | null;
                key: string;
                label: string;
                minWidth: number;
                isVisible: () => boolean;
                getElement: () => Element | null;
            };
        };
    } | null;
    commitPanelResizeHide(panelPair: any, resizeIntent: any): void;
    stopPanelResize({ persist }?: {
        persist?: boolean | undefined;
    }): void;
    handlePanelResizePointerDown(event: any): void;
    handlePanelResizePointerMove(event: any): void;
    handlePanelResizePointerUp(event: any): void;
    handlePanelResizePointerCancel(event: any): void;
    handlePanelResizeLostPointerCapture(event: any): void;
    handlePanelResizeKeydown(event: any): void;
    handlePanelResizeDoubleClick(event: any): void;
    setPanelVisible(panelKey: any, nextVisible: any): void;
    updatePanelToggleButton(button: any, isVisible: any, visibleLabel: any, hiddenLabel: any): void;
    syncTopbarMetaDisclosure(): void;
    applyPanelVisibilityPreference(value: any): void;
    updateShellPanels(): void;
    setEditorVisible(nextVisible: any): void;
    setPreviewVisible(nextVisible: any): void;
    setOpenLyricVisible(nextVisible: any): void;
    togglePreview(): void;
    toggleOpenLyric(): void;
    toggleEditor(): void;
}
export { ShellLayoutController };

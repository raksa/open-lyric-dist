declare function isChordPopupElement(element: any): boolean;
declare function showChordDiagramPopup(chordKey: any, anchorElement?: null, options?: {}): Promise<void>;
declare function showChordDiagramPopupForElement(element: any): void;
declare function showPreviewPopupForElement(element: any): void;
declare function scheduleHideChordDiagramPopup(delay?: number): void;
declare function hideChordDiagramPopup(): void;
export { hideChordDiagramPopup, isChordPopupElement, scheduleHideChordDiagramPopup, showChordDiagramPopup, showChordDiagramPopupForElement, showPreviewPopupForElement, };

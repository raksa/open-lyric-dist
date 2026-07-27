import type { OpenLyric } from '../OpenLyric.js';
export declare class OpenLyricStandaloneChrome {
    private readonly component;
    private readonly uid;
    private container;
    private renderRoot;
    private panel;
    private els;
    private fontSizePx;
    private fontFamilyOverride;
    private keyOverride;
    private actionPending;
    private defaultFontFamily;
    private progressResetTimer;
    private readonly unsubscribes;
    private readonly documentListeners;
    constructor(component: OpenLyric);
    attach(renderRoot: HTMLElement, container: HTMLElement): void;
    /**
     * Show or hide the floating controls (the settings gear + actions `⋮` menu).
     * Driven by `OpenLyric.isControlHidden`; open menus close when hidden.
     */
    setControlHidden(hidden: boolean): void;
    destroy(): void;
    private buildPanel;
    private floatingToolsMarkup;
    private captureRefs;
    /**
     * (Re)builds the font-family option panel from the component's `fontFaces`
     * — one titled group per section, plus a leading entry that clears the
     * override. Rebuilt on every open so a host that assigns `fontFaces` after
     * mount is reflected. Built with DOM calls (not markup) so face names, which
     * are host data, never reach an HTML/CSS parser as text.
     */
    private renderFontOptions;
    private createFontOption;
    private get isFontPickerOpen();
    private openFontPicker;
    private closeFontPicker;
    private toggleFontPicker;
    /** Picking an entry fills the text input — it stays the source of truth. */
    private selectFontOption;
    private syncFontOptionSelection;
    private fontOptionElements;
    /** Roving focus through the option list (keyboard only — never on touch). */
    private focusFontOption;
    private handleFontInputKeyDown;
    private handleFontOptionsKeyDown;
    private wire;
    private wireChordPopup;
    private triggerFromEvent;
    private handleChordClick;
    private handleChordPointerOver;
    private handleChordPointerOut;
    private handleChordFocusIn;
    private handleChordFocusOut;
    private toggleSettingsMenu;
    private closeSettingsMenu;
    private toggleOptionsMenu;
    private closeOptionsMenu;
    private closeMenus;
    private handleMenuFocusOut;
    private handleDocumentPointerDown;
    private handleDocumentKeyDown;
    private handleFontSizeInput;
    private handleFontFamilyInput;
    private handleKeySelect;
    private stepKey;
    private toggleDisplay;
    /**
     * Public entry point behind the host-facing `OpenLyric.resetPreviewSetting()`
     * — runs exactly what the popup's "Reset" button does.
     */
    reset(): void;
    private resetPreferences;
    private getStructureControlState;
    private renderOptions;
    private syncControls;
    /**
     * Pull the component's current typography back into the chrome's own control
     * state after a programmatic `component.fontSize`/`fontFamily` change, so the
     * settings popup reflects the API. Font size is px-based (the slider's unit);
     * a value carrying another unit clamps into the slider's range.
     */
    private adoptComponentTypography;
    private syncTypographyControls;
    private syncStructureControls;
    private syncActionAvailability;
    private setActionPending;
    private loadPersistedTypography;
    private savePersistedTypography;
    private copyText;
    private writeClipboard;
    private downloadImage;
    private buildRenderSurface;
    private getSurfaceBackground;
    private mountStage;
    private print;
    private buildPrintDocument;
    private downloadPowerPoint;
    private getPowerPointTheme;
    private getPowerPointTypography;
    private chunkLineGroups;
    private flattenChunk;
    private buildSlideDescriptors;
    private addTitleSlide;
    private addMessageSlide;
    private addLyricSlide;
    private updateProgress;
    private flashStatus;
    private clearProgressResetTimer;
    private scheduleProgressReset;
    private exportBaseName;
    private downloadHref;
    private nextFrame;
    private waitForFonts;
}

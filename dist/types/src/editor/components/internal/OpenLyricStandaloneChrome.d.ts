import type { OpenLyric } from '../OpenLyric.js';
/**
 * The typography mount of the host panel an adopt-mode preview was placed in,
 * or `null` where the host ships none (then it owns all of its chrome, as
 * before). Scoped through the nearest panel ancestor, never `document`, so a
 * page with two lyric panels never fills the wrong one.
 */
export declare function findOpenLyricTypographyMount(container: HTMLElement): HTMLElement | null;
export declare class OpenLyricStandaloneChrome {
    private readonly component;
    private readonly uid;
    private container;
    private renderRoot;
    private panel;
    /** The typography fields built into a host slot (adopt mode only). */
    private typographyRoot;
    private els;
    private fontSizePx;
    private fontFamilyOverride;
    private keyOverride;
    private actionPending;
    /**
     * The font family the host assigned before mount — the control's starting
     * VALUE, not a hidden base. A host naming a face (`preview.fontFamily = …`)
     * is making the same choice a reader makes in the popup, so the input shows
     * it and the picker marks it selected.
     *
     * The invisible base is what a language plugin contributes: that never
     * reaches `component.fontFamily`, it resolves behind it
     * ({@link OpenLyric.resolvedFontFamily}), so clearing the override here
     * falls through to it — which is what "Use preview default" means. This is
     * kept only to restore the boot state on Reset.
     */
    private hostFontFamily;
    /**
     * Whether the loaded setting carried a family at all. A persisted empty
     * string is a reader's "use the preview default" and must not be re-seeded
     * from the host's configuration; a missing one means the host's choice
     * still stands.
     */
    private hasPersistedFontFamily;
    private progressResetTimer;
    private readonly unsubscribes;
    private readonly documentListeners;
    constructor(component: OpenLyric);
    attach(renderRoot: HTMLElement, container: HTMLElement): void;
    /**
     * Adopt-mode variant: render **only** the typography fields, into a host slot.
     *
     * An app page owns the lyric panel and the settings popup inside it — the gear,
     * the Open Lyric plugin toggle, and the key/display controls are all app-wired,
     * against the app's own render state and exports — so the component must not
     * build a second panel or a second popup. What the app does not implement is
     * the font-face picker, and rather than keep a page-side copy of it, the
     * shipped panel fragment leaves a
     * `<template data-ol-mount="openLyricPreviewTypography">` inside its popup and
     * the component fills it here with the very same slider, picker, and font
     * options a standalone embed builds. A host that ships no such mount gets no
     * chrome at all, exactly as before.
     *
     * Only the typography, deliberately: everything else in that popup stays the
     * host's, which is why this wires {@link wireTypographyControls} rather than
     * the whole {@link wire}, and why Reset (an app button here) resets only what
     * this chrome owns — see {@link resetPreferences}.
     */
    attachSettingsSlot(slot: Element, renderRoot: HTMLElement): void;
    /**
     * Resolve the typography (a reader's persisted pick over the host's
     * configured default) and push it onto the component.
     *
     * Family before size: each set emits `typography-change`, and the listener
     * re-derives the override from the component — so the persisted pick has to
     * be on the component before the next emit re-reads it. Setting size first
     * made that emit see the still-default family and clear the override,
     * dropping the persisted font family on every mount.
     */
    private startTypography;
    /**
     * Show or hide the floating controls (the settings gear + actions `⋮` menu).
     * Driven by `OpenLyric.isControlHidden`; open menus close when hidden. A no-op
     * in slot mode, where the host owns every control on the panel.
     */
    setControlHidden(hidden: boolean): void;
    destroy(): void;
    private buildPanel;
    private floatingToolsMarkup;
    /**
     * The typography half of the settings popup — the font-size slider and the
     * font-family picker. Split out of the panel markup because it is the one
     * piece an adopt-mode embed also renders, into the host popup's typography
     * mount (see {@link attachSettingsSlot}); the caller supplies whatever wrapper
     * belongs around it.
     */
    private typographyFieldsMarkup;
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
    private on;
    private wire;
    /**
     * The typography controls' own wiring — everything both the standalone popup
     * and an adopt-mode typography slot need, and nothing that belongs to the
     * actions menu, the song-display controls, or the export progress bar.
     */
    private wireTypographyControls;
    /**
     * Close-on-outside-click and Escape. Both modes need them: in slot mode the
     * app's own document handlers close the app-owned menus and these close the
     * font picker, so the two still behave as one set of menus.
     */
    private wireDocumentListeners;
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
    /**
     * The setting this chrome starts from, read through the component's public
     * `loadSetting()` so a host can redirect the storage by overriding it. A
     * `null` return (nothing saved, or storage unavailable) leaves the defaults
     * this class was constructed with; the size clamps into the slider's range,
     * since a stored value can predate today's bounds.
     */
    private loadPersistedTypography;
    /** The write side of the same port — see {@link OpenLyric.saveSetting}. */
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
    /**
     * Slide colours per theme, as bare PowerPoint hex (no `#`).
     *
     * A deck carries no stylesheet, so the palette has to be baked in — one
     * entry per theme rather than a light/dark split, since the `-bs` pair
     * differs from its sibling in exactly these values.
     */
    private getPowerPointTheme;
    private getPowerPointTypography;
    private chunkLineGroups;
    private flattenChunk;
    private buildSlideDescriptors;
    /**
     * A picture of each section exactly as the preview draws it — the same
     * rasterizer behind Download as Image, one PNG per part. Walked in structure
     * order rather than over the map, so a part that comes round again in the
     * flow gets its slide again: the map holds one entry per unique part, the
     * deck follows the song.
     */
    private buildSlideImages;
    private addImageSlide;
    private addTitleSlide;
    private addMessageSlide;
    private addLyricSlide;
    private updateProgress;
    private flashStatus;
    private clearProgressResetTimer;
    private scheduleProgressReset;
    private exportBaseName;
    private downloadHref;
    private downloadBlob;
    private nextFrame;
    private waitForFonts;
}

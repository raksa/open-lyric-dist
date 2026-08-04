import type { OpenLyricMarkdownManager } from '../OpenLyricMarkdownManager.js';
/**
 * The settings mount of the host panel an adopt-mode preview was placed in, or
 * `null` where the host ships none (then it owns all of its chrome, as before).
 * Scoped through the nearest panel ancestor, never `document`, so a page with
 * two markdown panels never fills the wrong one.
 */
export declare function findMarkdownSettingsMount(container: HTMLElement): HTMLElement | null;
export declare class OpenLyricMarkdownStandaloneChrome {
    private readonly component;
    private readonly uid;
    private container;
    private renderRoot;
    private panel;
    /** The settings block built into a host slot (adopt mode only). */
    private settingsRoot;
    private els;
    private fontSizePx;
    private fontFamilyOverride;
    /**
     * The font family the host assigned before mount — the control's starting
     * VALUE, not a hidden base; see the same field on
     * {@link OpenLyricStandaloneChrome}. The invisible base is a language
     * plugin's contribution, which resolves behind `component.fontFamily`
     * ({@link OpenLyricMarkdownManager.resolvedFontFamily}). Kept to restore the
     * boot state on Reset.
     */
    private hostFontFamily;
    /**
     * Whether the loaded setting carried a family at all — a persisted empty
     * string is the reader's "use the preview default" and must not be
     * re-seeded from the host's configuration.
     */
    private hasPersistedFontFamily;
    private actionPending;
    private progressResetTimer;
    private readonly unsubscribes;
    private readonly documentListeners;
    constructor(component: OpenLyricMarkdownManager);
    attach(renderRoot: HTMLElement, container: HTMLElement): void;
    /**
     * Adopt-mode variant: render **only** the settings popup, into a host slot.
     *
     * An app page owns the markdown panel itself — its `⋮` actions, export
     * progress bar, and chord popover are all app-wired — so the component must
     * not build a second panel around the preview it adopted. What the app does
     * not implement is this popup, and rather than keep a duplicate of it in the
     * page markup, the shipped panel fragment leaves a
     * `<template data-ol-mount="markdownPreviewSettings">` where it belongs and
     * the component fills it here with the very same gear, slider, font picker,
     * and Reset a standalone embed builds (see
     * `OpenLyricMarkdownManager.installShellMarkup()`). A host that ships no such
     * mount gets no chrome at all, exactly as before.
     */
    attachSettingsSlot(slot: Element, renderRoot: HTMLElement): void;
    /**
     * Resolve the typography (persisted over the host's configured default) and
     * push it onto the component, then mirror it into the controls.
     *
     * Family before size: each set emits `typography-change`, and the listener
     * re-derives the override from the component — so the persisted pick has to
     * be on the component before the next emit re-reads it.
     */
    private startTypography;
    /**
     * Show or hide the floating controls (the settings gear + the actions `⋮`
     * menu; only the gear in slot mode). Driven by
     * `OpenLyricMarkdownManager.isControlHidden`; open menus close with them.
     */
    setControlHidden(hidden: boolean): void;
    destroy(): void;
    private buildPanel;
    private floatingToolsMarkup;
    /**
     * The settings popup — the gear and its dialog. Split out of the panel
     * markup because it is the one piece an adopt-mode embed also renders, into
     * the host panel's settings mount (see {@link attachSettingsSlot}); the
     * caller supplies the `.topbar-settings` wrapper around it.
     */
    private settingsMarkup;
    /**
     * Resolve every chrome role inside `panel` — **or on `panel` itself**. Slot
     * mode passes the `.topbar-settings` wrapper here, and that wrapper carries
     * `data-role="settings"`: a descendant-only lookup would leave `els.settings`
     * null, and then `handleDocumentPointerDown` would treat clicks on the
     * slider, the font input, and Reset as outside clicks and close the popup on
     * the first press.
     */
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
     * The settings popup's own wiring — everything both the standalone panel and
     * an adopt-mode settings slot need, and nothing that belongs to the actions
     * menu or the export progress bar.
     */
    private wireSettings;
    /**
     * Close-on-outside-click and Escape. Both modes need them: in slot mode the
     * app's own document handlers close the app-owned menus and these close the
     * settings popup, so the two still behave as one set of menus.
     */
    private wireDocumentListeners;
    /**
     * Delegate the chord popover off the render root, so every re-render keeps
     * working without rebinding. Same event set the app page binds onto its
     * markdown surface, and the same one `OpenLyricStandaloneChrome` binds onto
     * the lyric surface — `click` included, since a touch device never hovers.
     */
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
    /**
     * Public entry point behind the host-facing
     * `OpenLyricMarkdownManager.resetPreviewSetting()` — runs exactly what the
     * popup's "Reset" button does.
     */
    reset(): void;
    private resetPreferences;
    /**
     * Pull the component's current typography back into the chrome's own control
     * state after a programmatic `component.fontSize`/`fontFamily` change, so the
     * settings popup reflects the API. Font size is px-based (the slider's unit);
     * a value carrying another unit clamps into the slider's range.
     */
    private adoptComponentTypography;
    private syncTypographyControls;
    private loadPersistedTypography;
    private savePersistedTypography;
    /** Whether the preview currently has anything to export. */
    private hasContent;
    private syncActionAvailability;
    private setActionPending;
    private openMarkdownDoc;
    private downloadImage;
    /**
     * An off-screen copy of the rendered markdown carrying the live root's
     * resolved typography, background, and full width — what the raster captures.
     */
    private buildRenderSurface;
    private getSurfaceBackground;
    private mountStage;
    private print;
    /**
     * The print document. Always light-themed regardless of the preview's own
     * theme — the app page prints the same way, so a dark preview never burns
     * ink — and self-contained apart from the app's font / theme / preview
     * stylesheets, which carry the Khmer faces and the `.ol-preview-*` fence
     * cards a markdown document may embed.
     */
    private buildPrintDocument;
    private updateProgress;
    private flashStatus;
    private clearProgressResetTimer;
    private scheduleProgressReset;
    /** The document's filename-safe base name (`getInfo().exportBaseName`). */
    private exportBaseName;
    private downloadHref;
    private nextFrame;
    private waitForFonts;
}

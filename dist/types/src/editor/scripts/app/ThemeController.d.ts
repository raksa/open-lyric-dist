/**
 * Keeps theme state and UI synchronized while exposing a small surface to the
 * composition root.
 *
 * Four themes, not two: `light`/`dark` plus the `light-bs`/`dark-bs` pair
 * painted in Bootstrap's palette. Two attributes carry that on `<html>` —
 * `data-theme` holds the full name (what the stylesheets scope on) and
 * `data-bs-theme` only ever holds the light/dark base, because that is all
 * Bootstrap's own stylesheet understands.
 */
declare class ThemeController {
    constructor({ monaco, preferences, onThemeApplied }: {
        monaco: any;
        preferences: any;
        onThemeApplied?: null | undefined;
    });
    setMonaco(monaco: any): void;
    ensureEditorThemesRegistered(): void;
    getEditorTheme(theme?: string): any;
    getSystemThemeMediaQuery(): any;
    getSystemThemePreference(): any;
    bindSystemThemeListener(): void;
    handleSystemThemeChange(): void;
    applyPreferredTheme(): void;
    bindEvents(): void;
    /** The picker's option buttons, in markup order. */
    getThemeMenuOptions(): Element[];
    isThemeMenuOpen(): boolean;
    toggleThemeMenu(): void;
    openThemeMenu(): void;
    closeThemeMenu({ restoreFocus }?: {
        restoreFocus?: boolean | undefined;
    }): void;
    handleDocumentPointerDown(event: any): void;
    handleDocumentKeydown(event: any): void;
    applyTheme(theme: any, { notifyThemeApplied }?: {
        notifyThemeApplied?: boolean | undefined;
    }): void;
    setTheme(theme: any): void;
    /** Advance to the next theme in `OPEN_LYRIC_THEMES`, wrapping around. */
    toggleTheme(): void;
}
export { ThemeController };

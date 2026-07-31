/**
 * Keeps theme state and UI synchronized while exposing a small surface to the
 * composition root.
 */
declare class ThemeController {
    constructor({ monaco, preferences, onThemeApplied }: {
        monaco: any;
        preferences: any;
        onThemeApplied?: null | undefined;
    });
    setMonaco(monaco: any): void;
    ensureEditorThemesRegistered(): void;
    getEditorTheme(theme?: string): "open-lyric-light" | "open-lyric-dark";
    getSystemThemeMediaQuery(): any;
    getSystemThemePreference(): any;
    bindSystemThemeListener(): void;
    handleSystemThemeChange(): void;
    applyPreferredTheme(): void;
    bindEvents(): void;
    applyTheme(theme: any, { notifyThemeApplied }?: {
        notifyThemeApplied?: boolean | undefined;
    }): void;
    setTheme(theme: any): void;
    toggleTheme(): void;
}
export { ThemeController };

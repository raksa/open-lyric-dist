declare const EDITOR_ONLY_SHELL_MODE = "editor-only";
declare const FULL_EDITOR_SHELL_MODE = "full";
declare function getEditorShellMode(): "editor-only" | "full";
declare function shouldRegisterBuiltInOpenLyricPlugin(): boolean;
declare function getDefaultPanelVisibilityForCurrentPage(): {
    editorVisible: boolean;
    previewVisible: boolean;
    openLyricVisible: boolean;
};
export { EDITOR_ONLY_SHELL_MODE, FULL_EDITOR_SHELL_MODE, getDefaultPanelVisibilityForCurrentPage, getEditorShellMode, shouldRegisterBuiltInOpenLyricPlugin, };

/**
 * `open-lyric` component layer — the framework-free, embeddable API described
 * in `research/editor-structure-implemented.md`.
 *
 * All four components are exported: the two standalone previews, the
 * standalone editor, and the dashboard shell (wrap phase — it drives the
 * existing application through the component contract; the page entries
 * `editor/main-open-lyric.ts` and `editor/main-editor.ts` are its canonical
 * consumers, so the live app is the integration example).
 */
export { OpenLyric } from './OpenLyric.js';
export type { OpenLyricElementMapOptions, OpenLyricImageOptions, OpenLyricInfo, OpenLyricOptions, OpenLyricSectionInfo, OpenLyricValueOptions, } from './OpenLyric.js';
export { OpenLyricMarkdownManager } from './OpenLyricMarkdownManager.js';
export type { OpenLyricMarkdownInfo, OpenLyricMarkdownOptions, } from './OpenLyricMarkdownManager.js';
export { Editor } from './Editor.js';
export type { EditorOptions, EditorSharedSurfaceBridge } from './Editor.js';
export { getActiveOpenLyricDashboard, OpenLyricDashboard, } from './OpenLyricDashboard.js';
export type { OpenLyricDashboardDraft, OpenLyricDashboardDraftContext, OpenLyricDashboardLoadValue, OpenLyricDashboardOnValueChange, OpenLyricDashboardOptions, OpenLyricDashboardSaveValue, } from './OpenLyricDashboard.js';
export { OpenLyricComponent } from './internal/OpenLyricComponent.js';
export { OpenLyricPreviewComponent } from './internal/OpenLyricPreviewComponent.js';
export { OPEN_LYRIC_PLUGIN_API_VERSION } from './internal/types.js';
export type { OpenLyricChangeListener, OpenLyricChangePayload, OpenLyricComponentHost, OpenLyricDisplayChangePayload, OpenLyricComponentOptions, OpenLyricContributions, OpenLyricEditorLike, OpenLyricEventHandler, OpenLyricEventMap, OpenLyricEventName, OpenLyricFontFaceList, OpenLyricFontFaceSection, OpenLyricKeyboardContributionSpec, OpenLyricLanguageContribution, OpenLyricLifecycleState, OpenLyricPartDblclickPayload, OpenLyricPlugin, OpenLyricPluginChangePayload, OpenLyricPreviewOptions, OpenLyricPreviewSetting, OpenLyricRenderContext, OpenLyricRendererContribution, OpenLyricRendererTargetSpec, OpenLyricSavePayload, OpenLyricSpellcheckContributionSpec, OpenLyricStyleContribution, OpenLyricSurface, OpenLyricTheme, OpenLyricThemeChangePayload, OpenLyricTypographyChangePayload, Unsubscribe, } from './internal/types.js';
export { OPEN_LYRIC_THEME_PRESETS } from './internal/theme.js';
export type { OpenLyricThemePreset } from './internal/theme.js';

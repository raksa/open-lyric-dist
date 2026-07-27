declare const OPEN_LYRIC_PLUGIN_ENABLED_STORAGE_KEY = "open-lyric-editor-plugin-open-lyric";
declare function normalizeOpenLyricPluginEnabledPreference(value: any): boolean;
declare function loadOpenLyricPluginEnabledPreference(storage?: any): boolean;
declare function saveOpenLyricPluginEnabledPreference(enabled: any, storage?: any): void;
export { OPEN_LYRIC_PLUGIN_ENABLED_STORAGE_KEY, loadOpenLyricPluginEnabledPreference, normalizeOpenLyricPluginEnabledPreference, saveOpenLyricPluginEnabledPreference, };

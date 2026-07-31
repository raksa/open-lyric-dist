/**
 * `open-lyric` — the public entry point.
 *
 * Deliberately a re-export of the in-repo barrel rather than a copy: the
 * component layer described in `research/editor-structure-implemented.md`
 * (§"Exposed components") IS the package surface, so the app pages and the
 * published package can never drift.
 */
export * from '../../../src/editor/components/index.js';
export { EditorOpenLyricPlugin } from '../../../src/plugins/OpenLyric/open-lyric_component_plugin.js';
export { olEditorOpenLyricPluginData } from '../../../src/plugins/OpenLyric/index.js';
export { registerPlugin, unregisterPlugin, } from '../../../src/editor/scripts/editor-plugin-registry.js';
export { EditorPreferencesStore } from '../../../src/editor/scripts/app/EditorPreferencesStore.js';
export { initializePageTheme, preparePageEnvironment, } from '../../../src/editor/scripts/page-environment.js';

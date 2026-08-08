/**
 * `open-lyric` — the public entry point.
 *
 * Deliberately a re-export of the in-repo barrel rather than a copy: the
 * component layer described in `research/editor-structure-implemented.md`
 * (§"Exposed components") IS the package surface, so the app pages and the
 * published package can never drift.
 */
export * from '../../../src/editor/components/index.js';
export { version } from './version.js';
export { EditorOpenLyricPlugin } from '../../../src/plugins/OpenLyric/open-lyric_component_plugin.js';
export { olEditorOpenLyricPluginData } from '../../../src/plugins/OpenLyric/index.js';
export { BETWEEN_THE_VERSES_EXAMPLE, BILINGUAL_MERCY_RESPONSE_EXAMPLE, COMMENTED_DRAFT_TEMPLATE_EXAMPLE, EXTENDED_WORSHIP_BUILD_EXAMPLE, FIRE_ON_THE_ALTAR_EXAMPLE, HIGHER_THAN_THE_MORNING_EXAMPLE, LEAD_LINE_OFFERING_EXAMPLE, MARCH_OF_GRACE_EXAMPLE, MARKDOWN_DECORATION_DEMO_EXAMPLE, QUIET_RIVER_AT_DAWN_EXAMPLE, REFRAIN_AND_TAG_LIFT_EXAMPLE, TWELVE_EIGHT_LANTERNS_EXAMPLE, } from '../../../src/plugins/OpenLyric/examples/index.js';
export { registerPlugin, unregisterPlugin, } from '../../../src/editor/scripts/editor-plugin-registry.js';
export { EditorPreferencesStore } from '../../../src/editor/scripts/app/EditorPreferencesStore.js';
export { initializePageTheme, preparePageEnvironment, } from '../../../src/editor/scripts/page-environment.js';

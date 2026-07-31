/**
 * `open-lyric/internal` — **not** a public API.
 *
 * First-party plugin packages bundle their own heavy data
 * (dictionaries, workers, keyboard, fonts, stylesheets) but still share the
 * core's *stateful* modules through this subpath instead of duplicating
 * them. That is a correctness requirement, not an optimization: `shared.ts`
 * (`refs`/`state`), `markup-fragments.ts` (the id counter behind
 * `linkFragmentIds`), and the plugin registry's registration flow hold
 * page-level state a second copy would fork.
 *
 * Everything here maps to an entry in the plugin packages'
 * `shareModulesWithCorePackage` configs (`packages/<name>/vite.config.ts`).
 * This subpath disappears once `editor/scripts/shared.ts` is de-globalized
 * and the plugin packages can stand on a stateless core API.
 */
export { refreshElementRefs, setStatus, updateStatus, } from '../../../src/editor/scripts/shared.js';
export { createHtmlFragment, linkFragmentIds, queryRef, } from '../../../src/editor/html/markup-fragments.js';
export { EditorPreferencesStore } from '../../../src/editor/scripts/app/EditorPreferencesStore.js';
export { getRegisteredKeyboardSpecifications, getRegisteredSpellcheckSpecification, getRegisteredTranscriptLocales, getRegisteredTranscriptSpecifications, registerPlugin, unregisterPlugin, } from '../../../src/editor/scripts/editor-plugin-registry.js';
export { EDITOR_ONLY_SHELL_MODE } from '../../../src/editor/scripts/page-config.js';
export { createDictionarySnapshot, getDictionaryConfig, getDictionaryPrefixSuggestions, getSuggestionDictionaryConfigs, hasAnyWordBaseCharacter, loadDictionary, normalizeWord, } from '../../../src/editor/scripts/spellcheck-common.js';
export { postProcessTranscriptText } from '../../../src/editor/scripts/spellcheck.js';

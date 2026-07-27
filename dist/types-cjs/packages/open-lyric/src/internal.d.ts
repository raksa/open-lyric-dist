/**
 * `open-lyric/internal` — **not** a public API.
 *
 * The wrap-phase reality documented in
 * `research/editor-structure-implemented.md` is that the component barrel
 * transitively contains the whole application, km-KH and the transcript
 * plugin included (`OpenLyricDashboard` → `OpenLyricEditorApplication` →
 * `plugins/default-plugins.ts`). So the two first-party plugin packages are
 * thin wrappers: everything they need at runtime already lives in this
 * bundle, and they import it from here instead of shipping a second copy.
 *
 * That is a correctness requirement, not an optimization. `shared.ts`
 * (`refs`/`state`) and `markup-fragments.ts` (the id counter behind
 * `linkFragmentIds`) are module-global; duplicating them would give the
 * plugins a different `refs` object than the core reads.
 *
 * This subpath disappears once `editor/scripts/shared.ts` is de-globalized
 * and the plugin packages can own their sources outright.
 */
export { refreshElementRefs } from '../../../editor/scripts/shared.js';
export { createHtmlFragment, queryRef, } from '../../../editor/html/markup-fragments.js';
export { EditorPreferencesStore } from '../../../editor/scripts/app/EditorPreferencesStore.js';
export { olEditorPluginData } from '../../../editor/plugins/km_KH/km_KH_ol_editor.js';
export { olEditorTranscriptPluginData } from '../../../editor/plugins/transcript/transcript_ol_editor.js';
declare const kmKhKeyboardCssUrl: string;
declare const transcriptCssUrl: string;
export { kmKhKeyboardCssUrl, transcriptCssUrl };

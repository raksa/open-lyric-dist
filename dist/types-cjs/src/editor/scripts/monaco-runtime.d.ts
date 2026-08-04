/**
 * Monaco 0.56 replaced the ad-hoc `monaco-editor/esm/vs/**` deep paths with a
 * real `exports` map: `monaco-editor/*` now maps to `esm/vs/*.js`, so the old
 * specifiers resolve to `esm/vs/esm/vs/...` and fail to resolve at all. Every
 * Monaco import in this repo therefore drops the `esm/vs/` segment.
 *
 * Two entries were renamed outright in that reorganization:
 * `editor/editor.all.js` → `features/register.all` (all editor features), and
 * `basic-languages/<lang>/<lang>.contribution.js` →
 * `languages/definitions/<lang>/register`.
 *
 * Monaco's own stylesheet is no longer imported here: `min/vs/editor/editor.main.css`
 * is unreachable through the new `exports` map, and the ESM tree imports the
 * `.css` it needs module by module, so the bundler picks it up either way.
 */
import 'monaco-editor/features/register.all';
import 'monaco-editor/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
import 'monaco-editor/languages/definitions/markdown/register';
import { attachMobileSpellcheckMarkerHoverSelection } from './monaco-marker-hover-segmentation.js';
import * as monaco from 'monaco-editor/editor/editor.api';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
export { EditorWorker, attachMobileSpellcheckMarkerHoverSelection, monaco };

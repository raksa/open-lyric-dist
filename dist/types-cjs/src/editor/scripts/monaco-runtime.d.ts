import 'monaco-editor/min/vs/editor/editor.main.css';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js';
import 'monaco-editor/esm/vs/basic-languages/markdown/markdown.contribution.js';
import { attachMobileSpellcheckMarkerHoverSelection } from './monaco-marker-hover-segmentation.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
export { EditorWorker, attachMobileSpellcheckMarkerHoverSelection, monaco };

import type { OpenLyricTheme } from './types.js';
/**
 * Self-contained Monaco boot for the standalone `Editor`.
 *
 * It reuses the same lazy runtime chunk the app uses (`monaco-runtime.ts`,
 * cached as an ES module) but wires nothing into the global app: no
 * `state.editor`, no `refs`. Language + theme registration is globally
 * idempotent, so any number of standalone editors share one registration.
 */
import type * as MonacoRuntimeNamespace from '../../scripts/monaco-runtime.js';
type MonacoRuntimeModule = typeof MonacoRuntimeNamespace;
export type MonacoNamespace = MonacoRuntimeModule['monaco'];
/** Loader for the Monaco runtime chunk; injectable for tests / embeds. */
export type LoadMonacoResources = () => Promise<Partial<MonacoRuntimeModule>> | Partial<MonacoRuntimeModule>;
export declare const defaultLoadMonacoResources: LoadMonacoResources;
/** Map a component theme to its registered Monaco theme name. */
export declare function getEditorThemeName(theme: OpenLyricTheme): string;
/**
 * Load Monaco, configure its web worker once, and register the Open Lyric
 * language + themes (idempotent). Returns the Monaco namespace.
 */
export declare function loadOpenLyricMonaco(loadResources: LoadMonacoResources): Promise<MonacoNamespace>;
export {};

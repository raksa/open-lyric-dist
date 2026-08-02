/**
 * The persistence behind `OpenLyric.loadSetting()` / `OpenLyric.saveSetting()`
 * — the preview setting a standalone embed remembers between visits.
 *
 * One browser-storage record for every standalone `OpenLyric` on the page (the
 * settings popup is a per-page preference, not a per-song one), kept in the
 * shape the public API speaks: `{ fontFamily, fontSize }`, with `fontSize` in
 * pixels. Records written by earlier versions carried the size under
 * `fontSizePx`, so reads still accept that name.
 *
 * Every entry point is best-effort: storage can be missing (SSR, a locked-down
 * browser), full, or hold something that is not the record we wrote. None of
 * that is worth failing a render over, so a bad read is simply "nothing
 * persisted" and a bad write is dropped.
 *
 * Adopt-mode previews never come through here — an app page owns its own
 * preferences store (`EditorPreferencesStore`), and two writers on one surface
 * would fight.
 */
import type { OpenLyricPreviewSetting } from './types.js';
export declare const OPEN_LYRIC_PREVIEW_SETTING_STORAGE_KEY = "openLyricStandalone.previewTypography";
/**
 * The persisted setting, or `null` when nothing usable is stored — the caller
 * then keeps its own defaults. Only keys that survive validation are present,
 * so a record holding just a family reads back as just a family.
 */
export declare function readPreviewSetting(): OpenLyricPreviewSetting | null;
/**
 * Merge `next` over what is already stored and write the result back, so a
 * partial save (`{ fontSize: 20 }`) never drops the other key. Returns the
 * merged record the caller can keep, even when the write itself failed.
 */
export declare function writePreviewSetting(next: OpenLyricPreviewSetting | null | undefined): OpenLyricPreviewSetting;

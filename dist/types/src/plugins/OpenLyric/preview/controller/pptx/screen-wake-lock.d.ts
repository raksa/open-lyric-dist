/**
 * Keep the screen on while slides are presented: a `screen` wake lock
 * (`navigator.wakeLock`), held from {@link OpenLyricScreenWakeLock.hold} to
 * {@link OpenLyricScreenWakeLock.release}. The browser drops the lock when
 * the page is hidden (another tab, a minimised window); it is taken again
 * when the page is shown while still wanted. Where there is no Wake Lock API,
 * or the page may not use it (an embed without the permission, a page that is
 * not a secure context), holding does nothing and the display sleeps as set.
 *
 * The HTML slide show page keeps its own copy of this logic inside its
 * self-contained runtime (`html-slideshow-runtime.ts`).
 */
interface OpenLyricScreenWakeLock {
    /** Want the screen kept on; resolves once the lock is held or refused. */
    hold(): Promise<void>;
    /** Let the screen sleep again. */
    release(): void;
    readonly isHeld: boolean;
    /** Release, and stop listening to the page. */
    destroy(): void;
}
declare function createOpenLyricScreenWakeLock(doc?: Document): OpenLyricScreenWakeLock;
export { createOpenLyricScreenWakeLock };
export type { OpenLyricScreenWakeLock };

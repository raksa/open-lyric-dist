import type { OpenLyricEventHandler, OpenLyricEventMap, OpenLyricEventName, Unsubscribe } from './types.js';
/**
 * A tiny, dependency-free typed event bus. One instance is owned by each
 * component (composition, not inheritance) and backs the public `on()` API.
 *
 * - `on()` returns an unsubscribe function (the redesign's unified contract).
 * - `emit()` never lets one bad listener break the others.
 * - `clear()` drops every listener; components call it during `destroy()`.
 */
export declare class OpenLyricEventEmitter {
    private readonly handlers;
    on<E extends OpenLyricEventName>(event: E, handler: OpenLyricEventHandler<E>): Unsubscribe;
    off<E extends OpenLyricEventName>(event: E, handler: OpenLyricEventHandler<E>): void;
    emit<E extends OpenLyricEventName>(event: E, payload: OpenLyricEventMap[E]): void;
    clear(): void;
}

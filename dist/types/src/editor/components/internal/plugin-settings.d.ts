import type { OpenLyricComponentHost } from './types.js';
/**
 * The marker a plugin puts on every element it adds to a live preview (a play
 * button, a badge). The standalone chromes' image and print exports copy the
 * live markup, and drop whatever carries it — see {@link readExportMarkup}.
 */
export declare const PLUGIN_UI_ATTRIBUTE = "data-ol-plugin-ui";
/**
 * The live render root's markup for an export, without the elements plugins
 * added to it. Returns the markup untouched (and uncloned) when there are none.
 */
export declare function readExportMarkup(root: HTMLElement | null | undefined): string;
/** The component view the settings fields need: its plugins' contributions. */
interface SettingsContributionHost extends OpenLyricComponentHost {
    pluginContributions<T = unknown>(kind: string): T[];
}
/**
 * The fields attached plugins contribute to a preview's settings popup
 * (`contributes.settings`), placed before `anchor` — the popup's Reset row —
 * or, in a popup without one, at the end of `fallbackParent`.
 *
 * Re-rendered whenever a plugin is added or removed, so the popup always lists
 * exactly what the current composition contributes. With no such plugin it
 * adds nothing, and the popup is exactly the built-in one.
 */
export declare class PluginSettingsFields {
    private readonly component;
    private anchor;
    private fallbackParent;
    private fields;
    private offPluginChange;
    constructor(component: SettingsContributionHost, anchor: Element | null, fallbackParent?: Element | null);
    render(): void;
    /** The popup's Reset: every contributed field back to its default. */
    reset(): void;
    destroy(): void;
    private placement;
    private contributions;
    private clear;
}
export {};

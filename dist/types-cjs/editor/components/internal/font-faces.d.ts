import type { OpenLyricFontFaceList, OpenLyricFontFaceSection } from './types.js';
/**
 * Normalizes whatever a host assigned to `fontFaces` into the sectioned shape
 * the font-family picker renders.
 *
 * Hosts may hand over a flat list (`['Arial', 'Georgia']`), titled sections
 * (`[{ title: 'Khmer Font', fontFaces: [...] }]`), or a mix. Bare strings
 * collapse into a single untitled section that keeps its position ahead of the
 * first titled one, so a flat list stays one plain group of entries. Blank
 * names and duplicates (across the whole list, first occurrence wins) are
 * dropped, and sections left with no entries disappear.
 */
export declare function normalizeFontFaceSections(list: OpenLyricFontFaceList | null | undefined): OpenLyricFontFaceSection[];

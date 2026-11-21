/**
 * The Open Lyric PowerPoint deck's text slides — title, lyric and message
 * slides built from the song's presentation data
 * (`createOpenLyricPresentationData`), with no page, preview or canvas behind
 * them.
 *
 * The preview controller's PowerPoint export
 * (`../export-powerpoint.ts`) delegates its text-slide methods here, and a host
 * with no live preview — the `open-lyric-mcp` server rendering in Node — builds
 * the whole deck through {@link buildOpenLyricTextPresentation}. The picture
 * slides (one rasterized section per slide) stay in the controller: they need
 * a rendered preview to photograph.
 */
import { type PptxPresentation } from './presentation.js';
interface OpenLyricPowerPointTheme {
    accent: string;
    background: string;
    body: string;
    muted: string;
    surface: string;
    surfaceBorder: string;
    title: string;
}
interface OpenLyricPowerPointTypography {
    chromeFontFace: string;
    lyricFontFace: string;
    lyricFontSize: number;
}
type OpenLyricPowerPointThemeName = 'light' | 'dark';
interface OpenLyricPowerPointSectionData {
    partName?: string;
    repeatText?: string;
    heading?: string;
    lineGroups?: string[][];
}
interface OpenLyricPowerPointPresentationData {
    title?: string;
    secondaryText?: string;
    metaLine?: string;
    sections?: OpenLyricPowerPointSectionData[];
}
interface OpenLyricPowerPointSlideDescriptor {
    chunkIndex: number;
    lines: string[];
    sectionData: OpenLyricPowerPointSectionData;
    totalChunks: number;
}
/** The deck's palettes, keyed by the preview theme they follow. */
declare const OPEN_LYRIC_POWERPOINT_THEMES: Readonly<Record<OpenLyricPowerPointThemeName, Readonly<OpenLyricPowerPointTheme>>>;
declare function getOpenLyricPowerPointTheme(themeName: OpenLyricPowerPointThemeName): OpenLyricPowerPointTheme;
/** Inner padding in points, in the `[left, right, bottom, top]` order the writer takes. */
declare function getOpenLyricPowerPointTextBoxMargin({ left, right, top, bottom, }?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}): number[];
declare function chunkOpenLyricPowerPointLineGroups(lineGroups: unknown, maxLinesPerSlide?: number): string[][][];
declare function flattenOpenLyricPowerPointChunk(chunk: unknown): string[];
declare function buildOpenLyricPowerPointSlideTitle(sectionData: OpenLyricPowerPointSectionData | null | undefined, chunkIndex: number, totalChunks: number): string;
declare function addOpenLyricPowerPointTitleSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, presentationData: OpenLyricPowerPointPresentationData, typography: OpenLyricPowerPointTypography): void;
declare function addOpenLyricPowerPointMessageSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, presentationData: OpenLyricPowerPointPresentationData, typography: OpenLyricPowerPointTypography, { title, message, slideNumber, totalSlides, }: {
    title: string;
    message: string;
    slideNumber: number;
    totalSlides: number;
}): void;
declare function addOpenLyricPowerPointLyricSlide(pptx: PptxPresentation, theme: OpenLyricPowerPointTheme, presentationData: OpenLyricPowerPointPresentationData, typography: OpenLyricPowerPointTypography, { sectionData, chunkIndex, lines, slideNumber, totalSlides, totalChunks, }: OpenLyricPowerPointSlideDescriptor & {
    slideNumber: number;
    totalSlides: number;
}): void;
declare function buildOpenLyricPowerPointSlideDescriptors(presentationData: OpenLyricPowerPointPresentationData | null | undefined): OpenLyricPowerPointSlideDescriptor[];
/**
 * The whole deck as text slides: a title slide, then one lyric slide per
 * chunk of each section in structure order — or a single message slide when
 * the song has no sections to show. The same slides the preview's PowerPoint
 * export falls back to when it cannot rasterize the preview.
 */
declare function buildOpenLyricTextPresentation(presentationData: OpenLyricPowerPointPresentationData, { theme, typography, }?: {
    theme?: OpenLyricPowerPointTheme;
    typography?: OpenLyricPowerPointTypography;
}): PptxPresentation;
export { addOpenLyricPowerPointLyricSlide, addOpenLyricPowerPointMessageSlide, addOpenLyricPowerPointTitleSlide, buildOpenLyricPowerPointSlideDescriptors, buildOpenLyricPowerPointSlideTitle, buildOpenLyricTextPresentation, chunkOpenLyricPowerPointLineGroups, flattenOpenLyricPowerPointChunk, getOpenLyricPowerPointTextBoxMargin, getOpenLyricPowerPointTheme, OPEN_LYRIC_POWERPOINT_THEMES, };
export type { OpenLyricPowerPointPresentationData, OpenLyricPowerPointSectionData, OpenLyricPowerPointSlideDescriptor, OpenLyricPowerPointTheme, OpenLyricPowerPointThemeName, OpenLyricPowerPointTypography, };

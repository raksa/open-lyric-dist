declare const OPEN_LYRIC_EDITOR_INFO: Readonly<{
    name: "Open Lyric";
    version: "0.1.9-dev";
}>;
declare function getEditorDisplayName(): "" | "Open Lyric";
declare function getCurrentBrowserLocationUrl(): string;
declare function formatEditorVersion(version?: "0.1.9-dev"): string;
declare function getEditorSignature(): string;
declare function getEditorVersionBadgeText(): string;
declare function getEditorMetadataTitle(): string;
export { OPEN_LYRIC_EDITOR_INFO, formatEditorVersion, getCurrentBrowserLocationUrl, getEditorDisplayName, getEditorMetadataTitle, getEditorSignature, getEditorVersionBadgeText, };

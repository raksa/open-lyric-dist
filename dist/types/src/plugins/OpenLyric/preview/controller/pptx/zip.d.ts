/**
 * The smallest ZIP writer a `.pptx` needs.
 *
 * An Office Open XML package is a plain ZIP archive, so writing one takes a
 * local header per entry, one central-directory record per entry, and an
 * end-of-central-directory record — no data descriptors (every size is known
 * before the entry is written), no Zip64 (a song deck is far under 4GB), and
 * no directory entries (PowerPoint reads the paths out of the names).
 *
 * Compression is raw DEFLATE through the platform's `CompressionStream`, which
 * every browser this app supports has. Where it is missing — jsdom, an older
 * WebView — entries are stored uncompressed instead: a bigger file, still a
 * valid one, which is the right trade for an export that must not fail.
 */
interface ZipSource {
    name: string;
    data: Uint8Array | string;
}
declare function crc32(bytes: Uint8Array): number;
/**
 * Pack `entries` into a ZIP archive. `isCompressed` asks for DEFLATE; entries
 * that do not shrink (an already-compressed PNG) are stored either way, since
 * a deflate stream longer than its input is only a bigger file.
 */
declare function createZipBlob(entries: ZipSource[], { isCompressed, mimeType, }?: {
    isCompressed?: boolean;
    mimeType?: string;
}): Promise<Blob>;
export { createZipBlob, crc32 };
export type { ZipSource };

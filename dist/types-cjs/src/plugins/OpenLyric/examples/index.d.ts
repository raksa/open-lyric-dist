/**
 * The bundled Open Lyric example songs, as raw Open Lyric markdown.
 *
 * Two ways in, one module. The notation plugin's data (`open-lyric_ol_editor.ts`)
 * wraps these strings in `{ id, fileName, title, description, content }` records
 * so they reach a page's Examples menu; this barrel is the other way — a host
 * that wants to SEED a surface's initial content rather than offer the song in a
 * menu imports the text directly (`new OpenLyric({ value: … })`), which is what
 * the standalone preview and editor page entries do with the Khmer counterparts
 * in `src/plugins/km_KH/examples/index.ts`.
 *
 * Both paths read this module, so each song's text is bundled once.
 *
 * The constants are named after the songs, not after their file numbers: the
 * `exampleN-…` filename is an ordering detail of the Examples menu, while the
 * name a host writes in its own source should say what it is seeding. The
 * matching menu `id` is noted on each doc comment for the record.
 *
 * NOTE: `example-placeholder-song.md` is deliberately absent — it is a unit-test
 * fixture (`OpenLyric.display.test.ts`, `OpenLyric.reset.test.ts`), not a
 * shipped example, and the plugin data does not list it either.
 */
/**
 * Extended Worship Build (`example1`) — extended worship flow with multiple
 * bridges, instrumentals, repeat counts, and a final chorus.
 */
export declare const EXTENDED_WORSHIP_BUILD_EXAMPLE: string;
/**
 * Quiet River at Dawn (`example2-rich-config`) — rich config fields: subtitle,
 * multiline description, attachments, strumming patterns, pre-chorus, and
 * post-chorus. The one to reach for when demoing `getInfo()` /
 * `getAttachments()`.
 */
export declare const QUIET_RIVER_AT_DAWN_EXAMPLE: string;
/**
 * Bilingual Mercy Response (`example3-bilingual-bars`) — Unicode and bilingual
 * bar-aligned lyrics with translation pairs and chord annotations.
 */
export declare const BILINGUAL_MERCY_RESPONSE_EXAMPLE: string;
/**
 * Refrain and Tag Lift (`example4-refrain-and-tags`) — Refrain plus numbered Tag
 * sections reused from the compact structure.
 */
export declare const REFRAIN_AND_TAG_LIFT_EXAMPLE: string;
/**
 * Between the Verses (`example5-interlude-and-comments`) — numbered Interlude
 * sections with drafting comments inside intro, interlude, and lyric blocks.
 */
export declare const BETWEEN_THE_VERSES_EXAMPLE: string;
/**
 * Fire on the Altar (`example6-breakdown-and-vamp`) — free-text Breakdown and
 * Vamp sections for spoken cues and ad-lib directions.
 */
export declare const FIRE_ON_THE_ALTAR_EXAMPLE: string;
/**
 * Lead Line Offering (`example7-solo-variations`) — numbered Solo sections
 * paired with separate Instrumental sections and cue directives.
 */
export declare const LEAD_LINE_OFFERING_EXAMPLE: string;
/**
 * Higher Than the Morning (`example8-lyric-outro-and-final-chorus`) — lyric
 * outro alongside a modulated final chorus.
 */
export declare const HIGHER_THAN_THE_MORNING_EXAMPLE: string;
/**
 * March of Grace (`example9-instrumental-outro`) — instrumental outro using
 * valid intro and instrumental directives in 2/2 time.
 */
export declare const MARCH_OF_GRACE_EXAMPLE: string;
/**
 * Commented Draft Template (`example10-commented-draft`) — comment-heavy
 * drafting template showing ignored `//` lines in every fence type.
 */
export declare const COMMENTED_DRAFT_TEMPLATE_EXAMPLE: string;
/**
 * Twelve-Eight Lanterns (`example11-twelve-eight-and-aliases`) — 12/8 example
 * using the singular Strumming Pattern alias and chord extensions.
 */
export declare const TWELVE_EIGHT_LANTERNS_EXAMPLE: string;
/**
 * Markdown Decoration Demo (`example12-markdown-decorations`) — bold, italic,
 * and font color examples rendered directly inside Open Lyric fences.
 */
export declare const MARKDOWN_DECORATION_DEMO_EXAMPLE: string;

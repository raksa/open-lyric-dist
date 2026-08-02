/**
 * Every locale tag an `ol:Config` `Locales` field may list — the Windows LCID
 * tag set, kept in this repository as `locale.txt`.
 *
 * Data only, and complete on purpose: naming every tag is what keeps the core
 * script-neutral. `km-KH` sits here as one row of 229, not as a language the
 * core knows about — a Khmer document still earns its keyboard, fonts, and
 * spellcheck from the km-KH plugin, never from this list.
 *
 * Order is the source file's, which is also the order the Monaco `Locales`
 * completion offers the tags in.
 *
 * The transcript plugin keeps its own near-identical picker list
 * (`BASE_TRANSCRIPT_LOCALE_SUGGESTIONS`) on purpose — that one is a UI menu a
 * language plugin extends through the registry, this one is the notation's
 * closed value set.
 */
declare const CONFIG_LOCALE_VALUES: string[];
export { CONFIG_LOCALE_VALUES };

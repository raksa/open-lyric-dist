/**
 * Near-miss matching for names a song spells — fence headers, Config fields —
 * so a diagnostic can say "Did you mean …?".
 */
/**
 * A name as typed and as defined, compared: no case, spaces, underscores or
 * hyphens — `pre chorus` and `Pre-Chorus`, `title` and `Title` meet.
 */
declare function toLooseNameKey(value: any): string;
/**
 * How many single-letter edits turn `left` into `right`, a swap of two
 * neighbours counting as one (`chrous` → `chorus` is 1).
 */
declare function getEditDistance(left: any, right: any): number;
/**
 * The name in `candidates` that `typed` was most likely meant to be — within
 * one edit for a name of four letters or fewer, two for a longer one, after
 * {@link toLooseNameKey} — or `''` when none is that close. Ties go to the
 * earlier candidate.
 */
declare function findClosestName(typed: any, candidates: any): string;
export { findClosestName, getEditDistance, toLooseNameKey };

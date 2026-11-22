# Open Lyric — notation schema

The complete grammar of the Open Lyric song notation: the fenced sections a
document may contain, the `Config` metadata fence, the inline chord/bar/directive
syntax, the compact `Structure` codes, and every diagnostic the validator emits.

Everything here is what the parser and validator actually enforce. Patterns are
written as JavaScript regular-expression sources.

---

## 1. Document shape

An Open Lyric document is a **Markdown file**. Anything outside an `ol:` fence is
ordinary Markdown and is not validated as notation.

Each song section is a fenced block whose info string starts with `ol:`:

````text
```ol:Verse 1
Morning breaks with mercy on the water
```
````

| Rule            | Value                                                             |
| --------------- | ----------------------------------------------------------------- |
| Fence open      | `^\s*```ol:(.*)$` — the capture is the header, plus optional index |
| Fence close     | `^\s*```\s*$`                                                     |
| Header, plain   | `^<Header>$`                                                      |
| Header, indexed | `^<Header>(?:\s+([1-9]\d*))?$` (only where numbering is allowed)   |
| Comment line    | `^\s*//` — valid in every fence                                   |

- Header spelling is **case-sensitive and exact**. `ol:config` is rejected; use
  `ol:Config`.
- **Part name** is the fence's identity: the header, plus `" " + index` when
  numbered (`Verse 2`). `Structure` and the duplicate check both work on part
  names.
- Each part name may be declared **once** per document.
- `ol:Config` is **required**. Every other section is optional.
- Comment lines are ignored by validation and shown in the preview (muted)
  unless comments are turned off. `Config` comments always stay hidden — they
  surface as strumming-pattern labels instead.

---

## 2. Sections

| Header         | Kind         | Numbered | Structure code | Body rule     |
| -------------- | ------------ | -------- | -------------- | ------------- |
| `Config`       | config       | no       | —              | config        |
| `Intro`        | intro        | no       | `I`            | mixed         |
| `Verse`        | lyric        | yes      | `V`            | lyric         |
| `Pre-Chorus`   | lyric        | yes      | `P`            | lyric         |
| `Chorus`       | lyric        | yes      | `C`            | lyric         |
| `Post-Chorus`  | lyric        | yes      | `X`            | lyric         |
| `Final-Chorus` | lyric        | no       | `F`            | lyric         |
| `Bridge`       | lyric        | yes      | `B`            | lyric         |
| `Refrain`      | lyric        | yes      | `R`            | lyric         |
| `Tag`          | lyric        | yes      | `T`            | lyric         |
| `Note`         | lyric        | yes      | `N`            | lyric         |
| `Instrumental` | instrumental | yes      | `IS`           | progression   |
| `Interlude`    | instrumental | yes      | `L`            | progression   |
| `Turnaround`   | turnaround   | yes      | `TU`           | mixed         |
| `Outro`        | outro        | no       | `O`            | mixed         |
| `Breakdown`    | freeText     | yes      | `D`            | free text     |
| `Vamp`         | freeText     | no       | `A`            | free text     |
| `Solo`         | freeText     | yes      | `S`            | free text     |

### Body rules

**`lyric`** — free lyric text. Only two things are checked: every `[` must open a
valid chord annotation and close on the same line, and a bare `]` is an error.
Leading and interior `|` bar markers are allowed for bar-aligned lyrics. An
indented line under a lyric line reads as its **translation line**.

**`progression`** (`Instrumental`, `Interlude`) — the whole body is joined into
one chord progression. It may open with a single `{c: …}` cue directive;
everything after that must be bar tokens, chord symbols and `(Nx)` repeat
suffixes. No lyric text.

**`mixed`** (`Intro`, `Outro`, `Turnaround`) — each line is classified on its own.
A line reads as a **progression** when it contains a `|` *and* at least one
whole-token chord symbol, or when it starts with `{p:` / `{c:`. Every other line
reads as a **lyric** line. This is what lets a sung intro sit under the
progression that sets it up.

> Caution: a lyric line that uses `|` separators *and* contains a standalone
> chord-looking word (`| Hello | D |`) is classified as a progression, and its
> words are then flagged as invalid tokens. Attach chords as `[D]` annotations
> instead.

**`free text`** (`Breakdown`, `Vamp`, `Solo`) — not validated. Spoken cues,
ad-lib directions, arrangement notes: anything.

---

## 3. Inline notation

### Chord symbol

```text
[A-G](?:#|b)?(?:(?:maj|min|m|dim|aug)(?:2|4|5|6|7|9|11|13)?|sus(?:2|4)?|(?:add|no|omit)(?:2|4|5|6|7|9|11|13)|(?:2|4|5|6|7|9|11|13))?(?:\/[A-G](?:#|b)?)?
```

- **Root** — `A`–`G`, with an optional `#` or `b`.
- **Decoration** — at most **one** of: a quality (`maj`, `min`, `m`, `dim`, `aug`)
  with an optional extension; `sus` / `sus2` / `sus4`; `add`/`no`/`omit` +
  extension; or a bare extension.
- **Extensions** — `2 4 5 6 7 9 11 13`.
- **Slash bass** — optional `/<root>`, e.g. `D/F#`.

Valid: `C` `Am` `Bm7` `Em7` `Cadd9` `Gsus4` `Cmaj7` `D/F#` `F#m` `Bb` `Ebm` `A/C#`

Invalid: `C7sus4` (two decorations) · `Cm7b5` (no altered fifth) · `H` (root must
be `A`–`G`) · `Gadd` (`add`/`no`/`omit` need an extension)

### Chord annotation

`^\[<chordSymbol>\]$` — placed inline, immediately before the syllable the chord
lands on:

```text
[D]You turn the darkest night to [A/C#]morning
```

### Bar tokens

`||:` `|:` `:||` `:|` `|`

### Repeat suffix

`^\([1-9]\d*x\)` — `(2x)`, `(4x)`, `(12x)`.

Rejected: `(02x)` `( 2x)` `(2x )` `(x2)` `(2X)`.

Progression lines only (`Instrumental`, `Interlude`, and progression lines inside
`Intro`/`Outro`/`Turnaround`). Inside a `Structure` value the compact form `x2` is
used instead — note the reversed order.

### Directives

A directive must be the **first token** of its line (mixed sections) or of the
body (`Instrumental` / `Interlude`).

| Directive          | Pattern                            | Example             | Allowed in                                                     |
| ------------------ | ---------------------------------- | ------------------- | -------------------------------------------------------------- |
| Strumming pattern  | `^\{p:\s*#[1-9]\d*\s*\}`           | `{p: #2}`           | `Intro`, `Outro`, `Turnaround`                                  |
| Arrangement cue    | `^\{c:\s*[A-Za-z0-9 +\-\/#]+\s*\}` | `{c: Piano + Pads }` | `Intro`, `Outro`, `Turnaround`, `Instrumental`, `Interlude`     |

`{p: #N}` selects the Nth pattern from the `Config` `Strumming Patterns` list
(1-based, in listed order). `{c: …}` accepts letters, digits, space, `+`, `-`,
`/` and `#` only.

### Markdown inside fences

`**bold**`, `*italic*` and `<font color="#0f766e">colored</font>` render inside
fence bodies and do not interfere with chord alignment.

### Translation lines

An indented line directly under a lyric line renders paired with it, and may omit
chord annotations:

```text
|[Bm7]Holy are You Lord |[G]Faithful are You Lord
	Holy are You Lord  Faithful are You Lord
```

---

## 4. The `Config` fence

Field lines take the form `- Field: value`. Indented continuation lines are
allowed **only** under `Description`, `Attachments` and `Strumming Patterns`.

| Field                | Required | Notes                                                     |
| -------------------- | -------- | --------------------------------------------------------- |
| `Title`              | **yes**  |                                                           |
| `Subtitle`           | no       |                                                           |
| `Description`        | no       | multiline                                                 |
| `Artist`             | no       |                                                           |
| `Copyright`          | no       |                                                           |
| `Locales`            | no       | comma-separated, from the closed tag set                  |
| `Key`                | no       | enum                                                      |
| `Tempo`              | no       | `^[1-9]\d*bpm$` — no space, e.g. `68bpm`                  |
| `Time`               | no       | enum                                                      |
| `Theme`              | no       |                                                           |
| `Structure`          | **yes**  | see §5                                                    |
| `Genre`              | no       |                                                           |
| `Style`              | no       |                                                           |
| `Keywords`           | no       | comma-separated free text                                 |
| `Year`               | no       | `^[1-9]\d{3}$` — four digits, e.g. `2024`                 |
| `Melody`             | no       | free text — the tune the lyrics are sung to               |
| `Attachments`        | no       | multiline, one URL per line                               |
| `Strumming Patterns` | no       | multiline; alias `Strumming Pattern` is accepted          |

**`Key`** — `C Db D Eb E F F# Gb G Ab A Bb B Am Bbm Bm Cm C#m Dm D#m Ebm Em Fm F#m Gm G#m`

**`Time`** — `4/4 2/2 2/4 3/4 3/8 6/8 9/8 12/8`

**`Locales`** — comma-separated tags from a **closed set** (the Windows LCID tag
list, 229 entries: `en-US`, `km-KH`, `fr-FR`, `zh-CN`, …), written as listed:
`en-us` is an error whose message names the listed `en-US`, and whose quick
fix writes it (§6). Duplicates and
empty entries are errors too. The complete list is enumerated in the grammar
JSON of §8, under `config.locales.values`.

**`Keywords`** — free-text search terms on one line, separated by commas:
`- Keywords: grace, morning, worship`. Any script is fine; nothing is checked
beyond the value being present. The song object (§8.2) carries them as a list.

**`Year`** — the year the song was written or released, as four ASCII digits
(`2024`). A two-digit year, a range (`2023-2024`) or other-script digits are
reported.

**`Melody`** — the tune the lyrics are sung to, typically the name of an
existing melody (`- Melody: Amazing Grace`). Free text, like `Genre`.

**`Attachments`** — one per line, either a bare URL or a Markdown link:

```text
- Attachments: https://example.com/audio/demo.mp3
	[Piano Chart](file:///C:/Charts/song.pdf)
```

Pattern: `^(?:(?:[A-Za-z][A-Za-z0-9+.-]*:\/\/\S[^\r\n]*)|\[[^\]\r\n]+\]\((?:[A-Za-z][A-Za-z0-9+.-]*:\/\/\S[^\r\n)]*)\))$`.
Detected types: `youtube`, `audio`, `video`, `pdf`, `image`, `other`.

**`Strumming Patterns`** — one pattern per indented line. Step characters:
`d D v V u U ^ x X 1 * + - _ . 0`; separators `|`, space and tab. A `//` comment
line above a pattern becomes its label in the preview. Patterns are numbered from
1 in listed order and referenced by `{p: #N}`.

```text
- Strumming Patterns:
	// Slow rolling pulse
	d--u-- | d-u---
```

---

## 5. `Structure`

The performance order of the song, written as one compact token string —
no whitespace, no separators.

```text
- Structure: IV1x2CV1V2CO
```

| Code | Section        | Numbered | Code | Section      | Numbered |
| ---- | -------------- | -------- | ---- | ------------ | -------- |
| `I`  | Intro          | no       | `IS` | Instrumental | yes      |
| `V`  | Verse          | yes      | `L`  | Interlude    | yes      |
| `P`  | Pre-Chorus     | yes      | `D`  | Breakdown    | yes      |
| `C`  | Chorus         | yes      | `R`  | Refrain      | yes      |
| `X`  | Post-Chorus    | yes      | `T`  | Tag          | yes      |
| `F`  | Final-Chorus   | no       | `TU` | Turnaround   | yes      |
| `B`  | Bridge         | yes      | `A`  | Vamp         | no       |
| `N`  | Note           | yes      | `S`  | Solo         | yes      |
| `O`  | Outro          | no       |      |              |          |

- Codes are matched **longest-first**, so `IS` reads as Instrumental, never as
  Intro + Solo.
- **Index** — `[1-9]\d*` immediately after the code (`V1`), and only for a
  section that allows numbering.
- **Repeat** — `x[1-9]\d*` after the code and index (`V1x2` = play Verse 1
  twice).
- Every token must name a part the document actually **declares as a fence**.
- The same part may not appear **twice in a row** — raise the previous token's
  repeat count instead (`Cx2`, not `CC`).
- A declared section the Structure never names is valid, with no diagnostic.
  The preview leaves it out of the song, with one exception: a `Note`.

### Notes in the Structure, or after it

A `Note` fence can be shown in two places:

- **In the flow.** Name it in the Structure (`IV1CN1V2CO`). It is a step of
  the song like any section: it renders in that place with its flow index, and
  it takes that place in the plain text and in a slide deck.
- **After the song.** Leave it out of the Structure. The preview then lists it
  below the song's sections, in the order the notes are written, with no flow
  index. It follows the song in the plain text too, and in a slide deck it can
  close the deck. The preview's **Show song notes** setting (on by default)
  and the render option `hideNotes` leave such notes out.

A note named in the Structure never also appears after the song, so it
shows once either way.

---

## 6. Diagnostics

Every message the validator can emit, and what triggers it.

A diagnostic that names its fix also carries it as data: `fix: { title,
text }`, meaning *put `text` in place of the diagnostic's range*. The
editor and VS Code offer it as a preferred quick fix (the light bulb,
`Ctrl+.` / `Cmd+.`), withdrawn once the text under it changes; while two or
more apply, the light bulb also offers **Fix all N Open Lyric problems**, and
a `source.fixAll` request (Fix All, a save action) gets that edit as
`source.fixAll.openLyric`. The MCP's `validate_song` returns the fix with each
diagnostic, and its `apply_fixes` applies them all. These carry one:

| Diagnostic | Range | `text` | `title` |
| --- | --- | --- | --- |
| `Unsupported ol part. Did you mean ol:<Header>?` | the header after `ol:` | `<Header>` | `Change to ol:<Header>` |
| `Use ol:Config. Lowercase ol:config is not supported.` | `config` | `Config` | `Change to ol:Config` |
| `Unsupported config field. Did you mean <Field>?` | the field name | `<Field>` — `title` → `Title`, `Strucure` → `Structure` | `Change to <Field>` |
| `Invalid chord annotation. Try [<chord>].` | the bracketed token | `[<chord>]` | `Change to [<chord>]` |
| `Invalid <section> token "<token>". Try <chord>.` | the token | `<chord>` | `Change to <chord>` |
| `Repeat suffix must use exact format (2x).` | the parenthesised token | `(<n>x)` — `(2 X)` → `(2x)` | `Change to (<n>x)` |
| `Key must be one of: …` | from the field's `:` to the end of the line | `: <key>` — `g` → `G`, `f♯m` → `F#m`, `E♭` → `Eb` | `Change to <key>` |
| `Time must be one of: …` | from the field's `:` to the end of the line | `: <time>` — `4 / 4` → `4/4` | `Change to <time>` |
| `Tempo must be a whole number of beats per minute then bpm, such as 76bpm.` | from the field's `:` to the end of the line | `: <n>bpm` — `70 bpm`, `70`, `70BPM` → `70bpm` | `Change to <n>bpm` |
| `Unsupported locale. Use <tag> instead of <typed>.` | the tag | `<tag>` — `km-kh` → `km-KH` | `Change to <tag>` |

A repeat whose count is itself wrong (`(0x)`, `(02x)`) gets no fix, and
neither does a value with more than one reading: a Key ending in a capital
`M` (`GM` may mean G major or G minor), a Key or Time outside its list
however it is spelled, a Tempo of `0bpm` or with a fraction, a two-digit
Year, a tag outside the locale list.

### Fences

| Message                                                                                                                   | Cause                                                  |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `Use ol:Config. Lowercase ol:config is not supported.`                                                                     | The header spelled in lowercase.                       |
| `Config fences cannot be numbered or suffixed.`                                                                            | `ol:Config 1` or similar.                              |
| `<Header> fences cannot be numbered.`                                                                                      | An index on Intro, Outro, Vamp, Final-Chorus or Config. |
| `Section indexes must start at 1.`                                                                                         | A zero or zero-padded index, e.g. `ol:Verse 01`.       |
| `Unsupported ol part. Use Config, Intro, Instrumental, Interlude, Turnaround, lyric sections, Breakdown, Vamp, or Solo.`    | An unknown fence header.                               |
| `Unsupported ol part. Did you mean ol:<Header>?`                                                                           | An unknown header close to a known one: a letter or two off (one for a header of four letters or fewer), or a difference of case, spaces or hyphens only — `ol:Vers 2` → `ol:Verse 2`, `ol:pre chorus 1` → `ol:Pre-Chorus 1`. |
| `Duplicate ol part. <partName> is already declared on line N.`                                                             | The same part name declared twice.                     |
| `Unclosed ol fence.`                                                                                                       | A missing closing ``` line.                            |
| `Missing required ol part. Add ol:Config.`                                                                                 | No Config fence in the document.                       |

### Config

| Message                                                                                                                                        | Cause                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `Invalid config entry. Use - Field: value.`                                                                                                     | A `-` line with no `Field:`, such as `- Genre`.        |
| `Unsupported config field. Use …`                                                                                                               | A `- Field: value` entry whose field is not one of §4's and not close to one, such as `- Colour: red`. The message lists them all. |
| `Unsupported config field. Did you mean <Field>?`                                                                                               | An unknown field close to a known one: a letter or two off (one for a name of four letters or fewer), or a difference of case, spaces or hyphens only — `- title:` → `Title`, `- Strucure:` → `Structure`, `- Kye:` → `Key`. Never a field the Config already declares (above or below) or one an earlier misspelt name was pointed at, so applying every fix never makes a duplicate; with no other close field, the message lists every field instead. A misspelt `Title` or `Structure` also leaves `Missing required config fields: …` until it is fixed. |
| `Config continuation lines must follow a Description, Attachments, or Strumming Patterns entry.`                                                 | A line that is not a `- Field:` entry, indented or not, after a single-line field. |
| `Duplicate config field. <Field> is already declared on line N.`                                                                                | A Config field written twice.                          |
| `<Field> must provide a value on the same line.`                                                                                                | A single-line field left empty, value on the next line. |
| `<Field> must be one of: …`                                                                                                                     | A `Key` or `Time` value outside its enum.              |
| `Tempo must be a whole number of beats per minute then bpm, such as 76bpm.`                                                                     | `70 bpm`, `70`, or `0bpm`.                             |
| `Year must be a four-digit year, such as 2024.`                                                                                                 | `24`, `2023-2024`, or other-script digits.             |
| `Missing required config fields: …`                                                                                                             | `Title` or `Structure` is absent.            |
| `Locales must be a comma-separated list of locales with no empty entry.`                                                                        | A trailing comma or an empty slot.                     |
| `Duplicate locale. <tag> is already listed.`                                                                                                    | The same locale tag listed twice.                      |
| `Unsupported locale. Use <tag> instead of <typed>.`                                                                                             | A listed tag in another case, such as `en-us`.         |
| `Unsupported locale. <typed> is not a supported locale such as en-US or km-KH.`                                                                 | A tag outside the closed set.                          |
| `Attachments must use a protocol-based URL such as http://, https://, file:///, ftp://, ftps://, or a Markdown link whose target is such a URL. Spaces inside the URL are allowed.` | An `Attachments` value that is neither a `scheme://` URL nor a Markdown link to one, such as `demo.mp3`. |
| `Attachments continuation lines must start with spaces or tabs and contain a protocol-based URL such as http://, https://, file:///, ftp://, ftps://, or a Markdown link that points to one. Spaces inside the URL are allowed.` | A line under `Attachments` that is not indented, or holds no such URL. |
| `Strumming Patterns must use only d, D, v, V, u, U, ^, x, X, 1, *, +, -, _, ., 0, bar separators (\|), and spaces or tabs.`                      | Any other character inside a pattern.                  |
| `Strumming Patterns continuation lines must start with spaces or tabs and use only d, D, v, V, u, U, ^, x, X, 1, *, +, -, _, ., 0, bar separators (\|), and spaces or tabs.` | A line under `Strumming Patterns` that is not indented, or holds any other character. |

### Structure

| Message                                                                                              | Cause                                     |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `Structure must use compact codes like IV1x2CV1V2CO.`                                                 | Whitespace inside the value.              |
| `Unknown structure code. Use …`                                                                       | A letter that is not a structure code.    |
| `<Header> cannot be numbered in Structure.`                                                           | An index on an unnumbered section's code. |
| `Repeat suffix must use compact format x2.`                                                           | `x` written without a count.              |
| `Repeat counts must start at 1.`                                                                      | `x0` or `x02`.                            |
| `Structure cannot place <part> twice in a row. Increase the previous token's repeat count instead.`    | `CC` instead of `Cx2`.                    |
| `Structure references undeclared ol part. <part> is not declared.`                                    | A token with no matching fence. Every such token is marked, each at its own place. |

### Section bodies

| Message                                                             | Cause                                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Unclosed chord annotation.`                                         | A `[` with no `]` on the same line.                                            |
| `Invalid chord annotation.`                                          | A bracketed token that is not a chord symbol and is not close to one, such as `[Hmm]`. |
| `Invalid chord annotation. Try [<chord>].`                           | A bracketed token close to a chord symbol; the suggestion is that chord.       |
| `Unexpected closing bracket in lyric line.`                          | A `]` with no opening `[`.                                                     |
| `Invalid <section> token "<token>". Try <chord>.`                    | A progression word that is nearly a chord: bracketed (`[G]` → `G`), lowercase (`em` → `Em`), or German B (`Hm` → `Bm`). |
| `Invalid <section> token "<token>". Use chords, \| bars and (2x) repeats.` | Any other word in a progression that is neither a chord, a bar token, nor a repeat. |
| `Invalid <section> directive. Expected {c: Piano + Pads }.`          | A malformed `{ … }` opening an Instrumental / Interlude body.                  |
| `Invalid <section> directive. Expected {p: #3} or {c: Piano + Pads }.` | A malformed directive on a mixed-section progression line.                    |
| `Repeat suffix must use exact format (2x).`                          | A repeat-looking token such as `(2 x)` or `(2X)`.                              |
| `Unclosed repeat suffix.`                                            | A `(` with no `)` in a progression.                                            |

---

## 7. Complete example

````text
```ol:Config
- Title: Quiet River at Dawn
- Subtitle: A Soft 4/4 Prayer
- Description:
	A gentle worship draft for acoustic teams.
- Artist: Open Lyric Team
- Copyright: 2026 Open Lyric
- Locales: en-US
- Key: G
- Tempo: 68bpm
- Time: 4/4
- Theme: Quiet trust
- Structure: IV1PCXV2CO
- Genre: Worship
- Style: Acoustic
- Keywords: trust, morning, worship
- Year: 2026
- Melody: Original tune
- Attachments: https://example.com/audio/quiet-river-demo.mp3
- Strumming Patterns:
	// Slow rolling pulse
	d--u-- | d-u---
```

```ol:Intro
// Count the band in on bar 2
{p: #1} | G | D/F# | Em7 | Cadd9 | (2x)
```

```ol:Verse 1
Morning breaks with mercy on the water
Every breath reminds me You are near
```

```ol:Pre-Chorus
[Em7]When the waters rise, [D]You remain
[Cadd9]Steady as the promise [D]of Your name
```

```ol:Chorus
|[G]Carry me gently, carry me kindly
|[D/F#]Hold me in peace when the night feels long
```

```ol:Post-Chorus
|[Em7]River of peace, keep carrying me
```

```ol:Verse 2
Every hidden worry meets Your silence
```

```ol:Outro
Still You are near, still You are near
```
````

---

## 8. Machine-readable schema

Two JSON documents. The **grammar** describes the notation itself — every fence,
pattern, enum and diagnostic, as data. The **song schema** is a strict JSON
Schema (draft 2020-12) for a song held as a structured object, for generating or
validating a song before serializing it to notation.

### 8.1 Grammar

````json
{
  "name": "open-lyric-notation",
  "title": "Open Lyric notation grammar",
  "summary": "Every fence, pattern, enum and diagnostic of the Open Lyric notation, as data. Regex values are JavaScript regular-expression sources.",
  "document": {
    "fileForm": "A Markdown document. Anything outside an ol: fence is ordinary Markdown and is not validated as notation.",
    "fenceOpen": {
      "pattern": "^\\s*```ol:(.*)$",
      "note": "The capture is the fence info: a header, optionally followed by a space and a 1-based index."
    },
    "fenceClose": { "pattern": "^\\s*```\\s*$" },
    "headerInfo": {
      "unnumbered": "^<Header>$",
      "numbered": "^<Header>(?:\\s+([1-9]\\d*))?$",
      "note": "Header spelling is case-sensitive and exact. ol:config is rejected; use ol:Config."
    },
    "partName": "The fence identity used by Structure and by duplicate checks: the header, plus ' ' + index when numbered (e.g. 'Verse 2').",
    "commentLine": {
      "pattern": "^\\s*//",
      "note": "Valid inside every fence. Ignored by validation; shown in the preview unless comments are turned off. Config comments always stay hidden."
    },
    "required": ["Config"],
    "duplicates": "Each part name may be declared once per document."
  },
  "fences": [
    { "header": "Config", "className": "OLConfig", "kind": "config", "allowsNumbering": false, "required": true, "structureCode": null, "bodyRule": "config" },
    { "header": "Intro", "className": "OLIntro", "kind": "intro", "allowsNumbering": false, "required": false, "structureCode": "I", "bodyRule": "mixed" },
    { "header": "Final-Chorus", "className": "OLFinalChorus", "kind": "lyric", "allowsNumbering": false, "required": false, "structureCode": "F", "bodyRule": "lyric" },
    { "header": "Pre-Chorus", "className": "OLPreChorus", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "P", "bodyRule": "lyric" },
    { "header": "Post-Chorus", "className": "OLPostChorus", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "X", "bodyRule": "lyric" },
    { "header": "Refrain", "className": "OLRefrain", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "R", "bodyRule": "lyric" },
    { "header": "Bridge", "className": "OLBridge", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "B", "bodyRule": "lyric" },
    { "header": "Chorus", "className": "OLChorus", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "C", "bodyRule": "lyric" },
    { "header": "Verse", "className": "OLVerse", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "V", "bodyRule": "lyric" },
    { "header": "Note", "className": "OLNote", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "N", "bodyRule": "lyric" },
    { "header": "Tag", "className": "OLTag", "kind": "lyric", "allowsNumbering": true, "required": false, "structureCode": "T", "bodyRule": "lyric" },
    { "header": "Turnaround", "className": "OLTurnaround", "kind": "turnaround", "allowsNumbering": true, "required": false, "structureCode": "TU", "bodyRule": "mixed" },
    { "header": "Outro", "className": "OLOutro", "kind": "outro", "allowsNumbering": false, "required": false, "structureCode": "O", "bodyRule": "mixed" },
    { "header": "Instrumental", "className": "OLInstrumental", "kind": "instrumental", "allowsNumbering": true, "required": false, "structureCode": "IS", "bodyRule": "progression" },
    { "header": "Interlude", "className": "OLInterlude", "kind": "instrumental", "allowsNumbering": true, "required": false, "structureCode": "L", "bodyRule": "progression" },
    { "header": "Breakdown", "className": "OLBreakdown", "kind": "freeText", "allowsNumbering": true, "required": false, "structureCode": "D", "bodyRule": "freeText" },
    { "header": "Vamp", "className": "OLVamp", "kind": "freeText", "allowsNumbering": false, "required": false, "structureCode": "A", "bodyRule": "freeText" },
    { "header": "Solo", "className": "OLSolo", "kind": "freeText", "allowsNumbering": true, "required": false, "structureCode": "S", "bodyRule": "freeText" }
  ],
  "bodyRules": {
    "config": {
      "appliesTo": ["Config"],
      "description": "Field lines of the form '- Field: value'. Indented continuation lines are allowed only under Description, Attachments and Strumming Patterns.",
      "entryPattern": "^\\s*-\\s*(<known field>)\\s*:(.*)$"
    },
    "lyric": {
      "appliesTo": ["Verse", "Chorus", "Pre-Chorus", "Post-Chorus", "Bridge", "Refrain", "Tag", "Note", "Final-Chorus"],
      "description": "Free lyric text. Only two checks: every '[' must open a valid chord annotation and close on the same line, and a bare ']' is an error. Leading and interior '|' bar markers are allowed. An indented line under a lyric line reads as its translation line."
    },
    "progression": {
      "appliesTo": ["Instrumental", "Interlude"],
      "description": "The whole body is joined into one chord progression. It may open with a single {c: ...} cue; everything after that must be bar tokens, chord symbols and (Nx) repeat suffixes. No lyric text."
    },
    "mixed": {
      "appliesTo": ["Intro", "Outro", "Turnaround"],
      "description": "Each line is classified on its own. A line reads as a progression when it contains a '|' AND at least one whole-token chord symbol, or when it starts with '{p:' or '{c:'; every other line reads as a lyric line.",
      "caution": "A lyric line that uses '|' separators and also contains a standalone chord-looking word (e.g. '| Hello | D |') is classified as a progression and its words are flagged as invalid tokens. Attach chords as [D] annotations instead."
    },
    "freeText": {
      "appliesTo": ["Breakdown", "Vamp", "Solo"],
      "description": "Not validated. Spoken cues, ad-lib directions, arrangement notes."
    }
  },
  "inline": {
    "chordSymbol": {
      "source": "[A-G](?:#|b)?(?:(?:maj|min|m|dim|aug)(?:2|4|5|6|7|9|11|13)?|sus(?:2|4)?|(?:add|no|omit)(?:2|4|5|6|7|9|11|13)|(?:2|4|5|6|7|9|11|13))?(?:\\/[A-G](?:#|b)?)?",
      "parts": {
        "root": "[A-G] with an optional # or b.",
        "decoration": "At most ONE of: a quality (maj, min, m, dim, aug) with an optional extension; sus / sus2 / sus4; add|no|omit + extension; or a bare extension.",
        "extensions": ["2", "4", "5", "6", "7", "9", "11", "13"],
        "slashBass": "Optional /<root>, e.g. D/F#."
      },
      "valid": ["C", "Am", "Bm7", "Em7", "Cadd9", "Gsus4", "Cmaj7", "D/F#", "F#m", "Bb", "Ebm", "A/C#"],
      "invalid": [
        "C7sus4 - only one decoration group is allowed",
        "Cm7b5 - no altered-fifth suffix",
        "H - the root must be A-G",
        "Gadd - add/no/omit require an extension"
      ]
    },
    "chordAnnotation": {
      "pattern": "^\\[<chordSymbol>\\]$",
      "usage": "Inline in a lyric line, immediately before the syllable the chord lands on."
    },
    "barTokens": ["||:", "|:", ":||", ":|", "|"],
    "repeatSuffix": {
      "pattern": "^\\([1-9]\\d*x\\)",
      "examples": ["(2x)", "(4x)", "(12x)"],
      "rejected": ["(02x)", "( 2x)", "(2x )", "(x2)", "(2X)"],
      "scope": "Progression lines only. Inside a Structure value the compact form x2 is used instead."
    },
    "directives": {
      "strummingPattern": {
        "pattern": "^\\{p:\\s*#[1-9]\\d*\\s*\\}",
        "example": "{p: #2}",
        "meaning": "Play this section with the Nth pattern from the Config Strumming Patterns list (1-based, in listed order).",
        "allowedIn": ["Intro", "Outro", "Turnaround"]
      },
      "cue": {
        "pattern": "^\\{c:\\s*[A-Za-z0-9 +\\-\\/#]+\\s*\\}",
        "example": "{c: Piano + Pads }",
        "meaning": "An arrangement cue for the section.",
        "allowedIn": ["Intro", "Outro", "Turnaround", "Instrumental", "Interlude"],
        "characterSet": "Letters, digits, space, +, -, / and # only."
      },
      "position": "A directive must be the first token of its line (mixed sections) or of the body (Instrumental / Interlude)."
    },
    "markdown": {
      "supported": ["**bold**", "*italic*", "<font color=\"#0f766e\">colored</font>"],
      "note": "Inline Markdown renders inside fence bodies and does not interfere with chord alignment."
    },
    "translationLine": {
      "form": "An indented line directly under a lyric line.",
      "note": "Renders paired with the line above it, and may omit chord annotations."
    }
  },
  "config": {
    "fields": ["Title", "Subtitle", "Description", "Artist", "Copyright", "Locales", "Key", "Tempo", "Time", "Theme", "Structure", "Genre", "Style", "Keywords", "Year", "Melody", "Attachments", "Strumming Patterns"],
    "required": ["Title", "Structure"],
    "multiline": ["Description", "Attachments", "Strumming Patterns"],
    "aliases": { "Strumming Pattern": "Strumming Patterns" },
    "enums": {
      "Key": ["C", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Am", "Bbm", "Bm", "Cm", "C#m", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gm", "G#m"],
      "Time": ["4/4", "2/2", "2/4", "3/4", "3/8", "6/8", "9/8", "12/8"]
    },
    "patterns": { "Tempo": "^[1-9]\\d*bpm$", "Year": "^[1-9]\\d{3}$" },
    "locales": {
      "separator": ",",
      "caseInsensitiveMatch": false,
      "duplicatesRejected": true,
      "note": "A closed value set - the Windows LCID tag list, written as listed. A tag outside it is an error, and so is a listed tag in another case (en-us for en-US): its message names the listed form.",
      "values": [
        "arc", "af-ZA", "am-ET", "ar-AE", "ar-BH", "ar-DZ", "ar-EG", "ar-IQ",
        "ar-JO", "ar-KW", "ar-LB", "ar-LY", "ar-MA", "arn-CL", "ar-OM", "ar-QA",
        "ar-SA", "ar-SD", "ar-SY", "ar-TN", "ar-YE", "as-IN", "az-az", "az-Cyrl-AZ",
        "az-Latn-AZ", "ba-RU", "be-BY", "bg-BG", "bn-BD", "bn-IN", "bo-CN", "br-FR",
        "bs-Cyrl-BA", "bs-Latn-BA", "ca-ES", "co-FR", "cs-CZ", "cy-GB", "da-DK", "de-AT",
        "de-CH", "de-DE", "de-LI", "de-LU", "dsb-DE", "dv-MV", "el-CY", "el-GR",
        "en-029", "en-AU", "en-BZ", "en-CA", "en-cb", "en-GB", "en-IE", "en-IN",
        "en-JM", "en-MT", "en-MY", "en-NZ", "en-PH", "en-SG", "en-TT", "en-US",
        "en-ZA", "en-ZW", "es-AR", "es-BO", "es-CL", "es-CO", "es-CR", "es-DO",
        "es-EC", "es-ES", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE",
        "es-PR", "es-PY", "es-SV", "es-US", "es-UY", "es-VE", "et-EE", "eu-ES",
        "fa-IR", "fi-FI", "fil-PH", "fo-FO", "fr-BE", "fr-CA", "fr-CH", "fr-FR",
        "fr-LU", "fr-MC", "fy-NL", "ga-IE", "gd-GB", "gd-ie", "gl-ES", "gsw-FR",
        "gu-IN", "ha-Latn-NG", "he-IL", "hi-IN", "hr-BA", "hr-HR", "hsb-DE", "hu-HU",
        "hy-AM", "id-ID", "ig-NG", "ii-CN", "in-ID", "is-IS", "it-CH", "it-IT",
        "iu-Cans-CA", "iu-Latn-CA", "iw-IL", "ja-JP", "ka-GE", "kk-KZ", "kl-GL", "km-KH",
        "kn-IN", "kok-IN", "ko-KR", "ky-KG", "lb-LU", "lo-LA", "lt-LT", "lv-LV",
        "mi-NZ", "mk-MK", "ml-IN", "mn-MN", "mn-Mong-CN", "moh-CA", "mr-IN", "ms-BN",
        "ms-MY", "mt-MT", "nb-NO", "ne-NP", "nl-BE", "nl-NL", "nn-NO", "no-no",
        "nso-ZA", "oc-FR", "or-IN", "pa-IN", "pl-PL", "prs-AF", "ps-AF", "pt-BR",
        "pt-PT", "qut-GT", "quz-BO", "quz-EC", "quz-PE", "rm-CH", "ro-mo", "ro-RO",
        "ru-mo", "ru-RU", "rw-RW", "sah-RU", "sa-IN", "se-FI", "se-NO", "se-SE",
        "si-LK", "sk-SK", "sl-SI", "sma-NO", "sma-SE", "smj-NO", "smj-SE", "smn-FI",
        "sms-FI", "sq-AL", "sr-BA", "sr-CS", "sr-Cyrl-BA", "sr-Cyrl-CS", "sr-Cyrl-ME", "sr-Cyrl-RS",
        "sr-Latn-BA", "sr-Latn-CS", "sr-Latn-ME", "sr-Latn-RS", "sr-ME", "sr-RS", "sr-sp", "sv-FI",
        "sv-SE", "sw-KE", "syr-SY", "ta-IN", "te-IN", "tg-Cyrl-TJ", "th-TH", "tk-TM",
        "tlh-QS", "tn-ZA", "tr-TR", "tt-RU", "tzm-Latn-DZ", "ug-CN", "uk-UA", "ur-PK",
        "uz-Cyrl-UZ", "uz-Latn-UZ", "uz-uz", "vi-VN", "wo-SN", "xh-ZA", "yo-NG", "zh-CN",
        "zh-HK", "zh-MO", "zh-SG", "zh-TW", "zu-ZA"
      ]
    },
    "attachments": {
      "valueForms": ["<scheme>://<url>", "[label](<scheme>://<url>)"],
      "pattern": "^(?:(?:[A-Za-z][A-Za-z0-9+.-]*:\\/\\/\\S[^\\r\\n]*)|\\[[^\\]\\r\\n]+\\]\\((?:[A-Za-z][A-Za-z0-9+.-]*:\\/\\/\\S[^\\r\\n)]*)\\))$",
      "detectedTypes": ["youtube", "audio", "video", "pdf", "image", "other"],
      "note": "One attachment per line; further attachments go on indented continuation lines."
    },
    "strummingPatterns": {
      "stepCharacters": ["d", "D", "v", "V", "u", "U", "^", "x", "X", "1", "*", "+", "-", "_", ".", "0"],
      "separators": ["|", " ", "\t"],
      "example": "d--u-- | d-u---",
      "note": "One pattern per indented line under the field. A // comment line above a pattern becomes its label in the preview. Patterns are numbered from 1 in listed order and referenced by {p: #N}."
    }
  },
  "structure": {
    "purpose": "The Config Structure field is the performance order of the song, written as one compact token string.",
    "syntaxExample": "IV1x2CV1V2CO",
    "codes": [
      { "code": "I", "header": "Intro", "allowsNumbering": false },
      { "code": "V", "header": "Verse", "allowsNumbering": true },
      { "code": "N", "header": "Note", "allowsNumbering": true },
      { "code": "P", "header": "Pre-Chorus", "allowsNumbering": true },
      { "code": "C", "header": "Chorus", "allowsNumbering": true },
      { "code": "X", "header": "Post-Chorus", "allowsNumbering": true },
      { "code": "F", "header": "Final-Chorus", "allowsNumbering": false },
      { "code": "B", "header": "Bridge", "allowsNumbering": true },
      { "code": "IS", "header": "Instrumental", "allowsNumbering": true },
      { "code": "L", "header": "Interlude", "allowsNumbering": true },
      { "code": "D", "header": "Breakdown", "allowsNumbering": true },
      { "code": "R", "header": "Refrain", "allowsNumbering": true },
      { "code": "T", "header": "Tag", "allowsNumbering": true },
      { "code": "TU", "header": "Turnaround", "allowsNumbering": true },
      { "code": "A", "header": "Vamp", "allowsNumbering": false },
      { "code": "S", "header": "Solo", "allowsNumbering": true },
      { "code": "O", "header": "Outro", "allowsNumbering": false }
    ],
    "matching": "Codes are matched longest-first, so IS reads as Instrumental, never Intro + Solo.",
    "index": { "pattern": "[1-9]\\d*", "note": "Written immediately after the code (V1), and only for a section that allows numbering." },
    "repeat": { "pattern": "x[1-9]\\d*", "note": "Written after the code and index (V1x2 = play Verse 1 twice). The order is the reverse of the (2x) used in a progression body." },
    "rules": [
      "No whitespace or separators anywhere in the value.",
      "Every token must name a part the document actually declares as a fence.",
      "The same part may not appear twice in a row; raise the previous token's repeat count instead."
    ]
  },
  "diagnostics": [
    { "message": "Use ol:Config. Lowercase ol:config is not supported.", "cause": "The header spelled in lowercase.", "fix": "Config" },
    { "message": "Config fences cannot be numbered or suffixed.", "cause": "ol:Config 1 or similar." },
    { "message": "<Header> fences cannot be numbered.", "cause": "An index on Intro, Outro, Vamp, Final-Chorus or Config." },
    { "message": "Section indexes must start at 1.", "cause": "A zero or zero-padded index, e.g. ol:Verse 01." },
    { "message": "Unsupported ol part. Use Config, Intro, Instrumental, Interlude, Turnaround, lyric sections, Breakdown, Vamp, or Solo.", "cause": "An unknown fence header." },
    { "message": "Unsupported ol part. Did you mean ol:<Header>?", "cause": "An unknown header close to a known one (a letter or two off, or only case, spaces or hyphens apart).", "fix": "<Header>" },
    { "message": "Duplicate ol part. <partName> is already declared on line N.", "cause": "The same part name declared twice." },
    { "message": "Unclosed ol fence.", "cause": "A missing closing fence line." },
    { "message": "Missing required ol part. Add ol:Config.", "cause": "No Config fence in the document." },
    { "message": "Invalid config entry. Use - Field: value.", "cause": "A '-' line with no 'Field:', such as '- Genre'." },
    { "message": "Unsupported config field. Use ...", "cause": "A '- Field: value' entry whose field is not a Config field nor close to one, such as '- Colour: red'. The message lists them all." },
    { "message": "Unsupported config field. Did you mean <Field>?", "cause": "An unknown field close to a known one (a letter or two off, or only case, spaces or hyphens apart), such as '- title:' or '- Strucure:'. Never a field the Config already declares, nor one an earlier misspelt name was pointed at.", "fix": "<Field>" },
    { "message": "Config continuation lines must follow a Description, Attachments, or Strumming Patterns entry.", "cause": "A line that is not a '- Field:' entry, indented or not, after a single-line field." },
    { "message": "Duplicate config field. <Field> is already declared on line N.", "cause": "A Config field written twice." },
    { "message": "<Field> must provide a value on the same line.", "cause": "A single-line field left empty with its value on the next line." },
    { "message": "<Field> must be one of: ...", "cause": "A Key or Time value outside its enum.", "fix": ": <value>, when only case, spaces or a sharp/flat sign set it apart from one (not a Key ending in a capital M)" },
    { "message": "Tempo must be a whole number of beats per minute then bpm, such as 76bpm.", "cause": "Tempo written as '70 bpm', '70', or '0bpm'.", "fix": ": <n>bpm, unless the count is 0 or has a fraction" },
    { "message": "Year must be a four-digit year, such as 2024.", "cause": "Year written as '24', '2023-2024', or with other-script digits." },
    { "message": "Missing required config fields: ...", "cause": "Title or Structure is absent from Config." },
    { "message": "Locales must be a comma-separated list of locales with no empty entry.", "cause": "A trailing comma or an empty slot." },
    { "message": "Duplicate locale. <tag> is already listed.", "cause": "The same locale tag listed twice." },
    { "message": "Unsupported locale. Use <tag> instead of <typed>.", "cause": "A listed tag in another case, such as en-us.", "fix": "<tag>" },
    { "message": "Unsupported locale. <typed> is not a supported locale such as en-US or km-KH.", "cause": "A tag outside the closed set." },
    { "message": "Attachments must use a protocol-based URL such as http://, https://, file:///, ftp://, ftps://, or a Markdown link whose target is such a URL. Spaces inside the URL are allowed.", "cause": "An Attachments value that is neither a scheme:// URL nor a Markdown link to one, such as demo.mp3." },
    { "message": "Attachments continuation lines must start with spaces or tabs and contain a protocol-based URL such as http://, https://, file:///, ftp://, ftps://, or a Markdown link that points to one. Spaces inside the URL are allowed.", "cause": "A line under Attachments that is not indented, or holds no such URL." },
    { "message": "Strumming Patterns must use only d, D, v, V, u, U, ^, x, X, 1, *, +, -, _, ., 0, bar separators (|), and spaces or tabs.", "cause": "Any other character inside a pattern." },
    { "message": "Strumming Patterns continuation lines must start with spaces or tabs and use only d, D, v, V, u, U, ^, x, X, 1, *, +, -, _, ., 0, bar separators (|), and spaces or tabs.", "cause": "A line under Strumming Patterns that is not indented, or holds any other character." },
    { "message": "Structure must use compact codes like IV1x2CV1V2CO.", "cause": "Whitespace inside the Structure value." },
    { "message": "Unknown structure code. Use ...", "cause": "A letter that is not a structure code." },
    { "message": "<Header> cannot be numbered in Structure.", "cause": "An index on a code whose section is unnumbered." },
    { "message": "Repeat suffix must use compact format x2.", "cause": "'x' written without a count in Structure." },
    { "message": "Repeat counts must start at 1.", "cause": "x0 or x02 in Structure." },
    { "message": "Structure cannot place <part> twice in a row. Increase the previous token's repeat count instead.", "cause": "CC instead of Cx2." },
    { "message": "Structure references undeclared ol part. <part> is not declared.", "cause": "A Structure token with no matching fence; every such token is marked." },
    { "message": "Unclosed chord annotation.", "cause": "A '[' with no ']' on the same line." },
    { "message": "Invalid chord annotation.", "cause": "A bracketed token that is not a chord symbol and is not close to one, such as [Hmm]." },
    { "message": "Invalid chord annotation. Try [<chord>].", "cause": "A bracketed token close to a chord symbol; the suggestion is that chord.", "fix": "[<chord>]" },
    { "message": "Unexpected closing bracket in lyric line.", "cause": "A ']' with no opening '['." },
    { "message": "Invalid <section> token \"<token>\". Try <chord>.", "cause": "A progression word that is nearly a chord: bracketed ([G]), lowercase (em) or German B (Hm).", "fix": "<chord>" },
    { "message": "Invalid <section> token \"<token>\". Use chords, | bars and (2x) repeats.", "cause": "Any other word in a progression that is neither a chord, a bar token, nor a repeat suffix." },
    { "message": "Invalid <section> directive. Expected {c: Piano + Pads }.", "cause": "A malformed directive opening an Instrumental / Interlude body." },
    { "message": "Invalid <section> directive. Expected {p: #3} or {c: Piano + Pads }.", "cause": "A malformed directive on a mixed-section progression line." },
    { "message": "Repeat suffix must use exact format (2x).", "cause": "A repeat-looking token such as (2 x) or (2X).", "fix": "(<n>x), unless the count is wrong" },
    { "message": "Unclosed repeat suffix.", "cause": "A '(' with no ')' in a progression." }
  ]
}
````

### 8.2 Song schema (JSON Schema draft 2020-12)

A song as a structured object — `config` plus ordered `sections`. Validate
against this before serializing to notation, and every rule of §1–§5 that a
schema can carry is enforced for you.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://open-lyric.org/schema/song.schema.json",
  "title": "Open Lyric song",
  "description": "A song as a structured object, serializable to Open Lyric notation.",
  "type": "object",
  "required": ["config", "sections"],
  "additionalProperties": false,
  "properties": {
    "config": { "$ref": "#/$defs/config" },
    "sections": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/$defs/section" },
      "description": "The fences of the document, in written order. Part names must be unique."
    }
  },
  "$defs": {
    "chordSymbol": {
      "type": "string",
      "pattern": "^[A-G](?:#|b)?(?:(?:maj|min|m|dim|aug)(?:2|4|5|6|7|9|11|13)?|sus(?:2|4)?|(?:add|no|omit)(?:2|4|5|6|7|9|11|13)|(?:2|4|5|6|7|9|11|13))?(?:\\/[A-G](?:#|b)?)?$",
      "examples": ["C", "Am", "Bm7", "Cadd9", "Gsus4", "Cmaj7", "D/F#"]
    },
    "sectionHeader": {
      "type": "string",
      "enum": [
        "Intro", "Verse", "Pre-Chorus", "Chorus", "Post-Chorus", "Final-Chorus",
        "Bridge", "Refrain", "Tag", "Note", "Instrumental", "Interlude",
        "Turnaround", "Outro", "Breakdown", "Vamp", "Solo"
      ]
    },
    "unnumberedHeader": {
      "type": "string",
      "enum": ["Intro", "Outro", "Vamp", "Final-Chorus"]
    },
    "localeTag": {
      "type": "string",
      "description": "One tag of the closed locale set enumerated in the grammar of section 8.1 under config.locales.values.",
      "pattern": "^[A-Za-z]{2,4}(?:-[A-Za-z0-9]{2,8}){0,2}$",
      "examples": ["en-US", "km-KH", "fr-FR", "zh-CN"]
    },
    "config": {
      "type": "object",
      "description": "The ol:Config fence.",
      "required": ["Title", "Structure"],
      "additionalProperties": false,
      "properties": {
        "Title": { "type": "string", "minLength": 1 },
        "Subtitle": { "type": "string" },
        "Description": {
          "type": "array",
          "items": { "type": "string" },
          "description": "One entry per line; lines after the first are written indented."
        },
        "Artist": { "type": "string", "minLength": 1 },
        "Copyright": { "type": "string", "minLength": 1 },
        "Locales": {
          "type": "array",
          "items": { "$ref": "#/$defs/localeTag" },
          "uniqueItems": true,
          "description": "Serialized as one comma-separated line."
        },
        "Key": {
          "type": "string",
          "enum": [
            "C", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B",
            "Am", "Bbm", "Bm", "Cm", "C#m", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m",
            "Gm", "G#m"
          ]
        },
        "Tempo": { "type": "string", "pattern": "^[1-9]\\d*bpm$", "examples": ["68bpm", "120bpm"] },
        "Time": { "type": "string", "enum": ["4/4", "2/2", "2/4", "3/4", "3/8", "6/8", "9/8", "12/8"] },
        "Theme": { "type": "string" },
        "Structure": {
          "type": "string",
          "pattern": "^(?:(?:IS|TU|[IVNPCXFBLDRTASO])(?:[1-9]\\d*)?(?:x[1-9]\\d*)?)+$",
          "description": "Compact performance order. Codes are matched longest-first. Beyond this pattern: every token must name a declared section, no token may repeat the previous one, and only a numbered section may carry an index.",
          "examples": ["IV1x2CV1V2CO", "IV1PCXV2CO"]
        },
        "Genre": { "type": "string" },
        "Style": { "type": "string" },
        "Keywords": {
          "type": "array",
          "items": { "type": "string", "pattern": "^[^,]+$" },
          "description": "Serialized as one comma-separated line."
        },
        "Year": { "type": "string", "pattern": "^[1-9]\\d{3}$", "examples": ["2024"] },
        "Melody": { "type": "string", "description": "The tune the lyrics are sung to." },
        "Attachments": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^(?:(?:[A-Za-z][A-Za-z0-9+.-]*:\\/\\/\\S[^\\r\\n]*)|\\[[^\\]\\r\\n]+\\]\\((?:[A-Za-z][A-Za-z0-9+.-]*:\\/\\/\\S[^\\r\\n)]*)\\))$"
          },
          "description": "A bare URL or a Markdown link, one per line."
        },
        "Strumming Patterns": {
          "type": "array",
          "description": "One pattern per line, in reference order: {p: #1} is the first entry.",
          "items": {
            "type": "object",
            "required": ["pattern"],
            "additionalProperties": false,
            "properties": {
              "label": { "type": "string", "description": "Written above the pattern as a // comment line." },
              "pattern": {
                "type": "string",
                "pattern": "^[dDvVuU^xX1*+_.0\\-| \t]+$",
                "examples": ["d--u-- | d-u---"]
              }
            }
          }
        }
      }
    },
    "section": {
      "type": "object",
      "required": ["header", "lines"],
      "additionalProperties": false,
      "properties": {
        "header": { "$ref": "#/$defs/sectionHeader" },
        "index": {
          "type": "integer",
          "minimum": 1,
          "description": "Appended to the header to form the part name ('Verse 2'). Only for a section that allows numbering."
        },
        "lines": {
          "type": "array",
          "items": { "type": "string" },
          "description": "The fence body, one entry per line. A '//' line is a comment. An indented line under a lyric line is its translation."
        }
      },
      "allOf": [
        {
          "if": { "properties": { "header": { "$ref": "#/$defs/unnumberedHeader" } }, "required": ["header"] },
          "then": { "not": { "required": ["index"] } }
        }
      ]
    }
  }
}
```

### 8.3 Rules a schema cannot carry

Validate these yourself; they are cross-references, not shapes.

1. Part names are unique across `sections`.
2. Every `Structure` token names a section the document declares.
3. No `Structure` token repeats the one before it — raise its repeat count.
4. Only a numbered section may carry an index, in `Structure` as in a header.
5. Body lines must satisfy the section's body rule (§2): lyric, progression,
   mixed, or free text.
6. `{p: #N}` must point at an existing `Strumming Patterns` entry.

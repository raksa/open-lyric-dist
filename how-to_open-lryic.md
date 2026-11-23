# Open Lyric — how to use the library

`open-lyric` ships four framework-free components you compose on a page: two
previews, an editor, and the dashboard shell that arranges all three. No React,
no Vue, no build-time magic — you construct a class, give it a container, and
`await mount()`.

The song notation these components read is described in
[`schema.md`](./schema.md).

Scope: this document covers the `open-lyric` package only.

---

## Install

```bash
npm i open-lyric
```

`monaco-editor` (**0.57.x** — the peer range is `^0.57.0`, one minor, because
`Editor` imports some of Monaco's internal modules) is an **optional peer dependency**: install
it only if you use `Editor` or `OpenLyricDashboard`. Neither preview loads
Monaco. Its stylesheets need no wiring — the ESM modules import the CSS they
need, and those imports stay external for your bundler to pick up.

### Requirements

- **Browser only.** The module graph touches `document` at evaluation time, so
  it cannot be imported in bare Node — use a browser or a DOM-emulating test
  environment (jsdom, happy-dom).
- **A bundler is required.** Bare specifiers (`monaco-editor/…`, `marked`, …)
  stay external and some are ESM-only.
- **Pick one module condition.** Do not mix `import` and `require` of this
  package in one app: module-level state would fork into two copies.
- **Target ESM or CJS, not IIFE/UMD.** Assets resolve through
  `new URL(…, import.meta.url)`, which IIFE/UMD output does not carry.

---

## The four components

| Class                      | What it is                                         | Needs Monaco |
| -------------------------- | -------------------------------------------------- | ------------ |
| `OpenLyric`                | The song/lyric preview — chords, sections, exports | no           |
| `OpenLyricMarkdownManager` | The plain Markdown preview                         | no           |
| `Editor`                   | The editing surface, with optional toolbar chrome  | yes          |
| `OpenLyricDashboard`       | The three-panel shell that composes the above      | yes          |

Every one of them follows the same contract:

```text
container → value / theme → mount() → unmount() / reload() → destroy()
```

and the same `on(event, handler)` subscription, which returns its own
unsubscribe function.

---

## Render a song

````js
import { OpenLyric } from 'open-lyric';

const preview = new OpenLyric({
  container: document.getElementById('root'),
  value: '```ol:Chorus\nSing [G]out\n```\n',
  theme: 'dark',
});

await preview.mount();
````

Swap the song at any time — the preview re-renders on assignment:

```js
preview.value = nextSongMarkdown;
```

Tear it down when the view goes away:

```js
preview.destroy();
```

### Seeding with a bundled example

```js
import { OpenLyric, QUIET_RIVER_AT_DAWN_EXAMPLE } from 'open-lyric';

const preview = new OpenLyric({
  container,
  value: QUIET_RIVER_AT_DAWN_EXAMPLE,
});
```

Also exported: `EXTENDED_WORSHIP_BUILD_EXAMPLE`,
`BILINGUAL_MERCY_RESPONSE_EXAMPLE`, `REFRAIN_AND_TAG_LIFT_EXAMPLE`,
`BETWEEN_THE_VERSES_EXAMPLE`, `FIRE_ON_THE_ALTAR_EXAMPLE`,
`LEAD_LINE_OFFERING_EXAMPLE`, `HIGHER_THAN_THE_MORNING_EXAMPLE`,
`MARCH_OF_GRACE_EXAMPLE`, `COMMENTED_DRAFT_TEMPLATE_EXAMPLE`,
`TWELVE_EIGHT_LANTERNS_EXAMPLE`, `MARKDOWN_DECORATION_DEMO_EXAMPLE`.

---

## Read a song without rendering it

`getInfo()` and `getAttachments()` read the current `value` directly, so they
answer before `mount()`.

```js
const preview = new OpenLyric({ value: songMarkdown });

preview.getInfo();
// {
//   title: 'Quiet River at Dawn',
//   secondaryText: 'A Soft 6/8 Prayer · Open Lyric Team',  // subtitle · artist
//   key: 'G',                                              // the key in effect
//   metaLine: 'Key: G, Time: 6/8, Tempo: 68bpm',
//   structureLine: 'Structure: Intro - Verse 1 - Pre-Chorus - Chorus',
//   sections: [{ partName: 'Verse 1', repeatText: '', heading: 'Verse 1:' }, …],
//   attachments: [...],
// }

preview.getStructure();
// ['Intro', 'Verse 1', 'Pre-Chorus', 'Chorus', …]  — ordered part names
// (the flow only: song notes the Structure leaves out are not in it)

preview.getAttachments();
// [{ title: 'demo.mp3', type: 'audio', link: 'https://example.com/demo.mp3' }]

preview.getKeys();
// every key the song can be transposed into
```

`getInfo()` returns `null` when the value has no parsable song.

---

## Transpose and display settings

```js
preview.keyNote = 'A'; // transpose; '' restores the Config key
preview.isSimplified = true; // drop chord extensions
preview.isBarsHidden = true; // hide the leading | bar markers
preview.isKeyNotesHidden = true; // hide inline [chord] annotations
preview.isShowingCommentText = false; // hide the // authoring notes
preview.isShowingNotes = false; // hide the song notes under the song
preview.isControlHidden = true; // hide the floating gear / ⋮ controls
```

**Comments.** The `//` authoring notes inside the song's fences (the
`ol:Config` ones aside — they are strumming-pattern labels) are shown by
default, muted and verbatim: never transposed, simplified, or read as
notation. Pass `isShowingCommentText: false` to the constructor (on
`OpenLyric` or `OpenLyricMarkdownManager`) to start with them hidden. The
settings popup offers it as **Show comments**, its **Reset** turns it back
on, and changing it emits `display-change`.

**Song notes.** An `ol:Note` fence can be shown in two ways:

- **In the flow:** name it in the Structure (`IV1CN1V2CO`). It renders in
  that place like any section, with its flow index, and it is a slide in that
  place in a PowerPoint deck.
- **Under the song:** leave it out of the Structure. A note no Structure step
  names is listed after the song's sections, in a grid of its own
  (`.ol-song-view__notes`), each card marked `.ol-song-view__section--note`
  and without an index badge. A dashed divider labelled **Song notes**
  (`.ol-song-view__notes-divider`, `role="separator"`) splits that grid from
  the flow, so the notes do not read as more of the Structure. A render scoped
  to one such note has no flow to split from, so it draws no divider. The
  label follows the preview's label language. These notes are what
  `isShowingNotes` controls. It is on by default (pass
  `isShowingNotes: false` to the constructor to start with it off), and the
  settings popup offers it as **Show song notes**.

A note shows once either way: one the Structure names is never also listed
under the song. A note under the song is still a section of the song's
content. The getters include it as an entry of its own (keyed by its part
name, after the flow's parts), and it follows the song in the plain text.
`getStructure()` and `getInfo().sections` describe the flow, so they leave it
out. Changing `isShowingNotes` emits `display-change`, like the other display
settings. The standalone chrome's **Reset** turns it back on.

Font and persistence:

```js
preview.fontFamily = 'Georgia, serif';
preview.fontSize = '18px';

preview.saveSetting({ fontFamily: 'Georgia, serif', fontSize: 18 });
preview.loadSetting(); // → { fontFamily, fontSize } | null
preview.resetPreviewSetting();
```

---

## Export a song

Both getters are async and need no mount — only a DOM to stage in.

Whole song:

```js
await preview.getValue({ type: 'text' }); // plain text
await preview.getValue({ type: 'html' }); // HTML, styles inlined
await preview.getValue({
  type: 'png-image',
  width: 1920,
  height: 1080,
  backgroundAlpha: 0, // 0 → transparent PNG
  theme: 'light', // render in another theme than the screen
}); // → 'data:image/png;base64,…'
```

Section by section — one entry per part, keyed by part name, ideal for slides:

```js
const slides = await preview.getElementMap({
  type: 'png-image',
  isWithInfo: true,     // include the song's title card
  isWithKeyNote: false, // lyrics only
  isShowingIndex: false,
  width: 1920,
  height: 1080,
});

for (const [partName, dataUri] of Object.entries(slides)) { … }
```

Both getters also take `isShowingNotes` (`true` / `false`) to override
whether the song notes the Structure leaves out are included. Omit it to
follow the preview. `key` can name such a note; with `isShowingNotes: false`,
that map is empty.

Scope a map to one section with `key: 'Chorus'`. Add `css` to inject rules that
apply to the export surface alone, leaving the live preview untouched. A blank
line between stanzas renders as `.ol-preview-line.ol-preview-line--blank`, so
such rules can tell it from a sung line.

### Download as Presentation

The preview's actions menu (the ⋮ button) offers **Download as Presentation**.
It opens the **Presentation options** dialog first. **Download as PPTX**
writes the deck as a `.pptx`, **Download as HTML** writes the same deck as one web page
(see [Download as HTML](#download-as-html)), and **Cancel**, Escape or a click
outside the dialog writes nothing.

At the top of the dialog, a stage plays the deck the way a slide show does.
It starts on the first slide (the title slide, when it is on) and follows the
fields as they change:

- **‹** and **›**, a click on the stage, or the arrow keys, Space, Enter,
  Page Up/Down, Backspace, N and P while the stage has the focus step through
  the slides; Home and End go to the first and last. The position reads
  `2 / 12`.
- Going forward plays the chosen **Transition**, in its Direction and at its
  Speed. Going back cuts. A click during a transition ends it.
- Picking a Transition, Direction or Speed plays it on the slide shown.
  **Replay** plays it again, coming from the slide before (the first slide
  comes from black). With _None_, Replay is off.
- A click on a slide or its caption in the list puts that slide on the stage,
  with its transition when it lies ahead. The slide on the stage is marked
  in the list and scrolled into view.
- **Present** fills the screen with the stage (or the window, where the page
  may not go full screen) and draws each slide at full size. The show starts
  from black. After the last slide comes _End of slide show, click to exit_,
  and one more step ends the show. Escape ends it at any point. It does not
  close the dialog, and neither does an Escape that comes just after.
  While it presents, the display does not go to sleep: the stage holds a
  screen wake lock (`navigator.wakeLock`), lets go of it when the show ends,
  and takes it again when the page is shown after another tab. Where the
  browser has no wake lock, or the page may not use one (an embed without
  the permission, a page that is not a secure context), the display sleeps
  as the computer is set.
- When the system asks for less motion (`prefers-reduced-motion: reduce`),
  the stage plays a transition only on **Replay**. Picking a Transition,
  Direction or Speed, stepping forward and a click in the list all cut to the
  slide, and Present starts on the slide rather than from black. The deck
  itself keeps its transition.

The stage shows the slides only when the preview can draw them; without
that, the dialog has no stage and no list.

The dialog lists every slide of the deck in a column that scrolls on its own,
numbered as the deck numbers them. The title slide comes first when it is on.
Each slide is shown as it will be exported, and a section split over several
slides shows each part (`1/2`, `2/2`). A section sung again appears again in
its place in the flow. The list redraws as the fields change; each slide keeps
its old picture, dimmed, until the new one arrives.

The title slide shows the song's title, its subtitle and the Key/Time/Tempo
line, centred over the same slide background as the lyric slides (pattern and
gradient included). Its text stays editable text in the deck. Without a Text
color, its colours are picked to read on the slide's own colour.

Under each slide sit that slide's own choices:

- **Omit content** (lyric slides): keeps the slide in the deck but leaves it
  empty, showing only the slide background. Useful for an instrumental break,
  say.
- **Notes**: opens a box for the slide's speaker notes, which the deck carries
  as PowerPoint notes, one paragraph per line. Switching it off leaves the
  notes out but keeps what you wrote for as long as the dialog is open.
- **Blank slides after** (the title slide and lyric slides): 0–10 empty slides,
  showing only the slide background, inserted right after that slide. They
  appear in the list in place, each with its own Notes switch.

Each slide is its own: omitting the first Chorus leaves later Choruses as they
are. These choices belong to the song, not to the style. **Download as PPTX**
remembers them per song (by its title, in `openLyric.powerPointSlideChoices`
in browser storage), and the dialog opens on them the next time that song is
exported. A choice is tied to a slide's place in the flow, so after a change
to the song's Structure or to Lines per slide it may land on a different
slide.

**Slide style** picks a preset that sets every field:

| Preset          | Look                                                                                                                                                                                                                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default         | White outlined lines, two per slide, 64px, centred at the bottom on a see-through gradient band (95% × 40% of the slide, 70% transparent) over a grid, light theme. No card frame or section titles. With nothing saved, the dialog opens on it, with Morph moving the lyrics alone (_Text only_). |
| Classic         | The section card as the preview draws it, top-left, 48px. Lyrics only. The deck the export wrote before Default.                                                                                                                                                                                   |
| Centered        | No card, lines centred on the slide, 60px, section titles kept.                                                                                                                                                                                                                                    |
| Large lyrics    | No card or titles, centred, 84px, four lines per slide.                                                                                                                                                                                                                                            |
| Movie subtitles | White outlined text, two lines per slide, centred at the bottom of a black slide, 64px. No title slide.                                                                                                                                                                                            |

Each field can then be changed on its own. The preset reads **Custom** until
the fields match a preset again, and **Reset** goes back to Default, its Morph
included.

**Save preset**, beside the list, keeps the dialog's settings as a preset of
your own. Type a name and press Enter or **Save**. Saving under a name you
already use (whatever its capitals) saves over that preset. Your presets are
listed under **My presets**, after the built-in ones. Unlike a built-in
preset, one of your own keeps everything: the font, the picture and its shade,
and the transition with its direction, speed and Animate. Picking it brings
all of that back. While the fields match one of your presets, the list shows
its name. **Rename** then changes its name, in the same row Save preset opens
(a name another of your presets has is refused), and **Delete** removes it.
After a delete the fields stay as they are, so **Save preset** can bring it
back. Up to 50 are kept in browser storage (`openLyric.powerPointPresets`). A
picture several presets share is kept there once. If storage refuses one
(full, say, with a large picture), the dialog says so and nothing changes.

**Export presets** (shown once you have one) saves all of your presets as a
file, `open-lyric-presentation-presets.json`, pictures included. **Import
presets** adds the presets from such a file to your list. One with the name
of a preset you already have saves over it, the rest go at the end while
there is room, and the line under the list says how many came in. A file of
another dialog's presets, or one that is not a presets file, is refused. That
is how presets move to another browser, computer or editor.

Below the
preset, the fields sit in collapsible sections (Include, Layout, Colors,
Slide background, Card background, Card size, Slideshow). All start open, and
the dialog remembers which ones you closed
(`openLyric.powerPointDialogSections` in browser storage). The fields:

- **Include:** Key notes (the chords over the lyrics), Section titles, Section
  numbers (the flow-index badge), Card frame, Title slide, Song notes, Text
  outline, All caps.
  - _Song notes_ (on in every preset) adds the song notes the Structure leaves
    out as slides at the end of the deck, after the flow. Whatever the
    preview's **Show song notes** says, the deck follows this switch. A note
    the Structure names is a slide in its place either way. Switching it
    relists the slides.
  - _All caps_ sets the lyrics and section titles in capitals. The chords keep
    their case.
- **Font:** the same font picker as the preview's settings popup. It lists
  the faces the popup lists (a language plugin's `fontFaces` included),
  read again each time the list opens, or takes a font name typed in. _Use
  preview default_ keeps the preview's own font, and is the default. With no
  faces to list, it suggests a few common ones. Like the picture, shade and
  slideshow choices below, the font is not part of a preset: picking a
  preset keeps it.
- **Font size:** 24–120px, on the 1920×1080 slide.
- **Lines per slide:** _Whole section_, or 1, 2, 3, 4, 6 or 8. A longer section
  continues on the next slide. Blank lines are skipped.
- **Horizontal alignment** (Left / Center / Right) and **Vertical alignment**
  (Top / Middle / Bottom).
- **Colors:** a Color theme (_Follow preview_, Light, Dark), plus an optional
  Text color and Chord color. The title slide uses the same colours.
- **Slide background** and **Card background:** what fills the slide behind
  the card, and the section card itself. Both offer the same Fill choices:
  - _Default_ keeps the theme's own colour. Every preset starts here, except
    Movie subtitles, whose slide is solid black.
  - _Solid_ uses one Fill color.
  - _Gradient_ runs from the Fill color to a Second color: top to bottom, left
    to right, diagonal, or radial (from the centre out).
  - _Pattern_ draws dots, stripes, a grid or checks in the Second color over
    the Fill color.
  - _Glass_ (card only): frosted glass. The slide behind the card shows
    through blurred, under a light sheen tinted with the Fill color. With
    Card frame on, the pane also gets a light edge and a soft shadow.
  - _Picture_ (slide only): a picture of your own covers the slide. **Choose
    picture…** opens a file picker. The picture is scaled down to just cover
    the 1920×1080 slide and kept as a JPEG (a PNG stays a PNG), with a
    thumbnail in the dialog; **Remove** clears it. **Shade** (0–90%, 40% by
    default) darkens it so the lyrics stay easy to read. Over a picture the
    deck uses the dark palette's text colours unless you set a Text color.
    Until a picture is chosen, the slide keeps the theme's colour. The picture
    is remembered with the style. If browser storage is full, the style is
    kept without it.

  The card also has **Transparency** (0–100%), which lets the slide
  background show through it. It applies to every fill, _Default_ included,
  and thins a glass card's tint. Text and chords keep their own colours. A
  patterned slide behind a see-through or glass card makes the effect easy to
  see.

  A fill choice's unused fields don't count against a preset: picking a
  colour under _Solid_ and going back to _Default_ still reads as the preset.

  With **Card frame** off, a fill of your own covers the whole slide, while
  _Default_ leaves the card clear.

- **Card size:** Width and Height, each 10–100% of the 1920×1080 slide. At
  100% the card fills the slide. A smaller card is placed by the alignment:
  Horizontal alignment puts it left, centre or right, and Vertical alignment
  puts it at the top, middle or bottom. For example, Center + Bottom with a
  short height makes a band along the bottom of the slide. Text that does not
  fit is cut off at the card's edge.
- **Slideshow:** a **Transition** for how each slide comes on when the deck is
  presented. Every slide of the deck gets the same one. A fresh dialog starts
  on _Morph_, and _None_ writes no transition. The list holds every transition
  PowerPoint offers, in its own groups:
  - _Subtle:_ Morph, Fade, Fade through black, Push, Wipe, Split, Reveal, Cut,
    Random bars, Circle, Diamond, Plus, Uncover, Cover, Flash.
  - _Exciting:_ Fall over, Drape, Curtains, Wind, Prestige, Fracture, Crush,
    Peel off, Page curl, Airplane, Origami, Dissolve, Checkerboard, Blinds,
    Clock, Clock (counterclockwise), Wedge, Wheel, Ripple, Honeycomb, Glitter,
    Vortex, Shred, Switch, Flip, Gallery, Cube, Doors, Box, Comb, Zoom, Warp,
    Strips, Newsflash, Random.
  - _Dynamic content:_ Pan, Ferris wheel, Conveyor, Rotate, Window, Orbit, Fly
    through.

  A transition that can come from more than one way has a **Direction**: a
  side (_From bottom_, _From top_, _From right_, _From left_), a corner as
  well for Cover and Uncover, _Horizontal_ or _Vertical_, _In_ or _Out_, or
  for Split _Vertical out/in_ and _Horizontal out/in_. Each opens on its own
  default (Push comes up from the bottom, Wipe runs from the left), and a
  direction chosen for one is kept for when you come back to it. **Speed** is
  _Slow_ (2 s), _Medium_ (1 s) or _Fast_ (0.5 s); a transition outside
  _Subtle_ takes half as long again.

  _Morph_ starts each slide from the last frame of the one before: what the two
  slides share holds still, and what changed fades from one into the other.
  **Animate** is _Whole card_ (the default), where the whole slide moves —
  the card and its lyrics together — or _Text only_, where the card holds
  still and only the lyrics change (see below). Every transition but _Cut_
  offers it. Under Morph, _Text only_ fades one slide's lyrics into the next.
  Under any other transition, the lyrics before leave the way they came in —
  the transition's effect played backwards (with Push from the bottom, they
  drop back down) — and then the new slide's lyrics come on by it. The old
  lyrics' half and the new lyrics' half each take half the transition's
  length.

  Every transition is written the way PowerPoint 2010 and later write them,
  with a fade for a viewer that does not know it. Most play in any
  PowerPoint. Some need a newer one, and the dialog says so under the choice:
  - PowerPoint 2010: Reveal, Flash, Clock (counterclockwise), Ripple,
    Honeycomb, Glitter, Vortex, Shred, Switch, Flip, Gallery, Cube, Doors,
    Box, Warp and the whole _Dynamic content_ group.
  - PowerPoint 2013: Fall over, Drape, Curtains, Wind, Prestige, Fracture,
    Crush, Peel off, Page curl, Airplane and Origami.
  - PowerPoint 2019: Morph.

  Open Worship plays Morph, Fade, Fade through black, Push, Wipe, Split,
  Reveal, Cut, Random bars, Circle, Uncover, Cover and Curtains as
  themselves, and shows the others as a fade; the dialog says so for those.

Every lyric slide is a picture of the section, taken through
`getElementMap({ type: 'png-image', width: 1920, height: 1080, … })` with the
chosen options and a scoped `css`. The deck shows the song exactly as the
preview renders it, fonts included.

The slide background is kept apart from the lyrics. A Slide background of
your own (Solid, Gradient, Pattern or Picture) is drawn once, as a picture,
and set as every slide's PowerPoint background. The lyric picture on top
holds only the card and its text, and is see-through around the card. The
Default background is the deck's solid background colour, so it needs no
picture. Either way, an app that hides slide backgrounds when it shows the
deck shows the lyrics alone, over its own backdrop. The title slide and the
empty slides (Omit content, Blank slides after) have no picture of their
own: they are the slide background alone. The exception is a _Glass_ card:
its frost is a blurred copy of the slide behind it, so each lyric picture
still contains the slide background.

With Animate _Text only_ (any transition but Cut), each lyric slide has two
full-slide pictures over the background: first the card alone, then the text alone,
with each line where it is on the whole card. The card picture is drawn once
and is the same file on every lyric slide, under one shape name (`!!Card`,
which tells PowerPoint's Morph to match it). Each slide's text picture has a
name of its own (`Lyrics <slide>`), so Morph fades one slide's lyrics into
the next while the card stays put. A _Glass_ card's
picture holds the slide background it frosts, and the text picture is clear
around the text. A frameless card with the Default card background is
invisible, so it gets no card picture and the slides stay as with _Whole
card_. The title slide and the empty slides have no card picture.

Under any transition but Morph, _Text only_ is written as PowerPoint
animations rather than as the transition. A lyric slide that follows another
lyric slide has no transition of its own (whatever the deck's), so it cuts
in. On top of the card it carries a copy of the slide before's text picture
(`Lyrics before <slide>`), which plays an exit, then its own text picture,
which plays an entrance. Both start with the slide, with no click: the exit
first (_With Previous_), then the entrance (_After Previous_). Each effect is
PowerPoint's own preset that is nearest to the transition: Fade, Fly In
(from the transition's side, for Push, Cover, Uncover, Pan, Cube and the
other turning and sliding ones), Wipe, Split (also for Curtains, Doors and
Window), Shape (Circle, Diamond, Plus), Random Bars, Wheel (Clock is one
spoke), Wedge, Dissolve In, Checkerboard, Blinds (also for Comb), Strips, or
Zoom (also for Prestige, Crush, Warp, Newsflash and Fly through). A
transition with no likeness among them fades, and _Random_ picks one for
each slide. An exit is the same effect played backwards. A lyric slide after
the title slide or an empty slide still comes on with the transition, card
and all. PowerPoint's editor plays no animation, so there each of those
slides shows both text pictures, the old one over the new; the slide show,
Open Worship and the HTML export play them. The HTML export and the dialog's
stage play the same effects.

Each lyric picture carries the slide's words as its alternative text
(`descr`, PowerPoint's *Alt Text*), so a screen reader reads the slide and
the Accessibility Checker finds nothing missing: the section's name, then
the lines that slide shows, as the picture draws them — the words without
the chords over them, a `// comment` and a progression's bars as shown,
`{p:}` / `{c:}` cues left out, one line per line. The card picture, and a
picture with no words, are marked decorative instead (*Mark as decorative*,
PowerPoint 2019 and later).

The last style downloaded is remembered in
browser storage (`openLyric.powerPointSlideStyle`), and the dialog opens on it
next time.

#### Download as HTML

**Download as HTML** builds the very deck **Download as PPTX** would — the same
style, slide choices, notes and transition — and saves it as a single web
page instead, named like the `.pptx` (`Song-open-lyric.html`). It keeps the
options the way Download as PPTX does. Every picture and the viewer itself are inside
the file. Nothing is fetched, so it opens offline in any current browser and
can be mailed or copied as it is.

Each slide is laid out as in the `.pptx`: the slide background, the pictures,
and the title slide's text as real text.

- **Fonts.** A web font the page loads and the text is set in (a language
  plugin's Khmer face, say) is copied into the file, so the text reads in it
  on a computer that has none. Only the regular weight is copied, plus bold
  when some text is bold, up to 8 MB in all. A face the page cannot read the
  file of (one installed on the computer, or one another site serves without
  letting other pages download it) is named only. The text is then set in it
  where the viewing computer has it, and in Calibri, Carlito or Arial where it
  does not.
- **Pictures.** Where the browser can write WebP, each slide picture is
  stored as a WebP when that comes out smaller, which makes a deck of lyric
  slides a fraction of the size. Safari cannot, so its pages keep PNGs. Text that shrinks to fit in the deck shrinks to fit here too. Each
  slide plays its transition, as on the dialog's stage. _Random_ picks a
  transition each time.

The page opens on the **Slides** view: the slide, with ‹ › and Replay under
it, a strip of every slide down the side, and the slide's speaker notes. Its
top bar has:

- **Grid**: every slide as a card, with a size slider and a **Present**
  button on each card.
- **Present**: the show, full screen, from black. It ends on an end screen.
  The keys: → ↓ Space Enter N or a click for the next slide (during a
  transition, they finish it); ← ↑ Backspace P for the one before; Home and
  End; a slide's number then Enter to go to it; B or `.` for a black screen,
  W or `,` for a white one; R to replay the transition; A to pause
  auto-advance; F for full screen; Esc to end. Leaving full screen also ends
  the show.
- **Presenter view**: the current slide, the next one with its transition,
  the notes (A- / A+ size them), a timer and the clock, Black and White, and
  **Audience window**, which opens a second window that shows the slides
  alone and follows the presenter.
- **Settings**: the theme (_Match the system_, Light, Dark), **Motion**, Loop
  (start again after the last slide), a progress bar, and auto-advance every
  so many seconds. They are kept in the browser (`openLyricSlideshow.v1`).
  Motion is _Match the system_ (the default), _Play transitions_, or _Reduce
  motion: cut between slides_. While motion is reduced (by the setting, or by
  the system's `prefers-reduced-motion` under _Match the system_), slides cut
  in and a show starts on its slide instead of from black. Replay (and R)
  still plays the transition.
- **Screen**: while a show or the presenter view is up, in this window and in
  the audience window, the page holds a screen wake lock so the display does
  not sleep, as Present does; browsing the slides holds none.
- **Screen readers**: the slides are drawn as pictures, so the page says each
  one in words. A polite live region announces the slide shown — _Slide 2 of
  12_, then its words (each picture's alternative text, each text box's
  lines) — whenever the slide or the view changes, and the end of a show.
  Each filmstrip button is labelled the same way, and the pictures carry
  their alternative text as `alt`.

In the Slides and Grid views, F5 presents from the start and Shift+F5 from the
slide shown; S and G switch views, P opens the presenter view, T switches the
theme, and ? lists the keys. The address remembers the view and slide
(`#view=grid&slide=3`), so a link or a reload opens there.

The viewer's own words (its buttons, menus, help and messages) are in the
language the preview's labels are in. A language plugin translates them with
the rest of the preview, and the page says its language (`<html lang>`). A
preview mounted with `adoptContainer` keeps them in English, like its dialog.

### Download as Image

**Download as Image** in the same menu opens an options dialog too:
**Download** saves the image, and **Cancel**, Escape or a click outside the
dialog saves nothing. Beside the fields is a preview of the image. It is drawn
the way the download is, and redraws as the fields change. Above it is the
image's size in pixels.

Above the fields, **Preset** works like the presentation dialog's Slide
style. It reads _Custom_ once a field moves away from a preset. Its built-in
presets:

| Preset           | Options                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default          | The options **Reset** gives, the font included.                                                                                                   |
| Square post      | 1080 × 1080, dark, the words alone (no key notes, section titles, comments, notes, attachments or patterns), text 22px, margin 96, Shrink to fit. |
| Phone story      | 1080 × 1920, dark, the words alone, text 24px, margin 120, Shrink to fit.                                                                         |
| Widescreen slide | 1920 × 1080, dark, the words alone, text 24px, margin 96, Shrink to fit.                                                                          |
| Chord sheet      | The preview's width and the whole song, light, key notes, section titles, notes and patterns but no attachments, a PNG.                           |

Every preset but Default keeps the font you chose. **Save preset** keeps
every option under a name of your own, listed under **My presets**, with
**Rename** and **Delete** beside the list, and **Export presets** / **Import
presets** (`open-lyric-image-presets.json`) as in the presentation dialog.
Picking one brings every option back. The lyric preview's and the Markdown preview's
dialogs share these presets (`openLyric.imagePresets` in browser storage, up
to 50). The Markdown dialog has no Include section, so a preset applied there
keeps its Include switches unseen.

The fields sit in collapsible sections, which stay the way you left them
(`openLyric.imageDialogSections` in browser storage):

- **Size:** _Preview width_ (the default) keeps the preview's own width and
  the whole song's height. _Square_ (1080 × 1080), _Portrait_ (1080 × 1350),
  _Story_ (1080 × 1920) and _Landscape_ (1920 × 1080) are fixed sizes, and
  _Custom_ takes a Width (320–8000) and a Height (320–16000, or empty for the
  whole song). Sizes are the image's own pixels. A fixed height pads a short
  song with the background. **Shrink to fit** (on by default) draws a long
  song smaller until the whole of it fits the height. Title, cards and text
  shrink together, and the margin keeps its size. Off, a long song is cut off
  at the bottom. The song is never drawn larger, and it stops shrinking at a
  quarter of its size.
- **Look:** a Color theme (_Follow preview_, Light, Dark; a preview in a
  Bootstrap palette keeps it), a **Font** (the settings popup's font picker,
  as in the presentation dialog; the preview's own by default), **Text size** (off follows the preview; on, 10–64px), and
  **Margin** (0–400 image pixels around the song, 48 by default).
- **Include:** Key notes (the chords and `|` bars over the lyrics), Section
  titles, Comments (the `//` notes), Song notes (the notes the Structure
  leaves out, under the song), Attachments and Strumming patterns.
- **File:** JPEG (the default) or PNG, and, for a PNG, **Transparent
  background**.

The first time, the Include switches start on what the preview is showing
(Hide Keys, Show comments, Show song notes). After that the dialog opens on
the options last downloaded with (`openLyric.imageExportOptions` in browser
storage).

The image is `getValue({ type: 'png-image', … })` with those options. The
song is laid out at half the image's pixels and drawn at `pixelRatio: 2`, so
text reads at the size a phone or a slide shows it. Hidden section titles and
the margin are a scoped `css`, and a JPEG is that PNG re-encoded. An embed can
make the same image from code with the same call.

### Adding your own export buttons

A host can put its own buttons after **Download** in these dialogs (after
**Download as PPTX** and **Download as HTML** in the presentation dialog), for example a **Save to
Documents** that files the deck in the host's own list rather than the
browser's downloads. Register one on the preview with `addExportAction`:

```js
const remove = preview.addExportAction({
  id: 'save-to-documents',
  label: () => t('Save to Documents'), // your words, shown as given
  title: 'Save it in the Documents list', // optional tooltip
  kinds: ['powerpoint'], // omit for every export dialog
  async run({ kind, blob, fileName, mimeType }) {
    await saveToDocuments(fileName, blob);
    return `Saved ${fileName}`; // the finished status; omit for "Done"
  },
});

remove(); // or preview.removeExportAction('save-to-documents')
```

Choosing the button closes the dialog the way Download does, remembers the
options the same way, and builds the very file Download would — the same
style, slide choices, notes, size and format. The file then goes to `run`
instead of being downloaded:

| Field      | Value                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `kind`     | `'powerpoint'`, `'image'`, `'html'` or `'docx'`: the file it is.                                                              |
| `blob`     | The file's bytes.                                                                                                             |
| `fileName` | The name Download would have saved it under (`Song-open-lyric.pptx`, `….jpg`, `….png`, `….html`, `Song-markdown-preview.docx`). |
| `mimeType` | The `.pptx` media type, `image/jpeg`, `image/png`, `text/html;charset=utf-8` or the `.docx` media type.                       |

The panel's progress line shows the button's label while `run` works, then
the string `run` returns (or resolves with), or **Done** when it returns none.
If `run` throws or rejects, the line reads **Export failed** and the error goes
to the console; `run` is never retried.

- `kinds` picks the files: `'powerpoint'` is the `.pptx` of Download as
  Presentation, and `'image'` is Download as Image, on both the lyric preview
  and the Markdown preview (`OpenLyricMarkdownManager` has the same
  `addExportAction`). `'html'` is the slide show page Download as HTML writes
  (the fonts, pictures and words as described above). An action gets it only
  when its `kinds` lists `'html'`: leaving `kinds` out means `'powerpoint'`
  and `'image'`. Each kind it lists is a button of its own, so an action
  listing `['powerpoint', 'html']` shows twice in the presentation dialog,
  after Download and after Download as HTML. Give it a label that says which
  file it saves.
- `'docx'` is the Word document the Markdown preview's **Download as Docx**
  writes (see [Download as Docx](#download-as-docx)), and it too goes only to
  an action that lists it. That download has no dialog, so each such action
  is an item of its own in the ⋮ menu, right after Download as Docx, built
  each time the menu opens. Choosing it builds the same document and hands it
  to `run`. This holds for the standalone preview and for the Markdown panel
  of `OpenLyricDashboard` alike: add the action to
  `dashboard.openLyricMarkdownManager`. An item whose action was removed
  after the menu opened does nothing.
- `label` and `title` are your own text. They are never translated by the
  preview, so pass them already in the reader's language. A function is called
  each time a dialog opens, so a host that changes language stays current. An
  action whose label comes out empty is left out of that dialog.
- Buttons appear in the order the actions were first added. Adding another
  action with the same `id` replaces it in place; the old action's remover
  then does nothing.
- The list is read when a dialog opens: a dialog already open keeps the
  buttons it opened with.
- `getExportActions(kind?)` returns the actions added, those for one dialog
  when `kind` names it.

### Printing through the host

**Print** in a preview's ⋮ menu (on `OpenLyric` and `OpenLyricMarkdownManager`
alike, standalone or as a panel of `OpenLyricDashboard`) writes the song into
a window of its own,
light-themed, and prints it there. A page that may open no window, such as a
sandboxed frame, gets _Pop-up blocked_ instead. Such a host assigns `onPrint`,
and Print hands it the page rather than opening a window:

```js
preview.onPrint = async ({ html, fileName, title }) => {
  await openInBrowser(fileName, html); // your own way to print it
};
```

| Field      | Value                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------- |
| `html`     | The whole print page. It prints itself once it has loaded.                                     |
| `fileName` | A name for it, from the song: `Amazing-Grace-print.html`.                                      |
| `title`    | The song's title, or `''`.                                                                     |

The page needs nothing from the preview's own page:

- Its style sheets are written into it. Each is asked for as a `<link>` asks
  (`Accept: text/css`), and only an answer served as `text/css` (or with no
  type) is written in.
- The fonts the song is set in are embedded, the way Download as HTML embeds a
  deck's (see [Download as HTML](#download-as-html)).

A sheet or a font the page cannot read stays linked or named, as it was.

On paper the song keeps the face it is drawn in on screen, whether that comes
from the Font family setting or from the page around the preview. The window
Print opens does too.

While `onPrint` works, the progress line reads _Preparing print_, then _Sent
to print_. If it throws or rejects, the line reads _Print failed_ and the
error goes to the console. Leave it `null`, the default, to print in a window.

The dashboard's panels read it from the component the panel shows: set it on
`dashboard.openLyric` for the lyric panel's Print and on
`dashboard.openLyricMarkdownManager` for the Markdown panel's. Their page and
`fileName` are named as the panel's other exports are (after the document's
file name, else the song's title), and the lyric panel's leaves out the
controls a plugin added (`data-ol-plugin-ui`).

The Markdown preview's **Go to Markdown Doc** is a plain link (`<a
target="_blank">`) to the Markdown guide. A frame that may open no window
still follows a link the user clicks, or hands it to its host.

---

## The Markdown preview

```js
import { OpenLyricMarkdownManager } from 'open-lyric';

const markdown = new OpenLyricMarkdownManager({ container, value: text });
await markdown.mount();

markdown.getRenderedHtml();
markdown.getImageList();
markdown.getInfo();
```

### Download as Image

The Markdown preview's `⋮` menu has its own **Download as Image**, which
opens the same options dialog as the lyric preview's, minus the Include
section: it draws the document as the panel shows it. The fields are Size
(with Shrink to fit), Look (Color theme, Font, Text size, Margin) and File,
with a live preview beside them. The dialog opens on the options last
downloaded from a Markdown preview, kept apart from the lyric preview's
(`openLyric.markdownImageExportOptions` in browser storage). An empty preview
downloads straight away, without the dialog.
Export buttons added with `markdown.addExportAction({ kinds: ['image'], … })`
show here, after Download (see "Adding your own export buttons").

### Download as Docx

The standalone Markdown preview's ⋮ menu has **Download as Docx**, which
downloads the rendered document as a Word file, `<title>-markdown-preview.docx`,
named from the document's title as the image is. It has no options dialog:

- Headings, paragraphs, lists, quotes, tables, links and code come through.
  Each `ol:` fence card becomes its title in bold, then one paragraph per
  rendered line: Config entries as `Key: value`, chords in bold, a strumming
  pattern as written.
- Elements a plugin marked `data-ol-plugin-ui` are left out, as in Print.
- The text is set in the preview's font, under the name the face goes by
  outside the page (a plugin's `language.fontNames`, else the family itself).
  Code is set in Consolas.
- The file carries that font when the page loads it as one TrueType file
  (`@font-face`, `format("truetype")` or `.ttf`) whose `OS/2` `fsType` allows
  embedding: its regular face, obfuscated in the document as Word embeds
  fonts, so the document reads in it on a computer without it. Word draws
  bold from it. Its font key is written in capitals, the form the format
  defines; LibreOffice uses an embedded font only then. A face the computer has installed, a WOFF/WOFF2 or
  PostScript-outline file, a face split into `unicode-range` pieces, a
  restricted font, or a file past 4 MB is only named, and a computer without
  it shows Word's own substitute. The app pages' Download as Docx does the
  same.

`docx` is loaded on the first download, not before. While it works, the
progress line reads _Building Docx_, then _Starting download_ or _Conversion
failed_. An empty preview reads _Markdown preview is empty_ and downloads
nothing. Actions added with `markdown.addExportAction({ kinds: ['docx'], … })`
are menu items after it. The app pages keep their own Download as Docx, with
its file-name field, and list the same actions after it (the file named as
that field says).

### Editing a section from the rendered card

On a surface that also has an editor — `OpenLyricDashboard`, or the full
three-panel shell — every rendered section card carries an edit pencil at the
right end of its header. Clicking it replaces that card's body with a textarea
holding the section's own Open Lyric source lines; **Save** writes them back
into the document (one line per lyric line, added and removed lines included)
and the panels re-render from the new text, **Cancel** or `Escape` discards, and
`Ctrl`/`Cmd`+`Enter` saves — plain `Enter` inserts a lyric line. One save is one
undo step. `ol:Config` has no pencil: its fields are edited through their own
controls.

Under the textarea, **Insert chord** opens a chord panel so a chord never has to
be typed by hand: the chords the song already uses, the seven chords of the
`Config` `Key`, and a builder (root note, chord type — major, `m`, `7`, `m7`,
`maj7`, `sus2`, `sus4`, `add9`, `6`, `dim`, `aug` — and an optional bass note).
A tap puts the chord at the textarea's cursor in the notation the section
needs: `[G]` before the syllable in a lyric section, a bare space-separated `G`
in `Instrumental`/`Interlude`, and per line in `Intro`/`Outro`/`Turnaround`
(bare on a line that already reads as a progression). With the cursor on an
existing chord, the tap replaces that chord instead of adding a second one. The
chord goes into the textarea only — the document changes on **Save**, and
**Cancel** discards it with the rest of the edit. `Escape` closes the chord panel
first, then the editor.

A read-only embed — a bare `OpenLyricMarkdownManager` with no editor behind it —
renders the same cards without the pencils, and they never appear in a printout
or an exported image.

### Starting a song from a blank preview

When the document is empty (or only blank lines), the markdown preview shows a
card with a **Start a new song** button instead of nothing. Pressing it writes
the smallest song the notation accepts — an `ol:Config` fence with only the
two required fields (`Title` filled with a placeholder, `Structure: V1`)
followed by an empty `ol:Verse 1` — and opens the **Title** field's editor with the
placeholder selected, so typing replaces it. The starter validates with no
diagnostics, the write is one undo step, and nothing is written if the
document stopped being blank in the meantime. Optional fields are added
afterwards from the Config card.

The card is a control, not content: export and print treat a blank document as
empty. A read-only embed — a bare `OpenLyricMarkdownManager` with no editor
behind it — renders a blank document as blank.

### Adding, renaming and removing a section from the preview

Between the `ol:Config` card and the first section card sits an **Add Lyric**
button. It opens a picker with two controls — the section type (every fence the
notation defines: `Verse`, `Chorus`, `Bridge`, `Intro`, `Outro`, `Vamp`,
`Instrumental`, `Final-Chorus`, …) and a number, which is hidden for the types
that cannot be numbered. The number is pre-filled with the lowest one that type
has no section for yet, and leaving it blank gives an unnumbered section
(`ol:Chorus`). **Add section** writes an empty fence in after the last fence in
the document and opens that new card's lyric editor, so the next thing you do is
type. It does not touch `- Structure:` — use the **+** on the Structure row to
put the new section into the running order.

Every section card but `ol:Config` also carries a rename tag beside its title.
It opens the same picker over that section's current name, so `Verse 1` becomes
`Verse 3` — or `Bridge` — by picking rather than typing. A rename rewrites the
fence's ` ```ol: ` line _and_ every `- Structure:` step that named the old
part, repeat counts included, as a single edit and a single undo step; a name
another section already has is refused in the picker before anything is written.

Each card also carries a bin, last in the header. It asks before anything is
written, and the question says what else goes: **"Delete Verse 1? It is used 2
times in the running order — those steps will be removed too."** Confirming
removes the fence _and_ every `- Structure:` step that named it, as a single
edit and a single undo step; `Escape`, **Cancel** or a click outside dismisses
it. If removing a step leaves the same part on both sides of the gap, the two
merge and their repeat counts add up (`V1CV1` minus the `Chorus` becomes
`V1x2`), because the notation spells a part sung twice as a repeat rather than
as two tokens in a row. Emptying the running order entirely leaves
`- Structure:` declared with no value, the same as clearing any other field.
`ol:Config` has no bin — every song has exactly one.

Same availability rule as the pencils: a read-only `OpenLyricMarkdownManager`
embed shows none of these controls, and none of them reaches a printout or an
exported image.

### Editing a `Config` field from the rendered card

The `ol:Config` card edits field by field rather than as a block. `Key`, `Time`,
`Tempo`, `Locales`, `Structure` and `Attachments` each open their own picker,
and the free-text fields — `Title`, `Subtitle`, `Description`, `Artist`,
`Copyright`, `Theme`, `Genre`, `Style`, `Keywords`, `Year` and `Melody` — are
edited in place: click the value (or the pencil beside it, which is what a
keyboard reaches) and it becomes a
text input holding that field's source value. **Save** or `Enter` writes the one
source line back, **Cancel** or `Escape` discards, and one save is one undo
step. Clearing the input leaves the field declared but empty (`- Artist:`), and
an empty field shows an "Add <field>" prompt in its place.

The value is always written after the `- Field:` prefix the document already
has, so an in-place edit cannot rename a field or split it across lines; a
pasted multi-line value is joined onto one line. Fields whose value spans more
than one source line keep their read-only rendering.

Same availability rule as the section pencils: a read-only
`OpenLyricMarkdownManager` embed shows neither the pencils nor the "Add" prompts,
and neither reaches a printout or an exported image.

### Undo and Redo from the preview

The markdown preview's tool row (top right, beside the settings gear) carries
**Undo** and **Redo**, so a reader who never opens the text panel can take back
a saved verse, a rename, a deletion or a Config change. They walk the
document's own history: on the Monaco editor that is the same undo stack as the
editor toolbar and `Ctrl`/`Cmd`+`Z` in the text panel, so one in-preview
action is one step whichever button undoes it. Each button is disabled when
there is nothing to undo or redo, and both stand down while an in-preview
editor (a section textarea, a Config field, a rename picker) is open — undoing
then would re-render the panel and lose the unsaved draft; save or cancel it
first.

With focus anywhere in the markdown panel outside a text field,
`Ctrl`/`Cmd`+`Z` undoes and `Ctrl`/`Cmd`+`Shift`+`Z` (or `Ctrl`+`Y`)
redoes. Inside a text field those keys keep undoing the typing in that field.

On the simple textarea editor, and before Monaco has loaded, the history these
buttons walk holds the in-preview edits only; typing directly in the textarea
afterwards ends it, and the buttons will not replay an old step over text that
has changed since.

The lyric panel has no Undo/Redo of its own, and a read-only
`OpenLyricMarkdownManager` embed shows neither button.

---

## The editor

```js
import { Editor } from 'open-lyric';

const editor = new Editor({
  container: document.getElementById('editor'),
  value: songMarkdown,
  chrome: true, // toolbar + ⋮ tools menu (default)
  selectionState: true, // live "words / chars" readout
  saveShortcut: true, // own Ctrl/Cmd+S and emit `save` (default)
  verticalLines: [80], // guide rules at these columns
  fontSize: 15,
});

await editor.mount();
```

Reading and writing:

```js
editor.value = next;
editor.getValue();
editor.isDirty; // unsaved changes?
editor.markSaved(); // clear the dirty flag after your own save
editor.revertToSaved();
editor.requestSave(); // emit `save` programmatically
```

With `chrome: true` the tools menu's **Reset** asks before it calls
`revertToSaved()`, in a dialog inside the editor panel (**Discard Changes** /
**Keep Editing**), so the question also appears in a sandboxed iframe. It
opens with focus on its title rather than on a button, so on iOS the tap that
answers it is not swallowed. `revertToSaved()` itself never asks.

Commands: `undo()`, `redo()`, `clearText()`, `copyAllText()`, `focus()`,
`setSimpleMode(true)` (fall back to a plain textarea).

### Navigating to a section

```js
editor.getFences();
// [{ id, partName, startLineNumber, … }] — every ol: fence in the document

editor.focusPart('Chorus'); // caret to that section
editor.focusPart('Verse 2', { occurrence: 2 });
editor.focusFence(fenceId);
editor.focusRange(lineNumber, column);
```

The same index is available without an editor, straight from song text:

```js
import { listOpenLyricFences } from 'open-lyric';

const fences = listOpenLyricFences(songMarkdown);
```

### Wiring the preview to the editor

Attaching an editor upgrades a double-click in the preview into a caret jump:

```js
preview.editor = editor;
```

Without one, double-clicks still emit `part-dblclick` for you to handle.

---

## Events

```js
const off = preview.on('change', ({ value }) => { … });
off(); // unsubscribe
```

| Event               | Fires when                           |
| ------------------- | ------------------------------------ |
| `ready`             | `mount()` has completed              |
| `change`            | The value changed                    |
| `save`              | Ctrl/Cmd+S, or `requestSave()`       |
| `theme-change`      | The theme was reassigned             |
| `typography-change` | Font family or size changed          |
| `display-change`    | A preview display toggle changed     |
| `focus` / `blur`    | The surface gained or lost focus     |
| `part-dblclick`     | A preview section was double-clicked |
| `plugin-change`     | A plugin was added or removed        |
| `destroy`           | `destroy()` ran                      |

---

## Theming

Four themes: `'light'`, `'dark'`, `'light-bs'`, `'dark-bs'` (the `-bs` pair are
the Bootstrap-styled variants).

```js
import {
  OPEN_LYRIC_THEMES,
  OPEN_LYRIC_THEME_LABELS,
  isOpenLyricTheme,
} from 'open-lyric';

preview.theme = 'dark';
```

Stamp the stored/system theme onto `<html>` **before** anything renders, so a
page never flashes the wrong one:

```js
import { initializePageTheme } from 'open-lyric';

initializePageTheme(); // first statement of your entry module
```

---

## Plugins

A component takes plugins by id. The song-language support that this package
owns is `EditorOpenLyricPlugin`:

```js
import { Editor, EditorOpenLyricPlugin } from 'open-lyric';

const editor = new Editor();
editor.addPlugin('open-lyric', new EditorOpenLyricPlugin());

editor.hasPlugin('open-lyric');
editor.removePlugin('open-lyric');
```

Leaving it off is exactly how you get a plain Markdown editor with no song
notation.

A bare `Editor` with no dashboard has nothing to fill the plugin registry during
boot, so it must register the notation data itself or Monaco stays plain text:

```js
import { registerPlugin, olEditorOpenLyricPluginData } from 'open-lyric';

registerPlugin('open-lyric', olEditorOpenLyricPluginData);
```

`addPlugin(id, plugin)` is the same door any other plugin package goes through;
whatever a host composes is its own choice, and this package requires none.

### What a language plugin changes in a preview

A plugin's `contributes.language` is applied **per document**: a preview reads
the song's `ol:Config` `Locales` field, and the contribution takes effect only
while that field names a locale the plugin claims (`language.locales`, which
defaults to the plugin's id). A song that declares no matching locale renders
exactly as it would with nothing attached. Matching ignores case and works on
subtag boundaries, so `- Locales: km` matches a plugin keyed `km-KH`.

| `language` key | Effect on `OpenLyric` and `OpenLyricMarkdownManager`                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fontFamily`   | The stack the song renders in (`preview.resolvedFontFamily`). A host's own `preview.fontFamily` outranks it.                                                                                                                                  |
| `fontFaces`    | Faces added to the settings popup's font picker. Not per document — listed whenever the plugin is attached.                                                                                                                                   |
| `fontNames`    | `{ 'page-name': 'Real Name' }`: the name a face the plugin loads under a name of the page's own really goes by. An exported deck names the real one, since no computer has a font called `editor-…`. Applied whenever the plugin is attached. |
| `labels`       | Translations for the fixed labels the preview prints around the song, keyed by the English label (`preview.resolvedLabels` is the result).                                                                                                    |

`labels` is one table for all of a preview's fixed text, keyed by the English
the preview prints:

```js
preview.addPlugin('fr-FR', {
  id: 'fr-FR',
  apiVersion: 1,
  surfaces: ['lyric'],
  contributes: {
    language: {
      labels: {
        Attachments: 'Pièces jointes',
        Key: 'Tonalité',
        'Preview settings': 'Réglages',
        'Verse {0}': 'Couplet {0}',
        'Edit {0}': 'Modifier {0}',
      },
    },
  },
});
```

What it reaches:

- **The song header**, in both previews: the `ol:Config` field names (`Title`,
  `Subtitle`, `Description`, `Artist`, `Copyright`, `Locales`, `Key`, `Tempo`,
  `Time`, `Theme`, `Structure`, `Genre`, `Style`, `Keywords`, `Year`,
  `Melody`, `Attachments`, `Strumming Patterns`) and `Untitled Song`. These
  are rendered translated, so `getValue({ type: 'html' | 'png-image' })`
  carries them too.
- **Everything else a standalone preview builds**: the settings popup, the
  actions menu, export progress, the Markdown preview's editing controls,
  section titles and structure steps (`Verse 1`, `Chorus`), and every `title`,
  `aria-label`, `placeholder` and `label` (a select's group headings). This part is applied to the mounted DOM, and
  kept applied as the preview rewrites its text. It also covers the fields
  other plugins add to the settings popup.

Rules of the table:

- A key matches a whole piece of text exactly. A trailing colon is carried
  over, so `Verse` also translates `Verse:`, and so is the step counter the
  progress line writes after a label: `Building Docx` also translates
  `Building Docx (2/6)` and a status shown as the last step, such as
  `Sent to print (6/6)`.
- A key with `{0}` … `{9}` placeholders is a pattern for a caption built around
  a name: `'Edit {0}'` translates `Edit Title`, and what a placeholder captured
  is translated in turn (`Edit Verse 1 text` → the `Edit {0} text` and
  `Verse {0}` entries together). The longest matching pattern wins.
- A string with no entry (or a blank one) stays in English, and with several
  matching plugins the first attached one to translate a label wins.
- Only the preview's own text is looked at — controls, the popup and menus,
  section titles, structure steps. Lyrics, field values, chords and
  attachments are never translated. Put `data-ol-no-translate` on an element
  to keep its subtree as written, or `data-ol-translate` to opt one in.
- A preview mounted with `adoptContainer` translates the song header only; the
  page around an adopted panel is the host's own markup.
- Not translated: the plain-text form (`getValue({ type: 'text' })`) and the
  chord popup, which mounts on the page rather than in the preview.
- `preview.labelLocale` overrides the per-document rule for the labels only
  (the font stays document-driven). `'auto'` is the default; a locale tag such
  as `'km-KH'` prints every song's labels in that plugin's language whatever
  its `Locales` say; `'en'`, or a tag no attached plugin claims, prints
  English. Assigning it re-renders a mounted preview.

### Adding to a preview's settings popup and page

A plugin attached to `OpenLyric` or `OpenLyricMarkdownManager` can add fields
to the preview's settings popup (the gear) through `contributes.settings`:

```js
const plugin = {
  id: 'my-plugin',
  surfaces: ['lyric', 'markdown'],
  contributes: {
    settings: [
      {
        // `mount` is an empty `.topbar-settings__field` placed above Reset.
        render(mount, host) {
          mount.innerHTML = '<label class="topbar-settings__label">…</label>';
          return () => {}; // optional teardown
        },
        reset() {}, // optional; run by the popup's Reset
      },
    ],
  },
};
```

The fields follow the composition: they appear when the plugin is added and
go when it is removed, before or after `mount()`. They sit above the popup's
Reset. An adopt-mode `OpenLyric` puts them in its host's popup, above the
host's own `.topbar-settings__actions` row, or after the typography fields
when the popup has no such row; `resetPreviewSetting()` resets them. A
preview with no such plugin shows exactly the built-in popup.

The chord popup (the chord diagram a chord shows on hover or click) takes
controls too. Each time it opens it dispatches `OPEN_LYRIC_CHORD_POPUP_EVENT`
(`'open-lyric:chord-popup'`), bubbling, on the chord or `{p:#n}` pattern
reference that opened it:

```js
import { OPEN_LYRIC_CHORD_POPUP_EVENT } from 'open-lyric';

previewRoot.addEventListener(OPEN_LYRIC_CHORD_POPUP_EVENT, (event) => {
  const { kind, text, actions, panel } = event.detail; // kind: 'chord' | 'pattern'
  actions.append(myButton); // a row in the popup's header
});
```

`text` is the chord symbol or the pattern's notation. `actions` is emptied
each time the popup opens or closes, and stays hidden while empty, so the
popup looks as before on a preview nothing listens on. Listen on the preview's
own root to add controls only for that preview's chords.

`panel` is a slot below the header, likewise emptied and hidden each time the
popup opens or closes. To show content there, append it and set
`panel.hidden = false` — during the event or later, say from a button in
`actions`. While the panel shows, it takes the place of the popup's own guitar
diagram and chord variants, and the popup stays placed on its chord as its
size changes.

A plugin that puts its own elements into the rendered song (from
`onAfterRender`) should mark each one with the `data-ol-plugin-ui` attribute.
The menu's **Print** copies the preview on the page and leaves marked
elements out, as do the dashboard panels' print exports and the Markdown
panel's image export. **Download as Image**, `getValue()` and
`getElementMap()` render fresh markup, so plugin elements never reach them.

On `OpenLyric`, each strumming-pattern card carries what it is played in:
`data-pattern-source`, `data-pattern-index`, `data-pattern-label`,
`data-pattern-preview-time`, and, when the song has them,
`data-pattern-preview-key` (the key the song is shown in, a transposition
included) and `data-pattern-preview-tempo`. The Markdown preview's `Config`
card puts the same attributes on its pattern cards, with the `Key` as written.
`open-lyric-plugin-player` reads them to play the patterns.

---

## The dashboard shell

`OpenLyricDashboard` composes the editor and both previews into the full
three-panel application, and owns draft persistence.

```js
import {
  Editor,
  EditorPreferencesStore,
  OpenLyric,
  OpenLyricDashboard,
  OpenLyricMarkdownManager,
  initializePageTheme,
  preparePageEnvironment,
} from 'open-lyric';

initializePageTheme();

// Each surface installs its own panel styles and markup first.
OpenLyricDashboard.installShellStyle();
Editor.installShellStyle();
OpenLyric.installShellStyle();
OpenLyricMarkdownManager.installShellStyle();

OpenLyricDashboard.installShellMarkup();
Editor.installShellMarkup();
OpenLyric.installShellMarkup();
OpenLyricMarkdownManager.installShellMarkup();

// Clipboard / mobile-viewport / debug-console shims.
preparePageEnvironment();

const store = new EditorPreferencesStore();
const dashboard = new OpenLyricDashboard({
  container: document.querySelector('[data-ol-ref="app"]'),
  isWeb: true,
});

dashboard.openLyric = new OpenLyric();
dashboard.openLyricMarkdownManager = new OpenLyricMarkdownManager();
dashboard.editor = new Editor({ selectionState: true });

dashboard.loadValue = async () => store.loadDraft();
dashboard.onValueChange = async (value, { fileName, sharedDocumentDate }) => {
  store.saveDraft(value, fileName, { sharedDocumentDate });
};
dashboard.saveValue = async (value, { fileName, sharedDocumentDate }) => {
  store.saveDraft(value, fileName, { sharedDocumentDate });
};

await dashboard.mount();
```

`onValueChange` is the draft path: it runs on every edit and on every load.
`saveValue` is the save command — Ctrl/Cmd+S and the Save buttons — and
replaces the built-in `.md` download. The document reads as saved as soon as
the command is issued. If the promise `saveValue` returns rejects (or the hook
throws), the save is undone on screen: a document that had unsaved changes is
unsaved again, Reset goes back to the last text that was saved, and the status
line reads `Save failed — changes not saved`. Only the latest save counts: an
older save that fails after a newer one was issued changes nothing. A rejected
`onValueChange` is logged to the console and nothing else.

Panel visibility and document actions:

```js
dashboard.isEditorOpened = true;
dashboard.isMarkdownPreviewOpened = false;
dashboard.isLyricPreviewOpened = true;

dashboard.value; // current document text
dashboard.save();
dashboard.reset({ confirmFirst: true });
```

`reset()` discards the unsaved changes without asking; `{ confirmFirst: true }`
asks first, as the Reset button does. That question, and the file name
**Download** asks for, are dialogs inside the dashboard rather than the
browser's `confirm()` / `prompt()`, so they still appear in an iframe sandboxed
without `allow-modals`. Only a browser that cannot show a `<dialog>` gets the
native ones, and with no `prompt()` either Download keeps the current name.

`getActiveOpenLyricDashboard()` finds a running dashboard from anywhere on the
page.

---

## Persistence

`EditorPreferencesStore` wraps all browser-storage state — theme, panel
visibility, drafts, spellcheck preferences:

```js
import { EditorPreferencesStore } from 'open-lyric';

const store = new EditorPreferencesStore();
store.saveDraft(value, fileName);
store.loadDraft();
```

Drafts are kept twice: for the tab (`sessionStorage`, which a reload keeps)
and for every tab of the page's origin (`localStorage`, which a new tab
starts from). `loadDraft()` returns the tab's own draft whenever it has one,
however recently another tab wrote; a tab with none takes the shared draft
and carries on with it.

A tab never writes over a draft another tab wrote with other text: that one
is kept, up to five (one per tab, newest first; the oldest go first when
storage is full). Copies of a tab's own draft leave the list once that tab
writes again.

```js
store.loadKeptDrafts(); // [{ content, fileName, sharedDocumentDate, updatedAt, tabId, keptAt }]
store.removeKeptDraft(keptAt);
store.keepDraft({ content, fileName }); // add one yourself
```

On the app pages, a reload that kept another tab's draft says so in a toast
("This tab restored its own draft. Another tab's draft (…) was kept"), whose
**Show kept drafts** opens Reset Draft. That dialog lists the kept drafts
first, under _Drafts kept from other tabs_, by song title (else file name)
and when each was kept. Loading one takes it off the list; the text it
replaces goes on the list instead, unless it was saved to a file. A draft a
reload restored counts as unsaved, though the page opens it clean, until it
is edited and saved.

Constructed with one storage for both (`new EditorPreferencesStore(s, s, s)`),
the store keeps a single draft and no list.

The previews keep what they remember (the settings popup, the export
dialogs' choices and sections, saved presets, a plugin's own picks such as
the strum player's instrument) in the page's `localStorage`. A host whose
page does not keep it — a webview that gets a fresh one each time — can hand
them a storage of its own, before they mount:

```js
import { setOpenLyricPreferenceStorage } from 'open-lyric';

setOpenLyricPreferenceStorage({
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => {
    saved.set(key, value);
    persist(key, value);
  },
  removeItem: (key) => {
    saved.delete(key);
    persist(key, null);
  },
});
```

It works as `localStorage` does: string values, read and written at once
(keep a copy in memory and save it in the background), and a method may throw
when the storage is full or refuses. One storage serves the whole page, the
first-party plugins included. `setOpenLyricPreferenceStorage(null)` goes back
to `localStorage`, and `getOpenLyricPreferenceStorage()` returns the one in
use (`undefined` where there is none). What a preview has already read stays
as read, so set it first. `EditorPreferencesStore` (the editor's own state)
stays in `localStorage`.

---

## Package surface

| Import                | Contents                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `open-lyric`          | The four components, base classes, types, `EditorOpenLyricPlugin`, examples, `version`.    |
| `open-lyric/internal` | **Not public.** Shared internals for the first-party plugin packages. Do not depend on it. |

```js
import { version } from 'open-lyric';
```

`version` is this package's own version, taken from its manifest at build time,
so it always matches the release you installed.

Ships **ESM and CommonJS** with per-condition declarations: `dist/index.js` +
`dist/index.d.ts` under `import`, `dist/index.cjs` + `dist/index.d.cts` under
`require`.

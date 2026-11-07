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

```js
import { OpenLyric } from 'open-lyric';

const preview = new OpenLyric({
  container: document.getElementById('root'),
  value: '```ol:Chorus\nSing [G]out\n```\n',
  theme: 'dark',
});

await preview.mount();
```

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

const preview = new OpenLyric({ container, value: QUIET_RIVER_AT_DAWN_EXAMPLE });
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

preview.getAttachments();
// [{ title: 'demo.mp3', type: 'audio', link: 'https://example.com/demo.mp3' }]

preview.getKeys();
// every key the song can be transposed into
```

`getInfo()` returns `null` when the value has no parsable song.

---

## Transpose and display settings

```js
preview.keyNote = 'A';               // transpose; '' restores the Config key
preview.isSimplified = true;         // drop chord extensions
preview.isBarsHidden = true;         // hide the leading | bar markers
preview.isKeyNotesHidden = true;     // hide inline [chord] annotations
preview.isShowingCommentText = true; // show the // authoring notes
preview.isControlHidden = true;      // hide the floating gear / ⋮ controls
```

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
  theme: 'light',     // render in another theme than the screen
});                   // → 'data:image/png;base64,…'
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

Scope a map to one section with `key: 'Chorus'`. Add `css` to inject rules that
apply to the export surface alone, leaving the live preview untouched.

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
fence's ```` ```ol: ```` line *and* every `- Structure:` step that named the old
part, repeat counts included, as a single edit and a single undo step; a name
another section already has is refused in the picker before anything is written.

Each card also carries a bin, last in the header. It asks before anything is
written, and the question says what else goes: **"Delete Verse 1? It is used 2
times in the running order — those steps will be removed too."** Confirming
removes the fence *and* every `- Structure:` step that named it, as a single
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
`Copyright`, `Theme`, `Genre` and `Style` — are edited in place: click the value
(or the pencil beside it, which is what a keyboard reaches) and it becomes a
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
  chrome: true,         // toolbar + ⋮ tools menu (default)
  selectionState: true, // live "words / chars" readout
  saveShortcut: true,   // own Ctrl/Cmd+S and emit `save` (default)
  verticalLines: [80],  // guide rules at these columns
  fontSize: 15,
});

await editor.mount();
```

Reading and writing:

```js
editor.value = next;
editor.getValue();
editor.isDirty;       // unsaved changes?
editor.markSaved();   // clear the dirty flag after your own save
editor.revertToSaved();
editor.requestSave(); // emit `save` programmatically
```

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
The popup's **Download as Image** and **Print** copy the preview on the page,
and they leave marked elements out, as do the dashboard panels' image and
print exports. `getValue()` and `getElementMap()` render
fresh markup, so plugin elements never reach them.

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

Panel visibility and document actions:

```js
dashboard.isEditorOpened = true;
dashboard.isMarkdownPreviewOpened = false;
dashboard.isLyricPreviewOpened = true;

dashboard.value; // current document text
dashboard.save();
dashboard.reset({ confirmFirst: true });
```

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

---

## Package surface

| Import                | Contents                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `open-lyric`          | The four components, base classes, types, `EditorOpenLyricPlugin`, examples, `version`.      |
| `open-lyric/internal` | **Not public.** Shared internals for the first-party plugin packages. Do not depend on it.   |

```js
import { version } from 'open-lyric';
```

`version` is this package's own version, taken from its manifest at build time,
so it always matches the release you installed.

Ships **ESM and CommonJS** with per-condition declarations: `dist/index.js` +
`dist/index.d.ts` under `import`, `dist/index.cjs` + `dist/index.d.cts` under
`require`.

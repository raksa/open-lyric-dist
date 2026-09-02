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

`monaco-editor` (**0.56 or newer**) is an **optional peer dependency**: install
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

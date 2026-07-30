# open-lyric

Embeddable, framework-free Open Lyric components: the song **editor**, the
**markdown preview**, the **lyric preview**, and the **dashboard** shell that
composes all three.

The authoritative description of the component model, the lifecycle contract,
the event API, theming, and the plugin system is
[`research/editor-structure-implemented.md`](../../research/editor-structure-implemented.md).
This README covers only what is specific to the published package.

## Install

```bash
npm i open-lyric
npm i open-lyric-plugin-km-kh        # optional: Khmer language plugin
npm i open-lyric-plugin-transcript   # optional: audio → text plugin
```

`monaco-editor` is an **optional peer dependency**: install it only if you use
`Editor` or `OpenLyricDashboard`. The two previews never load Monaco. Its
stylesheet is imported by our code but left external, so your bundler pulls in
`monaco-editor/min/vs/editor/editor.main.css` automatically — nothing to wire
up by hand.

## Use

```js
import { OpenLyric } from 'open-lyric';

const preview = new OpenLyric({
  container: document.getElementById('root'),
  value: '```ol:Chorus\nSing [G]out\n```\n',
  theme: 'dark',
});

await preview.mount();
preview.getStructure(); // ordered part names
preview.destroy();
```

Every component follows the same lifecycle — `container` → `value`/`theme` →
`mount()` → `unmount()`/`reload()` → `destroy()` — and the same `on(event, fn)`
subscription surface.

## Module formats

Ships **ESM and CommonJS**, with per-condition TypeScript declarations:

| Condition | Code             | Types              |
| --------- | ---------------- | ------------------ |
| `import`  | `dist/index.js`  | `dist/index.d.ts`  |
| `require` | `dist/index.cjs` | `dist/index.d.cts` |

Verified against `moduleResolution: bundler` and `node16` (both `.mts` and
`.cts` consumers), and by executing both flavors in a real DOM.

## Exports

| Subpath               | Contents                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `open-lyric`          | The four components, base classes, types, and `EditorOpenLyricPlugin`.                                                    |
| `open-lyric/internal` | **Not public.** Shared internals the two first-party plugin packages import instead of duplicating. Do not depend on it. |

## Requirements and caveats

- **Browser only.** The module graph touches `document` at evaluation time, so
  it cannot be imported in bare Node. Use it in a browser, or a DOM-emulating
  test environment (jsdom, happy-dom).
- **A bundler is required.** Both flavors keep bare specifiers
  (`monaco-editor/…`, `marked`, …) external, and some of those dependencies are
  ESM-only. Your bundler resolves them; plain `node -e "require('open-lyric')"`
  will not.
- **Do not mix `import` and `require` of this package in one app.** The wrap
  phase keeps module-level state (`refs`, the id counter behind
  `linkFragmentIds`), so loading both flavors would give you two independent
  copies of it — the classic dual-package hazard. Pick one condition and let
  the plugin packages follow it.
- **IIFE/UMD output targets lose asset URLs.** Assets are referenced through
  `new URL(..., import.meta.url)`; a bundler targeting IIFE/UMD has no
  `import.meta`, and the dictionaries, fonts, and workers will not resolve.
  Target ESM (or CJS, which carries a `document.currentScript` shim).

## Build

Built from the repo root, not from this directory:

```bash
npm run pack                  # all three packages
npm run pack -- open-lyric    # just this one
```

Two passes (see `scripts/pack-packages.ts`): Vite bundles both flavors plus
every asset the editor sources import — SCSS, `?raw` HTML fragments, `?url`
dictionaries, the Monaco and spellcheck workers — then `tsc` emits
declarations, which are post-processed into ESM and CommonJS flavored trees
with flat entry points.

## Notes on the artifact

- **ESM + CJS**, `es2022`, with sourcemaps.
- **Assets are emitted as files**, not inlined, and referenced through
  `new URL(..., import.meta.url)` so they resolve correctly from
  `node_modules`. (This is why the build does not use Vite's `build.lib` mode,
  which force-inlines every asset regardless of `assetsInlineLimit`.)
- **~9 MB packed / ~26 MB unpacked**, of which ~16 MB is the Google Sans font
  family and ~0.5 MB the Battambang faces, pulled in by
  `editor/styles/font.scss` — the stylesheet the standalone chrome links for
  print and image export. The JS itself is ~730 kB (~166 kB gzipped) and Monaco
  stays external.
- **Wrap phase.** `OpenLyricDashboard` still drives the existing application
  underneath, so importing the barrel pulls in the whole app — including the
  km-KH and transcript plugin data. That is why the plugin packages are thin
  wrappers over `open-lyric/internal` rather than self-contained bundles, and
  why importing this package currently requires a DOM.

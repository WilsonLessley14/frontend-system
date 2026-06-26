# Bugs & Fixes

A running log of non-obvious bugs, their fixes, and *why* — so we don't rediscover them.

Newest first. Each entry: symptom → cause → fix → why.

---

## `Container` unusable from the barrel under `verbatimModuleSyntax`

- **Found**: 2026-06-26, scaffolding the receipt-ui consumer (`svelte-check` caught it).
- **Symptom**: in a consumer with `verbatimModuleSyntax` on (SvelteKit's default tsconfig),
  `import { Container } from '@wl/frontend-system'` + `<Container size="narrow">` failed type
  check with *"'Container' resolves to a type-only declaration and must be imported using a
  type-only import"* and *"Type 'string' has no properties in common with type
  '{ $on?…; $set?… }'"*. Every other component (`Stack`, `Text`, …) imported fine.
- **Cause**: a name collision in the public barrel (`src/lib/index.ts`). It exported both the
  **component** (`export { default as Container } from '…/container.svelte'`) and, from
  `config/layout`, the **type** `Container` aliased on export
  (`export { …, type Container as ContainerSize }`). Resolving the re-export pulled a
  type-only symbol named `Container` into the module, which merged with the component export
  and made the whole `Container` binding resolve as type-only under `verbatimModuleSyntax`.
  Only `Container` was affected because only it shared a name with a re-exported type.
- **Fix**: renamed the type at its source — `config/layout.ts` `Container` → `ContainerSize`
  (and its use in `container.svelte`), so the barrel re-export is now plain
  `type ContainerSize` with no aliasing and no name shared with the component. The component
  `Container` is the sole `Container` export; the public type name `ContainerSize` is
  unchanged, so this is **not** a breaking change for consumers. Shipped in v0.3.4.
- **Why**: a value export and a same-named type export in one barrel are ambiguous under
  `verbatimModuleSyntax`. Keep component names and exported type names disjoint — don't alias
  a type *to* a name, rename it *at the source* so the collision can't form.

## A newly-committed theme stays shadowed by a same-named draft in localStorage

- **Found**: 2026-06-23.
- **Status**: **deferred** (known, not yet fixed — see "Intended fix").
- **Symptom**: draft a theme in `/theme-builder` (e.g. "Aleksa"), then commit it the
  normal way (add to the `themes` registry, create `tokens/themes/<name>.css`, `@import`
  it in `styles.css`). It still renders as the *old draft* on every page. Deleting the
  draft in `/theme-builder` and reloading makes it finally render as the committed theme.
- **Cause**: `hydrate()` in `editor.svelte.ts` restores persisted **temporary** entries
  and `Object.assign`s the persisted `color` map over the config-derived committed values.
  A draft named `X` is `kind: 'temporary'` in `localStorage`, so on load it overwrites the
  freshly-committed `themeSet[X]` / `color[X]`. The root `+layout.svelte` then inline-applies
  `editor.color[X]` to `<html>`, and inline styles beat the committed `[data-theme='X']`
  stylesheet rule — so the stale draft wins until it's removed from storage (or storage is
  cleared).
- **Intended fix (deferred)**: in `hydrate()`, skip restoring a temporary entry whose name
  is now in the committed set (`initialThemeNames` / `themes`) — i.e. prefer a committed
  theme over a stale same-named draft. Best paired with a real "save/promote a theme" flow
  if/when one exists (today themes are committed by hand: export → code change + release).
- **Why deferred**: the collision only happens in the brief window where a draft and a
  newly-committed theme share a name, and deleting the draft resolves it immediately. Low
  impact under the current manual flow; revisit when theme-saving is automated.

## Draft themes rendered as `light` on every tab except `/theme-builder`

- **Found**: 2026-06-22.
- **Symptom**: a draft theme (e.g. "Random" copied from pink) looked right in
  `/theme-builder` but rendered like `light` on `/showcase` and `/playground`.
- **Cause**: only the editor routes inline-applied the editor's colors; the other tabs
  relied on the committed `[data-theme='X']` CSS. A draft has **no committed CSS rule**, so
  `data-theme="Random"` matched nothing and fell back to the `:root` (light) defaults.
- **Fix**: centralized application in the root `+layout.svelte` — hydrate the editor once
  and inline-apply the active `mode × theme` on every route. The editor is now the single
  live source of truth, so drafts (and unexported edits) render identically everywhere.
- **Why**: a draft only *exists* as editor state; if rendering depends on committed CSS,
  the editor state must be applied wherever the draft is selected — one place, the layout,
  not per-route.

## Resetting a draft theme turned every color black

- **Found**: 2026-06-22.
- **Symptom**: create a draft theme, click **Reset** → all roles become `#000000`, whole
  screen black; persisted across refresh.
- **Cause**: `resetColor(name)` reseeded from the committed `themes` registry
  (`seedColorFrom(themes[name])`). Drafts aren't in that registry → `undefined` → every role
  fell back to the `'#000000'` default.
- **Fix**: the editor now models themes as a discriminated set
  (`themeSet: Record<name, CommittedTheme | TemporaryTheme>`), each entry carrying its reset
  `base`. `resetColor` restores from `themeSet[name].base` — a draft's base is the snapshot
  it was copied from, so reset is always valid. Added `removeTheme` (type-guards on `kind`)
  so drafts can be deleted.
- **Why**: a draft needs its own stored reset target; deriving "reset" from a
  committed-only registry can't represent themes that aren't committed yet.

## `dark` theme rendered differently in `/theme-builder` vs other pages (hard mode)

- **Found**: 2026-06-22, reported as "the dark theme has different values on theme-builder."
- **Symptom**: in **hard mode + dark theme**, the border was light/white on `/showcase` and
  `/playground` but the theme's dark `#262b33` on `/theme-builder`; surfaces appeared to
  differ too. Same `data-mode`/`data-theme` should render identically everywhere.
- **Cause**: a cross-axis override — `modes/hard.css` set `--border: var(--fg)` (a
  "contrast border" feature) loaded after the theme files, so in hard mode the border
  became the foreground color (light in dark theme). That applied on normal pages, but
  `/theme-builder` previews edits by writing color roles as **inline** styles on `<html>`
  (`el.style.setProperty('--border', …)`), and inline styles beat the `[data-mode='hard']`
  stylesheet rule — so the builder showed the theme's real border, defeating the feature.
  Net: one page disagreed with the others.
- **Fix**: removed the hard-mode `--border` override. `--border` is now purely theme-driven
  in every mode, so all pages (incl. the builder, whose inline value now equals the
  committed value) render identically.
- **Why (the principle)**: the two axes (character `data-mode`, color `data-theme`) must
  stay **strictly orthogonal** — neither sets the other's tokens. A cross-axis override is
  inherently fragile: anything that re-asserts the overridden token (here, the builder's
  inline preview) silently diverges. Keep axes disjoint; if hard mode ever wants a
  distinct border again, express it as a character token (e.g. width), not by hijacking a
  color role.

---

## SSR `ERR_UNSUPPORTED_DIR_IMPORT` when a consumer imports the package

- **Found**: 2026-06-21, surfaced running the devlog dev server against `@wl/frontend-system@0.3.0`.
- **Symptom**: consumer dev server 500s on every page with
  `ERR_UNSUPPORTED_DIR_IMPORT: Directory import '.../dist/components/ui/button' is not
  supported resolving ES modules imported from '.../dist/index.js'`. Notably `npm run build`
  **passed** — only dev-mode SSR failed.
- **Cause**: the package barrel (`dist/index.js`) re-exports from component *directories*
  (`export * as Card from './components/ui/card'`). Node's native ESM resolver does not
  support directory imports (no automatic `/index.js`). In a production `vite build`, Rollup
  bundles the package and resolves those directories, so it's invisible. In dev-mode SSR,
  Vite **externalizes** the dependency and hands it to Node's ESM loader, which rejects the
  directory import. Additionally, the package ships `.svelte` source — Node can't load that
  without the Svelte compiler regardless — so the package fundamentally must be processed by
  the consumer's Vite pipeline, not externalized.
- **Fix** (consumer-side): tell Vite not to externalize the package for SSR, so it goes
  through Vite/Svelte processing:
  ```ts
  // vite.config.ts
  export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    ssr: { noExternal: ['@wl/frontend-system'] }
  });
  ```
  Now baked into `templates/consumer/vite.config.ts` and the setup docs.
- **Why this is the right fix (not "make the barrel paths explicit")**: even with explicit
  `/index.js` specifiers, the barrel still re-exports `.svelte` files, which Node cannot
  execute. A Svelte component library that ships source *must* be bundled by the consumer.
  `ssr.noExternal` is the standard SvelteKit mechanism for exactly this. SvelteKit
  auto-noExternals packages it detects as Svelte libs; declaring it explicitly is the
  reliable belt-and-suspenders.

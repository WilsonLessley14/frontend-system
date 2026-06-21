# frontend-system

A token-driven Svelte design system built on [shadcn-svelte](https://shadcn-svelte.com),
with **two independent design axes** instead of one.

Most systems give you light/dark — a *color* switch. This one adds a second, orthogonal
**character** axis: `soft` ↔ `hard`. Soft is rounded corners, diffuse shadows, and a
sans-serif voice; hard is sharp corners, hard offset shadows, thick contrast borders, and
a serif voice. Flip either axis on `<html>` and every component re-skins — no per-component
code, because all customization flows through design tokens.

```
data-mode  = soft | hard      ← character (radius, shadow, font, border, motion)
data-theme = light | dark     ← color   (surface, fg, accent, border, danger)
```

A `<Button>` only ever references semantic tokens (`var(--radius)`, `var(--accent)`), so the
2×2 of `{soft,hard} × {light,dark}` falls out of attribute changes alone.

## Highlights

- **Two-axis token system** — soft/hard character × light/dark color, fully orthogonal.
- **The full shadcn-svelte suite**, conformed to the tokens via a single `@theme` bridge —
  components inherit both axes with zero edits.
- **Layout primitives** (`Stack`, `Cluster`, `Grid`, `Container`) for intrinsic-responsive
  layout without scattered breakpoints.
- **Live editors** — `/playground` (tune the character tokens) and `/theme-builder` (pick
  color roles), both exporting committable CSS.
- **Distributable** — installable as `@wl/frontend-system`, pinned and delivered via a Nix
  flake; consumers theme entirely through tokens.

## Develop

```sh
nix develop        # pinned Node 22 (or use your own Node 18+)
npm install
npm run dev        # → http://localhost:5173
```

| Route | What it is |
|-------|------------|
| `/showcase` | The full component catalog under one active mode; toggle character/color at the top |
| `/playground` | Live-edit the soft/hard character tokens; export `modes/*.css` |
| `/theme-builder` | Live-edit the color roles per light/dark; export `themes/*.css` |

Common scripts:

```sh
npm run check      # svelte-check (type + a11y)
npm run package    # build the distributable library (svelte-package + publint) → dist/
```

## Use it in another project

A consuming Svelte/TS project onboards in one command:

```sh
nix flake init -t github:WilsonLessley14/frontend-system#consumer
nix develop                                 # sets $FRONTEND_SYSTEM_TGZ (the pinned tarball)
npm install && npm install "$FRONTEND_SYSTEM_TGZ"
npm run dev
```

The setup contract the template wires for you:

```css
/* app.css — Tailwind first, then the design system (it ships @source so Tailwind
   scans its components for class usage) */
@import 'tailwindcss';
@import '@wl/frontend-system/styles.css';
```

```html
<!-- app.html -->
<html data-mode="soft" data-theme="light">
```

```svelte
<script>
  import { Button, Card, Stack } from '@wl/frontend-system';
</script>
```

Peer deps the consumer needs: `svelte` 5, `tailwindcss` 4, `bits-ui`, `tailwind-variants`,
`clsx`, `tailwind-merge`, `@lucide/svelte`, `tw-animate-css`.

Everything is pinned in the consumer's `flake.lock`; bump with
`nix flake update frontend-system` then reinstall the tarball.

## Releasing an update (maintainer)

After changing a component or token, publish a new version:

1. **Bump the version** in `package.json` (and the matching `version` field in `flake.nix`).
2. **Sync the lockfile** — `npm install` (a version bump always rewrites `package-lock.json`).
3. **Recompute the deps hash** — because the lockfile changed, the flake's pinned
   `npmDepsHash` is now stale. Get the new one and paste it into `flake.nix`:
   ```sh
   nix run nixpkgs#prefetch-npm-deps -- package-lock.json
   ```
   (Skip this only if `package-lock.json` is unchanged — e.g. a component-only edit with
   no version bump. A stale hash makes `nix build` fail with the correct hash, so it's
   self-correcting either way.)
4. **Verify** — `nix build .#frontend-system` (runs `svelte-package` + `publint`).
5. **Commit & push** — `git commit -am "release: vX.Y.Z" && git push origin main`.

Consumers then pull it with `nix flake update frontend-system` + reinstall (see above).

**Nice shortcut.** Steps 1–4 are mechanical (and the hash recompute is easy to forget), so:

```sh
npm run release -- patch        # or: minor | major | 1.2.3
```

bumps the version, syncs `flake.nix`, recomputes `npmDepsHash`, and verifies the build —
then prints the `git commit` / `git push` to run. The publish itself stays in your hands.

## Theming

Don't edit components — customize through tokens:

1. **Switch axes** — set `data-mode` / `data-theme` on `<html>`.
2. **Retune values** — build a mode in `/playground` or a theme in `/theme-builder`, export
   the CSS, and `@import` it after the package stylesheet so its `[data-mode=…]` /
   `[data-theme=…]` rules win.

Tokens layer in three tiers: **primitives** (raw scales) → **semantic** (the role contract
components consume) → **axis files** (`modes/*`, `themes/*`) that remap the semantic roles.

## Project layout

```
src/
  lib/                         # the published library (@wl/frontend-system)
    index.ts                   # public API barrel
    styles.css                 # tokens + @theme bridge + @source (consumer stylesheet)
    utils.ts                   # cn() + element-ref types
    components/ui/             # the conformed shadcn-svelte suite
    design/
      tokens/                  # primitives, semantic, modes/*, themes/*
      components/layout/       # Stack, Cluster, Grid, Container
      config/                  # typed token + axis manifests (drive the editors)
      editor-format.ts         # pure token → CSS serialization
  routes/                      # the dev app (showcase, playground, theme-builder)
    _dev/                      # dev-only helpers (kept out of the package)
flake.nix                      # devShell, package tarball, consumer template
templates/consumer/            # the `nix flake init` template
DESIGN_SYSTEM.md               # full architecture & decision record
```

## Stack

SvelteKit · Svelte 5 (runes) · Tailwind v4 · shadcn-svelte · Bits UI · Nix flakes.

## More

See **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** for the architecture, the conform bridge, the
editor contracts, distribution details, and the full decision record.

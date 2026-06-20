# Frontend System — Design System Architecture

> Status: **draft for review**. This document defines the architecture before any
> buildout. It is the source of truth for *how* the system is structured and what
> rules keep it consistent — especially when an agent is generating pages.

## 1. Goal

A self-owned component + design system for Svelte where the **visual character of the
UI is configuration, not code**. Pages are composed from a closed vocabulary of
components and layout primitives so that generated markup stays clean and consistent.

Two things make this work:

1. A **closed vocabulary** of components with strict, typed props.
2. **Layout primitives** that compose without inventing custom CSS.

## 2. Core principle (the one rule)

> **Components reference only *semantic* tokens. Never primitives, never raw values.**

A component may write `border-radius: var(--radius)` but never `border-radius: 8px`
and never `border-radius: var(--radius-lg)` (a primitive). This single constraint is
what lets the entire system retheme by flipping an attribute, and what stops an
agent from emitting `#3b82f6` here and `#3c83f7` there.

## 3. The two-axis model

The system has **two orthogonal axes**, each implemented as a `data-*` attribute on
`<html>`. Each axis only remaps semantic tokens — components contain no per-mode logic.

| Axis | Attribute | Values | Controls |
|------|-----------|--------|----------|
| **Character** | `data-mode` | `soft` \| `hard` | radius, shadow, font, border width, transition feel |
| **Color** | `data-theme` | `light` \| `dark` | surface, foreground, accent, borders |

Because they are independent, they form a clean 2×2: `soft-light`, `soft-dark`,
`hard-light`, `hard-dark`. Adding a third axis later (e.g. `density`) is the same
pattern — a new attribute that remaps semantic tokens.

### Worked example — soft vs hard

```css
[data-mode="soft"] {
  --radius:        var(--radius-lg);     /* 16px */
  --shadow:        var(--shadow-soft);   /* 0 8px 24px rgb(0 0 0 / .12) */
  --font-body:     var(--font-sans);
  --border-width:  1px;
}
[data-mode="hard"] {
  --radius:        var(--radius-none);   /* 0px */
  --shadow:        var(--shadow-hard);   /* 4px 4px 0 rgb(0 0 0 / 1) */
  --font-body:     var(--font-serif);
  --border-width:  2px;
}
```

A `<Button>` styled with `var(--radius)`, `var(--shadow)`, `var(--font-body)`,
`var(--border-width)` transforms correctly across all four combinations with zero
component-level branching.

## 4. Token taxonomy (three tiers)

```
Primitive  →  Semantic  →  (optional) Component
 raw scales    named roles    component-specific overrides
```

### Tier 1 — Primitives (`tokens/primitives.css`)
The raw ingredients. Mode-agnostic. **Never consumed directly by components.**

```css
:root {
  /* spacing scale */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-8: 48px;

  /* radius scale */
  --radius-none: 0px; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;

  /* shadow scale */
  --shadow-soft: 0 8px 24px rgb(0 0 0 / .12);
  --shadow-hard: 4px 4px 0 rgb(0 0 0 / 1);

  /* fonts */
  --font-sans:  ui-sans-serif, system-ui, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;

  /* color ramps live here too (hues), not the role mapping */
}
```

### Tier 2 — Semantic (`tokens/semantic.css` + `modes/*` + `themes/*`)
The named *roles* components consume. These are what the two axes remap.

```css
/* the contract — what every component is allowed to reference */
/* --radius --shadow --font-body --border-width --transition         (from data-mode) */
/* --surface --fg --accent --border --muted                          (from data-theme) */
/* --space-* are shared and mode-agnostic                            (from primitives) */
```

### Tier 3 — Component tokens (optional, only when needed)
For a component that needs to diverge from a role, derive — don't hardcode:

```css
/* button/button.css */
.button { --button-radius: var(--radius); border-radius: var(--button-radius); }
```

Only introduce a component token when a component genuinely needs its own knob.
Default is to consume the semantic role directly.

## 5. Layout system

Two complementary pieces. Goal: the agent composes layout from primitives, not raw flexbox.

### 5a. Breakpoints & containers as typed config
Single source of truth in TS, mirrored into Tailwind's `@theme` so CSS and TS agree.

```ts
// config/layout.ts
export const breakpoints = { sm: 480, md: 768, lg: 1024, xl: 1440 } as const;
export const containers   = { narrow: 40, prose: 65, wide: 90 } as const; // rem
```

### 5b. Layout primitives (intrinsic responsiveness)
Based on the **Every Layout** approach — components that respond to *available space*,
reducing reliance on breakpoints. Breakpoints become the exception, not the rule.

| Primitive | Responsibility |
|-----------|----------------|
| `Stack`     | Vertical rhythm; consistent gaps between stacked children |
| `Cluster`   | Horizontal group that wraps as needed (toolbars, tag lists) |
| `Switcher`  | Flips horizontal → vertical based on available width (no breakpoint) |
| `Grid`      | Auto-fit grid with a `min` track size |
| `Sidebar`   | Content + sidebar that collapses intrinsically |
| `Container` | Max-width wrapper keyed to the `containers` scale |

```svelte
<Stack gap="4">
  <Grid min="20rem"> … </Grid>
  <Cluster gap="2"> … </Cluster>
</Stack>
```

## 6. Folder structure

```
src/
  lib/
    design/
      tokens/
        primitives.css      # tier 1 — raw scales, mode-agnostic
        semantic.css        # tier 2 — role contract
        modes/
          soft.css          # [data-mode="soft"]
          hard.css          # [data-mode="hard"]
        themes/
          light.css         # [data-theme="light"]
          dark.css          # [data-theme="dark"]
      config/
        modes.ts            # typed manifest of axes/tokens — drives playground UI
        layout.ts           # breakpoints + container scale
      components/
        ui/                 # shadcn-svelte components copied here (you own source)
          button/ card/ input/ …
        layout/             # the layout primitives above
          stack.svelte cluster.svelte switcher.svelte
          grid.svelte sidebar.svelte container.svelte
  routes/
    showcase/+page.svelte   # toggle-driven catalog (see §7)
    playground/+page.svelte # live token editor (see §8)
components.json             # shadcn-svelte config
```

## 7. Showcase contract

Purpose: see the *cohesive* design under one active mode at a time — because modes
never sit next to each other in real use.

- Renders the **full component catalog** under the **single currently-active mode**.
- **Toggles** at the top switch `data-mode` (soft/hard) and `data-theme` (light/dark)
  globally; the whole catalog re-renders in the chosen combination.
- A separate **Compare** view (opt-in) renders the 2×2 grid side-by-side for spot-checking
  a single component for drift — not the default, used only when hunting inconsistency.

## 8. Editor routes — `/playground` & `/theme-builder`

The "tweak live, produce committable config" goal is split across two routes, one per
axis. Both render the **shared `Preview`** component (`components/preview.svelte`, the
same catalog `/showcase` uses) beside a control panel, write overrides live to
`document.documentElement`, persist to `localStorage`, and emit full-file exports.

| Route | Axis | Edits | Controls source | Exports |
|-------|------|-------|-----------------|---------|
| `/playground` | Character (feel) | `--radius`, `--shadow*`, `--font-*`, `--border-width`, `--transition`, `--letter-spacing` | `characterTokens` in `config/tokens.ts` | `modes/soft.css`, `modes/hard.css` |
| `/theme-builder` | Color (look) | the semantic color roles, picked per role | `colorRoles` in `config/tokens.ts` | `themes/light.css`, `themes/dark.css` |

- **Axis selection reuses `<ModeControls>`**: in `/playground` the Character toggle picks
  *which mode you edit*; in `/theme-builder` the Color toggle picks *which theme you edit*.
  The other axis just changes what the preview shows.
- **Manifest-driven**: controls are generated from the typed manifests in
  `config/tokens.ts`, so adding a token/role surfaces a new control automatically.
- **Live apply is route-scoped**: overrides are written to `<html>` while you're on the
  editor and cleared on navigate away, so `/showcase` always reflects committed CSS. The
  edits themselves persist in `localStorage`.
- **Pure core / thin shell**: serialization lives in `editor-format.ts` (pure, testable);
  DOM/storage/export wiring in `editor.svelte.ts`.

### Export workflow (full-file)

The v1 export is intentionally dumb: it writes whole files, you overwrite and commit.

1. In the editor, tweak until the preview looks right.
2. Click **Export**. The panel emits the complete file contents (e.g. the full
   `modes/soft.css`), with the target path shown above it.
3. Copy it over the corresponding file in `src/lib/design/tokens/`.
4. Reload `/showcase` to confirm, then commit the changed token file.

No patching, no merge step — the exported file *is* the new source of truth. Exports emit
literal resolved values (e.g. `16px`, `#2563eb`) rather than primitive refs; the primitive
scale remains an optional palette. (Diff/patch export is a possible future upgrade; §10.)

## 9. Tech stack

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | **SvelteKit** | scoped styles; CSS vars pierce component boundaries cleanly |
| Components | **shadcn-svelte** | you own the source; CSS-var theming; variants via `tailwind-variants` |
| Headless primitives | **Bits UI** | accessibility layer under shadcn-svelte (Radix equivalent) |
| Styling | **Tailwind v4** | `@theme` block *is* CSS-variable config — aligns with "design as config" |

## 10. Decisions (resolved) & future considerations

These were open during review and are now settled for v1. Items marked *future* are
deliberately deferred, not rejected.

| Question | Decision (v1) | Future |
|----------|---------------|--------|
| Tailwind vs plain CSS vars | **Use Tailwind v4** — work with shadcn-svelte's implementation rather than fighting it; `@theme` reinforces the CSS-variable model | — |
| Serif / custom fonts | **System font stacks only** | Revisit bundled/self-hosted fonts later; §4 leaves a clean seam |
| Axes | **Keep the two axes** (`data-mode`, `data-theme`) | Once the pattern is set and functioning, explore more axes/themes (e.g. `density`). Mechanism is already generic |
| Playground export format | **Full-file export** — simplest; workflow documented in §8 | Diff/patch export |
| Color ramps | **Hand-picked** | Add a **color-picker Themes tab** in the playground to author themes (§8) |
| Page-building agent manifest | **No manifest for now** — the agent reads component source directly | Generate a machine-readable manifest (JSON schema of components + allowed props + tokens consumed) once the component set stabilizes |

## 11. shadcn-svelte integration (the conform bridge)

The main shadcn-svelte suite is vendored under `src/lib/components/ui/` (we own the
source). Rather than edit each component, we **conform** them with a single bridge in
`src/app.css` so they inherit both axes automatically.

**How it works**

- `@theme inline { ... }` aliases every shadcn/Tailwind theme token onto our semantic
  tokens — e.g. `--color-primary: var(--accent)`, `--radius-lg: var(--radius)`,
  `--shadow-md: var(--shadow)`, `--font-sans: var(--font-body)`. Because `inline` makes
  Tailwind emit the value directly, `bg-primary` compiles to
  `background-color: var(--accent)` and `rounded-lg` to `border-radius: var(--radius)`.
  Our axis files flip those underlying tokens, so the components retheme live.
- `@custom-variant dark (&:is([data-theme='dark'] *))` binds Tailwind's `dark:` variant
  to our `[data-theme]` attribute (shadcn defaults to a `.dark` class, which we don't use).

**Naming rule (collision avoidance)**

Tailwind v4 owns the `--radius-*`, `--font-sans`, and `--font-serif` theme namespaces.
Our *primitives* therefore use distinct names — `--rad-*` and `--font-*-stack` — so they
never shadow (or circularly reference) Tailwind's tokens. The bridge is the only place
the two namespaces meet.

**Updating / adding components**

`npx shadcn-svelte@latest add <name>` drops new components in; the bridge keeps them
conformed with no extra work. (Note: `init` in CLI v1.3 requires a design-system
*preset*; we skip it and maintain `components.json` directly, since we override the
generated theme anyway.)

**Component edits applied (we own the source)**

Two shadcn components were tweaked to match our design language; future re-adds would
need re-applying (or upstreaming to our own variants):
- `card.svelte` — swapped the faint `ring` for a real `border` (so it picks up the
  contrast border) and added `shadow-md`.
- `button.svelte` — added `shadow-xs` to the solid/outline/secondary/destructive
  variants (not ghost/link), per the original soft/hard "buttons cast shadows" vision.

**Load order & a deliberate cross-axis exception**

Token files load primitives → semantic → themes → **modes last**. Modes load after
themes so a *character* trait can intentionally override a *color* role: hard mode sets
`--border: var(--fg)`, a high-contrast outline that resolves correctly in both light and
dark. This is the one sanctioned place the two axes cross; keep it the exception.

**Known gap (v1)**

`--border-width` (1px soft / 2px hard) applies to our own chrome, but shadcn components
use Tailwind's fixed `border` utility (1px) — so their hard-mode border is contrasting
(color) but not thicker (width). Deferred; radius, shadow, font, and the contrast border
already carry the soft/hard distinction strongly.

## 12. Distribution (consuming from other projects)

**Model: installed package.** Because all customization flows through tokens, consumers
don't fork components — they import them and retheme via tokens. (Decided over editable
copy-in; see the eject escape hatch as a possible future.)

**Boundary.** `src/lib` is the *publishable library*; `src/routes` is the *dev app* (the
showcase/playground/theme-builder and their helpers in `src/routes/_dev/`). Nothing in
`src/lib` may use SvelteKit-only imports (`$app/*`) — that keeps the package usable by
plain Svelte+Vite consumers, not just SvelteKit.

**Self-contained imports.** shadcn components ship importing `$lib/utils`, which assumes
they live in the consumer's app. For packaging, every `$lib/…` import in `src/lib` was
rewritten to a depth-correct relative path, so the built package resolves on its own.
`src/routes` still uses `$lib` (correct for the dev app).

**Public API.** `src/lib/index.ts` is the barrel: simple components (`Button`, `Input`,
…), compositional namespaces (`Card`, `Dialog`, …), layout primitives (`Stack`,
`Cluster`, `Grid`, `Container`), `cn`, the token config/manifests, and the pure
`editor-format` helpers. `package.json` `exports` map: `.` → the barrel, `./styles.css` →
the token + bridge stylesheet. Built with `svelte-package` (`npm run package` → `dist/`),
checked by `publint`.

**Consumer setup contract** (ships via the flake template in Phase 2):
1. Install the package + peers: `svelte` 5, `tailwindcss` 4, `bits-ui`, `tailwind-variants`,
   `clsx`, `tailwind-merge`, `@lucide/svelte`, `tw-animate-css`.
2. In the Tailwind entry: `@import 'tailwindcss';` then `@import '@wl/frontend-system/styles.css';`
   (the package ships `@source` so Tailwind scans its components).
3. Set `data-mode` / `data-theme` on `<html>`.
4. `import { Button } from '@wl/frontend-system';`

**Nix (`flake.nix`).** The flake exposes:
- `devShells.default` — pinned Node 22.
- `packages.default` — `buildNpmPackage` that runs `npm run package` and outputs both
  `dist/` and a `npm pack` tarball (`frontend-system.tgz`) in the store. `npmDepsHash` is
  pinned; recompute after lockfile changes with
  `nix run nixpkgs#prefetch-npm-deps -- package-lock.json`.
- `templates.consumer` — `templates/consumer/`, a minimal SvelteKit app pre-wired with the
  setup contract (`nix flake init -t github:WilsonLessley14/frontend-system#consumer`).

Consumers add the design system as the flake input `frontend-system`; its devShell sets
`$FRONTEND_SYSTEM_TGZ` to the pinned tarball, installed via `npm install "$FRONTEND_SYSTEM_TGZ"`.
JS resolution rides a normal dep; the flake pins it reproducibly in the consumer's
`flake.lock`. Bump with `nix flake update frontend-system` + reinstall the tarball.
```

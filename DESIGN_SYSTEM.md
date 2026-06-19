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

## 8. Playground contract

Purpose: tweak the system live, without code changes — and have that produce committable config.

- A `<ModeControls>` panel binds inputs to `data-mode`, `data-theme`, and individual
  `--token` overrides written live to `document.documentElement`.
- State persists to `localStorage` so a session survives reload.
- The panel's controls are **generated from `config/modes.ts`** — adding a new token to
  the manifest makes a new control appear automatically, no playground edits.
- An **Export** button serializes the current variable set back into `modes/*.css` +
  `config/*.ts` form. Playing around *produces* the config you commit — closes the loop.
- A **Themes** tab (planned) with a color picker for hand-building new color themes,
  exporting them as `themes/*.css` files. See §5 decision on color ramps.

### Export workflow (full-file)

The v1 export is intentionally dumb: it writes whole files, you overwrite and commit.

1. In `/playground`, tweak modes/themes/tokens until the preview looks right.
2. Click **Export**. The panel emits complete file contents for each changed file
   (e.g. the full `modes/soft.css`, not a diff).
3. Copy each emitted file's contents over the corresponding file in
   `src/lib/design/tokens/`.
4. Reload `/showcase` to confirm, then commit the changed token files.

No patching, no merge step — the exported file *is* the new source of truth for that
token group. (A diff/patch export is a possible future upgrade; see §10.)

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
```

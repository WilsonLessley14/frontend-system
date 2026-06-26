---
name: frontend-system
description: >-
  Build UIs with the @wl/frontend-system Svelte design system — the component
  vocabulary, the two-axis (mode × theme) token model, layout primitives,
  theming, and consumer install/setup. Use when building pages or components in
  any project that consumes @wl/frontend-system, when setting up a new consumer
  project, or when theming/extending the system. Covers everything needed
  without reading the design-system repo or the consumer template.
---

# @wl/frontend-system

A token-driven Svelte 5 + Tailwind v4 design system (built on shadcn-svelte/Bits UI).
You compose pages from a **closed vocabulary** of components + layout primitives and
customize **entirely through tokens** — never by editing components.

## The one rule

**Components and your CSS reference only _semantic_ tokens — never raw values, never
primitives.** Write `border-radius: var(--radius)`, not `8px` and not `var(--radius-lg)`.
This is what lets the whole UI re-skin by flipping one attribute.

## The two axes (set on `<html>`)

| Attribute | Values | Controls |
|-----------|--------|----------|
| `data-mode` | `soft` \| `hard` | radius, shadow, font, border-width, transition (the *character*) |
| `data-theme` | `light` \| `dark` \| `pink` \| `Aleksa` \| … | surface, fg, accent, border, danger (the *color*) |

They're orthogonal and compose freely (`soft`+`dark`, `hard`+`pink`, …). Components contain
no per-mode/per-theme logic; the axes just remap semantic tokens.

**Discover available themes at runtime** — don't hardcode the list:

```ts
import { themeNames } from '@wl/frontend-system'; // ['light','dark','pink','Aleksa',...]
```

## Semantic tokens (the only ones you may reference)

- **From `data-theme`:** `--surface` `--surface-raised` `--surface-sunken` `--fg` `--fg-muted`
  `--border` `--accent` `--accent-fg` `--danger` `--danger-fg`
- **From `data-mode`:** `--radius` `--radius-control` `--shadow` `--shadow-control`
  `--font-body` `--font-heading` `--border-width` `--letter-spacing` `--transition`
- **Shared (mode/theme-agnostic):** `--space-0 … --space-10` (4px-stepped spacing scale)

Tailwind utilities are bridged onto these, so prefer them in markup:
`bg-background` `text-foreground` `bg-card` `bg-primary`/`text-primary-foreground`
`bg-secondary` `bg-muted`/`text-muted-foreground` `border-border` `bg-destructive`
`rounded-lg`/`rounded-md` (→ radius) `shadow-md` (→ shadow). Don't reintroduce bespoke
color vars or hex literals.

## Component vocabulary

```ts
import { Button, Badge, Input, Textarea, Label, Checkbox, Switch,
         Separator, Skeleton, Stack, Cluster, Grid, Container, Text, cn } from '@wl/frontend-system';
```

**Simple components** (named imports): `Button` `Badge` `Input` `Textarea` `Label`
`Checkbox` `Switch` `Separator` `Skeleton`.

- `Button` — `variant`: `default` \| `outline` \| `secondary` \| `ghost` \| `destructive` \| `link`;
  `size`: `default` \| `sm` \| `lg` \| `icon`; standard `onclick`, `disabled`, etc.

**Compositional namespaces** (`import * as` — use the `.Part` subcomponents):
`Card` `Dialog` `Select` `Tabs` `Accordion` `Alert` `Avatar` `Table` `Tooltip`
`RadioGroup` `DropdownMenu` `Popover` `Breadcrumb`.

```svelte
<script>import { Card } from '@wl/frontend-system';</script>
<Card.Root>
  <Card.Header><Card.Title>Title</Card.Title><Card.Description>…</Card.Description></Card.Header>
  <Card.Content>…</Card.Content>
</Card.Root>
```

## Layout primitives (compose layout from these, not raw flexbox/grid)

| Primitive | Props | Use |
|-----------|-------|-----|
| `Stack` | `gap` (space scale, default `4`) | vertical rhythm |
| `Cluster` | `gap` (default `3`), `align` (default `center`) | horizontal group that wraps (toolbars, tags) |
| `Grid` | `min` (track size, default `16rem`), `gap` | auto-fit responsive grid |
| `Container` | `size`: `narrow` \| `prose` \| `wide` (default `wide`) | max-width wrapper |

`gap` values map to the spacing scale (`gap="4"` → `var(--space-4)`).

## Typography — `Text`

`variant`: `heading`\|`body`\|`caption`\|`label` · `tone`: `default`\|`muted`\|`accent`\|`danger`
· `size`: `xs…4xl` · `weight`: `normal`\|`medium`\|`semibold`\|`bold` · `align` · `as` (override
element) · `italic` · `truncate`.

```svelte
<Text variant="heading" size="2xl">Hello</Text>
<Text tone="muted">Secondary copy</Text>
```

## Composition example

```svelte
<script lang="ts">
  import { Container, Stack, Grid, Card, Button, Text } from '@wl/frontend-system';
</script>

<Container size="prose">
  <Stack gap="5">
    <Text variant="heading" size="3xl">Dashboard</Text>
    <Grid min="18rem" gap="4">
      <Card.Root><Card.Header><Card.Title>Metric</Card.Title></Card.Header></Card.Root>
    </Grid>
    <Button variant="outline">Action</Button>
  </Stack>
</Container>
```

## Theming

- **Switch** the active look: set `data-mode` / `data-theme` on `document.documentElement`
  (or in `app.html` for the initial values).
- **Don't edit components.** To restyle, retune tokens — build a mode in the design system's
  `/playground` (character) or a theme in `/theme-builder` (color), export the CSS, and commit
  it to the design system; consumers pick it up on the next version bump.
- **Add a theme (3 steps, in the design-system repo):** add it to the `themes` registry in
  `config/tokens.ts`, create `tokens/themes/<name>.css` with a `[data-theme='<name>']` block,
  and `@import` it in `styles.css`. `themeNames` then exposes it automatically.

## New consumer setup (replaces the demo/template repo)

A Svelte/SvelteKit + TS project onboards like this:

1. **Install** the package + peers:
   `svelte@5 tailwindcss@4 bits-ui tailwind-variants clsx tailwind-merge @lucide/svelte tw-animate-css`,
   then the design system itself (via the Nix flake's `$FRONTEND_SYSTEM_TGZ`, or your pin).
2. **`src/app.css`** — Tailwind first, then the design system:
   ```css
   @import 'tailwindcss';
   @import '@wl/frontend-system/styles.css';
   ```
3. **`src/app.html`** — set the axes on `<html>`:
   ```html
   <html lang="en" data-mode="soft" data-theme="light">
   ```
4. **`vite.config.ts`** — the package ships `.svelte` source + directory re-exports, so Vite
   must process it during SSR (don't externalize):
   ```ts
   export default defineConfig({
     plugins: [tailwindcss(), sveltekit()],
     ssr: { noExternal: ['@wl/frontend-system'] }
   });
   ```
5. **Import and use:** `import { Button } from '@wl/frontend-system';`

## Gotchas

- **Semantic tokens only** — emitting a hex or a primitive (`--radius-lg`) breaks retheming.
- **SSR `ERR_UNSUPPORTED_DIR_IMPORT`** in dev → you're missing `ssr.noExternal` (step 4).
- **devenv consumers:** `npm install "$FRONTEND_SYSTEM_TGZ"` rewrites `package.json` with a
  machine-specific `/nix/store/…` path. Don't commit it — the real pin is `devenv.lock`.
- **`/theme-builder` drafts** are persisted in `localStorage`; a draft can shadow a
  same-named committed theme until deleted.

## Deeper reference

For architecture, the conform bridge, distribution, and decision record, see
`DESIGN_SYSTEM.md` in the design-system repo. For known bugs, see its `BUGS.md`. You
shouldn't need either to *use* the system — this skill is the usage contract.

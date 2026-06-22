# frontend-system consumer

A minimal SvelteKit app pre-wired to consume **@wl/frontend-system**.

## Setup

```sh
nix develop                                 # pinned Node; sets $FRONTEND_SYSTEM_TGZ
npm install                                 # toolchain + peer deps
npm install "$FRONTEND_SYSTEM_TGZ"          # the pinned design-system tarball
npm run dev
```

The design system is pinned by `flake.lock` (the `frontend-system` input). Bump it with:

```sh
nix flake update frontend-system
npm install "$FRONTEND_SYSTEM_TGZ"          # reinstall the new tarball
```

## What's wired (the setup contract)

| File | Wiring |
|------|--------|
| `src/app.css` | `@import 'tailwindcss';` then `@import '@wl/frontend-system/styles.css';` |
| `src/app.html` | `data-mode` / `data-theme` on `<html>` |
| `vite.config.ts` | `ssr: { noExternal: ['@wl/frontend-system'] }` (required for SSR — see the design system's BUGS.md) |
| `src/routes/+page.svelte` | `import { Button, Card, Stack } from '@wl/frontend-system'` |
| `package.json` | peer deps (`bits-ui`, `tailwind-variants`, `clsx`, `tailwind-merge`, `@lucide/svelte`, `tw-animate-css`) |

## Theming

Don't edit components — customize through tokens:

- Flip `data-mode` (`soft`/`hard`) and `data-theme` (`light`/`dark`) on `<html>`.
- Or replace the token values: build a theme in the design system's `/theme-builder`
  or a mode in `/playground`, export the CSS, and `@import` it after the package
  stylesheet so its `[data-theme=…]` / `[data-mode=…]` rules win.

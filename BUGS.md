# Bugs & Fixes

A running log of non-obvious bugs, their fixes, and *why* — so we don't rediscover them.

Newest first. Each entry: symptom → cause → fix → why.

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

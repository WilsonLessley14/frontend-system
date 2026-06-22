import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// The design system ships .svelte source + directory re-exports, so Vite must
	// process it during SSR rather than externalize it to Node. See BUGS.md.
	ssr: { noExternal: ['@wl/frontend-system'] }
});

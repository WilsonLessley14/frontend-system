<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { axes } from '$lib/design/config/modes';
	import { ui } from '$lib/design/mode.svelte';

	let { children }: { children: Snippet } = $props();

	// Hydrate from localStorage on the client before first paint of the effect.
	if (browser) {
		for (const name of Object.keys(axes)) {
			const saved = localStorage.getItem(`ui-${name}`);
			if (saved) ui[name] = saved;
		}
	}

	// Reflect axis state onto <html> and persist it. Fully generic over axes —
	// adding an axis in config/modes.ts needs no change here.
	$effect(() => {
		const el = document.documentElement;
		for (const [name, axis] of Object.entries(axes)) {
			el.setAttribute(axis.attribute, ui[name]);
			localStorage.setItem(`ui-${name}`, ui[name]);
		}
	});
</script>

{@render children()}

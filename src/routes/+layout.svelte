<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { axes } from '$lib/design/config/modes';
	import type { Mode } from '$lib/design/config/tokens';
	import { ui } from './_dev/mode.svelte';
	import { applyCharacter, applyColor, persist, hydrate } from './_dev/editor.svelte';

	let { children }: { children: Snippet } = $props();

	// Hydrate ui + editor from localStorage before the first effect run.
	if (browser) {
		for (const name of Object.keys(axes)) {
			const saved = localStorage.getItem(`ui-${name}`);
			if (saved) ui[name] = saved;
		}
		hydrate();
	}

	// Single source of truth for the whole dev app: reflect the axis attributes onto
	// <html> AND apply the editor's live values for the active mode/theme inline — so
	// every route renders identically, including drafts that have no committed CSS rule.
	$effect(() => {
		const el = document.documentElement;
		for (const [name, axis] of Object.entries(axes)) {
			el.setAttribute(axis.attribute, ui[name]);
			localStorage.setItem(`ui-${name}`, ui[name]);
		}
		applyCharacter(ui.mode as Mode);
		applyColor(ui.theme);
		persist();
	});
</script>

{@render children()}

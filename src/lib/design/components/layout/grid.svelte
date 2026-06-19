<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { min?: string; gap?: string; children?: Snippet };
	let { min = '16rem', gap = '4', children }: Props = $props();
</script>

<div class="grid" style="--min: {min}; --gap: var(--space-{gap})">
	{@render children?.()}
</div>

<style>
	.grid {
		display: grid;
		gap: var(--gap);
		grid-template-columns: repeat(auto-fill, minmax(min(var(--min), 100%), 1fr));
	}
</style>

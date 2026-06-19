<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { gap?: string; align?: string; children?: Snippet };
	let { gap = '3', align = 'center', children }: Props = $props();
</script>

<div class="cluster" style="--gap: var(--space-{gap}); --align: {align}">
	{@render children?.()}
</div>

<style>
	.cluster {
		display: flex;
		flex-wrap: wrap;
		gap: var(--gap);
		align-items: var(--align);
	}
</style>

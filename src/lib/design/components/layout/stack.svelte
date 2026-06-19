<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { gap?: string; children?: Snippet };
	let { gap = '4', children }: Props = $props();
</script>

<div class="stack" style="--gap: var(--space-{gap})">
	{@render children?.()}
</div>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>

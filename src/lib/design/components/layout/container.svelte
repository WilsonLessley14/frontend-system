<script lang="ts">
	import type { Snippet } from 'svelte';
	import { containers, type Container } from '$lib/design/config/layout';

	type Props = { size?: Container; children?: Snippet };
	let { size = 'wide', children }: Props = $props();
</script>

<div class="container" style="--max: {containers[size]}rem">
	{@render children?.()}
</div>

<style>
	.container {
		max-width: var(--max);
		width: 100%;
		margin-inline: auto;
		padding-inline: var(--space-4);
	}
</style>

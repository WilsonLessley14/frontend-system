<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { exported, path }: { exported: string; path: string } = $props();

	let copied = $state(false);
	// Reset the "Copied!" state whenever a fresh export comes in.
	$effect(() => {
		exported;
		copied = false;
	});

	async function copy() {
		await navigator.clipboard.writeText(exported);
		copied = true;
	}
</script>

{#if exported}
	<div class="export">
		<div class="export-head">
			<code>{path}</code>
			<Button size="sm" variant="ghost" onclick={copy}>{copied ? 'Copied!' : 'Copy'}</Button>
		</div>
		<pre>{exported}</pre>
	</div>
{/if}

<style>
	.export {
		border: var(--border-width) solid var(--border);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.export-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--surface-sunken);
		font-size: 0.75rem;
	}
	pre {
		margin: 0;
		padding: var(--space-3);
		overflow-x: auto;
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
		line-height: 1.5;
		background: var(--surface);
		color: var(--fg);
	}
</style>

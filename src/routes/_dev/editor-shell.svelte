<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Preview from './preview.svelte';
	import ExportPanel from './export-panel.svelte';

	// Shared chrome for /playground and /theme-builder: a sticky control panel beside
	// the live Preview, plus the export panel. Each route supplies its own controls.
	let {
		title,
		exported,
		exportPath,
		sub,
		controls,
		actions
	}: {
		title: string;
		exported: string;
		exportPath: string;
		sub: Snippet;
		controls: Snippet;
		actions: Snippet;
	} = $props();
</script>

<main>
	<Container size="wide">
		<div class="layout">
			<aside class="panel">
				<Stack gap="4">
					<div>
						<h1 class="title">{title}</h1>
						<p class="sub">{@render sub()}</p>
					</div>
					<div class="controls">{@render controls()}</div>
					<div class="actions">{@render actions()}</div>
					<ExportPanel {exported} path={exportPath} />
				</Stack>
			</aside>
			<div class="preview">
				<Preview />
			</div>
		</div>
	</Container>
</main>

<style>
	main {
		padding-block: var(--space-6) var(--space-10);
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
		gap: var(--space-6);
		align-items: start;
	}
	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
	.panel {
		position: sticky;
		top: 5rem;
	}
	.title {
		font-family: var(--font-heading);
		font-size: 1.6rem;
		margin: 0;
	}
	.sub {
		color: var(--fg-muted);
		font-size: 0.9rem;
		margin: var(--space-1) 0 0;
	}
	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
</style>

<script lang="ts">
	import { browser } from '$app/environment';
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Preview from '../_dev/preview.svelte';
	import SiteNav from '../_dev/site-nav.svelte';
	import ModeControls from '../_dev/mode-controls.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ui } from '../_dev/mode.svelte';
	import { colorRoles, type Theme } from '$lib/design/config/tokens';
	import {
		editor,
		applyColor,
		clearInline,
		colorNames,
		persist,
		exportTheme,
		resetColor,
		hydrate
	} from '../_dev/editor.svelte';

	if (browser) hydrate();

	const theme = $derived(ui.theme as Theme);

	let exported = $state('');
	let copied = $state(false);

	$effect(() => {
		applyColor(theme);
		persist();
		return () => clearInline(colorNames);
	});

	function doExport() {
		exported = exportTheme(theme);
		copied = false;
	}

	async function copy() {
		await navigator.clipboard.writeText(exported);
		copied = true;
	}
</script>

<header class="bar">
	<Container size="wide">
		<div class="bar-inner">
			<div class="left">
				<strong class="brand">frontend-system</strong>
				<SiteNav />
			</div>
			<ModeControls />
		</div>
	</Container>
</header>

<main>
	<Container size="wide">
		<div class="layout">
			<aside class="panel">
				<Stack gap="4">
					<div>
						<h1 class="title">Theme Builder</h1>
						<p class="sub">
							Editing the <strong>{theme}</strong> color roles. Use the Color toggle above to switch
							which theme you're editing; Character just changes the preview mode.
						</p>
					</div>

					<div class="controls">
						{#each colorRoles as role (role.name)}
							{@const hex = editor.color[theme][role.name]}
							<div class="ctl">
								<div class="ctl-head">
									<span class="name">{role.label}</span>
									{#if role.hint}<span class="hint">{role.hint}</span>{/if}
								</div>
								<div class="row">
									<input
										type="color"
										aria-label={role.label}
										value={hex}
										oninput={(e) => (editor.color[theme][role.name] = e.currentTarget.value)}
									/>
									<input
										class="hex"
										type="text"
										value={hex}
										oninput={(e) => (editor.color[theme][role.name] = e.currentTarget.value)}
									/>
								</div>
							</div>
						{/each}
					</div>

					<div class="actions">
						<Button onclick={doExport}>Export {theme}.css</Button>
						<Button variant="outline" onclick={() => resetColor(theme)}>Reset {theme}</Button>
					</div>

					{#if exported}
						<div class="export">
							<div class="export-head">
								<code>src/lib/design/tokens/themes/{theme}.css</code>
								<Button size="sm" variant="ghost" onclick={copy}>{copied ? 'Copied!' : 'Copy'}</Button>
							</div>
							<pre>{exported}</pre>
						</div>
					{/if}
				</Stack>
			</aside>

			<div class="preview">
				<Preview />
			</div>
		</div>
	</Container>
</main>

<style>
	.bar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--surface-sunken);
		border-bottom: var(--border-width) solid var(--border);
		padding-block: var(--space-3);
		backdrop-filter: blur(8px);
	}
	.bar-inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.left {
		display: flex;
		align-items: center;
		gap: var(--space-5);
	}
	.brand {
		font-family: var(--font-heading);
		font-size: 1.1rem;
	}
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
		gap: var(--space-3);
	}
	.ctl-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-2);
		margin-bottom: var(--space-1);
	}
	.name {
		font-size: 0.85rem;
		font-weight: 600;
	}
	.hint {
		font-size: 0.7rem;
		color: var(--fg-muted);
	}
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	input[type='color'] {
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		border: var(--border-width) solid var(--border);
		border-radius: var(--radius-control);
		background: none;
		cursor: pointer;
	}
	.hex {
		flex: 1;
		font-family: ui-monospace, monospace;
		font-size: 0.85rem;
		background: var(--surface);
		color: var(--fg);
		border: var(--border-width) solid var(--border);
		border-radius: var(--radius-control);
		padding: var(--space-2) var(--space-3);
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
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

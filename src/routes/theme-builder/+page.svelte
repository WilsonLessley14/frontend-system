<script lang="ts">
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Preview from '../_dev/preview.svelte';
	import AppHeader from '../_dev/app-header.svelte';
	import ModeControls from '../_dev/mode-controls.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { ui } from '../_dev/mode.svelte';
	import { colorRoles } from '$lib/design/config/tokens';
	import {
		editor,
		exportTheme,
		resetColor,
		addTheme,
		removeTheme,
		randomizeColors,
		isTemporary
	} from '../_dev/editor.svelte';

	const theme = $derived(ui.theme);
	let newName = $state('');

	function createTheme() {
		if (addTheme(newName, theme)) {
			ui.theme = newName.trim();
			newName = '';
		}
	}

	function deleteTheme() {
		if (removeTheme(theme)) {
			ui.theme = editor.themeNames[editor.themeNames.length - 1];
		}
	}

	let exported = $state('');
	let copied = $state(false);

	// Live application + persistence is handled centrally in the root layout.

	function doExport() {
		exported = exportTheme(theme);
		copied = false;
	}

	async function copy() {
		await navigator.clipboard.writeText(exported);
		copied = true;
	}
</script>

<AppHeader>
	<ModeControls />
	<div class="new-theme">
		<Input
			bind:value={newName}
			placeholder="new theme name"
			onkeydown={(e) => e.key === 'Enter' && createTheme()}
		/>
		<Button size="sm" variant="outline" onclick={createTheme}>+ New</Button>
		{#if isTemporary(theme)}
			<Button size="sm" variant="ghost" onclick={deleteTheme}>Delete</Button>
		{/if}
	</div>
</AppHeader>

<main>
	<Container size="wide">
		<div class="layout">
			<aside class="panel">
				<Stack gap="4">
					<div>
						<h1 class="title">Theme Builder</h1>
						<p class="sub">
							Editing the <strong>{theme}</strong> color roles. Pick a theme or create a new one
							(seeded from the current one) in the bar above; the <em>{ui.mode}</em> button previews
							character. New themes are live drafts — export and commit them to persist.
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
						{#if isTemporary(theme)}
							<Button variant="secondary" onclick={() => randomizeColors(theme)}>🎲 Randomize</Button>
						{/if}
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
	.new-theme {
		display: flex;
		align-items: center;
		gap: var(--space-2);
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

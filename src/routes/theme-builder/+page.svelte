<script lang="ts">
	import AppHeader from '../_dev/app-header.svelte';
	import ModeControls from '../_dev/mode-controls.svelte';
	import EditorShell from '../_dev/editor-shell.svelte';
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
	let exported = $state('');

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

	function doExport() {
		exported = exportTheme(theme);
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

<EditorShell title="Theme Builder" {exported} exportPath={`src/lib/design/tokens/themes/${theme}.css`}>
	{#snippet sub()}
		Editing the <strong>{theme}</strong> color roles. Pick a theme or create a new one
		(seeded from the current one) in the bar above; the <em>{ui.mode}</em> button previews
		character. New themes are live drafts — export and commit them to persist.
	{/snippet}

	{#snippet controls()}
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
	{/snippet}

	{#snippet actions()}
		<Button onclick={doExport}>Export {theme}.css</Button>
		<Button variant="outline" onclick={() => resetColor(theme)}>Reset {theme}</Button>
		{#if isTemporary(theme)}
			<Button variant="secondary" onclick={() => randomizeColors(theme)}>🎲 Randomize</Button>
		{/if}
	{/snippet}
</EditorShell>

<style>
	.new-theme {
		display: flex;
		align-items: center;
		gap: var(--space-2);
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
</style>

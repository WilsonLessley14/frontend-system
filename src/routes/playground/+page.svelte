<script lang="ts">
	import AppHeader from '../_dev/app-header.svelte';
	import ModeControls from '../_dev/mode-controls.svelte';
	import EditorShell from '../_dev/editor-shell.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ui } from '../_dev/mode.svelte';
	import { characterTokens, FONT_PRESETS, EASING_PRESETS, type Mode } from '$lib/design/config/tokens';
	import { editor, exportMode, resetCharacter } from '../_dev/editor.svelte';

	const mode = $derived(ui.mode as Mode);
	let exported = $state('');
	const shadowKeys = ['x', 'y', 'blur', 'spread'] as const;

	// Live application + persistence is centralized in the root layout.
	function doExport() {
		exported = exportMode(mode);
	}
</script>

<AppHeader>
	<ModeControls />
</AppHeader>

<EditorShell title="Playground" {exported} exportPath={`src/lib/design/tokens/modes/${mode}.css`}>
	{#snippet sub()}
		Editing <strong>{mode}</strong> character tokens. Use the Character toggle above to switch
		which mode you're editing; Color just changes the preview theme.
	{/snippet}

	{#snippet controls()}
		{#each characterTokens as token (token.name)}
			{@const v = editor.character[mode][token.name]}
			<div class="ctl">
				<div class="ctl-head">
					<label for={token.name}>{token.label}</label>
					{#if token.hint}<span class="hint">{token.hint}</span>{/if}
				</div>

				{#if v.kind === 'length'}
					<div class="row">
						<input
							id={token.name}
							type="range"
							min={token.min}
							max={token.max}
							step={token.step}
							value={v.value}
							oninput={(e) => (v.value = e.currentTarget.valueAsNumber)}
						/>
						<span class="readout">{v.value}{v.unit}</span>
					</div>
				{:else if v.kind === 'shadow'}
					<div class="shadow-grid">
						{#each shadowKeys as k (k)}
							<label class="mini">
								<span>{k}</span>
								<input
									type="number"
									value={v.value[k]}
									oninput={(e) => (v.value[k] = e.currentTarget.valueAsNumber)}
								/>
							</label>
						{/each}
						<label class="mini">
							<span>color</span>
							<input
								type="color"
								value={v.value.color}
								oninput={(e) => (v.value.color = e.currentTarget.value)}
							/>
						</label>
						<label class="mini">
							<span>alpha</span>
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={v.value.alpha}
								oninput={(e) => (v.value.alpha = e.currentTarget.valueAsNumber)}
							/>
						</label>
					</div>
				{:else if v.kind === 'font'}
					<select id={token.name} value={v.value} onchange={(e) => (v.value = e.currentTarget.value)}>
						{#each FONT_PRESETS as p (p.value)}
							<option value={p.value}>{p.label}</option>
						{/each}
					</select>
				{:else if v.kind === 'transition'}
					<div class="row">
						<input
							type="range"
							min="0"
							max="600"
							step="10"
							value={v.value.duration}
							oninput={(e) => (v.value.duration = e.currentTarget.valueAsNumber)}
						/>
						<span class="readout">{v.value.duration}ms</span>
					</div>
					<select value={v.value.easing} onchange={(e) => (v.value.easing = e.currentTarget.value)}>
						{#each EASING_PRESETS as ez (ez)}
							<option value={ez}>{ez}</option>
						{/each}
					</select>
				{/if}
			</div>
		{/each}
	{/snippet}

	{#snippet actions()}
		<Button onclick={doExport}>Export {mode}.css</Button>
		<Button variant="outline" onclick={() => resetCharacter(mode)}>Reset {mode}</Button>
	{/snippet}
</EditorShell>

<style>
	.ctl-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-2);
		margin-bottom: var(--space-1);
	}
	.ctl-head label {
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
	.row input[type='range'] {
		flex: 1;
	}
	.readout {
		font-family: ui-monospace, monospace;
		font-size: 0.8rem;
		color: var(--fg-muted);
		min-width: 3.5em;
		text-align: right;
	}
	.shadow-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
	}
	.mini {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 0.7rem;
		color: var(--fg-muted);
	}
	.mini input[type='number'],
	select {
		width: 100%;
		font-family: var(--font-body);
		background: var(--surface);
		color: var(--fg);
		border: var(--border-width) solid var(--border);
		border-radius: var(--radius-control);
		padding: var(--space-1) var(--space-2);
	}
</style>

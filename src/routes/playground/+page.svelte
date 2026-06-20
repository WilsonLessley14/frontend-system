<script lang="ts">
	import { browser } from '$app/environment';
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Preview from '$lib/design/components/preview.svelte';
	import SiteNav from '$lib/design/components/site-nav.svelte';
	import ModeControls from '$lib/design/components/mode-controls.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ui } from '$lib/design/mode.svelte';
	import { characterTokens, FONT_PRESETS, EASING_PRESETS, type Mode } from '$lib/design/config/tokens';
	import {
		editor,
		applyCharacter,
		clearInline,
		characterNames,
		persist,
		exportMode,
		resetCharacter,
		hydrate
	} from '$lib/design/editor.svelte';

	if (browser) hydrate();

	const mode = $derived(ui.mode as Mode);

	let exported = $state('');
	let copied = $state(false);

	const shadowKeys = ['x', 'y', 'blur', 'spread'] as const;

	// Apply this mode's character overrides live while on the page; clear on leave.
	$effect(() => {
		applyCharacter(mode);
		persist();
		return () => clearInline(characterNames);
	});

	function doExport() {
		exported = exportMode(mode);
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
						<h1 class="title">Playground</h1>
						<p class="sub">
							Editing <strong>{mode}</strong> character tokens. Use the Character toggle above to switch
							which mode you're editing; Color just changes the preview theme.
						</p>
					</div>

					<div class="controls">
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
									<select
										id={token.name}
										value={v.value}
										onchange={(e) => (v.value = e.currentTarget.value)}
									>
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
									<select
										value={v.value.easing}
										onchange={(e) => (v.value.easing = e.currentTarget.value)}
									>
										{#each EASING_PRESETS as ez (ez)}
											<option value={ez}>{ez}</option>
										{/each}
									</select>
								{/if}
							</div>
						{/each}
					</div>

					<div class="actions">
						<Button onclick={doExport}>Export {mode}.css</Button>
						<Button variant="outline" onclick={() => resetCharacter(mode)}>Reset {mode}</Button>
					</div>

					{#if exported}
						<div class="export">
							<div class="export-head">
								<code>src/lib/design/tokens/modes/{mode}.css</code>
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
		gap: var(--space-4);
	}
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

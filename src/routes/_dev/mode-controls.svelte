<script lang="ts">
	import { axes } from '$lib/design/config/modes';
	import { ui } from './mode.svelte';
	import { editor } from './editor.svelte';
	import * as Select from '$lib/components/ui/select';

	// The theme axis is the open named set (incl. live drafts); other axes are fixed.
	const themeOptions = $derived(editor.themeNames);
</script>

<div class="controls">
	{#each Object.entries(axes) as [name, axis] (name)}
		<div class="group">
			<span class="label">{axis.label}</span>
			{#if name === 'theme'}
				<Select.Root type="single" bind:value={ui[name]}>
					<Select.Trigger class="min-w-28 capitalize">{ui[name]}</Select.Trigger>
					<Select.Content>
						{#each themeOptions as value (value)}
							<Select.Item {value} label={value} class="capitalize">{value}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{:else}
				<div class="seg" role="group" aria-label={axis.label}>
					{#each axis.values as value (value)}
						<button
							class="opt"
							data-active={ui[name] === value}
							aria-pressed={ui[name] === value}
							onclick={() => (ui[name] = value)}
						>
							{value}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: var(--space-5);
	}
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	.label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--fg-muted);
	}
	.seg {
		display: flex;
		border: var(--border-width) solid var(--border);
		border-radius: var(--radius-control);
		overflow: hidden;
	}
	.opt {
		font-family: var(--font-body);
		background: var(--surface);
		color: var(--fg-muted);
		border: none;
		padding: var(--space-2) var(--space-3);
		cursor: pointer;
		text-transform: capitalize;
		transition: var(--transition);
	}
	.opt[data-active='true'] {
		background: var(--accent);
		color: var(--accent-fg);
	}
</style>

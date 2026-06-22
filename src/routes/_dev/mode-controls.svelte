<script lang="ts">
	import { axes } from '$lib/design/config/modes';
	import { ui } from './mode.svelte';
	import { editor } from './editor.svelte';
	import * as Select from '$lib/components/ui/select';
</script>

<div class="controls">
	{#each Object.entries(axes) as [name, axis] (name)}
		<div class="group">
			<span class="label">{axis.label}</span>
			<Select.Root type="single" bind:value={ui[name]}>
				<Select.Trigger class="min-w-28 capitalize">{ui[name]}</Select.Trigger>
				<Select.Content>
					<!-- theme is the open named set (incl. live drafts); other axes are fixed -->
					{#each name === 'theme' ? editor.themeNames : axis.values as value (value)}
						<Select.Item {value} label={value} class="capitalize">{value}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
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
</style>

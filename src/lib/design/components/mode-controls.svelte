<script lang="ts">
	import { axes } from '$lib/design/config/modes';
	import { ui } from '$lib/design/mode.svelte';
</script>

<div class="controls">
	{#each Object.entries(axes) as [name, axis] (name)}
		<div class="group">
			<span class="label">{axis.label}</span>
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
		</div>
	{/each}
</div>

<style>
	.controls {
		display: flex;
		flex-wrap: wrap;
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

<script lang="ts">
	import AppHeader from '../_dev/app-header.svelte';
	import ModeControls from '../_dev/mode-controls.svelte';
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Preview from '../_dev/preview.svelte';
</script>

<AppHeader>
	<ModeControls />
</AppHeader>

<main>
	<Container size="wide">
		<Stack gap="10">
			<section>
				<Stack gap="3">
					<h1 class="display">Component Showcase</h1>
					<p class="lede">
						The shadcn-svelte suite, conformed to our token system. Flip the toggles above — every
						component re-renders in the chosen character &times; color combination via the
						<code>@theme</code> bridge.
					</p>
				</Stack>
			</section>

			<Preview />
		</Stack>
	</Container>
</main>

<style>
	main {
		padding-block: var(--space-8) var(--space-10);
	}
	.display {
		font-family: var(--font-heading);
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		margin: 0;
		letter-spacing: var(--letter-spacing);
	}
	.lede {
		color: var(--fg-muted);
		max-width: 60ch;
		margin: 0;
	}
	code {
		font-family: ui-monospace, monospace;
		background: var(--surface-sunken);
		padding: 0.1em 0.35em;
		border-radius: var(--radius-control);
		font-size: 0.9em;
	}
</style>

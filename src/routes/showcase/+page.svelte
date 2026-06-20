<script lang="ts">
	import ModeControls from '$lib/design/components/mode-controls.svelte';
	import SiteNav from '$lib/design/components/site-nav.svelte';
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Preview from '$lib/design/components/preview.svelte';
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

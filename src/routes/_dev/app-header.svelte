<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container from '$lib/design/components/layout/container.svelte';
	import Text from '$lib/design/components/typography/text.svelte';
	import SiteNav from './site-nav.svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<header class="bar">
	<Container size="wide">
		<div class="bar-inner">
			<div class="left">
				<Text as="span" weight="bold" class="brand">frontend-system</Text>
				<SiteNav />
			</div>
			<div class="right">
				{@render children?.()}
			</div>
		</div>
	</Container>
</header>

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
	.right {
		display: flex;
		flex-wrap: wrap;
		/* bottom-align so label-less controls (e.g. the new-theme input) sit on the
		   same baseline as labelled dropdowns, without a placeholder label. */
		align-items: flex-end;
		gap: var(--space-4);
	}
	:global(.brand) {
		font-size: 1.1rem;
	}
</style>

<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{ href: '/showcase', label: 'Showcase' },
		{ href: '/playground', label: 'Playground' },
		{ href: '/theme-builder', label: 'Theme Builder' }
	];
</script>

<nav class="nav">
	{#each links as l (l.href)}
		<a href={l.href} data-active={$page.url.pathname === l.href}>{l.label}</a>
	{/each}
</nav>

<style>
	.nav {
		display: flex;
		gap: var(--space-1);
	}
	a {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--fg-muted);
		text-decoration: none;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-control);
		transition: var(--transition);
	}
	a:hover {
		color: var(--fg);
		background: var(--surface-sunken);
	}
	a[data-active='true'] {
		color: var(--accent);
		font-weight: 600;
	}
</style>

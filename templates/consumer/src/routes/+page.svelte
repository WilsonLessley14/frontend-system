<script lang="ts">
	import { Button, Card, Stack } from '@wl/frontend-system';

	// Customize entirely through tokens: flip these on <html>, or ship your own
	// mode/theme CSS exported from the design system's /playground & /theme-builder.
	let mode = $state<'soft' | 'hard'>('soft');
	let theme = $state<'light' | 'dark'>('light');

	$effect(() => {
		document.documentElement.dataset.mode = mode;
		document.documentElement.dataset.theme = theme;
	});
</script>

<main style="max-width: 40rem; margin: 4rem auto; padding: 0 1rem;">
	<Stack gap="5">
		<h1>@wl/frontend-system consumer</h1>

		<Stack gap="3">
			<Card.Root>
				<Card.Header>
					<Card.Title>It works</Card.Title>
					<Card.Description>Components inherit the active mode & theme.</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Toggle below — no component edits, just tokens.</p>
				</Card.Content>
			</Card.Root>

			<div style="display: flex; gap: 0.5rem;">
				<Button onclick={() => (mode = mode === 'soft' ? 'hard' : 'soft')}>
					Mode: {mode}
				</Button>
				<Button variant="outline" onclick={() => (theme = theme === 'light' ? 'dark' : 'light')}>
					Theme: {theme}
				</Button>
			</div>
		</Stack>
	</Stack>
</main>

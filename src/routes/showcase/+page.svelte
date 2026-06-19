<script lang="ts">
	import ModeControls from '$lib/design/components/mode-controls.svelte';
	import Container from '$lib/design/components/layout/container.svelte';
	import Stack from '$lib/design/components/layout/stack.svelte';
	import Cluster from '$lib/design/components/layout/cluster.svelte';
	import Grid from '$lib/design/components/layout/grid.svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Switch } from '$lib/components/ui/switch';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Table from '$lib/components/ui/table';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	let fruit = $state('apple');
	let plan = $state('pro');
	const fruitLabel = $derived(
		{ apple: 'Apple', banana: 'Banana', cherry: 'Cherry' }[fruit] ?? 'Select a fruit'
	);
</script>

<header class="bar">
	<Container size="wide">
		<div class="bar-inner">
			<strong class="brand">frontend-system</strong>
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

			<!-- Buttons -->
			<section>
				<Stack gap="4">
					<h2 class="section-title">Buttons & Badges</h2>
					<Card.Root>
						<Card.Content>
							<Stack gap="5">
								<Cluster gap="3">
									<Button>Default</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="outline">Outline</Button>
									<Button variant="ghost">Ghost</Button>
									<Button variant="destructive">Destructive</Button>
									<Button variant="link">Link</Button>
								</Cluster>
								<Cluster gap="3">
									<Button size="sm">Small</Button>
									<Button>Default</Button>
									<Button size="lg">Large</Button>
								</Cluster>
								<Cluster gap="2">
									<Badge>Default</Badge>
									<Badge variant="secondary">Secondary</Badge>
									<Badge variant="outline">Outline</Badge>
									<Badge variant="destructive">Destructive</Badge>
								</Cluster>
							</Stack>
						</Card.Content>
					</Card.Root>
				</Stack>
			</section>

			<!-- Cards -->
			<section>
				<Stack gap="4">
					<h2 class="section-title">Cards</h2>
					<Grid min="18rem" gap="4">
						{#each ['Radius', 'Shadow', 'Typography'] as title (title)}
							<Card.Root>
								<Card.Header>
									<Card.Title>{title}</Card.Title>
									<Card.Description>Watch this shift between soft and hard.</Card.Description>
								</Card.Header>
								<Card.Content>
									<p class="muted">Corners, shadow, and font all follow the active mode.</p>
								</Card.Content>
								<Card.Footer>
									<Cluster gap="2">
										<Button size="sm">Action</Button>
										<Button size="sm" variant="ghost">Cancel</Button>
									</Cluster>
								</Card.Footer>
							</Card.Root>
						{/each}
					</Grid>
				</Stack>
			</section>

			<!-- Forms -->
			<section>
				<Stack gap="4">
					<h2 class="section-title">Form Controls</h2>
					<Card.Root>
						<Card.Content>
							<Grid min="16rem" gap="5">
								<Stack gap="2">
									<Label for="email">Email</Label>
									<Input id="email" type="email" placeholder="you@example.com" />
								</Stack>
								<Stack gap="2">
									<Label for="fruit">Favorite fruit</Label>
									<Select.Root type="single" bind:value={fruit}>
										<Select.Trigger id="fruit">{fruitLabel}</Select.Trigger>
										<Select.Content>
											<Select.Item value="apple">Apple</Select.Item>
											<Select.Item value="banana">Banana</Select.Item>
											<Select.Item value="cherry">Cherry</Select.Item>
										</Select.Content>
									</Select.Root>
								</Stack>
								<Stack gap="2">
									<Label for="bio">Bio</Label>
									<Textarea id="bio" placeholder="A few words about you" />
								</Stack>
								<Stack gap="3">
									<Cluster gap="2">
										<Checkbox id="terms" />
										<Label for="terms">Accept terms</Label>
									</Cluster>
									<Cluster gap="2">
										<Switch id="notify" />
										<Label for="notify">Email notifications</Label>
									</Cluster>
								</Stack>
								<Stack gap="2">
									<Label>Plan</Label>
									<RadioGroup.Root bind:value={plan}>
										<Cluster gap="2">
											<RadioGroup.Item value="free" id="free" />
											<Label for="free">Free</Label>
										</Cluster>
										<Cluster gap="2">
											<RadioGroup.Item value="pro" id="pro" />
											<Label for="pro">Pro</Label>
										</Cluster>
									</RadioGroup.Root>
								</Stack>
							</Grid>
							<Separator class="my-6" />
							<Cluster gap="3">
								<Button>Save</Button>
								<Button variant="outline">Cancel</Button>
							</Cluster>
						</Card.Content>
					</Card.Root>
				</Stack>
			</section>

			<!-- Overlays & disclosure -->
			<section>
				<Stack gap="4">
					<h2 class="section-title">Overlays & Disclosure</h2>
					<Card.Root>
						<Card.Content>
							<Stack gap="5">
								<Cluster gap="3">
									<Dialog.Root>
										<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
											Open dialog
										</Dialog.Trigger>
										<Dialog.Content>
											<Dialog.Header>
												<Dialog.Title>Soft or hard?</Dialog.Title>
												<Dialog.Description>
													This dialog inherits the active mode's corners, shadow, and font.
												</Dialog.Description>
											</Dialog.Header>
											<Dialog.Footer>
												<Button>Got it</Button>
											</Dialog.Footer>
										</Dialog.Content>
									</Dialog.Root>

									<Tooltip.Provider>
										<Tooltip.Root>
											<Tooltip.Trigger class={buttonVariants({ variant: 'outline' })}>
												Hover for tooltip
											</Tooltip.Trigger>
											<Tooltip.Content>Tooltips follow the theme too.</Tooltip.Content>
										</Tooltip.Root>
									</Tooltip.Provider>
								</Cluster>

								<Tabs.Root value="overview">
									<Tabs.List>
										<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
										<Tabs.Trigger value="details">Details</Tabs.Trigger>
									</Tabs.List>
									<Tabs.Content value="overview">
										<p class="muted">Tab panels re-skin with the mode.</p>
									</Tabs.Content>
									<Tabs.Content value="details">
										<p class="muted">Same tokens, different content.</p>
									</Tabs.Content>
								</Tabs.Root>

								<Accordion.Root type="single">
									<Accordion.Item value="a">
										<Accordion.Trigger>What changes between modes?</Accordion.Trigger>
										<Accordion.Content>
											Radius, shadow, font family, border width, and transition feel.
										</Accordion.Content>
									</Accordion.Item>
									<Accordion.Item value="b">
										<Accordion.Trigger>What stays the same?</Accordion.Trigger>
										<Accordion.Content>The spacing scale and component structure.</Accordion.Content>
									</Accordion.Item>
								</Accordion.Root>
							</Stack>
						</Card.Content>
					</Card.Root>
				</Stack>
			</section>

			<!-- Feedback & data -->
			<section>
				<Stack gap="4">
					<h2 class="section-title">Feedback & Data</h2>
					<Card.Root>
						<Card.Content>
							<Stack gap="5">
								<Alert.Root>
									<Alert.Title>Heads up</Alert.Title>
									<Alert.Description>Alerts carry the active character too.</Alert.Description>
								</Alert.Root>

								<Cluster gap="3">
									<Avatar.Root>
										<Avatar.Image src="https://github.com/sveltejs.png" alt="Svelte" />
										<Avatar.Fallback>SV</Avatar.Fallback>
									</Avatar.Root>
									<Avatar.Root>
										<Avatar.Fallback>WL</Avatar.Fallback>
									</Avatar.Root>
								</Cluster>

								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Component</Table.Head>
											<Table.Head>Soft</Table.Head>
											<Table.Head>Hard</Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										<Table.Row>
											<Table.Cell>Corners</Table.Cell>
											<Table.Cell>Rounded</Table.Cell>
											<Table.Cell>Sharp</Table.Cell>
										</Table.Row>
										<Table.Row>
											<Table.Cell>Shadow</Table.Cell>
											<Table.Cell>Diffuse</Table.Cell>
											<Table.Cell>Offset</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table.Root>

								<Stack gap="2">
									<Skeleton class="h-4 w-2/3" />
									<Skeleton class="h-4 w-1/2" />
								</Stack>
							</Stack>
						</Card.Content>
					</Card.Root>
				</Stack>
			</section>
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
	.section-title {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		margin: 0;
		letter-spacing: var(--letter-spacing);
	}
	.muted {
		color: var(--fg-muted);
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

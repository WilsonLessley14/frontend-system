<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../../utils.js';
	import type { TextVariant, TextTone, TextSize, TextWeight, TextAlign } from './types';

	type Props = {
		/** Element to render. Defaults to the variant's natural element. */
		as?: string;
		variant?: TextVariant;
		size?: TextSize;
		weight?: TextWeight;
		align?: TextAlign;
		tone?: TextTone;
		italic?: boolean;
		truncate?: boolean;
		class?: string;
		children?: Snippet;
	};

	let {
		as,
		variant = 'body',
		size,
		weight,
		align = 'left',
		tone = 'default',
		italic = false,
		truncate = false,
		class: className,
		children
	}: Props = $props();

	// Literal class maps (not interpolated) so Tailwind reliably detects them.
	const SIZE: Record<TextSize, string> = {
		xs: 'text-xs',
		sm: 'text-sm',
		base: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl',
		'2xl': 'text-2xl',
		'3xl': 'text-3xl',
		'4xl': 'text-4xl'
	};
	const WEIGHT: Record<TextWeight, string> = {
		normal: 'font-normal',
		medium: 'font-medium',
		semibold: 'font-semibold',
		bold: 'font-bold'
	};
	const ALIGN: Record<TextAlign, string> = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	};
	const TONE: Record<TextTone, string> = {
		default: 'text-foreground',
		muted: 'text-muted-foreground',
		accent: 'text-primary',
		danger: 'text-destructive'
	};

	const VARIANT: Record<TextVariant, { element: string; size: TextSize; weight: TextWeight }> = {
		heading: { element: 'h2', size: '2xl', weight: 'bold' },
		body: { element: 'p', size: 'base', weight: 'normal' },
		caption: { element: 'span', size: 'sm', weight: 'normal' },
		label: { element: 'label', size: 'sm', weight: 'medium' }
	};

	const def = $derived(VARIANT[variant]);
	const element = $derived(as ?? def.element);
	const classes = $derived(
		cn(
			'font-[var(--font-body)] [letter-spacing:var(--letter-spacing)] transition-[color]',
			SIZE[size ?? def.size],
			WEIGHT[weight ?? def.weight],
			ALIGN[align],
			TONE[tone],
			italic && 'italic',
			truncate && 'truncate',
			className
		)
	);
</script>

<svelte:element this={element} class={classes}>
	{#if children}{@render children()}{/if}
</svelte:element>

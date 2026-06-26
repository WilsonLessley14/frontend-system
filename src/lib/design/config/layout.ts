/**
 * Layout configuration — single source of truth for breakpoints and container
 * widths. Mirror these into Tailwind's @theme when utility usage needs them.
 * See DESIGN_SYSTEM.md §5.
 */
export const breakpoints = {
	sm: 480,
	md: 768,
	lg: 1024,
	xl: 1440
} as const;

/** Max content widths, in rem. */
export const containers = {
	narrow: 40,
	prose: 65,
	wide: 90
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type ContainerSize = keyof typeof containers;

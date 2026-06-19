/**
 * Typed manifest of the design system's axes. This is the single source of truth
 * the showcase/playground controls are generated from — add an axis here and a new
 * control appears automatically, with no UI changes. See DESIGN_SYSTEM.md §3, §8.
 */
export type Axis = {
	/** the `data-*` attribute set on <html> */
	attribute: string;
	/** human label for the control group */
	label: string;
	/** allowed values, rendered as a segmented control */
	values: readonly string[];
	/** initial value */
	default: string;
};

export const axes = {
	mode: {
		attribute: 'data-mode',
		label: 'Character',
		values: ['soft', 'hard'],
		default: 'soft'
	},
	theme: {
		attribute: 'data-theme',
		label: 'Color',
		values: ['light', 'dark'],
		default: 'light'
	}
} satisfies Record<string, Axis>;

export type AxisName = keyof typeof axes;

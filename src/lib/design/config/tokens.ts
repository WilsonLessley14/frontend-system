import type { TokenValue } from '../editor-format';

/**
 * Editable token manifests. These drive both the editor controls and the export,
 * so adding an entry here surfaces a new control automatically (design-as-config).
 * Defaults mirror the committed token CSS; the editor seeds from them.
 */

export type Mode = 'soft' | 'hard';
export type Theme = 'light' | 'dark';

export type CharacterTokenDef = {
	name: string; // CSS custom property, e.g. "--radius"
	label: string;
	hint?: string;
	min?: number; // length controls
	max?: number;
	step?: number;
	defaults: Record<Mode, TokenValue>;
};

export type ColorRoleDef = {
	name: string; // e.g. "--surface"
	label: string;
	hint?: string;
	defaults: Record<Theme, string>; // hex per theme
};

export const FONT_PRESETS: { label: string; value: string }[] = [
	{ label: 'Sans', value: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' },
	{ label: 'Serif', value: 'Georgia, "Times New Roman", "Iowan Old Style", serif' },
	{ label: 'Mono', value: 'ui-monospace, "SFMono-Regular", Menlo, monospace' }
];

export const EASING_PRESETS = [
	'cubic-bezier(0.4, 0, 0.2, 1)',
	'ease',
	'linear',
	'ease-in-out',
	'steps(2, end)'
];

const SANS = FONT_PRESETS[0].value;
const SERIF = FONT_PRESETS[1].value;

export const characterTokens: CharacterTokenDef[] = [
	{
		name: '--radius',
		label: 'Radius (surfaces)',
		hint: 'Cards, dialogs, large surfaces',
		min: 0,
		max: 40,
		step: 1,
		defaults: {
			soft: { kind: 'length', value: 16, unit: 'px' },
			hard: { kind: 'length', value: 0, unit: 'px' }
		}
	},
	{
		name: '--radius-control',
		label: 'Radius (controls)',
		hint: 'Buttons, inputs',
		min: 0,
		max: 40,
		step: 1,
		defaults: {
			soft: { kind: 'length', value: 8, unit: 'px' },
			hard: { kind: 'length', value: 0, unit: 'px' }
		}
	},
	{
		name: '--shadow',
		label: 'Shadow (surfaces)',
		defaults: {
			soft: { kind: 'shadow', value: { x: 0, y: 8, blur: 24, spread: 0, color: '#000000', alpha: 0.12 } },
			hard: { kind: 'shadow', value: { x: 5, y: 5, blur: 0, spread: 0, color: '#000000', alpha: 1 } }
		}
	},
	{
		name: '--shadow-control',
		label: 'Shadow (controls)',
		defaults: {
			soft: { kind: 'shadow', value: { x: 0, y: 2, blur: 8, spread: 0, color: '#000000', alpha: 0.08 } },
			hard: { kind: 'shadow', value: { x: 2, y: 2, blur: 0, spread: 0, color: '#000000', alpha: 1 } }
		}
	},
	{
		name: '--font-body',
		label: 'Body font',
		defaults: {
			soft: { kind: 'font', value: SANS },
			hard: { kind: 'font', value: SERIF }
		}
	},
	{
		name: '--font-heading',
		label: 'Heading font',
		defaults: {
			soft: { kind: 'font', value: SANS },
			hard: { kind: 'font', value: SERIF }
		}
	},
	{
		name: '--border-width',
		label: 'Border width',
		min: 0,
		max: 6,
		step: 1,
		defaults: {
			soft: { kind: 'length', value: 1, unit: 'px' },
			hard: { kind: 'length', value: 2, unit: 'px' }
		}
	},
	{
		name: '--letter-spacing',
		label: 'Letter spacing',
		min: -0.05,
		max: 0.1,
		step: 0.005,
		defaults: {
			soft: { kind: 'length', value: 0, unit: 'em' },
			hard: { kind: 'length', value: 0.01, unit: 'em' }
		}
	},
	{
		name: '--transition',
		label: 'Transition',
		defaults: {
			soft: { kind: 'transition', value: { duration: 180, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' } },
			hard: { kind: 'transition', value: { duration: 80, easing: 'steps(2, end)' } }
		}
	}
];

export const colorRoles: ColorRoleDef[] = [
	{ name: '--surface', label: 'Surface', hint: 'Page background', defaults: { light: '#ffffff', dark: '#0b0d10' } },
	{ name: '--surface-raised', label: 'Surface raised', hint: 'Cards, popovers', defaults: { light: '#ffffff', dark: '#15181d' } },
	{ name: '--surface-sunken', label: 'Surface sunken', hint: 'Muted areas', defaults: { light: '#f6f7f9', dark: '#0b0d10' } },
	{ name: '--fg', label: 'Foreground', hint: 'Primary text', defaults: { light: '#15181d', dark: '#f6f7f9' } },
	{ name: '--fg-muted', label: 'Foreground muted', hint: 'Secondary text', defaults: { light: '#6b7685', dark: '#9aa4b2' } },
	{ name: '--border', label: 'Border', hint: 'Soft mode border', defaults: { light: '#dfe3e8', dark: '#262b33' } },
	{ name: '--accent', label: 'Accent', hint: 'Primary actions', defaults: { light: '#2563eb', dark: '#60a5fa' } },
	{ name: '--accent-fg', label: 'Accent foreground', hint: 'Text on accent', defaults: { light: '#ffffff', dark: '#0b0d10' } },
	{ name: '--danger', label: 'Danger', hint: 'Destructive actions', defaults: { light: '#dc2626', dark: '#f87171' } },
	{ name: '--danger-fg', label: 'Danger foreground', hint: 'Text on danger', defaults: { light: '#ffffff', dark: '#0b0d10' } }
];

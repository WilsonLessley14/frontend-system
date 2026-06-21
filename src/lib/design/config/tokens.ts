import type { TokenValue } from '../editor-format';

/**
 * Editable token manifests. These drive both the editor controls and the export,
 * so adding an entry here surfaces a new control automatically (design-as-config).
 * Defaults mirror the committed token CSS; the editor seeds from them.
 */

export type Mode = 'soft' | 'hard';
/** Theme names are an open set — see `themes` below. */
export type ThemeName = string;
export type Theme = ThemeName; // back-compat alias

export type CharacterTokenDef = {
	name: string; // CSS custom property, e.g. "--radius"
	label: string;
	hint?: string;
	min?: number; // length controls
	max?: number;
	step?: number;
	defaults: Record<Mode, TokenValue>;
};

/** A color role is theme-agnostic; its value per theme lives in `themes`. */
export type ColorRoleDef = {
	name: string; // e.g. "--surface"
	label: string;
	hint?: string;
};

/** A theme maps every color role name → hex. */
export type ColorTheme = Record<string, string>;

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
	{ name: '--surface', label: 'Surface', hint: 'Page background' },
	{ name: '--surface-raised', label: 'Surface raised', hint: 'Cards, popovers' },
	{ name: '--surface-sunken', label: 'Surface sunken', hint: 'Muted areas' },
	{ name: '--fg', label: 'Foreground', hint: 'Primary text' },
	{ name: '--fg-muted', label: 'Foreground muted', hint: 'Secondary text' },
	{ name: '--border', label: 'Border', hint: 'Soft-mode border' },
	{ name: '--accent', label: 'Accent', hint: 'Primary actions' },
	{ name: '--accent-fg', label: 'Accent foreground', hint: 'Text on accent' },
	{ name: '--danger', label: 'Danger', hint: 'Destructive actions' },
	{ name: '--danger-fg', label: 'Danger foreground', hint: 'Text on danger' }
];

/**
 * The named theme set (the data-theme axis). Each theme provides a hex for every
 * color role. To ADD a theme: add an entry here, create tokens/themes/<name>.css
 * with a [data-theme='<name>'] block, and @import it in styles.css. The theme-builder
 * can draft new themes live; export + commit them via those three steps.
 */
export const themes: Record<string, ColorTheme> = {
	light: {
		'--surface': '#ffffff',
		'--surface-raised': '#ffffff',
		'--surface-sunken': '#f6f7f9',
		'--fg': '#15181d',
		'--fg-muted': '#6b7685',
		'--border': '#dfe3e8',
		'--accent': '#2563eb',
		'--accent-fg': '#ffffff',
		'--danger': '#dc2626',
		'--danger-fg': '#ffffff'
	},
	dark: {
		'--surface': '#0b0d10',
		'--surface-raised': '#15181d',
		'--surface-sunken': '#0b0d10',
		'--fg': '#f6f7f9',
		'--fg-muted': '#9aa4b2',
		'--border': '#262b33',
		'--accent': '#60a5fa',
		'--accent-fg': '#0b0d10',
		'--danger': '#f87171',
		'--danger-fg': '#0b0d10'
	},
	pink: {
		'--surface': '#dfb9b9',
		'--surface-raised': '#b98383',
		'--surface-sunken': '#cb94cc',
		'--fg': '#000000',
		'--fg-muted': '#30353b',
		'--border': '#9567a2',
		'--accent': '#732cc9',
		'--accent-fg': '#ffffff',
		'--danger': '#de4a85',
		'--danger-fg': '#be55b0'
	}
};

export const themeNames: string[] = Object.keys(themes);

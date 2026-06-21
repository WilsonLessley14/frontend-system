import {
	characterTokens,
	colorRoles,
	themes,
	themeNames as initialThemeNames,
	type Mode
} from '$lib/design/config/tokens';
import {
	tokenToCss,
	generateModeCss,
	generateThemeCss,
	type TokenValue
} from '$lib/design/editor-format';

type CharMap = Record<string, TokenValue>;
type ColorMap = Record<string, string>;

function seedChar(mode: Mode): CharMap {
	const m: CharMap = {};
	for (const t of characterTokens) m[t.name] = structuredClone(t.defaults[mode]);
	return m;
}
function seedColorFrom(source: ColorMap | undefined): ColorMap {
	const m: ColorMap = {};
	for (const r of colorRoles) m[r.name] = source?.[r.name] ?? '#000000';
	return m;
}
function initialColor(): Record<string, ColorMap> {
	const out: Record<string, ColorMap> = {};
	for (const name of initialThemeNames) out[name] = seedColorFrom(themes[name]);
	return out;
}

/** Shared editor state. Character (per mode) and color (per named theme). */
export const editor = $state({
	character: { soft: seedChar('soft'), hard: seedChar('hard') },
	themeNames: [...initialThemeNames] as string[],
	color: initialColor() as Record<string, ColorMap>
});

export const characterNames = characterTokens.map((t) => t.name);
export const colorNames = colorRoles.map((r) => r.name);

/** Draft a new theme (live only until exported + committed). Seeds from an existing theme. */
export function addTheme(name: string, seedFrom?: string): boolean {
	const clean = name.trim();
	if (!clean || editor.color[clean]) return false;
	editor.color[clean] = seedColorFrom(seedFrom ? editor.color[seedFrom] : undefined);
	editor.themeNames.push(clean);
	return true;
}

// ── Imperative shell: DOM + storage ──────────────────────────────────────────

export function applyCharacter(mode: Mode): void {
	const el = document.documentElement;
	const map = editor.character[mode];
	for (const t of characterTokens) el.style.setProperty(t.name, tokenToCss(map[t.name]));
}

export function applyColor(theme: string): void {
	const el = document.documentElement;
	const map = editor.color[theme];
	if (!map) return;
	for (const r of colorRoles) el.style.setProperty(r.name, map[r.name]);
}

export function clearInline(names: string[]): void {
	const el = document.documentElement;
	for (const n of names) el.style.removeProperty(n);
}

const STORAGE_KEY = 'fs-editor';

export function persist(): void {
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify({
			character: editor.character,
			color: editor.color,
			themeNames: editor.themeNames
		})
	);
}

export function hydrate(): void {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return;
	try {
		const parsed = JSON.parse(raw);
		if (parsed.character) Object.assign(editor.character, parsed.character);
		if (parsed.color) Object.assign(editor.color, parsed.color);
		if (Array.isArray(parsed.themeNames)) editor.themeNames = parsed.themeNames;
	} catch {
		// ignore malformed storage
	}
}

// ── Export & reset ───────────────────────────────────────────────────────────

export function exportMode(mode: Mode): string {
	return generateModeCss(
		mode,
		characterTokens.map((t) => ({ name: t.name, value: editor.character[mode][t.name] }))
	);
}

export function exportTheme(theme: string): string {
	return generateThemeCss(
		theme,
		colorRoles.map((r) => ({ name: r.name, hex: editor.color[theme][r.name] }))
	);
}

export function resetCharacter(mode: Mode): void {
	editor.character[mode] = seedChar(mode);
}

export function resetColor(theme: string): void {
	editor.color[theme] = seedColorFrom(themes[theme]);
}

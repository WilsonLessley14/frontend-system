import {
	characterTokens,
	colorRoles,
	type Mode,
	type Theme
} from './config/tokens';
import {
	tokenToCss,
	generateModeCss,
	generateThemeCss,
	type TokenValue
} from './editor-format';

type CharMap = Record<string, TokenValue>;
type ColorMap = Record<string, string>;

function seedChar(mode: Mode): CharMap {
	const m: CharMap = {};
	for (const t of characterTokens) m[t.name] = structuredClone(t.defaults[mode]);
	return m;
}
function seedColor(theme: Theme): ColorMap {
	const m: ColorMap = {};
	for (const r of colorRoles) m[r.name] = r.defaults[theme];
	return m;
}

/** Shared editor state. Character (per mode) and color (per theme) overrides. */
export const editor = $state({
	character: { soft: seedChar('soft'), hard: seedChar('hard') },
	color: { light: seedColor('light'), dark: seedColor('dark') }
});

export const characterNames = characterTokens.map((t) => t.name);
export const colorNames = colorRoles.map((r) => r.name);

// ── Imperative shell: DOM + storage ──────────────────────────────────────────

export function applyCharacter(mode: Mode): void {
	const el = document.documentElement;
	const map = editor.character[mode];
	for (const t of characterTokens) el.style.setProperty(t.name, tokenToCss(map[t.name]));
}

export function applyColor(theme: Theme): void {
	const el = document.documentElement;
	const map = editor.color[theme];
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
		JSON.stringify({ character: editor.character, color: editor.color })
	);
}

export function hydrate(): void {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return;
	try {
		const parsed = JSON.parse(raw);
		if (parsed.character) Object.assign(editor.character, parsed.character);
		if (parsed.color) Object.assign(editor.color, parsed.color);
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

export function exportTheme(theme: Theme): string {
	return generateThemeCss(
		theme,
		colorRoles.map((r) => ({ name: r.name, hex: editor.color[theme][r.name] }))
	);
}

export function resetCharacter(mode: Mode): void {
	editor.character[mode] = seedChar(mode);
}

export function resetColor(theme: Theme): void {
	editor.color[theme] = seedColor(theme);
}

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

// A theme's reset target + its kind. Committed themes ship with the package and
// can't be removed; temporary themes are in-flight drafts. Same shape, distinct kind
// → removeTheme guards on the type, not an ad-hoc flag.
type CommittedTheme = { kind: 'committed'; base: ColorMap };
type TemporaryTheme = { kind: 'temporary'; base: ColorMap };
type ThemeEntry = CommittedTheme | TemporaryTheme;

function seedChar(mode: Mode): CharMap {
	const m: CharMap = {};
	for (const t of characterTokens) m[t.name] = structuredClone(t.defaults[mode]);
	return m;
}
/** A fresh color map covering every role, copied from `source` (missing → black). */
function cloneColors(source: ColorMap | undefined): ColorMap {
	const m: ColorMap = {};
	for (const r of colorRoles) m[r.name] = source?.[r.name] ?? '#000000';
	return m;
}
function initialThemeSet(): Record<string, ThemeEntry> {
	const out: Record<string, ThemeEntry> = {};
	for (const name of initialThemeNames) out[name] = { kind: 'committed', base: cloneColors(themes[name]) };
	return out;
}
function initialColor(): Record<string, ColorMap> {
	const out: Record<string, ColorMap> = {};
	for (const name of initialThemeNames) out[name] = cloneColors(themes[name]);
	return out;
}

/** Shared editor state. Character (per mode) and color (working values per theme). */
export const editor = $state({
	character: { soft: seedChar('soft'), hard: seedChar('hard') },
	themeNames: [...initialThemeNames] as string[],
	themeSet: initialThemeSet(),
	color: initialColor() as Record<string, ColorMap>
});

export const characterNames = characterTokens.map((t) => t.name);
export const colorNames = colorRoles.map((r) => r.name);

export function isTemporary(name: string): boolean {
	return editor.themeSet[name]?.kind === 'temporary';
}

/** Draft a new theme (live until exported + committed), seeded from an existing theme. */
export function addTheme(name: string, copyFrom?: string): boolean {
	const clean = name.trim();
	if (!clean || editor.color[clean]) return false;
	const base = cloneColors(copyFrom ? editor.color[copyFrom] : undefined);
	editor.themeSet[clean] = { kind: 'temporary', base };
	editor.color[clean] = cloneColors(base);
	editor.themeNames.push(clean);
	return true;
}

/** Remove a draft. Committed themes are protected by the type guard. */
export function removeTheme(name: string): boolean {
	const entry = editor.themeSet[name];
	if (!entry || entry.kind === 'committed') return false;
	delete editor.themeSet[name];
	delete editor.color[name];
	editor.themeNames = editor.themeNames.filter((n) => n !== name);
	return true;
}

function randomHex(): string {
	return '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
}

/** Scramble a draft's working colors to random hex. Committed themes are protected. */
export function randomizeColors(name: string): boolean {
	const entry = editor.themeSet[name];
	if (!entry || entry.kind === 'committed') return false;
	const next: ColorMap = {};
	for (const r of colorRoles) next[r.name] = randomHex();
	editor.color[name] = next;
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
			themeSet: editor.themeSet,
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
		// Restore only temporary (draft) entries; committed bases stay config-derived.
		if (parsed.themeSet) {
			for (const [name, entry] of Object.entries<ThemeEntry>(parsed.themeSet)) {
				if (entry?.kind === 'temporary' && entry.base) editor.themeSet[name] = entry;
			}
		}
		if (parsed.color) Object.assign(editor.color, parsed.color);
		if (Array.isArray(parsed.themeNames)) {
			editor.themeNames = parsed.themeNames.filter((n: unknown) => typeof n === 'string');
		}
		// Reconcile: every listed theme needs a set entry + color map. Stray names from an
		// older storage format become deletable drafts (so a broken theme can be removed).
		for (const name of editor.themeNames) {
			if (!editor.themeSet[name]) {
				editor.themeSet[name] = { kind: 'temporary', base: cloneColors(editor.color[name]) };
			}
			if (!editor.color[name]) editor.color[name] = cloneColors(editor.themeSet[name].base);
		}
		for (const name of initialThemeNames) {
			if (!editor.themeNames.includes(name)) editor.themeNames.push(name);
		}
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
	const entry = editor.themeSet[theme];
	if (!entry) return;
	editor.color[theme] = cloneColors(entry.base);
}

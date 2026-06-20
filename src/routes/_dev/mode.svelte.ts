import { axes } from '$lib/design/config/modes';

/**
 * Shared, reactive UI mode state. Keyed by axis name (see config/modes.ts).
 * Components read/write `ui[axisName]`; the root layout reflects it onto <html>
 * and persists it. See DESIGN_SYSTEM.md §3, §7, §8.
 */
const initial: Record<string, string> = {};
for (const [name, axis] of Object.entries(axes)) {
	initial[name] = axis.default;
}

export const ui: Record<string, string> = $state(initial);

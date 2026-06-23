/**
 * Public API for @wl/frontend-system.
 *
 *   import { Button, Card, Stack } from '@wl/frontend-system';
 *   import '@wl/frontend-system/styles.css';
 *
 * Customize entirely through tokens (data-mode / data-theme on <html>, or your
 * own exported theme/mode CSS) — components are not meant to be edited downstream.
 */

// ── Components (simple) ───────────────────────────────────────────────────────
export { Button, buttonVariants } from './components/ui/button';
export { Badge } from './components/ui/badge';
export { Input } from './components/ui/input';
export { Textarea } from './components/ui/textarea';
export { Label } from './components/ui/label';
export { Checkbox } from './components/ui/checkbox';
export { Switch } from './components/ui/switch';
export { Separator } from './components/ui/separator';
export { Skeleton } from './components/ui/skeleton';

// ── Components (compositional namespaces) ─────────────────────────────────────
export * as Card from './components/ui/card';
export * as Dialog from './components/ui/dialog';
export * as Select from './components/ui/select';
export * as Tabs from './components/ui/tabs';
export * as Accordion from './components/ui/accordion';
export * as Alert from './components/ui/alert';
export * as Avatar from './components/ui/avatar';
export * as Table from './components/ui/table';
export * as Tooltip from './components/ui/tooltip';
export * as RadioGroup from './components/ui/radio-group';
export * as DropdownMenu from './components/ui/dropdown-menu';
export * as Popover from './components/ui/popover';
export * as Breadcrumb from './components/ui/breadcrumb';

// ── Layout primitives ─────────────────────────────────────────────────────────
export { default as Stack } from './design/components/layout/stack.svelte';
export { default as Cluster } from './design/components/layout/cluster.svelte';
export { default as Grid } from './design/components/layout/grid.svelte';
export { default as Container } from './design/components/layout/container.svelte';

// ── Typography ────────────────────────────────────────────────────────────────
export { default as Text } from './design/components/typography/text.svelte';
export type {
	TextVariant,
	TextTone,
	TextSize,
	TextWeight,
	TextAlign
} from './design/components/typography/types';

// ── Utilities ─────────────────────────────────────────────────────────────────
export { cn, type WithElementRef, type WithoutChild, type WithoutChildren, type WithoutChildrenOrChild } from './utils';

// ── Token config & theme-authoring helpers ───────────────────────────────────
export { axes, type Axis, type AxisName } from './design/config/modes';
export { breakpoints, containers, type Breakpoint, type Container as ContainerSize } from './design/config/layout';
export {
	characterTokens,
	colorRoles,
	themes,
	themeNames,
	FONT_PRESETS,
	EASING_PRESETS,
	type CharacterTokenDef,
	type ColorRoleDef,
	type ColorTheme,
	type Mode,
	type ThemeName,
	type Theme
} from './design/config/tokens';
export {
	tokenToCss,
	shadowToCss,
	generateModeCss,
	generateThemeCss,
	type TokenValue,
	type ShadowValue,
	type TransitionValue
} from './design/editor-format';

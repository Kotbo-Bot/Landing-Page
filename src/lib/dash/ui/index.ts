/**
 * Primitives d'interface du dashboard, recopiées pour les écrans du site.
 *
 * Même rôle que `Kotbo/apps/dashboard/src/lib/components/ui/index.ts` : un
 * écran recopié importe d'ici ce que la page d'origine importait de là-bas,
 * sous le même nom, et garde son balisage tel quel. Seules les primitives
 * communes à au moins deux des écrans recopiés (membres et dossier membre,
 * staff, sanctions, tickets) sont là ; le reste se recopie dans l'écran.
 */
export { default as Button } from './Button.svelte';
export { default as Tabs, type TabItem } from './Tabs.svelte';
export { default as FilterPills, type FilterOption } from './FilterPills.svelte';
export { default as Callout } from './Callout.svelte';
export { default as Field } from './Field.svelte';
export { default as Menu, type MenuItem } from './Menu.svelte';

export { default as SectionCard } from './SectionCard.svelte';
export { default as ToggleSwitch } from './ToggleSwitch.svelte';
export { default as Modal } from './Modal.svelte';
export { default as EmptyState } from './EmptyState.svelte';
export { default as ModulePage } from './ModulePage.svelte';
export { default as RefreshButton } from './RefreshButton.svelte';
export { default as FormInput } from './FormInput.svelte';
export { default as Papicon } from '$lib/components/Papicon.svelte';

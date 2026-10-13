<!--
  En-tête de colonne triable et filtrable de la liste des sanctions.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/sanctions/ColumnSortFilter.svelte`
  (branche `recette`). Écarts : le panneau de filtre est en `bg-white` dans le
  dashboard, illisible en thème sombre (texte clair sur blanc) ; il prend ici
  la surface des menus. Escape le referme et rend le focus au bouton.
-->
<script lang="ts" module>
  export type ColumnFilterOption = { value: string; label: string };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import Papicon from '$lib/dash/Papicon.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { SortDirection, SortField } from './lib';

  const TEXT = {
    fr: {
      sortAsc: 'Tri croissant',
      sortDesc: 'Tri decroissant',
      enableSort: 'Activer le tri',
      activeFilters: (n: number) => `${n} filtre(s) actif(s)`,
      filterColumn: 'Filtrer cette colonne',
      filterLabel: (label: string) => `Filtrer ${label}`,
      clear: 'Effacer',
      search: 'Rechercher…',
      noResult: 'Aucun résultat',
    },
    en: {
      sortAsc: 'Ascending sort',
      sortDesc: 'Descending sort',
      enableSort: 'Enable sorting',
      activeFilters: (n: number) => `${n} active filter(s)`,
      filterColumn: 'Filter this column',
      filterLabel: (label: string) => `Filter ${label}`,
      clear: 'Clear',
      search: 'Search…',
      noResult: 'No result',
    },
  };

  const {
    label,
    sortField = null,
    sortDirection = null,
    onToggleSort,
    options = [],
    selectedValues = [],
    onToggleValue,
    searchable = false,
  }: {
    label: string;
    sortField?: SortField | null;
    sortDirection?: SortDirection | null;
    onToggleSort?: () => void;
    options?: ColumnFilterOption[];
    selectedValues?: string[];
    onToggleValue?: (value: string) => void;
    searchable?: boolean;
  } = $props();

  const t = $derived(TEXT[getLocale()]);

  let filterOpen = $state(false);
  let searchTerm = $state('');
  let rootElement = $state<HTMLElement | null>(null);
  let filterButton = $state<HTMLButtonElement | null>(null);

  const canSort = $derived(Boolean(sortField && onToggleSort));
  const canFilter = $derived(Boolean(onToggleValue && options.length > 0));
  const selectedCount = $derived(selectedValues.length);
  const displaySearch = $derived(searchable || options.length >= 8);
  const filteredOptions = $derived.by(() => {
    if (!displaySearch) return options;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return options;
    return options.filter((entry) => entry.label.toLowerCase().includes(normalizedSearch));
  });

  function closeFilterPanel() {
    filterOpen = false;
    searchTerm = '';
  }

  function toggleFilterPanel() {
    filterOpen = !filterOpen;
    if (!filterOpen) searchTerm = '';
  }

  function clearFilter() {
    for (const selected of [...selectedValues]) onToggleValue?.(selected);
  }

  function onPanelKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      closeFilterPanel();
      filterButton?.focus();
    }
  }

  onMount(() => {
    const handleWindowPointerDown = (event: PointerEvent) => {
      if (!filterOpen || !rootElement) return;
      const target = event.target;
      if (target instanceof Node && !rootElement.contains(target)) closeFilterPanel();
    };
    window.addEventListener('pointerdown', handleWindowPointerDown);
    return () => window.removeEventListener('pointerdown', handleWindowPointerDown);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative" bind:this={rootElement} onkeydown={onPanelKeydown}>
  <div class="flex items-center gap-1.5">
    <span class="text-xs font-semibold text-on-surface-variant">{label}</span>

    {#if canSort}
      <button
        type="button"
        onclick={() => onToggleSort?.()}
        class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-transparent text-2xs font-semibold transition hover:border-outline-variant hover:bg-surface-container {sortDirection ? 'text-primary' : 'text-on-surface-variant'}"
        title={sortDirection ? (sortDirection === 'asc' ? t.sortAsc : t.sortDesc) : t.enableSort}
        aria-label="{label} : {sortDirection ? (sortDirection === 'asc' ? t.sortAsc : t.sortDesc) : t.enableSort}"
      >
        {#if sortDirection === 'asc'}
          <Papicon icon="arrow-up" size={12} />
        {:else if sortDirection === 'desc'}
          <Papicon icon="arrow-down" size={12} />
        {:else}
          <Papicon icon="chevrons-up-down" size={12} />
        {/if}
      </button>
    {/if}

    {#if canFilter}
      <button
        type="button"
        bind:this={filterButton}
        onclick={toggleFilterPanel}
        aria-expanded={filterOpen}
        class="inline-flex h-6 min-w-6 items-center justify-center rounded-md border text-2xs font-semibold transition {selectedCount > 0 ? 'border-primary/35 bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline-variant hover:bg-surface-container'}"
        title={selectedCount > 0 ? t.activeFilters(selectedCount) : t.filterColumn}
        aria-label="{label} : {selectedCount > 0 ? t.activeFilters(selectedCount) : t.filterColumn}"
      >
        <Papicon icon="filter" size={12} />
      </button>
    {/if}
  </div>

  {#if canFilter && filterOpen}
    <div class="absolute left-0 top-8 z-20 w-64 rounded-xl border border-outline-variant bg-surface-container-lowest p-3 shadow-sm">
      <div class="mb-2 flex items-center justify-between gap-2">
        <p class="text-xs font-semibold text-on-surface-variant">{t.filterLabel(label.toLowerCase())}</p>
        {#if selectedCount > 0}
          <button type="button" onclick={clearFilter} class="text-2xs font-bold text-primary transition hover:opacity-80">
            {t.clear}
          </button>
        {/if}
      </div>

      {#if displaySearch}
        <input
          type="text"
          bind:value={searchTerm}
          placeholder={t.search}
          aria-label={t.search}
          class="mb-2 w-full rounded-lg border border-outline-variant bg-surface-container-low px-2.5 py-1.5 text-xs text-on-surface outline-none transition focus:border-primary"
        />
      {/if}

      <div class="max-h-56 space-y-1 overflow-y-auto pr-1">
        {#if filteredOptions.length === 0}
          <p class="py-2 text-xs text-on-surface-variant">{t.noResult}</p>
        {:else}
          {#each filteredOptions as entry (entry.value)}
            <label class="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-xs hover:bg-surface-container-low">
              <input
                type="checkbox"
                checked={selectedValues.includes(entry.value)}
                onchange={() => onToggleValue?.(entry.value)}
                class="rounded border-outline-variant"
              />
              <span class="truncate">{entry.label}</span>
            </label>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

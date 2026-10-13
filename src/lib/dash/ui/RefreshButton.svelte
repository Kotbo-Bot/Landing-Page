<!--
  Bouton « Actualiser » des pages du dashboard : une icône discrète, le
  libellé en infobulle.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/RefreshButton.svelte`
  (branche `recette`). Seuls les libellés par défaut changent : ils passent par
  `TEXT` au lieu du catalogue de traductions du dashboard.
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: { refresh: 'Actualiser' },
    en: { refresh: 'Refresh' },
  };

  const {
    onClick,
    onclick,
    loading = false,
    label = '',
    iconOnly = false,
    ariaLabel = '',
    className = '',
    iconClass = 'text-sm',
  }: {
    onClick?: (event: MouseEvent) => void | Promise<void>;
    onclick?: (event: MouseEvent) => void | Promise<void>;
    loading?: boolean;
    label?: string;
    iconOnly?: boolean;
    ariaLabel?: string;
    className?: string;
    iconClass?: string;
  } = $props();

  const t = $derived(TEXT[getLocale()]);

  /**
   * Les données se rechargent seules dans le dashboard : actualiser est un
   * recours, pas l'action principale. D'où une icône discrète plutôt qu'un
   * bouton plein ; `iconOnly` reste accepté, `label` sert d'infobulle.
   */
  const baseClass =
    'inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors';
</script>

<button
  type="button"
  onclick={onClick ?? onclick}
  aria-label={ariaLabel || t.refresh}
  aria-busy={loading}
  title={label || t.refresh}
  class="{baseClass} {iconOnly ? className : ''}"
>
  <Papicon icon="refresh-cw" size={16} class="{iconClass} {loading ? 'animate-spin' : ''}" />
</button>

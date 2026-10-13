<!--
  Pile de notifications, recopie de `ToastContainer.svelte` et `Toast.svelte`
  (dashboard, branche `recette`) en thème sombre seulement. Calée sur le cadre
  de l'aperçu (`absolute`) au lieu de la fenêtre.
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { Toasts } from './toasts.svelte';

  const TEXT = {
    fr: { close: 'Fermer' },
    en: { close: 'Close' },
  };

  const { toasts }: { toasts: Toasts } = $props();
  const t = $derived(TEXT[getLocale()]);

  const ICON = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' } as const;
  const COLOR = {
    success: 'bg-surface-container-high bg-linear-to-r from-emerald-500/12 to-emerald-500/12 text-success border-success/25',
    error: 'bg-surface-container-high bg-linear-to-r from-red-500/12 to-red-500/12 text-error border-error/25',
    warning: 'bg-surface-container-high bg-linear-to-r from-amber-500/12 to-amber-500/12 text-warning border-warning/25',
    info: 'bg-surface-container-high bg-linear-to-r from-blue-500/12 to-blue-500/12 text-blue-300 border-blue-500/30',
  } as const;
</script>

<div class="toast-container absolute bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none" aria-live="polite">
  {#each toasts.items as item (item.id)}
    <div
      class="pointer-events-auto relative overflow-hidden flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-lg shadow-black/40 animate-in slide-in-from-right fade-in duration-200 {COLOR[item.type]}"
      role="alert"
    >
      <Papicon name={ICON[item.type]} size={16} class="shrink-0" />
      <p class="text-sm flex-1">{item.message}</p>
      <button
        onclick={() => toasts.remove(item.id)}
        class="ml-auto p-0.5 hover:bg-white/10 rounded transition-colors cursor-pointer shrink-0"
        aria-label={t.close}
      >
        <Papicon name="close" size={14} />
      </button>
    </div>
  {/each}
</div>

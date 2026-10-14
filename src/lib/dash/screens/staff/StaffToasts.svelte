<!--
  Les toasts du dashboard (`lib/components/Toast.svelte`), en bas à droite du
  cadre de l'écran. Thème sombre posé d'office : l'écran n'a pas de mode clair.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Papicon } from '$lib/dash/ui';
  import { useStaff, type ToastItem } from './staffStore.svelte';

  const TEXT = {
    fr: { close: 'Fermer' },
    en: { close: 'Close' },
  };

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  const ICON: Record<ToastItem['type'], string> = { success: 'check-circle', error: 'alert-octagon', warning: 'alert-triangle', info: 'info' };
  const COLOR: Record<ToastItem['type'], string> = {
    success: 'bg-surface-container-high bg-linear-to-r from-emerald-500/12 to-emerald-500/12 text-success border-success/25',
    error: 'bg-surface-container-high bg-linear-to-r from-red-500/12 to-red-500/12 text-error border-error/25',
    warning: 'bg-surface-container-high bg-linear-to-r from-amber-500/12 to-amber-500/12 text-warning border-warning/25',
    info: 'bg-surface-container-high bg-linear-to-r from-blue-500/12 to-blue-500/12 text-blue-300 border-blue-500/30',
  };
</script>

<div class="pointer-events-none absolute bottom-4 right-4 flex w-80 flex-col gap-2" style="z-index: calc(var(--layer-confirm) + 1);" aria-live="polite">
  {#each staff.toasts as item (item.id)}
    <div class="pointer-events-auto relative flex items-center gap-2.5 overflow-hidden rounded-lg border px-3.5 py-2.5 shadow-lg shadow-black/40 animate-in slide-in-from-right fade-in duration-200 {COLOR[item.type]}" role="status">
      <Papicon icon={ICON[item.type]} size={16} class="shrink-0" />
      <p class="flex-1 text-sm">{item.message}</p>
      {#if item.action}
        {@const action = item.action}
        <button
          type="button"
          onclick={() => {
            action.onClick();
            staff.removeToast(item.id);
          }}
          class="ml-1 cursor-pointer whitespace-nowrap rounded bg-white/10 px-2 py-1 text-xs font-medium transition-colors hover:bg-white/20"
        >
          {action.label}
        </button>
      {/if}
      <button type="button" onclick={() => staff.removeToast(item.id)} class="ml-auto shrink-0 cursor-pointer rounded p-0.5 transition-colors hover:bg-white/10" aria-label={t.close}>
        <Papicon icon="x" size={14} />
      </button>
    </div>
  {/each}
</div>

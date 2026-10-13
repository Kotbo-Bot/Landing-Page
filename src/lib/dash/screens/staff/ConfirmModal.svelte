<!--
  Fenêtre de confirmation du dashboard (`lib/components/ConfirmModal.svelte`),
  calée sur le cadre de l'écran plutôt que sur la page. Elle répond à
  `staff.ask()`.
-->
<script lang="ts">
  import { tick } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, Papicon } from '$lib/dash/ui';
  import { useStaff } from './staffStore.svelte';

  const TEXT = {
    fr: { title: 'Confirmation requise', confirm: 'Confirmer', cancel: 'Annuler', impacts: 'Ce que ça entraîne' },
    en: { title: 'Confirmation required', confirm: 'Confirm', cancel: 'Cancel', impacts: 'What this will do' },
  };

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);
  const request = $derived(staff.confirmRequest);
  const uid = $props.id();

  const VARIANTS = {
    danger: { icon: 'alert-triangle', tone: 'bg-error/10 text-error', button: 'danger' },
    warning: { icon: 'alert-triangle', tone: 'bg-warning/10 text-warning', button: 'primary' },
    default: { icon: 'info', tone: 'bg-primary/10 text-primary', button: 'primary' },
  } as const;

  const config = $derived(VARIANTS[request?.variant ?? 'default']);

  let panel = $state<HTMLDivElement | null>(null);
  let returnFocus: HTMLElement | null = null;

  $effect(() => {
    if (!request) return;
    returnFocus = document.activeElement as HTMLElement | null;
    void tick().then(() => panel?.querySelector<HTMLElement>('[data-confirm]')?.focus());
    return () => returnFocus?.focus?.();
  });

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      staff.answer(false);
    }
  }
</script>

{#if request}
  <div
    class="confirm-modal absolute inset-0 flex items-center justify-center p-4"
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="{uid}-title"
    aria-describedby={request.description ? `${uid}-desc` : undefined}
    {onkeydown}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black/40 animate-in fade-in duration-150" onclick={() => staff.answer(false)}></div>

    <div
      bind:this={panel}
      class="confirm-modal__panel relative z-10 w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-5 space-y-5 animate-in fade-in slide-up duration-150"
    >
      <div class="flex items-start gap-3">
        <span class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 {config.tone}" aria-hidden="true">
          <Papicon icon={config.icon} size={17} />
        </span>
        <div class="min-w-0 pt-1.5">
          <h3 id="{uid}-title" class="text-base font-semibold text-on-surface leading-snug">{request.title || t.title}</h3>
          {#if request.description}
            <p id="{uid}-desc" class="text-sm text-on-surface-variant mt-1.5 leading-relaxed">{request.description}</p>
          {/if}
        </div>
      </div>

      {#if request.impacts?.length}
        <div class="rounded-lg border border-outline-variant bg-surface-container-low px-3.5 py-3">
          <p class="text-sm font-medium text-on-surface">{t.impacts}</p>
          <ul class="mt-1.5 space-y-1">
            {#each request.impacts as impact (impact)}
              <li class="flex items-start gap-2 text-sm text-on-surface-variant">
                <Papicon icon="arrow-right" size={13} class="mt-1 shrink-0" />
                <span>{impact}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <div class="confirm-modal__actions flex items-center justify-end gap-2">
        <Button variant="ghost" onclick={() => staff.answer(false)}>{t.cancel}</Button>
        <Button variant={config.button} data-confirm onclick={() => staff.answer(true)}>{request.confirmLabel || t.confirm}</Button>
      </div>
    </div>
  </div>
{/if}

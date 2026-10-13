<!--
  Fenêtre de confirmation de l'écran Sanctions (le `confirmDialog` du dashboard).

  Recopie du balisage de `Kotbo/apps/dashboard/src/lib/components/ConfirmModal.svelte`
  (branche `recette`), sans `requireInput` ni `impacts` que cet écran
  n'utilise pas. Calée sur le cadre de l'aperçu (`absolute`) au lieu de la
  fenêtre du navigateur. Escape annule, Entrée confirme ; le focus va au
  bouton de confirmation à l'ouverture.
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { Button } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { SanctionsDemo } from './demo.svelte';

  const TEXT = {
    fr: { cancel: 'Annuler' },
    en: { cancel: 'Cancel' },
  };

  const { demo }: { demo: SanctionsDemo } = $props();
  const t = $derived(TEXT[getLocale()]);
  const uid = $props.id();

  const VARIANTS = {
    danger: { icon: 'AlertTriangle', tone: 'bg-error/10 text-error', button: 'danger' },
    warning: { icon: 'AlertTriangle', tone: 'bg-warning/10 text-warning', button: 'primary' },
    default: { icon: 'Info', tone: 'bg-primary/10 text-primary', button: 'primary' },
  } as const;

  const options = $derived(demo.confirm);
  const config = $derived(VARIANTS[options?.variant ?? 'default']);

  let panel = $state<HTMLDivElement>();
  $effect(() => {
    if (options && panel) panel.querySelector<HTMLButtonElement>('[data-confirm]')?.focus();
  });

  function onkeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      demo.answer(false);
    }
  }
</script>

{#if options}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="confirm-modal absolute inset-0 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="{uid}-title"
    aria-describedby={options.description ? `${uid}-desc` : undefined}
    tabindex="-1"
    {onkeydown}
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black/40 animate-in fade-in duration-150" onclick={() => demo.answer(false)}></div>

    <div
      bind:this={panel}
      class="confirm-modal__panel relative z-10 w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-5 space-y-5 animate-in fade-in slide-up duration-150"
    >
      <div class="flex items-start gap-3">
        <span class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 {config.tone}" aria-hidden="true">
          <Papicon icon={config.icon} size={17} />
        </span>
        <div class="min-w-0 pt-1.5">
          <h3 id="{uid}-title" class="text-base font-semibold text-on-surface leading-snug">{options.title}</h3>
          {#if options.description}
            <p id="{uid}-desc" class="text-sm text-on-surface-variant mt-1.5 leading-relaxed">{options.description}</p>
          {/if}
        </div>
      </div>

      <div class="confirm-modal__actions flex items-center justify-end gap-2">
        <Button variant="ghost" onclick={() => demo.answer(false)}>{t.cancel}</Button>
        <Button variant={config.button} data-confirm onclick={() => demo.answer(true)}>
          {options.confirmLabel}
        </Button>
      </div>
    </div>
  </div>
{/if}

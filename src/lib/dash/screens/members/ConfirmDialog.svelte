<!--
  Fenêtre de confirmation du dashboard, recopiée de `components/ConfirmModal.svelte`
  (branche `recette`). Là-bas elle est téléportée dans `<body>` ; ici elle se
  cale sur le cadre de l'aperçu (`absolute`), comme `ui/Modal`, et écoute le
  clavier sur elle-même plutôt que sur toute la fenêtre du navigateur.
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { Button } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: { required: 'Confirmation requise', confirm: 'Confirmer', cancel: 'Annuler' },
    en: { required: 'Confirmation required', confirm: 'Confirm', cancel: 'Cancel' },
  };

  const {
    title = '',
    description = '',
    confirmLabel = '',
    variant = 'default',
    onConfirm,
    onCancel,
  }: {
    title?: string;
    description?: string;
    confirmLabel?: string;
    variant?: 'danger' | 'warning' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
  } = $props();

  const t = $derived(TEXT[getLocale()]);
  const uid = $props.id();

  const VARIANTS = {
    danger: { icon: 'AlertTriangle', tone: 'bg-error/10 text-error', button: 'danger' },
    warning: { icon: 'AlertTriangle', tone: 'bg-warning/10 text-warning', button: 'primary' },
    default: { icon: 'Info', tone: 'bg-primary/10 text-primary', button: 'primary' },
  } as const;
  const config = $derived(VARIANTS[variant]);

  let panel = $state<HTMLDivElement>();

  // La fenêtre prend le focus à l'ouverture, sans faire défiler la page.
  $effect(() => {
    panel?.querySelector<HTMLElement>('[data-confirm]')?.focus({ preventScroll: true });
  });

  function onkeydown(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Escape') onCancel();
  }
</script>

<div
  class="confirm-modal absolute inset-0 flex items-center justify-center p-4"
  role="dialog"
  tabindex="-1"
  aria-modal="true"
  aria-labelledby="{uid}-title"
  aria-describedby={description ? `${uid}-desc` : undefined}
  {onkeydown}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="absolute inset-0 bg-black/40" onclick={onCancel}></div>
  <div bind:this={panel} class="relative z-10 w-full max-w-md space-y-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-lg">
    <div class="flex items-start gap-3">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full {config.tone}" aria-hidden="true">
        <Papicon icon={config.icon} size={17} />
      </span>
      <div class="min-w-0 pt-1.5">
        <h3 id="{uid}-title" class="text-base font-semibold leading-snug text-on-surface">{title || t.required}</h3>
        {#if description}
          <p id="{uid}-desc" class="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{description}</p>
        {/if}
      </div>
    </div>
    <div class="flex items-center justify-end gap-2">
      <Button variant="ghost" onclick={onCancel}>{t.cancel}</Button>
      <Button variant={config.button} onclick={onConfirm} data-confirm>{confirmLabel || t.confirm}</Button>
    </div>
  </div>
</div>

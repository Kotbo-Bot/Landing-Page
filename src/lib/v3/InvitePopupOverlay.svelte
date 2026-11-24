<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { invitePopup } from './invitePopup.svelte';

  const COPY = {
    fr: {
      title: "Finalise l'ajout de Kotbo dans la fenêtre Discord…",
      desc: 'Une fois le serveur sélectionné et les permissions validées, tu seras redirigé automatiquement vers la configuration.',
      focus: 'Ramener la fenêtre Discord',
      fallback: 'Ouvrir dans cet onglet',
      cancel: 'Annuler',
    },
    en: {
      title: 'Finish adding Kotbo in the Discord window…',
      desc: 'Once you select your server and confirm permissions, you will be redirected straight to setup.',
      focus: 'Focus Discord window',
      fallback: 'Open in this tab',
      cancel: 'Cancel',
    },
  } as const;

  const t = $derived(COPY[getLocale()]);

  function handleKeydown(event: KeyboardEvent) {
    if (invitePopup.open && event.key === 'Escape') {
      invitePopup.close();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if invitePopup.open}
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="kotbo-oauth-popup-title"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
  >
    <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-6 text-center shadow-2xl">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4f46e5]/20 text-indigo-400">
        <span class="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></span>
      </div>

      <h2 id="kotbo-oauth-popup-title" class="text-lg font-bold text-white">
        {t.title}
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-zinc-400">
        {t.desc}
      </p>

      <div class="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onclick={() => invitePopup.focusPopup()}
          class="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#4f46e5] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4338ca]"
        >
          {t.focus}
        </button>
        <button
          type="button"
          onclick={() => invitePopup.continueInTab()}
          class="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
        >
          {t.fallback}
        </button>
        <button
          type="button"
          onclick={() => invitePopup.close()}
          class="mt-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  </div>
{/if}

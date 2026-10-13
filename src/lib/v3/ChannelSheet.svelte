<script lang="ts">
  /**
   * La liste des salons sur téléphone et tablette, en panneau qui glisse
   * depuis la gauche, comme dans Discord mobile. Ouverte par l'icône de menu
   * des barres de salon. Un vrai dialogue : le focus y entre, Échap le ferme,
   * le focus revient au bouton qui l'a ouvert.
   */
  import { tick } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { CHANNELS } from './channels';
  import { channelSheet } from './sheet.svelte';

  const TEXT = {
    fr: { title: 'Salons de la page', close: 'Fermer' },
    en: { title: 'Page channels', close: 'Close' },
  };
  const t = $derived(TEXT[getLocale()]);
  const groups = $derived(CHANNELS[getLocale()]);

  let dialog = $state<HTMLDialogElement | null>(null);
  let opener: HTMLElement | null = null;

  $effect(() => {
    if (!dialog) return;
    if (channelSheet.open && !dialog.open) {
      opener = document.activeElement as HTMLElement | null;
      dialog.showModal();
      void tick().then(() => dialog?.querySelector<HTMLElement>('a')?.focus());
    } else if (!channelSheet.open && dialog.open) {
      dialog.close();
    }
  });

  function onClose() {
    channelSheet.hide();
    opener?.focus();
  }
</script>

<dialog
  bind:this={dialog}
  onclose={onClose}
  onclick={(e) => e.target === dialog && channelSheet.hide()}
  aria-labelledby="sheet-title"
  class="sheet m-0 h-full max-h-none w-[min(20rem,85vw)] max-w-none bg-night-2 p-0 text-white backdrop:bg-black/60 lg:hidden"
>
  <div class="flex h-full flex-col">
    <div class="flex h-14 items-center justify-between border-b border-line px-4">
      <p id="sheet-title" class="font-display text-base font-bold">{t.title}</p>
      <button type="button" onclick={() => channelSheet.hide()} class="min-h-11 rounded-lg px-3 text-sm font-semibold text-mist hover:bg-night-3 hover:text-white">
        {t.close}
      </button>
    </div>
    <nav aria-labelledby="sheet-title" class="flex-1 overflow-y-auto px-2 py-3">
      {#each groups as group (group.label)}
        <p class="mb-1 mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-fog first:mt-1">{group.label}</p>
        <ul class="space-y-px">
          {#each group.channels as channel (channel.id)}
            <li>
              <a
                href="#{channel.id}"
                onclick={() => channelSheet.hide()}
                class="flex min-h-11 items-center gap-2 rounded-md px-2 text-[16px] text-mist hover:bg-night-3 hover:text-white"
              >
                <span aria-hidden="true" class="text-lg text-fog">#</span>
                <span class="min-w-0">
                  <span class="block truncate" translate="no">{channel.name}</span>
                  <span class="block truncate text-xs text-fog">{channel.topic}</span>
                </span>
              </a>
            </li>
          {/each}
        </ul>
      {/each}
    </nav>
  </div>
</dialog>

<style>
  .sheet[open] {
    animation: sheet-in 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes sheet-in {
    from {
      transform: translateX(-100%);
    }
  }
</style>

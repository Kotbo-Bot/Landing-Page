<!--
  Liste noire d'ouverture de tickets : qui ne peut plus en ouvrir, jusqu'à
  quand, et pourquoi.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketBlacklist.svelte`
  (branche `recette`). L'ajout et le retrait modifient la liste de démo au lieu
  d'appeler l'API ; le contrôle de l'identifiant Discord est le même.
-->
<script lang="ts">
  import { Papicon, FormInput } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { buildBlacklist, ME, type DemoBlacklistEntry } from '$lib/dash/fixtures/tickets';
  import type { Ask } from './confirm';
  import type { Toasts } from './toastStore.svelte';

  const TEXT = {
    fr: {
      errInvalidId: 'Identifiant Discord invalide',
      added: 'Membre ajouté à la liste noire.',
      removeTitle: 'Retirer de la liste noire ?',
      removeDesc: (name: string) => `${name} pourra de nouveau ouvrir un ticket.`,
      removeConfirm: 'Retirer',
      removed: 'Membre retiré de la liste noire.',
      title: 'Liste noire des tickets',
      desc: 'Les membres listés ici ne peuvent plus ouvrir de ticket sur ce serveur.',
      userId: 'Identifiant Discord',
      duration: 'Durée (jours)',
      durationPh: 'Vide = définitif',
      reason: 'Raison',
      reasonPh: 'Communiquée au membre',
      allowReopen: 'Autoriser la réouverture de ses anciens tickets',
      allowReopenDesc: "Un membre de la liste noire ne peut plus ouvrir de ticket. Coche cette case pour qu'il puisse quand même demander à rouvrir un ticket déjà traité.",
      fillField: "Remplis d'abord le champ correctement.",
      add: 'Ajouter',
      empty: 'Personne dans la liste noire',
      noReason: 'Aucune raison précisée',
      until: (date: string) => `Jusqu'au ${date}`,
      permanent: 'Définitif',
      addedBy: (name: string) => `Ajouté par ${name}`,
      reopenAllowed: 'Réouverture autorisée',
    },
    en: {
      errInvalidId: 'Invalid Discord ID',
      added: 'Member added to the blocklist.',
      removeTitle: 'Remove from the blocklist?',
      removeDesc: (name: string) => `${name} will be able to open tickets again.`,
      removeConfirm: 'Remove',
      removed: 'Member removed from the blocklist.',
      title: 'Ticket blocklist',
      desc: 'Members listed here can no longer open a ticket on this server.',
      userId: 'Discord ID',
      duration: 'Duration (days)',
      durationPh: 'Empty = permanent',
      reason: 'Reason',
      reasonPh: 'Shown to the member',
      allowReopen: 'Allow reopening their past tickets',
      allowReopenDesc: "A blocklisted member can't open tickets. Tick this so they can still ask to reopen a ticket that was already handled.",
      fillField: 'Fill in the field correctly first.',
      add: 'Add',
      empty: 'Nobody on the blocklist',
      noReason: 'No reason given',
      until: (date: string) => `Until ${date}`,
      permanent: 'Permanent',
      addedBy: (name: string) => `Added by ${name}`,
      reopenAllowed: 'Reopening allowed',
    },
  };

  const { ask, toasts }: { ask: Ask; toasts: Toasts } = $props();

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const dateLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-GB');

  let blacklistEntries = $state<DemoBlacklistEntry[]>(buildBlacklist());
  let blacklistUserId = $state('');
  let blacklistReason = $state('');
  let blacklistDurationDays = $state('');
  let blacklistAllowReopen = $state(false);

  function addToBlacklist() {
    const userId = String(blacklistUserId).trim();
    if (!/^\d{15,25}$/.test(userId)) {
      toasts.error(t.errInvalidId);
      return;
    }
    const days = String(blacklistDurationDays).trim() ? Number(blacklistDurationDays) : null;
    const reason = String(blacklistReason).trim();
    blacklistEntries = [
      {
        id: `bl-${Date.now()}`,
        userId,
        username: null,
        avatarUrl: null,
        reason: reason ? { fr: reason, en: reason } : null,
        addedByTag: ME.username,
        expiresAt: days && days > 0 ? new Date(Date.now() + days * 86_400_000).toISOString() : null,
        allowReopen: blacklistAllowReopen,
        createdAt: new Date().toISOString(),
      },
      ...blacklistEntries.filter((entry) => entry.userId !== userId),
    ];
    blacklistUserId = '';
    blacklistReason = '';
    blacklistDurationDays = '';
    blacklistAllowReopen = false;
    toasts.success(t.added);
  }

  async function removeFromBlacklist(entry: DemoBlacklistEntry) {
    if (!(await ask({ title: t.removeTitle, description: t.removeDesc(entry.username || entry.userId), confirmLabel: t.removeConfirm }))) return;
    blacklistEntries = blacklistEntries.filter((item) => item.id !== entry.id);
    toasts.success(t.removed);
  }
</script>

<div class="max-w-4xl mx-auto space-y-4">
  <div class="pb-2">
    <h3 class="text-lg font-semibold text-on-surface">{t.title}</h3>
    <p class="text-on-surface-variant text-xs mt-0.5">{t.desc}</p>
  </div>

  <!-- Ajout d'une interdiction -->
  <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 p-5 space-y-4">
    <div class="grid grid-cols-3 gap-3">
      <label class="block">
        <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.userId}</span>
        <FormInput type="text" bind:value={blacklistUserId} placeholder="123456789012345678" className="w-full" />
      </label>
      <label class="block">
        <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.duration}</span>
        <FormInput type="text" bind:value={blacklistDurationDays} placeholder={t.durationPh} className="w-full" />
      </label>
      <label class="block">
        <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.reason}</span>
        <FormInput type="text" bind:value={blacklistReason} placeholder={t.reasonPh} className="w-full" />
      </label>
    </div>
    <label class="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-white/5 rounded-xl transition-colors">
      <input type="checkbox" bind:checked={blacklistAllowReopen} class="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant/30" />
      <div>
        <span class="text-xs font-bold text-on-surface">{t.allowReopen}</span>
        <p class="text-2xs text-on-surface-variant">{t.allowReopenDesc}</p>
      </div>
    </label>
    <div class="flex justify-end">
      <button
        onclick={addToBlacklist}
        title={!String(blacklistUserId).trim() ? t.fillField : undefined}
        class="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center gap-2"
      >
        <Papicon icon="user-minus" size={13} />
        {t.add}
      </button>
    </div>
  </div>

  <!-- Liste des interdictions en vigueur -->
  <div class="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 overflow-hidden">
    {#if blacklistEntries.length === 0}
      <div class="flex flex-col items-center justify-center py-16 text-on-surface-variant/30">
        <Papicon icon="shield" size={36} class="opacity-50 mb-2" />
        <p class="text-xs font-bold">{t.empty}</p>
      </div>
    {:else}
      <div class="divide-y divide-outline-variant/10">
        {#each blacklistEntries as entry (entry.id)}
          <div class="flex items-center gap-3 p-3.5">
            {#if entry.avatarUrl}
              <img src={entry.avatarUrl} alt={entry.username || entry.userId} class="w-9 h-9 rounded-xl object-cover shrink-0" />
            {:else}
              <div class="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                {(entry.username || '?').charAt(0).toUpperCase()}
              </div>
            {/if}
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-on-surface truncate">@{entry.username || entry.userId}</p>
              <p class="text-2xs text-on-surface-variant truncate">
                {entry.reason ? entry.reason[locale] : t.noReason}
              </p>
              <p class="text-2xs text-on-surface-variant/40 mt-0.5">
                {entry.expiresAt ? t.until(new Date(entry.expiresAt).toLocaleString(dateLocale)) : t.permanent}
                {#if entry.addedByTag} · {t.addedBy(entry.addedByTag)}{/if}
              </p>
              {#if entry.allowReopen}
                <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-2xs font-semibold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {t.reopenAllowed}
                </span>
              {/if}
            </div>
            <button
              onclick={() => removeFromBlacklist(entry)}
              class="p-2 rounded-lg bg-error/10 text-error hover:bg-rose-500 hover:text-white border border-error/15 transition-all shrink-0"
              title={t.removeConfirm}
              aria-label={t.removeConfirm}
            >
              <Papicon icon="trash-2" size={14} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

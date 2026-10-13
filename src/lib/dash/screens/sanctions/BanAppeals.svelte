<!--
  Onglet « Contestations de ban » de Sécurité > Sanctions : file d'attente,
  historique et liste noire des contestations.

  Recopie du balisage de `Kotbo/apps/dashboard/src/pages/BanAppeals.svelte`
  (branche `recette`), sans son `ModulePage` (l'écran garde celui de la page
  Sanctions et ses onglets pour qu'on puisse revenir à l'historique). Les
  appels à `/appeals` modifient l'état de démo : un verdict sur la sanction
  d'Arka (archiver, verrouiller, supprimer) se voit dans l'historique.
  Écarts : le détail d'une demande tient sur trois colonnes au lieu d'une
  pile, pour tenir dans le cadre sans défiler ; l'onglet Configuration
  est désactivé (une vingtaine de réglages, plus haut que le cadre) ; les
  classes `dark:` sont écrites à leur valeur sombre.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Papicon from '$lib/dash/Papicon.svelte';
  import { Tabs } from '$lib/dash/ui';
  import { memberAvatarSrc } from '$lib/dash/media';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { MEMBERS } from '$lib/dash/cast';
  import { ARKA_HISTORY, VIEWER, type AppealOutcome, type DemoAppeal, type DemoAppealItem } from '$lib/dash/fixtures/sanctions';
  import type { SanctionsDemo } from './demo.svelte';
  import { dateLocale, tr } from './lib';

  const TEXT = {
    fr: {
      tabsLabel: 'Contestations de ban',
      tabQueue: (n: number) => `File d'attente (${n})`,
      tabHistory: 'Historique',
      tabConfig: 'Configuration',
      tabBlacklist: (n: number) => `Liste noire (${n})`,
      emptyQueue: 'Aucune demande en attente.',
      emptyHistory: 'Aucune demande traitée pour le moment.',
      contestedCount: (n: number) => `${n} sanction(s) contestée(s)`,
      banLabel: 'Ban :',
      contestedSanctions: (n: number) => `Sanctions contestées (${n})`,
      sanctionGone: 'Cette sanction a été supprimée de la base.',
      itemApply: 'Appliquer',
      verdictFor: 'Verdict',
      contestedHint: 'Chaque sanction reçoit son propre verdict. Applique-les, puis prononce la décision globale pour prévenir le membre.',
      answers: 'Réponses',
      discussion: 'Discussion',
      staffNamed: (tag: string) => `Staff (${tag})`,
      unknown: 'inconnu',
      member: 'Membre',
      waitingMember: 'En attente de la réponse du membre…',
      sanctionHistory: (n: number) => `Historique de sanctions (${n})`,
      noSanction: 'Aucune sanction enregistrée.',
      badgeArchived: 'archivée',
      badgeLocked: 'verrouillée',
      previousAppeals: (n: number) => `Appels précédents (${n})`,
      firstAppeal: 'Premier appel de ce membre.',
      decisionPh: "Raison du refus / note d'acceptation / question au membre…",
      acceptUnban: 'Accepter et débannir',
      deny: 'Refuser',
      denyPermanent: 'Refus définitif',
      requestInfo: "Demander plus d'infos",
      decisionHint: (d: number) => `Accepter : le membre est débanni et reçoit une invitation en message privé. Refuser : il reçoit ta raison et doit attendre ${d} jours avant de recommencer.`,
      decisionLabel: (s: string) => `Décision : ${s}`,
      decidedBy: (tag: string) => ` par ${tag}`,
      decidedAt: (date: string) => ` le ${date}`,
      dmDelivered: 'DM de verdict envoyé au membre',
      dmFailed: 'DM non délivré (DM fermés) - le membre verra le verdict sur la page publique',
      noBlacklist: "Personne n'est privé de contestation.",
      blacklistId: (id: string) => `ID : ${id}`,
      blacklistAddedBy: (tag: string, date: string) => `· ajouté par ${tag} le ${date}`,
      remove: 'Retirer',
      blacklistRemoved: 'Retiré de la liste noire',
      reasonRequired: 'Une raison est requise pour un refus',
      askQuestion: 'Écris la question à poser au membre',
      infoSent: "Demande d'informations envoyée au membre",
      acceptedToast: 'Appel accepté - membre débanni et prévenu par DM',
      deniedToast: 'Appel refusé - membre prévenu par DM',
      permanentTitle: 'Refus définitif ?',
      permanentDesc: 'Ce membre ne pourra plus jamais faire appel de son bannissement.',
      permanentConfirm: 'Refuser définitivement',
      itemDeleteTitle: 'Supprimer définitivement cette sanction ?',
      itemDeleteDesc: "La sanction disparaîtra du casier et ne pourra pas être restaurée. Préfère l'archivage si tu veux garder la trace.",
      itemDeleteConfirm: 'Supprimer définitivement',
      itemApplied: 'Verdict appliqué à cette sanction.',
      noReason: 'Sans raison',
      type: { WARN: 'Avertissement', KICK: 'Expulsion', TIMEOUT: 'Exclusion temporaire', TEMP_BAN: 'Bannissement temporaire', BAN: 'Bannissement', SOFTBAN: 'Softban' } as Record<string, string>,
      outcome: {
        PENDING: 'À trancher',
        UPHELD: 'Maintenir la sanction',
        ARCHIVED: 'Archiver (annuler, garder la trace)',
        DELETED: 'Supprimer définitivement',
        LOCKED: 'Maintenir et verrouiller',
      } as Record<AppealOutcome, string>,
      status: {
        PENDING: 'En attente',
        NEEDS_INFO: "Attente d'infos",
        ACCEPTED: 'Accepté',
        DENIED: 'Refusé',
        DENIED_PERMANENT: 'Refus définitif',
      } as Record<string, string>,
    },
    en: {
      tabsLabel: 'Ban appeals',
      tabQueue: (n: number) => `Queue (${n})`,
      tabHistory: 'History',
      tabConfig: 'Configuration',
      tabBlacklist: (n: number) => `Blocklist (${n})`,
      emptyQueue: 'No pending request.',
      emptyHistory: 'No request handled yet.',
      contestedCount: (n: number) => `${n} contested sanction(s)`,
      banLabel: 'Ban:',
      contestedSanctions: (n: number) => `Contested sanctions (${n})`,
      sanctionGone: 'This sanction was deleted from the database.',
      itemApply: 'Apply',
      verdictFor: 'Verdict',
      contestedHint: 'Each sanction gets its own verdict. Apply them, then issue the overall decision to notify the member.',
      answers: 'Answers',
      discussion: 'Discussion',
      staffNamed: (tag: string) => `Staff (${tag})`,
      unknown: 'unknown',
      member: 'Member',
      waitingMember: "Waiting for the member's reply…",
      sanctionHistory: (n: number) => `Sanction history (${n})`,
      noSanction: 'No sanction recorded.',
      badgeArchived: 'archived',
      badgeLocked: 'locked',
      previousAppeals: (n: number) => `Previous appeals (${n})`,
      firstAppeal: 'First appeal from this member.',
      decisionPh: 'Reason for denial / note on acceptance / question to the member…',
      acceptUnban: 'Accept and unban',
      deny: 'Deny',
      denyPermanent: 'Deny permanently',
      requestInfo: 'Ask for more info',
      decisionHint: (d: number) => `Accept: the member is unbanned and gets an invite by DM. Deny: they get your reason and must wait ${d} days before trying again.`,
      decisionLabel: (s: string) => `Decision: ${s}`,
      decidedBy: (tag: string) => ` by ${tag}`,
      decidedAt: (date: string) => ` on ${date}`,
      dmDelivered: 'Verdict DM sent to the member',
      dmFailed: 'DM not delivered (DMs closed) - the member will see the verdict on the public page',
      noBlacklist: 'Nobody is barred from appealing.',
      blacklistId: (id: string) => `ID: ${id}`,
      blacklistAddedBy: (tag: string, date: string) => `· added by ${tag} on ${date}`,
      remove: 'Remove',
      blacklistRemoved: 'Removed from the blocklist',
      reasonRequired: 'A reason is required to deny an appeal',
      askQuestion: 'Write the question to ask the member',
      infoSent: 'Information request sent to the member',
      acceptedToast: 'Appeal accepted - member unbanned and notified by DM',
      deniedToast: 'Appeal denied - member notified by DM',
      permanentTitle: 'Deny permanently?',
      permanentDesc: 'This member will never be able to appeal their ban again.',
      permanentConfirm: 'Deny permanently',
      itemDeleteTitle: 'Permanently delete this sanction?',
      itemDeleteDesc: 'The sanction will disappear from the record and cannot be restored. Prefer archiving if you want to keep a trace.',
      itemDeleteConfirm: 'Delete permanently',
      itemApplied: 'Verdict applied to this sanction.',
      noReason: 'No reason',
      type: { WARN: 'Warning', KICK: 'Kick', TIMEOUT: 'Timeout', TEMP_BAN: 'Temporary ban', BAN: 'Ban', SOFTBAN: 'Softban' } as Record<string, string>,
      outcome: {
        PENDING: 'Undecided',
        UPHELD: 'Uphold the sanction',
        ARCHIVED: 'Archive (cancel, keep a record)',
        DELETED: 'Delete permanently',
        LOCKED: 'Uphold and lock',
      } as Record<AppealOutcome, string>,
      status: {
        PENDING: 'Pending',
        NEEDS_INFO: 'Awaiting info',
        ACCEPTED: 'Accepted',
        DENIED: 'Denied',
        DENIED_PERMANENT: 'Permanently denied',
      } as Record<string, string>,
    },
  };

  const { demo, pageTabs }: { demo: SanctionsDemo; pageTabs?: Snippet } = $props();
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const uid = $props.id();

  /** Délai par défaut du module (`cooldownDays`). */
  const COOLDOWN_DAYS = 30;

  let tab = $state<'queue' | 'history' | 'config' | 'blacklist'>('queue');
  let detailId = $state<string | null>(null);
  let actionReason = $state('');
  let itemOutcomes = $state<Record<string, AppealOutcome>>({});

  const appeals = $derived(demo.appeals);
  const queue = $derived(appeals.filter((a) => a.status === 'PENDING' || a.status === 'NEEDS_INFO'));
  const history = $derived(appeals.filter((a) => a.status !== 'PENDING' && a.status !== 'NEEDS_INFO'));
  const detail = $derived(appeals.find((a) => a.id === detailId) ?? null);

  const OUTCOME_CLASSES: Record<AppealOutcome, string> = {
    PENDING: 'bg-warning/10 text-warning border-warning/30',
    UPHELD: 'bg-surface-container text-on-surface-variant border-outline-variant/30',
    ARCHIVED: 'bg-success/10 text-success border-success/30',
    DELETED: 'bg-error/10 text-error border-error/30',
    LOCKED: 'bg-rose-900/20 text-error border-rose-900/40',
  };

  const STATUS_CLASSES: Record<string, string> = {
    PENDING: 'bg-warning/10 text-warning border-warning/30',
    NEEDS_INFO: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    ACCEPTED: 'bg-success/10 text-success border-success/30',
    DENIED: 'bg-error/10 text-error border-error/30',
    DENIED_PERMANENT: 'bg-rose-900/20 text-error border-rose-900/40',
  };

  /** Ce que renvoie `/appeals/:id` en `sanctions` : le casier du membre, à jour. */
  const detailSanctions = $derived.by(() => {
    if (!detail) return [];
    const base =
      detail.userId === MEMBERS.arka.userId
        ? ARKA_HISTORY
        : demo.sanctions
            .filter((s) => s.targetUserId === detail.userId)
            .map((s) => ({ id: s.id, type: s.type, createdAt: s.createdAt, moderatorTag: s.moderatorTag, reason: s.reason }));
    return base
      .map((s) => {
        const live = demo.sanctions.find((entry) => entry.id === s.id);
        // Absente de la liste mais connue du casier : seule la sanction supprimée manque.
        if (!live && s.id === detail.sanctions[0]?.sanctionId) return null;
        return { ...s, archivedAt: live?.archivedAt ?? null, appealable: live?.appealable ?? true };
      })
      .filter((s) => s !== null);
  });

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(dateLocale(locale), { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function openDetail(appealId: string) {
    if (detailId === appealId) {
      detailId = null;
      return;
    }
    actionReason = '';
    const appeal = appeals.find((a) => a.id === appealId);
    itemOutcomes = Object.fromEntries((appeal?.sanctions ?? []).map((item) => [item.id, item.outcome === 'PENDING' ? 'UPHELD' : item.outcome]));
    detailId = appealId;
  }

  function setItemOutcome(item: DemoAppealItem, outcome: AppealOutcome, note: string | null) {
    item.outcome = outcome;
    item.outcomeNote = note;
    item.decidedByTag = VIEWER.username;
    if (item.sanctionId) {
      demo.applyOutcome(item.sanctionId, outcome, note);
      if (outcome === 'DELETED') item.sanctionId = null;
    }
  }

  async function applyItemOutcome(appeal: DemoAppeal, item: DemoAppealItem) {
    const outcome = itemOutcomes[item.id] ?? 'UPHELD';
    if (outcome === 'DELETED' && !(await demo.ask({ title: t.itemDeleteTitle, description: t.itemDeleteDesc, confirmLabel: t.itemDeleteConfirm, variant: 'danger' }))) return;
    const live = appeal.sanctions.find((entry) => entry.id === item.id);
    if (!live) return;
    setItemOutcome(live, outcome, actionReason.trim() || null);
    demo.toast('success', t.itemApplied);
  }

  async function decide(decision: 'ACCEPTED' | 'DENIED' | 'DENIED_PERMANENT') {
    if (!detail) return;
    const reason = actionReason.trim();
    if (decision !== 'ACCEPTED' && !reason) {
      demo.toast('error', t.reasonRequired);
      return;
    }
    if (decision === 'DENIED_PERMANENT' && !(await demo.ask({ title: t.permanentTitle, description: t.permanentDesc, confirmLabel: t.permanentConfirm, variant: 'danger' }))) return;

    const appeal = detail;
    for (const item of appeal.sanctions) {
      if (item.outcome === 'PENDING' && item.sanctionId) setItemOutcome(item, itemOutcomes[item.id] ?? 'UPHELD', reason || null);
    }
    if (decision === 'ACCEPTED') {
      // Le membre est débanni : son ban n'est plus actif.
      for (const item of appeal.sanctions) {
        const sanction = demo.sanctions.find((s) => s.id === item.sanctionId);
        if (sanction && (sanction.type === 'BAN' || sanction.type === 'TEMP_BAN')) sanction.status = 'RESOLVED';
      }
    }
    if (decision === 'DENIED_PERMANENT' && !demo.blacklist.some((entry) => entry.userId === appeal.userId)) {
      demo.blacklist = [
        ...demo.blacklist,
        { id: `demo-bl-${Date.now()}`, userId: appeal.userId, reason: { fr: reason, en: reason }, addedByTag: VIEWER.username, createdAt: new Date().toISOString() },
      ];
    }
    appeal.status = decision;
    appeal.decidedByTag = VIEWER.username;
    appeal.decisionReason = reason || null;
    appeal.decidedAt = new Date().toISOString();
    appeal.dmDelivered = true;
    demo.toast('success', decision === 'ACCEPTED' ? t.acceptedToast : t.deniedToast);
    detailId = null;
  }

  function requestInfo() {
    if (!detail || !actionReason.trim()) {
      demo.toast('error', t.askQuestion);
      return;
    }
    detail.messages = [...detail.messages, { author: 'staff', authorTag: VIEWER.username, content: actionReason.trim(), createdAt: new Date().toISOString() }];
    detail.status = 'NEEDS_INFO';
    demo.toast('success', t.infoSent);
    detailId = null;
  }

  function removeFromBlacklist(userId: string) {
    demo.blacklist = demo.blacklist.filter((entry) => entry.userId !== userId);
    demo.toast('success', t.blacklistRemoved);
  }
</script>

<div class="space-y-6">
  <!-- Onglets de la page Sanctions à gauche, ceux des contestations à droite :
       une ligne de moins que deux barres empilées. -->
  <div class="flex items-center justify-between gap-4">
  {@render pageTabs?.()}
  <Tabs
    label={t.tabsLabel}
    tabs={[
      { id: 'queue', label: t.tabQueue(queue.length) },
      { id: 'history', label: t.tabHistory },
      { id: 'config', label: t.tabConfig, disabled: true },
      { id: 'blacklist', label: t.tabBlacklist(demo.blacklist.length) },
    ]}
    active={tab}
    onchange={(id) => { tab = id as typeof tab; detailId = null; }}
  />
  </div>

  {#if tab === 'queue' || tab === 'history'}
    {@const list = tab === 'queue' ? queue : history}
    {#if list.length === 0}
      <div class="text-center py-16 text-on-surface-variant flex flex-col items-center justify-center">
        <div class="mb-4 text-on-surface-variant/30">
          <Papicon icon={tab === 'queue' ? 'check' : 'inbox'} size={48} />
        </div>
        <p class="text-sm">{tab === 'queue' ? t.emptyQueue : t.emptyHistory}</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each list as appeal (appeal.id)}
          {@const statusLabel = t.status[appeal.status] ?? t.status.PENDING}
          {@const statusClasses = STATUS_CLASSES[appeal.status] ?? STATUS_CLASSES.PENDING}
          <div class="rounded-xl border border-outline-variant/20 bg-surface overflow-hidden">
            <button
              onclick={() => openDetail(appeal.id)}
              aria-expanded={detailId === appeal.id}
              class="w-full p-4 flex items-center gap-4 hover:bg-surface-container/40 transition-colors text-left"
            >
              <img src={memberAvatarSrc(appeal.avatarUrl, appeal.userTag, appeal.userId)} alt="" class="w-10 h-10 rounded-full shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-on-surface text-sm truncate">{appeal.userTag}</p>
                <p class="text-xs text-on-surface-variant mt-0.5 truncate">
                  {formatDate(appeal.createdAt)}
                  {#if appeal.sanctions.length > 0}
                    · {t.contestedCount(appeal.sanctions.length)}
                  {/if}
                  {#if appeal.banReason} · {t.banLabel} {tr(appeal.banReason, locale)}{/if}
                </p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-2xs font-bold border shrink-0 {statusClasses}">{statusLabel}</span>
              <Papicon icon={detailId === appeal.id ? 'expand_less' : 'expand_more'} size={18} />
            </button>

            {#if detail && detail.id === appeal.id}
              {@const decided = detail.status !== 'PENDING' && detail.status !== 'NEEDS_INFO'}
              <div class="border-t border-outline-variant/10 p-5 bg-surface-container-low/30 grid grid-cols-3 gap-5">
                <!-- Trois colonnes (une pile dans le dashboard) : sanctions contestées et
                     discussion ; réponses et casier ; appels précédents et décision. -->
                <div class="space-y-4 min-w-0">
                  {#if detail.sanctions.length > 0}
                    <div>
                      <p class="text-body-sm font-medium text-on-surface-variant mb-2">{t.contestedSanctions(detail.sanctions.length)}</p>
                      <div class="space-y-2">
                        {#each detail.sanctions as item (item.id)}
                          <div class="rounded-lg bg-surface border border-outline-variant/15 p-3 space-y-2">
                            <div class="flex items-start justify-between gap-3">
                              <div class="min-w-0">
                                <p class="text-sm font-bold text-on-surface">
                                  {t.type[item.sanctionType] ?? item.sanctionType}
                                  <span class="text-xs font-normal text-on-surface-variant">
                                    · {formatDate(item.sanctionCreatedAt)}{item.moderatorTag ? ` · ${item.moderatorTag}` : ''}
                                  </span>
                                </p>
                                <p class="text-xs text-on-surface-variant/80 mt-0.5 break-words">{tr(item.sanctionReason, locale)}</p>
                                {#if !item.sanctionId}
                                  <p class="text-2xs text-error mt-1">{t.sanctionGone}</p>
                                {/if}
                              </div>
                              <span class="px-2 py-0.5 rounded-full text-2xs font-bold border shrink-0 {OUTCOME_CLASSES[item.outcome]}">
                                {item.outcome === 'PENDING' ? t.outcome.PENDING : t.outcome[item.outcome]}
                              </span>
                            </div>

                            {#if item.memberStatement}
                              <p class="text-xs text-on-surface-variant italic border-l-2 border-outline-variant/30 pl-2.5">{tr(item.memberStatement, locale)}</p>
                            {/if}

                            {#if !decided && item.sanctionId && item.outcome === 'PENDING'}
                              <div class="flex flex-wrap items-center gap-2 pt-1">
                                <select
                                  bind:value={itemOutcomes[item.id]}
                                  aria-label={t.verdictFor}
                                  class="flex-1 min-w-[180px] bg-surface-container rounded-lg px-3 py-2 text-xs outline-none border border-outline-variant/20"
                                >
                                  <option value="UPHELD">{t.outcome.UPHELD}</option>
                                  <option value="ARCHIVED">{t.outcome.ARCHIVED}</option>
                                  <option value="LOCKED">{t.outcome.LOCKED}</option>
                                  <option value="DELETED">{t.outcome.DELETED}</option>
                                </select>
                                <button onclick={() => applyItemOutcome(detail, item)} class="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50">
                                  {t.itemApply}
                                </button>
                              </div>
                            {:else if item.outcomeNote}
                              <p class="text-2xs text-on-surface-variant">{item.outcomeNote}</p>
                            {/if}
                          </div>
                        {/each}
                      </div>
                      {#if !decided}
                        <p class="text-2xs text-on-surface-variant mt-2">{t.contestedHint}</p>
                      {/if}
                    </div>
                  {/if}

                  {#if detail.messages.length > 0}
                    <div class="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 space-y-3">
                      <p class="text-xs font-semibold text-blue-500 flex items-center gap-1.5">
                        <Papicon icon="message-square" size={14} />
                        {t.discussion}
                      </p>
                      <div class="space-y-2">
                        <!-- Le dernier message seulement : la colonne n'a pas la place pour plus. -->
                        {#each detail.messages.slice(-1) as msg, i (i)}
                          <div class="p-3 rounded-lg border text-sm {msg.author === 'staff' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-surface border-outline-variant/15'}">
                            <div class="flex items-center justify-between text-xs font-semibold text-on-surface-variant mb-1">
                              <span>{msg.author === 'staff' ? t.staffNamed(msg.authorTag || t.unknown) : t.member}</span>
                              <span>{formatDate(msg.createdAt)}</span>
                            </div>
                            <p class="whitespace-pre-wrap text-on-surface">{tr(msg.content, locale)}</p>
                          </div>
                        {/each}
                      </div>
                      {#if detail.status === 'NEEDS_INFO' && detail.messages[detail.messages.length - 1]?.author === 'staff'}
                        <p class="text-xs text-on-surface-variant italic">{t.waitingMember}</p>
                      {/if}
                    </div>
                  {/if}
                </div>

                <div class="space-y-4 min-w-0">
                  <div>
                    <p class="text-body-sm font-medium text-on-surface-variant mb-2">{t.answers}</p>
                    <div class="space-y-2">
                      {#each detail.data as answer (answer.key.fr)}
                        <div class="rounded-lg bg-surface border border-outline-variant/15 p-3">
                          <p class="text-2xs font-semibold text-on-surface-variant">{tr(answer.key, locale).replace(/^appeal_/, '').replace(/_/g, ' ')}</p>
                          <p class="text-sm text-on-surface mt-1 whitespace-pre-wrap break-words">{tr(answer.value, locale)}</p>
                        </div>
                      {/each}
                    </div>
                  </div>

                  <div>
                    <p class="text-body-sm font-medium text-on-surface-variant mb-2">{t.sanctionHistory(detailSanctions.length)}</p>
                    {#if detailSanctions.length === 0}
                      <p class="text-xs text-on-surface-variant italic">{t.noSanction}</p>
                    {:else}
                      <div class="space-y-1.5">
                        {#each detailSanctions as s (s.id)}
                          <div class="rounded-lg bg-surface border border-outline-variant/15 px-3 py-2 text-xs {s.archivedAt ? 'opacity-60' : ''}">
                            <span class="font-bold">{t.type[s.type] ?? s.type}</span>
                            <span class="text-on-surface-variant"> · {formatDate(s.createdAt)}{s.moderatorTag ? ` · ${s.moderatorTag}` : ''}</span>
                            {#if s.archivedAt}<span class="ml-1 text-success font-semibold">· {t.badgeArchived}</span>{/if}
                            {#if !s.appealable}<span class="ml-1 text-error font-semibold">· {t.badgeLocked}</span>{/if}
                            <p class="text-on-surface-variant/80 mt-0.5 truncate">{tr(s.reason, locale)}</p>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>

                <div class="space-y-4 min-w-0">
                  <div>
                    <p class="text-body-sm font-medium text-on-surface-variant mb-2">{t.previousAppeals(detail.previousAppeals.length)}</p>
                    {#if detail.previousAppeals.length === 0}
                      <p class="text-xs text-on-surface-variant italic">{t.firstAppeal}</p>
                    {/if}
                  </div>

                  {#if !decided}
                    <div class="space-y-3 pt-2 border-t border-outline-variant/10">
                      <textarea
                        bind:value={actionReason}
                        rows="2"
                        aria-label={t.decisionPh}
                        placeholder={t.decisionPh}
                        class="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none border border-outline-variant/20 focus:border-primary transition-colors resize-none"
                      ></textarea>
                      <div class="flex flex-wrap gap-2">
                        <button onclick={() => decide('ACCEPTED')} class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5">
                          <Papicon icon="check" size={14} /> {t.acceptUnban}
                        </button>
                        <button onclick={() => decide('DENIED')} class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5">
                          <Papicon icon="x" size={14} /> {t.deny}
                        </button>
                        <button onclick={() => decide('DENIED_PERMANENT')} class="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5">
                          <Papicon icon="block" size={14} /> {t.denyPermanent}
                        </button>
                        <button onclick={requestInfo} class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5">
                          <Papicon icon="message-square" size={14} /> {t.requestInfo}
                        </button>
                      </div>
                      <p class="text-2xs text-on-surface-variant">{t.decisionHint(COOLDOWN_DAYS)}</p>
                    </div>
                  {:else}
                    <div class="rounded-lg bg-surface border border-outline-variant/15 p-3 text-sm">
                      <p class="font-semibold text-on-surface">
                        {t.decisionLabel(t.status[detail.status] ?? detail.status)}
                        {#if detail.decidedByTag}<span class="text-on-surface-variant font-normal">{t.decidedBy(detail.decidedByTag)}</span>{/if}
                        {#if detail.decidedAt}<span class="text-on-surface-variant font-normal">{t.decidedAt(formatDate(detail.decidedAt))}</span>{/if}
                      </p>
                      {#if detail.decisionReason}
                        <p class="text-on-surface-variant/80 mt-1">{tr(detail.decisionReason, locale)}</p>
                      {/if}
                      <p class="text-2xs mt-2 flex items-center gap-1.5 {detail.dmDelivered ? 'text-success' : 'text-warning'}">
                        {#if detail.dmDelivered}
                          <Papicon icon="check" size={12} />
                          <span>{t.dmDelivered}</span>
                        {:else}
                          <Papicon icon="warning" size={12} />
                          <span>{t.dmFailed}</span>
                        {/if}
                      </p>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {:else if tab === 'blacklist'}
    {#if demo.blacklist.length === 0}
      <div class="text-center py-16 text-on-surface-variant flex flex-col items-center justify-center">
        <div class="mb-4 text-on-surface-variant/30">
          <Papicon icon="user" size={48} />
        </div>
        <p class="text-sm">{t.noBlacklist}</p>
      </div>
    {:else}
      <div class="space-y-2 max-w-2xl" id="{uid}-blacklist">
        {#each demo.blacklist as entry (entry.id)}
          <div class="rounded-xl border border-outline-variant/20 bg-surface p-4 flex items-center gap-4">
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-on-surface text-sm">{t.blacklistId(entry.userId)}</p>
              <p class="text-xs text-on-surface-variant mt-0.5 truncate">
                {tr(entry.reason, locale) || t.noReason} {t.blacklistAddedBy(entry.addedByTag, formatDate(entry.createdAt))}
              </p>
            </div>
            <button onclick={() => removeFromBlacklist(entry.userId)} class="px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-bold hover:bg-error/20 transition-colors shrink-0">
              {t.remove}
            </button>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

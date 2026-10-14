<!--
  Boîte de réception du support.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketInboxList.svelte`
  (branche `recette`). Une vue par file de travail avec son compteur, une
  recherche, l'ordre de traitement, et pour chaque ticket sa priorité, son
  échéance de service et à qui revient la parole.

  Différences : les libellés passent par `TEXT` ; `j` / `k` s'écoutent sur la
  liste et non sur la fenêtre (l'aperçu est posé dans une page du site, il ne
  doit pas capter les touches ailleurs) ; l'humeur du demandeur (module
  AegisAI) n'est pas reprise, aucun ticket de démo n'en porte.
-->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Papicon, FilterPills, type FilterOption } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { InboxTicket, InboxView } from '$lib/dash/types';

  const TEXT = {
    fr: {
      viewOpen: 'En cours',
      viewUnassigned: 'Non attribués',
      viewMine: 'Mes tickets',
      viewWaiting: 'À traiter',
      viewBreached: 'Hors délai',
      viewPending: 'À valider',
      viewClosed: 'Fermés',
      viewAll: 'Tous',
      now: 'maintenant',
      min: (count: number) => `${count} min`,
      hours: (count: number) => `${count} h`,
      days: (count: number) => `${count} j`,
      slaBreached: (time: string) => `Hors délai de ${time}`,
      slaDue: (time: string) => `Échéance dans ${time}`,
      search: 'Rechercher un ticket',
      searchPlaceholder: 'Membre, raison, #étiquette ou ID',
      views: 'Files de tickets',
      shortcuts: 'j / k pour naviguer',
      sortOldest: "Plus anciens d'abord",
      sortNewest: "Plus récents d'abord",
      emptyDone: 'Rien en attente',
      empty: 'Aucun ticket',
      emptyDesc: "Change de file ou de recherche pour en voir d'autres.",
      waitingStaff: "En attente d'une réponse du staff",
      waitingMember: 'En attente du membre',
      assignedTo: (name: string) => `Attribué à ${name}`,
      priorityHigh: 'Haute',
      priorityUrgent: 'Urgente',
    },
    en: {
      viewOpen: 'Open',
      viewUnassigned: 'Unassigned',
      viewMine: 'My tickets',
      viewWaiting: 'Needs reply',
      viewBreached: 'Overdue',
      viewPending: 'To approve',
      viewClosed: 'Closed',
      viewAll: 'All',
      now: 'now',
      min: (count: number) => `${count} min`,
      hours: (count: number) => `${count} h`,
      days: (count: number) => `${count} d`,
      slaBreached: (time: string) => `Overdue by ${time}`,
      slaDue: (time: string) => `Due in ${time}`,
      search: 'Search tickets',
      searchPlaceholder: 'Member, reason, #tag or ID',
      views: 'Ticket queues',
      shortcuts: 'j / k to navigate',
      sortOldest: 'Oldest first',
      sortNewest: 'Newest first',
      emptyDone: 'Nothing waiting',
      empty: 'No tickets',
      emptyDesc: 'Switch queue or search to see others.',
      waitingStaff: 'Waiting for a staff reply',
      waitingMember: 'Waiting on member',
      assignedTo: (name: string) => `Assigned to ${name}`,
      priorityHigh: 'High',
      priorityUrgent: 'Urgent',
    },
  };

  const {
    tickets,
    view,
    counts,
    sort,
    query,
    selectedId = null,
    slaConfigured = false,
    statusLabel,
    tagLabel,
    onview,
    onsearch,
    onsort,
    onselect,
  }: {
    tickets: InboxTicket[];
    view: InboxView;
    counts: Partial<Record<InboxView, number>>;
    sort: 'newest' | 'oldest';
    query: string;
    selectedId?: string | null;
    slaConfigured?: boolean;
    statusLabel: (status: string) => string;
    tagLabel: (tag: string) => string;
    onview: (view: InboxView) => void;
    onsearch: (query: string) => void;
    onsort: (sort: 'newest' | 'oldest') => void;
    onselect: (ticketId: string) => void;
  } = $props();

  const t = $derived(TEXT[getLocale()]);

  const viewOptions: FilterOption<InboxView>[] = $derived([
    { value: 'open', label: t.viewOpen, count: counts.open },
    { value: 'unassigned', label: t.viewUnassigned, count: counts.unassigned },
    { value: 'mine', label: t.viewMine, count: counts.mine },
    { value: 'waiting_staff', label: t.viewWaiting, count: counts.waiting_staff },
    ...(slaConfigured ? [{ value: 'breached' as const, label: t.viewBreached, count: counts.breached }] : []),
    ...((counts.pending ?? 0) > 0 || view === 'pending' ? [{ value: 'pending' as const, label: t.viewPending, count: counts.pending }] : []),
    { value: 'closed', label: t.viewClosed },
    { value: 'all', label: t.viewAll },
  ]);

  // ── Horloge des échéances ──────────────────────────────
  let now = $state(Date.now());
  let tick: ReturnType<typeof setInterval> | null = null;
  onMount(() => {
    tick = setInterval(() => (now = Date.now()), 30_000);
  });
  onDestroy(() => {
    if (tick) clearInterval(tick);
  });

  /** `j` / `k` (et les flèches avec Alt) parcourent la liste, hors saisie. */
  function onKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
    if (event.ctrlKey || event.metaKey) return;
    const down = event.key === 'j' || (event.altKey && event.key === 'ArrowDown');
    const up = event.key === 'k' || (event.altKey && event.key === 'ArrowUp');
    if (!down && !up) return;
    if (tickets.length === 0) return;
    event.preventDefault();
    const index = tickets.findIndex((ticket) => ticket.id === selectedId);
    const next = index === -1 ? 0 : Math.min(tickets.length - 1, Math.max(0, index + (down ? 1 : -1)));
    onselect(tickets[next].id);
    const row = document.getElementById(`inbox-row-${tickets[next].id}`);
    row?.scrollIntoView({ block: 'nearest' });
    row?.focus();
  }

  function ago(iso: string | null): string {
    if (!iso) return '';
    const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));
    if (minutes < 1) return t.now;
    if (minutes < 60) return t.min(minutes);
    const hours = Math.round(minutes / 60);
    if (hours < 48) return t.hours(hours);
    return t.days(Math.round(hours / 24));
  }

  function remaining(iso: string): string {
    const minutes = Math.round((new Date(iso).getTime() - now) / 60_000);
    if (minutes < 60) return t.min(Math.max(1, minutes));
    return t.hours(Math.round(minutes / 60));
  }

  /** Pastille de service : l'échéance la plus proche qui n'est pas tenue. */
  function slaBadge(ticket: InboxTicket): { label: string; tone: string } | null {
    const clocks = [ticket.sla.firstResponse, ticket.sla.resolution].filter((clock) => clock && !clock.completedAt);
    const breached = clocks.find((clock) => clock!.status === 'breached');
    if (breached) return { label: t.slaBreached(ago(breached.dueAt)), tone: 'bg-error/10 text-error' };
    const atRisk = clocks.find((clock) => clock!.status === 'at_risk');
    if (atRisk) return { label: t.slaDue(remaining(atRisk.dueAt)), tone: 'bg-warning/10 text-warning' };
    return null;
  }

  const PRIORITY_BAR: Record<string, string> = {
    URGENT: 'bg-error',
    HIGH: 'bg-warning',
    NORMAL: 'bg-transparent',
    LOW: 'bg-transparent',
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex flex-col h-full min-h-0" onkeydown={onKeydown}>
  <div class="space-y-3 mb-3">
    <label class="relative block">
      <span class="sr-only">{t.search}</span>
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><Papicon icon="search" size={14} /></span>
      <input
        type="search"
        class="input w-full inbox-search"
        placeholder={t.searchPlaceholder}
        value={query}
        oninput={(event) => onsearch(event.currentTarget.value)}
      />
    </label>
    <FilterPills label={t.views} options={viewOptions} value={view} onchange={onview} />
    <div class="flex items-center justify-between text-2xs text-on-surface-variant">
      <span>{t.shortcuts}</span>
      <button type="button" class="flex items-center gap-1 hover:text-on-surface" onclick={() => onsort(sort === 'oldest' ? 'newest' : 'oldest')}>
        <Papicon icon={sort === 'oldest' ? 'arrow-up' : 'arrow-down'} size={12} />
        {sort === 'oldest' ? t.sortOldest : t.sortNewest}
      </button>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto -mx-1 px-1 space-y-1.5" role="listbox" aria-label={t.views}>
    {#if tickets.length === 0}
      <div class="flex flex-col items-center justify-center py-14 text-center text-on-surface-variant">
        <Papicon icon="inbox" size={26} />
        <p class="mt-2 text-body-sm font-medium text-on-surface">{view === 'open' || view === 'mine' || view === 'unassigned' || view === 'waiting_staff' || view === 'breached' ? t.emptyDone : t.empty}</p>
        <p class="text-2xs mt-0.5">{t.emptyDesc}</p>
      </div>
    {:else}
      {#each tickets as ticket (ticket.id)}
        {@const badge = slaBadge(ticket)}
        <button
          type="button"
          id={`inbox-row-${ticket.id}`}
          role="option"
          aria-selected={selectedId === ticket.id}
          class="inbox-row {selectedId === ticket.id ? 'inbox-row--active' : ''}"
          onclick={() => onselect(ticket.id)}
        >
          <span class="inbox-row__priority {PRIORITY_BAR[ticket.priority] ?? 'bg-transparent'}" aria-hidden="true"></span>
          {#if ticket.userAvatar}
            <img src={ticket.userAvatar} alt="" class="w-8 h-8 rounded-lg object-cover shrink-0" />
          {:else}
            <span class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-body-sm font-semibold text-on-surface-variant shrink-0">{ticket.username?.charAt(0).toUpperCase() || '?'}</span>
          {/if}
          <span class="min-w-0 flex-1">
            <span class="flex items-baseline justify-between gap-2">
              <span class="text-body-sm font-semibold text-on-surface truncate">
                {#if ticket.waitingOn === 'staff'}<span class="inbox-dot" title={t.waitingStaff}></span>{/if}
                @{ticket.username}
              </span>
              <span class="text-2xs text-on-surface-variant shrink-0 tabular-nums" title={new Date(ticket.createdAt).toLocaleString()}>{ago(ticket.lastMemberMessageAt ?? ticket.createdAt)}</span>
            </span>
            <span class="block text-2xs text-on-surface-variant truncate mt-0.5">
              {#if ticket.ticketTypeLabel}<span class="text-on-surface">{ticket.ticketTypeLabel}</span> · {/if}{ticket.reason}
            </span>
            <span class="flex flex-wrap items-center gap-1 mt-1.5">
              {#if ticket.status !== 'OPEN' && ticket.status !== 'CLAIMED'}
                <span class="inbox-chip bg-surface-container text-on-surface-variant">{statusLabel(ticket.status)}</span>
              {/if}
              {#if ticket.priority === 'URGENT' || ticket.priority === 'HIGH'}
                <span class="inbox-chip {ticket.priority === 'URGENT' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}">{ticket.priority === 'URGENT' ? t.priorityUrgent : t.priorityHigh}</span>
              {/if}
              {#if badge}<span class="inbox-chip {badge.tone}">{badge.label}</span>{/if}
              {#if ticket.waitingOn === 'member'}<span class="inbox-chip bg-surface-container text-on-surface-variant">{t.waitingMember}</span>{/if}
              {#each ticket.tags.slice(0, 3) as tag (tag)}<span class="inbox-chip bg-surface-container text-on-surface-variant">#{tagLabel(tag)}</span>{/each}
              {#if ticket.claimedByName}
                <span class="ml-auto flex items-center gap-1 text-2xs text-on-surface-variant" title={t.assignedTo(ticket.claimedByName)}>
                  {#if ticket.claimedByAvatar}<img src={ticket.claimedByAvatar} alt="" class="w-4 h-4 rounded-full" />{:else}<Papicon icon="user" size={11} />{/if}
                  <span class="truncate max-w-[6rem]">{ticket.claimedByName}</span>
                </span>
              {/if}
            </span>
          </span>
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  /* `.input` fixe son propre retrait gauche : sans cette règle, plus précise,
     le texte passait sous la loupe. */
  .inbox-search {
    padding-left: 2.25rem;
  }
  .inbox-row {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    width: 100%;
    padding: 0.65rem 0.75rem 0.65rem 0.9rem;
    border: 1px solid transparent;
    border-radius: 0.625rem;
    text-align: left;
    transition: background-color 120ms ease, border-color 120ms ease;
  }
  .inbox-row:hover {
    background: var(--surface-container-low);
  }
  .inbox-row--active {
    border-color: color-mix(in srgb, var(--primary-color) 45%, transparent);
    background: color-mix(in srgb, var(--primary-color) 7%, transparent);
  }
  .inbox-row__priority {
    position: absolute;
    left: 0.3rem;
    top: 0.7rem;
    bottom: 0.7rem;
    width: 3px;
    border-radius: 999px;
  }
  .inbox-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.05rem 0.45rem;
    border-radius: 999px;
    font-size: 0.6875rem;
    line-height: 1.4;
  }
  .inbox-dot {
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    margin-right: 0.3rem;
    border-radius: 999px;
    background: var(--primary-color);
    vertical-align: middle;
  }
</style>

<!--
  Écran Tickets du dashboard, recopié pour l'accueil : boîte de réception,
  conversation, profil de l'auteur, et les onglets secondaires.

  Recopie de `Kotbo/apps/dashboard/src/pages/Tickets.svelte` (branche
  `recette`), mêmes classes et même balisage. Ce qui change :
  - les appels à l'API, au temps réel et aux stores deviennent des données de
    démo (`fixtures/tickets.ts`) tenues en `$state` : chaque bouton modifie
    l'aperçu (prendre en charge, répondre, fermer, archiver, verrouiller,
    supprimer, valider ou refuser une demande, changer la priorité…) ;
  - la mise en page est celle d'un écran large (les variantes `lg:` / `xl:`
    du dashboard sont posées d'office) et tient dans le cadre de 1180 × 720 :
    la grille prend la hauteur restante au lieu de `100dvh` ;
  - les fenêtres sont calées sur le cadre (`absolute`) et se ferment à Échap ;
  - les notifications du dashboard (`toast`) et ses confirmations
    (`confirmDialog`) sont rendues ici, dans le cadre ;
  - « Actualiser » remet la démo dans son état de départ ;
  - pas de restauration de transcription ni de lien vers la transcription
    d'origine : aucun ticket de démo n'a de salon supprimé.
-->
<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { base } from '$app/paths';
  import Dash from '$lib/dash/Dash.svelte';
  import { Button, Modal, ModulePage, Papicon, RefreshButton, FormInput, Tabs } from '$lib/dash/ui';
  import MemberCaseModal from '$lib/dash/screens/members/MemberCaseModal.svelte';
  import { STAFF } from '$lib/dash/cast';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { InboxTicket, InboxView, TicketPriority } from '$lib/dash/types';
  import {
    ME,
    BOT_ID,
    TAG_LABELS,
    buildConfig,
    buildMemberSummaries,
    buildTickets,
    type DemoMessage,
    type DemoTicket,
    type L,
  } from '$lib/dash/fixtures/tickets';
  import TicketInboxList from './TicketInboxList.svelte';
  import TicketProperties from './TicketProperties.svelte';
  import TicketMemberPanel from './TicketMemberPanel.svelte';
  import TicketPerformance from './TicketPerformance.svelte';
  import TicketTranscripts from './TicketTranscripts.svelte';
  import TicketSatisfactionTab from './TicketSatisfactionTab.svelte';
  import TicketMacros from './TicketMacros.svelte';
  import TicketBlacklist from './TicketBlacklist.svelte';
  import TicketSettings from './TicketSettings.svelte';
  import FormTextarea from './FormTextarea.svelte';
  import Toasts from './Toasts.svelte';
  import { createToasts } from './toastStore.svelte';
  import { dialog } from './a11y';
  import type { ConfirmRequest } from './confirm';

  const TEXT = {
    fr: {
      pageTitle: 'Tickets',
      pageDesc: 'Réponds aux demandes de tes membres et règle le fonctionnement des tickets.',
      refresh: 'Actualiser',
      tabTickets: 'Tickets',
      tabPerformance: 'Performance',
      tabTranscripts: 'Transcriptions',
      tabSatisfaction: 'Satisfaction',
      tabMacros: 'Réponses types',
      tabBlacklist: 'Liste noire',
      tabConfig: 'Configuration',
      statusPending: 'En attente',
      statusQueued: "En file d'attente",
      statusOpen: 'Ouvert',
      statusClaimed: 'Pris en charge',
      statusClosed: 'Fermé',
      statusArchived: 'Archivé',
      statusRejected: 'Refusé',
      statusOrphaned: 'Salon supprimé',
      priorityLow: 'Basse',
      priorityHigh: 'Haute',
      priorityUrgent: 'Urgente',
      noSelectionTitle: 'Aucun ticket sélectionné',
      noSelectionDesc: 'Sélectionne un ticket pour commencer.',
      userFallback: 'Utilisateur',
      modeDm: 'MP',
      modeThread: 'Fil',
      assignedTo: (name: string) => `Assigné à @${name}`,
      detailsToggle: 'Détails',
      pendingNotice: "Cette demande attend la validation du staff : aucun salon n'a encore été créé. La décision se prend depuis la carte publiée dans le salon de validation sur Discord.",
      approve: 'Valider la demande',
      reject: 'Refuser',
      rejectedNotice: (name: string) => `Demande refusée par ${name}. Aucun salon n'a été créé.`,
      rejectedReason: (reason: string) => `Motif : ${reason}`,
      btnCase: 'Casier',
      btnClaim: "S'assigner",
      btnClose: 'Fermer',
      btnOverclaim: 'Sur-revendiquer',
      btnReopen: 'Réouvrir',
      btnUnarchive: 'Désarchiver',
      btnArchive: 'Archiver',
      btnUnlock: 'Déverrouiller',
      btnLock: 'Verrouiller',
      btnDelete: 'Supprimer',
      deleteLockedHint: "Ce ticket est protégé : lève d'abord le verrou pour pouvoir le supprimer.",
      lockBanner: 'Protégé contre la suppression',
      lockUntil: (date: string) => `jusqu'au ${date}`,
      lockPermanent: 'sans échéance',
      lockBy: (name: string) => `par ${name}`,
      renamePh: 'ticket-nouveau-nom',
      renameBtn: 'Renommer',
      fillField: "Remplis d'abord le champ correctement.",
      noMessage: 'Aucun message dans ce ticket.',
      anonymous: 'Anonyme',
      staffBadge: 'Staff',
      messagePh: 'Écrire un message…',
      send: 'Envoyer',
      messages: 'Messages du ticket',
      closedBanner: 'Ticket fermé',
      authorProfile: "Profil de l'auteur du ticket",
      rejectTitle: 'Refuser la demande',
      rejectDesc: 'Le membre reçoit le refus en message privé, avec le motif s\'il y en a un.',
      rejectReason: 'Motif communiqué au membre',
      rejectReasonPh: 'Ex : demande déjà traitée, informations insuffisantes…',
      cancel: 'Annuler',
      rejectConfirm: 'Refuser la demande',
      closeModalTitle: 'Clôturer le ticket',
      closeModalDesc: 'Cette action fermera le salon du ticket. Tu pourras ajouter un motif de fermeture.',
      closeReasonLabel: 'Raison de la fermeture (optionnel)',
      closeReasonPh: 'Raison de la fermeture…',
      closeConfirm: 'Confirmer la fermeture',
      deleteModalTitle: 'Supprimer définitivement ?',
      deleteModalDesc: 'Cette action va supprimer définitivement le salon sur Discord et générer une transcription autonome Kotbo.',
      deleteConfirm: 'Confirmer la suppression',
      lockModalTitle: 'Protéger contre la suppression',
      lockModalIntro: 'Tant que la protection est active, ce ticket ne peut être supprimé ni depuis le tableau de bord ni depuis Discord.',
      lockDuration: 'Durée de la protection',
      lock7d: '7 jours',
      lock30d: '30 jours',
      lock90d: '90 jours',
      lockPermanentOption: 'Sans échéance',
      lockReason: 'Motif (facultatif)',
      lockReasonPh: 'Ex : litige en cours, pièce d’un dossier de modération…',
      lockConfirm: 'Protéger',
      renamedToast: 'Ticket renommé.',
      approvedToast: 'Demande validée : le ticket est ouvert et le membre prévenu.',
      rejectedToast: 'Demande refusée : le membre a été prévenu en message privé.',
      archivedToast: 'Ticket archivé : le salon est conservé en lecture seule.',
      unarchivedToast: 'Ticket sorti des archives.',
      lockedToast: 'Ticket protégé contre la suppression.',
      unlockedToast: 'Protection levée.',
      assignedToast: (name: string) => `Ticket attribué à ${name}.`,
      unassignedToast: 'Ticket remis en file.',
    },
    en: {
      pageTitle: 'Tickets',
      pageDesc: "Answer your members' requests and set up how tickets work.",
      refresh: 'Refresh',
      tabTickets: 'Tickets',
      tabPerformance: 'Performance',
      tabTranscripts: 'Transcripts',
      tabSatisfaction: 'Satisfaction',
      tabMacros: 'Macros',
      tabBlacklist: 'Blocklist',
      tabConfig: 'Configuration',
      statusPending: 'Pending',
      statusQueued: 'Queued',
      statusOpen: 'Open',
      statusClaimed: 'Claimed',
      statusClosed: 'Closed',
      statusArchived: 'Archived',
      statusRejected: 'Rejected',
      statusOrphaned: 'Channel deleted',
      priorityLow: 'Low',
      priorityHigh: 'High',
      priorityUrgent: 'Urgent',
      noSelectionTitle: 'No ticket selected',
      noSelectionDesc: 'Select a ticket to get started.',
      userFallback: 'User',
      modeDm: 'DM',
      modeThread: 'Thread',
      assignedTo: (name: string) => `Assigned to @${name}`,
      detailsToggle: 'Details',
      pendingNotice: 'This request is awaiting staff approval: no channel has been created yet. The decision is made from the review card posted in the approval channel on Discord.',
      approve: 'Approve request',
      reject: 'Reject',
      rejectedNotice: (name: string) => `Request rejected by ${name}. No channel was created.`,
      rejectedReason: (reason: string) => `Reason: ${reason}`,
      btnCase: 'Case file',
      btnClaim: 'Claim',
      btnClose: 'Close',
      btnOverclaim: 'Overclaim',
      btnReopen: 'Reopen',
      btnUnarchive: 'Unarchive',
      btnArchive: 'Archive',
      btnUnlock: 'Unlock',
      btnLock: 'Lock',
      btnDelete: 'Delete',
      deleteLockedHint: 'This ticket is protected: lift the lock first to delete it.',
      lockBanner: 'Protected against deletion',
      lockUntil: (date: string) => `until ${date}`,
      lockPermanent: 'with no expiry',
      lockBy: (name: string) => `by ${name}`,
      renamePh: 'ticket-new-name',
      renameBtn: 'Rename',
      fillField: 'Fill in the field correctly first.',
      noMessage: 'No message in this ticket.',
      anonymous: 'Anonymous',
      staffBadge: 'Staff',
      messagePh: 'Write a message...',
      send: 'Send',
      messages: 'Ticket messages',
      closedBanner: 'Ticket closed',
      authorProfile: 'Ticket author profile',
      rejectTitle: 'Reject the request',
      rejectDesc: 'The member receives the rejection by DM, with the reason if there is one.',
      rejectReason: 'Reason given to the member',
      rejectReasonPh: 'E.g. already handled, not enough information…',
      cancel: 'Cancel',
      rejectConfirm: 'Reject request',
      closeModalTitle: 'Close the ticket',
      closeModalDesc: 'This action will close the ticket channel. You can add a closing reason.',
      closeReasonLabel: 'Closing reason (optional)',
      closeReasonPh: 'Closing reason...',
      closeConfirm: 'Confirm the closure',
      deleteModalTitle: 'Delete permanently?',
      deleteModalDesc: 'This action will permanently delete the channel on Discord and generate a standalone Kotbo transcript.',
      deleteConfirm: 'Confirm the deletion',
      lockModalTitle: 'Protect against deletion',
      lockModalIntro: 'While the protection holds, this ticket cannot be deleted from the dashboard nor from Discord.',
      lockDuration: 'Protection duration',
      lock7d: '7 days',
      lock30d: '30 days',
      lock90d: '90 days',
      lockPermanentOption: 'No expiry',
      lockReason: 'Reason (optional)',
      lockReasonPh: 'e.g. ongoing dispute, evidence in a moderation case…',
      lockConfirm: 'Protect',
      renamedToast: 'Ticket renamed successfully!',
      approvedToast: 'Request approved: the ticket is open and the member notified.',
      rejectedToast: 'Request rejected: the member was notified by DM.',
      archivedToast: 'Ticket archived: the channel is kept read-only.',
      unarchivedToast: 'Ticket taken out of the archives.',
      lockedToast: 'Ticket protected against deletion.',
      unlockedToast: 'Protection lifted.',
      assignedToast: (name: string) => `Ticket assigned to ${name}.`,
      unassignedToast: 'Ticket back in the queue.',
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const dateLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-GB');

  // Navigation & onglets
  type TabId = 'tickets' | 'performance' | 'transcripts' | 'satisfaction' | 'macros' | 'blacklist' | 'config';
  let activeTab = $state<TabId>('tickets');
  const tabs = $derived([
    { id: 'tickets', label: t.tabTickets, icon: 'message-square' },
    { id: 'performance', label: t.tabPerformance, icon: 'trending-up' },
    { id: 'transcripts', label: t.tabTranscripts, icon: 'file-text' },
    { id: 'satisfaction', label: t.tabSatisfaction, icon: 'star' },
    { id: 'macros', label: t.tabMacros, icon: 'message-circle' },
    { id: 'blacklist', label: t.tabBlacklist, icon: 'user-x' },
    { id: 'config', label: t.tabConfig, icon: 'settings' },
  ]);

  // Données de démo
  let tickets = $state<DemoTicket[]>(buildTickets());
  let config = $state(buildConfig());
  const memberSummaries = buildMemberSummaries();
  /** Relu par les onglets secondaires : Actualiser les remet à zéro. */
  let refreshToken = $state(0);
  let refreshing = $state(false);

  // File affichée
  let inboxView = $state<InboxView>('open');
  let inboxQuery = $state('');
  let inboxSort = $state<'newest' | 'oldest'>('newest');

  let selectedTicketId = $state<string | null>('t-1042');

  // Formulaires et fenêtres
  let chatInput = $state('');
  let closeReason = $state('');
  let ticketRenameName = $state('ticket-arka-77');
  let showCloseModal = $state(false);
  let showDeleteConfirmModal = $state(false);
  let showRejectModal = $state(false);
  let rejectReason = $state('');
  let showLockModal = $state(false);
  let lockDuration = $state<'7d' | '30d' | '90d' | 'permanent'>('30d');
  let lockReason = $state('');
  let chatScrollContainer = $state<HTMLDivElement | null>(null);
  let caseUserId = $state<string | null>(null);

  // Propriétés et renommage restent repliés par défaut, comme dans le dashboard.
  let detailsOpen = $state(false);

  const toasts = createToasts();

  // Confirmation (le `confirmDialog` du dashboard)
  const CONFIRM_VARIANTS = {
    danger: { icon: 'AlertTriangle', tone: 'bg-error/10 text-error', button: 'danger' },
    warning: { icon: 'AlertTriangle', tone: 'bg-warning/10 text-warning', button: 'primary' },
    default: { icon: 'Info', tone: 'bg-primary/10 text-primary', button: 'primary' },
  } as const;
  let confirmState = $state<(ConfirmRequest & { resolve: (ok: boolean) => void }) | null>(null);
  function ask(request: ConfirmRequest): Promise<boolean> {
    return new Promise((resolve) => {
      confirmState = { ...request, resolve };
    });
  }
  function answer(ok: boolean) {
    confirmState?.resolve(ok);
    confirmState = null;
  }

  // ── Lecture ────────────────────────────────────────────

  function localize(ticket: DemoTicket): InboxTicket {
    return { ...ticket, reason: ticket.reason[locale], ticketTypeLabel: ticket.ticketTypeLabel?.[locale] ?? null };
  }

  const isActive = (ticket: DemoTicket) => ticket.status === 'OPEN' || ticket.status === 'CLAIMED';

  function inView(ticket: DemoTicket, view: InboxView): boolean {
    switch (view) {
      case 'open': return isActive(ticket);
      case 'unassigned': return isActive(ticket) && !ticket.claimedById;
      case 'mine': return isActive(ticket) && ticket.claimedById === ME.userId;
      case 'waiting_staff': return isActive(ticket) && ticket.waitingOn === 'staff';
      case 'breached': return isActive(ticket) && ticket.sla.worst === 'breached';
      case 'pending': return ticket.status === 'PENDING';
      case 'closed': return ticket.status === 'CLOSED' || ticket.status === 'ARCHIVED' || ticket.status === 'REJECTED';
      default: return true;
    }
  }

  function tagLabel(tag: string): string {
    return TAG_LABELS[tag]?.[locale] ?? tag;
  }

  function matches(ticket: DemoTicket, query: string): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    if (q.startsWith('#')) return ticket.tags.some((tag) => tag.includes(q.slice(1)) || tagLabel(tag).includes(q.slice(1)));
    return [ticket.username, ticket.reason[locale], ticket.id, ticket.userId, ticket.ticketTypeLabel?.[locale] ?? '']
      .some((value) => value.toLowerCase().includes(q));
  }

  const listed = $derived(
    tickets
      .filter((ticket) => inView(ticket, inboxView) && matches(ticket, inboxQuery))
      .sort((a, b) => (inboxSort === 'oldest' ? 1 : -1) * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
      .map(localize),
  );

  const viewCounts = $derived.by(() => {
    const counts: Partial<Record<InboxView, number>> = {};
    for (const view of ['open', 'unassigned', 'mine', 'waiting_staff', 'breached', 'pending'] as const) {
      counts[view] = tickets.filter((ticket) => inView(ticket, view)).length;
    }
    return counts;
  });

  const selectedTicketDetail = $derived(tickets.find((ticket) => ticket.id === selectedTicketId) ?? null);
  const messages = $derived(selectedTicketDetail?.messages ?? []);
  const knownTags = $derived([...new Set(tickets.flatMap((ticket) => ticket.tags))].sort());
  const agents = $derived(
    Object.values(STAFF).map((member) => ({
      id: member.userId,
      name: member.displayName,
      openTickets: tickets.filter((ticket) => isActive(ticket) && ticket.claimedById === member.userId).length,
    })),
  );
  const slaConfigured = $derived(!!(config.ticketSlaFirstResponseMinutes || config.ticketSlaResolutionHours));

  /**
   * Le verrou peut porter une échéance : un ticket dont la date est passée n'est
   * plus protégé, même si le drapeau est resté à vrai.
   */
  const deletionLock = $derived.by(() => {
    const ticket = selectedTicketDetail;
    if (!ticket?.deletionLocked) return null;
    const until = ticket.deletionLockedUntil ? new Date(ticket.deletionLockedUntil) : null;
    if (until && until.getTime() <= Date.now()) return null;
    return { until, reason: ticket.deletionLockReason, byName: ticket.deletionLockedByName };
  });

  function getStatusLabel(status: string) {
    switch (status) {
      case 'PENDING': return t.statusPending;
      case 'QUEUED': return t.statusQueued;
      case 'OPEN': return t.statusOpen;
      case 'CLAIMED': return t.statusClaimed;
      case 'CLOSED': return t.statusClosed;
      case 'ARCHIVED': return t.statusArchived;
      case 'REJECTED': return t.statusRejected;
      case 'ORPHANED': return t.statusOrphaned;
      default: return status;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      // Même teinte que l'attente de validation : le ticket n'a pas encore de salon.
      case 'QUEUED': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'OPEN': return 'bg-success/10 text-success border-success/20';
      case 'CLAIMED': return 'bg-warning/10 text-warning border-warning/20';
      case 'CLOSED': return 'bg-error/10 text-error border-error/20';
      case 'ARCHIVED': return 'bg-slate-500/10 text-on-surface-variant border-slate-500/20';
      case 'REJECTED': return 'bg-error/10 text-error border-error/20';
      // Orange et non rouge : ce n'est pas une décision du staff, c'est un accident.
      case 'ORPHANED': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-outline-variant/10 text-on-surface-variant border-outline-variant/20';
    }
  }

  // Pastille affichée dans l'en-tête quand le panneau Détails est replié.
  const PRIORITY_CHIP = $derived({
    LOW: { label: t.priorityLow, tone: 'bg-outline-variant/10 text-on-surface-variant border-outline-variant/20' },
    HIGH: { label: t.priorityHigh, tone: 'bg-warning/10 text-warning border-warning/20' },
    URGENT: { label: t.priorityUrgent, tone: 'bg-error/10 text-error border-error/20' },
  });

  // ── Écriture ───────────────────────────────────────────

  function patchTicket(id: string, patch: Partial<DemoTicket>) {
    tickets = tickets.map((ticket) => (ticket.id === id ? { ...ticket, ...patch } : ticket));
  }

  function patchSelected(patch: Partial<DemoTicket>) {
    if (selectedTicketId) patchTicket(selectedTicketId, patch);
  }

  function changeInbox(patch: { view?: InboxView; query?: string; sort?: 'newest' | 'oldest' }) {
    if (patch.view !== undefined) inboxView = patch.view;
    if (patch.query !== undefined) inboxQuery = patch.query;
    if (patch.sort !== undefined) inboxSort = patch.sort;
  }

  function scrollToBottom() {
    // Une image chargée après coup peut encore allonger la liste : on attend la peinture.
    requestAnimationFrame(() => {
      if (chatScrollContainer) chatScrollContainer.scrollTop = chatScrollContainer.scrollHeight;
    });
  }

  async function selectTicket(ticketId: string) {
    selectedTicketId = ticketId;
    const ticket = tickets.find((item) => item.id === ticketId);
    ticketRenameName = ticket?.channelName ?? '';
    await tick();
    scrollToBottom();
  }

  /** Ouvre un ticket depuis un autre onglet (transcriptions). */
  function openTicketFromTab(ticketId: string) {
    activeTab = 'tickets';
    inboxView = 'closed';
    inboxQuery = '';
    void selectTicket(ticketId);
  }

  async function handleRefresh() {
    refreshing = true;
    tickets = buildTickets();
    config = buildConfig();
    refreshToken += 1;
    if (selectedTicketId && !tickets.some((ticket) => ticket.id === selectedTicketId)) selectedTicketId = null;
    setTimeout(() => (refreshing = false), 400);
  }

  // Comme le dashboard après chargement : la conversation s'ouvre sur ses derniers messages.
  onMount(() => {
    void tick().then(scrollToBottom);
  });

  const nowIso = () => new Date().toISOString();

  function staffAuthor(): Pick<DemoMessage, 'authorId' | 'authorName' | 'authorAvatar' | 'isStaff'> {
    return { authorId: ME.userId, authorName: ME.displayName, authorAvatar: ME.avatarUrl, isStaff: true };
  }

  async function sendMessage() {
    const ticket = selectedTicketDetail;
    if (!chatInput.trim() || !ticket) return;
    const text = chatInput.trim();
    chatInput = '';
    const at = nowIso();
    const content: L = { fr: text, en: text };
    const firstResponse = ticket.sla.firstResponse && !ticket.sla.firstResponse.completedAt
      ? { ...ticket.sla.firstResponse, completedAt: at, status: new Date(ticket.sla.firstResponse.dueAt).getTime() >= Date.now() ? 'met' as const : 'breached' as const }
      : ticket.sla.firstResponse;
    const open = [firstResponse, ticket.sla.resolution].filter((clock) => clock && !clock.completedAt);
    patchTicket(ticket.id, {
      messages: [...ticket.messages, { id: `m-${Date.now()}`, ...staffAuthor(), content, createdAt: at }],
      lastStaffMessageAt: at,
      firstResponseAt: ticket.firstResponseAt ?? at,
      waitingOn: 'member',
      sla: {
        ...ticket.sla,
        firstResponse,
        worst: open.some((clock) => clock!.status === 'breached') ? 'breached' : open.some((clock) => clock!.status === 'at_risk') ? 'at_risk' : ticket.sla.worst ? 'ok' : null,
      },
    });
    await tick();
    scrollToBottom();
  }

  function claimTicket() {
    patchSelected({ status: 'CLAIMED', claimedById: ME.userId, claimedByName: ME.displayName, claimedByAvatar: ME.avatarUrl });
  }

  function closeTicket() {
    patchSelected({ status: 'CLOSED', closedAt: nowIso(), waitingOn: null });
    showCloseModal = false;
    closeReason = '';
  }

  function renameTicket() {
    const name = ticketRenameName.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').slice(0, 100);
    if (!name) return;
    ticketRenameName = name;
    patchSelected({ channelName: name });
    toasts.success(t.renamedToast);
  }

  function reopenTicket() {
    patchSelected({ status: 'OPEN', closedAt: null, claimedById: null, claimedByName: null, claimedByAvatar: null });
  }

  function approvePendingTicket() {
    const ticket = selectedTicketDetail;
    if (!ticket) return;
    patchTicket(ticket.id, {
      status: 'OPEN',
      channelId: `demo-channel-${ticket.id}`,
      waitingOn: 'staff',
      lastMemberMessageAt: ticket.createdAt,
      reviewedByName: ME.displayName,
    });
    toasts.success(t.approvedToast);
  }

  function rejectPendingTicket() {
    patchSelected({ status: 'REJECTED', reviewedByName: ME.displayName, rejectionReason: rejectReason.trim() || null, closedAt: nowIso() });
    toasts.success(t.rejectedToast);
    showRejectModal = false;
    rejectReason = '';
  }

  function archiveTicket(unarchive = false) {
    patchSelected({ status: unarchive ? 'CLOSED' : 'ARCHIVED' });
    toasts.success(unarchive ? t.unarchivedToast : t.archivedToast);
  }

  const LOCK_DURATION_MS: Record<string, number | null> = {
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
    permanent: null,
  };

  function lockTicket() {
    const ms = LOCK_DURATION_MS[lockDuration];
    patchSelected({
      deletionLocked: true,
      deletionLockedUntil: ms === null ? null : new Date(Date.now() + ms).toISOString(),
      deletionLockReason: lockReason.trim() || null,
      deletionLockedByName: ME.displayName,
    });
    showLockModal = false;
    lockReason = '';
    toasts.success(t.lockedToast);
  }

  function unlockTicket() {
    patchSelected({ deletionLocked: false, deletionLockedUntil: null, deletionLockReason: null, deletionLockedByName: null });
    toasts.success(t.unlockedToast);
  }

  function deleteTicket() {
    tickets = tickets.filter((ticket) => ticket.id !== selectedTicketId);
    showDeleteConfirmModal = false;
    selectedTicketId = null;
  }

  // Propriétés (TicketProperties)
  function setPriority(priority: TicketPriority) {
    patchSelected({ priority });
  }

  function setAssignee(userId: string) {
    const member = Object.values(STAFF).find((staff) => staff.userId === userId);
    patchSelected(member
      ? { status: 'CLAIMED', claimedById: member.userId, claimedByName: member.displayName, claimedByAvatar: member.avatarUrl }
      : { status: 'OPEN', claimedById: null, claimedByName: null, claimedByAvatar: null });
    toasts.success(member ? t.assignedToast(member.displayName) : t.unassignedToast);
  }

  function setTags(tags: string[]) {
    patchSelected({ tags });
  }

  // La fiche membre s'ouvre par-dessus l'écran : le focus y entre (Échap la
  // ferme alors) et revient au bouton qui l'a ouverte.
  let caseOpener: HTMLElement | null = null;

  async function openMemberCase(userId: string) {
    caseOpener = document.activeElement as HTMLElement | null;
    caseUserId = userId;
    await tick();
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>('.tickets-screen [data-case-close]') ?? document.querySelector<HTMLElement>('.tickets-screen .app-modal button');
      target?.focus();
    });
  }

  function closeMemberCase() {
    caseUserId = null;
    if (caseOpener && document.contains(caseOpener)) caseOpener.focus();
    caseOpener = null;
  }

  function messageText(content: L | null): string {
    return content ? content[locale] : '';
  }
</script>

<Dash class="tickets-screen relative w-full h-full overflow-hidden p-5">
  <ModulePage title={t.pageTitle} description={t.pageDesc} icon="message-square">
    {#snippet actions()}
      <!-- La roue crantée qui menait à « Configuration » faisait doublon avec
           l'onglet du même nom, juste en dessous : elle est retirée. -->
      <RefreshButton onClick={handleRefresh} loading={refreshing} label={t.refresh} />
    {/snippet}

    <Tabs label={t.pageTitle} tabs={tabs} active={activeTab} onchange={(id) => (activeTab = id as TabId)} />

    {#if activeTab === 'tickets'}
      <!-- Les colonnes latérales ont une largeur bornée, la conversation prend le reste. -->
      <div class="tickets-grid grid grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)_minmax(16rem,19rem)] gap-4 flex-1 min-h-0">

        <!-- Colonne de gauche : boîte de réception -->
        <div data-tour="tickets-list" class="bg-surface-container-low/40 border border-outline-variant/10 rounded-xl p-4 flex flex-col overflow-hidden h-full min-h-0">
          <TicketInboxList
            tickets={listed}
            view={inboxView}
            counts={viewCounts}
            sort={inboxSort}
            query={inboxQuery}
            selectedId={selectedTicketId}
            {slaConfigured}
            statusLabel={getStatusLabel}
            {tagLabel}
            onview={(view) => { selectedTicketId = null; changeInbox({ view }); }}
            onsearch={(query) => changeInbox({ query })}
            onsort={(sort) => changeInbox({ sort })}
            onselect={(id) => selectTicket(id)}
          />
        </div>

        <!-- Colonne centrale : conversation et actions -->
        <div data-tour="tickets-chat" class="min-w-0 bg-surface-container-low/40 border border-outline-variant/10 rounded-xl flex flex-col overflow-hidden h-full min-h-0">
          {#if !selectedTicketDetail}
            <div class="flex-1 flex flex-col items-center justify-center text-on-surface-variant/30 py-20">
              <div class="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center mb-4 shadow-inner">
                <Papicon icon="message-square" size={32} />
              </div>
              <h3 class="text-lg font-semibold text-on-surface/40">{t.noSelectionTitle}</h3>
              <p class="text-xs opacity-60 mt-1">{t.noSelectionDesc}</p>
            </div>
          {:else}
            {@const detail = selectedTicketDetail}
            <!-- En-tête : bornée en hauteur et défilante, pour que la
                 conversation garde toujours la plus grande part du panneau. -->
            <div class="shrink-0 max-h-[55%] overflow-y-auto px-4 py-3 border-b border-outline-variant/10 bg-surface-container/20">
              <div class="flex items-center gap-3">
                {#if detail.userAvatar}
                  <img src={detail.userAvatar} alt={detail.username} class="w-9 h-9 rounded-xl object-cover shadow-inner shrink-0" />
                {:else}
                  <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold text-base shadow-inner shrink-0">
                    {detail.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                {/if}
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-base font-semibold text-on-surface truncate">@{detail.username || t.userFallback}</h3>
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold border {getStatusColor(detail.status)}">
                      {getStatusLabel(detail.status)}
                    </span>
                    {#if detail.mode && detail.mode !== 'CHANNEL'}
                      <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {detail.mode === 'DM' ? t.modeDm : t.modeThread}
                      </span>
                    {/if}
                    <!-- Panneau replié : la priorité hors normale et les
                         étiquettes restent lisibles sans le déplier. -->
                    {#if !detailsOpen}
                      {#if detail.priority && detail.priority !== 'NORMAL'}
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold border {PRIORITY_CHIP[detail.priority].tone}">
                          {PRIORITY_CHIP[detail.priority].label}
                        </span>
                      {/if}
                      {#each detail.tags.slice(0, 3) as tag (tag)}
                        <span class="px-2 py-0.5 rounded-full text-xs bg-surface-container text-on-surface-variant">#{tagLabel(tag)}</span>
                      {/each}
                      {#if detail.tags.length > 3}
                        <span class="text-xs text-on-surface-variant">+{detail.tags.length - 3}</span>
                      {/if}
                    {/if}
                  </div>
                  {#if detail.claimedByName}
                    <div class="flex items-center gap-1 text-2xs text-primary/80 font-bold">
                      {#if detail.claimedByAvatar}
                        <img src={detail.claimedByAvatar} alt={detail.claimedByName} class="w-4 h-4 rounded-full object-cover" />
                      {/if}
                      {t.assignedTo(detail.claimedByName)}
                    </div>
                  {/if}
                </div>
                <button
                  type="button"
                  onclick={() => (detailsOpen = !detailsOpen)}
                  aria-expanded={detailsOpen}
                  aria-controls="ticket-details-panel"
                  class="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 border transition-colors {detailsOpen ? 'bg-primary/10 text-primary border-primary/20' : 'text-on-surface-variant border-outline-variant/20 hover:bg-surface-container'}"
                >
                  <Papicon icon="sliders" size={12} />
                  <span>{t.detailsToggle}</span>
                  <Papicon icon={detailsOpen ? 'chevron-up' : 'chevron-down'} size={12} />
                </button>
              </div>

              <!-- Demande en attente ou refusée : aucun salon n'existe, l'écran
                   doit dire pourquoi plutôt que rester vide. -->
              {#if detail.status === 'PENDING'}
                <div class="mt-3 flex items-start gap-2 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
                  <Papicon icon="clock" size={14} class="text-sky-400 shrink-0 mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <p class="text-2xs text-on-surface-variant">{t.pendingNotice}</p>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="primary" icon="check" onclick={approvePendingTicket}>{t.approve}</Button>
                      <Button size="sm" variant="danger" icon="x" onclick={() => { rejectReason = ''; showRejectModal = true; }}>{t.reject}</Button>
                    </div>
                  </div>
                </div>
              {:else if detail.status === 'REJECTED'}
                <div class="mt-3 flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/20">
                  <Papicon icon="x-circle" size={14} class="text-error shrink-0 mt-0.5" />
                  <p class="text-2xs text-on-surface-variant">
                    {t.rejectedNotice(detail.reviewedByName || '-')}
                    {#if detail.rejectionReason}<br />{t.rejectedReason(detail.rejectionReason)}{/if}
                  </p>
                </div>
              {/if}

              <!-- Actions : elles passent à la ligne plutôt que de déborder. -->
              <div class="flex flex-wrap items-center gap-2 mt-3">
                <button
                  onclick={() => openMemberCase(detail.userId)}
                  class="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-semibold hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Papicon icon="shield" size={12} /> {t.btnCase}
                </button>

                {#if detail.status === 'OPEN' || detail.status === 'CLAIMED'}
                  {#if detail.status === 'OPEN'}
                    <button onclick={claimTicket}
                      class="px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-lg text-xs font-semibold hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Papicon icon="user-check" size={12} /> {t.btnClaim}
                    </button>
                  {/if}
                  <button onclick={() => (showCloseModal = true)}
                    class="px-3 py-1.5 bg-error/10 text-error border border-error/20 rounded-lg text-xs font-semibold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Papicon icon="x-circle" size={12} /> {t.btnClose}
                  </button>
                {/if}

                {#if detail.status === 'CLAIMED' && detail.claimedById !== ME.userId && config.ticketAllowOverclaim && config.ticketOverclaimPermission !== 'NONE'}
                  <button onclick={claimTicket}
                    class="px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-lg text-xs font-semibold hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Papicon icon="user-check" size={12} /> {t.btnOverclaim}
                  </button>
                {/if}

                {#if (detail.status === 'CLOSED' || detail.status === 'ARCHIVED') && detail.channelId}
                  <button onclick={reopenTicket}
                    class="px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-lg text-xs font-semibold hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Papicon icon="refresh" size={12} /> {t.btnReopen}
                  </button>

                  <!-- Archiver conserve tout : le salon passe en lecture seule
                       au lieu d'être détruit. C'est l'alternative à Supprimer,
                       posée juste avant lui pour se présenter d'abord. -->
                  {#if detail.status === 'ARCHIVED'}
                    <button onclick={() => archiveTicket(true)}
                      class="px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-semibold hover:bg-sky-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Papicon icon="upload" size={12} /> {t.btnUnarchive}
                    </button>
                  {:else}
                    <button onclick={() => archiveTicket(false)}
                      class="px-3 py-1.5 bg-slate-500/10 text-on-surface-variant border border-slate-500/20 rounded-lg text-xs font-semibold hover:bg-slate-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Papicon icon="archive" size={12} /> {t.btnArchive}
                    </button>
                  {/if}

                  {#if deletionLock}
                    <button onclick={unlockTicket}
                      class="px-3 py-1.5 bg-warning/10 text-warning border border-warning/20 rounded-lg text-xs font-semibold hover:bg-amber-500 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Papicon icon="unlock" size={12} /> {t.btnUnlock}
                    </button>
                  {:else}
                    <button onclick={() => (showLockModal = true)}
                      class="px-3 py-1.5 bg-outline-variant/10 text-on-surface-variant border border-outline-variant/20 rounded-lg text-xs font-semibold hover:bg-on-surface-variant hover:text-surface transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Papicon icon="lock" size={12} /> {t.btnLock}
                    </button>
                  {/if}

                  <!-- Sous verrou le bouton reste visible mais inerte : le
                       masquer laisserait croire que la suppression n'existe pas. -->
                  <button onclick={() => { if (!deletionLock) showDeleteConfirmModal = true; }}
                    disabled={!!deletionLock}
                    title={deletionLock ? t.deleteLockedHint : undefined}
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 {deletionLock ? 'bg-surface-container text-on-surface-variant/30 border border-outline-variant/10 cursor-not-allowed' : 'bg-rose-600 text-white border border-transparent hover:bg-rose-500'}"
                  >
                    <Papicon icon="delete" size={12} /> {t.btnDelete}
                  </button>
                {/if}
              </div>

              {#if deletionLock}
                <div class="mt-3 flex items-start gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <Papicon icon="lock" size={14} class="text-warning mt-0.5 shrink-0" />
                  <div class="text-2xs text-warning/90 leading-relaxed">
                    <p class="font-semibold">
                      {t.lockBanner}
                      · {deletionLock.until ? t.lockUntil(new Date(deletionLock.until).toLocaleDateString(dateLocale)) : t.lockPermanent}
                      {#if deletionLock.byName}· {t.lockBy(deletionLock.byName)}{/if}
                    </p>
                    {#if deletionLock.reason}<p class="mt-0.5 opacity-80">{deletionLock.reason}</p>{/if}
                  </div>
                </div>
              {/if}

              {#if detailsOpen}
                <div id="ticket-details-panel">
                  <TicketProperties
                    ticket={localize(detail)}
                    {agents}
                    {knownTags}
                    {tagLabel}
                    onpriority={setPriority}
                    onassign={setAssignee}
                    ontags={setTags}
                  />

                  {#if detail.channelId && detail.mode !== 'DM'}
                    <div class="mt-3 flex gap-2 items-center">
                      <FormInput type="text" bind:value={ticketRenameName} placeholder={t.renamePh} className="flex-1" />
                      <button onclick={renameTicket} disabled={!ticketRenameName.trim()} title={!ticketRenameName.trim() ? t.fillField : undefined}
                        class="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 shrink-0"
                      >
                        <Papicon icon="edit" size={12} />
                        {t.renameBtn}
                      </button>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Messages : seule zone qui défile, comme dans le dashboard. -->
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <div
              bind:this={chatScrollContainer}
              tabindex="0"
              role="log"
              aria-label={t.messages}
              class="chat-log flex-1 overflow-y-auto bg-[#313338] scrollbar-hide"
              class:p-6={messages.length > 0}
              class:space-y-3={messages.length > 0}
            >
              {#if messages.length === 0}
                <div class="flex flex-col items-center justify-center text-white/30 h-full">
                  <Papicon icon="forum" size={28} class="opacity-50 mb-2" />
                  <p class="text-xs">{t.noMessage}</p>
                </div>
              {:else}
                {#each messages as msg (msg.id)}
                  {@const avatar = msg.authorId === BOT_ID ? `${base}/favicon.svg` : msg.authorAvatar}
                  <div class="flex items-start gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                    <div class="shrink-0">
                      {#if avatar}
                        <img src={avatar} alt="" class="h-10 w-10 rounded-full object-cover border border-white/10" />
                      {:else}
                        <div class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white/80">
                          {msg.authorName?.slice(0, 1).toUpperCase()}
                        </div>
                      {/if}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-baseline gap-1.5 flex-wrap">
                        <span class="text-sm font-bold text-white">{msg.authorName || t.anonymous}</span>
                        {#if msg.isStaff}
                          <span class="bg-[#5865F2] text-white text-2xs font-semibold px-1 py-0.5 rounded leading-none">{t.staffBadge}</span>
                        {/if}
                        <span class="text-2xs text-white/60">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {#if msg.content}
                        <p class="text-sm text-white/90 mt-1 whitespace-pre-wrap leading-relaxed select-text">{messageText(msg.content)}</p>
                      {/if}

                      {#if msg.embeds && msg.embeds.length > 0}
                        <div class="mt-2 space-y-2">
                          {#each msg.embeds as embed, index (index)}
                            <div class="bg-[#2b2d31] border-l-4 rounded-r-md p-2.5 max-w-lg" style="border-left-color: {embed.color || '#1e1f22'}">
                              <div class="font-bold text-[#00a8fc] text-sm mb-1">{embed.title[locale]}</div>
                              <div class="text-sm text-white/80 whitespace-pre-wrap leading-relaxed select-text">{embed.description[locale]}</div>
                              {#if embed.fields && embed.fields.length > 0}
                                <div class="mt-2 flex flex-wrap gap-2">
                                  {#each embed.fields as field, fieldIndex (fieldIndex)}
                                    <div class="flex-1 min-w-[45%]">
                                      <div class="text-2xs font-bold text-white/60 uppercase">{field.name[locale]}</div>
                                      <div class="text-xs text-white/80 select-text">{field.value[locale]}</div>
                                    </div>
                                  {/each}
                                </div>
                              {/if}
                              {#if embed.buttons?.length}
                                <!-- Les boutons d'un message Discord, en lecture seule : ils
                                     agissent dans Discord, pas depuis le dashboard. -->
                                <div class="mt-2 flex flex-wrap gap-1.5">
                                  {#each embed.buttons as button, buttonIndex (buttonIndex)}
                                    <span class="chat-button chat-button--style-{button.style}">
                                      {#if button.emoji}<span>{button.emoji}</span>{/if}
                                      {button.label[locale]}
                                    </span>
                                  {/each}
                                </div>
                              {/if}
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>

            <!-- Barre de saisie -->
            {#if detail.status === 'OPEN' || detail.status === 'CLAIMED'}
              <div class="p-4 border-t border-outline-variant/10 bg-surface-container/20 flex gap-3">
                <input
                  type="text"
                  bind:value={chatInput}
                  onkeydown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t.messagePh}
                  aria-label={t.messagePh}
                  class="flex-1 bg-surface-container rounded-lg px-4 py-3 focus:outline-hidden border-2 border-transparent focus:border-primary/50 text-sm"
                />
                <button
                  onclick={sendMessage}
                  aria-label={t.send}
                  title={!chatInput.trim() ? t.fillField : t.send}
                  class="w-11 h-11 rounded-lg bg-primary text-white flex items-center justify-center active:scale-[0.98] transition-transform disabled:opacity-50 shrink-0"
                >
                  <Papicon icon="send" size={18} />
                </button>
              </div>
            {:else}
              <div class="p-4 border-t border-outline-variant/10 bg-error/10 text-error flex items-center justify-center text-xs font-medium gap-2">
                <Papicon icon="lock" size={14} /> {t.closedBanner}
              </div>
            {/if}
          {/if}
        </div>

        <!-- Profil de l'auteur, comme le panneau de profil de Discord. -->
        {#if selectedTicketDetail?.userId}
          <aside class="flex flex-col bg-surface-container-low/40 border border-outline-variant/10 rounded-xl overflow-hidden h-full min-h-0" aria-label={t.authorProfile}>
            <TicketMemberPanel
              userId={selectedTicketDetail.userId}
              summary={memberSummaries[selectedTicketDetail.userId] ?? null}
              fallbackName={selectedTicketDetail.username}
              onopencase={(id) => openMemberCase(id)}
            />
          </aside>
        {:else}
          <div></div>
        {/if}
      </div>
    {:else}
      <div class="flex-1 min-h-0 overflow-y-auto">
        {#key refreshToken}
          {#if activeTab === 'performance'}
            <TicketPerformance />
          {:else if activeTab === 'config'}
            <TicketSettings bind:config {ask} {toasts} />
          {:else if activeTab === 'transcripts'}
            <TicketTranscripts tickets={tickets} onopen={openTicketFromTab} {ask} />
          {:else if activeTab === 'satisfaction'}
            <TicketSatisfactionTab onopenmember={(id) => openMemberCase(id)} />
          {:else if activeTab === 'macros'}
            <TicketMacros {ask} {toasts} />
          {:else if activeTab === 'blacklist'}
            <TicketBlacklist {ask} {toasts} />
          {/if}
        {/key}
      </div>
    {/if}
  </ModulePage>

  <!-- ============================================== -->
  <!-- FENÊTRES -->
  <!-- ============================================== -->

  <!-- Refus d'une demande en attente -->
  {#if showRejectModal}
    <div class="contents" use:dialog={() => (showRejectModal = false)}>
      <Modal bind:open={showRejectModal} title={t.rejectTitle} subtitle={t.rejectDesc} size="md">
        <label class="block">
          <span class="text-xs font-semibold text-on-surface-variant mb-2 block">{t.rejectReason}</span>
          <textarea class="input h-28" maxlength="500" bind:value={rejectReason} placeholder={t.rejectReasonPh}></textarea>
        </label>
        {#snippet footer()}
          <Button variant="ghost" onclick={() => (showRejectModal = false)}>{t.cancel}</Button>
          <Button variant="danger" onclick={rejectPendingTicket}>{t.rejectConfirm}</Button>
        {/snippet}
      </Modal>
    </div>
  {/if}

  <!-- Fermeture du ticket -->
  {#if showCloseModal}
    <div class="absolute inset-0 z-100 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-labelledby="ticket-close-title" use:dialog={() => (showCloseModal = false)}>
      <div class="bg-surface border border-outline-variant/30 rounded-xl w-full max-w-lg shadow-sm p-10 animate-in zoom-in-95 duration-300">
        <div class="flex items-center gap-4 mb-2 text-error">
          <Papicon icon="x-circle" size={36} />
          <h3 id="ticket-close-title" class="text-2xl font-semibold">{t.closeModalTitle}</h3>
        </div>
        <p class="text-sm text-on-surface-variant/80 mb-6">{t.closeModalDesc}</p>

        <div>
          <label for="close-reason-input" class="field-label">{t.closeReasonLabel}</label>
          <textarea id="close-reason-input" bind:value={closeReason} class="w-full h-32 bg-surface-container rounded-lg p-4 focus:outline-hidden border-2 border-transparent focus:border-primary/50 text-sm" placeholder={t.closeReasonPh}></textarea>
        </div>

        <div class="flex gap-4 mt-8 pt-6 border-t border-outline-variant/20">
          <button onclick={() => (showCloseModal = false)} class="flex-1 py-4 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high transition-colors">{t.cancel}</button>
          <button
            onclick={closeTicket}
            class="flex-1 py-4 rounded-xl font-bold bg-rose-600 text-white active:scale-[0.98] transition-transform shadow-sm"
          >
            {t.closeConfirm}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Suppression du ticket -->
  {#if showDeleteConfirmModal}
    <div class="absolute inset-0 z-100 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-labelledby="ticket-delete-title" use:dialog={() => (showDeleteConfirmModal = false)}>
      <div class="bg-surface border border-outline-variant/30 rounded-xl w-full max-w-md shadow-sm p-10 animate-in zoom-in-95 duration-300">
        <div class="flex items-center gap-4 mb-2 text-error">
          <Papicon icon="delete" size={36} />
          <h3 id="ticket-delete-title" class="text-2xl font-semibold">{t.deleteModalTitle}</h3>
        </div>
        <p class="text-sm text-on-surface-variant/80 mb-6">{t.deleteModalDesc}</p>

        <div class="flex gap-4 mt-8 pt-6 border-t border-outline-variant/20">
          <button onclick={() => (showDeleteConfirmModal = false)} class="flex-1 py-4 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high transition-colors">{t.cancel}</button>
          <button
            onclick={deleteTicket}
            class="flex-1 py-4 rounded-xl font-bold bg-rose-600 text-white active:scale-[0.98] transition-transform shadow-sm"
          >
            {t.deleteConfirm}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Verrou anti-suppression -->
  {#if showLockModal}
    <div class="absolute inset-0 z-100 flex items-center justify-center p-4 bg-black/60" role="dialog" aria-modal="true" aria-labelledby="ticket-lock-title" use:dialog={() => (showLockModal = false)}>
      <div class="bg-surface border border-outline-variant/30 rounded-xl w-full max-w-md shadow-sm p-10 animate-in zoom-in-95 duration-300">
        <div class="flex items-center gap-4 mb-2 text-warning">
          <Papicon icon="lock" size={36} />
          <h3 id="ticket-lock-title" class="text-2xl font-semibold">{t.lockModalTitle}</h3>
        </div>
        <p class="text-sm text-on-surface-variant/80 mb-6">{t.lockModalIntro}</p>

        <p class="block text-xs font-semibold text-on-surface-variant mb-2" id="ticket-lock-duration-label">
          {t.lockDuration}
        </p>
        <div class="grid grid-cols-2 gap-2 mb-6" role="group" aria-labelledby="ticket-lock-duration-label">
          {#each [['7d', t.lock7d], ['30d', t.lock30d], ['90d', t.lock90d], ['permanent', t.lockPermanentOption]] as [value, label] (value)}
            <button
              type="button"
              aria-pressed={lockDuration === value}
              onclick={() => (lockDuration = value as typeof lockDuration)}
              class="py-2.5 rounded-lg text-xs font-semibold transition-all border {lockDuration === value ? 'bg-amber-500 text-white border-warning' : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high'}"
            >
              {label}
            </button>
          {/each}
        </div>

        <label class="block">
          <span class="text-xs font-bold text-on-surface-variant/80 ml-1 mb-2 block">{t.lockReason}</span>
          <FormTextarea bind:value={lockReason} placeholder={t.lockReasonPh} rows={3} className="w-full" />
        </label>

        <div class="flex gap-4 mt-8 pt-6 border-t border-outline-variant/20">
          <button onclick={() => (showLockModal = false)} class="flex-1 py-4 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high transition-colors">{t.cancel}</button>
          <button
            onclick={lockTicket}
            class="flex-1 py-4 rounded-xl font-bold bg-amber-500 text-white active:scale-[0.98] transition-transform shadow-sm disabled:opacity-50"
          >
            {t.lockConfirm}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Confirmation : recopie de `ConfirmModal.svelte` (le `confirmDialog` du dashboard). -->
  {#if confirmState}
    {@const request = confirmState}
    {@const tone = CONFIRM_VARIANTS[request.variant ?? 'default']}
    <div
      class="confirm-modal absolute inset-0 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-confirm-title"
      aria-describedby={request.description ? 'ticket-confirm-description' : undefined}
      use:dialog={() => answer(false)}
    >
      <button type="button" tabindex="-1" aria-label={t.cancel} class="absolute inset-0 bg-black/40 animate-in fade-in duration-150 cursor-default" onclick={() => answer(false)}></button>
      <div class="confirm-modal__panel relative z-10 w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-5 space-y-5 animate-in fade-in slide-up duration-150">
        <div class="flex items-start gap-3">
          <span class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 {tone.tone}" aria-hidden="true">
            <Papicon icon={tone.icon} size={17} />
          </span>
          <div class="min-w-0 pt-1.5">
            <h3 id="ticket-confirm-title" class="text-base font-semibold text-on-surface leading-snug">{request.title}</h3>
            {#if request.description}
              <p id="ticket-confirm-description" class="text-sm text-on-surface-variant mt-1.5 leading-relaxed">{request.description}</p>
            {/if}
          </div>
        </div>
        <div class="confirm-modal__actions flex items-center justify-end gap-2">
          <Button variant="ghost" onclick={() => answer(false)}>{t.cancel}</Button>
          <Button variant={tone.button} data-autofocus onclick={() => answer(true)}>{request.confirmLabel}</Button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Dossier membre -->
  {#if caseUserId}
    <MemberCaseModal userId={caseUserId} onclose={closeMemberCase} />
  {/if}

  <Toasts {toasts} />
</Dash>

<style>
  /* L'écran tient dans son cadre : la page de module prend toute la hauteur
     et son corps passe en colonne, pour que la grille (ou l'onglet) occupe ce
     qui reste sous les onglets. Le dashboard le fait avec `100dvh - 13rem`. */
  :global(.tickets-screen .module-page) {
    height: 100%;
  }
  :global(.tickets-screen .module-page__body) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  :global(.tickets-screen .module-page__body > .tab-group) {
    flex-shrink: 0;
  }

  .chat-log:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .chat-button {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
    background: #4e5058;
    cursor: default;
  }
  .chat-button--style-1 { background: #5865f2; }
  .chat-button--style-3 { background: #248046; }
  .chat-button--style-4 { background: #da373c; }

  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>

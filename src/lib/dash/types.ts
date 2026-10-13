/**
 * Formes des données que lisent les écrans du dashboard recopiés sur le site.
 *
 * Le site n'a pas accès aux paquets du produit : ces types sont recopiés à la
 * main, sous les mêmes noms et avec les mêmes champs, pour que les données de
 * démo (`fixtures.ts`) passent telles quelles dans le balisage recopié. Sources
 * (dépôt `Kotbo`, branche `recette`) :
 * - contrat du dossier membre : `packages/contracts/src/types/memberCase.ts` ;
 * - staff : `apps/dashboard/src/lib/types.ts` et `StaffWarning`,
 *   `LeadershipMetric`, `StaffConfig` de `lib/components/staff/staffStore.svelte.ts` ;
 * - liste des membres : `MemberSearchResult`, local à `pages/Members.svelte` ;
 * - sanctions : `Sanction` de `lib/sanctions/filterSort.ts` ;
 * - appels de ban : `Appeal`, `AppealItem`, `AppealDetail`, locaux à `pages/BanAppeals.svelte` ;
 * - tickets : `InboxTicket` et ses horloges de `lib/api/ticketHelpdesk.ts`.
 *   Le message de ticket (`TicketMessage`) n'a pas de type dans le dashboard
 *   (`any`) : ses champs sont ceux que `pages/Tickets.svelte` lit.
 * Toute modification se vérifie dans le dépôt produit.
 */

// ── Dossier membre : `packages/contracts/src/types/memberCase.ts` ────────────

export type DashboardSanctionType = 'WARN' | 'KICK' | 'TIMEOUT' | 'TEMP_BAN' | 'BAN' | 'SOFTBAN';
export type DashboardSanctionStatus = 'ACTIVE' | 'RESOLVED' | 'FAILED';

export type DashboardRole = {
  id: string;
  name: string;
  mention: string;
  permissions: string[];
  position?: number;
  color?: string;
};

export type SanctionItem = {
  id: string;
  type: DashboardSanctionType;
  status: DashboardSanctionStatus;
  targetUserId: string;
  targetTag: string;
  moderatorUserId: string;
  moderatorTag: string;
  reason: string;
  durationSeconds: number | null;
  expiresAt: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolutionNote: string | null;
  /** Non nul = sanction archivee : desactivee mais conservee. */
  archivedAt: string | null;
  archiveReason: string | null;
  /** false = contestation verrouillee : le membre ne peut plus faire appel. */
  appealable: boolean;
  appealLockReason: string | null;
};

export type SanctionReportItem = {
  id: string;
  sanctionId: string | null;
  staffPseudo: string;
  incidentAt: string;
  memberPseudo: string;
  memberReference: string;
  sanctionType: DashboardSanctionType;
  sanctionDurationLabel: string | null;
  brokenRules: string;
  detailedReason: string;
  evidenceLinks: string[];
  additionalNotes: string | null;
  createdByUserId: string;
  createdByTag: string | null;
  createdAt: string;
};

export type MemberCaseQuickAction = 'WARN' | 'KICK' | 'TIMEOUT' | 'BAN' | 'REQUEST_VERIFICATION';

export type MemberCaseLogEntry = {
  id: string;
  user: string;
  action: string;
  context: string;
  module: string;
  eventType: string;
  source: 'dashboard' | 'discord';
  details: string;
  dateIso: string;
  channelId: string | null;
};

export type MemberCaseChannelMessage = {
  id: string;
  channelId: string;
  channelName: string;
  content: string;
  dateIso: string;
};

export type MemberCaseChannelSummary = {
  channelId: string;
  channelName: string;
  count: number;
  lastMessageAt: string | null;
  recentMessages: MemberCaseChannelMessage[];
};

export type MemberCaseInviteInfo = {
  code: string | null;
  inviterId: string | null;
  inviterTag: string | null;
  inviterAvatarUrl: string | null;
  joinedAt: string | null;
};

export type MemberCaseProfile = {
  id: string;
  userId: string;
  userTag: string | null;
  username: string | null;
  globalName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  accentColor: number | null;
  locale: string | null;
  isBot: boolean;
  accountCreatedAt: string | null;
  guildJoinedAt: string | null;
  guildLeftAt: string | null;
  firstSeenAt: string | null;
  lastSeenAt: string | null;
  lastMessageAt: string | null;
  lastMessageChannelId: string | null;
  messageCount: number;
  voiceSessionCount: number;
  voiceTimeSeconds: number;
  voiceLastChannelId: string | null;
  voiceLastJoinedAt: string | null;
  voiceLastLeftAt: string | null;
  rolesSnapshot: string[];
  presenceStatus: string | null;
  pronouns: string | null;
  isTutor: boolean;
  staffGrade: string | null;
  isSuspectedDC: boolean;
  moderatorNote: string | null;
  isOnServer: boolean;
};

export type LinkedAccountItem = {
  userId: string;
  userTag: string | null;
  avatarUrl: string | null;
  type: string;
  status: string;
};

export type MemberCaseInteractionNode = {
  id: string;
  label: string;
  type: 'user' | 'target';
  avatar?: string | null;
};

export type MemberCaseInteractionEdge = {
  from: string;
  to: string;
  type: 'mention' | 'reply' | 'reaction';
  count: number;
};

export type MemberCaseInteractionGraph = {
  nodes: MemberCaseInteractionNode[];
  edges: MemberCaseInteractionEdge[];
};

export type CrossServerSanctionEntry = {
  type: DashboardSanctionType;
  status: DashboardSanctionStatus;
  durationSeconds: number | null;
  reason: string;
  createdAt: string;
  guildId: string;
  guildName: string;
};

export type CrossServerSanctionSummaryPayload = {
  enabled: boolean;
  serverCount: number;
  total: number;
  breakdown: Record<DashboardSanctionType, number>;
  recent: CrossServerSanctionEntry[];
};

/** Un serveur tiers portant déjà le lien entre le membre et un autre compte. */
export type CrossServerLinkGuildEntry = {
  guildId: string;
  guildName: string;
  type: 'MANUAL' | 'AUTOMATIC';
  status: 'PENDING' | 'VALIDATED' | 'REJECTED';
  reason: string | null;
  linkedAt: string;
};

/**
 * Suggestion de liaison : ce compte est déjà lié à `userId` sur d'autres serveurs
 * de la même instance. Le staff décide de reproduire le lien ici ou non.
 */
export type CrossServerLinkSuggestionItem = {
  userId: string;
  userTag: string | null;
  avatarUrl: string | null;
  presentOnGuild: boolean;
  alreadyLinkedHere: boolean;
  serverCount: number;
  manualCount: number;
  guilds: CrossServerLinkGuildEntry[];
  /** Bonus de score de détection apporté par ce lien (0-85). */
  score: number;
};

export type CrossServerLinkSummaryPayload = {
  enabled: boolean;
  serverCount: number;
  suggestions: CrossServerLinkSuggestionItem[];
};

export type MemberCaseCandidature = {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  data: unknown;
  autoRejected: boolean;
  autoRejectReason: string | null;
  rejectionReason: string | null;
  oralResult: string | null;
  reapplyAfter: string | null;
};

export type MemberCaseConnection = {
  name: string;
  type: string;
  visible: boolean;
};

/** Une demande de vérification de sécurité passée sur ce membre. */
export type MemberCaseVerificationEntry = {
  id: string;
  status: 'PENDING' | 'VERIFIED' | 'FLAGGED' | 'EXPIRED';
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  requestedAt: string;
  verifiedAt: string | null;
  expiresAt: string | null;
};

/**
 * Historique des vérifications, affiché à côté du bouton « Demander
 * vérification » pour qu'un modérateur voie qu'un collègue l'a déjà fait.
 */
export type MemberCaseVerifications = {
  entries: MemberCaseVerificationEntry[];
  total: number;
  lastRequestedAt: string | null;
  lastVerifiedAt: string | null;
  /** Une demande est toujours ouverte : en relancer une n'apporte rien. */
  hasPending: boolean;
  /** Instant avant lequel une nouvelle demande est refusée (anti-spam). */
  cooldownUntil: string | null;
};

export type MemberCaseResponse = {
  profile: MemberCaseProfile | null;
  invite: MemberCaseInviteInfo | null;
  roles: DashboardRole[];
  effectivePermissions: string[];
  sanctions: SanctionItem[];
  logs: MemberCaseLogEntry[];
  messagesByChannel: MemberCaseChannelSummary[];
  recentMessageCount: number;
  recentLogCount: number;
  connections: MemberCaseConnection[];
  connectionsNote: string;
  candidatures: MemberCaseCandidature[];
  linkedAccounts: LinkedAccountItem[];
  isSuspectedDC: boolean;
  sanctionReports: SanctionReportItem[];
  interactionGraph: MemberCaseInteractionGraph;
  crossServerSanctions: CrossServerSanctionSummaryPayload;
  /** Liens de double compte déjà posés sur d'autres serveurs de l'instance. */
  crossServerLinks: CrossServerLinkSummaryPayload;
  verifications: MemberCaseVerifications;
};

// ── Staff : `apps/dashboard/src/lib/types.ts` ───────────────────────────────

export interface StaffMember {
  id: string;
  guildId: string;
  userId: string;
  grade: string;
  joinedStaffAt: Date | string;
  currentRoleStartedAt: Date | string;
  userTag?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  isTutor: boolean;
  suspendedAt?: Date | string | null;
  suspendedReason?: string | null;
  suspendedById?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  warnings?: { id: string; reason: string; expiresAt?: Date | string | null }[];
  blacklistEntries?: { id: string; reason: string; endDate?: Date | string | null }[];
  stats?: {
    totalMessages: number;
    totalVoiceMinutes: number;
    sanctionsIssued: number;
  } | null;
  hierarchyGrades?: StaffMemberHierarchyGrade[];
}

export interface StaffHierarchy {
  id: string;
  guildId: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  sortOrder: number;
  parentHierarchyId?: string | null;
  responsableUserId?: string | null;
  discordRoleId?: string | null;
  enabled: boolean;
  roles?: StaffRole[];
  memberGrades?: StaffMemberHierarchyGrade[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StaffMemberHierarchyGrade {
  id: string;
  staffMemberId: string;
  hierarchyId: string;
  grade: string;
  joinedAt: Date | string;
  hierarchy?: StaffHierarchy | null;
  staffMember?: StaffMember | null;
}

export interface StaffRole {
  id: string;
  guildId: string;
  name: string;
  level: number;
  discordRoleId?: string | null;
  color?: string | null;
  sortOrder: number;
  enabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  hierarchyId?: string | null;
  isResponsable?: boolean;
}

export interface TestingPeriod {
  id: string;
  guildId: string;
  staffUserId: string;
  mentorId?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  status: 'ONGOING' | 'PASSED' | 'FAILED';
  plannedDurationDays: number;
  targetGrade?: string | null;
  hierarchyId?: string | null;
  hierarchy?: StaffHierarchy | null;
  notes?: string | null;
  staffMember?: StaffMember | null;
  mentor?: StaffMember | null;
  reports?: MentorReport[];
  fullChecklist?: TutoringChecklistEntry[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TutoringItem {
  id: string;
  guildId: string;
  category: string;
  title: string;
  description?: string | null;
  sortOrder: number;
  hierarchyId?: string | null;
  grade?: string | null;
  hierarchy?: StaffHierarchy | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type TutoringItemState = 'UNCHECKED' | 'KNOWN' | 'ACQUIRED';

export interface TutoringChecklistEntry {
  item: TutoringItem;
  state: TutoringItemState;
  completedAt?: Date | string | null;
  completedByUserId?: string | null;
}

export interface MentorReport {
  id: string;
  testingPeriodId: string;
  authorId: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  content: string;
  createdAt: Date | string;
  author?: StaffMember | null;
}

export interface StaffManagerNote {
  id: string;
  guildId: string;
  targetUserId: string;
  authorId: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  author?: StaffMember;
}

// ── Staff : `lib/components/staff/staffStore.svelte.ts` ─────────────────────

export type StaffWarning = {
  id: string;
  staffUserId: string;
  staffDisplayName?: string | null;
  staffAvatarUrl?: string | null;
  reason: string;
  issuedByTag?: string | null;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string | null;
};

export type LeadershipMetric = {
  staffUserId: string;
  avg30d: number;
  avg7d: number;
  progressionScore: number;
  hasInactivityAlert: boolean;
};

export type StaffConfig = {
  baseStaffRoleId: string | null;
  testStaffRoleId: string | null;
  meetingAnnouncementChannelId: string | null;
  meetingVoiceChannelId: string | null;
  staffAnnouncementChannelId: string | null;
  warnsToDemote: number;
  warnsToBlacklist: number;
  blacklistPermanentByDefault: boolean;
  actionMode: 'auto' | 'validation';
  demoteRemoveAllRoles: boolean;
};

// ── Membres : `pages/Members.svelte` ────────────────────────────────────────

export type MemberSearchResult = {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isBot: boolean;
  lastSeenAt: string | null;
  messageCount: number;
  guildJoinedAt: string | null;
  guildLeftAt: string | null;
  isOnServer: boolean;
  presenceStatus?: string | null;
};

// ── Sanctions : `lib/sanctions/filterSort.ts` ───────────────────────────────

export interface Sanction {
  id: string;
  createdAt: string;
  type: string;
  targetTag: string;
  targetUserId: string;
  moderatorTag: string;
  moderatorUserId: string;
  durationSeconds: number | null;
  status: string;
  reason: string;
  /** Non nul = sanction archivee : desactivee mais conservee. */
  archivedAt?: string | null;
  archiveReason?: string | null;
  /** false = contestation verrouillee par le staff. */
  appealable?: boolean;
  appealLockReason?: string | null;
}

// ── Appels de ban : `pages/BanAppeals.svelte` ───────────────────────────────

export type AppealOutcome = 'PENDING' | 'UPHELD' | 'ARCHIVED' | 'DELETED' | 'LOCKED';

export interface AppealItem {
  id: string;
  sanctionId: string | null;
  sanctionType: string;
  sanctionReason: string;
  sanctionCreatedAt: string;
  moderatorTag: string | null;
  memberStatement: string | null;
  outcome: AppealOutcome;
  outcomeNote: string | null;
  decidedByTag: string | null;
}

export interface Appeal {
  id: string; userId: string; userTag: string | null; avatar: string | null;
  data: Record<string, unknown>; status: string; banReason: string | null;
  infoRequest: string | null; infoResponse: string | null;
  decidedByTag: string | null; decisionReason: string | null; decidedAt: string | null;
  dmDelivered: boolean; createdAt: string;
  messages?: any[] | null;
  sanctions?: AppealItem[] | null;
}

export interface AppealDetail {
  appeal: Appeal;
  sanctions: { id: string; type: string; status: string; reason: string; createdAt: string; moderatorTag: string | null; archivedAt: string | null; appealable: boolean }[];
  previousAppeals: { id: string; status: string; createdAt: string; decidedAt: string | null; decisionReason: string | null }[];
}

// ── Tickets : `lib/api/ticketHelpdesk.ts` ───────────────────────────────────

export type InboxView = 'open' | 'unassigned' | 'mine' | 'waiting_staff' | 'breached' | 'pending' | 'closed' | 'all';
export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type SlaStatus = 'met' | 'breached' | 'running' | 'at_risk';

export interface SlaClock {
  status: SlaStatus;
  dueAt: string;
  completedAt: string | null;
}

export interface TicketSla {
  firstResponse: SlaClock | null;
  resolution: SlaClock | null;
  worst: 'breached' | 'at_risk' | 'ok' | null;
}

/** Ligne de la boîte de réception, telle que la renvoie `GET /tickets`. */
export interface InboxTicket {
  id: string;
  userId: string;
  username: string;
  reason: string;
  status: string;
  claimedById: string | null;
  claimedByName: string | null;
  transcriptId: string | null;
  createdAt: string;
  ticketTypeLabel: string | null;
  priority: TicketPriority;
  tags: string[];
  firstResponseAt: string | null;
  closedAt: string | null;
  lastMemberMessageAt: string | null;
  lastStaffMessageAt: string | null;
  userAvatar: string | null;
  claimedByAvatar: string | null;
  waitingOn: 'staff' | 'member' | null;
  sla: TicketSla;
  /** Dernière émotion marquée du demandeur (Kotbo × AegisAI), absente sans le module. */
  moodLabel?: string | null;
  moodScore?: number | null;
  peakToxicity?: number | null;
}

/** Statuts de ticket que `pages/Tickets.svelte` sait afficher. */
export type TicketStatus = 'PENDING' | 'QUEUED' | 'OPEN' | 'CLAIMED' | 'CLOSED' | 'ARCHIVED' | 'REJECTED' | 'ORPHANED';

/** Message de ticket : les champs que `pages/Tickets.svelte` lit (`msg.*`). */
export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  isStaff: boolean;
  content: string;
  /** HTML déjà mis en forme (classes `dc-*`), rendu tel quel par le dashboard. */
  htmlContent: string;
  createdAt: string;
  attachments?: { url: string; name?: string; contentType?: string }[];
  embeds?: unknown[];
  mediaUrls?: { url: string; type?: string }[];
}

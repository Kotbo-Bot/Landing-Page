/**
 * Données de démo de l'écran Tickets (`dash/screens/tickets/`).
 *
 * Les formes suivent ce que lit `pages/Tickets.svelte` du dashboard (dépôt
 * `Kotbo`, branche `recette`) : les lignes de la boîte de réception
 * (`InboxTicket`), le détail d'un ticket et ses messages, la configuration,
 * puis les données des onglets secondaires (performance, transcriptions,
 * satisfaction, réponses types, liste noire). Tout texte affiché vient en
 * `{ fr, en }` ; les personnes sont celles de `cast.ts`, avec leurs
 * identifiants, pour que la fiche membre ouverte depuis un ticket soit la
 * bonne. Rien ici n'est réel.
 */
import { MEMBERS, STAFF, ago, HOUR, DAY, type CastMember } from '$lib/dash/cast';
import type { InboxTicket, SlaClock, TicketSla, TicketStatus } from '$lib/dash/types';

export type L = { fr: string; en: string };

const l = (fr: string, en: string): L => ({ fr, en });

/** Le membre du staff qui consulte le dashboard dans la démo. */
export const ME = STAFF.aiden;

/** Auteur des messages postés par le bot. */
export const BOT_ID = 'kotbo-bot';

// ── Messages ────────────────────────────────────────────────────────────────

export type DemoEmbed = {
  title: L;
  description: L;
  color: string;
  fields?: { name: L; value: L }[];
  buttons?: { label: L; emoji: string | null; style: number }[];
};

export type DemoMessage = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  isStaff: boolean;
  content: L | null;
  createdAt: string;
  embeds?: DemoEmbed[];
  reactions?: { emoji: string; name: string; count: number }[];
};

function said(id: string, who: CastMember, minutesAgo: number, content: L, isStaff = false): DemoMessage {
  return { id, authorId: who.userId, authorName: who.displayName, authorAvatar: who.avatarUrl, isStaff, content, createdAt: ago(minutesAgo) };
}

/** Le message d'accueil que Kotbo poste à l'ouverture d'un ticket. */
function welcome(id: string, minutesAgo: number, who: CastMember, type: L, reason: L): DemoMessage {
  return {
    id,
    authorId: BOT_ID,
    authorName: 'Kotbo',
    authorAvatar: null,
    isStaff: false,
    content: null,
    createdAt: ago(minutesAgo),
    embeds: [
      {
        title: l('Ticket ouvert', 'Ticket opened'),
        description: l(
          `Merci @${who.username}, un membre du staff va te répondre. Décris ta demande en détail.`,
          `Thanks @${who.username}, a staff member will answer you. Describe your request in detail.`,
        ),
        color: '#5865f2',
        fields: [
          { name: l('Type', 'Type'), value: type },
          { name: l('Raison', 'Reason'), value: reason },
        ],
        buttons: [
          { label: l('Fermer', 'Close'), emoji: '🔒', style: 4 },
          { label: l("S'assigner", 'Claim'), emoji: '🙋', style: 2 },
        ],
      },
    ],
  };
}

// ── Tickets ─────────────────────────────────────────────────────────────────

/**
 * Ligne de la boîte de réception et détail réunis : le dashboard les lit par
 * deux appels (`GET /tickets`, `GET /tickets/:id`), la démo les garde ensemble.
 */
export type DemoTicket = Omit<InboxTicket, 'reason' | 'ticketTypeLabel' | 'status'> & {
  status: TicketStatus;
  reason: L;
  ticketTypeLabel: L | null;
  mode: 'CHANNEL' | 'DM' | 'THREAD';
  channelId: string | null;
  channelName: string;
  deletionLocked: boolean;
  deletionLockedUntil: string | null;
  deletionLockReason: string | null;
  deletionLockedByName: string | null;
  reviewedByName: string | null;
  rejectionReason: string | null;
  messages: DemoMessage[];
};

function clock(status: SlaClock['status'], dueMinutesFromNow: number, completedMinutesAgo: number | null = null): SlaClock {
  return { status, dueAt: ago(-dueMinutesFromNow), completedAt: completedMinutesAgo === null ? null : ago(completedMinutesAgo) };
}

function sla(firstResponse: SlaClock | null, resolution: SlaClock | null): TicketSla {
  const clocks = [firstResponse, resolution].filter((c): c is SlaClock => !!c && !c.completedAt);
  const worst = clocks.some((c) => c.status === 'breached') ? 'breached' : clocks.some((c) => c.status === 'at_risk') ? 'at_risk' : firstResponse || resolution ? 'ok' : null;
  return { firstResponse, resolution, worst };
}

function ticket(
  id: string,
  who: CastMember,
  partial: Partial<DemoTicket> & Pick<DemoTicket, 'reason' | 'status' | 'createdAt' | 'messages'>,
): DemoTicket {
  const claimed = partial.claimedById ? Object.values(STAFF).find((s) => s.userId === partial.claimedById) : undefined;
  return {
    id,
    userId: who.userId,
    username: who.username,
    userAvatar: who.avatarUrl,
    claimedById: null,
    claimedByName: claimed?.displayName ?? null,
    claimedByAvatar: claimed?.avatarUrl ?? null,
    transcriptId: null,
    ticketTypeLabel: null,
    priority: 'NORMAL',
    tags: [],
    firstResponseAt: null,
    closedAt: null,
    lastMemberMessageAt: null,
    lastStaffMessageAt: null,
    waitingOn: null,
    sla: sla(null, null),
    moodLabel: null,
    mode: 'CHANNEL',
    channelId: `demo-channel-${id}`,
    channelName: `ticket-${who.username.replace(/[^a-z0-9]+/gi, '-')}`,
    deletionLocked: false,
    deletionLockedUntil: null,
    deletionLockReason: null,
    deletionLockedByName: null,
    reviewedByName: null,
    rejectionReason: null,
    ...partial,
  };
}

const TYPE = {
  moderation: l('Modération', 'Moderation'),
  report: l('Signalement', 'Report'),
  partner: l('Partenariat', 'Partnership'),
  support: l('Support', 'Support'),
  application: l('Candidature', 'Application'),
  shop: l('Boutique', 'Shop'),
};

/** Étiquettes des tickets de démo, traduites ; une étiquette ajoutée reste telle quelle. */
export const TAG_LABELS: Record<string, L> = {
  sanction: l('sanction', 'sanction'),
  appel: l('appel', 'appeal'),
  harcelement: l('harcelement', 'harassment'),
  mp: l('mp', 'dm'),
  partenariat: l('partenariat', 'partnership'),
  role: l('role', 'role'),
  boost: l('boost', 'boost'),
};

export function buildTickets(): DemoTicket[] {
  const { arka, sacha, pixel, tomtom, yuna, bastos, arkaAlt } = MEMBERS;
  const arkaReason = l('Mon avertissement pour pub est injuste', 'My warning for advertising is unfair');
  const sachaReason = l("Un membre m'envoie des MP insultants", 'A member keeps sending me insulting DMs');
  const pixelReason = l('Partenariat avec un serveur d’illustration', 'Partnership with an illustration server');
  const tomtomReason = l("Pas de rôle Membre après la vérification", 'No Member role after verification');

  return [
    ticket('t-1042', arka, {
      reason: arkaReason,
      ticketTypeLabel: TYPE.moderation,
      status: 'OPEN',
      priority: 'HIGH',
      tags: ['sanction'],
      createdAt: ago(22),
      lastMemberMessageAt: ago(6),
      waitingOn: 'staff',
      sla: sla(clock('at_risk', 8), clock('running', 24 * HOUR - 22)),
      messages: [
        welcome('m-1042-1', 22, arka, TYPE.moderation, arkaReason),
        said('m-1042-2', arka, 21, l(
          "Salut, je viens de prendre un avertissement pour pub alors que je partageais juste le serveur d'un pote dans #général",
          "Hi, I just got a warning for advertising while I was only sharing a friend's server in #general",
        )),
        said('m-1042-3', arka, 6, l("C'est ma troisième sanction, je comprends pas", "That's my third sanction, I don't get it")),
      ],
    }),
    ticket('t-1041', sacha, {
      reason: sachaReason,
      ticketTypeLabel: TYPE.report,
      status: 'CLAIMED',
      claimedById: STAFF.kylian.userId,
      priority: 'URGENT',
      tags: ['harcelement'],
      createdAt: ago(26 * HOUR),
      firstResponseAt: ago(26 * HOUR - 12),
      lastMemberMessageAt: ago(14),
      lastStaffMessageAt: ago(3 * HOUR),
      waitingOn: 'staff',
      sla: sla(clock('met', -26 * HOUR + 30, 26 * HOUR - 12), clock('breached', -2 * HOUR)),
      messages: [
        welcome('m-1041-1', 26 * HOUR, sacha, TYPE.report, sachaReason),
        said('m-1041-2', sacha, 26 * HOUR - 2, l(
          "Quelqu'un m'envoie des MP insultants depuis hier soir, j'ai des captures",
          "Someone has been sending me insulting DMs since last night, I have screenshots",
        )),
        said('m-1041-3', STAFF.kylian, 3 * HOUR, l(
          "Merci Sacha, envoie-moi les captures ici. Je regarde son historique en attendant.",
          "Thanks Sacha, send me the screenshots here. I'm checking their history meanwhile.",
        ), true),
        said('m-1041-4', sacha, 14, l("Voilà, il a aussi écrit dans #memes avant de tout supprimer", 'Here you go, they also posted in #memes before deleting everything')),
      ],
    }),
    ticket('t-1039', pixel, {
      reason: pixelReason,
      ticketTypeLabel: TYPE.partner,
      status: 'CLAIMED',
      claimedById: ME.userId,
      tags: ['partenariat'],
      createdAt: ago(3 * HOUR),
      firstResponseAt: ago(2 * HOUR + 40),
      lastMemberMessageAt: ago(3 * HOUR - 1),
      lastStaffMessageAt: ago(2 * HOUR + 40),
      waitingOn: 'member',
      sla: sla(clock('met', -2 * HOUR - 30, 2 * HOUR + 40), clock('running', 21 * HOUR)),
      messages: [
        welcome('m-1039-1', 3 * HOUR, pixel, TYPE.partner, pixelReason),
        said('m-1039-2', pixel, 3 * HOUR - 1, l(
          "Bonjour ! On anime un serveur d'illustration de 900 membres, un partenariat vous tenterait ?",
          'Hello! We run a 900-member illustration server, would you be up for a partnership?',
        )),
        said('m-1039-3', ME, 2 * HOUR + 40, l(
          'Salut Pixel, avec plaisir. Tu peux me donner le lien de ton serveur et ce que tu proposes en échange ?',
          'Hi Pixel, sure. Can you share your server link and what you offer in return?',
        ), true),
      ],
    }),
    ticket('t-1043', tomtom, {
      reason: tomtomReason,
      ticketTypeLabel: TYPE.support,
      status: 'OPEN',
      priority: 'LOW',
      tags: ['role'],
      createdAt: ago(9),
      lastMemberMessageAt: ago(8),
      waitingOn: 'staff',
      sla: sla(clock('running', 21), clock('running', 24 * HOUR - 9)),
      messages: [
        welcome('m-1043-1', 9, tomtom, TYPE.support, tomtomReason),
        said('m-1043-2', tomtom, 8, l("J'ai fait la vérification mais je n'ai toujours pas le rôle Membre", "I did the verification but I still don't have the Member role")),
      ],
    }),
    ticket('t-1044', yuna, {
      reason: l('Candidature pour rejoindre le staff', 'Application to join the staff'),
      ticketTypeLabel: TYPE.application,
      status: 'PENDING',
      channelId: null,
      createdAt: ago(35),
      messages: [],
    }),
    ticket('t-1036', bastos, {
      reason: l("Mon boost n'apparaît pas", "My boost doesn't show up"),
      ticketTypeLabel: TYPE.shop,
      status: 'CLOSED',
      claimedById: STAFF.maelys.userId,
      tags: ['boost'],
      createdAt: ago(2 * DAY),
      firstResponseAt: ago(2 * DAY - 15),
      closedAt: ago(2 * DAY - 70),
      sla: sla(clock('met', -2 * DAY + 30, 2 * DAY - 15), clock('met', -DAY, 2 * DAY - 70)),
      messages: [
        welcome('m-1036-1', 2 * DAY, bastos, TYPE.shop, l("Mon boost n'apparaît pas", "My boost doesn't show up")),
        said('m-1036-2', bastos, 2 * DAY - 1, l("J'ai boosté hier mais je n'ai pas le rôle Booster", "I boosted yesterday but I don't have the Booster role")),
        said('m-1036-3', STAFF.maelys, 2 * DAY - 15, l("C'est réglé, le rôle est revenu. Je ferme le ticket, bonne soirée !", "Sorted, the role is back. Closing the ticket, have a good evening!"), true),
      ],
    }),
    ticket('t-1029', arkaAlt, {
      reason: l('Pourquoi je suis bloqué ?', 'Why am I blocked?'),
      ticketTypeLabel: TYPE.moderation,
      status: 'ARCHIVED',
      claimedById: STAFF.zenox.userId,
      createdAt: ago(9 * DAY),
      firstResponseAt: ago(9 * DAY - 20),
      closedAt: ago(9 * DAY - 45),
      sla: sla(clock('met', -9 * DAY + 30, 9 * DAY - 20), clock('met', -8 * DAY, 9 * DAY - 45)),
      messages: [
        said('m-1029-1', arkaAlt, 9 * DAY, l('Pourquoi je suis bloqué ?', 'Why am I blocked?')),
        said('m-1029-2', STAFF.zenox, 9 * DAY - 20, l(
          "Ce compte est un double compte d'Arka : il reste bloqué tant que sa sanction court.",
          "This account is an alt of Arka's: it stays blocked while their sanction runs.",
        ), true),
      ],
    }),
  ];
}

/** Configuration lue par la page (`config` de `GET /tickets`). */
export type DemoTicketConfig = {
  ticketAllowOverclaim: boolean;
  ticketOverclaimPermission: 'ANY' | 'SUPERIOR_OR_EQUAL' | 'NONE';
  ticketSlaFirstResponseMinutes: number | null;
  ticketSlaResolutionHours: number | null;
  ticketInactivityEnabled: boolean;
  ticketInactivityHours: number;
  ticketInactivityMessage: string;
  ticketSatisfactionCommentEnabled: boolean;
  ticketSatisfactionCommentQuestion: string;
  ticketSatisfactionCommentTimeout: number;
};

export function buildConfig(): DemoTicketConfig {
  return {
    ticketAllowOverclaim: true,
    ticketOverclaimPermission: 'ANY',
    ticketSlaFirstResponseMinutes: 30,
    ticketSlaResolutionHours: 24,
    ticketInactivityEnabled: true,
    ticketInactivityHours: 48,
    ticketInactivityMessage: '',
    ticketSatisfactionCommentEnabled: false,
    ticketSatisfactionCommentQuestion: '',
    ticketSatisfactionCommentTimeout: 300,
  };
}

// ── Panneau de profil (TicketMemberPanel) ──────────────────────────────────

/**
 * Résumé d'un membre (`fetchMemberSummary` dans le dashboard) : ses points
 * d'attention et son historique de support. Le reste du panneau (profil,
 * rôles, casier) vient du dossier membre partagé (`fixtures/members.ts`),
 * comme le dashboard le lit dans `fetchMemberCase`.
 */
export type DemoMemberSummary = {
  signals: { key: string; label: L; tone: 'danger' | 'warning' | 'info' }[];
  support: { tickets: number; averageRating: number | null };
};

export function buildMemberSummaries(): Record<string, DemoMemberSummary> {
  const { arka, sacha, pixel, tomtom, yuna, bastos, arkaAlt } = MEMBERS;
  return {
    [arka.userId]: {
      signals: [
        { key: 'alt', label: l('Double compte lié', 'Linked alt account'), tone: 'danger' },
        { key: 'active', label: l('Sanction active', 'Active sanction'), tone: 'warning' },
      ],
      support: { tickets: 3, averageRating: 2 },
    },
    [sacha.userId]: { signals: [{ key: 'vip', label: l('Membre de longue date', 'Long-time member'), tone: 'info' }], support: { tickets: 2, averageRating: 5 } },
    [pixel.userId]: { signals: [], support: { tickets: 1, averageRating: null } },
    [tomtom.userId]: { signals: [], support: { tickets: 1, averageRating: null } },
    [yuna.userId]: { signals: [], support: { tickets: 4, averageRating: 4.5 } },
    [bastos.userId]: { signals: [{ key: 'blacklist', label: l('Liste noire des tickets', 'Ticket blocklist'), tone: 'warning' }], support: { tickets: 6, averageRating: 4 } },
    [arkaAlt.userId]: { signals: [{ key: 'alt', label: l('Double compte', 'Alt account'), tone: 'danger' }], support: { tickets: 1, averageRating: null } },
  };
}

// ── Performance ─────────────────────────────────────────────────────────────

export type DemoStats = {
  days: number;
  dates: string[];
  current: { created: number[]; closed: number[]; firstResponse: number[]; resolution: number[]; satisfaction: number[] };
  previous: { created: number[]; closed: number[]; firstResponse: number[]; resolution: number[]; satisfaction: number[] };
  agents: { userId: string; name: string; handled: number; closed: number; firstResponse: number; resolution: number; rating: number | null; ratings: number; openNow: number }[];
};

/** Série pseudo-aléatoire stable : la même graine redonne la même courbe. */
function series(length: number, seed: number, base: number, spread: number): number[] {
  let x = seed;
  return Array.from({ length }, (_, i) => {
    x = (x * 9301 + 49297) % 233280;
    const wave = Math.sin((i + seed) / 3.2) * spread * 0.4;
    return Math.max(0, Math.round((base + wave + (x / 233280 - 0.5) * spread) * 10) / 10);
  });
}

export function buildStats(days: number): DemoStats {
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    return d.toISOString().slice(0, 10);
  });
  const scale = days / 30;
  return {
    days,
    dates,
    current: {
      created: series(days, 7, 6, 6).map(Math.round),
      closed: series(days, 11, 5.6, 5).map(Math.round),
      firstResponse: series(days, 3, 14, 10),
      resolution: series(days, 5, 190, 120),
      satisfaction: series(days, 13, 4.3, 0.8).map((v) => Math.min(5, v)),
    },
    previous: {
      created: series(days, 17, 5, 5).map(Math.round),
      closed: series(days, 19, 4.8, 4).map(Math.round),
      firstResponse: series(days, 23, 21, 12),
      resolution: series(days, 29, 240, 140),
      satisfaction: series(days, 31, 4.1, 0.9).map((v) => Math.min(5, v)),
    },
    agents: [
      { userId: STAFF.kylian.userId, name: STAFF.kylian.displayName, handled: Math.round(58 * scale), closed: Math.round(54 * scale), firstResponse: 9, resolution: 150, rating: 4.7, ratings: Math.round(31 * scale), openNow: 1 },
      { userId: ME.userId, name: ME.displayName, handled: Math.round(47 * scale), closed: Math.round(45 * scale), firstResponse: 12, resolution: 175, rating: 4.5, ratings: Math.round(24 * scale), openNow: 1 },
      { userId: STAFF.maelys.userId, name: STAFF.maelys.displayName, handled: Math.round(39 * scale), closed: Math.round(39 * scale), firstResponse: 18, resolution: 210, rating: 4.8, ratings: Math.round(22 * scale), openNow: 0 },
      { userId: STAFF.nora.userId, name: STAFF.nora.displayName, handled: Math.round(14 * scale), closed: Math.round(12 * scale), firstResponse: 26, resolution: 320, rating: 3.4, ratings: Math.round(8 * scale), openNow: 0 },
    ],
  };
}

// ── Satisfaction ───────────────────────────────────────────────────────────

export type DemoReview = { id: string; userId: string; staffId: string; rating: number; comment: L | null; createdAt: string };

export function buildReviews(): DemoReview[] {
  const { sacha, pixel, yuna, bastos, tomtom, arka } = MEMBERS;
  return [
    { id: 'rv-1', userId: bastos.userId, staffId: STAFF.maelys.userId, rating: 5, comment: l('Réglé en 10 minutes, merci !', 'Sorted in 10 minutes, thanks!'), createdAt: ago(2 * DAY - 60) },
    { id: 'rv-2', userId: yuna.userId, staffId: STAFF.kylian.userId, rating: 4, comment: null, createdAt: ago(4 * DAY) },
    { id: 'rv-3', userId: arka.userId, staffId: STAFF.nora.userId, rating: 2, comment: l("On ne m'a pas expliqué la sanction", 'Nobody explained the sanction to me'), createdAt: ago(9 * DAY) },
    { id: 'rv-4', userId: sacha.userId, staffId: STAFF.kylian.userId, rating: 5, comment: null, createdAt: ago(11 * DAY) },
    { id: 'rv-5', userId: pixel.userId, staffId: STAFF.maelys.userId, rating: 5, comment: l('Super accueil', 'Great welcome'), createdAt: ago(13 * DAY) },
    { id: 'rv-6', userId: tomtom.userId, staffId: STAFF.kylian.userId, rating: 4, comment: null, createdAt: ago(16 * DAY) },
    { id: 'rv-7', userId: yuna.userId, staffId: STAFF.maelys.userId, rating: 5, comment: l('Toujours aussi efficace', 'As efficient as ever'), createdAt: ago(20 * DAY) },
    { id: 'rv-8', userId: bastos.userId, staffId: STAFF.kylian.userId, rating: 3, comment: l('Il a fallu relancer deux fois', 'I had to follow up twice'), createdAt: ago(23 * DAY) },
  ];
}

/** Volumes affichés par l'onglet Satisfaction, au-delà des avis listés. */
export const SATISFACTION_TOTALS = {
  distribution: [3, 5, 9, 27, 42] as const,
  byStaff: [
    { staffId: STAFF.maelys.userId, averageRating: 4.8, totalResponses: 22 },
    { staffId: STAFF.kylian.userId, averageRating: 4.6, totalResponses: 31 },
    { staffId: STAFF.nora.userId, averageRating: 3.4, totalResponses: 9 },
  ],
};

// ── Réponses types ─────────────────────────────────────────────────────────

export type DemoMacro = {
  id: string;
  name: L;
  category: L | null;
  emoji: string | null;
  content: L;
  enabled: boolean;
  keywords: string[];
  autoSendOnOpen: boolean;
  setTicketTypeId: string | null;
  addRoleId: string | null;
  removeRoleId: string | null;
  requestSatisfaction: boolean;
  closeTicket: boolean;
  usageCount: number;
};

export const MACRO_TICKET_TYPES = [
  { id: 'moderation', label: TYPE.moderation },
  { id: 'report', label: TYPE.report },
  { id: 'support', label: TYPE.support },
  { id: 'partner', label: TYPE.partner },
];

export const MACRO_ROLES = [
  { id: 'r-1', name: 'Membre' },
  { id: 'r-5', name: 'Booster' },
  { id: 'r-6', name: 'Partenaire' },
];

export function buildMacros(): DemoMacro[] {
  return [
    {
      id: 'mc-1', name: l('Demande de preuves', 'Ask for evidence'), category: l('Modération', 'Moderation'), emoji: '📎',
      content: l('Bonjour {user}, peux-tu joindre une capture de ce qui s’est passé ? Sans preuve, on ne peut pas agir.', 'Hi {user}, can you attach a screenshot of what happened? Without evidence we cannot act.'),
      enabled: true, keywords: ['capture', 'preuve'], autoSendOnOpen: false, setTicketTypeId: null, addRoleId: null, removeRoleId: null,
      requestSatisfaction: false, closeTicket: false, usageCount: 42,
    },
    {
      id: 'mc-2', name: l('Conditions de partenariat', 'Partnership terms'), category: l('Partenariats', 'Partnerships'), emoji: '🤝',
      content: l('Merci {user} ! Nos partenariats demandent 300 membres actifs et une annonce croisée.', 'Thanks {user}! Our partnerships require 300 active members and a cross announcement.'),
      enabled: true, keywords: ['partenariat'], autoSendOnOpen: false, setTicketTypeId: 'partner', addRoleId: 'r-6', removeRoleId: null,
      requestSatisfaction: false, closeTicket: false, usageCount: 9,
    },
    {
      id: 'mc-3', name: l('Clôture standard', 'Standard closing'), category: null, emoji: '✅',
      content: l('Ta demande est traitée, {user}. Je ferme le ticket : n’hésite pas à en rouvrir un.', 'Your request is handled, {user}. Closing the ticket: feel free to open a new one.'),
      enabled: true, keywords: [], autoSendOnOpen: false, setTicketTypeId: null, addRoleId: null, removeRoleId: null,
      requestSatisfaction: true, closeTicket: true, usageCount: 118,
    },
  ];
}

// ── Liste noire ─────────────────────────────────────────────────────────────

export type DemoBlacklistEntry = {
  id: string;
  userId: string;
  username: string | null;
  avatarUrl: string | null;
  reason: L | null;
  addedByTag: string | null;
  expiresAt: string | null;
  allowReopen: boolean;
  createdAt: string;
};

export function buildBlacklist(): DemoBlacklistEntry[] {
  return [
    {
      id: 'bl-1', userId: MEMBERS.arkaAlt.userId, username: MEMBERS.arkaAlt.username, avatarUrl: MEMBERS.arkaAlt.avatarUrl,
      reason: l("Double compte d'Arka", "Arka's alt account"), addedByTag: STAFF.zenox.username, expiresAt: null, allowReopen: false, createdAt: ago(9 * DAY),
    },
    {
      id: 'bl-2', userId: MEMBERS.bastos.userId, username: MEMBERS.bastos.username, avatarUrl: MEMBERS.bastos.avatarUrl,
      reason: l('Spam de tickets', 'Ticket spam'), addedByTag: STAFF.kylian.username, expiresAt: ago(-5 * DAY), allowReopen: true, createdAt: ago(25 * DAY),
    },
  ];
}

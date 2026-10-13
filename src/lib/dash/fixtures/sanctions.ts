/**
 * Données de démo de l'écran Sanctions (historique, rapports, contestations).
 *
 * Tout part du casting partagé (`dash/cast.ts`) : les modérateurs sont l'équipe
 * (`STAFF`), les sanctionnés sont les membres (`MEMBERS`). Arka porte le fil
 * rouge : avertissement, exclusion, puis ban définitif avec son rapport et sa
 * contestation en attente, comme dans sa fiche membre.
 *
 * Les textes affichés (raisons, réponses au formulaire, notes) sont en
 * `{ fr, en }` ; l'écran choisit selon la langue. Formes reprises de
 * `lib/sanctions/filterSort.ts` et `pages/BanAppeals.svelte` (dépôt `Kotbo`).
 */
import { STAFF, MEMBERS, ago, HOUR, DAY, MIN, type CastMember } from '$lib/dash/cast';

export type L = { fr: string; en: string };

/** Sanction de démo : `Sanction` du dashboard, textes en deux langues. */
export type DemoSanction = {
  id: string;
  createdAt: string;
  type: string;
  targetTag: string;
  targetUserId: string;
  moderatorTag: string;
  moderatorUserId: string;
  durationSeconds: number | null;
  status: string;
  reason: L;
  archivedAt: string | null;
  archiveReason: L | null;
  appealable: boolean;
  appealLockReason: L | null;
};

export type DemoReport = {
  id: string;
  sanctionId: string;
  incidentAt: string;
  sanctionDurationLabel: string | null;
  /** Identifiants des articles du règlement (`DEMO_RULES`). */
  ruleIds: string[];
  detailedReason: L;
  evidenceLinks: string[];
  additionalNotes: L | null;
  createdByUserId: string;
  createdByTag: string;
};

export type DemoRule = { id: string; label: L; details: L; emoji: string | null };

export type AppealOutcome = 'PENDING' | 'UPHELD' | 'ARCHIVED' | 'DELETED' | 'LOCKED';

export type DemoAppealItem = {
  id: string;
  sanctionId: string | null;
  sanctionType: string;
  sanctionReason: L;
  sanctionCreatedAt: string;
  moderatorTag: string | null;
  memberStatement: L | null;
  outcome: AppealOutcome;
  outcomeNote: string | null;
  decidedByTag: string | null;
};

export type DemoAppealMessage = { author: 'staff' | 'member'; authorTag: string | null; content: L | string; createdAt: string };

export type DemoAppeal = {
  id: string;
  userId: string;
  userTag: string;
  avatarUrl: string;
  /** Réponses au formulaire, clé = question (`appeal_…`). */
  data: { key: L; value: L }[];
  status: string;
  banReason: L | null;
  decidedByTag: string | null;
  decisionReason: L | string | null;
  decidedAt: string | null;
  dmDelivered: boolean;
  createdAt: string;
  messages: DemoAppealMessage[];
  sanctions: DemoAppealItem[];
  previousAppeals: { id: string; status: string; createdAt: string }[];
};

export type DemoBlacklistEntry = { id: string; userId: string; reason: L; addedByTag: string; createdAt: string };

export type DemoTier = { level: number; action: string; durationSeconds: number | null; customReason: string };
export type DemoScale = { name: string; tiers: DemoTier[] };

/** La personne connectée : la fondatrice, administratrice du serveur. */
export const VIEWER: CastMember = STAFF.lena;

function sanction(
  id: string,
  target: CastMember,
  moderator: CastMember,
  type: string,
  minutesAgo: number,
  durationSeconds: number | null,
  status: string,
  reason: L,
  extra: Partial<DemoSanction> = {},
): DemoSanction {
  return {
    id,
    createdAt: ago(minutesAgo),
    type,
    targetTag: target.username,
    targetUserId: target.userId,
    moderatorTag: moderator.username,
    moderatorUserId: moderator.userId,
    durationSeconds,
    status,
    reason,
    archivedAt: null,
    archiveReason: null,
    appealable: true,
    appealLockReason: null,
    ...extra,
  };
}

// Même histoire que la fiche membre (`fixtures/members.ts`) et le ticket
// d'Arka (`fixtures/tickets.ts`) : sa troisième sanction, un avertissement pour pub.
export const ARKA_WARN_ID = 'demo-sanction-arka-warn';

const ARKA_ROW = sanction(ARKA_WARN_ID, MEMBERS.arka, STAFF.aiden, 'WARN', 2 * HOUR + 12 * MIN, null, 'ACTIVE', {
  fr: 'Pub pour un autre serveur dans #général',
  en: 'Advertised another server in #general',
});

/** Trié du plus récent au plus ancien, comme le tri par défaut de la page. */
export const DEMO_SANCTIONS: DemoSanction[] = [
  ARKA_ROW,
  sanction('demo-sanction-sacha-to', MEMBERS.sacha, STAFF.lena, 'TIMEOUT', 3 * HOUR, 3600, 'ACTIVE', {
    fr: 'Insultes répétées en vocal pendant la soirée jeux',
    en: 'Repeated insults in voice chat during game night',
  }),
  sanction('demo-sanction-pixel-warn', MEMBERS.pixel, STAFF.maelys, 'WARN', 4 * HOUR + 20 * MIN, null, 'ACTIVE', {
    fr: "Spam d'emojis dans #général",
    en: 'Emoji spam in #general',
  }),
  sanction('demo-sanction-bastos-kick', MEMBERS.bastos, STAFF.aiden, 'KICK', 1 * DAY + 6 * HOUR, null, 'RESOLVED', {
    fr: 'Provocations envers le staff dans #support',
    en: 'Baiting the staff in #support',
  }),
  sanction('demo-sanction-alt-tempban', MEMBERS.arkaAlt, STAFF.zenox, 'TEMP_BAN', 6 * DAY, 7 * 86400, 'ACTIVE', {
    fr: 'Double compte utilisé pendant l’exclusion d’Arka',
    en: 'Alt account used during Arka’s timeout',
  }),
  sanction('demo-sanction-tomtom-warn', MEMBERS.tomtom, STAFF.nora, 'WARN', 12 * DAY, null, 'RESOLVED', {
    fr: 'Lien hors sujet dans #annonces',
    en: 'Off-topic link in #announcements',
  }, {
    archivedAt: ago(10 * DAY),
    archiveReason: { fr: 'Appel accepté : lien posté par erreur', en: 'Appeal accepted: link posted by mistake' },
  }),
];

export const DEMO_RULES: DemoRule[] = [
  { id: 'rule-respect', emoji: null, label: { fr: 'Respect entre membres', en: 'Respect between members' }, details: { fr: 'Pas d’insulte, de provocation ni de harcèlement.', en: 'No insults, baiting or harassment.' } },
  { id: 'rule-spam', emoji: null, label: { fr: 'Spam et flood', en: 'Spam and flood' }, details: { fr: 'Pas de messages répétés, d’emojis en rafale ni de mentions abusives.', en: 'No repeated messages, emoji bursts or mass mentions.' } },
  { id: 'rule-pub', emoji: null, label: { fr: 'Publicité', en: 'Advertising' }, details: { fr: 'Aucune pub, ni sur le serveur ni en MP aux membres.', en: 'No advertising, on the server or in members’ DMs.' } },
  { id: 'rule-alt', emoji: '⛔', label: { fr: 'Doubles comptes', en: 'Alt accounts' }, details: { fr: 'Un compte par personne. Contourner une sanction mène au ban.', en: 'One account per person. Dodging a sanction leads to a ban.' } },
];

export const DEMO_REPORTS: DemoReport[] = [
  {
    id: 'demo-report-arka-warn',
    sanctionId: ARKA_WARN_ID,
    incidentAt: ago(2 * HOUR + 15 * MIN),
    sanctionDurationLabel: null,
    ruleIds: ['rule-pub'],
    detailedReason: {
      fr: 'Lien d’invitation posté dans #général avec « nitro gratuit ». Deux membres l’ont signalé en MP. Message supprimé par l’automod.',
      en: 'Invite link posted in #general with “free nitro”. Two members reported it by DM. Message removed by automod.',
    },
    evidenceLinks: ['https://example.com/preuve-1', 'https://example.com/preuve-2'],
    additionalNotes: { fr: 'Troisième sanction : prochaine étape, exclusion.', en: 'Third sanction: next step is a timeout.' },
    createdByUserId: STAFF.aiden.userId,
    createdByTag: STAFF.aiden.username,
  },
  {
    id: 'demo-report-bastos-kick',
    sanctionId: 'demo-sanction-bastos-kick',
    incidentAt: ago(1 * DAY + 6 * HOUR),
    sanctionDurationLabel: null,
    ruleIds: ['rule-respect'],
    detailedReason: {
      fr: 'Messages provocants envers deux modos dans #support, malgré un rappel en salon.',
      en: 'Baiting messages towards two mods in #support, despite a reminder in the channel.',
    },
    evidenceLinks: [],
    additionalNotes: null,
    createdByUserId: STAFF.aiden.userId,
    createdByTag: STAFF.aiden.username,
  },
];

/** Historique complet d'Arka, tel que la contestation le montre. */
export const ARKA_HISTORY = [
  { id: ARKA_WARN_ID, type: 'WARN', createdAt: ARKA_ROW.createdAt, moderatorTag: STAFF.aiden.username, reason: ARKA_ROW.reason },
  { id: 'demo-sanction-arka-to', type: 'TIMEOUT', createdAt: ago(9 * DAY), moderatorTag: STAFF.kylian.username, reason: { fr: 'Insultes envers un membre en vocal', en: 'Insulted a member in voice chat' } },
  { id: 'demo-sanction-arka-warn-1', type: 'WARN', createdAt: ago(24 * DAY), moderatorTag: STAFF.maelys.username, reason: { fr: 'Flood de GIF dans #memes', en: 'GIF flood in #memes' } },
];

export const DEMO_APPEALS: DemoAppeal[] = [
  {
    id: 'demo-appeal-arka',
    userId: MEMBERS.arka.userId,
    userTag: MEMBERS.arka.username,
    avatarUrl: MEMBERS.arka.avatarUrl,
    data: [
      {
        key: { fr: 'appeal_pourquoi_revenir', en: 'appeal_why_come_back' },
        value: {
          fr: "C'était le serveur d'un pote, pas de la pub. Je savais pas que c'était interdit de le partager.",
          en: "It was a friend's server, not an ad. I didn't know sharing it was against the rules.",
        },
      },
    ],
    status: 'PENDING',
    banReason: null,
    decidedByTag: null,
    decisionReason: null,
    decidedAt: null,
    dmDelivered: false,
    createdAt: ago(20 * HOUR),
    messages: [],
    sanctions: [
      {
        id: 'demo-item-arka-ban',
        sanctionId: ARKA_WARN_ID,
        sanctionType: 'WARN',
        sanctionReason: ARKA_ROW.reason,
        sanctionCreatedAt: ARKA_ROW.createdAt,
        moderatorTag: STAFF.aiden.username,
        memberStatement: { fr: 'Je reconnais les GIF, pas la pub.', en: 'I own up to the GIFs, not the ad.' },
        outcome: 'PENDING',
        outcomeNote: null,
        decidedByTag: null,
      },
    ],
    previousAppeals: [],
  },
  {
    id: 'demo-appeal-bastos',
    userId: MEMBERS.bastos.userId,
    userTag: MEMBERS.bastos.username,
    avatarUrl: MEMBERS.bastos.avatarUrl,
    data: [
      {
        key: { fr: 'appeal_ta_version', en: 'appeal_your_side' },
        value: { fr: "C'était du second degré, Aiden le sait.", en: 'It was a joke, Aiden knows it.' },
      },
    ],
    status: 'DENIED',
    banReason: null,
    decidedByTag: STAFF.kylian.username,
    decisionReason: { fr: 'Pas de réponse sur les excuses, le kick est maintenu.', en: 'No answer about the apology, the kick stands.' },
    decidedAt: ago(16 * HOUR),
    dmDelivered: false,
    createdAt: ago(22 * HOUR),
    messages: [
      { author: 'staff', authorTag: STAFF.kylian.username, content: { fr: "Tu t'excuses auprès des modos ?", en: 'Will you apologise to the mods?' }, createdAt: ago(20 * HOUR) },
    ],
    sanctions: [
      {
        id: 'demo-item-bastos-kick',
        sanctionId: 'demo-sanction-bastos-kick',
        sanctionType: 'KICK',
        sanctionReason: DEMO_SANCTIONS.find((x) => x.id === 'demo-sanction-bastos-kick')!.reason,
        sanctionCreatedAt: ago(1 * DAY + 6 * HOUR),
        moderatorTag: STAFF.aiden.username,
        memberStatement: null,
        outcome: 'UPHELD',
        outcomeNote: null,
        decidedByTag: STAFF.kylian.username,
      },
    ],
    previousAppeals: [],
  },
  {
    id: 'demo-appeal-tomtom',
    userId: MEMBERS.tomtom.userId,
    userTag: MEMBERS.tomtom.username,
    avatarUrl: MEMBERS.tomtom.avatarUrl,
    data: [
      {
        key: { fr: 'appeal_ta_version', en: 'appeal_your_side' },
        value: { fr: "Je pensais être dans #liens, j'ai supprimé direct.", en: 'I thought I was in #links, I deleted it right away.' },
      },
    ],
    status: 'ACCEPTED',
    banReason: null,
    decidedByTag: STAFF.zenox.username,
    decisionReason: { fr: 'Erreur de salon, message retiré tout de suite.', en: 'Wrong channel, message removed right away.' },
    decidedAt: ago(10 * DAY),
    dmDelivered: true,
    createdAt: ago(11 * DAY),
    messages: [],
    sanctions: [
      {
        id: 'demo-item-tomtom-warn',
        sanctionId: 'demo-sanction-tomtom-warn',
        sanctionType: 'WARN',
        sanctionReason: DEMO_SANCTIONS.find((x) => x.id === 'demo-sanction-tomtom-warn')!.reason,
        sanctionCreatedAt: ago(12 * DAY),
        moderatorTag: STAFF.nora.username,
        memberStatement: null,
        outcome: 'ARCHIVED',
        outcomeNote: null,
        decidedByTag: STAFF.zenox.username,
      },
    ],
    previousAppeals: [],
  },
];

export const DEMO_BLACKLIST: DemoBlacklistEntry[] = [
  {
    id: 'demo-bl-arka-alt',
    userId: MEMBERS.arkaAlt.userId,
    reason: { fr: "Double compte d'Arka, utilisé pour contourner une sanction", en: "Arka's alt account, used to dodge a sanction" },
    addedByTag: STAFF.zenox.username,
    createdAt: ago(6 * DAY),
  },
];

export const DEMO_ROLES = [
  { id: 'role-modo', name: 'Modo' },
  { id: 'role-staff', name: 'Staff' },
  { id: 'role-helper', name: 'Helper' },
];

export const DEMO_CHANNELS = [
  { id: 'chan-sanctions', name: 'sanctions-logs' },
  { id: 'chan-staff', name: 'staff' },
];

export const DEMO_SETTINGS = {
  moderatorRoleId: 'role-modo',
  sanctionAlertChannelId: 'chan-sanctions',
  propagateSanctions: false,
  sanctionReportEnabled: true,
  sanctionReportSkipBots: true,
  banAppealNotifyOnBanDM: true,
};

/** Les raisons des paliers sont du texte saisi par le staff : une version par langue. */
export const DEMO_SCALES: Record<'fr' | 'en', DemoScale[]> = {
  fr: [
    {
      name: 'Spam',
      tiers: [
        { level: 1, action: 'WARN', durationSeconds: null, customReason: 'Spam : premier rappel' },
        { level: 2, action: 'TIMEOUT', durationSeconds: 3600, customReason: 'Récidive Spam (tier T2)' },
        { level: 3, action: 'KICK', durationSeconds: null, customReason: 'Récidive Spam (tier T3)' },
      ],
    },
    {
      name: 'Insultes',
      tiers: [
        { level: 1, action: 'TIMEOUT', durationSeconds: 1800, customReason: 'Insultes envers un membre' },
        { level: 2, action: 'TEMP_BAN', durationSeconds: 7 * 86400, customReason: 'Récidive Insultes (tier T2)' },
      ],
    },
  ],
  en: [
    {
      name: 'Spam',
      tiers: [
        { level: 1, action: 'WARN', durationSeconds: null, customReason: 'Spam: first reminder' },
        { level: 2, action: 'TIMEOUT', durationSeconds: 3600, customReason: 'Repeat offense Spam (Tier T2)' },
        { level: 3, action: 'KICK', durationSeconds: null, customReason: 'Repeat offense Spam (Tier T3)' },
      ],
    },
    {
      name: 'Insults',
      tiers: [
        { level: 1, action: 'TIMEOUT', durationSeconds: 1800, customReason: 'Insulting a member' },
        { level: 2, action: 'TEMP_BAN', durationSeconds: 7 * 86400, customReason: 'Repeat offense Insults (Tier T2)' },
      ],
    },
  ],
};

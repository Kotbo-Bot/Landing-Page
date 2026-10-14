/**
 * Données de démo de la page Membres et du dossier membre.
 *
 * Tout part des personnages de `dash/cast.ts` : un dossier existe pour chacun,
 * parce que l'équipe, les sanctions et les tickets ouvrent aussi ce dossier.
 * Arka porte l'histoire la plus fournie (sanctions, double compte relié, notes) ;
 * les autres ont un dossier plus léger mais cohérent avec leur rôle.
 *
 * Les textes affichés sont écrits en `{ fr, en }` et résolus à la lecture,
 * dans la langue de la page. Les formes suivent `dash/types.ts`.
 */
import { CAST, GUILD, MEMBERS, NOW, STAFF, ago, castById, DAY, HOUR, type CastMember } from '$lib/dash/cast';
import type {
  DashboardRole,
  DashboardSanctionType,
  LinkedAccountItem,
  MemberCaseLogEntry,
  MemberCaseResponse,
  MemberSearchResult,
  SanctionItem,
  SanctionReportItem,
} from '$lib/dash/types';
import { getLocale, type Locale } from '$lib/i18n/state.svelte';

type L = { fr: string; en: string };

const pick = (text: L, locale: Locale) => text[locale];
const same = (text: string): L => ({ fr: text, en: text });

// ── Serveur : salons, rôles, règlement ──────────────────────────────────────

export const CHANNELS: Record<string, L> = {
  general: { fr: 'général', en: 'general' },
  memes: same('memes'),
  games: { fr: 'jeux', en: 'games' },
  clips: same('clips'),
  art: same('art'),
  music: { fr: 'musique', en: 'music' },
  help: { fr: 'aide', en: 'help' },
  staff: same('staff'),
  logs: same('staff-logs'),
};

const ROLES: Record<string, { name: L; color: string }> = {
  owner: { name: { fr: 'Fondatrice', en: 'Founder' }, color: '#f59e0b' },
  admin: { name: same('Admin'), color: '#ef4444' },
  mod: { name: { fr: 'Modération', en: 'Moderation' }, color: '#818cf8' },
  helper: { name: same('Helper'), color: '#22c55e' },
  trial: { name: { fr: 'Modo en test', en: 'Trial mod' }, color: '#38bdf8' },
  staff: { name: same('Staff'), color: '#a78bfa' },
  member: { name: { fr: 'Membre', en: 'Member' }, color: '#94a3b8' },
  gamer: { name: same('Gamer'), color: '#fb7185' },
  lvl20: { name: { fr: 'Niveau 20', en: 'Level 20' }, color: '#fbbf24' },
  lvl10: { name: { fr: 'Niveau 10', en: 'Level 10' }, color: '#fcd34d' },
  lvl5: { name: { fr: 'Niveau 5', en: 'Level 5' }, color: '#fde68a' },
  events: { name: { fr: 'Notifs events', en: 'Event pings' }, color: '#2dd4bf' },
  artist: { name: { fr: 'Artiste', en: 'Artist' }, color: '#f472b6' },
  music: { name: { fr: 'Mélomane', en: 'Music lover' }, color: '#c084fc' },
};

const PERMS: Record<string, L> = {
  send: { fr: 'Envoyer des messages', en: 'Send messages' },
  connect: { fr: 'Se connecter', en: 'Connect' },
  react: { fr: 'Ajouter des réactions', en: 'Add reactions' },
  attach: { fr: 'Joindre des fichiers', en: 'Attach files' },
  timeout: { fr: 'Exclure temporairement', en: 'Timeout members' },
  manageMessages: { fr: 'Gérer les messages', en: 'Manage messages' },
  kick: { fr: 'Expulser des membres', en: 'Kick members' },
  ban: { fr: 'Bannir des membres', en: 'Ban members' },
  admin: { fr: 'Administrateur', en: 'Administrator' },
};

/** Le règlement du serveur, tel que les rapports de sanction le citent. */
export type DemoRule = { id: string; label: string; details: string; icon: string };

const RULES: Array<{ id: string; label: L; details: L; icon: string }> = [
  { id: 'rule-1', label: { fr: 'Respect entre membres', en: 'Respect other members' }, details: { fr: 'Pas d’insulte, pas de provocation, pas de harcèlement.', en: 'No insults, no baiting, no harassment.' }, icon: 'flag' },
  { id: 'rule-2', label: { fr: 'Pas de spam ni de flood', en: 'No spam or flood' }, details: { fr: 'Un message à la fois, pas de mur de GIF.', en: 'One message at a time, no wall of GIFs.' }, icon: 'megaphone' },
  { id: 'rule-3', label: { fr: 'Pas de pub', en: 'No advertising' }, details: { fr: 'Ni dans les salons ni en MP aux membres.', en: 'Neither in channels nor in DMs to members.' }, icon: 'megaphone' },
  { id: 'rule-4', label: { fr: 'Un seul compte par personne', en: 'One account per person' }, details: { fr: 'Un double compte pour contourner une sanction vaut un ban.', en: 'An alt used to dodge a sanction means a ban.' }, icon: 'lock' },
];

export function demoRules(locale: Locale = getLocale()): DemoRule[] {
  return RULES.map((r) => ({ id: r.id, label: pick(r.label, locale), details: pick(r.details, locale), icon: r.icon }));
}

// ── Profils ─────────────────────────────────────────────────────────────────

type Persona = {
  presence: 'online' | 'idle' | 'dnd' | 'offline' | 'left';
  joinedDays: number;
  accountDays: number;
  lastSeenMin: number;
  messages: number;
  voiceHours: number;
  /** Messages par jour en moyenne, pour la courbe d'activité. */
  pace: number;
  roles: string[];
  perms: string[];
  channels: Array<[string, number]>;
  inviter: string | null;
  inviteCode: string | null;
  pronouns?: L;
  locale: string;
  grade?: L;
  tutor?: boolean;
  /** Parti du serveur il y a N minutes. */
  leftMin?: number;
  bannerSeed?: number;
};

const BASE_PERMS = ['send', 'connect', 'react', 'attach'];

// Anciennetés choisies pour que « 2 ans, 4 mois » ne passe pas sur deux lignes
// en anglais (« 2 years, 4 months ») dans les chiffres du Résumé : années pleines
// plus quinze jours, ou moins de dix mois au-delà d'un an.
const PERSONAS: Record<string, Persona> = {
  [STAFF.lena.userId]: { presence: 'online', joinedDays: 1475, accountDays: 2935, lastSeenMin: 4, messages: 18240, voiceHours: 912, pace: 14, roles: ['owner', 'staff', 'lvl20', 'events'], perms: ['admin', 'ban', 'kick', 'manageMessages'], channels: [['staff', 5210], ['general', 4980], ['help', 1320]], inviter: null, inviteCode: null, pronouns: { fr: 'elle', en: 'she/her' }, locale: 'fr', grade: { fr: 'Fondatrice', en: 'Founder' } },
  [STAFF.zenox.userId]: { presence: 'dnd', joinedDays: 1110, accountDays: 2570, lastSeenMin: 35, messages: 11420, voiceHours: 640, pace: 9, roles: ['admin', 'staff', 'lvl20', 'gamer'], perms: ['admin', 'ban', 'kick', 'manageMessages'], channels: [['staff', 3890], ['games', 2950], ['general', 2410]], inviter: STAFF.lena.userId, inviteCode: 'lerepaire', locale: 'fr', grade: { fr: 'Administrateur', en: 'Administrator' } },
  [STAFF.aiden.userId]: { presence: 'online', joinedDays: 745, accountDays: 1475, lastSeenMin: 1, messages: 9310, voiceHours: 402, pace: 11, roles: ['mod', 'staff', 'lvl20', 'gamer'], perms: ['ban', 'kick', 'timeout', 'manageMessages'], channels: [['general', 4120], ['staff', 2240], ['help', 980]], inviter: STAFF.zenox.userId, inviteCode: 'lerepaire', pronouns: { fr: 'il', en: 'he/him' }, locale: 'fr', grade: { fr: 'Modérateur', en: 'Moderator' }, tutor: true },
  [STAFF.kylian.userId]: { presence: 'idle', joinedDays: 575, accountDays: 1110, lastSeenMin: 52, messages: 6020, voiceHours: 515, pace: 8, roles: ['mod', 'staff', 'lvl20'], perms: ['kick', 'timeout', 'manageMessages'], channels: [['games', 2310], ['general', 1980], ['staff', 1120]], inviter: STAFF.aiden.userId, inviteCode: 'k7Hq2Lm', locale: 'fr', grade: { fr: 'Modérateur', en: 'Moderator' } },
  [STAFF.maelys.userId]: { presence: 'online', joinedDays: 330, accountDays: 745, lastSeenMin: 8, messages: 4230, voiceHours: 120, pace: 10, roles: ['helper', 'staff', 'lvl10', 'artist'], perms: ['timeout', 'manageMessages'], channels: [['help', 1890], ['art', 1210], ['general', 830]], inviter: STAFF.lena.userId, inviteCode: 'lerepaire', pronouns: { fr: 'elle', en: 'she/her' }, locale: 'fr', grade: same('Helper') },
  [STAFF.nora.userId]: { presence: 'online', joinedDays: 190, accountDays: 605, lastSeenMin: 3, messages: 1870, voiceHours: 64, pace: 9, roles: ['trial', 'staff', 'lvl10', 'music'], perms: ['timeout'], channels: [['general', 920], ['music', 610], ['help', 240]], inviter: STAFF.maelys.userId, inviteCode: 'lerepaire', pronouns: { fr: 'elle', en: 'she/her' }, locale: 'en-GB', grade: { fr: 'Modo en test', en: 'Trial moderator' } },

  [MEMBERS.arka.userId]: { presence: 'online', joinedDays: 425, accountDays: 745, lastSeenMin: 2, messages: 1544, voiceHours: 87, pace: 6, roles: ['member', 'gamer', 'lvl20', 'events'], perms: BASE_PERMS, channels: [['general', 812], ['memes', 344], ['games', 301], ['clips', 87]], inviter: MEMBERS.bastos.userId, inviteCode: 'k7Hq2Lm', pronouns: { fr: 'il', en: 'he/him' }, locale: 'fr', bannerSeed: 1 },
  [MEMBERS.sacha.userId]: { presence: 'idle', joinedDays: 280, accountDays: 1110, lastSeenMin: 47, messages: 2210, voiceHours: 140, pace: 7, roles: ['member', 'lvl10', 'music'], perms: BASE_PERMS, channels: [['music', 1240], ['general', 760], ['memes', 210]], inviter: STAFF.nora.userId, inviteCode: 'lerepaire', pronouns: { fr: 'iel', en: 'they/them' }, locale: 'fr' },
  [MEMBERS.bastos.userId]: { presence: 'dnd', joinedDays: 540, accountDays: 1840, lastSeenMin: 180, messages: 3480, voiceHours: 310, pace: 8, roles: ['member', 'gamer', 'lvl20'], perms: BASE_PERMS, channels: [['games', 1820], ['general', 1210], ['clips', 450]], inviter: STAFF.kylian.userId, inviteCode: 'lerepaire', locale: 'fr' },
  [MEMBERS.pixel.userId]: { presence: 'offline', joinedDays: 210, accountDays: 745, lastSeenMin: 26 * 60, messages: 980, voiceHours: 12, pace: 4, roles: ['member', 'artist', 'lvl5'], perms: BASE_PERMS, channels: [['art', 640], ['general', 280], ['help', 60]], inviter: STAFF.maelys.userId, inviteCode: 'lerepaire', locale: 'en-GB' },
  [MEMBERS.tomtom.userId]: { presence: 'online', joinedDays: 64, accountDays: 230, lastSeenMin: 6, messages: 1310, voiceHours: 45, pace: 12, roles: ['member', 'gamer', 'lvl5'], perms: BASE_PERMS, channels: [['memes', 690], ['general', 480], ['games', 140]], inviter: MEMBERS.arka.userId, inviteCode: 'k7Hq2Lm', locale: 'fr' },
  [MEMBERS.yuna.userId]: { presence: 'idle', joinedDays: 150, accountDays: 1475, lastSeenMin: 95, messages: 1720, voiceHours: 230, pace: 6, roles: ['member', 'music', 'lvl10'], perms: BASE_PERMS, channels: [['music', 880], ['general', 620], ['art', 220]], inviter: MEMBERS.sacha.userId, inviteCode: 'lerepaire', pronouns: { fr: 'elle', en: 'she/her' }, locale: 'fr' },
  [MEMBERS.arkaAlt.userId]: { presence: 'left', joinedDays: 12, accountDays: 15, lastSeenMin: 6 * DAY, messages: 41, voiceHours: 0, pace: 6, roles: ['member'], perms: BASE_PERMS, channels: [['general', 33], ['games', 8]], inviter: MEMBERS.tomtom.userId, inviteCode: 'k7Hq2Lm', locale: 'fr', leftMin: 6 * DAY },
};

function persona(userId: string): Persona {
  return PERSONAS[userId] ?? PERSONAS[MEMBERS.pixel.userId]!;
}

// ── Sanctions et rapports ───────────────────────────────────────────────────

type SanctionSeed = {
  id: string;
  target: CastMember;
  type: DashboardSanctionType;
  active: boolean;
  by: CastMember;
  minutesAgo: number;
  duration: number | null;
  reason: L;
  report?: { rules: string[]; detailed: L; notes?: L; durationLabel?: L; evidence: number };
};

const SANCTIONS: SanctionSeed[] = [
  {
    id: 'sanc-arka-3', target: MEMBERS.arka, type: 'WARN', active: true, by: STAFF.aiden, minutesAgo: 2 * HOUR + 12, duration: null,
    reason: { fr: 'Pub pour un autre serveur dans #général', en: 'Advertised another server in #general' },
    report: { rules: ['rule-3'], detailed: { fr: 'Lien d’invitation posté dans #général avec « nitro gratuit ». Deux membres l’ont signalé en MP. Message supprimé par l’automod.', en: 'Invite link posted in #general with “free nitro”. Two members reported it by DM. Message removed by automod.' }, evidence: 2 },
  },
  {
    id: 'sanc-arka-2', target: MEMBERS.arka, type: 'TIMEOUT', active: false, by: STAFF.kylian, minutesAgo: 9 * DAY, duration: 3600,
    reason: { fr: 'Insultes envers un membre en vocal', en: 'Insulted a member in voice chat' },
    report: { rules: ['rule-1'], detailed: { fr: 'Partie classée qui tourne mal, insultes répétées envers Bastos dans le vocal Jeux. Calmé après l’exclusion.', en: 'Ranked game gone wrong, repeated insults at Bastos in the Games voice channel. Calmed down after the timeout.' }, notes: { fr: 'S’est excusé le lendemain dans #général.', en: 'Apologised the next day in #general.' }, durationLabel: { fr: '1 h', en: '1 h' }, evidence: 1 },
  },
  {
    id: 'sanc-arka-1', target: MEMBERS.arka, type: 'WARN', active: false, by: STAFF.maelys, minutesAgo: 24 * DAY, duration: null,
    reason: { fr: 'Flood de GIF dans #memes', en: 'GIF flood in #memes' },
  },
  {
    id: 'sanc-alt-1', target: MEMBERS.arkaAlt, type: 'TEMP_BAN', active: true, by: STAFF.zenox, minutesAgo: 6 * DAY, duration: 7 * 86400,
    reason: { fr: 'Double compte utilisé pendant l’exclusion d’Arka', en: 'Alt account used during Arka’s timeout' },
    report: { rules: ['rule-4'], detailed: { fr: 'Compte créé 3 jours avant, même invitation qu’Arka, a parlé dans #général pendant son exclusion. Lien validé à la main.', en: 'Account created 3 days earlier, same invite as Arka, chatted in #general during his timeout. Link confirmed by hand.' }, durationLabel: { fr: '7 jours', en: '7 days' }, evidence: 2 },
  },
  {
    id: 'sanc-bastos-2', target: MEMBERS.bastos, type: 'TIMEOUT', active: false, by: STAFF.aiden, minutesAgo: 9 * DAY, duration: 1800,
    reason: { fr: 'A répondu aux insultes en vocal', en: 'Answered the insults in voice chat' },
  },
  {
    id: 'sanc-bastos-1', target: MEMBERS.bastos, type: 'WARN', active: false, by: STAFF.kylian, minutesAgo: 70 * DAY, duration: null,
    reason: { fr: 'Spoiler sans balise dans #jeux', en: 'Untagged spoiler in #games' },
  },
  {
    id: 'sanc-sacha-1', target: MEMBERS.sacha, type: 'WARN', active: false, by: STAFF.maelys, minutesAgo: 40 * DAY, duration: null,
    reason: { fr: 'Lien piraté partagé dans #musique', en: 'Shared a pirated link in #music' },
  },
  // Les lignes suivantes reprennent l'historique de l'écran Sanctions (`fixtures/sanctions.ts`).
  {
    id: 'sanc-sacha-2', target: MEMBERS.sacha, type: 'TIMEOUT', active: true, by: STAFF.lena, minutesAgo: 3 * HOUR, duration: 3600,
    reason: { fr: 'Insultes répétées en vocal pendant la soirée jeux', en: 'Repeated insults in voice chat during game night' },
  },
  {
    id: 'sanc-pixel-1', target: MEMBERS.pixel, type: 'WARN', active: true, by: STAFF.maelys, minutesAgo: 4 * HOUR + 20, duration: null,
    reason: { fr: "Spam d'emojis dans #général", en: 'Emoji spam in #general' },
  },
  {
    id: 'sanc-bastos-3', target: MEMBERS.bastos, type: 'KICK', active: false, by: STAFF.aiden, minutesAgo: 30 * HOUR, duration: null,
    reason: { fr: 'Provocations envers le staff dans #support', en: 'Baiting the staff in #support' },
  },
  {
    id: 'sanc-tomtom-1', target: MEMBERS.tomtom, type: 'WARN', active: false, by: STAFF.nora, minutesAgo: 12 * DAY, duration: null,
    reason: { fr: 'Lien hors sujet dans #annonces', en: 'Off-topic link in #announcements' },
  },
];

function toSanction(seed: SanctionSeed, locale: Locale): SanctionItem {
  const createdAt = ago(seed.minutesAgo);
  const ends = seed.duration ? new Date(Date.parse(createdAt) + seed.duration * 1000).toISOString() : null;
  return {
    id: seed.id,
    type: seed.type,
    status: seed.active ? 'ACTIVE' : 'RESOLVED',
    targetUserId: seed.target.userId,
    targetTag: seed.target.username,
    moderatorUserId: seed.by.userId,
    moderatorTag: seed.by.username,
    reason: pick(seed.reason, locale),
    durationSeconds: seed.duration,
    expiresAt: ends,
    createdAt,
    resolvedAt: seed.active ? null : ends ?? createdAt,
    resolutionNote: null,
    archivedAt: null,
    archiveReason: null,
    appealable: true,
    appealLockReason: null,
  };
}

function toReport(seed: SanctionSeed, locale: Locale): SanctionReportItem | null {
  if (!seed.report) return null;
  const rules = demoRules(locale).filter((r) => seed.report!.rules.includes(r.id));
  return {
    id: `report-${seed.id}`,
    sanctionId: seed.id,
    staffPseudo: seed.by.displayName,
    incidentAt: ago(seed.minutesAgo + 6),
    memberPseudo: seed.target.displayName,
    memberReference: seed.target.userId,
    sanctionType: seed.type,
    sanctionDurationLabel: seed.report.durationLabel ? pick(seed.report.durationLabel, locale) : null,
    brokenRules: JSON.stringify(rules.map((r) => ({ id: r.id, title: r.label, description: r.details }))),
    detailedReason: pick(seed.report.detailed, locale),
    // Pas de vraie capture : des emplacements numérotés, sans lien sortant.
    evidenceLinks: Array.from({ length: seed.report.evidence }, (_, i) => `demo-evidence-${seed.id}-${i + 1}`),
    additionalNotes: seed.report.notes ? pick(seed.report.notes, locale) : null,
    createdByUserId: seed.by.userId,
    createdByTag: seed.by.username,
    createdAt: ago(seed.minutesAgo - 4),
  };
}

// ── Messages, journaux, notes ───────────────────────────────────────────────

/** Un message trouvé par la recherche de l'onglet Messages. */
export type DemoMessage = {
  id: string;
  channelId: string;
  channelName: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
  hasAttachment: boolean;
  attachments: Array<{ name: string; contentType: string }>;
};

type MessageSeed = { channel: string; text: L; min: number; edited?: number; deleted?: number; file?: string };

const MESSAGES: Record<string, MessageSeed[]> = {
  [MEMBERS.arka.userId]: [
    { channel: 'general', text: { fr: 'qqn chaud pour une ranked ce soir ? il me faut 2 mates', en: 'anyone up for ranked tonight? need 2 mates' }, min: 12 },
    { channel: 'memes', text: { fr: 'ce clip mdr, je le regarde en boucle', en: 'this clip lol, been watching it on loop' }, min: 64, edited: 60 },
    { channel: 'general', text: { fr: 'rejoignez mon serv, nitro gratuit pour les 50 premiers', en: 'join my server, free nitro for the first 50' }, min: 2 * HOUR + 20, deleted: 2 * HOUR + 19 },
    { channel: 'games', text: { fr: 'le patch a encore cassé le matchmaking, 12 min de file', en: 'the patch broke matchmaking again, 12 min queue' }, min: DAY + 3 * HOUR },
    { channel: 'clips', text: same(''), min: 3 * DAY, file: 'clutch_1v3.mp4' },
  ],
  [MEMBERS.arkaAlt.userId]: [
    { channel: 'general', text: { fr: 'c’est bon je suis plus mute', en: 'ok i’m not muted anymore' }, min: 6 * DAY + 40 },
    { channel: 'games', text: { fr: 'qqn pour une game ?', en: 'anyone for a game?' }, min: 6 * DAY + 90 },
  ],
  [MEMBERS.sacha.userId]: [
    { channel: 'music', text: { fr: 'nouvelle playlist lo-fi pour bosser, dites-moi', en: 'new lo-fi playlist for studying, let me know' }, min: 50 },
    { channel: 'general', text: { fr: 'bonne nuit les gens', en: 'good night everyone' }, min: 15 * HOUR },
  ],
  [MEMBERS.bastos.userId]: [
    { channel: 'games', text: { fr: 'tournoi samedi, inscriptions dans #events', en: 'tournament on Saturday, sign up in #events' }, min: 3 * HOUR },
    { channel: 'general', text: { fr: 'gg à tous pour hier soir', en: 'gg everyone for last night' }, min: DAY },
  ],
  [MEMBERS.pixel.userId]: [
    { channel: 'art', text: { fr: 'fan art du serveur terminé, je poste la HD demain', en: 'server fan art done, posting the HD tomorrow' }, min: 26 * 60 + 10 },
  ],
  [MEMBERS.tomtom.userId]: [
    { channel: 'memes', text: { fr: '@everyone regardez ça', en: '@everyone look at this' }, min: 5 * HOUR + 3, deleted: 5 * HOUR + 2 },
    { channel: 'general', text: { fr: 'dsl pour les mentions, j’avais pas vu la règle', en: 'sorry for the pings, didn’t see the rule' }, min: 4 * HOUR },
  ],
  [MEMBERS.yuna.userId]: [
    { channel: 'music', text: { fr: 'session écoute ce soir 21h en vocal', en: 'listening session tonight 9pm in voice' }, min: 100 },
  ],
  [STAFF.lena.userId]: [
    { channel: 'staff', text: { fr: 'réunion staff dimanche 20h, ordre du jour dans le doc', en: 'staff meeting Sunday 8pm, agenda in the doc' }, min: 30 },
    { channel: 'general', text: { fr: 'merci à tous pour les 4 800, vous êtes fous', en: 'thanks everyone for 4,800, you’re crazy' }, min: DAY + 2 * HOUR },
  ],
  [STAFF.zenox.userId]: [
    { channel: 'staff', text: { fr: 'j’ai lié arka_backup à Arka, preuves dans le rapport', en: 'linked arka_backup to Arka, proof in the report' }, min: 6 * DAY + 10 },
  ],
  [STAFF.aiden.userId]: [
    { channel: 'staff', text: { fr: 'warn posé sur Arka pour la pub, rapport fait', en: 'warned Arka for the ad, report done' }, min: 2 * HOUR },
    { channel: 'help', text: { fr: 'regarde le salon #règles, tout y est', en: 'check the #rules channel, it’s all there' }, min: 7 * HOUR },
  ],
  [STAFF.kylian.userId]: [
    { channel: 'games', text: { fr: 'qui vient en vocal ?', en: 'who’s joining voice?' }, min: 60 },
  ],
  [STAFF.maelys.userId]: [
    { channel: 'help', text: { fr: 'pour changer ta couleur, c’est /couleur dans #bots', en: 'to change your colour, use /colour in #bots' }, min: 15 },
  ],
  [STAFF.nora.userId]: [
    { channel: 'staff', text: { fr: 'premier warn posé, je relis le rapport avec Aiden ?', en: 'first warn done, can I review the report with Aiden?' }, min: 4 * HOUR + 50 },
    { channel: 'general', text: { fr: 'bienvenue aux nouveaux', en: 'welcome to the newcomers' }, min: 9 * HOUR },
  ],
};

export function memberMessagesFor(userId: string, locale: Locale = getLocale()): DemoMessage[] {
  return (MESSAGES[userId] ?? []).map((seed, i) => ({
    id: `${userId}-msg-${i}`,
    channelId: seed.channel,
    channelName: pick(CHANNELS[seed.channel] ?? same(seed.channel), locale),
    content: pick(seed.text, locale),
    createdAt: ago(seed.min),
    editedAt: seed.edited !== undefined ? ago(seed.edited) : null,
    deletedAt: seed.deleted !== undefined ? ago(seed.deleted) : null,
    hasAttachment: !!seed.file,
    attachments: seed.file ? [{ name: seed.file, contentType: 'video/mp4' }] : [],
  }));
}

type LogSeed = { action: L; module: L; source: 'dashboard' | 'discord'; details?: L; channel?: string; min: number };

const MODULE: Record<string, L> = {
  automod: same('Automod'),
  members: { fr: 'Membres', en: 'Members' },
  voice: { fr: 'Vocal', en: 'Voice' },
  sanctions: same('Sanctions'),
  roles: { fr: 'Rôles', en: 'Roles' },
  staff: same('Staff'),
};

const LOGS: Record<string, LogSeed[]> = {
  [MEMBERS.arka.userId]: [
    { action: { fr: 'Message supprimé par l’automod', en: 'Message removed by automod' }, module: MODULE.automod, source: 'discord', details: { fr: 'rejoignez mon serv, nitro gratuit pour les 50 premiers', en: 'join my server, free nitro for the first 50' }, channel: 'general', min: 2 * HOUR + 19 },
    { action: { fr: 'Avertissement reçu', en: 'Warning received' }, module: MODULE.sanctions, source: 'dashboard', min: 2 * HOUR + 12 },
    { action: { fr: 'A rejoint le vocal Jeux', en: 'Joined the Games voice channel' }, module: MODULE.voice, source: 'discord', min: DAY + 5 * HOUR },
    { action: { fr: 'Exclusion temporaire (1 h)', en: 'Timed out (1 h)' }, module: MODULE.sanctions, source: 'discord', min: 9 * DAY },
    { action: { fr: 'Rôle ajouté : Niveau 20', en: 'Role added: Level 20' }, module: MODULE.roles, source: 'discord', min: 30 * DAY },
  ],
  [MEMBERS.arkaAlt.userId]: [
    { action: { fr: 'A quitté le serveur', en: 'Left the server' }, module: MODULE.members, source: 'discord', min: 6 * DAY },
    { action: { fr: 'Compte lié à @arka_77', en: 'Account linked to @arka_77' }, module: MODULE.members, source: 'dashboard', min: 6 * DAY + 5 },
    { action: { fr: 'Arrivée, compte de 3 jours', en: 'Joined, account 3 days old' }, module: MODULE.members, source: 'discord', min: 12 * DAY },
  ],
  [MEMBERS.tomtom.userId]: [
    { action: { fr: 'Message supprimé par l’automod', en: 'Message removed by automod' }, module: MODULE.automod, source: 'discord', details: { fr: '@everyone regardez ça', en: '@everyone look at this' }, channel: 'memes', min: 5 * HOUR + 2 },
  ],
  [STAFF.aiden.userId]: [
    { action: { fr: 'A averti @arka_77', en: 'Warned @arka_77' }, module: MODULE.sanctions, source: 'dashboard', details: { fr: 'Pub pour un autre serveur dans #général', en: 'Advertised another server in #general' }, min: 2 * HOUR + 12 },
    { action: { fr: 'Rapport de sanction rédigé', en: 'Sanction report written' }, module: MODULE.sanctions, source: 'dashboard', min: 2 * HOUR + 8 },
    { action: { fr: 'Ticket #412 fermé', en: 'Ticket #412 closed' }, module: MODULE.staff, source: 'discord', min: 7 * HOUR },
  ],
  [STAFF.kylian.userId]: [
    { action: { fr: 'A exclu @arka_77 pour 1 h', en: 'Timed out @arka_77 for 1 h' }, module: MODULE.sanctions, source: 'discord', min: 9 * DAY },
    { action: { fr: 'A rejoint le vocal Jeux', en: 'Joined the Games voice channel' }, module: MODULE.voice, source: 'discord', min: 60 },
  ],
  [STAFF.zenox.userId]: [
    { action: { fr: 'A banni @arka_backup pour 7 jours', en: 'Banned @arka_backup for 7 days' }, module: MODULE.sanctions, source: 'dashboard', min: 6 * DAY },
    { action: { fr: 'Comptes liés : arka_77 et arka_backup', en: 'Accounts linked: arka_77 and arka_backup' }, module: MODULE.members, source: 'dashboard', min: 6 * DAY + 5 },
  ],
  [STAFF.nora.userId]: [
    { action: { fr: 'A averti @tomtom_fr', en: 'Warned @tomtom_fr' }, module: MODULE.sanctions, source: 'dashboard', min: 12 * DAY },
    { action: { fr: 'Rôle ajouté : Modo en test', en: 'Role added: Trial mod' }, module: MODULE.roles, source: 'dashboard', min: 21 * DAY },
  ],
  [STAFF.maelys.userId]: [
    { action: { fr: 'Ticket #418 pris en charge', en: 'Ticket #418 claimed' }, module: MODULE.staff, source: 'discord', min: 20 },
  ],
  [STAFF.lena.userId]: [
    { action: { fr: 'Grade modifié : Nora passe Modo en test', en: 'Grade changed: Nora is now Trial mod' }, module: MODULE.staff, source: 'dashboard', min: 21 * DAY },
  ],
};

function defaultLogs(p: Persona): LogSeed[] {
  return [
    { action: { fr: 'A rejoint le vocal', en: 'Joined voice' }, module: MODULE.voice, source: 'discord', min: p.lastSeenMin + 90 },
    { action: { fr: 'Rôle ajouté', en: 'Role added' }, module: MODULE.roles, source: 'discord', min: 18 * DAY },
  ];
}

const NOTES: Record<string, L> = {
  [MEMBERS.arka.userId]: {
    fr: 'Actif et sympa la plupart du temps, part vite en vrille en ranked.\nDouble compte arka_backup relié le mois dernier (voir Comptes liés).\nProchain écart : exclusion 24 h, pas de warn de plus.',
    en: 'Active and friendly most of the time, loses it fast in ranked.\nAlt account arka_backup linked last month (see Linked accounts).\nNext slip: 24 h timeout, no more warns.',
  },
  [MEMBERS.tomtom.userId]: { fr: 'Arrivé via l’invitation d’Arka. À surveiller sans plus.', en: 'Joined through Arka’s invite. Keep an eye out, nothing more.' },
  [STAFF.nora.userId]: { fr: 'Période de test jusqu’à fin du mois. Tutorée par Aiden.', en: 'Trial period until the end of the month. Mentored by Aiden.' },
};

// ── Liens entre comptes, interactions, connexions ───────────────────────────

const LINKS: Record<string, CastMember> = {
  [MEMBERS.arka.userId]: MEMBERS.arkaAlt,
  [MEMBERS.arkaAlt.userId]: MEMBERS.arka,
};

const CONTACTS: Record<string, Array<[CastMember, number, number, number]>> = {
  // [contact, mentions, réponses, réactions]
  [MEMBERS.arka.userId]: [
    [MEMBERS.tomtom, 34, 21, 40],
    [MEMBERS.bastos, 22, 30, 18],
    [MEMBERS.sacha, 8, 12, 25],
    [MEMBERS.yuna, 5, 6, 14],
    [STAFF.kylian, 4, 9, 3],
    [MEMBERS.arkaAlt, 6, 2, 0],
  ],
};

function contactsFor(userId: string): Array<[CastMember, number, number, number]> {
  if (CONTACTS[userId]) return CONTACTS[userId]!;
  // Les autres : quelques voisins stables, tirés de l'ordre du casting.
  const others = CAST.filter((m) => m.userId !== userId && m.userId !== MEMBERS.arkaAlt.userId);
  const start = seedOf(userId) % others.length;
  return [0, 1, 2, 3].map((k) => {
    const contact = others[(start + k * 3) % others.length]!;
    return [contact, 4 + ((seedOf(userId + k) % 20)), 2 + (seedOf(contact.userId) % 15), 3 + (seedOf(userId + contact.userId) % 25)];
  });
}

const CONNECTIONS: Record<string, Array<{ name: string; type: string }>> = {
  [MEMBERS.arka.userId]: [
    { name: 'arka77', type: 'steam' },
    { name: 'arka_live', type: 'twitch' },
    { name: 'Arka', type: 'spotify' },
  ],
  [MEMBERS.bastos.userId]: [{ name: 'bastos_off', type: 'steam' }],
  [MEMBERS.pixel.userId]: [{ name: 'pixel.ink', type: 'instagram' }],
  [STAFF.zenox.userId]: [{ name: 'zenox', type: 'github' }, { name: 'zenox', type: 'steam' }],
  [MEMBERS.sacha.userId]: [{ name: 'sacha.wav', type: 'spotify' }],
};

const CANDIDATURES: Record<string, Array<{ minutesAgo: number; status: string; notes: L; oral: L | null }>> = {
  [STAFF.nora.userId]: [{ minutesAgo: 24 * DAY, status: 'APPROVED', notes: { fr: 'Très présente en #aide, calme face aux conflits. Oral convaincant.', en: 'Very present in #help, calm in conflicts. Convincing interview.' }, oral: { fr: 'Validé 4/5', en: 'Passed 4/5' } }],
  [STAFF.maelys.userId]: [{ minutesAgo: 200 * DAY, status: 'APPROVED', notes: { fr: 'Recrutée comme helper pour #aide et #art.', en: 'Recruited as helper for #help and #art.' }, oral: { fr: 'Validé 5/5', en: 'Passed 5/5' } }],
  [STAFF.kylian.userId]: [{ minutesAgo: 400 * DAY, status: 'APPROVED', notes: { fr: 'Ancien modo d’un serveur de jeu, connaît les sanctions.', en: 'Former mod on a gaming server, knows sanctions.' }, oral: { fr: 'Validé 4/5', en: 'Passed 4/5' } }],
  [STAFF.aiden.userId]: [{ minutesAgo: 700 * DAY, status: 'APPROVED', notes: { fr: 'Premier modo recruté hors fondateurs.', en: 'First mod recruited outside the founders.' }, oral: null }],
  [MEMBERS.bastos.userId]: [{ minutesAgo: 90 * DAY, status: 'REJECTED', notes: { fr: 'Trop récent sur le serveur à l’époque. Peut repostuler.', en: 'Too new on the server back then. May reapply.' }, oral: null }],
};

// ── Petites aides ───────────────────────────────────────────────────────────

/** Graine stable (FNV-1a) : les courbes d'un membre ne changent pas d'un rendu à l'autre. */
function seedOf(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function noise(seed: number, i: number): number {
  const x = Math.sin(seed * 0.0001 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function role(id: string, locale: Locale): DashboardRole {
  const r = ROLES[id]!;
  return { id: `role-${id}`, name: pick(r.name, locale), mention: `<@&role-${id}>`, permissions: [], color: r.color };
}

// ── Le dossier ──────────────────────────────────────────────────────────────

/**
 * Dossier complet d'un personnage, dans la langue demandée. `null` pour un
 * identifiant hors casting : le dossier affiche alors son état vide.
 */
export function memberCaseFor(userId: string | null | undefined, locale: Locale = getLocale()): MemberCaseResponse | null {
  if (!userId) return null;
  const who = castById(userId);
  if (!who) return null;
  const p = persona(userId);

  const seeds = SANCTIONS.filter((s) => s.target.userId === userId);
  const sanctions = seeds.map((s) => toSanction(s, locale));
  const sanctionReports = seeds.map((s) => toReport(s, locale)).filter((r): r is SanctionReportItem => r !== null);

  const logs: MemberCaseLogEntry[] = (LOGS[userId] ?? defaultLogs(p)).map((log, i) => ({
    id: `${userId}-log-${i}`,
    user: who.username,
    action: pick(log.action, locale),
    context: '',
    module: pick(log.module, locale),
    eventType: 'event',
    source: log.source,
    details: log.details ? pick(log.details, locale) : '',
    dateIso: ago(log.min),
    channelId: log.channel ?? null,
  }));

  const messages = memberMessagesFor(userId, locale);
  const messagesByChannel = p.channels.map(([channelId, count]) => ({
    channelId,
    channelName: pick(CHANNELS[channelId] ?? same(channelId), locale),
    count,
    lastMessageAt: messages.find((m) => m.channelId === channelId)?.createdAt ?? null,
    recentMessages: messages
      .filter((m) => m.channelId === channelId && !m.deletedAt)
      .map((m) => ({ id: m.id, channelId, channelName: m.channelName, content: m.content, dateIso: m.createdAt })),
  }));

  const linked = LINKS[userId];
  const linkedAccounts: LinkedAccountItem[] = linked
    ? [{ userId: linked.userId, userTag: linked.username, avatarUrl: linked.avatarUrl, type: 'MANUAL', status: 'VALIDATED' }]
    : [];

  const contacts = contactsFor(userId);
  const inviter = p.inviter ? castById(p.inviter) : undefined;
  const left = p.presence === 'left';
  const isAlt = userId === MEMBERS.arkaAlt.userId;

  return {
    profile: {
      id: `profile-${userId}`,
      userId,
      userTag: who.username,
      username: who.username,
      globalName: who.displayName,
      displayName: who.displayName,
      avatarUrl: who.avatarUrl,
      bannerUrl: null,
      accentColor: p.bannerSeed ? 0x6366f1 : null,
      locale: p.locale,
      isBot: false,
      accountCreatedAt: ago(p.accountDays * DAY),
      guildJoinedAt: ago(p.joinedDays * DAY),
      guildLeftAt: p.leftMin ? ago(p.leftMin) : null,
      firstSeenAt: ago(p.joinedDays * DAY - 3),
      lastSeenAt: ago(p.lastSeenMin),
      lastMessageAt: messages[0]?.createdAt ?? null,
      lastMessageChannelId: messages[0]?.channelId ?? null,
      messageCount: p.messages,
      voiceSessionCount: Math.round(p.voiceHours * 1.6),
      voiceTimeSeconds: p.voiceHours * 3600 + (seedOf(userId) % 50) * 60,
      voiceLastChannelId: null,
      voiceLastJoinedAt: null,
      voiceLastLeftAt: null,
      rolesSnapshot: p.roles,
      presenceStatus: left ? 'left' : p.presence,
      pronouns: p.pronouns ? pick(p.pronouns, locale) : null,
      isTutor: !!p.tutor,
      staffGrade: p.grade ? pick(p.grade, locale) : null,
      // Le lien avec Arka est validé : plus de soupçon ouvert sur ce compte.
      isSuspectedDC: false,
      moderatorNote: NOTES[userId] ? pick(NOTES[userId]!, locale) : '',
      isOnServer: !left,
    },
    invite: {
      code: p.inviteCode,
      inviterId: inviter?.userId ?? null,
      inviterTag: inviter?.username ?? null,
      inviterAvatarUrl: inviter?.avatarUrl ?? null,
      joinedAt: ago(p.joinedDays * DAY),
    },
    roles: p.roles.map((id) => role(id, locale)),
    effectivePermissions: p.perms.map((id) => pick(PERMS[id]!, locale)),
    sanctions,
    logs,
    messagesByChannel,
    recentMessageCount: messages.length,
    recentLogCount: logs.length,
    connections: (CONNECTIONS[userId] ?? []).map((c) => ({ ...c, visible: true })),
    connectionsNote: '',
    candidatures: (CANDIDATURES[userId] ?? []).map((c, i) => ({
      id: `${userId}-cand-${i}`,
      status: c.status,
      notes: pick(c.notes, locale),
      createdAt: ago(c.minutesAgo),
      data: null,
      autoRejected: false,
      autoRejectReason: null,
      rejectionReason: null,
      oralResult: c.oral ? pick(c.oral, locale) : null,
      reapplyAfter: null,
    })),
    linkedAccounts,
    isSuspectedDC: false,
    sanctionReports,
    interactionGraph: {
      nodes: [
        { id: userId, label: who.displayName, type: 'user', avatar: who.avatarUrl },
        ...contacts.map(([c]) => ({ id: c.userId, label: c.displayName, type: 'target' as const, avatar: c.avatarUrl })),
      ],
      edges: contacts.flatMap(([c, mentions, replies, reactions]) => [
        { from: userId, to: c.userId, type: 'mention' as const, count: mentions },
        { from: c.userId, to: userId, type: 'reply' as const, count: replies },
        { from: userId, to: c.userId, type: 'reaction' as const, count: reactions },
      ]).filter((e) => e.count > 0),
    },
    crossServerSanctions:
      userId === MEMBERS.arka.userId
        ? {
            enabled: true,
            serverCount: 2,
            total: 3,
            breakdown: { WARN: 2, KICK: 0, TIMEOUT: 1, TEMP_BAN: 0, BAN: 0, SOFTBAN: 0 },
            recent: [
              { type: 'TIMEOUT', status: 'RESOLVED', durationSeconds: 86400, reason: pick({ fr: 'Insultes en vocal', en: 'Insults in voice chat' }, locale), createdAt: ago(40 * DAY), guildId: 'demo-guild-2', guildName: 'Café Pixel' },
            ],
          }
        : { enabled: true, serverCount: 0, total: 0, breakdown: { WARN: 0, KICK: 0, TIMEOUT: 0, TEMP_BAN: 0, BAN: 0, SOFTBAN: 0 }, recent: [] },
    crossServerLinks:
      linked
        ? {
            enabled: true,
            serverCount: 2,
            suggestions: [
              {
                userId: linked.userId,
                userTag: linked.username,
                avatarUrl: linked.avatarUrl,
                presentOnGuild: isAlt,
                alreadyLinkedHere: true,
                serverCount: 2,
                manualCount: 1,
                guilds: [
                  { guildId: 'demo-guild-2', guildName: 'Café Pixel', type: 'MANUAL', status: 'VALIDATED', reason: null, linkedAt: ago(30 * DAY) },
                  { guildId: 'demo-guild-3', guildName: 'La Taverne', type: 'AUTOMATIC', status: 'PENDING', reason: null, linkedAt: ago(20 * DAY) },
                ],
                score: 40,
              },
            ],
          }
        : { enabled: true, serverCount: 0, suggestions: [] },
    verifications:
      userId === MEMBERS.arka.userId
        ? {
            entries: [{ id: 'verif-arka-1', status: 'VERIFIED', level: 'MEDIUM', requestedAt: ago(41 * DAY), verifiedAt: ago(41 * DAY - 25), expiresAt: null }],
            total: 1,
            lastRequestedAt: ago(41 * DAY),
            lastVerifiedAt: ago(41 * DAY - 25),
            hasPending: false,
            cooldownUntil: null,
          }
        : { entries: [], total: 0, lastRequestedAt: null, lastVerifiedAt: null, hasPending: false, cooldownUntil: null },
  };
}

// ── Activité jour par jour ──────────────────────────────────────────────────

export type DayPoint = { dateKey: string; messages: number; voiceMinutes: number };

function dateKeyOf(time: number): string {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Les 30 derniers jours et les 30 d'avant, comme le dossier les reçoit une fois
 * l'API lue. La période d'avant est un peu plus calme : la courbe a de quoi comparer.
 */
export function memberTrendFor(userId: string): { current: DayPoint[]; previous: DayPoint[] } {
  const p = persona(userId);
  const seed = seedOf(userId);
  const days = (offset: number, factor: number) =>
    Array.from({ length: 30 }, (_, i) => {
      const index = offset + i;
      const weekend = new Date(NOW - (59 - index) * DAY * 60_000).getDay() % 6 === 0 ? 1.5 : 1;
      // Rien avant l'arrivée sur le serveur ni après le départ.
      const daysAgo = 59 - index;
      const active = daysAgo <= p.joinedDays && daysAgo >= Math.ceil((p.leftMin ?? 0) / DAY) ? 1 : 0;
      const msgs = Math.round(p.pace * factor * weekend * (0.35 + noise(seed, index) * 1.3) * active);
      const voice = Math.round((p.voiceHours / 12) * factor * weekend * (noise(seed + 7, index) > 0.45 ? noise(seed + 3, index) * 2 : 0) * active);
      return { dateKey: dateKeyOf(NOW - (59 - index) * DAY * 60_000), messages: msgs, voiceMinutes: voice };
    });
  return { previous: days(0, 0.8), current: days(30, 1) };
}

// ── Liste de la page Membres ────────────────────────────────────────────────

/** Les cartes de la page Membres : tout le casting, avec ses chiffres. */
export function memberDirectory(): MemberSearchResult[] {
  return CAST.map((who) => {
    const p = persona(who.userId);
    return {
      id: who.userId,
      username: who.username,
      displayName: who.displayName,
      avatarUrl: who.avatarUrl,
      isBot: false,
      lastSeenAt: ago(p.lastSeenMin),
      messageCount: p.messages,
      guildJoinedAt: ago(p.joinedDays * DAY),
      guildLeftAt: p.leftMin ? ago(p.leftMin) : null,
      isOnServer: p.presence !== 'left',
      presenceStatus: p.presence === 'left' ? null : p.presence,
    };
  });
}

/**
 * Compteurs du serveur entier, au-dessus de la liste. Le casting n'en est
 * qu'une poignée : les totaux restent ceux du serveur de démo.
 */
export const DIRECTORY_TOTALS = {
  onServer: GUILD.memberCount,
  left: 318,
  bots: 6,
} as const;

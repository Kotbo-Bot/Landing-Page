/**
 * Données fictives de l'écran Équipe (`dash/screens/staff/`).
 *
 * Même forme que les réponses de l'API du dashboard lues par
 * `staffStore.svelte.ts` (Kotbo/apps/dashboard, branche `recette`). Tout le
 * monde vient du casting partagé (`dash/cast.ts`), avec ses identifiants : un
 * clic sur un modo ouvre la même fiche que dans les autres écrans.
 *
 * Les textes affichés (grades, pôles, raisons, sondages) existent en deux
 * langues ; `staffFixtures(locale)` rend la version demandée.
 */
import type { Locale } from '$lib/i18n/state.svelte';
import type { StaffConfig, StaffHierarchy, StaffMember, StaffRole, StaffWarning, LeadershipMetric } from '$lib/dash/types';
import { STAFF, MEMBERS, GUILD, ago, DAY, HOUR, type CastMember } from '$lib/dash/cast';

type L = { fr: string; en: string };

export type PollOption = { id: string; text: string };
export type PollVote = { id: string; optionId: string; weight?: number; userId?: string; staffMember?: { userId?: string } | null };
export type StaffPoll = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  closesAt?: string | null;
  createdAt?: string;
  author?: { username?: string | null; displayName?: string | null } | null;
  options: PollOption[];
  votes?: PollVote[];
};
export type DiscordOption = { id: string; name: string; color?: number | string | null };
export type RoleAccessEntry = { roleId: string; canView: boolean; canModerate: boolean; canConfigure: boolean; canDelete: boolean };

/** Celle ou celui qui regarde l'écran : la fondatrice, qui a tous les droits. */
export const VIEWER = STAFF.lena;

const G = GUILD.id;
const CREATED = ago(400 * DAY);

// ── Grades et pôles ─────────────────────────────────────

const GRADE: Record<'founder' | 'admin' | 'mod' | 'helper' | 'trial', L> = {
  founder: { fr: 'Fondatrice', en: 'Founder' },
  admin: { fr: 'Admin', en: 'Admin' },
  mod: { fr: 'Modérateur', en: 'Moderator' },
  helper: { fr: 'Helper', en: 'Helper' },
  trial: { fr: 'Modo test', en: 'Trial mod' },
};

const HIERARCHY: Record<'direction' | 'moderation' | 'support', { name: L; description: L; icon: string; color: string; responsable: string | null }> = {
  direction: {
    name: { fr: 'Direction', en: 'Leadership' },
    description: { fr: 'Les décisions qui engagent le serveur', en: 'Decisions that commit the server' },
    icon: 'crown',
    color: '#f59e0b',
    responsable: STAFF.lena.userId,
  },
  moderation: {
    name: { fr: 'Modération', en: 'Moderation' },
    description: { fr: 'Salons, sanctions et soirées vocales', en: 'Channels, sanctions and voice nights' },
    icon: 'shield',
    color: '#6366f1',
    responsable: STAFF.zenox.userId,
  },
  support: {
    name: { fr: 'Support', en: 'Support' },
    description: { fr: 'Tickets et accueil des nouveaux', en: 'Tickets and welcoming newcomers' },
    icon: 'message-circle',
    color: '#10b981',
    responsable: null,
  },
};

const DISCORD_ROLES: { id: string; name: L; color: string }[] = [
  { id: 'dr-founder', name: GRADE.founder, color: '#f59e0b' },
  { id: 'dr-admin', name: GRADE.admin, color: '#ef4444' },
  { id: 'dr-mod', name: { fr: 'Modération', en: 'Moderation' }, color: '#6366f1' },
  { id: 'dr-helper', name: GRADE.helper, color: '#10b981' },
  { id: 'dr-trial', name: GRADE.trial, color: '#94a3b8' },
  { id: 'dr-staff', name: { fr: 'Staff', en: 'Staff' }, color: '#a1a1aa' },
  { id: 'dr-staff-test', name: { fr: 'Staff en test', en: 'Staff on trial' }, color: '#a1a1aa' },
  { id: 'dr-vip', name: { fr: 'Habitué', en: 'Regular' }, color: '#38bdf8' },
];

const ROLES: { id: string; grade: keyof typeof GRADE; level: number; hierarchy: keyof typeof HIERARCHY; discord: string; color: string; chief?: boolean }[] = [
  { id: 'role-founder', grade: 'founder', level: 100, hierarchy: 'direction', discord: 'dr-founder', color: '#f59e0b', chief: true },
  { id: 'role-admin', grade: 'admin', level: 90, hierarchy: 'direction', discord: 'dr-admin', color: '#ef4444' },
  { id: 'role-mod', grade: 'mod', level: 60, hierarchy: 'moderation', discord: 'dr-mod', color: '#6366f1' },
  { id: 'role-helper', grade: 'helper', level: 40, hierarchy: 'support', discord: 'dr-helper', color: '#10b981' },
  { id: 'role-trial', grade: 'trial', level: 20, hierarchy: 'moderation', discord: 'dr-trial', color: '#94a3b8' },
];

// ── Membres ─────────────────────────────────────────────

type MemberSeed = {
  who: CastMember;
  grade: keyof typeof GRADE;
  joined: number;
  gradeSince?: number;
  tutor?: boolean;
  stats: [number, number, number];
  /** Pôles : [pôle, grade, depuis (minutes)] */
  hierarchies: [keyof typeof HIERARCHY, keyof typeof GRADE, number][];
  blacklist?: L;
};

const MEMBER_SEEDS: MemberSeed[] = [
  { who: STAFF.lena, grade: 'founder', joined: 760 * DAY, stats: [18420, 9200, 214], hierarchies: [['direction', 'founder', 760 * DAY]] },
  { who: STAFF.zenox, grade: 'admin', joined: 430 * DAY, gradeSince: 120 * DAY, tutor: true, stats: [9650, 4100, 388], hierarchies: [['direction', 'admin', 120 * DAY], ['moderation', 'mod', 430 * DAY]] },
  { who: STAFF.aiden, grade: 'mod', joined: 245 * DAY, gradeSince: 190 * DAY, tutor: true, stats: [6120, 2300, 241], hierarchies: [['moderation', 'mod', 190 * DAY]] },
  { who: STAFF.kylian, grade: 'mod', joined: 150 * DAY, gradeSince: 96 * DAY, stats: [3410, 980, 97], hierarchies: [['moderation', 'mod', 96 * DAY]] },
  { who: STAFF.maelys, grade: 'helper', joined: 92 * DAY, stats: [4870, 620, 12], hierarchies: [['support', 'helper', 92 * DAY]] },
  { who: STAFF.nora, grade: 'trial', joined: 9 * DAY, stats: [310, 45, 4], hierarchies: [['moderation', 'trial', 9 * DAY]] },
  {
    who: MEMBERS.bastos,
    grade: 'helper',
    joined: 300 * DAY,
    stats: [2210, 340, 6],
    hierarchies: [],
    blacklist: {
      fr: 'A partagé des captures du salon staff sur un autre serveur',
      en: 'Shared screenshots of the staff channel on another server',
    },
  },
];

// ── Avertissements ──────────────────────────────────────

const WARNING_SEEDS: { id: string; who: CastMember; by: CastMember; reason: L; at: number; expires: number; active: boolean }[] = [
  {
    id: 'sw-1',
    who: STAFF.kylian,
    by: STAFF.lena,
    reason: { fr: "Absent à deux réunions staff d'affilée sans prévenir", en: 'Missed two staff meetings in a row without notice' },
    at: 2 * DAY,
    expires: -28 * DAY,
    active: true,
  },
  {
    id: 'sw-2',
    who: STAFF.kylian,
    by: STAFF.zenox,
    reason: { fr: 'A mute un membre 24 h sans laisser de raison dans les logs', en: 'Muted a member for 24 h without leaving a reason in the logs' },
    at: 6 * DAY + 3 * HOUR,
    expires: -24 * DAY,
    active: true,
  },
  {
    id: 'sw-3',
    who: STAFF.aiden,
    by: STAFF.zenox,
    reason: { fr: 'Ton trop sec avec un membre en ticket', en: 'Too harsh with a member in a ticket' },
    at: 70 * DAY,
    expires: 10 * DAY,
    active: false,
  },
];

// ── Activité ────────────────────────────────────────────

const LEADERSHIP: LeadershipMetric[] = [
  { staffUserId: STAFF.lena.userId, avg30d: 52, avg7d: 48, progressionScore: 92, hasInactivityAlert: false },
  { staffUserId: STAFF.zenox.userId, avg30d: 35, avg7d: 31, progressionScore: 84, hasInactivityAlert: false },
  { staffUserId: STAFF.aiden.userId, avg30d: 24, avg7d: 22, progressionScore: 78, hasInactivityAlert: false },
  { staffUserId: STAFF.kylian.userId, avg30d: 18, avg7d: 7, progressionScore: 41, hasInactivityAlert: true },
  { staffUserId: STAFF.maelys.userId, avg30d: 15, avg7d: 21, progressionScore: 66, hasInactivityAlert: false },
  { staffUserId: STAFF.nora.userId, avg30d: 6, avg7d: 11, progressionScore: 38, hasInactivityAlert: false },
];

// ── Sondages ────────────────────────────────────────────

const POLL_SEEDS: { id: string; title: L; description?: L; author: CastMember; open: boolean; closes: number; options: L[]; votes: [CastMember, number, number][] }[] = [
  {
    id: 'poll-1',
    title: { fr: 'Mode lent de 10 s sur #memes le soir ?', en: '10 s slowmode on #memes in the evening?' },
    description: { fr: 'Le salon déborde entre 21 h et minuit, les modos ne suivent plus.', en: 'The channel overflows between 9 pm and midnight, mods cannot keep up.' },
    author: STAFF.zenox,
    open: true,
    closes: -2 * DAY,
    options: [
      { fr: 'Oui, tous les soirs', en: 'Yes, every evening' },
      { fr: 'Seulement le week-end', en: 'Weekends only' },
      { fr: 'Non, on laisse comme ça', en: 'No, leave it as is' },
    ],
    votes: [
      [STAFF.zenox, 0, 4.5],
      [STAFF.aiden, 1, 3],
      [STAFF.maelys, 0, 2],
    ],
  },
  {
    id: 'poll-2',
    title: { fr: "Recruter deux helpers pour l'été ?", en: 'Recruit two helpers for the summer?' },
    author: STAFF.lena,
    open: false,
    closes: 20 * DAY,
    options: [
      { fr: 'Oui', en: 'Yes' },
      { fr: 'Non', en: 'No' },
    ],
    votes: [
      [STAFF.lena, 0, 5],
      [STAFF.zenox, 0, 4.5],
      [STAFF.aiden, 1, 3],
      [STAFF.kylian, 0, 3],
    ],
  },
];

/** Grade d'un votant : le poids de son vote. */
export const VOTE_WEIGHT = 5;

// ── Assemblage ──────────────────────────────────────────

export type StaffFixtures = {
  members: StaffMember[];
  roles: StaffRole[];
  hierarchies: StaffHierarchy[];
  warnings: StaffWarning[];
  polls: StaffPoll[];
  leadership: LeadershipMetric[];
  config: StaffConfig;
  discordRoles: DiscordOption[];
  textChannels: DiscordOption[];
  voiceChannels: DiscordOption[];
  roleAccess: Record<string, RoleAccessEntry[]>;
  /** Membres du serveur hors staff, proposés par « Ajouter un membre ». */
  candidates: CastMember[];
};

export function staffFixtures(locale: Locale): StaffFixtures {
  const t = (value: L) => value[locale];

  const hierarchies: StaffHierarchy[] = (Object.keys(HIERARCHY) as (keyof typeof HIERARCHY)[]).map((key, index) => ({
    id: `h-${key}`,
    guildId: G,
    name: t(HIERARCHY[key].name),
    description: t(HIERARCHY[key].description),
    color: HIERARCHY[key].color,
    icon: HIERARCHY[key].icon,
    sortOrder: index,
    parentHierarchyId: null,
    responsableUserId: HIERARCHY[key].responsable,
    discordRoleId: null,
    enabled: true,
    createdAt: CREATED,
    updatedAt: CREATED,
  }));

  const roles: StaffRole[] = ROLES.map((role, index) => ({
    id: role.id,
    guildId: G,
    name: t(GRADE[role.grade]),
    level: role.level,
    discordRoleId: role.discord,
    color: role.color,
    sortOrder: index,
    enabled: true,
    createdAt: CREATED,
    updatedAt: CREATED,
    hierarchyId: `h-${role.hierarchy}`,
    isResponsable: !!role.chief,
  }));

  const members: StaffMember[] = MEMBER_SEEDS.map((seed, index) => {
    const id = `sm-${seed.who.userId}`;
    return {
      id,
      guildId: G,
      userId: seed.who.userId,
      grade: t(GRADE[seed.grade]),
      joinedStaffAt: ago(seed.joined),
      currentRoleStartedAt: ago(seed.gradeSince ?? seed.joined),
      userTag: seed.who.username,
      username: seed.who.username,
      displayName: seed.who.displayName,
      avatarUrl: seed.who.avatarUrl,
      isTutor: !!seed.tutor,
      suspendedAt: null,
      createdAt: ago(seed.joined),
      updatedAt: ago(index * HOUR),
      warnings: [],
      blacklistEntries: seed.blacklist ? [{ id: `bl-${seed.who.userId}`, reason: t(seed.blacklist), endDate: null }] : [],
      stats: { totalMessages: seed.stats[0], totalVoiceMinutes: seed.stats[1], sanctionsIssued: seed.stats[2] },
      hierarchyGrades: seed.hierarchies.map(([hierarchy, grade, since]) => ({
        id: `hg-${seed.who.userId}-${hierarchy}`,
        staffMemberId: id,
        hierarchyId: `h-${hierarchy}`,
        grade: t(GRADE[grade]),
        joinedAt: ago(since),
      })),
    };
  });

  const warnings: StaffWarning[] = WARNING_SEEDS.map((w) => ({
    id: w.id,
    staffUserId: w.who.userId,
    staffDisplayName: w.who.displayName,
    staffAvatarUrl: w.who.avatarUrl,
    reason: t(w.reason),
    issuedByTag: w.by.username,
    isActive: w.active,
    createdAt: ago(w.at),
    expiresAt: ago(w.expires),
  }));

  const polls: StaffPoll[] = POLL_SEEDS.map((p) => ({
    id: p.id,
    title: t(p.title),
    description: p.description ? t(p.description) : null,
    status: p.open ? 'OPEN' : 'CLOSED',
    closesAt: ago(p.closes),
    createdAt: ago(p.open ? DAY : 27 * DAY),
    author: { username: p.author.username, displayName: p.author.displayName },
    options: p.options.map((text, i) => ({ id: `${p.id}-o${i}`, text: t(text) })),
    votes: p.votes.map(([who, option, weight]) => ({
      id: `${p.id}-v-${who.userId}`,
      optionId: `${p.id}-o${option}`,
      weight,
      userId: who.userId,
      staffMember: { userId: who.userId },
    })),
  }));

  const discordRoles = DISCORD_ROLES.map((r) => ({ id: r.id, name: t(r.name), color: r.color }));

  return {
    members,
    roles,
    hierarchies,
    warnings,
    polls,
    leadership: LEADERSHIP.map((m) => ({ ...m })),
    config: {
      baseStaffRoleId: 'dr-staff',
      testStaffRoleId: 'dr-staff-test',
      meetingAnnouncementChannelId: 'ch-staff-annonces',
      meetingVoiceChannelId: 'vc-reunion',
      staffAnnouncementChannelId: 'ch-staff-annonces',
      warnsToDemote: 3,
      warnsToBlacklist: 5,
      blacklistPermanentByDefault: true,
      actionMode: 'validation',
      demoteRemoveAllRoles: true,
    },
    discordRoles,
    textChannels: [
      { id: 'ch-staff-annonces', name: locale === 'fr' ? 'staff-annonces' : 'staff-announcements' },
      { id: 'ch-staff', name: 'staff' },
      { id: 'ch-staff-logs', name: 'staff-logs' },
    ],
    voiceChannels: [
      { id: 'vc-reunion', name: locale === 'fr' ? 'Réunion staff' : 'Staff meeting' },
      { id: 'vc-general', name: locale === 'fr' ? 'Vocal général' : 'General voice' },
    ],
    roleAccess: {
      staff_directory: [{ roleId: 'dr-mod', canView: true, canModerate: false, canConfigure: false, canDelete: false }],
      staff_roles: [],
    },
    // Un seul candidat : à huit lignes, l'annuaire ne tiendrait plus dans l'aperçu.
    candidates: [MEMBERS.yuna],
  };
}

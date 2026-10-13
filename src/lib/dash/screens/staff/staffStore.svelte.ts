/**
 * L'état de l'écran Équipe, en local.
 *
 * Recopie réduite de `lib/components/staff/staffStore.svelte.ts` (dashboard,
 * branche `recette`) : mêmes champs et mêmes méthodes là où le balisage les
 * lit, mais les appels à l'API sont remplacés par des changements sur les
 * données fictives (`dash/fixtures/staff.ts`). Les toasts et les fenêtres de
 * confirmation du dashboard vivent ici aussi, dans l'écran.
 *
 * Un store par écran, transmis par contexte (`useStaff`).
 */
import { getContext, setContext } from 'svelte';
import type { Locale } from '$lib/i18n/state.svelte';
import type { StaffConfig, StaffHierarchy, StaffMember, StaffRole, StaffWarning, LeadershipMetric } from '$lib/dash/types';
import { staffFixtures, VIEWER, VOTE_WEIGHT, type DiscordOption, type RoleAccessEntry, type StaffPoll } from '$lib/dash/fixtures/staff';
import { GUILD, type CastMember } from '$lib/dash/cast';

export type { StaffWarning, LeadershipMetric, StaffPoll, DiscordOption, RoleAccessEntry };

const TEXT = {
  fr: {
    unknownUser: 'Utilisateur inconnu',
    promoted: (name: string, grade: string) => `${name} passe ${grade}`,
    demoted: (name: string, grade: string) => `${name} redescend ${grade}`,
    gradeMax: 'Grade maximum atteint',
    gradeMin: 'Grade minimum atteint',
    gradeNotFound: 'Grade introuvable dans la hiérarchie actuelle.',
    suspendTitle: 'Suspendre ce membre du staff ?',
    suspendDesc: 'Ses rôles Discord staff seront retirés, mais sa fiche, son grade et son historique sont conservés. Tu pourras le réintégrer à tout moment.',
    suspendBtn: 'Suspendre',
    unsuspendTitle: 'Lever la suspension ?',
    unsuspendDesc: 'Le membre retrouvera ses rôles Discord correspondant à son grade actuel.',
    unsuspendBtn: 'Réintégrer',
    removeStaffTitle: 'Retirer ce membre du staff ?',
    removeStaffBtn: 'Retirer du staff',
    removeHierarchyTitle: 'Retirer ce membre de la hiérarchie ?',
    removeBtn: 'Retirer',
    memberAdded: (name: string) => `${name} rejoint le staff`,
    warningIssued: 'Avertissement enregistré',
    warningDeleted: 'Avertissement supprimé',
    undo: 'Annuler',
    liftTitle: 'Retirer de la liste noire ?',
    pollMinOptions: 'Il faut au moins 2 options valides',
    closePollTitle: 'Clôturer ce sondage ?',
    closePollDesc: 'Le sondage sera fermé avant son échéance.',
    closePollBtn: 'Clôturer',
    roleExists: (name: string) => `Le grade « ${name} » existe déjà`,
    roleUpdated: 'Rôle mis à jour.',
    deleteRoleTitle: (name: string) => `Supprimer le rôle « ${name} » ?`,
    deleteRoleDesc: 'Il sera retiré de la hiérarchie staff.',
    deleteHierarchyTitle: 'Supprimer cette hiérarchie ?',
    deleteHierarchyDesc: 'Les rôles associés seront détachés.',
    confirmDelete: 'Supprimer',
    impactHierarchyRoles: (n: number) => `Grades détachés de cette hiérarchie : ${n}`,
    impactHierarchyMembers: (n: number) => `Membres du staff classés dans cette hiérarchie : ${n}`,
    impactRoleMembers: (n: number) => `Membres du staff qui portent ce grade : ${n}`,
    impactRoleHierarchy: (name: string) => `Il fait partie de la hiérarchie « ${name} »`,
    impactStaffGrade: (grade: string) => `Grade actuel : ${grade}`,
    impactStaffHierarchies: (n: number) => `Hiérarchies où ce membre est classé : ${n}`,
    permissionsUpdated: 'Permissions mises à jour.',
  },
  en: {
    unknownUser: 'Unknown user',
    promoted: (name: string, grade: string) => `${name} is now ${grade}`,
    demoted: (name: string, grade: string) => `${name} is now ${grade}`,
    gradeMax: 'Maximum grade reached',
    gradeMin: 'Minimum grade reached',
    gradeNotFound: 'Grade not found in the current hierarchy.',
    suspendTitle: 'Suspend this staff member?',
    suspendDesc: 'Their staff Discord roles will be removed, but their record, grade and history are kept. You can reinstate them at any time.',
    suspendBtn: 'Suspend',
    unsuspendTitle: 'Lift the suspension?',
    unsuspendDesc: 'The member will get back the Discord roles matching their current grade.',
    unsuspendBtn: 'Reinstate',
    removeStaffTitle: 'Remove this member from staff?',
    removeStaffBtn: 'Remove from staff',
    removeHierarchyTitle: 'Remove this member from the hierarchy?',
    removeBtn: 'Remove',
    memberAdded: (name: string) => `${name} joined the staff`,
    warningIssued: 'Warning recorded',
    warningDeleted: 'Warning deleted',
    undo: 'Undo',
    liftTitle: 'Remove from the blocklist?',
    pollMinOptions: 'You need at least 2 valid options',
    closePollTitle: 'Close this poll?',
    closePollDesc: 'The poll will be closed before its deadline.',
    closePollBtn: 'Close',
    roleExists: (name: string) => `The « ${name} » grade already exists`,
    roleUpdated: 'Role updated!',
    deleteRoleTitle: (name: string) => `Delete the role “${name}”?`,
    deleteRoleDesc: 'It will be removed from the staff hierarchy.',
    deleteHierarchyTitle: 'Delete this hierarchy?',
    deleteHierarchyDesc: 'Associated roles will be detached.',
    confirmDelete: 'Delete',
    impactHierarchyRoles: (n: number) => `Grades detached from this hierarchy: ${n}`,
    impactHierarchyMembers: (n: number) => `Staff members ranked in this hierarchy: ${n}`,
    impactRoleMembers: (n: number) => `Staff members holding this grade: ${n}`,
    impactRoleHierarchy: (name: string) => `It belongs to the “${name}” hierarchy`,
    impactStaffGrade: (grade: string) => `Current grade: ${grade}`,
    impactStaffHierarchies: (n: number) => `Hierarchies this member is ranked in: ${n}`,
    permissionsUpdated: 'Permissions updated.',
  },
};

export type StaffTab = 'members' | 'roles' | 'organigramme' | 'warnings' | 'blacklist' | 'polls' | 'leadership' | 'permissions';
export const STAFF_TABS: StaffTab[] = ['members', 'roles', 'organigramme', 'warnings', 'blacklist', 'polls', 'leadership', 'permissions'];

export type HierarchyPayload = {
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  discordRoleId: string | null;
  responsableUserId: string | null;
  parentHierarchyId: string | null;
};

export type StaffDialogs = {
  addMember: boolean;
  /** Avertir : `userId` vide laisse choisir le membre. */
  warn: { userId: string } | null;
  blacklist: { userId: string } | null;
  grades: string | null;
  settings: boolean;
};

export type ToastItem = { id: number; type: 'success' | 'error' | 'warning' | 'info'; message: string; action?: { label: string; onClick: () => void } };

export type ConfirmRequest = {
  title: string;
  description?: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  impacts?: string[];
  resolve: (ok: boolean) => void;
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export function isPollClosed(poll: StaffPoll): boolean {
  return poll.status === 'CLOSED' || (!!poll.closesAt && new Date(poll.closesAt) < new Date());
}

export function staffName(member: Pick<StaffMember, 'displayName' | 'username' | 'userId'> | null | undefined, fallback = ''): string {
  return member?.displayName || member?.username || fallback;
}

let uid = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++uid}`;

export class StaffStore {
  locale = $state<Locale>('fr');
  readonly guildId = GUILD.id;
  readonly viewer = VIEWER;

  dialogs = $state<StaffDialogs>({ addMember: false, warn: null, blacklist: null, grades: null, settings: false });

  members = $state<StaffMember[]>([]);
  roles = $state<StaffRole[]>([]);
  hierarchies = $state<StaffHierarchy[]>([]);
  warnings = $state<StaffWarning[]>([]);
  polls = $state<StaffPoll[]>([]);
  leadership = $state<LeadershipMetric[]>([]);
  config = $state<StaffConfig>(staffFixtures('fr').config);
  discordRoles = $state<DiscordOption[]>([]);
  textChannels = $state<DiscordOption[]>([]);
  voiceChannels = $state<DiscordOption[]>([]);
  roleAccess = $state<Record<string, RoleAccessEntry[]>>({});
  candidates = $state<CastMember[]>([]);

  savingConfig = $state(false);
  savingRoleOrder = $state(false);

  toasts = $state<ToastItem[]>([]);
  confirmRequest = $state<ConfirmRequest | null>(null);

  /** La démo n'a qu'un regard : celui de la fondatrice, qui peut tout faire. */
  readonly isAdmin = true;
  readonly canManageSettings = true;
  readonly canModerate = true;
  readonly canConfigureDirectory = true;
  readonly canConfigureRoles = true;

  constructor(locale: Locale) {
    this.reset(locale);
  }

  private get t() {
    return TEXT[this.locale];
  }

  /** Remet les données de départ, dans la langue voulue. */
  reset(locale: Locale): void {
    const data = staffFixtures(locale);
    this.locale = locale;
    this.members = data.members;
    this.roles = data.roles;
    this.hierarchies = data.hierarchies;
    this.warnings = data.warnings;
    this.polls = data.polls;
    this.leadership = data.leadership;
    this.config = data.config;
    this.discordRoles = data.discordRoles;
    this.textChannels = data.textChannels;
    this.voiceChannels = data.voiceChannels;
    this.roleAccess = data.roleAccess;
    this.candidates = data.candidates;
    this.dialogs = { addMember: false, warn: null, blacklist: null, grades: null, settings: false };
    this.syncMemberWarnings();
  }

  // ── Vues dérivées ───────────────────────────────────────

  orderedRoles = $derived.by(() =>
    [...this.roles].sort((left, right) => {
      const levelDelta = (right.level ?? 0) - (left.level ?? 0);
      if (levelDelta !== 0) return levelDelta;
      const sortDelta = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
      if (sortDelta !== 0) return sortDelta;
      return new Date(left.createdAt ?? 0).getTime() - new Date(right.createdAt ?? 0).getTime();
    }),
  );

  orderedHierarchies = $derived.by(() =>
    [...this.hierarchies].sort((left, right) => {
      const sortDelta = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
      if (sortDelta !== 0) return sortDelta;
      return new Date(left.createdAt ?? 0).getTime() - new Date(right.createdAt ?? 0).getTime();
    }),
  );

  activeMembers = $derived(this.members.filter((member) => !member.blacklistEntries?.length));
  blacklistedMembers = $derived(this.members.filter((member) => !!member.blacklistEntries?.length));
  openPolls = $derived(this.polls.filter((poll) => !isPollClosed(poll)));
  activeWarningCount = $derived(this.activeMembers.reduce((sum, member) => sum + (member.warnings?.length ?? 0), 0));
  inactiveCount = $derived(this.leadership.filter((metric) => metric.hasInactivityAlert).length);

  /** Ce que l'API sert à l'organigramme, recalculé depuis les grades et les membres. */
  hierarchySchema = $derived.by(() => {
    const chief = this.members.find((member) => member.userId === VIEWER.userId);
    return {
      chiefStaff: chief ? { userId: chief.userId, name: staffName(chief) } : null,
      hierarchies: this.orderedHierarchies.map((h) => {
        const responsable = h.responsableUserId ? this.memberByUserId(h.responsableUserId) : undefined;
        const members = this.activeMembers.flatMap((member) =>
          (member.hierarchyGrades ?? [])
            .filter((grade) => grade.hierarchyId === h.id)
            .map((grade) => ({
              userId: member.userId,
              username: member.username ?? member.userId,
              displayName: member.displayName,
              avatarUrl: member.avatarUrl,
              grade: grade.grade,
            })),
        );
        return {
          id: h.id,
          name: h.name,
          description: h.description,
          color: h.color,
          icon: h.icon,
          sortOrder: h.sortOrder,
          parentHierarchyId: h.parentHierarchyId,
          responsable: responsable ? { userId: responsable.userId, name: staffName(responsable) } : null,
          roles: this.rolesInHierarchy(h.id).map((role) => ({
            id: role.id,
            name: role.name,
            level: role.level,
            isResponsable: !!role.isResponsable,
            color: role.color,
          })),
          memberCount: members.length,
          members,
        };
      }),
    };
  });

  rolesInHierarchy(hierarchyId: string | null): StaffRole[] {
    return this.orderedRoles.filter((role) => (role.hierarchyId ?? null) === hierarchyId);
  }

  hierarchyById(id: string | null | undefined): StaffHierarchy | undefined {
    return id ? this.hierarchies.find((h) => h.id === id) : undefined;
  }

  roleByName(name: string | null | undefined): StaffRole | undefined {
    return name ? this.orderedRoles.find((role) => role.name === name) : undefined;
  }

  discordRoleName(id: string | null | undefined): string | null {
    if (!id) return null;
    return this.discordRoles.find((role) => role.id === id)?.name ?? id;
  }

  gradeColor(grade: string | null | undefined): string | null {
    const role = this.roleByName(grade);
    if (!role) return null;
    return role.color || this.hierarchyById(role.hierarchyId)?.color || null;
  }

  gradeIndex(grade: string | null | undefined): number {
    return this.orderedRoles.findIndex((role) => role.name === grade);
  }

  canPromote(member: StaffMember): boolean {
    return this.gradeIndex(member.grade) > 0;
  }

  canDemote(member: StaffMember): boolean {
    const index = this.gradeIndex(member.grade);
    return index !== -1 && index < this.orderedRoles.length - 1;
  }

  metricFor(userId: string): LeadershipMetric | undefined {
    return this.leadership.find((metric) => metric.staffUserId === userId);
  }

  memberByUserId(userId: string): StaffMember | undefined {
    return this.members.find((member) => member.userId === userId);
  }

  membersWithGrade(grade: string): StaffMember[] {
    return this.activeMembers.filter((member) => member.grade === grade);
  }

  resolveGradeFromDiscordRoles(roleIds: string[]): string | null {
    if (!roleIds.length) return null;
    return this.orderedRoles.find((role) => role.discordRoleId && roleIds.includes(role.discordRoleId))?.name ?? null;
  }

  resolveMemberHierarchyDraft(member: StaffMember): { hierarchyId: string; grade: string } | null {
    const existing = member.hierarchyGrades?.[0];
    if (existing) return { hierarchyId: existing.hierarchyId, grade: existing.grade };
    const matched = this.orderedRoles.find((role) => role.hierarchyId && normalizeText(role.name) === normalizeText(member.grade));
    return matched?.hierarchyId ? { hierarchyId: matched.hierarchyId, grade: matched.name } : null;
  }

  hierarchyImpacts(hierarchy: StaffHierarchy): string[] {
    const impacts: string[] = [];
    const roles = this.rolesInHierarchy(hierarchy.id).length;
    if (roles > 0) impacts.push(this.t.impactHierarchyRoles(roles));
    const members = this.members.filter((member) => member.hierarchyGrades?.some((g) => g.hierarchyId === hierarchy.id)).length;
    if (members > 0) impacts.push(this.t.impactHierarchyMembers(members));
    return impacts;
  }

  roleImpacts(role: StaffRole): string[] {
    const impacts: string[] = [];
    const holders = this.members.filter((member) => normalizeText(member.grade ?? '') === normalizeText(role.name)).length;
    if (holders > 0) impacts.push(this.t.impactRoleMembers(holders));
    const hierarchy = this.hierarchyById(role.hierarchyId);
    if (hierarchy) impacts.push(this.t.impactRoleHierarchy(hierarchy.name));
    return impacts;
  }

  memberImpacts(member: StaffMember): string[] {
    const impacts: string[] = [];
    if (member.grade) impacts.push(this.t.impactStaffGrade(member.grade));
    const ranked = member.hierarchyGrades?.length ?? 0;
    if (ranked > 0) impacts.push(this.t.impactStaffHierarchies(ranked));
    return impacts;
  }

  // ── Toasts et confirmations ─────────────────────────────

  toast(type: ToastItem['type'], message: string, action?: ToastItem['action'], duration = 3500): void {
    const id = ++uid;
    this.toasts = [...this.toasts.slice(-2), { id, type, message, action }];
    if (typeof window !== 'undefined') window.setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter((item) => item.id !== id);
  }

  ask(request: Omit<ConfirmRequest, 'resolve'>): Promise<boolean> {
    this.confirmRequest?.resolve(false);
    return new Promise((resolve) => {
      this.confirmRequest = { ...request, resolve };
    });
  }

  answer(ok: boolean): void {
    const request = this.confirmRequest;
    this.confirmRequest = null;
    request?.resolve(ok);
  }

  // ── Membres ─────────────────────────────────────────────

  private patch(userId: string, change: Partial<StaffMember>): void {
    this.members = this.members.map((member) => (member.userId === userId ? { ...member, ...change, updatedAt: new Date().toISOString() } : member));
  }

  /** `warnings` d'un membre : ses avertissements en vigueur, comme les sert l'API. */
  private syncMemberWarnings(): void {
    this.members = this.members.map((member) => ({
      ...member,
      warnings: this.warnings
        .filter((w) => w.isActive && w.staffUserId === member.userId)
        .map((w) => ({ id: w.id, reason: w.reason, expiresAt: w.expiresAt ?? null })),
    }));
  }

  async saveConfig(patch: Partial<StaffConfig> = {}): Promise<void> {
    this.config = { ...this.config, ...patch };
    this.savingConfig = true;
    if (typeof window !== 'undefined') window.setTimeout(() => (this.savingConfig = false), 500);
  }

  async addMember(input: { userId: string; grade: string; username: string; avatarUrl: string; createTestingPeriod: boolean }): Promise<boolean> {
    const who = this.candidates.find((c) => c.userId === input.userId);
    if (!who || !input.grade) return false;
    const now = new Date().toISOString();
    const role = this.roleByName(input.grade);
    const id = `sm-${who.userId}`;
    this.members = [
      ...this.members,
      {
        id,
        guildId: this.guildId,
        userId: who.userId,
        grade: input.grade,
        joinedStaffAt: now,
        currentRoleStartedAt: now,
        userTag: who.username,
        username: who.username,
        displayName: who.displayName,
        avatarUrl: who.avatarUrl,
        isTutor: false,
        suspendedAt: null,
        createdAt: now,
        updatedAt: now,
        warnings: [],
        blacklistEntries: [],
        stats: { totalMessages: 0, totalVoiceMinutes: 0, sanctionsIssued: 0 },
        hierarchyGrades: role?.hierarchyId
          ? [{ id: nextId('hg'), staffMemberId: id, hierarchyId: role.hierarchyId, grade: role.name, joinedAt: now }]
          : [],
      },
    ];
    this.candidates = this.candidates.filter((c) => c.userId !== who.userId);
    this.toast('success', this.t.memberAdded(who.displayName));
    return true;
  }

  async shiftGrade(member: StaffMember, direction: 'up' | 'down'): Promise<void> {
    const index = this.gradeIndex(member.grade);
    if (index === -1) {
      this.toast('warning', this.t.gradeNotFound);
      return;
    }
    if (direction === 'up' && index <= 0) {
      this.toast('warning', this.t.gradeMax);
      return;
    }
    if (direction === 'down' && index >= this.orderedRoles.length - 1) {
      this.toast('warning', this.t.gradeMin);
      return;
    }
    const nextGrade = this.orderedRoles[direction === 'up' ? index - 1 : index + 1].name;
    this.patch(member.userId, { grade: nextGrade, currentRoleStartedAt: new Date().toISOString() });
    this.toast('success', direction === 'up' ? this.t.promoted(staffName(member), nextGrade) : this.t.demoted(staffName(member), nextGrade));
  }

  async toggleSuspension(member: StaffMember): Promise<void> {
    const suspend = !member.suspendedAt;
    const confirmed = await this.ask(
      suspend
        ? { title: this.t.suspendTitle, description: this.t.suspendDesc, confirmLabel: this.t.suspendBtn, variant: 'warning' }
        : { title: this.t.unsuspendTitle, description: this.t.unsuspendDesc, confirmLabel: this.t.unsuspendBtn },
    );
    if (!confirmed) return;
    this.patch(member.userId, { suspendedAt: suspend ? new Date().toISOString() : null });
  }

  async removeMember(member: StaffMember): Promise<boolean> {
    const confirmed = await this.ask({ title: this.t.removeStaffTitle, confirmLabel: this.t.removeStaffBtn, variant: 'danger', impacts: this.memberImpacts(member) });
    if (!confirmed) return false;
    this.members = this.members.filter((m) => m.userId !== member.userId);
    this.leadership = this.leadership.filter((metric) => metric.staffUserId !== member.userId);
    return true;
  }

  async toggleTutor(member: StaffMember): Promise<void> {
    this.patch(member.userId, { isTutor: !member.isTutor });
  }

  async addHierarchyGrade(userId: string, hierarchyId: string, grade: string): Promise<boolean> {
    const member = this.memberByUserId(userId);
    if (!member) return false;
    const others = (member.hierarchyGrades ?? []).filter((g) => g.hierarchyId !== hierarchyId);
    this.patch(userId, {
      hierarchyGrades: [...others, { id: nextId('hg'), staffMemberId: member.id, hierarchyId, grade, joinedAt: new Date().toISOString() }],
    });
    return true;
  }

  async removeHierarchyGrade(userId: string, hierarchyId: string): Promise<void> {
    if (!(await this.ask({ title: this.t.removeHierarchyTitle, confirmLabel: this.t.removeBtn, variant: 'danger' }))) return;
    const member = this.memberByUserId(userId);
    if (!member) return;
    this.patch(userId, { hierarchyGrades: (member.hierarchyGrades ?? []).filter((g) => g.hierarchyId !== hierarchyId) });
  }

  // ── Avertissements et liste noire ───────────────────────

  async issueWarning(input: { staffUserId: string; reason: string; expiresAt: string }): Promise<boolean> {
    const member = this.memberByUserId(input.staffUserId);
    if (!member || !input.reason.trim()) return false;
    this.warnings = [
      {
        id: nextId('sw'),
        staffUserId: member.userId,
        staffDisplayName: member.displayName,
        staffAvatarUrl: member.avatarUrl,
        reason: input.reason.trim(),
        issuedByTag: VIEWER.username,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: input.expiresAt ? new Date(input.expiresAt).toISOString() : null,
      },
      ...this.warnings,
    ];
    this.syncMemberWarnings();
    this.toast('success', this.t.warningIssued);
    return true;
  }

  /** Une ligne à impact local : elle part tout de suite, avec « Annuler ». */
  deleteWarning(warning: StaffWarning): void {
    const before = this.warnings;
    this.warnings = this.warnings.filter((w) => w.id !== warning.id);
    this.syncMemberWarnings();
    this.toast(
      'success',
      this.t.warningDeleted,
      {
        label: this.t.undo,
        onClick: () => {
          this.warnings = before;
          this.syncMemberWarnings();
        },
      },
      5000,
    );
  }

  async blacklist(input: { staffUserId: string; reason: string; endDate: string }): Promise<boolean> {
    if (!input.staffUserId || !input.reason.trim()) return false;
    const entry = { id: nextId('bl'), reason: input.reason.trim(), endDate: input.endDate ? new Date(input.endDate).toISOString() : null };
    const member = this.memberByUserId(input.staffUserId);
    if (member) {
      this.patch(member.userId, { blacklistEntries: [entry] });
      return true;
    }
    const who = this.candidates.find((c) => c.userId === input.staffUserId);
    if (!who) return false;
    const now = new Date().toISOString();
    this.members = [
      ...this.members,
      {
        id: `sm-${who.userId}`,
        guildId: this.guildId,
        userId: who.userId,
        grade: '',
        joinedStaffAt: now,
        currentRoleStartedAt: now,
        username: who.username,
        displayName: who.displayName,
        avatarUrl: who.avatarUrl,
        isTutor: false,
        createdAt: now,
        updatedAt: now,
        warnings: [],
        blacklistEntries: [entry],
        stats: null,
        hierarchyGrades: [],
      },
    ];
    this.candidates = this.candidates.filter((c) => c.userId !== who.userId);
    return true;
  }

  async liftBlacklist(member: StaffMember): Promise<void> {
    if (!(await this.ask({ title: this.t.liftTitle, confirmLabel: this.t.removeBtn, variant: 'warning' }))) return;
    // L'entrée part, et le membre avec : il n'est plus dans le staff.
    this.members = this.members.filter((m) => m.userId !== member.userId);
  }

  // ── Sondages ────────────────────────────────────────────

  async createPoll(input: { title: string; description: string; options: string[]; closesAt: string }): Promise<boolean> {
    if (!input.title.trim()) return false;
    const options = input.options.map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) {
      this.toast('warning', this.t.pollMinOptions);
      return false;
    }
    const id = nextId('poll');
    this.polls = [
      {
        id,
        title: input.title.trim(),
        description: input.description.trim() || null,
        status: 'OPEN',
        closesAt: input.closesAt ? new Date(input.closesAt).toISOString() : null,
        createdAt: new Date().toISOString(),
        author: { username: VIEWER.username, displayName: VIEWER.displayName },
        options: options.map((text, i) => ({ id: `${id}-o${i}`, text })),
        votes: [],
      },
      ...this.polls,
    ];
    return true;
  }

  async vote(pollId: string, optionId: string): Promise<void> {
    this.polls = this.polls.map((poll) =>
      poll.id === pollId
        ? {
            ...poll,
            votes: [
              ...(poll.votes ?? []),
              { id: nextId('vote'), optionId, weight: VOTE_WEIGHT, userId: VIEWER.userId, staffMember: { userId: VIEWER.userId } },
            ],
          }
        : poll,
    );
  }

  async closePoll(pollId: string): Promise<void> {
    const confirmed = await this.ask({ title: this.t.closePollTitle, description: this.t.closePollDesc, confirmLabel: this.t.closePollBtn, variant: 'warning' });
    if (!confirmed) return;
    this.polls = this.polls.map((poll) => (poll.id === pollId ? { ...poll, status: 'CLOSED' } : poll));
  }

  // ── Grades et pôles ─────────────────────────────────────

  async createRole(input: { query: string; discordRoleId: string; hierarchyId: string; isResponsable: boolean; level: number }): Promise<boolean> {
    const name = input.query.trim();
    if (!name) return false;
    const existing = this.orderedRoles.find((role) => normalizeText(role.name) === normalizeText(name));
    if (existing) {
      this.toast('info', this.t.roleExists(existing.name));
      return false;
    }
    const discord = input.discordRoleId ? this.discordRoles.find((r) => r.id === input.discordRoleId) : undefined;
    const now = new Date().toISOString();
    this.roles = [
      ...this.roles,
      {
        id: nextId('role'),
        guildId: this.guildId,
        name: discord?.name || name,
        level: Number(input.level),
        discordRoleId: discord?.id ?? null,
        color: typeof discord?.color === 'string' ? discord.color : null,
        sortOrder: this.roles.length,
        enabled: true,
        createdAt: now,
        updatedAt: now,
        hierarchyId: input.hierarchyId || null,
        isResponsable: input.isResponsable,
      },
    ];
    return true;
  }

  async updateRole(roleId: string, data: Partial<StaffRole>): Promise<boolean> {
    const previous = this.roles.find((role) => role.id === roleId);
    if (!previous) return false;
    this.roles = this.roles.map((role) => (role.id === roleId ? { ...role, ...data } : role));
    // Renommer un grade renomme aussi celui des membres qui le portent.
    if (data.name && data.name !== previous.name) {
      this.members = this.members.map((member) => ({
        ...member,
        grade: member.grade === previous.name ? data.name! : member.grade,
        hierarchyGrades: member.hierarchyGrades?.map((g) => (g.grade === previous.name ? { ...g, grade: data.name! } : g)),
      }));
    }
    this.toast('success', this.t.roleUpdated);
    return true;
  }

  async deleteRole(role: StaffRole): Promise<void> {
    if (!(await this.ask({ title: this.t.deleteRoleTitle(role.name), description: this.t.deleteRoleDesc, confirmLabel: this.t.confirmDelete, variant: 'danger', impacts: this.roleImpacts(role) }))) return;
    this.roles = this.roles.filter((r) => r.id !== role.id);
  }

  /**
   * Déplace un grade : avant `beforeRoleId`, ou en bas de la hiérarchie visée.
   * Même calcul de poids que le dashboard, sans l'enregistrement.
   */
  async moveRole(roleId: string, target: { beforeRoleId?: string; hierarchyId: string | null }): Promise<void> {
    if (roleId === target.beforeRoleId) return;
    const current = this.orderedRoles;
    const moved = current.find((role) => role.id === roleId);
    if (!moved) return;

    const rest = current.filter((role) => role.id !== roleId);
    let insertAt: number;
    if (target.beforeRoleId) {
      insertAt = rest.findIndex((role) => role.id === target.beforeRoleId);
      if (insertAt < 0) return;
    } else {
      let last = -1;
      rest.forEach((role, index) => {
        if ((role.hierarchyId ?? null) === target.hierarchyId) last = index;
      });
      insertAt = last >= 0 ? last + 1 : -1;
    }

    const hierarchyChanged = (moved.hierarchyId ?? null) !== target.hierarchyId;
    const levels = new Map<string, number>();

    if (insertAt >= 0) {
      const above = rest[insertAt - 1];
      const below = rest[insertAt];
      const hi = above ? above.level : below ? below.level + 20 : moved.level;
      const lo = below ? below.level : Math.max(0, hi - 20);
      const order = [...rest.slice(0, insertAt), moved, ...rest.slice(insertAt)];
      if (hi - lo >= 2) {
        levels.set(moved.id, Math.floor((hi + lo) / 2));
      } else {
        order.forEach((role, index) => {
          const level = (order.length - index) * 10;
          if (level !== role.level) levels.set(role.id, level);
        });
      }
      if (order.indexOf(moved) === current.indexOf(moved) && !hierarchyChanged) return;
    } else if (!hierarchyChanged) {
      return;
    }

    this.roles = this.roles.map((role) => ({
      ...role,
      level: levels.get(role.id) ?? role.level,
      hierarchyId: role.id === roleId ? target.hierarchyId : role.hierarchyId,
    }));
    this.savingRoleOrder = true;
    if (typeof window !== 'undefined') window.setTimeout(() => (this.savingRoleOrder = false), 500);
  }

  async saveHierarchy(payload: HierarchyPayload, editingId: string | null): Promise<boolean> {
    if (!payload.name.trim()) return false;
    const now = new Date().toISOString();
    if (editingId) {
      this.hierarchies = this.hierarchies.map((h) => (h.id === editingId ? { ...h, ...payload, updatedAt: now } : h));
    } else {
      this.hierarchies = [
        ...this.hierarchies,
        { id: nextId('h'), guildId: this.guildId, ...payload, sortOrder: this.hierarchies.length, enabled: true, createdAt: now, updatedAt: now },
      ];
    }
    return true;
  }

  async deleteHierarchy(hierarchy: StaffHierarchy): Promise<void> {
    if (!(await this.ask({ title: this.t.deleteHierarchyTitle, description: this.t.deleteHierarchyDesc, confirmLabel: this.t.confirmDelete, variant: 'danger', impacts: this.hierarchyImpacts(hierarchy) }))) return;
    this.hierarchies = this.hierarchies.filter((h) => h.id !== hierarchy.id);
    this.roles = this.roles.map((role) => (role.hierarchyId === hierarchy.id ? { ...role, hierarchyId: null } : role));
    this.members = this.members.map((member) => ({
      ...member,
      hierarchyGrades: member.hierarchyGrades?.filter((g) => g.hierarchyId !== hierarchy.id),
    }));
  }

  // ── Permissions par rôle ────────────────────────────────

  saveRoleAccess(featureKey: string, entries: RoleAccessEntry[]): void {
    this.roleAccess = { ...this.roleAccess, [featureKey]: entries.map((e) => ({ ...e })) };
  }

  get permissionsUpdated(): string {
    return this.t.permissionsUpdated;
  }

  get unknownUser(): string {
    return this.t.unknownUser;
  }
}

const KEY = Symbol('staff-store');

export function provideStaff(store: StaffStore): StaffStore {
  return setContext(KEY, store);
}

export function useStaff(): StaffStore {
  return getContext<StaffStore>(KEY);
}

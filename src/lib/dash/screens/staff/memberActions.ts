/**
 * Actions secondaires sur un membre, rangées du plus courant au plus lourd.
 * Recopie de `lib/components/staff/memberActions.ts` (dashboard).
 */
import type { MenuItem } from '$lib/dash/ui';
import type { StaffMember } from '$lib/dash/types';
import { getLocale } from '$lib/i18n/state.svelte';
import type { StaffStore } from './staffStore.svelte';

const TEXT = {
  fr: {
    warn: 'Avertir',
    warnDesc: 'Compte pour la rétrogradation automatique',
    tutorRemove: 'Retirer le statut de tuteur',
    tutorAdd: 'Désigner comme tuteur',
    hierarchies: 'Gérer les hiérarchies',
    unsuspend: 'Réintégrer',
    suspend: 'Suspendre',
    suspendDesc: 'Garde le grade, coupe les permissions staff',
    blacklist: 'Mettre en liste noire',
    blacklistDesc: 'Retire du staff et bloque tout retour',
    remove: 'Démettre',
  },
  en: {
    warn: 'Warn',
    warnDesc: 'Counts toward automatic demotion',
    tutorRemove: 'Remove tutor status',
    tutorAdd: 'Designate as Tutor',
    hierarchies: 'Manage hierarchies',
    unsuspend: 'Reinstate',
    suspend: 'Suspend',
    suspendDesc: 'Keeps the grade, cuts staff permissions',
    blacklist: 'Blacklist',
    blacklistDesc: 'Removes from staff and blocks any return',
    remove: 'Dismiss',
  },
};

export function memberMenuItems(staff: StaffStore, member: StaffMember): MenuItem[] {
  const t = TEXT[getLocale()];
  const items: MenuItem[] = [];

  if (staff.canModerate) {
    items.push({ label: t.warn, description: t.warnDesc, icon: 'alert-triangle', onselect: () => (staff.dialogs.warn = { userId: member.userId }) });
    items.push({
      label: member.isTutor ? t.tutorRemove : t.tutorAdd,
      icon: member.isTutor ? 'user-check' : 'user-plus',
      onselect: () => void staff.toggleTutor(member),
    });
  }

  if (staff.canManageSettings) {
    items.push({ label: t.hierarchies, icon: 'git-branch', onselect: () => (staff.dialogs.grades = member.userId) });
    items.push({
      label: member.suspendedAt ? t.unsuspend : t.suspend,
      description: member.suspendedAt ? undefined : t.suspendDesc,
      icon: member.suspendedAt ? 'play' : 'pause',
      onselect: () => void staff.toggleSuspension(member),
    });
  }

  if (staff.canModerate) {
    items.push({ label: t.blacklist, description: t.blacklistDesc, icon: 'slash', onselect: () => (staff.dialogs.blacklist = { userId: member.userId }) });
  }

  if (staff.canManageSettings) {
    items.push({ label: t.remove, icon: 'user-minus', onselect: () => void staff.removeMember(member) });
  }

  return items;
}

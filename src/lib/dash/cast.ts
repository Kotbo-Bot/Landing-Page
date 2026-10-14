/**
 * Les personnages fictifs des écrans du dashboard recopiés sur le site.
 *
 * Un seul serveur, une seule équipe : la fiche membre, l'équipe, les sanctions
 * et les tickets parlent des mêmes personnes, avec les mêmes identifiants, pour
 * qu'un clic sur un nom dans un écran ouvre la bonne fiche dans un autre.
 * Les fixtures de chaque écran (`dash/fixtures/`) partent d'ici.
 *
 * Aucun de ces comptes n'existe : les identifiants ne sont pas des snowflakes
 * Discord valides et les avatars sont dessinés sur place (`mockAvatar`).
 */
import { mockAvatar } from '$lib/mockMedia';

export type CastRole = 'owner' | 'admin' | 'mod' | 'helper' | 'trial' | 'member';

export type CastMember = {
  userId: string;
  /** Pseudo affiché sur le serveur. */
  displayName: string;
  /** Nom d'utilisateur Discord. */
  username: string;
  avatarUrl: string;
  role: CastRole;
};

function person(userId: string, displayName: string, username: string, role: CastRole): CastMember {
  return { userId, displayName, username, avatarUrl: mockAvatar(displayName), role };
}

export const GUILD = {
  id: 'demo-guild',
  name: 'Le Repaire',
  memberCount: 4812,
} as const;

/** L'équipe : du fondateur à la modo en période d'essai. */
export const STAFF = {
  lena: person('demo-1001', 'Lena', 'lena_adm', 'owner'),
  zenox: person('demo-1002', 'Zenox', 'zenox', 'admin'),
  aiden: person('demo-1003', 'Aiden', 'aiden_mod', 'mod'),
  kylian: person('demo-1004', 'Kylian', 'kylian_h', 'mod'),
  maelys: person('demo-1005', 'Maëlys', 'maelys.h', 'helper'),
  nora: person('demo-1006', 'Nora', 'nora_test', 'trial'),
} as const;

/** Les membres dont on parle : sanctionnés, en ticket, signalés. */
export const MEMBERS = {
  arka: person('demo-2001', 'Arka', 'arka_77', 'member'),
  sacha: person('demo-2002', 'Sacha', 'sacha.wav', 'member'),
  bastos: person('demo-2003', 'Bastos', 'bastos_off', 'member'),
  pixel: person('demo-2004', 'Pixel', 'pixel.ink', 'member'),
  tomtom: person('demo-2005', 'TomTom', 'tomtom_fr', 'member'),
  yuna: person('demo-2006', 'Yuna', 'yuna.mp3', 'member'),
  /** Double compte d'Arka, relié dans sa fiche. */
  arkaAlt: person('demo-2007', 'arka_backup', 'arka_backup', 'member'),
} as const;

export const CAST: CastMember[] = [...Object.values(STAFF), ...Object.values(MEMBERS)];

export function castById(userId: string): CastMember | undefined {
  return CAST.find((m) => m.userId === userId);
}

/**
 * L'instant « maintenant » des écrans. Les dates des fixtures en dépendent
 * (`ago`), pour qu'une sanction d'« il y a 3 jours » le reste quel que soit le
 * jour où la page est construite.
 */
export const NOW = Date.now();

export function ago(minutes: number): string {
  return new Date(NOW - minutes * 60_000).toISOString();
}

export const MIN = 1;
export const HOUR = 60;
export const DAY = 24 * HOUR;

/**
 * Avatars des écrans du dashboard recopiés sur le site.
 *
 * Recopie de `memberAvatarSrc` et `localInitialAvatar`
 * (`Kotbo/apps/dashboard/src/lib/discordMedia.ts`, branche `recette`) : un
 * écran qui affiche un membre appelle la même fonction que le dashboard, avec
 * les mêmes arguments. Les membres des données de démo (`fixtures.ts`) ont
 * déjà un avatar local (`mockAvatar`) ; celui à initiale sert aux comptes sans
 * photo, comme dans le dashboard. Aucun nom ne part vers un service tiers :
 * tout est dessiné en SVG sur place.
 */

/** Les cinq avatars par défaut de Discord, traités comme une absence de photo. */
const DEFAULT_AVATAR_PATTERN = /cdn\.discordapp\.com\/embed\/avatars\//i;

/** Teintes des avatars à initiale, assez sombres pour porter un texte blanc. */
const INITIAL_AVATAR_COLORS = [
  '#7c3aed',
  '#2563eb',
  '#0891b2',
  '#059669',
  '#ca8a04',
  '#ea580c',
  '#dc2626',
  '#db2777',
  '#4f46e5',
  '#475569',
];

/** Hash stable (FNV-1a 32 bits) : la même graine donne toujours la même couleur. */
function seedHash(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Avatar à initiale, coloré par `seed` (l'identifiant Discord en pratique) :
 * deux membres sans photo restent distincts dans une liste.
 */
export function localInitialAvatar(name: string | null | undefined, seed?: string | null): string {
  const initial = (name?.trim().charAt(0) || '?').toUpperCase().replace(/[<>&"']/g, '');
  const key = seed?.trim() || name?.trim() || '';
  const background = key ? INITIAL_AVATAR_COLORS[seedHash(key) % INITIAL_AVATAR_COLORS.length] : '#334155';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${background}"/><text x="32" y="40" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="700" fill="#f8fafc">${initial}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Vrai si l'URL n'est rien d'autre que l'avatar générique de Discord. */
export function isDefaultDiscordAvatar(url: string | null | undefined): boolean {
  return typeof url === 'string' && DEFAULT_AVATAR_PATTERN.test(url);
}

/** Avatar affichable d'un membre : sa photo si elle existe, sinon son initiale. */
export function memberAvatarSrc(url: string | null | undefined, name?: string | null, userId?: string | null): string {
  if (typeof url === 'string') {
    const trimmed = url.trim();
    if (
      trimmed &&
      (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('data:')) &&
      !isDefaultDiscordAvatar(trimmed)
    ) {
      return trimmed;
    }
  }
  return localInitialAvatar(name, userId);
}

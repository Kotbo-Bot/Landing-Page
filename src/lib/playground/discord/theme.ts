/**
 * Les couleurs de Discord, pour les aperçus.
 *
 * Recopiées du client sombre plutôt qu'approchées : un aperçu qui « ressemble
 * à Discord » mais pas tout à fait se lit comme une maquette, et c'est
 * précisément l'effet inverse de celui recherché. Ce sont les seules surfaces
 * sombres de la page (DESIGN.md).
 *
 * Contrastes vérifiés : `muted` sur `chat` 5,0:1, `text` sur `chat` 11,6:1.
 */
import { base } from '$app/paths';

export const DISCORD = {
  rail: '#1e1f22',
  sidebar: '#2b2d31',
  chat: '#313338',
  embed: '#2b2d31',
  input: '#383a40',
  hover: '#3f4147',
  text: '#dbdee1',
  heading: '#f2f3f5',
  muted: '#949ba4',
  blurple: '#5865f2',
  green: '#248046',
  red: '#da373c',
} as const;

/** Chemin d'un emoji du bot (`static/ktb`). */
export function ktb(name: string): string {
  return `${base}/ktb/ktb_${name}.png`;
}

/** L'avatar du bot dans les aperçus : le logo de Kotbo. */
export const KOTBO_AVATAR = `${base}/favicon.svg`;

/**
 * Les chiffres publics de Kotbo, lus une fois par visite.
 *
 * Deux zones les affichent : le bandeau « Ils nous font confiance » sous le
 * héros, et la section complète plus bas. Un seul appel pour les deux : sans
 * ce partage, la page interrogeait l'API deux fois pour la même réponse.
 *
 * Pas de repli chiffré. Si l'API ne répond pas, `status` passe à `error` et
 * les deux zones se masquent : une preuve sociale inventée coûte plus cher
 * qu'une absence de preuve.
 */
import { browser } from '$app/environment';
import { base } from '$app/paths';
import { STATS_ENDPOINT } from '$lib/product';

export interface ServerStats {
  name: string;
  iconUrl: string;
  memberCount: number;
  description: string;
}

/**
 * Une instance du bot, telle qu'elle se déclare à l'API : l'instance publique
 * et les bots personnalisés que des serveurs font tourner sous leur nom.
 */
export interface BotStats {
  botName: string;
  botAvatarUrl: string | null;
  guildCount: number;
  userCount: number;
  isSelfHosted: boolean;
}

export interface Stats {
  totalGuilds: number;
  totalUsers: number;
  bots: BotStats[];
  servers: ServerStats[];
}

let status = $state<'loading' | 'ready' | 'error'>('loading');
let data = $state<Stats | null>(null);
let pending: Promise<void> | null = null;

/**
 * En local, l'appel passe par le proxy de `vite.config.ts` : l'API refuse un
 * appel direct venu de `localhost` (voir le commentaire du proxy).
 */
function endpoint(): string {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  return local ? STATS_ENDPOINT.replace('https://api.kotbo.fr', '/__kotbo-api') : STATS_ENDPOINT;
}

/**
 * Serveurs dont une copie de l'icône est servie par le site
 * (`static/communities/<id>.webp`). Elle prend le relais tant que l'API
 * renvoie encore l'adresse du CDN de Discord. Zenode n'y est pas : l'icône
 * connue de l'API n'existe plus chez Discord.
 */
const LOCAL_ICONS = new Set(['506029988680695818', '913791560615854120', '1477350874740424986']);

/**
 * L'API relaie les icônes des serveurs et les renvoie en chemin relatif
 * (`/api/public/stats/icons/<id>`). Une URL du CDN de Discord n'est jamais
 * chargée telle quelle : elle donnerait l'adresse IP du visiteur à Discord et
 * le laisserait poser un cookie. Elle est remplacée par la copie locale quand
 * elle existe, sinon le bandeau affiche les initiales.
 */
function apiIcon(url: unknown): string {
  if (typeof url !== 'string') return '';
  if (url.startsWith('/api/')) return endpoint().replace(/\/api\/public\/stats$/, '') + url;
  const id = url.match(/^https:\/\/cdn\.discordapp\.com\/icons\/(\d+)\//)?.[1];
  return id && LOCAL_ICONS.has(id) ? `${base}/communities/${id}.webp` : '';
}

async function fetchStats(): Promise<void> {
  try {
    const res = await fetch(endpoint());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const next: Stats = {
      totalGuilds: Number(json.totalGuilds) || 0,
      totalUsers: Number(json.totalUsers) || 0,
      bots: Array.isArray(json.bots) ? json.bots : [],
      servers: Array.isArray(json.servers)
        ? json.servers.map((s: ServerStats) => ({ ...s, iconUrl: apiIcon(s.iconUrl) }))
        : [],
    };
    // « 0 communauté » prouverait surtout le contraire : traité comme une absence.
    if (next.totalGuilds === 0) throw new Error('empty');
    data = next;
    status = 'ready';
  } catch {
    data = null;
    status = 'error';
  }
}

export const publicStats = {
  get status() {
    return status;
  },
  get data() {
    return data;
  },
  /** Lance la lecture si personne ne l'a encore fait. Sans effet côté serveur. */
  load(): Promise<void> {
    if (!browser) return Promise.resolve();
    pending ??= fetchStats();
    return pending;
  },
};

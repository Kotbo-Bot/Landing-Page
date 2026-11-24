/**
 * La couleur de chaque article : une par grande famille de modules, reprise de
 * la palette des couvertures (`scripts/covers/scenes.mjs`). Elle teinte le
 * pictogramme et l'étiquette dans les listes, puis les marqueurs, le sommaire
 * et le bandeau de l'article. Du JS simple, pour que les scripts de
 * génération des couvertures la lisent aussi.
 */

export const ACCENTS = {
  security: '#fb923c',
  community: '#f472b6',
  welcome: '#2dd4bf',
  staff: '#60a5fa',
  tools: '#a78bfa',
  news: '#4ade80',
  default: '#8b8cf8',
};

/** La famille de chaque module du registre. */
const FAMILY = {
  security: ['automod', 'raid_protection', 'double_accounts', 'security_verification', 'sanctions', 'ban_appeals', 'logs', 'nickname_moderation', 'codepolice'],
  community: ['giveaways', 'leveling', 'reputation', 'prestige', 'clans', 'seasons', 'drops', 'quests', 'fun', 'economy', 'marketplace', 'events', 'starboard', 'suggestions', 'daily_algo'],
  welcome: ['welcome_goodbye', 'reaction_roles', 'regulation', 'custom_forms', 'auto_thread', 'bump_reminder'],
  staff: ['recruitment', 'tutoring', 'staff_roles', 'staff_server', 'polls', 'meetings', 'absences', 'evaluations', 'discipline', 'staff_directory'],
  tools: ['tickets', 'embed_builder', 'campaigns', 'news', 'social_networks', 'twitch', 'youtube', 'channel_links', 'site', 'site_wiki', 'site_blog', 'settings', 'analytics', 'channel_health', 'members', 'workflows'],
};

/**
 * La couleur d'un article : celle de la famille de son premier module, le vert
 * des nouveautés pour une annonce de version ou de l'équipe, l'indigo sinon.
 * @param {string[] | undefined} modules @param {string} [key] l'adresse française du billet
 */
export function accentOf(modules, key = '') {
  if (/^(kotbo-|documentation|aegisai)/.test(key)) return ACCENTS.news;
  for (const module of modules ?? []) {
    for (const [family, list] of Object.entries(FAMILY)) {
      if (list.includes(module)) return ACCENTS[/** @type {keyof typeof ACCENTS} */ (family)];
    }
  }
  return ACCENTS.default;
}

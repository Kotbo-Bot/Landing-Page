/**
 * Les valeurs du produit que plusieurs zones de la page affichent.
 *
 * Ce dépôt n'a pas accès au paquet du bot qui fait foi : la duplication est
 * assumée, mais tenue ici en un seul exemplaire. Toute modification se vérifie
 * côté dashboard, qui affiche les mêmes valeurs.
 */

/** Aligné sur `TRIAL_DAYS` du bot. */
export const TRIAL_DAYS = 15;

export const SALES_URL = 'https://pros.kotbo.fr/rdv';
export const CONTACT_EMAIL = 'contact@kotbo.fr';
export const DOCS_URL = 'https://docs.kotbo.fr';
export const STATUS_URL = 'https://status.kotbo.fr';
export const DISCORD_URL = 'https://nathaan.me/u/discord';
export const STATS_ENDPOINT = 'https://api.kotbo.fr/api/public/stats';

/** Origine publique du site, pour les URL absolues (canonique, Open Graph). */
export const SITE_URL = 'https://kotbo.fr';

export const TOPGG_URL = 'https://top.gg/bot/1481651387317354598';
/** Un vote compte toutes les 12 h et fait monter Kotbo dans le classement Top.gg. */
export const TOPGG_VOTE_URL = `${TOPGG_URL}/vote`;
/**
 * Moyenne des avis sur Top.gg, relevée à la main le 2026-10-11 : Top.gg n'offre
 * pas d'API publique pour la lire. À revérifier quand des avis arrivent.
 * Volontairement absente des données structurées : Google interdit de reprendre
 * dans `aggregateRating` des notes récoltées sur un autre site.
 */
export const TOPGG_RATING = 5;

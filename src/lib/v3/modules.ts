/**
 * Le catalogue des modules, tel que le dashboard le range.
 *
 * Recopié à la main de `MODULE_REGISTRY` (`packages/contracts/src/types/modules.ts`,
 * branche `recette` du dépôt Kotbo, 14/10/2026) : mêmes clés, mêmes catégories,
 * mêmes noms français. Les modules `core` (Vue d'ensemble, Membres,
 * Paramètres...) sont exclus : ce sont les pages de l'outil, pas des modules
 * qu'on active. Les noms anglais sont les nôtres, le registre n'en a pas.
 *
 * `MODULE_COUNT` est le chiffre que toute la page affiche (héros, addition,
 * barre du haut, salon #modules). Un module ajouté au registre s'ajoute ici,
 * et le chiffre suit. `static/llms.txt` le recopie à la main : le mettre à jour.
 */
import type { Locale } from '$lib/i18n/state.svelte';

export interface CatalogModule {
  key: string;
  name: Record<Locale, string>;
}

export interface CatalogCategory {
  key: string;
  label: Record<Locale, string>;
  modules: CatalogModule[];
}

const m = (key: string, fr: string, en: string): CatalogModule => ({ key, name: { fr, en } });

export const CATALOG: CatalogCategory[] = [
  {
    key: 'moderation',
    label: { fr: 'Modération & sécurité', en: 'Moderation & security' },
    modules: [
      m('sanctions', 'Sanctions', 'Sanctions'),
      m('automod', 'AutoMod', 'AutoMod'),
      m('logs', 'Logs Discord', 'Discord logs'),
      m('nickname_moderation', 'Modération des pseudos', 'Nickname moderation'),
      m('double_accounts', 'Doubles comptes', 'Alt accounts'),
      m('raid_protection', 'Protection anti-raid', 'Anti-raid protection'),
      m('ban_appeals', 'Appels de bannissement', 'Ban appeals'),
      m('codepolice', 'Code Police', 'Code Police'),
      m('security_verification', 'Vérification de sécurité', 'Security verification'),
    ],
  },
  {
    key: 'staff',
    label: { fr: 'Gestion du staff', en: 'Staff management' },
    modules: [
      m('recruitment', 'Recrutement', 'Recruitment'),
      m('staff_directory', 'Annuaire staff', 'Staff directory'),
      m('staff_roles', 'Hiérarchie & rôles staff', 'Staff ranks & roles'),
      m('tutoring', 'Tutorat & formation', 'Mentoring & training'),
      m('meetings', 'Réunions', 'Meetings'),
      m('absences', 'Absences', 'Time off'),
      m('polls', 'Sondages staff', 'Staff polls'),
      m('discipline', 'Discipline staff', 'Staff discipline'),
      m('evaluations', 'Évaluations', 'Reviews'),
    ],
  },
  {
    key: 'community',
    label: { fr: 'Communauté & engagement', en: 'Community & engagement' },
    modules: [
      m('leveling', 'Leveling & XP', 'Leveling & XP'),
      m('seasons', 'Saisons', 'Seasons'),
      m('prestige', 'Prestige', 'Prestige'),
      m('clans', 'Clans', 'Clans'),
      m('drops', 'Drops', 'Drops'),
      m('economy', 'Économie & RPG', 'Economy & RPG'),
      m('marketplace', 'Marché entre membres', 'Member market'),
      m('quests', 'Quêtes', 'Quests'),
      m('reputation', 'Réputation', 'Reputation'),
      m('fun', 'Salons fun', 'Fun channels'),
      m('daily_algo', 'Daily Algo', 'Daily Algo'),
      m('tickets', 'Tickets support', 'Support tickets'),
      m('giveaways', 'Giveaways', 'Giveaways'),
      m('events', 'Événements & quiz', 'Events & quizzes'),
      m('suggestions', 'Suggestions', 'Suggestions'),
      m('starboard', 'Starlight', 'Starlight'),
    ],
  },
  {
    key: 'content',
    label: { fr: 'Contenu & communication', en: 'Content & communication' },
    modules: [
      m('regulation', 'Règlement', 'Rules'),
      m('welcome_goodbye', 'Accueil & départ', 'Welcome & goodbye'),
      m('reaction_roles', 'Rôles par réaction', 'Reaction roles'),
      m('auto_responses', 'Auto-réponses', 'Auto-replies'),
      m('auto_thread', 'Auto-thread & salons', 'Auto-threads & channels'),
      m('news', 'Actualités & RSS', 'News & RSS'),
      m('site', 'Site communautaire', 'Community website'),
      m('site_wiki', 'Wiki du site', 'Website wiki'),
      m('site_blog', 'Blog du site', 'Website blog'),
      m('campaigns', 'Campagnes', 'Campaigns'),
      m('embed_builder', 'Créateur d’embeds', 'Embed builder'),
      m('translation', 'Traduction automatique', 'Auto-translate'),
      m('digest', 'Digest', 'Digest'),
      m('custom_forms', 'Formulaires personnalisés', 'Custom forms'),
    ],
  },
  {
    key: 'integrations',
    label: { fr: 'Intégrations', en: 'Integrations' },
    modules: [
      m('analytics', 'Analytics', 'Analytics'),
      m('youtube', 'YouTube', 'YouTube'),
      m('twitch', 'Twitch', 'Twitch'),
      m('social_networks', 'Réseaux sociaux', 'Social media'),
      m('workflows', 'Déclencheurs', 'Triggers'),
      m('channel_health', 'Santé des salons', 'Channel health'),
      m('bump_reminder', 'Rappel de bump', 'Bump reminder'),
    ],
  },
  {
    key: 'cross_server',
    label: { fr: 'Cross-serveur', en: 'Cross-server' },
    modules: [
      m('channel_links', 'Liens de salons', 'Channel links'),
      m('partnerships', 'Partenariats', 'Partnerships'),
      m('staff_server', 'Serveur staff', 'Staff server'),
    ],
  },
];

export const MODULE_COUNT = CATALOG.reduce((sum, c) => sum + c.modules.length, 0);

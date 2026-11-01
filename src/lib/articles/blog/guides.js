/**
 * Les guides du blog, dans l'ordre où l'index les montre : les recherches
 * les plus tapées d'abord. Un fichier par guide, qui répond à une recherche
 * précise (son `title` et son `h1`) ; chaque commande citée se vérifie dans
 * `apps/bot/src/commands` du dépôt produit, sous son nom dans chaque langue
 * (`apps/bot/messages/{fr,en}.json`).
 */
import faireUnGiveawayDiscord from './faire-un-giveaway-discord.js';
import messageBienvenueDiscord from './message-bienvenue-discord.js';
import protegerServeurDiscordRaid from './proteger-serveur-discord-raid.js';
import roleReactionDiscord from './role-reaction-discord.js';
import sanctionsDiscordWarnMuteBan from './sanctions-discord-warn-mute-ban.js';
import verificationCaptchaDiscord from './verification-captcha-discord.js';
import rendreServeurDiscordActif from './rendre-serveur-discord-actif.js';
import botEconomieDiscord from './bot-economie-discord.js';
import notificationTwitchYoutubeDiscord from './notification-twitch-youtube-discord.js';
import salonVocalTemporaireDiscord from './salon-vocal-temporaire-discord.js';
import statistiquesServeurDiscord from './statistiques-serveur-discord.js';
import creerEmbedDiscord from './creer-embed-discord.js';
import recrutementStaffDiscord from './recrutement-staff-discord.js';
import appelBanDiscordFormulaireUnban from './appel-ban-discord-formulaire-unban.js';
import salonSuggestionDiscord from './salon-suggestion-discord.js';
import gererServeurDiscordIa from './gerer-serveur-discord-ia.js';
import creerSiteServeurDiscord from './creer-site-serveur-discord.js';
import trackerInvitationsDiscord from './tracker-invitations-discord.js';
import rappelBumpDisboard from './rappel-bump-disboard.js';
import partenariatServeurDiscord from './partenariat-serveur-discord.js';
import relierServeursDiscord from './relier-serveurs-discord.js';
import systemeClanDiscord from './systeme-clan-discord.js';
import systemeReputationDiscord from './systeme-reputation-discord.js';
import starboardDiscord from './starboard-discord.js';

/** @type {import('../blog.js').BlogPost[]} */
export const GUIDES = [
  faireUnGiveawayDiscord,
  messageBienvenueDiscord,
  protegerServeurDiscordRaid,
  roleReactionDiscord,
  sanctionsDiscordWarnMuteBan,
  verificationCaptchaDiscord,
  rendreServeurDiscordActif,
  botEconomieDiscord,
  notificationTwitchYoutubeDiscord,
  salonVocalTemporaireDiscord,
  statistiquesServeurDiscord,
  creerEmbedDiscord,
  recrutementStaffDiscord,
  appelBanDiscordFormulaireUnban,
  salonSuggestionDiscord,
  gererServeurDiscordIa,
  creerSiteServeurDiscord,
  trackerInvitationsDiscord,
  rappelBumpDisboard,
  partenariatServeurDiscord,
  relierServeursDiscord,
  systemeClanDiscord,
  systemeReputationDiscord,
  starboardDiscord,
];

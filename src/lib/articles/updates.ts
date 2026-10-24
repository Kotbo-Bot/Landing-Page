/**
 * L'article « nouveautés » : ce qu'apporte la dernière version de Kotbo, puis
 * les versions d'avant en une ligne chacune.
 *
 * Écrit ici, comme l'article staff (`staff.ts`) : il montre un vrai écran du
 * dashboard (`figure`). Chaque point vient des notes de version publiées sur
 * GitHub (releases de `Kotbo-Bot/Kotbo`) ou, pour la version en cours, des
 * commits du dépôt produit depuis la précédente. Les questions vivent dans
 * `seo/faq.js` (`UPDATES_FAQ`), le titre et la description aussi dans
 * `seo/jsonld.js`.
 */
import type { Locale } from '$lib/i18n/state.svelte';
import { TRIAL_DAYS } from '$lib/product';
import type { StaffArticle } from './staff';

export const UPDATES_ARTICLE: Record<Locale, StaffArticle> = {
	fr: {
		name: 'Nouveautés de Kotbo 9.5',
		title: 'Kotbo 9.5 : AegisAI, tickets en centre de support, fiche membre et site du serveur | Kotbo',
		description:
			'Ce que change Kotbo 9.5 : détection des insultes par l’IA AegisAI, tickets façon centre de support, fiche membre complète, site du serveur, simulateur d’AutoMod et Pulse refait.',
		h1: 'Kotbo 9.5 : ce qui change sur ton serveur',
		lead: 'La 9.5 est la plus grosse mise à jour depuis la 9.0. Une IA lit le ton des messages, les tickets deviennent un vrai centre de support, chaque membre a sa fiche et ton serveur peut avoir son site. Voici l’essentiel, sans le jargon des notes de version',
		sections: [
			{
				h2: 'AegisAI repère les insultes que les listes de mots ratent',
				body: 'Kotbo s’associe à AegisAI, une API qui note la toxicité et l’émotion de chaque message. Une liste de mots bannis rate les fautes volontaires et les phrases polies mais méchantes, AegisAI les voit. Le module s’active serveur par serveur, depuis sa page dans Sécurité',
				items: [
					{
						title: 'Deux seuils',
						body: 'Un message très toxique est supprimé et sanctionné d’office. Dans la zone grise, le staff reçoit une carte « à vérifier » avec Confirmer et Faux positif',
					},
					{
						title: 'Une preuve à chaque sanction',
						body: 'La transcription du salon est prise avant le retrait du message. Le casier garde le contexte, pas seulement le motif',
					},
					{
						title: 'Conflits, harcèlement, détresse',
						body: 'Une dispute qui monte passe le salon en mode lent le temps qu’elle retombe. Un membre visé par plusieurs autres, même sur des semaines, est signalé. Un message de détresse alerte le staff en toute discrétion, sans jamais sanctionner',
					},
					{
						title: 'Pseudos et éditions',
						body: 'Un pseudo toxique est remplacé, et un message modifié après coup est relu comme les autres',
					},
					{
						title: 'Le climat du serveur',
						body: 'Une section Climat dans Analytics montre la toxicité et les émotions par heure, par salon et par membre. La fiche de chaque membre a la sienne',
					},
					{
						title: 'Les modos aussi',
						body: 'Le staff et les admins passent dans l’analyse. Un membre exempté n’est jamais sanctionné automatiquement : son message part en revue',
					},
				],
			},
			{
				h2: 'Les tickets deviennent un centre de support',
				body: 'La page Tickets a été refaite sur le modèle des outils de support pro : une boîte de réception avec des vues, et chaque ticket avec ses propriétés',
				points: [
					'Vues « à moi », « non attribués », « en attente du staff », « hors délai », avec recherche et tri',
					'Priorité, étiquettes et attribution à un membre du staff, qui voit qui est disponible',
					'Objectifs de service : un délai de première réponse et de résolution, et les tickets qui le dépassent remontent',
					'Le profil de l’auteur à droite de la conversation, comme sur Discord : rôles, casier, tickets passés, note',
					'Relance du staff quand un membre attend depuis trop longtemps, et le compte des tickets restés sans réponse par modo',
					'Une demande de ticket en attente se valide ou se refuse depuis le dashboard, et une file d’attente prend le relais quand la limite est atteinte',
					'Un onglet Performance : volumes, délais en médiane, satisfaction, comparés à la période d’avant',
				],
				figure: { screen: 'tickets', caption: 'Le centre de support sur un serveur fictif. Ouvre Paramètres › Inactivité pour la relance du staff' },
			},
			{
				h2: 'Chaque membre a sa fiche complète',
				body: 'Un clic sur un membre ouvre maintenant une page entière plutôt qu’une fenêtre par-dessus la liste',
				items: [
					{
						title: 'En bref',
						body: 'Niveau, réputation, économie, invitations et tickets sur une ligne, avec les signaux qui demandent ton attention',
					},
					{
						title: 'Chronologie',
						body: 'Arrivées, départs, sanctions, tickets, changements de pseudo ou de rôles : toute l’histoire du membre, dans l’ordre',
					},
					{
						title: 'Relations',
						body: 'Qui l’a invité, qui il a invité, ses doubles comptes liés',
					},
					{
						title: 'Salons, catégories, invitations',
						body: 'Leurs fiches ont été refaites sur le même modèle, avec courbes et comparaison à la période d’avant',
					},
				],
			},
			{
				h2: 'Ton serveur a son site',
				body: 'Kotbo crée un site pour ton serveur, à l’adresse dash.kotbo.fr/s/ton-serveur, et le remplit avec ce qui se passe déjà sur Discord',
				points: [
					'Un éditeur visuel où plusieurs membres du staff écrivent en même temps, avec wiki et blog',
					'Des thèmes clair et sombre, et une galerie de thèmes partagés entre serveurs',
					'Une boutique en monnaie du bot, avec commandes validées par le staff, codes promo et abonnements, aussi disponible sur Discord avec /boutique',
					'Les votes Top.gg et annuaires, avec le classement des meilleurs votants',
					'Un forum, propre au site ou relié à un forum Discord',
					'Les annonces du serveur publiées sur le blog toutes seules',
					'Tout se pilote aussi depuis Claude, ChatGPT ou Gemini avec le serveur MCP',
				],
			},
			{
				h2: 'Tester une règle avant de l’activer',
				body: 'Une règle d’AutoMod trop large fait plus de dégâts qu’un spammeur. La 9.5 la rejoue d’abord sur les messages déjà passés',
				items: [
					{
						title: 'Le simulateur',
						body: 'Compare ton brouillon à la règle en service : combien de messages elle aurait touchés, dans quels salons, chez quels membres, avec les exemples surlignés',
					},
					{
						title: 'Censurer au lieu de supprimer',
						body: 'Nouvelle action de l’AutoMod : le message est republié avec le passage masqué, la conversation garde son fil',
					},
					{
						title: 'Le spam à plusieurs',
						body: 'Quand plusieurs membres spamment ensemble, le salon passe en mode lent. Un gros message collé juste après une frappe trop courte est aussi repéré',
					},
					{
						title: 'Les arnaques',
						body: 'Le salon piège nourrit une base de domaines et de textes d’arnaque. Les faux giveaways crypto et les faux recrutements « revenu facile » sont reconnus, et les images peuvent être lues sur place, sans être envoyées à un tiers',
					},
				],
			},
			{
				h2: 'Pulse explique sa note',
				body: 'Le score de santé du serveur a un nouveau calcul, qui tient compte du jour de la semaine, de la taille du serveur, des réponses entre membres et de leur fidélité',
				points: [
					'« Pourquoi cette note » détaille ce qui fait monter ou baisser le score, avec un lien pour agir',
					'Ton score comparé, anonymement, à celui des serveurs de ta taille',
					'Un historique cliquable, et une alerte quand le score chute',
					'Dans Analytics, la fréquentation du site et une section « Ce que Kotbo a fait » dans les rapports programmés',
				],
			},
			{
				h2: 'Et aussi',
				body: 'Le reste de la version, en vrac',
				items: [
					{
						title: 'Notifications refaites',
						body: 'Une seule boîte pour tous tes serveurs, un choix par type de ce que tu reçois, les MP regroupés et un résumé quotidien si tu veux',
					},
					{
						title: 'Webhooks sortants',
						body: 'Les événements du serveur envoyés, signés, vers ton propre outil, avec journal des envois et renvoi',
					},
					{
						title: 'Tests A/B d’accueil',
						body: 'Plusieurs messages de bienvenue répartis au hasard, et celui qui garde le plus de monde au bout de 7 et 30 jours',
					},
					{
						title: 'Fils automatiques',
						body: 'Plusieurs configurations par salon, des conditions, et /fil renommer pour l’auteur du fil',
					},
					{
						title: 'Messages épinglés en bas',
						body: 'Le sticky accepte un message Discord complet en JSON et peut s’afficher sous l’identité d’un webhook',
					},
					{
						title: 'Une seule liste noire',
						body: 'Les membres, rôles et salons exclus des niveaux, du RPG et de l’économie se règlent au même endroit',
					},
					{
						title: 'Image du jour',
						body: 'Un salon où chaque membre poste une image par jour, et rien d’autre',
					},
					{
						title: '/info',
						body: 'Devient une vraie fiche du serveur, avec la version du bot et les modules actifs',
					},
					{
						title: 'Un dashboard qui guide',
						body: 'Chaque écran vide propose la suite, un bouton grisé dit pourquoi, et une suppression se rattrape avec « Annuler »',
					},
				],
			},
			{
				h2: 'Les versions d’avant',
				body: 'Les notes complètes de chaque version sont sur GitHub, dans les releases du dépôt Kotbo-Bot/Kotbo',
				items: [
					{
						title: '9.4, 3 octobre 2026',
						body: 'La Tour, un mode roguelite de fin de jeu pour le RPG. Analytics refait avec temps réel, alertes et rapports programmés. Giveaways sur un seul formulaire avec modèles, et une vingtaine de déclencheurs de workflows en plus',
					},
					{
						title: '9.3.1, 13 septembre 2026',
						body: 'Rappel de bump sans réglage pour Disboard et les autres annuaires, quêtes RPG versées sans /quests claim, et nettoyage des messages de drops terminés',
					},
					{
						title: '9.3, 7 septembre 2026',
						body: 'Le moteur de workflows, les abonnements et cartes cadeaux, les paris de clan, les raids de guilde hebdomadaires et la liaison de salons entre plusieurs serveurs',
					},
					{
						title: '9.2, 14 août 2026',
						body: 'Un module éteint coupe vraiment ses commandes. Arrivée de Prestige, le classement compétitif, de Starlight pour mettre en avant les messages populaires, et de /privacy',
					},
					{
						title: '9.1, 29 juillet 2026',
						body: 'Le Daily en semaines compétitives avec podium, des clans enrichis, plus de garde-fous sur l’économie et l’anti-raid, et /language',
					},
					{
						title: '9.0, 22 juillet 2026',
						body: 'Le bot en français et en anglais, les nouveaux messages Discord sur plus de 25 commandes, /protection et /audit, les clans et les transcriptions de tickets par lien signé',
					},
				],
			},
		],
		final: {
			title: 'Essaie la 9.5 sur ton serveur',
			body: `${TRIAL_DAYS} jours offerts, sans carte bancaire. Toutes les offres contiennent tout le catalogue, nouveautés comprises`,
		},
	},
	en: {
		name: 'What’s new in Kotbo 9.5',
		title: 'Kotbo 9.5: AegisAI, a support-desk ticket inbox, full member profiles and a server website | Kotbo',
		description:
			'What changes in Kotbo 9.5: insult detection by the AegisAI model, support-desk tickets, full member profiles, a website for your server, an AutoMod simulator and a rebuilt Pulse.',
		h1: 'Kotbo 9.5: what changes on your server',
		lead: '9.5 is the biggest update since 9.0. An AI reads the tone of messages, tickets become a real support desk, every member gets a profile page and your server can have its own website. Here is what matters, without the release-notes jargon',
		sections: [
			{
				h2: 'AegisAI catches the insults word lists miss',
				body: 'Kotbo teams up with AegisAI, an API that scores the toxicity and emotion of every message. A banned-word list misses deliberate typos and polite but nasty sentences, AegisAI sees them. The module is turned on server by server, from its page under Security',
				items: [
					{
						title: 'Two thresholds',
						body: 'A very toxic message is deleted and sanctioned on the spot. In the grey zone, staff get a "needs review" card with Confirm and False positive',
					},
					{
						title: 'Evidence with every sanction',
						body: 'The channel transcript is captured before the message is removed. The record keeps the context, not just the reason',
					},
					{
						title: 'Conflicts, harassment, distress',
						body: 'An escalating argument puts the channel in slow mode until it cools down. A member targeted by several others, even over weeks, is flagged. A message of distress quietly alerts staff and never leads to a sanction',
					},
					{
						title: 'Nicknames and edits',
						body: 'A toxic nickname is replaced, and a message edited afterwards is read again like any other',
					},
					{
						title: 'Server climate',
						body: 'A Climate section in Analytics shows toxicity and emotions by hour, channel and member. Every member profile has its own',
					},
					{
						title: 'Mods too',
						body: 'Staff and admins go through the analysis. An exempt member is never sanctioned automatically: their message goes to review',
					},
				],
			},
			{
				h2: 'Tickets become a support desk',
				body: 'The Tickets page was rebuilt after professional support tools: an inbox with views, and every ticket with its own properties',
				points: [
					'"Mine", "unassigned", "waiting on staff" and "overdue" views, with search and sorting',
					'Priority, tags and assignment to a staff member, who can see who is available',
					'Service targets: a first-reply and resolution time, and tickets that miss it rise to the top',
					'The author’s profile next to the conversation, like on Discord: roles, record, past tickets, note',
					'Staff reminders when a member has been waiting too long, and a count of unanswered tickets per mod',
					'A pending ticket request is approved or rejected from the dashboard, and a queue takes over when the limit is reached',
					'A Performance tab: volumes, median times, satisfaction, compared with the previous period',
				],
				figure: { screen: 'tickets', caption: 'The support desk on a demo server. Open Settings › Inactivity for staff reminders' },
			},
			{
				h2: 'Every member gets a full profile',
				body: 'Clicking a member now opens a whole page instead of a window on top of the list',
				items: [
					{
						title: 'At a glance',
						body: 'Level, reputation, economy, invites and tickets on one line, with the signals that need your attention',
					},
					{
						title: 'Timeline',
						body: 'Joins, leaves, sanctions, tickets, nickname or role changes: the member’s whole story, in order',
					},
					{
						title: 'Relations',
						body: 'Who invited them, who they invited, their linked alt accounts',
					},
					{
						title: 'Channels, categories, invites',
						body: 'Their profiles were rebuilt the same way, with charts and a comparison with the previous period',
					},
				],
			},
			{
				h2: 'Your server gets a website',
				body: 'Kotbo builds a website for your server at dash.kotbo.fr/s/your-server, and fills it with what already happens on Discord',
				points: [
					'A visual editor where several staff members write at the same time, with a wiki and a blog',
					'Light and dark themes, and a gallery of themes shared between servers',
					'A shop in the bot’s currency, with staff-approved orders, promo codes and subscriptions, also on Discord with /boutique',
					'Top.gg and directory votes, with a top voters leaderboard',
					'A forum, either the site’s own or linked to a Discord forum',
					'Server announcements posted to the blog on their own',
					'Everything can also be run from Claude, ChatGPT or Gemini through the MCP server',
				],
			},
			{
				h2: 'Test a rule before you turn it on',
				body: 'An AutoMod rule that is too broad does more damage than a spammer. 9.5 replays it on past messages first',
				items: [
					{
						title: 'The simulator',
						body: 'Compare your draft with the rule in service: how many messages it would have hit, in which channels, from which members, with highlighted examples',
					},
					{
						title: 'Censor instead of delete',
						body: 'A new AutoMod action: the message is reposted with the offending part hidden, so the conversation keeps its thread',
					},
					{
						title: 'Group spam',
						body: 'When several members spam together, the channel goes into slow mode. A big pasted message right after suspiciously short typing is caught too',
					},
					{
						title: 'Scams',
						body: 'The honeypot channel feeds a base of scam domains and texts. Fake crypto giveaways and fake "easy money" job offers are recognised, and images can be read on the spot without being sent to a third party',
					},
				],
			},
			{
				h2: 'Pulse explains its score',
				body: 'The server health score has a new formula that accounts for the day of the week, server size, replies between members and how often they come back',
				points: [
					'"Why this score" breaks down what pushes the score up or down, with a link to act on it',
					'Your score compared, anonymously, with servers of the same size',
					'A clickable history, and an alert when the score drops',
					'In Analytics, website traffic and a "What Kotbo did" section in scheduled reports',
				],
			},
			{
				h2: 'Also in this release',
				body: 'The rest of the version, in no particular order',
				items: [
					{
						title: 'Rebuilt notifications',
						body: 'One inbox for all your servers, a per-type choice of what you receive, grouped DMs and an optional daily digest',
					},
					{
						title: 'Outgoing webhooks',
						body: 'Server events sent, signed, to your own tool, with a delivery log and resend',
					},
					{
						title: 'Welcome A/B tests',
						body: 'Several welcome messages handed out at random, and the one that keeps the most people after 7 and 30 days',
					},
					{
						title: 'Auto threads',
						body: 'Several configurations per channel, conditions, and /fil renommer so the author can rename the thread',
					},
					{
						title: 'Sticky messages',
						body: 'The sticky takes a full Discord message as JSON and can be posted under a webhook identity',
					},
					{
						title: 'One blocklist',
						body: 'Members, roles and channels excluded from levels, RPG and economy are set in one place',
					},
					{
						title: 'Image of the day',
						body: 'A channel where each member posts one image a day, and nothing else',
					},
					{
						title: '/info',
						body: 'Now a proper server card, with the bot version and the active modules',
					},
					{
						title: 'A dashboard that guides you',
						body: 'Every empty screen suggests the next step, a greyed-out button says why, and a deletion can be taken back with "Undo"',
					},
				],
			},
			{
				h2: 'Earlier versions',
				body: 'Full notes for every version are on GitHub, in the releases of the Kotbo-Bot/Kotbo repository',
				items: [
					{
						title: '9.4, October 3, 2026',
						body: 'The Tower, an endgame roguelite mode for the RPG. Analytics rebuilt with real time, alerts and scheduled reports. Giveaways on a single form with templates, and some twenty new workflow triggers',
					},
					{
						title: '9.3.1, September 13, 2026',
						body: 'Bump reminders with no setup for Disboard and other directories, RPG quests paid out without /quests claim, and clean-up of finished drop messages',
					},
					{
						title: '9.3, September 7, 2026',
						body: 'The workflow engine, subscriptions and gift cards, clan bets, weekly guild raids and channel links across several servers',
					},
					{
						title: '9.2, August 14, 2026',
						body: 'Turning a module off really removes its commands. Prestige, the competitive ladder, Starlight to highlight popular messages, and /privacy arrive',
					},
					{
						title: '9.1, July 29, 2026',
						body: 'The Daily in competitive weeks with a podium, richer clans, more safeguards on economy and anti-raid, and /language',
					},
					{
						title: '9.0, July 22, 2026',
						body: 'The bot in French and English, the new Discord messages on more than 25 commands, /protection and /audit, clans, and ticket transcripts behind signed links',
					},
				],
			},
		],
		final: {
			title: 'Try 9.5 on your server',
			body: `${TRIAL_DAYS} days free, no credit card. Every plan includes the whole catalog, new features included`,
		},
	},
};

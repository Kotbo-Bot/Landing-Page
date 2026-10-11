/**
 * Les pages par fonctionnalité (`/fonctionnalites/<slug>`, `/en/features/<slug>`).
 *
 * Chacune répond à des recherches que Search Console montre sans clic, faute
 * de page dédiée : « discord automod setup », « alt account checker »,
 * « discord logs », « tickets dashboard ». Le texte décrit ce que le bot fait
 * vraiment ; chaque affirmation se vérifie dans le dépôt produit (services de
 * modération, `dc/`, `advancedLogs.ts`, tickets).
 */
import { TRIAL_DAYS } from '$lib/product';
import type { Locale } from '$lib/i18n/state.svelte';

export interface FeatureSection {
	h2: string;
	body: string;
	points?: string[];
}

export interface FeatureText {
	/** Nom court, pour les liens. */
	name: string;
	/** Balise <title> : la requête visée en tête, moins de 60 signes. */
	title: string;
	description: string;
	h1: string;
	lead: string;
	sections: FeatureSection[];
	faq: { q: string; a: string }[];
}

export interface Feature {
	key: 'automod' | 'alts' | 'logs' | 'tickets' | 'leveling';
	slug: Record<Locale, string>;
	/** Noms du module dans le catalogue de l'accueil, qui lient vers la page. */
	modules: string[];
	text: Record<Locale, FeatureText>;
}

const FREE = {
	fr: {
		q: 'Est-ce gratuit ?',
		a: `Tu as ${TRIAL_DAYS} jours d'essai gratuit, une fois par serveur, pour tout configurer. Ensuite, une seule offre payante ouvre tout le catalogue.`,
	},
	en: {
		q: 'Is it free?',
		a: `You get a ${TRIAL_DAYS}-day free trial, once per server, to set everything up. After that, a single paid plan opens the whole catalog.`,
	},
};

export const FEATURES: Feature[] = [
	{
		key: 'automod',
		slug: { fr: 'automod-discord', en: 'discord-automod' },
		modules: ['AutoMod', 'Protection anti-raid', 'Anti-raid protection'],
		text: {
			fr: {
				name: 'AutoMod et anti-raid',
				title: 'Bot Discord de modération : AutoMod et anti-raid · Kotbo',
				description:
					"Règle l'AutoMod natif de Discord depuis un dashboard, puis ajoute ce qu'il ne fait pas : anti-spam, anti-raid, captcha et salon piège à bots de spam.",
				h1: "Un bot Discord de modération qui règle l'AutoMod pour toi",
				lead: "Kotbo crée pour toi les règles de l'AutoMod natif de Discord, et couvre ce qu'il laisse passer : le spam, les mentions en rafale, les raids et les comptes de spam.",
				sections: [
					{
						h2: 'Les règles natives, sans le menu de Discord',
						body: "Tu actives une règle dans le dashboard, Kotbo l'écrit côté Discord. Elle bloque le message avant sa publication, comme si tu l'avais créée à la main.",
						points: [
							"Mots interdits, avec une liste d'exceptions",
							"Filtres d'insultes, de contenu sexuel et d'injures fournis par Discord",
							"Invitations vers d'autres serveurs, sauf ceux que tu autorises",
							'Au choix : bloquer le message, exclure temporairement ou alerter le staff',
						],
					},
					{
						h2: "Ce que l'AutoMod de Discord ne voit pas",
						body: 'Discord filtre des mots. Kotbo surveille aussi les comportements :',
						points: [
							'Spam : trop de messages en quelques secondes',
							'Liens, avec une liste de domaines autorisés',
							'Messages en majuscules, emojis et mentions en rafale',
							'Ghost pings et @everyone abusifs',
						],
					},
					{
						h2: "Anti-raid : la vague d'arrivées repérée et arrêtée",
						body: "Tu fixes le seuil, par exemple 10 arrivées en 60 secondes. Au-delà, Kotbo passe en mode raid : il bloque les arrivées, impose un captcha ou exclut les nouveaux venus, prévient le staff, puis lève le mode raid tout seul après la durée choisie.",
						points: [
							'Captcha en image, ou en vocal : le bot énonce le code dans un salon vocal',
							'Âge minimal du compte Discord pour entrer',
							'Mode raid à déclencher à la main quand tu sens venir le coup',
						],
					},
					{
						h2: 'Le salon piège contre les comptes de spam',
						body: "Un salon que personne ne lit, où seuls les bots de spam écrivent. Le premier message posté dedans déclenche la sanction que tu as choisie. Le staff et les administrateurs ne sont jamais piégés.",
					},
				],
				faq: [
					{
						q: "Comment configurer l'AutoMod sur Discord ?",
						a: "Dans Discord, l'AutoMod se règle dans les paramètres du serveur, rubrique AutoMod. Avec Kotbo, tu actives les mêmes règles depuis le dashboard : Kotbo les crée côté Discord, et tu règles au même endroit l'anti-spam, l'anti-raid et le captcha.",
					},
					{
						q: "Kotbo remplace-t-il l'AutoMod de Discord ?",
						a: "Non, il s'appuie dessus. Les filtres de mots, d'insultes et d'invitations restent des règles natives de Discord, que Kotbo pilote. Le spam, les liens, les raids et le captcha sont gérés par Kotbo.",
					},
					FREE.fr,
				],
			},
			en: {
				name: 'AutoMod and anti-raid',
				title: 'Discord moderation bot: AutoMod setup and anti-raid · Kotbo',
				description:
					"Set up Discord's native AutoMod rules from a dashboard, then add what it can't do: anti-spam, anti-raid, captcha and a honeypot channel for spam bots.",
				h1: "A Discord moderation bot that sets up AutoMod for you",
				lead: "Kotbo writes Discord's native AutoMod rules for you, and covers what they let through: spam, mass mentions, raids and spam accounts.",
				sections: [
					{
						h2: "Native rules, without Discord's menus",
						body: 'Turn a rule on in the dashboard and Kotbo creates it on Discord. It blocks the message before it is posted, exactly as if you had built it by hand.',
						points: [
							'Blocked words, with an allow list',
							"Discord's profanity, sexual content and slur filters",
							'Invites to other servers, except the ones you allow',
							'Your choice of action: block the message, time the member out, or alert staff',
						],
					},
					{
						h2: "What Discord's AutoMod doesn't catch",
						body: 'Discord filters words. Kotbo also watches behavior:',
						points: [
							'Spam: too many messages in a few seconds',
							'Links, with a list of allowed domains',
							'All-caps messages, emoji floods and mass mentions',
							'Ghost pings and @everyone abuse',
						],
					},
					{
						h2: 'Anti-raid: join waves spotted and stopped',
						body: 'You set the threshold, say 10 joins in 60 seconds. Past it, Kotbo enters raid mode: it locks joins, forces a captcha or kicks newcomers, alerts staff, then lifts raid mode on its own after the time you chose.',
						points: [
							'Image captcha, or voice: the bot reads the code out in a voice channel',
							'Minimum Discord account age to join',
							'Manual raid mode when you see one coming',
						],
					},
					{
						h2: 'A honeypot channel for spam accounts',
						body: 'A channel nobody reads, where only spam bots post. The first message in it triggers the sanction you picked. Staff and administrators are never caught.',
					},
				],
				faq: [
					{
						q: 'How do I set up AutoMod on Discord?',
						a: "In Discord, AutoMod lives in your server settings, under AutoMod. With Kotbo, you turn the same rules on from the dashboard: Kotbo creates them on Discord, and you set up anti-spam, anti-raid and captcha in the same place.",
					},
					{
						q: "Does Kotbo replace Discord's AutoMod?",
						a: "No, it builds on it. Word, profanity and invite filters stay native Discord rules that Kotbo manages. Spam, links, raids and captcha are handled by Kotbo.",
					},
					FREE.en,
				],
			},
		},
	},
	{
		key: 'alts',
		slug: { fr: 'detection-doubles-comptes', en: 'alt-account-detection' },
		modules: ['Doubles comptes', 'Alt accounts'],
		text: {
			fr: {
				name: 'Détection des doubles comptes',
				title: 'Bot Discord anti double compte : détecter les alts · Kotbo',
				description:
					"Kotbo repère les doubles comptes dès leur arrivée : profil, invitations, style d'écriture, horaires, vocal et appareil. Le staff tranche, la détection apprend.",
				h1: "Repérer les doubles comptes avant qu'ils contournent un ban",
				lead: 'Un membre banni revient avec un autre compte ? Kotbo compare chaque nouvel arrivant aux membres déjà présents, et signale au staff les ressemblances qui comptent.',
				sections: [
					{
						h2: 'Ce que Kotbo compare',
						body: "Aucun indice ne suffit seul. Kotbo les combine, et des indices de natures différentes qui concordent pèsent bien plus lourd que deux indices du même genre.",
						points: [
							'Le profil : âge du compte, pseudo proche, même avatar',
							"Qui l'a vraiment invité, y compris quand l'invitation a été validée par le staff",
							"Le style d'écriture, les horaires d'activité, les personnes mentionnées",
							'Deux comptes jamais actifs en même temps, ou qui se relaient en vocal',
							"Avec la vérification par lien : même appareil, même adresse IP ou même réseau, comptes connectés en commun",
						],
					},
					{
						h2: 'Le staff tranche, la détection apprend',
						body: "Kotbo ne bannit pas sur un soupçon. Il propose, et le staff lie les comptes ou écarte l'alerte. Chaque décision ajuste le poids des indices pour ton serveur, et un petit serveur profite de ce que les autres ont déjà appris.",
					},
					{
						h2: 'Les comptes liés, au même endroit',
						body: "Une fois liés, les comptes se consultent ensemble dans le dashboard, avec l'historique de chacun.",
					},
				],
				faq: [
					{
						q: "Comment savoir si quelqu'un a un double compte sur Discord ?",
						a: "Discord ne le montre pas. Les indices sont ailleurs : même façon d'écrire, horaires qui ne se chevauchent jamais, même personne qui invite. Kotbo les relève à chaque arrivée et prévient le staff.",
					},
					{
						q: 'Faut-il une vérification pour que la détection marche ?',
						a: "Non. Les indices de profil et d'invitation marchent sans rien demander aux membres, ceux de comportement dès que l'enregistrement des messages est activé. La vérification par lien ajoute les indices techniques : appareil et adresse IP.",
					},
					{
						q: 'Kotbo est-il une alternative à Double Counter ?',
						a: "Oui pour la détection des alts : Kotbo propose aussi une vérification par lien qui compare appareils et adresses IP, et y ajoute les indices de comportement. La détection fait partie d'un bot complet, avec la modération, les logs et les tickets.",
					},
					FREE.fr,
				],
			},
			en: {
				name: 'Alt account detection',
				title: 'Discord alt detection bot and alt account checker · Kotbo',
				description:
					'Kotbo flags alt accounts as they join: profile, invites, writing style, activity hours, voice and device. Staff decides, and detection learns from it.',
				h1: 'Catch alt accounts before they dodge a ban',
				lead: 'A banned member comes back on another account? Kotbo compares every newcomer with the members already there, and flags the resemblances that matter to staff.',
				sections: [
					{
						h2: 'What Kotbo compares',
						body: 'No single clue is enough. Kotbo combines them, and clues of different kinds that agree weigh far more than two clues of the same kind.',
						points: [
							'Profile: account age, similar username, same avatar',
							'Who actually invited them, even when staff approved the invite',
							'Writing style, activity hours, who they mention',
							'Two accounts never online at the same time, or taking turns in voice',
							'With link verification: same device, same IP or network, shared connected accounts',
						],
					},
					{
						h2: 'Staff decides, detection learns',
						body: 'Kotbo never bans on a hunch. It suggests, and staff links the accounts or dismisses the alert. Each decision tunes the weight of each clue for your server, and small servers benefit from what the others have already learned.',
					},
					{
						h2: 'Linked accounts in one place',
						body: 'Once linked, accounts can be reviewed together in the dashboard, with each one\'s history.',
					},
				],
				faq: [
					{
						q: 'How can I tell if someone has an alt account on Discord?',
						a: "Discord doesn't show it. The clues are elsewhere: the same way of writing, activity hours that never overlap, the same person inviting. Kotbo picks them up on every join and alerts staff.",
					},
					{
						q: 'Does detection need a verification step?',
						a: 'No. Profile and invite clues work without asking members anything, behavior clues as soon as message logging is on. Link verification adds the technical clues: device and IP address.',
					},
					{
						q: 'Is Kotbo an alternative to Double Counter?',
						a: 'For alt detection, yes: Kotbo also offers link verification that compares devices and IP addresses, and adds behavior clues on top. Detection is part of a full bot, with moderation, logs and tickets.',
					},
					FREE.en,
				],
			},
		},
	},
	{
		key: 'logs',
		slug: { fr: 'logs-discord', en: 'discord-logs' },
		modules: ['Logs Discord', 'Discord logs'],
		text: {
			fr: {
				name: 'Logs Discord',
				title: 'Bot de logs Discord : messages supprimés, rôles, vocal · Kotbo',
				description:
					"Un salon de logs complet pour ton serveur Discord : messages supprimés et modifiés, arrivées, rôles, salons, invitations, vocal et journal d'audit, dans un dashboard.",
				h1: 'Un bot de logs Discord qui dit qui a fait quoi',
				lead: "Le journal d'audit de Discord ne garde ni le contenu des messages supprimés, ni plus de 45 jours d'historique. Kotbo enregistre ce qui se passe sur ton serveur, l'envoie dans ton salon de logs et le garde consultable dans le dashboard.",
				sections: [
					{
						h2: 'Ce qui est enregistré',
						body: 'Tout ce qui change sur le serveur, au même endroit :',
						points: [
							'Messages supprimés et modifiés, y compris les suppressions en masse',
							'Arrivées et départs des membres',
							'Rôles et pseudos des membres',
							'Salons et rôles créés, modifiés ou supprimés',
							'Invitations créées et supprimées',
							'Vocal : arrivées, départs et changements de salon',
							"Fils créés et entrées du journal d'audit de Discord",
						],
					},
					{
						h2: 'Les logs de modération, à part',
						body: "Chaque sanction est consignée avec son auteur et sa raison. Si ton staff a son propre serveur, Kotbo peut y recopier les logs de modération.",
					},
					{
						h2: 'Un salon de logs qui reste lisible',
						body: "Tu choisis les salons à ignorer, comme celui des commandes de bots, pour que le salon de logs ne se noie pas. Dans le dashboard, les logs se filtrent par type et se recherchent.",
					},
				],
				faq: [
					{
						q: "Comment voir les logs d'un serveur Discord ?",
						a: "Discord propose un journal d'audit dans les paramètres du serveur, mais il ne garde pas le contenu des messages supprimés et s'efface au bout de 45 jours. Un bot de logs comme Kotbo enregistre tout dans un salon dédié et dans son dashboard.",
					},
					{
						q: 'Comment voir un message supprimé sur Discord ?',
						a: "Discord ne le permet pas. Si Kotbo était sur le serveur au moment de la suppression, le message apparaît dans le salon de logs avec son contenu et son auteur.",
					},
					FREE.fr,
				],
			},
			en: {
				name: 'Discord logs',
				title: 'Discord logging bot: deleted messages and mod log · Kotbo',
				description:
					'A complete log channel for your Discord server: deleted and edited messages, joins, roles, channels, invites, voice and audit log, searchable in a dashboard.',
				h1: 'A Discord logging bot that tells you who did what',
				lead: "Discord's audit log keeps neither the content of deleted messages nor more than 45 days of history. Kotbo records what happens on your server, posts it to your log channel and keeps it searchable in the dashboard.",
				sections: [
					{
						h2: 'What gets logged',
						body: 'Everything that changes on the server, in one place:',
						points: [
							'Deleted and edited messages, bulk deletes included',
							'Member joins and leaves',
							'Member roles and nicknames',
							'Channels and roles created, edited or deleted',
							'Invites created and deleted',
							'Voice: joins, leaves and channel moves',
							"New threads and Discord audit log entries",
						],
					},
					{
						h2: 'A separate mod log',
						body: 'Every sanction is recorded with who issued it and why. If your staff has its own server, Kotbo can mirror the mod log there.',
					},
					{
						h2: 'A log channel that stays readable',
						body: 'Pick the channels to ignore, like the bot commands channel, so the log channel doesn\'t drown. In the dashboard, logs filter by type and are searchable.',
					},
				],
				faq: [
					{
						q: 'How do I check the logs of a Discord server?',
						a: "Discord has an audit log in server settings, but it doesn't keep the content of deleted messages and clears after 45 days. A logging bot like Kotbo records everything in a dedicated channel and in its dashboard.",
					},
					{
						q: 'How can I see a deleted message on Discord?',
						a: "Discord doesn't allow it. If Kotbo was on the server when the message was deleted, it shows up in the log channel with its content and author.",
					},
					FREE.en,
				],
			},
		},
	},
	{
		key: 'tickets',
		slug: { fr: 'tickets-discord', en: 'discord-tickets' },
		modules: ['Tickets support', 'Support tickets'],
		text: {
			fr: {
				name: 'Tickets Discord',
				title: 'Bot ticket Discord avec dashboard et transcripts · Kotbo',
				description:
					'Des tickets Discord gérés depuis un dashboard : types de demandes, formulaire, prise en charge, réponses enregistrées, transcripts, archives et note de satisfaction.',
				h1: 'Un bot ticket Discord que ton staff gère depuis un dashboard',
				lead: 'Les membres ouvrent un ticket depuis Discord. Ton staff les traite depuis une boîte de réception, sans perdre le fil entre dix salons.',
				sections: [
					{
						h2: "Avant l'ouverture",
						body: 'Le ticket arrive déjà trié :',
						points: [
							'Plusieurs types de tickets (support, signalement, partenariat...), chacun avec ses réglages',
							'Un formulaire pour que le membre décrive sa demande dès le départ',
							'Validation par le staff avant la création du salon, si tu le souhaites',
							'Liste noire pour les membres qui abusent',
						],
					},
					{
						h2: 'Pendant',
						body: 'Le staff sait qui s\'en occupe et répond vite :',
						points: [
							'Prise en charge par un membre du staff, visible de tous',
							'Réponses enregistrées pour les questions qui reviennent',
							'Boîte de réception dans le dashboard, avec la fiche du membre à côté',
						],
					},
					{
						h2: 'Après',
						body: 'Rien ne se perd :',
						points: [
							'Transcript de la conversation, consultable dans le dashboard',
							'Archives : le salon reste en lecture seule et peut être rouvert',
							'Note de satisfaction demandée au membre',
							'Statistiques de traitement par membre du staff',
						],
					},
				],
				faq: [
					{
						q: 'Comment faire un système de tickets sur Discord ?',
						a: "Il faut un bot : Discord n'a pas de tickets natifs. Avec Kotbo, tu choisis depuis le dashboard le salon où poster le bouton d'ouverture, les types de demandes et le staff concerné ; le bot ouvre un salon privé pour chaque ticket.",
					},
					{
						q: 'Kotbo remplace-t-il Ticket Tool ?',
						a: 'Oui pour les tickets, et il gère aussi la modération, les logs et le staff dans le même dashboard.',
					},
					FREE.fr,
				],
			},
			en: {
				name: 'Discord tickets',
				title: 'Discord ticket bot with a dashboard · Kotbo',
				description:
					'Discord tickets handled from a dashboard: request types, intake form, claiming, saved replies, transcripts, archives and satisfaction ratings.',
				h1: 'A Discord ticket bot your staff runs from a dashboard',
				lead: 'Members open a ticket from Discord. Your staff works through them from an inbox, without losing track across ten channels.',
				sections: [
					{
						h2: 'Before it opens',
						body: 'Tickets arrive already sorted:',
						points: [
							'Several ticket types (support, report, partnership...), each with its own settings',
							'An intake form so the member explains the request up front',
							'Staff approval before the channel is created, if you want it',
							'A blacklist for members who abuse it',
						],
					},
					{
						h2: 'While it runs',
						body: 'Staff knows who has it and answers fast:',
						points: [
							'Claimed by one staff member, visible to all',
							'Saved replies for questions that keep coming back',
							"A dashboard inbox, with the member's profile alongside",
						],
					},
					{
						h2: 'After',
						body: 'Nothing gets lost:',
						points: [
							'A transcript of the conversation, viewable in the dashboard',
							'Archives: the channel stays read-only and can be reopened',
							'A satisfaction rating asked from the member',
							'Handling stats per staff member',
						],
					},
				],
				faq: [
					{
						q: 'How do I set up a ticket system on Discord?',
						a: "You need a bot: Discord has no native tickets. With Kotbo, you pick from the dashboard the channel for the open button, the request types and the staff in charge; the bot opens a private channel for each ticket.",
					},
					{
						q: 'Does Kotbo replace Ticket Tool?',
						a: 'For tickets, yes, and it also handles moderation, logs and staff in the same dashboard.',
					},
					FREE.en,
				],
			},
		},
	},
	{
		key: 'leveling',
		slug: { fr: 'niveaux-xp', en: 'leveling-xp' },
		modules: ['Leveling & XP', 'Saisons', 'Seasons'],
		text: {
			fr: {
				name: 'Niveaux et XP',
				title: "Bot Discord de niveaux et d'XP avec carte de rang · Kotbo",
				description:
					"Un bot Discord de niveaux : XP pour les messages et le vocal, rôles de récompense, classements automatiques, saisons et carte de rang personnalisable.",
				h1: "Un bot Discord de niveaux qui récompense l'activité réelle",
				lead: "Les membres gagnent de l'XP en écrivant et en parlant en vocal. Kotbo écarte ce qui ne compte pas, et transforme les niveaux en rôles, en classements et en saisons.",
				sections: [
					{
						h2: "De l'XP qui ne se farme pas",
						body: 'Tu règles ce qui rapporte, et ce qui ne rapporte rien :',
						points: [
							"Délai entre deux gains d'XP, pour que le spam ne paie pas",
							'Bonus pour les messages longs, plafonné',
							'XP en vocal, seulement micro et son ouverts, hors salon AFK, à partir du nombre de membres choisi',
							'Salons et rôles exclus, multiplicateurs pour ceux que tu veux mettre en avant',
						],
					},
					{
						h2: 'Des niveaux qui débloquent quelque chose',
						body: 'Chaque palier peut donner un rôle, cumulable ou non avec les précédents. Des classements se publient tout seuls (messages, vocal ou XP), et les saisons remettent les compteurs à zéro en gardant les palmarès.',
					},
					{
						h2: 'La carte de rang, à leur image',
						body: "Chaque membre personnalise sa carte de rang (fond, couleurs, succès débloqués). Tu peux l'essayer sur l'accueil de ce site.",
					},
				],
				faq: [
					{
						q: 'Comment mettre un système de niveaux sur Discord ?',
						a: "Discord n'en a pas : il faut un bot. Avec Kotbo, tu actives le module Leveling depuis le dashboard, tu fixes les gains d'XP et les rôles de récompense, et les membres voient leur progression avec la commande de rang.",
					},
					{
						q: "Kotbo est-il une alternative à MEE6 pour les niveaux ?",
						a: "Oui : XP pour les messages et le vocal, rôles de récompense, classements et carte de rang, avec en plus les saisons. Et le même bot gère la modération, les tickets et les logs.",
					},
					FREE.fr,
				],
			},
			en: {
				name: 'Levels and XP',
				title: 'Discord leveling bot with XP and rank cards · Kotbo',
				description:
					'A Discord leveling bot: XP for messages and voice, reward roles, automatic leaderboards, seasons and a customizable rank card.',
				h1: 'A Discord leveling bot that rewards real activity',
				lead: 'Members earn XP by chatting and talking in voice. Kotbo filters out what shouldn\'t count, and turns levels into roles, leaderboards and seasons.',
				sections: [
					{
						h2: "XP that can't be farmed",
						body: "You decide what earns XP, and what doesn't:",
						points: [
							'A cooldown between XP gains, so spam never pays',
							'A capped bonus for longer messages',
							'Voice XP only while unmuted and undeafened, outside the AFK channel, from the member count you choose',
							'Excluded channels and roles, multipliers for the ones you want to highlight',
						],
					},
					{
						h2: 'Levels that unlock something',
						body: 'Each level can grant a role, stacking with earlier ones or not. Leaderboards post themselves (messages, voice or XP), and seasons reset the counters while keeping the hall of fame.',
					},
					{
						h2: 'A rank card that looks like them',
						body: 'Every member customizes their rank card (background, colors, unlocked achievements). You can try it on this site\'s home page.',
					},
				],
				faq: [
					{
						q: 'How do I add a leveling system to Discord?',
						a: "Discord doesn't have one: you need a bot. With Kotbo, turn on the Leveling module from the dashboard, set XP gains and reward roles, and members follow their progress with the rank command.",
					},
					{
						q: 'Is Kotbo an alternative to MEE6 for levels?',
						a: 'Yes: XP for messages and voice, reward roles, leaderboards and rank cards, plus seasons. And the same bot handles moderation, tickets and logs.',
					},
					FREE.en,
				],
			},
		},
	},
];

/**
 * La page qui rassemble les autres (`/fonctionnalites`, `/en/features`). Elle
 * vise la requête de tête, « bot Discord », et ses variantes génériques :
 * tout-en-un, français, de modération, avec dashboard.
 */
export const HUB: Record<Locale, { title: string; description: string; h1: string; lead: string; why: FeatureSection; faq: { q: string; a: string }[] }> = {
	fr: {
		title: 'Bot Discord français tout-en-un : les fonctionnalités · Kotbo',
		description:
			"Kotbo, le bot Discord tout-en-un : modération, AutoMod, anti-raid, logs, tickets, niveaux, économie et gestion du staff, réglés depuis un seul dashboard.",
		h1: 'Un bot Discord tout-en-un, réglé depuis un dashboard',
		lead: "Modération, logs, tickets, niveaux, staff : Kotbo remplace la pile de bots qu'on empile sur un serveur, et se règle depuis un dashboard web plutôt qu'à coups de commandes.",
		why: {
			h2: 'Pourquoi un seul bot plutôt que cinq ?',
			body: "Un bot de modération, un bot de tickets, un bot de niveaux, un bot de logs : chacun a ses permissions, ses commandes et son abonnement. Avec un bot Discord tout-en-un, les modules se parlent :",
			points: [
				"La fiche d'un membre réunit ses sanctions, ses tickets, son niveau et ses comptes liés",
				'Un seul jeu de permissions à confier, un seul dashboard à apprendre',
				'Une seule offre payante, qui ouvre tout le catalogue',
				'Un bot français, créé et hébergé dans l\'Union européenne',
			],
		},
		faq: [
			{
				q: 'Quel bot Discord choisir pour gérer un serveur ?',
				a: "Ça dépend de ce que tu veux gérer. Pour un seul besoin, un bot spécialisé suffit. Dès que tu cumules modération, tickets, logs et niveaux, un bot tout-en-un comme Kotbo évite d'empiler les bots et les abonnements.",
			},
			{
				q: 'Kotbo est-il un bot Discord français ?',
				a: "Oui. Kotbo est conçu en France, hébergé dans l'Union européenne, et parle français comme anglais, dans Discord comme dans le dashboard.",
			},
			FREE.fr,
		],
	},
	en: {
		title: 'All-in-one Discord bot with a dashboard: features · Kotbo',
		description:
			'Kotbo, the all-in-one Discord bot: moderation, AutoMod, anti-raid, logs, tickets, levels, economy and staff management, set up from a single dashboard.',
		h1: 'An all-in-one Discord bot, set up from a dashboard',
		lead: 'Moderation, logs, tickets, levels, staff: Kotbo replaces the stack of bots servers pile up, and is configured from a web dashboard rather than with commands.',
		why: {
			h2: 'Why one bot instead of five?',
			body: 'A moderation bot, a ticket bot, a leveling bot, a logging bot: each with its own permissions, commands and subscription. With an all-in-one Discord bot, the modules talk to each other:',
			points: [
				"A member's profile brings together their sanctions, tickets, level and linked accounts",
				'One set of permissions to grant, one dashboard to learn',
				'A single paid plan that opens the whole catalog',
				'Built and hosted in the European Union',
			],
		},
		faq: [
			{
				q: 'Which Discord bot should I use to run a server?',
				a: "It depends on what you need. For a single job, a specialized bot is enough. Once you combine moderation, tickets, logs and levels, an all-in-one bot like Kotbo saves you from stacking bots and subscriptions.",
			},
			{
				q: 'Does Kotbo work in English?',
				a: 'Yes. Kotbo speaks English and French, in Discord and in the dashboard.',
			},
			FREE.en,
		],
	},
};

export function featureBySlug(slug: string, locale: Locale): Feature | undefined {
	return FEATURES.find((f) => f.slug[locale] === slug);
}

/** La page d'un module du catalogue, s'il en a une. */
export function featureOfModule(name: string): Feature | undefined {
	return FEATURES.find((f) => f.modules.includes(name));
}

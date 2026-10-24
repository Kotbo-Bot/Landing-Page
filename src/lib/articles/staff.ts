/**
 * L'article « gestion du staff Discord », écrit dans ce dépôt plutôt que dans
 * la console : il montre les vrais écrans du dashboard (`figure`), que les
 * pages de la console n'ont pas.
 *
 * Il répond à une recherche précise, « comment gérer le staff de mon serveur
 * Discord », et c'est là que Kotbo se distingue des bots de modération. Chaque
 * phrase décrit une fonction qui existe : le registre des modules du bot et
 * ses outils MCP font foi. Les questions vivent dans `seo/faq.js`
 * (`STAFF_FAQ`), le titre et la description aussi dans `seo/jsonld.js`.
 *
 * Le texte est une donnée, comme celui des pages de la console : la page
 * (`pages/StaffPage.svelte`), l'index des articles et le temps de lecture le
 * lisent.
 */
import type { Locale } from '$lib/i18n/state.svelte';
import { TRIAL_DAYS } from '$lib/product';

export interface ArticleItem {
	title: string;
	body: string;
	/**
	 * L'article de la console qui détaille ce point, par sa clé : le lien
	 * disparaît si la page n'est plus publiée.
	 */
	link?: { feature: string; label: string };
}

export interface ArticleSection {
	h2: string;
	body: string;
	/** Points simples, comme ceux des pages de la console. */
	points?: string[];
	/** Points titrés. */
	items?: ArticleItem[];
	/** Étapes, dans l'ordre. */
	steps?: ArticleItem[];
	/** L'écran du dashboard qui suit le texte. */
	figure?: { screen: 'staff' | 'sanctions' | 'tickets'; caption: string };
}

export interface StaffArticle {
	name: string;
	title: string;
	description: string;
	h1: string;
	lead: string;
	sections: ArticleSection[];
	final: { title: string; body: string };
}

export const STAFF_ARTICLE: Record<Locale, StaffArticle> = {
	fr: {
		name: 'Gestion du staff Discord',
		title: 'Gestion du staff Discord : absences, recrutement, évaluations | Kotbo',
		description:
			'Gère l’équipe de modération de ton serveur Discord : hiérarchies, absences, réunions, évaluations, recrutement, casier des sanctions et doubles comptes.',
		h1: 'Ton équipe de modération, gérée comme une équipe',
		lead: 'Kotbo est un bot Discord français avec un dashboard web. Il modère, et il tient aussi ton staff : hiérarchies et grades, absences, réunions, tâches, évaluations et recrutement. Côté membres, chaque sanction et chaque double compte reste dans un dossier',
		sections: [
			{
				h2: 'Ce qu’un responsable de staff fait à la main, au même endroit',
				body: 'Sans outil, le staff vit dans un salon #absences, un tableur de grades et des MP. Dans Kotbo, chaque modo a sa fiche et chaque décision laisse une trace',
				items: [
					{
						title: 'Hiérarchies et grades',
						body: 'Modération, Animation, Support : chaque hiérarchie a son rôle Discord, son responsable et ses grades. Promouvoir ou retirer un modo met ses rôles à jour',
					},
					{
						title: 'Absences',
						body: 'Le modo déclare ses dates, le type d’absence et le motif. Son supérieur l’approuve ou la refuse, et le calendrier du staff montre qui est là',
					},
					{
						title: 'Réunions',
						body: 'Une réunion se planifie dans le dashboard avec sa date et son ordre du jour, et le staff en est prévenu dans Discord',
					},
					{
						title: 'Tâches',
						body: 'Assigne une tâche à un modo avec une priorité et une échéance, et suis-la jusqu’à ce qu’elle soit terminée',
					},
					{
						title: 'Sondages staff',
						body: 'Fais voter l’équipe sur une décision, en anonyme si besoin, avec une date de clôture',
					},
					{
						title: 'Évaluations',
						body: 'Une évaluation de performance par modo, ou pour tout le staff, sur 7 à 365 jours. Le manager y ajoute sa note',
					},
					{
						title: 'Discipline et notes',
						body: 'Avertissements staff et notes privées du manager restent sur la fiche du modo. Une promotion se décide sur un historique, pas sur un souvenir',
					},
					{
						title: 'Tutorat et formation',
						body: 'Les nouveaux modos sont accompagnés par un tuteur pendant leur période de test',
					},
				],
				figure: { screen: 'staff', caption: 'L’équipe dans le dashboard : qui bosse, qui est en période d’essai, qui a pris un avertissement' },
			},
			{
				h2: 'Recruter sans perdre les candidatures dans un salon',
				body: 'Le recrutement passe par un formulaire plutôt que par un salon où les candidatures se noient',
				steps: [
					{
						title: 'Crée le formulaire',
						body: 'Questions libres, choix multiples, connexion Discord obligatoire pour savoir qui postule',
					},
					{
						title: 'Lis les candidatures',
						body: 'Les réponses arrivent dans le dashboard, une par candidat, au lieu de s’empiler dans un salon',
					},
					{
						title: 'Embauche',
						body: 'Le formulaire est rattaché à une hiérarchie : le candidat retenu reçoit le rôle de cette hiérarchie',
					},
				],
			},
			{
				h2: 'Chaque membre a un dossier',
				body: 'La gestion du staff ne s’arrête pas à l’équipe : les décisions qu’elle prend sur les membres sont gardées, avec leurs preuves',
				items: [
					{
						title: 'Casier des sanctions',
						body: 'Chaque sanction garde son motif, son auteur et ses preuves (captures, transcriptions). L’historique complet d’un membre est sur sa fiche',
					},
					{
						title: 'Doubles comptes',
						body: 'Kotbo compare chaque arrivant aux membres présents et signale les ressemblances. Le staff lie les comptes ou écarte l’alerte : un membre sanctionné qui revient sous un autre pseudo ne repart pas de zéro',
						link: { feature: 'double_accounts', label: 'Comment la détection fonctionne' },
					},
					{
						title: 'Appels de bannissement',
						body: 'Un membre banni fait appel par formulaire. Le staff peut demander des précisions, décide avec le dossier sous les yeux et bloque les appels abusifs',
					},
					{
						title: 'AutoMod et anti-raid',
						body: 'Mots interdits, règles par expression régulière et protection anti-raid filtrent avant que le staff ait à intervenir',
						link: { feature: 'automod', label: 'Régler l’AutoMod' },
					},
				],
				figure: { screen: 'sanctions', caption: 'Les sanctions dans le dashboard : motif, auteur et preuves, six mois plus tard encore' },
			},
		],
		final: {
			title: 'Essaie-le avec ton équipe',
			body: `${TRIAL_DAYS} jours d’essai, une fois par serveur. Toutes les offres contiennent tout le catalogue, à partir de 5 € HT par mois`,
		},
	},
	en: {
		name: 'Discord staff management',
		title: 'Discord staff management: absences, recruitment, reviews | Kotbo',
		description:
			"Run your Discord server's moderation team: hierarchies, absences, meetings, reviews, recruitment, sanction records and alt accounts.",
		h1: 'Your moderation team, run like a team',
		lead: 'Kotbo is a French Discord bot with a web dashboard. It moderates, and it also runs your staff: hierarchies and ranks, absences, meetings, tasks, reviews and recruitment. On the member side, every sanction and every alt account stays on file',
		sections: [
			{
				h2: 'What a staff lead does by hand, in one place',
				body: 'Without a tool, staff lives in an #absences channel, a spreadsheet of ranks and DMs. In Kotbo, every mod has a profile and every decision leaves a record',
				items: [
					{
						title: 'Hierarchies and ranks',
						body: 'Moderation, Events, Support: each hierarchy has its Discord role, its lead and its ranks. Promoting or removing a mod updates their roles',
					},
					{
						title: 'Absences',
						body: 'The mod reports their dates, the type of absence and the reason. Their superior approves or rejects it, and the staff calendar shows who is around',
					},
					{
						title: 'Meetings',
						body: 'A meeting is scheduled in the dashboard with its date and agenda, and staff are notified in Discord',
					},
					{
						title: 'Tasks',
						body: 'Assign a task to a mod with a priority and a due date, and follow it until it is done',
					},
					{
						title: 'Staff polls',
						body: 'Let the team vote on a decision, anonymously if needed, with a closing date',
					},
					{
						title: 'Reviews',
						body: 'A performance review per mod, or for the whole staff, over 7 to 365 days. The manager adds their note',
					},
					{
						title: 'Discipline and notes',
						body: "Staff warnings and the manager's private notes stay on the mod's profile. A promotion is decided on a record, not a memory",
					},
					{
						title: 'Mentoring and training',
						body: 'New mods are paired with a mentor during their trial period',
					},
				],
				figure: { screen: 'staff', caption: 'The team in the dashboard: who actually works, who is on probation, who got a warning' },
			},
			{
				h2: 'Recruit without losing applications in a channel',
				body: 'Recruitment goes through a form instead of a channel where applications get buried',
				steps: [
					{
						title: 'Build the form',
						body: "Open questions, multiple choice, mandatory Discord login so you know who's applying",
					},
					{
						title: 'Read the applications',
						body: 'Answers land in the dashboard, one per applicant, instead of piling up in a channel',
					},
					{
						title: 'Hire',
						body: "The form is attached to a hierarchy: the chosen applicant gets that hierarchy's role",
					},
				],
			},
			{
				h2: 'Every member has a file',
				body: "Staff management doesn't stop at the team: the decisions it makes about members are kept, with their evidence",
				items: [
					{
						title: 'Sanction records',
						body: "Every sanction keeps its reason, its author and its evidence (screenshots, transcripts). A member's full history sits on their profile",
					},
					{
						title: 'Alt accounts',
						body: 'Kotbo compares each newcomer with current members and flags resemblances. Staff link the accounts or dismiss the alert: a sanctioned member who comes back under another name does not start from scratch',
						link: { feature: 'double_accounts', label: 'How detection works' },
					},
					{
						title: 'Ban appeals',
						body: 'A banned member appeals through a form. Staff can ask for details, decide with the file in front of them and block abusive appeals',
					},
					{
						title: 'AutoMod and anti-raid',
						body: 'Banned words, regular-expression rules and anti-raid protection filter before staff need to step in',
						link: { feature: 'automod', label: 'Set up AutoMod' },
					},
				],
				figure: { screen: 'sanctions', caption: 'Sanctions in the dashboard: reason, author and proof, still there six months later' },
			},
		],
		final: {
			title: 'Try it with your team',
			body: `${TRIAL_DAYS}-day trial, once per server. Every plan includes the whole catalog, from €5 per month excl. VAT`,
		},
	},
};

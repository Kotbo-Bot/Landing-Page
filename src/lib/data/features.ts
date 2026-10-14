/**
 * Les pages par fonctionnalité (`/fonctionnalites/<slug>`, `/en/features/<slug>`).
 *
 * Elles se rédigent dans la console admin du dashboard (dash.kotbo.fr,
 * `/admin/feature-pages`), sur le modèle des pages par plugin de MEE6. Au build,
 * `scripts/fetch-features.mjs` lit les pages publiées sur
 * `api.kotbo.fr/api/public/feature-pages` et les écrit dans
 * `feature-pages.json` : le site reste statique, chaque page sort prérendue.
 * Si l'API ne répond pas, le fichier du dépôt sert tel quel : le site garde
 * ses pages du dernier build réussi.
 *
 * Chaque page répond à des recherches que Search Console montre sans clic,
 * faute de page dédiée. Le texte décrit ce que le bot fait vraiment : il se
 * vérifie dans le dépôt produit avant d'être publié.
 */
import { FREE_FAQ, HUB_FAQ } from '$lib/seo/faq.js';
import type { Locale } from '$lib/i18n/state.svelte';
import pages from './feature-pages.json';

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
	/** Clé du module dans le registre du bot, ou clé libre. */
	key: string;
	slug: Record<Locale, string>;
	/** Noms du module dans le catalogue de l'accueil, qui lient vers la page. */
	modules: string[];
	text: Record<Locale, FeatureText>;
}

/**
 * Les pages publiées, dans l'ordre choisi dans la console. La question sur la
 * gratuité (`seo/faq.js`, que le JSON-LD reprend aussi) est ajoutée ici à
 * chaque page : elle n'a pas à être recopiée dans chaque fiche.
 */
export const FEATURES: Feature[] = (pages.pages as Feature[]).map((page) => ({
	...page,
	text: {
		fr: { ...page.text.fr, faq: [...page.text.fr.faq, FREE_FAQ.fr] },
		en: { ...page.text.en, faq: [...page.text.en.faq, FREE_FAQ.en] },
	},
}));

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
		faq: HUB_FAQ.fr,
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
		faq: HUB_FAQ.en,
	},
};

export function featureBySlug(slug: string, locale: Locale): Feature | undefined {
	return FEATURES.find((f) => f.slug[locale] === slug);
}

/** La page d'un module du catalogue, s'il en a une. */
export function featureOfModule(name: string): Feature | undefined {
	return FEATURES.find((f) => f.modules.includes(name));
}

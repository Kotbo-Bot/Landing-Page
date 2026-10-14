/**
 * Les articles du site, dans l'ordre où l'index les montre.
 *
 * L'article « gestion du staff » (`staff.ts`) est épinglé en tête : c'est ce
 * que Kotbo fait et que les bots de modération ne font pas. Suivent les pages
 * de la console (`data/features.ts`), dans l'ordre choisi là-bas.
 *
 * Le temps de lecture se compte sur le texte réel de l'article (chapeau,
 * sections, FAQ), à 220 mots par minute.
 */
import type { Locale } from '$lib/i18n/state.svelte';
import { featurePath, STAFF_ROUTE } from '$lib/i18n/routes';
import { FEATURES } from '$lib/data/features';
import { featureIcon } from '$lib/data/featureIcons';
import { STAFF_FAQ } from '$lib/seo/faq.js';
import { STAFF_ARTICLE, type ArticleSection } from './staff';

export interface Post {
	key: string;
	path: Record<Locale, string>;
	/** Emoji du bot (`static/ktb/`). */
	icon: string;
	pinned: boolean;
	text: Record<Locale, { name: string; h1: string; description: string; minutes: number }>;
}

const WORDS_PER_MINUTE = 220;

function words(text: string): number {
	return text.split(/\s+/).filter(Boolean).length;
}

function sectionWords(section: ArticleSection): number {
	const lists = [...(section.items ?? []), ...(section.steps ?? [])];
	return (
		words(section.h2) +
		words(section.body) +
		(section.points ?? []).reduce((n, p) => n + words(p), 0) +
		lists.reduce((n, item) => n + words(item.title) + words(item.body), 0)
	);
}

export function readingMinutes(lead: string, sections: ArticleSection[], faq: ReadonlyArray<{ q: string; a: string }>): number {
	const total = words(lead) + sections.reduce((n, s) => n + sectionWords(s), 0) + faq.reduce((n, f) => n + words(f.q) + words(f.a), 0);
	return Math.max(1, Math.round(total / WORDS_PER_MINUTE));
}

const STAFF_POST: Post = {
	key: 'staff',
	path: STAFF_ROUTE,
	icon: 'crown',
	pinned: true,
	text: {
		fr: {
			name: STAFF_ARTICLE.fr.name,
			h1: STAFF_ARTICLE.fr.h1,
			description: STAFF_ARTICLE.fr.description,
			minutes: readingMinutes(STAFF_ARTICLE.fr.lead, STAFF_ARTICLE.fr.sections, STAFF_FAQ.fr),
		},
		en: {
			name: STAFF_ARTICLE.en.name,
			h1: STAFF_ARTICLE.en.h1,
			description: STAFF_ARTICLE.en.description,
			minutes: readingMinutes(STAFF_ARTICLE.en.lead, STAFF_ARTICLE.en.sections, STAFF_FAQ.en),
		},
	},
};

export const POSTS: Post[] = [
	STAFF_POST,
	...FEATURES.map((f) => ({
		key: f.key,
		path: { fr: featurePath(f.slug, 'fr'), en: featurePath(f.slug, 'en') },
		icon: featureIcon(f.key),
		pinned: false,
		text: {
			fr: { name: f.text.fr.name, h1: f.text.fr.h1, description: f.text.fr.description, minutes: readingMinutes(f.text.fr.lead, f.text.fr.sections, f.text.fr.faq) },
			en: { name: f.text.en.name, h1: f.text.en.h1, description: f.text.en.description, minutes: readingMinutes(f.text.en.lead, f.text.en.sections, f.text.en.faq) },
		},
	})),
];

/**
 * Trois autres articles, ceux qui suivent dans l'ordre de l'index (en
 * reprenant au début) : chaque article en lie d'autres, et tous finissent
 * liés, sans aligner tout l'index sous chacun.
 */
export function relatedTo(key: string, count = 3): Post[] {
	const index = POSTS.findIndex((p) => p.key === key);
	const others = index < 0 ? POSTS : [...POSTS.slice(index + 1), ...POSTS.slice(0, index)];
	return others.slice(0, count);
}

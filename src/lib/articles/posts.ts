/**
 * Les articles du site, dans l'ordre où l'index les montre.
 *
 * L'article « gestion du staff » (`staff.ts`) est épinglé en tête : c'est ce
 * que Kotbo fait et que les bots de modération ne font pas. La note de la
 * dernière version le suit, épinglée elle aussi, puis les pages de la console
 * (`data/features.ts`), dans l'ordre choisi là-bas. Les notes de version ont
 * leur propre liste (`RELEASE_POSTS`), celle de `/nouveautes`.
 *
 * Le temps de lecture se compte sur le texte réel de l'article (chapeau,
 * sections, FAQ), à 220 mots par minute.
 */
import type { Locale } from '$lib/i18n/state.svelte';
import { blogPath, featurePath, releasePath, STAFF_ROUTE } from '$lib/i18n/routes';
import { FEATURES } from '$lib/data/features';
import { featureIcon } from '$lib/data/featureIcons';
import { STAFF_FAQ } from '$lib/seo/faq.js';
import { STAFF_ARTICLE, type ArticleSection } from './staff';
import { RELEASES, type Release } from './releases.js';
import { BLOG } from './blog.js';

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

export function releaseKey(release: Release): string {
	return `release-${release.slug}`;
}

function releasePost(release: Release, pinned = false): Post {
	const text = (locale: Locale) => {
		const t = release.text[locale];
		return { name: `Kotbo ${release.version}`, h1: t.h1, description: t.description, minutes: readingMinutes(t.lead, t.sections, t.faq ?? []) };
	};
	return {
		key: releaseKey(release),
		path: { fr: releasePath(release.slug, 'fr'), en: releasePath(release.slug, 'en') },
		icon: 'news',
		pinned,
		text: { fr: text('fr'), en: text('en') },
	};
}

/** Les notes de version, de la plus récente à la plus ancienne. */
export const RELEASE_POSTS: Post[] = RELEASES.map((release) => releasePost(release));

/** Les billets du blog, du plus récent au plus ancien. */
export const BLOG_POSTS: Post[] = BLOG.map((b) => {
	const text = (locale: Locale) => {
		const t = b.text[locale];
		return { name: t.h1, h1: t.h1, description: t.description, minutes: readingMinutes(t.lead, t.sections, t.faq ?? []) };
	};
	return {
		key: `blog-${b.slug}`,
		path: { fr: blogPath(b.slug, 'fr'), en: blogPath(b.slug, 'en') },
		icon: 'msg',
		pinned: false,
		text: { fr: text('fr'), en: text('en') },
	};
});

export const POSTS: Post[] = [
	STAFF_POST,
	releasePost(RELEASES[0], true),
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
 * Trois autres articles, ceux qui suivent dans l'ordre de la liste (en
 * reprenant au début) : chaque article en lie d'autres, et tous finissent
 * liés, sans aligner tout l'index sous chacun. Une note de version mène aux
 * versions d'avant.
 */
export function relatedTo(key: string, count = 3, posts: Post[] = POSTS): Post[] {
	const index = posts.findIndex((p) => p.key === key);
	const others = index < 0 ? posts : [...posts.slice(index + 1), ...posts.slice(0, index)];
	return others.slice(0, count);
}

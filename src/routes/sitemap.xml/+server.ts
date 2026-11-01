import { SITE_URL } from '$lib/product';
import { BLOG_ROUTE, HOME_ROUTE, STAFF_ROUTE, UPDATES_ROUTE, blogPath, featurePath, releasePath } from '$lib/i18n/routes';
import { FEATURES } from '$lib/data/features';
import { RELEASES } from '$lib/articles/releases.js';
import { BLOG, blogSlug } from '$lib/articles/blog.js';

/**
 * Le sitemap, prérendu au build. Il suit les pages fonctionnalités publiées
 * depuis le dashboard (`data/feature-pages.json`) : une page publiée y entre
 * au build suivant, sans retouche à la main.
 *
 * Chaque page bilingue cite ses deux versions, le français servant de défaut.
 */
export const prerender = true;

type Entry = { path: string; changefreq: string; priority: string; pair?: { fr: string; en: string } };

function bilingual(pair: { fr: string; en: string }, changefreq: string, fr: string, en: string): Entry[] {
	return [
		{ path: pair.fr, changefreq, priority: fr, pair },
		{ path: pair.en, changefreq, priority: en, pair },
	];
}

function entries(): Entry[] {
	return [
		...bilingual(HOME_ROUTE, 'weekly', '1.0', '0.9'),
		...bilingual(STAFF_ROUTE, 'monthly', '0.9', '0.9'),
		...bilingual(UPDATES_ROUTE, 'weekly', '0.8', '0.7'),
		...RELEASES.flatMap((release) =>
			bilingual({ fr: releasePath(release.slug, 'fr'), en: releasePath(release.slug, 'en') }, 'yearly', '0.6', '0.5'),
		),
		...bilingual(BLOG_ROUTE, 'weekly', '0.7', '0.6'),
		...BLOG.flatMap((post) => bilingual({ fr: blogPath(blogSlug(post, 'fr'), 'fr'), en: blogPath(blogSlug(post, 'en'), 'en') }, 'yearly', '0.6', '0.5')),
		...bilingual({ fr: '/fonctionnalites', en: '/en/features' }, 'monthly', '0.9', '0.8'),
		...FEATURES.flatMap((feature) =>
			bilingual({ fr: featurePath(feature.slug, 'fr'), en: featurePath(feature.slug, 'en') }, 'monthly', '0.8', '0.7'),
		),
		{ path: '/demo/', changefreq: 'monthly', priority: '0.7' },
		{ path: '/terms', changefreq: 'yearly', priority: '0.2' },
		{ path: '/cookies', changefreq: 'yearly', priority: '0.2' },
		{ path: '/dpa', changefreq: 'yearly', priority: '0.2' },
		{ path: '/admin-notice', changefreq: 'yearly', priority: '0.1' },
		{ path: '/privacy', changefreq: 'yearly', priority: '0.3' },
		{ path: '/cgv', changefreq: 'yearly', priority: '0.2' },
		{ path: '/mentions-legales', changefreq: 'yearly', priority: '0.1' },
	];
}

function render(entry: Entry): string {
	const alternates = entry.pair
		? [
				`    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}${entry.pair.fr}"/>`,
				`    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${entry.pair.en}"/>`,
				`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${entry.pair.fr}"/>`,
			]
		: [];
	return [
		'  <url>',
		`    <loc>${SITE_URL}${entry.path}</loc>`,
		...alternates,
		`    <changefreq>${entry.changefreq}</changefreq>`,
		`    <priority>${entry.priority}</priority>`,
		'  </url>',
	].join('\n');
}

export function GET(): Response {
	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...entries().map(render),
		'</urlset>',
		'',
	].join('\n');
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

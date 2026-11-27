/**
 * Génération des flux RSS 2.0 prérendus au build pour le blog (`/blog/rss.xml`,
 * `/en/blog/rss.xml`) et les notes de version (`/nouveautes/rss.xml`,
 * `/en/whats-new/rss.xml`).
 */
import type { Locale } from '$lib/i18n/state.svelte';
import { SITE_URL } from '$lib/product';
import { BLOG_ROUTE, UPDATES_ROUTE, blogPath, releasePath } from '$lib/i18n/routes';
import { BLOG, blogSlug } from '$lib/articles/blog.js';
import { RELEASES } from '$lib/articles/releases.js';

export const BLOG_RSS_ROUTE: Record<Locale, string> = {
	fr: '/blog/rss.xml',
	en: '/en/blog/rss.xml',
};

export const UPDATES_RSS_ROUTE: Record<Locale, string> = {
	fr: '/nouveautes/rss.xml',
	en: '/en/whats-new/rss.xml',
};

interface RssItem {
	title: string;
	link: string;
	guid: string;
	pubDate: string;
	description: string;
	author?: string;
	category?: string;
}

interface RssChannelOptions {
	title: string;
	link: string;
	selfLink: string;
	description: string;
	language: Locale;
	items: RssItem[];
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		// Les caractères de contrôle (hors tabulation et retours) sont interdits en XML 1.0.
		// eslint-disable-next-line no-control-regex
		.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

function cdata(value: string): string {
	// eslint-disable-next-line no-control-regex
	const text = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
	return `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function toRfc822(dateStr: string): string {
	const parsed = new Date(`${dateStr}T12:00:00Z`);
	return Number.isFinite(parsed.valueOf()) ? parsed.toUTCString() : new Date().toUTCString();
}

function buildRssXml(channel: RssChannelOptions): string {
	const lastBuildDate = channel.items[0]?.pubDate ?? new Date().toUTCString();
	const itemsXml = channel.items
		.map((item) => {
			const lines = [
				'    <item>',
				`      <title>${cdata(item.title)}</title>`,
				`      <link>${escapeXml(item.link)}</link>`,
				`      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>`,
				`      <pubDate>${item.pubDate}</pubDate>`,
			];
			if (item.author) {
				lines.push(`      <dc:creator>${cdata(item.author)}</dc:creator>`);
			}
			if (item.category) {
				lines.push(`      <category>${cdata(item.category)}</category>`);
			}
			lines.push(`      <description>${cdata(item.description)}</description>`);
			lines.push('    </item>');
			return lines.join('\n');
		})
		.join('\n');

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
		'  <channel>',
		`    <title>${cdata(channel.title)}</title>`,
		`    <link>${escapeXml(channel.link)}</link>`,
		`    <description>${cdata(channel.description)}</description>`,
		`    <language>${channel.language}</language>`,
		`    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
		`    <atom:link href="${escapeXml(channel.selfLink)}" rel="self" type="application/rss+xml" />`,
		itemsXml,
		'  </channel>',
		'</rss>',
		'',
	].join('\n');
}

function xmlResponse(xml: string): Response {
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
		},
	});
}

const BLOG_META: Record<Locale, { title: string; description: string; category: string }> = {
	fr: {
		title: 'Blog Kotbo',
		description: 'Guides pour gérer un serveur Discord avec Kotbo et annonces de l’équipe.',
		category: 'Blog',
	},
	en: {
		title: 'Kotbo Blog',
		description: 'Guides for running a Discord server with Kotbo and news from the team.',
		category: 'Blog',
	},
};

const UPDATES_META: Record<Locale, { title: string; description: string; category: string }> = {
	fr: {
		title: 'Mises à jour Kotbo',
		description: 'Notes de version de Kotbo, le bot Discord et son dashboard : ce qui change à chaque mise à jour.',
		category: 'Mises à jour',
	},
	en: {
		title: 'Kotbo Updates',
		description: 'Release notes for Kotbo, the Discord bot and its dashboard: what changes in every update.',
		category: 'Updates',
	},
};

export function blogRssResponse(locale: Locale): Response {
	const meta = BLOG_META[locale];
	const sorted = [...BLOG].sort((a, b) => b.date.localeCompare(a.date));
	const items: RssItem[] = sorted.map((post) => {
		const slug = blogSlug(post, locale);
		const url = `${SITE_URL}${blogPath(slug, locale)}`;
		const t = post.text[locale];
		return {
			title: t.h1,
			link: url,
			guid: url,
			pubDate: toRfc822(post.date),
			description: t.description,
			author: post.author,
			category: meta.category,
		};
	});

	return xmlResponse(
		buildRssXml({
			title: meta.title,
			link: `${SITE_URL}${BLOG_ROUTE[locale]}`,
			selfLink: `${SITE_URL}${BLOG_RSS_ROUTE[locale]}`,
			description: meta.description,
			language: locale,
			items,
		}),
	);
}

export function releasesRssResponse(locale: Locale): Response {
	const meta = UPDATES_META[locale];
	const sorted = [...RELEASES].sort((a, b) => b.date.localeCompare(a.date));
	const items: RssItem[] = sorted.map((release) => {
		const url = `${SITE_URL}${releasePath(release.slug, locale)}`;
		const t = release.text[locale];
		return {
			title: t.h1,
			link: url,
			guid: url,
			pubDate: toRfc822(release.date),
			description: t.description,
			author: 'Kotbo',
			category: `${meta.category} (${release.version})`,
		};
	});

	return xmlResponse(
		buildRssXml({
			title: meta.title,
			link: `${SITE_URL}${UPDATES_ROUTE[locale]}`,
			selfLink: `${SITE_URL}${UPDATES_RSS_ROUTE[locale]}`,
			description: meta.description,
			language: locale,
			items,
		}),
	);
}

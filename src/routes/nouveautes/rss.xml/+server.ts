import { releasesRssResponse } from '$lib/seo/rss';

export const prerender = true;

export function GET(): Response {
	return releasesRssResponse('fr');
}

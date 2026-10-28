import { error } from '@sveltejs/kit';
import { RELEASES } from '$lib/articles/releases.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => RELEASES.map((r) => ({ slug: r.slug }));

export const load: PageLoad = ({ params }) => {
	if (!RELEASES.some((r) => r.slug === params.slug)) error(404);
	return { slug: params.slug };
};

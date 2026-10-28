import { error } from '@sveltejs/kit';
import { BLOG } from '$lib/articles/blog.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => BLOG.map((b) => ({ slug: b.slug }));

export const load: PageLoad = ({ params }) => {
	if (!BLOG.some((b) => b.slug === params.slug)) error(404);
	return { slug: params.slug };
};

import { error } from '@sveltejs/kit';
import { BLOG, blogSlug } from '$lib/articles/blog.js';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => BLOG.map((b) => ({ slug: blogSlug(b, 'fr') }));

export const load: PageLoad = ({ params }) => {
	if (!BLOG.some((b) => blogSlug(b, 'fr') === params.slug)) error(404);
	return { slug: params.slug };
};

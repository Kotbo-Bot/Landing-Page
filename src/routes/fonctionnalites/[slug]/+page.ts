import { error } from '@sveltejs/kit';
import { FEATURES } from '$lib/data/features';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => FEATURES.map((f) => ({ slug: f.slug.fr }));

export const load: PageLoad = ({ params }) => {
	const feature = FEATURES.find((f) => f.slug.fr === params.slug);
	if (!feature) error(404);
	return { featureKey: feature.key };
};

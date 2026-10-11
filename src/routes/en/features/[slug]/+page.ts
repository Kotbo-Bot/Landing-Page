import { error } from '@sveltejs/kit';
import { FEATURES } from '$lib/data/features';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => FEATURES.map((f) => ({ slug: f.slug.en }));

export const load: PageLoad = ({ params }) => {
	const feature = FEATURES.find((f) => f.slug.en === params.slug);
	if (!feature) error(404);
	return { featureKey: feature.key };
};

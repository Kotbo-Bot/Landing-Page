<script lang="ts">
  /**
   * Un article par fonctionnalité, servi en français et en anglais. Le texte
   * vient de la console du dashboard (`data/feature-pages.json`), le gabarit
   * est celui de tous les articles (`articles/Article.svelte`).
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath } from '$lib/i18n/routes';
  import { FEATURES, type Feature } from '$lib/data/features';
  import { featureJsonLd } from '$lib/seo/jsonld.js';
  import Article from '$lib/articles/Article.svelte';

  const { featureKey }: { featureKey: Feature['key'] } = $props();

  const locale = $derived(getLocale());
  const feature = $derived(FEATURES.find((f) => f.key === featureKey)!);
  const text = $derived(feature.text[locale]);
</script>

<Article
  postKey={feature.key}
  seo={{ title: text.title, description: text.description, path: featurePath(feature.slug, locale), jsonLd: featureJsonLd(feature.key, locale) }}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={text.faq}
  invite={{ hero: `feature-${feature.key}`, final: `feature-${feature.key}-final` }}
/>

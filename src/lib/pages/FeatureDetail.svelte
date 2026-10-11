<script lang="ts">
  /** Une page par fonctionnalité, servie en français et en anglais. */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath } from '$lib/i18n/routes';
  import { FEATURES, type Feature } from '$lib/data/features';
  import FeatureShell from '$lib/components/FeatureShell.svelte';

  const { featureKey }: { featureKey: Feature['key'] } = $props();

  const feature = $derived(FEATURES.find((f) => f.key === featureKey)!);
  const text = $derived(feature.text[getLocale()]);
</script>

<FeatureShell
  title={text.title}
  description={text.description}
  path={featurePath(feature.slug, getLocale())}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={text.faq}
  current={feature.key}
  content="feature-{feature.key}"
/>

<script lang="ts">
  /**
   * Une fonctionnalité en fiche bristol, scotchée de travers sur le tableau.
   * Au survol, la fiche se redresse et se soulève, comme si on la décollait
   * pour la lire. En mouvement réduit, elle reste en place.
   */
  import { base } from '$app/paths';
  import type { Feature } from '$lib/data/features';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath } from '$lib/i18n/routes';
  import { ktb } from '$lib/playground/discord/theme';
  import { featureIcon } from '$lib/data/featureIcons';
  import IndexCard from '$lib/components/ui/IndexCard.svelte';

  const { feature, rotation = 0 }: { feature: Feature; rotation?: number } = $props();
  const locale = $derived(getLocale());
  const text = $derived(feature.text[locale]);
</script>

<a href="{base}{featurePath(feature.slug, locale)}" class="fiche group block h-full rounded-sm">
  <IndexCard {rotation} class="h-full">
    <img src={ktb(featureIcon(feature.key))} alt="" width="28" height="28" class="h-7 w-7" />
    <p class="mt-3 font-headline text-lg font-extrabold leading-7 text-gray-900 group-hover:text-indigo-700">{text.name}</p>
    <p class="text-sm leading-7 text-gray-600">{text.description}</p>
  </IndexCard>
</a>

<style>
  .fiche :global(.index-card) {
    transition: transform 220ms cubic-bezier(0.55, -0.03, 0.15, 1.41), box-shadow 220ms ease;
  }
  @media (prefers-reduced-motion: no-preference) {
    .fiche:hover :global(.index-card),
    .fiche:focus-visible :global(.index-card) {
      transform: rotate(0deg) translateY(-6px);
      box-shadow: 0 18px 30px -16px rgba(17, 24, 39, 0.35);
    }
  }
</style>

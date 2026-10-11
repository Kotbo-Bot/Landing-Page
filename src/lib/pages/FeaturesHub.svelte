<script lang="ts">
  /**
   * La page d'ensemble des fonctionnalités, celle qui vise « bot Discord » tout
   * court et ses variantes génériques (tout-en-un, français). Elle mène vers
   * chaque page détaillée, puis vers le catalogue complet de l'accueil.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath } from '$lib/i18n/routes';
  import { FEATURES, HUB } from '$lib/data/features';
  import FeatureShell from '$lib/components/FeatureShell.svelte';

  const TEXT = {
    fr: {
      listTitle: 'Ce que fait Kotbo',
      catalog: 'Voir tout le catalogue des modules',
    },
    en: {
      listTitle: 'What Kotbo does',
      catalog: 'See the full module catalog',
    },
  };
  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const hub = $derived(HUB[locale]);
</script>

<FeatureShell
  title={hub.title}
  description={hub.description}
  path={locale === 'en' ? '/en/features' : '/fonctionnalites'}
  h1={hub.h1}
  lead={hub.lead}
  sections={[hub.why]}
  faq={hub.faq}
  content="features"
>
  {#snippet extra()}
    <section class="mt-14">
      <h2 class="font-headline text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{t.listTitle}</h2>
      <ul class="mt-5 grid gap-3 sm:grid-cols-2">
        {#each FEATURES as feature (feature.key)}
          <li>
            <a
              href="{base}{featurePath(feature.slug, locale)}"
              class="block h-full rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-900"
            >
              <h3 class="font-headline text-lg font-extrabold text-gray-900">{feature.text[locale].name}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-gray-600">{feature.text[locale].description}</p>
            </a>
          </li>
        {/each}
      </ul>
      <a href="{base}{locale === 'en' ? '/en' : '/'}#modules" class="mt-5 inline-flex min-h-11 items-center font-bold text-gray-900 underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900">
        {t.catalog}
      </a>
    </section>
  {/snippet}
</FeatureShell>

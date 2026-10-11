<script lang="ts">
  /**
   * Une page par fonctionnalité, servie en français et en anglais. Le texte
   * vient du dashboard (`data/feature-pages.json`).
   *
   * Sur le tableau : le titre, la promesse, l'invitation, et une fiche bristol
   * scotchée à côté qui sert de sommaire. Puis le cahier : chaque section
   * numérotée dans la marge, ses points cochés au marqueur. Les
   * fonctionnalités voisines finissent la page, en fiches épinglées.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, homeOf } from '$lib/i18n/routes';
  import { FEATURES, type Feature } from '$lib/data/features';
  import { TRIAL_DAYS } from '$lib/product';
  import { ktb } from '$lib/playground/discord/theme';
  import { featureIcon } from '$lib/data/featureIcons';
  import FeatureShell from '$lib/components/FeatureShell.svelte';
  import FeatureSections from '$lib/components/FeatureSections.svelte';
  import FeatureTry from '$lib/components/FeatureTry.svelte';
  import FeatureCard from '$lib/components/FeatureCard.svelte';
  import FaqList from '$lib/components/FaqList.svelte';
  import IndexCard from '$lib/components/ui/IndexCard.svelte';
  import MarkedTitle from '$lib/components/ui/MarkedTitle.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  const { featureKey }: { featureKey: Feature['key'] } = $props();

  const TEXT = {
    fr: {
      crumbs: "Fil d'Ariane",
      hub: 'Fonctionnalités',
      offer: `Incluse dans toutes les offres · ${TRIAL_DAYS} jours d'essai`,
      demo: 'Voir la démo',
      toc: 'Sur cette page',
      faq: 'Questions fréquentes',
      related: 'À lire aussi',
      all: 'Toutes les fonctionnalités',
    },
    en: {
      crumbs: 'Breadcrumb',
      hub: 'Features',
      offer: `Included in every plan · ${TRIAL_DAYS}-day trial`,
      demo: 'See the demo',
      toc: 'On this page',
      faq: 'Frequently asked questions',
      related: 'Read next',
      all: 'All features',
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const feature = $derived(FEATURES.find((f) => f.key === featureKey)!);
  const text = $derived(feature.text[locale]);
  const hubPath = $derived(locale === 'en' ? '/en/features' : '/fonctionnalites');

  /**
   * Trois autres pages, celles qui suivent dans l'ordre du dashboard (en
   * reprenant au début) : chaque page en lie d'autres, et toutes finissent
   * liées, sans aligner soixante liens sous chacune.
   */
  const RELATED = 3;
  const related = $derived.by(() => {
    const index = FEATURES.findIndex((f) => f.key === featureKey);
    const others = index < 0 ? FEATURES : [...FEATURES.slice(index + 1), ...FEATURES.slice(0, index)];
    return others.slice(0, RELATED);
  });
  /** Les fiches penchent chacune un peu différemment, comme posées à la main. */
  const TILTS = [-1.5, 1, -0.6];
</script>

<FeatureShell title={text.title} description={text.description} path={featurePath(feature.slug, locale)}>
  <div class="mx-auto grid max-w-360 gap-12 px-4 pb-16 pt-8 sm:px-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:pb-24 xl:grid-cols-[minmax(0,1fr)_22rem]">
    <header>
      <nav aria-label={t.crumbs} class="text-sm font-medium text-gray-500">
        <ol class="flex flex-wrap items-center gap-1.5">
          <li><a href="{base}{homeOf(locale)}" class="hover:text-gray-900">Kotbo</a></li>
          <li aria-hidden="true">/</li>
          <li><a href="{base}{hubPath}" class="hover:text-gray-900">{t.hub}</a></li>
        </ol>
      </nav>

      <p class="mt-6 flex items-center gap-2.5 font-semibold text-gray-700">
        <img src={ktb(featureIcon(feature.key))} alt="" width="28" height="28" class="h-7 w-7" />
        {text.name}
      </p>
      <h1 class="mt-3 max-w-4xl font-headline text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl">
        <MarkedTitle text={text.h1} />
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-gray-700 sm:text-xl">{text.lead}</p>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <InviteButton content="feature-{feature.key}" size="lg" />
        <a
          href="{base}/demo/"
          class="inline-flex min-h-13 items-center justify-center rounded-xl border-2 border-gray-900 px-6 text-base font-bold text-gray-900 transition-colors hover:bg-white"
        >
          {t.demo}
        </a>
      </div>
      <p class="mt-4 text-sm font-medium text-gray-600">{t.offer}</p>
    </header>

    <!-- Le sommaire de la page, sur une fiche scotchée. Il suit la lecture sur
         grand écran ; sur téléphone, il se lit avant le texte. -->
    <aside class="lg:sticky lg:top-28 lg:self-start lg:pt-10">
      <IndexCard rotation={1.5}>
        <p class="font-hand text-2xl leading-7 text-gray-800">{t.toc}</p>
        <ol class="mt-0">
          {#each text.sections as section, i (section.h2)}
            <li>
              <a href="#section-{i + 1}" class="flex gap-2.5 leading-7 text-gray-800 hover:text-indigo-700">
                <span class="w-5 shrink-0 font-headline font-extrabold text-indigo-600/60">{i + 1}</span>
                <span class="underline decoration-transparent underline-offset-4 hover:decoration-current">{section.h2}</span>
              </a>
            </li>
          {/each}
          <li>
            <a href="#faq" class="flex gap-2.5 leading-7 text-gray-800 hover:text-indigo-700">
              <span class="w-5 shrink-0 font-headline font-extrabold text-indigo-600/60">?</span>
              <span class="underline decoration-transparent underline-offset-4 hover:decoration-current">{t.faq}</span>
            </a>
          </li>
        </ol>
      </IndexCard>
    </aside>
  </div>

  <div class="border-y-2 border-gray-200 bg-white py-16 lg:py-24">
    <div class="mx-auto max-w-4xl space-y-16 px-4 sm:px-8">
      <FeatureSections sections={text.sections} />
      <div class="sm:pl-[6rem]">
        <FeatureTry />
      </div>
    </div>
  </div>

  <section id="faq" aria-labelledby="faq-title" class="scroll-mt-28 py-16 lg:py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-8">
      <h2 id="faq-title" class="mb-8 font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t.faq}</h2>
      <FaqList items={text.faq} trackAs="{feature.key}-q" />
    </div>
  </section>

  <nav aria-labelledby="related-title" class="border-t-2 border-gray-200 py-16 lg:py-20">
    <div class="mx-auto max-w-5xl px-4 sm:px-8">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <h2 id="related-title" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t.related}</h2>
        <a href="{base}{hubPath}" class="text-sm font-bold text-gray-900 underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900">{t.all}</a>
      </div>
      <ul class="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {#each related as other, i (other.key)}
          <li><FeatureCard feature={other} rotation={TILTS[i % TILTS.length]} /></li>
        {/each}
      </ul>
    </div>
  </nav>
</FeatureShell>

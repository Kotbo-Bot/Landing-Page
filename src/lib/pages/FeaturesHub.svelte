<script lang="ts">
  /**
   * La page d'ensemble des fonctionnalités, celle qui vise « bot Discord » tout
   * court et ses variantes génériques (tout-en-un, français).
   *
   * Un sommaire de cahier : chaque fonctionnalité sur sa ligne, numérotée,
   * séparée de la suivante par un pointillé. Au survol, son titre se surligne
   * au marqueur. Le « pourquoi » tient sur une fiche scotchée à côté.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, homeOf } from '$lib/i18n/routes';
  import { FEATURES, HUB } from '$lib/data/features';
  import { ktb } from '$lib/playground/discord/theme';
  import { featureIcon } from '$lib/data/featureIcons';
  import FeatureShell from '$lib/components/FeatureShell.svelte';
  import FeatureTry from '$lib/components/FeatureTry.svelte';
  import FaqList from '$lib/components/FaqList.svelte';
  import IndexCard from '$lib/components/ui/IndexCard.svelte';
  import HandCheck from '$lib/components/ui/HandCheck.svelte';
  import MarkedTitle from '$lib/components/ui/MarkedTitle.svelte';
  import PostIt from '$lib/components/ui/PostIt.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  const TEXT = {
    fr: {
      crumbs: "Fil d'Ariane",
      demo: 'Voir la démo',
      listTitle: 'Le sommaire',
      count: (n: number) => `${n} fonctionnalités, une page chacune`,
      catalog: 'Voir tout le catalogue des modules',
      faq: 'Questions fréquentes',
      note: 'commence par celle qui te manque',
    },
    en: {
      crumbs: 'Breadcrumb',
      demo: 'See the demo',
      listTitle: 'Contents',
      count: (n: number) => `${n} features, one page each`,
      catalog: 'See the full module catalog',
      faq: 'Frequently asked questions',
      note: 'start with the one you miss',
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const hub = $derived(HUB[locale]);
</script>

<FeatureShell title={hub.title} description={hub.description} path={locale === 'en' ? '/en/features' : '/fonctionnalites'}>
  <div class="mx-auto max-w-360 px-4 sm:px-8">
    <header class="relative pb-14 pt-8 sm:pt-14 lg:pb-20">
      <nav aria-label={t.crumbs} class="text-sm font-medium text-gray-500">
        <a href="{base}{homeOf(locale)}" class="hover:text-gray-900">Kotbo</a>
      </nav>
      <h1 class="mt-5 max-w-4xl font-headline text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl">
        <MarkedTitle text={hub.h1} />
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-gray-700 sm:text-xl">{hub.lead}</p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <InviteButton content="features" size="lg" />
        <a
          href="{base}/demo/"
          class="inline-flex min-h-13 items-center justify-center rounded-xl border-2 border-gray-900 px-6 text-base font-bold text-gray-900 transition-colors hover:bg-white"
        >
          {t.demo}
        </a>
      </div>
      <div aria-hidden="true" class="absolute right-6 top-24 hidden w-56 xl:block">
        <PostIt text={t.note} color="yellow" rotation={4} />
      </div>
    </header>
  </div>

  <section aria-labelledby="list-title" class="border-y-2 border-gray-200 bg-white py-14 lg:py-20">
    <div class="mx-auto max-w-5xl px-4 sm:px-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="list-title" class="font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t.listTitle}</h2>
        <p class="text-sm font-medium text-gray-500">{t.count(FEATURES.length)}</p>
      </div>

      <ol class="mt-8 border-b-2 border-dashed border-gray-300">
        {#each FEATURES as feature, i (feature.key)}
          {@const text = feature.text[locale]}
          <li class="border-t-2 border-dashed border-gray-300">
            <a
              href="{base}{featurePath(feature.slug, locale)}"
              class="row group grid grid-cols-[3rem_1fr] gap-x-4 py-6 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-x-8 sm:py-8"
            >
              <span aria-hidden="true" class="font-headline text-3xl font-extrabold leading-none text-gray-300 transition-colors group-hover:text-indigo-600 sm:text-5xl">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span class="flex min-w-0 flex-col gap-2">
                <span class="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <img src={ktb(featureIcon(feature.key))} alt="" width="20" height="20" class="h-5 w-5" />
                  {text.name}
                </span>
                <span class="font-headline text-xl font-extrabold leading-snug tracking-tight text-gray-900 sm:text-2xl">
                  <span class="highlight">{text.h1}</span>
                </span>
                <span class="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{text.description}</span>
              </span>
              <span aria-hidden="true" class="hidden self-center text-2xl text-gray-300 transition-[color,transform] group-hover:text-gray-900 motion-safe:group-hover:translate-x-1.5 sm:block">→</span>
            </a>
          </li>
        {/each}
      </ol>

      <a href="{base}{homeOf(locale)}#modules" class="mt-8 inline-flex min-h-11 items-center font-bold text-gray-900 underline decoration-gray-400 underline-offset-4 hover:decoration-gray-900">
        {t.catalog}
      </a>
    </div>
  </section>

  <div class="mx-auto grid max-w-5xl gap-14 px-4 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:py-24">
    <IndexCard rotation={-1.2}>
      <h2 class="font-headline text-2xl font-extrabold leading-7 tracking-tight text-gray-900">{hub.why.h2}</h2>
      <p class="mt-7 leading-7 text-gray-700">{hub.why.body}</p>
      {#if hub.why.points}
        <ul class="mt-7">
          {#each hub.why.points as point (point)}
            <li class="flex gap-2.5 leading-7 text-gray-800">
              <HandCheck class="mt-0.5 h-6 w-6 shrink-0" />
              <span>{point}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </IndexCard>
    <FeatureTry />
  </div>

  <section aria-labelledby="faq-title" class="border-t-2 border-gray-200 bg-white py-16 lg:py-20">
    <div class="mx-auto max-w-3xl px-4 sm:px-8">
      <h2 id="faq-title" class="mb-8 font-headline text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{t.faq}</h2>
      <FaqList items={hub.faq} trackAs="features-q" />
    </div>
  </section>
</FeatureShell>

<style>
  /* Le surligneur : un trait de marqueur jaune qui passe sous le titre au survol. */
  .highlight {
    background-image: linear-gradient(transparent 58%, rgba(253, 253, 150, 0.95) 58%, rgba(253, 253, 150, 0.95) 92%, transparent 92%);
    background-repeat: no-repeat;
    background-size: 0% 100%;
    transition: background-size 380ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .row:hover .highlight,
  .row:focus-visible .highlight {
    background-size: 100% 100%;
  }
  @media (prefers-reduced-motion: reduce) {
    .highlight {
      transition: none;
    }
  }
</style>

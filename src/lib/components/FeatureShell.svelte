<script lang="ts">
  /**
   * Gabarit des pages par fonctionnalité et de leur page d'ensemble.
   *
   * Ces pages sont écrites pour la recherche : un titre qui reprend la requête,
   * un texte qui dit ce que le bot fait, une FAQ qui répond aux questions
   * telles qu'on les tape. Elles renvoient toutes vers l'accueil, où l'on
   * essaie, et vers la démo du dashboard, où l'on voit.
   */
  import type { Snippet } from 'svelte';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath } from '$lib/i18n/routes';
  import { FEATURES, type Feature, type FeatureSection } from '$lib/data/features';
  import { track } from '$lib/funnel';
  import Seo from '$lib/seo/Seo.svelte';
  import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';
  import SiteFooter from '$lib/sections/SiteFooter.svelte';

  interface Props {
    title: string;
    description: string;
    path: string;
    h1: string;
    lead: string;
    sections: FeatureSection[];
    faq: { q: string; a: string }[];
    /** La fonctionnalité de la page, absente sur la page d'ensemble. */
    current?: Feature['key'];
    /** Mesure du clic d'invitation (`feature-automod`, `features`...). */
    content: string;
    /** Bloc propre à la page, sous l'introduction. */
    extra?: Snippet;
  }

  const { title, description, path, h1, lead, sections, faq, current, content, extra }: Props = $props();

  const TEXT = {
    fr: {
      home: "Kotbo, retour à l'accueil",
      hub: 'Fonctionnalités',
      crumbs: "Fil d'Ariane",
      demo: 'Voir la démo du dashboard',
      faq: 'Questions fréquentes',
      related: 'Les autres fonctionnalités',
      tryTitle: 'Essaie avant de lire la suite',
      tryBody: "Sur l'accueil, tu montes ton serveur en trois questions et tu vois ce que tes membres verront. La démo montre le dashboard de ton staff, sans compte.",
      tryHome: 'Monter mon serveur',
    },
    en: {
      home: 'Kotbo, back to home',
      hub: 'Features',
      crumbs: 'Breadcrumb',
      demo: 'See the dashboard demo',
      faq: 'Frequently asked questions',
      related: 'Other features',
      tryTitle: 'Try it before reading on',
      tryBody: 'On the home page, you build your server in three questions and see what your members will see. The demo shows your staff dashboard, no account needed.',
      tryHome: 'Build my server',
    },
  };
  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const homePath = $derived(locale === 'en' ? '/en' : '/');
  const hubPath = $derived(locale === 'en' ? '/en/features' : '/fonctionnalites');
  const related = $derived(FEATURES.filter((f) => f.key !== current));

  onMount(() => track('site_visit', { path: location.pathname }));
</script>

<Seo {title} {description} {path} />

<header class="border-b border-gray-200 bg-[#f8f9fa]">
  <div class="mx-auto flex max-w-360 items-center justify-between gap-4 px-4 py-3 sm:px-8">
    <a href="{base}{homePath}" aria-label={t.home} class="flex items-center gap-2.5 rounded-lg">
      <img src="{base}/favicon.svg" alt="" width="36" height="36" class="h-9 w-9 rounded-xl" />
      <span class="font-headline text-xl font-extrabold text-gray-900">Kotbo</span>
    </a>
    <div class="flex items-center gap-3">
      <LanguageSwitcher />
      <div class="hidden sm:block"><InviteButton content="{content}-header" tone="ink" /></div>
    </div>
  </div>
</header>

<main class="mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-8 sm:pt-12">
  <nav aria-label={t.crumbs} class="text-sm font-medium text-gray-500">
    <ol class="flex flex-wrap items-center gap-1.5">
      <li><a href="{base}{homePath}" class="hover:text-gray-900">Kotbo</a></li>
      {#if current}
        <li aria-hidden="true">/</li>
        <li><a href="{base}{hubPath}" class="hover:text-gray-900">{t.hub}</a></li>
      {/if}
    </ol>
  </nav>

  <h1 class="mt-4 font-headline text-4xl font-extrabold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl">{h1}</h1>
  <p class="mt-5 max-w-3xl text-lg leading-relaxed text-gray-700">{lead}</p>

  <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
    <InviteButton {content} size="lg" />
    <a
      href="{base}/demo/"
      class="inline-flex min-h-13 items-center justify-center rounded-xl border-2 border-gray-900 px-6 text-base font-bold text-gray-900 transition-colors hover:bg-white"
    >
      {t.demo}
    </a>
  </div>

  {@render extra?.()}

  {#each sections as section (section.h2)}
    <section class="mt-14">
      <h2 class="font-headline text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{section.h2}</h2>
      <p class="mt-3 leading-relaxed text-gray-700">{section.body}</p>
      {#if section.points}
        <ul class="mt-4 space-y-2.5">
          {#each section.points as point (point)}
            <li class="flex gap-3 leading-relaxed text-gray-800">
              <span aria-hidden="true" class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600"></span>
              <span>{point}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/each}

  <section class="mt-14 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
    <h2 class="font-headline text-2xl font-extrabold tracking-tight text-gray-900">{t.tryTitle}</h2>
    <p class="mt-3 leading-relaxed text-gray-700">{t.tryBody}</p>
    <div class="mt-5 flex flex-col gap-3 sm:flex-row">
      <a href="{base}{homePath}#monter" class="inline-flex min-h-11 items-center justify-center rounded-xl bg-gray-900 px-5 text-sm font-bold text-white hover:bg-gray-800">{t.tryHome}</a>
      <a href="{base}/demo/" class="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 px-5 text-sm font-bold text-gray-900 hover:border-gray-900">{t.demo}</a>
    </div>
  </section>

  <section class="mt-14">
    <h2 class="font-headline text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{t.faq}</h2>
    <div class="mt-5 divide-y divide-gray-200 border-y border-gray-200">
      {#each faq as item (item.q)}
        <details class="group py-4">
          <summary class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
            <h3>{item.q}</h3>
            <span aria-hidden="true" class="text-xl text-gray-400 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p class="mt-2 leading-relaxed text-gray-700">{item.a}</p>
        </details>
      {/each}
    </div>
  </section>

  <nav aria-labelledby="related-title" class="mt-14">
    <h2 id="related-title" class="font-headline text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{t.related}</h2>
    <ul class="mt-5 grid gap-3 sm:grid-cols-2">
      {#each related as feature (feature.key)}
        <li>
          <a
            href="{base}{featurePath(feature.slug, locale)}"
            class="block h-full rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-900"
          >
            <span class="font-bold text-gray-900">{feature.text[locale].name}</span>
            <span class="mt-1 block text-sm text-gray-600">{feature.text[locale].description}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</main>

<SiteFooter />

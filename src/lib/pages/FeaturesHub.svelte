<script lang="ts">
  /**
   * L'index des articles, celui qui vise « bot Discord » tout court et ses
   * variantes génériques (tout-en-un, français).
   *
   * Il se lit comme un salon forum de Discord (`articles/ForumBar`) : un sujet
   * par article, l'article staff épinglé en tête (`articles/posts.ts`). Sous
   * la liste, le « pourquoi un seul bot » et la FAQ, qui portent la requête de
   * tête.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { FEATURES_ROUTE, homeOf } from '$lib/i18n/routes';
  import { HUB } from '$lib/data/features';
  import { hubJsonLd } from '$lib/seo/jsonld.js';
  import { MODULE_COUNT } from '$lib/v3/modules';
  import Seo from '$lib/seo/Seo.svelte';
  import Shell from '$lib/v3/Shell.svelte';
  import AddButton from '$lib/v3/AddButton.svelte';
  import FaqList from '$lib/v3/FaqList.svelte';
  import ForumBar from '$lib/articles/ForumBar.svelte';
  import PostList from '$lib/articles/PostList.svelte';
  import { POSTS } from '$lib/articles/posts';

  const TEXT = {
    fr: {
      demo: 'Fouiller la démo du dashboard',
      list: 'Les articles',
      count: (n: number) => `${n} articles`,
      catalog: `Voir les ${MODULE_COUNT} modules du catalogue`,
      faq: 'Questions fréquentes',
    },
    en: {
      demo: 'Dig through the dashboard demo',
      list: 'Articles',
      count: (n: number) => `${n} articles`,
      catalog: `See all ${MODULE_COUNT} modules in the catalog`,
      faq: 'Frequently asked questions',
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const hub = $derived(HUB[locale]);
</script>

<Seo title={hub.title} description={hub.description} path={FEATURES_ROUTE[locale]} jsonLd={hubJsonLd(locale)} />

<Shell>
  <div class="mx-auto max-w-7xl px-4 sm:px-6"><ForumBar /></div>

  <header class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:pt-16">
    <div class="max-w-4xl">
      <h1 class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{hub.h1}</h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl">{hub.lead}</p>
      <div class="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <AddButton content="features" size="lg" />
        <a href="/demo/" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{t.demo}</a>
      </div>
    </div>
  </header>

  <section aria-labelledby="list-title" class="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id="list-title" class="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.list}</h2>
      <p class="text-sm text-fog">{t.count(POSTS.length)}</p>
    </div>
    <div class="mt-8"><PostList posts={POSTS} /></div>
  </section>

  <section aria-labelledby="why-title" class="border-t border-line">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-20 lg:py-28">
      <h2 id="why-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl">{hub.why.h2}</h2>
      <div>
        <p class="text-lg leading-relaxed text-mist">{hub.why.body}</p>
        {#if hub.why.points}
          <ul class="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-mist marker:text-glow">
            {#each hub.why.points as point (point)}
              <li>{point}</li>
            {/each}
          </ul>
        {/if}
        <a href="{base}{homeOf(locale)}#modules" class="mt-8 inline-flex min-h-11 items-center font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.catalog}</a>
      </div>
    </div>
  </section>

  <section id="faq" aria-labelledby="faq-title" class="bg-night-2 py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="max-w-3xl">
        <h2 id="faq-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl">{t.faq}</h2>
        <div class="mt-10"><FaqList items={hub.faq} trackAs="features-q" level="h3" /></div>
      </div>
    </div>
  </section>
</Shell>

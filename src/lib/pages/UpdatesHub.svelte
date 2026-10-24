<script lang="ts">
  /**
   * L'index des notes de version, rendu par `/nouveautes` et `/en/whats-new`.
   *
   * Il se lit comme les articles (`FeaturesHub`), dans son propre salon forum :
   * une note par version, la plus récente en tête (`articles/releases.js`).
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { UPDATES_ROUTE } from '$lib/i18n/routes';
  import { UPDATES_FAQ } from '$lib/seo/faq.js';
  import { updatesJsonLd } from '$lib/seo/jsonld.js';
  import Seo from '$lib/seo/Seo.svelte';
  import Shell from '$lib/v3/Shell.svelte';
  import AddButton from '$lib/v3/AddButton.svelte';
  import FaqList from '$lib/v3/FaqList.svelte';
  import ForumBar from '$lib/articles/ForumBar.svelte';
  import PostList from '$lib/articles/PostList.svelte';
  import { RELEASE_POSTS } from '$lib/articles/posts';

  const TEXT = {
    fr: {
      title: 'Notes de version de Kotbo, le bot Discord | Kotbo',
      description: 'Ce qui change à chaque mise à jour de Kotbo, le bot Discord et son dashboard : une note par version, de la 1.0 à la dernière.',
      forum: 'nouveautes',
      topic: 'ce qui change à chaque mise à jour',
      h1: 'Ce qui change à chaque mise à jour',
      lead: 'Une note par version, la plus récente en haut. Chacune garde ce qui change pour ton serveur et renvoie vers les notes complètes sur GitHub',
      demo: 'Fouiller la démo du dashboard',
      list: 'Les versions',
      count: (n: number) => `${n} versions`,
      faq: 'Questions fréquentes',
    },
    en: {
      title: 'Kotbo release notes, the Discord bot | Kotbo',
      description: 'What changes in every Kotbo update, the Discord bot and its dashboard: one note per version, from 1.0 to the latest.',
      forum: 'whats-new',
      topic: 'what changes in every update',
      h1: 'What changes in every update',
      lead: 'One note per version, newest first. Each one keeps what changes for your server and links to the full notes on GitHub',
      demo: 'Dig through the dashboard demo',
      list: 'Versions',
      count: (n: number) => `${n} versions`,
      faq: 'Frequently asked questions',
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
</script>

<Seo title={t.title} description={t.description} path={UPDATES_ROUTE[locale]} jsonLd={updatesJsonLd(locale)} />

<Shell>
  <div class="mx-auto max-w-7xl px-4 sm:px-6"><ForumBar forum={{ name: t.forum, href: `${base}${UPDATES_ROUTE[locale]}`, topic: t.topic }} /></div>

  <header class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:pt-16">
    <div class="max-w-4xl">
      <h1 class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{t.h1}</h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl">{t.lead}</p>
      <div class="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <AddButton content="updates" size="lg" />
        <a href="/demo/" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{t.demo}</a>
      </div>
    </div>
  </header>

  <section aria-labelledby="list-title" class="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id="list-title" class="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.list}</h2>
      <p class="text-sm text-fog">{t.count(RELEASE_POSTS.length)}</p>
    </div>
    <div class="mt-8"><PostList posts={RELEASE_POSTS} /></div>
  </section>

  <section id="faq" aria-labelledby="faq-title" class="bg-night-2 py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="max-w-3xl">
        <h2 id="faq-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl">{t.faq}</h2>
        <div class="mt-10"><FaqList items={UPDATES_FAQ[locale]} trackAs="updates-q" level="h3" /></div>
      </div>
    </div>
  </section>
</Shell>

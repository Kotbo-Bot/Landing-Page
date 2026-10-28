<script lang="ts">
  /**
   * L'index du blog, rendu par `/blog` et `/en/blog`.
   *
   * Il se lit comme les notes de version (`UpdatesHub`), dans son propre salon
   * forum : un billet par annonce, le plus récent en tête (`articles/blog.js`).
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { BLOG_ROUTE } from '$lib/i18n/routes';
  import { blogJsonLd } from '$lib/seo/jsonld.js';
  import Seo from '$lib/seo/Seo.svelte';
  import Shell from '$lib/v3/Shell.svelte';
  import AddButton from '$lib/v3/AddButton.svelte';
  import ForumBar from '$lib/articles/ForumBar.svelte';
  import PostList from '$lib/articles/PostList.svelte';
  import { BLOG_POSTS } from '$lib/articles/posts';

  const TEXT = {
    fr: {
      title: 'Le blog de Kotbo, le bot Discord | Kotbo',
      description: 'Les annonces de l’équipe de Kotbo, le bot Discord et son dashboard : partenariats, coulisses et ce qui arrive.',
      forum: 'blog',
      topic: 'les annonces de l’équipe',
      h1: 'Le blog',
      lead: 'Les annonces de l’équipe, le billet le plus récent en haut. Ce qui change à chaque version reste dans les notes de version',
      demo: 'Fouiller la démo du dashboard',
      list: 'Les billets',
      count: (n: number) => (n > 1 ? `${n} billets` : `${n} billet`),
    },
    en: {
      title: 'The Kotbo blog, the Discord bot | Kotbo',
      description: 'News from the team behind Kotbo, the Discord bot and its dashboard: partnerships, behind the scenes and what’s coming.',
      forum: 'blog',
      topic: 'news from the team',
      h1: 'The blog',
      lead: 'News from the team, newest post first. What changes in each version stays in the release notes',
      demo: 'Dig through the dashboard demo',
      list: 'Posts',
      count: (n: number) => (n > 1 ? `${n} posts` : `${n} post`),
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
</script>

<Seo title={t.title} description={t.description} path={BLOG_ROUTE[locale]} jsonLd={blogJsonLd(locale)} />

<Shell>
  <div class="mx-auto max-w-7xl px-4 sm:px-6"><ForumBar forum={{ name: t.forum, href: `${base}${BLOG_ROUTE[locale]}`, topic: t.topic }} /></div>

  <header class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:pt-16">
    <div class="max-w-4xl">
      <h1 class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{t.h1}</h1>
      <p class="mt-6 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl">{t.lead}</p>
      <div class="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <AddButton content="blog" size="lg" />
        <a href="/demo/" class="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{t.demo}</a>
      </div>
    </div>
  </header>

  <section aria-labelledby="list-title" class="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id="list-title" class="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.list}</h2>
      <p class="text-sm text-fog">{t.count(BLOG_POSTS.length)}</p>
    </div>
    <div class="mt-8"><PostList posts={BLOG_POSTS} /></div>
  </section>
</Shell>

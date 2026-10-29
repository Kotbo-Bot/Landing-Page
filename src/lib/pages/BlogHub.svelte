<script lang="ts">
  /**
   * L'index du blog, rendu par `/blog` et `/en/blog`.
   *
   * Il se lit comme les notes de version (`UpdatesHub`), dans son propre salon
   * forum, et rassemble tout ce que le site publie (`ALL_POSTS`) : les guides
   * et les billets de l'équipe (`articles/blog.js`), les articles et les notes
   * de version.
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
  import { ALL_POSTS } from '$lib/articles/posts';

  const TEXT = {
    fr: {
      title: 'Le blog de Kotbo, le bot Discord | Kotbo',
      description: 'Guides pour gérer un serveur Discord avec Kotbo : anti-raid, bienvenue, giveaways, économie, tickets, staff. Plus les annonces et les notes de version.',
      forum: 'blog',
      topic: 'guides et annonces de l’équipe',
      h1: 'Le blog',
      lead: 'Les questions que se posent les admins de serveurs Discord, avec la réponse et les commandes qui vont avec. Puis les annonces de l’équipe, les articles des modules et les notes de version',
      demo: 'Fouiller la démo du dashboard',
      list: 'Les articles',
      count: (n: number) => `${n} articles`,
    },
    en: {
      title: 'The Kotbo blog, the Discord bot | Kotbo',
      description: 'Guides to running a Discord server with Kotbo: anti-raid, welcome messages, giveaways, economy, tickets, staff. Plus team news and release notes.',
      forum: 'blog',
      topic: 'guides and news from the team',
      h1: 'The blog',
      lead: 'The questions Discord server admins ask, answered, with the commands that go with them. Then news from the team, module articles and release notes',
      demo: 'Dig through the dashboard demo',
      list: 'Articles',
      count: (n: number) => `${n} articles`,
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
      <p class="text-sm text-fog">{t.count(ALL_POSTS.length)}</p>
    </div>
    <div class="mt-8"><PostList posts={ALL_POSTS} /></div>
  </section>
</Shell>

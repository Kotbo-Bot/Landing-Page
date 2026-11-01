<script lang="ts">
  /**
   * Un billet du blog, rendu par `/blog/<slug>` et `/en/blog/<slug>`. Son
   * texte vit dans `articles/blog.js` (les annonces) ou `articles/blog/` (les
   * guides). `slug` est celui de la langue de l'URL.
   *
   * Un guide peut montrer un écran du dashboard (`figure`), chargé à la
   * demande comme dans les notes de version, et annoncé fictif par `DashStage`.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { blogPath, BLOG_ROUTE } from '$lib/i18n/routes';
  import { blogPostJsonLd } from '$lib/seo/jsonld.js';
  import { BLOG, blogSlug } from '$lib/articles/blog.js';
  import Article from '$lib/articles/Article.svelte';
  import DashStage from '$lib/v3/DashStage.svelte';

  const { slug }: { slug: string } = $props();

  const TEXT = {
    fr: { title: (h1: string) => `${h1} | Blog Kotbo`, forum: 'blog', topic: 'guides et annonces de l’équipe', all: 'Tous les billets' },
    en: { title: (h1: string) => `${h1} | Kotbo blog`, forum: 'blog', topic: 'guides and news from the team', all: 'All posts' },
  };

  const SCREENS = {
    tickets: () => import('$lib/dash/screens/tickets/TicketsScreen.svelte'),
    sanctions: () => import('$lib/dash/screens/sanctions/SanctionsScreen.svelte'),
    staff: () => import('$lib/dash/screens/staff/StaffScreen.svelte'),
    members: () => import('$lib/dash/screens/members/MembersScreen.svelte'),
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const post = $derived(BLOG.find((b) => blogSlug(b, locale) === slug)!);
  const text = $derived(post.text[locale]);
  const key = $derived(`blog-${blogSlug(post, 'fr')}`);
</script>

<Article
  postKey={key}
  seo={{ title: text.title ? `${text.title} | Kotbo` : t.title(text.h1), description: text.description, path: blogPath(slug, locale), jsonLd: blogPostJsonLd(slug, locale) }}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={text.faq}
  invite={{ hero: key, final: `${key}-final` }}
  forum={{ name: t.forum, href: `${base}${BLOG_ROUTE[locale]}`, topic: t.topic, all: t.all }}
  date={post.date}
  author={post.author}
>
  {#snippet figure(screen)}
    <DashStage>
      {#await SCREENS[screen]() then module}
        <module.default />
      {/await}
    </DashStage>
  {/snippet}
</Article>

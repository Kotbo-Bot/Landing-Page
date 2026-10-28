<script lang="ts">
  /**
   * Un billet du blog, rendu par `/blog/<slug>` et `/en/blog/<slug>`. Son
   * texte vit dans `articles/blog.js`.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { blogPath, BLOG_ROUTE } from '$lib/i18n/routes';
  import { blogPostJsonLd } from '$lib/seo/jsonld.js';
  import { BLOG } from '$lib/articles/blog.js';
  import Article from '$lib/articles/Article.svelte';

  const { slug }: { slug: string } = $props();

  const TEXT = {
    fr: { title: (h1: string) => `${h1} | Blog Kotbo`, forum: 'blog', topic: 'les annonces de l’équipe', all: 'Tous les billets' },
    en: { title: (h1: string) => `${h1} | Kotbo blog`, forum: 'blog', topic: 'news from the team', all: 'All posts' },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const post = $derived(BLOG.find((b) => b.slug === slug)!);
  const text = $derived(post.text[locale]);
</script>

<Article
  postKey="blog-{post.slug}"
  seo={{ title: t.title(text.h1), description: text.description, path: blogPath(post.slug, locale), jsonLd: blogPostJsonLd(post.slug, locale) }}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={text.faq}
  invite={{ hero: `blog-${post.slug}`, final: `blog-${post.slug}-final` }}
  forum={{ name: t.forum, href: `${base}${BLOG_ROUTE[locale]}`, topic: t.topic, all: t.all }}
  date={post.date}
  author={post.author}
/>

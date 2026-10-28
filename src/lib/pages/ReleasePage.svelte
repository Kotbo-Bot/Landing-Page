<script lang="ts">
  /**
   * La note d'une version, rendue par `/nouveautes/<slug>` et
   * `/en/whats-new/<slug>`. Son texte vit dans `articles/releases.js`.
   *
   * Une seule route sert toutes les versions : l'écran du dashboard qu'une
   * note montre (`figure`) est chargé à la demande, pour que les autres notes
   * restent légères. Il est annoncé fictif par `DashStage`.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { releasePath, UPDATES_ROUTE } from '$lib/i18n/routes';
  import { releaseJsonLd } from '$lib/seo/jsonld.js';
  import { RELEASES, releaseUrl } from '$lib/articles/releases.js';
  import { releaseKey } from '$lib/articles/posts';
  import Article from '$lib/articles/Article.svelte';
  import DashStage from '$lib/v3/DashStage.svelte';

  const { slug }: { slug: string } = $props();

  const TEXT = {
    fr: {
      title: (version: string) => `Kotbo ${version} : notes de version | Kotbo`,
      forum: 'nouveautes',
      topic: 'ce qui change à chaque mise à jour',
      all: 'Toutes les versions',
      source: 'Les notes complètes sur GitHub',
    },
    en: {
      title: (version: string) => `Kotbo ${version} release notes | Kotbo`,
      forum: 'whats-new',
      topic: 'what changes in every update',
      all: 'All versions',
      source: 'Full notes on GitHub',
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const release = $derived(RELEASES.find((r) => r.slug === slug)!);
  const text = $derived(release.text[locale]);
</script>

<Article
  postKey={releaseKey(release)}
  seo={{ title: t.title(release.version), description: text.description, path: releasePath(release.slug, locale), jsonLd: releaseJsonLd(release.slug, locale) }}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={text.faq}
  invite={{ hero: `release-${release.slug}`, final: `release-${release.slug}-final` }}
  forum={{ name: t.forum, href: `${base}${UPDATES_ROUTE[locale]}`, topic: t.topic, all: t.all }}
  date={release.date}
  source={{ href: releaseUrl(release), label: t.source }}
>
  {#snippet figure()}
    <DashStage>
      {#await import('$lib/dash/screens/tickets/TicketsScreen.svelte') then screen}
        <screen.default />
      {/await}
    </DashStage>
  {/snippet}
</Article>

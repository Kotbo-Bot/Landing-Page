<script lang="ts">
  /**
   * L'article des nouveautés de la dernière version, épinglé dans l'index.
   *
   * Rendu par `/nouveautes` et `/en/whats-new` (`i18n/routes.ts`). Son texte
   * vit dans `articles/updates.ts` ; l'écran Tickets du dashboard
   * (`dash/screens`) y montre le centre de support, jouable sur des membres
   * fictifs et annoncé comme tel.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { UPDATES_ROUTE } from '$lib/i18n/routes';
  import { UPDATES_FAQ } from '$lib/seo/faq.js';
  import { updatesJsonLd } from '$lib/seo/jsonld.js';
  import { UPDATES_ARTICLE } from '$lib/articles/updates';
  import Article from '$lib/articles/Article.svelte';
  import DashStage from '$lib/v3/DashStage.svelte';
  import TicketsScreen from '$lib/dash/screens/tickets/TicketsScreen.svelte';

  const locale = $derived(getLocale());
  const text = $derived(UPDATES_ARTICLE[locale]);
</script>

<Article
  postKey="updates"
  seo={{ title: text.title, description: text.description, path: UPDATES_ROUTE[locale], jsonLd: updatesJsonLd(locale) }}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={UPDATES_FAQ[locale]}
  final={text.final}
  invite={{ hero: 'updates-hero', final: 'updates-final' }}
>
  {#snippet figure()}
    <DashStage>
      <TicketsScreen />
    </DashStage>
  {/snippet}
</Article>

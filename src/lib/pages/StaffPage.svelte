<script lang="ts">
  /**
   * L'article « gestion du staff Discord », épinglé en tête de l'index.
   *
   * Rendu par `/gestion-staff-discord` et `/en/discord-staff-management`
   * (`i18n/routes.ts`). Son texte vit dans `articles/staff.ts` ; ce qu'il a en
   * plus des pages de la console, ce sont les vrais écrans du dashboard
   * (`dash/screens`), jouables sur des membres fictifs et annoncés comme tels.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { STAFF_ROUTE } from '$lib/i18n/routes';
  import { STAFF_FAQ } from '$lib/seo/faq.js';
  import { staffJsonLd } from '$lib/seo/jsonld.js';
  import { STAFF_ARTICLE } from '$lib/articles/staff';
  import Article from '$lib/articles/Article.svelte';
  import DashStage from '$lib/v3/DashStage.svelte';
  import StaffScreen from '$lib/dash/screens/staff/StaffScreen.svelte';
  import SanctionsScreen from '$lib/dash/screens/sanctions/SanctionsScreen.svelte';

  const locale = $derived(getLocale());
  const text = $derived(STAFF_ARTICLE[locale]);
</script>

<Article
  postKey="staff"
  seo={{ title: text.title, description: text.description, path: STAFF_ROUTE[locale], jsonLd: staffJsonLd(locale) }}
  h1={text.h1}
  lead={text.lead}
  sections={text.sections}
  faq={STAFF_FAQ[locale]}
  final={text.final}
  invite={{ hero: 'staff-hero', final: 'staff-final' }}
>
  {#snippet figure(screen)}
    <DashStage>
      {#if screen === 'staff'}
        <StaffScreen />
      {:else}
        <SanctionsScreen />
      {/if}
    </DashStage>
  {/snippet}
</Article>

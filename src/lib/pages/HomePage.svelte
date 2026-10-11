<script lang="ts">
  /**
   * L'accueil, v2 : on essaie avant de lire.
   *
   * L'ordre suit ce que le visiteur fait, puis les questions qui lui restent :
   *
   * 1. il monte son serveur (le héros), et voit ce que ses membres verront ;
   * 2. il voit ce que son staff aura, le dashboard ;
   * 3. il vit une soirée qui dérape, et la règle ;
   * 4. il mesure l'étendue du catalogue ;
   * 5. il tape des commandes, puis fabrique sa carte de rang ;
   * 6. il se situe face aux autres bots, voit qui utilise déjà Kotbo ;
   * 7. seulement alors le prix, les dernières questions, le dernier appel.
   *
   * Chaque zone jouable se termine sur le même bouton d'invitation, qui reprend
   * le nom du serveur monté dans le héros et en emporte les réglages.
   *
   * Rendue par `/` en français et par `/en` en anglais (`i18n/routes.ts`).
   */
  import { onMount } from 'svelte';
  import { homeJsonLd } from '$lib/seo/jsonld.js';
  import { homeOf } from '$lib/i18n/routes';
  import { track, trackOnView, inviteUrl } from '$lib/funnel';
  import { SALES_URL, TRIAL_DAYS } from '$lib/product';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Seo from '$lib/seo/Seo.svelte';
  import { builder, encodeKit } from '$lib/playground/kit.svelte';

  import SiteNav from '$lib/sections/SiteNav.svelte';
  import BuildHero from '$lib/sections/BuildHero.svelte';
  import TrustStrip from '$lib/sections/TrustStrip.svelte';
  import AfterClick from '$lib/sections/AfterClick.svelte';
  import StaffDesk from '$lib/sections/StaffDesk.svelte';
  import Crisis from '$lib/sections/Crisis.svelte';
  import Commands from '$lib/sections/Commands.svelte';
  import RankStudio from '$lib/sections/RankStudio.svelte';
  import SiteFooter from '$lib/sections/SiteFooter.svelte';
  import StickyInvite from '$lib/sections/StickyInvite.svelte';

  import Modules from '$lib/components/Modules.svelte';
  import Comparison from '$lib/components/Comparison.svelte';
  import ComparisonFaq from '$lib/components/ComparisonFaq.svelte';
  import Pricing from '$lib/components/Pricing.svelte';
  import TrialCta from '$lib/components/TrialCta.svelte';

  // Le titre porte « bot Discord » et « staff » : c'est ce que tapent ceux qui
  // cherchent un outil pour leur équipe sans connaître Kotbo, et ce qui le
  // distingue des bots de modération. Il est aussi le titre bleu de l'embed
  // Discord. La description reste sous 160 signes pour ne pas être coupée.
  const TEXT = {
    fr: {
      title: 'Kotbo : bot Discord de gestion du staff et de modération',
      description: `Bot Discord français et dashboard web : staff (absences, évaluations, recrutement), sanctions, tickets et niveaux au même endroit. ${TRIAL_DAYS} jours d'essai.`,
    },
    en: {
      title: 'Kotbo: Discord bot for staff management and moderation',
      description: `French Discord bot with a web dashboard: staff (absences, reviews, recruitment), sanctions, tickets and levels in one place. ${TRIAL_DAYS}-day trial.`,
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);

  /** Les zones reprises de la v1 reçoivent leur lien tout fait, réglages compris. */
  const kit = $derived(encodeKit(builder.kit));
  const links = $derived({
    modules: inviteUrl('modules', kit),
    comparison: inviteUrl('comparison', kit),
    pricing: inviteUrl('pricing', kit),
    trial: inviteUrl('trial-cta', kit),
  });

  onMount(() => {
    // Entrée du tunnel. Le référent n'est classé qu'ici : dès la deuxième page
    // d'une navigation interne il ne dit plus rien de la provenance réelle.
    track('site_visit', { path: location.pathname });
  });
</script>

<Seo title={t.title} description={t.description} path={homeOf(locale)} jsonLd={homeJsonLd(locale)} />

<div id="top" class="relative min-h-screen text-gray-900">
  <SiteNav />
  <main>
    <BuildHero />
    <TrustStrip />
    <AfterClick />
    <StaffDesk />
    <Crisis />
    <Modules inviteUrl={links.modules} />
    <Commands />
    <RankStudio />
    <div use:trackOnView={'comparison_viewed'}>
      <Comparison inviteUrl={links.comparison} />
    </div>
    <div use:trackOnView={'pricing_viewed'}>
      <Pricing inviteUrl={links.pricing} salesUrl={SALES_URL} />
    </div>
    <ComparisonFaq />
    <TrialCta inviteUrl={links.trial} salesUrl={SALES_URL} />
  </main>
  <SiteFooter />
  <StickyInvite />
</div>

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
   */
  import { onMount } from 'svelte';
  import homeJsonLd from '$lib/seo/home-jsonld.json';
  import { track, trackOnView, inviteUrl } from '$lib/funnel';
  import { SALES_URL } from '$lib/product';
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

<svelte:head>
  <title>Kotbo, monte ton serveur Discord et gère-le au même endroit</title>
  <meta
    name="description"
    content="Monte ton serveur Discord directement sur la page, règle une soirée qui dérape, tape les commandes de Kotbo et fabrique ta carte de rang. Puis ajoute le bot : l'installation reprend tes choix."
  />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://kotbo.fr/" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fr_FR" />
  <meta property="og:site_name" content="Kotbo" />
  <meta property="og:title" content="Kotbo, monte ton serveur Discord et gère-le au même endroit" />
  <meta
    property="og:description"
    content="Modération, tickets, staff, niveaux et économie dans un seul bot. Essaie-le sur la page avant de l'ajouter."
  />
  <meta property="og:url" content="https://kotbo.fr/" />
  <!-- Son empreinte est autorisée par la CSP (svelte.config.js) : le contenu
       vit dans le JSON pour que les deux restent identiques. -->
  {@html `<script type="application/ld+json">${JSON.stringify(homeJsonLd)}</script>`}
</svelte:head>

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

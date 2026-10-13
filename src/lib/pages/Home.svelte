<script lang="ts">
  /**
   * L'accueil, v3 : la nuit du dashboard.
   *
   * La cible est le fondateur d'un serveur qui a grandi : un staff à faire
   * tourner, une pile de bots, un tableur. L'ordre suit ce qu'il se demande :
   *
   * 1. c'est quoi, pour qui, pourquoi lui (le héros, et la pile de bots qui part) ;
   * 2. « ouais, c'est exactement ma vie » (son téléphone à 2 h 47) ;
   * 3. ce que personne d'autre ne fait (le QG du staff, vrais écrans) ;
   * 4. combien je paye aujourd'hui (le ticket de caisse) ;
   * 5. qu'est-ce qu'il sait faire d'autre (les modules) ;
   * 6. est-ce que c'est pour mon serveur (les profils, qui règlent l'install) ;
   * 7. est-ce que je peux lui faire confiance, combien, et les dernières questions ;
   * 8. le dernier appel.
   *
   * Les règles de la v2 tiennent toujours : aucun bouton mort, aucune donnée
   * inventée présentée comme réelle (les scènes sont annoncées fictives, les
   * chiffres viennent de l'API ou disparaissent).
   */
  import { onMount } from 'svelte';
  import { homeJsonLd } from '$lib/seo/jsonld.js';
  import { track } from '$lib/funnel';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Seo from '$lib/seo/Seo.svelte';

  import Nav from '$lib/v3/Nav.svelte';
  import Hero from '$lib/v3/Hero.svelte';
  import Night from '$lib/v3/Night.svelte';
  import StaffHQ from '$lib/v3/StaffHQ.svelte';
  import Receipt from '$lib/v3/Receipt.svelte';
  import Arsenal from '$lib/v3/Arsenal.svelte';
  import Setup from '$lib/v3/Setup.svelte';
  import Trust from '$lib/v3/Trust.svelte';
  import Price from '$lib/v3/Price.svelte';
  import Faq from '$lib/v3/Faq.svelte';
  import Final from '$lib/v3/Final.svelte';
  import Footer from '$lib/v3/Footer.svelte';
  import MobileBar from '$lib/v3/MobileBar.svelte';
  import Channels from '$lib/v3/Channels.svelte';
  import ChannelSheet from '$lib/v3/ChannelSheet.svelte';

  // Requête en tête, marque en fin : c'est ce que tapent ceux qui cherchent un
  // bot sans connaître Kotbo. Le titre est aussi le titre bleu de l'embed
  // Discord quand quelqu'un colle le lien.
  const TEXT = {
    fr: {
      title: 'Bot Discord français : modération, tickets, staff | Kotbo',
      description:
        'Kotbo, le bot Discord français tout-en-un : modération, anti-raid, tickets, niveaux et gestion du staff, réglés depuis un dashboard web. 15 jours offerts, sans CB.',
      path: '/',
      skip: 'Aller au contenu',
    },
    en: {
      title: 'All-in-One Discord Bot: Moderation, Tickets, Staff | Kotbo',
      description:
        'Kotbo is an all-in-one Discord bot with a web dashboard: moderation, anti-raid, tickets, levels and full staff management. 15 days free, no credit card.',
      path: '/en',
      skip: 'Skip to content',
    },
  };
  const t = $derived(TEXT[getLocale()]);

  onMount(() => {
    // Le fond nuit couvre aussi la zone de rebond et le haut de page.
    document.documentElement.classList.add('v3');
    // Entrée du tunnel. Le référent n'est classé qu'ici : dès la deuxième page
    // d'une navigation interne il ne dit plus rien de la provenance réelle.
    track('site_visit', { path: location.pathname });
    return () => document.documentElement.classList.remove('v3');
  });
</script>

<Seo title={t.title} description={t.description} path={t.path} jsonLd={homeJsonLd(getLocale())} />
<svelte:head><meta name="theme-color" content="#09090b" /></svelte:head>

<div id="top" class="v3 relative min-h-screen bg-night font-sans text-white antialiased">
  <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-night">{t.skip}</a>
  <Nav />
  <main id="main">
    <div class="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <Channels />
      <div class="min-w-0">
    <Hero />
    <Night />
    <StaffHQ />
    <Receipt />
    <Arsenal />
    <Setup />
    <Trust />
    <Price />
    <Faq />
      </div>
    </div>
    <Final />
  </main>
  <Footer />
  <MobileBar />
  <ChannelSheet />
</div>

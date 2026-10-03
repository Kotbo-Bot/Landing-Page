<script lang="ts">
  /**
   * Cookies et stockage local.
   *
   * Cette page affirmait « Kotbo n'utilise aucun outil de mesure d'audience
   * web », ce qui cesse d'etre vrai avec la sonde du tunnel d'acquisition. Elle
   * decrit desormais cette mesure, et surtout elle porte le moyen de s'y
   * opposer - une page qui annonce un droit d'opposition sans l'offrir ne vaut
   * pas mieux que celle qui taisait la mesure.
   *
   * L'interrupteur ecrit `kotbo:no-measure` dans `localStorage`. C'est le seul
   * usage durable que fait le site du stockage local, et il est ici pour une
   * raison precise : un refus doit survivre a la fermeture de l'onglet, alors
   * que l'identifiant de visite, lui, ne doit pas. La sonde lit ce drapeau
   * avant tout envoi.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  /** Clé lue par la sonde avant tout envoi. */
  const OPT_OUT_KEY = 'kotbo:no-measure';

  let optedOut = $state(false);
  /** Tant que le navigateur n'a pas répondu, on n'affiche pas d'état trompeur. */
  let ready = $state(false);
  /**
   * Signal navigateur déjà émis : dans ce cas la mesure est désactivée quoi
   * qu'affiche l'interrupteur, et le dire évite de laisser croire qu'il faut
   * encore agir.
   */
  let browserSignal = $state(false);

  onMount(() => {
    try {
      optedOut = localStorage.getItem(OPT_OUT_KEY) === '1';
    } catch {
      // Stockage inaccessible (navigation privée stricte, réglages) : on reste
      // sur la valeur par défaut plutôt que de casser la page.
    }
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    browserSignal = nav.doNotTrack === '1' || nav.globalPrivacyControl === true;
    ready = true;
  });

  function toggleOptOut(next: boolean) {
    optedOut = next;
    try {
      if (next) localStorage.setItem(OPT_OUT_KEY, '1');
      else localStorage.removeItem(OPT_OUT_KEY);
    } catch {
      // Rien à faire : sans stockage, le refus ne peut pas être mémorisé. Les
      // signaux navigateur restent respectés de toute façon.
    }
  }

  const TEXT = {
    fr: {
      title: 'Cookies et stockage local',
      subtitle: 'Dernière mise à jour : 30 septembre 2026 · Landing et Dashboard Kotbo',
      metaDescription: 'Informations sur les cookies et stockages locaux utilisés par Kotbo.',
      sections: {
        mesure: "Mesure d'audience",
        dashboard: 'Cookies du dashboard',
        local: 'Stockage local',
        gestion: 'Gérer ces données',
        evolution: 'Évolution',
      },
      banner: {
        title: 'Aucune bannière de consentement',
        body1: "Kotbo n'utilise",
        strong1: 'aucun cookie publicitaire',
        body2: ", aucun outil tiers et ne suit personne d'un site à l'autre. La mesure d'audience décrite ci-dessous est faite par nos propres moyens et reste dans les conditions d'exemption prévues par la CNIL (l'autorité française de protection des données) ; les autres opérations sont nécessaires à la sécurité, à l'authentification ou aux fonctionnalités demandées. Vous pouvez malgré tout vous opposer à la mesure en un clic,",
        link: 'ci-dessous',
        body3: '.',
      },
      s01: {
        h2: "Mesure d'audience",
        p1: "Nous mesurons comment le site est utilisé : combien de personnes le visitent, par quel canal elles arrivent, quelles sections elles lisent et combien vont jusqu'à installer Kotbo. Cette mesure sert à décider quoi améliorer sur le site, et à rien d'autre.",
        p2a: 'Elle est faite',
        p2strong: 'sans cookie',
        p2b: 'et sans aucun outil tiers :',
        table: {
          data: 'Donnée',
          purpose: 'Finalité',
          duration: 'Durée',
          row1Data: 'sessionStorage',
          row1Purpose: 'Identifiant aléatoire, propre à votre navigateur et à cette seule visite. Il permet de savoir qu\'une même visite a lu les tarifs',
          row1PurposeEm: 'puis',
          row1PurposeEnd: 'installé le bot, plutôt que de compter deux personnes.',
          row1Duration: "Effacé à la fermeture de l'onglet ; 30 jours au maximum côté serveur",
          row2Data: "Catégorie du site d'où vous venez",
          row2PurposeA: "Savoir si vous arrivez d'un moteur de recherche, de Discord ou en direct. Seule la",
          row2PurposeStrong: 'catégorie',
          row2PurposeB: 'est enregistrée — jamais l\'adresse complète, qui pourrait contenir votre recherche.',
          row2Duration: '13 mois',
          row3Data: 'Pages et sections consultées, boutons cliqués',
          row3Purpose: "Comprendre ce qui est lu et ce qui déclenche une installation.",
          row3Duration: '13 mois',
        },
        p3a: 'Ce que cette mesure',
        p3strong: 'ne fait pas',
        p3b: ', et ne fera pas sans vous le demander d\'abord :',
        li1: 'elle ne pose aucun cookie et ne conserve pas votre adresse IP ;',
        li2: "elle ne vous suit pas sur d'autres sites, et ne recoupe rien avec un autre service ;",
        li3: 'elle ne transmet rien à un tiers — pas de Google Analytics, pas de régie, pas de service externe ;',
        li4: "elle n'est jamais rapprochée de votre compte Discord, ni d'aucune identité.",
        card: {
          title: "Refuser la mesure d'audience",
          desc: 'Votre choix est mémorisé dans ce navigateur et prend effet immédiatement. Le site fonctionne exactement de la même façon.',
          switchLabel: "Refuser la mesure d'audience",
          statusBrowserSignal: 'Votre navigateur émet déjà un signal « Do Not Track » ou « Global Privacy Control » : rien n\'est envoyé, vous n\'avez rien à faire.',
          statusOptedOut: 'La mesure est désactivée dans ce navigateur.',
          statusActive: 'La mesure est active. Elle ne pose aucun cookie et ne vous identifie pas.',
        },
        p4a: 'Si vous effacez les données de ce site, ce refus disparaît avec elles et devra être reposé. Vous pouvez également nous écrire à',
        p5: "Ces caractéristiques — finalité limitée, absence de recoupement et de suivi inter-sites, portée limitée à ce seul site, durée courte, pas de transmission à un tiers — sont celles auxquelles la CNIL subordonne l'exemption de consentement pour la mesure d'audience. C'est pourquoi aucune bannière ne vous est présentée.",
      },
      s02: {
        h2: 'Cookies du dashboard',
        p1: "Ces cookies permettent d'établir une connexion sécurisée et de protéger le parcours OAuth Discord.",
        table: {
          name: 'Nom',
          purpose: 'Finalité',
          duration: 'Durée',
          row1Purpose: 'Maintenir la session authentifiée. Cookie sécurisé,',
          row1PurposeEm: 'HttpOnly',
          row1PurposeEnd: 'et inaccessible à JavaScript.',
          row1Duration: '7 jours maximum',
          row2Purpose: 'Empêcher les attaques CSRF pendant la connexion Discord.',
          row2Duration: '5 minutes',
          row3Purpose: 'Vérifier le flux OAuth PKCE.',
          row3Duration: '5 minutes',
          row4Purpose: 'Revenir à la page demandée après connexion.',
          row4Duration: '5 minutes',
          row5Name: 'ou équivalent',
          row5Purpose: 'Protection Cloudflare contre les attaques et robots, uniquement lorsqu\'un contrôle de sécurité l\'exige.',
          row5Duration: 'Selon le contrôle de sécurité',
        },
      },
      s03: {
        h2: 'Stockage local du navigateur',
        p1: 'Le dashboard peut mémoriser localement, sans transmettre ces informations à un service publicitaire :',
        li1: "le serveur sélectionné, le thème, la barre latérale, les favoris et les préférences d'interface ;",
        li2: "la progression des tutoriels et l'état temporaire de certaines erreurs ;",
        li3: "les brouillons enregistrés, modèles d'embed, disposition du dashboard et notes locales du staff ;",
        li4: 'le langage choisi et les données temporaires de l\'IDE.',
        landing:
          "Sur kotbo.fr, le serveur que vous montez sur la page d'accueil (son nom, son image, vos choix et votre message d'accueil) est gardé dans ce navigateur, sous la clé kotbo-kit, pour que vous le retrouviez en revenant. Il n'est envoyé nulle part, à une exception près : la vocation, les modules et le niveau de modération accompagnent le lien quand vous cliquez sur « Ajouter Kotbo », pour que l'installation les reprenne. La photo choisie pour la carte de rang n'est ni enregistrée ni envoyée.",
        landingKeys:
          "Deux autres clés servent le site lui-même : kotbo-locale retient la langue choisie, kotbo:no-measure retient votre refus de la mesure d'audience. Aucune ne quitte ce navigateur.",
        demo:
          "La démonstration du dashboard (kotbo.fr/demo) fonctionne sans serveur. Ce que vous y modifiez est gardé dans ce navigateur sous la clé kotbo-demo-db, avec le thème, la langue et le serveur de démonstration choisis (kotbo_theme, kotbo_theme_preferred, kotbo_prefs, PARAGLIDE_LOCALE, kotbo_guild_id, onboarding-…). Sa mesure d'usage (kotbo:telemetry:session) reste elle aussi dans le navigateur : la démonstration n'envoie rien à Kotbo.",
        infoA: "Le jeton d'authentification Discord ou Kotbo n'est pas conservé dans",
        infoCode: 'localStorage',
        infoB: '. La session repose sur un cookie',
        infoEm: 'HttpOnly',
        infoC: 'inaccessible au code JavaScript du navigateur.',
      },
      s04: {
        h2: 'Gérer ces données',
        p1: 'Les préférences peuvent être réinitialisées depuis les paramètres du dashboard. Le stockage peut également être supprimé depuis les réglages du navigateur ; cela réinitialise les préférences et peut supprimer des brouillons locaux.',
        p2a: 'Pour toute question, contactez',
      },
      s05: {
        h2: 'Évolution',
        p1a: 'Si Kotbo ajoute un jour un traceur qui sort des conditions d\'exemption décrites plus haut — identifiant durable, recoupement avec un autre service, outil tiers, usage publicitaire — il sera',
        p1strong: 'bloqué par défaut',
        p1b: ', et un mécanisme permettant d\'accepter ou de refuser avec la même facilité sera présenté avant son activation.',
        infoA: 'Les traitements de données personnelles sont détaillés dans la',
        infoLink1: 'politique de confidentialité',
        infoB: 'et les relations avec les administrateurs dans l\'',
        infoLink2: 'accord de sous-traitance',
        infoC: '.',
      },
    },
    en: {
      title: 'Cookies and Local Storage',
      subtitle: 'Last updated: September 30, 2026 · Kotbo Landing and Dashboard',
      metaDescription: 'Information about the cookies and local storage used by Kotbo.',
      sections: {
        mesure: 'Audience measurement',
        dashboard: 'Dashboard cookies',
        local: 'Local storage',
        gestion: 'Managing this data',
        evolution: 'Future changes',
      },
      banner: {
        title: 'No consent banner',
        body1: 'Kotbo uses',
        strong1: 'no advertising cookies',
        body2: ", no third-party tools, and does not track anyone across sites. The audience measurement described below is carried out by our own means and stays within the exemption conditions set by the CNIL (the French data protection authority); other operations are necessary for security, authentication, or requested features. You can still opt out of measurement in one click,",
        link: 'below',
        body3: '.',
      },
      s01: {
        h2: 'Audience measurement',
        p1: "We measure how the website is used: how many people visit it, which channel they arrive from, which sections they read, and how many go on to install Kotbo. This measurement is used solely to decide what to improve on the website.",
        p2a: 'It is carried out',
        p2strong: 'without cookies',
        p2b: 'and without any third-party tool:',
        table: {
          data: 'Data',
          purpose: 'Purpose',
          duration: 'Duration',
          row1Data: 'sessionStorage',
          row1Purpose: 'A random identifier, unique to your browser and to this single visit. It makes it possible to know that the same visit read the pricing page and',
          row1PurposeEm: 'then',
          row1PurposeEnd: 'installed the bot, rather than counting two separate people.',
          row1Duration: 'Erased when the tab is closed; 30 days maximum server-side',
          row2Data: 'Category of the site you came from',
          row2PurposeA: 'To know whether you arrived from a search engine, from Discord, or directly. Only the',
          row2PurposeStrong: 'category',
          row2PurposeB: 'is recorded — never the full address, which could contain your search terms.',
          row2Duration: '13 months',
          row3Data: 'Pages and sections viewed, buttons clicked',
          row3Purpose: 'To understand what is being read and what triggers an installation.',
          row3Duration: '13 months',
        },
        p3a: 'What this measurement',
        p3strong: 'does not do',
        p3b: ', and will not do without asking you first:',
        li1: 'it does not set any cookie and does not retain your IP address;',
        li2: 'it does not track you across other websites, and does not cross-reference anything with another service;',
        li3: 'it does not transmit anything to a third party — no Google Analytics, no ad network, no external service;',
        li4: 'it is never linked to your Discord account, or to any identity.',
        card: {
          title: 'Opt out of audience measurement',
          desc: 'Your choice is remembered in this browser and takes effect immediately. The site works exactly the same way either way.',
          switchLabel: 'Opt out of audience measurement',
          statusBrowserSignal: 'Your browser already sends a "Do Not Track" or "Global Privacy Control" signal: nothing is sent, and you have nothing to do.',
          statusOptedOut: 'Measurement is disabled in this browser.',
          statusActive: 'Measurement is active. It does not set any cookie and does not identify you.',
        },
        p4a: 'If you clear this site\'s data, this opt-out is erased with it and will need to be set again. You can also write to us at',
        p5: 'These characteristics — limited purpose, no cross-referencing or cross-site tracking, scope limited to this single site, short duration, no transmission to a third party — are those to which the CNIL subjects the consent exemption for audience measurement. This is why no banner is shown to you.',
      },
      s02: {
        h2: 'Dashboard cookies',
        p1: 'These cookies are used to establish a secure connection and protect the Discord OAuth flow.',
        table: {
          name: 'Name',
          purpose: 'Purpose',
          duration: 'Duration',
          row1Purpose: 'Maintain the authenticated session. Secure,',
          row1PurposeEm: 'HttpOnly',
          row1PurposeEnd: 'cookie, inaccessible to JavaScript.',
          row1Duration: '7 days maximum',
          row2Purpose: 'Prevent CSRF attacks during Discord sign-in.',
          row2Duration: '5 minutes',
          row3Purpose: 'Verify the OAuth PKCE flow.',
          row3Duration: '5 minutes',
          row4Purpose: 'Return to the requested page after sign-in.',
          row4Duration: '5 minutes',
          row5Name: 'or equivalent',
          row5Purpose: 'Cloudflare protection against attacks and bots, used only when a security check requires it.',
          row5Duration: 'Depends on the security check',
        },
      },
      s03: {
        h2: 'Browser local storage',
        p1: 'The dashboard may locally store, without transmitting this information to any advertising service:',
        li1: 'the selected server, theme, sidebar, favorites, and interface preferences;',
        li2: 'tutorial progress and the temporary state of certain errors;',
        li3: 'saved drafts, embed templates, dashboard layout, and local staff notes;',
        li4: 'the chosen language and temporary IDE data.',
        landing:
          'On kotbo.fr, the server you build on the home page (its name, picture, your choices and your welcome message) is kept in this browser, under the kotbo-kit key, so you find it again when you come back. It is not sent anywhere, with one exception: the purpose, modules and moderation level travel with the link when you click “Add Kotbo”, so the setup can pick them up. The photo chosen for the rank card is neither stored nor sent.',
        landingKeys:
          'Two other keys serve the site itself: kotbo-locale remembers the chosen language, kotbo:no-measure remembers that you refused audience measurement. Neither leaves this browser.',
        demo:
          'The dashboard demo (kotbo.fr/demo) runs without a server. What you change there is kept in this browser under the kotbo-demo-db key, along with the chosen theme, language and demo server (kotbo_theme, kotbo_theme_preferred, kotbo_prefs, PARAGLIDE_LOCALE, kotbo_guild_id, onboarding-…). Its usage measurement (kotbo:telemetry:session) also stays in the browser: the demo sends nothing to Kotbo.',
        infoA: 'The Discord or Kotbo authentication token is not stored in',
        infoCode: 'localStorage',
        infoB: '. The session relies on an',
        infoEm: 'HttpOnly',
        infoC: 'cookie that is inaccessible to the browser\'s JavaScript code.',
      },
      s04: {
        h2: 'Managing this data',
        p1: 'Preferences can be reset from the dashboard settings. Storage can also be cleared from the browser settings; this resets preferences and may delete local drafts.',
        p2a: 'For any question, contact',
      },
      s05: {
        h2: 'Future changes',
        p1a: 'If Kotbo ever adds a tracker that falls outside the exemption conditions described above — a persistent identifier, cross-referencing with another service, a third-party tool, advertising use — it will be',
        p1strong: 'blocked by default',
        p1b: ', and a mechanism to accept or refuse it just as easily will be presented before it is activated.',
        infoA: 'The processing of personal data is detailed in the',
        infoLink1: 'Privacy Policy',
        infoB: 'and the relationship with administrators in the',
        infoLink2: 'data processing agreement',
        infoC: '.',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);

  const sections = $derived([
    { id: 'mesure', label: t.sections.mesure },
    { id: 'dashboard', label: t.sections.dashboard },
    { id: 'local', label: t.sections.local },
    { id: 'gestion', label: t.sections.gestion },
    { id: 'evolution', label: t.sections.evolution },
  ]);
</script>

<svelte:head>
  <title>Cookies et stockage local | Kotbo</title>
  <meta name="description" content={t.metaDescription} />
  <meta name="robots" content="index, follow" />
</svelte:head>

<LegalPageLayout
  title={t.title}
  subtitle={t.subtitle}
  {sections}
  activePage="cookies"
>
  <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-10 flex gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
    <div>
      <p class="font-bold text-indigo-900 text-sm mb-1">{t.banner.title}</p>
      <p class="text-indigo-800 text-sm leading-relaxed mb-0">
        {t.banner.body1} <strong>{t.banner.strong1}</strong>{t.banner.body2}
        <a href="#mesure" class="underline font-bold">{t.banner.link}</a>{t.banner.body3}
      </p>
    </div>
  </div>

  <section id="mesure" class="policy-section">
    <div class="section-badge">01</div>
    <h2>{t.s01.h2}</h2>
    <p>
      {t.s01.p1}
    </p>
    <p>{t.s01.p2a} <strong>{t.s01.p2strong}</strong> {t.s01.p2b}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s01.table.data}</th><th>{t.s01.table.purpose}</th><th>{t.s01.table.duration}</th></tr></thead>
        <tbody>
          <tr>
            <td><code>kotbo:vid</code><br /><span class="art">{t.s01.table.row1Data}</span></td>
            <td>{t.s01.table.row1Purpose} <em>{t.s01.table.row1PurposeEm}</em> {t.s01.table.row1PurposeEnd}</td>
            <td>{t.s01.table.row1Duration}</td>
          </tr>
          <tr>
            <td>{t.s01.table.row2Data}</td>
            <td>{t.s01.table.row2PurposeA} <strong>{t.s01.table.row2PurposeStrong}</strong> {t.s01.table.row2PurposeB}</td>
            <td>{t.s01.table.row2Duration}</td>
          </tr>
          <tr>
            <td>{t.s01.table.row3Data}</td>
            <td>{t.s01.table.row3Purpose}</td>
            <td>{t.s01.table.row3Duration}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>{t.s01.p3a} <strong>{t.s01.p3strong}</strong>{t.s01.p3b}</p>
    <ul>
      <li>{t.s01.li1}</li>
      <li>{t.s01.li2}</li>
      <li>{t.s01.li3}</li>
      <li>{t.s01.li4}</li>
    </ul>
    <div class="opt-out-card">
      <div class="flex items-start justify-between gap-6 flex-wrap">
        <div class="min-w-[16rem] flex-1">
          <p class="font-black text-gray-900 text-sm mb-1">{t.s01.card.title}</p>
          <p class="text-sm text-gray-500 mb-0">
            {t.s01.card.desc}
          </p>
        </div>
        {#if ready}
          <button
            type="button"
            role="switch"
            aria-checked={optedOut || browserSignal}
            aria-label={t.s01.card.switchLabel}
            disabled={browserSignal}
            onclick={() => toggleOptOut(!optedOut)}
            class="switch"
            class:switch-on={optedOut || browserSignal}
          >
            <span class="switch-knob"></span>
          </button>
        {/if}
      </div>

      {#if ready}
        <p class="mt-4 mb-0 text-sm font-bold" class:text-emerald-700={optedOut || browserSignal} class:text-gray-500={!optedOut && !browserSignal}>
          {#if browserSignal}
            {t.s01.card.statusBrowserSignal}
          {:else if optedOut}
            {t.s01.card.statusOptedOut}
          {:else}
            {t.s01.card.statusActive}
          {/if}
        </p>
      {/if}
    </div>
    <p>
      {t.s01.p4a} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a>.
    </p>
    <p class="text-sm text-gray-500">
      {t.s01.p5}
    </p>
  </section>

  <section id="dashboard" class="policy-section">
    <div class="section-badge">02</div>
    <h2>{t.s02.h2}</h2>
    <p>{t.s02.p1}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.s02.table.name}</th><th>{t.s02.table.purpose}</th><th>{t.s02.table.duration}</th></tr></thead>
        <tbody>
          <tr><td><code>__Host-kotbo_session</code></td><td>{t.s02.table.row1Purpose} <em>{t.s02.table.row1PurposeEm}</em> {t.s02.table.row1PurposeEnd}</td><td>{t.s02.table.row1Duration}</td></tr>
          <tr><td><code>kotbo_oauth_state</code></td><td>{t.s02.table.row2Purpose}</td><td>{t.s02.table.row2Duration}</td></tr>
          <tr><td><code>kotbo_oauth_verifier</code></td><td>{t.s02.table.row3Purpose}</td><td>{t.s02.table.row3Duration}</td></tr>
          <tr><td><code>kotbo_oauth_return_to</code></td><td>{t.s02.table.row4Purpose}</td><td>{t.s02.table.row4Duration}</td></tr>
          <tr><td><code>cf_clearance</code>, <code>__cf_bm</code> {t.s02.table.row5Name}</td><td>{t.s02.table.row5Purpose}</td><td>{t.s02.table.row5Duration}</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="local" class="policy-section">
    <div class="section-badge">03</div>
    <h2>{t.s03.h2}</h2>
    <p>{t.s03.p1}</p>
    <ul>
      <li>{t.s03.li1}</li>
      <li>{t.s03.li2}</li>
      <li>{t.s03.li3}</li>
      <li>{t.s03.li4}</li>
    </ul>
    <p>{t.s03.landing}</p>
    <p>{t.s03.landingKeys}</p>
    <p>{t.s03.demo}</p>
    <div class="info-box">
      {t.s03.infoA} <code>{t.s03.infoCode}</code>{t.s03.infoB} <em>{t.s03.infoEm}</em> {t.s03.infoC}
    </div>
  </section>

  <section id="gestion" class="policy-section">
    <div class="section-badge">04</div>
    <h2>{t.s04.h2}</h2>
    <p>
      {t.s04.p1}
    </p>
    <p>{t.s04.p2a} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a>.</p>
  </section>

  <section id="evolution" class="policy-section">
    <div class="section-badge">05</div>
    <h2>{t.s05.h2}</h2>
    <p>
      {t.s05.p1a} <strong>{t.s05.p1strong}</strong>{t.s05.p1b}
    </p>
    <div class="info-box">
      {t.s05.infoA} <a href="{base}/privacy">{t.s05.infoLink1}</a> {t.s05.infoB} <a href="{base}/dpa">{t.s05.infoLink2}</a>{t.s05.infoC}
    </div>
  </section>
</LegalPageLayout>

<style>
  .opt-out-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.25rem 1.5rem;
    margin: 1.25rem 0;
  }

  /* Interrupteur : large cible tactile, etat lisible sans couleur seule
     (le texte sous l'interrupteur dit toujours l'etat en toutes lettres). */
  .switch {
    position: relative;
    width: 3.25rem;
    height: 1.85rem;
    border-radius: 999px;
    background: #d1d5db;
    border: none;
    cursor: pointer;
    transition: background 0.18s ease;
    flex-shrink: 0;
  }
  .switch:disabled { cursor: not-allowed; opacity: 0.65; }
  .switch:focus-visible { outline: 2px solid #4f46e5; outline-offset: 3px; }
  .switch-on { background: #059669; }

  .switch-knob {
    position: absolute;
    top: 0.235rem;
    left: 0.235rem;
    width: 1.38rem;
    height: 1.38rem;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: transform 0.18s ease;
  }
  .switch-on .switch-knob { transform: translateX(1.4rem); }

  @media (prefers-reduced-motion: reduce) {
    .switch, .switch-knob { transition: none; }
  }
</style>

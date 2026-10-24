<script lang="ts">
  /**
   * Le pied de page de l'accueil v3 : les liens que le haut de page ne montre
   * pas (pages fonctionnalités, ressources, légal). Les pages fonctionnalités
   * y sont toutes, avec leur nom : c'est le maillage interne qui reste.
   *
   * Puis la rangée de badges (hébergement, RGPD, paiement), chacun un lien vers la
   * page légale qui l'établit, et le nom de Kotbo en très gros corps qui signe la page.
   * « Conforme » est une déclaration de Kotbo, jamais « certifié » : la CNIL
   * ne délivre aucune certification de ce genre.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, STAFF_ROUTE, UPDATES_ROUTE } from '$lib/i18n/routes';
  import { CONTACT_EMAIL, DISCORD_URL, DOCS_URL, STATUS_URL, TOPGG_VOTE_URL } from '$lib/product';
  import { FEATURES } from '$lib/data/features';

  const TEXT = {
    fr: {
      tagline: 'Le bot Discord qui gère ton serveur et ton staff',
      product: 'Produit',
      newTab: '(nouvel onglet)',
      features: 'Fonctionnalités',
      legal: 'Légal',
      all: 'Toutes les fonctionnalités',
      staff: 'Gestion du staff Discord',
      updates: 'Notes de version',
      demo: 'Démo du dashboard',
      docs: 'Documentation',
      status: 'État des services',
      discord: 'Serveur d’aide Discord',
      vote: 'Voter sur Top.gg',
      privacy: 'Confidentialité',
      terms: 'CGU',
      sales: 'CGV',
      cookies: 'Cookies',
      dpa: 'DPA',
      notice: 'Mentions légales',
      eu: 'Créé et hébergé dans l’Union européenne, sans aucun traceur sur ce site',
      credits: 'Polices de la carte de rang : SIL Open Font License 1.1',
      trust: 'Données et conformité',
      euAlt: 'Fièrement créé et hébergé en Union européenne',
      gdprTop: 'RGPD',
      gdprBottom: 'Conforme',
      gdprAlt: 'Conforme au RGPD : lire la politique de confidentialité',
      stripe: 'Paiement sécurisé par',
      stripeAlt: 'Paiement sécurisé par Stripe : lire les conditions de paiement',
    },
    en: {
      tagline: 'The Discord bot that runs your server and your staff',
      product: 'Product',
      newTab: '(new tab)',
      features: 'Features',
      legal: 'Legal',
      all: 'All features',
      staff: 'Discord staff management',
      updates: 'Release notes',
      demo: 'Dashboard demo',
      docs: 'Docs',
      status: 'Service status',
      discord: 'Discord support server',
      vote: 'Vote on Top.gg',
      privacy: 'Privacy',
      terms: 'Terms',
      sales: 'Terms of sale',
      cookies: 'Cookies',
      dpa: 'DPA',
      notice: 'Legal notice',
      eu: 'Built and hosted in the European Union, with zero trackers on this site',
      credits: 'Rank card fonts: SIL Open Font License 1.1',
      trust: 'Data and compliance',
      euAlt: 'Proudly built and hosted in the European Union',
      gdprTop: 'GDPR',
      gdprBottom: 'Compliant',
      gdprAlt: 'GDPR compliant: read the privacy policy',
      stripe: 'Secure payment by',
      stripeAlt: 'Secure payment by Stripe: read the payment terms',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const link = 'inline-flex min-h-9 items-center text-fog transition-colors hover:text-ink';

  // Douze étoiles droites sur un cercle, comme le drapeau européen.
  const STAR = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 1.2 : 3.1;
    const a = (Math.PI / 5) * i;
    return `${(r * Math.sin(a)).toFixed(2)},${(-r * Math.cos(a)).toFixed(2)}`;
  }).join(' ');
  const STARS = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI / 6) * i;
    return [(24 + 18 * Math.sin(a)).toFixed(2), (24 - 18 * Math.cos(a)).toFixed(2)];
  });

  // L'image porte son texte : une version par langue.
  const EU_BADGE = { fr: { src: 'eu-fr.png', width: 913 }, en: { src: 'eu-en.png', width: 809 } };
  const eu = $derived(EU_BADGE[locale]);
</script>

<footer class="border-t border-line bg-night">
  <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
    <div>
      <div class="flex items-center gap-2.5">
        <img src="{base}/favicon.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-lg" />
        <span class="font-display text-xl font-extrabold text-ink">Kotbo</span>
      </div>
      <p class="mt-4 max-w-xs text-mist">{t.tagline}</p>
      <a href="mailto:{CONTACT_EMAIL}" class="mt-4 inline-block text-sm text-ink underline decoration-line-2 underline-offset-4 hover:decoration-ink">{CONTACT_EMAIL}</a>
    </div>
    <nav aria-label={t.product}>
      <p class="text-sm font-semibold text-ink">{t.product}</p>
      <ul class="mt-3 text-sm">
        <li><a class={link} href="/demo/">{t.demo}</a></li>
        <li><a class={link} href={DOCS_URL} target="_blank" rel="noopener">{t.docs}<span class="sr-only"> {t.newTab}</span></a></li>
        <li><a class={link} href={STATUS_URL} target="_blank" rel="noopener">{t.status}<span class="sr-only"> {t.newTab}</span></a></li>
        <li><a class={link} href={DISCORD_URL} target="_blank" rel="noopener">{t.discord}<span class="sr-only"> {t.newTab}</span></a></li>
        <li><a class={link} href={TOPGG_VOTE_URL} target="_blank" rel="noopener">{t.vote}<span class="sr-only"> {t.newTab}</span></a></li>
      </ul>
    </nav>
    <nav aria-label={t.features}>
      <p class="text-sm font-semibold text-ink">{t.features}</p>
      <ul class="mt-3 text-sm">
        <li><a class={link} href="{base}{locale === 'fr' ? '/fonctionnalites' : '/en/features'}">{t.all}</a></li>
        <li><a class={link} href="{base}{STAFF_ROUTE[locale]}">{t.staff}</a></li>
        <li><a class={link} href="{base}{UPDATES_ROUTE[locale]}">{t.updates}</a></li>
        {#each FEATURES as p (p.slug.fr)}
          <li><a class={link} href="{base}{featurePath(p.slug, locale)}">{p.text[locale].name}</a></li>
        {/each}
      </ul>
    </nav>
    <nav aria-label={t.legal}>
      <p class="text-sm font-semibold text-ink">{t.legal}</p>
      <ul class="mt-3 text-sm">
        <li><a class={link} href="{base}/privacy">{t.privacy}</a></li>
        <li><a class={link} href="{base}/terms">{t.terms}</a></li>
        <li><a class={link} href="{base}/cgv">{t.sales}</a></li>
        <li><a class={link} href="{base}/cookies">{t.cookies}</a></li>
        <li><a class={link} href="{base}/dpa">{t.dpa}</a></li>
        <li><a class={link} href="{base}/mentions-legales">{t.notice}</a></li>
      </ul>
    </nav>
  </div>
  <!-- Les engagements forts (hébergement, RGPD, paiement). Le DPA et les
       cookies sont déjà dans la colonne Légal juste au-dessus. -->
  <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
    <ul class="flex flex-wrap items-stretch gap-3 border-t border-line pt-8" aria-label={t.trust}>
      <li class="w-full sm:w-auto">
        <a href="{base}/mentions-legales#hebergeur" class="block h-full overflow-hidden rounded-xl border border-line bg-white">
          <img src="{base}/badges/{eu.src}" alt={t.euAlt} width={eu.width} height="128" class="block h-auto w-full sm:h-16 sm:w-auto" />
        </a>
      </li>
      <li class="w-full sm:w-auto">
        <a href="{base}/privacy" aria-label={t.gdprAlt} class="flex h-full items-center gap-3 rounded-xl bg-[#003399] px-4 py-2 text-white hover:bg-[#002b80] sm:h-16">
          <svg viewBox="0 0 48 48" width="44" height="44" class="h-11 w-11 shrink-0" aria-hidden="true">
            {#each STARS as [x, y] (`${x},${y}`)}
              <polygon points={STAR} transform="translate({x} {y})" fill="#FFCC00" />
            {/each}
            <path d="M16 24.5l5.5 5.5L32.5 19" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="flex flex-col leading-none" aria-hidden="true">
            <span class="font-display text-2xl font-extrabold">{t.gdprTop}</span>
            <span class="mt-1 text-base font-medium">{t.gdprBottom}</span>
          </span>
        </a>
      </li>
      <li class="w-full sm:w-auto">
        <a href="{base}/cgv#paiement" aria-label={t.stripeAlt} class="flex h-full flex-col justify-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 hover:bg-indigo-50 sm:h-16">
          <span class="flex items-center gap-1.5" aria-hidden="true">
            <span class="text-sm font-bold text-[#111827]">{t.stripe}</span>
            <img src="{base}/badges/stripe.svg" alt="" width="58" height="24" class="h-6 w-auto" />
          </span>
          <span class="flex items-center gap-1.5" aria-hidden="true">
            <span class="grid h-6 place-items-center rounded border border-gray-200 px-1.5">
              <img src="{base}/badges/visa.svg" alt="" width="40" height="15" class="h-3 w-auto" />
            </span>
            <span class="grid h-6 place-items-center rounded border border-gray-200 px-1.5">
              <img src="{base}/badges/mastercard.svg" alt="" width="32" height="20" class="h-4 w-auto" />
            </span>
          </span>
        </a>
      </li>
    </ul>
  </div>

  <div class="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10">
    <!-- Décoratif : « Kotbo » est déjà lu plus haut. -->
    <div class="@container overflow-y-clip" aria-hidden="true">
      <p class="wordmark font-display font-black text-glow">Kotbo</p>
    </div>
    <p class="mt-6 text-xs text-fog sm:mt-8">© {new Date().getFullYear()} Kotbo. {t.eu}. {t.credits}</p>
  </div>
</footer>

<style>
  /* Calé sur Outfit 900, mesuré dans le navigateur : l'encre de « Kotbo »
     fait 2,644 em de large, commence 0,047 em après le bord de sa boîte, et
     les capitales montent 0,734 em au-dessus de la ligne de base, elle-même à
     0,87 em du haut de la ligne. Le corps en cqi fait tenir le mot pile dans
     la largeur de la colonne, les marges négatives collent l'encre au coin
     haut gauche, la hauteur s'arrête sur la ligne de base. */
  .wordmark {
    font-size: 37.8cqi;
    line-height: 1;
    letter-spacing: -0.05em;
    margin-left: -0.047em;
    margin-top: -0.136em;
    height: 0.74em;
    white-space: nowrap;
  }
</style>

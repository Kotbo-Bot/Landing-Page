<script lang="ts">
  /**
   * Le pied de page : deux groupes de liens réels (le produit, le légal), pas
   * quatre colonnes de gabarit. Puis une rangée de badges de conformité, chacun
   * un lien vers la page légale qui l'établit.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { CONTACT_EMAIL, DISCORD_URL, DOCS_URL, STATUS_URL } from '$lib/product';

  const TEXT = {
    fr: {
      tagline: 'Le centre de contrôle des communautés Discord.',
      product: 'Le produit',
      legal: 'Le légal',
      discord: 'Serveur Discord',
      docs: 'Documentation',
      status: 'État des services',
      privacy: 'Confidentialité',
      terms: 'CGU',
      sales: 'CGV',
      cookies: 'Cookies',
      dpa: 'DPA',
      notice: 'Mentions légales',
      credits:
        'Polices de la carte de rang : SIL Open Font License 1.1.',
      trust: 'Données et conformité',
      euAlt: 'Fièrement créé et hébergé en Union européenne',
      gdprTop: 'RGPD',
      gdprBottom: 'Conforme',
      gdprAlt: 'Conforme au RGPD : lire la politique de confidentialité',
      dpaBadge: 'Accord de sous-traitance',
      dpaSub: 'Article 28 du RGPD',
      trackers: 'Aucun traceur tiers',
      trackersSub: "Mesure d'audience sans cookie",
      stripe: 'Paiement sécurisé par',
      stripeAlt: 'Paiement sécurisé par Stripe : lire les conditions de paiement',
    },
    en: {
      tagline: 'The control center for Discord communities.',
      product: 'Product',
      legal: 'Legal',
      discord: 'Discord server',
      docs: 'Documentation',
      status: 'Service status',
      privacy: 'Privacy',
      terms: 'Terms',
      sales: 'Sales terms',
      cookies: 'Cookies',
      dpa: 'DPA',
      notice: 'Legal notice',
      credits: 'Rank card fonts: SIL Open Font License 1.1.',
      trust: 'Data and compliance',
      euAlt: 'Proudly built and hosted in the European Union',
      gdprTop: 'GDPR',
      gdprBottom: 'Compliant',
      gdprAlt: 'GDPR compliant: read the privacy policy',
      dpaBadge: 'Data processing agreement',
      dpaSub: 'GDPR Article 28',
      trackers: 'No third-party trackers',
      trackersSub: 'Cookie-free audience measurement',
      stripe: 'Secure payment by',
      stripeAlt: 'Secure payment by Stripe: read the payment terms',
    },
  };

  const t = $derived(TEXT[getLocale()]);

  /**
   * Chaque badge renvoie à la page qui le prouve. « Conforme » est une
   * déclaration de Kotbo, jamais « certifié » : la CNIL ne délivre aucune
   * certification de ce genre.
   */
  const badges = $derived([
    { href: `${base}/dpa`, title: t.dpaBadge, sub: t.dpaSub },
    { href: `${base}/cookies`, title: t.trackers, sub: t.trackersSub },
  ]);

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

  // L'image fournie porte son texte : une version par langue, l'anglaise
  // refaite avec le même drapeau et la même police (Open Sans Bold).
  const EU_BADGE = { fr: { src: 'eu-fr.png', width: 913 }, en: { src: 'eu-en.png', width: 809 } };
  const eu = $derived(EU_BADGE[getLocale()]);
</script>

<!-- Aplat encre, comme la soirée qui dérape : la page finit sur un registre
     franc, et le nom de Kotbo en très gros corps la signe. -->
<footer class="bg-gray-950 text-white">
  <div class="mx-auto grid max-w-360 gap-10 px-4 pt-16 pb-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
    <div>
      <p class="flex items-center gap-2.5">
        <img src="{base}/favicon.svg" alt="" width="36" height="36" class="h-9 w-9" />
        <span class="font-headline text-lg font-extrabold">Kotbo</span>
      </p>
      <p class="mt-4 max-w-xs text-sm text-gray-300">{t.tagline}</p>
      <a href="mailto:{CONTACT_EMAIL}" class="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-white underline decoration-gray-500 underline-offset-4 hover:decoration-white">{CONTACT_EMAIL}</a>
    </div>
    <div>
      <p class="text-sm font-semibold text-gray-400">{t.product}</p>
      <ul class="mt-3 space-y-1 text-sm font-medium text-gray-100">
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href={DISCORD_URL} target="_blank" rel="noopener">{t.discord}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href={DOCS_URL} target="_blank" rel="noopener">{t.docs}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href={STATUS_URL} target="_blank" rel="noopener">{t.status}</a></li>
      </ul>
    </div>
    <div>
      <p class="text-sm font-semibold text-gray-400">{t.legal}</p>
      <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-medium text-gray-100">
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href="{base}/privacy">{t.privacy}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href="{base}/terms">{t.terms}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href="{base}/cgv">{t.sales}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href="{base}/cookies">{t.cookies}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href="{base}/dpa">{t.dpa}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-indigo-200" href="{base}/mentions-legales">{t.notice}</a></li>
      </ul>
    </div>
  </div>
  <!-- Les trois badges en couleur portent les engagements forts (hébergement,
       RGPD, paiement) ; les deux autres restent au trait, ce sont des liens
       vers les pages légales qui les détaillent. -->
  <div class="mx-auto max-w-360 px-4 pb-12 sm:px-8">
    <ul class="flex flex-wrap items-stretch gap-3 border-t border-gray-800 pt-8" aria-label={t.trust}>
      <li class="w-full sm:w-auto">
        <a
          href="{base}/mentions-legales#hebergeur"
          class="block h-full overflow-hidden rounded-xl bg-white"
        >
          <img
            src="{base}/badges/{eu.src}"
            alt={t.euAlt}
            width={eu.width}
            height="128"
            class="block h-auto w-full sm:h-16 sm:w-auto"
          />
        </a>
      </li>
      <li class="w-full sm:w-auto">
        <a
          href="{base}/privacy"
          aria-label={t.gdprAlt}
          class="flex h-full items-center gap-3 rounded-xl bg-[#003399] px-4 py-2 text-white hover:bg-[#002b80] sm:h-16"
        >
          <svg viewBox="0 0 48 48" width="44" height="44" class="h-11 w-11 shrink-0" aria-hidden="true">
            {#each STARS as [x, y]}
              <polygon points={STAR} transform="translate({x} {y})" fill="#FFCC00" />
            {/each}
            <path d="M16 24.5l5.5 5.5L32.5 19" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="flex flex-col leading-none" aria-hidden="true">
            <span class="font-headline text-2xl font-extrabold">{t.gdprTop}</span>
            <span class="mt-1 text-base font-medium">{t.gdprBottom}</span>
          </span>
        </a>
      </li>
      <li class="w-full sm:w-auto">
        <a
          href="{base}/cgv#paiement"
          aria-label={t.stripeAlt}
          class="flex h-full flex-col justify-center gap-1.5 rounded-xl bg-white px-4 py-2 hover:bg-indigo-50 sm:h-16"
        >
          <span class="flex items-center gap-1.5" aria-hidden="true">
            <span class="text-sm font-bold text-gray-900">{t.stripe}</span>
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
      {#each badges as badge (badge.href)}
        <li class="w-full sm:w-auto">
          <a
            href={badge.href}
            class="group flex h-full min-h-11 flex-col justify-center rounded-xl border border-gray-700 px-4 py-3 hover:border-gray-400"
          >
            <span class="text-sm font-semibold text-white group-hover:text-indigo-200">{badge.title}</span>
            <span class="text-xs text-gray-400">{badge.sub}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
  <div class="mx-auto max-w-360 px-4 pb-8 sm:px-8 sm:pb-10">
    <!-- Décoratif : « Kotbo » est déjà lu plus haut. -->
    <div class="@container overflow-y-clip" aria-hidden="true">
      <p class="wordmark font-headline font-extrabold text-indigo-200">Kotbo</p>
    </div>
    <p class="mt-6 text-xs text-gray-400 sm:mt-8">© 2026 Kotbo · {t.credits}</p>
  </div>
</footer>

<style>
  /* Calé sur Manrope 800 : le K commence 0,07 em après le bord de sa boîte et
     les capitales 0,163 em sous le haut de la ligne. Les marges négatives collent
     l'encre au coin haut gauche, la hauteur s'arrête sous la ligne de base, et le
     corps en cqi fait tenir le mot pile dans la largeur de la colonne. */
  .wordmark {
    font-size: 37.9cqi;
    line-height: 1;
    letter-spacing: -0.05em;
    margin-left: -0.07em;
    margin-top: -0.163em;
    height: 0.9em;
    white-space: nowrap;
  }
</style>

<script lang="ts">
  /**
   * Le pied de page de l'accueil v3 : les liens que le haut de page ne montre
   * pas (pages fonctionnalités, ressources, légal). Les pages fonctionnalités
   * y sont toutes, avec leur nom : c'est le maillage interne qui reste.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, STAFF_ROUTE } from '$lib/i18n/routes';
  import { CONTACT_EMAIL, DISCORD_URL, DOCS_URL, STATUS_URL, TOPGG_VOTE_URL } from '$lib/product';
  import { FEATURES } from '$lib/data/features';

  const TEXT = {
    fr: {
      tagline: 'Le bot Discord qui gère ton serveur et ton staff.',
      product: 'Kotbo',
      features: 'Fonctionnalités',
      legal: 'Légal',
      all: 'Toutes les fonctionnalités',
      staff: 'Gestion du staff Discord',
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
      eu: 'Créé et hébergé en UE · RGPD · aucun traceur sur ce site',
    },
    en: {
      tagline: 'The Discord bot that runs your server and your staff.',
      product: 'Kotbo',
      features: 'Features',
      legal: 'Legal',
      all: 'All features',
      staff: 'Discord staff management',
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
      eu: 'Built and hosted in the EU · GDPR · zero trackers on this site',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const link = 'inline-flex min-h-9 items-center text-fog transition-colors hover:text-white';
</script>

<footer class="border-t border-line bg-night">
  <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
    <div>
      <div class="flex items-center gap-2.5">
        <img src="{base}/favicon.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-lg" />
        <span class="font-display text-xl font-extrabold text-white">Kotbo</span>
      </div>
      <p class="mt-4 max-w-xs text-mist">{t.tagline}</p>
      <a href="mailto:{CONTACT_EMAIL}" class="mt-4 inline-block font-mono text-sm text-white underline decoration-line-2 underline-offset-4 hover:decoration-white">{CONTACT_EMAIL}</a>
    </div>
    <nav aria-label={t.product}>
      <p class="text-sm font-semibold text-white">{t.product}</p>
      <ul class="mt-3 text-sm">
        <li><a class={link} href="/demo/">{t.demo}</a></li>
        <li><a class={link} href={DOCS_URL} target="_blank" rel="noopener">{t.docs}</a></li>
        <li><a class={link} href={STATUS_URL} target="_blank" rel="noopener">{t.status}</a></li>
        <li><a class={link} href={DISCORD_URL} target="_blank" rel="noopener">{t.discord}</a></li>
        <li><a class={link} href={TOPGG_VOTE_URL} target="_blank" rel="noopener">{t.vote}</a></li>
      </ul>
    </nav>
    <nav aria-label={t.features}>
      <p class="text-sm font-semibold text-white">{t.features}</p>
      <ul class="mt-3 text-sm">
        <li><a class={link} href="{base}{locale === 'fr' ? '/fonctionnalites' : '/en/features'}">{t.all}</a></li>
        <li><a class={link} href="{base}{STAFF_ROUTE[locale]}">{t.staff}</a></li>
        {#each FEATURES as p (p.slug.fr)}
          <li><a class={link} href="{base}{featurePath(p.slug, locale)}">{p.text[locale].name}</a></li>
        {/each}
      </ul>
    </nav>
    <nav aria-label={t.legal}>
      <p class="text-sm font-semibold text-white">{t.legal}</p>
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
  <div class="border-t border-line">
    <p class="mx-auto max-w-7xl px-4 py-6 font-mono text-xs text-fog sm:px-6">© {new Date().getFullYear()} Kotbo · {t.eu}</p>
  </div>
</footer>

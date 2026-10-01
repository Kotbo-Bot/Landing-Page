<script lang="ts">
  /**
   * Le pied de page : deux groupes de liens réels (le produit, le légal), pas
   * quatre colonnes de gabarit.
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
    },
  };

  const t = $derived(TEXT[getLocale()]);
</script>

<footer class="border-t-2 border-gray-200 bg-white">
  <div class="mx-auto grid max-w-360 gap-10 px-4 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
    <div>
      <p class="flex items-center gap-2.5">
        <img src="{base}/favicon.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-lg" />
        <span class="font-headline text-lg font-extrabold text-gray-900">Kotbo</span>
      </p>
      <p class="mt-3 max-w-xs text-sm text-gray-700">{t.tagline}</p>
      <a href="mailto:{CONTACT_EMAIL}" class="mt-3 inline-block text-sm font-semibold text-gray-900 underline underline-offset-4">{CONTACT_EMAIL}</a>
    </div>
    <div>
      <p class="text-sm font-bold text-gray-900">{t.product}</p>
      <ul class="mt-3 space-y-1 text-sm text-gray-700">
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href={DISCORD_URL} target="_blank" rel="noopener">{t.discord}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href={DOCS_URL} target="_blank" rel="noopener">{t.docs}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href={STATUS_URL} target="_blank" rel="noopener">{t.status}</a></li>
      </ul>
    </div>
    <div>
      <p class="text-sm font-bold text-gray-900">{t.legal}</p>
      <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href="{base}/privacy">{t.privacy}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href="{base}/terms">{t.terms}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href="{base}/cgv">{t.sales}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href="{base}/cookies">{t.cookies}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href="{base}/dpa">{t.dpa}</a></li>
        <li><a class="inline-flex min-h-9 items-center hover:text-gray-900" href="{base}/mentions-legales">{t.notice}</a></li>
      </ul>
    </div>
  </div>
  <p class="mx-auto max-w-360 px-4 pb-8 text-xs text-gray-600 sm:px-8">© 2026 Kotbo · {t.credits}</p>
</footer>

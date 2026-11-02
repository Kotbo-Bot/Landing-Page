<script lang="ts">
  /**
   * Le prix, en une phrase : Kotbo est gratuit, l'offre complète a un seul
   * prix, quelle que soit la taille du serveur. Le sélecteur ne change que la
   * périodicité.
   *
   * Montants en centimes, recopiés de `PLAN_REGISTRY` (offre `PLUS`, comme
   * `seo/jsonld.js` et `static/llms.txt` : les modifier ensemble).
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { trackOnView, track } from '$lib/funnel';
  import { REFERRAL_DISCOUNT_PERCENT, TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  const PLUS = { name: 'Plus', month: 500, year: 3_000 };

  const TEXT = {
    fr: {
      title: 'Gratuit pour démarrer, un seul prix pour tout le reste',
      sentenceA: 'Kotbo est gratuit. L’offre complète coûte',
      sentenceB: 'par mois, quelle que soit la taille de ton serveur',
      billing: 'Facturation',
      monthly: 'Au mois',
      yearly: 'À l’année',
      yearlyHint: '-50 %',
      billedYearly: (n: string) => `Facturé ${n} par an`,
      noCommit: 'Sans engagement, résiliable quand tu veux',
      plan: 'Offre',
      trial: `Avec un code de parrainage, ${TRIAL_DAYS} jours offerts puis -${REFERRAL_DISCOUNT_PERCENT} % sur ta première facture. Sans abonnement, ton serveur reste en gratuit`,
      free: 'Gratuit, sans limite de durée : modération, AutoMod et anti-raid, logs, accueil, tickets, niveaux, giveaways, stats, alertes YouTube et Twitch',
      included:
        'L’offre complète ajoute ce qu’aucun bot gratuit ne fait : toute la gestion du staff, l’IA de modération, le site de ta communauté, saisons, clans, économie et RPG, le serveur MCP, le cross-serveur, et les modules qui sortiront après. Aucun module en option',
      ht: 'Prix HT',
      euro: (cents: number) =>
        `${(cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })} €`,
    },
    en: {
      title: 'Free to start, one price for everything else',
      sentenceA: 'Kotbo is free. The full plan costs',
      sentenceB: 'a month, whatever the size of your server',
      billing: 'Billing',
      monthly: 'Monthly',
      yearly: 'Yearly',
      yearlyHint: '-50%',
      billedYearly: (n: string) => `Billed ${n} a year`,
      noCommit: 'No commitment, cancel whenever',
      plan: 'Plan',
      trial: `With a referral code, ${TRIAL_DAYS} days free then ${REFERRAL_DISCOUNT_PERCENT}% off your first invoice. Without a subscription, your server stays on free`,
      free: 'Free, forever: moderation, AutoMod and anti-raid, logs, welcome, tickets, levels, giveaways, stats, YouTube and Twitch alerts',
      included:
        'The full plan adds what no free bot does: full staff management, AI moderation, your community website, seasons, clans, economy and RPG, the MCP server, cross-server, and every module that ships later. No add-ons',
      ht: 'Prices excl. VAT',
      euro: (cents: number) =>
        `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`,
    },
  };

  const t = $derived(TEXT[getLocale()]);

  let yearly = $state(true);
  let touched = false;
  const monthCents = $derived(yearly ? Math.round(PLUS.year / 12) : PLUS.month);

  function setYearly(value: boolean) {
    yearly = value;
    if (touched) return;
    touched = true;
    track('playground_started', { content: 'pricing' });
  }
</script>

<section id="prix" aria-labelledby="price-title" use:trackOnView={'pricing_viewed'} class="bg-night pb-20 lg:pb-32">
  <div class="bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="prix" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-5xl">
    <h2 id="price-title" class="text-balance text-lg font-semibold text-mist">{t.title}</h2>

    <p class="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.02em] text-fog sm:text-6xl">
      {t.sentenceA}
      <span class="whitespace-nowrap text-ink tabular-nums">{t.euro(monthCents)}</span>
      {t.sentenceB}
    </p>

    <div class="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label={t.billing} class="inline-grid grid-cols-2 rounded-xl border border-line-2 p-1 text-sm font-semibold">
        <button type="button" aria-pressed={!yearly} onclick={() => setYearly(false)} class="min-h-10 rounded-lg px-4 transition-colors {!yearly ? 'bg-ink text-night' : 'text-fog hover:text-ink'}">{t.monthly}</button>
        <button type="button" aria-pressed={yearly} onclick={() => setYearly(true)} class="min-h-10 rounded-lg px-4 transition-colors {yearly ? 'bg-ink text-night' : 'text-fog hover:text-ink'}">
          {t.yearly} <span class="ml-1 {yearly ? 'text-[#15803d] in-data-[theme=light]:text-[#4ade80]' : 'text-ok'}">{t.yearlyHint}</span>
        </button>
      </div>
      <p class="text-sm text-fog">
        {t.plan} <span class="font-semibold text-ink">{PLUS.name}</span> · {yearly ? t.billedYearly(t.euro(PLUS.year)) : t.noCommit} · {t.ht}
      </p>
    </div>

    <p class="mt-10 max-w-3xl text-lg font-semibold leading-relaxed text-ink">{t.free}</p>
    <p class="mt-4 max-w-3xl text-lg leading-relaxed text-mist">{t.included}</p>

    <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
      <AddButton content="pricing" size="lg" />
      <p class="max-w-sm text-sm text-fog">{t.trial}</p>
    </div>
    </div>
  </div>
</section>

<script lang="ts">
  /**
   * Le prix, en une ligne : glisse la taille de ton serveur, lis ton prix.
   *
   * Les offres payantes de Kotbo sont identiques, seule la tranche de membres
   * change, et un serveur ne peut souscrire que la sienne
   * (`planForMemberCount` côté bot). Pas de colonnes à comparer, donc : un
   * curseur, un prix, et ce qui est inclus dit une fois.
   *
   * Montants en centimes, recopiés de `PLAN_REGISTRY` (comme
   * `components/Pricing.svelte`, `seo/jsonld.js` et `static/llms.txt` : les
   * modifier ensemble).
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { trackOnView, track } from '$lib/funnel';
  import { SALES_URL, TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  const TIERS = [
    { key: 'STARTER', name: 'Starter', max: 1_000, month: 500, year: 3_000 },
    { key: 'PRO', name: 'Pro', max: 10_000, month: 999, year: 4_999 },
    { key: 'ULTIMATE', name: 'Ultimate', max: 100_000, month: 2_500, year: 14_999 },
  ];

  const TEXT = {
    fr: {
      title: 'Le prix dépend du nombre de membres, et de rien d’autre.',
      sentenceA: 'Pour un serveur de',
      sentenceB: ', Kotbo te coûte',
      sentenceC: 'par mois.',
      billing: 'Facturation',
      slider: 'Nombre de membres sur ton serveur',
      members: 'membres',
      monthly: 'Au mois',
      yearly: 'À l’année',
      yearlyHint: '-50 %',
      perMonth: '/mois',
      billedYearly: (n: string) => `Facturé ${n} par an.`,
      noCommit: 'Sans engagement, résiliable quand tu veux.',
      plan: 'Offre',
      custom: 'Au-delà de 100 000 membres, on construit l’offre ensemble.',
      customCta: 'Prendre rendez-vous',
      trial: `${TRIAL_DAYS} jours gratuits, une fois par serveur, sans carte bancaire. Tu configures tout avant de payer.`,
      included:
        'Chaque offre contient tout Kotbo : modération, AutoMod et anti-raid, logs, tickets et candidatures, toute la gestion du staff, niveaux, économie, stats, alertes YouTube et Twitch, le dashboard, et les modules qui sortiront après. Aucun module en option.',
      ht: 'Prix HT.',
      euro: (cents: number) =>
        `${(cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })} €`,
    },
    en: {
      title: 'The price depends on member count, and nothing else.',
      sentenceA: 'For a server with',
      sentenceB: ', Kotbo costs you',
      sentenceC: 'a month.',
      billing: 'Billing',
            slider: 'Members on your server',
      members: 'members',
      monthly: 'Monthly',
      yearly: 'Yearly',
      yearlyHint: '-50%',
      perMonth: '/mo',
      billedYearly: (n: string) => `Billed ${n} a year.`,
      noCommit: 'No commitment, cancel whenever.',
      plan: 'Plan',
      custom: 'Above 100,000 members, we build the plan together.',
      customCta: 'Book a call',
      trial: `${TRIAL_DAYS} days free, once per server, no credit card. Set everything up before you pay.`,
      included:
        'Every plan has all of Kotbo: moderation, AutoMod and anti-raid, logs, tickets and applications, full staff management, levels, economy, stats, YouTube and Twitch alerts, the dashboard, and every module that ships later. No add-ons.',
      ht: 'Prices excl. VAT.',
      euro: (cents: number) =>
        `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`,
    },
  };

  const t = $derived(TEXT[getLocale()]);

  /** Curseur 0–100, échelle logarithmique de 100 à 1 000 000 membres. */
  let slider = $state(40);
  let yearly = $state(true);
  let touched = false;

  const members = $derived(Math.round(100 * Math.pow(10_000, slider / 100)));
  const fmt = (n: number) => n.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/\u202f/g, '\u00a0');
  const shown = $derived(members >= 10_000 ? Math.round(members / 1000) * 1000 : members >= 1000 ? Math.round(members / 100) * 100 : Math.round(members / 10) * 10);
  const tier = $derived(TIERS.find((x) => members <= x.max) ?? null);
  const monthCents = $derived(tier ? (yearly ? Math.round(tier.year / 12) : tier.month) : 0);

  function onSlide() {
    if (touched) return;
    touched = true;
    track('playground_started', { content: 'pricing' });
  }
</script>

<section id="prix" aria-labelledby="price-title" use:trackOnView={'pricing_viewed'} class="bg-night pb-20 lg:pb-32">
  <div class="sticky top-16 z-20 bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="prix" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-5xl">
    <h2 id="price-title" class="text-balance text-lg font-semibold text-mist">{t.title}</h2>

    <!-- La phrase est le tarif : elle se relit à chaque cran du curseur. -->
    <p class="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-[-0.02em] text-fog sm:text-6xl" aria-live="polite">
      {#if tier}
        {t.sentenceA}
        <span class="whitespace-nowrap text-white tabular-nums">{fmt(shown)}{members >= 1_000_000 ? '+' : ''} {t.members}</span>{t.sentenceB}
        <span class="whitespace-nowrap text-white tabular-nums">{t.euro(monthCents)}</span>
        {t.sentenceC}
      {:else}
        {t.custom}
      {/if}
    </p>

    <label for="price-members" class="sr-only">{t.slider}</label>
    <input
      id="price-members"
      type="range"
      min="0"
      max="100"
      step="1"
      bind:value={slider}
      oninput={onSlide}
      class="price-range mt-10 w-full"
      style="--p: {slider}%"
    />
    <div class="mt-2 flex justify-between text-xs tabular-nums text-fog" aria-hidden="true">
      <span>100</span><span>1 000</span><span>10 000</span><span>100 000</span><span>1 M</span>
    </div>

    <div class="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label={t.billing} class="inline-grid grid-cols-2 rounded-xl border border-line-2 p-1 text-sm font-semibold">
        <button type="button" aria-pressed={!yearly} onclick={() => (yearly = false)} class="min-h-10 rounded-lg px-4 transition-colors {!yearly ? 'bg-night-4 text-white' : 'text-fog hover:text-white'}">{t.monthly}</button>
        <button type="button" aria-pressed={yearly} onclick={() => (yearly = true)} class="min-h-10 rounded-lg px-4 transition-colors {yearly ? 'bg-night-4 text-white' : 'text-fog hover:text-white'}">
          {t.yearly} <span class="ml-1 text-ok">{t.yearlyHint}</span>
        </button>
      </div>
      <p class="text-sm text-fog">
        {#if tier}
          {t.plan} <span class="font-semibold text-white">{tier.name}</span>. {yearly ? t.billedYearly(t.euro(tier.year)) : t.noCommit} {t.ht}
        {:else}
          <a href={SALES_URL} onclick={() => track('sales_clicked')} class="font-semibold text-white underline decoration-line-2 underline-offset-4 hover:decoration-white">{t.customCta}</a>
        {/if}
      </p>
    </div>

    <p class="mt-10 max-w-3xl text-lg leading-relaxed text-mist">{t.included}</p>

    <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
      <AddButton content="pricing" size="lg" />
      <p class="max-w-sm text-sm text-fog">{t.trial}</p>
    </div>
    </div>
  </div>
</section>

<style>
  .price-range {
    appearance: none;
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(to right, #818cf8 var(--p), #27272a var(--p));
    cursor: pointer;
  }
  .price-range::-webkit-slider-thumb {
    appearance: none;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: #fff;
    border: 6px solid #4f46e5;
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.6);
  }
  .price-range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #fff;
    border: 6px solid #4f46e5;
  }
</style>

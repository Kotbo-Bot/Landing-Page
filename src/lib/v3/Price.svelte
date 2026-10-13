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
  import { reveal } from '$lib/actions/reveal';
  import { trackOnView, track } from '$lib/funnel';
  import { SALES_URL, TRIAL_DAYS } from '$lib/product';
  import AddButton from './AddButton.svelte';

  const TIERS = [
    { key: 'STARTER', name: 'Starter', max: 1_000, month: 500, year: 3_000 },
    { key: 'PRO', name: 'Pro', max: 10_000, month: 999, year: 4_999 },
    { key: 'ULTIMATE', name: 'Ultimate', max: 100_000, month: 2_500, year: 14_999 },
  ];

  const TEXT = {
    fr: {
      kicker: '/prix',
      title: 'Un prix. Tout dedans.',
      intro: 'Le prix suit la taille de ton serveur, rien d’autre. Pas de module en option, pas de « passe Premium pour débloquer ».',
      slider: 'Membres sur ton serveur',
      members: 'membres',
      monthly: 'Au mois',
      yearly: 'À l’année',
      yearlyHint: '-50 %',
      perMonth: '/mois',
      billedYearly: (n: string) => `soit ${n} par an`,
      noCommit: 'Sans engagement, résiliable quand tu veux.',
      plan: 'Offre',
      custom: 'Au-delà de 100 000 membres, on construit l’offre ensemble.',
      customCta: 'Prendre rendez-vous',
      trial: `${TRIAL_DAYS} jours gratuits, une fois par serveur, sans carte bancaire. Tu configures tout avant de payer.`,
      included: [
        'Modération, AutoMod, anti-raid, logs',
        'Tickets, candidatures, formulaires',
        'Gestion du staff complète',
        'Niveaux, économie, événements',
        'Stats et analytics',
        'YouTube, Twitch, automatisations',
        'Le dashboard web',
        'Tous les modules à venir',
      ],
      ht: 'Prix HT.',
      euro: (cents: number) =>
        `${(cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })} €`,
    },
    en: {
      kicker: '/pricing',
      title: 'One price. Everything in.',
      intro: 'The price follows your server’s size, nothing else. No optional modules, no “go Premium to unlock”.',
      slider: 'Members on your server',
      members: 'members',
      monthly: 'Monthly',
      yearly: 'Yearly',
      yearlyHint: '-50%',
      perMonth: '/mo',
      billedYearly: (n: string) => `that’s ${n} per year`,
      noCommit: 'No commitment, cancel whenever.',
      plan: 'Plan',
      custom: 'Above 100,000 members, we build the plan together.',
      customCta: 'Book a call',
      trial: `${TRIAL_DAYS} days free, once per server, no credit card. Set everything up before you pay.`,
      included: [
        'Moderation, AutoMod, anti-raid, logs',
        'Tickets, applications, forms',
        'Full staff management',
        'Levels, economy, events',
        'Stats and analytics',
        'YouTube, Twitch, automations',
        'The web dashboard',
        'Every module that ships later',
      ],
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
  const shown = $derived(members >= 10_000 ? Math.round(members / 1000) * 1000 : members >= 1000 ? Math.round(members / 100) * 100 : Math.round(members / 10) * 10);
  const tier = $derived(TIERS.find((x) => members <= x.max) ?? null);
  const monthCents = $derived(tier ? (yearly ? Math.round(tier.year / 12) : tier.month) : 0);

  function onSlide() {
    if (touched) return;
    touched = true;
    track('playground_started', { content: 'pricing' });
  }
</script>

<section id="prix" aria-labelledby="price-title" use:trackOnView={'pricing_viewed'} class="border-t border-line bg-night py-24 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div class="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-20">
      <div use:reveal={{ direction: 'up' }}>
        <p class="font-mono text-sm text-glow">{t.kicker}</p>
        <h2 id="price-title" class="mt-4 font-display text-5xl font-black leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">{t.title}</h2>
        <p class="mt-6 max-w-lg text-lg text-mist">{t.intro}</p>
        <ul class="mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {#each t.included as item (item)}
            <li class="flex items-start gap-2.5 text-mist">
              <svg aria-hidden="true" viewBox="0 0 16 16" class="mt-1 h-4 w-4 shrink-0 text-ok"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="m3.5 8.5 3 3 6-7" /></svg>
              {item}
            </li>
          {/each}
        </ul>
      </div>

      <div use:reveal={{ direction: 'up', delay: 100 }} class="rounded-3xl border border-line-2 bg-night-2 p-6 shadow-[0_40px_100px_-40px_rgba(79,70,229,0.6)] sm:p-8">
        <div class="flex items-baseline justify-between gap-4">
          <label for="price-members" class="text-sm font-semibold text-fog">{t.slider}</label>
          <p class="font-display text-2xl font-extrabold tabular-nums text-white">
            {shown.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/\u202f/g, '\u00a0')}{members >= 1_000_000 ? '+' : ''}
            <span class="text-base font-semibold text-fog">{t.members}</span>
          </p>
        </div>
        <input
          id="price-members"
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={slider}
          oninput={onSlide}
          class="price-range mt-4 w-full"
          style="--p: {slider}%"
        />

        <div role="group" class="mt-6 grid grid-cols-2 rounded-xl border border-line-2 bg-night p-1 text-sm font-semibold">
          <button type="button" aria-pressed={!yearly} onclick={() => (yearly = false)} class="min-h-10 rounded-lg transition-colors {!yearly ? 'bg-night-4 text-white' : 'text-fog hover:text-white'}">{t.monthly}</button>
          <button type="button" aria-pressed={yearly} onclick={() => (yearly = true)} class="min-h-10 rounded-lg transition-colors {yearly ? 'bg-night-4 text-white' : 'text-fog hover:text-white'}">
            {t.yearly} <span class="ml-1 text-ok">{t.yearlyHint}</span>
          </button>
        </div>

        <div class="mt-8 min-h-36" aria-live="polite">
          {#if tier}
            <p class="text-sm font-semibold text-fog">{t.plan} <span class="text-white">{tier.name}</span></p>
            <p class="mt-1 font-display text-7xl font-black tabular-nums tracking-tight text-white">
              {t.euro(monthCents)}<span class="text-2xl font-bold text-fog">{t.perMonth}</span>
            </p>
            <p class="mt-2 text-sm text-fog">{yearly ? t.billedYearly(t.euro(tier.year)) : t.noCommit} · {t.ht}</p>
          {:else}
            <p class="font-display text-3xl font-extrabold text-white">{t.custom}</p>
            <a href={SALES_URL} onclick={() => track('sales_clicked')} class="mt-4 inline-flex min-h-11 items-center rounded-xl border border-line-2 px-5 font-semibold text-white hover:bg-night-3">{t.customCta}</a>
          {/if}
        </div>

        <div class="mt-8 border-t border-line pt-6">
          <AddButton content="pricing" class="w-full" />
          <p class="mt-4 text-center text-sm text-mist">{t.trial}</p>
        </div>
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

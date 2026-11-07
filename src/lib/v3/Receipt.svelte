<script lang="ts">
  /**
   * L'addition : ce que coûte la pile de bots, imprimé sur un ticket de caisse.
   *
   * Le visiteur coche ce qui tourne sur son serveur, le ticket s'allonge, et
   * Kotbo arrive en bas avec son prix. Le ticket est l'unique objet clair de
   * la page : c'est le moment où l'on compte, il doit se lire comme un papier.
   *
   * Les prix concurrents sont l'entrée de gamme premium de chaque bot, relevée
   * sur leurs pages publiques en septembre 2026 (conversion approximative pour
   * les prix en dollars), en ordre de grandeur, affichés « ≈ ». Ils
   * changent sans préavis : les revérifier avant de les toucher. Kotbo est
   * opposé à son offre Plus payée à l'année (2,50 €/mois), la seule vendue,
   * au même prix pour tous les serveurs. Le tableur du staff ne coûte rien, il coûte du temps : il est
   * compté en heures, pas en euros.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import AddButton from './AddButton.svelte';
  import ChannelHeader from './ChannelHeader.svelte';
  import { MODULE_COUNT } from './modules';

  type L10n = { fr: string; en: string };
  type Line = { key: string; need: L10n; bot: string; icon: string | null; price: number; kotbo: L10n };

  const LINES: Line[] = [
    { key: 'levels', need: { fr: 'Niveaux & XP', en: 'Levels & XP' }, bot: 'MEE6', icon: 'mee6.png', price: 12, kotbo: { fr: 'Niveaux, XP et rôles de récompense, sans pub', en: 'Levels, XP and reward roles, no ads' } },
    { key: 'mod', need: { fr: 'Modération', en: 'Moderation' }, bot: 'Dyno', icon: 'dyno.png', price: 5, kotbo: { fr: 'Modération, sanctions et automod, journalisées', en: 'Moderation, sanctions and automod, all logged' } },
    { key: 'tickets', need: { fr: 'Tickets', en: 'Tickets' }, bot: 'Ticket Tool', icon: 'tickettool.png', price: 7, kotbo: { fr: 'Tickets à types, macros et transcripts', en: 'Tickets with types, macros and transcripts' } },
    { key: 'raid', need: { fr: 'Anti-raid', en: 'Anti-raid' }, bot: 'Wick', icon: 'wick.png', price: 5, kotbo: { fr: 'Shield, l’anti-raid et l’anti-nuke de Kotbo', en: 'Shield, Kotbo’s anti-raid and anti-nuke' } },
    { key: 'stats', need: { fr: 'Stats', en: 'Stats' }, bot: 'Statbot', icon: 'statbot.png', price: 5, kotbo: { fr: 'Analytics et Pulse, la santé du serveur', en: 'Analytics and Pulse, your server’s health' } },
    { key: 'eco', need: { fr: 'Économie', en: 'Economy' }, bot: 'UnbelievaBoat', icon: 'unbelievaboat.png', price: 4, kotbo: { fr: 'Économie, boutique et quêtes', en: 'Economy, shop and quests' } },
    { key: 'give', need: { fr: 'Giveaways', en: 'Giveaways' }, bot: 'GiveawayBot', icon: 'giveawaybot.png', price: 3, kotbo: { fr: 'Giveaways à conditions, relançables', en: 'Giveaways with conditions, rerollable' } },
  ];

  const KOTBO_PRICE = 2.5;
  /** Ordre de grandeur annoncé comme tel : une soirée par semaine à tenir le tableur. */
  const SHEET_HOURS = 3;

  const TEXT = {
    fr: {
      title: 'Coche les bots que t’as, on t’imprime l’addition',
      intro: 'Un serveur qui grossit finit souvent avec quatre ou cinq abonnements, plus un tableur pour gérer le staff',
      pickLabel: 'Ce que t’as sur ton serveur',
      sheet: 'Tableur du staff + MP',
      sheetBot: 'à la main',
      shop: 'PILE DE BOTS & CIE',
      address: 'quelque part sur ton serveur',
      subtotal: 'Sous-total',
      perMonth: '/mois',
      hours: (h: number) => `+ ${h} h/sem`,
      yourTime: 'de ton temps',
      kotbo: 'Kotbo, tout compris',
      kotboLine: `les ${MODULE_COUNT} modules, staff inclus`,
      kotboFrom: 'dès',
      saved: (n: string) => `T’économises ${n}/mois. Et tes dimanches`,
      perYear: (n: string) => `soit ${n} par an`,
      sheetKotbo: 'Espace staff : planning, absences, grades et tâches',
      tipLabel: (need: string) => `Ce qui remplace « ${need} » dans Kotbo`,
      tipIn: 'Dans Kotbo',
      tipDemo: 'Le voir dans la démo',
      same: 'Même prix. Mais un seul bot, et ton staff en plus',
      empty: 'Coche au moins un truc, sinon le ticket est vide',
      thanks: 'Merci de ta visite. Reviens pas',
      note: 'Prix premium d’entrée relevés sur la page de chaque bot en septembre 2026, en ordre de grandeur. Kotbo n’est affilié à aucun. Kotbo : Plus à l’année, HT',
      priceFmt: (n: number) => `${n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`,
    },
    en: {
      title: 'Tick the bots you run and we’ll print the bill',
      intro: 'A growing server usually ends up with four or five subscriptions, plus a spreadsheet to run the staff',
      pickLabel: 'What you’ve got on your server',
      sheet: 'Staff spreadsheet + DMs',
      sheetBot: 'by hand',
      shop: 'BOT PILE & CO',
      address: 'somewhere on your server',
      subtotal: 'Subtotal',
      perMonth: '/mo',
      hours: (h: number) => `+ ${h} h/wk`,
      yourTime: 'of your time',
      kotbo: 'Kotbo, all in',
      kotboLine: `all ${MODULE_COUNT} modules, staff included`,
      kotboFrom: 'from',
      saved: (n: string) => `You save ${n}/mo. And your Sundays`,
      perYear: (n: string) => `that’s ${n} a year`,
      sheetKotbo: 'Staff space: schedule, absences, ranks and tasks',
      tipLabel: (need: string) => `What replaces “${need}” in Kotbo`,
      tipIn: 'In Kotbo',
      tipDemo: 'See it in the demo',
      same: 'Same price. But one bot, and your staff on top',
      empty: 'Tick at least one thing, or the receipt is empty',
      thanks: 'Thanks for visiting. Don’t come back',
      note: 'Entry-level premium prices from each bot’s page in September 2026, order of magnitude. Kotbo isn’t affiliated with any. Kotbo: Plus billed yearly, excl. VAT',
      priceFmt: (n: number) => `€${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());

  let picked = $state<string[]>(['levels', 'mod', 'tickets', 'raid']);
  let sheet = $state(true);

  const lines = $derived(LINES.filter((l) => picked.includes(l.key)));
  const total = $derived(lines.reduce((sum, l) => sum + l.price, 0));
  const saved = $derived(Math.max(0, total - KOTBO_PRICE));
  const hasAny = $derived(lines.length > 0 || sheet);

  function toggle(key: string) {
    picked = picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key];
  }

  /** Infobulle ouverte au clic (tactile) ; le survol et le focus l'ouvrent aussi en CSS. */
  let tip = $state<string | null>(null);
</script>

<svelte:window
  onkeydown={(e) => e.key === 'Escape' && (tip = null)}
  onclick={(e) => tip && !(e.target as HTMLElement).closest('[data-tip]') && (tip = null)}
/>

{#snippet check(on: boolean)}
  <span aria-hidden="true" class="grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors {on ? 'border-glow bg-glow text-night' : 'border-[#71717a]'}">
    {#if on}<svg viewBox="0 0 16 16" class="h-3.5 w-3.5"><path fill="none" stroke="currentColor" stroke-width="2.5" d="m3.5 8.5 3 3 6-7" /></svg>{/if}
  </span>
{/snippet}

{#snippet help(key: string, need: string, text: string)}
  <span data-tip class="group/tip relative shrink-0">
    <button
      type="button"
      aria-label={t.tipLabel(need)}
      aria-expanded={tip === key}
      aria-describedby="tip-{key}"
      onclick={() => (tip = tip === key ? null : key)}
      class="grid h-11 w-11 place-items-center rounded-full text-fog transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-glow"
    >
      <span aria-hidden="true" class="grid h-5 w-5 place-items-center rounded-full border border-current text-[11px] font-bold">?</span>
    </button>
    <span
      id="tip-{key}"
      role="tooltip"
      class="absolute bottom-full right-0 z-20 mb-1 w-64 rounded-xl border border-line-2 bg-night-3 p-3.5 text-left shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] {tip === key
        ? 'block'
        : 'hidden group-hover/tip:block group-focus-within/tip:block'}"
    >
      <span class="block text-[11px] font-semibold uppercase tracking-wider text-glow">{t.tipIn}</span>
      <span class="mt-1 block text-sm text-ink">{text}</span>
      <a href="/demo/" class="mt-2.5 inline-flex min-h-8 items-center text-sm font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
        {t.tipDemo} <span aria-hidden="true" class="ml-1">→</span>
      </a>
    </span>
  </span>
{/snippet}

<section id="addition" aria-labelledby="receipt-title" class="relative overflow-hidden bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="addition" /></div>
  </div>
  <div class="mx-auto pt-14 lg:pt-20 grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
    <div class="min-w-0">
      <h2 id="receipt-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist">{t.intro}</p>

      <fieldset class="mt-10">
        <legend class="text-sm font-semibold text-fog">{t.pickLabel}</legend>
        <ul class="mt-4 divide-y divide-line rounded-2xl border border-line-2 bg-night-2">
          {#each LINES as line (line.key)}
            {@const on = picked.includes(line.key)}
            <li class="flex items-center gap-1 pr-1.5 transition-colors first:rounded-t-2xl {on ? 'bg-[#4f46e5]/12' : ''}">
              <label class="flex min-h-15 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl py-2 pl-3.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-glow">
                <input type="checkbox" checked={on} onchange={() => toggle(line.key)} class="sr-only" />
                {@render check(on)}
                <img src="{base}/bots/{line.icon}" alt="" width="28" height="28" class="h-7 w-7 shrink-0 rounded-full bg-night-3" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-semibold text-ink">{line.need[locale]}</span>
                  <span class="block truncate text-xs text-fog">{line.bot}</span>
                </span>
                <span class="shrink-0 font-mono text-sm tabular-nums {on ? 'text-ink' : 'text-fog line-through decoration-fog/50'}">≈ {t.priceFmt(line.price)}</span>
              </label>
              {@render help(line.key, line.need[locale], line.kotbo[locale])}
            </li>
          {/each}
          <li class="flex items-center gap-1 rounded-b-2xl pr-1.5 transition-colors {sheet ? 'bg-[#4f46e5]/12' : ''}">
            <label class="flex min-h-15 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-xl py-2 pl-3.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-glow">
              <input type="checkbox" bind:checked={sheet} class="sr-only" />
              {@render check(sheet)}
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#107c41]" aria-hidden="true">
                <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 text-ink"><path fill="currentColor" d="M2 2h12v12H2zM3.5 3.5v2.5h3.5V3.5zm5 0v2.5h4V3.5zm-5 4V10h3.5V7.5zm5 0V10h4V7.5zm-5 4v1h3.5v-1zm5 0v1h4v-1z" /></svg>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold text-ink">{t.sheet}</span>
                <span class="block truncate text-xs text-fog">{t.sheetBot}</span>
              </span>
              <span class="shrink-0 font-mono text-sm tabular-nums {sheet ? 'text-ink' : 'text-fog line-through decoration-fog/50'}">{t.hours(SHEET_HOURS)}</span>
            </label>
            {@render help('sheet', t.sheet, t.sheetKotbo)}
          </li>
        </ul>
      </fieldset>
      <p class="mt-8 max-w-xl text-xs leading-relaxed text-fog">{t.note}</p>
      <p class="sr-only" role="status">{t.subtotal} ≈ {t.priceFmt(total)}{t.perMonth}. {saved > 0 ? t.saved(t.priceFmt(saved)) : t.same}</p>
    </div>

    <!-- Le ticket -->
    <div class="relative mx-auto w-full max-w-sm lg:order-first lg:mt-2">
      <div class="receipt relative -rotate-1 bg-[#fbfaf7] px-6 pb-8 pt-7 font-mono text-[13px] text-[#1c1917] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <p class="text-center font-bold tracking-widest">{t.shop}</p>
        <p class="text-center text-[11px] text-[#57534e]">{t.address}</p>
        <div class="my-4 border-t-2 border-dashed border-[#d6d3d1]" aria-hidden="true"></div>

        {#if !hasAny}
          <p class="py-6 text-center text-[#57534e]">{t.empty}</p>
        {:else}
          <ul class="space-y-2">
            {#each lines as line (line.key)}
              <li class="line-in flex justify-between gap-3">
                <span class="truncate">{line.bot} <span class="text-[#78716c]">· {line.need[locale]}</span></span>
                <span class="shrink-0 tabular-nums">≈ {t.priceFmt(line.price)}</span>
              </li>
            {/each}
            {#if sheet}
              <li class="line-in flex justify-between gap-3">
                <span class="truncate">{t.sheet}</span>
                <span class="shrink-0 tabular-nums">{t.hours(SHEET_HOURS)}</span>
              </li>
            {/if}
          </ul>
          <div class="my-4 border-t-2 border-dashed border-[#d6d3d1]" aria-hidden="true"></div>
          <div class="relative">
          <p class="flex justify-between text-base font-bold">
            <span>{t.subtotal}</span>
            <span class="tabular-nums">≈ {t.priceFmt(total)}{t.perMonth}</span>
          </p>
          {#if sheet}
            <p class="flex justify-between text-[#57534e]"><span></span><span>{t.hours(SHEET_HOURS)} {t.yourTime}</span></p>
          {/if}
          </div>


          <div class="stay-dark mt-6 rounded-lg bg-[#1c1917] p-4 font-sans text-white">
            <div class="flex items-start justify-between gap-3">
              <p class="flex items-center gap-2 font-display text-lg font-extrabold">
                <img src="{base}/favicon.svg" alt="" width="22" height="22" class="h-5.5 w-5.5 rounded" />{t.kotbo}
              </p>
              <p class="shrink-0 text-right font-mono tabular-nums">
                <span class="block text-[11px] text-[#d6d3d1]">{t.kotboFrom}</span>
                <span class="text-xl font-bold">{t.priceFmt(KOTBO_PRICE)}</span><span class="text-xs text-[#d6d3d1]">{t.perMonth}</span>
              </p>
            </div>
            <p class="mt-1 text-xs text-[#d6d3d1]">{t.kotboLine}</p>
            <div class="mt-3 rounded-md bg-[#86efac]/10 px-3 py-2">
              <p class="font-semibold text-[#86efac]">{saved > 0 ? t.saved(t.priceFmt(saved)) : t.same}</p>
              {#if saved > 0}<p class="font-mono text-xs tabular-nums text-[#bbf7d0]">{t.perYear(t.priceFmt(saved * 12))}</p>{/if}
            </div>
          </div>
        {/if}
        <p class="mt-6 text-center text-[11px] text-[#78716c]">{t.thanks}</p>
      </div>
      <div class="mt-8 flex justify-center">
        <AddButton content="receipt" />
      </div>
    </div>
  </div>
</section>

<style>
  /* Bord dentelé du papier, en bas. */
  .receipt::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    height: 10px;
    background:
      linear-gradient(135deg, #fbfaf7 33.33%, transparent 33.33%) 0 0 / 14px 14px,
      linear-gradient(225deg, #fbfaf7 33.33%, transparent 33.33%) 0 0 / 14px 14px;
  }
  .line-in {
    animation: print 260ms steps(4) both;
  }
  @keyframes print {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
</style>

<script lang="ts">
  /**
   * L'addition : ce que coûte la pile de bots, imprimé sur un ticket de caisse.
   *
   * Le visiteur coche ce qui tourne sur son serveur, le ticket s'allonge, et
   * Kotbo arrive en bas avec son prix. Le ticket est l'unique objet clair de
   * la page : c'est le moment où l'on compte, il doit se lire comme un papier.
   *
   * Les prix concurrents sont ceux de `components/Comparison.svelte` (entrée de
   * gamme premium relevée sur leurs pages publiques en septembre 2026, en
   * ordre de grandeur, affichés « ≈ »). Kotbo est opposé à son prix le plus
   * bas (Starter payé à l'année, 2,50 €/mois) : annoncer un palier supérieur
   * gonflerait la comparaison, et c'est le seul prix que tout serveur peut
   * payer. Le tableur du staff ne coûte rien, il coûte du temps : il est
   * compté en heures, pas en euros.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import AddButton from './AddButton.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Line = { key: string; need: { fr: string; en: string }; bot: string; icon: string | null; price: number };

  const LINES: Line[] = [
    { key: 'levels', need: { fr: 'Niveaux & XP', en: 'Levels & XP' }, bot: 'MEE6', icon: 'mee6.png', price: 12 },
    { key: 'mod', need: { fr: 'Modération', en: 'Moderation' }, bot: 'Dyno', icon: 'dyno.png', price: 5 },
    { key: 'tickets', need: { fr: 'Tickets', en: 'Tickets' }, bot: 'Ticket Tool', icon: 'tickettool.png', price: 7 },
    { key: 'raid', need: { fr: 'Anti-raid', en: 'Anti-raid' }, bot: 'Wick', icon: 'wick.png', price: 5 },
    { key: 'stats', need: { fr: 'Stats', en: 'Stats' }, bot: 'Statbot', icon: 'statbot.png', price: 5 },
    { key: 'eco', need: { fr: 'Économie', en: 'Economy' }, bot: 'UnbelievaBoat', icon: 'unbelievaboat.png', price: 4 },
    { key: 'give', need: { fr: 'Giveaways', en: 'Giveaways' }, bot: 'GiveawayBot', icon: 'giveawaybot.png', price: 3 },
  ];

  const KOTBO_PRICE = 2.5;
  /** Ordre de grandeur annoncé comme tel : une soirée par semaine à tenir le tableur. */
  const SHEET_HOURS = 3;

  const TEXT = {
    fr: {
      title: 'Coche les bots que t’as, on t’imprime l’addition.',
      intro: 'Un serveur qui grossit finit souvent avec quatre ou cinq abonnements, plus un tableur pour gérer le staff.',
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
      kotboLine: 'les 51 modules, staff inclus',
      kotboFrom: 'dès',
      saved: (n: string) => `T’économises ${n}/mois. Et tes dimanches.`,
      same: 'Même prix. Mais un seul bot, et ton staff en plus.',
      empty: 'Coche au moins un truc, sinon le ticket est vide.',
      stamp: 'PAYÉ TROP CHER',
      thanks: 'Merci de ta visite. Reviens pas.',
      note: 'Prix premium d’entrée relevés sur la page de chaque bot en septembre 2026, en ordre de grandeur. Kotbo n’est affilié à aucun. Kotbo : Starter à l’année, HT.',
      priceFmt: (n: number) => `${n.toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`,
    },
    en: {
      title: 'Tick the bots you run and we’ll print the bill.',
      intro: 'A growing server usually ends up with four or five subscriptions, plus a spreadsheet to run the staff.',
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
      kotboLine: 'all 51 modules, staff included',
      kotboFrom: 'from',
      saved: (n: string) => `You save ${n}/mo. And your Sundays.`,
      same: 'Same price. But one bot, and your staff on top.',
      empty: 'Tick at least one thing, or the receipt is empty.',
      stamp: 'OVERPAID',
      thanks: 'Thanks for visiting. Don’t come back.',
      note: 'Entry-level premium prices from each bot’s page in September 2026, order of magnitude. Kotbo isn’t affiliated with any. Kotbo: Starter billed yearly, excl. VAT.',
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
</script>

<section id="addition" aria-labelledby="receipt-title" class="relative overflow-hidden bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="sticky top-16 z-20 bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="addition" /></div>
  </div>
  <div class="mx-auto pt-14 lg:pt-20 grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
    <div class="min-w-0">
      <h2 id="receipt-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist">{t.intro}</p>

      <fieldset class="mt-10">
        <legend class="text-sm font-semibold text-fog">{t.pickLabel}</legend>
        <div class="mt-4 grid gap-2 sm:grid-cols-2">
          {#each LINES as line (line.key)}
            {@const on = picked.includes(line.key)}
            <label
              class="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-glow {on
                ? 'border-glow/60 bg-[#4f46e5]/15'
                : 'border-line-2 bg-night-2 hover:border-fog'}"
            >
              <input type="checkbox" checked={on} onchange={() => toggle(line.key)} class="sr-only" />
              <img src="{base}/bots/{line.icon}" alt="" width="28" height="28" class="h-7 w-7 rounded-full bg-night-3" />
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold text-white">{line.need[locale]}</span>
                <span class="block text-xs text-fog">{line.bot}</span>
              </span>
              <span
                aria-hidden="true"
                class="grid h-5 w-5 place-items-center rounded-md border {on ? 'border-glow bg-glow text-night' : 'border-[#71717a]'}"
              >
                {#if on}<svg viewBox="0 0 16 16" class="h-3.5 w-3.5"><path fill="none" stroke="currentColor" stroke-width="2.5" d="m3.5 8.5 3 3 6-7" /></svg>{/if}
              </span>
            </label>
          {/each}
          <label
            class="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-glow {sheet
              ? 'border-glow/60 bg-[#4f46e5]/15'
              : 'border-line-2 bg-night-2 hover:border-fog'}"
          >
            <input type="checkbox" bind:checked={sheet} class="sr-only" />
            <span class="grid h-7 w-7 place-items-center rounded-full bg-[#107c41]" aria-hidden="true">
              <svg viewBox="0 0 16 16" class="h-3.5 w-3.5 text-white"><path fill="currentColor" d="M2 2h12v12H2zM3.5 3.5v2.5h3.5V3.5zm5 0v2.5h4V3.5zm-5 4V10h3.5V7.5zm5 0V10h4V7.5zm-5 4v1h3.5v-1zm5 0v1h4v-1z" /></svg>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-white">{t.sheet}</span>
              <span class="block text-xs text-fog">{t.sheetBot}</span>
            </span>
            <span aria-hidden="true" class="grid h-5 w-5 place-items-center rounded-md border {sheet ? 'border-glow bg-glow text-night' : 'border-[#71717a]'}">
              {#if sheet}<svg viewBox="0 0 16 16" class="h-3.5 w-3.5"><path fill="none" stroke="currentColor" stroke-width="2.5" d="m3.5 8.5 3 3 6-7" /></svg>{/if}
            </span>
          </label>
        </div>
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
          {#if total > 8}
            <p class="stamp pointer-events-none absolute -bottom-9 left-0 rotate-[-9deg] rounded-md border-[3px] border-[#dc2626] px-2 py-0.5 font-sans text-base font-black tracking-wider text-[#dc2626]/85" aria-hidden="true">
              {t.stamp}
            </p>
          {/if}
          <p class="flex justify-between text-base font-bold">
            <span>{t.subtotal}</span>
            <span class="tabular-nums">≈ {t.priceFmt(total)}{t.perMonth}</span>
          </p>
          {#if sheet}
            <p class="flex justify-between text-[#57534e]"><span></span><span>{t.hours(SHEET_HOURS)} {t.yourTime}</span></p>
          {/if}
          </div>


          <div class="mt-12 rounded-lg bg-[#1c1917] p-4 font-sans text-white">
            <p class="flex items-center gap-2 font-display text-lg font-extrabold">
              <img src="{base}/favicon.svg" alt="" width="22" height="22" class="h-5.5 w-5.5 rounded" />{t.kotbo}
            </p>
            <p class="mt-1 font-mono text-sm tabular-nums"><span class="text-[#d6d3d1]">{t.kotboFrom}</span> {t.priceFmt(KOTBO_PRICE)}{t.perMonth}</p>
            <p class="mt-1 text-xs text-[#d6d3d1]">{t.kotboLine}</p>
            <p class="mt-3 font-semibold text-[#86efac]">{saved > 0 ? t.saved(t.priceFmt(saved)) : t.same}</p>
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
  .stamp {
    animation: stamp 380ms cubic-bezier(0.16, 1, 0.3, 1) both 120ms;
  }
  @keyframes print {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
  @keyframes stamp {
    from {
      opacity: 0;
      transform: rotate(-9deg) scale(1.8);
    }
  }
</style>

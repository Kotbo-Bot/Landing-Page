<script lang="ts">
  /**
   * Le visuel du héros : la liste des membres de Discord, rubrique « Bots ».
   *
   * Tout fondateur d'un serveur qui a grandi connaît cette colonne : MEE6 pour
   * les niveaux, Dyno pour la modération, Ticket Tool, Carl-bot, un bot de
   * giveaways, un bot de stats, et le tableur du staff qui traîne à côté. La
   * scène les fait partir un par un, comme Discord l'écrirait, jusqu'à ce
   * qu'il ne reste que Kotbo. C'est l'unique mouvement orchestré du héros.
   *
   * Elle démarre seule une fois, quand elle est à l'écran. En mouvement réduit,
   * l'état final s'affiche directement, les bots partis restent barrés.
   * Les bots cités sont de vrais bots, pour ce qu'ils font : pas une note,
   * pas un avis, seulement leur rôle habituel sur un serveur.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      label: 'Démo : la liste des bots d’un serveur Discord, remplacés un par un par Kotbo',
      server: 'Les Nerds',
      online: 'En ligne',
      bots: 'Bots',
      sheetName: 'planning_staff_FINAL_v3.xlsx',
      sheetRole: 'le tableur du staff',
      kotboRole: 'Fait tout ce qu’il y avait au-dessus',
      left: (name: string) => `${name} a quitté le serveur.`,
      done: 'Il reste un bot, et plus de tableur.',
      replay: 'Rejouer',
      demo: 'démo',
      roles: {
        mee6: 'niveaux',
        dyno: 'modération',
        tickettool: 'tickets',
        carlbot: 'rôles réaction',
        giveawaybot: 'giveaways',
        statbot: 'stats',
      },
      covers: ['modération', 'anti-raid', 'tickets', 'niveaux', 'rôles', 'giveaways', 'stats', 'staff'],
    },
    en: {
      label: 'Demo: a Discord server’s bot list, replaced one by one by Kotbo',
      server: 'The Nerds',
      online: 'Online',
      bots: 'Bots',
      sheetName: 'staff_schedule_FINAL_v3.xlsx',
      sheetRole: 'the staff spreadsheet',
      kotboRole: 'Does everything that was above',
      left: (name: string) => `${name} left the server.`,
      done: 'One bot left, and no spreadsheet.',
      replay: 'Replay',
      demo: 'demo',
      roles: {
        mee6: 'levels',
        dyno: 'moderation',
        tickettool: 'tickets',
        carlbot: 'reaction roles',
        giveawaybot: 'giveaways',
        statbot: 'stats',
      },
      covers: ['moderation', 'anti-raid', 'tickets', 'levels', 'roles', 'giveaways', 'stats', 'staff'],
    },
  };

  const t = $derived(TEXT[getLocale()]);

  type Key = keyof (typeof TEXT)['fr']['roles'] | 'sheet';
  const ROSTER: { key: Key; name: string; icon: string | null }[] = [
    { key: 'mee6', name: 'MEE6', icon: 'mee6.png' },
    { key: 'dyno', name: 'Dyno', icon: 'dyno.png' },
    { key: 'tickettool', name: 'Ticket Tool', icon: 'tickettool.png' },
    { key: 'carlbot', name: 'Carl-bot', icon: 'carlbot.png' },
    { key: 'giveawaybot', name: 'GiveawayBot', icon: 'giveawaybot.png' },
    { key: 'statbot', name: 'Statbot', icon: 'statbot.png' },
    { key: 'sheet', name: '', icon: null },
  ];

  /** Combien ont déjà quitté le serveur, dans l'ordre de la liste. */
  let gone = $state(0);
  let finished = $state(false);
  let timers: ReturnType<typeof setTimeout>[] = [];
  let root = $state<HTMLElement | null>(null);

  const remaining = $derived(ROSTER.length - gone + (finished ? 1 : 0));
  const lastLeft = $derived(gone > 0 ? ROSTER[gone - 1] : null);

  function nameOf(key: Key, name: string): string {
    return key === 'sheet' ? t.sheetName : name;
  }

  function clear() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function play(delay = 1400) {
    clear();
    gone = 0;
    finished = false;
    ROSTER.forEach((_, i) => {
      timers.push(setTimeout(() => (gone = i + 1), delay + i * 520));
    });
    timers.push(setTimeout(() => (finished = true), delay + ROSTER.length * 520 + 250));
  }

  onMount(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gone = ROSTER.length;
      finished = true;
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (root) observer.observe(root);
    return () => {
      observer.disconnect();
      clear();
    };
  });
</script>

<figure bind:this={root} aria-label={t.label} class="relative">
  <div class="overflow-hidden rounded-lg bg-[#2b2d31] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
    <!-- Barre de titre, à la Discord -->
    <div class="flex items-center justify-between border-b border-black/30 bg-[#2b2d31] px-4 py-3">
      <div class="flex items-center gap-2 text-[15px] font-semibold text-[#f2f3f5]">
        <span class="grid h-6 w-6 place-items-center rounded-full bg-blurple text-[10px] font-bold text-white" aria-hidden="true">LN</span>
        {t.server}
      </div>
      <span class="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] uppercase text-[#b5bac1]">{t.demo}</span>
    </div>

    <div class="px-3 pb-3 pt-4">
      <p class="px-2 text-xs font-semibold uppercase tracking-wide text-[#949ba4]">
        {t.bots} — <span class="tabular-nums">{remaining}</span>
      </p>

      <ul class="mt-2 space-y-0.5">
        {#each ROSTER as bot, i (bot.key)}
          {@const isGone = i < gone}
          <li
            class="purge-row flex items-center gap-3 rounded-md px-2 py-1.5 {isGone ? 'is-gone' : ''}"
            style="--i: {i}"
          >
            <span class="relative shrink-0">
              {#if bot.icon}
                <img src="{base}/bots/{bot.icon}" alt="" width="32" height="32" class="h-8 w-8 rounded-full bg-[#1e1f22] object-cover" />
              {:else}
                <span class="grid h-8 w-8 place-items-center rounded-full bg-[#107c41]" aria-hidden="true">
                  <svg viewBox="0 0 16 16" class="h-4 w-4 text-white"><path fill="currentColor" d="M2 2h12v12H2zM3.5 3.5v2.5h3.5V3.5zm5 0v2.5h4V3.5zm-5 4V10h3.5V7.5zm5 0V10h4V7.5zm-5 4v1h3.5v-1zm5 0v1h4v-1z" /></svg>
                </span>
              {/if}
              <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-[#2b2d31] {isGone ? 'bg-[#80848e]' : 'bg-[#23a55a]'}"></span>
            </span>
            <span class="min-w-0 flex-1">
              <span class="flex min-w-0 items-center gap-1.5">
                <span class="purge-name truncate text-[15px] font-medium {bot.key === 'sheet' ? 'font-mono text-[13px]' : ''} text-[#f2f3f5]">{nameOf(bot.key, bot.name)}</span>
                {#if bot.key !== 'sheet'}
                  <span class="shrink-0 rounded bg-blurple px-1 text-[10px] font-semibold leading-4 text-white">APP</span>
                {/if}
              </span>
              <span class="block truncate text-xs text-[#949ba4]">
                {bot.key === 'sheet' ? t.sheetRole : t.roles[bot.key]}
              </span>
            </span>
          </li>
        {/each}

        {#if finished}
          <li class="kotbo-row mt-2 rounded-lg bg-[#404249]/60 px-2 py-2">
            <div class="flex items-center gap-3">
              <span class="relative shrink-0">
                <img src="{base}/favicon.svg" alt="" width="32" height="32" class="h-8 w-8 rounded-full" />
                <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-[#3a3c42] bg-[#23a55a]"></span>
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-1.5">
                  <span class="text-[15px] font-semibold text-white">Kotbo</span>
                  <span class="rounded bg-blurple px-1 text-[10px] font-semibold leading-4 text-white">APP</span>
                </span>
                <span class="block truncate text-xs text-[#dbdee1]">{t.kotboRole}</span>
              </span>
            </div>
            <ul class="mt-2.5 flex flex-wrap gap-1 pl-11">
              {#each t.covers as cover, i (cover)}
                <li class="cover-chip rounded bg-[#1e1f22] px-1.5 py-0.5 text-[11px] font-medium text-[#c9cdfb]" style="--i: {i}">{cover}</li>
              {/each}
            </ul>
          </li>
        {/if}
      </ul>
    </div>

    <!-- Le journal du serveur : ce que Discord écrirait -->
    <div class="flex min-h-12 items-center justify-between gap-3 border-t border-black/30 bg-[#1e1f22] px-4 py-2.5 font-mono text-xs">
      {#if finished}
        <span class="text-[#23a55a]">✓ {t.done}</span>
        <button type="button" onclick={() => play(150)} class="shrink-0 rounded px-2 py-1 text-[#b5bac1] underline-offset-2 hover:text-white hover:underline">
          {t.replay}
        </button>
      {:else if lastLeft}
        {#key gone}
          <span class="log-line truncate text-[#f87171]">→ {t.left(nameOf(lastLeft.key, lastLeft.name))}</span>
        {/key}
      {:else}
        <span class="text-[#949ba4]">#{t.bots.toLowerCase()} · {ROSTER.length}</span>
      {/if}
    </div>
  </div>
  <!-- Une seule annonce, à la fin : pas un décompte de sept messages. -->
  <p class="sr-only" role="status">{finished ? t.done : ''}</p>
</figure>

<style>
  .purge-row {
    transition:
      opacity 380ms ease,
      transform 380ms cubic-bezier(0.4, 0, 0.2, 1),
      filter 380ms ease;
  }
  /* Le texte reste lisible une fois barré (4,9:1) : seuls l'avatar et le
     badge s'éteignent. */
  .purge-row.is-gone {
    transform: translateX(10px);
  }
  .purge-row.is-gone img,
  .purge-row.is-gone .grid {
    opacity: 0.4;
    filter: grayscale(1);
  }
  /* Le badge passe au gris plein, pas en transparence : il reste lisible. */
  .purge-row.is-gone .bg-blurple {
    background: #4e5058;
  }
  .purge-row.is-gone .purge-name {
    color: #949ba4;
    text-decoration: line-through;
    text-decoration-color: #f87171;
    text-decoration-thickness: 2px;
  }
  .kotbo-row {
    animation: kotbo-in 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .cover-chip {
    animation: chip-in 300ms ease both;
    animation-delay: calc(250ms + var(--i) * 60ms);
  }
  .log-line {
    animation: chip-in 220ms ease both;
  }
  @keyframes kotbo-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.96);
    }
  }
  @keyframes chip-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
  }
</style>

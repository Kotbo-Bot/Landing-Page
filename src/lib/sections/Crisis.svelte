<script lang="ts">
  /**
   * La soirée qui dérape : quatre problèmes à régler, Kotbo sous la main.
   *
   * C'est la zone « problème » de la page, jouée au lieu d'être racontée. La v1
   * disait « gérer une communauté, ça devient vite le bazar » avec quatre
   * post-its ; ici le bazar arrive dans le fil, s'aggrave tant qu'on ne fait
   * rien, et chaque bouton Kotbo le règle en laissant une trace datée. La
   * trace est l'argument final : ce n'est pas la vitesse qui distingue Kotbo
   * d'un modérateur réveillé, c'est ce qui reste écrit le lendemain.
   *
   * Aplat encre (DESIGN.md) : c'est la nuit, et la zone parle fort.
   *
   * Rien ne démarre sans le visiteur, et aucun incident n'expire : le chrono
   * mesure, il ne sanctionne pas. Un visiteur au clavier ou lent n'est jamais
   * mis en échec.
   */
  import { onDestroy } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import DiscordWindow from '$lib/playground/discord/DiscordWindow.svelte';
  import Message from '$lib/playground/discord/Message.svelte';
  import Embed from '$lib/playground/discord/Embed.svelte';
  import { KOTBO_AVATAR, ktb } from '$lib/playground/discord/theme';
  import { builder } from '$lib/playground/kit.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  type IncidentKey = 'spam' | 'insults' | 'ticket' | 'staff';

  const TEXT = {
    fr: {
      eyebrow: '22 h 14, un vendredi',
      title: 'La soirée dérape.',
      intro:
        'Quatre problèmes vont tomber en même temps, et aucun ne se règle tout seul. Tu as Kotbo sous la main.',
      start: 'Lancer la soirée',
      replay: 'Rejouer la soirée',
      fallbackName: 'Ton serveur',
      channelsLabel: 'Salons',
      talkCategory: 'DISCUSSIONS',
      general: 'général',
      tickets: 'tickets',
      staffRoom: 'staff',
      today: "Aujourd'hui à",
      todoTitle: 'À traiter',
      todoEmpty: 'Rien pour l’instant. Ça ne va pas durer.',
      allClear: 'Tout est réglé.',
      idleTodo: 'Les incidents s’afficheront ici avec le bouton qui les règle.',
      traceTitle: 'Ce qui reste écrit',
      traceEmpty: 'Chaque action que tu fais s’inscrit ici, datée.',
      incidents: {
        spam: {
          label: 'Un compte inonde #général de liens',
          action: 'Supprimer les liens et exclure 10 min',
          done: 'Liens supprimés, fr33-nitro exclu 10 minutes.',
          trace: 'Timeout 10 min · fr33-nitro · motif : spam de liens',
        },
        insults: {
          label: 'Deux membres s’insultent',
          action: 'Avertir les deux, message en preuve',
          done: 'Kyzo et Maël avertis. Le message est joint à la sanction.',
          trace: 'Avertissement · Kyzo, Maël · preuve jointe',
        },
        ticket: {
          label: 'Ticket urgent : harcèlement en MP',
          action: 'Prendre le ticket',
          done: 'Ticket #0212 pris en charge par toi.',
          trace: 'Ticket #0212 pris en charge · priorité haute',
        },
        staff: {
          label: 'Aucun modérateur en ligne',
          action: 'Appeler le staff d’astreinte',
          done: 'Appel envoyé à Lena et Zenox, astreinte du vendredi.',
          trace: 'Appel staff · Lena, Zenox prévenus',
        },
      },
      feed: {
        chill: [
          { author: 'Noé', text: 'gg pour hier soir' },
          { author: 'Inès', text: 'quelqu’un a vu le patch ?' },
        ],
        spam: 'nitro gratuit 👉 dlscord-gift.ru/claim',
        insultA: 't’es sérieux là ? t’es vraiment un boulet',
        insultB: 'répète ça pour voir',
        insultMore: 'personne modère ici de toute façon',
        ticket: 'Nouveau ticket #0212 : « quelqu’un me harcèle en MP depuis une heure »',
        staffAlert: 'Aucun modérateur en ligne depuis 40 minutes.',
        chillAfter: 'ah c’est calme d’un coup',
      },
      elapsed: (s: number) => `${s} s`,
      clockLabel: 'Temps écoulé',
      doneTitle: (s: number) => `Soirée tenue en ${s} secondes.`,
      doneBody:
        'Et demain, personne n’aura à demander qui a fait quoi : tout est dans le journal, avec les preuves. Chez toi, c’est le même bouton.',
      pending: (n: number) => `${n} incident${n > 1 ? 's' : ''} en cours`,
    },
    en: {
      eyebrow: '10:14 pm, a Friday',
      title: 'The night goes sideways.',
      intro: 'Four problems are about to land at once, and none of them sorts itself out. You have Kotbo at hand.',
      start: 'Start the night',
      replay: 'Play the night again',
      fallbackName: 'Your server',
      channelsLabel: 'Channels',
      talkCategory: 'CHAT',
      general: 'general',
      tickets: 'tickets',
      staffRoom: 'staff',
      today: 'Today at',
      todoTitle: 'To handle',
      todoEmpty: 'Nothing yet. It won’t last.',
      allClear: 'All sorted.',
      idleTodo: 'Incidents will show up here with the button that fixes them.',
      traceTitle: 'What stays on record',
      traceEmpty: 'Every action you take is written here, with a timestamp.',
      incidents: {
        spam: {
          label: 'An account floods #general with links',
          action: 'Delete the links, 10 min timeout',
          done: 'Links deleted, fr33-nitro timed out for 10 minutes.',
          trace: 'Timeout 10 min · fr33-nitro · reason: link spam',
        },
        insults: {
          label: 'Two members are insulting each other',
          action: 'Warn both, message as evidence',
          done: 'Kyzo and Maël warned. The message is attached to the sanction.',
          trace: 'Warning · Kyzo, Maël · evidence attached',
        },
        ticket: {
          label: 'Urgent ticket: harassment in DMs',
          action: 'Claim the ticket',
          done: 'Ticket #0212 claimed by you.',
          trace: 'Ticket #0212 claimed · high priority',
        },
        staff: {
          label: 'No moderator online',
          action: 'Call the on-duty staff',
          done: 'Call sent to Lena and Zenox, Friday on-duty.',
          trace: 'Staff call · Lena, Zenox notified',
        },
      },
      feed: {
        chill: [
          { author: 'Noé', text: 'gg for last night' },
          { author: 'Inès', text: 'anyone seen the patch?' },
        ],
        spam: 'free nitro 👉 dlscord-gift.ru/claim',
        insultA: 'are you serious? you’re such a dead weight',
        insultB: 'say that again',
        insultMore: 'nobody moderates here anyway',
        ticket: 'New ticket #0212: “someone has been harassing me in DMs for an hour”',
        staffAlert: 'No moderator online for 40 minutes.',
        chillAfter: 'oh it went quiet all of a sudden',
      },
      elapsed: (s: number) => `${s} s`,
      clockLabel: 'Elapsed time',
      doneTitle: (s: number) => `Night held in ${s} seconds.`,
      doneBody:
        'And tomorrow nobody has to ask who did what: it is all in the log, with the evidence. On your server, it is the same button.',
      pending: (n: number) => `${n} incident${n > 1 ? 's' : ''} open`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const serverName = $derived(builder.displayName(t.fallbackName));

  type MemberLine = { kind: 'member'; author: string; color?: string; text: string; incident?: IncidentKey };
  type BotLine = { kind: 'bot'; text: string; tone: 'ok' | 'alert'; icon: string };
  type FeedItem = (MemberLine | BotLine) & { id: number; time: string };

  let phase = $state<'idle' | 'running' | 'done'>('idle');
  let feed = $state<FeedItem[]>([]);
  let open = $state<IncidentKey[]>([]);
  let resolved = $state<IncidentKey[]>([]);
  let trace = $state<{ key: IncidentKey; time: string }[]>([]);
  let elapsed = $state(0);
  let minute = 14;
  let seq = 0;
  let timers: ReturnType<typeof setTimeout>[] = [];
  let ticker: ReturnType<typeof setInterval> | null = null;
  let scroller = $state<HTMLDivElement | null>(null);

  function clock(): string {
    return `22:${String(minute).padStart(2, '0')}`;
  }

  function push(item: MemberLine | BotLine): void {
    feed = [...feed, { ...item, id: seq++, time: clock() }].slice(-16);
  }

  function later(ms: number, fn: () => void): void {
    timers.push(setTimeout(fn, ms));
  }

  function clearTimers(): void {
    timers.forEach(clearTimeout);
    timers = [];
    if (ticker) clearInterval(ticker);
    ticker = null;
  }

  function raise(key: IncidentKey): void {
    if (!open.includes(key) && !resolved.includes(key)) open = [...open, key];
  }

  /**
   * Ce qui s'aggrave tant qu'un incident reste ouvert. Borné : l'idée est de
   * montrer que le problème ne se règle pas seul, pas de noyer le fil.
   */
  function escalate(key: IncidentKey, times: number, every: number): void {
    for (let i = 1; i <= times; i++) {
      later(every * i, () => {
        if (!open.includes(key)) return;
        minute += 1;
        if (key === 'spam') push({ kind: 'member', author: 'fr33-nitro', color: '#f23f43', text: t.feed.spam, incident: 'spam' });
        if (key === 'insults') push({ kind: 'member', author: 'Kyzo', color: '#f0b232', text: t.feed.insultMore, incident: 'insults' });
      });
    }
  }

  function start(): void {
    clearTimers();
    feed = [];
    open = [];
    resolved = [];
    trace = [];
    elapsed = 0;
    minute = 14;
    phase = 'running';
    track('playground_started', { content: 'crisis' });

    t.feed.chill.forEach((line) => push({ kind: 'member', author: line.author, text: line.text }));
    ticker = setInterval(() => (elapsed += 1), 1000);

    later(1200, () => {
      push({ kind: 'member', author: 'fr33-nitro', color: '#f23f43', text: t.feed.spam, incident: 'spam' });
      push({ kind: 'member', author: 'fr33-nitro', color: '#f23f43', text: t.feed.spam, incident: 'spam' });
      raise('spam');
      escalate('spam', 3, 2600);
    });
    later(3800, () => {
      minute += 1;
      push({ kind: 'member', author: 'Kyzo', color: '#f0b232', text: t.feed.insultA, incident: 'insults' });
      push({ kind: 'member', author: 'Maël', color: '#23a55a', text: t.feed.insultB, incident: 'insults' });
      raise('insults');
      escalate('insults', 2, 3400);
    });
    later(6400, () => {
      minute += 1;
      push({ kind: 'bot', text: t.feed.ticket, tone: 'alert', icon: 'ticket' });
      raise('ticket');
    });
    later(8600, () => {
      minute += 1;
      push({ kind: 'bot', text: t.feed.staffAlert, tone: 'alert', icon: 'warn' });
      raise('staff');
    });
  }

  function resolve(key: IncidentKey): void {
    if (!open.includes(key)) return;
    minute += 1;
    open = open.filter((k) => k !== key);
    resolved = [...resolved, key];
    trace = [...trace, { key, time: clock() }];
    push({ kind: 'bot', text: t.incidents[key].done, tone: 'ok', icon: key === 'ticket' ? 'ticket' : key === 'staff' ? 'mod' : 'shield' });

    if (resolved.length === 4) {
      clearTimers();
      later(900, () => push({ kind: 'member', author: 'Noé', text: t.feed.chillAfter }));
      phase = 'done';
      track('playground_completed', { content: 'crisis' });
    }
  }

  /** Le fil suit le dernier message, comme dans Discord. */
  $effect(() => {
    void feed.length;
    const box = scroller?.querySelector('.dc-scroll');
    if (box) box.scrollTop = box.scrollHeight;
  });

  onDestroy(clearTimers);

  const categories = $derived([
    {
      id: 'talk',
      name: t.talkCategory,
      channels: [
        { id: 'general', name: t.general, unread: false },
        { id: 'tickets', name: t.tickets, unread: open.includes('ticket') },
        { id: 'staff', name: t.staffRoom, unread: open.includes('staff') },
      ],
    },
  ]);

  const ORDER: IncidentKey[] = ['spam', 'insults', 'ticket', 'staff'];
</script>

<section id="crise" aria-labelledby="crisis-title" class="bg-gray-950 text-white">
  <div class="mx-auto max-w-360 px-4 py-20 sm:px-8 lg:py-28">
    <div class="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
      <div>
        <p class="font-hand text-2xl text-red-300">{t.eyebrow}</p>
        <h2 id="crisis-title" class="mt-1 font-headline text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          {t.title}
        </h2>
        <p class="mt-5 max-w-xl text-lg leading-relaxed text-gray-300">{t.intro}</p>
      </div>
      <div class="flex items-center gap-4">
        {#if phase !== 'idle'}
          <p class="font-headline text-4xl font-extrabold tabular-nums" aria-label="{t.clockLabel} : {t.elapsed(elapsed)}">
            {t.elapsed(elapsed)}
          </p>
        {/if}
        {#if phase !== 'running'}
          <button
            type="button"
            onclick={start}
            class="min-h-13 rounded-xl bg-white px-7 text-base font-bold text-gray-900 transition-colors hover:bg-red-100"
          >
            {phase === 'idle' ? t.start : t.replay}
          </button>
        {/if}
      </div>
    </div>

    <div class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <div bind:this={scroller}>
        <DiscordWindow {serverName} serverIcon={builder.kit.icon} {categories} active="general" channelsLabel={t.channelsLabel} height="clamp(15rem, 42svh, 24rem)">
          {#if phase === 'idle'}
            {#each t.feed.chill as line, i (i)}
              <Message author={line.author} time="{t.today} 22:1{i}">{line.text}</Message>
            {/each}
          {:else}
            {#each feed as item (item.id)}
              {#if item.kind === 'member'}
                <Message
                  author={item.author}
                  color={item.color}
                  time="{t.today} {item.time}"
                  enter
                  removed={item.incident !== undefined && resolved.includes(item.incident)}
                >
                  {item.text}
                </Message>
              {:else}
                <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} {item.time}" enter>
                  <Embed color={item.tone === 'ok' ? '#23a55a' : '#f23f43'} icon={ktb(item.icon)}>{item.text}</Embed>
                </Message>
              {/if}
            {/each}
          {/if}
        </DiscordWindow>
      </div>

      <div class="order-first space-y-8 lg:order-none">
        <div>
          <h3 class="flex items-baseline justify-between font-headline text-xl font-extrabold">
            {t.todoTitle}
            {#if phase === 'running'}
              <span class="text-sm font-semibold text-red-300" aria-live="polite">{t.pending(open.length)}</span>
            {/if}
          </h3>
          {#if phase === 'idle'}
            <p class="mt-3 text-gray-400">{t.idleTodo}</p>
          {:else if open.length === 0}
            <p class="mt-3 text-gray-400">{phase === 'done' ? t.allClear : t.todoEmpty}</p>
          {:else}
            <ul class="mt-3 space-y-3">
              {#each ORDER.filter((k) => open.includes(k)) as key (key)}
                <li class="crisis-incident rounded-2xl bg-white p-4 text-gray-900">
                  <p class="flex items-start gap-2 font-bold">
                    <img src={ktb('warn')} alt="" width="20" height="20" class="mt-0.5 h-5 w-5" />
                    {t.incidents[key].label}
                  </p>
                  <button
                    type="button"
                    onclick={() => resolve(key)}
                    class="mt-3 min-h-11 w-full rounded-xl bg-gray-900 px-4 text-sm font-bold text-white transition-colors hover:bg-indigo-600"
                  >
                    {t.incidents[key].action}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>

        <div>
          <h3 class="font-headline text-xl font-extrabold">{t.traceTitle}</h3>
          {#if trace.length === 0}
            <p class="mt-3 text-gray-400">{t.traceEmpty}</p>
          {:else}
            <ol class="mt-3 space-y-2 border-l-2 border-gray-700 pl-4" aria-live="polite">
              {#each trace as entry (entry.key)}
                <li class="crisis-trace text-sm text-gray-200">
                  <span class="font-semibold tabular-nums text-white">{entry.time}</span> · {t.incidents[entry.key].trace}
                </li>
              {/each}
            </ol>
          {/if}
        </div>
      </div>
    </div>

    {#if phase === 'done'}
      <div class="crisis-done mt-14 grid gap-6 rounded-3xl bg-white p-6 text-gray-900 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p class="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">{t.doneTitle(elapsed)}</p>
          <p class="mt-3 max-w-2xl text-lg leading-relaxed text-gray-700">{t.doneBody}</p>
        </div>
        <InviteButton content="crisis" size="lg" />
      </div>
    {/if}
  </div>
</section>

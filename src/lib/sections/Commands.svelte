<script lang="ts">
  /**
   * Les commandes, à taper soi-même dans un salon Discord.
   *
   * Les noms sont ceux du bot, vérifiés dans son code (`/sanction warn` et non
   * `/warn`, `/market` et non `/shop`) : une commande inventée serait la
   * première chose qu'un nouvel administrateur taperait chez lui, et la
   * première déception.
   *
   * Les réponses gardent un état : un avertissement donné apparaît ensuite dans
   * `/sanction list`, un `/daily` crédite le solde que `/market` dépense, et un
   * second `/daily` est refusé comme le fait le bot. C'est ce qui fait la
   * différence entre une démo et une vitrine.
   *
   * Au troisième essai, Kotbo propose lui-même d'aller plus loin : l'invitation
   * vient de la conversation, pas d'un bandeau.
   */
  import { tick } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import { reveal } from '$lib/actions/reveal';
  import DiscordWindow from '$lib/playground/discord/DiscordWindow.svelte';
  import Message from '$lib/playground/discord/Message.svelte';
  import Embed from '$lib/playground/discord/Embed.svelte';
  import DcButton from '$lib/playground/discord/DcButton.svelte';
  import { KOTBO_AVATAR, ktb } from '$lib/playground/discord/theme';
  import RankCanvas from '$lib/playground/rank/RankCanvas.svelte';
  import { builder } from '$lib/playground/kit.svelte';
  import InviteButton from '$lib/playground/InviteButton.svelte';

  type CommandKey = 'rank' | 'leaderboard' | 'ticket' | 'warn' | 'list' | 'daily' | 'market' | 'event';

  const COMMANDS: { key: CommandKey; name: string }[] = [
    { key: 'rank', name: '/rank' },
    { key: 'leaderboard', name: '/leaderboard' },
    { key: 'ticket', name: '/ticket' },
    { key: 'warn', name: '/sanction warn' },
    { key: 'list', name: '/sanction list' },
    { key: 'daily', name: '/daily' },
    { key: 'market', name: '/market' },
    { key: 'event', name: '/event resultat' },
  ];

  const TEXT = {
    fr: {
      title: 'Tape une commande.',
      intro:
        'Écris / dans la barre, comme sur Discord, ou choisis une commande ci-dessous. Kotbo répond, et ses réponses se souviennent de ce que tu viens de faire.',
      fallbackName: 'Ton serveur',
      channel: 'commandes',
      channelsLabel: 'Salons',
      category: 'DISCUSSIONS',
      today: "Aujourd'hui à",
      you: 'Toi',
      placeholder: 'Écris / pour voir les commandes de Kotbo',
      empty: 'Rien dans ce salon pour l’instant. Les réponses de Kotbo s’afficheront ici.',
      inputLabel: 'Message dans #commandes',
      suggestionsLabel: 'Commandes de Kotbo',
      chipsLabel: 'Essayer une commande',
      unknown: (cmd: string) => `Je ne connais pas ${cmd}. Écris / pour voir la liste.`,
      descriptions: {
        rank: 'Affiche ta carte de niveau',
        leaderboard: 'Affiche le classement du serveur',
        ticket: 'Gère le ticket en cours',
        warn: 'Avertit un membre',
        list: 'Historique des sanctions d’un membre',
        daily: 'Récupère tes pièces quotidiennes',
        market: 'Ouvre la boutique',
        event: 'Tes résultats au dernier quiz',
      },
      rankName: 'Toi',
      rankLabel: 'Ta carte de rang, niveau 7',
      leaderboardTitle: 'Classement du serveur',
      leaderboard: [
        { name: 'Lina', level: 24 },
        { name: 'Noé', level: 19 },
        { name: 'Maëlle', level: 17 },
        { name: 'Yanis', level: 11 },
        { name: 'Toi', level: 7 },
      ],
      levelShort: (n: number) => `niv. ${n}`,
      ticketIntro: 'Tu n’es pas dans un ticket. En voici un ouvert pour la démo :',
      ticketTitle: 'Ticket #0147 · Problème d’accès au salon VIP',
      ticketOpen: 'Ouvert par Lina, en attente d’un membre du staff.',
      ticketClaimed: 'Pris en charge par toi. Lina est prévenue.',
      ticketClosed: 'Ticket fermé. La transcription est archivée dans les logs.',
      claim: 'Prendre en charge',
      close: 'Fermer',
      warnTitle: 'Avertissement ajouté',
      warnFields: (n: number) => [
        { name: 'Membre', value: 'Vantar' },
        { name: 'Motif', value: 'Spam en #général' },
        { name: 'Avertissements', value: String(n) },
      ],
      warnFooter: 'Sanction datée, visible par tout le staff',
      listTitle: 'Historique des sanctions · Vantar',
      listPast: 'Timeout 1 h · insultes en vocal · il y a 2 jours · par Lena',
      listWarn: (time: string) => `Avertissement · spam en #général · ${time} · par toi`,
      listSummary: (warns: number) => `Total : ${warns + 1} · Warn : ${warns} · Timeout : 1`,
      dailyTitle: 'Récompense quotidienne récupérée !',
      dailyBody: (balance: number) => `Tu as reçu 150 pièces. Nouveau solde : ${balance} pièces.`,
      dailyAgainTitle: 'Récompense déjà réclamée',
      dailyAgainBody: 'Reviens dans 23 h 59 min pour réclamer ta prochaine récompense quotidienne.',
      marketTitle: (balance: number) => `Boutique · ton solde : ${balance} pièces`,
      items: [
        { id: 'color', name: 'Rôle couleur', price: 200 },
        { id: 'vip', name: 'Accès salon VIP', price: 500 },
      ],
      buy: (price: number) => `Acheter (${price})`,
      bought: (item: string) => `Tu as acheté ${item}.`,
      poor: 'Solde insuffisant. Essaie /daily.',
      eventTitle: 'Quiz du vendredi : tes résultats',
      eventFields: [
        { name: 'Score', value: '7 / 10' },
        { name: 'Classement', value: '3e sur 18' },
        { name: 'Temps moyen', value: '6,4 s' },
      ],
      nudge: 'Ces commandes marchent telles quelles sur ton serveur, dès que j’y suis.',
    },
    en: {
      title: 'Type a command.',
      intro:
        'Type / in the bar, like on Discord, or pick a command below. Kotbo replies, and its replies remember what you just did.',
      fallbackName: 'Your server',
      channel: 'commands',
      channelsLabel: 'Channels',
      category: 'CHAT',
      today: 'Today at',
      you: 'You',
      placeholder: 'Type / to see Kotbo’s commands',
      empty: 'Nothing in this channel yet. Kotbo’s replies will show up here.',
      inputLabel: 'Message in #commands',
      suggestionsLabel: 'Kotbo commands',
      chipsLabel: 'Try a command',
      unknown: (cmd: string) => `I don’t know ${cmd}. Type / to see the list.`,
      descriptions: {
        rank: 'Shows your level card',
        leaderboard: 'Shows the server leaderboard',
        ticket: 'Manages the current ticket',
        warn: 'Warns a member',
        list: 'A member’s sanction history',
        daily: 'Claim your daily coins',
        market: 'Opens the shop',
        event: 'Your results in the last quiz',
      },
      rankName: 'You',
      rankLabel: 'Your rank card, level 7',
      leaderboardTitle: 'Server leaderboard',
      leaderboard: [
        { name: 'Lina', level: 24 },
        { name: 'Noé', level: 19 },
        { name: 'Maëlle', level: 17 },
        { name: 'Yanis', level: 11 },
        { name: 'You', level: 7 },
      ],
      levelShort: (n: number) => `lvl ${n}`,
      ticketIntro: 'You’re not in a ticket. Here is an open one for the demo:',
      ticketTitle: 'Ticket #0147 · Can’t access the VIP channel',
      ticketOpen: 'Opened by Lina, waiting for a staff member.',
      ticketClaimed: 'Claimed by you. Lina has been notified.',
      ticketClosed: 'Ticket closed. The transcript is archived in the logs.',
      claim: 'Claim',
      close: 'Close',
      warnTitle: 'Warning added',
      warnFields: (n: number) => [
        { name: 'Member', value: 'Vantar' },
        { name: 'Reason', value: 'Spam in #general' },
        { name: 'Warnings', value: String(n) },
      ],
      warnFooter: 'Timestamped sanction, visible to all staff',
      listTitle: 'Sanction history · Vantar',
      listPast: 'Timeout 1 h · insults in voice · 2 days ago · by Lena',
      listWarn: (time: string) => `Warning · spam in #general · ${time} · by you`,
      listSummary: (warns: number) => `Total: ${warns + 1} · Warn: ${warns} · Timeout: 1`,
      dailyTitle: 'Daily reward claimed!',
      dailyBody: (balance: number) => `You received 150 coins. New balance: ${balance} coins.`,
      dailyAgainTitle: 'Reward already claimed',
      dailyAgainBody: 'Come back in 23 h 59 min to claim your next daily reward.',
      marketTitle: (balance: number) => `Shop · your balance: ${balance} coins`,
      items: [
        { id: 'color', name: 'Colour role', price: 200 },
        { id: 'vip', name: 'VIP channel access', price: 500 },
      ],
      buy: (price: number) => `Buy (${price})`,
      bought: (item: string) => `You bought ${item}.`,
      poor: 'Not enough coins. Try /daily.',
      eventTitle: 'Friday quiz: your results',
      eventFields: [
        { name: 'Score', value: '7 / 10' },
        { name: 'Rank', value: '3rd of 18' },
        { name: 'Average time', value: '6.4 s' },
      ],
      nudge: 'These commands work as-is on your server, as soon as I’m there.',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const serverName = $derived(builder.displayName(t.fallbackName));

  type Entry =
    | { id: number; kind: 'call'; name: string; time: string }
    | { id: number; kind: 'reply'; command: CommandKey | 'unknown' | 'nudge'; time: string; arg?: string; snapshot?: number };

  let entries = $state<Entry[]>([]);
  let draft = $state('');
  let highlighted = $state(0);
  let tried = $state<CommandKey[]>([]);
  let nudged = $state(false);
  let warns = $state(0);
  let warnTimes = $state<string[]>([]);
  let dailyClaimed = $state(false);
  let balance = $state(250);
  let owned = $state<string[]>([]);
  let shopNote = $state<string | null>(null);
  let ticketState = $state<'open' | 'claimed' | 'closed'>('open');
  let minute = 30;
  let seq = 0;
  let scroller = $state<HTMLDivElement | null>(null);

  const suggesting = $derived(draft.startsWith('/'));
  const suggestions = $derived(
    suggesting ? COMMANDS.filter((c) => c.name.startsWith(draft.trim().toLowerCase()) || c.name.includes(draft.trim().slice(1).toLowerCase())) : [],
  );

  function now(): string {
    minute += 1;
    return `21:${String(minute).padStart(2, '0')}`;
  }

  function run(key: CommandKey): void {
    const command = COMMANDS.find((c) => c.key === key);
    if (!command) return;
    if (tried.length === 0) track('playground_started', { content: 'commands' });

    const time = now();
    entries = [...entries, { id: seq++, kind: 'call', name: command.name, time }];

    if (key === 'warn') {
      warns += 1;
      warnTimes = [...warnTimes, time];
    }
    const wasClaimed = dailyClaimed;
    if (key === 'daily' && !dailyClaimed) {
      dailyClaimed = true;
      balance += 150;
    }
    if (key === 'ticket') ticketState = 'open';

    entries = [
      ...entries,
      {
        id: seq++,
        kind: 'reply',
        command: key,
        time,
        arg: key === 'daily' && wasClaimed ? 'again' : undefined,
        snapshot: key === 'warn' ? warns : key === 'daily' ? balance : undefined,
      },
    ];

    if (!tried.includes(key)) tried = [...tried, key];
    if (tried.length >= 3 && !nudged) {
      nudged = true;
      entries = [...entries, { id: seq++, kind: 'reply', command: 'nudge', time }];
      track('playground_completed', { content: 'commands' });
    }
    draft = '';
    highlighted = 0;
  }

  function submit(): void {
    const value = draft.trim().toLowerCase();
    if (!value) return;
    const exact = COMMANDS.find((c) => c.name === value);
    if (exact) return run(exact.key);
    if (suggesting && suggestions[highlighted]) return run(suggestions[highlighted].key);

    const time = now();
    entries = [
      ...entries,
      { id: seq++, kind: 'call', name: draft.trim(), time },
      { id: seq++, kind: 'reply', command: 'unknown', time, arg: draft.trim() },
    ];
    draft = '';
  }

  function onKeydown(event: KeyboardEvent): void {
    if (suggesting && suggestions.length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        highlighted = (highlighted + 1) % suggestions.length;
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        highlighted = (highlighted - 1 + suggestions.length) % suggestions.length;
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        draft = suggestions[highlighted].name;
        return;
      }
      if (event.key === 'Escape') {
        draft = '';
        return;
      }
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  }

  function buy(item: { id: string; name: string; price: number }): void {
    if (owned.includes(item.id)) return;
    if (balance < item.price) {
      shopNote = t.poor;
      return;
    }
    balance -= item.price;
    owned = [...owned, item.id];
    shopNote = t.bought(item.name);
  }

  $effect(() => {
    void entries.length;
    void tick().then(() => {
      const box = scroller?.querySelector('.dc-scroll');
      if (box) box.scrollTop = box.scrollHeight;
    });
  });

  $effect(() => {
    void draft;
    highlighted = 0;
  });

  const categories = $derived([{ id: 'talk', name: t.category, channels: [{ id: 'commands', name: t.channel }] }]);
</script>

<section id="commandes" aria-labelledby="commands-title" class="border-y-2 border-gray-200 bg-white py-20 lg:py-28">
  <div class="mx-auto grid max-w-360 gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
    <div use:reveal={{ direction: 'up' }}>
      <h2 id="commands-title" class="font-headline text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{t.title}</h2>
      <p class="mt-4 text-lg leading-relaxed text-gray-700">{t.intro}</p>

      <p class="mt-8 text-sm font-bold text-gray-900" id="commands-chips">{t.chipsLabel}</p>
      <ul aria-labelledby="commands-chips" class="mt-3 flex flex-wrap gap-2">
        {#each COMMANDS as command (command.key)}
          <li>
            <button
              type="button"
              onclick={() => run(command.key)}
              class="min-h-11 rounded-xl border-2 px-3 font-mono text-sm font-semibold transition-colors {tried.includes(command.key)
                ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-900'}"
            >
              {command.name}
            </button>
          </li>
        {/each}
      </ul>

      {#if nudged}
        <div class="mt-8"><InviteButton content="commands" /></div>
      {/if}
    </div>

    <div bind:this={scroller}>
      <DiscordWindow {serverName} serverIcon={builder.kit.icon} {categories} active="commands" channelsLabel={t.channelsLabel} height="clamp(18rem, 50svh, 27rem)">
        {#if entries.length === 0}
          <p class="px-4 py-8 text-center text-sm text-[#949ba4]">{t.empty}</p>
        {/if}
        {#each entries as entry (entry.id)}
          {#if entry.kind === 'call'}
            <Message author={t.you} color="#c9cdfb" time="{t.today} {entry.time}" enter>
              <span class="rounded bg-[#5865f2]/30 px-1 font-medium text-[#c9cdfb]">{entry.name}</span>
            </Message>
          {:else}
            <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} {entry.time}" enter>
              {#if entry.command === 'rank'}
                <div class="mt-1.5 max-w-120">
                  <RankCanvas
                    name={t.rankName}
                    tag="@{t.rankName.toLowerCase()}"
                    level={7}
                    progress={0.42}
                    rank={5}
                    backgroundId="default"
                    font="default"
                    avatarSrc={null}
                    badges={['quests_50']}
                    label={t.rankLabel}
                  />
                </div>
              {:else if entry.command === 'leaderboard'}
                <Embed color="#f0b232" icon={ktb('trophy')} title={t.leaderboardTitle}>
                  <ol class="space-y-0.5">
                    {#each t.leaderboard as row, i (row.name)}
                      <li class="flex gap-2">
                        <span class="w-5 tabular-nums text-[#949ba4]">{i + 1}.</span>
                        <span class={row.name === t.you ? 'font-semibold text-white' : ''}>{row.name}</span>
                        <span class="ml-auto text-[#949ba4]">{t.levelShort(row.level)}</span>
                      </li>
                    {/each}
                  </ol>
                </Embed>
              {:else if entry.command === 'ticket'}
                <p>{t.ticketIntro}</p>
                <Embed
                  color={ticketState === 'closed' ? '#4e5058' : '#eb459e'}
                  icon={ktb('ticket')}
                  title={t.ticketTitle}
                >
                  {ticketState === 'open' ? t.ticketOpen : ticketState === 'claimed' ? t.ticketClaimed : t.ticketClosed}
                  {#snippet actions()}
                    <DcButton tone="success" disabled={ticketState !== 'open'} onclick={() => (ticketState = 'claimed')}>{t.claim}</DcButton>
                    <DcButton tone="danger" disabled={ticketState === 'closed'} onclick={() => (ticketState = 'closed')}>{t.close}</DcButton>
                  {/snippet}
                </Embed>
              {:else if entry.command === 'warn'}
                <Embed color="#f0b232" icon={ktb('warn')} title={t.warnTitle} fields={t.warnFields(entry.snapshot ?? 1)} footer={t.warnFooter} />
              {:else if entry.command === 'list'}
                <Embed color="#da373c" icon={ktb('shield')} title={t.listTitle} footer={t.listSummary(warns)}>
                  <ul class="space-y-0.5">
                    <li>{t.listPast}</li>
                    {#each warnTimes as time (time)}
                      <li>{t.listWarn(time)}</li>
                    {/each}
                  </ul>
                </Embed>
              {:else if entry.command === 'daily'}
                {#if entry.arg === 'again'}
                  <Embed color="#da373c" icon={ktb('clock')} title={t.dailyAgainTitle}>{t.dailyAgainBody}</Embed>
                {:else}
                  <Embed color="#f0b232" icon={ktb('coins')} title={t.dailyTitle}>{t.dailyBody(entry.snapshot ?? balance)}</Embed>
                {/if}
              {:else if entry.command === 'market'}
                <Embed color="#f0b232" icon={ktb('rpg_shop')} title={t.marketTitle(balance)}>
                  {#if shopNote}<p class="mb-1 font-semibold text-white">{shopNote}</p>{/if}
                  {#snippet actions()}
                    {#each t.items as item (item.id)}
                      <DcButton tone={owned.includes(item.id) ? 'secondary' : 'primary'} disabled={owned.includes(item.id)} onclick={() => buy(item)}>
                        {item.name} · {t.buy(item.price)}
                      </DcButton>
                    {/each}
                  {/snippet}
                </Embed>
              {:else if entry.command === 'event'}
                <Embed color="#57f287" icon={ktb('trophy')} title={t.eventTitle} fields={t.eventFields} />
              {:else if entry.command === 'nudge'}
                <Embed color="#5865f2" icon={ktb('check')}>{t.nudge}</Embed>
              {:else if entry.command === 'unknown'}
                <p class="text-[#949ba4]">{t.unknown(entry.arg ?? '')}</p>
              {/if}
            </Message>
          {/if}
        {/each}

        {#snippet composer()}
          <div class="relative">
            {#if suggesting && suggestions.length > 0}
              <ul
                id="command-suggestions"
                role="listbox"
                aria-label={t.suggestionsLabel}
                class="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg bg-[#2b2d31] py-1 shadow-xl"
              >
                {#each suggestions as suggestion, i (suggestion.key)}
                  <li
                    id="command-option-{suggestion.key}"
                    role="option"
                    aria-selected={i === highlighted}
                    class="flex cursor-pointer items-baseline gap-3 px-3 py-2 {i === highlighted ? 'bg-[#404249]' : ''}"
                    onmousedown={(e) => {
                      e.preventDefault();
                      run(suggestion.key);
                    }}
                  >
                    <span class="font-semibold text-[#f2f3f5]">{suggestion.name}</span>
                    <span class="truncate text-sm text-[#949ba4]">{t.descriptions[suggestion.key]}</span>
                  </li>
                {/each}
              </ul>
            {/if}
            <input
              bind:value={draft}
              onkeydown={onKeydown}
              type="text"
              role="combobox"
              aria-label={t.inputLabel}
              aria-expanded={suggesting && suggestions.length > 0}
              aria-controls="command-suggestions"
              aria-autocomplete="list"
              aria-activedescendant={suggesting && suggestions[highlighted] ? `command-option-${suggestions[highlighted].key}` : undefined}
              autocomplete="off"
              placeholder={t.placeholder}
              class="min-h-11 w-full rounded-lg bg-[#383a40] px-4 py-2.5 text-[0.9375rem] text-[#dbdee1] placeholder:text-[#949ba4] focus:outline-2 focus:outline-offset-2 focus:outline-[#5865f2]"
            />
          </div>
        {/snippet}
      </DiscordWindow>
    </div>
  </div>
</section>

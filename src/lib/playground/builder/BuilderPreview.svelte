<script lang="ts">
  /**
   * L'aperçu du serveur monté : un Discord qui se remplit à mesure qu'on coche.
   *
   * Chaque piste cochée fait apparaître son salon, et chaque salon a une action
   * qui le fait vivre (un membre arrive, un ticket s'ouvre, un lien douteux est
   * posté). C'est la différence avec une capture d'écran : le visiteur voit ce
   * que ses réglages *font*, y compris quand il en retire un - le lien douteux
   * reste alors dans #général, et c'est l'argument.
   *
   * Les membres sont fictifs et le bandeau de la zone le dit. Le salon de logs
   * relit ce qui s'est passé dans l'aperçu : il ne contient rien d'inventé
   * au-delà de la démo elle-même.
   */
  import { onMount } from 'svelte';
  import { builder } from '../kit.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import DiscordWindow, { type Category } from '../discord/DiscordWindow.svelte';
  import Message from '../discord/Message.svelte';
  import Embed from '../discord/Embed.svelte';
  import DcButton from '../discord/DcButton.svelte';
  import { KOTBO_AVATAR, ktb } from '../discord/theme';

  const TEXT = {
    fr: {
      fallbackName: 'Ton serveur',
      channelsLabel: 'Salons du serveur',
      cats: { welcome: 'ACCUEIL', support: 'SUPPORT', talk: 'DISCUSSIONS', team: 'ÉQUIPE' },
      ch: {
        welcome: 'bienvenue',
        rules: 'règlement',
        news: 'annonces',
        tickets: 'ouvrir-un-ticket',
        general: 'général',
        levels: 'niveaux',
        shop: 'boutique',
        quests: 'quêtes-du-jour',
        staff: 'staff',
        logs: 'logs',
        theme: {
          communaute: 'événements',
          gaming: 'recherche-de-groupe',
          entraide: 'questions',
          creation: 'vos-créations',
        },
        voice: { communaute: 'Salon vocal', gaming: 'Squad', entraide: 'Aide en vocal', creation: 'Atelier' },
      },
      today: "Aujourd'hui à",
      defaultWelcome: 'Bienvenue {membre} sur {serveur} ! Passe lire le règlement et présente-toi dans #général.',
      joined: (name: string) => `${name} vient d'arriver.`,
      actions: {
        welcome: 'Faire arriver un membre',
        tickets: 'Ouvrir un ticket',
        general: 'Poster un lien douteux',
        levels: 'Écrire un message',
        shop: 'Lancer /daily',
        quests: 'Valider une quête',
        staff: 'Déclarer une absence',
      },
      hint: 'Clique sur un salon, puis sur l’action en dessous.',
      rulesTitle: 'Règlement du serveur',
      rules: [
        'Respecte les autres membres, quels que soient leurs avis.',
        'Pas de publicité ni de lien d’invitation sans accord du staff.',
        'Les contenus choquants restent hors du serveur.',
        'Un problème ? Ouvre un ticket plutôt qu’un message privé au staff.',
      ],
      rulesFooter: (level: string) => `Modération automatique : ${level}`,
      levelNames: { light: 'légère', standard: 'standard', strict: 'stricte' },
      newsText: (server: string) => `${server} ouvre ses portes. Le règlement est dans #règlement, le support dans #ouvrir-un-ticket.`,
      ticketPanelTitle: 'Besoin d’aide ?',
      ticketPanelBody: 'Ouvre un ticket : un salon privé est créé entre toi et le staff.',
      ticketButton: 'Ouvrir un ticket',
      ticketOpened: (n: string) => `Ticket #${n} ouvert. Un salon privé vient d’être créé pour toi.`,
      ticketFirst: 'Salut ! Un membre du staff va prendre ton ticket. Décris ton souci ici.',
      generalLines: [
        { author: 'Noé', text: 'quelqu’un pour une partie ce soir ?' },
        { author: 'Maëlle', text: 'je suis dispo après 21h' },
      ],
      spam: 'nitro gratuit ici 👉 dlscord-gift.ru/claim',
      automod: (level: string) => `Message supprimé : lien suspect. fr33-nitro est exclu 10 minutes. (Modération ${level})`,
      noModeration: 'Sans la modération, ce lien reste en ligne jusqu’à ce qu’un modo passe.',
      levelUp: (name: string, lvl: number) => `Bravo ${name}, tu passes niveau ${lvl} !`,
      levelReward: 'Le rôle Habitué se débloque au niveau 5.',
      xpLine: (xp: number) => `${xp} / 100 XP`,
      levelLabel: (n: number) => `Niveau ${n}`,
      dailyTitle: 'Récompense quotidienne récupérée !',
      dailyBody: (n: number) => `Tu as reçu 150 pièces. Nouveau solde : ${n} pièces.`,
      shopTitle: 'Boutique',
      shopItems: [
        { name: 'Rôle couleur', price: '500 pièces' },
        { name: 'Accès salon VIP', price: '1 200 pièces' },
      ],
      questTitle: 'Quêtes du jour',
      quests: ['Envoyer 20 messages', 'Passer 30 min en vocal', 'Réagir à une annonce'],
      questDone: (n: number) => `${n}/3 quêtes validées`,
      staffTitle: 'Équipe en service',
      staffRows: [
        { name: 'Arka', role: 'Fondateur' },
        { name: 'Lena', role: 'Admin' },
        { name: 'Zenox', role: 'Modérateur' },
      ],
      absence: 'Zenox est absent jusqu’à dimanche. Ses tickets passent à Lena.',
      logsTitle: 'Journal',
      logsEmpty: 'Rien pour l’instant. Fais vivre les autres salons : chaque action s’inscrit ici.',
      log: {
        join: (name: string) => `${name} a rejoint le serveur`,
        ticket: (n: string) => `Ticket #${n} ouvert`,
        spam: 'Message de fr33-nitro supprimé (lien suspect)',
        absence: 'Absence de Zenox enregistrée',
      },
      themeLines: {
        communaute: [{ author: 'Lena', text: 'Soirée quiz vendredi 21h, inscriptions ouvertes !' }],
        gaming: [{ author: 'Yanis', text: 'LF2M ranked, niveau plat, vocal obligatoire' }],
        entraide: [{ author: 'Inès', text: 'Comment on exporte un projet en PDF ? Merci d’avance' }],
        creation: [{ author: 'Sacha', text: 'Ma dernière illustration, vos retours sont bienvenus' }],
      },
      voiceEmpty: 'Personne en vocal pour l’instant.',
    },
    en: {
      fallbackName: 'Your server',
      channelsLabel: 'Server channels',
      cats: { welcome: 'WELCOME', support: 'SUPPORT', talk: 'CHAT', team: 'TEAM' },
      ch: {
        welcome: 'welcome',
        rules: 'rules',
        news: 'announcements',
        tickets: 'open-a-ticket',
        general: 'general',
        levels: 'levels',
        shop: 'shop',
        quests: 'daily-quests',
        staff: 'staff',
        logs: 'logs',
        theme: {
          communaute: 'events',
          gaming: 'looking-for-group',
          entraide: 'questions',
          creation: 'showcase',
        },
        voice: { communaute: 'Lounge', gaming: 'Squad', entraide: 'Voice help', creation: 'Studio' },
      },
      today: 'Today at',
      defaultWelcome: 'Welcome {member} to {server}! Read the rules and say hi in #general.',
      joined: (name: string) => `${name} just joined.`,
      actions: {
        welcome: 'Make a member join',
        tickets: 'Open a ticket',
        general: 'Post a shady link',
        levels: 'Send a message',
        shop: 'Run /daily',
        quests: 'Complete a quest',
        staff: 'Report an absence',
      },
      hint: 'Click a channel, then the action below.',
      rulesTitle: 'Server rules',
      rules: [
        'Respect other members, whatever their opinions.',
        'No ads or invite links without staff approval.',
        'Shocking content stays off the server.',
        'Got a problem? Open a ticket instead of DMing staff.',
      ],
      rulesFooter: (level: string) => `Auto-moderation: ${level}`,
      levelNames: { light: 'light', standard: 'standard', strict: 'strict' },
      newsText: (server: string) => `${server} is open. Rules are in #rules, support in #open-a-ticket.`,
      ticketPanelTitle: 'Need help?',
      ticketPanelBody: 'Open a ticket: a private channel is created between you and the staff.',
      ticketButton: 'Open a ticket',
      ticketOpened: (n: string) => `Ticket #${n} opened. A private channel was just created for you.`,
      ticketFirst: 'Hi! A staff member will pick up your ticket. Describe your issue here.',
      generalLines: [
        { author: 'Noé', text: 'anyone up for a game tonight?' },
        { author: 'Maëlle', text: "I'm free after 9pm" },
      ],
      spam: 'free nitro here 👉 dlscord-gift.ru/claim',
      automod: (level: string) => `Message deleted: suspicious link. fr33-nitro is timed out for 10 minutes. (${level} moderation)`,
      noModeration: 'Without moderation, this link stays up until a mod walks by.',
      levelUp: (name: string, lvl: number) => `Well done ${name}, you reached level ${lvl}!`,
      levelReward: 'The Regular role unlocks at level 5.',
      xpLine: (xp: number) => `${xp} / 100 XP`,
      levelLabel: (n: number) => `Level ${n}`,
      dailyTitle: 'Daily reward claimed!',
      dailyBody: (n: number) => `You received 150 coins. New balance: ${n} coins.`,
      shopTitle: 'Shop',
      shopItems: [
        { name: 'Colour role', price: '500 coins' },
        { name: 'VIP channel access', price: '1,200 coins' },
      ],
      questTitle: 'Daily quests',
      quests: ['Send 20 messages', 'Spend 30 min in voice', 'React to an announcement'],
      questDone: (n: number) => `${n}/3 quests done`,
      staffTitle: 'Staff on duty',
      staffRows: [
        { name: 'Arka', role: 'Founder' },
        { name: 'Lena', role: 'Admin' },
        { name: 'Zenox', role: 'Moderator' },
      ],
      absence: 'Zenox is away until Sunday. Their tickets go to Lena.',
      logsTitle: 'Log',
      logsEmpty: 'Nothing yet. Play with the other channels: every action lands here.',
      log: {
        join: (name: string) => `${name} joined the server`,
        ticket: (n: string) => `Ticket #${n} opened`,
        spam: 'Message from fr33-nitro deleted (suspicious link)',
        absence: "Zenox's absence recorded",
      },
      themeLines: {
        communaute: [{ author: 'Lena', text: 'Quiz night Friday 9pm, sign-ups are open!' }],
        gaming: [{ author: 'Yanis', text: 'LF2M ranked, plat level, voice required' }],
        entraide: [{ author: 'Inès', text: 'How do I export a project to PDF? Thanks in advance' }],
        creation: [{ author: 'Sacha', text: 'My latest illustration, feedback welcome' }],
      },
      voiceEmpty: 'Nobody in voice yet.',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const kit = $derived(builder.kit);
  const serverName = $derived(builder.displayName(t.fallbackName));

  /** Ce qui s'est passé dans l'aperçu, dans l'ordre. Le salon de logs le relit. */
  type LogEntry = { id: number; kind: 'join' | 'ticket' | 'spam' | 'absence'; label: string; time: string };

  const NEWCOMERS = ['Lina', 'Sacha', 'Yanis', 'Inès', 'Tom', 'Jade'];

  let active = $state('welcome');
  let arrivals = $state<{ id: number; name: string; time: string }[]>([{ id: 0, name: 'Lina', time: '21:02' }]);
  let tickets = $state<string[]>([]);
  let spamPosts = $state<{ id: number; time: string; moderated: boolean; level: string }[]>([]);
  let xp = $state(60);
  let level = $state(4);
  let lastLevelUp = $state<number | null>(null);
  let coins = $state(350);
  let dailyClaims = $state(0);
  let questsDone = $state(0);
  let absenceDeclared = $state(false);
  let log = $state<LogEntry[]>([]);
  let clock = $state(4);
  let seq = 1;
  let played = false;

  /** L'heure avance d'une minute par action : le fil se lit comme une soirée. */
  function tick(): string {
    clock += 1;
    return `21:${String(clock).padStart(2, '0')}`;
  }

  function note(kind: LogEntry['kind'], label: string, time: string): void {
    log = [...log, { id: seq++, kind, label, time }];
  }

  function started(): void {
    if (played) return;
    played = true;
    track('playground_started', { content: 'builder' });
  }

  function select(id: string): void {
    active = id;
  }

  /**
   * Un salon n'est signalé comme nouveau que s'il apparaît après l'arrivée :
   * au chargement, tout est déjà là. La référence est prise une image après le
   * montage, une fois le serveur mémorisé relu par le héros.
   */
  let armed = $state(false);
  let baseline = new Set<string>();

  function isFresh(id: string): boolean {
    return armed && !baseline.has(id);
  }

  onMount(() => {
    const frame = requestAnimationFrame(() => {
      baseline = new Set(categories.flatMap((c) => c.channels.map((ch) => ch.id)));
      armed = true;
    });
    return () => cancelAnimationFrame(frame);
  });

  const categories = $derived.by<Category[]>(() => {
    const c = t.ch;
    const has = (track: Parameters<typeof builder.has>[0]) => kit.tracks.includes(track);

    const welcome = [
      ...(has('greeting') ? [{ id: 'welcome', name: c.welcome, fresh: isFresh('welcome') }] : []),
      ...(has('rules') ? [{ id: 'rules', name: c.rules, fresh: isFresh('rules') }] : []),
      { id: 'news', name: c.news },
    ];
    const support = has('tickets')
      ? [
          { id: 'tickets', name: c.tickets, fresh: isFresh('tickets') },
          ...tickets.map((n) => ({ id: `ticket-${n}`, name: `ticket-${n}`, fresh: isFresh(`ticket-${n}`), unread: true })),
        ]
      : [];
    const talk = [
      { id: 'general', name: c.general, unread: spamPosts.length > 0 },
      { id: 'theme', name: c.theme[kit.theme], kind: kit.theme === 'entraide' ? ('forum' as const) : undefined },
      ...(has('levels') ? [{ id: 'levels', name: c.levels, fresh: isFresh('levels') }] : []),
      ...(has('economy') ? [{ id: 'shop', name: c.shop, fresh: isFresh('shop') }] : []),
      ...(has('animation') ? [{ id: 'quests', name: c.quests, fresh: isFresh('quests') }] : []),
      { id: 'voice', name: c.voice[kit.theme], kind: 'voice' as const },
    ];
    const team = [
      ...(has('staff') ? [{ id: 'staff', name: c.staff, fresh: isFresh('staff') }] : []),
      ...(has('logs') ? [{ id: 'logs', name: c.logs, fresh: isFresh('logs'), unread: log.length > 0 }] : []),
    ];

    return [
      { id: 'welcome', name: t.cats.welcome, channels: welcome },
      ...(support.length ? [{ id: 'support', name: t.cats.support, channels: support }] : []),
      { id: 'talk', name: t.cats.talk, channels: talk },
      ...(team.length ? [{ id: 'team', name: t.cats.team, channels: team }] : []),
    ];
  });

  /** Un salon décoché disparaît : l'aperçu revient sur un salon qui existe. */
  $effect(() => {
    const ids = categories.flatMap((c) => c.channels.map((ch) => ch.id));
    if (!ids.includes(active)) active = ids.includes('welcome') ? 'welcome' : 'general';
  });

  const welcomeText = $derived(
    (kit.welcome.trim() || t.defaultWelcome),
  );

  function fillWelcome(name: string): string {
    return welcomeText
      .replaceAll('{membre}', name)
      .replaceAll('{member}', name)
      .replaceAll('{serveur}', serverName)
      .replaceAll('{server}', serverName);
  }

  // ── Actions ────────────────────────────────────────────────────────────

  function join(): void {
    started();
    const name = NEWCOMERS[arrivals.length % NEWCOMERS.length];
    const time = tick();
    arrivals = [...arrivals, { id: seq++, name, time }];
    note('join', t.log.join(name), time);
  }

  function openTicket(): void {
    started();
    const n = String(148 + tickets.length).padStart(4, '0');
    const time = tick();
    tickets = [...tickets, n];
    note('ticket', t.log.ticket(n), time);
  }

  function postSpam(): void {
    started();
    const moderated = kit.tracks.includes('moderation');
    const time = tick();
    spamPosts = [...spamPosts, { id: seq++, time, moderated, level: t.levelNames[kit.moderation] }];
    if (moderated) note('spam', t.log.spam, time);
  }

  function chat(): void {
    started();
    xp += 20;
    if (xp >= 100) {
      xp -= 100;
      level += 1;
      lastLevelUp = level;
    }
  }

  function daily(): void {
    started();
    dailyClaims += 1;
    coins += 150;
  }

  function quest(): void {
    started();
    questsDone = Math.min(3, questsDone + 1);
  }

  function absence(): void {
    started();
    if (absenceDeclared) return;
    absenceDeclared = true;
    note('absence', t.log.absence, tick());
  }

  const action = $derived.by(() => {
    if (active === 'welcome') return { label: t.actions.welcome, run: join, done: false };
    if (active === 'tickets') return { label: t.actions.tickets, run: openTicket, done: false };
    if (active === 'general') return { label: t.actions.general, run: postSpam, done: false };
    if (active === 'levels') return { label: t.actions.levels, run: chat, done: false };
    if (active === 'shop') return { label: t.actions.shop, run: daily, done: false };
    if (active === 'quests') return { label: t.actions.quests, run: quest, done: questsDone >= 3 };
    if (active === 'staff') return { label: t.actions.staff, run: absence, done: absenceDeclared };
    return null;
  });

  /** L'heure du dernier geste, pour les réponses du bot. */
  const now = $derived(`${t.today} 21:${String(clock).padStart(2, '0')}`);
</script>

<div>
  <DiscordWindow
    {serverName}
    serverIcon={kit.icon}
    {categories}
    {active}
    onselect={select}
    channelsLabel={t.channelsLabel}
    height="clamp(20rem, 55svh, 26rem)"
  >
    {#key active}
      <div class="dc-channel">
        {#if active === 'welcome'}
          {#each arrivals as arrival (arrival.id)}
            <p class="px-4 py-1 text-sm text-[#949ba4]">
              <span aria-hidden="true" class="mr-2 text-[#23a55a]">→</span>{t.joined(arrival.name)}
            </p>
            <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} {arrival.time}" enter={arrival.id !== 0}>
              <Embed color="#23a55a" icon={ktb('online')} title={serverName}>
                {fillWelcome(arrival.name)}
              </Embed>
            </Message>
          {/each}
        {:else if active === 'rules'}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} 20:58">
            <Embed color="#f0b232" icon={ktb('news')} title={t.rulesTitle} footer={t.rulesFooter(t.levelNames[kit.moderation])}>
              <ol class="list-decimal space-y-1 pl-5">
                {#each t.rules as rule (rule)}<li>{rule}</li>{/each}
              </ol>
            </Embed>
          </Message>
        {:else if active === 'news'}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} 20:55">
            <Embed color="#5865f2" icon={ktb('news')} title={serverName}>
              {t.newsText(serverName)}
            </Embed>
          </Message>
        {:else if active === 'tickets'}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} 20:57">
            <Embed color="#eb459e" icon={ktb('ticket')} title={t.ticketPanelTitle}>
              {t.ticketPanelBody}
              {#snippet actions()}
                <DcButton tone="primary" icon={ktb('ticket')} onclick={openTicket}>{t.ticketButton}</DcButton>
              {/snippet}
            </Embed>
          </Message>
          {#each tickets as n (n)}
            <p class="dc-enter px-4 py-1 text-sm text-[#949ba4]">
              <img src={ktb('check')} alt="" width="14" height="14" class="mr-1.5 inline h-3.5 w-3.5" />{t.ticketOpened(n)}
            </p>
          {/each}
        {:else if active.startsWith('ticket-')}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time={now}>
            <Embed color="#eb459e" icon={ktb('ticket')} title={`#${active.replace('ticket-', '')}`}>
              {t.ticketFirst}
            </Embed>
          </Message>
        {:else if active === 'general'}
          {#each t.generalLines as line, i (i)}
            <Message author={line.author} time="{t.today} 20:{50 + i * 3}">{line.text}</Message>
          {/each}
          {#each spamPosts as post (post.id)}
            <Message author="fr33-nitro" color="#da373c" time="{t.today} {post.time}" enter removed={post.moderated}>
              {t.spam}
            </Message>
            {#if post.moderated}
              <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} {post.time}" enter>
                <Embed color="#da373c" icon={ktb('shield')}>{t.automod(post.level)}</Embed>
              </Message>
            {:else}
              <p class="dc-enter mx-4 my-1 rounded bg-[#da373c]/15 px-3 py-2 text-sm text-[#f3a6a8]">{t.noModeration}</p>
            {/if}
          {/each}
        {:else if active === 'theme'}
          {#each t.themeLines[kit.theme] as line (line.text)}
            <Message author={line.author} time="{t.today} 20:47">{line.text}</Message>
          {/each}
        {:else if active === 'levels'}
          {#if lastLevelUp}
            {#key lastLevelUp}
              <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time={now} enter>
                <Embed color="#5865f2" icon={ktb('level')} title={t.levelUp('Lina', lastLevelUp)}>{t.levelReward}</Embed>
              </Message>
            {/key}
          {/if}
          <div class="mx-4 mt-3 rounded-lg bg-[#2b2d31] p-3">
            <p class="flex justify-between text-sm"><span class="font-semibold text-[#f2f3f5]">Lina · {t.levelLabel(level)}</span><span class="text-[#949ba4]">{t.xpLine(xp)}</span></p>
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-[#1e1f22]">
              <div class="dc-bar h-full rounded-full bg-[#5865f2]" style="width: {xp}%"></div>
            </div>
          </div>
        {:else if active === 'shop'}
          {#if dailyClaims > 0}
            {#key dailyClaims}
              <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time={now} enter>
                <Embed color="#f0b232" icon={ktb('coins')} title={t.dailyTitle}>{t.dailyBody(coins)}</Embed>
              </Message>
            {/key}
          {/if}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} 20:56">
            <Embed color="#f0b232" icon={ktb('coins')} title={t.shopTitle} fields={t.shopItems.map((i) => ({ name: i.name, value: i.price }))} />
          </Message>
        {:else if active === 'quests'}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} 20:00">
            <Embed color="#57f287" icon={ktb('star')} title={t.questTitle} footer={t.questDone(questsDone)}>
              <ul class="space-y-1">
                {#each t.quests as q, i (q)}
                  <li class="flex items-center gap-2">
                    <img src={ktb(i < questsDone ? 'check' : 'dot')} alt="" width="14" height="14" class="h-3.5 w-3.5" />
                    <span class={i < questsDone ? 'text-[#949ba4] line-through' : ''}>{q}</span>
                  </li>
                {/each}
              </ul>
            </Embed>
          </Message>
        {:else if active === 'voice'}
          <p class="px-4 py-6 text-center text-sm text-[#949ba4]">{t.voiceEmpty}</p>
        {:else if active === 'staff'}
          <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} 20:30">
            <Embed color="#5865f2" icon={ktb('mod')} title={t.staffTitle} fields={t.staffRows.map((r) => ({ name: r.name, value: r.role }))} />
          </Message>
          {#if absenceDeclared}
            <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time={now} enter>
              <Embed color="#f0b232" icon={ktb('cal')}>{t.absence}</Embed>
            </Message>
          {/if}
        {:else if active === 'logs'}
          {#if log.length === 0}
            <p class="px-4 py-6 text-center text-sm text-[#949ba4]">{t.logsEmpty}</p>
          {:else}
            {#each log as entry (entry.id)}
              <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="{t.today} {entry.time}">
                <Embed color="#4e5058" icon={ktb(entry.kind === 'spam' ? 'shield' : entry.kind === 'ticket' ? 'ticket' : entry.kind === 'absence' ? 'cal' : 'online')}>
                  {entry.label}
                </Embed>
              </Message>
            {/each}
          {/if}
        {/if}
      </div>
    {/key}
  </DiscordWindow>

  <div class="mt-3 flex min-h-11 flex-wrap items-center gap-3">
    {#if action}
      <button
        type="button"
        onclick={action.run}
        disabled={action.done}
        class="min-h-11 rounded-xl border-2 border-gray-900 bg-white px-4 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:cursor-default disabled:border-gray-300 disabled:text-gray-500 disabled:hover:bg-white"
      >
        {action.label}
      </button>
    {/if}
    <p class="text-sm text-gray-600">{t.hint}</p>
  </div>
</div>

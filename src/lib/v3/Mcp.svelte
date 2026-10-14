<script lang="ts">
  /**
   * Le serveur MCP, montré là où il sert : dans Claude.
   *
   * La fenêtre s'ouvre comme une conversation neuve dans Claude : le logo, la
   * salutation, la barre de saisie et des suggestions. Une suggestion ouvre sa
   * conversation : ta demande, les appels d'outils Kotbo (dépliables), la
   * réponse, puis ce que ça a produit, chaque fois d'une autre nature (message
   * posté dans un ticket, rapport, réglage du dashboard, salons créés, score
   * Pulse...). « Nouvelle conversation » ramène à l'accueil. Rien ne se joue
   * sans le visiteur.
   *
   * Le logo est dessiné ici pour l'exemple, la page dit que c'est un exemple
   * dans Claude et que ChatGPT et Gemini marchent pareil.
   *
   * Tout se vérifie dans le dépôt Kotbo, branche `main` : noms d'outils et
   * paramètres (`apps/bot/src/api/mcp/tools/`), `reply_ticket` qui poste en tant
   * que bot, les sanctions MCP signées `MCP[<clé>]` comme modérateur, les quatre
   * catégories de Pulse, le journal d'audit, les libellés du branchement
   * (`MCPSettings.svelte`, `mcpServer.ts`). « Plus de 300 outils » tient sur
   * `main` (331) comme sur `recette` (381). La demande d'approbation au staff
   * n'est pas citée : ses boutons ne sont branchés sur rien côté bot.
   *
   * Conversations et membres sont fictifs.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import AddButton from './AddButton.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Scene = 'tickets' | 'report' | 'raid' | 'staff' | 'dashboard' | 'tournament' | 'announce' | 'pulse';
  const SCENES: Scene[] = ['tickets', 'report', 'raid', 'staff', 'dashboard', 'tournament', 'announce', 'pulse'];

  type Tool = { name: string; times?: number; input: string; result: string };

  /** Les appels de chaque scène : nom réel de l'outil, paramètres et retour abrégés. */
  const TOOLS: Record<Scene, Tool[]> = {
    tickets: [
      { name: 'get_tickets', input: '{ "status": "OPEN" }', result: '5 tickets, 3 sans réponse depuis plus de 24 h' },
      { name: 'reply_ticket', times: 3, input: '{ "ticket_id": "148", "content": "Salut Sarah…" }', result: '{ "ok": true }' },
    ],
    report: [
      { name: 'get_sanctions', input: '{ "limit": 50 }', result: '12 sanctions sur 7 jours' },
      { name: 'get_staff_list', input: '{}', result: '9 membres du staff' },
    ],
    raid: [
      { name: 'search_members', input: '{ "query": "raid_acc", "limit": 50 }', result: '38 membres trouvés' },
      { name: 'apply_sanction', times: 38, input: '{ "member": "raid_acc01", "type": "BAN", "reason": "raid du 14/10" }', result: '{ "ok": true }' },
    ],
    staff: [
      { name: 'get_staff_list', input: '{}', result: '9 membres du staff' },
      { name: 'get_staff_evaluations', input: '{}', result: 'scores activité, modération, présence' },
      { name: 'get_staff_absences', input: '{}', result: '1 absence en cours' },
    ],
    dashboard: [
      { name: 'set_module_activation', input: '{ "module_name": "leveling", "enabled": true }', result: '{ "ok": true }' },
      { name: 'create_level_role_reward', input: '{ "level": 10, "role": "Habitué" }', result: '{ "ok": true, "level": 10, "roleName": "Habitué" }' },
    ],
    tournament: [
      { name: 'create_category', input: '{ "name": "Tournoi Valorant" }', result: '{ "ok": true }' },
      { name: 'create_channel', times: 4, input: '{ "name": "inscriptions", "type": "text" }', result: '{ "ok": true }' },
      { name: 'create_role', times: 2, input: '{ "name": "Joueur" }', result: '{ "ok": true }' },
      { name: 'create_giveaway', input: '{ "channel": "inscriptions", "prize": "Skin Vandal", "winner_count": 1 }', result: '{ "ok": true }' },
    ],
    announce: [
      { name: 'list_channels', input: '{}', result: '23 salons' },
      { name: 'create_announcement', input: '{ "channel": "annonces", "title": "Soirée quiz vendredi 21 h", "mention": "everyone" }', result: '{ "ok": true }' },
    ],
    pulse: [
      { name: 'get_pulse_dashboard', input: '{}', result: 'score 72, activité, modération, croissance, engagement' },
      { name: 'get_hourly_activity', input: '{ "days": 30 }', result: 'heatmap sur 30 jours' },
    ],
  };

  type Row = { a: string; b: string; tone?: string; c: string; d: string };

  const TEXT = {
    fr: {
      title: 'Tu demandes à ton IA, Kotbo le fait sur ton serveur',
      intro:
        'Kotbo a un serveur MCP. Branche-le sur Claude, ChatGPT ou Gemini, et ton IA traite les tickets, sort les rapports, sanctionne et règle le dashboard, avec plus de 300 outils',
      beta: 'En bêta',
      caption: 'Exemple dans Claude, conversations fictives. Ça marche pareil dans ChatGPT et Gemini',
      hello: 'Bonsoir, fonda',
      placeholder: 'Comment puis-je vous aider aujourd’hui ?',
      reply: 'Répondre…',
      connected: 'Kotbo',
      newChat: 'Nouvelle conversation',
      suggestions: 'Suggestions',
      using: 'Kotbo',
      running: 'en cours',
      showCall: 'Voir l’appel',
      input: 'Paramètres',
      result: 'Résultat',
      status: (title: string) => `Conversation ouverte : ${title}`,
      scenes: {
        tickets: {
          chip: 'Réponds aux tickets en attente',
          ask: 'Il y a des tickets qui attendent ? Réponds-leur',
          answer:
            'Cinq tickets sont ouverts, dont trois sans réponse depuis plus de 24 h. J’ai répondu aux trois au nom de Kotbo. Le #151 parle d’un remboursement : je n’y ai pas touché, mieux vaut qu’un humain le prenne',
        },
        report: {
          chip: 'Rapport des sanctions',
          ask: 'Fais-moi le rapport des sanctions de la semaine',
          answer: 'Douze sanctions en sept jours, dont huit pour des liens d’arnaque. Lena en a posé la moitié. Les plus lourdes :',
        },
        raid: {
          chip: 'Ban les comptes du raid',
          ask: 'On s’est fait raid cette nuit vers 2 h, ban tous les comptes',
          answer: 'J’ai trouvé 38 comptes au même pseudo, raid_acc suivi d’un numéro. Je les ai tous bannis, motif « raid du 14/10 ». Ils sont dans tes sanctions :',
        },
        staff: {
          chip: 'Qui bosse dans mon staff ?',
          ask: 'Qui dans mon staff n’a rien fait cette semaine ?',
          answer: 'Mehdi n’a pris aucun ticket ni posé aucune sanction depuis 7 jours. Zoé non plus, mais elle est en absence validée jusqu’à jeudi. Le reste de l’équipe tourne bien :',
        },
        dashboard: {
          chip: 'Active les niveaux',
          ask: 'Active les niveaux et donne le rôle Habitué au niveau 10',
          answer: 'C’est fait : les niveaux tournent, et le rôle Habitué tombe au niveau 10. Voilà ce que ça donne dans ton dashboard :',
        },
        tournament: {
          chip: 'Monte un tournoi',
          ask: 'Monte-moi un tournoi Valorant pour samedi',
          answer: 'Tout est prêt pour samedi, avec un giveaway pour l’équipe gagnante. Il te reste à écrire le règlement dans #règles',
        },
        announce: {
          chip: 'Annonce la soirée quiz',
          ask: 'Annonce la soirée quiz de vendredi 21 h dans #annonces, ping tout le monde',
          answer: 'C’est posté dans #annonces avec un @everyone :',
        },
        pulse: {
          chip: 'Comment va le serveur ?',
          ask: 'Comment va le serveur ce mois-ci ?',
          answer: 'Plutôt bien. Pulse est à 72 sur 100, six points de plus qu’il y a un mois. Ce qui tire vers le bas, c’est l’engagement du week-end : ton creux, c’est le dimanche vers 14 h',
        },
      } as Record<Scene, { chip: string; ask: string; answer: string }>,
      ticket: { channel: 'ticket-148', time: 'Aujourd’hui à 09:12', text: 'Salut Sarah, ton signalement est bien reçu. Un modo le reprend ce soir et te répond ici' },
      report: {
        head: ['Membre', 'Sanction', 'Par', 'Motif'],
        rows: [
          { a: '@kylian', b: 'Ban', tone: 'alarm', c: 'Lena', d: 'liens d’arnaque' },
          { a: '@maxou_2', b: 'Ban', tone: 'alarm', c: 'Lena', d: 'double compte de @maxou' },
          { a: '@zenox', b: 'Timeout 1 h', tone: 'amber', c: 'Mehdi', d: 'insultes en vocal' },
          { a: '@nova', b: 'Avertissement', c: 'Zoé', d: 'spam d’emojis' },
        ] as Row[],
        more: 'Et 8 autres. À surveiller : @zenox en est à son troisième timeout du mois',
      },
      raid: {
        title: 'Sanctions',
        rows: ['raid_acc01', 'raid_acc02', 'raid_acc03'],
        ban: 'Ban',
        by: 'par MCP[Claude]',
        reason: 'raid du 14/10',
        more: '+ 35 autres',
      },
      staff: {
        head: ['Modo', 'Tickets', 'Sanctions', 'Cette semaine'],
        rows: [
          { a: 'Lena', b: '14', c: '6', d: 'active', tone: 'ok' },
          { a: 'Yanis', b: '9', c: '3', d: 'actif', tone: 'ok' },
          { a: 'Zoé', b: '0', c: '0', d: 'absente jusqu’à jeudi', tone: 'amber' },
          { a: 'Mehdi', b: '0', c: '0', d: 'rien depuis 7 jours', tone: 'alarm' },
        ] as Row[],
      },
      dash: { module: 'Leveling & XP', on: 'Activé', rewards: 'Récompenses de rôle', level: 'Niveau 10', role: 'Habitué', log: 'Journal du dashboard : action signée MCP[Claude]' },
      tour: { category: 'Tournoi Valorant', channels: ['inscriptions', 'règles', 'bracket'], voice: 'vocal-tournoi', roles: ['Joueur', 'Orga'] },
      announce: {
        channel: 'annonces',
        time: 'Aujourd’hui à 18:40',
        title: 'Soirée quiz vendredi 21 h',
        body: 'Culture G, jeux vidéo et un peu de n’importe quoi. Rendez-vous en vocal, les trois premiers gagnent un rôle pour la semaine',
      },
      pulse: {
        score: '72',
        of: 'sur 100',
        delta: '+6 en un mois',
        cats: [
          { label: 'Activité', value: 81 },
          { label: 'Modération', value: 88 },
          { label: 'Croissance', value: 64 },
          { label: 'Engagement', value: 55 },
        ],
      },
      howTitle: 'Le branchement prend deux minutes',
      steps: [
        { title: 'Une clé', text: 'Dans le dashboard, ouvre Connecter une IA, puis Nouvelle clé' },
        { title: 'Une URL', text: 'Tu la colles dans ton IA. Sur Claude, c’est un connecteur perso, sur ChatGPT une app en mode développeur, sur Gemini un bloc mcp_server' },
        { title: 'Un clic', text: 'Kotbo te demande ta clé, tu cliques sur Autoriser l’accès, et ton IA voit ton serveur' },
      ],
      safetyTitle: 'Et tu gardes la main',
      safety: [
        'Tu choisis ce que chaque clé a le droit de lire et de faire',
        'Chaque action de l’IA est notée dans le journal du dashboard, sous le nom de sa clé',
        'Tu révoques la clé, l’IA est débranchée sur-le-champ',
      ],
    },
    en: {
      title: 'You ask your AI, Kotbo does it on your server',
      intro:
        'Kotbo runs an MCP server. Plug it into Claude, ChatGPT or Gemini, and your AI handles tickets, pulls reports, issues sanctions and sets up the dashboard, with more than 300 tools',
      beta: 'In beta',
      caption: 'Example in Claude, fictional conversations. It works the same in ChatGPT and Gemini',
      hello: 'Evening, owner',
      placeholder: 'How can I help you today?',
      reply: 'Reply…',
      connected: 'Kotbo',
      newChat: 'New chat',
      suggestions: 'Suggestions',
      using: 'Kotbo',
      running: 'running',
      showCall: 'Show the call',
      input: 'Input',
      result: 'Result',
      status: (title: string) => `Conversation opened: ${title}`,
      scenes: {
        tickets: {
          chip: 'Reply to waiting tickets',
          ask: 'Any tickets waiting? Reply to them',
          answer:
            'Five tickets are open, three of them unanswered for more than 24 h. I replied to all three as Kotbo. #151 is about a refund: I left it alone, a human should take that one',
        },
        report: {
          chip: 'Sanctions report',
          ask: 'Give me this week’s sanctions report',
          answer: 'Twelve sanctions in seven days, eight of them for scam links. Lena issued half. The heaviest ones:',
        },
        raid: {
          chip: 'Ban the raid accounts',
          ask: 'We got raided around 2 am, ban all the accounts',
          answer: 'I found 38 accounts with the same name, raid_acc plus a number. I banned them all, reason “raid of 10/14”. They’re in your sanctions:',
        },
        staff: {
          chip: 'Who’s pulling their weight?',
          ask: 'Who on my staff did nothing this week?',
          answer: 'Mehdi hasn’t taken a ticket or issued a sanction in 7 days. Neither has Zoé, but she’s on approved time off until Thursday. The rest of the team is doing fine:',
        },
        dashboard: {
          chip: 'Turn on levels',
          ask: 'Turn on levels and give the Regular role at level 10',
          answer: 'Done: levels are running, and the Regular role drops at level 10. Here’s how it looks in your dashboard:',
        },
        tournament: {
          chip: 'Set up a tournament',
          ask: 'Set up a Valorant tournament for Saturday',
          answer: 'Everything’s ready for Saturday, with a giveaway for the winning team. All that’s left is writing the rules in #rules',
        },
        announce: {
          chip: 'Announce quiz night',
          ask: 'Announce Friday’s 9 pm quiz night in #announcements, ping everyone',
          answer: 'Posted in #announcements with an @everyone:',
        },
        pulse: {
          chip: 'How’s the server doing?',
          ask: 'How’s the server doing this month?',
          answer: 'Pretty well. Pulse is at 72 out of 100, six points up from a month ago. What drags it down is weekend engagement: your low point is Sunday around 2 pm',
        },
      } as Record<Scene, { chip: string; ask: string; answer: string }>,
      ticket: { channel: 'ticket-148', time: 'Today at 9:12 AM', text: 'Hi Sarah, your report came through. A mod picks it up tonight and will answer you here' },
      report: {
        head: ['Member', 'Sanction', 'By', 'Reason'],
        rows: [
          { a: '@kylian', b: 'Ban', tone: 'alarm', c: 'Lena', d: 'scam links' },
          { a: '@maxou_2', b: 'Ban', tone: 'alarm', c: 'Lena', d: 'alt of @maxou' },
          { a: '@zenox', b: 'Timeout 1 h', tone: 'amber', c: 'Mehdi', d: 'insults in voice' },
          { a: '@nova', b: 'Warning', c: 'Zoé', d: 'emoji spam' },
        ] as Row[],
        more: 'And 8 more. Keep an eye on @zenox: that’s his third timeout this month',
      },
      raid: {
        title: 'Sanctions',
        rows: ['raid_acc01', 'raid_acc02', 'raid_acc03'],
        ban: 'Ban',
        by: 'by MCP[Claude]',
        reason: 'raid of 10/14',
        more: '+ 35 more',
      },
      staff: {
        head: ['Mod', 'Tickets', 'Sanctions', 'This week'],
        rows: [
          { a: 'Lena', b: '14', c: '6', d: 'active', tone: 'ok' },
          { a: 'Yanis', b: '9', c: '3', d: 'active', tone: 'ok' },
          { a: 'Zoé', b: '0', c: '0', d: 'off until Thursday', tone: 'amber' },
          { a: 'Mehdi', b: '0', c: '0', d: 'nothing in 7 days', tone: 'alarm' },
        ] as Row[],
      },
      dash: { module: 'Leveling & XP', on: 'On', rewards: 'Role rewards', level: 'Level 10', role: 'Regular', log: 'Dashboard log: action signed MCP[Claude]' },
      tour: { category: 'Valorant tournament', channels: ['signups', 'rules', 'bracket'], voice: 'tournament-voice', roles: ['Player', 'Organizer'] },
      announce: {
        channel: 'announcements',
        time: 'Today at 6:40 PM',
        title: 'Quiz night Friday 9 pm',
        body: 'Trivia, video games and a bit of nonsense. See you in voice, the top three get a role for the week',
      },
      pulse: {
        score: '72',
        of: 'out of 100',
        delta: '+6 in a month',
        cats: [
          { label: 'Activity', value: 81 },
          { label: 'Moderation', value: 88 },
          { label: 'Growth', value: 64 },
          { label: 'Engagement', value: 55 },
        ],
      },
      howTitle: 'Plugging it in takes two minutes',
      steps: [
        { title: 'A key', text: 'In the dashboard, open Connect an AI, then New key' },
        { title: 'A URL', text: 'Paste it into your AI. In Claude it’s a custom connector, in ChatGPT an app in developer mode, in Gemini an mcp_server block' },
        { title: 'A click', text: 'Kotbo asks for your key, you authorize access, and your AI can see your server' },
      ],
      safetyTitle: 'And you stay in charge',
      safety: [
        'You pick what each key may read and do',
        'Every action the AI takes is written to the dashboard log, under its key’s name',
        'Revoke the key and the AI is unplugged on the spot',
      ],
    },
  };

  const TONE: Record<string, string> = { alarm: 'text-alarm', amber: 'text-amber', ok: 'text-ok' };

  const t = $derived(TEXT[getLocale()]);

  /** `null` : l'accueil de la conversation neuve. */
  let scene = $state<Scene | null>(null);
  /** Avancée de la conversation : 0 = ta demande, puis un pas par outil, puis la réponse. */
  let step = $state(0);
  let open = $state<string | null>(null);
  let reduced = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let started = false;
  let windowEl: HTMLElement | undefined = $state();

  const tools = $derived(scene ? TOOLS[scene] : []);
  const last = $derived(tools.length + 1);

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => clearInterval(timer);
  });

  function play(s: Scene) {
    scene = s;
    open = null;
    clearInterval(timer);
    if (!started) {
      started = true;
      track('playground_started', { content: 'mcp' });
    }
    // Sur téléphone, les suggestions peuvent être plus bas que le haut de la fenêtre.
    if (windowEl && windowEl.getBoundingClientRect().top < 0) {
      windowEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
    if (reduced) {
      step = TOOLS[s].length + 1;
      return;
    }
    step = 0;
    timer = setInterval(() => {
      step += 1;
      if (step >= TOOLS[s].length + 1) clearInterval(timer);
    }, 700);
  }

  function home() {
    clearInterval(timer);
    scene = null;
    open = null;
  }
</script>

<section id="ia" aria-labelledby="ia-title" class="bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="ia" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-3xl">
      <h2 id="ia-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist text-pretty">
        {t.intro}
        <span class="ml-1 inline-block rounded-md border border-line-2 px-2 py-0.5 align-middle text-xs font-semibold text-fog">{t.beta}</span>
      </p>
    </div>

    <!-- La fenêtre de Claude -->
    <figure class="mt-12">
      <div bind:this={windowEl} class="claude scroll-mt-24 overflow-hidden rounded-2xl border border-[var(--cl-line)] bg-[var(--cl-bg)] text-[var(--cl-text)]">
        <div class="flex items-center gap-3 border-b border-[var(--cl-line)] px-3 py-2.5 sm:px-4">
          <div class="flex items-center gap-1.5 pr-2" aria-hidden="true">
            <span class="h-3 w-3 rounded-full bg-[var(--cl-line)]"></span>
            <span class="h-3 w-3 rounded-full bg-[var(--cl-line)]"></span>
            <span class="h-3 w-3 rounded-full bg-[var(--cl-line)]"></span>
          </div>
          <button
            type="button"
            onclick={home}
            disabled={scene === null}
            class="flex min-h-9 items-center gap-2 rounded-lg px-2.5 text-sm text-[var(--cl-text-2)] transition-colors enabled:hover:bg-[var(--cl-surface)] enabled:hover:text-[var(--cl-text)] disabled:opacity-50"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" /></svg>
            <span class="hidden sm:inline">{t.newChat}</span>
          </button>
          <p class="min-w-0 flex-1 truncate text-center text-sm text-[var(--cl-text-2)]">{scene ? t.scenes[scene].chip : ''}</p>
          <span class="w-9 sm:w-40" aria-hidden="true"></span>
        </div>

        {#if scene === null}
          <!-- L'accueil : rien d'écrit, des suggestions -->
          <div class="msg flex min-h-[36rem] flex-col items-center justify-center px-4 py-12 sm:px-8">
            <p class="flex items-center gap-3 font-serif text-3xl text-[var(--cl-text)] sm:text-4xl">
              {@render spark('h-8 w-8 sm:h-9 sm:w-9')}
              {t.hello}
            </p>
            {@render composer(t.placeholder, 'mt-8')}
            <div class="mt-5 w-full max-w-2xl">
              <p class="sr-only">{t.suggestions}</p>
              <ul class="flex flex-wrap justify-center gap-2">
                {#each SCENES as s (s)}
                  <li>
                    <button
                      type="button"
                      onclick={() => play(s)}
                      class="min-h-10 rounded-lg border border-[var(--cl-line)] px-3 py-1.5 text-sm text-[var(--cl-text-2)] transition-colors hover:border-[var(--cl-line-2)] hover:bg-[var(--cl-surface)] hover:text-[var(--cl-text)]"
                    >
                      {t.scenes[s].chip}
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {:else}
          <!-- La conversation -->
          <div class="mx-auto flex min-h-[36rem] max-w-3xl flex-col px-4 py-8 sm:px-8">
            <div class="flex-1 space-y-6">
              {#key scene}
                <div class="msg flex justify-end">
                  <p class="max-w-[85%] rounded-2xl bg-[var(--cl-bubble)] px-4 py-2.5 text-[15px] leading-relaxed">{t.scenes[scene].ask}</p>
                </div>
              {/key}

              <div class="space-y-2">
                {#each tools as tool, i (scene + tool.name)}
                  {#if step >= i + 1}
                    {@const done = step > i + 1}
                    {@const id = `${scene}-${tool.name}`}
                    <div class="msg rounded-xl border border-[var(--cl-line)] bg-[var(--cl-surface)]/60">
                      <button
                        type="button"
                        aria-expanded={open === id}
                        aria-label="{t.showCall} {tool.name}"
                        onclick={() => (open = open === id ? null : id)}
                        class="flex min-h-11 w-full items-center gap-3 px-3.5 text-left text-sm"
                      >
                        <img src="{base}/favicon.svg" alt="" width="18" height="18" class="h-4.5 w-4.5 shrink-0 rounded" />
                        <span class="text-[var(--cl-text-2)]">{t.using}</span>
                        <span class="min-w-0 flex-1 truncate font-mono text-[13px] text-[var(--cl-text)]">{tool.name}{#if tool.times}<span class="text-[var(--cl-muted)]">&nbsp;×{tool.times}</span>{/if}</span>
                        {#if done}
                          <svg viewBox="0 0 16 16" width="16" height="16" class="shrink-0 text-ok" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        {:else}
                          <span class="spin h-4 w-4 shrink-0 rounded-full border-2 border-[var(--cl-line-2)] border-t-[var(--cl-text)]" aria-hidden="true"></span>
                          <span class="sr-only">{t.running}</span>
                        {/if}
                        <svg viewBox="0 0 16 16" width="14" height="14" class="shrink-0 text-[var(--cl-muted)] transition-transform {open === id ? 'rotate-180' : ''}" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
                      </button>
                      {#if open === id}
                        <div class="space-y-1 border-t border-[var(--cl-line)] px-3.5 py-3 font-mono text-[12px] leading-5">
                          <p class="text-[var(--cl-muted)]">{t.input}</p>
                          <p class="break-all text-[var(--cl-text)]">{tool.input}</p>
                          <p class="pt-2 text-[var(--cl-muted)]">{t.result}</p>
                          <p class="break-all text-[var(--cl-text)]">{tool.result}</p>
                        </div>
                      {/if}
                    </div>
                  {/if}
                {/each}
              </div>

              {#if step >= last}
                <div class="msg space-y-5">
                  <div class="flex gap-3">
                    {@render spark('mt-1 h-5 w-5 shrink-0')}
                    <p class="font-serif text-[16.5px] leading-relaxed">{t.scenes[scene].answer}</p>
                  </div>
                  <div class="space-y-5 sm:pl-8">{@render outcome(scene)}</div>
                </div>
              {/if}
            </div>
            {@render composer(t.reply, 'mt-10')}
          </div>
        {/if}
        <p class="sr-only" role="status">{scene ? t.status(t.scenes[scene].chip) : ''}</p>
      </div>
      <figcaption class="mt-3 text-xs text-fog">{t.caption}</figcaption>
    </figure>

    <!-- Le branchement -->
    <div class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-10 border-t border-line pt-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <h3 class="font-display text-2xl font-extrabold tracking-tight text-ink">{t.howTitle}</h3>
        <ol class="mt-6 grid gap-6 sm:grid-cols-3">
          {#each t.steps as s, i (s.title)}
            <li>
              <p class="font-display text-5xl font-black text-line-2" aria-hidden="true">{i + 1}</p>
              <p class="mt-2 font-semibold text-ink">{s.title}</p>
              <p class="mt-1 text-sm leading-relaxed text-mist">{s.text}</p>
            </li>
          {/each}
        </ol>
      </div>
      <div>
        <h3 class="font-display text-2xl font-extrabold tracking-tight text-ink">{t.safetyTitle}</h3>
        <ul class="mt-6 space-y-3">
          {#each t.safety as line (line)}
            <li class="flex gap-3 text-sm leading-relaxed text-mist">
              <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ok" aria-hidden="true"></span>
              {line}
            </li>
          {/each}
        </ul>
        <div class="mt-8"><AddButton content="mcp" /></div>
      </div>
    </div>
  </div>
</section>

{#snippet spark(cls: string)}
  <!-- L'étoile de Claude, redessinée pour l'exemple -->
  <svg viewBox="0 0 24 24" class={cls} aria-hidden="true">
    <g fill="#d97757">
      {#each Array.from({ length: 12 }, (_, i) => i * 30) as angle (angle)}
        <path d={angle % 60 ? 'M12 12 L11.3 4.2 Q12 3.4 12.7 4.2 Z' : 'M12 12 L11 2.2 Q12 1.2 13 2.2 Z'} transform="rotate({angle} 12 12)" />
      {/each}
      <circle cx="12" cy="12" r="2.2" />
    </g>
  </svg>
{/snippet}

{#snippet composer(placeholder: string, cls: string)}
  <!-- La barre de saisie, dessinée : on écrit avec les suggestions -->
  <div class="w-full max-w-2xl rounded-2xl border border-[var(--cl-line)] bg-[var(--cl-surface)] p-3 {cls}" aria-hidden="true">
    <p class="px-1.5 py-1 text-[15px] text-[var(--cl-muted)]">{placeholder}</p>
    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--cl-line)] text-[var(--cl-muted)]">
          <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" /></svg>
        </span>
        <span class="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--cl-line)] px-2.5 text-xs text-[var(--cl-text-2)]">
          <img src="{base}/favicon.svg" alt="" width="14" height="14" class="h-3.5 w-3.5 rounded-sm" />
          {t.connected}
        </span>
      </div>
      <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d97757]/50 text-[var(--cl-bg)]">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
    </div>
  </div>
{/snippet}

{#snippet table(head: string[], rows: Row[], mono: boolean)}
  <div class="overflow-x-auto rounded-xl border border-[var(--cl-line)]">
    <table class="w-full min-w-[30rem] text-left text-sm">
      <thead class="bg-[var(--cl-surface)] text-[var(--cl-text-2)]">
        <tr>{#each head as h (h)}<th scope="col" class="px-3.5 py-2.5 font-semibold">{h}</th>{/each}</tr>
      </thead>
      <tbody>
        {#each rows as row (row.a)}
          <tr class="border-t border-[var(--cl-line)]">
            <td class="px-3.5 py-2.5 {mono ? 'font-mono text-[13px]' : ''}">{row.a}</td>
            <td class="px-3.5 py-2.5 {mono ? (TONE[row.tone ?? ''] ?? 'text-[var(--cl-text-2)]') : 'tabular-nums'}">{row.b}</td>
            <td class="px-3.5 py-2.5 {mono ? '' : 'tabular-nums'}">{row.c}</td>
            <td class="px-3.5 py-2.5 {mono ? 'text-[var(--cl-text-2)]' : (TONE[row.tone ?? ''] ?? '')}">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/snippet}

{#snippet discordMsg(channel: string, time: string, body: import('svelte').Snippet)}
  <div class="stay-dark rounded-xl bg-[#313338] p-4">
    <p class="text-xs font-semibold text-[#949ba4]"># {channel}</p>
    <div class="mt-3 flex gap-3">
      <img src="{base}/favicon.svg" alt="" width="40" height="40" class="h-10 w-10 shrink-0 rounded-full" />
      <div class="min-w-0 flex-1">
        <p class="flex flex-wrap items-center gap-1.5">
          <span class="font-semibold text-ink">Kotbo</span>
          <span class="rounded bg-blurple px-1 text-[10px] font-semibold leading-4 text-white">APP</span>
          <span class="text-xs text-[#949ba4]">{time}</span>
        </p>
        {@render body()}
      </div>
    </div>
  </div>
{/snippet}

{#snippet ticketBody()}
  <p class="mt-0.5 text-[15px] leading-relaxed text-[#dbdee1]">{t.ticket.text}</p>
{/snippet}

{#snippet announceBody()}
  <p class="mt-0.5 text-[15px] text-[#dbdee1]"><span class="rounded bg-[#5865f2]/30 px-0.5 text-[#c9cdfb]">@everyone</span></p>
  <div class="mt-1.5 rounded border-l-4 border-[#5865f2] bg-[#2b2d31] p-3.5">
    <p class="font-semibold text-[#f2f3f5]">{t.announce.title}</p>
    <p class="mt-1 text-sm leading-relaxed text-[#dbdee1]">{t.announce.body}</p>
  </div>
{/snippet}

{#snippet outcome(s: Scene)}
  {#if s === 'tickets'}
    {@render discordMsg(t.ticket.channel, t.ticket.time, ticketBody)}
  {:else if s === 'report'}
    {@render table(t.report.head, t.report.rows, true)}
    <p class="font-serif text-[16.5px] leading-relaxed">{t.report.more}</p>
  {:else if s === 'raid'}
    <div class="rounded-xl border border-line bg-night-2 p-4">
      <p class="font-semibold text-ink">{t.raid.title}</p>
      <ul class="mt-3 space-y-1.5">
        {#each t.raid.rows as who (who)}
          <li class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-night-3 px-3 py-2 text-sm">
            <span class="rounded-md bg-alarm/15 px-1.5 text-xs font-semibold leading-5 text-alarm">{t.raid.ban}</span>
            <span class="font-mono text-[13px] text-ink">@{who}</span>
            <span class="text-fog">{t.raid.reason}</span>
            <span class="ml-auto text-xs text-fog">{t.raid.by}</span>
          </li>
        {/each}
      </ul>
      <p class="mt-2.5 text-xs text-fog">{t.raid.more}</p>
    </div>
  {:else if s === 'staff'}
    {@render table(t.staff.head, t.staff.rows, false)}
  {:else if s === 'dashboard'}
    <div class="rounded-xl border border-line bg-night-2 p-4">
      <div class="flex items-center justify-between gap-3">
        <p class="font-semibold text-ink">{t.dash.module}</p>
        <p class="flex items-center gap-2 text-sm text-mist">
          {t.dash.on}
          <span class="relative h-5 w-9 rounded-full bg-[#4f46e5]" aria-hidden="true"><span class="absolute left-[1.125rem] top-0.5 h-4 w-4 rounded-full bg-white"></span></span>
        </p>
      </div>
      <p class="mt-4 text-xs font-semibold text-fog">{t.dash.rewards}</p>
      <p class="mt-2 flex items-center justify-between gap-3 rounded-lg bg-night-3 px-3 py-2.5 text-sm">
        <span class="text-ink">{t.dash.level}</span>
        <span class="rounded-md bg-[#4f46e5]/20 px-2 py-0.5 font-semibold text-glow">@{t.dash.role}</span>
      </p>
      <p class="mt-4 border-t border-line pt-3 text-xs text-fog">{t.dash.log}</p>
    </div>
  {:else if s === 'tournament'}
    <div class="stay-dark flex flex-col gap-4 rounded-xl bg-[#2b2d31] p-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-[#949ba4]">🏆 {t.tour.category}</p>
        <ul class="mt-2 space-y-0.5 text-[15px] text-[#dbdee1]">
          {#each t.tour.channels as c (c)}<li><span class="text-[#80848e]" aria-hidden="true">#</span> {c}</li>{/each}
          <li><span aria-hidden="true">🔊</span> {t.tour.voice}</li>
        </ul>
      </div>
      <ul class="flex flex-wrap gap-2">
        {#each t.tour.roles as r, i (r)}
          <li class="rounded-md px-2 py-0.5 text-sm font-semibold {i === 0 ? 'bg-[#f0b232]/15 text-[#f0b232]' : 'bg-[#23a55a]/15 text-[#57f287]'}">@{r}</li>
        {/each}
      </ul>
    </div>
  {:else if s === 'announce'}
    {@render discordMsg(t.announce.channel, t.announce.time, announceBody)}
  {:else}
    <div class="rounded-xl border border-line bg-night-2 p-5">
      <p class="flex items-baseline gap-2">
        <span class="font-display text-5xl font-black tabular-nums text-ink">{t.pulse.score}</span>
        <span class="text-sm text-fog">{t.pulse.of}</span>
        <span class="ml-auto text-sm font-semibold text-ok">{t.pulse.delta}</span>
      </p>
      <ul class="mt-5 space-y-3">
        {#each t.pulse.cats as c (c.label)}
          <li>
            <p class="flex justify-between text-sm"><span class="text-mist">{c.label}</span><span class="tabular-nums text-ink">{c.value}</span></p>
            <span class="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-night-4" aria-hidden="true">
              <span class="block h-full rounded-full {c.value < 60 ? 'bg-amber' : 'bg-ok'}" style="width: {c.value}%"></span>
            </span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
{/snippet}

<style>
  /* Claude, en sombre et en clair : la fenêtre suit le thème de la page. */
  .claude {
    --cl-bg: #262624;
    --cl-surface: #30302e;
    --cl-bubble: #141413;
    --cl-line: #3e3d39;
    --cl-line-2: #5e5d59;
    --cl-text: #faf9f5;
    --cl-text-2: #c2c0b6;
    --cl-muted: #a6a39b;
  }
  :global([data-theme='light']) .claude {
    --cl-bg: #faf9f5;
    --cl-surface: #ffffff;
    --cl-bubble: #f0eee6;
    --cl-line: #e2dfd5;
    --cl-line-2: #c3c0b5;
    --cl-text: #141413;
    --cl-text-2: #3d3d3a;
    --cl-muted: #6b6a64;
  }
  .msg {
    animation: msg 280ms ease both;
  }
  @keyframes msg {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
  .spin {
    animation: spin 700ms linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .msg,
    .spin {
      animation: none;
    }
  }
</style>

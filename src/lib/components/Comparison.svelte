<script lang="ts">
  /**
   * Comparatif : ce que Kotbo remplace.
   *
   * L'argument n'est pas « Kotbo fait mieux que MEE6 », qui se discute et
   * vieillit mal. Il est « vous payez et administrez cinq outils qui ne se
   * parlent pas » - ce qui, lui, ne se discute pas : un serveur structuré
   * empile réellement un bot de modération, un de tickets, un de giveaways, et
   * finit ses statistiques dans un tableur.
   *
   * D'où le tableau du haut : une colonne par outil qu'on remplace, une ligne
   * par besoin, et la dernière colonne qui coche tout. La somme des
   * abonnements en bas fait le reste du travail.
   *
   * Les tarifs concurrents sont des ordres de grandeur affichés comme tels
   * (« ≈ »), et non des prix relevés : ils changent sans prévenir, et
   * prétendre à l'exactitude sur le prix d'un concurrent est le meilleur moyen
   * de se faire prendre en défaut. Exception : DraftBot, dont le premium
   * (3,99 €/mois pour 3 serveurs) est affiché publiquement - on met le vrai
   * chiffre quand il existe.
   */
  import { Check, Minus, ChevronDown, X } from '@lucide/svelte';
  import { slide } from 'svelte/transition';
  import { reveal } from '$lib/actions/reveal';
  import { base } from '$app/paths';
  import Emph from '$lib/components/ui/Emph.svelte';
  import PostIt from '$lib/components/ui/PostIt.svelte';
  import HandDrawnArrow from '$lib/components/ui/HandDrawnArrow.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  interface Props {
    inviteUrl: string;
  }

  const { inviteUrl }: Props = $props();

  const TEXT = {
    fr: {
      eyebrow: 'Comparatif',
      titlePrefix: 'Un seul Kotbo.',
      titleEmph: 'Tous',
      titleSuffix: 'vos outils.',
      intro:
        'Un serveur structuré empile trois bots et deux tableurs qui ne se parlent pas. Chacun a ses réglages, ses permissions, sa facture.',
      needCol: 'Besoin',
      kotboCol: 'Kotbo',
      perMonth: 'Par mois',
      fromPrice: 'dès 2,50 €',
      showCurrentBots: 'Compare avec tes bots actuels',
      hideCurrentBots: 'Masquer mes bots actuels',
      toolTitle: "Qu'est-ce qui tourne déjà sur ton serveur ?",
      toolIntro: 'Un bot par catégorie. Reclique dessus pour le retirer.',
      clearAll: 'Tout effacer',
      moduleCol: 'Module',
      free: 'gratuit',
      emptySelection: 'Coche au moins un bot pour voir ce qu\'il couvre déjà, et ce que Kotbo ajoute.',
      exclusiveLabel: 'En plus, chez Kotbo',
      payAbout: 'Tu payes environ',
      perMonthShort: '/ mois.',
      withKotbo: 'Avec Kotbo :',
      savedPerMonth: 'économisés / mois',
      perYear: 'soit',
      perYearSuffix: 'par an',
      toolDisclaimer:
        "Tarifs premium d'entrée de gamme, ordres de grandeur vérifiés sur les pages publiques de chaque bot en septembre 2026 (conversion approximative pour les prix en dollars). Ils changent sans préavis, et Kotbo n'est affilié à aucun des bots listés.",
      cta: 'Ajouter Kotbo à mon serveur',
      columns: [
        { key: 'mod', label: 'Bot de modération' },
        { key: 'ticket', label: 'Bot de tickets' },
        { key: 'giveaway', label: 'Bot de giveaways' },
        { key: 'sheets', label: 'Tableurs & Trello' },
      ],
      rows: [
        'Modération et sanctions',
        'Journaux détaillés',
        'Niveaux et économie',
        'Tickets et transcriptions',
        'Giveaways et événements',
        'Candidatures et recrutement',
        'Planning, réunions, absences',
        'Évaluations et suivi du staff',
        'Statistiques et analyses',
        'Hiérarchie et droits du staff',
        'Tout au même endroit',
      ],
      costs: {
        mod: '≈ 10 €',
        ticket: '≈ 5 €',
        giveaway: '≈ 4 €',
        sheets: 'Du temps',
      } as Record<string, string>,
      categoryLabels: {
        ticket: 'Tickets',
        moderation: 'Modération',
        multibot: 'Multibot (tout-en-un)',
        giveaway: 'Giveaways',
        leveling: 'Niveaux (XP)',
        automod: 'Automod',
        antiraid: 'Anti-raid',
        analytics: 'Statistiques',
        economy: 'Économie',
        verification: 'Vérification Roblox',
        counting: 'Comptage',
        quiz: 'Quiz',
      } as Record<string, string>,
      sharedFeatureLabels: {
        tickets: 'Tickets et transcriptions',
        moderation: 'Modération et sanctions',
        automod: 'Auto-modération',
        antiraid: 'Anti-raid et sécurité',
        leveling: 'Niveaux et XP',
        economy: 'Économie virtuelle',
        giveaways: 'Giveaways et événements',
        stats: 'Statistiques et analytics',
        verification: 'Vérification Roblox',
        counting: 'Comptage',
        quiz: 'Quiz',
      } as Record<string, string>,
      exclusiveFeatureLabels: {
        recruitment: 'Candidatures et recrutement',
        planning: 'Planning, réunions, absences staff',
        hierarchy: 'Hiérarchie et droits du staff',
        widgets: 'Widgets Discord natifs (profil membre)',
        mcp: 'Serveur MCP (pilotage par IA)',
        dashboard: 'Dashboard complet en français',
      } as Record<string, string>,
    },
    en: {
      eyebrow: 'Comparison',
      titlePrefix: 'One Kotbo.',
      titleEmph: 'All',
      titleSuffix: 'your tools.',
      intro:
        "A well-organized server ends up stacking three bots and two spreadsheets that don't talk to each other. Each with its own settings, its own permissions, its own bill.",
      needCol: 'Need',
      kotboCol: 'Kotbo',
      perMonth: 'Per month',
      fromPrice: 'from €2.50',
      showCurrentBots: 'Compare with your current bots',
      hideCurrentBots: 'Hide my current bots',
      toolTitle: 'What\'s already running on your server?',
      toolIntro: 'One bot per category. Click again to remove it.',
      clearAll: 'Clear all',
      moduleCol: 'Module',
      free: 'free',
      emptySelection: 'Check at least one bot to see what it already covers, and what Kotbo adds.',
      exclusiveLabel: 'Plus, only with Kotbo',
      payAbout: "You're paying about",
      perMonthShort: '/ month.',
      withKotbo: 'With Kotbo:',
      savedPerMonth: 'saved / month',
      perYear: "that's",
      perYearSuffix: 'per year',
      toolDisclaimer:
        "Entry-level premium pricing, order-of-magnitude figures checked against each bot's public pricing page in September 2026 (approximate conversion for prices in dollars). They change without notice, and Kotbo isn't affiliated with any of the bots listed.",
      cta: 'Add Kotbo to my server',
      columns: [
        { key: 'mod', label: 'Moderation bot' },
        { key: 'ticket', label: 'Ticket bot' },
        { key: 'giveaway', label: 'Giveaway bot' },
        { key: 'sheets', label: 'Spreadsheets & Trello' },
      ],
      rows: [
        'Moderation and sanctions',
        'Detailed logs',
        'Levels and economy',
        'Tickets and transcripts',
        'Giveaways and events',
        'Applications and recruitment',
        'Scheduling, meetings, leave',
        'Staff reviews and tracking',
        'Stats and analytics',
        'Staff hierarchy and permissions',
        'Everything in one place',
      ],
      costs: {
        mod: '≈ €10',
        ticket: '≈ €5',
        giveaway: '≈ €4',
        sheets: 'Your time',
      } as Record<string, string>,
      categoryLabels: {
        ticket: 'Tickets',
        moderation: 'Moderation',
        multibot: 'Multibot (all-in-one)',
        giveaway: 'Giveaways',
        leveling: 'Levels (XP)',
        automod: 'Automod',
        antiraid: 'Anti-raid',
        analytics: 'Analytics',
        economy: 'Economy',
        verification: 'Roblox verification',
        counting: 'Counting',
        quiz: 'Quiz',
      } as Record<string, string>,
      sharedFeatureLabels: {
        tickets: 'Tickets and transcripts',
        moderation: 'Moderation and sanctions',
        automod: 'Auto-moderation',
        antiraid: 'Anti-raid and security',
        leveling: 'Levels and XP',
        economy: 'Virtual economy',
        giveaways: 'Giveaways and events',
        stats: 'Stats and analytics',
        verification: 'Roblox verification',
        counting: 'Counting',
        quiz: 'Quiz',
      } as Record<string, string>,
      exclusiveFeatureLabels: {
        recruitment: 'Applications and recruitment',
        planning: 'Staff scheduling, meetings, leave',
        hierarchy: 'Staff hierarchy and permissions',
        widgets: 'Native Discord widgets (member profile)',
        mcp: 'MCP server (AI control)',
        dashboard: 'Full dashboard in French',
      } as Record<string, string>,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const columns = $derived(t.columns);

  /** `true` = l'outil couvre le besoin. Kotbo les couvre tous, par construction. */
  const ROW_COVERAGE: Record<string, boolean>[] = [
    { mod: true, ticket: false, giveaway: false, sheets: false },
    { mod: true, ticket: false, giveaway: false, sheets: false },
    { mod: true, ticket: false, giveaway: false, sheets: false },
    { mod: false, ticket: true, giveaway: false, sheets: false },
    { mod: false, ticket: false, giveaway: true, sheets: false },
    { mod: false, ticket: true, giveaway: false, sheets: true },
    { mod: false, ticket: false, giveaway: false, sheets: true },
    { mod: false, ticket: false, giveaway: false, sheets: true },
    { mod: false, ticket: false, giveaway: false, sheets: true },
    { mod: false, ticket: false, giveaway: false, sheets: false },
    { mod: false, ticket: false, giveaway: false, sheets: false },
  ];
  const rows: { label: string; has: Record<string, boolean> }[] = $derived(
    ROW_COVERAGE.map((has, i) => ({ has, label: t.rows[i] })),
  );

  /** Ordres de grandeur mensuels, en euros. Volontairement bas : l'écart parle. */
  const costs = $derived(t.costs);

  let toolOpen = $state(false);

  /**
   * Outil « ton serveur, précisément ».
   *
   * Le tableau du haut compare des catégories abstraites. Ici, le visiteur
   * coche les bots qu'il a vraiment - un par catégorie, comme dans la vraie
   * vie : on fait rarement tourner deux bots de tickets en même temps. Deux
   * choses en sortent, sous ses yeux : quels modules ses bots actuels
   * couvrent déjà (la matrice), et ce que Kotbo pose en plus par-dessus (la
   * ligne "En plus, chez Kotbo").
   *
   * `covers` liste des besoins fonctionnels génériques, pas les intitulés
   * marketing de chaque bot - un bot de tickets premium et un autre ne se
   * distinguent pas ici par leurs options, seulement par le besoin qu'ils
   * couvrent ou non. Les quatre dernières lignes (candidatures, planning,
   * hiérarchie, dashboard FR) ne sont couvertes par aucun concurrent listé :
   * ce n'est pas un oubli, c'est le point du tableau.
   *
   * Prix premium d'entrée de gamme, en euros, ordres de grandeur vérifiés sur
   * les pages tarifs publiques en septembre 2026 (conversion approximative
   * pour les prix en dollars). `free: true` = gratuit ou open source
   * (hébergement à part, non compté).
   */
  type FeatureKey =
    | 'tickets' | 'moderation' | 'automod' | 'antiraid' | 'leveling'
    | 'economy' | 'giveaways' | 'stats' | 'recruitment' | 'planning'
    | 'hierarchy' | 'dashboard' | 'widgets' | 'mcp' | 'verification' | 'counting' | 'quiz';

  const SHARED_FEATURE_KEYS: FeatureKey[] = [
    'tickets', 'moderation', 'automod', 'antiraid', 'leveling',
    'economy', 'giveaways', 'stats', 'verification', 'counting', 'quiz',
  ];
  const SHARED_FEATURES = $derived(
    SHARED_FEATURE_KEYS.map((key) => ({ key, label: t.sharedFeatureLabels[key] })),
  );

  /** Aucun concurrent du registre ne couvre ces lignes-là : c'est voulu. */
  const EXCLUSIVE_FEATURE_KEYS: FeatureKey[] = [
    'recruitment', 'planning', 'hierarchy', 'widgets', 'mcp', 'dashboard',
  ];
  const EXCLUSIVE_FEATURES = $derived(
    EXCLUSIVE_FEATURE_KEYS.map((key) => ({ key, label: t.exclusiveFeatureLabels[key] })),
  );

  /**
   * `icon` : nom de fichier dans `static/bots/`. Ce sont les vraies icônes des
   * bots, copiées localement plutôt que chargées depuis le CDN de Discord -
   * un hotlink ferait fuiter l'IP des visiteurs vers un tiers, ce que la page
   * de confidentialité promet justement de ne pas faire. Les deux entrées
   * natives Discord (AutoMod, Insights) partagent la marque Discord.
   */
  type BotOption = {
    key: string;
    name: string;
    price: number;
    free?: boolean;
    icon: string;
    covers: FeatureKey[];
  };

  function botIcon(bot: BotOption): string {
    return `${base}/bots/${bot.icon}`;
  }

  const CATEGORY_DEFS: { key: string; options: BotOption[] }[] = [
    {
      key: 'ticket',
      options: [
        { key: 'tickettool', name: 'Ticket Tool', price: 7, icon: 'tickettool.png', covers: ['tickets'] },
        { key: 'ticketsbot', name: 'Tickets Bot', price: 5, icon: 'ticketsbot.png', covers: ['tickets'] },
        { key: 'openticket', name: 'Open Ticket', price: 0, free: true, icon: 'openticket.png', covers: ['tickets'] },
      ],
    },
    {
      key: 'moderation',
      options: [
        { key: 'dyno', name: 'Dyno', price: 5, icon: 'dyno.png', covers: ['moderation', 'automod'] },
        { key: 'carlbot', name: 'Carl-bot', price: 4, icon: 'carlbot.png', covers: ['moderation', 'automod'] },
        { key: 'modmail', name: 'Modmail', price: 0, free: true, icon: 'modmail.png', covers: ['moderation'] },
      ],
    },
    {
      key: 'multibot',
      options: [
        { key: 'draftbot', name: 'DraftBot', price: 3.99, icon: 'draftbot.png', covers: ['leveling', 'economy', 'moderation'] },
        { key: 'probot', name: 'ProBot', price: 3, icon: 'probot.png', covers: ['moderation', 'leveling', 'giveaways'] },
        { key: 'mee6', name: 'MEE6', price: 12, icon: 'mee6.png', covers: ['leveling', 'moderation', 'tickets'] },
      ],
    },
    {
      key: 'giveaway',
      options: [
        { key: 'giveawaybot', name: 'GiveawayBot', price: 3, icon: 'giveawaybot.png', covers: ['giveaways'] },
      ],
    },
    {
      key: 'leveling',
      options: [
        { key: 'arcane', name: 'Arcane', price: 5, icon: 'arcane.png', covers: ['leveling'] },
        { key: 'lurkr', name: 'Lurkr', price: 5, icon: 'lurkr.png', covers: ['leveling', 'automod'] },
        { key: 'polaris', name: 'Polaris', price: 0, free: true, icon: 'polaris.png', covers: ['leveling'] },
      ],
    },
    {
      key: 'automod',
      options: [
        { key: 'discordautomod', name: 'AutoMod Discord', price: 0, free: true, icon: 'discord.svg', covers: ['automod'] },
        { key: 'crosslink', name: 'Crosslink', price: 0, free: true, icon: 'crosslink.png', covers: ['automod'] },
      ],
    },
    {
      key: 'antiraid',
      options: [
        { key: 'beemo', name: 'Beemo', price: 5, icon: 'beemo.png', covers: ['antiraid'] },
        { key: 'wick', name: 'Wick', price: 5, icon: 'wick.png', covers: ['antiraid'] },
        { key: 'securitybot', name: 'SecurityBot', price: 3, icon: 'securitybot.png', covers: ['antiraid'] },
      ],
    },
    {
      key: 'analytics',
      options: [
        { key: 'statbot', name: 'Statbot', price: 5, icon: 'statbot.png', covers: ['stats'] },
        { key: 'serverstats', name: 'ServerStats', price: 3, icon: 'serverstats.png', covers: ['stats'] },
        { key: 'discordinsights', name: 'Discord Insights', price: 0, free: true, icon: 'discord.svg', covers: ['stats'] },
      ],
    },
    {
      key: 'economy',
      options: [
        { key: 'unbelievaboat', name: 'UnbelievaBoat', price: 4, icon: 'unbelievaboat.png', covers: ['economy'] },
        { key: 'dankmemer', name: 'Dank Memer', price: 2, icon: 'dankmemer.png', covers: ['economy'] },
        { key: 'tatsu', name: 'Tatsu', price: 5, icon: 'tatsu.png', covers: ['economy', 'leveling', 'giveaways'] },
      ],
    },
    {
      key: 'verification',
      options: [
        { key: 'bloxlink', name: 'Bloxlink', price: 6, icon: 'bloxlink.png', covers: ['verification'] },
      ],
    },
    {
      key: 'counting',
      options: [
        { key: 'countingbot', name: 'Counting Bot', price: 0, free: true, icon: 'countingbot.png', covers: ['counting'] },
      ],
    },
    {
      key: 'quiz',
      options: [
        { key: 'quizbot', name: 'QuizBot', price: 0, free: true, icon: 'quizbot.png', covers: ['quiz'] },
      ],
    },
  ];

  const CATEGORIES = $derived(
    CATEGORY_DEFS.map((c) => ({ ...c, label: t.categoryLabels[c.key] })),
  );

  const ALL_BOTS = CATEGORY_DEFS.flatMap((c) => c.options);

  /**
   * Entrée de gamme Kotbo ramenée au mois : l'offre Starter à 30 € l'an, soit
   * 2,50 € par mois. C'est le prix le plus bas que quelqu'un puisse payer, donc
   * le seul honnête à opposer à des « ≈ » de concurrents - annoncer le tarif
   * d'un palier supérieur gonflerait artificiellement la comparaison.
   */
  const kotboPrice = 2.5;

  /** Clef de catégorie -> clef de bot choisi ('' ou absent = aucun). */
  let selection = $state<Record<string, string>>({});

  function selectBot(categoryKey: string, botKey: string) {
    const next = { ...selection };
    next[categoryKey] = next[categoryKey] === botKey ? '' : botKey;
    selection = next;
  }

  const selectedOptions = $derived(
    Object.values(selection)
      .filter(Boolean)
      .map((key) => ALL_BOTS.find((b) => b.key === key))
      .filter((b): b is BotOption => !!b)
  );

  const selectedTotal = $derived(selectedOptions.reduce((sum, b) => sum + b.price, 0));
  const monthlyGain = $derived(Math.max(0, selectedTotal - kotboPrice));
  const yearlyGain = $derived(monthlyGain * 12);

  function formatEuro(n: number): string {
    const locale = getLocale() === 'en' ? 'en-US' : 'fr-FR';
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n)} €`;
  }
</script>

<section id="comparatif" class="py-20 lg:py-24 bg-white">
  <div class="max-w-[90rem] mx-auto px-8">

    <div use:reveal={{ direction: 'up' }} class="text-center max-w-3xl mx-auto mb-12">
      <p class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 mb-5">{t.eyebrow}</p>
      <h2 class="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6 font-headline leading-[1.08]">
        {t.titlePrefix}<br /><Emph>{t.titleEmph}</Emph> {t.titleSuffix}
      </h2>
      <p class="text-base lg:text-lg text-gray-500 font-bold leading-relaxed">
        {t.intro}
      </p>
    </div>

    <!-- Le tableau déborde sur mobile : il défile dans son propre conteneur
         plutôt que de faire glisser la page entière. -->
    <div use:reveal={{ direction: 'up', delay: 100 }} class="max-w-6xl mx-auto overflow-x-auto">
      <table class="w-full min-w-[720px] border-separate border-spacing-0">
        <thead>
          <tr>
            <th class="text-left align-bottom pb-5 pr-4 w-[34%]">
              <span class="sr-only">{t.needCol}</span>
            </th>
            {#each columns as col (col.key)}
              <th class="pb-5 px-3 align-bottom">
                <span class="block text-xs font-black uppercase tracking-wider text-gray-400 leading-tight">
                  {col.label}
                </span>
              </th>
            {/each}
            <th class="pb-5 px-3 align-bottom">
              <span class="block text-base font-black tracking-tight text-indigo-600">{t.kotboCol}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {#each rows as row, i (row.label)}
            <tr class="group">
              <td
                class="py-3.5 pr-4 text-sm font-bold text-gray-700 border-t border-gray-100
                       {i === 0 ? 'border-t-0' : ''}"
              >
                {row.label}
              </td>

              {#each columns as col (col.key)}
                <td class="py-3.5 px-3 text-center border-t border-gray-100 {i === 0 ? 'border-t-0' : ''}">
                  {#if row.has[col.key]}
                    <Check class="w-4 undefined text-gray-400 inline" strokeWidth={3} />
                  {:else}
                    <Minus class="w-4 undefined text-gray-200 inline" strokeWidth={3} />
                  {/if}
                </td>
              {/each}

              <td
                class="py-3.5 px-3 text-center bg-indigo-50/60 border-t border-indigo-100
                       {i === 0 ? 'border-t-0 rounded-t-xl' : ''}
                       {i === rows.length - 1 ? 'rounded-b-xl' : ''}"
              >
                <Check class="w-5 undefined text-indigo-600 inline" strokeWidth={3} />
              </td>
            </tr>
          {/each}

          <!-- Coût : la ligne qui fait le travail de tout le tableau. -->
          <tr>
            <td class="pt-6 pr-4 text-sm font-black uppercase tracking-widest text-gray-900">
              {t.perMonth}
            </td>
            {#each columns as col (col.key)}
              <td class="pt-6 px-3 text-center text-sm font-black text-gray-500 tabular-nums">
                {costs[col.key]}
              </td>
            {/each}
            <td class="pt-6 px-3 text-center">
              <span class="text-lg font-black tracking-tighter text-indigo-600 tabular-nums">{t.fromPrice}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div use:reveal={{ direction: 'up', delay: 160 }} class="text-center mt-10">
      <button
        type="button"
        onclick={() => (toolOpen = !toolOpen)}
        aria-expanded={toolOpen}
        class="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
      >
        {toolOpen ? t.hideCurrentBots : t.showCurrentBots}
        <ChevronDown class="w-4 undefined transition-transform duration-300 {toolOpen ? 'rotate-180' : ''}" strokeWidth={3} />
      </button>
    </div>

    {#if toolOpen}
      <div transition:slide={{ duration: 300 }} class="max-w-5xl mx-auto mt-10">
        <div class="rounded-[2rem] border-2 border-gray-100 bg-gray-50/60 px-6 py-10 sm:px-12 sm:py-12">

          <div class="flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <h3 class="text-lg md:text-xl font-black tracking-tight text-gray-900 font-headline">
                {t.toolTitle}
              </h3>
              <p class="text-gray-500 font-bold text-sm mt-1.5">
                {t.toolIntro}
              </p>
            </div>
            {#if selectedOptions.length > 0}
              <button
                type="button"
                onclick={() => (selection = {})}
                class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X class="w-3.5 h-3.5" strokeWidth={3} />
                {t.clearAll} ({selectedOptions.length})
              </button>
            {/if}
          </div>

          <!-- Selecteur, une carte par categorie : neuf familles a plat
               donnent un mur de boutons ou l'oeil ne se raccroche a rien. -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {#each CATEGORIES as category (category.key)}
              <div class="rounded-2xl border border-gray-200/70 bg-white p-4">
                <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  {category.label}
                </p>
                <div class="flex flex-wrap gap-2">
                  {#each category.options as bot (bot.key)}
                    <button
                      type="button"
                      onclick={() => selectBot(category.key, bot.key)}
                      aria-pressed={selection[category.key] === bot.key}
                      class="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border-2 font-black text-xs transition-colors cursor-pointer
                             {selection[category.key] === bot.key
                               ? 'bg-gray-900 border-gray-900 text-white'
                               : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}"
                    >
                      <img
                        src={botIcon(bot)}
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                        decoding="async"
                        class="w-5 h-5 rounded-full object-cover shrink-0 {selection[category.key] === bot.key ? '' : 'opacity-80'}"
                      />
                      <span class="leading-none">{bot.name}</span>
                      {#if bot.free}
                        <span class="text-[10px] font-bold opacity-50 leading-none">{t.free}</span>
                      {/if}
                      {#if selection[category.key] === bot.key}
                        <Check class="w-3 h-3 shrink-0" strokeWidth={4} />
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>

          {#if selectedOptions.length === 0}
            <p class="text-center text-gray-400 font-bold text-sm py-6">
              {t.emptySelection}
            </p>
          {:else}
            <!-- Matrice : ce que couvrent les bots choisis, et ce que Kotbo ajoute. -->
            <div class="overflow-x-auto -mx-2 px-2">
              <table class="w-full min-w-[560px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th class="text-left align-bottom pb-3 pr-3 w-[36%]">
                      <span class="sr-only">{t.moduleCol}</span>
                    </th>
                    {#each selectedOptions as bot (bot.key)}
                      <th class="pb-3 px-2 align-bottom">
                        <img src={botIcon(bot)} alt="" width="24" height="24" loading="lazy" decoding="async" class="w-6 h-6 rounded-full object-cover mx-auto mb-1.5" />
                        <span class="block text-[10px] font-black uppercase tracking-wider text-gray-400 leading-tight">
                          {bot.name}
                        </span>
                      </th>
                    {/each}
                    <th class="pb-3 px-2 align-bottom">
                      <span class="block text-sm font-black tracking-tight text-indigo-600">{t.kotboCol}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {#each SHARED_FEATURES as feature, i (feature.key)}
                    <tr>
                      <td class="py-2.5 pr-3 text-sm font-bold text-gray-700 border-t border-gray-200/70 {i === 0 ? 'border-t-0' : ''}">
                        {feature.label}
                      </td>
                      {#each selectedOptions as bot (bot.key)}
                        <td class="py-2.5 px-2 text-center border-t border-gray-200/70 {i === 0 ? 'border-t-0' : ''}">
                          {#if bot.covers.includes(feature.key)}
                            <Check class="w-4 undefined text-gray-400 inline" strokeWidth={3} />
                          {:else}
                            <Minus class="w-4 undefined text-gray-200 inline" strokeWidth={3} />
                          {/if}
                        </td>
                      {/each}
                      <td class="py-2.5 px-2 text-center bg-indigo-50/60 border-t border-indigo-100 {i === 0 ? 'border-t-0 rounded-t-lg' : ''}">
                        <Check class="w-4 undefined text-indigo-600 inline" strokeWidth={3} />
                      </td>
                    </tr>
                  {/each}

                  <!-- Ce qu'aucun concurrent choisi ne couvre : le "+" du titre. -->
                  <tr>
                    <td colspan={selectedOptions.length + 2} class="pt-5 pb-2 pl-1">
                      <span class="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                        {t.exclusiveLabel}
                      </span>
                    </td>
                  </tr>
                  {#each EXCLUSIVE_FEATURES as feature (feature.key)}
                    <tr>
                      <td class="py-2.5 pr-3 text-sm font-bold text-gray-700 border-t border-gray-200/70">
                        {feature.label}
                      </td>
                      {#each selectedOptions as bot (bot.key)}
                        <td class="py-2.5 px-2 text-center border-t border-gray-200/70">
                          <Minus class="w-4 undefined text-gray-200 inline" strokeWidth={3} />
                        </td>
                      {/each}
                      <td class="py-2.5 px-2 text-center bg-indigo-50/60 border-t border-indigo-100">
                        <Check class="w-4 undefined text-indigo-600 inline" strokeWidth={3} />
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>

            <!-- Résultat -->
            <div class="flex flex-col items-center relative mt-10">
              <div class="hidden sm:block absolute left-1/2 -translate-x-[13rem] -top-2 -rotate-[8deg] pointer-events-none">
                <HandDrawnArrow direction="down-right" class="w-14 h-14 text-indigo-500" />
              </div>
              <PostIt color="yellow" rotation={-2} class="w-full max-w-sm">
                <p class="font-hand text-lg text-gray-800 leading-snug">
                  {t.payAbout} <span class="font-black">{formatEuro(selectedTotal)}</span>{t.perMonthShort}
                  {t.withKotbo} <span class="font-black">{formatEuro(kotboPrice)}</span>.
                </p>
                <p class="font-hand text-xl text-indigo-700 font-black mt-1 leading-snug">
                  → {formatEuro(monthlyGain)} {t.savedPerMonth}
                </p>
                {#if monthlyGain > 0}
                  <p class="font-hand text-sm text-gray-500 mt-1">{t.perYear} {formatEuro(yearlyGain)} {t.perYearSuffix}</p>
                {/if}
              </PostIt>
            </div>
          {/if}

          <p class="text-center text-xs text-gray-400 font-bold mt-8 max-w-lg mx-auto">
            {t.toolDisclaimer}
          </p>
        </div>
      </div>
    {/if}

    <div use:reveal={{ direction: 'up', delay: 200 }} class="text-center mt-14">
      <a
        href={inviteUrl}
        class="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-indigo-600 transition-colors shadow-lg"
      >
        {t.cta}
      </a>
    </div>
  </div>
</section>

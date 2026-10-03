/**
 * Tout le texte du film, en FR et en EN.
 *
 * Les noms de modules sont recopiés de `src/lib/components/Modules.svelte`
 * (eux-mêmes tirés de `MODULE_REGISTRY` du dépôt produit) : 51 modules, le
 * chiffre que la page affiche. Les outils MCP nommés existent dans
 * `apps/bot/src/api/mcp/tools` (331 outils enregistrés au 2026-10-02, d'où
 * « 300+ »). Les membres et chiffres des scènes sont ceux de la démo.
 */
export type Locale = 'fr' | 'en';

export interface Group {
  key: 'moderation' | 'staff' | 'community' | 'content' | 'integrations' | 'cross';
  label: string;
  modules: string[];
}

const GROUPS: Record<Locale, Group[]> = {
  fr: [
    {
      key: 'moderation',
      label: 'Modération & sécurité',
      modules: ['Sanctions', 'AutoMod', 'Logs Discord', 'Modération des pseudos', 'Doubles comptes', 'Protection anti-raid', 'Appels de bannissement', 'Code Police', 'Vérification de sécurité'],
    },
    {
      key: 'staff',
      label: 'Gestion du staff',
      modules: ['Recrutement', 'Annuaire staff', 'Hiérarchie & rôles staff', 'Tutorat & formation', 'Réunions', 'Absences', 'Sondages staff', 'Discipline staff', 'Évaluations'],
    },
    {
      key: 'community',
      label: 'Communauté & engagement',
      modules: ['Leveling & XP', 'Saisons', 'Prestige', 'Clans', 'Drops', 'Économie & RPG', 'Marché entre membres', 'Quêtes', 'Réputation', 'Salons fun', 'Daily Algo', 'Tickets support', 'Giveaways', 'Événements & quiz', 'Suggestions', 'Starlight'],
    },
    {
      key: 'content',
      label: 'Contenu & communication',
      modules: ['Règlement', 'Accueil & départ', 'Rôles par réaction', 'Auto-réponses', 'Auto-thread & salons', 'Actualités & RSS', 'Traduction automatique', 'Digest', 'Formulaires personnalisés'],
    },
    {
      key: 'integrations',
      label: 'Intégrations',
      modules: ['Analytics', 'YouTube', 'Twitch', 'Réseaux sociaux', 'Automatisations', 'Santé des salons'],
    },
    { key: 'cross', label: 'Cross-serveur', modules: ['Liens de salons', 'Serveur staff'] },
  ],
  en: [
    {
      key: 'moderation',
      label: 'Moderation & security',
      modules: ['Sanctions', 'AutoMod', 'Discord logs', 'Nickname moderation', 'Alt accounts', 'Anti-raid protection', 'Ban appeals', 'Police Code', 'Security verification'],
    },
    {
      key: 'staff',
      label: 'Staff management',
      modules: ['Recruitment', 'Staff directory', 'Staff hierarchy & roles', 'Mentoring & training', 'Meetings', 'Leave', 'Staff polls', 'Staff discipline', 'Reviews'],
    },
    {
      key: 'community',
      label: 'Community & engagement',
      modules: ['Leveling & XP', 'Seasons', 'Prestige', 'Clans', 'Drops', 'Economy & RPG', 'Member marketplace', 'Quests', 'Reputation', 'Fun channels', 'Daily Algo', 'Support tickets', 'Giveaways', 'Events & quizzes', 'Suggestions', 'Starlight'],
    },
    {
      key: 'content',
      label: 'Content & communication',
      modules: ['Rules', 'Welcome & leave', 'Reaction roles', 'Auto-responses', 'Auto-threads & channels', 'News & RSS', 'Automatic translation', 'Digest', 'Custom forms'],
    },
    {
      key: 'integrations',
      label: 'Integrations',
      modules: ['Analytics', 'YouTube', 'Twitch', 'Social media', 'Automations', 'Channel health'],
    },
    { key: 'cross', label: 'Cross-server', modules: ['Channel links', 'Staff server'] },
  ],
};

export const TEXT = {
  fr: {
    groups: GROUPS.fr,
    intro: { tagline: 'Ton serveur Discord, géré au même endroit.' },
    moderation: {
      title: 'Ça déraille ? Kotbo règle.',
      note: 'réglé avant que tu le voies',
      spam: 'nitro gratuit 👉 dlscord-gift.ru/claim',
      done: 'Liens supprimés, fr33-nitro exclu 10 minutes.',
      today: "Aujourd'hui à 21:04",
    },
    staff: {
      title: 'Ton staff, organisé.',
      note: 'qui fait quoi, enfin visible',
    },
    community: {
      title: 'Des membres qui reviennent.',
      note: 'ils reviennent pour ça',
      level: 'Niveau 5',
      xp: '+25 XP',
      coins: '+120',
    },
    content: {
      title: 'Le reste tourne tout seul.',
      note: 'logs, santé des salons, Pulse',
    },
    mcp: {
      kicker: 'Serveur MCP · 300+ outils',
      title: 'Et ton IA pilote le serveur.',
      sub: 'Claude, ChatGPT ou ton agent, avec des clés à permissions fines, révocables et journalisées.',
      agent: 'Agent IA',
      prompt: 'Fais le point de la semaine et avertis fr33-nitro pour spam.',
      answer: 'Semaine calme : 3 sanctions, 2 tickets ouverts. fr33-nitro a reçu un avertissement, motif : spam de liens.',
      done: 'fait',
      endpoint: 'Endpoint MCP, à coller dans ton client IA',
    },
    widgets: {
      title: 'Jusque sur le profil Discord.',
      note: 'en direct, sur chaque membre',
      rows: [
        ['Messages', '1 284'],
        ['Vocal', '36 h'],
        ['Niveau', '12'],
        ['Modération', 'Aucune sanction'],
      ],
      member: 'Membre depuis mars 2025',
    },
    finale: {
      count: '51 modules.',
      line: 'Un seul abonnement.',
      cta: 'Ajoute Kotbo à ton serveur',
    },
  },
  en: {
    groups: GROUPS.en,
    intro: { tagline: 'Your Discord server, run from one place.' },
    moderation: {
      title: 'Things go sideways? Kotbo sorts it.',
      note: 'sorted before you notice',
      spam: 'free nitro 👉 dlscord-gift.ru/claim',
      done: 'Links deleted, fr33-nitro timed out for 10 minutes.',
      today: 'Today at 9:04 PM',
    },
    staff: {
      title: 'Your staff, organised.',
      note: 'who does what, finally visible',
    },
    community: {
      title: 'Members who come back.',
      note: 'this is why they come back',
      level: 'Level 5',
      xp: '+25 XP',
      coins: '+120',
    },
    content: {
      title: 'The rest runs itself.',
      note: 'logs, channel health, Pulse',
    },
    mcp: {
      kicker: 'MCP server · 300+ tools',
      title: 'And your AI runs the server.',
      sub: 'Claude, ChatGPT or your own agent, with fine-grained keys you can revoke and audit.',
      agent: 'AI agent',
      prompt: 'Sum up the week and warn fr33-nitro for spam.',
      answer: 'Quiet week: 3 sanctions, 2 open tickets. fr33-nitro got a warning, reason: link spam.',
      done: 'done',
      endpoint: 'MCP endpoint, paste it into your AI client',
    },
    widgets: {
      title: 'All the way to the Discord profile.',
      note: 'live, on every member',
      rows: [
        ['Messages', '1,284'],
        ['Voice', '36 h'],
        ['Level', '12'],
        ['Moderation', 'No sanctions'],
      ],
      member: 'Member since March 2025',
    },
    finale: {
      count: '51 modules.',
      line: 'One subscription.',
      cta: 'Add Kotbo to your server',
    },
  },
} as const;

export type Text = (typeof TEXT)[Locale];

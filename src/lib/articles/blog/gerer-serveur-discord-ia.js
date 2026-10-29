/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'gerer-serveur-discord-ia', en: 'manage-discord-server-ai' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. Le serveur MCP n’a pas de clé de module : il vit dans Réglages. */
  modules: ['settings'],
  text: {
    fr: {
      title: 'Gérer son serveur Discord avec une IA (serveur MCP)',
      h1: 'Gérer ton serveur Discord avec une IA : Claude, ChatGPT ou Gemini branchés sur Kotbo',
      description:
        'Gérer son serveur Discord avec une IA : brancher Claude, ChatGPT ou Gemini sur le serveur MCP de Kotbo, choisir ce que l’IA peut faire et suivre chaque action.',
      lead: 'Pour qu’une IA gère ton serveur Discord, il lui faut un accès à tes données et le droit d’agir, et c’est le rôle d’un serveur MCP. Kotbo en a un : tu crées une clé dans le dashboard, tu colles une URL dans ton IA, et elle lit tes tickets, tes sanctions ou ton staff, puis agit dans les limites que tu as cochées',
      sections: [
        {
          h2: 'C’est quoi un serveur MCP Discord',
          body: 'MCP, pour Model Context Protocol, est un standard ouvert qui donne des outils à une IA : lire une liste, envoyer un message, changer un réglage. Le serveur MCP de Kotbo, encore en bêta, expose ton serveur Discord sous forme d’outils que Claude, ChatGPT ou Gemini appellent quand ta demande le demande. Ça n’a rien d’un bot Discord IA qui discute dans un salon : l’IA reste ton assistant, hors de Discord, et c’est toi qui lui parles',
        },
        {
          h2: 'Brancher Kotbo sur Claude, ChatGPT ou Gemini',
          body: 'Le branchement se fait depuis la page Connecter une IA du dashboard, réservée à ceux qui gèrent les réglages du serveur. Le bouton Aide de connexion détaille chaque IA',
          steps: [
            { title: 'Crée une clé', body: 'Nouvelle clé, un nom qui dit où elle sert (Claude.ai par exemple), puis les permissions. Le secret ne s’affiche qu’une fois : copie-le tout de suite' },
            { title: 'Sur Claude', body: 'Customize puis Connectors, le bouton + et Add custom connector. Colle l’URL MCP de Kotbo, ou l’URL directe Claude si l’autorisation bloque' },
            { title: 'Sur ChatGPT', body: 'Settings, Apps, Advanced settings, active le Developer mode, puis Create app avec un serveur MCP distant, l’URL de Kotbo et l’authentification OAuth' },
            { title: 'Sur Gemini', body: 'Côté API, ajoute un outil de type mcp_server avec l’URL de Kotbo, et un en-tête Authorization: Bearer suivi de ta clé si ton client ne gère pas OAuth' },
            { title: 'Autorise l’accès', body: 'Au premier appel, ton IA ouvre une page Kotbo qui demande ta clé. Tu cliques sur Autoriser l’accès, et l’IA voit ton serveur' },
          ],
        },
        {
          h2: 'Ce que tu peux demander à l’IA',
          body: 'Chaque demande passe par des outils précis, que l’IA choisit seule. Quelques exemples, avec le nom réel des outils',
          items: [
            { title: 'Traiter les tickets', body: 'get_tickets liste ceux en attente, reply_ticket répond dans le ticket au nom du bot, close_ticket le ferme' },
            { title: 'Sortir un rapport de sanctions', body: 'get_sanctions et get_sanction_history pour l’historique, apply_sanction pour sanctionner les comptes d’un raid' },
            { title: 'Suivre le staff', body: 'get_staff_list, get_staff_absences et get_staff_tasks pour voir qui est là et qui traîne, generate_staff_evaluation pour une évaluation' },
            { title: 'Lire la santé du serveur', body: 'get_pulse_dashboard renvoie la note de Pulse, get_hourly_activity les heures où ça parle' },
            { title: 'Régler le serveur', body: 'set_module_activation allume un module, create_channel et create_role montent la structure, create_announcement publie une annonce' },
            { title: 'Écrire le site du serveur', body: 'create_site_page et publish_site_page écrivent et publient une page. Pendant que l’IA écrit, l’édition humaine passe en lecture seule, et tu peux l’interrompre depuis le dashboard' },
          ],
        },
        {
          h2: 'Les permissions de chaque clé',
          body: 'Une clé ne fait que ce que tu as coché à sa création. Sans la permission, l’outil refuse',
          points: [
            'En lecture : stats, membres et messages, sanctions, staff, tickets, communauté, économie, modération, analytics, automatisations, site',
            'En écriture : sanctionner, gérer les messages, les tickets, la communauté, les membres, les automatisations et le site',
            'Les automatisations méritent une clé de confiance : une fois active, une automatisation agit seule, y compris pour sanctionner',
            'Une clé agit au nom du compte qui l’a créée : si ce compte perd l’accès au dashboard du serveur, elle cesse de marcher',
            'Révoquer une clé coupe l’accès de l’IA sur-le-champ',
          ],
        },
        {
          h2: 'Le journal : qui a fait quoi',
          body: 'Une IA qui agit sans trace serait un modo fantôme. Chaque action passée par le serveur MCP est notée dans la page Actions du staff du dashboard, sous le nom MCP[nom de la clé]. Une sanction posée par l’IA porte ce même nom comme modérateur dans le casier du membre. Le bouton Connexions de la page Connecter une IA montre en plus les dernières tentatives de branchement, utiles quand une IA n’arrive pas à se connecter',
        },
        {
          h2: 'Bot Discord IA ou serveur MCP',
          body: 'Les deux répondent à des besoins différents, et la recherche « bot discord ia » mélange souvent les deux',
          items: [
            { title: 'Un bot IA dans le serveur', body: 'Il discute avec les membres dans un salon. Pratique pour l’animation, sans accès à ta gestion' },
            { title: 'Un serveur MCP', body: 'Il donne à ton IA les outils de ton dashboard. Pratique pour le staff : une question en français, et l’IA lit, croise et agit à ta place, dans les droits de sa clé' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment gérer son serveur Discord avec une IA ?',
          a: 'Branche ton IA sur un serveur MCP qui connaît ton serveur. Avec Kotbo : crée une clé dans Connecter une IA, colle l’URL dans Claude, ChatGPT ou Gemini, et autorise l’accès',
        },
        {
          q: 'Quelle IA marche avec le serveur MCP de Kotbo ?',
          a: 'Claude par un connecteur personnalisé, ChatGPT par une app en mode développeur, Gemini par un outil mcp_server côté API. Tout client MCP qui envoie un jeton Bearer marche aussi',
        },
        {
          q: 'Est-ce que l’IA peut bannir quelqu’un sans moi ?',
          a: 'Seulement si sa clé a la permission Sanctionner. Sans elle, l’outil apply_sanction refuse, et chaque sanction posée par l’IA est signée MCP suivi du nom de la clé',
        },
        {
          q: 'Qu’est-ce que l’IA voit de mon serveur ?',
          a: 'Ce que renvoient les outils de lecture que sa clé autorise, au moment où elle les appelle. Ces réponses partent chez le fournisseur de ton IA, comme le reste de ta conversation',
        },
        {
          q: 'Comment couper l’accès d’une IA à mon serveur Discord ?',
          a: 'Révoque sa clé sur la page Connecter une IA. L’accès s’arrête tout de suite, y compris l’URL directe générée pour Claude',
        },
        {
          q: 'C’est quoi un serveur MCP pour Discord ?',
          a: 'Un service qui expose les actions d’un serveur Discord à une IA, sous forme d’outils qu’elle appelle avec ta permission. Celui de Kotbo couvre les tickets, les sanctions, le staff, les réglages et le site',
        },
      ],
    },
    en: {
      title: 'Manage your Discord server with AI (MCP server)',
      h1: 'Manage your Discord server with AI: plug Claude, ChatGPT or Gemini into Kotbo',
      description:
        'Manage your Discord server with AI: connect Claude, ChatGPT or Gemini to Kotbo’s MCP server, choose what the AI is allowed to do and review every action.',
      lead: 'For an AI to manage your Discord server, it needs access to your data and the right to act, which is what an MCP server provides. Kotbo has one: you create a key in the dashboard, paste a URL into your AI, and it reads your tickets, sanctions or staff, then acts within the limits you ticked',
      sections: [
        {
          h2: 'What a Discord MCP server is',
          body: 'MCP, the Model Context Protocol, is an open standard that hands tools to an AI: read a list, send a message, change a setting. Kotbo’s MCP server, still in beta, exposes your Discord server as tools that Claude, ChatGPT or Gemini call when your request needs them. It has nothing to do with an AI chatbot in a channel: the AI stays your assistant, outside Discord, and you’re the one talking to it',
        },
        {
          h2: 'Connecting Kotbo to Claude, ChatGPT or Gemini',
          body: 'Setup happens on the dashboard’s Connect an AI page, which only people who manage the server’s settings can open. The Connection Help button walks through each AI',
          steps: [
            { title: 'Create a key', body: 'New key, a name that says where it’s used (Claude.ai for instance), then the permissions. The secret is shown once: copy it right away' },
            { title: 'In Claude', body: 'Customize, then Connectors, the + button and Add custom connector. Paste Kotbo’s MCP URL, or the Claude direct URL if authorisation gets stuck' },
            { title: 'In ChatGPT', body: 'Settings, Apps, Advanced settings, turn on Developer mode, then Create app with a remote MCP server, Kotbo’s URL and OAuth authentication' },
            { title: 'In Gemini', body: 'On the API side, add a tool of type mcp_server with Kotbo’s URL, plus an Authorization: Bearer header with your key if your client doesn’t handle OAuth' },
            { title: 'Allow access', body: 'On the first call, your AI opens a Kotbo page asking for your key. Click Allow access, and the AI can see your server' },
          ],
        },
        {
          h2: 'What you can ask the AI to do',
          body: 'Each request goes through specific tools, which the AI picks on its own. A few examples, with the real tool names',
          items: [
            { title: 'Handle tickets', body: 'get_tickets lists the pending ones, reply_ticket answers in the ticket as the bot, close_ticket closes it' },
            { title: 'Pull a sanctions report', body: 'get_sanctions and get_sanction_history for the record, apply_sanction to sanction the accounts behind a raid' },
            { title: 'Keep track of staff', body: 'get_staff_list, get_staff_absences and get_staff_tasks to see who’s around and who’s lagging, generate_staff_evaluation for a review' },
            { title: 'Read server health', body: 'get_pulse_dashboard returns the Pulse score, get_hourly_activity the hours when people talk' },
            { title: 'Configure the server', body: 'set_module_activation turns a module on, create_channel and create_role build the structure, create_announcement posts an announcement' },
            { title: 'Write the server’s website', body: 'create_site_page and publish_site_page write and publish a page. While the AI writes, human editing goes read-only, and you can interrupt it from the dashboard' },
          ],
        },
        {
          h2: 'Permissions for each key',
          body: 'A key only does what you ticked when you created it. Without the permission, the tool refuses',
          points: [
            'Read: stats, members and messages, sanctions, staff, tickets, community, economy, moderation, analytics, automations, site',
            'Write: sanction, manage messages, tickets, community, members, automations and the site',
            'Automations deserve a trusted key: once active, an automation acts on its own, sanctions included',
            'A key acts on behalf of the account that created it: if that account loses access to the server’s dashboard, the key stops working',
            'Revoking a key cuts the AI off immediately',
          ],
        },
        {
          h2: 'The log: who did what',
          body: 'An AI acting without a trace would be a ghost moderator. Every action that goes through the MCP server is logged on the dashboard’s Staff actions page, under the name MCP[key name]. A sanction issued by the AI carries that same name as moderator in the member’s record. The Connections button on the Connect an AI page also shows recent connection attempts, useful when an AI can’t connect',
        },
        {
          h2: 'AI Discord bot or MCP server',
          body: 'They answer different needs, and searches for an AI Discord bot often mix the two up',
          items: [
            { title: 'An AI bot in the server', body: 'It chats with members in a channel. Handy for entertainment, with no access to how you run things' },
            { title: 'An MCP server', body: 'It gives your AI the tools of your dashboard. Handy for staff: ask a question in plain English, and the AI reads, cross-checks and acts for you, within its key’s rights' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I manage a Discord server with AI?',
          a: 'Connect your AI to an MCP server that knows your server. With Kotbo: create a key on Connect an AI, paste the URL into Claude, ChatGPT or Gemini, and allow access',
        },
        {
          q: 'Which AI works with Kotbo’s MCP server?',
          a: 'Claude through a custom connector, ChatGPT through a developer-mode app, Gemini through an mcp_server tool on the API. Any MCP client that sends a Bearer token works too',
        },
        {
          q: 'Can the AI ban someone without me?',
          a: 'Only if its key has the Sanction permission. Without it, apply_sanction refuses, and every sanction issued by the AI is signed MCP followed by the key name',
        },
        {
          q: 'What does the AI see of my server?',
          a: 'Whatever the read tools its key allows return, when it calls them. Those results go to your AI provider, like the rest of your conversation',
        },
        {
          q: 'How do I cut an AI’s access to my Discord server?',
          a: 'Revoke its key on the Connect an AI page. Access stops right away, including the direct URL generated for Claude',
        },
        {
          q: 'What is a Discord MCP server?',
          a: 'A service that exposes a Discord server’s actions to an AI, as tools it calls with your permission. Kotbo’s covers tickets, sanctions, staff, settings and the website',
        },
      ],
    },
  },
};

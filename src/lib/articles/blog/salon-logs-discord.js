/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'salon-logs-discord', en: 'discord-logs-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['logs'],
  text: {
    fr: {
      title: 'Salon de logs Discord : tout journaliser avec un bot',
      h1: 'Salon de logs Discord : garder une trace de ce qui se passe sur ton serveur',
      description:
        'Salon de logs Discord : comment journaliser les messages supprimés ou modifiés, les arrivées, les bans, les vocaux et les rôles, et choisir un salon par événement avec Kotbo.',
      lead: 'Un salon de logs est un salon réservé au staff où un bot note tout ce qui se passe : un message supprimé, un membre banni, un rôle retiré, une connexion vocale. Discord garde un journal d’audit, mais il est court et incomplet. Dans Kotbo, la page Journaux du dashboard te laisse choisir quels événements sont publiés et dans quel salon, et garde l’historique consultable',
      sections: [
        {
          h2: 'À quoi sert un salon de logs',
          body: 'Quand un litige éclate, la question est toujours la même : qu’est-ce qui s’est vraiment passé ?',
          points: [
            'Retrouver ce que disait un message avant qu’il soit supprimé ou modifié',
            'Savoir qui a banni, expulsé ou exclu un membre, et quand',
            'Repérer une suppression en masse ou un changement de rôles suspect',
            'Donner aux modos un historique commun, sans dépendre de la mémoire de chacun',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord a un journal d’audit dans les réglages du serveur. Il couvre les actions des modérateurs, mais pas le contenu des messages supprimés ou modifiés, ni les connexions vocales, et il ne garde que peu de temps. Pour un vrai journal, il faut un bot qui écoute les événements et les publie',
        },
        {
          h2: 'Configurer les journaux avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Journaux. Prévois un salon privé, visible du seul staff',
          steps: [
            { title: 'Crée un salon réservé au staff', body: 'Un #logs ou un salon par thème (#logs-modération, #logs-messages). Personne d’autre ne doit pouvoir le lire' },
            { title: 'Choisis le salon par défaut', body: 'Kotbo y publie tout ce qui n’a pas de salon à part' },
            { title: 'Coche les événements à publier', body: 'Arrivée et départ de membre, messages supprimés ou modifiés, bannissements, expulsions, exclusions temporaires, rôles, salons, vocaux… Le compteur indique combien sont actifs' },
            { title: 'Dirige certains événements ailleurs', body: 'Chaque événement peut avoir son propre salon, pour séparer la modération du reste' },
            { title: 'Ignore les salons bruyants', body: 'Les messages et le vocal des salons ignorés, et de leurs fils, ne sont pas enregistrés' },
          ],
        },
        {
          h2: 'Les événements que Kotbo peut journaliser',
          body: 'Ils sont rangés en catégories, que tu peux activer une par une',
          items: [
            { title: 'Membres', body: 'Arrivées, départs, bannissements, débannissements, expulsions, exclusions temporaires, et rôles reçus ou perdus' },
            { title: 'Messages', body: 'Messages supprimés, messages modifiés, et suppressions en masse quand un modérateur purge plusieurs messages' },
            { title: 'Vocaux', body: 'Connexion, déconnexion, changement de salon, et chaque action faite depuis le panneau d’un salon vocal temporaire' },
            { title: 'Salons et rôles', body: 'Création, modification et suppression de salons et de rôles' },
            { title: 'Modération', body: 'Les sanctions prononcées par ton équipe, rattachées au casier du membre' },
          ],
        },
        {
          h2: 'Consulter l’historique dans le dashboard',
          body: 'Les journaux ne vivent pas que dans Discord. La page Journaux liste les événements avec l’heure, l’auteur, le salon, la catégorie et le détail, et une barre de recherche retrouve une action, un module ou un membre. Depuis un événement, tu peux ouvrir le casier du membre concerné',
        },
        {
          h2: 'Respecter la vie privée de tes membres',
          body: 'Journaliser les messages veut dire stocker des conversations. Garde-le en tête',
          points: [
            'Limite l’accès au salon de logs aux modérateurs qui en ont besoin',
            'Ignore les salons où l’on partage des informations sensibles',
            'Dis dans ton règlement que les actions et les messages supprimés sont journalisés',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un salon de logs sur Discord ?',
          a: 'Crée un salon privé pour le staff, puis ouvre la page Journaux du dashboard Kotbo, choisis-le comme salon par défaut et coche les événements à publier',
        },
        {
          q: 'Quel bot de logs Discord choisir ?',
          a: 'Plusieurs bots journalisent les événements. Celui de Kotbo choisit les événements et le salon de chacun, ignore les salons de ton choix, et garde l’historique consultable dans le dashboard',
        },
        {
          q: 'Peut-on voir un message supprimé sur Discord ?',
          a: 'Pas avec Discord seul. Avec le journal des messages supprimés de Kotbo, le contenu du message est publié dans le salon de logs',
        },
        {
          q: 'Peut-on envoyer chaque type de log dans un salon différent ?',
          a: 'Oui. Chaque événement peut avoir son salon, et ceux qui n’en ont pas vont dans le salon par défaut',
        },
        {
          q: 'Peut-on ne pas journaliser certains salons ?',
          a: 'Oui. Les messages et le vocal des salons ignorés ne sont pas enregistrés, fils compris',
        },
        {
          q: 'Les logs de Kotbo remplacent-ils le journal d’audit de Discord ?',
          a: 'Ils le complètent. Le journal d’audit de Discord reste utile, mais Kotbo ajoute le contenu des messages, le vocal et un historique que tu consultes et fouilles dans le dashboard',
        },
      ],
    },
    en: {
      title: 'Discord logs channel: log everything with a bot',
      h1: 'Discord logs channel: keep a record of what happens on your server',
      description:
        'Discord logs channel: how to log deleted or edited messages, joins, bans, voice activity and role changes, and pick one channel per event with Kotbo.',
      lead: 'A logs channel is a staff-only channel where a bot records everything that happens: a deleted message, a banned member, a removed role, a voice connection. Discord keeps an audit log, but it’s short and incomplete. In Kotbo, the Logs page of the dashboard lets you choose which events are posted and in which channel, and keeps the history searchable',
      sections: [
        {
          h2: 'What a logs channel is for',
          body: 'When a dispute breaks out, the question is always the same: what really happened?',
          points: [
            'Find what a message said before it was deleted or edited',
            'Know who banned, kicked or timed out a member, and when',
            'Spot a mass deletion or a suspicious role change',
            'Give mods a shared history, without relying on everyone’s memory',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord has an audit log in the server settings. It covers moderator actions, but not the content of deleted or edited messages, nor voice connections, and it only keeps a short history. For a real log you need a bot that listens to events and posts them',
        },
        {
          h2: 'Setting up logs with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Logs page. Plan a private channel, visible to staff only',
          steps: [
            { title: 'Create a staff-only channel', body: 'A #logs, or one channel per theme (#mod-logs, #message-logs). Nobody else should be able to read it' },
            { title: 'Choose the default channel', body: 'Kotbo posts there everything that has no channel of its own' },
            { title: 'Tick the events to post', body: 'Member joins and leaves, deleted or edited messages, bans, kicks, timeouts, roles, channels, voice… The counter shows how many are active' },
            { title: 'Send some events elsewhere', body: 'Each event can have its own channel, to keep moderation apart from the rest' },
            { title: 'Ignore noisy channels', body: 'Messages and voice in ignored channels, and their threads, are not recorded' },
          ],
        },
        {
          h2: 'The events Kotbo can log',
          body: 'They’re grouped into categories you can turn on one by one',
          items: [
            { title: 'Members', body: 'Joins, leaves, bans, unbans, kicks, timeouts, and roles gained or lost' },
            { title: 'Messages', body: 'Deleted messages, edited messages, and bulk deletions when a moderator purges several messages' },
            { title: 'Voice', body: 'Connecting, disconnecting, switching channel, and every action taken from a temporary voice channel’s panel' },
            { title: 'Channels and roles', body: 'Creating, editing and deleting channels and roles' },
            { title: 'Moderation', body: 'Sanctions issued by your team, linked to the member’s record' },
          ],
        },
        {
          h2: 'Browsing the history in the dashboard',
          body: 'Logs don’t only live in Discord. The Logs page lists events with the time, author, channel, category and details, and a search bar finds an action, a module or a member. From an event you can open the concerned member’s record',
        },
        {
          h2: 'Respecting your members’ privacy',
          body: 'Logging messages means storing conversations. Keep that in mind',
          points: [
            'Limit access to the logs channel to the mods who need it',
            'Ignore channels where sensitive information is shared',
            'State in your rules that actions and deleted messages are logged',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a logs channel on Discord?',
          a: 'Create a private channel for staff, then open the Logs page of the Kotbo dashboard, pick it as the default channel and tick the events to post',
        },
        {
          q: 'Which Discord logging bot should I use?',
          a: 'Several bots log events. Kotbo’s lets you choose the events and the channel for each, ignores the channels you pick, and keeps the history searchable in the dashboard',
        },
        {
          q: 'Can I see a deleted message on Discord?',
          a: 'Not with Discord alone. With Kotbo’s deleted-message log, the message content is posted in the logs channel',
        },
        {
          q: 'Can each type of log go to a different channel?',
          a: 'Yes. Each event can have its own channel, and those without one go to the default channel',
        },
        {
          q: 'Can I skip logging some channels?',
          a: 'Yes. Messages and voice in ignored channels are not recorded, threads included',
        },
        {
          q: 'Do Kotbo’s logs replace Discord’s audit log?',
          a: 'They complement it. Discord’s audit log is still useful, but Kotbo adds message content, voice activity and a history you can browse and search in the dashboard',
        },
      ],
    },
  },
};

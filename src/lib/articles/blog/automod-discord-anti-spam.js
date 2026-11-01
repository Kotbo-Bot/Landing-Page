/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'automod-discord-anti-spam', en: 'discord-automod-anti-spam' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['automod'],
  text: {
    fr: {
      title: 'AutoMod Discord : bloquer le spam, les insultes et les liens',
      h1: 'AutoMod Discord : filtrer spam, insultes, liens et mentions',
      description:
        'AutoMod Discord : comment bloquer automatiquement le spam, les insultes, les invitations, les liens, les majuscules et les mentions de masse avec Kotbo, sanction par sanction.',
      lead: 'Un AutoMod surveille chaque message à la place de ton staff : il supprime le spam, les insultes, les liens douteux et les mentions de masse avant que quelqu’un les lise. Discord a quelques filtres natifs, mais limités. Dans Kotbo, la page Filtres du dashboard regroupe tous les réglages, et chaque filtre a sa propre sanction',
      sections: [
        {
          h2: 'À quoi sert un AutoMod sur Discord',
          body: 'Un modo ne peut pas lire tous les messages de tous les salons, surtout la nuit. L’AutoMod comble les trous',
          points: [
            'Le spam et les mentions de masse sont supprimés en quelques secondes, avant de saturer un salon',
            'Les insultes et les liens indésirables ne restent pas affichés',
            'Les sanctions sont les mêmes pour tout le monde, sans humeur ni favoritisme',
            'Le staff garde du temps pour les cas qui demandent du jugement',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord a sa propre modération automatique : une liste de mots bloqués, un filtre de spam et de mentions. Kotbo s’appuie sur ces filtres quand ils existent, et les affiche dans la même page. Mais ils restent limités : ils ne couvrent ni les majuscules, ni les invitations avec une liste de codes autorisés, ni les mentions fantômes, et ne censurent pas seulement le passage fautif',
        },
        {
          h2: 'Configurer les filtres avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Filtres, dans la section Protection. Active les filtres un par un, en commençant par ceux dont tu as vraiment besoin',
          steps: [
            { title: 'Choisis tes filtres', body: 'Anti-spam, mots interdits, insultes, liens, invitations, majuscules, émojis, mentions, @everyone. Un filtre éteint ne coûte rien' },
            { title: 'Fixe la sanction de chacun', body: 'Alerter seulement dans les journaux, supprimer sans prévenir, supprimer et avertir, avertir, ou supprimer et exclure temporairement 10 minutes' },
            { title: 'Règle les seuils', body: 'Par exemple, combien de messages en combien de secondes pour l’anti-spam, ou le pourcentage de majuscules et la longueur minimale du message' },
            { title: 'Ajoute les exceptions', body: 'Des salons et des rôles ignorés par tous les filtres, pour ne pas bloquer ton propre staff ni un salon de partage de liens' },
            { title: 'Surveille les journaux', body: 'Passe quelques jours en mode alerte seulement pour voir ce qui serait bloqué, puis durcis les sanctions' },
          ],
        },
        {
          h2: 'Les filtres un par un',
          body: 'Chaque filtre répond à un cas précis',
          items: [
            { title: 'Anti-spam', body: 'Un nombre maximum de messages sur un intervalle en secondes. Si trois membres spamment dans le même salon en 15 secondes, le salon passe en mode lent au lieu de sanctionner chacun' },
            { title: 'Mots interdits', body: 'Ta propre liste, un mot ou une expression par ligne, 1000 au maximum. L’étoile remplace « n’importe quoi » : *spam* bloque aussi « antispam ». Une liste d’exceptions autorise des mots malgré tout' },
            { title: 'Insultes et contenus choquants', body: 'S’appuie sur les listes de Discord, par catégorie : insultes et grossièretés, contenu sexuel, propos haineux' },
            { title: 'Liens et invitations', body: 'Les liens avec une liste de sites autorisés, et les invitations vers d’autres serveurs, avec la liste des codes d’invitation permis, comme ton propre serveur' },
            { title: 'Majuscules, émojis, mentions', body: 'Un pourcentage de majuscules à partir d’une longueur minimale, et un maximum d’émojis ou de mentions par message. À zéro, la limite est désactivée' },
            { title: '@everyone et @here', body: 'Supprimés quand le membre n’a pas le droit de les utiliser, avec ou sans avertissement, ou une exclusion de 10 minutes' },
            { title: 'Mentions fantômes', body: 'Prévient quand quelqu’un mentionne un membre puis efface vite son message. Kotbo ne repère que les messages envoyés depuis son dernier redémarrage' },
          ],
        },
        {
          h2: 'Censurer sans tout supprimer',
          body: 'Pour les mots interdits, une action permet de masquer seulement le passage fautif et de garder le reste du message. Kotbo republie alors le message sous le nom du membre, avec le passage masqué. Il lui faut la permission « Gérer les webhooks »',
        },
        {
          h2: 'Protéger les droits d’administrateur',
          body: 'Trois réglages de la même page couvrent un risque différent : celui d’un compte de confiance piraté ou d’un admin qui dérape',
          items: [
            { title: 'Validation des admins', body: 'Personne ne reçoit les droits d’administrateur sans accord. Si quelqu’un les donne directement dans Discord, Kotbo annule le changement. Place le rôle de Kotbo au-dessus des rôles administrateur, sinon il ne pourra pas l’annuler' },
            { title: 'Ajout de bots', body: 'Seul le propriétaire du serveur peut ajouter des bots. Un bot ajouté par quelqu’un d’autre est expulsé ou banni, et la personne reçoit un message privé qui l’explique' },
            { title: 'Retrait d’urgence', body: 'Retire les droits d’administrateur à quelqu’un qui enchaîne les suppressions ou les bannissements en peu de temps' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment bloquer le spam sur Discord ?',
          a: 'Avec Kotbo, ouvre la page Filtres, active l’anti-spam et fixe le nombre de messages maximum sur un intervalle en secondes, puis choisis la sanction. En cas de spam à plusieurs, le salon passe en mode lent',
        },
        {
          q: 'Quel est le meilleur bot AutoMod pour Discord ?',
          a: 'Plusieurs bots proposent un AutoMod. Celui de Kotbo choisit une sanction par filtre, peut censurer seulement le passage fautif, et vit dans le même dashboard que les sanctions et les journaux',
        },
        {
          q: 'Peut-on interdire des mots sur Discord ?',
          a: 'Oui. Écris ta liste de mots ou d’expressions, un par ligne, jusqu’à 1000. L’étoile sert de joker, et une liste d’exceptions autorise des mots malgré tout',
        },
        {
          q: 'Comment bloquer les invitations vers d’autres serveurs ?',
          a: 'Active le filtre d’invitations. Tu peux autoriser des codes précis, comme celui de ton propre serveur, ou ceux de tes partenaires',
        },
        {
          q: 'Le staff est-il filtré aussi ?',
          a: 'Seulement si tu le veux. Tu choisis des salons et des rôles ignorés par les filtres, ce qui permet d’exempter ton équipe',
        },
        {
          q: 'Peut-on tester sans punir personne ?',
          a: 'Oui. Choisis « Alerter seulement » : le message est signalé dans les journaux sans être supprimé. Quand les seuils te conviennent, passe à une vraie sanction',
        },
      ],
    },
    en: {
      title: 'Discord AutoMod: block spam, insults and links',
      h1: 'Discord AutoMod: filter spam, insults, links and mentions',
      description:
        'Discord AutoMod: how to automatically block spam, insults, invites, links, caps and mass mentions with Kotbo, with a separate punishment for each filter.',
      lead: 'An AutoMod watches every message in place of your staff: it removes spam, insults, shady links and mass mentions before anyone reads them. Discord has a few native filters, but limited ones. In Kotbo the Filters page of the dashboard gathers every setting, and each filter has its own punishment',
      sections: [
        {
          h2: 'What an AutoMod is for on Discord',
          body: 'A mod can’t read every message in every channel, especially at night. The AutoMod fills the gaps',
          points: [
            'Spam and mass mentions are removed within seconds, before they flood a channel',
            'Insults and unwanted links don’t stay on screen',
            'Punishments are the same for everyone, with no mood or favoritism',
            'Staff keep their time for cases that need judgment',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord has its own automatic moderation: a blocked-word list, a spam and mention filter. Kotbo builds on those filters where they exist and shows them on the same page. But they stay limited: they don’t cover caps, invites with an allowed-code list or ghost pings, and they don’t censor only the offending part',
        },
        {
          h2: 'Setting up filters with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Filters page, under Protection. Turn filters on one by one, starting with the ones you really need',
          steps: [
            { title: 'Pick your filters', body: 'Anti-spam, banned words, insults, links, invites, caps, emojis, mentions, @everyone. A filter that’s off costs nothing' },
            { title: 'Set each one’s punishment', body: 'Alert only in the logs, delete silently, delete and warn, warn, or delete and time out for 10 minutes' },
            { title: 'Tune the thresholds', body: 'For example how many messages in how many seconds for anti-spam, or the caps percentage and the minimum message length' },
            { title: 'Add exceptions', body: 'Channels and roles ignored by every filter, so you don’t block your own staff or a link-sharing channel' },
            { title: 'Watch the logs', body: 'Spend a few days in alert-only mode to see what would be blocked, then tighten the punishments' },
          ],
        },
        {
          h2: 'The filters one by one',
          body: 'Each filter answers one specific case',
          items: [
            { title: 'Anti-spam', body: 'A maximum number of messages over an interval in seconds. If three members spam the same channel within 15 seconds, the channel switches to slowmode instead of punishing each one' },
            { title: 'Banned words', body: 'Your own list, one word or phrase per line, 1000 at most. The star stands for “anything”: *spam* also blocks “antispam”. An exceptions list allows words anyway' },
            { title: 'Insults and shocking content', body: 'Uses Discord’s lists, by category: insults and profanity, sexual content, hate speech' },
            { title: 'Links and invites', body: 'Links with an allowed-sites list, and invites to other servers, with the list of permitted invite codes, such as your own server’s' },
            { title: 'Caps, emojis, mentions', body: 'A caps percentage above a minimum length, and a maximum number of emojis or mentions per message. At zero, the limit is off' },
            { title: '@everyone and @here', body: 'Removed when the member isn’t allowed to use them, with or without a warning, or a 10-minute timeout' },
            { title: 'Ghost pings', body: 'Warns when someone mentions a member then quickly deletes the message. Kotbo only catches messages sent since its last restart' },
          ],
        },
        {
          h2: 'Censoring without deleting everything',
          body: 'For banned words, one action masks only the offending part and keeps the rest of the message. Kotbo then reposts the message under the member’s name with the part hidden. It needs the “Manage webhooks” permission',
        },
        {
          h2: 'Protecting administrator rights',
          body: 'Three settings on the same page cover a different risk: a trusted account getting hijacked, or an admin going off the rails',
          items: [
            { title: 'Admin approval', body: 'Nobody gets administrator rights without approval. If someone grants them directly in Discord, Kotbo reverts the change. Place Kotbo’s role above the administrator roles, or it can’t revert it' },
            { title: 'Adding bots', body: 'Only the server owner can add bots. A bot added by anyone else is kicked or banned, and the person gets a DM explaining why' },
            { title: 'Emergency removal', body: 'Strips administrator rights from someone who chains deletions or bans in a short time' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I block spam on Discord?',
          a: 'With Kotbo, open the Filters page, turn on anti-spam and set the maximum number of messages over an interval in seconds, then pick the punishment. When several members spam at once, the channel goes into slowmode',
        },
        {
          q: 'What is the best AutoMod bot for Discord?',
          a: 'Several bots offer an AutoMod. Kotbo’s picks a punishment per filter, can censor only the offending part, and lives in the same dashboard as sanctions and logs',
        },
        {
          q: 'Can I ban words on Discord?',
          a: 'Yes. Write your list of words or phrases, one per line, up to 1000. The star works as a wildcard, and an exceptions list allows words anyway',
        },
        {
          q: 'How do I block invites to other servers?',
          a: 'Turn on the invite filter. You can allow specific codes, such as your own server’s, or your partners’',
        },
        {
          q: 'Is staff filtered too?',
          a: 'Only if you want. You pick channels and roles ignored by the filters, which lets you exempt your team',
        },
        {
          q: 'Can I test without punishing anyone?',
          a: 'Yes. Choose “Alert only”: the message is flagged in the logs without being deleted. When the thresholds suit you, switch to a real punishment',
        },
      ],
    },
  },
};

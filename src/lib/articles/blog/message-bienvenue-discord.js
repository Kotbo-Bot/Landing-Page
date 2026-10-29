/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'message-bienvenue-discord', en: 'discord-welcome-message' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['welcome_goodbye'],
  text: {
    fr: {
      title: 'Message de bienvenue Discord : le guide complet',
      h1: 'Comment faire un message de bienvenue sur Discord, avec ou sans bot',
      description:
        'Message de bienvenue Discord : ce que Discord fait tout seul, puis un bot de bienvenue avec variables, carte d’avatar, rôle automatique et message de départ.',
      lead: 'Pour un message de bienvenue sur Discord, tu as deux options : le message système de Discord, gratuit mais impossible à personnaliser, ou un bot de bienvenue qui écrit ton propre texte dans le salon de ton choix. Ce guide montre les deux, puis comment Kotbo s’en charge : texte avec variables, carte d’avatar, rôle donné à l’arrivée et message de départ',
      sections: [
        {
          h2: 'Ce que Discord fait sans bot',
          body: 'Dans les paramètres du serveur, onglet Vue d’ensemble, tu choisis un salon des messages système et tu coches l’envoi d’un message aléatoire quand quelqu’un rejoint. Ça dépanne, mais tu ne choisis ni le texte ni la mise en forme',
          points: [
            'Le texte est tiré au hasard dans une liste écrite par Discord',
            'Pas de message de départ quand un membre quitte le serveur',
            'Aucun rôle donné à l’arrivée : il faut passer par l’Onboarding de Discord ou par un bot',
            'Sur un serveur Communauté, l’Onboarding et le guide du serveur présentent tes salons, mais ils ne postent rien dans un salon',
          ],
        },
        {
          h2: 'Configurer un bot de bienvenue Discord avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Bienvenue et départs. Il n’y a pas de commande à taper, l’aperçu du rendu Discord se met à jour pendant que tu écris',
          steps: [
            { title: 'Ouvre l’onglet Accueil', body: 'Active le message de bienvenue et choisis le salon de diffusion, souvent #bienvenue ou #arrivées' },
            { title: 'Écris ton texte', body: 'Pars d’un modèle ou de zéro, et glisse les variables comme {user} pour mentionner l’arrivant ou {memberCount} pour le nombre de membres' },
            { title: 'Ajoute la carte si tu veux', body: 'Coche l’image de bienvenue : Kotbo génère une bannière avec l’avatar du membre, son pseudo et son numéro d’arrivée sur le serveur' },
            { title: 'Donne un rôle à l’arrivée', body: 'Dans l’onglet Rôles automatiques, choisis le rôle attribué à tout nouveau membre. Place le rôle de Kotbo au-dessus dans la liste des rôles, sinon Discord refuse' },
            { title: 'Règle le départ et les boosts', body: 'Les onglets Départs et Boosts marchent pareil : un salon, un texte, et pour les boosts une carte de remerciement en option' },
          ],
        },
        {
          h2: 'Les variables du message de bienvenue',
          body: 'Chaque balise est remplacée au moment de l’envoi. Elles existent en anglais et en français, {user} et {utilisateur} donnent le même résultat',
          items: [
            { title: '{user}', body: 'Mentionne le nouveau membre, qui reçoit la notification' },
            { title: '{username}', body: 'Le nom du compte Discord, sans mention' },
            { title: '{displayName}', body: 'Le pseudo affiché sur ton serveur' },
            { title: '{server}', body: 'Le nom du serveur' },
            { title: '{memberCount}', body: 'Le nombre total de membres, pratique pour un « tu es notre 500e membre »' },
            { title: '{boostCount}', body: 'Le nombre de boosts actuel, surtout utile dans le message de boost' },
          ],
        },
        {
          h2: 'Aller plus loin : le fil d’accueil',
          body: 'Un message dans #bienvenue se noie vite sur un serveur actif. L’onglet Fil d’accueil ouvre un fil rien que pour l’arrivant, public ou privé, et lui parle comme un modo le ferait',
          points: [
            'Une séquence de messages envoyés dans l’ordre, avec un délai et l’indicateur « est en train d’écrire » avant chacun',
            'Un nom et un avatar au choix pour ces messages, réglables message par message',
            'Un menu final en boutons ou en menu déroulant : afficher un message comme le règlement, ouvrir un salon ou donner un rôle',
            'Les rôles du menu peuvent être exclusifs : en choisir un retire les autres du même groupe',
            'Les fils sans activité peuvent être supprimés après un délai, pour ne pas encombrer le salon',
          ],
        },
        {
          h2: 'Rôles automatiques : à l’arrivée et au-delà',
          body: 'Le rôle d’arrivée est le plus courant, mais l’onglet Rôles automatiques en propose deux autres, qui suivent le profil Discord du membre',
          items: [
            { title: 'Auto-rôle à l’arrivée', body: 'Donné dès que le membre rejoint, même si le message de bienvenue est éteint' },
            { title: 'Auto-rôle tag du serveur', body: 'Donné aux membres qui affichent le tag officiel de ton serveur à côté de leur pseudo, retiré quand ils l’enlèvent' },
            { title: 'Auto-rôle mot-clé dans la présence', body: 'Cherche un mot-clé, par exemple ton lien d’invitation, dans le statut personnalisé ou l’activité du membre. Discord ne donne pas la section « À propos de moi » aux bots' },
            { title: 'Rescanner les membres', body: 'Les deux auto-rôles de profil ne voient que les changements faits après leur activation : le bouton de rescan rattrape les membres déjà présents' },
          ],
        },
        {
          h2: 'Tester deux messages de bienvenue',
          body: 'L’onglet Tests A/B envoie au hasard une version de l’accueil à chaque arrivant, avec un autre texte, avec ou sans carte, avec ou sans fil. Kotbo compare ensuite qui est toujours là à J+1, J+7 et J+30, et qui a parlé dans sa première semaine. Quand une version gagne, tu l’appliques à tout le monde depuis le même onglet',
        },
      ],
      faq: [
        {
          q: 'Comment mettre un message de bienvenue sur Discord ?',
          a: 'Sans bot, active le message système dans Paramètres du serveur, Vue d’ensemble, mais le texte est imposé par Discord. Pour écrire le tien, un bot comme Kotbo le poste dans le salon choisi, avec les variables {user} et {server}',
        },
        {
          q: 'Quel bot pour un message de bienvenue Discord ?',
          a: 'Il en existe beaucoup. Kotbo gère le message de bienvenue, la carte d’avatar, le message de départ, le rôle automatique et un fil d’accueil dans le même dashboard, avec le reste de la gestion du serveur',
        },
        {
          q: 'Comment mentionner le nouveau membre dans le message de bienvenue ?',
          a: 'Écris {user} dans le texte. Kotbo le remplace par la mention du membre, qui reçoit une notification',
        },
        {
          q: 'Est-ce que Kotbo peut envoyer le message de bienvenue en MP ?',
          a: 'Non, Kotbo poste l’accueil dans un salon. Pour un accueil individuel, le fil d’accueil ouvre un fil au nom du membre, et il peut être privé',
        },
        {
          q: 'Comment donner un rôle automatiquement à l’arrivée sur Discord ?',
          a: 'Choisis le rôle dans l’onglet Rôles automatiques de la page Bienvenue et départs. Le rôle de Kotbo doit être placé au-dessus de ce rôle dans les paramètres du serveur',
        },
        {
          q: 'Comment faire un message quand quelqu’un quitte le serveur Discord ?',
          a: 'Discord n’en envoie pas. Avec Kotbo, active l’onglet Départs, choisis un salon et écris le texte, par exemple « {username} vient de partir »',
        },
      ],
    },
    en: {
      title: 'Discord welcome message: set one up with a bot',
      h1: 'How to set up a Discord welcome message, with or without a bot',
      description:
        'How to set up a Discord welcome message: what Discord does on its own, then a welcome bot with variables, avatar card, auto role on join and goodbye message.',
      lead: 'A Discord welcome message comes from one of two places: Discord’s system message, free but fixed, or a welcome bot that posts your own text in the channel you pick. This guide covers both, then shows how Kotbo does it: variables, an avatar card, a role on join and a goodbye message',
      sections: [
        {
          h2: 'What Discord does without a bot',
          body: 'In Server Settings, Overview, you pick a system messages channel and tick the random welcome message on join. It works, but you choose neither the text nor the layout',
          points: [
            'The text is picked at random from a list Discord wrote',
            'No goodbye message when someone leaves',
            'No role given on join: you need Discord’s Onboarding or a bot',
            'On a Community server, Onboarding and the Server Guide introduce your channels, but they post nothing in a channel',
          ],
        },
        {
          h2: 'Setting up a Discord welcome bot with Kotbo',
          body: 'Everything lives on dash.kotbo.fr, in the Welcome and goodbyes page. There is no command to type, and the Discord preview updates as you write',
          steps: [
            { title: 'Open the Welcome tab', body: 'Turn the welcome message on and pick the channel, usually #welcome or #arrivals' },
            { title: 'Write your text', body: 'Start from a template or from scratch, and drop in variables like {user} to mention the newcomer or {memberCount} for the member count' },
            { title: 'Add the card if you like', body: 'Tick the welcome image: Kotbo draws a banner with the member’s avatar, username and join number on the server' },
            { title: 'Give a role on join', body: 'In the Auto roles tab, pick the role every new member gets. Kotbo’s role must sit above it in the role list, or Discord refuses' },
            { title: 'Set up goodbyes and boosts', body: 'The Goodbyes and Boosts tabs work the same way: a channel, a text, and for boosts an optional thank-you card' },
          ],
        },
        {
          h2: 'Welcome message variables',
          body: 'Each tag is replaced when the message is sent. They exist in English and French, so {user} and {utilisateur} give the same result',
          items: [
            { title: '{user}', body: 'Mentions the new member, who gets pinged' },
            { title: '{username}', body: 'The Discord account name, without a mention' },
            { title: '{displayName}', body: 'The nickname shown on your server' },
            { title: '{server}', body: 'The server name' },
            { title: '{memberCount}', body: 'The total member count, handy for a “you’re our 500th member” line' },
            { title: '{boostCount}', body: 'The current boost count, mostly useful in the boost message' },
          ],
        },
        {
          h2: 'Going further: the welcome thread',
          body: 'A message in #welcome scrolls away fast on a busy server. The Welcome thread tab opens a thread just for the newcomer, public or private, and talks to them the way a mod would',
          points: [
            'A sequence of messages sent in order, with a delay and the “is typing” indicator before each',
            'A name and avatar of your choice for those messages, adjustable per message',
            'A final menu as buttons or a dropdown: show a message such as the rules, open a channel or give a role',
            'Menu roles can be exclusive: picking one removes the others in the same group',
            'Inactive threads can be deleted after a delay so the channel stays clean',
          ],
        },
        {
          h2: 'Discord autorole on join, and beyond',
          body: 'The join role is the common one, but the Auto roles tab has two more, which follow the member’s Discord profile',
          items: [
            { title: 'Join Auto-Role', body: 'Given as soon as the member joins, even with the welcome message turned off' },
            { title: 'Server Tag Auto-Role', body: 'Given to members who display your server’s official tag next to their name, removed when they take it off' },
            { title: 'Presence Keyword Auto-Role', body: 'Looks for a keyword, such as your invite link, in the member’s custom status or activity. Discord doesn’t expose the About Me section to bots' },
            { title: 'Rescan members', body: 'The two profile auto roles only see changes made after they’re turned on: the rescan button catches up with existing members' },
          ],
        },
        {
          h2: 'Testing two welcome messages',
          body: 'The A/B tests tab sends each newcomer a random version of your welcome, with a different text, with or without the card, with or without the thread. Kotbo then compares who is still there on day 1, 7 and 30, and who spoke in their first week. When a version wins, you apply it to everyone from the same tab',
        },
      ],
      faq: [
        {
          q: 'How do I make a welcome message on Discord?',
          a: 'Without a bot, turn on the system message in Server Settings, Overview, but Discord writes the text. To write your own, a bot like Kotbo posts it in the channel you choose, with variables like {user} and {server}',
        },
        {
          q: 'What is a good Discord welcome bot?',
          a: 'There are plenty. Kotbo handles the welcome message, avatar card, goodbye message, auto role and a welcome thread in one dashboard, alongside the rest of your server management',
        },
        {
          q: 'How do I mention the new member in a welcome message?',
          a: 'Write {user} in the text. Kotbo replaces it with a mention of the member, who gets a notification',
        },
        {
          q: 'Can Kotbo send the welcome message by DM?',
          a: 'No, Kotbo posts the welcome in a channel. For a one-to-one welcome, the welcome thread opens a thread named after the member, and it can be private',
        },
        {
          q: 'How do I give a role automatically when someone joins Discord?',
          a: 'Pick the role in the Auto roles tab of the Welcome and goodbyes page. Kotbo’s role must sit above that role in your server settings',
        },
        {
          q: 'How do I send a message when someone leaves a Discord server?',
          a: 'Discord doesn’t send one. With Kotbo, turn on the Goodbyes tab, pick a channel and write the text, for example “{username} just left”',
        },
      ],
    },
  },
};

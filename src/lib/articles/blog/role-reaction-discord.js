/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'role-reaction-discord', en: 'discord-reaction-roles' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['reaction_roles', 'welcome_goodbye'],
  text: {
    fr: {
      title: 'Rôle réaction Discord : donner des rôles en un clic',
      h1: 'Rôles par réaction sur Discord : laisser les membres choisir leurs rôles',
      description:
        'Rôle réaction Discord : ce que l’Onboarding de Discord fait déjà, puis un message à boutons avec Kotbo pour que chaque membre se donne ses rôles automatiquement.',
      lead: 'Un rôle réaction, c’est un message où chaque membre clique pour se donner un rôle : notifications, jeux, pronoms, région. Discord en fait une partie avec l’Onboarding, et un bot fait le reste dans n’importe quel salon. Avec Kotbo, ça passe par des boutons, plus fiables que les réactions emoji',
      sections: [
        {
          h2: 'Ce que Discord sait faire tout seul',
          body: 'Sur un serveur Communauté, l’Onboarding pose des questions aux arrivants et donne des rôles selon leurs réponses. Les membres peuvent ensuite revenir sur leurs choix depuis Salons et rôles. C’est natif et gratuit, avec quelques limites',
          points: [
            'Il faut activer la Communauté sur le serveur',
            'Les questions vivent dans l’Onboarding, pas dans un message que tu places où tu veux',
            'Aucun rôle donné selon le profil du membre, comme le tag du serveur',
          ],
        },
        {
          h2: 'Boutons ou réactions emoji ?',
          body: 'Les vieux bots de rôles réaction lisaient les emojis posés sous un message. Kotbo publie des boutons, et la différence se sent à l’usage',
          items: [
            { title: 'Une réponse à chaque clic', body: 'Le membre reçoit un message visible de lui seul qui confirme le rôle ajouté ou retiré. Avec une réaction, il ne sait pas si le bot l’a vue' },
            { title: 'Un libellé lisible', body: 'Chaque bouton porte un texte, un emoji et une couleur au choix, au lieu d’un emoji à deviner' },
            { title: 'Aucune réaction à nettoyer', body: 'Le message ne se couvre pas de centaines de réactions, et personne ne peut y ajouter un emoji hors sujet' },
          ],
        },
        {
          h2: 'Créer un message de rôles avec Kotbo',
          body: 'Ça se règle sur dash.kotbo.fr, page Rôles par réaction. L’aperçu du message Discord se met à jour pendant que tu le construis',
          steps: [
            { title: 'Crée les rôles sur Discord', body: 'Dans les paramètres du serveur, crée tes rôles puis place le rôle de Kotbo au-dessus d’eux : un bot ne peut pas donner un rôle plus haut que le sien' },
            { title: 'Publie un message de rôles', body: 'Sur la page Rôles par réaction, clique sur Publier un message de rôles, donne un titre et choisis le salon' },
            { title: 'Ajoute les boutons', body: 'Pour chaque bouton : un libellé, un emoji si tu veux, le rôle associé et sa couleur. Discord accepte jusqu’à 25 boutons par message' },
            { title: 'Choisis le mode', body: 'Bascule pour qu’un second clic retire le rôle, Attribution définitive pour qu’il reste. Chaque bouton peut aussi avoir son propre mode' },
            { title: 'Publie', body: 'Le message part sur Discord. Tu peux le modifier ensuite depuis le dashboard : le message est mis à jour sur place, sauf si tu changes de salon' },
          ],
        },
        {
          h2: 'Comment donner un rôle automatiquement sur Discord',
          body: 'Tous les rôles ne se choisissent pas. Kotbo en donne aussi sans que le membre clique, depuis la page Bienvenue et départs, onglet Rôles automatiques',
          items: [
            { title: 'À l’arrivée', body: 'Un rôle posé sur chaque nouveau membre, dès qu’il rejoint le serveur' },
            { title: 'Tag du serveur', body: 'Un rôle pour ceux qui affichent le tag officiel de ton serveur à côté de leur pseudo, retiré quand ils l’enlèvent. Discord indique lui-même qui le porte' },
            { title: 'Mot-clé dans le statut', body: 'Un rôle pour ceux dont le statut personnalisé ou l’activité contient un mot-clé, ton lien d’invitation par exemple' },
            {
              title: 'Au niveau atteint',
              body: 'Le module Niveaux donne des rôles en récompense quand un membre passe un palier',
              link: { feature: 'leveling', label: 'Lire l’article sur les niveaux' },
            },
          ],
        },
        {
          h2: 'Un menu de rôles dans le fil d’accueil',
          body: 'Si tu veux que les rôles se choisissent dès l’arrivée, le fil d’accueil de Kotbo se termine sur un menu en boutons ou en menu déroulant. Chaque page du menu peut ajouter, retirer ou basculer un rôle, ou le rendre exclusif : choisir une équipe retire alors les autres du même groupe',
        },
        {
          h2: 'Donner un rôle à plusieurs membres d’un coup',
          body: 'Pour le staff, une commande slash fait le travail à la main, sur plusieurs membres à la fois',
          commands: [
            { name: '/role add role:<rôle> membres:<mentions>', body: 'Ajoute le rôle à tous les membres mentionnés. Réservée à ceux qui ont la permission Gérer les rôles' },
            { name: '/role remove role:<rôle> membres:<mentions>', body: 'Retire le rôle aux membres mentionnés' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire des rôles réaction sur Discord ?',
          a: 'Sans bot, utilise l’Onboarding d’un serveur Communauté. Avec Kotbo, publie un message de rôles depuis la page Rôles par réaction du dashboard : chaque bouton donne ou retire un rôle',
        },
        {
          q: 'Comment donner un rôle automatiquement sur Discord ?',
          a: 'Avec Kotbo, choisis un rôle dans l’onglet Rôles automatiques de la page Bienvenue et départs. Il est donné à chaque membre qui rejoint, et d’autres auto-rôles suivent le tag du serveur ou le statut',
        },
        {
          q: 'Pourquoi le bot ne donne pas le rôle ?',
          a: 'Presque toujours une question de hiérarchie : le rôle du bot doit être au-dessus du rôle à donner dans les paramètres du serveur. Les rôles gérés par une intégration ne peuvent pas être donnés non plus',
        },
        {
          q: 'Combien de rôles peut-on mettre sur un message ?',
          a: 'Jusqu’à 25 boutons par message, la limite de Discord. Au-delà, publie un deuxième message de rôles',
        },
        {
          q: 'Est-ce qu’un membre peut retirer son rôle lui-même ?',
          a: 'Oui en mode Bascule : un second clic retire le rôle. En mode Attribution définitive, le rôle reste une fois obtenu',
        },
        {
          q: 'Comment donner un rôle aux membres qui portent le tag du serveur ?',
          a: 'Active l’auto-rôle tag du serveur dans l’onglet Rôles automatiques. Kotbo donne le rôle quand le membre affiche le tag et le retire quand il l’enlève',
        },
      ],
    },
    en: {
      title: 'Discord reaction roles: let members pick their roles',
      h1: 'Discord reaction roles: let members pick their own roles',
      description:
        'Discord reaction roles: what Discord Onboarding already does, then a button role menu with Kotbo, plus autoroles given on join, by server tag or by status.',
      lead: 'Reaction roles are a message where each member clicks to give themselves a role: pings, games, pronouns, region. Discord covers part of it with Onboarding, and a bot handles the rest in any channel. Kotbo uses buttons, which are more reliable than emoji reactions',
      sections: [
        {
          h2: 'What Discord does on its own',
          body: 'On a Community server, Onboarding asks newcomers questions and gives roles based on their answers. Members can change their picks later from Channels & Roles. It’s native and free, with a few limits',
          points: [
            'Community has to be turned on for the server',
            'The questions live in Onboarding, not in a message you place where you want',
            'No role based on the member’s profile, such as the server tag',
          ],
        },
        {
          h2: 'Buttons or emoji reactions?',
          body: 'Older reaction role bots read the emojis added under a message. Kotbo posts buttons, and you feel the difference in use',
          items: [
            { title: 'A reply on every click', body: 'The member gets a message only they can see, confirming the role was added or removed. With a reaction, they can’t tell whether the bot saw it' },
            { title: 'A readable label', body: 'Each button carries text, an optional emoji and a color, instead of an emoji to decode' },
            { title: 'No reactions to clean up', body: 'The message doesn’t pile up hundreds of reactions, and nobody can add an off-topic emoji to it' },
          ],
        },
        {
          h2: 'Creating a role menu with Kotbo',
          body: 'It’s set up on dash.kotbo.fr, in the Reaction roles page. The Discord preview updates while you build it',
          steps: [
            { title: 'Create the roles on Discord', body: 'In server settings, create your roles, then move Kotbo’s role above them: a bot can’t give a role higher than its own' },
            { title: 'Deploy a panel', body: 'In the Reaction roles page, click Deploy a Panel, give it a title and pick the channel' },
            { title: 'Add the buttons', body: 'For each button: a label, an optional emoji, the role and its color. Discord allows up to 25 buttons per message' },
            { title: 'Pick the mode', body: 'Toggle lets a second click remove the role, Grant only keeps it. Each button can also have its own mode' },
            { title: 'Publish', body: 'The message goes out on Discord. You can edit it later from the dashboard: the message updates in place, unless you move it to another channel' },
          ],
        },
        {
          h2: 'Discord autorole: roles members don’t pick',
          body: 'Not every role is picked by hand. Kotbo also gives roles with no click, from the Welcome and goodbyes page, Auto roles tab',
          items: [
            { title: 'On join', body: 'A role given to every new member as soon as they join' },
            { title: 'Server tag', body: 'A role for members who display your server’s official tag next to their name, removed when they take it off. Discord itself reports who wears it' },
            { title: 'Keyword in status', body: 'A role for members whose custom status or activity contains a keyword, such as your invite link' },
            {
              title: 'On reaching a level',
              body: 'The Levels module hands out reward roles when a member reaches a milestone',
              link: { feature: 'leveling', label: 'Read the article on levels' },
            },
          ],
        },
        {
          h2: 'A role menu in the welcome thread',
          body: 'If you want roles picked right on arrival, Kotbo’s welcome thread ends on a menu as buttons or a dropdown. Each page of the menu can add, remove or toggle a role, or make it exclusive: picking one team then removes the others in the same group',
        },
        {
          h2: 'Giving a role to several members at once',
          body: 'For staff, a slash command does it by hand, on several members in one go',
          commands: [
            { name: '/role add role:<role> membres:<mentions>', body: 'Adds the role to every mentioned member. Limited to members with the Manage Roles permission' },
            { name: '/role remove role:<role> membres:<mentions>', body: 'Removes the role from the mentioned members' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I set up reaction roles on Discord?',
          a: 'Without a bot, use Onboarding on a Community server. With Kotbo, deploy a panel from the Reaction roles page of the dashboard: each button gives or removes a role',
        },
        {
          q: 'How do I give a role automatically on Discord?',
          a: 'With Kotbo, pick a role in the Auto roles tab of the Welcome and goodbyes page. Every member who joins gets it, and other auto roles follow the server tag or status',
        },
        {
          q: 'Why won’t the bot give the role?',
          a: 'Almost always role hierarchy: the bot’s role must sit above the role it gives in server settings. Roles managed by an integration can’t be given either',
        },
        {
          q: 'How many roles can go on one message?',
          a: 'Up to 25 buttons per message, Discord’s limit. Beyond that, deploy a second panel',
        },
        {
          q: 'Can members remove a role themselves?',
          a: 'Yes in Toggle mode: a second click removes the role. In Grant only mode, the role stays once granted',
        },
        {
          q: 'How do I give a role to members wearing the server tag?',
          a: 'Turn on the Server Tag Auto-Role in the Auto roles tab. Kotbo gives the role when the member displays the tag and removes it when they take it off',
        },
      ],
    },
  },
};

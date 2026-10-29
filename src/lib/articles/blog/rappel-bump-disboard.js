/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'rappel-bump-disboard', en: 'disboard-bump-reminder' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['bump_reminder'],
  text: {
    fr: {
      title: 'Rappel bump Disboard : ne rate plus un /bump',
      h1: 'Rappel de bump Disboard : savoir quand bumper sans surveiller l’horloge',
      description:
        'Rappel bump Disboard : ce qu’est le bump sur Discord, ses limites, et comment Kotbo repère chaque /bump et prévient dès que le prochain est possible.',
      lead: 'Bumper, c’est taper /bump pour faire remonter ton serveur en tête d’un annuaire comme Disboard, qui l’accepte une fois toutes les deux heures. Le plus dur, c’est de penser au suivant. Kotbo repère chaque /bump réussi et poste un rappel dans le même salon dès que tu peux recommencer, sans rien à régler',
      sections: [
        {
          h2: 'C’est quoi un bump sur Discord',
          body: 'Les annuaires de serveurs Discord mettent en avant les serveurs qui viennent de bumper. Tu tapes /bump, le bot de l’annuaire répond dans le salon, et ton serveur repasse en haut de la liste jusqu’à ce que d’autres bumpent à leur tour. Chaque annuaire impose un délai entre deux bumps. Ceux que Kotbo reconnaît, avec le délai qu’il applique',
          points: [
            'Disboard : 2 heures',
            'Discadia : 4 heures',
            'DiscordServers.com : 6 heures',
            'Disforge : 4 heures',
          ],
        },
        {
          h2: 'Ce que le bump fait, et ce qu’il ne fait pas',
          body: 'Le bump achète de la visibilité dans un annuaire, rien de plus. Avant d’en faire une corvée d’équipe, garde ces limites en tête',
          points: [
            'Il amène des curieux, qui restent si ton salon d’arrivée et ton règlement leur donnent envie',
            'Ta fiche d’annuaire compte autant que le bump : description, étiquettes, langue',
            'Sur un annuaire chargé, d’autres serveurs te repassent devant en quelques minutes',
            'Un bot ne peut pas lancer la commande d’un autre bot : le /bump se tape à la main. Kotbo ne bumpe donc pas à ta place, il te dit quand y aller',
          ],
        },
        {
          h2: 'Mettre en place un rappel de bump',
          body: 'Le module Rappel de bump est actif par défaut et n’a aucun écran de réglages : il apprend tout du premier /bump qu’il voit',
          steps: [
            { title: 'Ajoute l’annuaire', body: 'Invite le bot de Disboard, ou d’un autre annuaire reconnu, et crée ta fiche sur son site' },
            { title: 'Choisis un salon de bump', body: 'Un salon dédié, #bump par exemple. C’est là que Kotbo postera ses rappels, puisqu’il répond là où le dernier bump a eu lieu' },
            { title: 'Bumpe une première fois', body: 'Tape /bump. Kotbo voit la réponse publique de l’annuaire et note l’heure, l’annuaire et le membre qui a bumpé' },
            { title: 'Attends le rappel', body: 'Une fois le délai écoulé, Kotbo poste un embed Rappel de bump : le serveur peut à nouveau être bump sur l’annuaire, avec le nom du dernier bumpeur' },
          ],
        },
        {
          h2: 'Ce que fait le rappel, exactement',
          body: 'Le fonctionnement tient en peu de règles, et elles expliquent les cas qui surprennent',
          items: [
            { title: 'Il ne mentionne personne', body: 'Le rappel s’affiche dans le salon sans notifier qui que ce soit. Si ton équipe veut une alerte, règle les notifications du salon de bump sur Tous les messages' },
            { title: 'Seuls les bumps réussis comptent', body: 'Un /bump trop tôt est en général refusé par l’annuaire dans une réponse visible du seul auteur. Kotbo ne la voit pas, et l’échéance ne bouge pas' },
            { title: 'Un annuaire à la fois', body: 'Kotbo garde une seule échéance par serveur. Si tu bumpes sur plusieurs annuaires, il retient la plus lointaine et ne la fait jamais reculer' },
            { title: 'Visible dans le dashboard', body: 'La page Santé du serveur affiche le prochain bump et l’annuaire concerné, ou indique qu’il est disponible maintenant' },
          ],
        },
        {
          h2: 'La commande /bump et les annuaires reconnus',
          body: 'Kotbo n’ajoute aucune commande : il écoute celle des annuaires. Il reconnaît leur bot à son nom et vérifie que le message répond bien à /bump, pour ne pas confondre un bump avec une autre annonce du même bot',
          commands: [
            { name: '/bump', body: 'La commande de Disboard, Discadia, DiscordServers.com et Disforge. C’est la réponse publique de l’annuaire à cette commande qui déclenche le compte à rebours de Kotbo' },
          ],
        },
        {
          h2: 'Voir combien de membres le bump ramène',
          body: 'Bumper toutes les deux heures pendant un mois, ça se mesure. Sur la page Invitations du dashboard, Kotbo étiquette tout seul les invitations créées par un autre bot avec le nom de ce bot. Si l’annuaire crée sa propre invitation sur ton serveur, l’onglet Provenances montre les arrivées par ce lien et combien sont restées. Tu peux aussi nommer à la main l’invitation que tu as mise sur ta fiche',
        },
      ],
      faq: [
        {
          q: 'Comment avoir un rappel de bump Disboard ?',
          a: 'Avec un bot qui repère le /bump et compte le délai. Kotbo le fait sans réglage : il voit la réponse de Disboard et poste un rappel dans le même salon deux heures plus tard',
        },
        {
          q: 'Tous les combien peut-on bumper sur Disboard ?',
          a: 'Une fois toutes les deux heures. Un /bump tapé avant est refusé par Disboard',
        },
        {
          q: 'Est-ce qu’un bot peut bumper à ma place ?',
          a: 'Non. Discord ne laisse pas un bot lancer la commande d’un autre bot, le /bump se tape à la main. Kotbo se charge du rappel, pas du bump',
        },
        {
          q: 'Pourquoi le rappel de bump ne ping personne ?',
          a: 'Kotbo poste le rappel sans mention, pour ne pas notifier tout un salon toutes les deux heures. Pour être alerté, règle les notifications du salon de bump sur Tous les messages',
        },
        {
          q: 'Le rappel marche-t-il avec d’autres annuaires que Disboard ?',
          a: 'Oui, avec Discadia, DiscordServers.com et Disforge. Kotbo applique 4 heures pour Discadia et Disforge, 6 heures pour DiscordServers.com',
        },
        {
          q: 'Où poster le rappel de bump ?',
          a: 'Kotbo le poste dans le salon du dernier bump réussi. Bumpe toujours dans le même salon pour retrouver tes rappels au même endroit',
        },
      ],
    },
    en: {
      title: 'Disboard bump reminder: never miss a /bump again',
      h1: 'Disboard bump reminder: know when to bump without watching the clock',
      description:
        'Disboard bump reminder: what bumping a Discord server does, where it stops, and how Kotbo spots every /bump and tells you when the next one is possible.',
      lead: 'Bumping means typing /bump to push your server back to the top of a directory like Disboard, which allows it once every two hours. The hard part is remembering the next one. Kotbo spots every successful /bump and posts a reminder in the same channel as soon as you can bump again, with nothing to set up',
      sections: [
        {
          h2: 'What bumping a Discord server means',
          body: 'Discord server directories put the servers that just bumped first. You type /bump, the directory’s bot replies in the channel, and your server goes back to the top of the list until others bump in turn. Each directory enforces a wait between two bumps. The ones Kotbo recognises, with the wait it applies',
          points: [
            'Disboard: 2 hours',
            'Discadia: 4 hours',
            'DiscordServers.com: 6 hours',
            'Disforge: 4 hours',
          ],
        },
        {
          h2: 'What a bump does, and what it doesn’t',
          body: 'A bump buys visibility in a directory, nothing more. Before you turn it into a staff chore, keep these limits in mind',
          points: [
            'It brings curious visitors, who stay if your landing channel and rules make them want to',
            'Your directory listing matters as much as the bump: description, tags, language',
            'On a busy directory, other servers pass you again within minutes',
            'A bot can’t run another bot’s command, so /bump is typed by hand. Kotbo doesn’t bump for you, it tells you when to go',
          ],
        },
        {
          h2: 'Setting up a bump reminder',
          body: 'The Bump reminder module is on by default and has no settings screen: it learns everything from the first /bump it sees',
          steps: [
            { title: 'Add the directory', body: 'Invite Disboard’s bot, or another recognised directory’s, and create your listing on its website' },
            { title: 'Pick a bump channel', body: 'A dedicated channel, #bump for instance. That’s where Kotbo posts its reminders, since it replies where the last bump happened' },
            { title: 'Bump once', body: 'Type /bump. Kotbo sees the directory’s public reply and records the time, the directory and who bumped' },
            { title: 'Wait for the reminder', body: 'When the wait is over, Kotbo posts a bump reminder embed saying the server can be bumped again on that directory, with the last bumper’s name' },
          ],
        },
        {
          h2: 'How the reminder behaves',
          body: 'It runs on a handful of rules, and they explain the cases that surprise people',
          items: [
            { title: 'It pings nobody', body: 'The reminder shows up in the channel without notifying anyone. If your team wants an alert, set the bump channel’s notifications to All Messages' },
            { title: 'Only successful bumps count', body: 'A /bump that comes too early is usually refused in a reply only its author can see. Kotbo doesn’t see it, and the countdown stays as it was' },
            { title: 'One directory at a time', body: 'Kotbo keeps a single countdown per server. If you bump on several directories, it keeps the latest one and never moves it earlier' },
            { title: 'Shown in the dashboard', body: 'The Server health page shows the next bump and its directory, or says it’s ready now' },
          ],
        },
        {
          h2: 'The /bump command and supported directories',
          body: 'Kotbo adds no command of its own: it listens to the directories’ command. It recognises their bot by name and checks that the message answers /bump, so another post from the same bot is never mistaken for a bump',
          commands: [
            { name: '/bump', body: 'The command of Disboard, Discadia, DiscordServers.com and Disforge. The directory’s public reply to it is what starts Kotbo’s countdown' },
          ],
        },
        {
          h2: 'Seeing how many members bumping brings',
          body: 'Bumping every two hours for a month is worth measuring. On the dashboard’s Invites page, Kotbo labels invites created by another bot with that bot’s name. If the directory creates its own invite on your server, the Sources tab shows joins through that link and how many stayed. You can also name the invite you put on your listing yourself',
        },
      ],
      faq: [
        {
          q: 'How do I get a Disboard bump reminder?',
          a: 'Use a bot that spots /bump and counts down the wait. Kotbo does it with no setup: it sees Disboard’s reply and posts a reminder in the same channel two hours later',
        },
        {
          q: 'How often can you bump on Disboard?',
          a: 'Once every two hours. A /bump typed earlier is refused by Disboard',
        },
        {
          q: 'Can a bot bump my server automatically?',
          a: 'No. Discord doesn’t let a bot run another bot’s command, so /bump is typed by hand. Kotbo handles the reminder, not the bump',
        },
        {
          q: 'Why doesn’t the bump reminder ping anyone?',
          a: 'Kotbo posts it without mentions, so a whole channel isn’t notified every two hours. To get alerted, set the bump channel’s notifications to All Messages',
        },
        {
          q: 'Does the reminder work with directories other than Disboard?',
          a: 'Yes, with Discadia, DiscordServers.com and Disforge. Kotbo applies 4 hours for Discadia and Disforge, 6 hours for DiscordServers.com',
        },
        {
          q: 'Where does the bump reminder get posted?',
          a: 'In the channel of the last successful bump. Always bump in the same channel to find your reminders in one place',
        },
      ],
    },
  },
};

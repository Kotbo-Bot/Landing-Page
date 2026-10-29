/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'salon-suggestion-discord', en: 'discord-suggestion-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['suggestions', 'starboard'],
  text: {
    fr: {
      title: 'Salon suggestion Discord : votes et réponses du staff',
      h1: 'Créer un salon suggestion sur Discord où les idées sont votées et ont une réponse',
      description:
        'Salon suggestion Discord : les options natives, puis un bot suggestion avec /suggest, votes pour ou contre et statut Approuvée, Refusée ou Implémentée.',
      lead: 'Un salon suggestion sur Discord sert à récolter les idées de ta communauté, à les faire voter et à y répondre. Un salon texte avec deux réactions suffit pour démarrer, mais les idées s’y perdent vite. Avec Kotbo, chaque suggestion arrive dans un message avec ses votes, et le staff la tranche depuis le dashboard',
      sections: [
        {
          h2: 'Les solutions sans bot',
          body: 'Tu peux déjà faire un salon suggestion avec ce que Discord propose. Chaque solution a son défaut',
          items: [
            { title: 'Un salon texte et des réactions', body: 'Les membres postent, tout le monde réagit avec un pouce. Il faut poser les réactions à la main, et rien n’indique ce que le staff a décidé' },
            { title: 'Un salon forum', body: 'Une publication par idée, avec des tags comme « acceptée » ou « refusée ». Plus rangé, mais le vote reste une réaction et le suivi se fait à la main' },
            { title: 'Les sondages Discord', body: 'Pratiques pour trancher entre deux options choisies par le staff, pas pour recueillir les idées des membres' },
          ],
        },
        {
          h2: 'Mettre en place un bot suggestion Discord avec Kotbo',
          body: 'Le module Suggestions s’installe en une commande, ou depuis la page Suggestions du dashboard',
          steps: [
            { title: 'Crée le salon', body: 'Un salon texte, #suggestions par exemple, où seul le bot écrit. Les membres y votent avec les boutons' },
            { title: 'Active le module', body: 'Tape /suggestion-config enable en indiquant ce salon. Les suggestions y seront publiées' },
            { title: 'Pose le formulaire', body: '/suggestion-config send-embed publie un message avec un bouton qui ouvre un formulaire, pour les membres qui ne connaissent pas les commandes' },
            { title: 'Annonce /suggest', body: 'Les membres proposent leurs idées avec /suggest ou par le formulaire, de 10 à 1 000 caractères' },
          ],
        },
        {
          h2: 'Les commandes suggestion',
          body: 'Une commande pour les membres, une pour les administrateurs',
          commands: [
            { name: '/suggest suggestion:<ton idée>', body: 'Publie l’idée dans le salon des suggestions, avec l’avatar et le pseudo de son auteur' },
            { name: '/suggestion-config enable channel:<salon>', body: 'Active le module et choisit le salon où les suggestions sont publiées' },
            { name: '/suggestion-config send-embed channel:<salon>', body: 'Publie le message avec le bouton Soumettre une suggestion' },
            { name: '/suggestion-config status', body: 'Affiche si le module est actif et dans quel salon' },
            { name: '/suggestion-config disable', body: 'Coupe les suggestions : /suggest renvoie alors une erreur' },
          ],
        },
        {
          h2: 'Comment marchent les votes',
          body: 'Chaque suggestion arrive avec deux boutons, pour et contre, qui affichent le compte en direct',
          points: [
            'Un vote par membre : recliquer du même côté retire le vote, cliquer de l’autre côté le change',
            'Le membre reçoit une confirmation visible de lui seul',
            'Une fois la suggestion tranchée, les boutons se grisent et le score est figé',
          ],
        },
        {
          h2: 'Répondre aux suggestions : les statuts',
          body: 'Sur la page Suggestions du dashboard, le staff filtre les idées par statut et répond à chacune. Une réponse est obligatoire : la communauté sait toujours pourquoi',
          items: [
            { title: 'En attente', body: 'Le statut de départ, tant que le staff n’a rien décidé. Les votes restent ouverts' },
            { title: 'Approuvée', body: 'L’idée est retenue. Le message passe au vert sur Discord, avec ta réponse' },
            { title: 'Refusée', body: 'L’idée n’est pas retenue. Le message passe au rouge, avec l’explication' },
            { title: 'Implémentée', body: 'C’est fait. Le message le dit, pour que la communauté voie ses idées arriver' },
          ],
        },
        {
          h2: 'Une boîte à idées plus légère',
          body: 'Si tu préfères un salon où les membres écrivent librement, le module Messages à la une pose les emojis de vote d’office sur chaque nouveau message des salons choisis. Les idées les mieux notées sont republiées dans un salon dédié. Côté staff, une suggestion peut aussi rejoindre une liste de suivi pour ne pas oublier de la réaliser',
        },
        {
          h2: 'Tenir un salon suggestion qui vit',
          body: 'Un salon suggestion meurt quand les idées restent sans réponse. Quelques habitudes qui le gardent en vie',
          points: [
            'Explique comment proposer dès l’entrée du salon, ou pose directement le formulaire avec /suggestion-config send-embed',
            'Une idée par suggestion, sinon les votes ne veulent plus rien dire',
            'Réponds aussi aux idées refusées : ta réponse s’affiche sous la suggestion, avec le score final',
            'Les suggestions sans réponse remontent dans les tâches de l’accueil du dashboard, pour que le staff ne les oublie pas',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un salon suggestion sur Discord ?',
          a: 'Crée un salon texte, puis tape /suggestion-config enable avec ce salon. Les membres proposent avec /suggest, et chaque idée y arrive avec des boutons de vote',
        },
        {
          q: 'Quel bot suggestion Discord choisir ?',
          a: 'Beaucoup de bots ont un module de suggestions. Kotbo publie chaque idée avec des votes, et le staff y répond depuis le dashboard avec un statut Approuvée, Refusée ou Implémentée',
        },
        {
          q: 'Comment faire voter les membres sur une suggestion ?',
          a: 'Avec Kotbo, chaque suggestion porte deux boutons, pour et contre. Un membre a un vote, qu’il peut retirer ou changer tant que la suggestion est en attente',
        },
        {
          q: 'Comment répondre à une suggestion Discord ?',
          a: 'Ouvre la page Suggestions du dashboard, écris ta réponse et choisis Approuver, Refuser ou Implémentée. Le message Discord est mis à jour avec ta réponse',
        },
        {
          q: 'Est-ce qu’on peut proposer une suggestion sans commande ?',
          a: 'Oui. /suggestion-config send-embed publie un message avec un bouton qui ouvre un formulaire, et la suggestion part dans le salon configuré',
        },
        {
          q: 'Comment changer le salon des suggestions ?',
          a: 'Relance /suggestion-config enable avec le nouveau salon, ou change-le dans la configuration de la page Suggestions du dashboard. Les nouvelles suggestions y seront publiées',
        },
      ],
    },
    en: {
      title: 'Discord suggestion bot: votes and staff replies',
      h1: 'A Discord suggestion bot that collects ideas, counts votes and answers',
      description:
        'Discord suggestion bot: native options first, then a suggestions channel with /suggest, up and down votes and an Approved, Rejected or Implemented status.',
      lead: 'A Discord suggestions channel is where your community drops ideas, votes on them and gets an answer. A text channel with two reactions is enough to start, but ideas get lost fast. With Kotbo, each suggestion arrives in a message with its votes, and staff decide on it from the dashboard',
      sections: [
        {
          h2: 'Suggestions without a bot',
          body: 'You can already run a suggestions channel with what Discord offers. Each option has a catch',
          items: [
            { title: 'A text channel and reactions', body: 'Members post, everyone reacts with a thumb. Someone adds the reactions by hand, and nothing shows what staff decided' },
            { title: 'A forum channel', body: 'One post per idea, with tags like “accepted” or “rejected”. Tidier, but the vote is still a reaction and the follow-up is manual' },
            { title: 'Discord polls', body: 'Handy to choose between options staff picked, not to collect ideas from members' },
          ],
        },
        {
          h2: 'Setting up a Discord suggestion bot with Kotbo',
          body: 'The Suggestions module takes one command to set up, or the Suggestions page of the dashboard',
          steps: [
            { title: 'Create the channel', body: 'A text channel, #suggestions for example, where only the bot posts. Members vote there with the buttons' },
            { title: 'Turn the module on', body: 'Type /suggestion-config enable with that channel. Suggestions get posted there' },
            { title: 'Post the form', body: '/suggestion-config send-embed posts a message with a button that opens a form, for members who don’t know the commands' },
            { title: 'Announce /suggest', body: 'Members send ideas with /suggest or through the form, from 10 to 1,000 characters' },
          ],
        },
        {
          h2: 'The suggestion commands',
          body: 'One command for members, one for admins',
          commands: [
            { name: '/suggest suggestion:<your idea>', body: 'Posts the idea in the suggestions channel, with the author’s avatar and name' },
            { name: '/suggestion-config enable channel:<channel>', body: 'Turns the module on and sets the channel suggestions are posted in' },
            { name: '/suggestion-config send-embed channel:<channel>', body: 'Posts the message with the submit button' },
            { name: '/suggestion-config status', body: 'Shows whether the module is on and which channel it uses' },
            { name: '/suggestion-config disable', body: 'Turns suggestions off: /suggest then returns an error' },
          ],
        },
        {
          h2: 'How voting works',
          body: 'Each suggestion comes with two buttons, up and down, showing the live count',
          points: [
            'One vote per member: clicking the same side again removes it, clicking the other side switches it',
            'The member gets a confirmation only they can see',
            'Once the suggestion is decided, the buttons grey out and the score is frozen',
          ],
        },
        {
          h2: 'Answering suggestions: the statuses',
          body: 'On the Suggestions page of the dashboard, staff filter ideas by status and answer each one. A reply is required, so the community always knows why',
          items: [
            { title: 'Pending', body: 'The starting status, until staff decide. Votes stay open' },
            { title: 'Approved', body: 'The idea is in. The Discord message turns green, with your reply' },
            { title: 'Rejected', body: 'The idea is out. The message turns red, with the reason' },
            { title: 'Implemented', body: 'It’s done. The message says so, and the community sees its ideas land' },
          ],
        },
        {
          h2: 'A lighter idea box',
          body: 'If you’d rather have a channel where members write freely, the Featured messages module adds the vote emojis to every new message in the channels you pick. The best-rated ideas get reposted in a dedicated channel. On the staff side, a suggestion can also go on a tracking list so it actually gets built',
        },
        {
          h2: 'Keeping a suggestions channel alive',
          body: 'A suggestions channel dies when ideas go unanswered. A few habits keep it going',
          points: [
            'Explain how to suggest right at the top of the channel, or post the form with /suggestion-config send-embed',
            'One idea per suggestion, otherwise the votes stop meaning anything',
            'Answer rejected ideas too: your reply shows under the suggestion, with the final score',
            'Unanswered suggestions show up in the tasks on the dashboard home, so staff don’t forget them',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I make a suggestions channel on Discord?',
          a: 'Create a text channel, then type /suggestion-config enable with that channel. Members send ideas with /suggest, and each one lands there with vote buttons',
        },
        {
          q: 'What is a good Discord suggestion bot?',
          a: 'Many bots have a suggestions module. Kotbo posts each idea with votes, and staff answer from the dashboard with an Approved, Rejected or Implemented status',
        },
        {
          q: 'How do members vote on a suggestion?',
          a: 'With Kotbo, each suggestion has two buttons, up and down. A member gets one vote, which they can remove or switch while the suggestion is pending',
        },
        {
          q: 'How do I reply to a suggestion on Discord?',
          a: 'Open the Suggestions page of the dashboard, write your reply and choose Approve, Reject or Implemented. The Discord message updates with your reply',
        },
        {
          q: 'Can members suggest something without a command?',
          a: 'Yes. /suggestion-config send-embed posts a message with a button that opens a form, and the suggestion goes to the configured channel',
        },
        {
          q: 'How do I change the suggestions channel?',
          a: 'Run /suggestion-config enable again with the new channel, or change it in the configuration of the Suggestions page of the dashboard. New suggestions get posted there',
        },
      ],
    },
  },
};

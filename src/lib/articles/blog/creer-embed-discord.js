/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'creer-embed-discord', en: 'discord-embed-builder' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['embed_builder', 'campaigns', 'news'],
  text: {
    fr: {
      title: 'Comment faire un embed Discord, sans coder',
      h1: 'Comment faire un embed sur Discord : un éditeur visuel et un aperçu en direct',
      description:
        'Comment faire un embed Discord : pourquoi ton compte ne peut pas en envoyer, puis un éditeur visuel avec Kotbo, la commande /say et les messages programmés.',
      lead: 'Un embed, c’est le message encadré avec une barre de couleur, un titre, des champs et parfois une image. Ton compte Discord ne peut pas en envoyer : seuls les bots et les webhooks le peuvent. Avec Kotbo, tu le composes sur le dashboard avec un aperçu, puis il le publie dans le salon de ton choix',
      sections: [
        {
          h2: 'Pourquoi tu ne peux pas faire d’embed toi-même',
          body: 'Le client Discord n’a aucun bouton pour créer un embed. Quand tu colles un lien, Discord affiche un aperçu, mais tu n’en choisis ni le titre ni la couleur. Il reste deux chemins',
          items: [
            { title: 'Un webhook', body: 'Dans les paramètres d’un salon, Intégrations, Webhooks, Discord te donne une adresse qui accepte des embeds. Il faut ensuite un outil pour écrire et envoyer le message, et le modifier plus tard demande de repasser par cet outil' },
            { title: 'Un bot', body: 'Il publie l’embed pour toi, peut le modifier ensuite, et te laisse le préparer depuis une interface plutôt qu’en écrivant du JSON' },
          ],
        },
        {
          h2: 'Ce qu’un embed peut contenir',
          body: 'Chaque bloc est facultatif, mais un embed vide ne part pas. Voici ce que l’éditeur de Kotbo remplit, dans l’ordre où Discord l’affiche',
          points: [
            'Un texte simple au-dessus du cadre, pour un ping ou une phrase d’accroche',
            'Un auteur, avec son icône et un lien sur son nom',
            'Un titre, cliquable si tu lui donnes une URL, et une description',
            'La couleur de la barre latérale',
            'Une vignette en haut à droite et une grande image en bas',
            'Jusqu’à 25 champs, chacun avec un titre et un contenu, alignés en ligne ou empilés',
            'Un pied de page avec son icône, et l’horodatage',
          ],
        },
        {
          h2: 'Créer un embed Discord avec Kotbo',
          body: 'Ça se passe sur dash.kotbo.fr, page Messages enrichis',
          steps: [
            { title: 'Choisis le salon d’envoi', body: 'La liste reprend les salons de ton serveur. Kotbo doit pouvoir y écrire' },
            { title: 'Remplis les blocs', body: 'Titre, description, couleur, images, champs. L’aperçu à droite se met à jour à chaque frappe, avec le rendu de Discord' },
            { title: 'Garde un modèle si tu le réutilises', body: 'Le bouton Sauvegarder range l’embed dans Mes modèles. Les modèles restent dans ton navigateur, sur cet appareil' },
            { title: 'Publie', body: 'Le bouton Publier le message l’envoie. L’ID du message envoyé se remplit tout seul' },
            { title: 'Corrige plus tard', body: 'Garde cet ID dans le champ Message ID pour modifier le message sur place. Discord ne laisse un bot modifier que ses propres messages : avec un autre ID, Kotbo publie un nouveau message' },
          ],
        },
        {
          h2: 'Un embed rapide sans quitter Discord',
          body: 'Pour une annonce courte, la commande /say suffit. Elle est réservée par défaut à ceux qui peuvent gérer les messages',
          commands: [
            { name: '/say message:<texte> salon:<salon>', body: 'L’option message est obligatoire, salon choisit où l’envoyer, le salon actuel sinon. Avec un titre, une couleur ou anonyme, le message part en embed. Sans aucune des trois, il part en texte simple au nom du bot' },
            { name: '/say titre:<titre> couleur:<couleur>', body: 'Le titre fait passer le message en embed. Sept couleurs au choix : bleu par défaut, vert, rouge, jaune, violet, sombre ou blanc' },
            { name: '/say anonyme:True', body: 'Retire ton nom du pied de page de l’embed. Sinon, il indique qui l’a envoyé' },
          ],
        },
        {
          h2: 'Programmer une annonce',
          body: 'Une annonce qui revient chaque semaine n’a pas besoin de toi à chaque fois. La page Tâches planifiées a un type Message programmé',
          points: [
            'Un texte, un embed facultatif avec titre, description, couleur et image, et le salon de destination',
            'Toutes les heures, chaque jour, chaque semaine, chaque mois, ou une expression cron sur mesure',
            'Envoyer une seule fois, pour un message daté qui ne doit pas revenir l’année suivante',
            'Autoriser les mentions est décoché par défaut : un message répété ne ping pas tout le serveur par accident',
          ],
        },
        {
          h2: 'Aller plus loin : campagnes et actualités',
          body: 'Deux modules prennent le relais quand une annonce ne suffit plus',
          items: [
            { title: 'Campagnes', body: 'Une suite de messages placés autour d’une date de départ, teaser compris, envoyés dans un salon ou en MP. L’audience se filtre par rôles, niveau, ancienneté ou inactivité, et chaque étape rend compte des envois réussis, des échecs et des réactions' },
            { title: 'Actualités', body: 'Le staff rédige ses annonces et ses notes de version sur le dashboard. Chacune part dans le salon de sa catégorie et dans un flux RSS public' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un embed sur Discord ?',
          a: 'Ton compte ne peut pas en envoyer, il faut un bot ou un webhook. Avec Kotbo, ouvre la page Messages enrichis du dashboard, remplis les blocs en regardant l’aperçu, choisis le salon et publie',
        },
        {
          q: 'Est-ce qu’on peut envoyer un embed sans bot ?',
          a: 'Oui, avec un webhook créé dans les paramètres du salon, mais il faut un outil pour écrire le message en JSON et l’envoyer. Un compte utilisateur, lui, ne peut pas',
        },
        {
          q: 'Comment modifier un embed déjà envoyé ?',
          a: 'Dans Messages enrichis, colle l’ID du message dans le champ Message ID, change ce que tu veux et publie. Ça ne marche que pour un message envoyé par Kotbo, Discord n’autorise pas un bot à modifier les messages des autres',
        },
        {
          q: 'Combien de champs peut avoir un embed Discord ?',
          a: 'Discord accepte jusqu’à 25 champs par embed. L’éditeur de Kotbo bloque le bouton Ajouter un champ une fois la limite atteinte',
        },
        {
          q: 'Quelle commande pour faire parler un bot sur Discord ?',
          a: 'Avec Kotbo, /say envoie ton texte au nom du bot dans le salon choisi. Ajoute un titre ou une couleur pour qu’il parte en embed',
        },
        {
          q: 'Comment programmer un message sur Discord ?',
          a: 'Discord ne programme pas les messages d’un salon. Avec Kotbo, crée un Message programmé dans Tâches planifiées, choisis le salon, le texte, l’embed et la fréquence',
        },
      ],
    },
    en: {
      title: 'How to make an embed on Discord, no code',
      h1: 'How to make an embed on Discord: a visual builder with a live preview',
      description:
        'How to make an embed on Discord: why your account can’t send one, then a visual embed builder with Kotbo, the /say command and scheduled messages for your server.',
      lead: 'An embed is the boxed message with a colored bar, a title, fields and sometimes an image. Your Discord account can’t send one: only bots and webhooks can. With Kotbo, you build it on the dashboard with a live preview, then it posts it in the channel you pick',
      sections: [
        {
          h2: 'Why you can’t make an embed yourself',
          body: 'The Discord client has no button to create an embed. Paste a link and Discord shows a preview, but you choose neither its title nor its color. That leaves two routes',
          items: [
            { title: 'A webhook', body: 'In a channel’s settings, Integrations, Webhooks, Discord gives you an address that accepts embeds. You still need a tool to write and send the message, and editing it later means going back through that tool' },
            { title: 'A bot', body: 'It posts the embed for you, can edit it later, and lets you build it in an interface instead of writing JSON' },
          ],
        },
        {
          h2: 'What an embed can hold',
          body: 'Every block is optional, but an empty embed won’t send. Here is what Kotbo’s builder fills in, in the order Discord displays it',
          points: [
            'Plain text above the box, for a ping or a hook line',
            'An author, with an icon and a link on the name',
            'A title, clickable if you give it a URL, and a description',
            'The color of the side bar',
            'A thumbnail at the top right and a large image at the bottom',
            'Up to 25 fields, each with a title and a value, inline or stacked',
            'A footer with its icon, and the timestamp',
          ],
        },
        {
          h2: 'How to build a Discord embed with Kotbo',
          body: 'It happens on dash.kotbo.fr, Rich messages page',
          steps: [
            { title: 'Pick the channel', body: 'The list shows your server’s channels. Kotbo needs permission to post there' },
            { title: 'Fill in the blocks', body: 'Title, description, color, images, fields. The preview on the right updates as you type, rendered like Discord' },
            { title: 'Save a template if you reuse it', body: 'The Save button keeps the embed in My Templates. Templates stay in your browser, on that device' },
            { title: 'Publish', body: 'The Publish embed button sends it. The sent message’s ID fills in on its own' },
            { title: 'Fix it later', body: 'Keep that ID in the Message ID field to edit the message in place. Discord only lets a bot edit its own messages: with another ID, Kotbo posts a new message' },
          ],
        },
        {
          h2: 'A quick embed without leaving Discord',
          body: 'For a short announcement, the /say command is enough. By default it’s limited to members who can manage messages',
          commands: [
            { name: '/say message:<text> salon:<channel>', body: 'The message option is required, salon picks where it goes, the current channel otherwise. With a titre, a couleur or anonyme, it goes out as an embed. With none of the three, it goes out as plain text from the bot' },
            { name: '/say titre:<title> couleur:<color>', body: 'A title turns the message into an embed. Seven colors to pick from: blue by default, green, red, yellow, purple, dark or white' },
            { name: '/say anonyme:True', body: 'Removes your name from the embed footer. Otherwise, the footer shows who sent it' },
          ],
        },
        {
          h2: 'Scheduling an announcement',
          body: 'A weekly announcement doesn’t need you every week. The Scheduled tasks page has a scheduled message type',
          points: [
            'A text, an optional embed with title, description, color and image, and the target channel',
            'Hourly, daily, weekly, monthly, or a custom cron expression',
            'A send-once option, for a dated message that shouldn’t come back next year',
            'Mentions are off by default: a repeating message won’t ping the whole server by accident',
          ],
        },
        {
          h2: 'Going further: campaigns and news',
          body: 'Two modules take over when one announcement isn’t enough',
          items: [
            { title: 'Campaigns', body: 'A series of messages placed around a start date, teaser included, sent in a channel or by DM. The audience filters by roles, level, time on the server or inactivity, and each step reports successful sends, failures and reactions' },
            { title: 'News', body: 'Staff writes announcements and release notes on the dashboard. Each one goes to its category’s channel and to a public RSS feed' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do you make an embed on Discord?',
          a: 'Your account can’t send one, you need a bot or a webhook. With Kotbo, open the Rich messages page on the dashboard, fill in the blocks while watching the preview, pick the channel and publish',
        },
        {
          q: 'Can you send an embed without a bot?',
          a: 'Yes, with a webhook created in the channel settings, but you need a tool to write the message as JSON and send it. A user account can’t',
        },
        {
          q: 'How do I edit an embed that’s already posted?',
          a: 'In Rich messages, paste the message ID in the Message ID field, change what you need and publish. It only works on a message Kotbo sent, Discord doesn’t let a bot edit other people’s messages',
        },
        {
          q: 'How many fields can a Discord embed have?',
          a: 'Discord accepts up to 25 fields per embed. Kotbo’s builder disables the add field button once you hit the limit',
        },
        {
          q: 'What command makes a bot say something on Discord?',
          a: 'With Kotbo, /say posts your text as the bot in the channel you pick. Add a titre or a couleur and it goes out as an embed',
        },
        {
          q: 'How do I schedule a message on Discord?',
          a: 'Discord doesn’t schedule channel messages. With Kotbo, create a scheduled message in Scheduled tasks, then pick the channel, the text, the embed and the frequency',
        },
      ],
    },
  },
};

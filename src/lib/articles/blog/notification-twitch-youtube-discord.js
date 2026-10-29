/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'notification-twitch-youtube-discord', en: 'discord-twitch-youtube-notifications' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['social_networks', 'twitch', 'youtube'],
  text: {
    fr: {
      title: 'Notification Twitch et YouTube sur Discord',
      h1: 'Notification Twitch et YouTube sur Discord : annoncer tes lives et tes vidéos',
      description:
        'Notification Twitch et YouTube sur Discord : ce que Discord ne fait pas seul, puis les alertes de live, vidéo et Short avec Kotbo, avec le rôle à ping au choix.',
      lead: 'Discord ne prévient pas ton serveur quand tu lances un live Twitch ou que tu publies une vidéo YouTube : il faut un bot qui surveille la chaîne. Avec Kotbo, tu ajoutes la chaîne sur le dashboard, tu choisis le salon et le rôle à ping, et l’annonce part toute seule',
      sections: [
        {
          h2: 'Ce que Discord fait, et ce qu’il ne fait pas',
          body: 'Dans Paramètres du serveur, Intégrations, tu peux relier Twitch ou YouTube. Ça sert à donner un rôle à tes abonnés ou à tes membres de chaîne, pas à annoncer tes contenus. Pour poster une alerte quand un live démarre, il faut un bot qui regarde la chaîne à intervalle régulier',
          points: [
            'L’intégration native synchronise des rôles d’abonnés, elle ne poste aucun message',
            'Aucune alerte native pour un nouveau live, une nouvelle vidéo ou un nouveau Short',
            'Un webhook seul ne sait pas quand tu passes en live : il faut quelque chose qui vérifie à ta place',
          ],
        },
        {
          h2: 'Ce que Kotbo annonce',
          body: 'La page Réseaux sociaux du dashboard regroupe quatre onglets. Kotbo vérifie les comptes suivis toutes les 5 minutes et poste dans le salon choisi',
          items: [
            { title: 'YouTube', body: 'Trois types d’alerte, chacune avec son message : Live, Vidéo et Short. Kotbo sait distinguer un Short d’une vidéo classique, et l’annonce porte un bouton qui ouvre la vidéo' },
            { title: 'Twitch', body: 'Une alerte au passage en live, avec le titre du stream, le jeu, le nombre de spectateurs et la miniature. Un même live n’est jamais annoncé deux fois' },
            { title: 'GitHub', body: 'Commits d’une branche, releases, pull requests et issues d’un dépôt public, chaque type activable à part. Un serveur peut suivre jusqu’à 15 dépôts' },
            { title: 'Hugging Face', body: 'Les nouveaux commits d’un modèle, d’un dataset ou d’un space, ou les nouveaux dépôts d’un auteur. Jusqu’à 25 suivis par serveur' },
          ],
        },
        {
          h2: 'Mettre en place une notification Twitch ou YouTube',
          body: 'Tout se règle sur dash.kotbo.fr, sans commande à taper',
          steps: [
            { title: 'Allume les modules', body: 'Dans Modules, active YouTube ou Twitch. Ils sont éteints par défaut, et la page Réseaux sociaux te prévient tant qu’ils ne tournent pas' },
            { title: 'Ajoute la chaîne', body: 'Onglet YouTube : colle l’URL, le handle ou le nom de la chaîne. Onglet Twitch : le pseudo ou le lien twitch.tv' },
            { title: 'Choisis le salon des alertes', body: 'Sans choix, Kotbo poste dans le salon public du serveur. Vérifie qu’il a le droit d’écrire dans le salon visé' },
            { title: 'Choisis qui ping', body: 'Le champ Mention propose @everyone, @here ou un rôle du serveur. Laisse vide pour une annonce sans notification' },
            { title: 'Écris tes messages', body: 'Un message par type d’alerte, ou rien pour garder celui par défaut. Les variables [title] et [channel] reprennent le titre et le nom de la chaîne' },
          ],
        },
        {
          h2: 'Personnaliser le message d’annonce',
          body: 'Le message par défaut fait le travail, mais une annonce qui sonne comme toi donne plus envie de cliquer. Quelques règles utiles',
          points: [
            'Sur YouTube, le Live, la Vidéo et le Short ont chacun leur message : un live peut ping tout le monde, un Short rester discret',
            'Sur Twitch, [game] et [viewers] ajoutent le jeu et le nombre de spectateurs au texte',
            'Si ton message contient [title], il remplace aussi le titre de l’encadré',
            'Un titre de vidéo qui contient @everyone ne ping personne : seule la mention que tu as réglée notifie',
          ],
        },
        {
          h2: 'Pourquoi une vieille vidéo n’est pas annoncée',
          body: 'Quand tu ajoutes une chaîne YouTube, Kotbo note la dernière vidéo publiée sans l’annoncer : il ne va pas ressortir tout ton historique. Ensuite, une vidéo publiée il y a plus de 24 heures n’est pas annoncée non plus. Côté Twitch, la fin du live remet le suivi à zéro, et le live suivant repart avec une nouvelle annonce',
        },
      ],
      faq: [
        {
          q: 'Comment mettre une notification Twitch sur Discord ?',
          a: 'Il faut un bot qui surveille la chaîne, Discord ne le fait pas seul. Avec Kotbo, active le module Twitch, ajoute le pseudo dans l’onglet Twitch de la page Réseaux sociaux, puis choisis le salon et le rôle à ping',
        },
        {
          q: 'Comment annoncer une nouvelle vidéo YouTube sur Discord ?',
          a: 'Active le module YouTube dans Kotbo, puis colle l’URL, le handle ou le nom de la chaîne dans l’onglet YouTube. Chaque nouvelle vidéo, chaque Short et chaque live part dans le salon choisi',
        },
        {
          q: 'À quelle fréquence Kotbo vérifie-t-il les chaînes ?',
          a: 'Toutes les 5 minutes, pour YouTube, Twitch, GitHub et Hugging Face. Une annonce peut donc arriver quelques minutes après le début du live',
        },
        {
          q: 'Est-ce que je peux ping un rôle plutôt que @everyone ?',
          a: 'Oui. Le champ Mention propose @everyone, @here et tous les rôles du serveur. Un rôle « Notifs live » que les membres prennent eux-mêmes évite de déranger ceux qui ne veulent pas',
        },
        {
          q: 'Est-ce que Kotbo annonce les Shorts YouTube ?',
          a: 'Oui. Kotbo distingue un Short d’une vidéo classique et utilise le message Short que tu as écrit, ou celui par défaut',
        },
        {
          q: 'Est-ce que Kotbo lit les flux RSS ?',
          a: 'Non. Le module Actualités fait l’inverse : le staff y rédige ses annonces, publiées sur Discord et dans un flux RSS que d’autres peuvent suivre',
        },
      ],
    },
    en: {
      title: 'Discord Twitch and YouTube notifications',
      h1: 'Discord Twitch and YouTube notifications: announce your streams and videos',
      description:
        'Discord Twitch and YouTube notifications: what Discord won’t do on its own, then live, video and Short alerts with Kotbo, pinging the role of your choice.',
      lead: 'Discord doesn’t tell your server when you go live on Twitch or upload to YouTube: you need a bot that watches the channel. With Kotbo, you add the channel on the dashboard, pick the channel to post in and the role to ping, and the announcement goes out on its own',
      sections: [
        {
          h2: 'What Discord does, and what it doesn’t',
          body: 'In Server Settings, Integrations, you can connect Twitch or YouTube. That links a role to your subscribers or channel members, it doesn’t announce your content. To post an alert when a stream starts, you need a bot that checks the channel at regular intervals',
          points: [
            'The native integration syncs subscriber roles, it posts no message',
            'No native alert for a new stream, a new video or a new Short',
            'A webhook alone can’t tell when you go live: something has to check for you',
          ],
        },
        {
          h2: 'What Kotbo announces',
          body: 'The Social networks page on the dashboard has four tabs. Kotbo checks followed accounts every 5 minutes and posts in the channel you picked',
          items: [
            { title: 'YouTube', body: 'Three alert types, each with its own message: Live, Video and Short. Kotbo tells a Short from a regular video, and the alert carries a button that opens it' },
            { title: 'Twitch', body: 'An alert when the stream starts, with the stream title, the game, the viewer count and the thumbnail. The same stream is never announced twice' },
            { title: 'GitHub', body: 'Commits on a branch, releases, pull requests and issues from a public repository, each type on its own toggle. A server can follow up to 15 repositories' },
            { title: 'Hugging Face', body: 'New commits on a model, dataset or space, or new repositories from an author. Up to 25 follows per server' },
          ],
        },
        {
          h2: 'How to set up Twitch or YouTube notifications on Discord',
          body: 'Everything happens on dash.kotbo.fr, no command to type',
          steps: [
            { title: 'Turn the modules on', body: 'In Modules, turn on YouTube or Twitch. They are off by default, and the Social networks page warns you until they run' },
            { title: 'Add the channel', body: 'YouTube tab: paste the URL, the handle or the channel name. Twitch tab: the username or the twitch.tv link' },
            { title: 'Pick the alerts channel', body: 'Leave it empty and Kotbo posts in the server’s public channel. Make sure it can send messages in the channel you pick' },
            { title: 'Pick who gets pinged', body: 'The Mention field offers @everyone, @here or any server role. Leave it empty for an alert that pings nobody' },
            { title: 'Write your messages', body: 'One message per alert type, or none to keep the default. The [title] and [channel] variables insert the title and the channel name' },
          ],
        },
        {
          h2: 'Customizing the announcement',
          body: 'The default message works, but an alert that sounds like you gets more clicks. A few useful rules',
          points: [
            'On YouTube, Live, Video and Short each have their own message: a stream can ping everyone while a Short stays quiet',
            'On Twitch, [game] and [viewers] add the game and the viewer count to the text',
            'If your message contains [title], it also replaces the title of the embed',
            'A video title containing @everyone pings nobody: only the mention you set sends a notification',
          ],
        },
        {
          h2: 'Why an old video isn’t announced',
          body: 'When you add a YouTube channel, Kotbo records the latest upload without announcing it, so your whole back catalog doesn’t flood the server. After that, a video published more than 24 hours ago isn’t announced either. On Twitch, the end of a stream resets the follow, and the next stream gets a fresh alert',
        },
      ],
      faq: [
        {
          q: 'How do I get Twitch notifications on Discord?',
          a: 'You need a bot that watches the channel, Discord doesn’t do it on its own. With Kotbo, turn on the Twitch module, add the username in the Twitch tab of the Social networks page, then pick the channel and the role to ping',
        },
        {
          q: 'How do I announce new YouTube videos on Discord?',
          a: 'Turn on the YouTube module in Kotbo, then paste the URL, handle or channel name in the YouTube tab. Every new video, Short and stream goes to the channel you picked',
        },
        {
          q: 'How often does Kotbo check channels?',
          a: 'Every 5 minutes, for YouTube, Twitch, GitHub and Hugging Face. An alert can land a few minutes after the stream starts',
        },
        {
          q: 'Can I ping a role instead of @everyone?',
          a: 'Yes. The Mention field offers @everyone, @here and every server role. A “Live alerts” role members pick for themselves leaves the others alone',
        },
        {
          q: 'Does Kotbo announce YouTube Shorts?',
          a: 'Yes. Kotbo tells a Short from a regular video and uses the Short message you wrote, or the default one',
        },
        {
          q: 'Does Kotbo read RSS feeds?',
          a: 'No. The News module goes the other way: your staff writes announcements there, posted on Discord and in an RSS feed others can follow',
        },
      ],
    },
  },
};

/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'statistiques-serveur-discord', en: 'discord-server-stats' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['analytics', 'channel_health'],
  text: {
    fr: {
      title: 'Statistiques serveur Discord : voir l’activité',
      h1: 'Statistiques de serveur Discord : voir qui parle, où et quand',
      description:
        'Statistiques serveur Discord : ce que montre Server Insights, puis messages, vocal, arrivées et santé des salons avec Kotbo, sur le dashboard et en commande slash.',
      lead: 'Pour voir l’activité de ton serveur Discord, tu as deux sources : Server Insights, l’outil de Discord réservé aux serveurs éligibles, et un bot qui compte lui-même les messages, le vocal et les arrivées. Kotbo fait le second, avec des commandes slash pour un coup d’œil et le dashboard pour creuser',
      sections: [
        {
          h2: 'Ce que Discord montre nativement',
          body: 'Discord propose Server Insights aux serveurs Communauté qui remplissent ses critères d’éligibilité. Quand tu y as accès, il se trouve dans les paramètres du serveur et donne une bonne vue d’ensemble',
          points: [
            'Croissance : arrivées, départs, rétention des nouveaux',
            'Engagement : membres qui écrivent et qui parlent en vocal',
            'Les chiffres restent agrégés, sans fiche par membre ni alerte',
            'Si ton serveur n’est pas éligible, tu n’as rien de natif',
          ],
        },
        {
          h2: 'Les statistiques en commande slash',
          body: 'Pour un coup d’œil sans quitter Discord. Les deux premières dépendent du module Statistiques, la troisième du module Santé des salons, tous deux allumés par défaut',
          commands: [
            { name: '/serverstats', body: 'Une image avec les messages, les minutes de vocal, les nouveaux membres, les membres actifs et le total du serveur. L’option periode choisit 7, 30 ou 90 jours, 30 par défaut' },
            { name: '/stats', body: 'Les mêmes chiffres pour un membre : messages, minutes de vocal, jours actifs et meilleure journée, avec la courbe. Sans option membre, ce sont les tiennes' },
            { name: '/channelhealth analyse', body: 'Classe tes salons en sains, surchargés, sous-utilisés ou morts, avec les cinq plus actifs. Réservée aux administrateurs par défaut' },
          ],
        },
        {
          h2: 'Le détail sur le dashboard',
          body: 'La page Statistiques de dash.kotbo.fr va plus loin que les commandes. Quelques onglets parmi d’autres',
          items: [
            { title: 'Messages, Vocal et Heures d’activité', body: 'Les volumes jour par jour et la carte des heures où ton serveur vit vraiment, pour caler un événement au bon moment' },
            { title: 'Comparer et Semaine vs semaine', body: 'Deux périodes côte à côte, pour savoir si ton dernier événement a changé quelque chose' },
            { title: 'Membres silencieux', body: 'Sépare les comptes abandonnés des membres qui lisent, écoutent en vocal ou réagissent sans écrire' },
            { title: 'Cohortes et Départs', body: 'Combien de nouveaux restent, et quand les autres décrochent' },
            { title: 'Temps de réponse', body: 'Le délai avant qu’un message reçoive une réponse, utile pour voir les salons où les questions restent dans le vide' },
          ],
        },
        {
          h2: 'Un score de santé chaque matin',
          body: 'La page Santé du serveur donne une note sur 100, calculée chaque nuit sur la journée écoulée, avec sa tendance. Elle se décompose en cinq notes : activité, engagement, croissance, modération et santé, cette dernière tenant compte des salons et des tickets. En dessous, des alertes en clair quand quelque chose décroche : départs qui dépassent les arrivées, tickets qui s’accumulent, salons à surveiller. Le premier score arrive après une journée complète, pas avant',
        },
        {
          h2: 'Repérer les salons morts et surchargés',
          body: 'Le module Santé des salons tourne sur les mêmes données. Une fois activé, il envoie un rapport dans le salon que tu choisis et propose quoi faire de chaque salon',
          steps: [
            { title: 'Active le moniteur', body: 'Tape /channelhealth activer et choisis le salon-alertes qui recevra les rapports' },
            { title: 'Choisis la période d’analyse', body: 'Avec /channelhealth config, l’option periode va de 7 à 90 jours' },
            { title: 'Décide du mode', body: 'Notification seulement ou Automatique, séparément pour les salons surchargés et pour les salons morts' },
            { title: 'Archive à la main si tu préfères', body: '/channelhealth archiver déplace un salon dans la catégorie d’archives et le passe en lecture seule' },
          ],
        },
        {
          h2: 'La fiche de chaque membre',
          body: 'Dans la page Membres, chaque fiche montre l’activité du membre dans le temps, à côté de son historique sur le serveur. Pratique avant de proposer quelqu’un au staff',
          figure: { screen: 'members', caption: 'La liste des membres et une fiche avec ses courbes d’activité, sur un serveur de démo' },
        },
      ],
      faq: [
        {
          q: 'Comment voir les statistiques de son serveur Discord ?',
          a: 'Si ton serveur est éligible, Server Insights dans les paramètres du serveur donne les grandes tendances. Avec Kotbo, /serverstats affiche le résumé dans Discord et la page Statistiques du dashboard donne le détail',
        },
        {
          q: 'Pourquoi je n’ai pas Server Insights sur mon serveur ?',
          a: 'Discord le réserve aux serveurs Communauté qui remplissent ses critères d’éligibilité. Un bot comme Kotbo compte l’activité lui-même, donc il marche sur n’importe quel serveur',
        },
        {
          q: 'Comment voir les statistiques d’un membre sur Discord ?',
          a: 'Avec Kotbo, tape /stats et choisis le membre. Tu obtiens ses messages, ses minutes de vocal, ses jours actifs et sa courbe sur 7, 30 ou 90 jours',
        },
        {
          q: 'Quel bot pour les statistiques d’un serveur Discord ?',
          a: 'Kotbo compte les messages, le vocal, les arrivées et les départs, puis les montre en commande slash et sur un dashboard web. Le même bot gère aussi la modération, les tickets et le staff',
        },
        {
          q: 'Comment trouver les salons inactifs de mon serveur ?',
          a: 'Tape /channelhealth analyse : Kotbo classe chaque salon en sain, surchargé, sous-utilisé ou mort. Le moniteur peut ensuite te les signaler ou archiver les salons morts tout seul',
        },
        {
          q: 'Est-ce que les membres peuvent voir leurs propres statistiques ?',
          a: 'Oui, /stats sans option affiche celles de la personne qui tape la commande. /channelhealth reste réservée aux administrateurs',
        },
      ],
    },
    en: {
      title: 'Discord server stats: see your server’s activity',
      h1: 'Discord server stats: see who talks, where and when',
      description:
        'Discord server stats: what Server Insights shows, then messages, voice, joins and channel health with Kotbo, on a web dashboard and through slash commands.',
      lead: 'To see your Discord server’s activity you have two sources: Server Insights, Discord’s own tool for eligible servers, and a bot that counts messages, voice and joins itself. Kotbo is the second, with slash commands for a quick look and a dashboard to dig in',
      sections: [
        {
          h2: 'What Discord shows natively',
          body: 'Discord offers Server Insights to Community servers that meet its eligibility criteria. When you have it, it lives in your server settings and gives a solid overview',
          points: [
            'Growth: joins, leaves, new member retention',
            'Engagement: members who chat and who talk in voice',
            'Numbers stay aggregated, with no per-member view and no alerts',
            'If your server isn’t eligible, there’s nothing native',
          ],
        },
        {
          h2: 'Server stats as slash commands',
          body: 'For a quick look without leaving Discord. The first two belong to the Statistics module, the third to the Channel health module, both on by default',
          commands: [
            { name: '/serverstats', body: 'An image with messages, voice minutes, new members, active members and the server total. The periode option picks 7, 30 or 90 days, 30 by default' },
            { name: '/stats', body: 'The same numbers for one member: messages, voice minutes, active days and best day, with the curve. Without the membre option, you get your own' },
            { name: '/channelhealth analyse', body: 'Sorts your channels into healthy, overloaded, underused or dead, with the five most active. Admins only by default' },
          ],
        },
        {
          h2: 'The detail on the dashboard',
          body: 'The Statistics page on dash.kotbo.fr goes further than the commands. A few tabs among many',
          items: [
            { title: 'Messages, Voice and Activity hours', body: 'Daily volumes and a map of the hours your server is actually alive, to schedule an event at the right time' },
            { title: 'Compare and Week over week', body: 'Two periods side by side, to see whether your last event changed anything' },
            { title: 'Silent members', body: 'Tells abandoned accounts apart from members who read, listen in voice or react without typing' },
            { title: 'Cohorts and Departures', body: 'How many newcomers stay, and when the others drop off' },
            { title: 'Response time', body: 'How long a message waits for a reply, handy to spot channels where questions go unanswered' },
          ],
        },
        {
          h2: 'A health score every morning',
          body: 'The Server health page gives a score out of 100, computed every night on the day that just ended, with its trend. It breaks down into five scores: activity, engagement, growth, moderation and health, the last one covering channels and tickets. Below it, plain-language alerts when something slips: more leaves than joins, tickets piling up, channels to watch. The first score shows up after one full day, not before',
        },
        {
          h2: 'Spotting dead and overloaded channels',
          body: 'The Channel health module runs on the same data. Once on, it sends a report to the channel you pick and suggests what to do with each channel',
          steps: [
            { title: 'Turn the monitor on', body: 'Type /channelhealth activer and pick the salon-alertes channel that receives reports' },
            { title: 'Set the analysis window', body: 'With /channelhealth config, the periode option goes from 7 to 90 days' },
            { title: 'Choose the mode', body: 'Notify only or Automatic, separately for overloaded channels and for dead ones' },
            { title: 'Archive by hand if you prefer', body: '/channelhealth archiver moves a channel to the archive category and makes it read-only' },
          ],
        },
        {
          h2: 'Every member’s profile',
          body: 'On the Members page, each profile shows the member’s activity over time, next to their history on the server. Handy before suggesting someone for staff',
          figure: { screen: 'members', caption: 'The member list and a profile with its activity curves, on a demo server' },
        },
      ],
      faq: [
        {
          q: 'How do I see stats for my Discord server?',
          a: 'If your server is eligible, Server Insights in the server settings shows the big trends. With Kotbo, /serverstats gives a summary inside Discord and the Statistics page on the dashboard gives the detail',
        },
        {
          q: 'Why don’t I have Server Insights?',
          a: 'Discord keeps it for Community servers that meet its eligibility criteria. A bot like Kotbo counts activity itself, so it works on any server',
        },
        {
          q: 'How do I check a member’s activity on Discord?',
          a: 'With Kotbo, type /stats and pick the member. You get their messages, voice minutes, active days and curve over 7, 30 or 90 days',
        },
        {
          q: 'What is a good Discord analytics bot?',
          a: 'Kotbo counts messages, voice, joins and leaves, then shows them through slash commands and on a web dashboard. The same bot also handles moderation, tickets and staff',
        },
        {
          q: 'How do I find inactive channels on my server?',
          a: 'Type /channelhealth analyse: Kotbo sorts each channel into healthy, overloaded, underused or dead. The monitor can then flag them for you or archive dead channels on its own',
        },
        {
          q: 'Can members see their own stats?',
          a: 'Yes, /stats with no option shows the stats of whoever types it. /channelhealth stays admins only',
        },
      ],
    },
  },
};

/**
 * Les notes de version, une par mise à jour, de la plus récente à la plus
 * ancienne. Chacune est un article (`/nouveautes/<slug>`, `/en/whats-new/<slug>`),
 * l'index `/nouveautes` les liste.
 *
 * Le texte reprend les releases GitHub de `Kotbo-Bot/Kotbo` (le tag est dans
 * `tag`), réécrit pour un admin de serveur : ce qui change pour lui, sans le
 * détail technique. Rien n'y est ajouté qui ne soit pas dans la release.
 *
 * JavaScript simple plutôt que TypeScript : `seo/jsonld.js` lit ces notes au
 * build pour la CSP, il doit pouvoir les importer sans Vite (comme `faq.js`).
 * Une nouvelle version s'ajoute en tête du tableau : l'accueil annonce la
 * première (`teaser`).
 */

/**
 * @typedef {{ title: string, body: string }} ReleaseItem
 * @typedef {{ h2: string, body: string, points?: string[], items?: ReleaseItem[], figure?: { screen: 'tickets', caption: string } }} ReleaseSection
 * @typedef {{ h1: string, description: string, lead: string, teaser?: string, sections: ReleaseSection[], faq?: { q: string, a: string }[] }} ReleaseText
 * @typedef {{ version: string, slug: string, tag: string, date: string, text: { fr: ReleaseText, en: ReleaseText } }} Release
 */

/** @type {Release[]} */
export const RELEASES = [
  {
    version: '9.5',
    slug: '9-5',
    tag: 'v9.5',
    date: '2026-10-24',
    text: {
      fr: {
        h1: 'Kotbo 9.5 : le site de ton serveur, AegisAI et le centre de support',
        description:
          'Kotbo 9.5 : site communautaire et boutique, détection des insultes par l’IA AegisAI, tickets façon centre de support, fiche membre complète, simulateur d’AutoMod et Pulse refait.',
        teaser: 'Kotbo 9.5 est là : ton serveur a son site, AegisAI lit le ton des messages et les tickets passent en centre de support',
        lead: 'La 9.5 sort Kotbo de Discord : ton serveur peut publier son site, avec sa boutique. Côté modération, une IA lit le ton des messages et une règle d’AutoMod se teste avant d’être activée. Côté staff, les tickets deviennent un centre de support et chaque membre a sa fiche',
        sections: [
          {
            h2: 'Ton serveur a son site',
            body: 'Kotbo compose un site pour ton serveur en un clic, à l’adresse dash.kotbo.fr/s/ton-serveur, et le remplit avec ce qui se passe déjà sur Discord',
            points: [
              'Un éditeur visuel où plusieurs membres du staff écrivent en même temps, avec wiki et blog',
              'Des blocs pour chaque module : membres, vocaux, règlement, classements, clans, giveaways, événements, recrutement, tickets, suggestions…',
              'Un forum recopié dans les deux sens avec tes salons forum Discord',
              'Les votes Top.gg et annuaires, vérifiés et récompensés, avec le classement des meilleurs votants',
              'Un espace membre : récompenses, quêtes, candidatures, achats et tickets',
              'Les annonces Discord publiées sur le site toutes seules, et une mesure de fréquentation sans cookie',
              'Des thèmes clair et sombre, et une galerie de thèmes partagés entre serveurs',
            ],
          },
          {
            h2: 'Une boutique en monnaie du bot',
            body: 'Le site et la commande /boutique vendent ce que tu veux contre la monnaie du serveur',
            points: [
              'Rôles permanents, temporaires ou en abonnement, objets RPG, XP, ou une prestation livrée à la main par le staff',
              'Stock, codes promo, journal des ventes',
              'Validation par le staff, avec remboursement si la commande est refusée',
            ],
          },
          {
            h2: 'AegisAI repère les insultes que les listes de mots ratent',
            body: 'Kotbo s’associe à AegisAI, une API qui note la toxicité et l’émotion de chaque message. Une liste de mots bannis rate les fautes volontaires et les phrases polies mais méchantes, AegisAI les voit. Le module s’active serveur par serveur, depuis sa page dans Sécurité',
            items: [
              { title: 'Selon ta sensibilité', body: 'Un message très toxique est retiré et sanctionné. Dans la zone grise, le staff reçoit une carte avec Confirmer et Faux positif' },
              { title: 'Une preuve à chaque sanction', body: 'La transcription du salon est prise avant le retrait, avec un bouton « Preuve » sur la carte du staff' },
              { title: 'Conflits, harcèlement, détresse', body: 'Une dispute qui monte passe le salon en mode lent. Un membre visé par plusieurs autres, même sur des semaines, est signalé. Un message de détresse alerte le staff, sans sanction' },
              { title: 'Pseudos et modifications', body: 'Un pseudo toxique est remplacé puis sanctionné, et un message modifié est relu' },
              { title: 'Le climat du serveur', body: 'Une section Climat dans Analytics, une carte Climat dans la fiche membre et l’humeur du demandeur dans les tickets' },
              { title: 'Les modos aussi', body: 'Un membre exempté n’est jamais sanctionné d’office : son message part en revue' },
            ],
          },
          {
            h2: 'Tester une règle avant de l’activer',
            body: 'Le simulateur rejoue une règle d’AutoMod sur les messages déjà passés et la compare à la version en service, exemples surlignés. Un bouton Tester est posé sur chaque filtre',
            points: [
              'Nouvelle action Censurer : le message est republié masqué au lieu d’être supprimé',
              'Mode lent du salon quand plusieurs membres spamment ensemble, et repérage du gros message collé après une frappe trop courte',
              'Anti-arnaque nourri par le salon piège : faux giveaways, faux recrutements « revenu facile », et lecture des images sur place, activable par serveur',
              'Le ghost ping ne prévient plus si la cible a déjà répondu ou si la mention a plus d’une heure',
            ],
          },
          {
            h2: 'Les tickets deviennent un centre de support',
            body: 'Une boîte de réception avec des vues, et chaque ticket avec ses propriétés',
            points: [
              'Vues, recherche, tri, attribution, priorité, étiquettes et objectifs de délai',
              'Le profil de l’auteur à côté de la conversation, comme sur Discord',
              'Relance du staff quand un membre attend, et le compte des tickets restés sans réponse',
              'Une file d’attente quand le serveur atteint les limites de salons de Discord, qui reprend dès qu’une place se libère',
              'Un avertissement d’enregistrement à lire avant l’ouverture, et les demandes en attente validées depuis le dashboard',
              'Un onglet Performance : délais médians, objectifs tenus, satisfaction, charge par membre du staff',
            ],
            figure: { screen: 'tickets', caption: 'Le centre de support sur un serveur fictif. Ouvre Paramètres › Inactivité pour la relance du staff' },
          },
          {
            h2: 'Pour le staff',
            body: 'Le reste du dashboard a beaucoup bougé',
            items: [
              { title: 'Fiche membre complète', body: 'Une page entière par membre : signaux d’attention, niveau, réputation, économie, invitations, chronologie et relations. Salons, catégories et invitations ont la leur' },
              { title: 'Pulse v3', body: 'La note tient compte du jour, de la taille du serveur, des réponses et de la fidélité, explique ce qui la fait bouger, se compare aux serveurs de ta taille et prévient quand elle chute' },
              { title: 'Notifications refaites', body: 'Une seule boîte pour tous tes serveurs, un choix par type, des sons, des notifications de bureau, les MP regroupés et un résumé quotidien' },
              { title: 'Tests A/B d’accueil', body: 'Plusieurs messages de bienvenue tirés au hasard, les résultats, et la gagnante appliquée en un clic' },
              { title: 'Webhooks sortants', body: 'Les événements du serveur envoyés, signés, vers ton propre outil, avec journal et renvoi' },
              { title: 'Un dashboard qui guide', body: 'Annuler au lieu d’une confirmation, des boutons grisés qui disent pourquoi, des écrans vides qui proposent la suite' },
            ],
          },
          {
            h2: 'Et sur le serveur',
            body: 'Côté Discord, en vrac',
            points: [
              'Vocaux temporaires : cinq modes de chat, une règle par rôle, et le salon transmis quand son propriétaire part',
              'Fils automatiques à plusieurs configurations par salon, et /fil renommer',
              'Messages sticky en JSON Discord, sous l’identité d’un webhook',
              'Un salon Image du jour, et une liste noire commune aux niveaux, au RPG et à l’économie',
              '/info devient une vraie fiche du serveur, et les invitations créées par un autre bot sont étiquetées seules',
              'Le module Partenariats, présenté en aperçu en 9.4, est mis en pause. Ses données sont gardées',
            ],
          },
        ],
        faq: [
          {
            q: 'Qu’est-ce qu’AegisAI fait des messages de mon serveur ?',
            a: 'Kotbo envoie le texte des messages à l’API AegisAI, qui renvoie une note de toxicité et une émotion. Le partage des messages pour entraîner le modèle se choisit serveur par serveur. Côté Kotbo, les extraits sont purgés selon la rétention de tes logs, les détections au bout d’un an et les totaux au bout de 400 jours',
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.5: your server’s website, AegisAI and the support desk',
        description:
          'Kotbo 9.5: a community website and shop, insult detection by the AegisAI model, support-desk tickets, full member profiles, an AutoMod simulator and a rebuilt Pulse.',
        teaser: 'Kotbo 9.5 is out: your server gets a website, AegisAI reads the tone of messages and tickets become a support desk',
        lead: '9.5 takes Kotbo beyond Discord: your server can publish its own website, with a shop. On the moderation side, an AI reads the tone of messages and an AutoMod rule can be tested before it goes live. For staff, tickets become a support desk and every member gets a profile page',
        sections: [
          {
            h2: 'Your server gets a website',
            body: 'Kotbo builds a website for your server in one click, at dash.kotbo.fr/s/your-server, and fills it with what already happens on Discord',
            points: [
              'A visual editor where several staff members write at the same time, with a wiki and a blog',
              'A block for each module: members, voice, rules, leaderboards, clans, giveaways, events, recruitment, tickets, suggestions…',
              'A forum mirrored both ways with your Discord forum channels',
              'Top.gg and directory votes, checked and rewarded, with a top voters leaderboard',
              'A member area: rewards, quests, applications, purchases and tickets',
              'Discord announcements posted to the site on their own, and cookie-free traffic stats',
              'Light and dark themes, and a gallery of themes shared between servers',
            ],
          },
          {
            h2: 'A shop in the bot’s currency',
            body: 'The website and the /boutique command sell whatever you want for the server’s currency',
            points: [
              'Permanent, temporary or subscription roles, RPG items, XP, or a service delivered by hand by staff',
              'Stock, promo codes, a sales log',
              'Staff approval, with a refund when an order is turned down',
            ],
          },
          {
            h2: 'AegisAI catches the insults word lists miss',
            body: 'Kotbo teams up with AegisAI, an API that scores the toxicity and emotion of every message. A banned-word list misses deliberate typos and polite but nasty sentences, AegisAI sees them. The module is turned on server by server, from its page under Security',
            items: [
              { title: 'Your sensitivity', body: 'A very toxic message is removed and sanctioned. In the grey zone, staff get a card with Confirm and False positive' },
              { title: 'Evidence with every sanction', body: 'The channel transcript is captured before removal, with an "Evidence" button on the staff card' },
              { title: 'Conflicts, harassment, distress', body: 'An escalating argument puts the channel in slow mode. A member targeted by several others, even over weeks, is flagged. A message of distress alerts staff, with no sanction' },
              { title: 'Nicknames and edits', body: 'A toxic nickname is replaced then sanctioned, and an edited message is read again' },
              { title: 'Server climate', body: 'A Climate section in Analytics, a Climate card on the member profile and the requester’s mood in tickets' },
              { title: 'Mods too', body: 'An exempt member is never sanctioned automatically: their message goes to review' },
            ],
          },
          {
            h2: 'Test a rule before you turn it on',
            body: 'The simulator replays an AutoMod rule on past messages and compares it with the version in service, with highlighted examples. Every filter has a Test button',
            points: [
              'A new Censor action: the message is reposted with the offending part hidden instead of deleted',
              'Slow mode when several members spam together, and detection of a big paste right after suspiciously short typing',
              'Anti-scam fed by the honeypot channel: fake giveaways, fake "easy money" job offers, and images read on the spot, opt-in per server',
              'Ghost ping alerts stop when the target has already replied or the mention is over an hour old',
            ],
          },
          {
            h2: 'Tickets become a support desk',
            body: 'An inbox with views, and every ticket with its own properties',
            points: [
              'Views, search, sorting, assignment, priority, tags and response targets',
              'The author’s profile next to the conversation, like on Discord',
              'Staff reminders when a member is waiting, and a count of unanswered tickets',
              'A queue when the server hits Discord’s channel limits, which resumes as soon as a slot frees up',
              'A recording notice to read before a ticket opens, and pending requests approved from the dashboard',
              'A Performance tab: median times, targets met, satisfaction, load per staff member',
            ],
            figure: { screen: 'tickets', caption: 'The support desk on a demo server. Open Settings › Inactivity for staff reminders' },
          },
          {
            h2: 'For staff',
            body: 'The rest of the dashboard moved a lot',
            items: [
              { title: 'Full member profiles', body: 'A whole page per member: attention signals, level, reputation, economy, invites, timeline and relations. Channels, categories and invites have theirs' },
              { title: 'Pulse v3', body: 'The score accounts for the day, server size, replies and loyalty, explains what moves it, compares with servers your size and warns you when it drops' },
              { title: 'Rebuilt notifications', body: 'One inbox for all your servers, a per-type choice, sounds, desktop notifications, grouped DMs and a daily digest' },
              { title: 'Welcome A/B tests', body: 'Several welcome messages drawn at random, the results, and the winner applied in one click' },
              { title: 'Outgoing webhooks', body: 'Server events sent, signed, to your own tool, with a log and resend' },
              { title: 'A dashboard that guides you', body: 'Undo instead of a confirmation, greyed-out buttons that say why, empty screens that suggest the next step' },
            ],
          },
          {
            h2: 'And on the server',
            body: 'On the Discord side, in no particular order',
            points: [
              'Temporary voice channels: five chat modes, a rule per role, and the channel handed over when its owner leaves',
              'Auto threads with several configurations per channel, and /fil renommer',
              'Sticky messages as Discord JSON, under a webhook identity',
              'An Image of the day channel, and one blocklist shared by levels, RPG and economy',
              '/info becomes a proper server card, and invites created by another bot get labelled on their own',
              'The Partnerships module, previewed in 9.4, is paused. Its data is kept',
            ],
          },
        ],
        faq: [
          {
            q: 'What does AegisAI do with my server’s messages?',
            a: 'Kotbo sends the text of messages to the AegisAI API, which returns a toxicity score and an emotion. Sharing messages to train the model is chosen server by server. On the Kotbo side, excerpts are purged according to your log retention, detections after a year and totals after 400 days',
          },
        ],
      },
    },
  },
  {
    version: '9.4',
    slug: '9-4',
    tag: 'v9.4',
    date: '2026-10-03',
    text: {
      fr: {
        h1: 'Kotbo 9.4 : la Tour, Analytics refait et des giveaways plus simples',
        description:
          'Kotbo 9.4 : la Tour, un mode roguelite pour le RPG, une page Analytics refaite avec alertes et rapports, des giveaways sur un seul formulaire et une vingtaine de déclencheurs de workflows.',
        lead: 'La 9.4 est la plus dense depuis la 9.0. Le RPG gagne un mode de fin de jeu, Analytics est refait de fond en comble, les giveaways tiennent sur un formulaire et l’accueil du dashboard montre ce qui attend le staff',
        sections: [
          {
            h2: 'La Tour, un mode roguelite pour le RPG',
            body: 'Avec /tour, les joueurs montent étage par étage sur une carte rendue en image, jusqu’à 300 étages',
            points: [
              'Boss, marchands, pièges, sanctuaires, mimiques, oracle, embuscades : une grosse variété de salles, avec décor et météo par étage',
              'Un défi du jour commun à tout le serveur, avec podium',
              'Une boutique où les éclats gagnés s’échangent contre des statistiques ou un changement de classe',
              'Une Tour de clan hebdomadaire, où les clans conquièrent des salles ensemble',
              'Un éditeur d’étages dans le dashboard pour dessiner ta propre Tour',
            ],
          },
          {
            h2: 'Un RPG plus fourni',
            body: 'Le reste du jeu suit',
            points: [
              'Arbre de compétences à trois branches par classe, accessoires forgeables, titres portés sur la carte du personnage',
              'Campagne en cinq chapitres, arène PvP classée, village de guilde, donjons et traque d’une créature',
              'Carnet de pêche, inventaire et bestiaire repensés, hôtel des ventes en un seul panneau',
              'Une série du daily qui augmente la récompense jour après jour',
            ],
          },
          {
            h2: 'Analytics refait',
            body: 'Une quinzaine de vues, pilotées par des tuiles de chiffres clés',
            points: [
              'Engagement, cohortes, temps de réponse, santé des salons, réseau de conversation, mots en hausse',
              'L’activité des 30 dernières minutes en temps réel',
              'Des alertes sur seuil et des rapports hebdomadaires ou mensuels envoyés au staff',
              'Des vues enregistrées, privées ou partagées',
            ],
          },
          {
            h2: 'Giveaways et workflows',
            body: 'Lancer un concours tient sur un formulaire',
            points: [
              'Un seul formulaire avec l’aperçu de l’annonce pendant la saisie, et une galerie de modèles',
              'Des lots RPG, des rôles avantagés, le bonus de clan et la validation du tirage par le staff',
              'Une vingtaine de déclencheurs de workflows en plus (sanctions, tickets, vocal, concours, formulaires) et sept actions',
              'Une limite par membre, par heure ou par jour, sur chaque workflow',
            ],
          },
          {
            h2: 'Pour le staff',
            body: 'Le dashboard dit ce qui attend',
            items: [
              { title: 'À traiter', body: 'L’accueil liste ce qui attend le staff, et les membres sans rôle de staff ont leur espace' },
              { title: 'Me guider', body: 'Un bouton amène jusqu’au réglage concerné et le met en évidence' },
              { title: 'Droits par rôle', body: 'Ce qu’un rôle peut voir, configurer ou supprimer est vérifié de bout en bout' },
              { title: 'Anti-raid', body: 'Ancienneté minimale des comptes à l’arrivée, et lockdown de salons qui rend les permissions d’origine' },
              { title: 'Carte de rang', body: 'Succès, badges, titres, cadres et fonds, réglables depuis /rank' },
              { title: 'Mode démonstration', body: 'Le dashboard entier sur un serveur fictif, avec visite guidée' },
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.4: the Tower, a rebuilt Analytics and simpler giveaways',
        description:
          'Kotbo 9.4: the Tower, a roguelite mode for the RPG, a rebuilt Analytics page with alerts and reports, giveaways on a single form and some twenty new workflow triggers.',
        lead: '9.4 is the densest release since 9.0. The RPG gets an endgame mode, Analytics is rebuilt from the ground up, giveaways fit on one form and the dashboard home shows what is waiting for staff',
        sections: [
          {
            h2: 'The Tower, a roguelite mode for the RPG',
            body: 'With /tour, players climb floor by floor on a map rendered as an image, up to 300 floors',
            points: [
              'Bosses, merchants, traps, shrines, mimics, an oracle, ambushes: lots of room types, with scenery and weather per floor',
              'A daily challenge shared by the whole server, with a podium',
              'A shop where earned shards buy stats or a class change',
              'A weekly clan Tower, where clans conquer rooms together',
              'A floor editor in the dashboard to draw your own Tower',
            ],
          },
          {
            h2: 'A richer RPG',
            body: 'The rest of the game follows',
            points: [
              'A three-branch skill tree per class, craftable accessories, titles shown on the character card',
              'A five-chapter campaign, ranked PvP arena, guild village, dungeons and creature hunts',
              'A fishing log, reworked inventory and bestiary, an auction house in a single panel',
              'A daily streak that grows the reward day after day',
            ],
          },
          {
            h2: 'Analytics rebuilt',
            body: 'Around fifteen views, driven by key-figure tiles',
            points: [
              'Engagement, cohorts, response times, channel health, conversation network, rising words',
              'Activity from the last 30 minutes in real time',
              'Threshold alerts and weekly or monthly reports sent to staff',
              'Saved views, private or shared',
            ],
          },
          {
            h2: 'Giveaways and workflows',
            body: 'Launching a giveaway fits on one form',
            points: [
              'A single form with a live preview of the announcement, and a template gallery',
              'RPG prizes, favoured roles, clan bonus and staff approval of the draw',
              'Some twenty new workflow triggers (sanctions, tickets, voice, giveaways, forms) and seven actions',
              'A per-member limit, per hour or per day, on every workflow',
            ],
          },
          {
            h2: 'For staff',
            body: 'The dashboard says what is waiting',
            items: [
              { title: 'To do', body: 'The home page lists what is waiting for staff, and members without a staff role get their own space' },
              { title: 'Guide me', body: 'A button takes you to the right setting and highlights it' },
              { title: 'Per-role permissions', body: 'What a role can view, configure or delete is enforced end to end' },
              { title: 'Anti-raid', body: 'Minimum account age on join, and channel lockdown that restores the original permissions' },
              { title: 'Rank card', body: 'Achievements, badges, titles, frames and backgrounds, set from /rank' },
              { title: 'Demo mode', body: 'The whole dashboard on a fictional server, with a guided tour' },
            ],
          },
        ],
      },
    },
  },
  {
    version: '9.3.1',
    slug: '9-3-1',
    tag: 'v9.3.1',
    date: '2026-09-13',
    text: {
      fr: {
        h1: 'Kotbo 9.3.1 : rappel de bump et quêtes versées toutes seules',
        description: 'Kotbo 9.3.1 : rappel de bump sans réglage pour Disboard et les autres annuaires, quêtes RPG versées sans /quests claim et nettoyage des messages de drops.',
        lead: 'Une version de correction, avec trois petits plus qui évitent des manipulations au staff comme aux joueurs',
        sections: [
          {
            h2: 'Ce qui change',
            body: 'Trois nouveautés, aucune à configurer',
            items: [
              { title: 'Rappel de bump', body: 'Kotbo repère les /bump de Disboard, Discadia, DiscordServers.com et Disforge, et prévient dans le même salon quand le prochain est possible. L’état s’affiche aussi dans Pulse' },
              { title: 'Quêtes RPG versées seules', body: 'Un objectif atteint donne directement l’or, l’XP et les points de clan, sans /quests claim. Une quête peut être rendue répétable' },
              { title: 'Drops nettoyés', body: 'Le message d’un drop terminé peut s’effacer après un délai, de 5 minutes à 24 heures' },
            ],
          },
          {
            h2: 'Corrections',
            body: 'Les plus visibles',
            points: [
              'Un champ pour activer un code promo ou partenaire pendant l’inscription',
              '/channelhealth réservée aux administrateurs',
              'Les accents des salons de tickets fermés corrigés',
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.3.1: bump reminders and quests that pay out on their own',
        description: 'Kotbo 9.3.1: bump reminders with no setup for Disboard and other directories, RPG quests paid without /quests claim and clean-up of drop messages.',
        lead: 'A fix release, with three small additions that save staff and players a few clicks',
        sections: [
          {
            h2: 'What changes',
            body: 'Three additions, none to configure',
            items: [
              { title: 'Bump reminders', body: 'Kotbo spots /bump from Disboard, Discadia, DiscordServers.com and Disforge, and posts in the same channel when the next one is possible. The status also shows in Pulse' },
              { title: 'RPG quests pay out on their own', body: 'A completed goal grants gold, XP and clan points directly, no /quests claim. A quest can be made repeatable' },
              { title: 'Tidier drops', body: 'A finished drop’s message can be deleted after a delay, from 5 minutes to 24 hours' },
            ],
          },
          {
            h2: 'Fixes',
            body: 'The most visible ones',
            points: [
              'A field to enter a promo or partner code during sign-up',
              '/channelhealth restricted to administrators',
              'Accents fixed in closed ticket channel names',
            ],
          },
        ],
      },
    },
  },
  {
    version: '9.3',
    slug: '9-3',
    tag: 'v9.3',
    date: '2026-09-07',
    text: {
      fr: {
        h1: 'Kotbo 9.3 : workflows, abonnements et paris de clan',
        description: 'Kotbo 9.3 : moteur de workflows, abonnements et cartes cadeaux, paris en points de clan, raids de guilde, drops et liaison de salons entre plusieurs serveurs.',
        lead: 'La 9.3 apporte les workflows pour automatiser le serveur, les abonnements, les paris entre clans et les raids du RPG',
        sections: [
          {
            h2: 'Les workflows',
            body: 'Un déclencheur, des conditions, des actions : un workflow enchaîne ce que tu faisais à la main',
            points: [
              'Déclencheurs Discord ou à heure fixe, conditions combinées, envoi de messages et rôles',
              'Des pauses jusqu’à 30 jours entre deux étapes',
              'Le détail de chaque exécution, étape par étape, et les workflows qui n’ont jamais tourné signalés',
              'Tout se crée aussi depuis une IA avec le serveur MCP',
            ],
          },
          {
            h2: 'Abonnements et cartes cadeaux',
            body: 'Le paiement passe par Stripe, sans que tes coordonnées bancaires ne transitent par Kotbo',
            points: [
              'Des offres selon la taille du serveur',
              '15 jours d’essai, une fois par compte et par serveur',
              'Des mois d’accès à offrir à un serveur, ou en code cadeau',
              'Tout se configure pendant l’accueil, avant de payer',
            ],
          },
          {
            h2: 'Pour jouer',
            body: 'De quoi animer le serveur',
            items: [
              { title: 'Paris de clan', body: 'Avec /paris : duels, pools ou camps, mises par joueur ou par camp, et des dettes de clan plafonnées' },
              { title: 'Raids de guilde', body: 'Avec /raid, un boss par semaine dont les PV suivent l’effectif, récompenses au prorata des dégâts' },
              { title: 'Autel d’enchantement', body: 'Des parchemins à poser ou retirer sur les armes et armures' },
              { title: 'Drops', body: 'XP, pièces ou points de clan largués dans un salon : premier arrivé, course à plusieurs gagnants ou fenêtre ouverte à tous' },
            ],
          },
          {
            h2: 'Et aussi',
            body: 'Le reste de la version',
            points: [
              'Liaison de salons en réseau : plus de deux serveurs dans un même groupe, avec le sens de chaque salon',
              'Des cartes d’aperçu générées pour les formulaires, profils, classements et concours partagés',
              '/ticket archive et /ticket lock, et les avis de satisfaction relayés dans un salon staff',
              'Les contestations de sanctions arbitrées une par une',
              'Des annonces programmées, avec modèles et rapport d’envoi',
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.3: workflows, subscriptions and clan bets',
        description: 'Kotbo 9.3: a workflow engine, subscriptions and gift cards, clan point bets, guild raids, drops and channel links across several servers.',
        lead: '9.3 brings workflows to automate the server, subscriptions, bets between clans and RPG raids',
        sections: [
          {
            h2: 'Workflows',
            body: 'A trigger, conditions, actions: a workflow chains what you used to do by hand',
            points: [
              'Discord or scheduled triggers, combined conditions, messages and roles',
              'Waits of up to 30 days between two steps',
              'Every run detailed step by step, and workflows that never ran are flagged',
              'Everything can also be built from an AI through the MCP server',
            ],
          },
          {
            h2: 'Subscriptions and gift cards',
            body: 'Payment goes through Stripe, and your card details never pass through Kotbo',
            points: [
              'Plans based on server size',
              'A 15-day trial, once per account and per server',
              'Months of access to give to a server, or as a gift code',
              'Everything can be set up during onboarding, before paying',
            ],
          },
          {
            h2: 'Games',
            body: 'Things to liven up the server',
            items: [
              { title: 'Clan bets', body: 'With /paris: duels, pools or sides, stakes per player or per side, and capped clan debt' },
              { title: 'Guild raids', body: 'With /raid, one boss a week whose HP scales with the group, rewards split by damage dealt' },
              { title: 'Enchanting altar', body: 'Scrolls to add to or remove from weapons and armour' },
              { title: 'Drops', body: 'XP, coins or clan points dropped in a channel: first come, a race with several winners, or a window open to all' },
            ],
          },
          {
            h2: 'Also in this release',
            body: 'The rest of the version',
            points: [
              'Networked channel links: more than two servers in one group, with a direction per channel',
              'Preview cards generated for shared forms, profiles, leaderboards and giveaways',
              '/ticket archive and /ticket lock, and satisfaction ratings relayed to a staff channel',
              'Sanction appeals decided one by one',
              'Scheduled announcements, with templates and a delivery report',
            ],
          },
        ],
      },
    },
  },
  {
    version: '9.2',
    slug: '9-2',
    tag: 'v9.2',
    date: '2026-08-14',
    text: {
      fr: {
        h1: 'Kotbo 9.2 : des modules qui s’éteignent vraiment, Prestige et Starlight',
        description: 'Kotbo 9.2 : un module éteint retire ses commandes, Prestige remplace Ascend, Starlight met en avant les messages populaires et /privacy explique les données gardées.',
        lead: 'La 9.2 fait qu’un module éteint disparaît pour de bon, et ajoute un classement compétitif et un starboard',
        sections: [
          {
            h2: 'Un module éteint disparaît',
            body: 'Éteindre un module retire ses commandes de ton serveur au lieu de répondre par une erreur. Ses événements, ses tâches de fond et ses accès au dashboard s’arrêtent aussi, et les modules qui en dépendent suivent',
          },
          {
            h2: 'Prestige et Starlight',
            body: 'Deux modules pour la communauté',
            items: [
              { title: 'Prestige', body: 'Le classement compétitif remplace Ascend, avec /prestige : courbe de paliers réglable, rôles de paliers créés et rangés seuls, annonces de montée et de descente' },
              { title: 'Starlight', body: 'Un message qui passe un seuil de votes est republié dans un salon dédié, avec jusqu’à quatre images' },
            ],
          },
          {
            h2: 'Sécurité et vie privée',
            body: 'Le reste de la version',
            points: [
              '/privacy explique aux membres quelles données sont gardées, combien de temps, et comment les faire effacer',
              'Un salon piège ajouté au modèle de serveur, qui bannit les bots de spam',
              'Le rôle d’accès rendu aux membres oubliés après le captcha',
              'Un captcha vocal enregistré par de vraies voix, en français et en anglais',
              'L’annuaire du staff qui charge bien plus vite',
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.2: modules that really switch off, Prestige and Starlight',
        description: 'Kotbo 9.2: a module turned off removes its commands, Prestige replaces Ascend, Starlight highlights popular messages and /privacy explains what data is kept.',
        lead: '9.2 makes a module that is turned off really go away, and adds a competitive ladder and a starboard',
        sections: [
          {
            h2: 'A module turned off goes away',
            body: 'Turning a module off removes its commands from your server instead of answering with an error. Its events, background jobs and dashboard access stop too, and the modules that depend on it follow',
          },
          {
            h2: 'Prestige and Starlight',
            body: 'Two community modules',
            items: [
              { title: 'Prestige', body: 'The competitive ladder replaces Ascend, with /prestige: an adjustable tier curve, tier roles created and ordered automatically, promotion and demotion announcements' },
              { title: 'Starlight', body: 'A message that passes a vote threshold is reposted in a dedicated channel, with up to four images' },
            ],
          },
          {
            h2: 'Security and privacy',
            body: 'The rest of the version',
            points: [
              '/privacy tells members what data is kept, for how long, and how to get it erased',
              'A honeypot channel added to the server template, which bans spam bots',
              'The access role given back to members missed after the captcha',
              'A voice captcha recorded by real voices, in French and English',
              'A staff directory that loads much faster',
            ],
          },
        ],
      },
    },
  },
  {
    version: '9.1',
    slug: '9-1',
    tag: 'v9.1',
    date: '2026-07-29',
    text: {
      fr: {
        h1: 'Kotbo 9.1 : le Daily en semaines et des clans enrichis',
        description: 'Kotbo 9.1 : le Daily en semaines compétitives avec podium, des clans enrichis, plus de garde-fous sur l’économie et l’anti-raid, et la commande /language.',
        lead: 'La 9.1 consolide la 9.0 : le Daily devient une compétition hebdomadaire, les clans gagnent en profondeur et le dashboard charge plus vite',
        sections: [
          {
            h2: 'Le Daily en semaines',
            body: 'Le défi du jour se joue désormais en semaines compétitives',
            points: [
              'Un état de la semaine, un podium et une clôture à la main',
              'Un barème fixe, réglable dans un onglet dédié avec les récompenses',
              'Les points du Daily convertibles en points de clan à la clôture',
            ],
          },
          {
            h2: 'Des clans enrichis',
            body: 'Le classement public a été refait',
            points: [
              'Recherche d’un membre, avec son vrai rang et l’historique de ses points',
              'Dates de saison et compte à rebours sur la page publique',
              'Plusieurs clans vainqueurs en cas d’égalité',
              'Des points de clan quand un membre booste le serveur',
            ],
          },
          {
            h2: 'Et aussi',
            body: 'Le reste de la version',
            points: [
              'Des garde-fous contre les abus sur l’économie, et /market corrigé',
              'Une protection anti-raid revue',
              'La commande /language et un sélecteur de langue dans le dashboard',
              'Les alertes YouTube et Twitch qui ne partaient plus sont réparées',
              'Un dashboard qui charge plus vite au premier affichage',
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.1: the Daily in weeks and richer clans',
        description: 'Kotbo 9.1: the Daily in competitive weeks with a podium, richer clans, more safeguards on economy and anti-raid, and the /language command.',
        lead: '9.1 builds on 9.0: the Daily becomes a weekly competition, clans get more depth and the dashboard loads faster',
        sections: [
          {
            h2: 'The Daily in weeks',
            body: 'The daily challenge is now played in competitive weeks',
            points: [
              'A weekly status, a podium and manual closing',
              'A fixed scoring scale, set in its own tab along with rewards',
              'Daily points can be turned into clan points at closing',
            ],
          },
          {
            h2: 'Richer clans',
            body: 'The public leaderboard was rebuilt',
            points: [
              'Member search, with their real rank and points history',
              'Season dates and a countdown on the public page',
              'Several winning clans in case of a tie',
              'Clan points when a member boosts the server',
            ],
          },
          {
            h2: 'Also in this release',
            body: 'The rest of the version',
            points: [
              'Safeguards against economy abuse, and /market fixed',
              'Reworked anti-raid protection',
              'The /language command and a language picker in the dashboard',
              'YouTube and Twitch alerts that had stopped are fixed',
              'A dashboard that loads faster on first display',
            ],
          },
        ],
      },
    },
  },
  {
    version: '9.0',
    slug: '9-0',
    tag: 'v9',
    date: '2026-07-22',
    text: {
      fr: {
        h1: 'Kotbo 9.0 : bilingue, les nouveaux messages Discord et /protection',
        description: 'Kotbo 9.0 : le bot en français et en anglais, les nouveaux messages Discord sur plus de 25 commandes, /protection, /audit et /report, les clans et les transcriptions par lien signé.',
        lead: 'La 9.0 est une refonte : Kotbo parle français et anglais, ses messages passent au nouveau format de Discord, et la sécurité et les clans arrivent',
        sections: [
          {
            h2: 'Ce qui change',
            body: 'Les grandes lignes',
            items: [
              { title: 'Français et anglais', body: 'Le bot répond dans la langue du serveur ou du membre' },
              { title: 'Nouveaux messages Discord', body: 'Plus de 25 commandes passent au nouveau format d’affichage de Discord, plus lisible sur téléphone' },
              { title: 'Sécurité', body: '/protection règle l’anti-raid, le captcha et l’anti-arnaque, /audit vérifie le serveur et /report laisse les membres signaler' },
              { title: 'Clans et saisons', body: 'Des clans rivaux, de l’XP partagée, des annonces automatiques et un classement public en temps réel' },
              { title: 'Transcriptions protégées', body: 'Une transcription de ticket ne s’ouvre plus que par un lien signé, valable une heure, pour le staff et les participants du ticket' },
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 9.0: bilingual, the new Discord messages and /protection',
        description: 'Kotbo 9.0: the bot in French and English, the new Discord messages on more than 25 commands, /protection, /audit and /report, clans and ticket transcripts behind signed links.',
        lead: '9.0 is a rebuild: Kotbo speaks French and English, its messages move to Discord’s new format, and security and clans arrive',
        sections: [
          {
            h2: 'What changes',
            body: 'The big picture',
            items: [
              { title: 'French and English', body: 'The bot answers in the language of the server or the member' },
              { title: 'New Discord messages', body: 'More than 25 commands move to Discord’s new display format, easier to read on a phone' },
              { title: 'Security', body: '/protection sets anti-raid, captcha and anti-scam, /audit checks the server and /report lets members flag things' },
              { title: 'Clans and seasons', body: 'Rival clans, shared XP, automatic announcements and a real-time public leaderboard' },
              { title: 'Protected transcripts', body: 'A ticket transcript now only opens through a signed link, valid for an hour, for staff and the ticket’s participants' },
            ],
          },
        ],
      },
    },
  },
  {
    version: '7.20',
    slug: '7-20',
    tag: 'v7.20',
    date: '2026-06-04',
    text: {
      fr: {
        h1: 'Kotbo 7.20 : sauvegardes du serveur et suggestions en formulaire',
        description: 'Kotbo 7.20 : sauvegarde automatique du serveur chaque nuit, /backup, statistiques par module, historique des messages reconstruit et suggestions par formulaire.',
        lead: 'La 7.20 sauvegarde ton serveur toutes les nuits et reconstruit son historique d’activité',
        sections: [
          {
            h2: 'Sauvegardes du serveur',
            body: 'Salons, permissions, rôles, emojis et stickers sont sauvegardés chaque nuit à 2 h, avec les trois dernières sauvegardes gardées par serveur',
            points: [
              '/backup crée, liste, restaure ou supprime une sauvegarde, en choisissant ce qu’elle contient',
              'Une sauvegarde se télécharge en JSON, et un JSON vérifié peut être réimporté',
            ],
          },
          {
            h2: 'Et aussi',
            body: 'Le reste de la version',
            points: [
              'L’historique des salons est relu à l’arrivée du bot, pour que les courbes d’activité remontent dans le passé',
              'Les arrivées, départs et invitations utilisées comptés chaque jour',
              'Les suggestions envoyées par un formulaire Discord, entre 10 et 1000 caractères',
              'La modération des pseudos réglable séparément à l’arrivée et au changement de pseudo',
              'Les cartes /rank réparées',
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 7.20: server backups and suggestions through a form',
        description: 'Kotbo 7.20: nightly server backups, /backup, per-module stats, rebuilt message history and suggestions through a form.',
        lead: '7.20 backs up your server every night and rebuilds its activity history',
        sections: [
          {
            h2: 'Server backups',
            body: 'Channels, permissions, roles, emojis and stickers are backed up every night at 2 am, with the last three backups kept per server',
            points: [
              '/backup creates, lists, restores or deletes a backup, choosing what it contains',
              'A backup can be downloaded as JSON, and a validated JSON can be imported back',
            ],
          },
          {
            h2: 'Also in this release',
            body: 'The rest of the version',
            points: [
              'Channel history is read back when the bot joins, so activity charts reach into the past',
              'Joins, leaves and invites used are counted every day',
              'Suggestions sent through a Discord form, between 10 and 1000 characters',
              'Nickname moderation set separately on join and on nickname change',
              '/rank cards fixed',
            ],
          },
        ],
      },
    },
  },
  {
    version: '7.18',
    slug: '7-18',
    tag: 'v7.18',
    date: '2026-05-31',
    text: {
      fr: {
        h1: 'Kotbo 7.18 : niveaux, AutoMod, giveaways et suggestions',
        description: 'Kotbo 7.18 : niveaux et XP vocale avec /rank, AutoMod anti-spam et anti-liens, giveaways sur bouton, suggestions votées, réponses automatiques et créateur d’embed.',
        lead: 'La 7.18 pose une bonne partie des modules communautaires de Kotbo',
        sections: [
          {
            h2: 'Les nouveaux modules',
            body: 'Ce qui arrive',
            items: [
              { title: 'Niveaux', body: 'De l’XP en écrivant et en vocal, des multiplicateurs par rôle, des rôles de palier cumulables ou non, et la carte /rank' },
              { title: 'AutoMod', body: 'Anti-spam, anti-liens avec liste blanche, majuscules, emojis et mentions en trop' },
              { title: 'Giveaways', body: 'Inscription par bouton, /giveaway start, end et reroll' },
              { title: 'Suggestions', body: '/suggest publie l’idée avec des boutons de vote, et le staff tranche depuis le dashboard' },
              { title: 'Réponses automatiques', body: 'Par mot contenu, mot exact ou expression régulière, en texte ou en embed' },
              { title: 'Créateur d’embed', body: 'Un embed se compose dans le dashboard, et un message déjà envoyé se modifie' },
            ],
          },
          {
            h2: 'Dans le dashboard',
            body: 'Le reste de la version',
            points: [
              'Une barre latérale repliable, avec favoris et recherche',
              'Des couleurs d’accent et des préférences exportables',
              'Un formulaire pour signaler un problème au staff de Kotbo',
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 7.18: levels, AutoMod, giveaways and suggestions',
        description: 'Kotbo 7.18: levels and voice XP with /rank, anti-spam and anti-link AutoMod, button giveaways, voted suggestions, auto-responses and an embed builder.',
        lead: '7.18 lays down a large part of Kotbo’s community modules',
        sections: [
          {
            h2: 'New modules',
            body: 'What arrives',
            items: [
              { title: 'Levels', body: 'XP from writing and voice, per-role multipliers, tier roles that stack or not, and the /rank card' },
              { title: 'AutoMod', body: 'Anti-spam, anti-link with an allow list, too many capitals, emojis or mentions' },
              { title: 'Giveaways', body: 'Button sign-up, /giveaway start, end and reroll' },
              { title: 'Suggestions', body: '/suggest posts the idea with vote buttons, and staff decide from the dashboard' },
              { title: 'Auto-responses', body: 'On a contained word, an exact word or a regular expression, as text or an embed' },
              { title: 'Embed builder', body: 'Build an embed in the dashboard, and edit a message already sent' },
            ],
          },
          {
            h2: 'In the dashboard',
            body: 'The rest of the version',
            points: [
              'A collapsible sidebar, with favourites and search',
              'Accent colours and exportable preferences',
              'A form to report a problem to the Kotbo team',
            ],
          },
        ],
      },
    },
  },
  {
    version: '7.8',
    slug: '7-8',
    tag: 'v7.8',
    date: '2026-05-26',
    text: {
      fr: {
        h1: 'Kotbo 7.8 : logs par événement, recrutement et tickets en direct',
        description: 'Kotbo 7.8 : logs réglables événement par événement, modération des pseudos, recrutement et démissions du staff, tickets synchronisés avec le dashboard et /transcript.',
        lead: 'La 7.8 installe la gestion du staff et des tickets, et passe le bot sur un socle plus solide',
        sections: [
          {
            h2: 'Ce qui arrive',
            body: 'Les nouveautés visibles',
            items: [
              { title: 'Logs par événement', body: 'Chaque type de log s’active à part et part dans son propre salon, sinon dans le salon de logs principal' },
              { title: 'Modération des pseudos', body: 'Un pseudo interdit est renommé, noté au casier et le membre est prévenu en MP' },
              { title: 'Recrutement', body: 'Des candidatures triées par règles, un salon d’entretien, puis la fiche staff et la période de test créées à l’embauche' },
              { title: 'Démissions', body: 'Une démission validée retire les rôles de modération et prévient le membre' },
              { title: 'Tickets en direct', body: 'La conversation d’un ticket s’affiche en direct dans le dashboard, et /transcript exporte un historique de messages' },
              { title: 'Commandes du staff', body: '/sanction, /casier, /absent, /meeting et /note' },
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 7.8: per-event logs, recruitment and live tickets',
        description: 'Kotbo 7.8: logs set event by event, nickname moderation, staff recruitment and resignations, tickets synced with the dashboard and /transcript.',
        lead: '7.8 sets up staff and ticket management, and moves the bot onto a sturdier base',
        sections: [
          {
            h2: 'What arrives',
            body: 'The visible additions',
            items: [
              { title: 'Per-event logs', body: 'Each log type is turned on separately and goes to its own channel, or to the main log channel' },
              { title: 'Nickname moderation', body: 'A banned nickname is renamed, recorded on the member’s record and the member is told by DM' },
              { title: 'Recruitment', body: 'Applications sorted by rules, an interview channel, then the staff profile and trial period created on hire' },
              { title: 'Resignations', body: 'An approved resignation removes moderation roles and notifies the member' },
              { title: 'Live tickets', body: 'A ticket’s conversation shows live in the dashboard, and /transcript exports a message history' },
              { title: 'Staff commands', body: '/sanction, /casier, /absent, /meeting and /note' },
            ],
          },
        ],
      },
    },
  },
  {
    version: '1.0',
    slug: '1-0',
    tag: 'v1.0.0',
    date: '2026-04-02',
    text: {
      fr: {
        h1: 'Kotbo 1.0 : la première version',
        description: 'Kotbo 1.0, la première version : veille YouTube et RSS sur Discord, filtres par mots-clés, soumission d’articles avec /news.',
        lead: 'Tout a commencé par un bot de veille : publier sur Discord les vidéos YouTube et les articles des flux RSS',
        sections: [
          {
            h2: 'Ce que faisait la 1.0',
            body: 'Trois commandes et deux modules',
            items: [
              { title: 'YouTube', body: 'Suivre des chaînes, avec un rôle à mentionner pour les vidéos et un autre pour les Shorts' },
              { title: 'RSS', body: 'Lire les flux, avec des mots-clés à inclure ou à exclure, globaux ou par flux' },
              { title: '/news', body: 'Proposer un article à la main, titre, description et miniature récupérés seuls' },
            ],
          },
        ],
      },
      en: {
        h1: 'Kotbo 1.0: the first version',
        description: 'Kotbo 1.0, the first version: YouTube and RSS watch on Discord, keyword filters, article submission with /news.',
        lead: 'It all started as a watch bot: posting YouTube videos and RSS articles to Discord',
        sections: [
          {
            h2: 'What 1.0 did',
            body: 'Three commands and two modules',
            items: [
              { title: 'YouTube', body: 'Follow channels, with one role to mention for videos and another for Shorts' },
              { title: 'RSS', body: 'Read feeds, with keywords to include or exclude, global or per feed' },
              { title: '/news', body: 'Submit an article by hand, with title, description and thumbnail fetched automatically' },
            ],
          },
        ],
      },
    },
  },
];

/** L'adresse des notes complètes d'une version sur GitHub. */
export function releaseUrl(/** @type {Release} */ release) {
  return `https://github.com/Kotbo-Bot/Kotbo/releases/tag/${release.tag}`;
}

/**
 * Les maquettes d'interface des couvertures du blog (`render-covers.mjs`).
 *
 * Chaque groupe décrit une scène fictive, dans les deux langues : un type
 * (`list`, `toggles`, `chat`, `roles`, `chart`, `board`, `alert`, `graph`,
 * `code`, `browser`, `flow`) et ses données. Les noms de membres sont inventés.
 * La scène occupe une zone de 600 × 500 px à droite de la couverture.
 */

const L = (fr, en) => ({ fr, en });
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const C = { accent: '#8b8cf8', green: '#4ade80', red: '#f87171', orange: '#fb923c', blue: '#60a5fa', pink: '#f472b6', yellow: '#facc15', teal: '#2dd4bf' };
const AV = [C.accent, C.pink, C.teal, C.orange, C.blue, C.green];

const avatar = (name, i = 0) => `<i class="av" style="background:${AV[i % AV.length]}">${esc(name[0].toUpperCase())}</i>`;
const chip = (text, color = C.accent) => `<span class="chip" style="color:${color};background:${color}26">${esc(text)}</span>`;
const sw = (on) => `<span class="sw ${on ? 'on' : ''}"><i></i></span>`;
const bar = (pct, color = C.accent) => `<span class="bar"><i style="width:${pct}%;background:${color}"></i></span>`;
const hd = (title, right = '') => `<div class="hd"><span class="dot"></span><b>${esc(title)}</b><span class="mono r">${esc(right)}</span></div>`;
const stat = (label, value, x, y, color = C.accent) =>
  `<div class="card stat" style="left:${x}px;top:${y}px"><small>${esc(label)}</small><strong style="color:${color}">${esc(value)}</strong></div>`;

/** @typedef {{ n: string, s: {fr:string,en:string}, chip: {fr:string,en:string}, color: string }} Row */

export const GROUPS = {
  sanctions: {
    type: 'list',
    title: L('Sanctions', 'Sanctions'),
    count: L('4 récentes', '4 recent'),
    rows: [
      { n: 'mira_k', s: L('Spam de liens', 'Link spam'), chip: L('Warn', 'Warn'), color: C.orange },
      { n: 'dev0ps', s: L('Insultes en salon', 'Insults in chat'), chip: L('Mute 1 h', 'Mute 1h'), color: C.blue },
      { n: 'nova.x', s: L('Retour après un ban', 'Back after a ban'), chip: L('Ban', 'Ban'), color: C.red },
      { n: 'lia', s: L('Pub non autorisée', 'Unauthorized ad'), chip: L('Warn', 'Warn'), color: C.orange },
    ],
    stat: [L('Sanctions ce mois', 'Sanctions this month'), '38', C.accent],
  },
  tickets: {
    type: 'list',
    title: L('Tickets', 'Tickets'),
    count: L('3 ouverts', '3 open'),
    rows: [
      { n: 'tom', s: L('Problème de paiement', 'Payment issue'), chip: L('Ouvert', 'Open'), color: C.green },
      { n: 'ines', s: L('Candidature staff', 'Staff application'), chip: L('Pris en charge', 'Claimed'), color: C.blue },
      { n: 'yann', s: L('Signalement', 'Report'), chip: L('Ouvert', 'Open'), color: C.green },
      { n: 'sofia', s: L('Partenariat', 'Partnership'), chip: L('Fermé', 'Closed'), color: '#9a96ad' },
    ],
    stat: [L('Réponse moyenne', 'Average reply'), '4 min', C.green],
  },
  suggestions: {
    type: 'list',
    title: L('Suggestions', 'Suggestions'),
    count: L('Votes ouverts', 'Open votes'),
    rows: [
      { n: 'noah', s: L('Un salon pour les artistes', 'A channel for artists'), chip: L('▲ 42', '▲ 42'), color: C.green },
      { n: 'eva', s: L('Soirées jeux le vendredi', 'Friday game nights'), chip: L('▲ 31', '▲ 31'), color: C.green },
      { n: 'max', s: L('Plus de rôles couleur', 'More colour roles'), chip: L('Retenu', 'Approved'), color: C.accent },
      { n: 'zoe', s: L('Salon en anglais', 'English channel'), chip: L('Refusé', 'Declined'), color: C.red },
    ],
    stat: [L('Idées retenues', 'Ideas approved'), '12', C.accent],
  },
  recruitment: {
    type: 'list',
    title: L('Candidatures', 'Applications'),
    count: L('5 à traiter', '5 to review'),
    rows: [
      { n: 'léo', s: L('Modérateur · 2 ans d’expérience', 'Moderator · 2 years’ experience'), chip: L('Entretien', 'Interview'), color: C.blue },
      { n: 'mina', s: L('Helper · disponible le soir', 'Helper · evenings'), chip: L('Nouveau', 'New'), color: C.green },
      { n: 'karl', s: L('Modérateur', 'Moderator'), chip: L('À l’essai', 'Trial'), color: C.orange },
      { n: 'sam', s: L('Community manager', 'Community manager'), chip: L('Refusé', 'Declined'), color: C.red },
    ],
    stat: [L('Équipe', 'Team'), '14', C.accent],
  },
  appeals: {
    type: 'list',
    title: L('Appels de ban', 'Ban appeals'),
    count: L('2 en attente', '2 pending'),
    rows: [
      { n: 'rémi', s: L('« Compte piraté à l’époque »', '“My account was hacked”'), chip: L('En attente', 'Pending'), color: C.orange },
      { n: 'anna', s: L('« Je n’ai pas lu les règles »', '“I hadn’t read the rules”'), chip: L('Accepté', 'Accepted'), color: C.green },
      { n: 'bob', s: L('« C’est injuste »', '“This is unfair”'), chip: L('Refusé', 'Declined'), color: C.red },
    ],
    stat: [L('Délai moyen', 'Average time'), '1,2 j', C.accent],
  },
  logs: {
    type: 'list',
    title: L('Journal du serveur', 'Server log'),
    count: L('En direct', 'Live'),
    rows: [
      { n: 'mira_k', s: L('Message supprimé dans #général', 'Message deleted in #general'), chip: L('Message', 'Message'), color: C.orange },
      { n: 'dev0ps', s: L('Pseudo modifié', 'Nickname changed'), chip: L('Membre', 'Member'), color: C.blue },
      { n: 'nova.x', s: L('Rôle Modo retiré', 'Mod role removed'), chip: L('Rôles', 'Roles'), color: C.accent },
      { n: 'lia', s: L('Invitation créée', 'Invite created'), chip: L('Invitation', 'Invite'), color: C.green },
    ],
    stat: [L('Événements aujourd’hui', 'Events today'), '1 284', C.accent],
  },
  forms: {
    type: 'list',
    title: L('Formulaires', 'Forms'),
    count: L('3 en ligne', '3 online'),
    rows: [
      { n: 'candidature', s: L('Candidature staff · 18 réponses', 'Staff application · 18 replies'), chip: L('Ouvert', 'Open'), color: C.green },
      { n: 'inscription', s: L('Tournoi · 64 réponses', 'Tournament · 64 replies'), chip: L('Ouvert', 'Open'), color: C.green },
      { n: 'sondage', s: L('Sondage de rentrée · 210 réponses', 'Back-to-school poll · 210 replies'), chip: L('Fermé', 'Closed'), color: '#9a96ad' },
    ],
    stat: [L('Réponses', 'Replies'), '292', C.accent],
  },
  voice: {
    type: 'list',
    title: L('Salons vocaux temporaires', 'Temporary voice channels'),
    count: L('Join to create', 'Join to create'),
    rows: [
      { n: 'léa', s: L('Salon de léa · 4 membres', 'léa’s room · 4 members'), chip: L('Public', 'Public'), color: C.green },
      { n: 'tom', s: L('Équipe ranked · 5 membres', 'Ranked team · 5 members'), chip: L('Verrouillé', 'Locked'), color: C.orange },
      { n: 'sofia', s: L('Chill · 2 membres', 'Chill · 2 members'), chip: L('Public', 'Public'), color: C.green },
    ],
    stat: [L('Salons actifs', 'Active rooms'), '7', C.accent],
  },
  rules: {
    type: 'list',
    title: L('Règlement', 'Rules'),
    count: L('Publié', 'Published'),
    rows: [
      { n: '1', s: L('Respect entre membres', 'Respect between members'), chip: L('Article 1', 'Article 1'), color: C.accent },
      { n: '2', s: L('Pas de publicité sans accord', 'No ads without permission'), chip: L('Article 2', 'Article 2'), color: C.accent },
      { n: '3', s: L('Pas de contenu choquant', 'No shocking content'), chip: L('Article 3', 'Article 3'), color: C.accent },
      { n: '4', s: L('Suivre les consignes du staff', 'Follow staff instructions'), chip: L('Article 4', 'Article 4'), color: C.accent },
    ],
    stat: [L('Règles acceptées', 'Rules accepted'), '96 %', C.green],
  },
  release: {
    type: 'list',
    title: L('Nouveautés', 'What’s new'),
    count: L('Cette version', 'This release'),
    rows: [
      { n: 'Giveaways', s: L('Conditions de participation', 'Entry conditions'), chip: L('Nouveau', 'New'), color: C.green },
      { n: 'Sanctions', s: L('Paliers et bans jusqu’à un an', 'Tiers and bans up to a year'), chip: L('Nouveau', 'New'), color: C.green },
      { n: 'Pages', s: L('Pages publiques personnalisables', 'Customizable public pages'), chip: L('Nouveau', 'New'), color: C.green },
      { n: 'MCP', s: L('Droits des clés par module', 'Per-module key permissions'), chip: L('Amélioré', 'Improved'), color: C.blue },
    ],
    stat: [L('Nouveautés', 'Changes'), '149', C.accent],
  },

  automod: {
    type: 'toggles',
    title: L('AutoMod', 'AutoMod'),
    right: L('Actif', 'On'),
    items: [
      [L('Anti-spam', 'Anti-spam'), true],
      [L('Liens (liste de domaines autorisés)', 'Links (allowed domain list)'), true],
      [L('Mentions en rafale', 'Mass mentions'), true],
      [L('Majuscules et emojis', 'Caps and emoji floods'), true],
      [L('Mots interdits', 'Blocked words'), false],
    ],
    slider: [L('Sévérité des liens', 'Link strictness'), 70],
  },
  verification: {
    type: 'toggles',
    title: L('Vérification', 'Verification'),
    right: L('Captcha', 'Captcha'),
    items: [
      [L('Captcha en image', 'Image captcha'), true],
      [L('Captcha vocal', 'Voice captcha'), false],
      [L('Âge minimal du compte', 'Minimum account age'), true],
      [L('Accepter le règlement', 'Accept the rules'), true],
    ],
    slider: [L('Âge minimal : 7 jours', 'Minimum age: 7 days'), 35],
  },
  checklist: {
    type: 'toggles',
    title: L('Sécurité du serveur', 'Server security'),
    right: L('10 / 10', '10 / 10'),
    items: [
      [L('Niveau de vérification élevé', 'High verification level'), true],
      [L('2FA pour la modération', '2FA for moderation'), true],
      [L('AutoMod et anti-spam', 'AutoMod and anti-spam'), true],
      [L('Anti-raid et captcha', 'Anti-raid and captcha'), true],
      [L('Détection des doubles comptes', 'Alt account detection'), true],
    ],
    slider: [L('Score de sécurité', 'Security score'), 92],
  },
  welcomeSettings: {
    type: 'toggles',
    title: L('Accueil et départ', 'Welcome and goodbye'),
    right: L('Actif', 'On'),
    items: [
      [L('Message de bienvenue', 'Welcome message'), true],
      [L('Carte d’avatar', 'Avatar card'), true],
      [L('Rôle automatique', 'Auto role'), true],
      [L('Message de départ', 'Goodbye message'), false],
    ],
    slider: [L('Délai avant le rôle : 10 min', 'Delay before the role: 10 min'), 25],
  },
  backup: {
    type: 'toggles',
    title: L('Sauvegardes', 'Backups'),
    right: L('Auto', 'Auto'),
    items: [
      [L('Salons et catégories', 'Channels and categories'), true],
      [L('Rôles et permissions', 'Roles and permissions'), true],
      [L('Configuration de Kotbo', 'Kotbo configuration'), true],
      [L('Messages récents', 'Recent messages'), false],
    ],
    slider: [L('Dernière sauvegarde : il y a 3 h', 'Last backup: 3 h ago'), 85],
  },
  free: {
    type: 'toggles',
    title: L('Offre gratuite', 'Free plan'),
    right: L('0 €', '€0'),
    items: [
      [L('Modération et sécurité', 'Moderation and security'), true],
      [L('Niveaux, accueil, tickets', 'Levels, welcome, tickets'), true],
      [L('Logs et détection des alts', 'Logs and alt detection'), true],
      [L('Gestion du staff, IA, MCP', 'Staff management, AI, MCP'), false],
    ],
    slider: [L('Sans carte bancaire, sans limite de durée', 'No credit card, no time limit'), 100],
  },

  welcome: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.green, title: L('Bienvenue sur le serveur, léa !', 'Welcome to the server, léa!'), lines: [L('Tu es notre 1 248e membre.', 'You are our 1,248th member.'), L('Lis le règlement dans #règlement, puis présente-toi.', 'Read #rules, then introduce yourself.')] },
    buttons: [[L('Choisir mes rôles', 'Pick my roles'), C.accent], [L('Règlement', 'Rules'), '#9a96ad']],
  },
  giveaway: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.pink, title: L('🎁 Giveaway : Nitro 1 mois', '🎁 Giveaway: 1 month of Nitro'), lines: [L('Fin dans 2 jours · 1 gagnant', 'Ends in 2 days · 1 winner'), L('Conditions : membre depuis 7 jours, 50 messages', 'Conditions: member for 7 days, 50 messages'), L('312 participants', '312 entries')] },
    buttons: [[L('Participer', 'Enter'), C.green], [L('Vérifier mes conditions', 'Check my conditions'), '#9a96ad']],
  },
  embed: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.accent, title: L('Soirée jeux vendredi', 'Friday game night'), lines: [L('Rendez-vous à 21 h dans #vocal-jeux.', 'Meet at 9 pm in #game-voice.'), L('Boissons et bonne humeur fournies.', 'Snacks and good mood provided.')] },
    buttons: [[L('Je viens', 'I’m in'), C.green]],
  },
  news: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.blue, title: L('Nouvelle mise à jour du jeu', 'New game update'), lines: [L('Le patch 4.2 arrive avec un nouveau mode.', 'Patch 4.2 brings a new mode.'), L('Source : flux RSS · il y a 2 min', 'Source: RSS feed · 2 min ago')] },
    buttons: [[L('Lire l’article', 'Read the article'), C.blue]],
  },
  twitch: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: '#a78bfa', title: L('🔴 mira est en live !', '🔴 mira is live!'), lines: [L('Ranked toute la soirée, viens discuter.', 'Ranked all night, come hang out.'), L('twitch.tv/mira · 128 spectateurs', 'twitch.tv/mira · 128 viewers')] },
    buttons: [[L('Regarder', 'Watch'), '#a78bfa']],
  },
  bump: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.teal, title: L('C’est l’heure du bump !', 'Time to bump!'), lines: [L('Tape /bump pour remonter le serveur dans la liste.', 'Type /bump to push the server up the list.'), L('Dernier bump : il y a 2 h', 'Last bump: 2 h ago')] },
    buttons: [[L('Bumper', 'Bump'), C.teal]],
  },
  quiz: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.yellow, title: L('Question 4 / 10', 'Question 4 / 10'), lines: [L('Quelle est la capitale de l’Australie ?', 'What is the capital of Australia?'), L('Temps restant : 12 s', 'Time left: 12 s')] },
    buttons: [[L('Sydney', 'Sydney'), '#9a96ad'], [L('Canberra', 'Canberra'), C.accent], [L('Perth', 'Perth'), '#9a96ad']],
  },
  confession: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.pink, title: L('Confession #214', 'Confession #214'), lines: [L('« J’ai quitté le serveur trois fois et je suis toujours revenu. »', '“I left the server three times and always came back.”'), L('Anonyme', 'Anonymous')] },
    buttons: [[L('Répondre', 'Reply'), C.pink]],
  },
  counting: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.green, title: L('Jeu du comptage', 'Counting game'), lines: [L('Prochain nombre : 43', 'Next number: 43'), L('Record du serveur : 187', 'Server record: 187')] },
    buttons: [[L('Classement', 'Leaderboard'), C.green]],
  },
  starboard: {
    type: 'chat',
    bot: 'Kotbo',
    embed: { color: C.yellow, title: L('⭐ 18 · #créations', '⭐ 18 · #creations'), lines: [L('« Voici mon dernier dessin, merci pour vos retours ! »', '“Here is my latest drawing, thanks for the feedback!”'), L('par eva', 'by eva')] },
    buttons: [[L('Aller au message', 'Jump to message'), C.yellow]],
  },

  roles: {
    type: 'roles',
    title: L('Choisis tes rôles', 'Pick your roles'),
    lines: [L('Clique sur un bouton pour t’ajouter ou te retirer un rôle.', 'Click a button to add or remove a role.')],
    pills: [['🎮 Gamer', C.accent, '214'], ['🎨 Artiste', C.pink, '98'], ['🎵 Musique', C.teal, '76'], ['📚 Études', C.blue, '51'], ['🔔 Annonces', C.orange, '402']],
  },

  stats: {
    type: 'chart',
    title: L('Activité du serveur', 'Server activity'),
    kpis: [[L('Messages', 'Messages'), '12,4 k', C.accent], [L('Membres actifs', 'Active members'), '842', C.green], [L('Arrivées', 'Joins'), '+96', C.blue]],
    bars: [30, 42, 38, 55, 48, 66, 72, 60, 78, 90, 84, 96],
  },
  invites: {
    type: 'chart',
    title: L('Invitations', 'Invites'),
    kpis: [[L('Arrivées via invitation', 'Joins via invite'), '318', C.accent], [L('Restés après 7 jours', 'Stayed after 7 days'), '74 %', C.green], [L('Meilleur inviteur', 'Top inviter'), 'mira_k', C.pink]],
    bars: [18, 24, 22, 40, 34, 52, 46, 64, 58, 72, 80, 70],
  },
  health: {
    type: 'chart',
    title: L('Santé des salons', 'Channel health'),
    kpis: [[L('Salons actifs', 'Active channels'), '18', C.green], [L('Salons morts', 'Dead channels'), '4', C.orange], [L('Surchargés', 'Overloaded'), '1', C.red]],
    bars: [90, 82, 74, 66, 58, 44, 36, 28, 20, 14, 10, 6],
  },
  activity: {
    type: 'chart',
    title: L('Événements et quêtes', 'Events and quests'),
    kpis: [[L('Participants', 'Participants'), '186', C.accent], [L('Quêtes terminées', 'Quests completed'), '742', C.green], [L('Séries en cours', 'Active streaks'), '58', C.orange]],
    bars: [20, 30, 26, 44, 50, 46, 62, 70, 66, 80, 88, 94],
  },

  leveling: {
    type: 'board',
    title: L('Classement des niveaux', 'Level leaderboard'),
    unit: 'XP',
    rows: [['mira_k', 92, '18 420', 'Niv. 34'], ['dev0ps', 80, '15 902', 'Niv. 31'], ['lia', 66, '12 118', 'Niv. 27'], ['noah', 51, '8 774', 'Niv. 22'], ['eva', 38, '6 120', 'Niv. 18']],
  },
  reputation: {
    type: 'board',
    title: L('Réputation', 'Reputation'),
    unit: 'rep',
    rows: [['eva', 90, '+148', L('Mentor', 'Mentor')], ['tom', 74, '+112', L('Respecté', 'Respected')], ['ines', 60, '+86', L('Respecté', 'Respected')], ['yann', 42, '+51', L('Reconnu', 'Known')], ['max', 28, '+30', L('Nouveau', 'Newcomer')]],
  },
  clans: {
    type: 'board',
    title: L('Classement des clans', 'Clan leaderboard'),
    unit: 'pts',
    rows: [['Phénix', 94, '24 310', '🔥'], ['Nova', 78, '19 840', '⚡'], ['Atlas', 62, '15 205', '🌍'], ['Orion', 47, '11 360', '⭐']],
  },
  economy: {
    type: 'board',
    title: L('Les plus riches', 'Richest members'),
    unit: '🪙',
    rows: [['lia', 88, '42 500', L('Marchand', 'Merchant')], ['noah', 70, '33 200', L('Collectionneur', 'Collector')], ['eva', 52, '24 800', L('Pêcheur', 'Angler')], ['zoe', 36, '17 150', L('Mineur', 'Miner')]],
  },

  alt: {
    type: 'alert',
    title: L('Compte suspect', 'Suspect account'),
    risk: [L('Risque élevé · 72', 'High risk · 72'), C.red],
    who: ['nova.x', L('Arrivé il y a 2 h · compte de 3 jours', 'Joined 2 h ago · 3-day-old account')],
    signals: [[L('Pseudo et avatar proches', 'Similar name and avatar'), 82, C.red], [L('Même invitation', 'Same invite'), 74, C.orange], [L('Style d’écriture', 'Writing style'), 61, C.orange], [L('Horaires jamais en commun', 'Hours never overlap'), 48, C.yellow]],
    buttons: [[L('Lier les comptes', 'Link accounts'), C.red], [L('Rejeter', 'Dismiss'), '#9a96ad']],
  },
  raid: {
    type: 'alert',
    title: L('Mode raid', 'Raid mode'),
    risk: [L('Seuil dépassé', 'Threshold exceeded'), C.red],
    who: ['raid.bot', L('14 arrivées en 60 s · seuil : 10', '14 joins in 60 s · threshold: 10')],
    signals: [[L('Arrivées / 60 s', 'Joins / 60 s'), 100, C.red], [L('Comptes de moins d’un jour', 'Accounts under a day old'), 64, C.orange], [L('Même modèle de pseudo', 'Same name pattern'), 48, C.yellow]],
    buttons: [[L('Captcha pour tous', 'Captcha for all'), C.accent], [L('Lever le mode raid', 'Lift raid mode'), '#9a96ad']],
  },
  scam: {
    type: 'alert',
    title: L('Lien d’arnaque bloqué', 'Scam link blocked'),
    risk: [L('Phishing', 'Phishing'), C.red],
    who: ['free-nitro.gift', L('Domaine jumeau de discord.gift', 'Lookalike of discord.gift')],
    signals: [[L('Domaine récent', 'Recently registered'), 90, C.red], [L('Ressemble à un site officiel', 'Mimics an official site'), 84, C.red], [L('Signalé ailleurs', 'Reported elsewhere'), 66, C.orange]],
    buttons: [[L('Message supprimé', 'Message deleted'), C.green], [L('Voir le rapport', 'See report'), '#9a96ad']],
  },
  toxicity: {
    type: 'alert',
    title: L('Alerte AegisAI', 'AegisAI alert'),
    risk: [L('Toxicité 0,91', 'Toxicity 0.91'), C.red],
    who: ['dev0ps', L('« Message poli mais blessant »', '“Polite but hurtful message”')],
    signals: [[L('Toxicité', 'Toxicity'), 91, C.red], [L('Colère', 'Anger'), 72, C.orange], [L('Mépris', 'Contempt'), 55, C.yellow]],
    buttons: [[L('Avertir', 'Warn'), C.orange], [L('Ignorer', 'Ignore'), '#9a96ad']],
  },

  link: {
    type: 'graph',
    nodes: [[L('Serveur A', 'Server A'), 90, 150, C.accent], [L('Serveur B', 'Server B'), 410, 150, C.pink], [L('Serveur staff', 'Staff server'), 270, 360, C.teal]],
    edges: [[0, 1, L('#général ↔ #general', '#general ↔ #general')], [0, 2, L('Rôles synchronisés', 'Synced roles')], [1, 2, '']],
  },
  org: {
    type: 'graph',
    nodes: [[L('Fondateur', 'Founder'), 270, 40, C.accent], [L('Responsable modération', 'Head of moderation'), 110, 190, C.pink], [L('Responsable com', 'Head of community'), 400, 190, C.teal], [L('Modérateurs', 'Moderators'), 110, 340, C.blue], [L('Animateurs', 'Hosts'), 400, 340, C.orange]],
    edges: [[0, 1, ''], [0, 2, ''], [1, 3, ''], [2, 4, '']],
  },
  altgraph: {
    type: 'graph',
    nodes: [[L('Compte principal', 'Main account'), 270, 50, C.accent], [L('Alt n°1', 'Alt #1'), 90, 250, C.red], [L('Alt n°2', 'Alt #2'), 410, 250, C.red], [L('Membre légitime', 'Legitimate member'), 270, 380, '#9a96ad']],
    edges: [[0, 1, L('Même invitation', 'Same invite')], [0, 2, L('Même appareil', 'Same device')], [0, 3, '']],
  },

  mcp: {
    type: 'code',
    title: L('Assistant IA · serveur MCP', 'AI assistant · MCP server'),
    lines: [
      ['you', L('Crée un salon #annonces et poste la règle 3', 'Create an #announcements channel and post rule 3')],
      ['tool', 'create_channel  name="annonces"'],
      ['ok', L('Salon créé', 'Channel created')],
      ['tool', 'send_message  channel="annonces"'],
      ['ok', L('Message envoyé', 'Message sent')],
    ],
  },
  site: {
    type: 'browser',
    url: 'kotbo.fr/s/ton-serveur',
    title: L('Bienvenue chez les Phénix', 'Welcome to the Phoenix crew'),
    blocks: [L('Actualités', 'News'), L('Wiki', 'Wiki'), L('Forum', 'Forum'), L('Classement', 'Leaderboard')],
  },
  docs: {
    type: 'browser',
    url: 'kotbo.fr/docs',
    title: L('Documentation de Kotbo', 'Kotbo documentation'),
    blocks: [L('Premiers pas', 'Getting started'), L('Modération', 'Moderation'), L('Communauté', 'Community'), L('Staff', 'Staff')],
  },
  flow: {
    type: 'flow',
    title: L('Automatisation', 'Automation'),
    steps: [[L('Quand', 'When'), L('Un membre rejoint', 'A member joins'), C.green], [L('Si', 'If'), L('Compte de moins de 3 jours', 'Account under 3 days old'), C.orange], [L('Alors', 'Then'), L('Ouvrir un ticket de vérification', 'Open a verification ticket'), C.accent]],
    test: L('Test réussi · 3 / 3 étapes', 'Test passed · 3 / 3 steps'),
  },
};

/** Le groupe de chaque billet, par son adresse française ; les pages de la console, par leur clé. */
export const SCENE_OF = {
  'faire-un-giveaway-discord': 'giveaway',
  'bot-ticket-discord': 'tickets',
  'systeme-niveaux-xp-discord': 'leveling',
  'automod-discord-anti-spam': 'automod',
  'message-bienvenue-discord': 'welcome',
  'proteger-serveur-discord-raid': 'raid',
  'securiser-serveur-discord-checklist': 'checklist',
  'role-reaction-discord': 'roles',
  'sanctions-discord-warn-mute-ban': 'sanctions',
  'verification-captcha-discord': 'verification',
  'bloquer-arnaques-nitro-phishing-discord': 'scam',
  'rendre-serveur-discord-actif': 'activity',
  'bot-economie-discord': 'economy',
  'notification-twitch-youtube-discord': 'twitch',
  'salon-vocal-temporaire-discord': 'voice',
  'statistiques-serveur-discord': 'stats',
  'creer-embed-discord': 'embed',
  'recrutement-staff-discord': 'recruitment',
  'appel-ban-discord-formulaire-unban': 'appeals',
  'salon-suggestion-discord': 'suggestions',
  'gerer-serveur-discord-ia': 'mcp',
  'creer-site-serveur-discord': 'site',
  'tracker-invitations-discord': 'invites',
  'rappel-bump-disboard': 'bump',
  'partenariat-serveur-discord': 'embed',
  'relier-serveurs-discord': 'link',
  'systeme-clan-discord': 'clans',
  'systeme-reputation-discord': 'reputation',
  'starboard-discord': 'starboard',
  'salon-logs-discord': 'logs',
  'reglement-serveur-discord': 'rules',
  'sauvegarde-serveur-discord': 'backup',
  'quiz-evenement-discord': 'quiz',
  'confession-anonyme-discord': 'confession',
  'jeux-salon-fun-discord': 'counting',
  'formulaire-candidature-discord': 'forms',
  'detecter-doubles-comptes-discord': 'alt',
  'contournement-ban-discord': 'altgraph',
  'choisir-bot-detection-doubles-comptes-discord': 'alt',
  'annonces-actualites-rss-discord': 'news',
  'kotbo-10-0': 'release',
  'organigramme-staff': 'org',
  'automatisations-tester-et-corriger': 'flow',
  'roles-a-boutons-refaits': 'roles',
  'kotbo-gratuit': 'free',
  'documentation-kotbo-nouvelle-adresse': 'docs',
  'aegisai-by-kotbo': 'toxicity',
  'feature-automod': 'automod',
  'feature-double_accounts': 'alt',
  'feature-logs': 'logs',
  'feature-tickets': 'tickets',
  'feature-leveling': 'leveling',
};

const t = (o, loc) => (o && typeof o === 'object' ? o[loc] : o);

/** Le HTML de la scène d'un groupe, dans la langue `loc`. */
export function renderScene(name, loc) {
  const g = GROUPS[name];
  if (!g) throw new Error(`Groupe de scène inconnu : ${name}`);
  return RENDER[g.type](g, loc);
}

const RENDER = {
  list(g, loc) {
    const rows = g.rows
      .map((r, i) => {
        const col = r.color;
        return `<div class="row">${avatar(r.n, i)}<div class="tx"><b>${esc(r.n)}</b><small>${esc(t(r.s, loc))}</small></div>${chip(t(r.chip, loc), col)}</div>`;
      })
      .join('');
    return `<div class="card" style="left:10px;top:40px;width:540px">${hd(t(g.title, loc), t(g.count, loc))}${rows}</div>` + stat(t(g.stat[0], loc), g.stat[1], 330, 392, g.stat[2]);
  },
  toggles(g, loc) {
    const rows = g.items.map(([label, on]) => `<div class="row"><div class="tx"><b>${esc(t(label, loc))}</b></div>${sw(on)}</div>`).join('');
    const [sl, pct] = g.slider;
    return (
      `<div class="card" style="left:10px;top:40px;width:540px">${hd(t(g.title, loc), t(g.right, loc))}${rows}` +
      `<div class="row col"><small>${esc(t(sl, loc))}</small>${bar(pct)}</div></div>`
    );
  },
  chat(g, loc) {
    const e = g.embed;
    const lines = e.lines.map((l) => `<p>${esc(t(l, loc))}</p>`).join('');
    const btns = g.buttons.map(([label, color]) => `<span class="btn" style="background:${color === '#9a96ad' ? '#2a2736' : color + '33'};color:${color === '#9a96ad' ? '#cfcbe0' : color}">${esc(t(label, loc))}</span>`).join('');
    return (
      `<div class="card chat" style="left:10px;top:60px;width:540px"><div class="msg">${avatar(g.bot, 0)}<div class="body">` +
      `<div class="who"><b>${esc(g.bot)}</b><span class="tag">BOT</span><small>${loc === 'fr' ? 'Aujourd’hui à 21:04' : 'Today at 9:04 PM'}</small></div>` +
      `<div class="embed" style="border-left-color:${e.color}"><h4>${esc(t(e.title, loc))}</h4>${lines}</div>` +
      `<div class="btns">${btns}</div></div></div></div>`
    );
  },
  roles(g, loc) {
    const pills = g.pills.map(([label, color, n]) => `<span class="pill" style="border-color:${color}66;background:${color}1f"><b>${esc(label)}</b><em style="color:${color}">${esc(n)}</em></span>`).join('');
    return `<div class="card chat" style="left:10px;top:70px;width:540px"><div class="embed" style="border-left-color:${C.accent};margin:18px"><h4>${esc(t(g.title, loc))}</h4>${g.lines.map((l) => `<p>${esc(t(l, loc))}</p>`).join('')}</div><div class="pills">${pills}</div></div>`;
  },
  chart(g, loc) {
    const kpis = g.kpis.map(([label, value, color]) => `<div class="stat in"><small>${esc(t(label, loc))}</small><strong style="color:${color}">${esc(value)}</strong></div>`).join('');
    const bars = g.bars.map((h, i) => `<i style="height:${h}%;opacity:${0.45 + (i / g.bars.length) * 0.55}"></i>`).join('');
    return `<div class="card" style="left:10px;top:40px;width:540px">${hd(t(g.title, loc), loc === 'fr' ? '30 jours' : '30 days')}<div class="kpis">${kpis}</div><div class="bars">${bars}</div></div>`;
  },
  board(g, loc) {
    const rows = g.rows
      .map(([n, pct, val, tag], i) => `<div class="row"><span class="rank">${i + 1}</span>${avatar(n, i)}<div class="tx"><b>${esc(n)}</b>${bar(pct, AV[i % AV.length])}</div><div class="val"><b>${esc(val)}</b><small>${esc(t(tag, loc))}</small></div></div>`)
      .join('');
    return `<div class="card" style="left:10px;top:40px;width:540px">${hd(t(g.title, loc), g.unit)}${rows}</div>`;
  },
  alert(g, loc) {
    const [riskText, riskColor] = g.risk;
    const sig = g.signals.map(([label, pct, color]) => `<div class="sig"><span>${esc(t(label, loc))}</span>${bar(pct, color)}<em>${pct}</em></div>`).join('');
    const btns = g.buttons.map(([label, color]) => `<span class="btn" style="background:${color === '#9a96ad' ? '#2a2736' : color + '33'};color:${color === '#9a96ad' ? '#cfcbe0' : color}">${esc(t(label, loc))}</span>`).join('');
    return (
      `<div class="card" style="left:10px;top:30px;width:540px">${hd(t(g.title, loc), '')}` +
      `<div class="row">${avatar(g.who[0], 2)}<div class="tx"><b>${esc(g.who[0])}</b><small>${esc(t(g.who[1], loc))}</small></div>${chip(t(riskText, loc), riskColor)}</div>` +
      `<div class="sigs">${sig}</div><div class="btns pad">${btns}</div></div>`
    );
  },
  graph(g, loc) {
    const nodes = g.nodes;
    const lines = g.edges
      .map(([a, b]) => `<line x1="${nodes[a][1] + 70}" y1="${nodes[a][2] + 24}" x2="${nodes[b][1] + 70}" y2="${nodes[b][2] + 24}" stroke="#8b8cf8" stroke-opacity=".45" stroke-width="2" stroke-dasharray="6 6"/>`)
      .join('');
    const labels = g.edges
      .filter((e) => e[2])
      .map(([a, b, label]) => `<div class="elabel" style="left:${(nodes[a][1] + nodes[b][1]) / 2 + 70}px;top:${(nodes[a][2] + nodes[b][2]) / 2 + 24}px">${esc(t(label, loc))}</div>`)
      .join('');
    const boxes = nodes.map(([label, x, y, color]) => `<div class="node" style="left:${x}px;top:${y}px;border-color:${color}88"><i style="background:${color}"></i><b>${esc(t(label, loc))}</b></div>`).join('');
    return `<div class="card" style="left:0;top:20px;width:580px;height:470px"><svg width="580" height="470" style="position:absolute;left:0;top:0">${lines}</svg>${labels}${boxes}</div>`;
  },
  code(g, loc) {
    const lines = g.lines
      .map(([kind, text]) => {
        const v = t(text, loc);
        if (kind === 'you') return `<div class="cl you"><span>${loc === 'fr' ? 'Toi' : 'You'}</span>${esc(v)}</div>`;
        if (kind === 'tool') return `<div class="cl tool"><span>→</span>${esc(v)}</div>`;
        return `<div class="cl ok"><span>✓</span>${esc(v)}</div>`;
      })
      .join('');
    return `<div class="card" style="left:10px;top:60px;width:540px">${hd(t(g.title, loc), '')}<div class="code">${lines}</div></div>`;
  },
  browser(g, loc) {
    const blocks = g.blocks.map((b, i) => `<div class="tile" style="border-color:${AV[i]}55"><i style="background:${AV[i]}"></i><b>${esc(t(b, loc))}</b></div>`).join('');
    return `<div class="card" style="left:10px;top:40px;width:540px"><div class="url"><span></span><span></span><span></span><em>${esc(g.url)}</em></div><div class="page"><h4>${esc(t(g.title, loc))}</h4><div class="tiles">${blocks}</div></div></div>`;
  },
  flow(g, loc) {
    const steps = g.steps
      .map(([kind, text, color], i) => `<div class="step" style="border-color:${color}66"><em style="color:${color}">${esc(t(kind, loc))}</em><b>${esc(t(text, loc))}</b></div>${i < g.steps.length - 1 ? '<div class="arrow">↓</div>' : ''}`)
      .join('');
    return `<div class="card" style="left:10px;top:30px;width:540px">${hd(t(g.title, loc), '')}<div class="flow">${steps}</div><div class="row">${chip(t(g.test, loc), C.green)}</div></div>`;
  },
};

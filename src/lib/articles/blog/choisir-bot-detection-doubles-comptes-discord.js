/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'choisir-bot-detection-doubles-comptes-discord', en: 'discord-alt-detector-bot' },
  date: '2026-11-24',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['double_accounts'],
  text: {
    fr: {
      title: 'Bot détecteur d’alts Discord : 6 critères',
      h1: 'Comment choisir un bot qui détecte les doubles comptes sur Discord',
      description:
        'Alt checker, alt finder, alt detector : 6 critères pour choisir un bot de détection de doubles comptes Discord sans bannir d’innocents.',
      lead: 'Tous les bots qui promettent de repérer les alts ne se valent pas : certains comparent un seul indice, d’autres bannissent sur un score sans que personne ne vérifie. Avant d’en installer un, passe-le au crible de ces six critères. Ils s’appliquent à n’importe quel bot, Kotbo compris',
      sections: [
        {
          h2: 'Ce qu’un détecteur d’alts peut et ne peut pas faire',
          body: 'Discord n’expose pas le lien entre deux comptes. Un bot ne le lit donc pas : il le déduit d’indices (âge du compte, profil, invitation, style d’écriture, horaires), et une déduction reste une probabilité. Un site qui promet de lister les alts de n’importe qui à partir d’un ID ne peut pas tenir sa promesse. Un bot qui travaille dans ton serveur, avec ses données réelles, a une vraie chance d’être utile',
        },
        {
          h2: 'Les six critères',
          body: 'Ce que tu dois regarder avant d’installer un bot de détection',
          items: [
            {
              title: '1. Plusieurs indices, pas un seul',
              body: 'Un pseudo proche ne prouve rien. Un bon détecteur combine des indices de natures différentes, et leur concordance pèse plus que leur nombre',
            },
            {
              title: '2. Des raisons visibles',
              body: 'Un score sans explication ne se défend pas devant un membre. Choisis un bot qui montre pourquoi un compte est suspect, indice par indice',
            },
            {
              title: '3. Une décision humaine',
              body: 'Un bot qui bannit seul sur un score bannira des innocents : deux amis qui partagent un réseau suffisent. Le bot signale, le staff tranche',
            },
            {
              title: '4. Ce qu’il demande à tes membres',
              body: 'Les indices de profil et d’invitation n’exigent rien d’eux. Une vérification par lien ajoute des indices techniques, mais c’est une démarche de plus à l’arrivée : vérifie qu’elle reste optionnelle',
            },
            {
              title: '5. Ce qu’il garde, et combien de temps',
              body: 'Analyser le style d’écriture suppose d’enregistrer des messages. Regarde la durée de conservation, la possibilité de tout couper, et préviens tes membres dans ton règlement',
            },
            {
              title: '6. Un détecteur qui apprend de tes décisions',
              body: 'Chaque lien confirmé ou rejeté devrait affiner la détection pour ton serveur, sinon le même faux positif reviendra à chaque arrivée',
            },
          ],
        },
        {
          h2: 'Où en est Kotbo sur ces critères',
          body: 'Ce que fait le détecteur de doubles comptes de Kotbo, point par point, pour que tu puisses comparer',
          points: [
            'Indices combinés : profil, invitation, style d’écriture, horaires, comptes jamais actifs en même temps, et appareil ou réseau avec la vérification par lien',
            'Raisons affichées dans le rapport de détection, avec un niveau de risque faible, moyen ou élevé',
            'Aucun ban automatique : le staff lie les comptes ou écarte l’alerte',
            'Les indices de profil et d’invitation marchent sans rien demander aux membres ; la vérification par lien est optionnelle',
            'Journalisation des messages à activer pour la détection fine, avec la durée de rétention que tu choisis, coupable à tout moment',
            'Chaque décision ajuste le poids des indices pour ton serveur, et un petit serveur profite de ce que les autres ont déjà appris',
            'Gratuit, sans carte bancaire et sans limite de durée',
          ],
        },
        {
          h2: 'Tester un bot avant de lui faire confiance',
          body: 'Même avec les bons critères, vérifie sur ton propre serveur',
          steps: [
            { title: 'Lance un scan sur tes membres actuels', body: 'Tu vois combien de cas il remonte et si les raisons tiennent la route' },
            { title: 'Compare avec ce que tu sais', body: 'Les alts que ton staff connaît déjà doivent ressortir. S’ils passent sous le radar, le bot ne t’apporte rien' },
            { title: 'Compte les faux positifs', body: 'Si la moitié des alertes sont des membres légitimes, monte le seuil ou change de bot' },
            { title: 'Lis ce qu’il stocke', body: 'Avant de l’activer pour de bon, relis sa politique de confidentialité et ce que tu devras dire à tes membres' },
          ],
        },
        {
          h2: 'Aller plus loin',
          body: 'Le détecteur de Kotbo en détail, avec ce qu’il compare et ce qu’il demande',
          items: [
            {
              title: 'Le détecteur de doubles comptes de Kotbo',
              body: 'Gratuit, il tourne dans ton serveur et ne bannit jamais sans le staff',
              link: { feature: 'double_accounts', label: 'Voir le détecteur de doubles comptes' },
            },
          ],
        },
      ],
      faq: [
        {
          q: 'Quel est le meilleur bot pour détecter les alts sur Discord ?',
          a: 'Celui qui combine plusieurs indices, montre ses raisons et laisse ton staff décider. Kotbo répond à ces critères, mais teste n’importe quel bot sur tes membres actuels avant de t’y fier',
        },
        {
          q: 'Un site de vérification d’alts par ID est-il fiable ?',
          a: 'Non : Discord n’expose pas le lien entre deux comptes, donc un site qui prétend le deviner depuis un ID seul ne peut pas le savoir. Un bot qui travaille dans ton serveur compare de vraies données',
        },
        {
          q: 'Un détecteur d’alts lit-il les messages de mes membres ?',
          a: 'Seulement pour les indices de comportement, et seulement si tu actives la journalisation des messages. Sans elle, Kotbo n’utilise que des signaux de profil, d’invitation, de réseau et de temps',
        },
        {
          q: 'Faut-il un bot de plus pour détecter les alts ?',
          a: 'Pas forcément : la détection de Kotbo fait partie d’un bot complet, avec la modération, les logs et les tickets',
        },
      ],
    },
    en: {
      title: 'Discord Alt Detector Bot: 6 Criteria to Choose',
      h1: 'How to choose a bot that detects alt accounts on Discord',
      description:
        'Alt checker, alt finder, alt detector: 6 criteria to pick a Discord alt detection bot that doesn’t ban innocents or spy on your community.',
      lead: 'Not every bot that promises to spot alts is equal: some compare a single clue, others ban on a score without anyone checking. Before installing one, run it through these six criteria. They apply to any bot, Kotbo included',
      sections: [
        {
          h2: 'What an alt detector can and can’t do',
          body: 'Discord doesn’t expose the link between two accounts, so a bot doesn’t read it: it infers it from clues (account age, profile, invite, writing style, hours), and an inference is still a probability. A site that promises to list anyone’s alts from an ID can’t keep that promise. A bot that works inside your server, with its real data, has a real chance of being useful',
        },
        {
          h2: 'The six criteria',
          body: 'What to look at before installing a detection bot',
          items: [
            {
              title: '1. Several clues, not one',
              body: 'A similar username proves nothing. A good detector combines clues of different kinds, and agreement between them weighs more than their number',
            },
            {
              title: '2. Visible reasons',
              body: 'A score without an explanation can’t be defended in front of a member. Pick a bot that shows why an account is suspect, clue by clue',
            },
            {
              title: '3. A human decision',
              body: 'A bot that bans on its own from a score will ban innocents: two friends sharing a network are enough. The bot flags, staff decides',
            },
            {
              title: '4. What it asks of your members',
              body: 'Profile and invite clues require nothing from them. Link verification adds technical clues, but it’s one more step on arrival: check that it stays optional',
            },
            {
              title: '5. What it keeps, and for how long',
              body: 'Analyzing writing style means recording messages. Look at the retention period, whether you can turn it all off, and tell your members in your rules',
            },
            {
              title: '6. A detector that learns from your decisions',
              body: 'Every confirmed or rejected link should refine detection for your server, otherwise the same false positive comes back on every join',
            },
          ],
        },
        {
          h2: 'Where Kotbo stands on these criteria',
          body: 'What Kotbo’s alt account detection does, point by point, so you can compare',
          points: [
            'Combined clues: profile, invite, writing style, hours, accounts never online together, and device or network with link verification',
            'Reasons shown in the detection report, with a low, medium or high risk level',
            'No automatic ban: staff links the accounts or dismisses the alert',
            'Profile and invite clues work without asking members anything; link verification is optional',
            'Message logging to turn on for fine detection, with the retention period you choose, and off at any time',
            'Each decision tunes the weight of the clues for your server, and small servers benefit from what the others have already learned',
            'Free, no credit card and no time limit',
          ],
        },
        {
          h2: 'Test a bot before you trust it',
          body: 'Even with the right criteria, check on your own server',
          steps: [
            { title: 'Run a scan on your current members', body: 'You see how many cases it raises and whether the reasons hold up' },
            { title: 'Compare with what you know', body: 'The alts your staff already knows about should show up. If they slip under the radar, the bot adds nothing' },
            { title: 'Count the false positives', body: 'If half the alerts are legitimate members, raise the threshold or change bots' },
            { title: 'Read what it stores', body: 'Before turning it on for good, reread its privacy policy and what you’ll need to tell your members' },
          ],
        },
        {
          h2: 'Go further',
          body: 'Kotbo’s detector in detail, with what it compares and what it needs',
          items: [
            {
              title: 'Kotbo’s alt account checker',
              body: 'Free, it runs inside your server and never bans without staff',
              link: { feature: 'double_accounts', label: 'See the alt account checker' },
            },
          ],
        },
      ],
      faq: [
        {
          q: 'What is the best bot to detect alts on Discord?',
          a: 'The one that combines several clues, shows its reasons and lets your staff decide. Kotbo meets these criteria, but test any bot on your current members before relying on it',
        },
        {
          q: 'Is an alt checker website that works from a user ID reliable?',
          a: 'No: Discord doesn’t expose the link between two accounts, so a site that claims to guess it from an ID alone can’t know. A bot that works inside your server compares real data',
        },
        {
          q: 'Does an alt detector read my members’ messages?',
          a: 'Only for behavior clues, and only if you turn on message logging. Without it, Kotbo only uses profile, invite, network and timing signals',
        },
        {
          q: 'Do I need one more bot to detect alts?',
          a: 'Not necessarily: Kotbo’s detection is part of a full bot, with moderation, logs and tickets',
        },
      ],
    },
  },
};

/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'quiz-evenement-discord', en: 'discord-quiz-event-bot' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['events'],
  text: {
    fr: {
      title: 'Quiz Discord : organiser un quiz, un CTF ou un événement',
      h1: 'Quiz Discord : organiser un quiz ou un événement avec inscriptions',
      description:
        'Quiz Discord : comment créer un quiz avec questions et récompenses, lancer un CTF ou un événement avec inscriptions, annoncer, déclencher et suivre les résultats avec Kotbo.',
      lead: 'Un quiz, un CTF ou un tournoi, c’est le genre d’événement qui remplit un serveur un soir de semaine. Discord a des événements planifiés, mais rien pour poser des questions, compter les points ou récompenser. Dans Kotbo, la page Événements du dashboard prépare l’événement, l’annonce avec un bouton d’inscription, le lance au bon moment et garde les résultats',
      sections: [
        {
          h2: 'Quels événements organiser sur un serveur Discord',
          body: 'Un événement donne une raison de se connecter à une heure précise, et ça se prépare à l’avance',
          points: [
            'Un quiz : des questions à choix multiples, chacune avec sa bonne réponse et ses points',
            'Un CTF (Capture The Flag) : des défis dont la réponse est un « flag » à soumettre',
            'Un tournoi : des inscriptions, suivies depuis une page publique',
            'Un événement avec inscriptions : une soirée, un meetup, une sortie, avec une liste d’inscrits',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Discord a des événements planifiés : un titre, une date, un lieu, un bouton « Intéressé ». C’est parfait pour annoncer, mais il n’y a ni questions, ni points, ni classement, ni récompense automatique. Pour animer un quiz, il faut un bot',
        },
        {
          h2: 'Créer un quiz avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Événements. Le bouton Nouveau quiz ouvre l’éditeur',
          steps: [
            { title: 'Donne un titre et une description', body: 'Ils sont repris dans l’annonce Discord et sur la page publique de l’événement' },
            { title: 'Écris les questions', body: 'Un énoncé, au moins deux options de réponse, la bonne cochée à gauche, et des points. Tu peux aussi importer un fichier CSV pour ne pas tout saisir à la main' },
            { title: 'Choisis le salon du jeu', body: 'C’est là que les questions sont publiées, avec un bouton par option' },
            { title: 'Ajoute des récompenses', body: 'De l’XP et, si tu veux, un rôle donné aux participants' },
            { title: 'Publie sur Discord', body: 'L’annonce part dans le salon d’annonce avec son bouton d’inscription. Tu peux aussi créer l’événement planifié de Discord en même temps' },
          ],
        },
        {
          h2: 'Choisir comment l’événement démarre',
          body: 'Le déclencheur automatique dit quand le jeu commence',
          items: [
            { title: 'Manuel', body: 'Tu lances toi-même depuis la page de pilotage, quand tout le monde est là' },
            { title: 'Planifié', body: 'Une date et une heure de lancement. Le statut du déclencheur passe de « en attente » à « déclenché »' },
            { title: 'Nombre de membres atteint', body: 'L’événement démarre quand le serveur atteint un seuil, pratique pour une opération d’anniversaire ou de recrutement' },
          ],
        },
        {
          h2: 'Lancer un CTF',
          body: 'Un CTF remplace les questions par des défis, avec un titre, un énoncé, un flag attendu et des points. Les joueurs soumettent leurs flags avec une commande, et le classement se met à jour',
          commands: [
            { name: '/ctf claim flag:<flag>', body: 'Soumet un flag pour avancer dans le CTF. Une réponse d’erreur indique si aucun CTF n’est en cours sur le serveur' },
            { name: '/event resultat', body: 'Affiche ses propres résultats à un quiz, en message visible de toi seul' },
          ],
        },
        {
          h2: 'Piloter, inscrire, mesurer',
          body: 'Une fois l’événement publié, la page de pilotage prend le relais',
          items: [
            { title: 'Inscriptions', body: 'Un clic sur « S’inscrire » suffit, ou un formulaire à remplir si tu en relies un' },
            { title: 'Pilotage en direct', body: 'Tu avances d’une question à l’autre, tu suis les participants et tu clôtures quand tu veux' },
            { title: 'Résultats', body: 'Les participations et les inscriptions sont comptées. Les événements sont filtrés par brouillon, en cours et terminé' },
            { title: 'Republier l’annonce', body: 'Si tu changes la date ou la description, tu republies l’annonce depuis l’éditeur' },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire un quiz sur Discord ?',
          a: 'Avec Kotbo, ouvre la page Événements du dashboard, clique sur Nouveau quiz, écris les questions et leurs options, choisis le salon du jeu, puis publie l’annonce',
        },
        {
          q: 'Quel bot de quiz Discord choisir ?',
          a: 'Plusieurs bots proposent des quiz. Celui de Kotbo gère aussi les CTF, les tournois et les événements avec inscriptions, et vit dans le même dashboard que le reste de ta communauté',
        },
        {
          q: 'Peut-on importer des questions depuis un fichier ?',
          a: 'Oui, l’éditeur accepte l’import d’un fichier CSV pour ajouter les questions d’un coup',
        },
        {
          q: 'Peut-on récompenser les participants ?',
          a: 'Oui. Tu peux donner de l’XP, et un rôle pour les participants si tu en désignes un',
        },
        {
          q: 'Comment programmer le début d’un quiz ?',
          a: 'Choisis un déclencheur planifié avec une date et une heure, ou un seuil de membres. Sinon le lancement reste manuel, depuis la page de pilotage',
        },
        {
          q: 'Un membre peut-il revoir ses résultats ?',
          a: 'Oui, avec /event resultat. La réponse n’est visible que par lui',
        },
      ],
    },
    en: {
      title: 'Discord quiz: run a quiz, a CTF or an event',
      h1: 'Discord quiz: run a quiz or an event with sign-ups',
      description:
        'Discord quiz: how to build a quiz with questions and rewards, run a CTF or an event with sign-ups, announce it, trigger it and track results with Kotbo.',
      lead: 'A quiz, a CTF or a tournament is the kind of event that fills a server on a weeknight. Discord has scheduled events, but nothing to ask questions, count points or give rewards. In Kotbo, the Events page of the dashboard prepares the event, announces it with a sign-up button, launches it at the right moment and keeps the results',
      sections: [
        {
          h2: 'Which events to run on a Discord server',
          body: 'An event gives people a reason to log on at a set time, and it can be prepared ahead',
          points: [
            'A quiz: multiple-choice questions, each with its right answer and its points',
            'A CTF (Capture The Flag): challenges whose answer is a “flag” to submit',
            'A tournament: sign-ups, followed from a public page',
            'An event with sign-ups: a party, a meetup, an outing, with a list of attendees',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Discord has scheduled events: a title, a date, a location, an “Interested” button. That’s great for announcing, but there are no questions, no points, no ranking and no automatic reward. To run a quiz you need a bot',
        },
        {
          h2: 'Building a quiz with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Events page. The New quiz button opens the editor',
          steps: [
            { title: 'Give it a title and a description', body: 'They’re reused in the Discord announcement and on the event’s public page' },
            { title: 'Write the questions', body: 'A prompt, at least two answer options, the right one ticked on the left, and points. You can also import a CSV file so you don’t type everything by hand' },
            { title: 'Pick the game channel', body: 'That’s where the questions are posted, with one button per option' },
            { title: 'Add rewards', body: 'XP and, if you want, a role given to participants' },
            { title: 'Publish to Discord', body: 'The announcement goes to the announcement channel with its sign-up button. You can create Discord’s scheduled event at the same time' },
          ],
        },
        {
          h2: 'Choosing how the event starts',
          body: 'The automatic trigger says when the game begins',
          items: [
            { title: 'Manual', body: 'You launch it yourself from the control page, once everyone is there' },
            { title: 'Scheduled', body: 'A launch date and time. The trigger status moves from “pending” to “triggered”' },
            { title: 'Member count reached', body: 'The event starts when the server hits a threshold, handy for an anniversary or a recruitment push' },
          ],
        },
        {
          h2: 'Running a CTF',
          body: 'A CTF swaps questions for challenges, each with a title, a prompt, an expected flag and points. Players submit their flags with a command, and the leaderboard updates',
          commands: [
            { name: '/ctf claim flag:<flag>', body: 'Submits a flag to move forward in the CTF. An error reply says if no CTF is running on the server' },
            { name: '/event resultat', body: 'Shows your own results in a quiz, in a message only you can see' },
          ],
        },
        {
          h2: 'Control, sign up, measure',
          body: 'Once the event is published, the control page takes over',
          items: [
            { title: 'Sign-ups', body: 'One click on “Sign up” is enough, or a form to fill in if you link one' },
            { title: 'Live control', body: 'You move from one question to the next, follow participants and wrap up when you want' },
            { title: 'Results', body: 'Participations and sign-ups are counted. Events are filtered by draft, ongoing and finished' },
            { title: 'Republish the announcement', body: 'If you change the date or the description, you republish the announcement from the editor' },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I run a quiz on Discord?',
          a: 'With Kotbo, open the Events page of the dashboard, click New quiz, write the questions and their options, pick the game channel, then publish the announcement',
        },
        {
          q: 'Which Discord quiz bot should I use?',
          a: 'Several bots offer quizzes. Kotbo’s also handles CTFs, tournaments and events with sign-ups, and lives in the same dashboard as the rest of your community tools',
        },
        {
          q: 'Can I import questions from a file?',
          a: 'Yes, the editor accepts a CSV import to add the questions in one go',
        },
        {
          q: 'Can I reward participants?',
          a: 'Yes. You can give XP, and a role to participants if you pick one',
        },
        {
          q: 'How do I schedule the start of a quiz?',
          a: 'Choose a scheduled trigger with a date and time, or a member threshold. Otherwise launching stays manual, from the control page',
        },
        {
          q: 'Can a member check their results?',
          a: 'Yes, with /event resultat. The reply is visible only to them',
        },
      ],
    },
  },
};

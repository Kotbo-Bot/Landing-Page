/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'recrutement-staff-discord', en: 'how-to-recruit-discord-moderators' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['recruitment', 'tutoring', 'staff_roles'],
  text: {
    fr: {
      title: 'Recrutement staff Discord : recruter ses modérateurs',
      h1: 'Recruter des modérateurs sur Discord, de l’annonce à la période d’essai',
      description:
        'Recrutement staff Discord : annoncer les postes, un formulaire de candidature modérateur, le tri, l’entretien oral et la période d’essai avec un tuteur.',
      lead: 'Un bon recrutement staff sur Discord suit toujours le même chemin : annoncer les postes, recevoir les candidatures dans un formulaire, trier, faire passer un entretien, puis intégrer la recrue avec une période d’essai. Kotbo tient ce chemin de bout en bout, depuis le dashboard et des tickets d’entretien sur Discord',
      sections: [
        {
          h2: 'Avant d’ouvrir les candidatures',
          body: 'Un recrutement raté commence souvent par un besoin flou. Prends dix minutes pour poser ce qui suit, et écris-le quelque part où le staff le retrouve',
          points: [
            'Le poste : modération, animation, support, et combien de places',
            'Les critères minimum, comme l’âge, les disponibilités ou un micro si tu modères en vocal',
            'Des questions qui font écrire : une mise en situation dit plus qu’un « pourquoi toi ? »',
            'Qui lit les candidatures et qui tranche après l’entretien',
          ],
        },
        {
          h2: 'Le formulaire de candidature modérateur',
          body: 'Les candidatures postées dans un salon se perdent et s’exposent à tout le monde. Un formulaire les range au même endroit, une par candidat',
          items: [
            {
              title: 'Un formulaire Kotbo',
              body: 'Dans Formulaires, crée tes questions et active Recrutement sur le formulaire. Le candidat doit se connecter avec Discord pour répondre, donc tu sais toujours qui a postulé',
            },
            {
              title: 'Une hiérarchie liée',
              body: 'Rattache le formulaire à une hiérarchie du staff, Modération ou Animation par exemple. Elle décide du grade et du rôle que la recrue recevra',
            },
            {
              title: 'Ton Google Form, si tu y tiens',
              body: 'La page Recrutement génère un script Google Apps Script et une clé API. Colle-le dans ton Google Form, ajoute le déclencheur à l’envoi, et les réponses arrivent dans Kotbo',
            },
            {
              title: 'La fermeture automatique',
              body: 'Un poste peut se fermer seul à un nombre de candidatures en attente, et rouvrir dès que l’une est tranchée. Il peut aussi se fermer à un nombre de recrues',
            },
          ],
        },
        {
          h2: 'Annoncer les postes ouverts sur Discord',
          body: 'Le panneau de recrutement est un message Discord qui affiche chaque poste avec son statut, OPEN ou CLOSED, et un bouton Postuler qui ouvre le bon formulaire. Il se met à jour tout seul quand un poste ouvre ou ferme, donc plus de message « recrutement fermé » oublié en haut du salon. Tu le crées dans Formulaires, section Panneaux de recrutement : un titre, un salon, les postes à afficher dans l’ordre',
        },
        {
          h2: 'Trier les candidatures et faire passer l’oral',
          body: 'Toutes les candidatures arrivent dans la page Recrutement du dashboard. Les responsables sont prévenus, et un salon de journaux peut les annoncer côté Discord',
          steps: [
            {
              title: 'Lis et annote',
              body: 'Filtre par statut ou par poste, cherche un pseudo ou une réponse, passe d’une candidature à l’autre avec J et K. Les notes de gestion restent visibles du staff seul',
            },
            {
              title: 'Refuse avec une raison',
              body: 'Le refus clôt la candidature. La raison, facultative, part en message privé au candidat',
            },
            {
              title: 'Passe à l’oral',
              body: 'Le bouton Passer oral crée un ticket d’entretien, dans la catégorie de ton choix ou sur ton serveur staff lié. Le candidat y est invité à donner ses disponibilités pour un vocal',
            },
            {
              title: 'Tranche l’entretien',
              body: 'Concluant : la recrue est intégrée. Échoué : la candidature est refusée et le candidat doit attendre un mois avant de recandidater, ce que Kotbo lui annonce en MP',
            },
          ],
        },
        {
          h2: 'Intégrer la recrue dans l’équipe',
          body: 'Quand l’oral est concluant, Kotbo crée sa fiche staff au grade de départ de la hiérarchie, lui donne les rôles Discord du staff et ouvre une période d’essai. Tu peux choisir la hiérarchie et le grade de départ au moment de valider. La recrue apparaît ensuite dans l’organigramme, avec les autres membres du staff',
          figure: {
            screen: 'staff',
            caption: 'L’organigramme du staff dans le dashboard, où arrive chaque recrue. Démo sur un staff fictif',
          },
        },
        {
          h2: 'La période d’essai et le tutorat',
          body: 'Les premières semaines décident si la recrue reste. Le module Tutorat les encadre',
          items: [
            {
              title: 'Une période d’essai',
              body: 'Elle s’ouvre à l’intégration, prévue sur 14 jours, et se clôt par une réussite ou un échec',
            },
            {
              title: 'Un tuteur',
              body: 'Depuis la candidature, assigne un tuteur parmi le staff de niveau 2 et plus, ou les membres marqués tuteurs. Il est prévenu de son nouveau tutoré',
            },
            {
              title: 'Une checklist et des missions',
              body: 'Chaque hiérarchie a sa checklist de tutorat, et une liste de missions confiées pendant l’essai apparaît dans le planning de la recrue',
            },
            {
              title: 'Des rapports de suivi',
              body: 'Le tuteur rédige ses rapports sur la recrue, pour que la décision de fin d’essai ne repose pas sur un souvenir',
            },
          ],
        },
      ],
      faq: [
        {
          q: 'Comment recruter des modérateurs sur Discord ?',
          a: 'Annonce les postes ouverts, reçois les candidatures dans un formulaire, trie-les, fais passer un entretien oral, puis intègre la recrue avec une période d’essai et un tuteur. Kotbo gère chaque étape depuis son dashboard',
        },
        {
          q: 'Quelles questions poser dans une candidature de modérateur Discord ?',
          a: 'Demande l’âge, les disponibilités et l’expérience, puis des mises en situation : un membre qui insulte, un raid, un ami qui enfreint le règlement. Les réponses écrites montrent mieux le jugement qu’une liste de qualités',
        },
        {
          q: 'Comment faire un formulaire de candidature staff sur Discord ?',
          a: 'Avec Kotbo, crée un formulaire dans le dashboard et active Recrutement dessus. Le candidat se connecte avec Discord pour répondre, et sa candidature arrive dans la page Recrutement',
        },
        {
          q: 'Peut-on garder Google Forms pour les candidatures ?',
          a: 'Oui. Kotbo génère un script Google Apps Script et une clé API à coller dans ton formulaire, et chaque réponse arrive dans le dashboard',
        },
        {
          q: 'Comment fermer les candidatures quand il y en a trop ?',
          a: 'Règle la fermeture automatique du formulaire sur un nombre de candidatures en attente. Le poste se ferme, le panneau Discord passe en CLOSED, et tout rouvre quand une candidature est tranchée',
        },
        {
          q: 'Que se passe-t-il quand un candidat réussit son entretien ?',
          a: 'Kotbo crée sa fiche staff au grade de départ, lui donne les rôles du staff et ouvre une période d’essai à laquelle tu peux rattacher un tuteur',
        },
      ],
    },
    en: {
      title: 'How to recruit Discord moderators: staff applications',
      h1: 'How to recruit Discord moderators, from the opening to the trial period',
      description:
        'How to recruit Discord moderators: announce openings, run a staff application form, sort it, hold a voice interview and onboard with a trial and a mentor.',
      lead: 'Recruiting Discord moderators always follows the same path: announce the openings, collect applications in a form, sort them, hold an interview, then bring the new mod in with a trial period. Kotbo runs that path end to end, from the dashboard and interview tickets on Discord',
      sections: [
        {
          h2: 'Before you open applications',
          body: 'A bad hire often starts with a vague need. Take ten minutes to pin down the following, and write it where staff can find it',
          points: [
            'The role: moderation, events, support, and how many seats',
            'The minimum bar, like age, availability or a mic if you moderate voice',
            'Questions that make people write: a scenario tells you more than “why you?”',
            'Who reads applications and who decides after the interview',
          ],
        },
        {
          h2: 'The staff application form',
          body: 'Applications posted in a channel get lost and are visible to everyone. A form keeps them in one place, one per applicant',
          items: [
            {
              title: 'A Kotbo form',
              body: 'Under Forms, write your questions and turn on Recruitment for the form. Applicants have to sign in with Discord to answer, so you always know who applied',
            },
            {
              title: 'A linked hierarchy',
              body: 'Tie the form to a staff hierarchy, Moderation or Events for example. It decides the rank and role the new mod will get',
            },
            {
              title: 'Your Google Form, if you prefer',
              body: 'The Recruitment page generates a Google Apps Script and an API key. Paste it into your Google Form, add the on-submit trigger, and responses land in Kotbo',
            },
            {
              title: 'Automatic closing',
              body: 'A role can close itself at a number of pending applications and reopen once one is decided. It can also close at a number of hires',
            },
          ],
        },
        {
          h2: 'Announcing open roles on Discord',
          body: 'The recruitment panel is a Discord message that lists each role with its status, OPEN or CLOSED, and an apply button that opens the right form. It updates itself when a role opens or closes, so no more stale “applications closed” message pinned at the top. You create it under Forms, in the recruitment panels section: a title, a channel and the roles to show, in order',
        },
        {
          h2: 'Sorting applications and holding the interview',
          body: 'Every application lands on the dashboard’s Recruitment page. Managers get notified, and a log channel can announce them on Discord',
          steps: [
            {
              title: 'Read and annotate',
              body: 'Filter by status or role, search a username or an answer, move between applications with J and K. Management notes stay visible to staff only',
            },
            {
              title: 'Reject with a reason',
              body: 'Rejecting closes the application. The reason is optional and goes to the applicant by DM',
            },
            {
              title: 'Move to the interview',
              body: 'The interview button opens an interview ticket, in the category you choose or on your linked staff server. The applicant is asked there for their availability for a voice call',
            },
            {
              title: 'Decide on the interview',
              body: 'Passed: the applicant joins the team. Failed: the application is rejected and they have to wait a month before applying again, which Kotbo tells them by DM',
            },
          ],
        },
        {
          h2: 'Bringing the new mod into the team',
          body: 'When the interview passes, Kotbo creates their staff profile at the hierarchy’s starting rank, gives them the staff roles on Discord and opens a trial period. You can pick the hierarchy and starting rank when you confirm. The new mod then shows up in the org chart with the rest of the staff',
          figure: {
            screen: 'staff',
            caption: 'The staff org chart on the dashboard, where every new mod lands. Demo on a fictional staff',
          },
        },
        {
          h2: 'Trial period and mentoring',
          body: 'The first weeks decide whether a new mod stays. The Tutoring module gives them a frame',
          items: [
            {
              title: 'A trial period',
              body: 'It opens when the mod joins, planned for 14 days, and ends in a pass or a fail',
            },
            {
              title: 'A mentor',
              body: 'From the application, assign a mentor among staff at level 2 and above, or members flagged as mentors. They get notified of their new mentee',
            },
            {
              title: 'A checklist and tasks',
              body: 'Each hierarchy has its own mentoring checklist, and a list of tasks given during the trial shows up in the new mod’s schedule',
            },
            {
              title: 'Follow-up reports',
              body: 'The mentor writes reports on the new mod, so the end-of-trial call doesn’t rest on memory',
            },
          ],
        },
      ],
      faq: [
        {
          q: 'How do I recruit moderators on Discord?',
          a: 'Announce the open roles, collect applications in a form, sort them, hold a voice interview, then bring the new mod in with a trial period and a mentor. Kotbo handles each step from its dashboard',
        },
        {
          q: 'What questions should a Discord moderator application ask?',
          a: 'Ask for age, availability and experience, then give scenarios: a member throwing insults, a raid, a friend breaking the rules. Written answers show judgment better than a list of qualities',
        },
        {
          q: 'How do I make a staff application form on Discord?',
          a: 'With Kotbo, create a form on the dashboard and turn on Recruitment for it. Applicants sign in with Discord to answer, and their application lands on the Recruitment page',
        },
        {
          q: 'Can I keep using Google Forms for applications?',
          a: 'Yes. Kotbo generates a Google Apps Script and an API key to paste into your form, and every response lands on the dashboard',
        },
        {
          q: 'How do I close applications when there are too many?',
          a: 'Set the form to close automatically at a number of pending applications. The role closes, the Discord panel switches to CLOSED, and it reopens once an application is decided',
        },
        {
          q: 'What happens when an applicant passes the interview?',
          a: 'Kotbo creates their staff profile at the starting rank, gives them the staff roles and opens a trial period you can attach a mentor to',
        },
      ],
    },
  },
};

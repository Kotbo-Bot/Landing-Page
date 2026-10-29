/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'sanctions-discord-warn-mute-ban', en: 'how-to-warn-someone-on-discord' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['sanctions'],
  text: {
    fr: {
      title: 'Comment warn quelqu’un sur Discord : warn, mute et ban',
      h1: 'Comment warn quelqu’un sur Discord, et quand passer au mute ou au ban',
      description:
        'Comment warn quelqu’un sur Discord : ce que Discord fait seul, une échelle de sanctions avertissement, mute, kick, ban, et les commandes de Kotbo.',
      lead: 'Discord n’a pas de bouton « avertir » : il sait exclure temporairement (le mute), expulser et bannir. Un warn, c’est un avertissement écrit, gardé quelque part pour que le prochain modo le voie. Avec Kotbo, tu tapes /sanction warn, et l’avertissement rejoint le casier du membre avec sa raison',
      sections: [
        {
          h2: 'Ce que Discord fait sans bot',
          body: 'Clic droit sur un membre, et Discord propose trois sanctions. Elles marchent, mais aucune ne garde la mémoire de ce qui s’est passé avant',
          items: [
            {
              title: 'L’exclusion temporaire',
              body: 'C’est le mute de Discord : le membre lit toujours, mais ne peut plus écrire, réagir ni parler en vocal. Discord la limite à 28 jours',
            },
            {
              title: 'L’expulsion',
              body: 'Le kick sort le membre du serveur. Il peut revenir avec n’importe quelle invitation',
            },
            {
              title: 'Le bannissement',
              body: 'Le ban l’empêche de revenir sur ce compte, et peut supprimer ses messages récents. Il dure jusqu’à ce qu’un modo le lève',
            },
            {
              title: 'Ce qui manque',
              body: 'Pas d’avertissement, pas de durée sur un ban, et pas de fiche par membre. Le journal d’audit garde les actions, mais il n’est pas fait pour suivre quelqu’un sur des mois',
            },
          ],
        },
        {
          h2: 'Construire une échelle de sanctions',
          body: 'Une échelle de sanctions, c’est la règle qui dit au staff quoi faire à la deuxième, troisième ou cinquième fois. Elle évite qu’un modo banne là où un autre aurait averti. Quelques principes qui tiennent',
          points: [
            'Écris l’échelle dans ton règlement, pour que les membres la connaissent avant de la subir',
            'Monte d’un cran à chaque récidive : warn, mute court, mute long, kick, ban',
            'Sépare les infractions : le spam et les insultes n’ont pas la même gravité',
            'Une sanction a toujours une raison, et les plus lourdes ont une preuve',
            'Laisse vieillir les vieux warns, sinon une erreur d’il y a deux ans pèse encore',
          ],
        },
        {
          h2: 'Les commandes de sanction de Kotbo',
          body: 'Tout passe par /sanction, réservée par défaut aux membres qui ont la permission d’exclure temporairement. Les durées s’écrivent comme on parle : 30m, 2h, 3j, 1 semaine',
          commands: [
            {
              name: '/sanction warn',
              body: 'Ajoute un avertissement avec les options membre et raison. L’option gravite le pèse : léger (1 point), normal (2 points) ou grave (3 points)',
            },
            {
              name: '/sanction to',
              body: 'Exclut temporairement le membre pour la duree donnée. Kotbo renouvelle l’exclusion si elle doit durer plus que ce que Discord accepte',
            },
            {
              name: '/sanction kick',
              body: 'Expulse le membre, avec une raison obligatoire',
            },
            {
              name: '/sanction tempban',
              body: 'Bannit pour une durée, puis Kotbo lève le ban tout seul à l’échéance',
            },
            {
              name: '/sanction ban',
              body: 'Bannit définitivement, avec une raison obligatoire',
            },
            {
              name: '/sanction softban',
              body: 'Bannit puis débannit aussitôt, pour effacer les messages des 7 derniers jours sans interdire le retour',
            },
            {
              name: '/sanction list',
              body: 'Affiche l’historique des sanctions d’un membre',
            },
          ],
        },
        {
          h2: 'Les tableaux de sanction, l’échelle appliquée pour toi',
          body: 'Avec /sanction tableau, tu donnes le membre et le nom d’un tableau, et Kotbo applique le palier suivant tout seul. Il compte les sanctions déjà reçues dans ce tableau, et au-delà du dernier palier il réapplique le dernier. L’option bypass force un palier précis. Deux tableaux existent dès le départ, modifiables dans Protection › Sanctions',
          items: [
            {
              title: 'Le tableau Spam',
              body: 'Avertissement, puis exclusion d’une heure, puis de 24 h, puis expulsion, puis bannissement',
            },
            {
              title: 'Le tableau Insultes',
              body: 'Avertissement, puis exclusion de 12 h, puis de 3 jours, puis expulsion, puis bannissement',
            },
            {
              title: 'Les warns qui vieillissent',
              body: 'Dans les réglages, un warn peut cesser de compter après un nombre de jours, ou être archivé automatiquement. Une sanction archivée reste consultable mais ne fait plus monter l’échelle',
            },
          ],
        },
        {
          h2: 'Sanctionner proprement, étape par étape',
          body: 'La commande ne fait pas tout. Voici le déroulé qui évite les contestations',
          steps: [
            {
              title: 'Regarde le casier',
              body: '/casier voir ouvre la fiche du membre en onglets : résumé, sanctions, identité, activité. Des boutons y lancent directement un warn, un timeout, un kick ou un ban',
            },
            {
              title: 'Convoque si ça mérite une discussion',
              body: '/convoquer ouvre un fil d’échange avec le membre et lui laisse un délai de réponse, 48 h par défaut. S’il ne répond pas, Kotbo alerte la modération, ou l’avertit, ou l’exclut 24 h, selon l’option expiration',
            },
            {
              title: 'Applique la sanction avec sa raison',
              body: 'La raison est obligatoire sur chaque /sanction. Écris-la pour le modo qui lira le casier dans six mois',
            },
            {
              title: 'Rédige le rapport avec les preuves',
              body: 'Si les rapports de sanction sont activés, le modo qui a sanctionné complète un rapport dans le dashboard : règles enfreintes, récit, liens de preuve. Sans rapport, il est relancé après 3 jours, et les responsables sont prévenus après 7 jours',
            },
            {
              title: 'Garde le contexte',
              body: '/note ajoute une note modérateur sur le membre, visible du staff, pour ce qui ne mérite pas une sanction mais doit être su',
            },
          ],
        },
        {
          h2: 'Ce que le casier fait en plus',
          body: 'Une sanction dans Kotbo n’est pas qu’une ligne. Elle déclenche d’autres choses, que tu règles une fois',
          points: [
            'Si le membre a des doubles comptes liés, la sanction s’applique aussi à eux',
            'Un seuil de warns peut lancer une vérification d’identité automatique',
            '/clear supprime de 1 à 100 messages d’un salon, ou seulement ceux d’un membre, dans la limite de 14 jours fixée par Discord',
            'Les sanctions peuvent être contestées par les membres si tu actives les appels',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment warn quelqu’un sur Discord ?',
          a: 'Discord n’a pas d’avertissement natif. Avec un bot comme Kotbo, tape /sanction warn avec le membre et une raison : l’avertissement est gardé dans son casier, visible par tout le staff',
        },
        {
          q: 'Comment mute quelqu’un sur Discord ?',
          a: 'Fais un clic droit sur le membre et choisis l’exclusion temporaire, ou tape /sanction to avec une durée et une raison. Pendant ce temps, il lit mais ne peut plus écrire ni parler',
        },
        {
          q: 'Quelle différence entre kick et ban sur Discord ?',
          a: 'Le kick sort le membre, qui peut revenir avec une invitation. Le ban l’empêche de revenir sur ce compte jusqu’à ce qu’un modo le lève',
        },
        {
          q: 'Combien de warns avant un ban sur Discord ?',
          a: 'Il n’y a pas de règle imposée, c’est ton échelle qui décide. Dans les tableaux par défaut de Kotbo, Spam et Insultes, le ban arrive à la cinquième sanction',
        },
        {
          q: 'Est-ce qu’un warn expire ?',
          a: 'Pas sur Discord, qui n’en a pas. Dans Kotbo, tu peux faire cesser de compter les warns après un nombre de jours, ou les archiver automatiquement',
        },
        {
          q: 'Où voir les sanctions d’un membre ?',
          a: 'Avec /sanction list ou /casier voir sur Discord, ou dans la page Sanctions du dashboard, où chaque sanction garde sa raison, son auteur et son rapport',
        },
      ],
    },
    en: {
      title: 'How to warn someone on Discord: warn, mute and ban',
      h1: 'How to warn someone on Discord, and when to mute or ban instead',
      description:
        'How to warn someone on Discord: what Discord does natively, a warn, mute, kick and ban ladder, and the Discord warn bot commands that keep a record.',
      lead: 'Discord has no warn button: it can time out (mute), kick and ban. A warning is a written notice, kept somewhere so the next mod sees it. With Kotbo as your Discord warn bot, you run /sanction warn and the warning lands in the member’s record with its reason',
      sections: [
        {
          h2: 'What Discord does without a bot',
          body: 'Right-click a member and Discord offers three sanctions. They work, but none of them remembers what happened before',
          items: [
            {
              title: 'Timeout',
              body: 'This is Discord’s mute: the member can still read but can’t post, react or talk in voice. Discord caps it at 28 days',
            },
            {
              title: 'Kick',
              body: 'It removes the member from the server. They can come back with any invite',
            },
            {
              title: 'Ban',
              body: 'It keeps that account out and can delete recent messages. It lasts until a mod lifts it',
            },
            {
              title: 'What’s missing',
              body: 'No warnings, no timed bans and no record per member. The audit log keeps actions, but it isn’t built to follow someone over months',
            },
          ],
        },
        {
          h2: 'Building a punishment ladder',
          body: 'A punishment ladder is the rule that tells staff what to do on the second, third or fifth offense. It stops one mod from banning where another would have warned. A few principles that hold up',
          points: [
            'Put the ladder in your rules, so members know it before it hits them',
            'Go up one step with each repeat offense: warn, short mute, long mute, kick, ban',
            'Keep offenses apart: spam and insults don’t weigh the same',
            'Every sanction has a reason, and the heavy ones have evidence',
            'Let old warnings age out, or a mistake from two years ago still counts',
          ],
        },
        {
          h2: 'Kotbo’s sanction commands',
          body: 'Everything goes through /sanction, available by default to members who can time others out. Durations are written the way you say them: 30m, 2h, 3d, 1 week. Option names are in French',
          commands: [
            {
              name: '/sanction warn',
              body: 'Adds a warning with the membre and raison options. The gravite option weighs it: minor (1 point), normal (2 points) or severe (3 points)',
            },
            {
              name: '/sanction to',
              body: 'Times the member out for the given duree. Kotbo renews the timeout when it has to last longer than Discord allows',
            },
            {
              name: '/sanction kick',
              body: 'Kicks the member, with a required reason',
            },
            {
              name: '/sanction tempban',
              body: 'Bans for a set duration, then Kotbo lifts the ban when it ends',
            },
            {
              name: '/sanction ban',
              body: 'Bans permanently, with a required reason',
            },
            {
              name: '/sanction softban',
              body: 'Bans then unbans right away, to wipe the last 7 days of messages without keeping the member out',
            },
            {
              name: '/sanction list',
              body: 'Shows a member’s sanction history',
            },
          ],
        },
        {
          h2: 'Sanction tables: the ladder applied for you',
          body: 'With /sanction tableau, you give the member and a table name, and Kotbo applies the next tier on its own. It counts the sanctions already received in that table, and past the last tier it repeats the last one. The bypass option forces a specific tier. Two tables exist from the start, editable on the dashboard’s Sanctions page',
          items: [
            {
              title: 'The Spam table',
              body: 'A warning, then a one-hour timeout, then 24 hours, then a kick, then a ban',
            },
            {
              title: 'The Insults table',
              body: 'A warning, then a 12-hour timeout, then 3 days, then a kick, then a ban',
            },
            {
              title: 'Warnings that age',
              body: 'In the settings, a warning can stop counting after a number of days, or be archived automatically. An archived sanction stays on file but no longer moves the ladder up',
            },
          ],
        },
        {
          h2: 'Sanctioning properly, step by step',
          body: 'The command isn’t everything. Here is the routine that heads off disputes',
          steps: [
            {
              title: 'Check the record',
              body: '/casier voir opens the member’s file in tabs: summary, sanctions, identity, activity. Buttons there start a warn, timeout, kick or ban directly',
            },
            {
              title: 'Summon them if it needs a talk',
              body: '/summon opens a discussion thread with the member and gives them a deadline, 48 hours by default. If they don’t reply, Kotbo alerts the mods, warns them or times them out for 24 hours, depending on the expiration option',
            },
            {
              title: 'Apply the sanction with its reason',
              body: 'A reason is required on every /sanction. Write it for the mod who reads the record six months from now',
            },
            {
              title: 'Write the report with evidence',
              body: 'If sanction reports are on, the mod who acted fills in a report on the dashboard: rules broken, what happened, evidence links. Without a report they get a reminder after 3 days, and managers are told after 7',
            },
            {
              title: 'Keep the context',
              body: '/note adds a moderator note on the member, visible to staff, for things that don’t deserve a sanction but should be known',
            },
          ],
        },
        {
          h2: 'What the record does on top',
          body: 'A sanction in Kotbo is more than a line. It sets off a few things you configure once',
          points: [
            'If the member has linked alt accounts, the sanction applies to them too',
            'A warning threshold can start an automatic identity check',
            '/clear deletes 1 to 100 messages in a channel, or only one member’s, within Discord’s 14-day limit',
            'Members can appeal their sanctions if you turn appeals on',
          ],
        },
      ],
      faq: [
        {
          q: 'How do you warn someone on Discord?',
          a: 'Discord has no built-in warning. With a bot like Kotbo, run /sanction warn with the member and a reason: the warning is kept in their record, visible to all staff',
        },
        {
          q: 'How do you mute someone on Discord?',
          a: 'Right-click the member and choose timeout, or run /sanction to with a duration and a reason. While it lasts, they can read but can’t post or talk',
        },
        {
          q: 'What is the difference between a kick and a ban on Discord?',
          a: 'A kick removes the member, who can come back with an invite. A ban keeps that account out until a mod lifts it',
        },
        {
          q: 'How many warnings before a ban on Discord?',
          a: 'There is no set rule, your ladder decides. In Kotbo’s default tables, Spam and Insults, the ban comes at the fifth sanction',
        },
        {
          q: 'Do warnings expire on Discord?',
          a: 'Discord has no warnings to expire. In Kotbo, you can make warnings stop counting after a number of days, or archive them automatically',
        },
        {
          q: 'Where can I see a member’s sanctions?',
          a: 'With /sanction list or /casier voir on Discord, or on the dashboard’s Sanctions page, where each sanction keeps its reason, author and report',
        },
      ],
    },
  },
};

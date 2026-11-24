/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'detecter-doubles-comptes-discord', en: 'detect-discord-alt-accounts' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['double_accounts'],
  text: {
    fr: {
      title: 'Vérifier un double compte Discord : méthode et bot',
      h1: 'Comment vérifier si un membre a un double compte sur Discord',
      description:
        'Comment savoir si un compte Discord est un alt : les indices à vérifier à la main, puis un bot qui compare les arrivées. Le staff tranche. Gratuit.',
      lead: 'Un membre banni crée un autre compte et revient trois jours plus tard : c’est le problème le plus courant des serveurs modérés. Discord ne relie pas les comptes entre eux. Dans Kotbo, la page Comptes suspects repère les arrivées qui ressemblent à un compte déjà connu, affiche les raisons du soupçon, et laisse ton staff confirmer ou rejeter chaque lien. Un soupçon n’est jamais une preuve : c’est un modo qui décide',
      sections: [
        {
          h2: 'Pourquoi les doubles comptes posent problème',
          body: 'Un alt n’est pas toujours malveillant, mais le plus souvent il sert à contourner une sanction',
          points: [
            'Un membre banni revient et reprend le harcèlement',
            'Un utilisateur vote deux fois, gagne deux fois un giveaway ou fausse un sondage',
            'Un provocateur se sert d’un compte jetable pour insulter sans risquer son compte principal',
            'Le staff perd du temps à sanctionner la même personne plusieurs fois',
          ],
        },
        {
          h2: 'Ce que Discord propose sans bot',
          body: 'Rien. Discord ne montre pas que deux comptes appartiennent à la même personne, et un banni peut revenir avec un nouveau pseudo et un nouvel avatar. Le modo ne dispose que de son œil. Un outil qui compare les comptes à l’arrivée fait gagner du temps, à condition de rester un outil d’aide à la décision',
        },
        {
          h2: 'Vérifier à la main : les indices à regarder',
          body: 'Sans outil, tu ne peux comparer que ce qui se voit. Ces vérifications suffisent pour un cas isolé, mais elles ne tiennent plus quand les arrivées se comptent par dizaines',
          points: [
            'L’âge du compte : active le mode développeur de Discord, copie l’ID du compte, puis passe-le dans un décodeur d’ID Discord pour lire sa date de création. Un compte de quelques jours arrivé juste après un bannissement est un premier indice',
            'Le profil : avatar, bannière, pseudo d’affichage, présentation et comptes connectés, souvent recopiés ou à peine modifiés',
            'Les serveurs en commun, visibles sur le profil, quand tu connais déjà le compte principal',
            'Le moment d’arrivée et l’invitation utilisée : un compte arrivé peu après un départ ou un ban, par la même invitation, mérite un second regard',
            'Le style d’écriture : mêmes tournures, mêmes fautes, mêmes emojis',
          ],
        },
        {
          h2: 'Activer la détection avec Kotbo',
          body: 'Tout se règle sur dash.kotbo.fr, page Comptes suspects, dans la section Protection. La détection est gratuite',
          steps: [
            { title: 'Active la détection automatique', body: 'Kotbo signale les comptes récents à l’arrivée et les compare aux membres connus du serveur' },
            { title: 'Règle le seuil', body: 'Le score à partir duquel un compte est considéré comme suspect. Plus il est bas, plus tu verras de cas à vérifier' },
            { title: 'Choisis les rôles', body: 'Un rôle de validation et un rôle de sanction, que tu associes à la détection selon la décision du staff' },
            { title: 'Lance un scan', body: 'Un rescan analyse les membres déjà présents et indique combien ont été analysés et combien sont suspectés' },
            { title: 'Traite chaque cas', body: 'Ouvre le rapport de détection, lis les signaux, puis confirme ou rejette le lien' },
          ],
        },
        {
          h2: 'Les signaux que Kotbo regarde',
          body: 'Un compte suspect ne l’est jamais pour une seule raison. Kotbo additionne des signaux rangés en familles, chacun avec son poids dans le score',
          items: [
            { title: 'Création et arrivée', body: 'L’âge du compte à l’arrivée et le moment où il est arrivé par rapport à un départ ou une sanction' },
            { title: 'Pseudo et avatar', body: 'La ressemblance entre le pseudo ou l’avatar d’un nouveau compte et ceux d’un compte connu' },
            { title: 'Invitations', body: 'Des comptes arrivés avec la même invitation, ou invités par la même personne' },
            { title: 'Sanctions et autres serveurs', body: 'Un compte déjà sanctionné ou signalé ailleurs' },
            { title: 'Vérification technique', body: 'Des éléments liés à la connexion, quand la vérification est activée sur le serveur' },
            { title: 'Comportement', body: 'Le style d’écriture, les heures de présence et les salons partagés, uniquement avec la détection fine' },
          ],
        },
        {
          h2: 'La détection fine, et ce qu’elle demande',
          body: 'Les indices les plus fiables viennent des messages : style d’écriture, tics de langage, heures de présence, réseau de mentions. Pour les analyser, Kotbo a besoin de la journalisation des messages. Sans elle, il ne reste que les signaux techniques, de réseau et de temps. La détection fine est donc une décision à prendre en connaissance de cause',
          points: [
            'Les messages sont conservés selon la durée de rétention que tu as configurée, puis supprimés',
            'Tu peux couper la journalisation à tout moment dans ses réglages',
            'Préviens tes membres dans ton règlement que les messages sont analysés',
          ],
        },
        {
          h2: 'Confirmer, rejeter, garder une preuve',
          body: 'Chaque détection arrive avec un niveau de risque (faible sous 30, moyen de 30 à 59, élevé à partir de 60) et un statut : en attente, validé ou rejeté',
          items: [
            { title: 'Confirmer le lien', body: 'Les deux comptes sont liés. Le graphe des comptes liés montre le réseau et les motifs du soupçon en survolant les liens' },
            { title: 'Rejeter', body: 'Un faux positif est marqué comme tel, et la détection est ignorée. Elle peut être restaurée plus tard' },
            { title: 'Ouvrir le dossier', body: 'Le casier du membre rassemble ses sanctions et ses signaux, pour trancher avec le contexte' },
            { title: 'Filtrer et retrouver', body: 'Tu filtres par risque, type de signal, présence sur le serveur, ou par statut, et tu cherches par pseudo ou ID' },
          ],
        },
        {
          h2: 'Aller plus loin',
          body: 'Le détecteur en détail : ce qu’il compare, ce qu’il demande et comment il apprend des décisions du staff',
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
          q: 'Comment savoir si un compte Discord est un alt ?',
          a: 'Discord ne le montre pas. Regarde l’âge du compte, la ressemblance du profil avec un compte connu, l’invitation utilisée et le style d’écriture. Un bot comme Kotbo fait cette comparaison à chaque arrivée et montre les raisons du soupçon',
        },
        {
          q: 'Peut-on voir les alts d’un utilisateur avec son ID ?',
          a: 'Non, pas de façon fiable : Discord n’expose pas le lien entre deux comptes. L’ID donne seulement la date de création du compte. Kotbo compare les comptes à l’intérieur de ton serveur, avec les invitations, l’activité et la vérification',
        },
        {
          q: 'Comment détecter les doubles comptes sur Discord ?',
          a: 'Avec Kotbo, active la détection automatique sur la page Comptes suspects. Les nouveaux comptes sont comparés aux membres connus, et chaque soupçon arrive avec ses signaux et un niveau de risque',
        },
        {
          q: 'Comment empêcher un membre banni de revenir avec un autre compte ?',
          a: 'Aucun outil ne l’empêche à coup sûr, mais Kotbo repère les arrivées qui ressemblent à un compte banni, et ton staff peut les vérifier avant qu’elles ne causent des dégâts',
        },
        {
          q: 'Un compte suspect est-il forcément un alt ?',
          a: 'Non. Un score élevé est un soupçon, pas une preuve. Tu peux rejeter un faux positif, et c’est un modérateur qui confirme ou non chaque lien',
        },
        {
          q: 'La détection lit-elle les messages de mes membres ?',
          a: 'Seulement si tu actives la détection fine, qui s’appuie sur la journalisation des messages. Sans elle, Kotbo n’utilise que des signaux techniques, de réseau et de temps',
        },
        {
          q: 'Peut-on voir les comptes liés entre eux ?',
          a: 'Oui, un graphe des comptes liés affiche le réseau. Tu peux déplacer les nœuds et survoler un lien pour voir les motifs du soupçon',
        },
        {
          q: 'Que faire quand un alt est confirmé ?',
          a: 'Ouvre le dossier du membre et applique la sanction prévue par ton règlement. Le lien confirmé reste enregistré dans la page',
        },
      ],
    },
    en: {
      title: 'How to Check Alt Accounts on Discord, by Hand or Bot',
      h1: 'How to check if a Discord member has an alt account',
      description:
        'How to tell if a Discord account is an alt: the clues to check by hand, then a free bot that compares every join. Staff makes the call.',
      lead: 'A banned member creates another account and is back three days later: it’s the most common problem on moderated servers. Discord doesn’t link accounts together. In Kotbo, the Suspect accounts page spots arrivals that look like an already-known account, shows the reasons for the suspicion, and lets your staff confirm or reject each link. A suspicion is never proof: a moderator decides',
      sections: [
        {
          h2: 'Why alt accounts are a problem',
          body: 'An alt isn’t always malicious, but most often it’s used to dodge a sanction',
          points: [
            'A banned member returns and resumes harassing',
            'A user votes twice, wins a giveaway twice or skews a poll',
            'A troublemaker uses a throwaway account to insult without risking their main account',
            'Staff waste time sanctioning the same person repeatedly',
          ],
        },
        {
          h2: 'What Discord offers without a bot',
          body: 'Nothing. Discord doesn’t show that two accounts belong to the same person, and a banned user can come back with a new name and avatar. The mod only has their eye. A tool that compares accounts on arrival saves time, as long as it stays a decision aid',
        },
        {
          h2: 'Checking by hand: the clues to look at',
          body: 'Without a tool, you can only compare what you can see. These checks are enough for a one-off case, but they stop scaling once joins come in by the dozen',
          points: [
            'Account age: turn on Discord’s developer mode, copy the account’s ID, then run it through a Discord ID decoder to read its creation date. A few-days-old account that joins right after a ban is a first clue',
            'The profile: avatar, banner, display name, bio and connected accounts, often copied or barely changed',
            'Mutual servers, visible on the profile, when you already know the main account',
            'When it joined and which invite it used: an account that arrives shortly after a departure or a ban, through the same invite, deserves a second look',
            'Writing style: the same turns of phrase, the same typos, the same emojis',
          ],
        },
        {
          h2: 'Turning on detection with Kotbo',
          body: 'Everything is set on dash.kotbo.fr, in the Suspect accounts page, under Protection. Detection is free',
          steps: [
            { title: 'Turn on automatic detection', body: 'Kotbo flags recent accounts on arrival and compares them to the server’s known members' },
            { title: 'Set the threshold', body: 'The score from which an account is considered suspect. The lower it is, the more cases you’ll have to check' },
            { title: 'Pick the roles', body: 'A validation role and a sanction role, which you tie to the detection depending on the staff’s decision' },
            { title: 'Run a scan', body: 'A rescan analyzes members already on the server and shows how many were analyzed and how many suspected' },
            { title: 'Handle each case', body: 'Open the detection report, read the signals, then confirm or reject the link' },
          ],
        },
        {
          h2: 'The signals Kotbo looks at',
          body: 'An account is never suspect for just one reason. Kotbo adds up signals grouped into families, each with its weight in the score',
          items: [
            { title: 'Creation and arrival', body: 'The account’s age on arrival and when it arrived relative to a departure or a sanction' },
            { title: 'Name and avatar', body: 'How much a new account’s name or avatar resembles a known account’s' },
            { title: 'Invites', body: 'Accounts that joined through the same invite, or were invited by the same person' },
            { title: 'Sanctions and other servers', body: 'An account already sanctioned or flagged elsewhere' },
            { title: 'Technical verification', body: 'Elements tied to the connection, when verification is on for the server' },
            { title: 'Behavior', body: 'Writing style, hours of presence and shared channels, only with fine detection' },
          ],
        },
        {
          h2: 'Fine detection, and what it requires',
          body: 'The most reliable clues come from messages: writing style, verbal tics, hours of presence, mention network. To analyze them, Kotbo needs message logging. Without it, only technical, network and timing signals remain. Fine detection is therefore a decision to make knowingly',
          points: [
            'Messages are kept for the retention period you configured, then deleted',
            'You can turn logging off at any time in its settings',
            'Tell your members in your rules that messages are analyzed',
          ],
        },
        {
          h2: 'Confirming, rejecting, keeping evidence',
          body: 'Each detection comes with a risk level (low under 30, medium from 30 to 59, high from 60) and a status: pending, validated or rejected',
          items: [
            { title: 'Confirm the link', body: 'The two accounts are linked. The linked-accounts graph shows the network and, by hovering a link, the reasons for suspicion' },
            { title: 'Reject', body: 'A false positive is marked as such, and the detection is ignored. It can be restored later' },
            { title: 'Open the record', body: 'The member’s record gathers their sanctions and signals, so you decide with context' },
            { title: 'Filter and find', body: 'Filter by risk, signal type, presence on the server or status, and search by name or ID' },
          ],
        },
        {
          h2: 'Go further',
          body: 'The detector in detail: what it compares, what it needs and how it learns from staff decisions',
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
          q: 'How do I tell if a Discord account is an alt?',
          a: 'Discord doesn’t show it. Look at the account’s age, how much its profile resembles a known account, the invite it used and its writing style. A bot like Kotbo makes that comparison on every join and shows the reasons for the suspicion',
        },
        {
          q: 'Can I see someone’s alts with their user ID?',
          a: 'Not reliably: Discord doesn’t expose the link between two accounts. An ID only gives you the account’s creation date. Kotbo compares accounts inside your server, using invites, activity and verification',
        },
        {
          q: 'How do I detect alt accounts on Discord?',
          a: 'With Kotbo, turn on automatic detection in the Suspect accounts page. New accounts are compared to known members, and each suspicion comes with its signals and a risk level',
        },
        {
          q: 'How do I stop a banned member from coming back with another account?',
          a: 'No tool stops it for sure, but Kotbo spots arrivals that look like a banned account, and your staff can check them before they cause damage',
        },
        {
          q: 'Is a suspect account necessarily an alt?',
          a: 'No. A high score is a suspicion, not proof. You can reject a false positive, and a moderator confirms or not each link',
        },
        {
          q: 'Does detection read my members’ messages?',
          a: 'Only if you turn on fine detection, which relies on message logging. Without it, Kotbo only uses technical, network and timing signals',
        },
        {
          q: 'Can I see accounts linked to each other?',
          a: 'Yes, a linked-accounts graph shows the network. You can move the nodes and hover a link to see the reasons for suspicion',
        },
        {
          q: 'What do I do once an alt is confirmed?',
          a: 'Open the member’s record and apply the sanction set out in your rules. The confirmed link stays on record in the page',
        },
      ],
    },
  },
};

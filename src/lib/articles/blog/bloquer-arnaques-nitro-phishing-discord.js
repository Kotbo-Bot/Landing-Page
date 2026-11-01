/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'bloquer-arnaques-nitro-phishing-discord', en: 'block-discord-fake-nitro-scams' },
  date: '2026-11-01',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['raid_protection'],
  text: {
    fr: {
      title: 'Arnaques Discord : bloquer faux Nitro et phishing',
      h1: 'Bloquer les faux Nitro et le phishing sur ton serveur Discord',
      description:
        'Bloquer les liens d’arnaque sur Discord : faux Nitro, phishing, domaines jumeaux, QR codes et captures d’écran piégées. Le filtre anti-arnaque de Kotbo, commande par commande.',
      lead: 'Faux cadeau Nitro, faux concours Steam, lien qui ressemble à discord.com sans en être : les arnaques tournent en boucle sur Discord, souvent postées par des comptes piratés. Une liste de mots bannis ne les arrête pas. Voici comment les filtrer avec Kotbo, du lien à l’image',
      sections: [
        {
          h2: 'Pourquoi les arnaques passent entre les mailles',
          body: 'Les escrocs changent de domaine tous les jours, remplacent une lettre par une autre qui lui ressemble, cachent le lien dans un QR code ou dans une capture d’écran. Un filtre qui cherche un mot précis est contourné en quelques minutes',
          points: [
            'Le faux Nitro : « Discord t’offre 3 mois de Nitro », avec un lien vers une copie de la page de connexion',
            'Le faux concours : un giveaway de jeu ou de skins qui demande de se connecter pour réclamer le lot',
            'Le faux recrutement : une offre de modérateur ou de testeur payé qui finit en vol de compte',
            'La capture piégée : le lien n’est pas dans le message, il est écrit dans l’image ou caché dans un QR code',
          ],
        },
        {
          h2: 'Ce que le filtre anti-arnaque de Kotbo vérifie',
          body: 'Chaque message est passé à plusieurs contrôles, du plus sûr au plus fin',
          items: [
            {
              title: 'Les listes de domaines connus',
              body: 'Kotbo reprend des listes de liens de phishing tenues par la communauté Discord et les rafraîchit toutes les 6 heures',
            },
            {
              title: 'Les domaines jumeaux',
              body: 'Il repère les imitations de vraies marques : lettres cyrilliques ou grecques à la place de lettres latines, domaines en punycode, « rn » qui se lit « m », fautes de frappe volontaires',
            },
            {
              title: 'La forme du message',
              body: 'Les faux giveaways et les fausses offres de recrutement se reconnaissent aussi à leur tournure, même avec un domaine encore inconnu',
            },
            {
              title: 'Kotbo Vision pour les images',
              body: 'Chaque image est comparée par empreinte aux images d’arnaque déjà confirmées : une capture recadrée ou retouchée est reconnue quand même. Les QR codes sont lus, et le texte écrit dans l’image est vérifié comme un message',
            },
          ],
        },
        {
          h2: 'Activer le filtre pas à pas',
          body: 'Compte deux minutes. Le filtre peut tourner avant le moindre incident, c’est même là qu’il sert le plus',
          steps: [
            {
              title: 'Prépare un salon d’alertes',
              body: 'Un salon visible du staff seulement, où Kotbo signale chaque arnaque supprimée. Il évite de noyer tes autres logs',
            },
            {
              title: 'Active le filtre',
              body: 'Tape /protection scam activer. L’option action choisit ce qui arrive à l’auteur, l’option salon-alertes désigne le salon préparé',
            },
            {
              title: 'Garde la détection d’images',
              body: 'L’option images active Kotbo Vision contre les images d’arnaque connues. Elle est active par défaut',
            },
            {
              title: 'Ajuste tes listes',
              body: 'Dans Protection › Anti-raid, onglet Arnaques, ajoute tes propres domaines à bloquer et une liste blanche pour les liens que ton serveur partage souvent',
            },
            {
              title: 'Vérifie l’état',
              body: '/protection status affiche le filtre anti-arnaque à côté des autres protections du serveur',
            },
          ],
        },
        {
          h2: 'Choisir la sanction',
          body: 'Le message d’arnaque est toujours supprimé. L’option action décide du sort de son auteur',
          commands: [
            { name: 'Supprimer uniquement', body: 'Le message disparaît, rien d’autre. Pratique pour observer le filtre quelques jours avant de sanctionner' },
            { name: 'Supprimer + avertir', body: 'L’auteur reçoit un avertissement inscrit dans son historique de sanctions' },
            { name: 'Supprimer + timeout', body: 'Le compte est réduit au silence le temps que le staff le contacte. Le bon choix quand le compte a été piraté' },
            { name: 'Supprimer + bannir', body: 'Aucune tolérance. À réserver aux serveurs où les arnaques viennent surtout de comptes jetables' },
          ],
        },
        {
          h2: 'Le doute et les comptes piratés',
          body: 'La plupart des liens d’arnaque viennent de comptes de vrais membres, piratés. Deux réglages évitent de punir la mauvaise personne',
          points: [
            'Quand Kotbo Vision n’est pas sûr d’une image, il la retire sans sanction et l’envoie dans un salon de vérification où le staff tranche. Sans salon de vérification, il ne fait rien sur un doute',
            'Avec le timeout plutôt que le ban, tu as le temps de prévenir le membre de changer son mot de passe, puis de lever la sanction',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment bloquer les faux liens Nitro sur Discord ?',
          a: 'Avec un bot anti-arnaque qui compare les liens à des listes de phishing à jour et repère les domaines qui imitent discord.com. Avec Kotbo, tape /protection scam activer et choisis l’action appliquée à l’auteur',
        },
        {
          q: 'Kotbo bloque-t-il les arnaques en image ou en QR code ?',
          a: 'Oui, avec Kotbo Vision : comparaison des images par empreinte, lecture des QR codes et lecture du texte écrit dans l’image',
        },
        {
          q: 'Le filtre peut-il supprimer un lien légitime ?',
          a: 'Les domaines connus comme sûrs ne sont pas visés, et tu peux ajouter une liste blanche dans l’onglet Arnaques. Sur une image incertaine, c’est le staff qui décide',
        },
        {
          q: 'Que faire d’un membre dont le compte a été piraté ?',
          a: 'Mets-le en timeout, préviens-le de changer son mot de passe et d’activer la double authentification, puis lève la sanction',
        },
      ],
    },
    en: {
      title: 'Block Discord scams: fake Nitro and phishing links',
      h1: 'Block fake Nitro and phishing links on your Discord server',
      description:
        'Block scam links on Discord: fake Nitro, phishing, lookalike domains, QR codes and booby-trapped screenshots. Kotbo’s anti-scam filter, command by command.',
      lead: 'Fake Nitro gift, fake Steam giveaway, a link that looks like discord.com but is not: scams loop on Discord all day, often posted from hacked accounts. A banned-word list does not stop them. Here is how to filter them with Kotbo, from links to images',
      sections: [
        {
          h2: 'Why scams slip through',
          body: 'Scammers change domain every day, swap a letter for a lookalike, hide the link in a QR code or inside a screenshot. A filter that looks for a specific word is bypassed within minutes',
          points: [
            'Fake Nitro: “Discord gives you 3 months of Nitro”, with a link to a copy of the login page',
            'Fake giveaway: a game or skin giveaway that asks you to log in to claim the prize',
            'Fake recruitment: a paid moderator or tester offer that ends in account theft',
            'Booby-trapped screenshot: the link is not in the message, it is written in the image or hidden in a QR code',
          ],
        },
        {
          h2: 'What Kotbo’s anti-scam filter checks',
          body: 'Every message goes through several checks, from the surest to the finest',
          items: [
            {
              title: 'Known domain lists',
              body: 'Kotbo uses phishing link lists maintained by the Discord community and refreshes them every 6 hours',
            },
            {
              title: 'Lookalike domains',
              body: 'It spots imitations of real brands: Cyrillic or Greek letters in place of Latin ones, punycode domains, “rn” that reads as “m”, deliberate typos',
            },
            {
              title: 'The shape of the message',
              body: 'Fake giveaways and fake recruitment offers are also recognized by their wording, even with a domain nobody has listed yet',
            },
            {
              title: 'Kotbo Vision for images',
              body: 'Every image is compared by fingerprint to scam images already confirmed: a cropped or edited screenshot is still recognized. QR codes are read, and text written in the image is checked like a message',
            },
          ],
        },
        {
          h2: 'Turn the filter on, step by step',
          body: 'It takes two minutes. The filter can run before any incident, and that is where it helps most',
          steps: [
            {
              title: 'Set up an alert channel',
              body: 'A channel only staff can see, where Kotbo reports every scam it removes. It keeps your other logs readable',
            },
            {
              title: 'Turn the filter on',
              body: 'Type /protection scam activer. The action option picks what happens to the author, the salon-alertes option points to the channel you prepared',
            },
            {
              title: 'Keep image detection',
              body: 'The images option turns on Kotbo Vision against known scam images. It is on by default',
            },
            {
              title: 'Adjust your lists',
              body: 'In Protection › Anti-raid, Scams tab, add your own domains to block and an allowlist for links your server shares often',
            },
            {
              title: 'Check the status',
              body: '/protection status shows the anti-scam filter next to the server’s other protections',
            },
          ],
        },
        {
          h2: 'Choose the sanction',
          body: 'The scam message is always deleted. The action option decides what happens to its author',
          commands: [
            { name: 'Delete only', body: 'The message disappears, nothing else. Handy to watch the filter for a few days before sanctioning' },
            { name: 'Delete + warn', body: 'The author gets a warning recorded in their sanction history' },
            { name: 'Delete + timeout', body: 'The account is silenced while staff contact them. The right choice when the account was hacked' },
            { name: 'Delete + ban', body: 'Zero tolerance. Best kept for servers where scams mostly come from throwaway accounts' },
          ],
        },
        {
          h2: 'Doubt and hacked accounts',
          body: 'Most scam links come from real members’ accounts that were hacked. Two settings avoid punishing the wrong person',
          points: [
            'When Kotbo Vision is unsure about an image, it removes it without a sanction and sends it to a review channel where staff decide. Without a review channel, it does nothing on a doubt',
            'With a timeout rather than a ban, you have time to tell the member to change their password, then lift the sanction',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I block fake Nitro links on Discord?',
          a: 'With an anti-scam bot that checks links against up-to-date phishing lists and spots domains imitating discord.com. With Kotbo, type /protection scam activer and choose the action applied to the author',
        },
        {
          q: 'Does Kotbo block scams in images or QR codes?',
          a: 'Yes, with Kotbo Vision: image comparison by fingerprint, QR code reading and reading of the text written in the image',
        },
        {
          q: 'Can the filter delete a legitimate link?',
          a: 'Domains known to be safe are not targeted, and you can add an allowlist in the Scams tab. On an uncertain image, staff decide',
        },
        {
          q: 'What should I do about a member whose account was hacked?',
          a: 'Time them out, tell them to change their password and turn on two-factor authentication, then lift the sanction',
        },
      ],
    },
  },
};

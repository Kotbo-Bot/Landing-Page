/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'verification-captcha-discord', en: 'discord-verification-captcha-bot' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['raid_protection', 'security_verification', 'regulation'],
  text: {
    fr: {
      title: 'Vérification Discord et captcha : filtrer les arrivants',
      h1: 'Mettre une vérification par captcha sur ton serveur Discord',
      description:
        'Vérification Discord par captcha : niveau natif, onboarding, bot captcha, bouton du règlement et vérification d’identité contre les doubles comptes.',
      lead: 'Une vérification à l’arrivée fait passer un test à chaque nouveau membre avant de lui ouvrir le serveur. Discord en fait une partie tout seul avec son niveau de vérification et l’onboarding. Un bot captcha comme Kotbo ajoute un vrai défi, un bouton de règlement et une vérification d’identité qui repère les doubles comptes',
      sections: [
        {
          h2: 'Pourquoi vérifier les nouveaux membres',
          body: 'Sans vérification, un compte qui rejoint voit tout et peut écrire partout dès la première seconde. C’est exactement ce que cherchent les bots de spam, les raids et les membres bannis qui reviennent avec un autre compte. Une vérification ne bloque pas tout, mais elle met un temps de retard entre l’arrivée et le premier message',
        },
        {
          h2: 'Le niveau de vérification et l’onboarding de Discord',
          body: 'Commence par les outils natifs, dans les paramètres du serveur. Ils sont gratuits et s’appliquent avant même qu’un bot voie le membre',
          items: [
            {
              title: 'Le niveau de vérification',
              body: 'Il exige, selon le niveau choisi, un e-mail vérifié, un compte créé depuis plus de 5 minutes, une présence sur le serveur depuis plus de 10 minutes ou un téléphone vérifié',
            },
            {
              title: 'L’onboarding',
              body: 'Sur un serveur Communauté, Discord pose des questions aux arrivants, leur donne des rôles selon leurs réponses et peut leur faire accepter les règles avant d’écrire',
            },
            {
              title: 'Leur limite',
              body: 'Ces deux outils regardent le compte, pas la personne derrière. Un bot avec un e-mail vérifié passe, et rien ne relie un nouveau compte à un ancien membre banni',
            },
          ],
        },
        {
          h2: 'Les trois vérifications de Kotbo',
          body: 'Kotbo propose trois parcours. Tu peux en garder un seul ou les empiler selon ce que ton serveur subit',
          items: [
            {
              title: 'Le captcha à l’arrivée',
              body: 'L’arrivant reçoit un rôle non vérifié qui ne voit que le salon de vérification. Kotbo y poste une image avec un code de 6 caractères déformés, qu’il recopie dans le salon. En mode vocal, le code est énoncé dans un salon vocal ouvert pour lui seul',
            },
            {
              title: 'Le bouton du règlement',
              body: 'Dans la page Règlement du dashboard, active le bouton Accepter le règlement : il donne un rôle au membre qui clique. L’option Masquer les autres salons cache tout le reste tant qu’il n’a pas accepté',
            },
            {
              title: 'La vérification d’identité',
              body: 'Le membre se connecte avec Discord sur une page web de Kotbo. Kotbo compare le compte, l’adresse IP et l’empreinte de l’appareil aux vérifications passées du serveur pour repérer un double compte',
              link: { feature: 'double_accounts', label: 'Lire l’article sur les doubles comptes' },
            },
          ],
        },
        {
          h2: 'Installer un bot captcha Discord pas à pas',
          body: 'Le captcha est le plus simple à mettre en place. Compte quelques minutes et un second compte pour tester',
          steps: [
            {
              title: 'Crée le rôle non vérifié',
              body: 'Crée un rôle, par exemple Non vérifié, qui n’a accès qu’au salon de vérification. Place-le sous le rôle de Kotbo dans la liste des rôles',
            },
            {
              title: 'Prépare le salon de vérification',
              body: 'Un salon texte où ce rôle peut lire et écrire. Les autres membres n’ont pas besoin de le voir',
            },
            {
              title: 'Active le captcha',
              body: 'Tape /protection captcha activer avec les options salon et role. Les options delai et tentatives règlent le temps et les essais, 10 minutes et 3 tentatives par défaut',
            },
            {
              title: 'Choisis la sanction en cas d’échec',
              body: 'L’option sanction décide ce qui arrive après les tentatives ratées ou le délai dépassé : expulsion par défaut, ou bannissement',
            },
            {
              title: 'Donne un rôle à ceux qui réussissent',
              body: 'Dans Protection › Anti-raid, onglet Captcha d’entrée, choisis le rôle vérifié. Kotbo l’accorde après la réussite, puis retire le rôle non vérifié',
            },
          ],
        },
        {
          h2: 'Les commandes de vérification',
          body: 'Le captcha se règle à l’arrivée. La vérification d’identité peut aussi se demander plus tard, à un membre précis',
          commands: [
            {
              name: '/protection captcha activer',
              body: 'Active le captcha avec le salon et le rôle non vérifié. Options : delai, tentatives, sanction et salon-logs pour garder la trace des réussites et des échecs',
            },
            {
              name: '/protection captcha desactiver',
              body: 'Coupe le captcha. Les arrivants entrent à nouveau sans défi',
            },
            {
              name: '/request-verification',
              body: 'Demande une vérification d’identité à un membre, avec les options membre et raison. Il est exclu temporairement jusqu’à ce qu’il se vérifie et reçoit le lien en MP, ou dans un fil privé si ses MP sont fermés',
            },
          ],
        },
        {
          h2: 'Régler la vérification d’identité',
          body: 'Elle vit dans Protection › Comptes suspects, onglet Vérification, et aussi dans la page Règlement. Les réglages qui comptent',
          points: [
            'L’envoi : un MP automatique à l’arrivée, ou un message avec un bouton publié dans ton salon de vérification',
            'Le niveau : Bas lit seulement l’identité Discord, Moyen ajoute l’e-mail, Haut ajoute les comptes connectés et la liste des serveurs',
            'Si un double compte est trouvé : prévenir le staff, qui valide ou marque un faux positif, ou lier les comptes automatiquement',
            'L’adresse IP et l’empreinte de l’appareil sont enregistrées par défaut, et chacune se coupe séparément',
            'Un seuil de warns peut lancer la vérification tout seul quand un membre l’atteint',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment mettre un captcha sur un serveur Discord ?',
          a: 'Crée un rôle qui ne voit que le salon de vérification, puis tape /protection captcha activer avec ce salon et ce rôle. Chaque arrivant devra recopier un code affiché sur une image pour entrer',
        },
        {
          q: 'Quel bot de vérification utiliser sur Discord ?',
          a: 'Kotbo propose un captcha image ou vocal à l’arrivée, un bouton d’acceptation du règlement et une vérification d’identité par connexion Discord qui repère les doubles comptes. Tout se règle depuis un dashboard web',
        },
        {
          q: 'Quelle différence entre le niveau de vérification Discord et un captcha ?',
          a: 'Le niveau de vérification contrôle le compte : e-mail, ancienneté, téléphone. Un captcha demande une action qu’un script fait mal, comme lire un code déformé',
        },
        {
          q: 'Que se passe-t-il si un membre rate le captcha ?',
          a: 'Après le nombre de tentatives prévu, ou si le délai passe, Kotbo applique la sanction choisie : expulsion par défaut, ou bannissement',
        },
        {
          q: 'Un membre sans son peut-il passer le captcha vocal ?',
          a: 'Oui. Un bouton lui fait basculer sur le captcha image en gardant sa session, et Kotbo passe aussi à l’image si le salon vocal est mal configuré',
        },
        {
          q: 'La vérification de Kotbo détecte-t-elle les doubles comptes ?',
          a: 'La vérification d’identité, oui : elle compare l’adresse IP et l’empreinte de l’appareil aux vérifications passées, et signale un membre qui se connecte avec un autre compte que le sien',
        },
      ],
    },
    en: {
      title: 'Discord verification bot: captcha for new members',
      h1: 'How to set up captcha verification on your Discord server',
      description:
        'Discord verification and captcha: native verification levels, onboarding, a captcha bot, a rules button and identity checks that catch alt accounts.',
      lead: 'Join verification makes every new member pass a check before the server opens up. Discord handles part of it with verification levels and onboarding. A Discord captcha bot like Kotbo adds a real challenge, a rules button and an identity check that catches alt accounts',
      sections: [
        {
          h2: 'Why verify new members',
          body: 'Without verification, an account that joins can see everything and post everywhere from the first second. That is exactly what spam bots, raids and banned members coming back on a new account are counting on. Verification won’t stop everything, but it puts a delay between joining and the first message',
        },
        {
          h2: 'Discord’s verification level and onboarding',
          body: 'Start with the native tools in your server settings. They cost nothing and apply before any bot even sees the member',
          items: [
            {
              title: 'Verification level',
              body: 'Depending on the level, it requires a verified email, an account older than 5 minutes, being on the server for more than 10 minutes, or a verified phone',
            },
            {
              title: 'Onboarding',
              body: 'On a Community server, Discord asks newcomers questions, gives them roles based on their answers and can have them accept the rules before they post',
            },
            {
              title: 'Where they stop',
              body: 'Both tools look at the account, not the person behind it. A bot with a verified email gets through, and nothing ties a new account to a member you banned',
            },
          ],
        },
        {
          h2: 'Kotbo’s three kinds of verification',
          body: 'Kotbo offers three paths. Keep one or stack them, depending on what your server deals with',
          items: [
            {
              title: 'Captcha on join',
              body: 'The newcomer gets an unverified role that only sees the verification channel. Kotbo posts an image there with a 6-character distorted code to type back. In voice mode, the code is read out in a voice channel opened for that member alone',
            },
            {
              title: 'The rules button',
              body: 'On the dashboard’s Rules page, turn on the accept button: it gives a role to whoever clicks it. The hide other channels option keeps everything else out of sight until they accept',
            },
            {
              title: 'Identity verification',
              body: 'The member signs in with Discord on a Kotbo web page. Kotbo compares the account, IP address and device fingerprint with past verifications on the server to spot an alt account',
              link: { feature: 'double_accounts', label: 'Read the alt account article' },
            },
          ],
        },
        {
          h2: 'Setting up a Discord captcha bot step by step',
          body: 'The captcha is the quickest to set up. Plan a few minutes and a second account to test with',
          steps: [
            {
              title: 'Create the unverified role',
              body: 'Create a role, say Unverified, that can only access the verification channel. Put it below Kotbo’s role in the role list',
            },
            {
              title: 'Prepare the verification channel',
              body: 'A text channel where that role can read and post. Other members don’t need to see it',
            },
            {
              title: 'Turn the captcha on',
              body: 'Run /protection captcha activer with the salon and role options. The delai and tentatives options set the time limit and number of tries, 10 minutes and 3 tries by default',
            },
            {
              title: 'Choose what happens on failure',
              body: 'The sanction option decides what happens after the failed tries or once time runs out: a kick by default, or a ban',
            },
            {
              title: 'Give a role to those who pass',
              body: 'On the dashboard’s Anti-raid page, captcha tab, pick the verified role. Kotbo grants it on success, then removes the unverified role',
            },
          ],
        },
        {
          h2: 'Verification commands',
          body: 'The captcha runs on join. Identity verification can also be requested later, for one member. Kotbo’s /protection subcommands and options are typed in French',
          commands: [
            {
              name: '/protection captcha activer',
              body: 'Turns the captcha on with the channel and the unverified role. Options: delai, tentatives, sanction, and salon-logs to keep a record of passes and failures',
            },
            {
              name: '/protection captcha desactiver',
              body: 'Turns the captcha off. Newcomers join without a challenge again',
            },
            {
              name: '/request-verification',
              body: 'Asks a member for an identity check, with the membre and raison options. They are timed out until they verify and get the link by DM, or in a private thread if their DMs are closed',
            },
          ],
        },
        {
          h2: 'Configuring identity verification',
          body: 'It lives on the dashboard under Suspicious accounts, Verification tab, and on the Rules page too. The settings that matter',
          points: [
            'Delivery: an automatic DM on join, or a message with a button posted in your verification channel',
            'Level: Low reads only the Discord identity, Medium adds the email, High adds connected accounts and the server list',
            'When an alt is found: alert the staff, who confirm it or mark a false positive, or link the accounts automatically',
            'IP address and device fingerprint are saved by default, and each one can be turned off on its own',
            'A warning threshold can start the verification by itself when a member reaches it',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I add a captcha to my Discord server?',
          a: 'Create a role that only sees the verification channel, then run /protection captcha activer with that channel and role. Every newcomer will have to type a code shown in an image to get in',
        },
        {
          q: 'What is a good Discord verification bot?',
          a: 'Kotbo offers an image or voice captcha on join, a rules acceptance button and identity verification through Discord sign-in that catches alt accounts. Everything is configured from a web dashboard',
        },
        {
          q: 'What is the difference between Discord’s verification level and a captcha?',
          a: 'The verification level checks the account: email, account age, phone. A captcha asks for something scripts do badly, like reading a distorted code',
        },
        {
          q: 'What happens if a member fails the captcha?',
          a: 'After the set number of tries, or once time runs out, Kotbo applies the sanction you chose: a kick by default, or a ban',
        },
        {
          q: 'Can a member without sound pass the voice captcha?',
          a: 'Yes. A button switches them to the image captcha and keeps their session, and Kotbo also falls back to the image if the voice channel is misconfigured',
        },
        {
          q: 'Does Kotbo’s verification detect alt accounts?',
          a: 'Identity verification does: it compares IP address and device fingerprint with past verifications, and flags a member who signs in with a different account than their own',
        },
      ],
    },
  },
};

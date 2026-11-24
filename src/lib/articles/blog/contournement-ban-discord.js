/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'contournement-ban-discord', en: 'discord-ban-evasion' },
  date: '2026-11-24',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['double_accounts', 'sanctions', 'ban_appeals'],
  text: {
    fr: {
      title: 'Contournement de ban Discord : empêcher le retour',
      h1: 'Comment empêcher un membre banni de revenir sur ton serveur Discord',
      description:
        'Un ban Discord vise un compte, pas une personne. Les réglages qui freinent le retour d’un banni, comment repérer son alt et traiter un faux positif.',
      lead: 'Tu bannis un membre, et trois jours plus tard un inconnu arrive avec les mêmes tournures de phrase. Un ban Discord vise un compte, pas une personne : en créer un autre ne coûte rien. Aucun réglage ne ferme complètement la porte, mais tu peux rendre le retour pénible, le repérer vite et le traiter sans punir un innocent',
      sections: [
        {
          h2: 'Pourquoi un ban se contourne si facilement',
          body: 'Le ban s’applique à l’identifiant d’un compte. Discord ne propose pas aux administrateurs de serveur de bannir par adresse IP, et rien ne relie deux comptes de la même personne',
          points: [
            'Un nouveau compte se crée en quelques minutes, gratuitement',
            'Le pseudo, l’avatar et l’invitation changent : l’œil du modérateur ne suffit plus',
            'Un banni motivé revient plusieurs fois, souvent après quelques jours, quand l’affaire est oubliée',
          ],
        },
        {
          h2: 'Ralentir le retour avec les réglages de Discord',
          body: 'Ces réglages n’arrêtent pas un banni décidé, mais ils éliminent les retours impulsifs et les comptes jetables',
          items: [
            {
              title: 'Le niveau de vérification',
              body: 'Un niveau élevé écarte les comptes tout neufs : compte créé depuis plus de 5 minutes, membre depuis plus de 10 minutes, ou téléphone vérifié au niveau le plus haut. Ce dernier demande le plus d’efforts à qui multiplie les comptes',
            },
            {
              title: 'Les invitations',
              body: 'Retire à @everyone le droit de créer des invitations. Un banni a besoin d’un lien pour revenir, et moins il y en a en circulation, moins il en trouve',
            },
            {
              title: 'Le captcha à l’arrivée',
              body: 'Celui de Kotbo arrête les comptes automatiques, pas un humain décidé : il ralentit, il ne bloque pas',
            },
          ],
        },
        {
          h2: 'Repérer l’alt dès son arrivée',
          body: 'Le plus fiable est de comparer chaque nouvel arrivant aux comptes déjà connus, plutôt que de compter sur la mémoire du staff. Le détecteur de doubles comptes de Kotbo le fait à chaque arrivée, et il est gratuit. Les indices qui comptent',
          points: [
            'Un compte récent arrivé juste après le ban',
            'Un pseudo ou un avatar proche de celui du banni',
            'La même invitation, ou le même inviteur',
            'Le style d’écriture et les horaires de présence, quand la journalisation des messages est activée',
            'Avec la vérification par lien : le même appareil, la même adresse IP ou le même réseau',
          ],
        },
        {
          h2: 'Traiter un retour sans punir un innocent',
          body: 'Un soupçon n’est pas une preuve : deux frères, deux amis ou deux colocataires peuvent partager un réseau, un style ou une invitation. Garde un humain dans la décision',
          steps: [
            { title: 'Lis les raisons', body: 'Un score élevé s’appuie sur des indices de natures différentes. Un indice isolé ne suffit jamais' },
            { title: 'Demande en cas de doute', body: 'Un message du staff au membre suffit souvent à trancher, avant toute sanction' },
            { title: 'Confirme ou rejette', body: 'Confirmer lie les comptes et garde le motif. Rejeter marque un faux positif, et la détection en tient compte pour ton serveur' },
            { title: 'Ouvre une voie de recours', body: 'Un formulaire d’appel de ban évite de répondre en message privé à chaque demande, et laisse une trace de la décision' },
          ],
        },
        {
          h2: 'Garder une trace',
          body: 'Chaque sanction est consignée par Kotbo avec son auteur et sa raison, ce qui évite de rejuger un cas déjà traité. Le journal d’audit de Discord, lui, s’efface au bout de 45 jours : pour retrouver un ban ancien, ne compte pas sur lui',
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
          q: 'Peut-on bannir quelqu’un par son adresse IP sur Discord ?',
          a: 'Pas depuis les réglages d’un serveur : un ban Discord vise un compte. Kotbo peut comparer appareils et adresses IP, mais seulement avec la vérification par lien, et le résultat reste un indice que le staff tranche',
        },
        {
          q: 'Comment savoir si un nouveau membre est un banni qui revient ?',
          a: 'Discord ne le montre pas. Compare l’âge du compte, le profil, l’invitation et le style d’écriture avec ceux du banni, ou laisse Kotbo le faire à chaque arrivée et te montrer les raisons du soupçon',
        },
        {
          q: 'Un ban définitif empêche-t-il vraiment de revenir ?',
          a: 'Il empêche le compte banni de rejoindre, pas la personne d’en créer un autre. C’est pourquoi on combine le ban avec un niveau de vérification élevé et un détecteur de doubles comptes',
        },
        {
          q: 'Faut-il bannir automatiquement les comptes suspects ?',
          a: 'Non. Un score élevé est un soupçon, pas une preuve, et un faux positif bannit un innocent. Kotbo signale, et c’est un modérateur qui confirme ou rejette',
        },
      ],
    },
    en: {
      title: 'Discord Ban Evasion: How to Stop Banned Members',
      h1: 'How to stop a banned member from coming back to your Discord server',
      description:
        'A Discord ban hits an account, not a person. The settings that slow a banned member down, how to spot their alt and how to handle a false positive.',
      lead: 'You ban a member, and three days later a stranger shows up writing the exact same way. A Discord ban targets an account, not a person: making another one costs nothing. No setting shuts the door completely, but you can make coming back a hassle, spot it fast and handle it without punishing an innocent',
      sections: [
        {
          h2: 'Why a ban is so easy to get around',
          body: 'A ban applies to an account’s ID. Discord doesn’t let server admins ban by IP address, and nothing links two accounts that belong to the same person',
          points: [
            'A new account takes a few minutes to create, and it’s free',
            'The name, avatar and invite change: a moderator’s eye is no longer enough',
            'A determined banned member comes back several times, often after a few days, once the dust has settled',
          ],
        },
        {
          h2: 'Slowing the return down with Discord’s settings',
          body: 'These settings won’t stop a determined banned member, but they weed out impulsive returns and throwaway accounts',
          items: [
            {
              title: 'The verification level',
              body: 'A high level keeps out brand-new accounts: account older than 5 minutes, member for more than 10 minutes, or a verified phone at the highest level. The last one takes the most effort for anyone juggling accounts',
            },
            {
              title: 'Invites',
              body: 'Remove @everyone’s right to create invites. A banned member needs a link to come back, and the fewer are floating around, the fewer they find',
            },
            {
              title: 'A captcha on arrival',
              body: 'Kotbo’s stops automated accounts, not a determined human: it slows them down, it doesn’t block them',
            },
          ],
        },
        {
          h2: 'Spotting the alt as soon as it joins',
          body: 'The most reliable way is to compare every newcomer with the accounts you already know, instead of relying on staff’s memory. Kotbo’s alt account detection does it on every join, and it’s free. The clues that matter',
          points: [
            'A recent account that joins right after the ban',
            'A name or avatar close to the banned member’s',
            'The same invite, or the same inviter',
            'Writing style and hours of activity, when message logging is on',
            'With link verification: the same device, the same IP address or the same network',
          ],
        },
        {
          h2: 'Handling a return without punishing an innocent',
          body: 'A suspicion isn’t proof: two siblings, two friends or two roommates can share a network, a writing style or an invite. Keep a human in the decision',
          steps: [
            { title: 'Read the reasons', body: 'A high score rests on clues of different kinds. A single isolated clue is never enough' },
            { title: 'Ask when in doubt', body: 'A message from staff to the member often settles it, before any sanction' },
            { title: 'Confirm or reject', body: 'Confirming links the accounts and keeps the reason. Rejecting marks a false positive, and detection takes it into account for your server' },
            { title: 'Open a way to appeal', body: 'A ban appeal form saves you from answering every request in DMs, and leaves a record of the decision' },
          ],
        },
        {
          h2: 'Keeping a record',
          body: 'Kotbo records every sanction with its author and reason, so you don’t retry a case you already handled. Discord’s own audit log clears after 45 days: don’t count on it to find an old ban',
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
          q: 'Can you IP ban someone on Discord?',
          a: 'Not from a server’s settings: a Discord ban targets an account. Kotbo can compare devices and IP addresses, but only with link verification, and the result stays a clue that staff decides on',
        },
        {
          q: 'How do I know if a new member is a banned member coming back?',
          a: 'Discord doesn’t show it. Compare the account’s age, profile, invite and writing style with the banned member’s, or let Kotbo do it on every join and show you the reasons for the suspicion',
        },
        {
          q: 'Does a permanent ban really stop someone from coming back?',
          a: 'It stops the banned account from joining, not the person from making another one. That’s why a ban pairs well with a high verification level and an alt account detector',
        },
        {
          q: 'Should suspect accounts be banned automatically?',
          a: 'No. A high score is a suspicion, not proof, and a false positive bans an innocent. Kotbo flags, and a moderator confirms or rejects',
        },
      ],
    },
  },
};

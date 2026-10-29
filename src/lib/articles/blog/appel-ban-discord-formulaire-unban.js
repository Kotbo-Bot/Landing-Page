/** @type {import('../blog.js').BlogPost} */
export default {
  slug: { fr: 'appel-ban-discord-formulaire-unban', en: 'discord-ban-appeal-form' },
  date: '2026-10-29',
  author: 'Kotbo',
  /** Le module du registre que le billet couvre (clé de MODULE_REGISTRY), pour mémoire. */
  modules: ['ban_appeals', 'sanctions'],
  text: {
    fr: {
      title: 'Faire appel d’un ban Discord : le formulaire d’unban',
      h1: 'Comment faire appel d’un ban Discord, et en recevoir sur ton serveur',
      description:
        'Faire appel d’un ban Discord : ce que le membre banni peut faire, pourquoi un formulaire d’unban aide le staff, et comment les gérer avec Kotbo.',
      lead: 'Un membre banni ne voit plus ton serveur et ne peut plus y écrire. Pour faire appel d’un ban Discord, il lui faut un endroit hors du serveur : un formulaire d’unban que le staff lit et tranche. Kotbo fournit cette page publique, reliée au casier du membre, et les boutons pour décider sans quitter Discord',
      sections: [
        {
          h2: 'Pourquoi un ban a besoin d’une porte de sortie',
          body: 'Un ban est souvent juste. Pas toujours. Sans appel, les erreurs restent, et les bannis passent par les MP des modos ou reviennent avec un autre compte. Les cas qui reviennent',
          points: [
            'Un compte piraté qui a spammé, rendu depuis à son propriétaire',
            'Un modo qui a sanctionné trop vite, sur un malentendu',
            'Un membre qui a compris et veut revenir après quelques mois',
          ],
        },
        {
          h2: 'Ce que Discord propose, et ce qui manque',
          body: 'Les paramètres du serveur ont une liste des bannissements, d’où tu peux débannir quelqu’un à la main. Il n’y a pas de formulaire d’appel pour un ban de serveur : les appels que Discord gère concernent les actions de Discord sur un compte, pas les décisions de ton staff. Beaucoup de serveurs bricolent un serveur d’appel à part ou un Google Form, sans lien avec le casier ni avec le débannissement',
        },
        {
          h2: 'Côté membre banni : comment faire appel',
          body: 'Avec Kotbo, l’appel se fait sur une page publique de dash.kotbo.fr, propre à ton serveur. Voici ce que vit le membre',
          steps: [
            {
              title: 'Il reçoit le lien',
              body: 'Si tu l’as activé, Kotbo lui envoie le lien en MP au moment de la sanction, avant l’expulsion pour qu’il arrive encore. Tu peux aussi afficher le lien dans ton règlement',
            },
            {
              title: 'Il se connecte avec Discord',
              body: 'La connexion est obligatoire : l’appel est rattaché à son vrai compte, et personne ne fait appel à sa place',
            },
            {
              title: 'Il choisit ce qu’il conteste',
              body: 'La page liste ses sanctions contestables. Il en coche jusqu’à 3 par défaut et écrit son argument pour chacune, puis répond au formulaire',
            },
            {
              title: 'Il suit sa demande',
              body: 'Si le staff demande des précisions, il répond sur la même page. Le verdict arrive en MP, ou sur la page si ses MP sont fermés',
            },
          ],
        },
        {
          h2: 'Côté staff : trancher un appel',
          body: 'Chaque appel arrive dans ton salon staff avec des boutons : Accepter, Refuser, Refus définitif et Plus d’infos. Le même appel s’ouvre dans le dashboard, onglet Contestations de ban de la page Sanctions, avec l’historique du membre',
          items: [
            {
              title: 'Un verdict par sanction',
              body: 'Pour chaque sanction contestée : la maintenir, l’archiver (annulée mais gardée en trace), la supprimer, ou la maintenir et la verrouiller',
            },
            {
              title: 'Accepter',
              body: 'Le membre est débanni et reçoit en MP une invitation de retour, avec ton message si tu en as écrit un',
            },
            {
              title: 'Refuser',
              body: 'Il reçoit ta raison et doit attendre avant de recommencer, 30 jours par défaut. Le refus définitif l’ajoute à la liste noire : plus d’appel possible',
            },
            {
              title: 'Pas juge et partie',
              body: 'Par défaut, le modo qui a prononcé la sanction ne peut pas trancher l’appel qui la vise. Il est prévenu en MP et peut donner son contexte',
            },
          ],
          figure: {
            screen: 'sanctions',
            caption: 'L’écran Sanctions du dashboard, avec l’onglet des contestations. Démo sur des membres fictifs',
          },
        },
        {
          h2: 'Créer un formulaire d’unban Discord pas à pas',
          body: 'Le module Appels de bannissement est éteint par défaut. Il se règle dans Protection › Sanctions, onglet Contestations de ban',
          steps: [
            {
              title: 'Active les appels',
              body: 'Le premier interrupteur rend la page publique accessible et affiche son adresse',
            },
            {
              title: 'Prépare les questions',
              body: 'Crée le formulaire par défaut, puis adapte ses questions et son thème dans Formulaires. Un warn et un ban peuvent avoir chacun leur formulaire',
            },
            {
              title: 'Choisis les salons',
              body: 'Le salon du staff reçoit les appels à boutons, il peut vivre sur un serveur staff lié. Le salon d’invitation sert à créer le lien de retour',
            },
            {
              title: 'Décide ce qui se conteste',
              body: 'Le ban seul, ou aussi les avertissements, exclusions temporaires, expulsions, softbans et bans temporaires, chacun avec son délai entre deux demandes. Une ancienneté maximale peut fermer la contestation des vieilles sanctions',
            },
            {
              title: 'Préviens les membres',
              body: 'Active le MP du lien d’appel lors d’un ban définitif, ou à chaque sanction contestable, et copie le lien public dans ton règlement',
            },
          ],
        },
        {
          h2: 'Vérifier l’identité avant de débannir',
          body: 'Un appel accepté peut rouvrir la porte à un double compte. Deux réglages limitent ce risque',
          points: [
            'Avec la vérification à l’acceptation, le membre passe une vérification d’identité avant le débannissement : Kotbo compare son adresse IP et son appareil aux autres comptes vérifiés',
            'Les statistiques par modérateur montrent combien de ses sanctions sont contestées et annulées, de quoi repérer celles qui sont mal posées',
            'L’hygiène des bans analyse la liste des bannis chaque jour et signale les comptes supprimés par Discord, avec un bouton pour nettoyer',
          ],
        },
      ],
      faq: [
        {
          q: 'Comment faire appel d’un ban sur Discord ?',
          a: 'Cherche un lien d’appel dans le MP reçu au moment du ban ou dans le règlement du serveur. Sur un serveur équipé de Kotbo, tu te connectes avec Discord sur la page d’appel, tu choisis la sanction et tu expliques ta demande',
        },
        {
          q: 'Comment créer un formulaire d’unban pour un serveur Discord ?',
          a: 'Avec Kotbo, active les appels de bannissement dans Protection › Sanctions, crée le formulaire par défaut et choisis le salon du staff. La page publique est prête, avec son lien à partager',
        },
        {
          q: 'Un membre banni peut-il voir le serveur pour faire appel ?',
          a: 'Non, un ban retire tout accès au serveur. C’est pour ça que l’appel passe par une page web externe, où le membre se connecte avec son compte Discord',
        },
        {
          q: 'Combien de temps attendre après un appel refusé ?',
          a: 'Sur Kotbo, 30 jours par défaut, réglable par type de sanction. Un refus définitif interdit tout nouvel appel',
        },
        {
          q: 'Le modo qui a banni peut-il juger l’appel ?',
          a: 'Pas par défaut. Kotbo l’empêche de trancher un appel sur sa propre sanction, et le prévient pour qu’il donne son contexte',
        },
        {
          q: 'Peut-on contester un warn ou un timeout, pas seulement un ban ?',
          a: 'Oui, si le staff l’active. Chaque type de sanction s’ouvre à la contestation un par un, avec son propre délai et son propre formulaire',
        },
      ],
    },
    en: {
      title: 'Discord ban appeal: set up an unban form',
      h1: 'How Discord ban appeals work, and how to take them on your server',
      description:
        'Discord ban appeal guide: what a banned member can do, why an unban form helps your staff, and how a Discord ban appeal bot like Kotbo handles it.',
      lead: 'A banned member can no longer see or post on your server. To appeal a Discord ban, they need a place outside it: an unban form your staff reads and rules on. Kotbo gives you that public page, tied to the member’s record, plus the buttons to decide without leaving Discord',
      sections: [
        {
          h2: 'Why a ban needs a way back',
          body: 'Most bans are fair. Not all of them. Without appeals, mistakes stick, and banned members slide into mods’ DMs or come back on another account. The usual cases',
          points: [
            'A hacked account that spammed, since returned to its owner',
            'A mod who acted too fast over a misunderstanding',
            'A member who got the message and wants back after a few months',
          ],
        },
        {
          h2: 'What Discord offers, and what’s missing',
          body: 'Server settings have a bans list where you can unban someone by hand. There is no appeal form for server bans: the appeals Discord handles cover Discord’s own actions on an account, not your staff’s decisions. Many servers patch it with a separate appeal server or a Google Form, disconnected from the record and from the unban itself',
        },
        {
          h2: 'For the banned member: how to appeal',
          body: 'With Kotbo, the appeal happens on a public page on dash.kotbo.fr, specific to your server. Here is what the member goes through',
          steps: [
            {
              title: 'They get the link',
              body: 'If you turned it on, Kotbo DMs them the link when the sanction lands, before the kick so it still gets through. You can also put the link in your rules',
            },
            {
              title: 'They sign in with Discord',
              body: 'Signing in is required: the appeal is tied to their real account, and nobody appeals on their behalf',
            },
            {
              title: 'They pick what to contest',
              body: 'The page lists their appealable sanctions. They tick up to 3 by default and write their case for each, then answer the form',
            },
            {
              title: 'They follow up',
              body: 'If staff asks for details, they answer on the same page. The verdict arrives by DM, or on the page if their DMs are closed',
            },
          ],
        },
        {
          h2: 'For staff: ruling on an appeal',
          body: 'Each appeal lands in your staff channel with buttons: accept, deny, deny permanently and ask for more info. The same appeal opens on the dashboard, in the Sanctions page’s ban appeals tab, with the member’s history',
          items: [
            {
              title: 'One verdict per sanction',
              body: 'For each contested sanction: uphold it, archive it (cancelled but kept on file), delete it, or uphold and lock it',
            },
            {
              title: 'Accept',
              body: 'The member is unbanned and gets a return invite by DM, with your message if you wrote one',
            },
            {
              title: 'Deny',
              body: 'They get your reason and have to wait before trying again, 30 days by default. A permanent denial adds them to the blacklist: no more appeals',
            },
            {
              title: 'No ruling on your own case',
              body: 'By default, the mod who issued the sanction can’t rule on the appeal against it. They are notified by DM and can add context',
            },
          ],
          figure: {
            screen: 'sanctions',
            caption: 'The dashboard’s Sanctions screen, with the appeals tab. Demo on fictional members',
          },
        },
        {
          h2: 'Setting up a Discord ban appeal bot step by step',
          body: 'The ban appeals module is off by default. You set it up on the dashboard’s Sanctions page, ban appeals tab',
          steps: [
            {
              title: 'Turn appeals on',
              body: 'The first switch makes the public page live and shows its address',
            },
            {
              title: 'Prepare the questions',
              body: 'Create the default form, then edit its questions and theme under Forms. A warning and a ban can each have their own form',
            },
            {
              title: 'Pick the channels',
              body: 'The staff channel receives appeals with buttons, and it can live on a linked staff server. The invite channel is used to create the return link',
            },
            {
              title: 'Decide what can be appealed',
              body: 'Bans only, or also warnings, timeouts, kicks, softbans and temporary bans, each with its own wait between requests. A maximum age can close appeals on old sanctions',
            },
            {
              title: 'Tell your members',
              body: 'Turn on the DM with the appeal link on permanent bans, or on every appealable sanction, and copy the public link into your rules',
            },
          ],
        },
        {
          h2: 'Checking identity before an unban',
          body: 'An accepted appeal can let an alt account back in. A few settings keep that in check',
          points: [
            'With verification on acceptance, the member goes through an identity check before the unban: Kotbo compares their IP address and device with other verified accounts',
            'Per-moderator stats show how many of their sanctions get appealed and overturned, which points to sanctions handed out badly',
            'Ban hygiene scans the ban list daily and flags accounts Discord has deleted, with a button to clean them up',
          ],
        },
      ],
      faq: [
        {
          q: 'How do I appeal a Discord ban?',
          a: 'Look for an appeal link in the DM you got when banned or in the server’s rules. On a server running Kotbo, you sign in with Discord on the appeal page, pick the sanction and explain your case',
        },
        {
          q: 'How do I make a ban appeal form for my Discord server?',
          a: 'With Kotbo, turn on ban appeals on the dashboard’s Sanctions page, create the default form and pick the staff channel. The public page is ready, with a link to share',
        },
        {
          q: 'Can a banned member see the server to appeal?',
          a: 'No, a ban removes all access to the server. That is why the appeal goes through an outside web page, where the member signs in with their Discord account',
        },
        {
          q: 'How long do you wait after a denied appeal?',
          a: 'On Kotbo, 30 days by default, adjustable per sanction type. A permanent denial blocks any new appeal',
        },
        {
          q: 'Can the mod who banned someone rule on the appeal?',
          a: 'Not by default. Kotbo stops them from ruling on an appeal against their own sanction, and notifies them so they can add context',
        },
        {
          q: 'Can members appeal a warning or a timeout, not just a ban?',
          a: 'Yes, if staff turns it on. Each sanction type opens to appeals one by one, with its own wait time and its own form',
        },
      ],
    },
  },
};

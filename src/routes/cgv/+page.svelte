<script lang="ts">
  import Seo from '$lib/seo/Seo.svelte';
  /**
   * Conditions Générales de Vente.
   *
   * Les CGU (`/terms`) disent ce qu'on a le droit de faire avec Kotbo ; elles
   * renvoyaient jusqu'ici les conditions commerciales à « séparément au moment
   * de la souscription », c'est-à-dire à rien. Cette page porte donc tout ce
   * qui naît de la vente et non de l'usage : offres, prix, TVA, essai,
   * reconduction, résiliation, rétractation, impayés, garanties.
   *
   * Les montants ne sont pas recopiés à la main : ils viennent de
   * `PLAN_REGISTRY` côté produit, et la grille reproduite ici est datée. En cas
   * d'écart, c'est la page tarifs affichée au moment de la commande qui fait
   * foi - une CGV figée qui contredit le prix réellement débité est pire que
   * pas de grille du tout.
   */
  import { base } from '$app/paths';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  /** Durée de l'essai, alignée sur `TRIAL_DAYS` (@kotbo/contracts). */
  const TRIAL_DAYS = 15;

  const TEXT = {
    fr: {
      title: 'Conditions Générales de Vente',
      subtitleTemplate: (date: string) => `Dernière mise à jour : ${date} · Abonnements au service Kotbo`,
      pricingDate: '6 septembre 2026',
      sections: {
        objet: 'Objet & champ',
        vendeur: 'Identité du vendeur',
        offres: 'Offres & paliers',
        prix: 'Prix & TVA',
        commande: 'Commande',
        essai: 'Essai gratuit',
        cadeaux: 'Cadeaux & codes',
        paiement: 'Paiement',
        duree: 'Durée & résiliation',
        retractation: 'Droit de rétractation',
        impaye: 'Impayé & suspension',
        fourniture: 'Fourniture du service',
        garantie: 'Garantie de conformité',
        evolution: 'Évolution & prix',
        donnees: 'Données personnelles',
        responsabilite: 'Responsabilité',
        modification: 'Modification des CGV',
        litiges: 'Droit & litiges',
      },
      daysUnit: 'jours',
      intro: {
        title: 'Acceptation',
        body: "Les présentes conditions générales de vente (« CGV ») s'appliquent à toute souscription à une offre payante Kotbo. Elles sont acceptées lors de la commande : la validation du paiement vaut acceptation pleine et sans réserve. Elles complètent les",
        bodyLink: "Conditions Générales d'Utilisation",
        bodyAfter: ", qui régissent l'usage du service ; en cas de contradiction sur un point commercial, les présentes CGV prévalent.",
      },
      objet: {
        h2: "Objet et champ d'application",
        p1: "Les présentes CGV définissent les conditions dans lesquelles le vendeur commercialise l'accès aux offres payantes de Kotbo : un bot Discord et son tableau de bord web destinés à la gestion de communautés (modération, staff, tickets, statistiques, niveaux, événements, candidatures, économie et organisation de serveur).",
        p2a: "Elles s'appliquent aussi bien aux",
        p2Strong1: 'consommateurs',
        p2b: "— toute personne physique agissant à des fins qui n'entrent pas dans le cadre de son activité professionnelle — qu'aux",
        p2Strong2: 'professionnels',
        p2c: "Les clauses réservées à l'une ou l'autre catégorie sont signalées comme telles ; à défaut de mention, la clause s'applique à tous.",
        p3a: "L'abonnement est souscrit",
        p3Strong: 'pour un serveur Discord déterminé',
        p3b: "Il n'est ni cessible ni transférable d'un serveur à un autre sans notre accord.",
      },
      vendeur: {
        h2: 'Identité du vendeur',
        warnTitle: 'À compléter avant publication',
        warnBody: 'Deux mentions obligatoires restent marquées',
        warnCode: '[À COMPLÉTER]',
        warnBody2: "ci-dessous : la dénomination exacte et l'adresse professionnelle (art. L221-5 du code de la consommation). La page ne doit pas être mise en ligne tant qu'elles manquent. Le numéro de TVA indiqué est celui qui découle du SIREN : il doit être vérifié sur l'attestation d'assujettissement avant publication.",
        thInfo: 'Information',
        thValue: 'Valeur',
        rowDenomination: 'Dénomination',
        rowDenominationValue: "[À COMPLÉTER : nom de l'entrepreneur individuel]",
        rowForme: 'Forme',
        rowFormeValue: 'Entreprise individuelle sous le régime de la micro-entreprise',
        rowSiren: 'SIREN',
        rowSiret: 'SIRET (siège)',
        rowAdresse: 'Adresse professionnelle',
        rowAdresseValue: '[À COMPLÉTER]',
        rowTva: 'N° de TVA intracommunautaire',
        rowDirecteur: 'Directeur de la publication',
        rowDirecteurValue: 'Elouan Passereau et Nathan Rontey',
        rowContactCommercial: 'Contact commercial',
        rowContactDonnees: 'Contact données personnelles',
        footnote: "Ci-après « le vendeur », « Kotbo » ou « nous ». Le client est désigné par « vous ».",
      },
      offres: {
        h2: 'Offres et paliers',
        p1a: 'Kotbo est vendu',
        p1Strong1: 'tout-en-un',
        p1b: "une offre payante ouvre l'intégralité du catalogue de modules, y compris ceux ajoutés ultérieurement. Il n'existe pas de module vendu à part ni d'option payante. Ce qui distingue les offres n'est donc pas leur contenu fonctionnel, mais",
        p1Strong2: 'la taille du serveur',
        p1c: "à laquelle elles s'adressent.",
        thOffre: 'Offre',
        thTaille: 'Taille du serveur',
        thContenu: 'Contenu',
        thSouscription: 'Souscription',
        rowGratuitOffre: 'Gratuit',
        rowGratuitTaille: '—',
        rowGratuitContenu: 'Aucun module actif. Seules les pages de configuration, de gestion des modules et de facturation restent accessibles.',
        rowGratuitSouscription: 'État par défaut, sans commande',
        rowStarterTaille: "Jusqu'à 1 000 membres",
        rowContenuTout: 'Tout le catalogue',
        rowSouscriptionLibre: 'En ligne, libre-service',
        rowProTaille: 'De 1 001 à 10 000 membres',
        rowUltimateTaille: 'De 10 001 à 100 000 membres',
        rowSurMesureOffre: 'Sur mesure',
        rowSurMesureTaille: 'Au-delà de 100 000 membres',
        rowSurMesureContenu: 'Tout le catalogue, conditions convenues au cas par cas',
        rowSurMesureSouscriptionBefore: 'Sur devis, après',
        rowSurMesureLink: 'rendez-vous',
        p2: "L'offre applicable est déterminée par l'effectif du serveur au moment de la commande. Si un serveur franchit durablement le plafond de son offre, nous vous en informons et vous proposons le passage à l'offre supérieure ; à défaut d'accord, nous pouvons appliquer le tarif correspondant à l'échéance suivante, dans les conditions de l'article 14.",
        p3a: "L'offre",
        p3Strong: 'Gratuit',
        p3b: "n'est pas une version d'essai : elle n'ouvre aucun module. Le bot peut être présent sur un serveur sans qu'aucune fonctionnalité vendue ne soit active.",
      },
      prix: {
        h2: 'Prix et TVA',
        p1a: 'Les prix sont exprimés en',
        p1Strong: 'euros toutes taxes comprises',
        p1b: 'TVA française au taux en vigueur incluse. Le détail de la TVA figure sur chaque facture, disponible depuis votre espace de facturation.',
        p2Before: 'Grille en vigueur au',
        p2After: ' :',
        thOffre: 'Offre',
        thMensuel: 'Mensuel',
        thAnnuel: 'Annuel',
        rowStarterMensuel: '5,00 € TTC / mois',
        rowStarterAnnuel: '30,00 € TTC / an',
        rowProMensuel: '9,99 € TTC / mois',
        rowProAnnuel: '49,99 € TTC / an',
        rowUltimateMensuel: '25,00 € TTC / mois',
        rowUltimateAnnuel: '149,99 € TTC / an',
        rowSurMesure: 'Sur mesure',
        rowSurDevis: 'Sur devis',
        p3a: 'Cette grille est reproduite à titre indicatif et à la date indiquée.',
        p3Strong: "Le prix qui vous engage est celui affiché sur la page de commande au moment où vous validez le paiement",
        p3b: ', récapitulé avant validation et confirmé par courriel.',
        p4: "Les prix s'entendent hors coûts éventuels de votre établissement bancaire (frais de change, commission sur paiement en devise étrangère), qui restent à votre charge.",
      },
      commande: {
        h2: 'Commande et conclusion du contrat',
        intro: 'La commande se déroule depuis le tableau de bord Kotbo :',
        li1: "choix du serveur concerné et de l'offre correspondant à sa taille ;",
        li2: 'choix de la périodicité, mensuelle ou annuelle ;',
        li3: 'récapitulatif détaillé : offre, périodicité, montant TTC, date du premier prélèvement et date de reconduction ;',
        li4: 'acceptation des présentes CGV et, le cas échéant, renonciation expresse au droit de rétractation (article 10) ;',
        li5: 'paiement sur la page sécurisée de notre prestataire.',
        p2a: 'Le contrat est conclu à la',
        p2Strong: 'confirmation du paiement',
        p2b: "par le prestataire. Une confirmation vous est alors adressée par courriel, reprenant les caractéristiques essentielles de l'abonnement. L'accès aux modules est ouvert immédiatement.",
        p3: "Vous garantissez disposer des droits d'administration nécessaires sur le serveur Discord concerné et être habilité à engager la dépense. Une commande passée pour un serveur sur lequel vous n'avez pas ces droits peut être annulée.",
      },
      essai: {
        h2: 'Essai gratuit',
        p1a: 'Un essai gratuit de',
        p1Strong: `${TRIAL_DAYS} jours`,
        p1b: 'est proposé à la première souscription d\'une offre vendue en libre-service (Starter, Pro et Ultimate). Il ouvre l\'intégralité des modules de l\'offre choisie.',
        li1Strong: 'Un essai par personne et par serveur.',
        li1: "Ni un même compte Discord ni un même serveur ne peuvent en bénéficier deux fois, y compris en changeant d'administrateur ou en recréant un serveur.",
        li2Strong: "Un moyen de paiement est enregistré à l'ouverture de l'essai",
        li2: 'mais aucun montant n\'est débité pendant sa durée.',
        li3StrongPrefix: "À l'issue des",
        li3StrongSuffix: "jours, l'abonnement se poursuit automatiquement",
        li3: "et le premier prélèvement intervient, sauf résiliation avant l'échéance. La résiliation pendant l'essai est possible à tout moment depuis le tableau de bord et n'entraîne aucun débit.",
        li4: "Une commande abandonnée avant le paiement (fermeture de la page, session expirée) ne consomme pas l'essai : il redevient disponible.",
        p2: "L'offre Sur mesure n'ouvre pas droit à l'essai en libre-service : la période de découverte est définie au contrat.",
      },
      cadeaux: {
        h2: "Offrir Kotbo — cadeaux et codes d'activation",
        p1a: 'Kotbo peut être offert à un serveur. Un cadeau est un',
        p1Strong: 'paiement unique',
        p1b: "qui ouvre une offre pour une durée fixe : il n'est pas un abonnement, ne se reconduit pas et n'enregistre aucun moyen de paiement chez le bénéficiaire. À l'échéance, le serveur revient simplement à l'offre Gratuit, sans rien à résilier.",
        li1: 'Durées proposées : 1, 3, 6 ou 12 mois.',
        li2a: 'Le cadeau peut être acheté',
        li2Strong1: 'pour un serveur désigné',
        li2b: '(appliqué dès confirmation du paiement) ou',
        li2Strong2: 'sous forme de code',
        li2c: 'à transmettre, que le bénéficiaire active depuis sa page de facturation.',
        li3: "Un code non activé reste valable et peut être activé à tout moment ; il ne peut l'être qu'une seule fois.",
        li4: "Un cadeau ne peut pas être échangé contre un remboursement, ni cumulé avec un essai gratuit sur le même serveur.",
        li5: "Si un abonnement est déjà en cours sur le serveur bénéficiaire, la période offerte s'ajoute à l'accès existant ; elle ne suspend pas les prélèvements de l'abonnement, qu'il vous appartient de résilier si vous le souhaitez.",
        p2a: 'Des',
        p2Strong: "codes d'activation",
        p2b: 'peuvent par ailleurs être délivrés hors vente (partenariat, dédommagement, accord commercial). Ils ouvrent un accès à durée déterminée, sans contrepartie financière et sans reconduction.',
      },
      paiement: {
        h2: 'Paiement',
        p1a: 'Les paiements sont traités par',
        p1Strong1: 'Stripe Payments Europe, Ltd.',
        p1b: 'Les données de carte bancaire sont saisies directement sur les pages de ce prestataire :',
        p1Strong2: "nous n'y avons jamais accès et nous ne les conservons pas",
        p1c: '. Nous conservons uniquement les références nécessaires au suivi de l\'abonnement (identifiant client, identifiant d\'abonnement, statut, échéance).',
        p2: 'Les abonnements sont réglés d\'avance, par prélèvement automatique sur le moyen de paiement enregistré, à chaque échéance. Les factures sont mises à disposition dans votre espace de facturation.',
        p3Strong: 'Professionnels :',
        p3: "conformément à l'article L441-10 du code de commerce, tout retard de paiement entraîne de plein droit des pénalités au taux d'intérêt légal majoré de 10 points, ainsi qu'une indemnité forfaitaire de recouvrement de 40 €.",
      },
      duree: {
        h2: 'Durée, reconduction et résiliation',
        h3_1: 'Durée et reconduction',
        p1a: "L'abonnement est souscrit",
        p1Strong1: 'sans engagement de durée',
        p1b: ', pour la période choisie (un mois ou un an), et se',
        p1Strong2: 'reconduit tacitement',
        p1c: "à chaque échéance pour une période identique, tant qu'il n'a pas été résilié.",
        h3_2: 'Résiliation par vous',
        p2a: 'Vous pouvez résilier',
        p2Strong: 'à tout moment et sans motif',
        p2b: 'depuis la page Facturation de votre tableau de bord, en quelques clics et sans avoir à nous contacter.',
        infoStrong1: 'Effet de la résiliation :',
        infoMid: 'elle interrompt la reconduction.',
        infoStrong2: "Votre accès reste entièrement ouvert jusqu'au terme de la période déjà réglée",
        infoAfter: ", puis le serveur revient à l'offre Gratuit. Aucun remboursement, même partiel, n'est dû au titre de la période en cours, qui a été facturée d'avance et dont le service a été fourni.",
        p3: 'Tant que le terme n\'est pas atteint, vous pouvez revenir sur votre décision et réactiver la reconduction, sans frais.',
        h3_3: 'Information avant reconduction — consommateurs',
        p4a: 'Pour les abonnements',
        p4Strong: 'annuels souscrits par un consommateur',
        p4b: ", et conformément à l'article L215-1 du code de la consommation, nous vous informons par courriel, au plus tôt trois mois et au plus tard un mois avant le terme, de la possibilité de ne pas reconduire l'abonnement. Si cette information vous parvient tardivement, vous pouvez mettre fin gratuitement à l'abonnement à tout moment à compter de la date de reconduction, et les sommes versées après cette date vous sont remboursées.",
        h3_4: 'Résiliation par nous',
        p5a: "Nous pouvons résilier l'abonnement en cas de manquement grave aux",
        p5Link: 'CGU',
        p5b: "(usage interdit, atteinte au service, contournement des limitations d'une offre) ou d'impayé persistant, après mise en demeure restée sans effet pendant quinze jours — sauf faute rendant la poursuite du contrat manifestement impossible, où la résiliation peut être immédiate. Les sommes correspondant à une période non fournie sont alors remboursées.",
        p6: "Le retrait du bot du serveur Discord ne vaut pas résiliation : l'abonnement se poursuit et les prélèvements continuent tant qu'il n'a pas été résilié depuis le tableau de bord.",
      },
      retractation: {
        h2: 'Droit de rétractation',
        note: 'Cet article concerne exclusivement les consommateurs.',
        p1a: 'En tant que consommateur, vous disposez en principe d\'un délai de',
        p1Strong: 'quatorze jours',
        p1b: 'à compter de la conclusion du contrat pour vous rétracter, sans motif ni pénalité (art. L221-18 du code de la consommation).',
        warnTitle: 'Exécution immédiate et renonciation',
        warnP1: 'Kotbo est un contenu numérique fourni immédiatement : les modules s\'ouvrent dès la confirmation du paiement. Au moment de la commande, il vous est donc demandé de',
        warnStrong1: 'demander expressément l\'exécution immédiate',
        warnP2: "du service et de",
        warnStrong2: 'renoncer expressément à votre droit de rétractation',
        warnP3: ", en cochant une case prévue à cet effet. Cette renonciation, prévue aux articles L221-25 et L221-28 du code de la consommation, vous est confirmée par écrit sur un support durable.",
        p2a: 'Si vous ne cochez pas cette case',
        p2b: ', la fourniture du service ne commence qu\'à l\'expiration du délai de quatorze jours, et vous conservez votre droit de rétractation entier pendant ce délai.',
        p3a: 'Si vous la cochez',
        p3b: ", vous perdez votre droit de rétractation dès l'ouverture de l'accès. L'essai gratuit de",
        p3days: ' jours',
        p3c: ", lorsqu'il s'applique, vous permet en pratique d'éprouver le service avant tout débit : il ne se substitue pas au droit légal, mais il en rend l'exercice rarement nécessaire.",
        p4a: 'Pour exercer votre droit de rétractation lorsqu\'il subsiste, il suffit de nous adresser une déclaration dénuée d\'ambiguïté à',
        p4b: 'Le remboursement intervient dans les quatorze jours suivant la réception de votre demande, par le même moyen de paiement.',
      },
      impaye: {
        h2: 'Impayé et suspension',
        p1: "En cas d'échec d'un prélèvement, notre prestataire effectue plusieurs tentatives et vous en êtes informé par courriel et dans le tableau de bord. Pendant cette période, l'accès est maintenu.",
        p2a: "Si l'impayé persiste au terme de ces tentatives, l'abonnement prend fin et le serveur revient à l'offre Gratuit : les modules payants sont désactivés.",
        p2Strong: 'Vos données et vos configurations sont conservées',
        p2b: 'et redeviennent actives si vous souscrivez de nouveau, dans les limites de la politique de conservation décrite dans la',
        p2Link: 'politique de confidentialité',
        p2c: '.',
      },
      fourniture: {
        h2: 'Fourniture du service et disponibilité',
        p1a: 'Nous sommes tenus à une',
        p1Strong: 'obligation de moyens',
        p1b: ": nous mettons en œuvre les moyens raisonnables pour assurer la disponibilité et le bon fonctionnement du service, sans garantie d'un taux de disponibilité chiffré ni d'un fonctionnement ininterrompu et exempt d'erreurs.",
        intro: 'Sont notamment exclus de notre responsabilité, sans que la liste soit limitative :',
        li1a: 'les interruptions, limitations, changements d\'interface ou de règles décidés par',
        li1Strong: 'Discord',
        li1b: ', dont Kotbo dépend entièrement ;',
        li2: 'les incidents de nos hébergeurs et prestataires techniques (Cloudflare, Contabo, Stripe) ;',
        li3: 'les défauts de votre connexion, de votre matériel ou de votre configuration Discord (permissions insuffisantes accordées au bot, notamment) ;',
        li4: 'les opérations de maintenance, annoncées lorsque cela est possible ;',
        li5: 'les cas de force majeure.',
        p2: 'Une interruption prolongée qui nous serait imputable et qui priverait durablement le service de son intérêt ouvre droit, sur demande, à une prolongation de l\'abonnement à due proportion.',
        p3a: 'Les offres',
        p3Strong: 'Sur mesure',
        p3b: 'peuvent prévoir un niveau de service défini au contrat ; il prévaut alors sur le présent article.',
      },
      garantie: {
        h2: 'Garantie légale de conformité',
        p1a: 'Kotbo est un contenu numérique fourni de manière continue. Vous bénéficiez à ce titre de la',
        p1Strong: 'garantie légale de conformité',
        p1b: 'prévue aux articles L224-25-12 et suivants du code de la consommation, pendant toute la durée de fourniture du service.',
        p2: "Si le service n'est pas conforme à ce qui est annoncé, vous pouvez en exiger la mise en conformité sans frais et dans un délai raisonnable. À défaut, vous pouvez obtenir une réduction du prix ou la résolution du contrat, dans les conditions prévues par la loi. Cette garantie s'applique indépendamment de toute garantie commerciale, et sans frais pour vous.",
        p3a: 'Pour la mettre en œuvre, écrivez à',
        p3b: 'en décrivant le défaut constaté.',
      },
      evolution: {
        h2: 'Évolution du service et des prix',
        p1a: 'Kotbo évolue en continu. Les modules ajoutés au catalogue sont inclus dans les offres payantes sans supplément. Nous pouvons faire évoluer, remplacer ou retirer une fonctionnalité ; si un retrait affecte substantiellement une caractéristique essentielle du service, vous en êtes informé au moins',
        p1Strong: 'trente jours',
        p1b: 'à l\'avance et pouvez résilier sans frais, avec remboursement de la période non fournie.',
        p2a: 'Les prix peuvent être révisés.',
        p2Strong1: "Une révision ne s'applique jamais à une période déjà réglée.",
        p2b: 'Elle vous est notifiée au moins',
        p2Strong2: 'trente jours',
        p2c: "avant la date de reconduction concernée ; vous pouvez alors résilier avant cette date, auquel cas l'ancien prix s'applique jusqu'au terme en cours. Le silence vaut acceptation du nouveau tarif à compter de la reconduction.",
      },
      donnees: {
        h2: 'Données personnelles',
        p1a: 'Le traitement des données personnelles est décrit dans la',
        p1Link1: 'politique de confidentialité',
        p1b: "Lorsque nous traitons pour votre compte les données des membres de votre serveur, nous agissons en qualité de sous-traitant, dans les conditions de l'",
        p1Link2: 'accord de sous-traitance',
        p1c: 'qui fait partie intégrante du contrat.',
        p2: 'Les données strictement nécessaires à la facturation (identité du payeur, offre, montants, échéances) sont conservées pendant la durée légale de conservation des pièces comptables, soit dix ans.',
      },
      responsabilite: {
        h2: 'Responsabilité',
        p1a: 'Kotbo est un outil de gestion :',
        p1Strong: 'les décisions prises sur votre serveur restent les vôtres',
        p1b: '. Les sanctions appliquées, les messages publiés, les rôles attribués et les configurations retenues relèvent de votre responsabilité et de celle de votre équipe, y compris lorsqu\'ils résultent d\'automatismes que vous avez paramétrés.',
        p2Strong: 'Professionnels :',
        p2: "notre responsabilité au titre du contrat est limitée aux dommages directs et plafonnée aux sommes effectivement versées au cours des douze mois précédant le fait générateur. Sont exclus les dommages indirects, notamment la perte d'exploitation, de données, de clientèle ou d'image.",
        p3Strong: 'Consommateurs :',
        p3: "aucune stipulation des présentes ne saurait limiter les droits que vous tenez de la loi. Les limitations ci-dessus ne vous sont pas opposables, et notre responsabilité s'applique dans les conditions du droit commun.",
        p4: 'Aucune limitation ne joue en cas de dol, de faute lourde ou de dommage corporel.',
      },
      modification: {
        h2: 'Modification des CGV',
        p1a: "Les présentes CGV peuvent être modifiées. La version applicable à une commande est celle en vigueur au jour de cette commande. Toute modification substantielle vous est notifiée au moins",
        p1Strong: 'trente jours',
        p1b: 'avant sa prise d\'effet ; si elle ne vous convient pas, vous pouvez résilier sans frais avant cette date.',
      },
      litiges: {
        h2: 'Droit applicable et litiges',
        p1a: 'Les présentes CGV sont soumises au',
        p1Strong: 'droit français',
        p1b: '.',
        p2a: 'En cas de difficulté, nous vous invitons à nous écrire d\'abord à',
        p2b: ' : la très grande majorité des différends se règle à ce stade.',
        p3Strong: 'Consommateurs :',
        p3a: "vous pouvez saisir la juridiction de votre lieu de résidence ou celle du lieu d'exécution du contrat. La plateforme européenne de règlement en ligne des litiges est accessible à l'adresse",
        p4Strong: 'Professionnels :',
        p4: "à défaut d'accord amiable, compétence est attribuée aux tribunaux du ressort du siège du vendeur.",
        dangerTitle: 'Médiation de la consommation — clause manquante',
        dangerBody: "Tout professionnel qui vend à des consommateurs doit adhérer à un dispositif de médiation de la consommation et en indiquer les coordonnées dans ses conditions de vente (art. L616-1 et R616-1 du code de la consommation). Aucun médiateur n'est désigné à ce jour : cette mention devra être ajoutée après adhésion à un organisme référencé par la CECMC.",
      },
    },
    en: {
      title: 'Terms of Sale',
      subtitleTemplate: (date: string) => `Last updated: ${date} · Kotbo subscription service`,
      pricingDate: '6 September 2026',
      sections: {
        objet: 'Purpose & scope',
        vendeur: "Seller's identity",
        offres: 'Plans & tiers',
        prix: 'Price & VAT',
        commande: 'Order',
        essai: 'Free trial',
        cadeaux: 'Gifts & codes',
        paiement: 'Payment',
        duree: 'Term & termination',
        retractation: 'Right of withdrawal',
        impaye: 'Non-payment & suspension',
        fourniture: 'Service provision',
        garantie: 'Warranty of conformity',
        evolution: 'Changes & pricing',
        donnees: 'Personal data',
        responsabilite: 'Liability',
        modification: 'Amendment of these Terms',
        litiges: 'Governing law & disputes',
      },
      daysUnit: 'days',
      intro: {
        title: 'Acceptance',
        body: 'These terms of sale ("Terms of Sale") apply to any subscription to a paid Kotbo plan. They are accepted upon ordering: confirming payment constitutes full and unreserved acceptance. They supplement the',
        bodyLink: 'Terms of Use',
        bodyAfter: ', which govern use of the service; in the event of a conflict on a commercial matter, these Terms of Sale prevail.',
      },
      objet: {
        h2: 'Purpose and scope',
        p1: "These Terms of Sale set out the conditions under which the seller markets access to Kotbo's paid plans: a Discord bot and its web dashboard designed for community management (moderation, staff, tickets, statistics, levels, events, applications, economy and server organization).",
        p2a: 'They apply equally to',
        p2Strong1: 'consumers',
        p2b: '— any natural person acting for purposes outside their trade, business, craft or profession — and to',
        p2Strong2: 'professionals',
        p2c: 'Clauses reserved for one category or the other are labelled as such; failing any such indication, the clause applies to all.',
        p3a: 'The subscription is taken out',
        p3Strong: 'for a specific Discord server',
        p3b: 'It is neither assignable nor transferable from one server to another without our consent.',
      },
      vendeur: {
        h2: "Seller's identity",
        warnTitle: 'To be completed before publication',
        warnBody: 'Two mandatory particulars remain marked',
        warnCode: '[TO BE COMPLETED]',
        warnBody2: "below: the exact legal name and the business address (Art. L221-5 of the French Consumer Code). The page must not be published until these are filled in. The VAT number shown is derived from the SIREN number: it must be verified against the certificate of VAT liability before publication.",
        thInfo: 'Information',
        thValue: 'Value',
        rowDenomination: 'Legal name',
        rowDenominationValue: '[TO BE COMPLETED: name of the sole trader]',
        rowForme: 'Legal form',
        rowFormeValue: 'Sole proprietorship under the French micro-entrepreneur regime',
        rowSiren: 'SIREN',
        rowSiret: 'SIRET (registered office)',
        rowAdresse: 'Business address',
        rowAdresseValue: '[TO BE COMPLETED]',
        rowTva: 'Intra-Community VAT number',
        rowDirecteur: 'Publication director',
        rowDirecteurValue: 'Elouan Passereau and Nathan Rontey',
        rowContactCommercial: 'Sales contact',
        rowContactDonnees: 'Data protection contact',
        footnote: 'Hereinafter "the seller", "Kotbo" or "we". The customer is referred to as "you".',
      },
      offres: {
        h2: 'Plans and tiers',
        p1a: 'Kotbo is sold as an',
        p1Strong1: 'all-in-one',
        p1b: "package: a paid plan unlocks the entire module catalog, including modules added later. There is no module sold separately and no paid add-on. What distinguishes the plans is therefore not their functional content, but",
        p1Strong2: 'the size of the server',
        p1c: 'they are intended for.',
        thOffre: 'Plan',
        thTaille: 'Server size',
        thContenu: 'Content',
        thSouscription: 'Subscription',
        rowGratuitOffre: 'Free',
        rowGratuitTaille: '—',
        rowGratuitContenu: 'No module active. Only the configuration, module management and billing pages remain accessible.',
        rowGratuitSouscription: 'Default state, no order required',
        rowStarterTaille: 'Up to 1,000 members',
        rowContenuTout: 'Entire catalog',
        rowSouscriptionLibre: 'Online, self-service',
        rowProTaille: '1,001 to 10,000 members',
        rowUltimateTaille: '10,001 to 100,000 members',
        rowSurMesureOffre: 'Custom',
        rowSurMesureTaille: 'Above 100,000 members',
        rowSurMesureContenu: 'Entire catalog, terms agreed on a case-by-case basis',
        rowSurMesureSouscriptionBefore: 'By quotation, after a',
        rowSurMesureLink: 'consultation',
        p2: 'The applicable plan is determined by the server\'s size at the time of the order. If a server durably exceeds the ceiling of its plan, we will inform you and offer an upgrade to the plan above; failing agreement, we may apply the corresponding rate at the next renewal, under the conditions of Article 14.',
        p3a: 'The',
        p3Strong: 'Free',
        p3b: 'plan is not a trial version: it does not unlock any module. The bot may be present on a server without any paid feature being active.',
      },
      prix: {
        h2: 'Price and VAT',
        p1a: 'Prices are expressed in',
        p1Strong: 'euros, inclusive of all taxes',
        p1b: 'including French VAT at the rate in force. VAT details appear on each invoice, available from your billing area.',
        p2Before: 'Pricing in force as of',
        p2After: ':',
        thOffre: 'Plan',
        thMensuel: 'Monthly',
        thAnnuel: 'Annual',
        rowStarterMensuel: '€5.00 incl. VAT / month',
        rowStarterAnnuel: '€30.00 incl. VAT / year',
        rowProMensuel: '€9.99 incl. VAT / month',
        rowProAnnuel: '€49.99 incl. VAT / year',
        rowUltimateMensuel: '€25.00 incl. VAT / month',
        rowUltimateAnnuel: '€149.99 incl. VAT / year',
        rowSurMesure: 'Custom',
        rowSurDevis: 'By quotation',
        p3a: 'This table is provided for information purposes as of the date indicated.',
        p3Strong: 'The price that binds you is the one displayed on the order page at the moment you confirm payment',
        p3b: ', summarized before confirmation and confirmed by email.',
        p4: 'Prices do not include any costs charged by your bank (exchange fees, foreign-currency payment commissions), which remain your responsibility.',
      },
      commande: {
        h2: 'Order and formation of the contract',
        intro: 'The order is placed from the Kotbo dashboard:',
        li1: 'selecting the server concerned and the plan matching its size;',
        li2: 'selecting the billing period, monthly or annual;',
        li3: 'a detailed summary: plan, billing period, amount including VAT, date of the first payment and renewal date;',
        li4: 'acceptance of these Terms of Sale and, where applicable, express waiver of the right of withdrawal (Article 10);',
        li5: "payment on our payment provider's secure page.",
        p2a: 'The contract is formed upon',
        p2Strong: 'confirmation of payment',
        p2b: "by the payment provider. A confirmation is then sent to you by email, summarizing the essential features of the subscription. Access to the modules opens immediately.",
        p3: 'You warrant that you hold the necessary administrator rights on the Discord server concerned and are authorized to commit to the expense. An order placed for a server on which you do not hold these rights may be cancelled.',
      },
      essai: {
        h2: 'Free trial',
        p1a: 'A free trial of',
        p1Strong: `${TRIAL_DAYS} days`,
        p1b: 'is offered on the first subscription to a self-service plan (Starter, Pro and Ultimate). It unlocks all the modules of the chosen plan.',
        li1Strong: 'One trial per person and per server.',
        li1: 'Neither the same Discord account nor the same server may benefit from it twice, including by changing administrator or recreating a server.',
        li2Strong: 'A payment method is registered when the trial begins',
        li2: 'but no amount is charged during its term.',
        li3StrongPrefix: 'At the end of the',
        li3StrongSuffix: 'days, the subscription automatically continues',
        li3: 'and the first payment is taken, unless cancelled before that date. Cancellation during the trial is possible at any time from the dashboard and results in no charge.',
        li4: 'An order abandoned before payment (page closed, session expired) does not use up the trial: it remains available.',
        p2: 'The Custom plan does not carry a self-service trial: the discovery period is defined in the contract.',
      },
      cadeaux: {
        h2: 'Gifting Kotbo — gifts and activation codes',
        p1a: 'Kotbo can be gifted to a server. A gift is a',
        p1Strong: 'one-time payment',
        p1b: "that unlocks a plan for a fixed period: it is not a subscription, does not renew, and does not register any payment method for the recipient. At the end of the period, the server simply reverts to the Free plan, with nothing to cancel.",
        li1: 'Available durations: 1, 3, 6 or 12 months.',
        li2a: 'The gift can be purchased',
        li2Strong1: 'for a designated server',
        li2b: '(applied as soon as payment is confirmed) or',
        li2Strong2: 'as a code',
        li2c: 'to be shared, which the recipient activates from their billing page.',
        li3: 'An unactivated code remains valid and can be activated at any time; it can only be activated once.',
        li4: 'A gift cannot be exchanged for a refund, nor combined with a free trial on the same server.',
        li5: "If a subscription is already running on the recipient server, the gifted period is added on top of the existing access; it does not suspend the subscription's payments, which remain yours to cancel if you wish.",
        p2a: 'In addition,',
        p2Strong: 'activation codes',
        p2b: 'may be issued outside of a sale (partnership, compensation, commercial agreement). They grant access for a fixed period, with no financial consideration and no renewal.',
      },
      paiement: {
        h2: 'Payment',
        p1a: 'Payments are processed by',
        p1Strong1: 'Stripe Payments Europe, Ltd.',
        p1b: 'Card details are entered directly on this provider\'s pages:',
        p1Strong2: 'we never have access to them and we do not store them',
        p1c: '. We retain only the references necessary to manage the subscription (customer ID, subscription ID, status, due date).',
        p2: 'Subscriptions are paid in advance, by automatic charge to the registered payment method, at each renewal. Invoices are made available in your billing area.',
        p3Strong: 'Professionals:',
        p3: 'pursuant to Article L441-10 of the French Commercial Code, any late payment automatically incurs penalties at the statutory interest rate plus 10 points, together with a flat-rate collection compensation of €40.',
      },
      duree: {
        h2: 'Term, renewal and termination',
        h3_1: 'Term and renewal',
        p1a: 'The subscription is taken out',
        p1Strong1: 'with no minimum commitment period',
        p1b: ', for the chosen period (one month or one year), and is',
        p1Strong2: 'automatically renewed',
        p1c: 'at each renewal date for an identical period, for as long as it has not been cancelled.',
        h3_2: 'Cancellation by you',
        p2a: 'You may cancel',
        p2Strong: 'at any time and without reason',
        p2b: 'from the Billing page of your dashboard, in a few clicks and without needing to contact us.',
        infoStrong1: 'Effect of cancellation:',
        infoMid: 'it stops the renewal.',
        infoStrong2: 'Your access remains fully open until the end of the period already paid for',
        infoAfter: ", after which the server reverts to the Free plan. No refund, even partial, is due for the current period, which has been billed in advance and for which the service has been provided.",
        p3: 'As long as the end of the period has not been reached, you can change your mind and reactivate the renewal, at no cost.',
        h3_3: 'Notice before renewal — consumers',
        p4a: 'For',
        p4Strong: 'annual subscriptions taken out by a consumer',
        p4b: ", and pursuant to Article L215-1 of the French Consumer Code, we notify you by email, at the earliest three months and at the latest one month before the end date, of the option not to renew the subscription. If this notice reaches you late, you may terminate the subscription free of charge at any time from the renewal date, and amounts paid after that date will be refunded to you.",
        h3_4: 'Cancellation by us',
        p5a: 'We may cancel the subscription in the event of a serious breach of the',
        p5Link: 'Terms of Use',
        p5b: "(prohibited use, harm to the service, circumvention of a plan's limitations) or persistent non-payment, after formal notice has remained without effect for fifteen days — except in cases of misconduct making continuation of the contract manifestly impossible, where cancellation may be immediate. Amounts corresponding to a period not provided are then refunded.",
        p6: "Removing the bot from the Discord server does not constitute cancellation: the subscription continues and payments carry on until it has been cancelled from the dashboard.",
      },
      retractation: {
        h2: 'Right of withdrawal',
        note: 'This article applies exclusively to consumers.',
        p1a: 'As a consumer, you are in principle entitled to a period of',
        p1Strong: 'fourteen days',
        p1b: 'from the formation of the contract to withdraw, without reason or penalty (Art. L221-18 of the French Consumer Code).',
        warnTitle: 'Immediate performance and waiver',
        warnP1: 'Kotbo is digital content supplied immediately: the modules unlock as soon as payment is confirmed. When placing your order, you are therefore asked to',
        warnStrong1: 'expressly request immediate performance',
        warnP2: 'of the service and to',
        warnStrong2: 'expressly waive your right of withdrawal',
        warnP3: ", by ticking a box provided for that purpose. This waiver, provided for in Articles L221-25 and L221-28 of the French Consumer Code, is confirmed to you in writing on a durable medium.",
        p2a: 'If you do not tick this box',
        p2b: ', supply of the service only begins upon expiry of the fourteen-day period, and you retain your full right of withdrawal during that period.',
        p3a: 'If you tick it',
        p3b: ', you lose your right of withdrawal as soon as access opens. The',
        p3days: '-day ',
        p3c: "free trial, where applicable, in practice lets you try the service before any charge: it does not replace the statutory right, but it rarely makes exercising it necessary.",
        p4a: 'To exercise your right of withdrawal where it still applies, simply send us an unambiguous statement to',
        p4b: 'The refund is made within fourteen days of receipt of your request, using the same payment method.',
      },
      impaye: {
        h2: 'Non-payment and suspension',
        p1: 'If a payment fails, our provider makes several attempts and you are informed by email and in the dashboard. Access is maintained during this period.',
        p2a: 'If the non-payment persists at the end of these attempts, the subscription ends and the server reverts to the Free plan: paid modules are deactivated.',
        p2Strong: 'Your data and configurations are retained',
        p2b: 'and become active again if you subscribe again, within the limits of the retention policy described in the',
        p2Link: 'privacy policy',
        p2c: '.',
      },
      fourniture: {
        h2: 'Service provision and availability',
        p1a: 'We are bound by an',
        p1Strong: 'obligation of means',
        p1b: ": we implement reasonable measures to ensure the availability and proper functioning of the service, without guaranteeing a specific uptime rate or uninterrupted, error-free operation.",
        intro: 'In particular, and without limitation, the following are excluded from our liability:',
        li1a: 'interruptions, limitations, or changes to interfaces or rules decided by',
        li1Strong: 'Discord',
        li1b: ', on which Kotbo is entirely dependent;',
        li2: 'incidents affecting our hosting providers and technical service providers (Cloudflare, Contabo, Stripe);',
        li3: 'defects in your connection, your hardware, or your Discord configuration (in particular, insufficient permissions granted to the bot);',
        li4: 'maintenance operations, announced whenever possible;',
        li5: 'cases of force majeure.',
        p2: 'A prolonged interruption attributable to us that durably deprives the service of its purpose gives rise, upon request, to a proportionate extension of the subscription.',
        p3a: 'The',
        p3Strong: 'Custom',
        p3b: 'plans may provide for a service level defined in the contract, which then prevails over this article.',
      },
      garantie: {
        h2: 'Statutory warranty of conformity',
        p1a: 'Kotbo is digital content supplied on a continuous basis. As such, you benefit from the',
        p1Strong: 'statutory warranty of conformity',
        p1b: 'provided for in Articles L224-25-12 et seq. of the French Consumer Code, throughout the duration of service provision.',
        p2: 'If the service does not conform to what is advertised, you may require it to be brought into conformity free of charge and within a reasonable time. Failing that, you may obtain a price reduction or termination of the contract, under the conditions provided by law. This warranty applies independently of any commercial warranty, and at no cost to you.',
        p3a: 'To invoke it, write to',
        p3b: 'describing the defect observed.',
      },
      evolution: {
        h2: 'Changes to the service and to prices',
        p1a: 'Kotbo evolves continuously. Modules added to the catalog are included in the paid plans at no extra charge. We may develop, replace or withdraw a feature; if a withdrawal substantially affects an essential characteristic of the service, you will be notified at least',
        p1Strong: 'thirty days',
        p1b: 'in advance and may cancel free of charge, with a refund of the period not provided.',
        p2a: 'Prices may be revised.',
        p2Strong1: 'A revision never applies to a period already paid for.',
        p2b: 'You will be notified at least',
        p2Strong2: 'thirty days',
        p2c: "before the relevant renewal date; you may then cancel before that date, in which case the old price applies until the end of the current period. Silence constitutes acceptance of the new rate from the renewal date onward.",
      },
      donnees: {
        h2: 'Personal data',
        p1a: 'The processing of personal data is described in the',
        p1Link1: 'privacy policy',
        p1b: 'When we process the data of your server\'s members on your behalf, we act as a processor, under the conditions of the',
        p1Link2: 'data processing agreement',
        p1c: 'which forms an integral part of the contract.',
        p2: 'Data strictly necessary for billing (payer identity, plan, amounts, due dates) is retained for the statutory retention period for accounting records, i.e. ten years.',
      },
      responsabilite: {
        h2: 'Liability',
        p1a: 'Kotbo is a management tool:',
        p1Strong: 'the decisions made on your server remain yours',
        p1b: '. Sanctions applied, messages posted, roles assigned and configurations chosen are your responsibility and that of your team, including when they result from automations you have configured.',
        p2Strong: 'Professionals:',
        p2: 'our liability under the contract is limited to direct damages and capped at the amounts actually paid during the twelve months preceding the event giving rise to liability. Indirect damages are excluded, in particular loss of business, data, customers or reputation.',
        p3Strong: 'Consumers:',
        p3: 'no provision herein may limit the rights you hold under law. The limitations above are not enforceable against you, and our liability applies under ordinary law.',
        p4: 'No limitation applies in the event of fraud, gross negligence, or personal injury.',
      },
      modification: {
        h2: 'Amendment of these Terms of Sale',
        p1a: 'These Terms of Sale may be amended. The version applicable to an order is the one in force on the day of that order. Any material amendment will be notified to you at least',
        p1Strong: 'thirty days',
        p1b: 'before it takes effect; if it does not suit you, you may cancel free of charge before that date.',
      },
      litiges: {
        h2: 'Governing law and disputes',
        p1a: 'These Terms of Sale are governed by',
        p1Strong: 'French law',
        p1b: '.',
        p2a: 'Should any difficulty arise, we invite you to first write to us at',
        p2b: ': the vast majority of disputes are resolved at this stage.',
        p3Strong: 'Consumers:',
        p3a: 'you may bring proceedings before the court of your place of residence or that of the place of performance of the contract. The European online dispute resolution platform is available at',
        p4Strong: 'Professionals:',
        p4: 'failing an amicable agreement, jurisdiction is granted to the courts within the territory of the seller\'s registered office.',
        dangerTitle: 'Consumer mediation — missing clause',
        dangerBody: "Any professional selling to consumers must join a consumer mediation scheme and provide its contact details in its terms of sale (Art. L616-1 and R616-1 of the French Consumer Code). No mediator has been designated to date: this mention will need to be added once membership of a body listed by the CECMC (the French consumer mediation oversight commission) has been obtained.",
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);

  const sections = $derived([
    { id: 'objet',          label: t.sections.objet },
    { id: 'vendeur',        label: t.sections.vendeur },
    { id: 'offres',         label: t.sections.offres },
    { id: 'prix',           label: t.sections.prix },
    { id: 'commande',       label: t.sections.commande },
    { id: 'essai',          label: t.sections.essai },
    { id: 'cadeaux',        label: t.sections.cadeaux },
    { id: 'paiement',       label: t.sections.paiement },
    { id: 'duree',          label: t.sections.duree },
    { id: 'retractation',   label: t.sections.retractation },
    { id: 'impaye',         label: t.sections.impaye },
    { id: 'fourniture',     label: t.sections.fourniture },
    { id: 'garantie',       label: t.sections.garantie },
    { id: 'evolution',      label: t.sections.evolution },
    { id: 'donnees',        label: t.sections.donnees },
    { id: 'responsabilite', label: t.sections.responsabilite },
    { id: 'modification',   label: t.sections.modification },
    { id: 'litiges',        label: t.sections.litiges },
  ]);
</script>

<Seo title="Conditions Générales de Vente | Kotbo" description="Conditions générales de vente des abonnements Kotbo : offres, prix, TVA, essai gratuit, reconduction, résiliation, rétractation et garanties." path="/cgv" />

<LegalPageLayout
  title={t.title}
  subtitle={t.subtitleTemplate(t.pricingDate)}
  {sections}
  activePage="cgv"
>
  <div class="info-box warn mb-10">
    <p class="font-bold mb-1">{t.intro.title}</p>
    <p class="mb-0">
      {t.intro.body} <a href="{base}/terms">{t.intro.bodyLink}</a> {t.intro.bodyAfter}
    </p>
  </div>

  <section id="objet" class="policy-section">
    <div class="section-badge">01</div>
    <h2>{t.objet.h2}</h2>
    <p>
      {t.objet.p1}
    </p>
    <p>
      {t.objet.p2a} <strong>{t.objet.p2Strong1}</strong> {t.objet.p2b} <strong>{t.objet.p2Strong2}</strong>. {t.objet.p2c}
    </p>
    <p>
      {t.objet.p3a} <strong>{t.objet.p3Strong}</strong>. {t.objet.p3b}
    </p>
  </section>

  <section id="vendeur" class="policy-section">
    <div class="section-badge">02</div>
    <h2>{t.vendeur.h2}</h2>

    <div class="info-box danger mb-6">
      <p class="font-bold mb-1">{t.vendeur.warnTitle}</p>
      <p class="mb-0">
        {t.vendeur.warnBody} <code>{t.vendeur.warnCode}</code> {t.vendeur.warnBody2}
      </p>
    </div>

    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.vendeur.thInfo}</th><th>{t.vendeur.thValue}</th></tr></thead>
        <tbody>
          <tr><td>{t.vendeur.rowDenomination}</td><td><code>{t.vendeur.rowDenominationValue}</code></td></tr>
          <tr><td>{t.vendeur.rowForme}</td><td>{t.vendeur.rowFormeValue}</td></tr>
          <tr><td>{t.vendeur.rowSiren}</td><td>101 303 535</td></tr>
          <tr><td>{t.vendeur.rowSiret}</td><td>101 303 535 00021</td></tr>
          <tr><td>{t.vendeur.rowAdresse}</td><td><code>{t.vendeur.rowAdresseValue}</code></td></tr>
          <tr><td>{t.vendeur.rowTva}</td><td>FR 14 101303535</td></tr>
          <tr><td>{t.vendeur.rowDirecteur}</td><td>{t.vendeur.rowDirecteurValue}</td></tr>
          <tr><td>{t.vendeur.rowContactCommercial}</td><td><a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a></td></tr>
          <tr><td>{t.vendeur.rowContactDonnees}</td><td><a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a></td></tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm text-gray-500">
      {t.vendeur.footnote}
    </p>
  </section>

  <section id="offres" class="policy-section">
    <div class="section-badge">03</div>
    <h2>{t.offres.h2}</h2>
    <p>
      {t.offres.p1a} <strong>{t.offres.p1Strong1}</strong> {t.offres.p1b} <strong>{t.offres.p1Strong2}</strong> {t.offres.p1c}
    </p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.offres.thOffre}</th><th>{t.offres.thTaille}</th><th>{t.offres.thContenu}</th><th>{t.offres.thSouscription}</th></tr></thead>
        <tbody>
          <tr><td><strong>{t.offres.rowGratuitOffre}</strong></td><td>{t.offres.rowGratuitTaille}</td><td>{t.offres.rowGratuitContenu}</td><td>{t.offres.rowGratuitSouscription}</td></tr>
          <tr><td><strong>Starter</strong></td><td>{t.offres.rowStarterTaille}</td><td>{t.offres.rowContenuTout}</td><td>{t.offres.rowSouscriptionLibre}</td></tr>
          <tr><td><strong>Pro</strong></td><td>{t.offres.rowProTaille}</td><td>{t.offres.rowContenuTout}</td><td>{t.offres.rowSouscriptionLibre}</td></tr>
          <tr><td><strong>Ultimate</strong></td><td>{t.offres.rowUltimateTaille}</td><td>{t.offres.rowContenuTout}</td><td>{t.offres.rowSouscriptionLibre}</td></tr>
          <tr><td><strong>{t.offres.rowSurMesureOffre}</strong></td><td>{t.offres.rowSurMesureTaille}</td><td>{t.offres.rowSurMesureContenu}</td><td>{t.offres.rowSurMesureSouscriptionBefore} <a href="https://pros.kotbo.fr/rdv" target="_blank" rel="noopener noreferrer">{t.offres.rowSurMesureLink}</a></td></tr>
        </tbody>
      </table>
    </div>
    <p>
      {t.offres.p2}
    </p>
    <p>
      {t.offres.p3a} <strong>{t.offres.p3Strong}</strong> {t.offres.p3b}
    </p>
  </section>

  <section id="prix" class="policy-section">
    <div class="section-badge">04</div>
    <h2>{t.prix.h2}</h2>
    <p>
      {t.prix.p1a} <strong>{t.prix.p1Strong}</strong>, {t.prix.p1b}
    </p>
    <p>{t.prix.p2Before} {t.pricingDate}{t.prix.p2After}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.prix.thOffre}</th><th>{t.prix.thMensuel}</th><th>{t.prix.thAnnuel}</th></tr></thead>
        <tbody>
          <tr><td>Starter</td><td>{t.prix.rowStarterMensuel}</td><td>{t.prix.rowStarterAnnuel}</td></tr>
          <tr><td>Pro</td><td>{t.prix.rowProMensuel}</td><td>{t.prix.rowProAnnuel}</td></tr>
          <tr><td>Ultimate</td><td>{t.prix.rowUltimateMensuel}</td><td>{t.prix.rowUltimateAnnuel}</td></tr>
          <tr><td>{t.prix.rowSurMesure}</td><td colspan="2">{t.prix.rowSurDevis}</td></tr>
        </tbody>
      </table>
    </div>
    <p>
      {t.prix.p3a} <strong>{t.prix.p3Strong}</strong>{t.prix.p3b}
    </p>
    <p>
      {t.prix.p4}
    </p>
  </section>

  <section id="commande" class="policy-section">
    <div class="section-badge">05</div>
    <h2>{t.commande.h2}</h2>
    <p>{t.commande.intro}</p>
    <ul>
      <li>{t.commande.li1}</li>
      <li>{t.commande.li2}</li>
      <li>{t.commande.li3}</li>
      <li>{t.commande.li4}</li>
      <li>{t.commande.li5}</li>
    </ul>
    <p>
      {t.commande.p2a} <strong>{t.commande.p2Strong}</strong> {t.commande.p2b}
    </p>
    <p>
      {t.commande.p3}
    </p>
  </section>

  <section id="essai" class="policy-section">
    <div class="section-badge">06</div>
    <h2>{t.essai.h2}</h2>
    <p>
      {t.essai.p1a} <strong>{t.essai.p1Strong}</strong> {t.essai.p1b}
    </p>
    <ul>
      <li><strong>{t.essai.li1Strong}</strong> {t.essai.li1}</li>
      <li><strong>{t.essai.li2Strong}</strong>, {t.essai.li2}</li>
      <li><strong>{t.essai.li3StrongPrefix} {TRIAL_DAYS} {t.essai.li3StrongSuffix}</strong> {t.essai.li3}</li>
      <li>{t.essai.li4}</li>
    </ul>
    <p>
      {t.essai.p2}
    </p>
  </section>

  <section id="cadeaux" class="policy-section">
    <div class="section-badge">07</div>
    <h2>{t.cadeaux.h2}</h2>
    <p>
      {t.cadeaux.p1a} <strong>{t.cadeaux.p1Strong}</strong> {t.cadeaux.p1b}
    </p>
    <ul>
      <li>{t.cadeaux.li1}</li>
      <li>{t.cadeaux.li2a} <strong>{t.cadeaux.li2Strong1}</strong> {t.cadeaux.li2b} <strong>{t.cadeaux.li2Strong2}</strong> {t.cadeaux.li2c}</li>
      <li>{t.cadeaux.li3}</li>
      <li>{t.cadeaux.li4}</li>
      <li>{t.cadeaux.li5}</li>
    </ul>
    <p>
      {t.cadeaux.p2a} <strong>{t.cadeaux.p2Strong}</strong> {t.cadeaux.p2b}
    </p>
  </section>

  <section id="paiement" class="policy-section">
    <div class="section-badge">08</div>
    <h2>{t.paiement.h2}</h2>
    <p>
      {t.paiement.p1a} <strong>{t.paiement.p1Strong1}</strong> {t.paiement.p1b} <strong>{t.paiement.p1Strong2}</strong>{t.paiement.p1c}
    </p>
    <p>
      {t.paiement.p2}
    </p>
    <p>
      <strong>{t.paiement.p3Strong}</strong> {t.paiement.p3}
    </p>
  </section>

  <section id="duree" class="policy-section">
    <div class="section-badge">09</div>
    <h2>{t.duree.h2}</h2>

    <h3>{t.duree.h3_1}</h3>
    <p>
      {t.duree.p1a} <strong>{t.duree.p1Strong1}</strong>{t.duree.p1b} <strong>{t.duree.p1Strong2}</strong> {t.duree.p1c}
    </p>

    <h3>{t.duree.h3_2}</h3>
    <p>
      {t.duree.p2a} <strong>{t.duree.p2Strong}</strong>, {t.duree.p2b}
    </p>
    <div class="info-box mb-4">
      <p class="mb-0">
        <strong>{t.duree.infoStrong1}</strong> {t.duree.infoMid} <strong>{t.duree.infoStrong2}</strong>{t.duree.infoAfter}
      </p>
    </div>
    <p>
      {t.duree.p3}
    </p>

    <h3>{t.duree.h3_3}</h3>
    <p>
      {t.duree.p4a} <strong>{t.duree.p4Strong}</strong>, {t.duree.p4b}
    </p>

    <h3>{t.duree.h3_4}</h3>
    <p>
      {t.duree.p5a} <a href="{base}/terms">{t.duree.p5Link}</a> {t.duree.p5b}
    </p>
    <p>
      {t.duree.p6}
    </p>
  </section>

  <section id="retractation" class="policy-section">
    <div class="section-badge">10</div>
    <h2>{t.retractation.h2}</h2>
    <p class="text-sm text-gray-500">{t.retractation.note}</p>
    <p>
      {t.retractation.p1a} <strong>{t.retractation.p1Strong}</strong> {t.retractation.p1b}
    </p>
    <div class="info-box warn mb-4">
      <p class="font-bold mb-1">{t.retractation.warnTitle}</p>
      <p class="mb-0">
        {t.retractation.warnP1} <strong>{t.retractation.warnStrong1}</strong> {t.retractation.warnP2} <strong>{t.retractation.warnStrong2}</strong>{t.retractation.warnP3}
      </p>
    </div>
    <p>
      <strong>{t.retractation.p2a}</strong>{t.retractation.p2b}
    </p>
    <p>
      <strong>{t.retractation.p3a}</strong>{t.retractation.p3b} {TRIAL_DAYS}{t.retractation.p3days}{t.retractation.p3c}
    </p>
    <p>
      {t.retractation.p4a} <a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a>. {t.retractation.p4b}
    </p>
  </section>

  <section id="impaye" class="policy-section">
    <div class="section-badge">11</div>
    <h2>{t.impaye.h2}</h2>
    <p>
      {t.impaye.p1}
    </p>
    <p>
      {t.impaye.p2a} <strong>{t.impaye.p2Strong}</strong> {t.impaye.p2b}
      <a href="{base}/privacy">{t.impaye.p2Link}</a>{t.impaye.p2c}
    </p>
  </section>

  <section id="fourniture" class="policy-section">
    <div class="section-badge">12</div>
    <h2>{t.fourniture.h2}</h2>
    <p>
      {t.fourniture.p1a} <strong>{t.fourniture.p1Strong}</strong>{t.fourniture.p1b}
    </p>
    <p>{t.fourniture.intro}</p>
    <ul>
      <li>{t.fourniture.li1a} <strong>{t.fourniture.li1Strong}</strong>{t.fourniture.li1b}</li>
      <li>{t.fourniture.li2}</li>
      <li>{t.fourniture.li3}</li>
      <li>{t.fourniture.li4}</li>
      <li>{t.fourniture.li5}</li>
    </ul>
    <p>
      {t.fourniture.p2}
    </p>
    <p>
      {t.fourniture.p3a} <strong>{t.fourniture.p3Strong}</strong> {t.fourniture.p3b}
    </p>
  </section>

  <section id="garantie" class="policy-section">
    <div class="section-badge">13</div>
    <h2>{t.garantie.h2}</h2>
    <p>
      {t.garantie.p1a} <strong>{t.garantie.p1Strong}</strong> {t.garantie.p1b}
    </p>
    <p>
      {t.garantie.p2}
    </p>
    <p>
      {t.garantie.p3a} <a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a> {t.garantie.p3b}
    </p>
  </section>

  <section id="evolution" class="policy-section">
    <div class="section-badge">14</div>
    <h2>{t.evolution.h2}</h2>
    <p>
      {t.evolution.p1a} <strong>{t.evolution.p1Strong}</strong> {t.evolution.p1b}
    </p>
    <p>
      {t.evolution.p2a} <strong>{t.evolution.p2Strong1}</strong> {t.evolution.p2b} <strong>{t.evolution.p2Strong2}</strong> {t.evolution.p2c}
    </p>
  </section>

  <section id="donnees" class="policy-section">
    <div class="section-badge">15</div>
    <h2>{t.donnees.h2}</h2>
    <p>
      {t.donnees.p1a} <a href="{base}/privacy">{t.donnees.p1Link1}</a>.
      {t.donnees.p1b} <a href="{base}/dpa">{t.donnees.p1Link2}</a>, {t.donnees.p1c}
    </p>
    <p>
      {t.donnees.p2}
    </p>
  </section>

  <section id="responsabilite" class="policy-section">
    <div class="section-badge">16</div>
    <h2>{t.responsabilite.h2}</h2>
    <p>
      {t.responsabilite.p1a} <strong>{t.responsabilite.p1Strong}</strong>{t.responsabilite.p1b}
    </p>
    <p>
      <strong>{t.responsabilite.p2Strong}</strong> {t.responsabilite.p2}
    </p>
    <p>
      <strong>{t.responsabilite.p3Strong}</strong> {t.responsabilite.p3}
    </p>
    <p>{t.responsabilite.p4}</p>
  </section>

  <section id="modification" class="policy-section">
    <div class="section-badge">17</div>
    <h2>{t.modification.h2}</h2>
    <p>
      {t.modification.p1a} <strong>{t.modification.p1Strong}</strong> {t.modification.p1b}
    </p>
  </section>

  <section id="litiges" class="policy-section">
    <div class="section-badge">18</div>
    <h2>{t.litiges.h2}</h2>
    <p>
      {t.litiges.p1a} <strong>{t.litiges.p1Strong}</strong>{t.litiges.p1b}
    </p>
    <p>
      {t.litiges.p2a}
      <a href="mailto:contact@kotbo.fr">contact@kotbo.fr</a>{t.litiges.p2b}
    </p>
    <p>
      <strong>{t.litiges.p3Strong}</strong> {t.litiges.p3a}
      <a href="https://consumer-redress.ec.europa.eu/" target="_blank" rel="noopener noreferrer">consumer-redress.ec.europa.eu</a>.
    </p>
    <p>
      <strong>{t.litiges.p4Strong}</strong> {t.litiges.p4}
    </p>

    <div class="info-box danger">
      <p class="font-bold mb-1">{t.litiges.dangerTitle}</p>
      <p class="mb-0">
        {t.litiges.dangerBody}
      </p>
    </div>
  </section>
</LegalPageLayout>

<script lang="ts">
  import { base } from '$app/paths';
  import LegalPageLayout from '$lib/components/LegalPageLayout.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      title: 'Politique de Confidentialité',
      subtitle: 'Dernière mise à jour : 20 juillet 2026 · Bot Discord Kotbo et Dashboard associé',
      sections: {
        responsable: 'Responsable & rôles',
        collecte: 'Données collectées',
        messages: 'Journalisation des messages',
        verification: 'Vérification anti multi-comptes',
        finalites: 'Finalités & bases légales',
        destinataires: 'Destinataires',
        retention: 'Durée de conservation',
        hebergement: 'Hébergement & transferts',
        droits: 'Vos droits (RGPD)',
        securite: 'Sécurité',
        profilage: 'Profilage & décisions',
        mineurs: 'Mineurs',
        modifications: 'Modifications',
        contact: 'Contact',
      },
      preamble: {
        title: 'À destination des administrateurs de serveur Discord',
        pre1: "L'administrateur détermine les modules activés et agit comme",
        strong1: 'responsable du traitement',
        mid1: 'pour les données propres à son serveur. Kotbo traite ces données comme',
        strong2: 'sous-traitant',
        mid2: ", sur instruction de l'administrateur (voir",
        link1: 'accord de sous-traitance',
        mid3: "). Celui-ci doit informer ses membres conformément aux articles 13 et 14 du RGPD — un",
        link2: "modèle d'information",
        mid4: "est fourni. Certains traitements (blacklist globale, sécurité, journaux techniques) relèvent en revanche de la responsabilité directe de Kotbo (voir tableau §1).",
      },
      responsable: {
        h2: 'Responsable du traitement & répartition des rôles',
        p1a: 'Le service Kotbo est édité et exploité par',
        p1code: "[À COMPLÉTER : nom de l'entrepreneur individuel]",
        p1b: 'entreprise individuelle immatriculée sous le SIREN 101 303 535, qui est à ce titre le responsable du traitement pour les traitements décrits au présent paragraphe.',
        p2: 'Le service est conçu et développé par :',
        p3a: 'Contact vie privée :',
        p3b: '· Coordonnées complètes sur la page',
        p3link: 'Mentions légales',
        p3after: '',
        p4: "Kotbo est un bot Discord pour les communautés francophones (gestion du staff, modération, tickets, statistiques, niveaux, événements, candidatures, économie, organisation générale). Il n'opère que sur les serveurs où il a été explicitement invité.",
        h3_1: 'Qui est responsable de quoi',
        p5a: "La qualification n'est pas globale : elle dépend du traitement. Le tableau ci-dessous précise, pour chaque grande finalité, si Kotbo agit comme",
        p5Strong1: 'sous-traitant',
        p5b: "(sur instruction de l'administrateur) ou comme",
        p5Strong2: 'responsable',
        p5c: '(Kotbo décide seul de la finalité et des moyens).',
        thTraitement: 'Traitement',
        thRoleKotbo: 'Rôle de Kotbo',
        thResponsable: 'Responsable du traitement',
        rowSousTraitant: 'Sous-traitant',
        rowResponsable: 'Responsable',
        rowAdmin: 'Administrateur du serveur',
        row1: 'Profils membres, niveaux, statistiques, staff, tickets, candidatures, événements, économie, sauvegardes',
        row2: 'Journalisation complète des messages (module opt-in)',
        row3: 'Vérification de sécurité / anti multi-comptes d\'un serveur',
        row4: 'Compte administrateur & authentification au dashboard',
        row5: "Blacklist globale d'utilisateurs / de serveurs",
        row6: "Sécurité globale du service, prévention des abus, détection inter-serveurs",
        row7: "Journaux techniques & d'erreurs, métriques internes",
      },
      collecte: {
        h2: 'Données collectées',
        p1a: 'Kotbo ne collecte que les données nécessaires au fonctionnement des',
        p1Strong1: 'modules activés',
        p1b: 'sur chaque serveur. Chaque enregistrement est rattaché à l\'identifiant de serveur Discord (',
        p1Em: 'Guild ID',
        p1c: ') concerné. Le tableau ci-dessous récapitule',
        p1Strong2: 'ce qui est réellement stocké en base',
        p1d: "par catégorie ; il reflète exactement les données restituées par notre outil d'export RGPD.",
        h3_1: "Vue d'ensemble par catégorie",
        thCategorie: 'Catégorie',
        thDonnees: 'Données concernées',
        thDeclenche: 'Déclenché par',
        r1cat: 'Identité & profil',
        r1data: "Identifiant Discord, nom d'utilisateur / global / affichage, avatar, bannière, locale, bio, date de création du compte, dates d'entrée/sortie du serveur, niveau & XP, statistiques quotidiennes, préférences du dashboard, presets de mise en page, notifications, statut d'administrateur global.",
        r1trigger: 'Interaction avec le bot ou présence sur le serveur',
        r2cat: 'Vérifications de sécurité',
        r2data: 'Voir §4 (IP, appareil, e-mail, connexions, serveurs, données OAuth, preuves de doublon).',
        r2trigger: "Module de vérification activé par l'administrateur",
        r3cat: 'Modération & sécurité',
        r3data: 'Sanctions (type, motif, durée, expiration), rapports de sanction et preuves déposées, comptes liés (multi-comptes), appels de bannissement et leur blacklist, sessions vocales et échantillons de détection, inviteurs suspendus, blacklist globale.',
        r3trigger: 'Action de modération / modules de sécurité',
        r4cat: 'Messages',
        r4data: 'Voir §3 (journalisation complète du contenu des messages).',
        r4trigger: 'Module de logs de messages (désactivé par défaut)',
        r5cat: 'Contributions & contenus',
        r5data: 'Suggestions et votes, votes de réputation entre membres, soumissions de formulaires personnalisés, soumissions Daily Algo, candidatures de partenariat et de recrutement (réponses, e-mail éventuel, notes internes, motif de refus), articles rédigés.',
        r5trigger: 'Participation volontaire aux modules concernés',
        r6cat: 'Économie & marketplace',
        r6data: 'Profils RPG, combats, prises de pêche, guildes RPG, annonces et transactions marketplace, retours de satisfaction ticket.',
        r6trigger: 'Utilisation des modules économie / RPG / marketplace',
        r7cat: 'Engagement',
        r7data: 'Inscriptions et participations aux événements, progression des quêtes, invitations (membre & créées), abonnements aux flux et aux widgets.',
        r7trigger: "Participation aux modules d'engagement",
        r8cat: 'Tickets & support',
        r8data: 'Tickets ouverts (identité, raison, description) et transcript HTML complet de la conversation, retours de satisfaction.',
        r8trigger: "Ouverture d'un ticket",
        r9cat: 'Staff',
        r9data: "Fiche staff, grades et hiérarchie, activité et sessions vocales staff, évaluations, avertissements, blacklist staff, démissions, tâches, appels staff et invitations, rappels, rapports de mentorat, périodes d'essai, progression de tutorat, liens de serveur, clés API créées.",
        r9trigger: "Rôle Staff sur un serveur utilisant le module",
        r10cat: 'Système',
        r10data: "Tâches planifiées, cibles de notification, salons vocaux temporaires, instances white-label, journaux d'audit du dashboard, journaux d'erreurs techniques, métriques de modules.",
        r10trigger: 'Fonctionnement interne du service',
        infoBoxa: 'Chaque utilisateur peut obtenir la liste exacte de',
        infoBoxStrong: 'toutes',
        infoBoxb: "les données stockées à son sujet, tous serveurs confondus, via une demande d'export RGPD (voir §7) — l'outil interne parcourt l'intégralité des tables listées ci-dessus.",
        h3_2: 'Données de profil Discord',
        p2: "Collectées automatiquement lors d'une interaction avec le bot ou par présence sur un serveur utilisant Kotbo : identifiant Discord (immuable), nom d'utilisateur / tag / nom global / nom d'affichage, avatar et bannière, couleur d'accentuation, locale, biographie publique, date de création du compte, horodatages d'entrée et de sortie du serveur.",
        h3_3: 'Données d\'activité, statistiques et niveaux',
        p3: 'Alimentent les modules statistiques, niveaux/XP et le suivi d\'activité staff :',
        thDonnee: 'Donnée',
        thTable: 'Table',
        thFinalite: 'Finalité',
        t1donnee: 'Nombre de messages envoyés (par jour, par salon) —',
        t1Strong: 'compteurs uniquement, sans le contenu',
        t1finalite: 'Statistiques serveur, niveaux/XP',
        t2donnee: 'Temps passé en vocal (minutes)',
        t2finalite: 'Statistiques, niveaux, activité staff',
        t3donnee: 'Réactions, threads créés, réponses',
        t3finalite: 'Statistiques détaillées',
        t4donnee: 'Points XP, niveau, instantanés de saison',
        t4finalite: 'Système de niveaux par serveur',
        t5donnee: 'Dernière activité (dernier message, dernière présence)',
        t5finalite: "Profil membre, gestion d'activité staff",
        t6donnee: 'Usage des commandes du dashboard, préférences d\'interface',
        t6finalite: 'Fonctionnement et personnalisation du dashboard',
        info2Strong: 'Important :',
        info2a: 'les statistiques ci-dessus sont des',
        info2Strong2: 'compteurs agrégés',
        info2b: "et ne contiennent pas le texte des messages. La conservation du contenu intégral des messages relève d'un module distinct et opt-in, décrit en",
        info2link: '§3',
        h3_4: 'Modération, sanctions & sécurité de serveur',
        m1: "Identité de l'utilisateur sanctionné et du modérateur, type de sanction (avertissement, kick, timeout, ban temporaire/permanent, softban), motif, durée, expiration, statut, notes de résolution.",
        m2: 'Rapports de sanction : description de l\'incident, règles enfreintes, liens et fichiers de preuve déposés.',
        m3Strong: 'Comptes liés',
        m3: "(multi-comptes) : association de deux identifiants Discord et métadonnées de preuve (voir §4).",
        m4: 'Appels de bannissement et blacklist des appels : contenu de l\'appel, décision, statut.',
        m5: 'Détection comportementale : sessions vocales et échantillons de détection, inviteurs suspendus.',
        m6Strong: 'Blacklist globale',
        m6: ': identifiants d\'utilisateurs bannis de Kotbo à l\'échelle du service, avec motif (traitement dont Kotbo est responsable).',
        h3_5: 'Données du personnel (module Staff)',
        p5: "Uniquement pour les membres ayant un rôle Staff sur un serveur utilisant le module : grade et historique, avertissements internes, blacklist staff, périodes d'essai/tutorat et rapports de mentor, absences, présences aux réunions, notes confidentielles, votes en sondage staff, démissions, tâches, appels staff, rappels, évaluations, clés API créées par le staff (stockées sous forme de hash).",
        h3_6: 'Contributions, événements & économie',
        c1Strong: 'Candidatures',
        c1: '(recrutement, partenariat) : identité Discord, e-mail si le formulaire le demande, réponses au formulaire (JSON), notes internes du staff, résultat, motif de refus, cooldown de re-candidature.',
        c2Strong: 'Tickets',
        c2: ': identité, raison, description et transcript HTML complet — peut contenir tout message échangé avec le staff.',
        c3Strong: 'Événements (quiz, CTF)',
        c3: ': identité, score, réponses/résolutions, horodatages.',
        c4Strong: 'Suggestions, réputation, formulaires, Daily Algo, articles',
        c4: ': contenu fourni et identifiants des votants le cas échéant.',
        c5Strong: 'Économie / RPG / marketplace',
        c5: ': profils de jeu, combats, pêche, guildes, annonces et transactions.',
        c6Strong: 'Engagement',
        c6: ': participations aux événements, quêtes, invitations, abonnements aux flux et widgets.',
        h3_7: 'Authentification au dashboard & audit',
        p7a: "L'accès au dashboard utilise OAuth2 Discord (Authorization Code). Les jetons Discord sont chiffrés dans une session serveur temporaire ; le navigateur ne reçoit qu'un identifiant de session aléatoire dans un cookie sécurisé",
        p7Em: 'HttpOnly',
        p7b: ', jamais exposé au stockage JavaScript. Les actions administratives sont consignées dans un',
        p7Strong: "journal d'audit",
        p7c: '(identifiant utilisateur, action, module, horodatage). Détail des cookies dans la',
        p7link: 'politique cookies',
        h3_8: 'Sauvegardes de serveur',
        p8: 'Le module de sauvegarde peut stocker une photographie du serveur (rôles, salons, permissions, emojis, stickers) ; selon la configuration de l\'administrateur, des données membres peuvent y être incluses. Chaque serveur est soumis à un quota de stockage.',
        h3_9: 'Données techniques globales',
        e1Strong: "Journaux d'erreurs",
        e1: ': message d\'erreur, stack trace, source. Peuvent incidemment contenir des identifiants.',
        e2Strong: 'Métriques de modules',
        e2: ': compteurs d\'activation, d\'utilisation et de performance — agrégés, sans identifiant personnel direct.',
        h3_10: 'Visiteurs du site kotbo.fr',
        v1: "Le site mesure son audience sans cookie et sans outil tiers. À chaque étape, il envoie à l'API de Kotbo ce qui a été franchi (visite, tarifs lus, zone jouable essayée, clic sur « Ajouter Kotbo »), l'emplacement du clic, la catégorie de provenance (moteur de recherche, Discord, accès direct : jamais l'adresse complète) et un identifiant aléatoire propre à l'onglet.",
        v2: "Finalité : comprendre ce qui est lu et ce qui mène à une installation. Base légale : l'intérêt légitime de Kotbo (art. 6.1.f RGPD), dans les conditions d'exemption de consentement fixées par la CNIL pour la mesure d'audience. L'adresse IP n'est pas enregistrée. L'identifiant de visite est effacé au bout de 30 jours et n'est jamais rapproché d'un compte Discord ni d'un serveur. Les événements sont supprimés au bout de 13 mois.",
        v3: "Les icônes des communautés affichées sur l'accueil sont servies par l'API de Kotbo : votre navigateur ne contacte pas Discord.",
        v4a: 'Do Not Track et Global Privacy Control coupent la mesure. Vous pouvez aussi la refuser sur la',
        v4link: 'page cookies',
      },
      messages: {
        h2: 'Journalisation complète des messages',
        warnTitle: 'Module sensible, désactivé par défaut',
        warnP1a: 'Ce module n\'est',
        warnStrong1: 'jamais actif automatiquement',
        warnP1b: '. Un administrateur doit l\'activer explicitement pour son serveur. Lorsqu\'il est actif, Kotbo enregistre le',
        warnStrong2: 'contenu intégral des messages',
        warnP1c: 'des salons concernés afin de fournir une recherche globale dans l\'historique, à la manière d\'une recherche Discord.',
        h3_1: 'Données enregistrées',
        p1: 'Pour chaque message d\'un salon suivi, la table',
        p1code: 'MessageLog',
        p1b: 'stocke :',
        li1Strong: 'contenu textuel intégral',
        li1a: 'le',
        li1b: 'du message ;',
        li2Strong: 'pièces jointes',
        li2a: 'les',
        li2b: '(nom, URL, type) et le nombre d\'embeds ;',
        li3: 'l\'auteur (identifiant, nom affiché, avatar) et s\'il s\'agit d\'un bot ;',
        li4a: 'les',
        li4Strong1: 'mentions',
        li4b: '(utilisateurs mentionnés) et la',
        li4Strong2: 'relation de réponse',
        li4c: '(auteur du message auquel il est répondu) ;',
        li5: 'le salon (identifiant et nom) et le serveur ;',
        li6a: 'les horodatages de',
        li6Strong: 'création, modification et suppression',
        li6b: 'du message.',
        p2: 'L\'administrateur peut exclure certains salons de la journalisation. Les messages privés (DM) ne sont jamais journalisés.',
        h3_2: 'Conservation',
        p3a: 'Les messages sont automatiquement purgés après une',
        p3Strong: "durée de rétention configurée par l'administrateur",
        p3b: '(90 jours par défaut), plafonnée par Kotbo. Une purge automatique s\'exécute quotidiennement. Le contenu est également supprimé lorsque le module est désactivé ou lorsque le bot quitte le serveur.',
        h3_3: 'Base légale & responsabilités',
        p4a: 'Ce traitement repose sur l\'',
        p4Strong: 'intérêt légitime',
        p4b: 'de l\'administrateur (art. 6.1.f RGPD) à modérer et analyser l\'activité de sa communauté. Compte tenu de son caractère intrusif, l\'administrateur qui l\'active doit : informer clairement ses membres au préalable, restreindre l\'accès aux personnes habilitées, et définir une durée de conservation proportionnée. Kotbo agit ici comme sous-traitant.',
      },
      verification: {
        h2: 'Vérification de sécurité & détection de multi-comptes',
        p1a: 'À la demande d\'un administrateur, un membre peut être invité à effectuer une vérification via une connexion OAuth2 Discord dédiée. L\'objectif est de détecter le contournement de sanctions par la création de comptes multiples (« double-comptes »). Les données collectées dépendent du',
        p1Strong: 'niveau de vérification',
        p1b: 'choisi par l\'administrateur.',
        h3_1: 'Données OAuth demandées selon le niveau',
        thNiveau: 'Niveau',
        thScopes: 'Permissions OAuth (scopes)',
        thDonnees: 'Données récupérées',
        rowFaible: 'Faible',
        rowFaibleData: 'Identité Discord de base',
        rowMoyen: 'Moyen',
        rowMoyenData: '+ adresse e-mail Discord',
        rowEleve: 'Élevé',
        rowEleveData: '+ connexions liées (Steam, Xbox…), liste des serveurs, appartenance aux serveurs',
        h3_2before: 'Données stockées (table',
        h3_2after: ')',
        li1Strong1: 'Adresse IP',
        li1mid: 'et',
        li1Strong2: 'informations sur l\'appareil',
        li1end: '(navigateur / système) ;',
        li2Strong: 'Adresse e-mail Discord',
        li2end: '(niveaux moyen et élevé) ;',
        li3Strong1: 'Connexions',
        li3mid: 'et',
        li3Strong2: 'liste des serveurs',
        li3end: 'Discord (niveau élevé) ;',
        li4a: 'la',
        li4Strong: 'réponse OAuth brute',
        li4b: 'renvoyée par Discord ;',
        li5a: 'l\'identifiant du compte authentifié et le',
        li5Strong: 'résultat de la détection',
        li5b: '(doublon détecté, compte présumé lié, éléments de preuve).',
        h3_3: 'Logique de détection & conséquences',
        p2: 'Kotbo compare les éléments ci-dessus (IP, appareil, e-mail, connexions, comportement) à ceux d\'autres comptes du serveur pour repérer une correspondance suspecte. Selon la configuration, le résultat peut déclencher :',
        d1Strong: 'alerte au staff',
        d1a: 'une',
        d1code: 'NOTIFY_STAFF',
        d1b: 'pour décision humaine ;',
        d2Strong: 'liaison automatique',
        d2a: 'une',
        d2b: 'de deux comptes (',
        d2code: 'AUTO_LINK',
        d2c: ') lorsqu\'une incompatibilité forte est détectée ;',
        d3a: 'un statut',
        d3Em: '« signalé »',
        d3b: 'pouvant conduire à un refus d\'accès ou une sanction décidée par le staff du serveur.',
        h3_4: 'Accès, conservation & contestation',
        a1Strong: 'Qui y accède :',
        a1: 'le staff habilité du serveur concerné et, pour la maintenance, l\'équipe Kotbo (accès minimal, confidentialité).',
        a2Strong: 'Durée :',
        a2: 'les vérifications non finalisées (en attente / expirées) sont purgées à court terme ; les preuves d\'une détection sont conservées le temps nécessaire à la sécurité du serveur, puis supprimées (voir matrice §7).',
        a3Strong1: 'Décision automatisée :',
        a3a: 'une liaison ou un refus automatique peut avoir un effet significatif ; vous pouvez demander une',
        a3Strong2: 'intervention humaine',
        a3b: ', exprimer votre point de vue et',
        a3Strong3: 'contester',
        a3c: 'le résultat (voir §11).',
        a4Strong: 'Comment contester :',
        a4a: 'auprès du staff du serveur, ou via',
        a4b: 'pour les traitements relevant de Kotbo.',
        infoBox: 'La combinaison IP + appareil + activité + décisions potentielles fait l\'objet d\'une évaluation d\'analyse d\'impact (AIPD/DPIA) au titre de l\'article 35 du RGPD.',
      },
      finalites: {
        h2: 'Finalités et bases légales',
        p1: 'Conformément à l\'article 6 du RGPD, chaque traitement repose sur l\'une des bases légales suivantes :',
        thFinalite: 'Finalité',
        thBase: 'Base légale (art. 6)',
        r1a: 'Modération et sanctions au sein d\'un serveur',
        r1b: 'Intérêt légitime de l\'administrateur (6.1.f)',
        r2a: 'Gestion du personnel staff (grades, absences, activité)',
        r2b: 'Intérêt légitime / engagement communautaire (6.1.b et 6.1.f)',
        r3a: 'Niveaux, statistiques d\'activité',
        r3b: 'Intérêt légitime (6.1.f)',
        r4a: 'Journalisation complète des messages (§3)',
        r4b: 'Intérêt légitime de l\'administrateur (6.1.f), sous réserve d\'information préalable des membres',
        r5a: 'Tickets de support',
        r5b: 'Intérêt légitime (6.1.f)',
        r6a: 'Candidatures au staff / partenariat',
        r6b: 'Intérêt légitime (6.1.f). Consentement distinct pour toute conservation en vivier au-delà du recrutement en cours.',
        r7a: 'Vérification anti multi-comptes & sécurité (§4)',
        r7b: 'Intérêt légitime à protéger l\'intégrité du serveur et du service (6.1.f)',
        r8a: 'Blacklist globale, sécurité globale du service',
        r8b: 'Intérêt légitime de Kotbo (6.1.f)',
        r9a: 'Journalisation des erreurs techniques',
        r9b: 'Intérêt légitime à maintenir le service (6.1.f)',
        r10a: 'Événements, quiz, CTF, économie, engagement',
        r10b: 'Intérêt légitime lié à la participation volontaire (6.1.f)',
        r11a: 'Sauvegardes de serveur',
        r11b: 'Intérêt légitime de l\'administrateur (6.1.f)',
        infoStrong: 'Intérêt légitime :',
        info: 'pour chaque traitement fondé sur l\'article 6.1.f, une mise en balance est effectuée (nécessité, minimisation, attente raisonnable des personnes dans le contexte d\'une communauté Discord, mesures de sécurité). Vous pouvez vous y opposer pour un motif tenant à votre situation particulière (§9).',
      },
      destinataires: {
        h2: 'Destinataires des données',
        h3_1: 'Au sein de chaque serveur',
        li1Strong: 'administrateurs et modérateurs',
        li1a: 'Les',
        li1b: '— via le dashboard — accèdent aux données de leur serveur (modération, profils, statistiques, tickets, candidatures, staff, logs de messages si activés).',
        li2Strong: 'staff',
        li2a: 'Le',
        li2b: 'accède à tout ou partie de ces données selon les permissions configurées.',
        li3Strong: 'membres',
        li3a: 'Les',
        li3b: 'accèdent à leurs propres données (niveau, profil public, résultats d\'événements).',
        h3_2: "L'équipe Kotbo",
        p2: 'Les développeurs accèdent aux données pour la maintenance, le débogage et le support : accès restreint au minimum nécessaire et soumis à confidentialité.',
        h3_3: 'Sous-traitants & services tiers',
        thService: 'Service',
        thRole: 'Rôle',
        thDonneesTransmises: 'Données transmises',
        s1role: 'Plateforme hôte et source des données',
        s1data: 'Données de profil Discord (selon les CGU Discord)',
        s2role: 'Stockage et sauvegardes',
        s2dataBefore: 'Ensemble des données en base — voir',
        s2link: 'DPA',
        s3role: 'Réseau, cache, prévention des abus',
        s3data: 'Adresse IP, en-têtes HTTP, événements de sécurité',
        s4role: 'Surveillance des erreurs',
        s4data: 'Stack traces et contexte (peut contenir des métadonnées)',
        s5role: 'Suivi de contenu (modules)',
        s5data: 'Identifiants de chaînes / streamers uniquement — pas de données personnelles de membres',
        s6role: 'Traduction (module)',
        s6data: 'Contenu à traduire — auto-hébergé par défaut',
        s7role: "Chargement à la demande des moteurs de l'éditeur de code",
        s7data: "IP et en-têtes techniques, à l'ouverture de l'IDE uniquement",
        p3: 'Kotbo ne vend, ne loue et ne partage pas vos données à des fins commerciales ou publicitaires.',
      },
      retention: {
        h2: 'Durée de conservation',
        p1a: 'Les durées ci-dessous précisent la conservation en fonctionnement normal, après désactivation du module ou départ du bot, et dans les sauvegardes. Lorsqu\'une durée dépend d\'un réglage administrateur, un',
        p1Strong: 'plafond',
        p1b: 'est imposé par Kotbo.',
        thDonnee: 'Donnée',
        thActive: 'Conservation active',
        thApres: 'Après désactivation / départ',
        thSauvegardes: 'Sauvegardes',
        r1a: 'Logs de messages (§3)',
        r1b: 'Durée configurée (défaut 90 j, plafond imposé)',
        r1c: 'Purge à la désactivation ou au départ du bot',
        r1d: 'Expiration à court terme',
        r2a: 'Vérifications en attente / expirées (§4)',
        r2b: 'Jusqu\'à 7 jours après expiration',
        r2c: 'Immédiat',
        r2d: 'Non conservées durablement',
        r3a: 'Preuves de détection multi-comptes finalisées (§4)',
        r3b: 'Durée nécessaire à la sécurité du serveur, plafonnée',
        r3c: 'Purge après le délai',
        r3d: 'Expiration courte',
        r4a: 'Candidatures refusées',
        r4b: 'Cooldown de re-candidature, puis suppression (sauf vivier consenti)',
        r4c: 'Sur instruction admin',
        r4d: 'Expiration courte',
        r5a: 'Tickets & transcripts',
        r5b: 'Durée configurée / plafonnée',
        r5c: 'Sur instruction admin ou demande recevable',
        r5d: 'Expiration courte',
        r6a: "Journaux d'audit du dashboard",
        r6b: '90 jours',
        r6c: 'Automatique',
        r6d: 'Expiration courte',
        r7a: "Journaux d'erreurs techniques",
        r7b: '30 à 90 jours',
        r7c: 'Automatique',
        r7d: 'Expiration courte',
        r8a: 'Profil membre, niveaux, statistiques',
        r8b: 'Durée de vie du serveur sur Kotbo',
        r8c: 'Purge au départ du bot ou sur demande',
        r8d: 'Expiration selon cycle',
        r9a: 'Sanctions & données de modération',
        r9b: 'Durée de vie du serveur (nécessaire à la sécurité)',
        r9c: 'Archivage / suppression sur instruction',
        r9d: 'Expiration selon cycle',
        r10a: 'Sauvegardes de serveur',
        r10b: 'Jusqu\'à suppression manuelle (quota)',
        r10c: 'Sur instruction admin',
        r10d: '—',
        infoP1: 'Certaines durées de purge automatique sont en cours de déploiement complet côté infrastructure. Toute demande adressée à',
        infoP2: 'reçoit une réponse dans le délai RGPD applicable (en principe un mois). Certaines données peuvent être conservées si nécessaire au respect d\'une obligation légale ou à la constatation/défense d\'un droit en justice.',
      },
      hebergement: {
        h2: 'Hébergement et transferts internationaux',
        p1a: 'Les données traitées par Kotbo sont hébergées sur des serveurs situés',
        p1Strong: 'en Europe (EEE)',
        p1b: '. Aucun transfert direct hors EEE n\'est effectué par Kotbo, à l\'exception des éléments suivants :',
        li1Strong: 'Discord Inc.',
        li1a: '(États-Unis) :',
        li1b: 'profil Discord soumis aux garanties contractuelles de Discord.',
        li2Strong: 'Sentry',
        li2a: '(si activé) :',
        li2b: "journaux d'erreurs, sous clauses contractuelles types selon la région configurée.",
        li3Strong: 'Cloudflare',
        li3: 'requêtes traitées par son réseau mondial pour la sécurité, selon les garanties applicables.',
        li4Strong: 'YouTube / Twitch',
        li4: 'aucune donnée personnelle de membre transmise.',
        li5Strong: 'jsDelivr / GitHub',
        li5: "moteurs d'IDE chargés à la demande ; les polices de la landing et du dashboard sont auto-hébergées.",
      },
      droits: {
        h2: 'Vos droits au titre du RGPD',
        acces: { title: 'Accès', art: '(art. 15)', body: 'Confirmation du traitement et copie de vos données (export JSON complet, tous serveurs).' },
        rectification: { title: 'Rectification', art: '(art. 16)', body: 'Correction de données inexactes. Le profil Discord se modifie côté Discord.' },
        effacement: { title: 'Effacement', art: '(art. 17)', body: 'Suppression de vos données, dans les limites légales (ex. sanctions nécessaires à la sécurité).' },
        limitation: { title: 'Limitation', art: '(art. 18)', body: 'Suspension temporaire du traitement dans certaines situations.' },
        portabilite: { title: 'Portabilité', art: '(art. 20)', body: 'Réception de vos données dans un format structuré (JSON) pour les traitements fondés sur le consentement ou un contrat.' },
        opposition: { title: 'Opposition', art: '(art. 21)', body: "Opposition à un traitement fondé sur l'intérêt légitime, pour un motif tenant à votre situation." },
        decision: { title: 'Décision automatisée', art: '(art. 22)', body: 'Droit à une intervention humaine et à contester une décision automatisée (voir §4 et §11).' },
        reclamation: { title: 'Réclamation', art: '(art. 77)', body: 'Saisine de la CNIL si vos droits ne sont pas respectés.' },
        infoP1: 'Adressez votre demande à',
        infoP2a: 'en précisant votre identifiant Discord, le serveur concerné et la nature de la demande. Délai de réponse :',
        infoStrong: '30 jours',
        infoP2b: 'prolongeable de 2 mois pour les demandes complexes (avec notification). Pour les traitements dont l\'administrateur est responsable, nous pouvons vous réorienter vers lui ou l\'assister.',
      },
      securite: {
        h2: 'Sécurité des données',
        li1Strong: 'Chiffrement en transit',
        li1: 'communications entre le bot, le dashboard et la base via TLS/HTTPS.',
        li2Strong: 'Isolation par serveur',
        li2: "les données de chaque serveur sont séparées ; un administrateur ne peut pas accéder aux données d'un autre serveur.",
        li3Strong: 'Authentification robuste',
        li3a: 'OAuth2 Authorization Code, sessions serveur révocables, cookie',
        li3Em: 'HttpOnly',
        li3b: ', jetons Discord chiffrés côté serveur, clés API stockées sous forme de hash SHA-256.',
        li4Strong: "Contrôle d'accès granulaire",
        li4: "permissions configurables par l'administrateur pour chaque membre du staff.",
        li5Strong: "Journaux d'audit",
        li5: 'actions administratives horodatées et attribuées.',
        li6Strong: 'Sauvegardes',
        li6: "sauvegardes régulières avec contrôle d'intégrité.",
        p: 'En cas de violation susceptible d\'engendrer un risque pour vos droits et libertés, nous notifions l\'autorité de contrôle compétente dans les 72 heures et, en cas de risque élevé, les personnes concernées dans les meilleurs délais.',
      },
      profilage: {
        h2: 'Profilage & décisions automatisées',
        p1: 'Certains traitements comportent une part d\'automatisation pouvant produire un effet significatif : détection de multi-comptes (§4), liaison automatique de comptes, propagation de blacklist. Pour ces cas :',
        li1a: 'vous avez le droit d\'obtenir une',
        li1Strong: 'intervention humaine',
        li1b: ', d\'exprimer votre point de vue et de',
        li1Strong2: 'contester',
        li1c: 'la décision (art. 22) ;',
        li2: 'la logique générale est décrite au §4 ;',
        li3a: 'une',
        li3Strong: 'analyse d\'impact (AIPD/DPIA)',
        li3b: 'est menée au titre de l\'article 35 en raison du profilage et de la surveillance impliqués.',
      },
      mineurs: {
        h2: 'Mineurs',
        p1a: "Discord est réservé aux personnes d'au moins 13 ans (16 dans certains pays de l'UE). Kotbo s'appuie sur les vérifications d'âge de Discord et ne collecte pas délibérément de données d'enfants de moins de 13 ans. Parents et tuteurs : contactez",
        p1b: 'pour toute suppression.',
      },
      modifications: {
        h2: 'Modifications',
        p1: "Cette politique peut évoluer (nouveaux modules, évolutions réglementaires, changements de pratiques). En cas de modification substantielle, information via le serveur Discord officiel, une notification dans le dashboard et la mise à jour de la date en tête de page. Une politique de confidentialité est un document d'information : sa mise à jour ne vaut pas recueil de consentement. Lorsqu'un traitement requiert un consentement, celui-ci est demandé séparément par un acte positif clair.",
      },
      contact: {
        h2: 'Contact',
        cardLabel1: 'Données personnelles & vie privée',
        cardBody1: 'Précisez votre identifiant Discord, le(s) serveur(s) concerné(s) et la nature de la demande. Réponse sous 30 jours maximum.',
        cardLabel2: 'Contact général',
        authorityStrong: 'Autorité de contrôle :',
        authorityP1: 'vous pouvez saisir la',
        authorityStrong2: 'CNIL',
        authorityAddr: '3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07. Voir aussi les',
        legalLink: 'Mentions légales',
        termsLink: 'CGU',
        mid1: ', les',
        cookiesLink: 'politique cookies',
        mid2: ', la',
        mid3: 'et le',
        dpaLink: 'DPA',
      },
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'Last updated: 20 July 2026 · Kotbo Discord bot and associated Dashboard',
      sections: {
        responsable: 'Controller & roles',
        collecte: 'Data collected',
        messages: 'Message logging',
        verification: 'Anti multi-account verification',
        finalites: 'Purposes & legal bases',
        destinataires: 'Recipients',
        retention: 'Retention period',
        hebergement: 'Hosting & transfers',
        droits: 'Your rights (GDPR)',
        securite: 'Security',
        profilage: 'Profiling & decisions',
        mineurs: 'Minors',
        modifications: 'Changes',
        contact: 'Contact',
      },
      preamble: {
        title: 'For Discord server administrators',
        pre1: 'The administrator determines which modules are enabled and acts as',
        strong1: 'data controller',
        mid1: 'for data specific to their server. Kotbo processes this data as a',
        strong2: 'processor',
        mid2: ', on the administrator\'s instructions (see the',
        link1: 'data processing agreement',
        mid3: '). The administrator must inform their members in accordance with Articles 13 and 14 of the GDPR — a',
        link2: 'model notice',
        mid4: 'is provided. Certain processing activities (global blacklist, security, technical logs), however, fall under Kotbo\'s direct responsibility (see table §1).',
      },
      responsable: {
        h2: 'Data controller & allocation of roles',
        p1a: 'The Kotbo service is published and operated by',
        p1code: '[TO BE COMPLETED: name of the sole trader]',
        p1b: 'a sole proprietorship registered under SIREN number 101 303 535, which acts as the data controller for the processing described in this section.',
        p2: 'The service is designed and developed by:',
        p3a: 'Privacy contact:',
        p3b: '· Full contact details on the',
        p3link: 'Legal Notice',
        p3after: ' page',
        p4: 'Kotbo is a Discord bot for French-speaking communities (staff management, moderation, tickets, statistics, levels, events, applications, economy, general organization). It only operates on servers where it has been explicitly invited.',
        h3_1: 'Who is responsible for what',
        p5a: 'The qualification is not global: it depends on the processing activity. The table below specifies, for each major purpose, whether Kotbo acts as',
        p5Strong1: 'processor',
        p5b: '(on the administrator\'s instructions) or as',
        p5Strong2: 'controller',
        p5c: '(Kotbo alone decides the purpose and means).',
        thTraitement: 'Processing activity',
        thRoleKotbo: "Kotbo's role",
        thResponsable: 'Data controller',
        rowSousTraitant: 'Processor',
        rowResponsable: 'Controller',
        rowAdmin: 'Server administrator',
        row1: 'Member profiles, levels, statistics, staff, tickets, applications, events, economy, backups',
        row2: 'Full message logging (opt-in module)',
        row3: 'Server security / anti multi-account verification',
        row4: 'Administrator account & dashboard authentication',
        row5: 'Global user / server blacklist',
        row6: 'Service-wide security, abuse prevention, cross-server detection',
        row7: 'Technical & error logs, internal metrics',
      },
      collecte: {
        h2: 'Data collected',
        p1a: 'Kotbo only collects the data necessary for the operation of the',
        p1Strong1: 'modules enabled',
        p1b: 'on each server. Each record is linked to the relevant Discord server ID (',
        p1Em: 'Guild ID',
        p1c: '). The table below summarizes',
        p1Strong2: 'what is actually stored in the database',
        p1d: 'by category; it exactly reflects the data returned by our GDPR export tool.',
        h3_1: 'Overview by category',
        thCategorie: 'Category',
        thDonnees: 'Data involved',
        thDeclenche: 'Triggered by',
        r1cat: 'Identity & profile',
        r1data: 'Discord ID, username / global name / display name, avatar, banner, locale, bio, account creation date, server join/leave dates, level & XP, daily statistics, dashboard preferences, layout presets, notifications, global administrator status.',
        r1trigger: 'Interaction with the bot or presence on the server',
        r2cat: 'Security verifications',
        r2data: 'See §4 (IP, device, email, connections, servers, OAuth data, duplicate-account evidence).',
        r2trigger: 'Verification module enabled by the administrator',
        r3cat: 'Moderation & security',
        r3data: 'Sanctions (type, reason, duration, expiry), sanction reports and submitted evidence, linked accounts (multi-accounts), ban appeals and their blacklist, voice sessions and detection samples, suspended inviters, global blacklist.',
        r3trigger: 'Moderation action / security modules',
        r4cat: 'Messages',
        r4data: 'See §3 (full logging of message content).',
        r4trigger: 'Message logging module (disabled by default)',
        r5cat: 'Contributions & content',
        r5data: 'Suggestions and votes, reputation votes between members, custom form submissions, Daily Algo submissions, partnership and recruitment applications (answers, optional email, internal notes, reason for rejection), authored articles.',
        r5trigger: 'Voluntary participation in the relevant modules',
        r6cat: 'Economy & marketplace',
        r6data: 'RPG profiles, battles, fishing catches, RPG guilds, marketplace listings and transactions, ticket satisfaction feedback.',
        r6trigger: 'Use of the economy / RPG / marketplace modules',
        r7cat: 'Engagement',
        r7data: 'Event registrations and participations, quest progress, invites (as member & created), feed and widget subscriptions.',
        r7trigger: 'Participation in engagement modules',
        r8cat: 'Tickets & support',
        r8data: 'Opened tickets (identity, reason, description) and the full HTML transcript of the conversation, satisfaction feedback.',
        r8trigger: 'Opening a ticket',
        r9cat: 'Staff',
        r9data: 'Staff record, ranks and hierarchy, staff activity and voice sessions, evaluations, warnings, staff blacklist, resignations, tasks, staff calls and invitations, reminders, mentoring reports, trial periods, mentoring progress, server links, API keys created.',
        r9trigger: 'Staff role on a server using the module',
        r10cat: 'System',
        r10data: 'Scheduled tasks, notification targets, temporary voice channels, white-label instances, dashboard audit logs, technical error logs, module metrics.',
        r10trigger: 'Internal operation of the service',
        infoBoxa: 'Every user can obtain the exact list of',
        infoBoxStrong: 'all',
        infoBoxb: 'data stored about them, across all servers, via a GDPR export request (see §7) — the internal tool scans the entirety of the tables listed above.',
        h3_2: 'Discord profile data',
        p2: 'Collected automatically when interacting with the bot or through presence on a server using Kotbo: Discord ID (immutable), username / tag / global name / display name, avatar and banner, accent color, locale, public bio, account creation date, server join and leave timestamps.',
        h3_3: 'Activity, statistics and level data',
        p3: 'Feeds the statistics, levels/XP and staff activity tracking modules:',
        thDonnee: 'Data',
        thTable: 'Table',
        thFinalite: 'Purpose',
        t1donnee: 'Number of messages sent (per day, per channel) —',
        t1Strong: 'counters only, without the content',
        t1finalite: 'Server statistics, levels/XP',
        t2donnee: 'Time spent in voice (minutes)',
        t2finalite: 'Statistics, levels, staff activity',
        t3donnee: 'Reactions, threads created, replies',
        t3finalite: 'Detailed statistics',
        t4donnee: 'XP points, level, season snapshots',
        t4finalite: 'Per-server level system',
        t5donnee: 'Last activity (last message, last presence)',
        t5finalite: 'Member profile, staff activity management',
        t6donnee: 'Dashboard command usage, interface preferences',
        t6finalite: 'Dashboard operation and customization',
        info2Strong: 'Important:',
        info2a: 'the statistics above are',
        info2Strong2: 'aggregated counters',
        info2b: 'and do not contain message text. Retention of the full message content is handled by a separate, opt-in module described in',
        info2link: '§3',
        h3_4: 'Moderation, sanctions & server security',
        m1: 'Identity of the sanctioned user and the moderator, type of sanction (warning, kick, timeout, temporary/permanent ban, softban), reason, duration, expiry, status, resolution notes.',
        m2: 'Sanction reports: description of the incident, rules broken, links and evidence files submitted.',
        m3Strong: 'Linked accounts',
        m3: '(multi-accounts): association of two Discord IDs and supporting evidence metadata (see §4).',
        m4: 'Ban appeals and appeal blacklist: appeal content, decision, status.',
        m5: 'Behavioral detection: voice sessions and detection samples, suspended inviters.',
        m6Strong: 'Global blacklist',
        m6: ': IDs of users banned from Kotbo service-wide, with reason (processing for which Kotbo is the controller).',
        h3_5: 'Personnel data (Staff module)',
        p5: 'Only for members holding a Staff role on a server using the module: rank and history, internal warnings, staff blacklist, trial/mentoring periods and mentor reports, absences, meeting attendance, confidential notes, staff poll votes, resignations, tasks, staff calls, reminders, evaluations, API keys created by staff (stored as hashes).',
        h3_6: 'Contributions, events & economy',
        c1Strong: 'Applications',
        c1: '(recruitment, partnership): Discord identity, email if requested by the form, form answers (JSON), staff internal notes, outcome, reason for rejection, re-application cooldown.',
        c2Strong: 'Tickets',
        c2: ': identity, reason, description and the full HTML transcript — may contain any message exchanged with staff.',
        c3Strong: 'Events (quizzes, CTFs)',
        c3: ': identity, score, answers/resolutions, timestamps.',
        c4Strong: 'Suggestions, reputation, forms, Daily Algo, articles',
        c4: ': content submitted and voter IDs where applicable.',
        c5Strong: 'Economy / RPG / marketplace',
        c5: ': game profiles, battles, fishing, guilds, listings and transactions.',
        c6Strong: 'Engagement',
        c6: ': event participation, quests, invites, feed and widget subscriptions.',
        h3_7: 'Dashboard authentication & audit',
        p7a: 'Dashboard access uses Discord OAuth2 (Authorization Code). Discord tokens are encrypted in a temporary server-side session; the browser only receives a random session identifier in a secure',
        p7Em: 'HttpOnly',
        p7b: 'cookie, never exposed to JavaScript storage. Administrative actions are logged in an',
        p7Strong: 'audit log',
        p7c: '(user ID, action, module, timestamp). Cookie details are in the',
        p7link: 'cookie policy',
        h3_8: 'Server backups',
        p8: 'The backup module can store a snapshot of the server (roles, channels, permissions, emojis, stickers); depending on the administrator\'s configuration, member data may be included. Each server is subject to a storage quota.',
        h3_9: 'Global technical data',
        e1Strong: 'Error logs',
        e1: ': error message, stack trace, source. May incidentally contain identifiers.',
        e2Strong: 'Module metrics',
        e2: ': activation, usage and performance counters — aggregated, with no direct personal identifier.',
        h3_10: 'Visitors of kotbo.fr',
        v1: 'The site measures its audience without cookies and without third-party tools. At each step, it sends the Kotbo API what was reached (visit, pricing read, playable area tried, click on “Add Kotbo”), where the click happened, the referrer category (search engine, Discord, direct: never the full address) and a random identifier tied to the browser tab.',
        v2: "Purpose: understand what gets read and what leads to an installation. Legal basis: Kotbo's legitimate interest (Art. 6(1)(f) GDPR), within the consent exemption the CNIL sets for audience measurement. The IP address is not recorded. The visit identifier is erased after 30 days and is never linked to a Discord account or a server. Events are deleted after 13 months.",
        v3: 'The community icons shown on the home page are served by the Kotbo API: your browser does not contact Discord.',
        v4a: 'Do Not Track and Global Privacy Control switch measurement off. You can also refuse it on the',
        v4link: 'cookies page',
      },
      messages: {
        h2: 'Full message logging',
        warnTitle: 'Sensitive module, disabled by default',
        warnP1a: 'This module is',
        warnStrong1: 'never active automatically',
        warnP1b: '. An administrator must explicitly enable it for their server. When active, Kotbo records the',
        warnStrong2: 'full content of messages',
        warnP1c: 'in the relevant channels in order to provide global search across history, similar to Discord search.',
        h3_1: 'Data recorded',
        p1: 'For each message in a tracked channel, the',
        p1code: 'MessageLog',
        p1b: 'table stores:',
        li1Strong: 'full text content',
        li1a: 'the',
        li1b: 'of the message;',
        li2Strong: 'attachments',
        li2a: 'the',
        li2b: '(name, URL, type) and the number of embeds;',
        li3: 'the author (ID, display name, avatar) and whether it is a bot;',
        li4a: 'the',
        li4Strong1: 'mentions',
        li4b: '(mentioned users) and the',
        li4Strong2: 'reply relationship',
        li4c: '(author of the message being replied to);',
        li5: 'the channel (ID and name) and the server;',
        li6a: 'the',
        li6Strong: 'creation, edit and deletion',
        li6b: 'timestamps of the message.',
        p2: 'The administrator can exclude certain channels from logging. Direct messages (DMs) are never logged.',
        h3_2: 'Retention',
        p3a: 'Messages are automatically purged after a',
        p3Strong: 'retention period configured by the administrator',
        p3b: '(90 days by default), capped by Kotbo. Automatic purging runs daily. Content is also deleted when the module is disabled or when the bot leaves the server.',
        h3_3: 'Legal basis & responsibilities',
        p4a: 'This processing relies on the administrator\'s',
        p4Strong: 'legitimate interest',
        p4b: '(Art. 6.1.f GDPR) in moderating and analyzing the activity of their community. Given its intrusive nature, the administrator who enables it must: clearly inform their members beforehand, restrict access to authorized persons, and set a proportionate retention period. Kotbo acts here as a processor.',
      },
      verification: {
        h2: 'Security verification & multi-account detection',
        p1a: 'At an administrator\'s request, a member may be asked to complete a verification via a dedicated Discord OAuth2 connection. The aim is to detect the circumvention of sanctions through the creation of multiple accounts ("alt accounts"). The data collected depends on the',
        p1Strong: 'verification level',
        p1b: 'chosen by the administrator.',
        h3_1: 'OAuth data requested per level',
        thNiveau: 'Level',
        thScopes: 'OAuth permissions (scopes)',
        thDonnees: 'Data retrieved',
        rowFaible: 'Low',
        rowFaibleData: 'Basic Discord identity',
        rowMoyen: 'Medium',
        rowMoyenData: '+ Discord email address',
        rowEleve: 'High',
        rowEleveData: '+ linked connections (Steam, Xbox…), server list, server membership',
        h3_2before: 'Data stored (table',
        h3_2after: ')',
        li1Strong1: 'IP address',
        li1mid: 'and',
        li1Strong2: 'device information',
        li1end: '(browser / system);',
        li2Strong: 'Discord email address',
        li2end: '(medium and high levels);',
        li3Strong1: 'Connections',
        li3mid: 'and',
        li3Strong2: 'server list',
        li3end: 'on Discord (high level);',
        li4a: 'the',
        li4Strong: 'raw OAuth response',
        li4b: 'returned by Discord;',
        li5a: 'the authenticated account ID and the',
        li5Strong: 'detection result',
        li5b: '(duplicate detected, presumed linked account, supporting evidence).',
        h3_3: 'Detection logic & consequences',
        p2: 'Kotbo compares the elements above (IP, device, email, connections, behavior) with those of other accounts on the server to identify a suspicious match. Depending on configuration, the result may trigger:',
        d1Strong: 'staff alert',
        d1a: 'a',
        d1code: 'NOTIFY_STAFF',
        d1b: 'for a human decision;',
        d2Strong: 'automatic linking',
        d2a: 'an',
        d2b: 'of two accounts (',
        d2code: 'AUTO_LINK',
        d2c: ') when a strong inconsistency is detected;',
        d3a: 'a',
        d3Em: '"flagged"',
        d3b: 'status that may lead to a denial of access or a sanction decided by the server\'s staff.',
        h3_4: 'Access, retention & dispute',
        a1Strong: 'Who has access:',
        a1: 'the authorized staff of the server concerned and, for maintenance purposes, the Kotbo team (minimal access, subject to confidentiality).',
        a2Strong: 'Duration:',
        a2: 'unfinished verifications (pending / expired) are purged in the short term; evidence from a detection is retained for as long as necessary for the server\'s security, then deleted (see matrix §7).',
        a3Strong1: 'Automated decision:',
        a3a: 'an automatic linking or denial may have a significant effect; you may request a',
        a3Strong2: 'human intervention',
        a3b: ', express your point of view and',
        a3Strong3: 'contest',
        a3c: 'the outcome (see §11).',
        a4Strong: 'How to contest:',
        a4a: 'with the server\'s staff, or via',
        a4b: 'for processing that falls under Kotbo\'s responsibility.',
        infoBox: 'The combination of IP + device + activity + potential decisions is the subject of a data protection impact assessment (DPIA) under Article 35 of the GDPR.',
      },
      finalites: {
        h2: 'Purposes and legal bases',
        p1: 'In accordance with Article 6 of the GDPR, each processing activity relies on one of the following legal bases:',
        thFinalite: 'Purpose',
        thBase: 'Legal basis (Art. 6)',
        r1a: 'Moderation and sanctions within a server',
        r1b: "Administrator's legitimate interest (6.1.f)",
        r2a: 'Management of staff personnel (ranks, absences, activity)',
        r2b: 'Legitimate interest / community engagement (6.1.b and 6.1.f)',
        r3a: 'Levels, activity statistics',
        r3b: 'Legitimate interest (6.1.f)',
        r4a: 'Full message logging (§3)',
        r4b: "Administrator's legitimate interest (6.1.f), subject to prior notice to members",
        r5a: 'Support tickets',
        r5b: 'Legitimate interest (6.1.f)',
        r6a: 'Staff / partnership applications',
        r6b: 'Legitimate interest (6.1.f). Separate consent for any retention in a talent pool beyond the current recruitment process.',
        r7a: 'Anti multi-account verification & security (§4)',
        r7b: "Legitimate interest in protecting the server's and the service's integrity (6.1.f)",
        r8a: 'Global blacklist, service-wide security',
        r8b: "Kotbo's legitimate interest (6.1.f)",
        r9a: 'Technical error logging',
        r9b: 'Legitimate interest in maintaining the service (6.1.f)',
        r10a: 'Events, quizzes, CTFs, economy, engagement',
        r10b: 'Legitimate interest linked to voluntary participation (6.1.f)',
        r11a: 'Server backups',
        r11b: "Administrator's legitimate interest (6.1.f)",
        infoStrong: 'Legitimate interest:',
        info: 'for each processing activity based on Article 6.1.f, a balancing test is carried out (necessity, minimization, the reasonable expectations of individuals in the context of a Discord community, security measures). You may object for reasons relating to your particular situation (§9).',
      },
      destinataires: {
        h2: 'Data recipients',
        h3_1: 'Within each server',
        li1Strong: 'administrators and moderators',
        li1a: 'The',
        li1b: '— via the dashboard — access their server\'s data (moderation, profiles, statistics, tickets, applications, staff, message logs if enabled).',
        li2Strong: 'staff',
        li2a: 'The',
        li2b: 'access all or part of this data depending on the permissions configured.',
        li3Strong: 'members',
        li3a: 'The',
        li3b: 'access their own data (level, public profile, event results).',
        h3_2: 'The Kotbo team',
        p2: 'Developers access data for maintenance, debugging and support: access restricted to the minimum necessary and subject to confidentiality.',
        h3_3: 'Processors & third-party services',
        thService: 'Service',
        thRole: 'Role',
        thDonneesTransmises: 'Data transmitted',
        s1role: 'Host platform and data source',
        s1data: "Discord profile data (per Discord's Terms of Service)",
        s2role: 'Storage and backups',
        s2dataBefore: 'All database data — see',
        s2link: 'DPA',
        s3role: 'Network, caching, abuse prevention',
        s3data: 'IP address, HTTP headers, security events',
        s4role: 'Error monitoring',
        s4data: 'Stack traces and context (may contain metadata)',
        s5role: 'Content tracking (modules)',
        s5data: 'Channel / streamer IDs only — no personal member data',
        s6role: 'Translation (module)',
        s6data: 'Content to be translated — self-hosted by default',
        s7role: "On-demand loading of the code editor's engines",
        s7data: 'IP and technical headers, only when the IDE is opened',
        p3: 'Kotbo does not sell, rent, or share your data for commercial or advertising purposes.',
      },
      retention: {
        h2: 'Retention period',
        p1a: 'The periods below specify retention under normal operation, after a module is disabled or the bot leaves, and in backups. Where a period depends on an administrator setting, a',
        p1Strong: 'cap',
        p1b: 'is imposed by Kotbo.',
        thDonnee: 'Data',
        thActive: 'Active retention',
        thApres: 'After deactivation / departure',
        thSauvegardes: 'Backups',
        r1a: 'Message logs (§3)',
        r1b: 'Configured period (default 90 days, capped)',
        r1c: 'Purged on deactivation or bot departure',
        r1d: 'Short-term expiry',
        r2a: 'Pending / expired verifications (§4)',
        r2b: 'Up to 7 days after expiry',
        r2c: 'Immediate',
        r2d: 'Not durably retained',
        r3a: 'Finalized multi-account detection evidence (§4)',
        r3b: "Period necessary for the server's security, capped",
        r3c: 'Purged after that period',
        r3d: 'Short expiry',
        r4a: 'Rejected applications',
        r4b: 'Re-application cooldown, then deletion (unless retained in a consented talent pool)',
        r4c: "On administrator's instruction",
        r4d: 'Short expiry',
        r5a: 'Tickets & transcripts',
        r5b: 'Configured / capped period',
        r5c: "On administrator's instruction or valid request",
        r5d: 'Short expiry',
        r6a: 'Dashboard audit logs',
        r6b: '90 days',
        r6c: 'Automatic',
        r6d: 'Short expiry',
        r7a: 'Technical error logs',
        r7b: '30 to 90 days',
        r7c: 'Automatic',
        r7d: 'Short expiry',
        r8a: 'Member profile, levels, statistics',
        r8b: "Lifetime of the server on Kotbo",
        r8c: "Purged on bot departure or on request",
        r8d: 'Expiry follows cycle',
        r9a: 'Sanctions & moderation data',
        r9b: 'Lifetime of the server (necessary for security)',
        r9c: "Archived / deleted on instruction",
        r9d: 'Expiry follows cycle',
        r10a: 'Server backups',
        r10b: 'Until manually deleted (quota)',
        r10c: "On administrator's instruction",
        r10d: '—',
        infoP1: 'Certain automatic purge periods are still being fully rolled out at the infrastructure level. Any request sent to',
        infoP2: 'receives a response within the applicable GDPR deadline (in principle one month). Certain data may be retained where necessary to comply with a legal obligation or to establish/defend a legal claim.',
      },
      hebergement: {
        h2: 'Hosting and international transfers',
        p1a: 'Data processed by Kotbo is hosted on servers located',
        p1Strong: 'within Europe (EEA)',
        p1b: '. No direct transfer outside the EEA is made by Kotbo, with the exception of the following:',
        li1Strong: 'Discord Inc.',
        li1a: '(United States):',
        li1b: "Discord profile, subject to Discord's contractual safeguards.",
        li2Strong: 'Sentry',
        li2a: '(if enabled):',
        li2b: 'error logs, under standard contractual clauses depending on the configured region.',
        li3Strong: 'Cloudflare',
        li3: 'requests processed by its global network for security purposes, under applicable safeguards.',
        li4Strong: 'YouTube / Twitch',
        li4: 'no personal member data transmitted.',
        li5Strong: 'jsDelivr / GitHub',
        li5: "IDE engines loaded on demand; the landing page and dashboard fonts are self-hosted.",
      },
      droits: {
        h2: 'Your rights under the GDPR',
        acces: { title: 'Access', art: '(Art. 15)', body: 'Confirmation of processing and a copy of your data (full JSON export, all servers).' },
        rectification: { title: 'Rectification', art: '(Art. 16)', body: 'Correction of inaccurate data. The Discord profile is edited on Discord itself.' },
        effacement: { title: 'Erasure', art: '(Art. 17)', body: 'Deletion of your data, within legal limits (e.g. sanctions necessary for security).' },
        limitation: { title: 'Restriction', art: '(Art. 18)', body: 'Temporary suspension of processing in certain situations.' },
        portabilite: { title: 'Portability', art: '(Art. 20)', body: 'Receiving your data in a structured format (JSON) for processing based on consent or a contract.' },
        opposition: { title: 'Objection', art: '(Art. 21)', body: 'Objecting to processing based on legitimate interest, for reasons relating to your situation.' },
        decision: { title: 'Automated decision-making', art: '(Art. 22)', body: 'Right to human intervention and to contest an automated decision (see §4 and §11).' },
        reclamation: { title: 'Complaint', art: '(Art. 77)', body: 'Lodging a complaint with the CNIL if your rights are not respected.' },
        infoP1: 'Send your request to',
        infoP2a: 'specifying your Discord ID, the server concerned and the nature of the request. Response time:',
        infoStrong: '30 days',
        infoP2b: 'extendable by 2 months for complex requests (with notification). For processing for which the administrator is the controller, we may redirect you to them or assist them.',
      },
      securite: {
        h2: 'Data security',
        li1Strong: 'Encryption in transit',
        li1: 'communications between the bot, the dashboard and the database via TLS/HTTPS.',
        li2Strong: 'Per-server isolation',
        li2: 'each server\'s data is kept separate; an administrator cannot access another server\'s data.',
        li3Strong: 'Robust authentication',
        li3a: 'OAuth2 Authorization Code, revocable server-side sessions, cookie',
        li3Em: 'HttpOnly',
        li3b: ', Discord tokens encrypted server-side, API keys stored as SHA-256 hashes.',
        li4Strong: 'Granular access control',
        li4: "permissions configurable by the administrator for each staff member.",
        li5Strong: 'Audit logs',
        li5: 'timestamped and attributed administrative actions.',
        li6Strong: 'Backups',
        li6: 'regular backups with integrity checks.',
        p: 'In the event of a breach likely to result in a risk to your rights and freedoms, we notify the competent supervisory authority within 72 hours and, in the event of a high risk, the individuals concerned as soon as possible.',
      },
      profilage: {
        h2: 'Profiling & automated decisions',
        p1: 'Certain processing activities involve a degree of automation that can produce a significant effect: multi-account detection (§4), automatic account linking, blacklist propagation. In these cases:',
        li1a: 'you have the right to obtain',
        li1Strong: 'human intervention',
        li1b: ', to express your point of view, and to',
        li1Strong2: 'contest',
        li1c: 'the decision (Art. 22);',
        li2: 'the general logic is described in §4;',
        li3a: 'a',
        li3Strong: 'data protection impact assessment (DPIA)',
        li3b: 'is carried out under Article 35 because of the profiling and monitoring involved.',
      },
      mineurs: {
        h2: 'Minors',
        p1a: "Discord is restricted to individuals aged 13 or over (16 in certain EU countries). Kotbo relies on Discord's age verification and does not knowingly collect data from children under 13. Parents and guardians: contact",
        p1b: 'for any deletion request.',
      },
      modifications: {
        h2: 'Changes',
        p1: 'This policy may evolve (new modules, regulatory changes, changes in practice). In the event of a material amendment, notice will be given via the official Discord server, a notification in the dashboard, and the date at the top of the page will be updated. A privacy policy is an informational document: updating it does not constitute obtaining consent. Where processing requires consent, it is requested separately through a clear affirmative act.',
      },
      contact: {
        h2: 'Contact',
        cardLabel1: 'Personal data & privacy',
        cardBody1: 'Please specify your Discord ID, the server(s) concerned and the nature of the request. Response within 30 days maximum.',
        cardLabel2: 'General contact',
        authorityStrong: 'Supervisory authority:',
        authorityP1: 'you may lodge a complaint with the',
        authorityStrong2: 'CNIL',
        authorityAddr: '(the French data protection authority) — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07. See also the',
        legalLink: 'Legal Notice',
        termsLink: 'Terms of Use',
        mid1: ', the',
        cookiesLink: 'cookie policy',
        mid2: ', the',
        mid3: 'and the',
        dpaLink: 'DPA',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);

  const sections = $derived([
    { id: 'responsable',   label: t.sections.responsable },
    { id: 'collecte',      label: t.sections.collecte },
    { id: 'messages',      label: t.sections.messages },
    { id: 'verification',  label: t.sections.verification },
    { id: 'finalites',     label: t.sections.finalites },
    { id: 'destinataires', label: t.sections.destinataires },
    { id: 'retention',     label: t.sections.retention },
    { id: 'hebergement',   label: t.sections.hebergement },
    { id: 'droits',        label: t.sections.droits },
    { id: 'securite',      label: t.sections.securite },
    { id: 'profilage',     label: t.sections.profilage },
    { id: 'mineurs',       label: t.sections.mineurs },
    { id: 'modifications', label: t.sections.modifications },
    { id: 'contact',       label: t.sections.contact },
  ]);
</script>

<svelte:head>
  <title>Politique de Confidentialité | Kotbo</title>
  <meta name="description" content="Politique de confidentialité et protection des données personnelles du bot Discord Kotbo : données collectées, journalisation des messages, vérification de sécurité, durées de conservation et droits RGPD." />
  <meta name="robots" content="index, follow" />
</svelte:head>

<LegalPageLayout
  title={t.title}
  subtitle={t.subtitle}
  {sections}
  activePage="privacy"
>
  <!-- Préambule -->
  <div class="info-box warn mb-10">
    <p class="font-bold mb-1">{t.preamble.title}</p>
    <p class="mb-0">
      {t.preamble.pre1} <strong>{t.preamble.strong1}</strong> {t.preamble.mid1} <strong>{t.preamble.strong2}</strong>{t.preamble.mid2}
      <a href="{base}/dpa">{t.preamble.link1}</a>{t.preamble.mid3}
      <a href="{base}/admin-notice">{t.preamble.link2}</a> {t.preamble.mid4}
    </p>
  </div>

  <!-- Section 1 -->
  <section id="responsable" class="policy-section">
    <div class="section-badge">01</div>
    <h2>{t.responsable.h2}</h2>
    <p>
      {t.responsable.p1a} <code>{t.responsable.p1code}</code>, {t.responsable.p1b}
    </p>
    <p>{t.responsable.p2}</p>
    <ul>
      <li><strong>Elouan Passereau</strong> — <a href="https://klaynight.fr/" target="_blank" rel="noopener noreferrer">klaynight.fr</a></li>
      <li><strong>Nathan Rontey</strong> — <a href="https://nathaan.me/" target="_blank" rel="noopener noreferrer">nathaan.me</a></li>
    </ul>
    <p>{t.responsable.p3a} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a> {t.responsable.p3b} <a href="{base}/mentions-legales">{t.responsable.p3link}</a>{t.responsable.p3after}.</p>
    <p>
      {t.responsable.p4}
    </p>

    <h3>1.1 {t.responsable.h3_1}</h3>
    <p>
      {t.responsable.p5a} <strong>{t.responsable.p5Strong1}</strong> {t.responsable.p5b} <strong>{t.responsable.p5Strong2}</strong> {t.responsable.p5c}
    </p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.responsable.thTraitement}</th><th>{t.responsable.thRoleKotbo}</th><th>{t.responsable.thResponsable}</th></tr></thead>
        <tbody>
          <tr><td>{t.responsable.row1}</td><td>{t.responsable.rowSousTraitant}</td><td>{t.responsable.rowAdmin}</td></tr>
          <tr><td>{t.responsable.row2}</td><td>{t.responsable.rowSousTraitant}</td><td>{t.responsable.rowAdmin}</td></tr>
          <tr><td>{t.responsable.row3}</td><td>{t.responsable.rowSousTraitant}</td><td>{t.responsable.rowAdmin}</td></tr>
          <tr><td>{t.responsable.row4}</td><td>{t.responsable.rowResponsable}</td><td>Kotbo</td></tr>
          <tr><td>{t.responsable.row5}</td><td>{t.responsable.rowResponsable}</td><td>Kotbo</td></tr>
          <tr><td>{t.responsable.row6}</td><td>{t.responsable.rowResponsable}</td><td>Kotbo</td></tr>
          <tr><td>{t.responsable.row7}</td><td>{t.responsable.rowResponsable}</td><td>Kotbo</td></tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Section 2 -->
  <section id="collecte" class="policy-section">
    <div class="section-badge">02</div>
    <h2>{t.collecte.h2}</h2>
    <p>
      {t.collecte.p1a} <strong>{t.collecte.p1Strong1}</strong> {t.collecte.p1b}<em>{t.collecte.p1Em}</em>{t.collecte.p1c} <strong>{t.collecte.p1Strong2}</strong> {t.collecte.p1d}
    </p>

    <h3>2.1 {t.collecte.h3_1}</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.collecte.thCategorie}</th><th>{t.collecte.thDonnees}</th><th>{t.collecte.thDeclenche}</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>{t.collecte.r1cat}</strong></td>
            <td>{t.collecte.r1data}</td>
            <td>{t.collecte.r1trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r2cat}</strong></td>
            <td>{t.collecte.r2data}</td>
            <td>{t.collecte.r2trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r3cat}</strong></td>
            <td>{t.collecte.r3data}</td>
            <td>{t.collecte.r3trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r4cat}</strong></td>
            <td>{t.collecte.r4data}</td>
            <td>{t.collecte.r4trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r5cat}</strong></td>
            <td>{t.collecte.r5data}</td>
            <td>{t.collecte.r5trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r6cat}</strong></td>
            <td>{t.collecte.r6data}</td>
            <td>{t.collecte.r6trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r7cat}</strong></td>
            <td>{t.collecte.r7data}</td>
            <td>{t.collecte.r7trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r8cat}</strong></td>
            <td>{t.collecte.r8data}</td>
            <td>{t.collecte.r8trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r9cat}</strong></td>
            <td>{t.collecte.r9data}</td>
            <td>{t.collecte.r9trigger}</td>
          </tr>
          <tr>
            <td><strong>{t.collecte.r10cat}</strong></td>
            <td>{t.collecte.r10data}</td>
            <td>{t.collecte.r10trigger}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="info-box">
      {t.collecte.infoBoxa} <strong>{t.collecte.infoBoxStrong}</strong> {t.collecte.infoBoxb}
    </div>

    <h3>2.2 {t.collecte.h3_2}</h3>
    <p>{t.collecte.p2}</p>

    <h3>2.3 {t.collecte.h3_3}</h3>
    <p>{t.collecte.p3}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.collecte.thDonnee}</th><th>{t.collecte.thTable}</th><th>{t.collecte.thFinalite}</th></tr></thead>
        <tbody>
          <tr><td>{t.collecte.t1donnee} <strong>{t.collecte.t1Strong}</strong></td><td><code>MemberDailyStat</code></td><td>{t.collecte.t1finalite}</td></tr>
          <tr><td>{t.collecte.t2donnee}</td><td><code>MemberDailyStat</code>, <code>StaffVoiceSession</code></td><td>{t.collecte.t2finalite}</td></tr>
          <tr><td>{t.collecte.t3donnee}</td><td><code>MemberDailyStat</code></td><td>{t.collecte.t3finalite}</td></tr>
          <tr><td>{t.collecte.t4donnee}</td><td><code>MemberLevel</code>, <code>SeasonSnapshot</code></td><td>{t.collecte.t4finalite}</td></tr>
          <tr><td>{t.collecte.t5donnee}</td><td><code>MemberProfile</code></td><td>{t.collecte.t5finalite}</td></tr>
          <tr><td>{t.collecte.t6donnee}</td><td><code>DashboardCommandUsage</code>, <code>DashboardUserSettings</code></td><td>{t.collecte.t6finalite}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="info-box">
      <strong>{t.collecte.info2Strong}</strong> {t.collecte.info2a} <strong>{t.collecte.info2Strong2}</strong> {t.collecte.info2b} <a href="#messages">{t.collecte.info2link}</a>.
    </div>

    <h3>2.4 {t.collecte.h3_4}</h3>
    <ul>
      <li>{t.collecte.m1}</li>
      <li>{t.collecte.m2}</li>
      <li><strong>{t.collecte.m3Strong}</strong> {t.collecte.m3}</li>
      <li>{t.collecte.m4}</li>
      <li>{t.collecte.m5}</li>
      <li><strong>{t.collecte.m6Strong}</strong>{t.collecte.m6}</li>
    </ul>

    <h3>2.5 {t.collecte.h3_5}</h3>
    <p>{t.collecte.p5}</p>

    <h3>2.6 {t.collecte.h3_6}</h3>
    <ul>
      <li><strong>{t.collecte.c1Strong}</strong> {t.collecte.c1}</li>
      <li><strong>{t.collecte.c2Strong}</strong>{t.collecte.c2}</li>
      <li><strong>{t.collecte.c3Strong}</strong>{t.collecte.c3}</li>
      <li><strong>{t.collecte.c4Strong}</strong>{t.collecte.c4}</li>
      <li><strong>{t.collecte.c5Strong}</strong>{t.collecte.c5}</li>
      <li><strong>{t.collecte.c6Strong}</strong>{t.collecte.c6}</li>
    </ul>

    <h3>2.7 {t.collecte.h3_7}</h3>
    <p>
      {t.collecte.p7a} <em>{t.collecte.p7Em}</em>{t.collecte.p7b} <strong>{t.collecte.p7Strong}</strong> {t.collecte.p7c}
      <a href="{base}/cookies">{t.collecte.p7link}</a>.
    </p>

    <h3>2.8 {t.collecte.h3_8}</h3>
    <p>{t.collecte.p8}</p>

    <h3>2.9 {t.collecte.h3_9}</h3>
    <ul>
      <li><strong>{t.collecte.e1Strong}</strong> (<code>BotErrorLog</code>){t.collecte.e1}</li>
      <li><strong>{t.collecte.e2Strong}</strong>{t.collecte.e2}</li>
    </ul>

    <h3 id="visiteurs">2.10 {t.collecte.h3_10}</h3>
    <p>{t.collecte.v1}</p>
    <p>{t.collecte.v2}</p>
    <p>{t.collecte.v3}</p>
    <p>{t.collecte.v4a} <a href="{base}/cookies">{t.collecte.v4link}</a>.</p>
  </section>

  <!-- Section 3 : Journalisation complète des messages -->
  <section id="messages" class="policy-section">
    <div class="section-badge">03</div>
    <h2>{t.messages.h2}</h2>
    <div class="info-box warn">
      <p class="font-bold mb-1">{t.messages.warnTitle}</p>
      <p class="mb-0">
        {t.messages.warnP1a} <strong>{t.messages.warnStrong1}</strong>{t.messages.warnP1b} <strong>{t.messages.warnStrong2}</strong> {t.messages.warnP1c}
      </p>
    </div>
    <h3>3.1 {t.messages.h3_1}</h3>
    <p>{t.messages.p1} <code>{t.messages.p1code}</code> {t.messages.p1b}</p>
    <ul>
      <li>{t.messages.li1a} <strong>{t.messages.li1Strong}</strong> {t.messages.li1b}</li>
      <li>{t.messages.li2a} <strong>{t.messages.li2Strong}</strong> {t.messages.li2b}</li>
      <li>{t.messages.li3}</li>
      <li>{t.messages.li4a} <strong>{t.messages.li4Strong1}</strong> {t.messages.li4b} <strong>{t.messages.li4Strong2}</strong> {t.messages.li4c}</li>
      <li>{t.messages.li5}</li>
      <li>{t.messages.li6a} <strong>{t.messages.li6Strong}</strong> {t.messages.li6b}</li>
    </ul>
    <p>
      {t.messages.p2}
    </p>
    <h3>3.2 {t.messages.h3_2}</h3>
    <p>
      {t.messages.p3a} <strong>{t.messages.p3Strong}</strong> {t.messages.p3b}
    </p>
    <h3>3.3 {t.messages.h3_3}</h3>
    <p>
      {t.messages.p4a}<strong>{t.messages.p4Strong}</strong> {t.messages.p4b}
    </p>
  </section>

  <!-- Section 4 : Vérification anti multi-comptes -->
  <section id="verification" class="policy-section">
    <div class="section-badge">04</div>
    <h2>{t.verification.h2}</h2>
    <p>
      {t.verification.p1a} <strong>{t.verification.p1Strong}</strong> {t.verification.p1b}
    </p>
    <h3>4.1 {t.verification.h3_1}</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.verification.thNiveau}</th><th>{t.verification.thScopes}</th><th>{t.verification.thDonnees}</th></tr></thead>
        <tbody>
          <tr><td><strong>{t.verification.rowFaible}</strong></td><td><code>identify</code></td><td>{t.verification.rowFaibleData}</td></tr>
          <tr><td><strong>{t.verification.rowMoyen}</strong></td><td><code>identify email</code></td><td>{t.verification.rowMoyenData}</td></tr>
          <tr><td><strong>{t.verification.rowEleve}</strong></td><td><code>identify email connections guilds guilds.members.read</code></td><td>{t.verification.rowEleveData}</td></tr>
        </tbody>
      </table>
    </div>
    <h3>4.2 {t.verification.h3_2before} <code>SecurityVerification</code>{t.verification.h3_2after}</h3>
    <ul>
      <li><strong>{t.verification.li1Strong1}</strong> {t.verification.li1mid} <strong>{t.verification.li1Strong2}</strong> {t.verification.li1end}</li>
      <li><strong>{t.verification.li2Strong}</strong> {t.verification.li2end}</li>
      <li><strong>{t.verification.li3Strong1}</strong> {t.verification.li3mid} <strong>{t.verification.li3Strong2}</strong> {t.verification.li3end}</li>
      <li>{t.verification.li4a} <strong>{t.verification.li4Strong}</strong> {t.verification.li4b}</li>
      <li>{t.verification.li5a} <strong>{t.verification.li5Strong}</strong> {t.verification.li5b}</li>
    </ul>
    <h3>4.3 {t.verification.h3_3}</h3>
    <p>
      {t.verification.p2}
    </p>
    <ul>
      <li>{t.verification.d1a} <strong>{t.verification.d1Strong}</strong> (<code>{t.verification.d1code}</code>) {t.verification.d1b}</li>
      <li>{t.verification.d2a} <strong>{t.verification.d2Strong}</strong> {t.verification.d2b}<code>{t.verification.d2code}</code>{t.verification.d2c}</li>
      <li>{t.verification.d3a} <em>{t.verification.d3Em}</em> {t.verification.d3b}</li>
    </ul>
    <h3>4.4 {t.verification.h3_4}</h3>
    <ul>
      <li><strong>{t.verification.a1Strong}</strong> {t.verification.a1}</li>
      <li><strong>{t.verification.a2Strong}</strong> {t.verification.a2}</li>
      <li><strong>{t.verification.a3Strong1}</strong> {t.verification.a3a} <strong>{t.verification.a3Strong2}</strong>{t.verification.a3b} <strong>{t.verification.a3Strong3}</strong> {t.verification.a3c}</li>
      <li><strong>{t.verification.a4Strong}</strong> {t.verification.a4a} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a> {t.verification.a4b}</li>
    </ul>
    <div class="info-box">
      {t.verification.infoBox}
    </div>
  </section>

  <!-- Section 5 -->
  <section id="finalites" class="policy-section">
    <div class="section-badge">05</div>
    <h2>{t.finalites.h2}</h2>
    <p>{t.finalites.p1}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.finalites.thFinalite}</th><th>{t.finalites.thBase}</th></tr></thead>
        <tbody>
          <tr><td>{t.finalites.r1a}</td><td>{t.finalites.r1b}</td></tr>
          <tr><td>{t.finalites.r2a}</td><td>{t.finalites.r2b}</td></tr>
          <tr><td>{t.finalites.r3a}</td><td>{t.finalites.r3b}</td></tr>
          <tr><td>{t.finalites.r4a}</td><td>{t.finalites.r4b}</td></tr>
          <tr><td>{t.finalites.r5a}</td><td>{t.finalites.r5b}</td></tr>
          <tr><td>{t.finalites.r6a}</td><td>{t.finalites.r6b}</td></tr>
          <tr><td>{t.finalites.r7a}</td><td>{t.finalites.r7b}</td></tr>
          <tr><td>{t.finalites.r8a}</td><td>{t.finalites.r8b}</td></tr>
          <tr><td>{t.finalites.r9a}</td><td>{t.finalites.r9b}</td></tr>
          <tr><td>{t.finalites.r10a}</td><td>{t.finalites.r10b}</td></tr>
          <tr><td>{t.finalites.r11a}</td><td>{t.finalites.r11b}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="info-box">
      <strong>{t.finalites.infoStrong}</strong> {t.finalites.info}
    </div>
  </section>

  <!-- Section 6 -->
  <section id="destinataires" class="policy-section">
    <div class="section-badge">06</div>
    <h2>{t.destinataires.h2}</h2>
    <h3>6.1 {t.destinataires.h3_1}</h3>
    <ul>
      <li>{t.destinataires.li1a} <strong>{t.destinataires.li1Strong}</strong> {t.destinataires.li1b}</li>
      <li>{t.destinataires.li2a} <strong>{t.destinataires.li2Strong}</strong> {t.destinataires.li2b}</li>
      <li>{t.destinataires.li3a} <strong>{t.destinataires.li3Strong}</strong> {t.destinataires.li3b}</li>
    </ul>
    <h3>6.2 {t.destinataires.h3_2}</h3>
    <p>{t.destinataires.p2}</p>
    <h3>6.3 {t.destinataires.h3_3}</h3>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.destinataires.thService}</th><th>{t.destinataires.thRole}</th><th>{t.destinataires.thDonneesTransmises}</th></tr></thead>
        <tbody>
          <tr><td><strong>Discord Inc.</strong></td><td>{t.destinataires.s1role}</td><td>{t.destinataires.s1data}</td></tr>
          <tr><td><strong>PostgreSQL host / infrastructure</strong></td><td>{t.destinataires.s2role}</td><td>{t.destinataires.s2dataBefore} <a href="{base}/dpa">{t.destinataires.s2link}</a></td></tr>
          <tr><td><strong>Cloudflare</strong></td><td>{t.destinataires.s3role}</td><td>{t.destinataires.s3data}</td></tr>
          <tr><td><strong>Sentry</strong> (optional)</td><td>{t.destinataires.s4role}</td><td>{t.destinataires.s4data}</td></tr>
          <tr><td><strong>YouTube Data API / Twitch API</strong></td><td>{t.destinataires.s5role}</td><td>{t.destinataires.s5data}</td></tr>
          <tr><td><strong>LibreTranslate</strong></td><td>{t.destinataires.s6role}</td><td>{t.destinataires.s6data}</td></tr>
          <tr><td><strong>jsDelivr / GitHub</strong></td><td>{t.destinataires.s7role}</td><td>{t.destinataires.s7data}</td></tr>
        </tbody>
      </table>
    </div>
    <p>{t.destinataires.p3}</p>
  </section>

  <!-- Section 7 -->
  <section id="retention" class="policy-section">
    <div class="section-badge">07</div>
    <h2>{t.retention.h2}</h2>
    <p>
      {t.retention.p1a} <strong>{t.retention.p1Strong}</strong> {t.retention.p1b}
    </p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>{t.retention.thDonnee}</th><th>{t.retention.thActive}</th><th>{t.retention.thApres}</th><th>{t.retention.thSauvegardes}</th></tr></thead>
        <tbody>
          <tr><td>{t.retention.r1a}</td><td>{t.retention.r1b}</td><td>{t.retention.r1c}</td><td>{t.retention.r1d}</td></tr>
          <tr><td>{t.retention.r2a}</td><td>{t.retention.r2b}</td><td>{t.retention.r2c}</td><td>{t.retention.r2d}</td></tr>
          <tr><td>{t.retention.r3a}</td><td>{t.retention.r3b}</td><td>{t.retention.r3c}</td><td>{t.retention.r3d}</td></tr>
          <tr><td>{t.retention.r4a}</td><td>{t.retention.r4b}</td><td>{t.retention.r4c}</td><td>{t.retention.r4d}</td></tr>
          <tr><td>{t.retention.r5a}</td><td>{t.retention.r5b}</td><td>{t.retention.r5c}</td><td>{t.retention.r5d}</td></tr>
          <tr><td>{t.retention.r6a}</td><td>{t.retention.r6b}</td><td>{t.retention.r6c}</td><td>{t.retention.r6d}</td></tr>
          <tr><td>{t.retention.r7a}</td><td>{t.retention.r7b}</td><td>{t.retention.r7c}</td><td>{t.retention.r7d}</td></tr>
          <tr><td>{t.retention.r8a}</td><td>{t.retention.r8b}</td><td>{t.retention.r8c}</td><td>{t.retention.r8d}</td></tr>
          <tr><td>{t.retention.r9a}</td><td>{t.retention.r9b}</td><td>{t.retention.r9c}</td><td>{t.retention.r9d}</td></tr>
          <tr><td>{t.retention.r10a}</td><td>{t.retention.r10b}</td><td>{t.retention.r10c}</td><td>{t.retention.r10d}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="info-box">
      {t.retention.infoP1} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a> {t.retention.infoP2}
    </div>
  </section>

  <!-- Section 8 -->
  <section id="hebergement" class="policy-section">
    <div class="section-badge">08</div>
    <h2>{t.hebergement.h2}</h2>
    <p>
      {t.hebergement.p1a} <strong>{t.hebergement.p1Strong}</strong>{t.hebergement.p1b}
    </p>
    <ul>
      <li><strong>{t.hebergement.li1Strong}</strong> {t.hebergement.li1a} {t.hebergement.li1b}</li>
      <li><strong>{t.hebergement.li2Strong}</strong> {t.hebergement.li2a} {t.hebergement.li2b}</li>
      <li><strong>{t.hebergement.li3Strong}</strong> : {t.hebergement.li3}</li>
      <li><strong>{t.hebergement.li4Strong}</strong> : {t.hebergement.li4}</li>
      <li><strong>{t.hebergement.li5Strong}</strong> : {t.hebergement.li5}</li>
    </ul>
  </section>

  <!-- Section 9 -->
  <section id="droits" class="policy-section">
    <div class="section-badge">09</div>
    <h2>{t.droits.h2}</h2>
    <div class="rights-grid">
      <div class="right-card"><h4>{t.droits.acces.title} <span class="art">{t.droits.acces.art}</span></h4><p>{t.droits.acces.body}</p></div>
      <div class="right-card"><h4>{t.droits.rectification.title} <span class="art">{t.droits.rectification.art}</span></h4><p>{t.droits.rectification.body}</p></div>
      <div class="right-card"><h4>{t.droits.effacement.title} <span class="art">{t.droits.effacement.art}</span></h4><p>{t.droits.effacement.body}</p></div>
      <div class="right-card"><h4>{t.droits.limitation.title} <span class="art">{t.droits.limitation.art}</span></h4><p>{t.droits.limitation.body}</p></div>
      <div class="right-card"><h4>{t.droits.portabilite.title} <span class="art">{t.droits.portabilite.art}</span></h4><p>{t.droits.portabilite.body}</p></div>
      <div class="right-card"><h4>{t.droits.opposition.title} <span class="art">{t.droits.opposition.art}</span></h4><p>{t.droits.opposition.body}</p></div>
      <div class="right-card"><h4>{t.droits.decision.title} <span class="art">{t.droits.decision.art}</span></h4><p>{t.droits.decision.body}</p></div>
      <div class="right-card"><h4>{t.droits.reclamation.title} <span class="art">{t.droits.reclamation.art}</span></h4><p>{t.droits.reclamation.body}</p></div>
    </div>
    <div class="info-box">
      {t.droits.infoP1} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a> {t.droits.infoP2a} <strong>{t.droits.infoStrong}</strong>, {t.droits.infoP2b}
    </div>
  </section>

  <!-- Section 10 -->
  <section id="securite" class="policy-section">
    <div class="section-badge">10</div>
    <h2>{t.securite.h2}</h2>
    <ul>
      <li><strong>{t.securite.li1Strong}</strong> : {t.securite.li1}</li>
      <li><strong>{t.securite.li2Strong}</strong> : {t.securite.li2}</li>
      <li><strong>{t.securite.li3Strong}</strong> : {t.securite.li3a} <em>{t.securite.li3Em}</em>{t.securite.li3b}</li>
      <li><strong>{t.securite.li4Strong}</strong> : {t.securite.li4}</li>
      <li><strong>{t.securite.li5Strong}</strong> : {t.securite.li5}</li>
      <li><strong>{t.securite.li6Strong}</strong> : {t.securite.li6}</li>
    </ul>
    <p>
      {t.securite.p}
    </p>
  </section>

  <!-- Section 11 -->
  <section id="profilage" class="policy-section">
    <div class="section-badge">11</div>
    <h2>{t.profilage.h2}</h2>
    <p>
      {t.profilage.p1}
    </p>
    <ul>
      <li>{t.profilage.li1a} <strong>{t.profilage.li1Strong}</strong>{t.profilage.li1b} <strong>{t.profilage.li1Strong2}</strong> {t.profilage.li1c}</li>
      <li>{t.profilage.li2}</li>
      <li>{t.profilage.li3a} <strong>{t.profilage.li3Strong}</strong> {t.profilage.li3b}</li>
    </ul>
  </section>

  <!-- Section 12 -->
  <section id="mineurs" class="policy-section">
    <div class="section-badge">12</div>
    <h2>{t.mineurs.h2}</h2>
    <p>
      {t.mineurs.p1a} <a href="mailto:privacy@kotbo.fr">privacy@kotbo.fr</a> {t.mineurs.p1b}
    </p>
  </section>

  <!-- Section 13 -->
  <section id="modifications" class="policy-section">
    <div class="section-badge">13</div>
    <h2>{t.modifications.h2}</h2>
    <p>
      {t.modifications.p1}
    </p>
  </section>

  <!-- Section 14 -->
  <section id="contact" class="policy-section">
    <div class="section-badge">14</div>
    <h2>{t.contact.h2}</h2>
    <div class="contact-card">
      <p class="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{t.contact.cardLabel1}</p>
      <a href="mailto:privacy@kotbo.fr" class="font-black text-indigo-700 text-lg hover:underline">privacy@kotbo.fr</a>
      <p class="text-sm text-gray-600 mt-3 leading-relaxed">{t.contact.cardBody1}</p>
      <hr class="my-4 border-gray-100" />
      <p class="text-sm text-gray-500 font-bold uppercase tracking-widest mb-1">{t.contact.cardLabel2}</p>
      <a href="mailto:contact@kotbo.fr" class="font-black text-gray-700 text-lg hover:underline">contact@kotbo.fr</a>
    </div>
    <div class="info-box mt-6">
      <strong>{t.contact.authorityStrong}</strong> {t.contact.authorityP1} <strong>{t.contact.authorityStrong2}</strong> —
      <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>, {t.contact.authorityAddr}
      <a href="{base}/mentions-legales">{t.contact.legalLink}</a>{t.contact.mid1}
      <a href="{base}/terms">{t.contact.termsLink}</a>{t.contact.mid2}
      <a href="{base}/cookies">{t.contact.cookiesLink}</a> {t.contact.mid3}
      <a href="{base}/dpa">{t.contact.dpaLink}</a>.
    </div>
  </section>
</LegalPageLayout>

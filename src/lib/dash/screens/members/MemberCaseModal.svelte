<!--
  Le dossier d'un membre, recopié de `components/MemberCaseModal.svelte`
  (dashboard, branche `recette`) : même en-tête, mêmes onglets, même colonne
  de modération, mêmes classes.

  Ce qui change, parce que l'écran est un aperçu posé dans la page :
  - les données viennent de `fixtures/members.ts` (`memberCaseFor`) et ce que
    le visiteur y change (sanction, note, liaison, vérification, rapport) vit
    dans `caseState.svelte.ts` au lieu de repartir vers l'API ;
  - un clic sur l'inviteur ou sur un contact du graphe ouvre son dossier ici
    même, comme `onSelectUser` le fait dans le dashboard ;
  - les mises en page ne dépendent plus de la largeur de l'écran (`lg:`,
    `md:`) : le cadre fait toujours 1180 px et la page le réduit d'un bloc ;
  - les liens qui sortiraient de l'aperçu (fiche complète, message dans
    Discord, vue Invitations, détail d'un salon, preuves, recrutement) ne sont
    pas repris : leur cible n'existe pas ici.
-->
<script lang="ts">
  import { tick, untrack, type Snippet } from 'svelte';
  import { Tabs, Button, Callout, SectionCard, EmptyState, Field, Modal } from '$lib/dash/ui';
  import Papicon from '$lib/dash/Papicon.svelte';
  import { memberAvatarSrc } from '$lib/dash/media';
  import { CAST, castById, NOW } from '$lib/dash/cast';
  import type { DashboardSanctionType, MemberCaseResponse, SanctionItem } from '$lib/dash/types';
  import { demoRules, memberCaseFor, memberMessagesFor, memberTrendFor } from '$lib/dash/fixtures/members';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { caseEdits, editsOf, VIEWER } from './caseState.svelte';
  import { dateLocale, fmtMinutes, fmtNumber, relativeDelta, shortDate, SERIES, typeLabel } from './format';
  import MetricTabs from './MetricTabs.svelte';
  import TrendChart from './TrendChart.svelte';
  import InteractionTree from './InteractionTree.svelte';
    import ConfirmDialog from './ConfirmDialog.svelte';

  const TEXT = {
    fr: {
      members: 'Membres',
      tabs: { resume: 'Résumé', identite: 'Identité', analytics: 'Analytiques', messages: 'Messages', logs: 'Journal', sanctions: 'Sanctions', connexions: 'Connexions', linked_accounts: 'Comptes liés', notes: 'Notes' },
      avatarAlt: 'Avatar',
      tutor: 'Tuteur',
      verifPendingBadge: 'Vérification en cours',
      verifDoneBadge: 'Déjà vérifié',
      requestVerification: 'Demander vérification',
      closeCase: 'Fermer le dossier',
      presence: { online: 'En ligne', idle: 'Absent', dnd: 'Ne pas déranger', left: 'A quitté le serveur', offline: 'Hors ligne' } as Record<string, string>,
      userNotFound: 'Utilisateur introuvable',
      userNotFoundDesc: "Impossible de retrouver le membre lié à cette entrée. Le dossier ne peut pas s'ouvrir.",
      dcTitle: 'Suspicion de double compte',
      dcDesc: 'Ce compte a été identifié comme un potentiel double compte automatique lors de son arrivée.',
      serverPresence: 'Présence serveur',
      joinedOn: (d: string) => `Arrivé le ${d}`,
      accountAge: 'Âge du compte',
      createdOn: (d: string) => `Créé le ${d}`,
      messages: 'Messages',
      voice: 'Vocal',
      sanctions: 'Sanctions',
      activeSanctions: (n: number) => `${n} sanction(s) active(s)`,
      trendTitle: "Tendance d'activité (30j)",
      trendDesc: "30 derniers jours, comparés aux 30 jours d'avant en pointillés.",
      previousPeriod: "Période d'avant",
      statsUnavailable: 'Statistiques indisponibles Activité insuffisante sur 30j',
      roles: (n: number) => `Rôles (${n})`,
      noRole: 'Aucun rôle attribué',
      keyPermissions: 'Permissions clés',
      emptyContent: 'Contenu vide',
      noLog: 'Rien dans le journal',
      fullProfile: 'Profil complet',
      discordId: 'ID Discord',
      username: "Nom d'utilisateur",
      globalName: 'Nom global',
      serverNickname: 'Surnom serveur',
      pronouns: 'Pronoms',
      notSpecified: 'Non spécifiés',
      languageLocale: 'Langue (locale)',
      unknown: 'Inconnu',
      unknownF: 'Inconnue',
      keyDates: 'Dates clés',
      accountCreation: 'Création compte',
      serverJoin: 'Arrivée serveur',
      lastLeave: 'Dernier départ',
      firstSeen: 'Première vue',
      lastSeen: 'Dernière vue',
      verifHistory: 'Historique des vérifications',
      verifCount: (n: number) => `${n} demande(s)`,
      verifEmpty: 'Aucune vérification demandée pour ce membre.',
      verifLastRequest: 'Dernière demande',
      verifLastVerified: 'Dernière vérification réussie',
      verifRequestedOn: (d: string) => `Demandée le ${d}`,
      verifVerifiedOn: (d: string) => `Vérifiée le ${d}`,
      verifNever: 'Jamais',
      verifStatus: { VERIFIED: 'Vérifiée', PENDING: 'En attente', FLAGGED: 'Signalée', EXPIRED: 'Expirée' } as Record<string, string>,
      verifAlreadyPending: 'Une demande de vérification est déjà en cours pour ce membre.',
      verifCooldown: "Une vérification vient d'être demandée. Patiente avant d'en relancer une.",
      verifTitle: 'Forcer la vérification de sécurité ?',
      verifDesc: 'Le membre sera exclu temporairement et recevra les consignes en message privé.',
      verifConfirm: 'Forcer la vérification',
      verifSent: 'Demande de vérification envoyée. Le membre est exclu temporairement.',
      currentGrade: 'Grade actuel',
      tutorStatus: 'Statut tuteur',
      tutorYes: 'Oui (actif)',
      tutorNo: 'Non',
      messageVolume: 'Volume messages',
      voiceActivity: 'Activité vocal',
      last30: '30 derniers jours',
      minutesPerDay: 'Minutes / jour',
      noAnalytics: 'Aucune donnée analytique',
      noAnalyticsDesc: "Nous n'avons pas encore assez de données d'activité pour générer des graphiques pour ce membre sur les 30 derniers jours.",
      searchMessages: 'Rechercher dans les messages…',
      allChannels: 'Tous les salons',
      dateFrom: 'Du',
      dateTo: 'au',
      showDeleted: 'Afficher supprimés',
      edited: 'Modifié',
      editedOn: (d: string) => `Modifié le ${d}`,
      deleted: 'Supprimé',
      deletedOn: (d: string) => `Supprimé le ${d}`,
      emptyWithAttachments: 'Message vide (contient uniquement des pièces jointes)',
      noMessageFound: 'Aucun message trouvé',
      noMessageFoundDesc: 'Aucun message enregistré pour ce membre ne correspond à tes filtres.',
      clearFilters: 'Effacer les filtres',
      searchLogs: 'Rechercher dans le journal…',
      allModules: 'Tous les modules',
      allSources: 'Toutes les sources',
      sortNewest: 'Plus récents',
      sortOldest: 'Plus anciens',
      logsShown: (shown: number, total: number) => `${shown} entrée(s) sur ${total}`,
      noLogMatch: 'Aucune entrée ne correspond aux filtres',
      channelLabel: 'Salon',
      crossServer: 'Casier inter-serveurs',
      crossCount: (n: number) => (n > 1 ? `${n} sanctions` : `${n} sanction`),
      crossOn: (n: number) => (n > 1 ? `sur ${n} autres serveurs` : `sur ${n} autre serveur`),
      crossMore: (n: number) => (n > 1 ? `+${n} autres` : `+${n} autre`),
      sameInstance: 'Même instance · modérateur non partagé',
      cleanRecord: 'Dossier vierge',
      colDate: 'Date',
      colAction: 'Action',
      colStatus: 'Statut',
      colReason: 'Raison',
      colReport: 'Rapport',
      byModerator: (m: string) => `par @${m}`,
      report: 'Rapport',
      noReport: 'Aucun rapport',
      status: { ACTIVE: 'Active', RESOLVED: 'Résolue', EXPIRED: 'Expirée' } as Record<string, string>,
      interactionGraph: "Graphe d'Interactions",
      topContacts: (n: number) => `Top ${n} contacts`,
      noExternalLink: 'Aucun lien externe',
      xlinkTitle: "Liens sur d'autres serveurs",
      xlinkCount: (n: number) => (n > 1 ? `${n} suggestions de liaison` : `${n} suggestion de liaison`),
      xlinkOn: (n: number) => (n > 1 ? `depuis ${n} serveurs` : `depuis ${n} serveur`),
      xlinkServers: (n: number) => (n > 1 ? `${n} serveurs` : `${n} serveur`),
      xlinkAbsent: "Absent d'ici",
      xlinkManual: 'Manuel',
      xlinkAuto: 'Auto',
      xlinkScore: (n: number) => `+${n} pts`,
      xlinkScoreHint: 'Bonus apporté à la note de détection : il augmente avec le nombre de serveurs portant ce lien.',
      xlinkAlready: 'Déjà lié ici',
      xlinkFooter: "Rien n'est lié automatiquement : c'est à toi de valider.",
      linkManually: 'Lier un compte manuellement',
      targetId: 'ID du compte cible',
      linkReason: 'Raison (obligatoire pour le staff)',
      linkReasonPlaceholder: 'Ex : double compte confirmé par les journaux',
      linkAccounts: 'Lier les comptes',
      idRequired: "L'ID du compte est requis.",
      linkSuccess: 'Comptes liés.',
      linkError: "Impossible de relier. Vérifie l'identifiant ou tes permissions.",
      linkStatus: { VALIDATED: 'Validé', PENDING: 'En attente' } as Record<string, string>,
      linkType: { MANUAL: 'Manuel', AUTOMATIC: 'Auto' } as Record<string, string>,
      unlinkAccount: 'Délier le compte',
      unlinkTitle: 'Séparer ces comptes ?',
      unlinkConfirm: 'Séparer',
      noLinked: 'Aucun compte lié',
      modNotes: 'Notes modérateur',
      modNotesDesc: "Ces notes sont conservées et visibles uniquement par l'équipe de modération. Utilise cet espace pour laisser des informations importantes sur le comportement de l'utilisateur.",
      notePlaceholder: 'Ajouter une note sur cet utilisateur…',
      noteSaved: 'Note enregistrée.',
      save: 'Sauvegarder',
      riskScore: 'Score de risque',
      riskLow: 'Risque faible',
      riskHigh: 'Risque élevé',
      riskCritical: 'Risque critique',
      riskDesc: 'Basé sur les sanctions actives/passées et suspicions de DC.',
      seniority: { newcomer: 'Nouveau venu', recent: 'Récents (1 semaine+)', regular: 'Régulier (1 mois+)', old: 'Ancien (6 mois+)', veteran: 'Vétéran (1 an+)' },
      modActions: 'Actions de modération',
      sanctionReason: 'Raison de la sanction',
      reasonPlaceholder: 'Saisis un motif (obligatoire)…',
      durationTimeout: 'Durée (exclusion temporaire uniquement)',
      durations: { '30m': '30 minutes', '1h': '1 heure', '1d': '1 jour', '7d': '7 jours', '28d': '28 jours (max)' } as Record<string, string>,
      warn: 'Avertir',
      timeout: 'Exclure temporairement',
      exclude: 'Exclure',
      kick: 'Expulser',
      ban: 'Bannir',
      defaultReason: 'Action lancée depuis le profil membre.',
      actionDone: (a: string) => `L'action ${a} a été exécutée.`,
      confirmWarnTitle: (n: string) => `Avertir ${n} ?`,
      confirmWarnDesc: (r: string) => `Un avertissement formel sera enregistré. Raison : « ${r} »`,
      confirmTimeoutTitle: (n: string) => `Exclure temporairement ${n} ?`,
      confirmTimeoutDesc: (d: string, r: string) => `Le membre sera exclu temporairement pendant ${d}. Raison : « ${r} »`,
      confirmKickTitle: (n: string) => `Expulser ${n} ?`,
      confirmKickDesc: (r: string) => `Le membre sera exclu du serveur Discord. Raison : « ${r} »`,
      confirmBanTitle: (n: string) => `Bannir ${n} ?`,
      confirmBanDesc: (r: string) => `Le membre sera banni définitivement du serveur Discord. Un message d'avis d'appel lui sera envoyé au préalable. Raison : « ${r} »`,
      sanctionReport: 'Rapport de sanction',
      appliedOn: (d: string, m: string) => `Appliquée le ${d} par @${m}`,
      incident: 'Incident',
      incidentDate: "Date de l'incident",
      duration: 'Durée',
      appliedDuration: 'Durée appliquée',
      durationPlaceholder: 'Ex : 2h, permanent…',
      brokenRules: 'Règles enfreintes',
      noRuleSelected: 'Aucune règle sélectionnée',
      rulesSelected: (n: number) => `${n} règle(s) sélectionnée(s)`,
      rulePrefix: 'Règlement',
      detailedReason: 'Raison détaillée',
      detailedReasonPlaceholder: 'Description précise des faits…',
      evidence: 'Preuves',
      evidenceLink: 'Lien de preuve',
      extraNotes: 'Notes complémentaires',
      extraNotesPlaceholder: 'Précisions facultatives…',
      reportBy: (a: string) => `Rapport créé par @${a}`,
      reportMissing: 'Rapport détaillé manquant',
      reportMissingDesc: "La sanction a été enregistrée mais le rapport détaillé n'a pas encore été rédigé par le modérateur.",
      editReport: 'Modifier le rapport',
      closeDetails: 'Fermer les détails',
      cancel: 'Annuler',
      saveReport: 'Enregistrer',
      justNow: "À l'instant",
      agoMinutes: (n: number) => `Il y a ${n}m`,
      agoHours: (n: number) => `Il y a ${n}h`,
      agoDays: (n: number) => `Il y a ${n}j`,
      never: 'Jamais',
      years: (n: number) => (n > 1 ? `${n} ans` : `${n} an`),
      months: (n: number) => `${n} mois`,
      days: (n: number) => (n > 1 ? `${n} jours` : `${n} jour`),
      today: "Aujourd'hui",
      dayUnit: 'j',
    },
    en: {
      members: 'Members',
      tabs: { resume: 'Summary', identite: 'Identity', analytics: 'Analytics', messages: 'Messages', logs: 'Logs', sanctions: 'Sanctions', connexions: 'Connections', linked_accounts: 'Linked accounts', notes: 'Notes' },
      avatarAlt: 'Avatar',
      tutor: 'Tutor',
      verifPendingBadge: 'Verification pending',
      verifDoneBadge: 'Already verified',
      requestVerification: 'Request verification',
      closeCase: 'Close the file',
      presence: { online: 'Online', idle: 'Idle', dnd: 'Do not disturb', left: 'Left the server', offline: 'Offline' } as Record<string, string>,
      userNotFound: 'User not found',
      userNotFoundDesc: 'This log could not be tied to a Discord user ID. The file cannot be loaded.',
      dcTitle: 'Suspected alt account',
      dcDesc: 'This account was flagged as a possible alt account automatically when it joined.',
      serverPresence: 'Server presence',
      joinedOn: (d: string) => `Joined on ${d}`,
      accountAge: 'Account age',
      createdOn: (d: string) => `Created on ${d}`,
      messages: 'Messages',
      voice: 'Voice',
      sanctions: 'Sanctions',
      activeSanctions: (n: number) => `${n} active sanction(s)`,
      trendTitle: 'Activity trend (30d)',
      trendDesc: 'Last 30 days, compared with the 30 days before (dotted).',
      previousPeriod: 'Previous period',
      statsUnavailable: 'Statistics unavailable Not enough activity over 30 days',
      roles: (n: number) => `Roles (${n})`,
      noRole: 'No role assigned',
      keyPermissions: 'Key permissions',
      emptyContent: 'Empty content',
      noLog: 'No log available',
      fullProfile: 'Full profile',
      discordId: 'Discord ID',
      username: 'Username',
      globalName: 'Global name',
      serverNickname: 'Server nickname',
      pronouns: 'Pronouns',
      notSpecified: 'Not specified',
      languageLocale: 'Language (locale)',
      unknown: 'Unknown',
      unknownF: 'Unknown',
      keyDates: 'Key dates',
      accountCreation: 'Account created',
      serverJoin: 'Server join',
      lastLeave: 'Last leave',
      firstSeen: 'First seen',
      lastSeen: 'Last seen',
      verifHistory: 'Verification history',
      verifCount: (n: number) => `${n} request(s)`,
      verifEmpty: 'No verification requested for this member.',
      verifLastRequest: 'Last request',
      verifLastVerified: 'Last successful verification',
      verifRequestedOn: (d: string) => `Requested on ${d}`,
      verifVerifiedOn: (d: string) => `Verified on ${d}`,
      verifNever: 'Never',
      verifStatus: { VERIFIED: 'Verified', PENDING: 'Pending', FLAGGED: 'Flagged', EXPIRED: 'Expired' } as Record<string, string>,
      verifAlreadyPending: 'A verification request is already pending for this member.',
      verifCooldown: 'A verification was just requested. Wait before sending another one.',
      verifTitle: 'Force the security check?',
      verifDesc: 'The user will be timed out temporarily and will receive the instructions by direct message.',
      verifConfirm: 'Force the check',
      verifSent: 'Verification request sent. The member has been timed out.',
      currentGrade: 'Current grade',
      tutorStatus: 'Tutor status',
      tutorYes: 'Yes (active)',
      tutorNo: 'No',
      messageVolume: 'Message volume',
      voiceActivity: 'Voice activity',
      last30: 'Last 30 days',
      minutesPerDay: 'Minutes / day',
      noAnalytics: 'No analytics data',
      noAnalyticsDesc: "We don't have enough activity data yet to draw charts for this member over the last 30 days.",
      searchMessages: 'Search in the messages…',
      allChannels: 'All channels',
      dateFrom: 'From',
      dateTo: 'to',
      showDeleted: 'Show deleted',
      edited: 'Edited',
      editedOn: (d: string) => `Edited on ${d}`,
      deleted: 'Deleted',
      deletedOn: (d: string) => `Deleted on ${d}`,
      emptyWithAttachments: 'Empty message (attachments only)',
      noMessageFound: 'No message found',
      noMessageFoundDesc: 'No recorded message for this member matches your filters.',
      clearFilters: 'Clear filters',
      searchLogs: 'Search in the logs…',
      allModules: 'All modules',
      allSources: 'All sources',
      sortNewest: 'Newest first',
      sortOldest: 'Oldest first',
      logsShown: (shown: number, total: number) => `${shown} of ${total} log(s)`,
      noLogMatch: 'No log matches the filters',
      channelLabel: 'Channel',
      crossServer: 'Cross-server record',
      crossCount: (n: number) => (n > 1 ? `${n} sanctions` : `${n} sanction`),
      crossOn: (n: number) => (n > 1 ? `on ${n} other servers` : `on ${n} other server`),
      crossMore: (n: number) => `+${n} more`,
      sameInstance: 'Same instance · moderator not shared',
      cleanRecord: 'Clean record',
      colDate: 'Date',
      colAction: 'Action',
      colStatus: 'Status',
      colReason: 'Reason',
      colReport: 'Report',
      byModerator: (m: string) => `by @${m}`,
      report: 'Report',
      noReport: 'No report',
      status: { ACTIVE: 'Active', RESOLVED: 'Resolved', EXPIRED: 'Expired' } as Record<string, string>,
      interactionGraph: 'Interaction graph',
      topContacts: (n: number) => `Top ${n} contacts`,
      noExternalLink: 'No external link',
      xlinkTitle: 'Links on other servers',
      xlinkCount: (n: number) => (n > 1 ? `${n} link suggestions` : `${n} link suggestion`),
      xlinkOn: (n: number) => (n > 1 ? `from ${n} servers` : `from ${n} server`),
      xlinkServers: (n: number) => (n > 1 ? `${n} servers` : `${n} server`),
      xlinkAbsent: 'Not here',
      xlinkManual: 'Manual',
      xlinkAuto: 'Auto',
      xlinkScore: (n: number) => `+${n} pts`,
      xlinkScoreHint: 'Bonus added to the detection score: it grows with the number of servers carrying this link.',
      xlinkAlready: 'Already linked here',
      xlinkFooter: 'Nothing is linked automatically, you decide.',
      linkManually: 'Link an account manually',
      targetId: 'Target account ID',
      linkReason: 'Reason (required for the staff)',
      linkReasonPlaceholder: 'E.g. alt account confirmed by logs',
      linkAccounts: 'Link the accounts',
      idRequired: 'The account ID is required.',
      linkSuccess: 'Accounts linked successfully.',
      linkError: 'Linking failed. Check the ID or your permissions.',
      linkStatus: { VALIDATED: 'Validated', PENDING: 'Pending' } as Record<string, string>,
      linkType: { MANUAL: 'Manual', AUTOMATIC: 'Auto' } as Record<string, string>,
      unlinkAccount: 'Unlink the account',
      unlinkTitle: 'Unlink these accounts?',
      unlinkConfirm: 'Unlink',
      noLinked: 'No linked account',
      modNotes: 'Moderator notes',
      modNotesDesc: "These notes are permanent and visible only to the moderation team. Use this space to leave important information about the user's behaviour.",
      notePlaceholder: 'Add a note about this user…',
      noteSaved: 'Note saved.',
      save: 'Save',
      riskScore: 'Risk score',
      riskLow: 'Low risk',
      riskHigh: 'High risk',
      riskCritical: 'Critical risk',
      riskDesc: 'Based on active/past sanctions and alt-account suspicions.',
      seniority: { newcomer: 'Newcomer', recent: 'Recent (1 week+)', regular: 'Regular (1 month+)', old: 'Long-timer (6 months+)', veteran: 'Veteran (1 year+)' },
      modActions: 'Moderation actions',
      sanctionReason: 'Reason for the sanction',
      reasonPlaceholder: 'Enter a reason (required)…',
      durationTimeout: 'Duration (timeout only)',
      durations: { '30m': '30 minutes', '1h': '1 hour', '1d': '1 day', '7d': '7 days', '28d': '28 days (max)' } as Record<string, string>,
      warn: 'Warn',
      timeout: 'Timeout',
      exclude: 'Time out',
      kick: 'Kick',
      ban: 'Ban',
      defaultReason: 'Action started from the member profile.',
      actionDone: (a: string) => `The ${a} action has been carried out.`,
      confirmWarnTitle: (n: string) => `Warn ${n}?`,
      confirmWarnDesc: (r: string) => `A formal warning will be recorded. Reason: “${r}”`,
      confirmTimeoutTitle: (n: string) => `Temporarily mute ${n}?`,
      confirmTimeoutDesc: (d: string, r: string) => `The member will be timed out for ${d}. Reason: “${r}”`,
      confirmKickTitle: (n: string) => `Kick ${n}?`,
      confirmKickDesc: (r: string) => `The member will be removed from the Discord server. Reason: “${r}”`,
      confirmBanTitle: (n: string) => `Ban ${n}?`,
      confirmBanDesc: (r: string) => `The member will be permanently banned from the Discord server. An appeal notice will be sent to them beforehand. Reason: “${r}”`,
      sanctionReport: 'Sanction report',
      appliedOn: (d: string, m: string) => `Applied on ${d} by @${m}`,
      incident: 'Incident',
      incidentDate: 'Date of the incident',
      duration: 'Duration',
      appliedDuration: 'Duration applied',
      durationPlaceholder: 'E.g. 2h, permanent…',
      brokenRules: 'Rules broken',
      noRuleSelected: 'No rule selected',
      rulesSelected: (n: number) => `${n} rule(s) selected`,
      rulePrefix: 'Rules',
      detailedReason: 'Detailed reason',
      detailedReasonPlaceholder: 'Precise description of the facts…',
      evidence: 'Evidence',
      evidenceLink: 'Evidence link',
      extraNotes: 'Additional notes',
      extraNotesPlaceholder: 'Optional details…',
      reportBy: (a: string) => `Report created by @${a}`,
      reportMissing: 'Detailed report missing',
      reportMissingDesc: 'The sanction was recorded but the moderator has not written the detailed report yet.',
      editReport: 'Edit the report',
      closeDetails: 'Close the details',
      cancel: 'Cancel',
      saveReport: 'Save',
      justNow: 'Just now',
      agoMinutes: (n: number) => `${n}m ago`,
      agoHours: (n: number) => `${n}h ago`,
      agoDays: (n: number) => `${n}d ago`,
      never: 'Never',
      years: (n: number) => (n > 1 ? `${n} years` : `${n} year`),
      months: (n: number) => `${n} months`,
      days: (n: number) => (n > 1 ? `${n} days` : `${n} day`),
      today: 'Today',
      dayUnit: 'd',
    },
  };


  // Le dashboard a aussi Activité, Contenu, Candidats et Invitations : à 1180 px
  // leurs onglets passaient sur une seconde ligne et le dossier débordait du cadre.
  type MemberCaseTab = 'extra' | 'resume' | 'identite' | 'messages' | 'logs' | 'sanctions' | 'connexions' | 'analytics' | 'linked_accounts' | 'notes';

  const {
    userId = null,
    extraTab = null,
    initialTab = 'resume',
    onclose = () => {},
  }: {
    userId?: string | null;
    extraTab?: { label: string; icon: string; content: Snippet } | null;
    initialTab?: string;
    onclose?: () => void;
  } = $props();

  const uid = $props.id();
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  // L'anglais écrit l'ancienneté sur deux lignes (« 2 years, 1 months ») : la
  // courbe du Résumé rend la hauteur prise.
  const resumeChartHeight = $derived(locale === 'en' ? 130 : 158);

  // Le dossier affiché : celui demandé, ou celui d'un inviteur ou d'un contact
  // ouvert depuis le dossier (le `onSelectUser` du dashboard).
  // Valeurs de départ posées tout de suite : le rendu serveur montre déjà le dossier.
  let viewedId = $state<string | null>(untrack(() => userId));
  let activeTab = $state<MemberCaseTab>(untrack(() => (initialTab === 'extra' && !extraTab ? 'resume' : (initialTab as MemberCaseTab))));

  function resetFilters() {
    messageQuery = '';
    messageChannelId = '';
    messageIncludeDeleted = true;
    messageFrom = '';
    messageTo = '';
    logQuery = '';
    logModule = '';
    logSource = '';
    logFrom = '';
    logTo = '';
    logOrder = 'desc';
    actionReason = '';
    linkFeedback = '';
    targetAccountId = '';
    linkReason = '';
    trendMetric = 'messages';
  }

  $effect(() => {
    const id = userId;
    const tab = initialTab as MemberCaseTab;
    untrack(() => {
      viewedId = id;
      activeTab = tab === 'extra' && !extraTab ? 'resume' : tab;
      resetFilters();
    });
  });

  let mcRoot = $state<HTMLDivElement>();

  function selectUser(id: string) {
    if (!castById(id) || id === viewedId) return;
    viewedId = id;
    activeTab = 'resume';
    viewingReportSanctionId = null;
    toast = null;
    resetFilters();
    // L'élément cliqué disparaît avec l'ancien dossier : le focus reste dans le nouveau.
    void tick().then(() => mcRoot?.querySelector<HTMLElement>('[data-case-close]')?.focus({ preventScroll: true }));
  }

  /** L'onglet propre à la page appelante ne vaut que pour le membre qu'elle a ouvert. */
  const showExtra = $derived(!!extraTab && viewedId === userId);

  // --- Données : fixtures + ce que le visiteur a changé ---
  const edits = $derived(viewedId ? caseEdits[viewedId] : undefined);
  const rules = $derived(demoRules(locale));

  function ruleJson(ids: string[]): string {
    return JSON.stringify(rules.filter((r) => ids.includes(r.id)).map((r) => ({ id: r.id, title: r.label, description: r.details })));
  }

  const caseData = $derived.by((): MemberCaseResponse | null => {
    const base = memberCaseFor(viewedId, locale);
    if (!base || !base.profile || !edits) return base;
    const added: SanctionItem[] = edits.sanctions.map((s) => ({
      id: s.id,
      type: s.type,
      status: s.type === 'KICK' ? 'RESOLVED' : 'ACTIVE',
      targetUserId: base.profile!.userId,
      targetTag: base.profile!.username ?? '',
      moderatorUserId: VIEWER.userId,
      moderatorTag: VIEWER.username,
      reason: s.reason ?? t.defaultReason,
      durationSeconds: s.durationSeconds,
      expiresAt: null,
      createdAt: s.createdAt,
      resolvedAt: null,
      resolutionNote: null,
      archivedAt: null,
      archiveReason: null,
      appealable: true,
      appealLockReason: null,
    }));
    const verifications = edits.verificationAt
      ? {
          ...base.verifications,
          entries: [{ id: `verif-${edits.verificationAt}`, status: 'PENDING' as const, level: 'MEDIUM' as const, requestedAt: edits.verificationAt, verifiedAt: null, expiresAt: null }, ...base.verifications.entries],
          total: base.verifications.total + 1,
          lastRequestedAt: edits.verificationAt,
          hasPending: true,
        }
      : base.verifications;
    return {
      ...base,
      profile: {
        ...base.profile,
        moderatorNote: edits.note ?? base.profile.moderatorNote,
        presenceStatus: edits.removed ? 'left' : base.profile.presenceStatus,
        isOnServer: edits.removed ? false : base.profile.isOnServer,
      },
      sanctions: [...added, ...base.sanctions],
      logs: [
        ...edits.sanctions.map((s, i) => ({ id: `added-log-${i}`, user: base.profile!.username ?? '', action: typeLabel(s.type), context: '', module: t.sanctions, eventType: 'sanction', source: 'dashboard' as const, details: s.reason ?? t.defaultReason, dateIso: s.createdAt, channelId: null })).reverse(),
        ...base.logs,
      ],
      sanctionReports: base.sanctionReports.map((r) => {
        const e = edits.reports[r.id];
        return e ? { ...r, incidentAt: e.incidentAt, sanctionDurationLabel: e.sanctionDurationLabel, brokenRules: ruleJson(e.ruleIds), detailedReason: e.detailedReason, additionalNotes: e.additionalNotes } : r;
      }),
      linkedAccounts: [...base.linkedAccounts.filter((a) => !edits.unlinked.includes(a.userId)), ...edits.linked],
      verifications,
    };
  });

  const profile = $derived(caseData?.profile ?? null);
  const userName = $derived(viewedId ? castById(viewedId)?.displayName ?? '' : '');

  // --- Onglet Messages : recherche locale sur les messages de démo ---
  let messageQuery = $state('');
  let messageChannelId = $state('');
  let messageIncludeDeleted = $state(true);
  let messageFrom = $state('');
  let messageTo = $state('');

  const allMessages = $derived(viewedId ? memberMessagesFor(viewedId, locale) : []);
  const messagesChannels = $derived.by(() => {
    const counts = new Map<string, { channelId: string; channelName: string; count: number }>();
    for (const msg of allMessages) {
      const entry = counts.get(msg.channelId) ?? { channelId: msg.channelId, channelName: msg.channelName, count: 0 };
      entry.count += 1;
      counts.set(msg.channelId, entry);
    }
    return [...counts.values()];
  });
  const messagesList = $derived.by(() => {
    const query = messageQuery.trim().toLowerCase();
    const from = messageFrom ? new Date(`${messageFrom}T00:00:00`).getTime() : null;
    const to = messageTo ? new Date(`${messageTo}T23:59:59.999`).getTime() : null;
    return allMessages.filter((msg) => {
      if (!messageIncludeDeleted && msg.deletedAt) return false;
      if (messageChannelId && msg.channelId !== messageChannelId) return false;
      const at = new Date(msg.createdAt).getTime();
      if (from !== null && at < from) return false;
      if (to !== null && at > to) return false;
      return !query || msg.content.toLowerCase().includes(query);
    });
  });

  // --- Onglet Journal : filtres locaux, comme dans le dashboard ---
  let logQuery = $state('');
  let logModule = $state('');
  let logSource = $state('');
  let logFrom = $state('');
  let logTo = $state('');
  let logOrder = $state<'desc' | 'asc'>('desc');

  const logModules = $derived([...new Set((caseData?.logs ?? []).map((log) => log.module).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')));
  const logSources = $derived([...new Set((caseData?.logs ?? []).map((log) => log.source).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')));
  const filteredLogs = $derived.by(() => {
    const query = logQuery.trim().toLowerCase();
    const from = logFrom ? new Date(`${logFrom}T00:00:00`).getTime() : null;
    const to = logTo ? new Date(`${logTo}T23:59:59.999`).getTime() : null;
    const matching = (caseData?.logs ?? []).filter((log) => {
      if (logModule && log.module !== logModule) return false;
      if (logSource && log.source !== logSource) return false;
      const at = new Date(log.dateIso).getTime();
      if (from !== null && at < from) return false;
      if (to !== null && at > to) return false;
      if (!query) return true;
      return [log.action, log.module, log.source, log.details].some((field) => String(field ?? '').toLowerCase().includes(query));
    });
    return matching.toSorted((a, b) => {
      const delta = new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime();
      return logOrder === 'asc' ? delta : -delta;
    });
  });

  // --- Chiffres dérivés ---
  const sanctions = $derived(caseData?.sanctions ? [...caseData.sanctions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : []);
  const activeSanctionCount = $derived(sanctions.filter((s) => s.status === 'ACTIVE').length);

  const moderationRiskScore = $derived.by(() => {
    if (!caseData) return 0;
    let score = 0;
    if (caseData.isSuspectedDC || caseData.profile?.isSuspectedDC) score += 30;
    score += sanctions.filter((s) => s.status === 'ACTIVE').length * 25;
    score += sanctions.filter((s) => s.status !== 'ACTIVE').length * 10;
    score += (caseData.linkedAccounts?.length ?? 0) * 15;
    return Math.min(100, score);
  });
  const riskTone = $derived(moderationRiskScore < 30 ? 'success' : moderationRiskScore < 70 ? 'warning' : 'error');

  const memberSeniority = $derived.by(() => {
    if (!profile?.guildJoinedAt) return t.seniority.newcomer;
    const ageDays = (NOW - new Date(profile.guildJoinedAt).getTime()) / 86_400_000;
    if (ageDays > 365) return t.seniority.veteran;
    if (ageDays > 180) return t.seniority.old;
    if (ageDays > 30) return t.seniority.regular;
    if (ageDays > 7) return t.seniority.recent;
    return t.seniority.newcomer;
  });

  // --- Analytiques : 30 jours et les 30 d'avant ---
  let trendMetric = $state<'messages' | 'voice'>('messages');
  const trend = $derived(viewedId ? memberTrendFor(viewedId) : null);
  const memberMetrics = $derived.by(() => {
    if (!trend) return [];
    const cur = trend.current;
    const prev = trend.previous;
    const sum = (rows: typeof cur, key: 'messages' | 'voiceMinutes') => rows.reduce((total, d) => total + d[key], 0);
    return [
      { id: 'messages', label: t.messages, color: SERIES[0], format: fmtNumber, value: fmtNumber(sum(cur, 'messages')), delta: relativeDelta(sum(cur, 'messages'), sum(prev, 'messages')), spark: cur.map((d) => d.messages), daily: cur.map((d) => d.messages), prevDaily: prev.map((d) => d.messages) },
      { id: 'voice', label: t.voice, color: SERIES[2], format: fmtMinutes, value: fmtMinutes(sum(cur, 'voiceMinutes')), delta: relativeDelta(sum(cur, 'voiceMinutes'), sum(prev, 'voiceMinutes')), spark: cur.map((d) => d.voiceMinutes), daily: cur.map((d) => d.voiceMinutes), prevDaily: prev.map((d) => d.voiceMinutes) },
    ];
  });
  const selectedMetric = $derived(memberMetrics.find((metric) => metric.id === trendMetric) ?? memberMetrics[0]);
  const trendLabels = $derived(trend?.current.map((d) => shortDate(d.dateKey)) ?? []);
  const hasTrend = $derived(!!trend && trend.current.some((d) => d.messages > 0 || d.voiceMinutes > 0));


  // --- Vérifications ---
  const verifications = $derived(caseData?.verifications ?? null);
  const verificationEntries = $derived(verifications?.entries ?? []);
  const verificationPending = $derived(verifications?.hasPending ?? false);
  const verificationBlocked = $derived(verificationPending || (!!verifications?.cooldownUntil && new Date(verifications.cooldownUntil).getTime() > NOW));

  const VERIFICATION_STATUS_STYLES: Record<string, string> = {
    VERIFIED: 'badge-success',
    PENDING: 'badge-warning',
    FLAGGED: 'badge-danger',
    EXPIRED: 'badge-neutral',
  };

  // --- Notifications : le toast du dashboard, posé dans le dossier ---
  let toast = $state<{ message: string; tone: 'success' | 'error' } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  function notify(message: string, tone: 'success' | 'error' = 'success') {
    toast = { message, tone };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast = null), 4000);
  }

  // --- Confirmation : la fenêtre du dashboard, posée sur l'aperçu ---
  type Pending = { title: string; description?: string; confirmLabel: string; variant: 'danger' | 'warning' | 'default'; run: () => void };
  let pending = $state<Pending | null>(null);
  let returnFocus: HTMLElement | null = null;

  function ask(request: Pending) {
    returnFocus = document.activeElement as HTMLElement | null;
    pending = request;
  }

  function settle(confirmed: boolean) {
    const request = pending;
    pending = null;
    if (confirmed) request?.run();
    returnFocus?.focus({ preventScroll: true });
  }

  function handleRequestVerification() {
    if (!viewedId || verificationBlocked) return;
    const id = viewedId;
    ask({
      title: t.verifTitle,
      description: t.verifDesc,
      confirmLabel: t.verifConfirm,
      variant: 'warning',
      run: () => {
        editsOf(id).verificationAt = new Date().toISOString();
        notify(t.verifSent);
      },
    });
  }

  // --- Actions de modération ---
  let actionReason = $state('');
  let actionDuration = $state('30m');

  const DURATIONS: Record<string, number> = { '30m': 1800, '1h': 3600, '1d': 86400, '7d': 604800, '28d': 2419200 };

  function executeModerationAction(action: 'WARN' | 'KICK' | 'TIMEOUT' | 'BAN') {
    if (!viewedId) return;
    const id = viewedId;
    const typed = actionReason.trim();
    const reasonText = typed || t.defaultReason;
    const name = userName;
    const copy = {
      WARN: { title: t.confirmWarnTitle(name), description: t.confirmWarnDesc(reasonText), confirmLabel: t.warn, variant: 'warning' as const },
      TIMEOUT: { title: t.confirmTimeoutTitle(name), description: t.confirmTimeoutDesc(actionDuration, reasonText), confirmLabel: t.exclude, variant: 'warning' as const },
      KICK: { title: t.confirmKickTitle(name), description: t.confirmKickDesc(reasonText), confirmLabel: t.kick, variant: 'danger' as const },
      BAN: { title: t.confirmBanTitle(name), description: t.confirmBanDesc(reasonText), confirmLabel: t.ban, variant: 'danger' as const },
    }[action];
    ask({
      ...copy,
      run: () => {
        const edit = editsOf(id);
        const type: DashboardSanctionType = action;
        edit.sanctions.unshift({
          id: `demo-sanction-${id}-${edit.sanctions.length + 1}`,
          type,
          createdAt: new Date().toISOString(),
          reason: typed || null,
          durationSeconds: action === 'TIMEOUT' ? DURATIONS[actionDuration] ?? 1800 : null,
        });
        if (action === 'KICK' || action === 'BAN') edit.removed = true;
        actionReason = '';
        notify(t.actionDone(action));
      },
    });
  }

  // --- Comptes liés ---
  let targetAccountId = $state('');
  let linkReason = $state('');
  let linkFeedback = $state('');
  let linkIsError = $state(false);

  function handleLinkAccount() {
    if (!viewedId) return;
    const wanted = targetAccountId.trim().replace(/^@/, '').toLowerCase();
    if (!wanted) {
      linkIsError = true;
      linkFeedback = t.idRequired;
      return;
    }
    // L'aperçu ne connaît que son casting : l'ID ou le pseudo d'un des membres.
    const target = castById(wanted) ?? CAST.find((m) => m.username.toLowerCase() === wanted);
    const already = caseData?.linkedAccounts.some((a) => a.userId === target?.userId);
    if (!target || target.userId === viewedId || already) {
      linkIsError = true;
      linkFeedback = t.linkError;
      return;
    }
    const edit = editsOf(viewedId);
    edit.unlinked = edit.unlinked.filter((idx) => idx !== target.userId);
    if (!memberCaseFor(viewedId, locale)?.linkedAccounts.some((a) => a.userId === target.userId)) {
      edit.linked.push({ userId: target.userId, userTag: target.username, avatarUrl: target.avatarUrl, type: 'MANUAL', status: 'VALIDATED' });
    }
    linkIsError = false;
    linkFeedback = t.linkSuccess;
    targetAccountId = '';
    linkReason = '';
  }

  function handleUnlinkAccount(targetId: string) {
    if (!viewedId) return;
    const id = viewedId;
    ask({
      title: t.unlinkTitle,
      confirmLabel: t.unlinkConfirm,
      variant: 'warning',
      run: () => {
        const edit = editsOf(id);
        edit.linked = edit.linked.filter((a) => a.userId !== targetId);
        if (!edit.unlinked.includes(targetId)) edit.unlinked.push(targetId);
      },
    });
  }

  const crossServerLinks = $derived(caseData?.crossServerLinks ?? null);
  const crossServerLinkSuggestions = $derived(crossServerLinks?.suggestions ?? []);
  const pendingCrossServerLinks = $derived(crossServerLinkSuggestions.filter((s) => !s.alreadyLinkedHere));

  // --- Notes ---
  let moderatorNote = $state('');
  let noteFeedback = $state('');

  $effect(() => {
    void viewedId;
    void locale;
    untrack(() => {
      moderatorNote = caseData?.profile?.moderatorNote ?? '';
      noteFeedback = '';
    });
  });

  function handleSaveNote() {
    if (!viewedId) return;
    editsOf(viewedId).note = moderatorNote;
    noteFeedback = t.noteSaved;
  }

  // --- Rapport de sanction ---
  let viewingReportSanctionId = $state<string | null>(null);
  let isEditingReport = $state(false);
  let editReportData = $state({ incidentAt: '', sanctionDurationLabel: '', selectedRuleIds: [] as string[], detailedReason: '', additionalNotes: '' });

  const selectedSanctionForReport = $derived(sanctions.find((s) => s.id === viewingReportSanctionId) ?? null);
  const selectedReport = $derived(viewingReportSanctionId ? caseData?.sanctionReports.find((r) => r.sanctionId === viewingReportSanctionId) ?? null : null);

  function ruleIdsOf(brokenRules: string): string[] {
    try {
      return (JSON.parse(brokenRules) as Array<{ id: string }>).map((r) => r.id);
    } catch {
      return [];
    }
  }
  const selectedReportRules = $derived(selectedReport ? rules.filter((r) => ruleIdsOf(selectedReport.brokenRules).includes(r.id)) : []);
  const editDraftRules = $derived(rules.filter((r) => editReportData.selectedRuleIds.includes(r.id)));

  function toDateTimeLocal(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function startEditingReport() {
    if (!selectedReport) return;
    editReportData = {
      incidentAt: toDateTimeLocal(selectedReport.incidentAt),
      sanctionDurationLabel: selectedReport.sanctionDurationLabel || '',
      selectedRuleIds: ruleIdsOf(selectedReport.brokenRules),
      detailedReason: selectedReport.detailedReason,
      additionalNotes: selectedReport.additionalNotes || '',
    };
    isEditingReport = true;
  }

  function handleUpdateReport() {
    if (!viewedId || !selectedReport) return;
    const at = new Date(editReportData.incidentAt);
    editsOf(viewedId).reports[selectedReport.id] = {
      incidentAt: Number.isNaN(at.getTime()) ? selectedReport.incidentAt : at.toISOString(),
      sanctionDurationLabel: editReportData.sanctionDurationLabel.trim() || null,
      ruleIds: editReportData.selectedRuleIds,
      detailedReason: editReportData.detailedReason,
      additionalNotes: editReportData.additionalNotes.trim() || null,
    };
    isEditingReport = false;
  }

  let reportOpener: HTMLElement | null = null;

  function openReport(sanctionId: string, event: MouseEvent) {
    reportOpener = event.currentTarget as HTMLElement;
    viewingReportSanctionId = sanctionId;
  }

  function closeReport() {
    viewingReportSanctionId = null;
    isEditingReport = false;
    reportOpener?.focus({ preventScroll: true });
    reportOpener = null;
  }

  // Le focus suit la fenêtre du rapport (ouverture, passage en édition et retour) :
  // sans lui, Échap n'atteindrait plus la fenêtre après un enregistrement.
  $effect(() => {
    if (!viewingReportSanctionId) return;
    void isEditingReport;
    void tick().then(() => {
      const footer = document.querySelector<HTMLElement>('.app-modal--above-case .app-modal__footer');
      footer?.querySelector<HTMLElement>('button:last-of-type')?.focus({ preventScroll: true });
    });
  });

  // --- Onglets ---
  const tabs = $derived([
    ...(showExtra && extraTab ? [{ id: 'extra' as const, label: extraTab.label, icon: extraTab.icon }] : []),
    { id: 'resume' as const, label: t.tabs.resume, icon: 'layout' },
    { id: 'identite' as const, label: t.tabs.identite, icon: 'user' },
    { id: 'analytics' as const, label: t.tabs.analytics, icon: 'bar-chart-2' },
    { id: 'messages' as const, label: t.tabs.messages, icon: 'message-square', count: caseData?.recentMessageCount ?? 0 },
    { id: 'logs' as const, label: t.tabs.logs, icon: 'history', count: caseData?.logs.length ?? 0 },
    { id: 'sanctions' as const, label: t.tabs.sanctions, icon: 'hammer', count: sanctions.length },
    { id: 'connexions' as const, label: t.tabs.connexions, icon: 'link' },
    { id: 'linked_accounts' as const, label: t.tabs.linked_accounts, icon: 'link-2', count: (caseData?.linkedAccounts?.length ?? 0) + pendingCrossServerLinks.length },
    { id: 'notes' as const, label: t.tabs.notes, icon: 'edit-3' },
  ]);
  const visibleTabs = $derived(tabs.map((tab) => {
    const count = 'count' in tab ? tab.count : 0;
    return { id: tab.id, label: tab.label, icon: tab.icon, badge: count && count > 0 ? count : undefined };
  }));

  const displayName = $derived(profile?.displayName || profile?.globalName || userName);

  // --- Formats ---
  function formatDateTime(value: string | null | undefined) {
    if (!value) return t.unknown;
    return new Date(value).toLocaleString(dateLocale());
  }

  function formatDateShort(value: string | null | undefined) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString(dateLocale(), { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatVerificationDate(value: string | null | undefined): string {
    if (!value) return t.verifNever;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t.verifNever;
    return date.toLocaleString(dateLocale(), { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function formatDurationFromSeconds(seconds: number | null | undefined) {
    if (!seconds || seconds <= 0) return '0s';
    const total = Math.floor(seconds);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const parts: string[] = [];
    if (days) parts.push(`${days}${t.dayUnit}`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (parts.length === 0) parts.push(`${total}s`);
    return parts.join(' ');
  }

  function formatRelative(value: string | null | undefined) {
    if (!value) return t.never;
    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (diff < 60000) return t.justNow;
    if (minutes < 60) return t.agoMinutes(minutes);
    if (hours < 24) return t.agoHours(hours);
    if (days < 7) return t.agoDays(days);
    return date.toLocaleDateString(dateLocale(), { day: '2-digit', month: 'short' });
  }

  function getDurationSince(value: string | null | undefined) {
    if (!value) return t.unknown;
    const start = new Date(value);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    const parts: string[] = [];
    if (years > 0) parts.push(t.years(years));
    if (months > 0) parts.push(t.months(months));
    if (parts.length === 0) {
      const days = Math.floor((now.getTime() - start.getTime()) / 86400000);
      if (days <= 0) return t.today;
      return t.days(days);
    }
    return parts.join(', ');
  }

  function getPresenceColor(status: string | null | undefined) {
    const s = status?.toLowerCase();
    if (s === 'online') return 'bg-success';
    if (s === 'idle') return 'bg-warning';
    if (s === 'dnd' || s === 'left') return 'bg-error';
    return 'bg-on-surface-variant/50';
  }

  function getPresenceLabel(status: string | null | undefined) {
    return t.presence[status?.toLowerCase() ?? 'offline'] ?? t.presence.offline;
  }

  function getConnectionIcon(type: string) {
    const kind = type.toLowerCase();
    if (kind === 'youtube') return 'video';
    // `tv` et `gamepad` n'existent ni chez Papicons ni dans le repli Lucide du
    // dashboard (point d'interrogation là-bas) : leurs voisines dessinées.
    if (kind === 'twitch') return 'monitor';
    if (kind === 'twitter' || kind === 'x') return 'twitter';
    if (kind === 'spotify') return 'music';
    if (kind === 'github') return 'github';
    if (kind === 'steam') return 'gamepad-2';
    if (kind === 'instagram') return 'instagram';
    return 'link';
  }

  function getSanctionTypeStyle(type: string): { icon: string; tile: string; dot: string } {
    switch (type.toUpperCase()) {
      case 'WARN': return { icon: 'alert-triangle', tile: 'bg-warning/10 text-warning', dot: 'bg-warning' };
      case 'TIMEOUT': return { icon: 'clock', tile: 'bg-primary/10 text-primary', dot: 'bg-primary' };
      case 'KICK': return { icon: 'log-out', tile: 'bg-warning/10 text-warning', dot: 'bg-warning' };
      case 'TEMP_BAN': return { icon: 'ban', tile: 'bg-error/10 text-error', dot: 'bg-error' };
      case 'BAN': return { icon: 'gavel', tile: 'bg-error/10 text-error', dot: 'bg-error' };
      default: return { icon: 'shield', tile: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-on-surface-variant' };
    }
  }

  const crossServer = $derived(caseData?.crossServerSanctions ?? null);
  const crossServerBreakdown = $derived(crossServer ? Object.entries(crossServer.breakdown).filter(([, count]) => count > 0) : []);

  const logUserNames = $derived(Object.fromEntries((caseData?.interactionGraph?.nodes ?? []).map((node) => [node.id, node.label])));

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !pending) {
      event.stopPropagation();
      onclose();
    }
  }
</script>

{#snippet quietEmpty(icon: string, title: string, description = '')}
  <div class="section-card flex flex-col items-center gap-1.5 px-6 py-12 text-center">
    <span class="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"><Papicon {icon} size={20} /></span>
    <p class="text-sm font-medium text-on-surface">{title}</p>
    {#if description}<p class="max-w-sm text-sm text-on-surface-variant">{description}</p>{/if}
  </div>
{/snippet}

{#snippet facts(rows: Array<{ label: string; value: string; tone?: string }>)}
  <dl class="mc-facts">
    {#each rows as row (row.label)}
      <div>
        <dt>{row.label}</dt>
        <dd class={row.tone ?? ''}>{row.value}</dd>
      </div>
    {/each}
  </dl>
{/snippet}

{#snippet roleChip(role: { name: string; color?: string | null })}
  <span class="mc-role">
    <span class="h-2 w-2 shrink-0 rounded-full" style="background: {role.color && role.color !== '#000000' ? role.color : 'var(--outline-variant)'}"></span>
    {role.name}
  </span>
{/snippet}

{#snippet toolbarSelect(value: string, onchange: (v: string) => void, options: Array<{ value: string; label: string }>, label: string)}
  <select class="input mc-select" aria-label={label} {value} onchange={(e) => onchange((e.currentTarget as HTMLSelectElement).value)}>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
{/snippet}

{#snippet ruleChips(list: Array<{ id: string; label: string; icon: string }>)}
  {#if list.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each list as rule (rule.id)}
        <span class="inline-flex items-center gap-1.5 rounded-full bg-sky-900/40 px-3 py-1 text-xs font-semibold text-sky-200">
          <Papicon icon={rule.icon} size={12} />
          <span>{rule.label}</span>
        </span>
      {/each}
    </div>
  {/if}
{/snippet}

<!-- Le cadre de `Modal` en taille « screen », dans sa variante petit écran
     (pleine hauteur, sans marge) : avec la marge de bureau, le dossier ne
     tenait pas dans les 720 px de l'aperçu. -->
{#if viewedId}
  <div class="app-modal absolute inset-0 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="{uid}-title">
    <div class="app-modal__panel relative flex h-full w-full flex-col overflow-hidden border border-outline-variant bg-surface-container-lowest shadow-lg">
      <div class="app-modal__body min-h-0 flex-1 overflow-y-auto">
        <div class="mc" role="presentation" bind:this={mcRoot} {onkeydown}>
          <!-- ── Identite ───────────────────────────────────────── -->
          <header class="mc-header">
            <div class="mc-identity">
              <div class="relative shrink-0">
                <img src={memberAvatarSrc(profile?.avatarUrl, displayName, viewedId)} alt={t.avatarAlt} class="h-14 w-14 rounded-xl bg-surface-container object-cover" />
                <span
                  class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface-container-lowest {getPresenceColor(profile?.presenceStatus)}"
                  title={getPresenceLabel(profile?.presenceStatus)}
                ></span>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 id="{uid}-title" class="truncate text-xl font-semibold tracking-tight text-on-surface">{displayName}</h2>
                  {#if profile?.staffGrade}
                    <span class="badge badge-info"><Papicon icon="star" size={11} />{profile.staffGrade}</span>
                  {/if}
                  {#if profile?.isTutor}
                    <span class="badge badge-info"><Papicon icon="user-check" size={11} />{t.tutor}</span>
                  {/if}
                  {#if verificationPending}
                    <span class="badge badge-warning"><Papicon icon="clock" size={11} />{t.verifPendingBadge}</span>
                  {:else if verifications?.lastVerifiedAt}
                    <span class="badge badge-success"><Papicon icon="check-circle" size={11} />{t.verifDoneBadge}</span>
                  {/if}
                </div>
                <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-on-surface-variant">
                  <span>@{profile?.username || userName}</span>
                  <span aria-hidden="true">·</span>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full {getPresenceColor(profile?.presenceStatus)}"></span>
                    {getPresenceLabel(profile?.presenceStatus)}
                  </span>
                  {#if profile?.pronouns}
                    <span aria-hidden="true">·</span>
                    <span>{profile.pronouns}</span>
                  {/if}
                </p>
              </div>
              <div class="mc-header-actions">
                {#if viewedId}
                  <Button
                    size="sm"
                    icon="shield-alert"
                    disabled={verificationBlocked}
                    disabledReason={verificationPending ? t.verifAlreadyPending : t.verifCooldown}
                    onexplain={(reason) => notify(reason, 'error')}
                    title={verifications?.lastRequestedAt ? t.verifRequestedOn(formatVerificationDate(verifications.lastRequestedAt)) : undefined}
                    onclick={handleRequestVerification}
                  >{t.requestVerification}</Button>
                {/if}
                <Button size="sm" variant="ghost" icon="x" aria-label={t.closeCase} data-case-close onclick={onclose} />
              </div>
            </div>
          </header>

          <!-- ── Onglets ────────────────────────────────────────── -->
          <div class="mc-tabs">
            <Tabs label={t.members} class="max-w-full" tabs={visibleTabs} active={activeTab} onchange={(id) => (activeTab = id as MemberCaseTab)} />
          </div>

          <!-- ── Contenu ────────────────────────────────────────── -->
          <div class="mc-body">
            {#if !viewedId}
              {@render quietEmpty('user-x', t.userNotFound, t.userNotFoundDesc)}
            {:else if !caseData}
              {@render quietEmpty('user-x', t.userNotFound, t.userNotFoundDesc)}
            {:else}
              <div class="grid grid-cols-[minmax(0,1fr)_18rem] items-start gap-4">
                <div class="min-w-0 space-y-4">
                  {#if caseData.isSuspectedDC}
                    <Callout variant="danger" icon="alert-octagon" title={t.dcTitle}>{t.dcDesc}</Callout>
                  {/if}

                  {#if activeTab === 'extra' && showExtra && extraTab}
                    {@render extraTab.content()}

                  {:else if activeTab === 'resume'}
                    <section class="section-card p-5" aria-label={t.tabs.resume}>
                      <dl class="mc-kpis">
                        <div>
                          <dt><Papicon icon="calendar" size={13} />{t.serverPresence}</dt>
                          <dd>{getDurationSince(profile?.guildJoinedAt)}
                            <span>{t.joinedOn(formatDateShort(profile?.guildJoinedAt))}</span>
                          </dd>
                        </div>
                        <div>
                          <dt><Papicon icon="user" size={13} />{t.accountAge}</dt>
                          <dd>{getDurationSince(profile?.accountCreatedAt)}
                            <span>{t.createdOn(formatDateShort(profile?.accountCreatedAt))}</span>
                          </dd>
                        </div>
                        <div>
                          <dt><Papicon icon="message-square" size={13} />{t.messages}</dt>
                          <dd class="tabular-nums">{fmtNumber(profile?.messageCount)}
                            <span>{t.voice} : {formatDurationFromSeconds(profile?.voiceTimeSeconds)}</span>
                          </dd>
                        </div>
                        <div>
                          <dt><Papicon icon="hammer" size={13} />{t.sanctions}</dt>
                          <dd class="tabular-nums {activeSanctionCount ? 'text-error' : ''}">{sanctions.length}
                            <span class={activeSanctionCount ? 'text-error' : ''}>{t.activeSanctions(activeSanctionCount)}</span>
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <SectionCard title={t.trendTitle} description={t.trendDesc}>
                      {#snippet actions()}
                        <Button size="sm" variant="ghost" iconRight="arrow-right" onclick={() => (activeTab = 'analytics')}>{t.tabs.analytics}</Button>
                      {/snippet}
                      {#if hasTrend && selectedMetric}
                        <div class="space-y-3">
                          <MetricTabs metrics={memberMetrics} active={selectedMetric.id} onchange={(id) => (trendMetric = id as 'messages' | 'voice')} compare label={t.trendTitle} />
                          <TrendChart
                            labels={trendLabels}
                            main={{ label: selectedMetric.label, color: selectedMetric.color, values: selectedMetric.daily }}
                            previous={{ label: t.previousPeriod, values: selectedMetric.prevDaily }}
                            format={selectedMetric.format}
                            height={resumeChartHeight}
                          />
                        </div>
                      {:else}
                        <p class="py-6 text-center text-sm text-on-surface-variant">{t.statsUnavailable}</p>
                      {/if}
                    </SectionCard>

                  {:else if activeTab === 'identite'}
                    <!-- Mêmes cartes que le dashboard, rangées en deux colonnes libres
                         plutôt qu'en grille à rangées alignées : elles tiennent ainsi
                         dans la hauteur du cadre. -->
                    <div class="grid grid-cols-2 items-start gap-4">
                      <div class="space-y-4">
                        <SectionCard title={t.fullProfile}>
                          {@render facts([
                            { label: t.discordId, value: profile?.userId ?? viewedId ?? '' },
                            { label: t.username, value: `@${profile?.username ?? t.unknown}` },
                            { label: t.globalName, value: profile?.globalName ?? t.unknown },
                            { label: t.serverNickname, value: profile?.displayName ?? t.unknown },
                            { label: t.pronouns, value: profile?.pronouns ?? t.notSpecified },
                            { label: t.languageLocale, value: profile?.locale ?? t.unknownF },
                            // Le dashboard en fait une carte « Statut staff » à part ; ses deux
                            // lignes rejoignent ici le profil pour que la colonne tienne.
                            ...(profile?.staffGrade
                              ? [
                                  { label: t.currentGrade, value: profile.staffGrade },
                                  { label: t.tutorStatus, value: profile.isTutor ? t.tutorYes : t.tutorNo },
                                ]
                              : []),
                          ])}
                        </SectionCard>

                        <SectionCard title={t.roles(caseData.roles.length)}>
                          {#if caseData.roles.length}
                            <div class="flex flex-wrap gap-1.5">
                              {#each caseData.roles as role, ri (ri)}
                                {@render roleChip(role)}
                              {/each}
                            </div>
                            {#if caseData.effectivePermissions.length && !profile?.staffGrade}
                              <p class="mt-4 text-xs text-on-surface-variant">{t.keyPermissions}</p>
                              <p class="mt-1 text-sm text-on-surface">{caseData.effectivePermissions.slice(0, 4).join(' · ')}</p>
                            {/if}
                          {:else}
                            <p class="text-sm text-on-surface-variant">{t.noRole}</p>
                          {/if}
                        </SectionCard>
                      </div>

                      <div class="space-y-4">
                        <SectionCard title={t.keyDates}>
                          {@render facts([
                            { label: t.accountCreation, value: formatDateTime(profile?.accountCreatedAt) },
                            { label: t.serverJoin, value: formatDateTime(profile?.guildJoinedAt) },
                            ...(profile?.guildLeftAt ? [{ label: t.lastLeave, value: formatDateTime(profile.guildLeftAt), tone: 'text-error' }] : []),
                            { label: t.firstSeen, value: formatDateTime(profile?.firstSeenAt) },
                            { label: t.lastSeen, value: formatDateTime(profile?.lastSeenAt) },
                          ])}
                        </SectionCard>

                        <!-- Vérifications : trace partagée entre modérateurs pour ne pas
                             redemander ce qu'un collègue a déjà lancé. -->
                        <SectionCard title={t.verifHistory} description={t.verifCount(verifications?.total ?? 0)}>
                          {#if verificationEntries.length === 0}
                            <p class="text-sm text-on-surface-variant">{t.verifEmpty}</p>
                          {:else}
                            {@render facts([
                              { label: t.verifLastRequest, value: formatVerificationDate(verifications?.lastRequestedAt) },
                              { label: t.verifLastVerified, value: formatVerificationDate(verifications?.lastVerifiedAt) },
                            ])}
                            <ul class="mt-4 space-y-2">
                              {#each verificationEntries.slice(0, 1) as entry (entry.id)}
                                <li class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-container px-3 py-2.5">
                                  <div class="min-w-0">
                                    <p class="text-sm text-on-surface">{t.verifRequestedOn(formatVerificationDate(entry.requestedAt))}</p>
                                    {#if entry.verifiedAt}
                                      <p class="text-xs text-on-surface-variant">{t.verifVerifiedOn(formatVerificationDate(entry.verifiedAt))}</p>
                                    {/if}
                                  </div>
                                  <span class="badge {VERIFICATION_STATUS_STYLES[entry.status] ?? VERIFICATION_STATUS_STYLES.EXPIRED}">{t.verifStatus[entry.status] ?? t.verifStatus.EXPIRED}</span>
                                </li>
                              {/each}
                            </ul>
                          {/if}
                        </SectionCard>

                      </div>
                    </div>

                  {:else if activeTab === 'analytics'}
                    {#if hasTrend}
                      <div class="grid grid-cols-2 gap-4">
                        {#each memberMetrics as metric (metric.id)}
                          <SectionCard title={metric.id === 'messages' ? t.messageVolume : t.voiceActivity} description={metric.id === 'messages' ? t.last30 : t.minutesPerDay}>
                            {#snippet actions()}
                              <span class="text-right">
                                <span class="block text-lg font-semibold tabular-nums text-on-surface">{metric.value}</span>
                                {#if metric.delta !== null && metric.delta !== undefined}
                                  <span class="block text-xs {metric.delta >= 0 ? 'text-success' : 'text-error'}">{metric.delta >= 0 ? '+' : ''}{Math.round(metric.delta)} %</span>
                                {/if}
                              </span>
                            {/snippet}
                            <TrendChart
                              labels={trendLabels}
                              main={{ label: metric.label, color: metric.color, values: metric.daily }}
                              previous={{ label: t.previousPeriod, values: metric.prevDaily }}
                              format={metric.format}
                              height={300}
                            />
                          </SectionCard>
                        {/each}
                      </div>
                    {:else}
                      {@render quietEmpty('bar-chart-2', t.noAnalytics, t.noAnalyticsDesc)}
                    {/if}

                  {:else if activeTab === 'messages'}
                    <div class="mc-toolbar">
                      <div class="mc-search relative">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><Papicon icon="search" size={15} /></span>
                        <input type="search" class="input" style="padding-left: 2.25rem;" placeholder={t.searchMessages} aria-label={t.searchMessages} bind:value={messageQuery} />
                      </div>
                      {@render toolbarSelect(messageChannelId, (v) => (messageChannelId = v), [
                        { value: '', label: t.allChannels },
                        ...messagesChannels.map((c) => ({ value: c.channelId, label: `#${c.channelName} (${c.count})` })),
                      ], t.allChannels)}
                      <label class="mc-date">
                        <span>{t.dateFrom}</span>
                        <input type="date" class="input" bind:value={messageFrom} />
                      </label>
                      <label class="mc-date">
                        <span>{t.dateTo}</span>
                        <input type="date" class="input" bind:value={messageTo} />
                      </label>
                      <label class="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-on-surface-variant">
                        <input type="checkbox" class="h-4 w-4 accent-[var(--primary-color)]" bind:checked={messageIncludeDeleted} />
                        {t.showDeleted}
                      </label>
                    </div>

                    {#if messagesList.length === 0}
                      <div class="section-card">
                        <EmptyState icon="message-square" title={t.noMessageFound} description={t.noMessageFoundDesc} actionLabel={t.clearFilters} actionIcon="rotate-ccw" onAction={() => { messageQuery = ''; messageChannelId = ''; messageFrom = ''; messageTo = ''; messageIncludeDeleted = true; }} />
                      </div>
                    {:else}
                      <ul class="section-card divide-y divide-outline-variant overflow-hidden">
                        {#each messagesList as msg (msg.id)}
                          <li class="px-5 py-3.5 {msg.deletedAt ? 'bg-error/5' : ''}">
                            <div class="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                              <span class="font-medium text-primary">#{msg.channelName}</span>
                              <span>{formatDateTime(msg.createdAt)}</span>
                              {#if msg.editedAt}
                                <span class="badge badge-warning" title={t.editedOn(formatDateTime(msg.editedAt))}>{t.edited}</span>
                              {/if}
                              {#if msg.deletedAt}
                                <span class="badge badge-danger" title={t.deletedOn(formatDateTime(msg.deletedAt))}>{t.deleted}</span>
                              {/if}
                            </div>
                            <p class="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-on-surface">
                              {msg.content || (msg.hasAttachment ? t.emptyWithAttachments : t.emptyContent)}
                            </p>
                            {#if msg.attachments.length > 0}
                              <div class="mt-2 flex flex-wrap gap-2">
                                {#each msg.attachments as att, ai (ai)}
                                  <span class="mc-role text-primary"><Papicon icon="file" size={13} /><span class="max-w-40 truncate" title={att.name}>{att.name}</span></span>
                                {/each}
                              </div>
                            {/if}
                          </li>
                        {/each}
                      </ul>
                    {/if}

                  {:else if activeTab === 'logs'}
                    <div class="mc-toolbar">
                      <div class="mc-search relative">
                        <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><Papicon icon="search" size={15} /></span>
                        <input type="search" class="input" style="padding-left: 2.25rem;" placeholder={t.searchLogs} aria-label={t.searchLogs} bind:value={logQuery} />
                      </div>
                      {@render toolbarSelect(logModule, (v) => (logModule = v), [{ value: '', label: t.allModules }, ...logModules.map((x) => ({ value: x, label: x }))], t.allModules)}
                      {@render toolbarSelect(logSource, (v) => (logSource = v), [{ value: '', label: t.allSources }, ...logSources.map((x) => ({ value: x, label: x }))], t.allSources)}
                      <label class="mc-date"><span>{t.dateFrom}</span><input type="date" class="input" bind:value={logFrom} /></label>
                      <label class="mc-date"><span>{t.dateTo}</span><input type="date" class="input" bind:value={logTo} /></label>
                      {@render toolbarSelect(logOrder, (v) => (logOrder = v as 'asc' | 'desc'), [{ value: 'desc', label: t.sortNewest }, { value: 'asc', label: t.sortOldest }], t.sortNewest)}
                    </div>
                    <p class="text-xs text-on-surface-variant">{t.logsShown(filteredLogs.length, caseData.logs.length)}</p>

                    {#if filteredLogs.length === 0}
                      {#if caseData.logs.length === 0}
                        {@render quietEmpty('history', t.noLog)}
                      {:else}
                        <div class="section-card"><EmptyState icon="search" title={t.noLogMatch} actionLabel={t.clearFilters} actionIcon="rotate-ccw" onAction={() => { logQuery = ''; logModule = ''; logSource = ''; logFrom = ''; logTo = ''; }} /></div>
                      {/if}
                    {:else}
                      <ol class="section-card mc-timeline">
                        {#each filteredLogs as log (log.id)}
                          <li class="mc-event">
                            <span class="mc-event__dot" aria-hidden="true"></span>
                            <div class="min-w-0 flex-1">
                              <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                                <p class="text-sm font-medium text-on-surface">{log.action}</p>
                                <time class="text-xs tabular-nums text-on-surface-variant" datetime={log.dateIso}>{formatDateTime(log.dateIso)}</time>
                              </div>
                              <p class="text-xs text-on-surface-variant">{log.module} · {log.source}</p>
                              {#if log.details}
                                <!-- `LogDetails` du dashboard, réduit au texte du membre et au salon. -->
                                <div class="mt-2 space-y-2 rounded-lg bg-surface-container px-3 py-2.5 text-sm">
                                  <p class="whitespace-pre-wrap border-l-2 border-primary/40 pl-3 leading-relaxed text-on-surface">{log.details}</p>
                                  {#if log.channelId}
                                    {@const channelName = caseData.messagesByChannel.find((c) => c.channelId === log.channelId)?.channelName ?? log.channelId}
                                    <div class="flex flex-wrap items-center gap-1.5 text-2xs">
                                      <span class="log-chip"><span class="text-on-surface-variant">{t.channelLabel}</span><span class="text-on-surface">#{channelName}</span></span>
                                    </div>
                                  {/if}
                                </div>
                              {/if}
                            </div>
                          </li>
                        {/each}
                      </ol>
                    {/if}

                  {:else if activeTab === 'sanctions'}
                    {#if crossServer?.enabled && crossServer.total > 0}
                      <SectionCard icon="globe" title={t.crossServer} description="{t.crossCount(crossServer.total)} {t.crossOn(crossServer.serverCount)}" flush>
                        {#snippet actions()}
                          <div class="flex flex-wrap justify-end gap-1.5">
                            {#each crossServerBreakdown as [type, count] (type)}
                              <span class="badge badge-neutral"><span class="h-1.5 w-1.5 rounded-full {getSanctionTypeStyle(type).dot}"></span>{typeLabel(type)} {count}</span>
                            {/each}
                          </div>
                        {/snippet}
                        <ul class="divide-y divide-outline-variant">
                          {#each crossServer.recent as entry, i (i)}
                            {@const style = getSanctionTypeStyle(entry.type)}
                            <li class="flex items-center gap-3 px-5 py-3">
                              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {style.tile}"><Papicon icon={style.icon} size={15} /></span>
                              <div class="min-w-0 flex-1">
                                <p class="text-sm text-on-surface">
                                  <span class="font-medium">{typeLabel(entry.type)}</span>
                                  {#if entry.durationSeconds}<span class="text-on-surface-variant"> · {formatDurationFromSeconds(entry.durationSeconds)}</span>{/if}
                                </p>
                                {#if entry.reason?.trim()}<p class="truncate text-xs text-on-surface-variant" title={entry.reason}>{entry.reason}</p>{/if}
                                <p class="truncate text-xs text-on-surface-variant" title={entry.guildName}>{entry.guildName}</p>
                              </div>
                              <span class="badge {entry.status === 'ACTIVE' ? 'badge-danger' : 'badge-success'}">{t.status[entry.status] ?? entry.status}</span>
                              <span class="block w-20 shrink-0 text-right text-xs text-on-surface-variant">{formatRelative(entry.createdAt)}</span>
                            </li>
                          {/each}
                        </ul>
                        <div class="flex items-center justify-between gap-3 border-t border-outline-variant px-5 py-2.5 text-xs text-on-surface-variant">
                          <span class="inline-flex items-center gap-1.5"><Papicon icon="lock" size={12} />{t.sameInstance}</span>
                          {#if crossServer.total > crossServer.recent.length}
                            <span>{t.crossMore(crossServer.total - crossServer.recent.length)}</span>
                          {/if}
                        </div>
                      </SectionCard>
                    {/if}

                    {#if sanctions.length === 0}
                      {@render quietEmpty('check-circle', t.cleanRecord)}
                    {:else}
                      <div class="section-card overflow-hidden">
                        <table class="mc-table">
                          <thead>
                            <tr>
                              <th scope="col">{t.colDate}</th>
                              <th scope="col">{t.colAction}</th>
                              <th scope="col">{t.colStatus}</th>
                              <th scope="col">{t.colReason}</th>
                              <th scope="col"><span class="sr-only">{t.colReport}</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each sanctions as sanction (sanction.id)}
                              {@const style = getSanctionTypeStyle(sanction.type)}
                              {@const hasReport = caseData.sanctionReports.some((r) => r.sanctionId === sanction.id)}
                              <tr>
                                <td class="whitespace-nowrap text-on-surface-variant">{formatDateShort(sanction.createdAt)}</td>
                                <td>
                                  <span class="inline-flex items-center gap-2">
                                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg {style.tile}"><Papicon icon={style.icon} size={13} /></span>
                                    <span>
                                      <span class="block font-medium text-on-surface">{typeLabel(sanction.type)}</span>
                                      <span class="block text-xs text-on-surface-variant">{t.byModerator(sanction.moderatorTag)}</span>
                                    </span>
                                  </span>
                                </td>
                                <td><span class="badge {sanction.status === 'ACTIVE' ? 'badge-danger' : 'badge-success'}">{t.status[sanction.status] ?? sanction.status}</span></td>
                                <td class="max-w-xs"><span class="line-clamp-2 text-on-surface-variant" title={sanction.reason}>{sanction.reason}</span></td>
                                <td class="whitespace-nowrap text-right">
                                  {#if hasReport}
                                    <Button size="sm" icon="file-text" onclick={(event) => openReport(sanction.id, event)}>{t.report}</Button>
                                  {:else}
                                    <span class="text-xs text-on-surface-variant">{t.noReport}</span>
                                  {/if}
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    {/if}

                  {:else if activeTab === 'connexions'}
                    <SectionCard title={t.interactionGraph} description={t.topContacts(caseData.interactionGraph.nodes.length - 1)} flush>
                      <div class="w-full {caseData.connections.length ? 'h-[300px]' : 'h-[400px]'}">
                        <InteractionTree nodes={caseData.interactionGraph.nodes} edges={caseData.interactionGraph.edges} onSelectNode={selectUser} />
                      </div>
                    </SectionCard>
                    {#if caseData.connections.length}
                      <div class="grid grid-cols-3 gap-3">
                        {#each caseData.connections as connection, i (i)}
                          <div class="section-card flex items-center gap-3 p-4">
                            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant"><Papicon icon={getConnectionIcon(connection.type)} size={16} /></span>
                            <span class="min-w-0">
                              <span class="block truncate text-sm font-medium text-on-surface">{connection.name}</span>
                              <span class="block text-xs text-on-surface-variant">{connection.type}</span>
                            </span>
                          </div>
                        {/each}
                      </div>
                    {:else if caseData.interactionGraph.nodes.length === 0}
                      {@render quietEmpty('link-2', t.noExternalLink)}
                    {/if}

                  {:else if activeTab === 'linked_accounts'}
                    {#if crossServerLinks?.enabled && crossServerLinkSuggestions.length > 0}
                      <SectionCard icon="globe" title={t.xlinkTitle} description="{t.xlinkCount(crossServerLinkSuggestions.length)} {t.xlinkOn(crossServerLinks.serverCount)}" flush>
                        <ul class="divide-y divide-outline-variant">
                          {#each crossServerLinkSuggestions as suggestion (suggestion.userId)}
                            <li class="flex flex-wrap items-center gap-3 px-5 py-3.5">
                              <img src={memberAvatarSrc(suggestion.avatarUrl, suggestion.userTag, suggestion.userId)} alt="" class="h-9 w-9 shrink-0 rounded-full object-cover" />
                              <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                  <span class="truncate text-sm font-medium text-on-surface">{suggestion.userTag}</span>
                                  <span class="badge badge-neutral">{t.xlinkServers(suggestion.serverCount)}</span>
                                  {#if !suggestion.presentOnGuild}<span class="badge badge-neutral">{t.xlinkAbsent}</span>{/if}
                                </div>
                                <div class="mt-1 flex flex-wrap items-center gap-1.5">
                                  {#each suggestion.guilds as guild, gi (gi)}
                                    <span class="badge {guild.status === 'VALIDATED' ? 'badge-success' : 'badge-warning'}">
                                      <span class="max-w-[14rem] truncate">{guild.guildName}</span>
                                      <span class="opacity-70">· {guild.type === 'MANUAL' ? t.xlinkManual : t.xlinkAuto}</span>
                                    </span>
                                  {/each}
                                </div>
                              </div>
                              <div class="flex shrink-0 items-center gap-2">
                                <span class="badge badge-neutral" title={t.xlinkScoreHint}>{t.xlinkScore(suggestion.score)}</span>
                                {#if caseData.linkedAccounts.some((a) => a.userId === suggestion.userId)}
                                  <span class="badge badge-success"><Papicon icon="check" size={11} />{t.xlinkAlready}</span>
                                {/if}
                              </div>
                            </li>
                          {/each}
                        </ul>
                        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant px-5 py-2.5 text-xs text-on-surface-variant">
                          <span class="inline-flex items-center gap-1.5"><Papicon icon="lock" size={12} />{t.sameInstance}</span>
                          <span>{t.xlinkFooter}</span>
                        </div>
                      </SectionCard>
                    {/if}

                    <SectionCard icon="link-2" title={t.linkManually}>
                      <div class="grid grid-cols-2 gap-4">
                        <Field label={t.targetId} required>
                          {#snippet children(id)}
                            <input {id} class="input" placeholder="demo-2004" bind:value={targetAccountId} />
                          {/snippet}
                        </Field>
                        <Field label={t.linkReason}>
                          {#snippet children(id)}
                            <input {id} class="input" placeholder={t.linkReasonPlaceholder} bind:value={linkReason} />
                          {/snippet}
                        </Field>
                      </div>
                      <div class="mt-4 flex items-center justify-end gap-3">
                        {#if linkFeedback}
                          <p class="mr-auto text-sm {linkIsError ? 'text-error' : 'text-success'}" aria-live="polite">{linkFeedback}</p>
                        {/if}
                        <Button variant="primary" icon="link-2" disabled={!targetAccountId} disabledReason={t.idRequired} onexplain={(reason) => { linkIsError = true; linkFeedback = reason; }} onclick={handleLinkAccount}>{t.linkAccounts}</Button>
                      </div>
                    </SectionCard>

                    {#if caseData.linkedAccounts.length > 0}
                      <div class="grid grid-cols-2 gap-3">
                        {#each caseData.linkedAccounts as link (link.userId)}
                          <div class="section-card flex items-center gap-3 p-4">
                            <img src={memberAvatarSrc(link.avatarUrl, link.userTag, link.userId)} alt="" class="h-10 w-10 shrink-0 rounded-full object-cover" />
                            <div class="min-w-0 flex-1">
                              <div class="flex items-center gap-2">
                                <span class="truncate text-sm font-medium text-on-surface">{link.userTag}</span>
                                <span class="badge {link.status === 'VALIDATED' ? 'badge-success' : 'badge-warning'}">{t.linkStatus[link.status] ?? link.status}</span>
                              </div>
                              <p class="text-xs text-on-surface-variant">{t.linkType[link.type] ?? link.type} · {link.userId}</p>
                            </div>
                            <Button size="sm" variant="ghost" icon="trash-2" aria-label={t.unlinkAccount} title={t.unlinkAccount} onclick={() => handleUnlinkAccount(link.userId)} />
                          </div>
                        {/each}
                      </div>
                    {:else}
                      {@render quietEmpty('user-plus', t.noLinked)}
                    {/if}

                  {:else if activeTab === 'notes'}
                    <SectionCard title={t.modNotes} description={t.modNotesDesc}>
                      <label for="moderator-note-textarea" class="sr-only">{t.modNotes}</label>
                      <textarea id="moderator-note-textarea" class="input min-h-[260px] resize-none" bind:value={moderatorNote} placeholder={t.notePlaceholder} oninput={() => (noteFeedback = '')}></textarea>
                      <div class="mt-4 flex items-center justify-between gap-3">
                        <span class="text-sm text-success" aria-live="polite">{noteFeedback}</span>
                        <Button variant="primary" icon="save" onclick={handleSaveNote}>{t.save}</Button>
                      </div>
                    </SectionCard>
                  {/if}
                </div>

                <!-- ── Colonne de moderation ───────────────────────── -->
                <aside class="space-y-4">
                  <section class="section-card p-4" aria-labelledby="mc-risk">
                    <div class="flex items-baseline justify-between gap-2">
                      <h3 id="mc-risk" class="text-sm font-semibold text-on-surface">{t.riskScore}</h3>
                      <span class="text-xs text-on-surface-variant">{memberSeniority}</span>
                    </div>
                    <div class="mt-3 flex items-baseline gap-2">
                      <span class="text-2xl font-semibold tabular-nums tracking-tight {riskTone === 'success' ? 'text-success' : riskTone === 'warning' ? 'text-warning' : 'text-error'}">{moderationRiskScore}</span>
                      <span class="text-sm text-on-surface-variant">/100</span>
                      <span class="badge ml-auto {riskTone === 'success' ? 'badge-success' : riskTone === 'warning' ? 'badge-warning' : 'badge-danger'}">
                        {moderationRiskScore < 30 ? t.riskLow : moderationRiskScore < 70 ? t.riskHigh : t.riskCritical}
                      </span>
                    </div>
                    <div class="mc-meter mt-2" aria-hidden="true"><span class={riskTone === 'success' ? 'bg-success' : riskTone === 'warning' ? 'bg-warning' : 'bg-error'} style="width: {moderationRiskScore}%"></span></div>
                    <p class="mt-2 text-xs leading-relaxed text-on-surface-variant">{t.riskDesc}</p>
                  </section>

                  <section class="section-card p-4" aria-labelledby="mc-actions">
                    <h3 id="mc-actions" class="text-sm font-semibold text-on-surface">{t.modActions}</h3>
                    <div class="mt-3 space-y-3">
                      <Field label={t.sanctionReason} id="mod-reason">
                        {#snippet children(id)}
                          <textarea {id} class="input resize-none" rows="2" placeholder={t.reasonPlaceholder} bind:value={actionReason}></textarea>
                        {/snippet}
                      </Field>
                      <Field label={t.durationTimeout}>
                        {#snippet children(id)}
                          <select {id} class="input" bind:value={actionDuration}>
                            {#each Object.entries(t.durations) as [value, label] (value)}
                              <option {value}>{label}</option>
                            {/each}
                          </select>
                        {/snippet}
                      </Field>
                      <!-- Le dashboard empile Avertir et Exclure temporairement en pleine
                           largeur ; côte à côte ici, pour que la colonne tienne dans le cadre. -->
                      <div class="space-y-2 pt-1">
                        <div class="grid grid-cols-2 gap-2">
                          <Button icon="alert-triangle" onclick={() => executeModerationAction('WARN')}>{t.warn}</Button>
                          <Button icon="clock" title={t.timeout} onclick={() => executeModerationAction('TIMEOUT')}>{t.exclude}</Button>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                          <Button variant="danger" icon="log-out" onclick={() => executeModerationAction('KICK')}>{t.kick}</Button>
                          <Button variant="danger" icon="gavel" onclick={() => executeModerationAction('BAN')}>{t.ban}</Button>
                        </div>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="pointer-events-none absolute bottom-5 right-5 z-10" aria-live="polite">
      {#if toast}
        <p class="flex max-w-sm items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high px-4 py-2.5 text-sm text-on-surface shadow-lg">
          <Papicon icon={toast.tone === 'success' ? 'check-circle' : 'alert-circle'} size={15} class={toast.tone === 'success' ? 'text-success' : 'text-error'} />
          {toast.message}
        </p>
      {/if}
    </div>
  </div>
{/if}

<!-- Rapport de sanction : une fenetre du dashboard, au-dessus du dossier. -->
<Modal
  aboveCase
  open={!!(viewingReportSanctionId && selectedSanctionForReport)}
  onClose={closeReport}
  size="lg"
  title={selectedSanctionForReport ? typeLabel(selectedSanctionForReport.type) : t.sanctionReport}
  subtitle={selectedSanctionForReport ? t.appliedOn(formatDateTime(selectedSanctionForReport.createdAt), selectedSanctionForReport.moderatorTag) : ''}
>
  <div class="space-y-5 p-5" role="presentation" onkeydown={(e) => { if (e.key === 'Escape') closeReport(); }}>
    {#if selectedReport}
      {#if isEditingReport}
        <div class="grid grid-cols-2 gap-4">
          <Field label={t.incidentDate}>
            {#snippet children(id)}<input {id} type="datetime-local" class="input" bind:value={editReportData.incidentAt} />{/snippet}
          </Field>
          <Field label={t.appliedDuration}>
            {#snippet children(id)}<input {id} type="text" class="input" placeholder={t.durationPlaceholder} bind:value={editReportData.sanctionDurationLabel} />{/snippet}
          </Field>
        </div>
        <div class="field">
          <span class="field-label">{t.brokenRules}</span>
          <!-- `ReportRuleSelector` du dashboard. -->
          <details class="mt-1 rounded-xl border border-outline-variant/80 bg-surface-container-low/70 p-2">
            <summary class="cursor-pointer list-none rounded-lg px-2 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container/80">
              {editReportData.selectedRuleIds.length > 0 ? t.rulesSelected(editReportData.selectedRuleIds.length) : t.noRuleSelected}
            </summary>
            <div class="mt-2 space-y-2 pr-1">
              {#each rules as rule (rule.id)}
                <label class="flex items-start gap-2 rounded-lg px-2 py-2 text-xs transition-colors hover:bg-surface-container/80">
                  <input
                    type="checkbox"
                    checked={editReportData.selectedRuleIds.includes(rule.id)}
                    onchange={(e) => {
                      const checked = (e.currentTarget as HTMLInputElement).checked;
                      editReportData.selectedRuleIds = checked ? [...new Set([...editReportData.selectedRuleIds, rule.id])] : editReportData.selectedRuleIds.filter((v) => v !== rule.id);
                    }}
                    class="mt-0.5 h-4 w-4 rounded border-outline-variant accent-[var(--primary-color)]"
                  />
                  <span>
                    <span class="block font-bold text-on-surface">
                      <span class="inline-flex items-center gap-1.5"><Papicon icon={rule.icon} size={12} class="text-on-surface-variant" /><span>[{t.rulePrefix}] {rule.label}</span></span>
                    </span>
                    <span class="block text-2xs text-on-surface-variant">{rule.details}</span>
                  </span>
                </label>
              {/each}
            </div>
          </details>
          <div class="mt-2">{@render ruleChips(editDraftRules)}</div>
        </div>
        <Field label={t.detailedReason}>
          {#snippet children(id)}<textarea {id} class="input resize-none" rows="4" placeholder={t.detailedReasonPlaceholder} bind:value={editReportData.detailedReason}></textarea>{/snippet}
        </Field>
        <Field label={t.extraNotes}>
          {#snippet children(id)}<textarea {id} class="input resize-none" rows="2" placeholder={t.extraNotesPlaceholder} bind:value={editReportData.additionalNotes}></textarea>{/snippet}
        </Field>
      {:else}
        {@render facts([
          { label: t.incident, value: formatDateTime(selectedReport.incidentAt) },
          { label: t.duration, value: selectedReport.sanctionDurationLabel || '-' },
        ])}
        <div>
          <p class="field-label">{t.brokenRules}</p>
          {@render ruleChips(selectedReportRules)}
        </div>
        <div>
          <p class="field-label">{t.detailedReason}</p>
          <p class="rounded-lg bg-surface-container px-4 py-3 text-sm leading-relaxed text-on-surface">{selectedReport.detailedReason}</p>
        </div>
        {#if selectedReport.evidenceLinks.length}
          <div>
            <p class="field-label">{t.evidence}</p>
            <!-- Les preuves de démo n'ont pas de fichier derrière : leurs pastilles ne s'ouvrent pas. -->
            <div class="flex flex-wrap gap-2">
              {#each selectedReport.evidenceLinks as link, li (link)}
                <span class="btn btn-tonal btn-sm pointer-events-none"><Papicon icon="external-link" size={13} />{t.evidenceLink} {li + 1}</span>
              {/each}
            </div>
          </div>
        {/if}
        {#if selectedReport.additionalNotes}
          <div>
            <p class="field-label">{t.extraNotes}</p>
            <p class="text-sm leading-relaxed text-on-surface-variant">{selectedReport.additionalNotes}</p>
          </div>
        {/if}
        <p class="text-xs text-on-surface-variant">{t.reportBy(selectedReport.createdByTag || selectedReport.createdByUserId)}</p>
      {/if}
    {:else}
      <EmptyState icon="alert-triangle" title={t.reportMissing} description={t.reportMissingDesc} reason="accumulating" />
    {/if}
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2" role="presentation" onkeydown={(e) => { if (e.key === 'Escape') closeReport(); }}>
      {#if selectedReport && isEditingReport}
        <Button variant="ghost" onclick={() => (isEditingReport = false)}>{t.cancel}</Button>
        <Button variant="primary" onclick={handleUpdateReport}>{t.saveReport}</Button>
      {:else}
        {#if selectedReport}
          <Button icon="edit-3" onclick={startEditingReport}>{t.editReport}</Button>
        {/if}
        <Button variant="secondary" onclick={closeReport}>{t.closeDetails}</Button>
      {/if}
    </div>
  {/snippet}
</Modal>

{#if pending}
  <ConfirmDialog
    title={pending.title}
    description={pending.description}
    confirmLabel={pending.confirmLabel}
    variant={pending.variant}
    onConfirm={() => settle(true)}
    onCancel={() => settle(false)}
  />
{/if}

<style>
  .mc {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: var(--surface);
  }
  .mc-header {
    position: relative;
    background: var(--surface-container-lowest);
    border-bottom: 1px solid var(--outline-variant);
  }
  .mc-identity {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }
  .mc-header-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }
  .mc-tabs {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 0.75rem 1.5rem;
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--outline-variant);
  }
  .mc-body {
    padding: 1.25rem 1.5rem;
  }

  /* Chiffres alignés, séparés par un filet. Le dashboard passe à 4 colonnes
     au-delà de 900 px de large ; le cadre de l'aperçu les a toujours. */
  .mc-kpis {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem 1.5rem;
  }
  .mc-kpis--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .mc-kpis > div + div {
    border-left: 1px solid var(--outline-variant);
    padding-left: 1.25rem;
  }
  .mc-kpis dt {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }
  .mc-kpis dd {
    margin-top: 0.125rem;
    font-size: 1.375rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--on-surface);
  }
  /* Dans le dd : une dl n'admet que dt et dd sous ses div. */
  .mc-kpis span {
    display: block;
    letter-spacing: normal;
    font-weight: 400;
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }

  .mc-facts {
    display: flex;
    flex-direction: column;
  }
  .mc-facts > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0;
    border-top: 1px solid color-mix(in srgb, var(--outline-variant) 60%, transparent);
  }
  .mc-facts > div:first-child {
    border-top: none;
    padding-top: 0;
  }
  .mc-facts dt {
    font-size: 0.8125rem;
    color: var(--on-surface-variant);
  }
  .mc-facts dd {
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--on-surface);
    text-align: right;
    overflow-wrap: anywhere;
  }

  .mc-person {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 100%;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--primary-color);
  }
  .mc-person:hover { text-decoration: underline; }

  .mc-code {
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.8125rem;
    color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
  }

  .mc-role {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.1875rem 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid var(--outline-variant);
    font-size: 0.75rem;
    color: var(--on-surface);
    background: var(--surface-container-lowest);
  }

  .mc-bar-row {
    display: block;
    width: 100%;
    text-align: left;
  }
  .mc-bar {
    display: block;
    height: 0.375rem;
    margin-top: 0.375rem;
    border-radius: 9999px;
    background: var(--surface-container-high);
    overflow: hidden;
  }
  .mc-bar > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--series-1);
  }

  .mc-meter {
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--surface-container-high);
    overflow: hidden;
  }
  .mc-meter > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    transition: width 0.4s ease;
  }

  .mc-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .mc-toolbar :global(.mc-select) { width: auto; max-width: 14rem; }
  .mc-search { flex: 1 1 16rem; min-width: 0; }
  .mc-date {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--on-surface-variant);
  }
  .mc-date .input { width: auto; }

  .mc-timeline {
    padding: 1rem 1.25rem;
  }
  .mc-event {
    position: relative;
    display: flex;
    gap: 0.875rem;
    padding-bottom: 1rem;
  }
  .mc-event:last-child { padding-bottom: 0; }
  .mc-event:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 14px;
    bottom: 0;
    width: 1px;
    background: var(--outline-variant);
  }
  .mc-event__dot {
    flex-shrink: 0;
    width: 9px;
    height: 9px;
    margin-top: 6px;
    border-radius: 9999px;
    background: var(--primary-color);
  }

  .log-chip {
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    gap: 0.25rem;
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color-outline-variant) 40%, transparent);
    background: var(--color-surface-container-high);
    padding: 0.125rem 0.5rem;
    font-weight: 500;
  }

  .mc-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.875rem;
  }
  .mc-table th {
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--on-surface-variant);
    background: var(--surface-container);
    border-bottom: 1px solid var(--outline-variant);
  }
  .mc-table td {
    padding: 0.625rem 1rem;
    vertical-align: middle;
    border-bottom: 1px solid var(--outline-variant);
  }
  .mc-table tbody tr:last-child td { border-bottom: none; }
  .mc-table tbody tr:hover { background: var(--surface-hover); }
</style>

<!--
  Dossier membre du dashboard, reconstitué avec de fausses données : la même
  fenêtre que `MemberCaseModal.svelte` dans le dépôt produit (en-tête sobre,
  onglets, cartes de section, colonne de modération), ouverte comme depuis la
  gestion du staff, donc sur l'onglet Staff.

  Les jetons de couleur du dashboard sont recopiés sur la racine `.mpx` : la
  maquette garde l'indigo du produit au milieu de la palette du site.

  Aucune commande morte : chaque bouton change l'aperçu (sanction ajoutée,
  grade décalé, avertissement compté, note enregistrée). Ce qui ouvrirait une
  autre page du dashboard est affiché sans être cliquable.
-->
<script lang="ts">
  import Papicon from '../Papicon.svelte';
  import { mockAvatar, mockBanner } from '$lib/mockMedia';
  import { getLocale } from '$lib/i18n/state.svelte';

  type Tx = { fr: string; en: string };
  const x = (fr: string, en: string): Tx => ({ fr, en });

  const TEXT = {
    fr: {
      avatarAlt: 'Avatar du membre',
      tutor: 'Tuteur',
      verifPending: 'Vérification en cours',
      requestVerification: 'Demander vérification',
      tabsLabel: 'Membres',
      tabs: {
        staff: 'Staff',
        resume: 'Résumé',
        identite: 'Identité',
        activite: 'Activité',
        analytics: 'Analytiques',
        messages: 'Messages',
        logs: 'Journal',
        sanctions: 'Sanctions',
        candidatures: 'Candidats',
        invites: 'Invitations',
        notes: 'Notes'
      },
      presence: { online: 'En ligne', idle: 'Absent', dnd: 'Ne pas déranger', offline: 'Hors ligne', left: 'A quitté le serveur' },
      relative: {
        never: 'Jamais',
        justNow: "À l'instant",
        minutes: (n: number) => `Il y a ${n}m`,
        hours: (n: number) => `Il y a ${n}h`,
        days: (n: number) => `Il y a ${n}j`,
        inDays: (n: number) => `dans ${n} j`
      },
      duration: {
        years: (n: number) => `${n} an${n > 1 ? 's' : ''}`,
        months: (n: number) => `${n} mois`,
        days: (n: number) => `${n} jour${n > 1 ? 's' : ''}`,
        today: "Aujourd'hui",
        d: 'j'
      },
      units: { min: (n: string) => `${n} min`, hour: (n: string) => `${n} h` },
      staff: {
        joined: 'Entré dans le staff',
        gradeSince: 'Grade actuel depuis',
        demote: 'Rétrograder',
        promote: 'Promouvoir',
        gradeMin: 'Grade minimum atteint',
        gradeMax: 'Grade maximum atteint',
        brief: 'En bref',
        messages: 'Messages',
        voice: 'Vocal',
        sanctionsGiven: 'Sanctions données',
        progression: 'Score progression',
        pace: 'Rythme (7 j)',
        vsMonth: (avg: number, trend: string) => `${avg}/j sur le mois · ${trend}`,
        tenure: 'Ancienneté',
        hierarchies: 'Hiérarchies',
        timeline: 'Parcours',
        tenureSentence: (d: string) => `Dans le staff depuis ${d}`,
        tenureDays: (n: number) => `${n} j`,
        tenureMonths: (n: number) => `${n} mois`,
        tenureYears: (n: number) => `${n} an(s)`,
        tlWarning: 'Avertissement',
        tlWarningExpired: 'Avertissement expiré',
        tlJoinedHierarchy: (name: string) => `Rejoint ${name}`,
        tlGrade: (grade: string) => `Passe ${grade}`,
        tlJoined: 'Entre dans le staff',
        by: (name: string) => `par ${name}`,
        discipline: 'Discipline',
        warnNone: 'aucun avertissement actif',
        warnReached: 'seuil de rétrogradation atteint',
        warnLeft: (n: number) => `encore ${n} avant rétrogradation`,
        threshold: (demote: number, blacklist: number) =>
          `Rétrogradation à ${demote} avertissements actifs, liste noire à ${blacklist}.`,
        validationHint: 'La sanction attend une validation.',
        expires: (when: string) => `expire ${when}`,
        warn: 'Avertir',
        demoWarnReason: 'Deux tickets laissés sans réponse ce week-end',
        you: 'toi'
      },
      resume: {
        serverPresence: 'Présence serveur',
        joinedOn: (d: string) => `Arrivé le ${d}`,
        accountAge: 'Âge du compte',
        createdOn: (d: string) => `Créé le ${d}`,
        messages: 'Messages',
        voice: 'Vocal',
        sanctions: 'Sanctions',
        activeSanctions: (n: number) => `${n} sanction(s) active(s)`,
        trend: "Tendance d'activité (30j)",
        trendDesc: "30 derniers jours, comparés aux 30 jours d'avant en pointillés.",
        arrival: 'Arrivée sur le serveur',
        invitedBy: 'Invité par',
        inviteCode: "Code d'invitation",
        lastPass: 'Dernier passage',
        roles: (n: number) => `Rôles (${n})`,
        keyPermissions: 'Permissions clés',
        lastMessages: 'Derniers messages',
        lastLogs: 'Dernières entrées du journal',
        seeAllLogs: 'Voir tout le journal',
        discordProfile: 'Profil Discord',
        username: "Nom d'utilisateur",
        globalName: 'Nom global',
        serverDisplay: 'Affichage serveur',
        language: 'Langue',
        pronouns: 'Pronoms',
        bannerAlt: 'Bannière',
        accent: (hex: string) => `Couleur d'accent : #${hex}`
      },
      chart: {
        previous: "Période d'avant",
        vsPrevious: "vs période d'avant"
      },
      identite: {
        fullProfile: 'Profil complet',
        discordId: 'ID Discord',
        serverNickname: 'Surnom serveur',
        locale: 'Langue (locale)',
        keyDates: 'Dates clés',
        accountCreation: 'Création compte',
        serverJoin: 'Arrivée serveur',
        firstSeen: 'Première vue',
        lastSeen: 'Dernière vue',
        verifTitle: 'Vérifications',
        verifCount: (n: number) => `${n} demande(s)`,
        verifEmpty: "Aucune vérification demandée pour l'instant.",
        verifLastRequest: 'Dernière demande',
        verifRequestedOn: (d: string) => `Demandée le ${d}`,
        staffStatus: 'Statut staff',
        currentGrade: 'Grade actuel',
        tutorStatus: 'Statut tuteur',
        yes: 'Oui (actif)',
        no: 'Non'
      },
      activite: {
        voiceTime: 'Temps vocal',
        lastActivity: 'Dernière activité',
        byChannel: 'Répartition par salon'
      },
      analytics: {
        messageVolume: 'Volume messages',
        last30: '30 derniers jours',
        voiceActivity: 'Activité vocal',
        minutesPerDay: 'Minutes / jour'
      },
      messages: {
        search: 'Rechercher dans les messages…',
        allChannels: 'Tous les salons',
        showDeleted: 'Afficher supprimés',
        edited: 'Modifié',
        deleted: 'Supprimé',
        emptyTitle: 'Aucun message trouvé',
        emptyDesc: 'Aucun message enregistré pour ce membre ne correspond à tes filtres.',
        clear: 'Effacer les filtres'
      },
      logs: {
        search: 'Rechercher dans le journal…',
        allModules: 'Tous les modules',
        newest: 'Plus récents',
        oldest: 'Plus anciens',
        shown: (shown: number, total: number) => `${shown} entrée(s) sur ${total}`,
        noMatch: 'Aucune entrée ne correspond aux filtres'
      },
      sanctions: {
        date: 'Date',
        action: 'Action',
        status: 'Statut',
        reason: 'Raison',
        report: 'Rapport',
        byModerator: (name: string) => `par @${name}`,
        active: 'Active',
        resolved: 'Résolue',
        noReport: 'Aucun rapport',
        clean: 'Dossier vierge',
        types: { WARN: 'Avertissement', TIMEOUT: 'Exclusion temporaire', KICK: 'Expulsion', BAN: 'Bannissement' }
      },
      report: {
        appliedOn: (date: string, mod: string) => `Appliquée le ${date} par @${mod}`,
        incident: 'Incident',
        duration: 'Durée',
        brokenRules: 'Règles enfreintes',
        detailedReason: 'Raison détaillée',
        evidence: 'Preuves',
        evidenceLink: (n: number) => `Lien de preuve ${n}`,
        extraNotes: 'Notes complémentaires',
        by: (author: string) => `Rapport créé par @${author}`,
        close: 'Fermer les détails'
      },
      candidatures: {
        accepted: 'Acceptée',
        rejected: 'Refusée',
        oral: 'Résultat oral'
      },
      invites: {
        source: "Source d'invitation",
        codeUsed: 'Code utilisé',
        creator: 'Créateur',
        useDate: "Date d'utilisation",
        moves: 'Mouvements serveur',
        lastJoin: 'Dernière arrivée',
        lastLeave: 'Dernier départ',
        firstObservation: 'Première observation',
        none: '-'
      },
      notes: {
        title: 'Notes modérateur',
        desc: "Ces notes sont conservées et visibles uniquement par l'équipe de modération. Utilise cet espace pour laisser des informations importantes sur le comportement de l'utilisateur.",
        placeholder: 'Ajouter une note sur cet utilisateur…',
        save: 'Sauvegarder',
        saving: 'Enregistrement…',
        saved: 'Note enregistrée.'
      },
      aside: {
        risk: 'Score de risque',
        riskLow: 'Risque faible',
        riskHigh: 'Risque élevé',
        riskCritical: 'Risque critique',
        riskDesc: 'Basé sur les sanctions actives/passées et suspicions de DC.',
        seniority: { veteran: 'Vétéran (1 an+)', old: 'Ancien (6 mois+)', regular: 'Régulier (1 mois+)', recent: 'Récents (1 semaine+)', newcomer: 'Nouveau venu' },
        topChannels: 'Top salons',
        actions: 'Actions de modération',
        reason: 'Raison de la sanction',
        reasonPlaceholder: 'Saisis un motif (obligatoire)…',
        duration: 'Durée (exclusion temporaire uniquement)',
        durations: { '30m': '30 minutes', '1h': '1 heure', '1d': '1 jour', '7d': '7 jours', '28d': '28 jours (max)' },
        warn: 'Avertir',
        timeout: 'Exclure temporairement',
        kick: 'Expulser',
        ban: 'Bannir',
        defaultReason: 'Action lancée depuis le profil membre.',
        done: (action: string) => `L'action ${action} a été exécutée.`
      }
    },
    en: {
      avatarAlt: 'Member avatar',
      tutor: 'Tutor',
      verifPending: 'Verification pending',
      requestVerification: 'Request verification',
      tabsLabel: 'Members',
      tabs: {
        staff: 'Staff',
        resume: 'Summary',
        identite: 'Identity',
        activite: 'Activity',
        analytics: 'Analytics',
        messages: 'Messages',
        logs: 'Logs',
        sanctions: 'Sanctions',
        candidatures: 'Applicants',
        invites: 'Invites',
        notes: 'Notes'
      },
      presence: { online: 'Online', idle: 'Idle', dnd: 'Do not disturb', offline: 'Offline', left: 'Left the server' },
      relative: {
        never: 'Never',
        justNow: 'Just now',
        minutes: (n: number) => `${n}m ago`,
        hours: (n: number) => `${n}h ago`,
        days: (n: number) => `${n}d ago`,
        inDays: (n: number) => `in ${n} d`
      },
      duration: {
        years: (n: number) => `${n} year${n > 1 ? 's' : ''}`,
        months: (n: number) => `${n} month${n > 1 ? 's' : ''}`,
        days: (n: number) => `${n} day${n > 1 ? 's' : ''}`,
        today: 'Today',
        d: 'd'
      },
      units: { min: (n: string) => `${n} min`, hour: (n: string) => `${n} h` },
      staff: {
        joined: 'Joined staff',
        gradeSince: 'Current grade since',
        demote: 'Demote',
        promote: 'Promote',
        gradeMin: 'Minimum grade reached',
        gradeMax: 'Maximum grade reached',
        brief: 'At a glance',
        messages: 'Messages',
        voice: 'Voice',
        sanctionsGiven: 'Sanctions issued',
        progression: 'Progression score',
        pace: 'Pace (7 d)',
        vsMonth: (avg: number, trend: string) => `${avg}/d over the month · ${trend}`,
        tenure: 'Tenure',
        hierarchies: 'Hierarchies',
        timeline: 'History',
        tenureSentence: (d: string) => `On staff for ${d}`,
        tenureDays: (n: number) => `${n} d`,
        tenureMonths: (n: number) => `${n} mo`,
        tenureYears: (n: number) => `${n} yr`,
        tlWarning: 'Warning',
        tlWarningExpired: 'Expired warning',
        tlJoinedHierarchy: (name: string) => `Joins ${name}`,
        tlGrade: (grade: string) => `Becomes ${grade}`,
        tlJoined: 'Joins the staff',
        by: (name: string) => `by ${name}`,
        discipline: 'Discipline',
        warnNone: 'no active warning',
        warnReached: 'demotion threshold reached',
        warnLeft: (n: number) => `${n} left before demotion`,
        threshold: (demote: number, blacklist: number) =>
          `Demotion at ${demote} active warnings, blacklist at ${blacklist}.`,
        validationHint: 'The sanction waits for approval.',
        expires: (when: string) => `expires ${when}`,
        warn: 'Warn',
        demoWarnReason: 'Two tickets left unanswered over the weekend',
        you: 'you'
      },
      resume: {
        serverPresence: 'Server presence',
        joinedOn: (d: string) => `Joined on ${d}`,
        accountAge: 'Account age',
        createdOn: (d: string) => `Created on ${d}`,
        messages: 'Messages',
        voice: 'Voice',
        sanctions: 'Sanctions',
        activeSanctions: (n: number) => `${n} active sanction(s)`,
        trend: 'Activity trend (30d)',
        trendDesc: 'Last 30 days, compared with the 30 days before (dotted).',
        arrival: 'Arrival on the server',
        invitedBy: 'Invited by',
        inviteCode: 'Invite code',
        lastPass: 'Last seen',
        roles: (n: number) => `Roles (${n})`,
        keyPermissions: 'Key permissions',
        lastMessages: 'Latest messages',
        lastLogs: 'Latest logs',
        seeAllLogs: 'See all the logs',
        discordProfile: 'Discord profile',
        username: 'Username',
        globalName: 'Global name',
        serverDisplay: 'Server display name',
        language: 'Language',
        pronouns: 'Pronouns',
        bannerAlt: 'Banner',
        accent: (hex: string) => `Accent colour: #${hex}`
      },
      chart: {
        previous: 'Previous period',
        vsPrevious: 'vs previous period'
      },
      identite: {
        fullProfile: 'Full profile',
        discordId: 'Discord ID',
        serverNickname: 'Server nickname',
        locale: 'Language (locale)',
        keyDates: 'Key dates',
        accountCreation: 'Account created',
        serverJoin: 'Server join',
        firstSeen: 'First seen',
        lastSeen: 'Last seen',
        verifTitle: 'Verifications',
        verifCount: (n: number) => `${n} request(s)`,
        verifEmpty: 'No verification requested yet.',
        verifLastRequest: 'Last request',
        verifRequestedOn: (d: string) => `Requested on ${d}`,
        staffStatus: 'Staff status',
        currentGrade: 'Current grade',
        tutorStatus: 'Tutor status',
        yes: 'Yes (active)',
        no: 'No'
      },
      activite: {
        voiceTime: 'Voice time',
        lastActivity: 'Last activity',
        byChannel: 'Breakdown per channel'
      },
      analytics: {
        messageVolume: 'Message volume',
        last30: 'Last 30 days',
        voiceActivity: 'Voice activity',
        minutesPerDay: 'Minutes / day'
      },
      messages: {
        search: 'Search in the messages…',
        allChannels: 'All channels',
        showDeleted: 'Show deleted',
        edited: 'Edited',
        deleted: 'Deleted',
        emptyTitle: 'No message found',
        emptyDesc: 'No recorded message for this member matches your filters.',
        clear: 'Clear filters'
      },
      logs: {
        search: 'Search in the logs…',
        allModules: 'All modules',
        newest: 'Newest first',
        oldest: 'Oldest first',
        shown: (shown: number, total: number) => `${shown} of ${total} log(s)`,
        noMatch: 'No log matches the filters'
      },
      sanctions: {
        date: 'Date',
        action: 'Action',
        status: 'Status',
        reason: 'Reason',
        report: 'Report',
        byModerator: (name: string) => `by @${name}`,
        active: 'Active',
        resolved: 'Resolved',
        noReport: 'No report',
        clean: 'Clean record',
        types: { WARN: 'Warning', TIMEOUT: 'Timeout', KICK: 'Kick', BAN: 'Ban' }
      },
      report: {
        appliedOn: (date: string, mod: string) => `Applied on ${date} by @${mod}`,
        incident: 'Incident',
        duration: 'Duration',
        brokenRules: 'Rules broken',
        detailedReason: 'Detailed reason',
        evidence: 'Evidence',
        evidenceLink: (n: number) => `Evidence link ${n}`,
        extraNotes: 'Additional notes',
        by: (author: string) => `Report created by @${author}`,
        close: 'Close the details'
      },
      candidatures: {
        accepted: 'Accepted',
        rejected: 'Rejected',
        oral: 'Interview result'
      },
      invites: {
        source: 'Invite source',
        codeUsed: 'Code used',
        creator: 'Creator',
        useDate: 'Date used',
        moves: 'Server movements',
        lastJoin: 'Last join',
        lastLeave: 'Last leave',
        firstObservation: 'First observed',
        none: '-'
      },
      notes: {
        title: 'Moderator notes',
        desc: "These notes are permanent and visible only to the moderation team. Use this space to leave important information about the user's behaviour.",
        placeholder: 'Add a note about this user…',
        save: 'Save',
        saving: 'Saving…',
        saved: 'Note saved.'
      },
      aside: {
        risk: 'Risk score',
        riskLow: 'Low risk',
        riskHigh: 'High risk',
        riskCritical: 'Critical risk',
        riskDesc: 'Based on active/past sanctions and alt-account suspicions.',
        seniority: { veteran: 'Veteran (1 year+)', old: 'Long-timer (6 months+)', regular: 'Regular (1 month+)', recent: 'Recent (1 week+)', newcomer: 'Newcomer' },
        topChannels: 'Top channels',
        actions: 'Moderation actions',
        reason: 'Reason for the sanction',
        reasonPlaceholder: 'Enter a reason (required)…',
        duration: 'Duration (timeout only)',
        durations: { '30m': '30 minutes', '1h': '1 hour', '1d': '1 day', '7d': '7 days', '28d': '28 days (max)' },
        warn: 'Warn',
        timeout: 'Timeout',
        kick: 'Kick',
        ban: 'Ban',
        defaultReason: 'Action started from the member profile.',
        done: (action: string) => `The ${action} action has been carried out.`
      }
    }
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const tr = (value: Tx) => value[locale];
  const intl = $derived(locale === 'en' ? 'en-GB' : 'fr-FR');

  // ── Fausses données ───────────────────────────────────────────────────
  // Un « maintenant » figé : la page est prérendue, une date calculée au
  // build et une autre dans le navigateur ne s'accorderaient pas.
  const NOW = new Date('2026-10-09T18:40:00+02:00').getTime();
  const TZ = 'Europe/Paris';
  const ago = (minutes: number) => new Date(NOW - minutes * 60_000).toISOString();
  const DAY = 1440;

  const PROFILE = {
    userId: '982349823492834',
    username: 'arka',
    globalName: 'Arka',
    displayName: 'Arka',
    locale: 'fr',
    pronouns: x('il/lui', 'he/him'),
    accentColor: 0x6366f1,
    avatarUrl: mockAvatar('Arka'),
    bannerUrl: mockBanner('Arka'),
    accountCreatedAt: '2023-03-12T14:23:00.000Z',
    guildJoinedAt: '2024-05-04T09:15:00.000Z',
    firstSeenAt: '2024-05-04T09:15:00.000Z',
    lastSeenAt: ago(7),
    messageCount: 3452,
    voiceTimeSeconds: 448_200
  };

  const INVITE = { code: 'KOTBO', inviterTag: 'lena', inviterAvatarUrl: mockAvatar('Lena'), joinedAt: '2024-05-04T09:15:00.000Z' };

  const ROLES = [
    { name: x('Modérateur', 'Moderator'), color: '#3b82f6' },
    { name: x('Tuteur', 'Tutor'), color: '#6366f1' },
    { name: x('Staff', 'Staff'), color: '#10b981' },
    { name: x('Pôle Événements', 'Events team'), color: '#f59e0b' },
    { name: x('Vérifié', 'Verified'), color: '#64748b' },
    { name: x('Niveau 30', 'Level 30'), color: '#ec4899' }
  ];
  const PERMISSIONS = ['KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_MESSAGES', 'MODERATE_MEMBERS', 'MUTE_MEMBERS'];

  const CHANNELS = [
    { channelId: 'c1', channelName: x('général', 'general'), count: 1845 },
    { channelId: 'c2', channelName: x('aide-modération', 'mod-help'), count: 902 },
    { channelId: 'c3', channelName: x('événements', 'events'), count: 486 },
    { channelId: 'c4', channelName: x('tickets-staff', 'staff-tickets'), count: 219 }
  ];

  type Message = { id: string; channelId: string; content: Tx; at: string; editedAt?: string; deletedAt?: string };
  const MESSAGES: Message[] = [
    { id: 'm1', channelId: 'c1', content: x("Bienvenue à tous les nouveaux ! Passez par #règles avant d'écrire, ça évite les surprises.", 'Welcome to all the newcomers! Read #rules before posting, it saves surprises.'), at: ago(9) },
    { id: 'm2', channelId: 'c3', content: x('Le tournoi de samedi est complet, je prépare les poules ce soir.', "Saturday's tournament is full, I'm drawing up the groups tonight."), at: ago(52), editedAt: ago(48) },
    { id: 'm3', channelId: 'c2', content: x("J'ai pris le ticket #214, le membre attend une réponse depuis hier.", "I took ticket #214, the member has been waiting since yesterday."), at: ago(130) },
    { id: 'm4', channelId: 'c1', content: x('Merci de garder le vocal calme, il y a une session de révision en cours.', 'Please keep the voice channel calm, there is a study session going on.'), at: ago(310) },
    { id: 'm5', channelId: 'c4', content: x('Je passe en revue les candidatures helper demain matin.', "I'm going through the helper applications tomorrow morning."), at: ago(DAY + 40) },
    { id: 'm6', channelId: 'c1', content: x('mauvais salon, désolé', 'wrong channel, sorry'), at: ago(DAY + 200), deletedAt: ago(DAY + 198) },
    { id: 'm7', channelId: 'c2', content: x('Quelqu’un peut vérifier le compte de Nora ? Il a moins de trois jours.', 'Can someone check Nora’s account? It is less than three days old.'), at: ago(2 * DAY + 90) }
  ];

  type Log = { id: string; action: Tx; module: string; source: string; details: Tx; at: string };
  const LOGS: Log[] = [
    { id: 'l1', action: x('Message supprimé', 'Message deleted'), module: 'Moderation', source: 'discord', details: x('A supprimé un lien d’invitation publié dans #général', 'Removed an invite link posted in #general'), at: ago(25) },
    { id: 'l2', action: x('Ticket #214 fermé', 'Ticket #214 closed'), module: 'Tickets', source: 'dashboard', details: x('Résolu : accès au salon vocal rétabli', 'Resolved: voice channel access restored'), at: ago(95) },
    { id: 'l3', action: x('Vocal rejoint', 'Joined voice'), module: 'Voice', source: 'discord', details: x('A rejoint #Révisions', 'Joined #Study-room'), at: ago(180) },
    { id: 'l4', action: x('Rôle attribué', 'Role given'), module: 'Roles', source: 'dashboard', details: x('A donné le rôle Vérifié à @nora', 'Gave the Verified role to @nora'), at: ago(DAY + 60) },
    { id: 'l5', action: x('Exclusion temporaire', 'Timeout'), module: 'Sanctions', source: 'discord', details: x('A exclu @spamlord 1 h pour spam de liens', 'Timed out @spamlord for 1 h for link spam'), at: ago(3 * DAY) }
  ];

  type Report = { incidentAt: string; duration: Tx; rules: Tx[]; reason: Tx; evidence: number; notes?: Tx; author: string };
  type Sanction = { id: string; type: SanctionType; status: 'ACTIVE' | 'RESOLVED'; moderator: string; reason: Tx; createdAt: string; report?: Report };
  type SanctionType = 'WARN' | 'TIMEOUT' | 'KICK' | 'BAN';

  const INITIAL_SANCTIONS: Sanction[] = [
    {
      id: 's1',
      type: 'WARN',
      status: 'RESOLVED',
      moderator: 'lena',
      reason: x('Spam de mentions', 'Mention spam'),
      createdAt: '2025-11-03T20:12:00.000Z',
      report: {
        incidentAt: '2025-11-03T20:05:00.000Z',
        duration: x('Avertissement', 'Warning'),
        rules: [x('2.1 Respect et courtoisie', '2.1 Respect and courtesy'), x('3.4 Mentions abusives', '3.4 Excessive mentions')],
        reason: x(
          'Six mentions du rôle @Événements en deux minutes pendant le tournoi. Excuses présentées en privé, pas de récidive.',
          'Six pings of the @Events role in two minutes during the tournament. Apologised in private, no repeat.'
        ),
        evidence: 2,
        notes: x('Avant son entrée dans le staff.', 'Before joining the staff.'),
        author: 'lena'
      }
    }
  ];

  const CANDIDATURES = [
    { createdAt: '2025-01-08T10:00:00.000Z', status: 'APPROVED', oral: x('Validé', 'Passed'), notes: x('Très présent en vocal, bonne écoute, déjà modérateur sur un serveur de 2 000 membres.', 'Very present in voice, a good listener, already a moderator on a 2,000-member server.') }
  ];

  const INITIAL_NOTE = x(
    'Référent des événements du samedi. Préfère être prévenu en privé avant toute décision sur un membre de son pôle.',
    'Point of contact for Saturday events. Prefers a private heads-up before any decision on a member of his team.'
  );

  // Échelle des grades : celle de la maquette de l'équipe (`MockStaff`).
  const GRADES = [x('Helper Test', 'Trial Helper'), x('Helper', 'Helper'), x('Modérateur', 'Moderator'), x('Administrateur', 'Administrator'), x('Responsable', 'Manager')];
  const GRADE_COLORS = ['#64748b', '#d97706', '#059669', '#4f46e5', '#e11d48'];

  const STAFF = {
    joinedStaffAt: '2025-01-12T18:00:00.000Z',
    stats: { messages: 2118, voiceMinutes: 5310, sanctionsIssued: 64 },
    progression: 78,
    avg7d: 31,
    avg30d: 26,
    demoteAt: 3,
    blacklistAt: 5,
    hierarchies: [
      { name: x('Pôle Événements', 'Events team'), grade: x('Référent', 'Lead'), icon: '🎉', color: '#f59e0b', joinedAt: '2025-06-02T18:00:00.000Z' },
      { name: x('Tutorat', 'Mentoring'), grade: x('Tuteur', 'Tutor'), icon: 'user-check', color: '#6366f1', joinedAt: '2025-09-15T18:00:00.000Z' }
    ]
  };

  type StaffWarning = { id: string; reason: Tx; by: string; createdAt: string; expiresAt: string | null; active: boolean };
  type GradeEvent = { at: string; grade: number };

  // ── État de l'aperçu ──────────────────────────────────────────────────
  type TabId = 'staff' | 'resume' | 'identite' | 'activite' | 'analytics' | 'messages' | 'logs' | 'sanctions' | 'candidatures' | 'invites' | 'notes';
  let activeTab = $state<TabId>('staff');

  let sanctions = $state<Sanction[]>([...INITIAL_SANCTIONS]);
  let presence = $state<'online' | 'left'>('online');
  let verificationRequestedAt = $state<string | null>(null);

  let gradeIndex = $state(2);
  let gradeEvents = $state<GradeEvent[]>([{ at: '2025-09-15T18:00:00.000Z', grade: 2 }]);
  let staffWarnings = $state<StaffWarning[]>([
    { id: 'w1', reason: x('Absence non signalée pendant la soirée quiz', 'Unannounced absence during quiz night'), by: 'lena', createdAt: ago(18 * DAY), expiresAt: ago(-12 * DAY), active: true },
    { id: 'w2', reason: x('Sanction appliquée sans rapport', 'Sanction applied without a report'), by: 'zenox', createdAt: '2025-03-02T19:00:00.000Z', expiresAt: '2025-04-01T19:00:00.000Z', active: false }
  ]);

  let actionReason = $state('');
  let actionDuration = $state<keyof typeof TEXT.fr.aside.durations>('30m');
  let actionFeedback = $state('');

  let moderatorNote = $state(tr(INITIAL_NOTE));
  let noteBusy = $state(false);
  let noteFeedback = $state('');

  let trendMetric = $state<'messages' | 'voice'>('messages');
  let viewingReportId = $state<string | null>(null);

  let messageQuery = $state('');
  let messageChannelId = $state('');
  let messageIncludeDeleted = $state(true);

  let logQuery = $state('');
  let logModule = $state('');
  let logOrder = $state<'desc' | 'asc'>('desc');

  // ── Formats ───────────────────────────────────────────────────────────
  function fmtNumber(n: number) {
    return n.toLocaleString(intl);
  }
  function fmtMinutes(minutes: number) {
    return minutes < 60 ? t.units.min(fmtNumber(Math.round(minutes))) : t.units.hour(fmtNumber(Math.round(minutes / 60)));
  }
  function formatDateTime(value: string | null | undefined) {
    if (!value) return '-';
    return new Date(value).toLocaleString(intl, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: TZ });
  }
  function formatDateShort(value: string | null | undefined) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString(intl, { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ });
  }
  function shortDate(value: number) {
    return new Date(value).toLocaleDateString(intl, { day: 'numeric', month: 'short', timeZone: TZ });
  }
  function formatDuration(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return [days && `${days}${t.duration.d}`, hours && `${hours}h`, minutes && `${minutes}m`].filter(Boolean).join(' ') || '0s';
  }
  function formatRelative(value: string | null | undefined) {
    if (!value) return t.relative.never;
    const diff = NOW - new Date(value).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 0) return t.relative.inDays(Math.ceil(-minutes / DAY));
    if (minutes < 1) return t.relative.justNow;
    if (minutes < 60) return t.relative.minutes(minutes);
    if (minutes < DAY) return t.relative.hours(Math.floor(minutes / 60));
    if (minutes < 7 * DAY) return t.relative.days(Math.floor(minutes / DAY));
    return new Date(value).toLocaleDateString(intl, { day: '2-digit', month: 'short', timeZone: TZ });
  }
  function durationSince(value: string) {
    const start = new Date(value);
    const now = new Date(NOW);
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    const parts: string[] = [];
    if (years > 0) parts.push(t.duration.years(years));
    if (months > 0) parts.push(t.duration.months(months));
    if (parts.length) return parts.join(', ');
    const days = Math.floor((NOW - start.getTime()) / 86_400_000);
    return days <= 0 ? t.duration.today : t.duration.days(days);
  }
  function formatTenure(value: string) {
    const days = Math.max(0, Math.floor((NOW - new Date(value).getTime()) / 86_400_000));
    if (days < 31) return t.staff.tenureDays(days);
    if (days < 365) return t.staff.tenureMonths(Math.floor(days / 30.4));
    return t.staff.tenureYears(Math.floor(days / 365));
  }

  // ── Tendance d'activité : 30 jours et les 30 d'avant ──────────────────
  function series(seed: number, base: number, swing: number, days = 30) {
    let state = seed;
    const random = () => {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
    return Array.from({ length: days }, (_, i) => {
      const weekday = new Date(NOW - (days - 1 - i) * 86_400_000).getDay();
      const weekend = weekday === 0 || weekday === 6 ? 1.35 : 1;
      return Math.max(0, Math.round(base * weekend * (1 - swing / 2 + random() * swing)));
    });
  }
  const DAYS = Array.from({ length: 30 }, (_, i) => NOW - (29 - i) * 86_400_000);
  const TREND = {
    messages: series(7, 27, 0.9),
    prevMessages: series(19, 23, 0.9),
    voice: series(3, 78, 1.1),
    prevVoice: series(41, 86, 1.1)
  };
  const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
  const delta = (cur: number[], prev: number[]) => ((sum(cur) - sum(prev)) / (sum(prev) || 1)) * 100;

  const metrics = $derived([
    { id: 'messages' as const, label: t.resume.messages, color: 'var(--series-1)', unit: 1, format: fmtNumber, value: fmtNumber(sum(TREND.messages)), delta: delta(TREND.messages, TREND.prevMessages), daily: TREND.messages, prevDaily: TREND.prevMessages },
    { id: 'voice' as const, label: t.resume.voice, color: 'var(--series-3)', unit: 60, format: fmtMinutes, value: fmtMinutes(sum(TREND.voice)), delta: delta(TREND.voice, TREND.prevVoice), daily: TREND.voice, prevDaily: TREND.prevVoice }
  ]);
  const selectedMetric = $derived(metrics.find((metric) => metric.id === trendMetric) ?? metrics[0]);
  const xLabels = $derived([0, 7, 14, 22, 29].map((i) => shortDate(DAYS[i])));

  const CHART_W = 600;
  function niceMax(value: number) {
    const power = 10 ** Math.floor(Math.log10(Math.max(value, 1)));
    const step = [1, 2, 2.5, 5, 10].find((s) => s * power >= value / 4) ?? 10;
    return step * power * 4;
  }
  /** `unit` : le pas de l'axe, 60 pour que le vocal tombe sur des heures rondes. */
  function chartGeometry(values: number[], previous: number[], height: number, unit = 1) {
    const max = niceMax(Math.max(...values, ...previous, 1) / unit) * unit;
    const point = (v: number, i: number) => `${((i / (values.length - 1)) * CHART_W).toFixed(1)},${(height - (v / max) * (height - 6)).toFixed(1)}`;
    const line = values.map(point).join(' L');
    return {
      ticks: [4, 3, 2, 1, 0].map((k) => (max / 4) * k),
      main: `M${line}`,
      area: `M0,${height} L${line} L${CHART_W},${height} Z`,
      previous: `M${previous.map(point).join(' L')}`
    };
  }

  // ── Calculs du dossier ────────────────────────────────────────────────
  const activeSanctionCount = $derived(sanctions.filter((s) => s.status === 'ACTIVE').length);
  const riskScore = $derived(
    Math.min(100, activeSanctionCount * 25 + (sanctions.length - activeSanctionCount) * 10)
  );
  const riskTone = $derived(riskScore < 30 ? 'success' : riskScore < 70 ? 'warning' : 'danger');
  const seniority = $derived.by(() => {
    const days = (NOW - new Date(PROFILE.guildJoinedAt).getTime()) / 86_400_000;
    const s = t.aside.seniority;
    return days > 365 ? s.veteran : days > 180 ? s.old : days > 30 ? s.regular : days > 7 ? s.recent : s.newcomer;
  });

  const channelName = (id: string) => tr(CHANNELS.find((c) => c.channelId === id)?.channelName ?? x('', ''));
  const recentMessages = $derived(
    CHANNELS.slice(0, 3)
      .map((c) => MESSAGES.find((msg) => msg.channelId === c.channelId && !msg.deletedAt))
      .filter((msg): msg is Message => !!msg)
  );

  const filteredMessages = $derived.by(() => {
    const query = messageQuery.trim().toLowerCase();
    return MESSAGES.filter((msg) => {
      if (messageChannelId && msg.channelId !== messageChannelId) return false;
      if (!messageIncludeDeleted && msg.deletedAt) return false;
      return !query || tr(msg.content).toLowerCase().includes(query);
    });
  });

  const logModules = [...new Set(LOGS.map((log) => log.module))].sort();
  const filteredLogs = $derived.by(() => {
    const query = logQuery.trim().toLowerCase();
    const rows = LOGS.filter((log) => {
      if (logModule && log.module !== logModule) return false;
      return !query || `${tr(log.action)} ${tr(log.details)} ${log.module}`.toLowerCase().includes(query);
    });
    return logOrder === 'asc' ? rows.reverse() : rows;
  });

  const grade = $derived(tr(GRADES[gradeIndex]));
  const gradeColor = $derived(GRADE_COLORS[gradeIndex]);
  const gradeSince = $derived(gradeEvents[gradeEvents.length - 1].at);
  const activeWarnings = $derived(staffWarnings.filter((w) => w.active));
  const warnTone = $derived(
    activeWarnings.length === 0 ? 'idle' : activeWarnings.length >= STAFF.demoteAt ? 'danger' : 'warning'
  );
  const weekTrend = Math.round(((STAFF.avg7d - STAFF.avg30d) / STAFF.avg30d) * 100);

  type TimelineEvent = { at: string; icon: string; tone: 'neutral' | 'warning' | 'danger' | 'primary'; title: string; detail?: string };
  const timeline = $derived.by((): TimelineEvent[] => {
    const events: TimelineEvent[] = staffWarnings.map((w) => ({
      at: w.createdAt,
      icon: 'alert-triangle',
      tone: w.active ? 'warning' : 'neutral',
      title: w.active ? t.staff.tlWarning : t.staff.tlWarningExpired,
      detail: `${tr(w.reason)} · ${t.staff.by(w.by)}`
    }));
    for (const h of STAFF.hierarchies) {
      events.push({ at: h.joinedAt, icon: 'git-branch', tone: 'neutral', title: t.staff.tlJoinedHierarchy(tr(h.name)), detail: tr(h.grade) });
    }
    for (const event of gradeEvents) {
      events.push({ at: event.at, icon: 'chevrons-up', tone: 'primary', title: t.staff.tlGrade(tr(GRADES[event.grade])) });
    }
    events.push({ at: STAFF.joinedStaffAt, icon: 'user-plus', tone: 'primary', title: t.staff.tlJoined });
    return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  });

  const tabs = $derived(
    ([
      ['staff', 'shield', undefined],
      ['resume', 'layout', undefined],
      ['identite', 'user', undefined],
      ['activite', 'trending-up', undefined],
      ['analytics', 'bar-chart-2', undefined],
      ['messages', 'message-square', MESSAGES.length],
      ['logs', 'history', LOGS.length],
      ['sanctions', 'hammer', sanctions.length],
      ['candidatures', 'user-check', CANDIDATURES.length],
      ['invites', 'mail', undefined],
      ['notes', 'edit-3', undefined]
    ] as const).map(([id, icon, badge]) => ({ id, icon, label: t.tabs[id], badge: badge || undefined }))
  );

  const SANCTION_STYLE: Record<SanctionType, { icon: string; tone: string }> = {
    WARN: { icon: 'alert-triangle', tone: 'warning' },
    TIMEOUT: { icon: 'clock', tone: 'primary' },
    KICK: { icon: 'log-out', tone: 'warning' },
    BAN: { icon: 'gavel', tone: 'danger' }
  };

  const selectedSanction = $derived(sanctions.find((s) => s.id === viewingReportId && s.report) ?? null);

  // ── Actions ───────────────────────────────────────────────────────────
  function moderate(type: SanctionType) {
    const labels = { WARN: t.aside.warn, TIMEOUT: t.aside.timeout, KICK: t.aside.kick, BAN: t.aside.ban };
    const reason = actionReason.trim();
    sanctions = [
      {
        id: `demo-${sanctions.length + 1}`,
        type,
        status: type === 'KICK' ? 'RESOLVED' : 'ACTIVE',
        moderator: t.staff.you,
        reason: reason ? x(reason, reason) : x(TEXT.fr.aside.defaultReason, TEXT.en.aside.defaultReason),
        createdAt: new Date(NOW).toISOString()
      },
      ...sanctions
    ];
    if (type === 'KICK' || type === 'BAN') presence = 'left';
    actionFeedback = t.aside.done(labels[type]);
    actionReason = '';
  }

  function shiftGrade(direction: 1 | -1) {
    const next = gradeIndex + direction;
    if (next < 0 || next >= GRADES.length) return;
    gradeIndex = next;
    gradeEvents = [...gradeEvents, { at: new Date(NOW).toISOString(), grade: next }];
  }

  function warnStaff() {
    staffWarnings = [
      { id: `w${staffWarnings.length + 1}`, reason: x(TEXT.fr.staff.demoWarnReason, TEXT.en.staff.demoWarnReason), by: t.staff.you, createdAt: new Date(NOW).toISOString(), expiresAt: ago(-30 * DAY), active: true },
      ...staffWarnings
    ];
  }

  async function saveNote() {
    noteBusy = true;
    noteFeedback = '';
    await new Promise((resolve) => setTimeout(resolve, 400));
    noteBusy = false;
    noteFeedback = t.notes.saved;
  }

  function presenceTone(status: string) {
    return status === 'online' ? 'success' : 'danger';
  }
</script>

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

{#snippet card(title: string, body: import('svelte').Snippet, options: { description?: string; flush?: boolean; actions?: import('svelte').Snippet } = {})}
  <section class="section-card {options.flush ? 'overflow-hidden' : ''}">
    <header class="flex items-start justify-between gap-4 px-5 pt-5 {options.flush ? 'border-b border-outline-variant pb-4' : 'pb-1'}">
      <div class="min-w-0">
        <h3 class="text-sm font-semibold leading-tight text-on-surface">{title}</h3>
        {#if options.description}<p class="mt-0.5 text-[0.8125rem] leading-relaxed text-on-surface-variant">{options.description}</p>{/if}
      </div>
      {#if options.actions}<div class="flex shrink-0 items-center gap-2">{@render options.actions()}</div>{/if}
    </header>
    <div class={options.flush ? '' : 'p-5'}>{@render body()}</div>
  </section>
{/snippet}

{#snippet inviter()}
  <span class="mc-person">
    <img src={INVITE.inviterAvatarUrl} alt="" class="h-5 w-5 rounded-full object-cover" />
    <span class="truncate">@{INVITE.inviterTag}</span>
  </span>
{/snippet}

{#snippet roleChip(role: { name: Tx; color: string })}
  <span class="mc-role">
    <span class="h-2 w-2 shrink-0 rounded-full" style="background: {role.color}"></span>
    {tr(role.name)}
  </span>
{/snippet}

{#snippet chart(metric: (typeof metrics)[number], height: number)}
  {@const geo = chartGeometry(metric.daily, metric.prevDaily, height, metric.unit)}
  <div class="mc-chart">
    <div class="mc-chart__y" style="height: {height}px">
      {#each geo.ticks as tick (tick)}<span>{metric.format(tick)}</span>{/each}
    </div>
    <div class="min-w-0">
      <svg class="mc-chart__plot" viewBox="0 0 {CHART_W} {height}" preserveAspectRatio="none" style="height: {height}px" aria-hidden="true">
        {#each geo.ticks as tick, i (tick)}
          <line x1="0" x2={CHART_W} y1={6 + (i * (height - 6)) / 4} y2={6 + (i * (height - 6)) / 4} class="mc-chart__grid" />
        {/each}
        <path d={geo.area} style="fill: {metric.color}; opacity: 0.1" />
        <path d={geo.previous} class="mc-chart__previous" />
        <path d={geo.main} class="mc-chart__main" style="stroke: {metric.color}" />
      </svg>
      <div class="mc-chart__x">
        {#each xLabels as label, i (i)}<span>{label}</span>{/each}
      </div>
    </div>
  </div>
  <div class="mc-legend">
    <span><i style="background: {metric.color}"></i>{metric.label}</span>
    <span><i class="mc-legend__dash"></i>{t.chart.previous}</span>
  </div>
{/snippet}

<div class="mpx isolate relative flex h-full w-full flex-col overflow-hidden bg-surface font-body text-on-surface">
  <div class="min-h-0 flex-1 overflow-y-auto">
    <!-- ── Identité ─────────────────────────────────────── -->
    <header class="border-b border-outline-variant bg-surface-container-lowest">
      <div class="h-[5.5rem] bg-cover bg-center" style="background-image: url('{PROFILE.bannerUrl}')" aria-hidden="true"></div>
      <div class="flex flex-wrap items-center gap-4 px-4 py-5 sm:px-6">
        <div class="relative shrink-0">
          <img src={PROFILE.avatarUrl} alt={t.avatarAlt} class="h-14 w-14 rounded-xl bg-surface-container object-cover" />
          <span class="dot dot--{presenceTone(presence)} absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 border-2 border-surface-container-lowest" title={t.presence[presence]}></span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="truncate text-xl font-semibold tracking-tight text-on-surface">{PROFILE.displayName}</h2>
            <span class="badge badge-info"><Papicon icon="star" size={11} />{grade}</span>
            <span class="badge badge-info"><Papicon icon="user-check" size={11} />{t.tutor}</span>
            {#if verificationRequestedAt}
              <span class="badge badge-warning"><Papicon icon="clock" size={11} />{t.verifPending}</span>
            {/if}
          </div>
          <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-on-surface-variant">
            <span>@{PROFILE.username}</span>
            <span aria-hidden="true">·</span>
            <span class="inline-flex items-center gap-1.5"><span class="dot dot--{presenceTone(presence)} h-2 w-2"></span>{t.presence[presence]}</span>
            <span aria-hidden="true">·</span>
            <span>{tr(PROFILE.pronouns)}</span>
          </p>
        </div>
        <div class="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
          <button
            type="button"
            class="btn btn-tonal btn-sm"
            disabled={!!verificationRequestedAt}
            title={verificationRequestedAt ? t.verifPending : undefined}
            onclick={() => (verificationRequestedAt = new Date(NOW).toISOString())}
          >
            <Papicon icon="shield-alert" size={14} />{t.requestVerification}
          </button>
        </div>
      </div>
    </header>

    <!-- ── Onglets ──────────────────────────────────────── -->
    <div class="mc-tabs">
      <div role="tablist" aria-label={t.tabsLabel} class="tab-group">
        {#each tabs as tab (tab.id)}
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            class="tab-button {activeTab === tab.id ? 'active' : ''}"
            onclick={() => (activeTab = tab.id)}
          >
            <Papicon icon={tab.icon} size={14} />
            {tab.label}
            {#if tab.badge}<span class="tab-badge">{tab.badge}</span>{/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- ── Contenu ──────────────────────────────────────── -->
    <div class="px-4 pb-6 pt-5 sm:px-6">
      <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div class="min-w-0 space-y-4">
          {#if activeTab === 'staff'}
            <section class="section-card flex flex-wrap items-center justify-between gap-4 p-4">
              <div class="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
                <span class="sc-chip" style="color: {gradeColor}; background: color-mix(in srgb, {gradeColor} 12%, transparent);">
                  <Papicon icon="shield" size={13} />{grade}
                </span>
                <span class="sc-chip bg-primary/10 text-primary"><Papicon icon="user-check" size={12} />{t.tutor}</span>
                <dl class="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                  <div class="flex gap-1"><dt class="text-on-surface-variant">{t.staff.joined}</dt><dd>{formatDateShort(STAFF.joinedStaffAt)}</dd></div>
                  <div class="flex gap-1"><dt class="text-on-surface-variant">{t.staff.gradeSince}</dt><dd>{formatDateShort(gradeSince)}</dd></div>
                </dl>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="btn btn-tonal btn-sm" disabled={gradeIndex === 0} title={gradeIndex === 0 ? t.staff.gradeMin : undefined} onclick={() => shiftGrade(-1)}>
                  <Papicon icon="chevrons-down" size={14} />{t.staff.demote}
                </button>
                <button type="button" class="btn btn-primary btn-sm" disabled={gradeIndex === GRADES.length - 1} title={gradeIndex === GRADES.length - 1 ? t.staff.gradeMax : undefined} onclick={() => shiftGrade(1)}>
                  <Papicon icon="chevrons-up" size={14} />{t.staff.promote}
                </button>
              </div>
            </section>

            <div class="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">
              <div class="space-y-4">
                <section class="section-card">
                  <h4 class="sc-title">{t.staff.brief}</h4>
                  <dl class="sc-brief">
                    <div><dt>{t.staff.messages}</dt><dd>{fmtNumber(STAFF.stats.messages)}</dd></div>
                    <div><dt>{t.staff.voice}</dt><dd>{fmtMinutes(STAFF.stats.voiceMinutes)}</dd></div>
                    <div><dt>{t.staff.sanctionsGiven}</dt><dd>{fmtNumber(STAFF.stats.sanctionsIssued)}</dd></div>
                    <div><dt>{t.staff.progression}</dt><dd>{STAFF.progression}/100</dd></div>
                    <div>
                      <dt>{t.staff.pace}</dt>
                      <dd>{STAFF.avg7d}<span>{t.staff.vsMonth(STAFF.avg30d, `${weekTrend > 0 ? '+' : ''}${weekTrend} %`)}</span></dd>
                    </div>
                    <div><dt>{t.staff.tenure}</dt><dd>{formatTenure(STAFF.joinedStaffAt)}</dd></div>
                  </dl>
                </section>

                <section class="section-card">
                  <h4 class="sc-title">{t.staff.hierarchies}</h4>
                  <ul class="space-y-2 px-4 pb-4 pt-1">
                    {#each STAFF.hierarchies as h (h.icon)}
                      <li class="flex items-center gap-3">
                        <span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style="color: {h.color}; background: color-mix(in srgb, {h.color} 14%, transparent);" aria-hidden="true">
                          {#if /^[a-z-]+$/.test(h.icon)}<Papicon icon={h.icon} size={14} />{:else}<span class="text-sm leading-none">{h.icon}</span>{/if}
                        </span>
                        <span class="min-w-0 flex-1">
                          <span class="block truncate text-sm font-medium text-on-surface">{tr(h.name)}</span>
                          <span class="block truncate text-xs text-on-surface-variant">{tr(h.grade)}</span>
                        </span>
                      </li>
                    {/each}
                  </ul>
                </section>
              </div>

              <div class="space-y-4">
                <section class="section-card">
                  <h4 class="sc-title">{t.staff.discipline}</h4>
                  <div class="space-y-3 px-4 pb-4">
                    <span class="warn-meter warn-meter--{warnTone}">
                      <span class="warn-meter__track" aria-hidden="true">
                        {#each Array(STAFF.demoteAt) as _, i (i)}<span class="warn-meter__step" class:on={i < activeWarnings.length}></span>{/each}
                      </span>
                      <span class="warn-meter__label tabular-nums">{activeWarnings.length}/{STAFF.demoteAt}</span>
                      <span class="text-xs text-on-surface-variant">
                        {activeWarnings.length === 0 ? t.staff.warnNone : activeWarnings.length >= STAFF.demoteAt ? t.staff.warnReached : t.staff.warnLeft(STAFF.demoteAt - activeWarnings.length)}
                      </span>
                    </span>
                    <p class="text-xs text-on-surface-variant">{t.staff.threshold(STAFF.demoteAt, STAFF.blacklistAt)} {t.staff.validationHint}</p>
                    {#if activeWarnings.length}
                      <ul class="space-y-2 border-t border-outline-variant pt-3">
                        {#each activeWarnings as warning (warning.id)}
                          <li>
                            <p class="text-sm text-on-surface">{tr(warning.reason)}</p>
                            {#if warning.expiresAt}<p class="text-xs text-on-surface-variant">{t.staff.expires(formatRelative(warning.expiresAt))}</p>{/if}
                          </li>
                        {/each}
                      </ul>
                    {/if}
                    <button type="button" class="btn btn-tonal btn-sm w-full" onclick={warnStaff}><Papicon icon="alert-triangle" size={14} />{t.staff.warn}</button>
                  </div>
                </section>

                <section class="section-card min-w-0">
                  <h4 class="sc-title">{t.staff.timeline}</h4>
                  <p class="-mt-2 px-4 text-xs text-on-surface-variant">{t.staff.tenureSentence(formatTenure(STAFF.joinedStaffAt))}</p>
                  <ol class="px-4 pb-2 pt-4">
                    {#each timeline as event, i (i)}
                      <li class="sc-event sc-event--{event.tone}">
                        <span class="sc-event__dot" aria-hidden="true"><Papicon icon={event.icon} size={12} /></span>
                        <div class="min-w-0 flex-1 pb-4">
                          <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                            <span class="text-sm text-on-surface">{event.title}</span>
                            <time class="text-[0.6875rem] tabular-nums text-on-surface-variant" datetime={event.at} title={formatDateShort(event.at)}>{formatRelative(event.at)}</time>
                          </div>
                          {#if event.detail}<p class="mt-0.5 text-sm text-on-surface-variant">{event.detail}</p>{/if}
                        </div>
                      </li>
                    {/each}
                  </ol>
                </section>
              </div>
            </div>

          {:else if activeTab === 'resume'}
            <section class="section-card p-5">
              <dl class="mc-kpis">
                <div>
                  <dt><Papicon icon="calendar" size={13} />{t.resume.serverPresence}</dt>
                  <dd>{durationSince(PROFILE.guildJoinedAt)}</dd>
                  <span>{t.resume.joinedOn(formatDateShort(PROFILE.guildJoinedAt))}</span>
                </div>
                <div>
                  <dt><Papicon icon="user" size={13} />{t.resume.accountAge}</dt>
                  <dd>{durationSince(PROFILE.accountCreatedAt)}</dd>
                  <span>{t.resume.createdOn(formatDateShort(PROFILE.accountCreatedAt))}</span>
                </div>
                <div>
                  <dt><Papicon icon="message-square" size={13} />{t.resume.messages}</dt>
                  <dd class="tabular-nums">{fmtNumber(PROFILE.messageCount)}</dd>
                  <span>{t.resume.voice} : {formatDuration(PROFILE.voiceTimeSeconds)}</span>
                </div>
                <div>
                  <dt><Papicon icon="hammer" size={13} />{t.resume.sanctions}</dt>
                  <dd class="tabular-nums {activeSanctionCount ? 'tone-danger' : ''}">{sanctions.length}</dd>
                  <span class={activeSanctionCount ? 'tone-danger' : ''}>{t.resume.activeSanctions(activeSanctionCount)}</span>
                </div>
              </dl>
            </section>

            {#snippet trendActions()}
              <button type="button" class="btn btn-ghost btn-sm" onclick={() => (activeTab = 'analytics')}>{t.tabs.analytics}<Papicon icon="arrow-right" size={14} /></button>
            {/snippet}
            {#snippet trendBody()}
              <div class="space-y-3">
                <div class="metric-tabs" role="tablist" aria-label={t.resume.trend}>
                  {#each metrics as metric (metric.id)}
                    {@const selected = metric.id === selectedMetric.id}
                    {@const spark = chartGeometry(metric.daily, metric.daily, 22)}
                    <button type="button" role="tab" class="metric-tab" aria-selected={selected} style="--metric-color: {metric.color}" onclick={() => (trendMetric = metric.id)}>
                      <span class="metric-tab__label">{metric.label}</span>
                      <span class="metric-tab__row">
                        <span class="metric-tab__value">{metric.value}</span>
                        <svg viewBox="0 0 {CHART_W} 22" preserveAspectRatio="none" width="64" height="22" aria-hidden="true">
                          <path d={spark.main} style="stroke: {selected ? metric.color : 'var(--series-neutral)'}" class="mc-chart__main" />
                        </svg>
                      </span>
                      <span class="metric-tab__delta {metric.delta >= 0 ? 'tone-success' : 'tone-danger'}">
                        <Papicon icon={metric.delta >= 0 ? 'trending-up' : 'trending-down'} size={12} />
                        {metric.delta >= 0 ? '+' : ''}{metric.delta.toLocaleString(intl, { maximumFractionDigits: 1 })} %
                        <span class="font-normal text-on-surface-variant">{t.chart.vsPrevious}</span>
                      </span>
                    </button>
                  {/each}
                </div>
                {@render chart(selectedMetric, 190)}
              </div>
            {/snippet}
            {@render card(t.resume.trend, trendBody, { description: t.resume.trendDesc, actions: trendActions })}

            <div class="grid gap-4 md:grid-cols-2">
              {#snippet arrivalBody()}
                <dl class="mc-facts">
                  <div><dt>{t.resume.invitedBy}</dt><dd>{@render inviter()}</dd></div>
                  <div><dt>{t.resume.inviteCode}</dt><dd><span class="mc-code">{INVITE.code}</span></dd></div>
                  <div><dt>{t.resume.lastPass}</dt><dd>{formatRelative(PROFILE.lastSeenAt)}</dd></div>
                </dl>
              {/snippet}
              {@render card(t.resume.arrival, arrivalBody)}

              {#snippet rolesBody()}
                <div class="flex flex-wrap gap-1.5">
                  {#each ROLES as role, i (i)}{@render roleChip(role)}{/each}
                </div>
                <p class="mt-4 text-xs text-on-surface-variant">{t.resume.keyPermissions}</p>
                <p class="mt-1 text-sm text-on-surface">{PERMISSIONS.slice(0, 4).join(' · ')}</p>
              {/snippet}
              {@render card(t.resume.roles(ROLES.length), rolesBody)}
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              {#snippet messagesActions()}
                <button type="button" class="btn btn-ghost btn-sm" onclick={() => (activeTab = 'messages')}>{t.tabs.messages}<Papicon icon="arrow-right" size={14} /></button>
              {/snippet}
              {#snippet lastMessagesBody()}
                <ul class="divide-y divide-outline-variant">
                  {#each recentMessages as msg (msg.id)}
                    <li class="px-5 py-3">
                      <div class="flex items-center justify-between gap-2 text-xs text-on-surface-variant">
                        <span class="font-medium text-primary">#{channelName(msg.channelId)}</span>
                        <span>{formatRelative(msg.at)}</span>
                      </div>
                      <p class="mt-1 line-clamp-2 text-sm text-on-surface">{tr(msg.content)}</p>
                    </li>
                  {/each}
                </ul>
              {/snippet}
              {@render card(t.resume.lastMessages, lastMessagesBody, { flush: true, actions: messagesActions })}

              {#snippet logsActions()}
                <button type="button" class="btn btn-ghost btn-sm" onclick={() => (activeTab = 'logs')}>{t.resume.seeAllLogs}<Papicon icon="arrow-right" size={14} /></button>
              {/snippet}
              {#snippet lastLogsBody()}
                <ul class="divide-y divide-outline-variant">
                  {#each LOGS.slice(0, 4) as log (log.id)}
                    <li class="px-5 py-3">
                      <p class="text-sm text-on-surface">{tr(log.action)}</p>
                      <p class="text-xs text-on-surface-variant">{log.module} · {formatRelative(log.at)}</p>
                    </li>
                  {/each}
                </ul>
              {/snippet}
              {@render card(t.resume.lastLogs, lastLogsBody, { flush: true, actions: logsActions })}
            </div>

            {#snippet discordBody()}
              <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
                {@render facts([
                  { label: t.resume.username, value: `@${PROFILE.username}` },
                  { label: t.resume.globalName, value: PROFILE.globalName },
                  { label: t.resume.serverDisplay, value: PROFILE.displayName },
                  { label: t.resume.language, value: PROFILE.locale },
                  { label: t.resume.pronouns, value: tr(PROFILE.pronouns) }
                ])}
                <div class="space-y-3">
                  <img src={PROFILE.bannerUrl} alt={t.resume.bannerAlt} class="h-20 w-full rounded-lg object-cover" />
                  <p class="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span class="h-4 w-4 rounded" style="background: #{PROFILE.accentColor.toString(16)}"></span>
                    {t.resume.accent(PROFILE.accentColor.toString(16))}
                  </p>
                </div>
              </div>
            {/snippet}
            {@render card(t.resume.discordProfile, discordBody)}

          {:else if activeTab === 'identite'}
            <div class="grid gap-4 md:grid-cols-2">
              {#snippet fullProfileBody()}
                {@render facts([
                  { label: t.identite.discordId, value: PROFILE.userId },
                  { label: t.resume.username, value: `@${PROFILE.username}` },
                  { label: t.resume.globalName, value: PROFILE.globalName },
                  { label: t.identite.serverNickname, value: PROFILE.displayName },
                  { label: t.resume.pronouns, value: tr(PROFILE.pronouns) },
                  { label: t.identite.locale, value: PROFILE.locale }
                ])}
              {/snippet}
              {@render card(t.identite.fullProfile, fullProfileBody)}

              {#snippet keyDatesBody()}
                {@render facts([
                  { label: t.identite.accountCreation, value: formatDateTime(PROFILE.accountCreatedAt) },
                  { label: t.identite.serverJoin, value: formatDateTime(PROFILE.guildJoinedAt) },
                  { label: t.identite.firstSeen, value: formatDateTime(PROFILE.firstSeenAt) },
                  { label: t.identite.lastSeen, value: formatDateTime(PROFILE.lastSeenAt) }
                ])}
              {/snippet}
              {@render card(t.identite.keyDates, keyDatesBody)}

              {#snippet verifBody()}
                {#if verificationRequestedAt}
                  {@render facts([{ label: t.identite.verifLastRequest, value: formatDateTime(verificationRequestedAt) }])}
                  <ul class="mt-4 space-y-2">
                    <li class="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-container px-3 py-2.5">
                      <p class="text-sm text-on-surface">{t.identite.verifRequestedOn(formatDateTime(verificationRequestedAt))}</p>
                      <span class="badge badge-warning">{t.verifPending}</span>
                    </li>
                  </ul>
                {:else}
                  <p class="text-sm text-on-surface-variant">{t.identite.verifEmpty}</p>
                {/if}
              {/snippet}
              {@render card(t.identite.verifTitle, verifBody, { description: t.identite.verifCount(verificationRequestedAt ? 1 : 0) })}

              {#snippet staffStatusBody()}
                {@render facts([
                  { label: t.identite.currentGrade, value: grade },
                  { label: t.identite.tutorStatus, value: t.identite.yes }
                ])}
              {/snippet}
              {@render card(t.identite.staffStatus, staffStatusBody)}

              <div class="md:col-span-2">
                {#snippet allRolesBody()}
                  <div class="flex flex-wrap gap-1.5">
                    {#each ROLES as role, i (i)}{@render roleChip(role)}{/each}
                  </div>
                {/snippet}
                {@render card(t.resume.roles(ROLES.length), allRolesBody)}
              </div>
            </div>

          {:else if activeTab === 'activite'}
            <section class="section-card p-5">
              <dl class="mc-kpis mc-kpis--3">
                <div><dt><Papicon icon="message-square" size={13} />{t.resume.messages}</dt><dd class="tabular-nums">{fmtNumber(PROFILE.messageCount)}</dd></div>
                <div><dt><Papicon icon="mic" size={13} />{t.activite.voiceTime}</dt><dd>{formatDuration(PROFILE.voiceTimeSeconds)}</dd></div>
                <div><dt><Papicon icon="eye" size={13} />{t.activite.lastActivity}</dt><dd>{formatDateShort(PROFILE.lastSeenAt)}</dd></div>
              </dl>
            </section>
            {#snippet byChannelBody()}
              <ul class="space-y-3">
                {#each CHANNELS as channel (channel.channelId)}
                  <li>
                    <span class="flex items-center justify-between gap-3 text-sm">
                      <span class="truncate text-on-surface">#{tr(channel.channelName)}</span>
                      <span class="shrink-0 tabular-nums text-on-surface-variant">{fmtNumber(channel.count)}</span>
                    </span>
                    <span class="mc-bar"><span style="width: {(channel.count / CHANNELS[0].count) * 100}%"></span></span>
                  </li>
                {/each}
              </ul>
            {/snippet}
            {@render card(t.activite.byChannel, byChannelBody)}

          {:else if activeTab === 'analytics'}
            <div class="grid gap-4 2xl:grid-cols-2">
              {#each metrics as metric (metric.id)}
                {#snippet metricActions()}
                  <span class="text-right">
                    <span class="block text-lg font-semibold tabular-nums text-on-surface">{metric.value}</span>
                    <span class="block text-xs {metric.delta >= 0 ? 'tone-success' : 'tone-danger'}">{metric.delta >= 0 ? '+' : ''}{Math.round(metric.delta)} %</span>
                  </span>
                {/snippet}
                {#snippet metricBody()}{@render chart(metric, 200)}{/snippet}
                {@render card(
                  metric.id === 'messages' ? t.analytics.messageVolume : t.analytics.voiceActivity,
                  metricBody,
                  { description: metric.id === 'messages' ? t.analytics.last30 : t.analytics.minutesPerDay, actions: metricActions }
                )}
              {/each}
            </div>

          {:else if activeTab === 'messages'}
            <div class="mc-toolbar">
              <div class="mc-search relative">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant/60"><Papicon icon="search" size={15} /></span>
                <input type="search" class="input" style="padding-left: 2.25rem;" placeholder={t.messages.search} aria-label={t.messages.search} bind:value={messageQuery} />
              </div>
              <select class="input mc-select" aria-label={t.messages.allChannels} bind:value={messageChannelId}>
                <option value="">{t.messages.allChannels}</option>
                {#each CHANNELS as c (c.channelId)}<option value={c.channelId}>#{tr(c.channelName)} ({c.count})</option>{/each}
              </select>
              <label class="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-on-surface-variant">
                <input type="checkbox" class="h-4 w-4 accent-[var(--primary-color)]" bind:checked={messageIncludeDeleted} />
                {t.messages.showDeleted}
              </label>
            </div>
            {#if filteredMessages.length === 0}
              <div class="section-card flex flex-col items-center gap-1.5 px-6 py-12 text-center">
                <span class="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/60"><Papicon icon="message-square" size={20} /></span>
                <p class="text-sm font-medium text-on-surface">{t.messages.emptyTitle}</p>
                <p class="max-w-sm text-sm text-on-surface-variant">{t.messages.emptyDesc}</p>
                <button type="button" class="btn btn-tonal btn-sm mt-3" onclick={() => { messageQuery = ''; messageChannelId = ''; messageIncludeDeleted = true; }}>{t.messages.clear}</button>
              </div>
            {:else}
              <ul class="section-card divide-y divide-outline-variant overflow-hidden">
                {#each filteredMessages as msg (msg.id)}
                  <li class="px-5 py-4 {msg.deletedAt ? 'deleted-row' : ''}">
                    <div class="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                      <span class="font-medium text-primary">#{channelName(msg.channelId)}</span>
                      <span>{formatDateTime(msg.at)}</span>
                      {#if msg.editedAt}<span class="badge badge-warning">{t.messages.edited}</span>{/if}
                      {#if msg.deletedAt}<span class="badge badge-danger">{t.messages.deleted}</span>{/if}
                    </div>
                    <p class="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-on-surface">{tr(msg.content)}</p>
                  </li>
                {/each}
              </ul>
            {/if}

          {:else if activeTab === 'logs'}
            <div class="mc-toolbar">
              <div class="mc-search relative">
                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant/60"><Papicon icon="search" size={15} /></span>
                <input type="search" class="input" style="padding-left: 2.25rem;" placeholder={t.logs.search} aria-label={t.logs.search} bind:value={logQuery} />
              </div>
              <select class="input mc-select" aria-label={t.logs.allModules} bind:value={logModule}>
                <option value="">{t.logs.allModules}</option>
                {#each logModules as module (module)}<option value={module}>{module}</option>{/each}
              </select>
              <select class="input mc-select" aria-label={t.logs.newest} bind:value={logOrder}>
                <option value="desc">{t.logs.newest}</option>
                <option value="asc">{t.logs.oldest}</option>
              </select>
            </div>
            <p class="text-xs text-on-surface-variant">{t.logs.shown(filteredLogs.length, LOGS.length)}</p>
            {#if filteredLogs.length === 0}
              <div class="section-card flex flex-col items-center gap-1.5 px-6 py-12 text-center">
                <span class="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/60"><Papicon icon="search" size={20} /></span>
                <p class="text-sm font-medium text-on-surface">{t.logs.noMatch}</p>
                <button type="button" class="btn btn-tonal btn-sm mt-3" onclick={() => { logQuery = ''; logModule = ''; }}>{t.messages.clear}</button>
              </div>
            {:else}
              <ol class="section-card mc-timeline">
                {#each filteredLogs as log (log.id)}
                  <li class="mc-event">
                    <span class="mc-event__dot" aria-hidden="true"></span>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                        <p class="text-sm font-medium text-on-surface">{tr(log.action)}</p>
                        <time class="text-xs tabular-nums text-on-surface-variant" datetime={log.at}>{formatDateTime(log.at)}</time>
                      </div>
                      <p class="text-xs text-on-surface-variant">{log.module} · {log.source}</p>
                      <div class="mt-2 rounded-lg bg-surface-container px-3 py-2 text-sm leading-relaxed text-on-surface-variant">{tr(log.details)}</div>
                    </div>
                  </li>
                {/each}
              </ol>
            {/if}

          {:else if activeTab === 'sanctions'}
            <div class="section-card overflow-hidden">
              <div class="overflow-x-auto">
                <table class="mc-table">
                  <thead>
                    <tr>
                      <th scope="col">{t.sanctions.date}</th>
                      <th scope="col">{t.sanctions.action}</th>
                      <th scope="col">{t.sanctions.status}</th>
                      <th scope="col">{t.sanctions.reason}</th>
                      <th scope="col"><span class="sr-only">{t.sanctions.report}</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each sanctions as sanction (sanction.id)}
                      {@const style = SANCTION_STYLE[sanction.type]}
                      <tr>
                        <td class="whitespace-nowrap text-on-surface-variant">{formatDateShort(sanction.createdAt)}</td>
                        <td>
                          <span class="inline-flex items-center gap-2">
                            <span class="tile tile--{style.tone} flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"><Papicon icon={style.icon} size={13} /></span>
                            <span>
                              <span class="block font-medium text-on-surface">{t.sanctions.types[sanction.type]}</span>
                              <span class="block text-xs text-on-surface-variant">{t.sanctions.byModerator(sanction.moderator)}</span>
                            </span>
                          </span>
                        </td>
                        <td><span class="badge {sanction.status === 'ACTIVE' ? 'badge-danger' : 'badge-success'}">{sanction.status === 'ACTIVE' ? t.sanctions.active : t.sanctions.resolved}</span></td>
                        <td class="max-w-xs"><span class="line-clamp-2 text-on-surface-variant">{tr(sanction.reason)}</span></td>
                        <td class="whitespace-nowrap text-right">
                          {#if sanction.report}
                            <button type="button" class="btn btn-tonal btn-sm" onclick={() => (viewingReportId = sanction.id)}><Papicon icon="file-text" size={14} />{t.sanctions.report}</button>
                          {:else}
                            <span class="text-xs text-on-surface-variant">{t.sanctions.noReport}</span>
                          {/if}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>

          {:else if activeTab === 'candidatures'}
            {#each CANDIDATURES as cand, i (i)}
              {#snippet candActions()}
                <span class="badge {cand.status === 'APPROVED' ? 'badge-success' : 'badge-danger'}">{cand.status === 'APPROVED' ? t.candidatures.accepted : t.candidatures.rejected}</span>
              {/snippet}
              {#snippet candBody()}
                {@render facts([{ label: t.candidatures.oral, value: tr(cand.oral) }])}
                <p class="mt-3 rounded-lg bg-surface-container px-4 py-3 text-sm leading-relaxed text-on-surface-variant">{tr(cand.notes)}</p>
              {/snippet}
              {@render card(formatDateShort(cand.createdAt), candBody, { actions: candActions })}
            {/each}

          {:else if activeTab === 'invites'}
            <div class="grid gap-4 md:grid-cols-2">
              {#snippet sourceBody()}
                <dl class="mc-facts">
                  <div><dt>{t.invites.codeUsed}</dt><dd><span class="mc-code">{INVITE.code}</span></dd></div>
                  <div><dt>{t.invites.creator}</dt><dd>{@render inviter()}</dd></div>
                  <div><dt>{t.invites.useDate}</dt><dd>{formatDateTime(INVITE.joinedAt)}</dd></div>
                </dl>
              {/snippet}
              {@render card(t.invites.source, sourceBody)}
              {#snippet movesBody()}
                {@render facts([
                  { label: t.invites.lastJoin, value: formatDateTime(PROFILE.guildJoinedAt) },
                  { label: t.invites.lastLeave, value: t.invites.none },
                  { label: t.invites.firstObservation, value: formatDateTime(PROFILE.firstSeenAt) }
                ])}
              {/snippet}
              {@render card(t.invites.moves, movesBody)}
            </div>

          {:else if activeTab === 'notes'}
            {#snippet notesBody()}
              <label for="mock-moderator-note" class="sr-only">{t.notes.title}</label>
              <textarea id="mock-moderator-note" class="input min-h-[200px] resize-y" bind:value={moderatorNote} placeholder={t.notes.placeholder}></textarea>
              <div class="mt-4 flex items-center justify-between gap-3">
                <span class="text-sm tone-success" aria-live="polite">{noteFeedback}</span>
                <button type="button" class="btn btn-primary" disabled={noteBusy} onclick={saveNote}><Papicon icon="save" size={14} />{noteBusy ? t.notes.saving : t.notes.save}</button>
              </div>
            {/snippet}
            {@render card(t.notes.title, notesBody, { description: t.notes.desc })}
          {/if}
        </div>

        <!-- ── Colonne de modération ──────────────────────── -->
        <aside class="space-y-4">
          <section class="section-card p-5">
            <div class="flex items-baseline justify-between gap-2">
              <h3 class="text-sm font-semibold text-on-surface">{t.aside.risk}</h3>
              <span class="text-xs text-on-surface-variant">{seniority}</span>
            </div>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-2xl font-semibold tabular-nums tracking-tight tone-{riskTone}">{riskScore}</span>
              <span class="text-sm text-on-surface-variant">/100</span>
              <span class="badge badge-{riskTone} ml-auto">{riskScore < 30 ? t.aside.riskLow : riskScore < 70 ? t.aside.riskHigh : t.aside.riskCritical}</span>
            </div>
            <div class="mc-meter mt-2" aria-hidden="true"><span class="fill-{riskTone}" style="width: {riskScore}%"></span></div>
            <p class="mt-2 text-xs leading-relaxed text-on-surface-variant">{t.aside.riskDesc}</p>
          </section>

          <section class="section-card p-5">
            <h3 class="text-sm font-semibold text-on-surface">{t.aside.topChannels}</h3>
            <ul class="mt-3 space-y-3">
              {#each CHANNELS.slice(0, 3) as chan (chan.channelId)}
                {@const pct = Math.round((chan.count / PROFILE.messageCount) * 100)}
                <li>
                  <span class="flex items-center justify-between gap-2 text-sm">
                    <span class="truncate text-on-surface">#{tr(chan.channelName)}</span>
                    <span class="shrink-0 text-xs tabular-nums text-on-surface-variant">{chan.count} · {pct} %</span>
                  </span>
                  <span class="mc-bar"><span style="width: {pct}%"></span></span>
                </li>
              {/each}
            </ul>
          </section>

          <section class="section-card p-5">
            <h3 class="text-sm font-semibold text-on-surface">{t.aside.actions}</h3>
            <div class="mt-3 space-y-3">
              <label class="field">
                <span class="field-label">{t.aside.reason}</span>
                <textarea class="input resize-none" rows="3" placeholder={t.aside.reasonPlaceholder} bind:value={actionReason}></textarea>
              </label>
              <label class="field">
                <span class="field-label">{t.aside.duration}</span>
                <select class="input" bind:value={actionDuration}>
                  {#each Object.entries(t.aside.durations) as [value, label] (value)}<option {value}>{label}</option>{/each}
                </select>
              </label>
              <div class="space-y-2 pt-1">
                <button type="button" class="btn btn-tonal w-full" onclick={() => moderate('WARN')}><Papicon icon="alert-triangle" size={14} />{t.aside.warn}</button>
                <button type="button" class="btn btn-tonal w-full" onclick={() => moderate('TIMEOUT')}><Papicon icon="clock" size={14} />{t.aside.timeout}</button>
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" class="btn btn-danger" disabled={presence === 'left'} onclick={() => moderate('KICK')}><Papicon icon="log-out" size={14} />{t.aside.kick}</button>
                  <button type="button" class="btn btn-danger" disabled={presence === 'left'} onclick={() => moderate('BAN')}><Papicon icon="gavel" size={14} />{t.aside.ban}</button>
                </div>
              </div>
              {#if actionFeedback}
                <p class="flex items-center gap-2 text-sm tone-success" aria-live="polite"><Papicon icon="check-circle" size={14} />{actionFeedback}</p>
              {/if}
            </div>
          </section>
        </aside>
      </div>
    </div>
  </div>

  <!-- Rapport de sanction : une fenêtre au-dessus du dossier. -->
  {#if selectedSanction?.report}
    {@const report = selectedSanction.report}
    <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/40 p-4" role="presentation" onclick={() => (viewingReportId = null)}>
      <div
        class="flex max-h-full w-full max-w-xl flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mock-report-title"
        tabindex="-1"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.key === 'Escape' && (viewingReportId = null)}
      >
        <header class="flex items-start justify-between gap-4 border-b border-outline-variant px-5 py-4">
          <div>
            <h3 id="mock-report-title" class="text-base font-semibold text-on-surface">{t.sanctions.types[selectedSanction.type]}</h3>
            <p class="text-[0.8125rem] text-on-surface-variant">{t.report.appliedOn(formatDateTime(selectedSanction.createdAt), selectedSanction.moderator)}</p>
          </div>
        </header>
        <div class="space-y-5 overflow-y-auto p-5">
          {@render facts([
            { label: t.report.incident, value: formatDateTime(report.incidentAt) },
            { label: t.report.duration, value: tr(report.duration) }
          ])}
          <div>
            <p class="field-label">{t.report.brokenRules}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each report.rules as rule, i (i)}<span class="mc-role">{tr(rule)}</span>{/each}
            </div>
          </div>
          <div>
            <p class="field-label">{t.report.detailedReason}</p>
            <p class="rounded-lg bg-surface-container px-4 py-3 text-sm leading-relaxed text-on-surface">{tr(report.reason)}</p>
          </div>
          <div>
            <p class="field-label">{t.report.evidence}</p>
            <div class="flex flex-wrap gap-2">
              {#each Array(report.evidence) as _, i (i)}
                <span class="mc-role"><Papicon icon="file-text" size={13} />{t.report.evidenceLink(i + 1)}</span>
              {/each}
            </div>
          </div>
          {#if report.notes}
            <div>
              <p class="field-label">{t.report.extraNotes}</p>
              <p class="text-sm leading-relaxed text-on-surface-variant">{tr(report.notes)}</p>
            </div>
          {/if}
          <p class="text-xs text-on-surface-variant">{t.report.by(report.author)}</p>
        </div>
        <footer class="flex justify-end border-t border-outline-variant px-5 py-3">
          <button type="button" class="btn btn-tonal" onclick={() => (viewingReportId = null)}>{t.report.close}</button>
        </footer>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Jetons du dashboard (`apps/dashboard/src/app.css`, thème clair), recopiés
     ici : le dépôt de la landing n'a pas accès aux paquets du produit. Les
     `--color-*` sont redéfinis aussi, sinon les classes Tailwind gardent la
     palette du site. */
  .mpx {
    --surface: #ffffff;
    --on-surface: #111827;
    --surface-container-lowest: #ffffff;
    --surface-container-low: #f9fafb;
    --surface-container: #f3f4f6;
    --surface-container-high: #e5e7eb;
    --on-surface-variant: #374151;
    --outline-variant: #e5e7eb;
    --surface-hover: rgba(0, 0, 0, 0.03);
    --primary-color: #4f46e5;
    --on-primary-color: #ffffff;
    --primary-container-color: #eef2ff;
    --on-primary-container-color: #3730a3;
    --warning-color: #b45309;
    --success-color: #15803d;
    --error-color: #dc2626;
    --series-1: #2a78d6;
    --series-3: #1baf7a;
    --series-neutral: #a1a1aa;

    --color-surface: var(--surface);
    --color-on-surface: var(--on-surface);
    --color-surface-container-lowest: var(--surface-container-lowest);
    --color-surface-container-low: var(--surface-container-low);
    --color-surface-container: var(--surface-container);
    --color-surface-container-high: var(--surface-container-high);
    --color-on-surface-variant: var(--on-surface-variant);
    --color-outline-variant: var(--outline-variant);
    --color-primary: var(--primary-color);
    --color-error: var(--error-color);
  }

  .mpx :global(.section-card) {
    background: var(--surface-container-lowest);
    border: 1px solid var(--outline-variant);
    border-radius: 0.75rem;
  }

  .mpx :global(.tone-success) { color: var(--success-color); }
  .mpx :global(.tone-warning) { color: var(--warning-color); }
  .mpx :global(.tone-danger) { color: var(--error-color); }
  .mpx :global(.fill-success) { background: var(--success-color); }
  .mpx :global(.fill-warning) { background: var(--warning-color); }
  .mpx :global(.fill-danger) { background: var(--error-color); }
  .mpx :global(.dot) { display: inline-block; border-radius: 9999px; }
  .mpx :global(.dot--success) { background: var(--success-color); }
  .mpx :global(.dot--danger) { background: var(--error-color); }
  .mpx :global(.deleted-row) { background: color-mix(in srgb, var(--error-color) 5%, transparent); }
  .mpx :global(.tile--warning) { color: var(--warning-color); background: color-mix(in srgb, var(--warning-color) 10%, transparent); }
  .mpx :global(.tile--danger) { color: var(--error-color); background: color-mix(in srgb, var(--error-color) 10%, transparent); }
  .mpx :global(.tile--primary) { color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 10%, transparent); }

  /* Badges */
  .mpx :global(.badge) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .mpx :global(.badge-success) { background: rgba(16, 185, 129, 0.1); color: rgb(4, 120, 87); }
  .mpx :global(.badge-warning) { background: rgba(245, 158, 11, 0.1); color: rgb(180, 83, 9); }
  .mpx :global(.badge-danger) { background: rgba(239, 68, 68, 0.1); color: rgb(185, 28, 28); }
  .mpx :global(.badge-info) { background: rgba(99, 102, 241, 0.08); color: rgb(67, 56, 202); }

  /* Boutons */
  .mpx :global(.btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.25;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
  }
  .mpx :global(.btn:active) { transform: scale(0.98); }
  .mpx :global(.btn:disabled) { opacity: 0.45; cursor: not-allowed; transform: none; }
  .mpx :global(.btn svg) { max-width: none; flex-shrink: 0; }
  .mpx :global(.btn-sm) { padding: 0.3125rem 0.75rem; font-size: 0.75rem; }
  .mpx :global(.btn-primary) { background: var(--primary-color); color: var(--on-primary-color); }
  .mpx :global(.btn-primary:hover:not(:disabled)) { opacity: 0.92; }
  .mpx :global(.btn-tonal) { background: var(--surface-container); color: var(--on-surface); border-color: var(--outline-variant); }
  .mpx :global(.btn-tonal:hover:not(:disabled)) { background: var(--surface-container-high); }
  .mpx :global(.btn-ghost) { background: transparent; color: var(--on-surface-variant); }
  .mpx :global(.btn-ghost:hover:not(:disabled)) { background: var(--surface-hover); color: var(--on-surface); }
  .mpx :global(.btn-danger) {
    background: transparent;
    color: var(--error-color);
    border-color: color-mix(in srgb, var(--error-color) 30%, transparent);
  }
  .mpx :global(.btn-danger:hover:not(:disabled)) { background: color-mix(in srgb, var(--error-color) 10%, transparent); }

  /* Onglets */
  .mc-tabs {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 0.75rem 1rem;
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--outline-variant);
  }
  @media (min-width: 640px) {
    .mc-tabs { padding: 0.75rem 1.5rem; }
  }
  .tab-group {
    display: flex;
    width: fit-content;
    max-width: 100%;
    flex-wrap: nowrap;
    gap: 0.125rem;
    padding: 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    background: var(--surface-container);
    border: 1px solid var(--outline-variant);
    border-radius: 0.5rem;
  }
  .tab-group::-webkit-scrollbar { display: none; }
  .tab-button {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--on-surface-variant);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .tab-button:hover { background: var(--surface-hover); color: var(--on-surface); }
  .tab-button.active {
    background: var(--surface-container-lowest);
    color: var(--on-surface);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .tab-badge {
    min-width: 1.125rem;
    padding: 0 0.3125rem;
    border-radius: 9999px;
    background: var(--surface-container-high);
    color: var(--on-surface-variant);
    font-size: 0.6875rem;
    font-weight: 600;
    line-height: 1.125rem;
    text-align: center;
  }
  .tab-button.active .tab-badge {
    background: var(--primary-container-color);
    color: var(--on-primary-container-color);
  }

  /* Champs */
  .mpx :global(.input) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--outline-variant);
    background: var(--surface-container);
    color: var(--on-surface);
    font-size: 0.875rem;
    line-height: 1.4;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .mpx :global(.input::placeholder) { color: color-mix(in srgb, var(--on-surface-variant) 60%, transparent); }
  .mpx :global(.input:focus) {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 18%, transparent);
  }
  .field { display: flex; flex-direction: column; min-width: 0; }
  .mpx :global(.field-label) {
    display: block;
    margin-bottom: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--on-surface);
  }

  /* Chiffres alignés, séparés par un filet */
  .mc-kpis {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.5rem;
  }
  @media (min-width: 900px) {
    .mc-kpis { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .mc-kpis--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .mc-kpis > div + div {
      border-left: 1px solid var(--outline-variant);
      padding-left: 1.25rem;
    }
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
  .mc-kpis span {
    display: block;
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }

  .mpx :global(.mc-facts) { display: flex; flex-direction: column; }
  .mpx :global(.mc-facts > div) {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 0;
    border-top: 1px solid color-mix(in srgb, var(--outline-variant) 60%, transparent);
  }
  .mpx :global(.mc-facts > div:first-child) { border-top: none; padding-top: 0; }
  .mpx :global(.mc-facts dt) { font-size: 0.8125rem; color: var(--on-surface-variant); }
  .mpx :global(.mc-facts dd) {
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--on-surface);
    text-align: right;
    overflow-wrap: anywhere;
  }

  .mpx :global(.mc-person) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 100%;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--on-surface);
  }
  .mpx :global(.mc-code) {
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.8125rem;
    color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 10%, transparent);
  }
  .mpx :global(.mc-role) {
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

  .mc-bar,
  .mc-meter {
    display: block;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--surface-container-high);
    overflow: hidden;
  }
  .mc-bar { margin-top: 0.375rem; }
  .mc-bar > span,
  .mc-meter > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    transition: width 0.4s ease;
  }
  .mc-bar > span { background: var(--series-1); }

  /* Tuiles de tendance, comme Analytics */
  .metric-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
    border: 1px solid var(--outline-variant);
    border-radius: 0.75rem;
    background: var(--surface-container-low);
    overflow: hidden;
  }
  .metric-tab {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    margin: 0 -1px -1px 0;
    padding: 0.875rem 1rem;
    text-align: left;
    border-right: 1px solid var(--outline-variant);
    border-bottom: 1px solid var(--outline-variant);
    cursor: pointer;
    transition: background-color 120ms ease;
  }
  .metric-tab::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
  }
  .metric-tab:hover,
  .metric-tab[aria-selected='true'] { background: var(--surface-container); }
  .metric-tab[aria-selected='true']::before { background: var(--metric-color); }
  .metric-tab__label { font-size: 0.8125rem; color: var(--on-surface-variant); }
  .metric-tab__row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .metric-tab__value {
    font-family: var(--font-headline);
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.15;
    color: var(--on-surface);
    white-space: nowrap;
  }
  .metric-tab__delta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  /* Courbe : la période en trait plein, les 30 jours d'avant en pointillés */
  .mpx :global(.mc-chart) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.5rem;
  }
  .mpx :global(.mc-chart__y) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 0.6875rem;
    line-height: 1;
    text-align: right;
    color: var(--on-surface-variant);
    font-variant-numeric: tabular-nums;
  }
  .mpx :global(.mc-chart__plot) { display: block; width: 100%; overflow: visible; }
  .mpx :global(.mc-chart__grid) { stroke: var(--outline-variant); stroke-width: 1; vector-effect: non-scaling-stroke; }
  .mpx :global(.mc-chart__main) {
    fill: none;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .mpx :global(.mc-chart__previous) {
    fill: none;
    stroke: var(--series-neutral);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
    vector-effect: non-scaling-stroke;
  }
  .mpx :global(.mc-chart__x) {
    display: flex;
    justify-content: space-between;
    padding-top: 0.375rem;
    font-size: 0.6875rem;
    color: var(--on-surface-variant);
  }
  .mpx :global(.mc-legend) {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--on-surface-variant);
  }
  .mpx :global(.mc-legend span) { display: inline-flex; align-items: center; gap: 0.375rem; }
  .mpx :global(.mc-legend i) { display: inline-block; width: 10px; height: 10px; border-radius: 2px; }
  .mpx :global(.mc-legend .mc-legend__dash) {
    height: 0;
    border-top: 2px dashed var(--series-neutral);
    border-radius: 0;
  }

  .mc-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .mc-toolbar .mc-select { width: auto; max-width: 14rem; }
  .mc-search { flex: 1 1 16rem; min-width: 0; }

  .mc-timeline { padding: 1rem 1.25rem; }
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

  .mc-table {
    width: 100%;
    min-width: 640px;
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

  /* Onglet Staff (`StaffCaseTab.svelte`) */
  .sc-title {
    padding: 1rem 1rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--on-surface);
  }
  .sc-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .sc-brief { display: flex; flex-direction: column; padding-bottom: 0.25rem; }
  .sc-brief > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.55rem 1rem;
    border-top: 1px solid color-mix(in srgb, var(--outline-variant) 50%, transparent);
  }
  .sc-brief dt { font-size: 0.8125rem; color: var(--on-surface-variant); }
  .sc-brief dd {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--on-surface);
    font-variant-numeric: tabular-nums;
  }
  .sc-brief dd span { font-size: 0.6875rem; font-weight: 400; color: var(--on-surface-variant); }

  .sc-event {
    --tone: var(--on-surface-variant);
    position: relative;
    display: flex;
    gap: 0.75rem;
  }
  .sc-event--primary { --tone: var(--primary-color); }
  .sc-event--warning { --tone: var(--warning-color); }
  .sc-event--danger { --tone: var(--error-color); }
  .sc-event:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 24px;
    bottom: 0;
    width: 1px;
    background: var(--outline-variant);
  }
  .sc-event__dot {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 23px;
    height: 23px;
    border-radius: 9999px;
    color: var(--tone);
    background: color-mix(in srgb, var(--tone) 12%, var(--surface-container-lowest));
  }

  .warn-meter {
    --tone: var(--on-surface-variant);
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .warn-meter--warning { --tone: var(--warning-color); }
  .warn-meter--danger { --tone: var(--error-color); }
  .warn-meter__track { display: inline-flex; gap: 3px; }
  .warn-meter__step {
    width: 10px;
    height: 6px;
    border-radius: 2px;
    background: var(--surface-container-high);
    transition: background-color 0.2s ease;
  }
  .warn-meter__step.on { background: var(--tone); }
  .warn-meter__label { font-size: 0.75rem; font-weight: 600; color: var(--tone); }
</style>

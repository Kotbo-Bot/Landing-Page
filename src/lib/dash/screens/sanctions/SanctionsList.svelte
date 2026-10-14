<!--
  Onglet « Historique » de Sécurité > Sanctions : la liste, sa recherche, ses
  filtres par colonne, la sélection multiple, le dossier de sanction (rapport)
  et la suppression.

  Recopie du balisage de `Kotbo/apps/dashboard/src/pages/Sanctions.svelte`
  (branche `recette`), onglet `sanctions` et ses deux fenêtres. Les appels à
  l'API (`createSanctionReport`, `/sanctions/bulk`, `deleteSanction`…)
  modifient l'état de démo (`demo.svelte.ts`). La personne connectée est Lena,
  administratrice : elle peut supprimer, modifier tout rapport, et créer celui
  des sanctions qu'elle a prononcées.
  Écarts : les classes `dark:` sont écrites à leur valeur sombre (le site ne
  suit pas la classe `.dark` du dashboard) ; les fenêtres sont calées sur le
  cadre de l'aperçu ; les liens de preuve ne s'ouvrent pas (adresses fictives) ;
  les preuves ne s'ajoutent que par lien (pas d'envoi de fichier, de
  transcription ni d'import Discord). Pour tenir sans défilement : lignes
  en `py-3`, boutons de rapport sans largeur minimale et sans la phrase
  d'aide sous eux (elle reste en infobulle) ; dossier resserré (marges,
  raison et notes côte à côte) ; « Rapport mis à jour » en notification.
  `padding:0` en ligne sur le dossier : `.dash .modal-panel` (hors couche)
  l'emporte sur l'utilitaire `p-0` que pose le dashboard.
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { Button, FormInput } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { DEMO_RULES, VIEWER, type DemoReport, type DemoSanction } from '$lib/dash/fixtures/sanctions';
  import ColumnSortFilter, { type ColumnFilterOption } from './ColumnSortFilter.svelte';
  import type { SanctionsDemo } from './demo.svelte';
  import {
    dateLocale,
    durationLabel,
    filterAndSortSanctions,
    reportRuleIcon,
    sanitizeEvidenceLinks,
    statusLabel,
    toDateTimeLocal,
    tr,
    typeLabel,
    type SanctionFilters,
    type SortField,
    type SortOption,
  } from './lib';

  const TEXT = {
    fr: {
      list: 'Liste des sanctions',
      entries: (a: number, b: number) => `${a} / ${b} entrée(s)`,
      resetFilters: 'Réinitialiser filtres et tri',
      searchPh: 'Rechercher par type, cible, staff, raison…',
      bulkSelected: (n: number) => `${n} sélectionnée(s)`,
      bulkArchive: 'Archiver',
      bulkArchiveTitle: 'Archiver les infractions sélectionnées ?',
      bulkArchiveDesc: 'Elles sortent du casier actif et cessent de compter dans le score de warns, mais restent conservées et consultables.',
      bulkUnarchive: 'Désarchiver',
      bulkUnarchiveTitle: 'Remettre ces infractions au casier actif ?',
      bulkUnarchiveDesc: "Elles recomptent dans le score de warns et l'escalade automatique.",
      bulkLock: 'Verrouiller',
      bulkLockTitle: 'Verrouiller la contestation ?',
      bulkLockDesc: "Le membre ne pourra plus jamais contester ces infractions, même après le délai d'attente.",
      bulkUnlock: 'Déverrouiller',
      bulkUnlockTitle: 'Rendre ces infractions contestables ?',
      bulkUnlockDesc: 'Le membre pourra de nouveau demander leur réexamen.',
      bulkDelete: 'Supprimer',
      bulkDeleteTitle: 'Supprimer définitivement ?',
      bulkDeleteDesc: "Les infractions disparaissent de la base et ne pourront pas être restaurées. Préfère l'archivage pour garder la trace.",
      bulkDone: (n: number) => `${n} infraction(s) mise(s) à jour.`,
      bulkClear: 'Tout désélectionner',
      selectAll: 'Tout sélectionner',
      selectRow: 'Sélectionner cette infraction',
      colDate: 'Date',
      colType: 'Type',
      colTarget: 'Cible',
      colStaff: 'Staff',
      colDuration: 'Durée',
      colStatus: 'Statut',
      colReport: 'Rapport',
      badgeArchived: 'archivée',
      badgeLocked: 'verrouillée',
      addProof: 'Ajouter la preuve',
      addProofHint: 'Ce rapport est pré-rempli mais nécessite un lien de preuve (capture d’écran, etc.).',
      viewReport: 'Voir le rapport',
      viewReportHint: 'Le rapport de sanction existe déjà et peut être consulté.',
      createReport: 'Créer le rapport',
      createReportHint: 'Ouvre le formulaire pour compléter le rapport lié à cette sanction.',
      reportReserved: 'Rapport réservé',
      reportReservedHint: 'Seule la personne qui a appliqué la sanction peut créer ce rapport.',
      deleteTitle: 'Supprimer cette infraction',
      delete: 'Supprimer',
      noSanctions: 'Aucune sanction enregistrée.',
      noMatch: 'Aucune sanction ne correspond aux filtres appliqués.',
      sanctionFile: 'Dossier de sanction',
      appliedTo: 'Appliquée à',
      by: 'par',
      close: 'Fermer',
      closeModal: 'Fermer le modal',
      incidentDate: "Date de l'incident",
      announcedDuration: 'Durée annoncée',
      na: 'N/A',
      brokenRules: 'Règles enfreintes',
      detailedReason: 'Raison détaillée',
      evidence: 'Preuves',
      evidenceLink: 'Lien de preuve',
      additionalNotes: 'Notes complémentaires',
      reportBy: 'Rapport rédigé par',
      editReport: 'Modifier le rapport',
      incidentDatetime: "Date et heure de l'incident",
      appliedDuration: 'Durée appliquée',
      durationPh: 'Ex : 2h, 1j, permanent',
      selectRulesPh: 'Sélectionner les articles du règlement…',
      rulesSelected: (n: number) => `${n} regle(s) selectionnee(s)`,
      ruleScope: 'Règlement',
      describePh: 'Décris précisément les faits reprochés…',
      evidenceUrls: 'Preuves (URLs)',
      evidencePh: 'Lien de preuve (https://…)',
      deleteLink: 'Supprimer ce lien',
      addLink: 'Ajouter un lien',
      contextNotes: 'Notes contextuelles',
      contextPh: 'Contexte, antécédents, remarques…',
      cancel: 'Annuler',
      updateReport: 'Mettre à jour le rapport',
      finalize: 'Finaliser et créer le rapport',
      initialReason: (r: string) => `Raison initiale de la sanction: ${r}`,
      selectRule: 'Sélectionne au moins une règle enfreinte.',
      enterDuration: 'Renseigne la durée de la sanction.',
      addProofLink: 'Ajoute au moins un lien de preuve valide (http/https).',
      fillRequired: 'Merci de remplir tous les champs obligatoires du rapport.',
      reportUpdated: 'Rapport mis à jour.',
      sensitive: 'Action sensible',
      confirmDeletion: 'Confirmer la suppression',
      deletePre: "Tu es sur le point de supprimer l'infraction",
      forTarget: 'pour',
      irreversible: 'Cette action est irréversible.',
      deleteKeyword: 'SUPPRIMER',
      typeDelete: (w: string) => `Tape ${w} pour valider`,
      deletePermanently: 'Supprimer définitivement',
      deleteCancelled: 'Suppression annulée : validation finale non confirmée.',
      deleted: 'Infraction supprimée.',
    },
    en: {
      list: 'Sanctions list',
      entries: (a: number, b: number) => `${a} / ${b} entry(ies)`,
      resetFilters: 'Reset filters and sorting',
      searchPh: 'Search by type, target, staff, reason...',
      bulkSelected: (n: number) => `${n} selected`,
      bulkArchive: 'Archive',
      bulkArchiveTitle: 'Archive the selected infractions?',
      bulkArchiveDesc: 'They leave the active record and stop counting towards the warn score, but stay stored and readable.',
      bulkUnarchive: 'Unarchive',
      bulkUnarchiveTitle: 'Restore these infractions to the active record?',
      bulkUnarchiveDesc: 'They count again towards the warn score and automatic escalation.',
      bulkLock: 'Lock',
      bulkLockTitle: 'Lock appeals?',
      bulkLockDesc: 'The member will never be able to appeal these infractions again, even after the waiting period.',
      bulkUnlock: 'Unlock',
      bulkUnlockTitle: 'Make these infractions appealable again?',
      bulkUnlockDesc: 'The member will be able to request a review again.',
      bulkDelete: 'Delete',
      bulkDeleteTitle: 'Delete permanently?',
      bulkDeleteDesc: 'The infractions disappear from the database and cannot be restored. Prefer archiving to keep a trace.',
      bulkDone: (n: number) => `${n} infraction(s) updated.`,
      bulkClear: 'Clear selection',
      selectAll: 'Select all',
      selectRow: 'Select this infraction',
      colDate: 'Date',
      colType: 'Type',
      colTarget: 'Target',
      colStaff: 'Staff',
      colDuration: 'Duration',
      colStatus: 'Status',
      colReport: 'Report',
      badgeArchived: 'archived',
      badgeLocked: 'locked',
      addProof: 'Add proof',
      addProofHint: 'This report is pre-filled but requires an evidence link (screenshot, etc.).',
      viewReport: 'View report',
      viewReportHint: 'The sanction report already exists and can be viewed.',
      createReport: 'Create report',
      createReportHint: 'Opens the form to complete the report linked to this sanction.',
      reportReserved: 'Report restricted',
      reportReservedHint: 'Only the person who applied the sanction can create this report.',
      deleteTitle: 'Delete this infraction',
      delete: 'Delete',
      noSanctions: 'No sanctions recorded.',
      noMatch: 'No sanction matches the filters applied.',
      sanctionFile: 'Sanction File',
      appliedTo: 'Applied to',
      by: 'by',
      close: 'Close',
      closeModal: 'Close modal',
      incidentDate: 'Incident date',
      announcedDuration: 'Announced duration',
      na: 'N/A',
      brokenRules: 'Broken rules',
      detailedReason: 'Detailed reason',
      evidence: 'Evidence',
      evidenceLink: 'Evidence link',
      additionalNotes: 'Additional notes',
      reportBy: 'Report written by',
      editReport: 'Edit report',
      incidentDatetime: 'Incident date and time',
      appliedDuration: 'Applied duration',
      durationPh: 'E.g. 2h, 1d, permanent',
      selectRulesPh: 'Select rulebook articles...',
      rulesSelected: (n: number) => `${n} rule(s) selected`,
      ruleScope: 'Rules',
      describePh: 'Describe the alleged facts precisely...',
      evidenceUrls: 'Evidence (URLs)',
      evidencePh: 'Evidence link (https://…)',
      deleteLink: 'Remove this link',
      addLink: 'Add a link',
      contextNotes: 'Context notes',
      contextPh: 'Context, history, remarks...',
      cancel: 'Cancel',
      updateReport: 'Update report',
      finalize: 'Finalize and create report',
      initialReason: (r: string) => `Initial sanction reason: ${r}`,
      selectRule: 'Select at least one broken rule.',
      enterDuration: 'Enter the sanction duration.',
      addProofLink: 'Add at least one valid evidence link (http/https).',
      fillRequired: 'Please fill in all required report fields.',
      reportUpdated: 'Report updated successfully.',
      sensitive: 'Sensitive action',
      confirmDeletion: 'Confirm deletion',
      deletePre: 'You are about to delete the infraction',
      forTarget: 'for',
      irreversible: 'This action is irreversible.',
      deleteKeyword: 'DELETE',
      typeDelete: (w: string) => `Type ${w} to confirm`,
      deletePermanently: 'Delete permanently',
      deleteCancelled: 'Deletion cancelled: final validation not confirmed.',
      deleted: 'Infraction deleted successfully.',
    },
  };

  const { demo }: { demo: SanctionsDemo } = $props();
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const uid = $props.id();

  // ── Liste, recherche, filtres, tri ───────────────────────────────────────
  let searchQuery = $state('');
  let filters = $state<SanctionFilters>({ statuses: [], types: [], moderators: [], targets: [] });
  let sortOptions = $state<SortOption[]>([{ field: 'date', direction: 'desc' }]);

  const sanctions = $derived(demo.sanctions);
  const sanctionReports = $derived(demo.reports);

  function toggleFilter(filterType: keyof SanctionFilters, value: string) {
    const filterList = filters[filterType];
    filters[filterType] = filterList.includes(value) ? filterList.filter((v) => v !== value) : [...filterList, value];
  }

  function toggleSort(field: SortField) {
    const existingIndex = sortOptions.findIndex((opt) => opt.field === field);
    if (existingIndex >= 0) {
      const option = sortOptions[existingIndex];
      sortOptions[existingIndex] = { field: option.field, direction: option.direction === 'asc' ? 'desc' : 'asc' };
    } else {
      sortOptions = [...sortOptions, { field, direction: 'asc' }];
    }
  }

  function sortDirectionFor(field: SortField) {
    return sortOptions.find((entry) => entry.field === field)?.direction ?? null;
  }

  function resetFiltersAndSort() {
    searchQuery = '';
    filters = { statuses: [], types: [], moderators: [], targets: [] };
    sortOptions = [{ field: 'date', direction: 'desc' }];
  }

  const uniqueStatuses = $derived([...new Set(sanctions.map((s) => s.status))].sort());
  const uniqueTypes = $derived([...new Set(sanctions.map((s) => s.type))].sort());
  function uniqueBy(key: 'moderatorUserId' | 'targetUserId', tag: 'moderatorTag' | 'targetTag') {
    return [...new Set(sanctions.map((s) => s[key]))].sort((a, b) => {
      const tagA = sanctions.find((s) => s[key] === a)?.[tag] || a;
      const tagB = sanctions.find((s) => s[key] === b)?.[tag] || b;
      return tagA.localeCompare(tagB);
    });
  }

  const hasActiveFiltersOrSort = $derived(
    searchQuery.trim().length > 0 ||
      filters.statuses.length > 0 ||
      filters.types.length > 0 ||
      filters.moderators.length > 0 ||
      filters.targets.length > 0 ||
      sortOptions.length > 1 ||
      (sortOptions.length === 1 && (sortOptions[0].field !== 'date' || sortOptions[0].direction !== 'desc')),
  );

  const statusFilterOptions = $derived<ColumnFilterOption[]>(uniqueStatuses.map((status) => ({ value: status, label: statusLabel(status, locale) })));
  const typeFilterOptions = $derived<ColumnFilterOption[]>(uniqueTypes.map((type) => ({ value: type, label: typeLabel(type, locale) })));
  const moderatorFilterOptions = $derived<ColumnFilterOption[]>(
    uniqueBy('moderatorUserId', 'moderatorTag').map((id) => ({ value: id, label: sanctions.find((e) => e.moderatorUserId === id)?.moderatorTag || id })),
  );
  const targetFilterOptions = $derived<ColumnFilterOption[]>(
    uniqueBy('targetUserId', 'targetTag').map((id) => ({ value: id, label: sanctions.find((e) => e.targetUserId === id)?.targetTag || id })),
  );

  const searchedSanctions = $derived.by(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sanctions;
    return sanctions.filter((entry) =>
      [entry.type, entry.targetTag, entry.moderatorTag, tr(entry.reason, locale), statusLabel(entry.status, locale)]
        .map((value) => (value || '').toLowerCase())
        .some((value) => value.includes(query)),
    );
  });

  const filteredAndSortedSanctions = $derived(filterAndSortSanctions(searchedSanctions, filters, sortOptions));

  // ── Sélection multiple ───────────────────────────────────────────────────
  let selectedIds = $state<string[]>([]);
  const selectedCount = $derived(selectedIds.length);
  const allVisibleSelected = $derived(
    filteredAndSortedSanctions.length > 0 && filteredAndSortedSanctions.every((entry) => selectedIds.includes(entry.id)),
  );

  function toggleSelection(id: string) {
    selectedIds = selectedIds.includes(id) ? selectedIds.filter((entry) => entry !== id) : [...selectedIds, id];
  }

  function toggleSelectAllVisible() {
    selectedIds = allVisibleSelected ? [] : filteredAndSortedSanctions.map((entry) => entry.id);
  }

  type BulkAction = 'archive' | 'unarchive' | 'lock' | 'unlock' | 'delete';
  const BULK_CONFIRMS = $derived<Record<BulkAction, { title: string; description: string; confirmLabel: string; danger: boolean }>>({
    archive: { title: t.bulkArchiveTitle, description: t.bulkArchiveDesc, confirmLabel: t.bulkArchive, danger: false },
    unarchive: { title: t.bulkUnarchiveTitle, description: t.bulkUnarchiveDesc, confirmLabel: t.bulkUnarchive, danger: false },
    lock: { title: t.bulkLockTitle, description: t.bulkLockDesc, confirmLabel: t.bulkLock, danger: false },
    unlock: { title: t.bulkUnlockTitle, description: t.bulkUnlockDesc, confirmLabel: t.bulkUnlock, danger: false },
    delete: { title: t.bulkDeleteTitle, description: t.bulkDeleteDesc, confirmLabel: t.bulkDelete, danger: true },
  });

  async function runBulkAction(action: BulkAction) {
    if (selectedIds.length === 0) return;
    const meta = BULK_CONFIRMS[action];
    const confirmed = await demo.ask({
      title: meta.title,
      description: `${meta.description} (${t.bulkSelected(selectedIds.length)})`,
      confirmLabel: meta.confirmLabel,
      variant: meta.danger ? 'danger' : 'default',
    });
    if (!confirmed) return;

    const ids = new Set(selectedIds);
    if (action === 'delete') {
      demo.sanctions = demo.sanctions.filter((entry) => !ids.has(entry.id));
      demo.reports = demo.reports.filter((entry) => !ids.has(entry.sanctionId));
    } else {
      for (const entry of demo.sanctions) {
        if (!ids.has(entry.id)) continue;
        if (action === 'archive') entry.archivedAt = new Date().toISOString();
        if (action === 'unarchive') { entry.archivedAt = null; entry.archiveReason = null; }
        if (action === 'lock') entry.appealable = false;
        if (action === 'unlock') { entry.appealable = true; entry.appealLockReason = null; }
      }
    }
    demo.toast('success', t.bulkDone(ids.size));
    selectedIds = [];
  }

  // ── Rapport ──────────────────────────────────────────────────────────────
  const reportRuleOptions = $derived(
    DEMO_RULES.map((rule) => ({ id: rule.id, emoji: rule.emoji, label: tr(rule.label, locale), details: tr(rule.details, locale) })),
  );

  type ReportActionState = { label: string; icon: string; disabled: boolean; variant: 'primary' | 'secondary' | 'ghost'; hint: string };

  function getReportActionState(entry: DemoSanction, linkedReport: DemoReport | undefined): ReportActionState {
    if (linkedReport) {
      if (linkedReport.evidenceLinks.length === 0) {
        return { label: t.addProof, icon: 'alert-triangle', disabled: false, variant: 'secondary', hint: t.addProofHint };
      }
      return { label: t.viewReport, icon: 'paper', disabled: false, variant: 'secondary', hint: t.viewReportHint };
    }
    if (entry.moderatorUserId === VIEWER.userId) {
      return { label: t.createReport, icon: 'plus', disabled: false, variant: 'primary', hint: t.createReportHint };
    }
    return { label: t.reportReserved, icon: 'lock', disabled: true, variant: 'ghost', hint: t.reportReservedHint };
  }

  let modalOpen = $state(false);
  let modalMode = $state<'create' | 'view'>('create');
  let selectedSanctionId = $state('');
  let incidentAt = $state('');
  let sanctionDurationLabel = $state('');
  let selectedRuleIds = $state<string[]>([]);
  let detailedReason = $state('');
  let evidenceLinks = $state<string[]>(['']);
  let additionalNotes = $state('');
  let isEditing = $state(false);
  let reportMessage = $state('');
  let reportMessageIsError = $state(false);
  let rulesOpen = $state(false);

  const selectedSanction = $derived(sanctions.find((entry) => entry.id === selectedSanctionId) || null);
  const selectedReport = $derived(sanctionReports.find((entry) => entry.sanctionId === selectedSanctionId) || null);
  const selectedReportRules = $derived(
    selectedReport ? reportRuleOptions.filter((rule) => selectedReport.ruleIds.includes(rule.id)) : [],
  );
  const selectedDraftRules = $derived(reportRuleOptions.filter((rule) => selectedRuleIds.includes(rule.id)));
  const canCreateSelectedReport = $derived(
    Boolean(selectedSanction && !selectedReport && selectedSanction.moderatorUserId === VIEWER.userId && reportRuleOptions.length > 0),
  );
  // Lena est administratrice : elle peut modifier tous les rapports.
  const canEditSelectedReport = $derived(Boolean(selectedReport));

  function prepareDraftFromSanction(sanction: DemoSanction) {
    selectedSanctionId = sanction.id;
    incidentAt = toDateTimeLocal(sanction.createdAt);
    sanctionDurationLabel = durationLabel(sanction.durationSeconds, locale);
    selectedRuleIds = [];
    detailedReason = tr(sanction.reason, locale);
    evidenceLinks = [''];
    additionalNotes = tr(sanction.reason, locale) ? t.initialReason(tr(sanction.reason, locale)) : '';
    reportMessage = '';
    reportMessageIsError = false;
    isEditing = false;
    rulesOpen = false;
  }

  function startEditing() {
    if (!selectedReport) return;
    incidentAt = toDateTimeLocal(selectedReport.incidentAt);
    sanctionDurationLabel = selectedReport.sanctionDurationLabel || '';
    selectedRuleIds = [...selectedReport.ruleIds];
    detailedReason = tr(selectedReport.detailedReason, locale);
    evidenceLinks = selectedReport.evidenceLinks.length > 0 ? [...selectedReport.evidenceLinks] : [''];
    additionalNotes = tr(selectedReport.additionalNotes, locale);
    isEditing = true;
  }

  function openReportModal(sanction: DemoSanction) {
    prepareDraftFromSanction(sanction);
    const linkedReport = sanctionReports.find((entry) => entry.sanctionId === sanction.id);
    modalOpen = true;
    if (linkedReport) {
      modalMode = 'view';
      if (linkedReport.evidenceLinks.length === 0) startEditing();
    } else {
      modalMode = 'create';
    }
  }

  function closeModal() {
    modalOpen = false;
    isEditing = false;
    reportMessage = '';
    reportMessageIsError = false;
  }

  function toggleRuleSelection(ruleId: string, checked: boolean) {
    selectedRuleIds = checked ? [...new Set([...selectedRuleIds, ruleId])] : selectedRuleIds.filter((entry) => entry !== ruleId);
  }

  function fail(message: string) {
    reportMessage = message;
    reportMessageIsError = true;
  }

  function submitReport() {
    reportMessage = '';
    reportMessageIsError = false;
    if (!selectedSanction || selectedReport || !canCreateSelectedReport) return;
    if (selectedRuleIds.length === 0) return fail(t.selectRule);
    if (!sanctionDurationLabel.trim()) return fail(t.enterDuration);
    const sanitizedLinks = sanitizeEvidenceLinks(evidenceLinks);
    if (sanitizedLinks.length === 0) return fail(t.addProofLink);
    if (!detailedReason.trim()) return fail(t.fillRequired);

    const text = detailedReason.trim();
    const notes = additionalNotes.trim();
    demo.reports = [
      ...demo.reports,
      {
        id: `demo-report-${Date.now()}`,
        sanctionId: selectedSanction.id,
        incidentAt: new Date(incidentAt).toISOString(),
        sanctionDurationLabel: sanctionDurationLabel.trim(),
        ruleIds: [...selectedRuleIds],
        detailedReason: { fr: text, en: text },
        evidenceLinks: sanitizedLinks,
        additionalNotes: notes ? { fr: notes, en: notes } : null,
        createdByUserId: VIEWER.userId,
        createdByTag: VIEWER.username,
      },
    ];
    modalMode = 'view';
    rulesOpen = false;
  }

  function handleUpdateReport() {
    if (!selectedReport) return;
    const sanitizedLinks = sanitizeEvidenceLinks(evidenceLinks);
    if (sanitizedLinks.length === 0) return fail(t.addProofLink);
    if (selectedRuleIds.length === 0) return fail(t.selectRule);

    const report = demo.reports.find((entry) => entry.id === selectedReport.id);
    if (!report) return;
    const text = detailedReason.trim();
    const notes = additionalNotes.trim();
    report.incidentAt = new Date(incidentAt).toISOString();
    report.sanctionDurationLabel = sanctionDurationLabel.trim();
    report.ruleIds = [...selectedRuleIds];
    report.detailedReason = { fr: text, en: text };
    report.evidenceLinks = sanitizedLinks;
    report.additionalNotes = notes ? { fr: notes, en: notes } : null;
    isEditing = false;
    rulesOpen = false;
    // Message en ligne dans le dashboard ; en notification ici, faute de place.
    reportMessage = '';
    demo.toast('success', t.reportUpdated);
  }

  // ── Suppression ──────────────────────────────────────────────────────────
  let deleteModalOpen = $state(false);
  let pendingDeletion = $state<DemoSanction | null>(null);
  let deleteConfirmationText = $state('');
  let deletionMessage = $state('');
  let deletionMessageIsError = $state(false);

  function openDeleteModal(entry: DemoSanction) {
    deletionMessage = '';
    deletionMessageIsError = false;
    pendingDeletion = entry;
    deleteConfirmationText = '';
    deleteModalOpen = true;
  }

  function closeDeleteModal() {
    deleteModalOpen = false;
    pendingDeletion = null;
    deleteConfirmationText = '';
  }

  function confirmDeleteSanction() {
    if (!pendingDeletion) return;
    if (deleteConfirmationText.trim().toUpperCase() !== t.deleteKeyword) {
      deletionMessage = t.deleteCancelled;
      deletionMessageIsError = true;
      closeDeleteModal();
      return;
    }
    const id = pendingDeletion.id;
    closeDeleteModal();
    demo.sanctions = demo.sanctions.filter((entry) => entry.id !== id);
    demo.reports = demo.reports.filter((entry) => entry.sanctionId !== id);
    selectedIds = selectedIds.filter((entry) => entry !== id);
    if (selectedSanctionId === id) closeModal();
    deletionMessage = t.deleted;
    deletionMessageIsError = false;
  }

  // ── Fenêtres : focus à l'ouverture, Escape ferme ─────────────────────────
  let reportPanel = $state<HTMLDivElement>();
  let deletePanel = $state<HTMLDivElement>();
  $effect(() => {
    if (modalOpen && reportPanel) reportPanel.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  });
  $effect(() => {
    if (deleteModalOpen && deletePanel) deletePanel.querySelector<HTMLElement>('input')?.focus();
  });

  // Escape au niveau de la fenêtre : le focus peut être retombé sur la page
  // (dossier membre refermé), la fenêtre doit quand même se fermer.
  function onWindowKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || (!modalOpen && !deleteModalOpen)) return;
    // Le dossier membre et les confirmations par-dessus se ferment d'abord.
    if (demo.caseUserId || demo.confirm) return;
    if (rulesOpen) { rulesOpen = false; return; }
    if (deleteModalOpen) closeDeleteModal();
    else closeModal();
  }

  const fmtDate = (iso: string) => new Date(iso).toLocaleString(dateLocale(locale));
</script>

<section class="section-card-flush font-inter" data-tour="sanctions-list">
  <div class="px-6 py-5 border-b border-outline-variant flex items-center justify-between">
    <h3 class="text-lg font-semibold">{t.list}</h3>
    <div class="flex items-center gap-3">
      <span class="text-xs font-bold text-on-surface-variant">{t.entries(filteredAndSortedSanctions.length, sanctions.length)}</span>
      {#if hasActiveFiltersOrSort}
        <button onclick={resetFiltersAndSort} class="text-xs font-bold text-primary hover:text-primary/80 transition">
          {t.resetFilters}
        </button>
      {/if}
    </div>
  </div>
  <div class="px-6 pb-4">
    <label class="relative block w-full top-1.5 md:max-w-xl">
      <span class="sr-only">{t.searchPh}</span>
      <Papicon icon="search" size={18} class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
      <FormInput
        type="search"
        bind:value={searchQuery}
        placeholder={t.searchPh}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </label>
  </div>
  {#if deletionMessage}
    <div class="px-6 pt-4 text-sm font-semibold {deletionMessageIsError ? 'text-error' : 'text-success'}" role="status">{deletionMessage}</div>
  {/if}
  {#if selectedCount > 0}
    <div class="px-6 pb-4 flex flex-wrap items-center gap-2">
      <span class="text-xs font-bold text-on-surface-variant mr-1">{t.bulkSelected(selectedCount)}</span>
      <Button onclick={() => runBulkAction('archive')} icon="inbox" title={t.bulkArchiveDesc}>{t.bulkArchive}</Button>
      <Button onclick={() => runBulkAction('unarchive')} icon="undo" title={t.bulkUnarchiveDesc}>{t.bulkUnarchive}</Button>
      <Button onclick={() => runBulkAction('lock')} icon="lock" title={t.bulkLockDesc}>{t.bulkLock}</Button>
      <Button onclick={() => runBulkAction('unlock')} icon="unlock" title={t.bulkUnlockDesc}>{t.bulkUnlock}</Button>
      <Button onclick={() => runBulkAction('delete')} variant="danger" icon="trash" title={t.bulkDeleteDesc}>{t.bulkDelete}</Button>
      <button onclick={() => (selectedIds = [])} class="text-xs font-bold text-primary hover:text-primary/80 transition">
        {t.bulkClear}
      </button>
    </div>
  {/if}
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-white/5">
          <th class="px-4 py-4 w-10">
            <input type="checkbox" checked={allVisibleSelected} onchange={toggleSelectAllVisible} aria-label={t.selectAll} class="accent-primary w-4 h-4" />
          </th>
          <th class="px-4 py-4">
            <ColumnSortFilter label={t.colDate} sortField="date" sortDirection={sortDirectionFor('date')} onToggleSort={() => toggleSort('date')} />
          </th>
          <th class="px-4 py-4">
            <ColumnSortFilter
              label={t.colType}
              sortField="type"
              sortDirection={sortDirectionFor('type')}
              onToggleSort={() => toggleSort('type')}
              options={typeFilterOptions}
              selectedValues={filters.types}
              onToggleValue={(value) => toggleFilter('types', value)}
            />
          </th>
          <th class="px-4 py-4">
            <ColumnSortFilter
              label={t.colTarget}
              sortField="target"
              sortDirection={sortDirectionFor('target')}
              onToggleSort={() => toggleSort('target')}
              options={targetFilterOptions}
              selectedValues={filters.targets}
              onToggleValue={(value) => toggleFilter('targets', value)}
              searchable={true}
            />
          </th>
          <th class="px-4 py-4">
            <ColumnSortFilter
              label={t.colStaff}
              sortField="moderator"
              sortDirection={sortDirectionFor('moderator')}
              onToggleSort={() => toggleSort('moderator')}
              options={moderatorFilterOptions}
              selectedValues={filters.moderators}
              onToggleValue={(value) => toggleFilter('moderators', value)}
              searchable={true}
            />
          </th>
          <th class="px-4 py-4">
            <ColumnSortFilter label={t.colDuration} sortField="duration" sortDirection={sortDirectionFor('duration')} onToggleSort={() => toggleSort('duration')} />
          </th>
          <th class="px-4 py-4">
            <ColumnSortFilter
              label={t.colStatus}
              sortField="status"
              sortDirection={sortDirectionFor('status')}
              onToggleSort={() => toggleSort('status')}
              options={statusFilterOptions}
              selectedValues={filters.statuses}
              onToggleValue={(value) => toggleFilter('statuses', value)}
            />
          </th>
          <th class="px-4 py-4 text-body-sm font-bold text-on-surface-variant">{t.colReport}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800">
        {#each filteredAndSortedSanctions as entry (entry.id)}
          {@const linkedReport = sanctionReports.find((report) => report.sanctionId === entry.id)}
          {@const reportAction = getReportActionState(entry, linkedReport)}
          <tr class="hover:bg-white/5 transition-colors {entry.archivedAt ? 'opacity-60' : ''}">
            <td class="px-4 py-3">
              <input type="checkbox" checked={selectedIds.includes(entry.id)} onchange={() => toggleSelection(entry.id)} aria-label={t.selectRow} class="accent-primary w-4 h-4" />
            </td>
            <td class="px-4 py-3 text-xs font-medium">{fmtDate(entry.createdAt)}</td>
            <td class="px-4 py-3 text-xs font-bold text-primary">
              {typeLabel(entry.type, locale)}
              {#if entry.archivedAt}
                <span class="ml-1 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-2xs font-bold text-success" title={tr(entry.archiveReason, locale)}>{t.badgeArchived}</span>
              {/if}
              {#if entry.appealable === false}
                <span class="ml-1 inline-flex items-center rounded-full bg-error/10 px-2 py-0.5 text-2xs font-bold text-error" title={tr(entry.appealLockReason, locale)}>{t.badgeLocked}</span>
              {/if}
            </td>
            <td class="px-4 py-3 text-xs">
              <button onclick={() => (demo.caseUserId = entry.targetUserId)} class="hover:text-primary transition-colors font-bold text-left">
                @{entry.targetTag}
              </button>
            </td>
            <td class="px-4 py-3 text-xs">
              <button onclick={() => (demo.caseUserId = entry.moderatorUserId)} class="hover:text-primary transition-colors font-bold text-left">
                @{entry.moderatorTag}
              </button>
            </td>
            <td class="px-4 py-3 text-xs">{durationLabel(entry.durationSeconds, locale)}</td>
            <td class="px-4 py-3 text-xs">
              <span class="inline-flex items-center rounded-full px-3 py-1 text-2xs font-bold {entry.status === 'ACTIVE' ? 'bg-warning/10 text-warning' : entry.status === 'RESOLVED' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}">
                {statusLabel(entry.status, locale)}
              </span>
            </td>
            <td class="px-4 py-3 text-xs">
              <div class="flex flex-nowrap items-center gap-2">
                <Button
                  onclick={() => openReportModal(entry)}
                  disabled={reportAction.disabled}
                  title={reportAction.hint}
                  variant={reportAction.variant}
                  icon={reportAction.icon}
                >{reportAction.label}</Button>
                <Button onclick={() => openDeleteModal(entry)} title={t.deleteTitle} variant="danger" icon="trash">{t.delete}</Button>
              </div>
            </td>
          </tr>
        {/each}
        {#if sanctions.length === 0}
          <tr>
            <td colspan="8" class="px-6 py-14 text-center text-on-surface-variant">{t.noSanctions}</td>
          </tr>
        {:else if filteredAndSortedSanctions.length === 0}
          <tr>
            <td colspan="8" class="px-6 py-14 text-center text-on-surface-variant">{t.noMatch}</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</section>

<svelte:window onkeydown={onWindowKeydown} />

{#if modalOpen && selectedSanction}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="modal-backdrop"
    style="position:absolute"
    onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
    role="presentation"
  >
    <div
      bind:this={reportPanel}
      class="modal-panel modal-panel-lg space-y-0 p-0 font-inter overflow-hidden rounded-xl flex flex-col"
      style="max-height:96%;padding:0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="{uid}-title"
    >
      <div class="relative bg-linear-to-br from-primary/10 via-surface to-surface px-8 py-4 border-b border-outline-variant/5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold text-primary">{t.sanctionFile}</p>
            <h3 id="{uid}-title" class="text-2xl font-semibold text-on-surface mt-1">{typeLabel(selectedSanction.type, locale)}</h3>
            <p class="text-xs font-bold text-on-surface-variant mt-1">
              {t.appliedTo}
              <button onclick={() => (demo.caseUserId = selectedSanction.targetUserId)} class="text-on-surface transition-colors font-semibold enabled:hover:text-primary">
                @{selectedSanction.targetTag}
              </button>
              {t.by}
              <button onclick={() => (demo.caseUserId = selectedSanction.moderatorUserId)} class="text-on-surface transition-colors font-semibold enabled:hover:text-primary">
                @{selectedSanction.moderatorTag}
              </button>
            </p>
          </div>
          <button
            data-autofocus
            onclick={closeModal}
            aria-label={t.close}
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-on-surface/5 text-on-surface-variant hover:bg-on-surface/10 hover:text-on-surface transition-all"
          >
            <Papicon icon="x" size={20} />
          </button>
        </div>
      </div>

      <div class="px-8 py-5 space-y-6 min-h-0 overflow-hidden">
        {#if modalMode === 'view' && selectedReport && !isEditing}
          <div class="space-y-3 animate-in fade-in duration-300">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-on-surface-variant/40 px-1">{t.incidentDate}</p>
                <div class="rounded-lg bg-surface-container-high/40 px-5 py-3 text-sm font-bold text-on-surface">{fmtDate(selectedReport.incidentAt)}</div>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-on-surface-variant/40 px-1">{t.announcedDuration}</p>
                <div class="rounded-lg bg-surface-container-high/40 px-5 py-3 text-sm font-bold text-on-surface">{selectedReport.sanctionDurationLabel || t.na}</div>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-xs font-medium text-on-surface-variant/40 px-1">{t.brokenRules}</p>
              {@render ruleChips(selectedReportRules)}
            </div>

            <div class="space-y-3">
              <p class="text-xs font-medium text-on-surface-variant/40 px-1">{t.detailedReason}</p>
              <div class="rounded-xl bg-surface-container-high/30 px-6 py-3 text-sm text-on-surface-variant leading-relaxed italic border border-outline-variant/5">
                "{tr(selectedReport.detailedReason, locale)}"
              </div>
            </div>

            {#if selectedReport.evidenceLinks.length > 0}
              <div class="space-y-3">
                <p class="text-xs font-medium text-on-surface-variant/40 px-1">{t.evidence}</p>
                <div class="flex flex-wrap gap-2">
                  {#each selectedReport.evidenceLinks as link (link)}
                    <!-- Lien vers la preuve dans le dashboard ; adresses fictives ici, rien à ouvrir. -->
                    <span class="inline-flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary" title={link}>
                      <Papicon icon="external-link" size={14} />
                      {t.evidenceLink}
                    </span>
                  {/each}
                </div>
              </div>
            {/if}

            {#if selectedReport.additionalNotes}
              <div class="space-y-3">
                <p class="text-xs font-medium text-on-surface-variant/40 px-1">{t.additionalNotes}</p>
                <p class="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-lg border border-outline-variant/10">{tr(selectedReport.additionalNotes, locale)}</p>
              </div>
            {/if}


            <div class="pt-3 flex flex-col items-center gap-3 border-t border-outline-variant/10">
              <p class="text-2xs font-bold text-on-surface-variant/30 text-center">
                {t.reportBy}
                <button onclick={() => (demo.caseUserId = selectedReport.createdByUserId)} class="hover:text-primary transition-colors font-bold">
                  @{selectedReport.createdByTag}
                </button>
              </p>
              {#if canEditSelectedReport}
                <button onclick={startEditing} class="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-xs font-semibold text-on-primary transition-all active:scale-95">
                  <Papicon icon="edit-3" size={16} />
                  {t.editReport}
                </button>
              {/if}
            </div>
          </div>
        {:else}
          <div class="space-y-3 animate-in fade-in duration-300">
            {#if !canCreateSelectedReport && !isEditing}
              <div class="rounded-lg bg-warning/10 border border-warning/20 p-4 flex items-center gap-4">
                <Papicon icon="lock" class="text-warning" />
                <p class="text-xs font-bold text-warning">{t.reportReservedHint}</p>
              </div>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label for="{uid}-incident" class="field-label">{t.incidentDatetime}</label>
                <input id="{uid}-incident" type="datetime-local" bind:value={incidentAt} class="w-full rounded-lg bg-surface-container-high px-5 py-2.5 text-sm font-bold text-on-surface border border-outline-variant/10 focus:border-primary/50 outline-hidden transition-all" />
              </div>
              <div class="space-y-1.5">
                <label for="{uid}-duration" class="field-label">{t.appliedDuration}</label>
                <input id="{uid}-duration" type="text" bind:value={sanctionDurationLabel} placeholder={t.durationPh} class="w-full rounded-lg bg-surface-container-high px-5 py-2.5 text-sm font-bold text-on-surface border border-outline-variant/10 focus:border-primary/50 outline-hidden transition-all" />
              </div>
            </div>

            <div class="space-y-2 relative">
              <p id="{uid}-rules-label" class="field-label">{t.brokenRules}</p>
              <!-- ReportRuleSelector : un <details> dans le dashboard, ici une
                   liste dépliante posée par-dessus le formulaire pour ne pas
                   l'allonger. -->
              <div class="mt-1 rounded-xl border border-outline-variant/80 bg-surface-container-low/70 p-2">
                <button
                  type="button"
                  aria-expanded={rulesOpen}
                  aria-labelledby="{uid}-rules-label {uid}-rules-summary"
                  onclick={() => (rulesOpen = !rulesOpen)}
                  class="w-full text-left cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-container/80 transition-colors"
                >
                  <span id="{uid}-rules-summary">{selectedRuleIds.length > 0 ? t.rulesSelected(selectedRuleIds.length) : t.selectRulesPh}</span>
                </button>
                {#if rulesOpen}
                  <div class="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg space-y-1">
                    {#each reportRuleOptions as rule (rule.id)}
                      <label class="flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-surface-container/80 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedRuleIds.includes(rule.id)}
                          onchange={(e) => toggleRuleSelection(rule.id, e.currentTarget.checked)}
                          class="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                        />
                        <span>
                          <span class="block font-bold text-on-surface">
                            <span class="inline-flex items-center gap-1.5">
                              <Papicon icon={reportRuleIcon(rule)} size={12} class="text-on-surface-variant" />
                              <span>[{t.ruleScope}] {rule.label}</span>
                            </span>
                          </span>
                          <span class="block text-2xs text-on-surface-variant">{rule.details}</span>
                        </span>
                      </label>
                    {/each}
                  </div>
                {/if}
              </div>
              {@render ruleChips(selectedDraftRules)}
            </div>

            <!-- Raison et notes côte à côte (empilées dans le dashboard). -->
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label for="{uid}-reason" class="field-label">{t.detailedReason}</label>
                <textarea id="{uid}-reason" bind:value={detailedReason} rows={2} placeholder={t.describePh} class="w-full rounded-lg bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface border border-outline-variant/10 focus:border-primary/50 outline-hidden transition-all resize-none"></textarea>
              </div>

              <div class="space-y-1.5">
                <label for="{uid}-notes" class="field-label">{t.contextNotes}</label>
                <textarea id="{uid}-notes" bind:value={additionalNotes} rows={2} placeholder={t.contextPh} class="w-full rounded-lg bg-surface-container-high px-5 py-3 text-sm font-bold text-on-surface border border-outline-variant/10 focus:border-primary/50 outline-hidden transition-all resize-none"></textarea>
              </div>

            </div>

            <div class="space-y-2">
              <p id="{uid}-evidence-label" class="text-xs font-medium text-on-surface-variant/40 px-1">{t.evidenceUrls}</p>
              <div class="space-y-2" role="group" aria-labelledby="{uid}-evidence-label">
                {#each evidenceLinks as link, index (index)}
                  <div class="flex items-center gap-2">
                    <div class="relative flex-1 group">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors">
                        <Papicon icon="link" size={14} />
                      </div>
                      <input
                        type="url"
                        value={link}
                        aria-label={t.evidencePh}
                        oninput={(e) => (evidenceLinks = evidenceLinks.map((l, i) => (i === index ? e.currentTarget.value : l)))}
                        placeholder={t.evidencePh}
                        class="w-full rounded-lg bg-surface-container-high pl-10 pr-4 py-2.5 text-xs font-bold text-on-surface border border-outline-variant/10 focus:border-primary/50 outline-hidden transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onclick={() => (evidenceLinks = evidenceLinks.length <= 1 ? [''] : evidenceLinks.filter((_, i) => i !== index))}
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-on-surface/5 text-on-surface-variant/40 hover:bg-error/10 hover:text-error transition-all active:scale-95"
                      title={t.deleteLink}
                      aria-label={t.deleteLink}
                    >
                      <Papicon icon="trash-2" size={16} />
                    </button>
                    {#if index === evidenceLinks.length - 1 && evidenceLinks.length < 3}
                      <button
                        type="button"
                        onclick={() => (evidenceLinks = [...evidenceLinks, ''])}
                        class="flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-outline-variant/20 px-4 py-2 text-xs font-medium text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        <Papicon icon="plus" size={14} />
                        {t.addLink}
                      </button>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>

            {#if reportMessage}
              <div class="rounded-xl px-4 py-2.5 text-body-sm font-medium {reportMessageIsError ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}" role="alert">{reportMessage}</div>
            {/if}

            <div class="flex gap-4 pt-1">
              {#if isEditing}
                <button onclick={() => (isEditing = false)} class="flex-1 py-3 rounded-lg bg-on-surface/5 text-xs font-semibold text-on-surface-variant transition-all hover:bg-on-surface/10">
                  {t.cancel}
                </button>
                <button onclick={handleUpdateReport} class="flex-2 py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold transition-all active:scale-95 disabled:opacity-50">
                  {t.updateReport}
                </button>
              {:else}
                <button onclick={submitReport} disabled={!canCreateSelectedReport} class="w-full py-3 rounded-lg bg-primary text-on-primary text-xs font-semibold transition-all active:scale-95 disabled:opacity-50">
                  {t.finalize}
                </button>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

{#if deleteModalOpen && pendingDeletion}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="modal-backdrop"
    style="position:absolute"
    onclick={(e) => { if (e.target === e.currentTarget) closeDeleteModal(); }}
    role="presentation"
  >
    <div
      bind:this={deletePanel}
      class="modal-panel max-w-lg space-y-4 font-inter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="{uid}-delete-title"
      tabindex="-1"
    >
      <div>
        <p class="text-xs font-semibold text-error">{t.sensitive}</p>
        <h3 id="{uid}-delete-title" class="mt-1 text-xl font-semibold text-on-surface">{t.confirmDeletion}</h3>
        <p class="mt-2 text-sm text-on-surface-variant">
          {t.deletePre} <span class="font-bold text-on-surface">{typeLabel(pendingDeletion.type, locale)}</span>
          {t.forTarget} <span class="font-bold text-on-surface">{pendingDeletion.targetTag}</span>. {t.irreversible}
        </p>
      </div>

      <div>
        <label for="{uid}-delete-confirmation" class="field-label">{t.typeDelete(t.deleteKeyword)}</label>
        <FormInput
          id="{uid}-delete-confirmation"
          type="text"
          bind:value={deleteConfirmationText}
          autocomplete="off"
          className="mt-1 w-full rounded-xl px-3 py-2.5 bg-surface-container-low border border-outline-variant text-sm focus:ring-2 focus:ring-error/40 focus:border-error transition-all"
          placeholder={t.deleteKeyword}
        />
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2">
        <Button onclick={closeDeleteModal}>{t.cancel}</Button>
        <Button onclick={confirmDeleteSanction} variant="danger">{t.deletePermanently}</Button>
      </div>
    </div>
  </div>
{/if}

{#snippet ruleChips(rules: { id: string; emoji: string | null; label: string; details: string }[])}
  {#if rules.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each rules as rule (rule.id)}
        <span class="inline-flex items-center gap-1.5 rounded-full bg-sky-900/40 text-sky-200 px-3 py-1 text-xs font-semibold">
          <Papicon icon={reportRuleIcon(rule)} size={12} />
          <span>{rule.label}</span>
        </span>
      {/each}
    </div>
  {/if}
{/snippet}

<!--
  Onglet « Configuration » de Sécurité > Sanctions : réglages généraux et
  échelles de sanctions progressives.

  Recopie du balisage de `Kotbo/apps/dashboard/src/pages/Sanctions.svelte`
  (branche `recette`), onglet `settings`. Les réglages s'appliquent à l'état
  de démo (le dashboard les enregistre par sa barre « modifications non
  enregistrées », absente ici).
  Écarts, pour tenir dans le cadre sans défiler : marges internes réduites
  (`p-10` devient `p-5`) ; des réglages généraux ne restent que trois
  interrupteurs sur une ligne (propagation, rapports, DM du lien d'appel) :
  le rôle modérateur, le salon d'alertes, « ignorer les bots » et les
  permissions par rôle (`RolePermissionSettings`) ne sont pas repris ;
  une échelle s'arrête à quatre paliers ; l'export ne garde que CSV et JSON (fichiers produits sur place ; l'image et
  le .xlsx demandent le canvas et une bibliothèque du dashboard).
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { FormInput, ToggleSwitch } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { SanctionsDemo } from './demo.svelte';

  const TEXT = {
    fr: {
      propagation: 'Propagation des sanctions',
      propagationDesc: 'Appliquer automatiquement les sanctions sur les serveurs liés.',
      reports: 'Rapports de sanction',
      reportsDesc: 'Exiger la création de rapports détaillés pour chaque sanction.',
      dmAppeal: "DM du lien d'appel lors d'un ban définitif",
      dmAppealDesc: "Envoie automatiquement le lien public de l'appel de bannissement par DM (hors bannissements temporaires).",
      sameSetting: 'Même réglage que dans Appels de bannissement.',
      scalesTitle: 'Échelles de Sanctions progressives',
      scalesDesc: "Configure des échelles de sanctions qui s'alourdissent automatiquement à chaque récidive d'une infraction.",
      myScales: 'Mes échelles',
      add: '+ Ajouter',
      scaleNamePh: 'Nom (ex: Spam, Pub)',
      ok: 'Créer la table',
      cancel: 'Annuler',
      tierCount: (n: number) => `${n} palier(s)`,
      deleteTable: 'Supprimer ce tableau de sanction ?',
      deleteTableWarn: 'Toutes les sanctions liées perdront leur référence.',
      deleteConfirm: 'Supprimer',
      scaleExists: 'Une échelle avec ce nom existe déjà.',
      noScales: "Aucune échelle de sanction progressive n'est configurée.",
      addScaleHint: 'Ajoute une échelle de sanction pour commencer (ex : Spam, Insultes).',
      scaleName: "Nom de l'échelle",
      clickRename: '(Clique pour renommer)',
      exportScale: "Exporter l'échelle :",
      exportCsv: 'Exporter en CSV',
      exportJson: 'Exporter en JSON',
      colTier: 'Palier',
      colAction: 'Action',
      colDuration: 'Durée',
      colReason: 'Raison personnalisée',
      actionWarn: 'Avertir',
      actionTimeout: 'Exclure temporairement',
      actionKick: 'Expulser',
      actionTempBan: 'Ban temporaire',
      actionBan: 'Ban permanent',
      actionSoftban: 'Softban',
      unitMinutes: 'min',
      unitHours: 'h',
      unitDays: 'j',
      na: 'N/A',
      reasonPh: 'Raison par défaut ou personnalisée…',
      deleteTier: 'Supprimer ce palier',
      insertTier: 'Insérer un nouveau palier (row)',
      autoWarn: (name: string) => `Avertissement automatique pour ${name}`,
      repeat: (name: string, level: number) => `Récidive ${name} (tier T${level})`,
      csvHeaders: ['Tableau', 'Niveau (tier)', 'Action', 'Durée (secondes)', 'Raison personnalisée'],
      fileName: 'kotbo_tableau',
    },
    en: {
      propagation: 'Sanction propagation',
      propagationDesc: 'Automatically apply sanctions on linked servers.',
      reports: 'Sanction reports',
      reportsDesc: 'Require detailed reports for every sanction.',
      dmAppeal: 'DM the appeal link on permanent ban',
      dmAppealDesc: 'Automatically sends the public ban appeal link by DM (excludes temporary bans).',
      sameSetting: 'Same setting as in Ban Appeals.',
      scalesTitle: 'Progressive Sanction Scales',
      scalesDesc: 'Configure sanction scales that automatically escalate with each repeat offense.',
      myScales: 'My Scales',
      add: '+ Add',
      scaleNamePh: 'Name (e.g. Spam, Ads)',
      ok: 'Create table',
      cancel: 'Cancel',
      tierCount: (n: number) => `${n} tier(s)`,
      deleteTable: 'Delete this sanction table?',
      deleteTableWarn: 'All linked sanctions will lose their reference.',
      deleteConfirm: 'Delete',
      scaleExists: 'A scale with this name already exists.',
      noScales: 'No progressive sanction scale is configured.',
      addScaleHint: 'Add a sanction scale to get started (e.g. Spam, Insults).',
      scaleName: 'Scale name',
      clickRename: '(Click to rename)',
      exportScale: 'Export scale:',
      exportCsv: 'Export to CSV',
      exportJson: 'Export to JSON',
      colTier: 'Tier',
      colAction: 'Action',
      colDuration: 'Duration',
      colReason: 'Custom Reason',
      actionWarn: 'Warn',
      actionTimeout: 'Timeout',
      actionKick: 'Kick',
      actionTempBan: 'Temporary ban',
      actionBan: 'Permanent ban',
      actionSoftban: 'Softban',
      unitMinutes: 'min',
      unitHours: 'h',
      unitDays: 'd',
      na: 'N/A',
      reasonPh: 'Default or custom reason...',
      deleteTier: 'Delete this tier',
      insertTier: 'Insert a new tier (Row)',
      autoWarn: (name: string) => `Automatic warning for ${name}`,
      repeat: (name: string, level: number) => `Repeat offense ${name} (Tier T${level})`,
      csvHeaders: ['Table', 'Level (Tier)', 'Action', 'Duration (Seconds)', 'Custom reason'],
      fileName: 'kotbo_table',
    },
  };

  const { demo }: { demo: SanctionsDemo } = $props();
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);

  const settings = $derived(demo.settings);
  const tables = $derived(demo.scales[locale]);

  let selectedTableIndex = $state(0);
  let newTableName = $state('');
  let showAddTableField = $state(false);
  let addError = $state('');

  function addSanctionTable() {
    const name = newTableName.trim();
    if (!name) return;
    if (tables.some((table) => table.name.toLowerCase() === name.toLowerCase())) {
      addError = t.scaleExists;
      return;
    }
    tables.push({ name, tiers: [{ level: 1, action: 'WARN', durationSeconds: null, customReason: t.autoWarn(name) }] });
    newTableName = '';
    addError = '';
    showAddTableField = false;
    selectedTableIndex = tables.length - 1;
  }

  async function deleteSanctionTable(index: number) {
    if (!(await demo.ask({ title: t.deleteTable, description: t.deleteTableWarn, confirmLabel: t.deleteConfirm, variant: 'danger' }))) return;
    tables.splice(index, 1);
    if (selectedTableIndex >= tables.length) selectedTableIndex = Math.max(0, tables.length - 1);
  }

  function addTier(tableIndex: number) {
    const table = tables[tableIndex];
    if (!table) return;
    const nextLevel = table.tiers.length + 1;
    let defaultAction = 'WARN';
    let defaultDuration: number | null = null;
    if (table.tiers.length > 0) {
      const prevTier = table.tiers[table.tiers.length - 1];
      defaultAction = prevTier.action === 'WARN' ? 'TIMEOUT' : prevTier.action === 'TIMEOUT' ? 'KICK' : 'BAN';
      defaultDuration = defaultAction === 'TIMEOUT' ? 3600 : null;
    }
    table.tiers.push({ level: nextLevel, action: defaultAction, durationSeconds: defaultDuration, customReason: t.repeat(table.name, nextLevel) });
  }

  function removeTier(tableIndex: number, tierIndex: number) {
    const table = tables[tableIndex];
    if (!table) return;
    table.tiers.splice(tierIndex, 1);
    table.tiers.forEach((tier, i) => (tier.level = i + 1));
  }

  function getDurationValue(seconds: number | null): number {
    if (!seconds) return 1;
    if (seconds % 86400 === 0) return seconds / 86400;
    if (seconds % 3600 === 0) return seconds / 3600;
    if (seconds % 60 === 0) return seconds / 60;
    return seconds;
  }

  function getDurationUnit(seconds: number | null): 'm' | 'h' | 'd' {
    if (!seconds) return 'h';
    if (seconds % 86400 === 0) return 'd';
    if (seconds % 3600 === 0) return 'h';
    return 'm';
  }

  function updateTierDuration(tableIndex: number, tierIndex: number, value: number, unit: 'm' | 'h' | 'd') {
    const tier = tables[tableIndex]?.tiers[tierIndex];
    if (!tier) return;
    const multiplier = unit === 'd' ? 86400 : unit === 'h' ? 3600 : 60;
    tier.durationSeconds = value * multiplier;
  }

  function download(name: string, blob: Blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function exportTableToCsv(table: (typeof tables)[number]) {
    const rows = [t.csvHeaders.join(',')];
    for (const tier of table.tiers) {
      rows.push(
        [
          `"${table.name.replace(/"/g, '""')}"`,
          `"T${tier.level}"`,
          `"${tier.action}"`,
          `"${tier.durationSeconds || ''}"`,
          `"${(tier.customReason || '').replace(/"/g, '""')}"`,
        ].join(','),
      );
    }
    download(`${t.fileName}_${table.name.toLowerCase()}.csv`, new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' }));
  }

  function exportTableToJson(table: (typeof tables)[number]) {
    download(`${t.fileName}_${table.name.toLowerCase()}.json`, new Blob([JSON.stringify(table, null, 2)], { type: 'application/json' }));
  }

  const ACTION_CLASS: Record<string, string> = {
    WARN: 'text-warning',
    TIMEOUT: 'text-blue-400',
    KICK: 'text-error',
    TEMP_BAN: 'text-error font-semibold',
    BAN: 'text-error font-semibold',
    SOFTBAN: 'text-purple-400',
  };
</script>

<section class="space-y-5 animate-in fade-in duration-500">
  <!-- Réglages généraux : les interrupteurs seulement (voir l'en-tête). -->
  <div class="premium-card p-5 rounded-xl">
    <div class="grid grid-cols-3 gap-x-8">
      {@render toggle(t.propagation, t.propagationDesc, settings.propagateSanctions, (v) => (settings.propagateSanctions = v))}
      {@render toggle(t.reports, t.reportsDesc, settings.sanctionReportEnabled, (v) => (settings.sanctionReportEnabled = v))}
      {@render toggle(t.dmAppeal, `${t.dmAppealDesc} ${t.sameSetting}`, settings.banAppealNotifyOnBanDM, (v) => (settings.banAppealNotifyOnBanDM = v))}
    </div>
  </div>

  <!-- Échelles de Sanctions Progressives -->
  <section class="section-card-flush font-inter">
    <div class="px-6 py-4 border-b border-outline-variant">
      <h3 class="text-lg font-semibold">{t.scalesTitle}</h3>
      <p class="text-xs text-on-surface-variant mt-1">{t.scalesDesc}</p>
    </div>

    <div class="premium-card p-5 rounded-xl">
      <div class="flex flex-row gap-8">
        <!-- Échelles -->
        <div class="w-1/4 space-y-3 border-r border-outline-variant/10 pr-6">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-on-surface-variant">{t.myScales}</span>
            {#if !showAddTableField}
              <button onclick={() => (showAddTableField = true)} class="text-xs font-semibold text-primary hover:text-primary/80 transition">{t.add}</button>
            {/if}
          </div>

          {#if showAddTableField}
            <div class="flex flex-wrap gap-2 p-2 bg-surface-container-high/40 rounded-lg border border-outline-variant/10">
              <FormInput bind:value={newTableName} placeholder={t.scaleNamePh} className="w-full text-xs px-3 py-2 bg-transparent outline-none border-none text-on-surface" />
              <button onclick={addSanctionTable} class="px-3 py-1 bg-primary text-on-primary rounded-xl text-xs font-semibold">{t.ok}</button>
              <button onclick={() => { showAddTableField = false; newTableName = ''; addError = ''; }} class="px-2 text-on-surface-variant text-xs">{t.cancel}</button>
              {#if addError}<p class="w-full text-2xs font-semibold text-error" role="alert">{addError}</p>{/if}
            </div>
          {/if}

          <div class="space-y-2">
            {#each tables as table, i (i)}
              <div
                class="flex items-center justify-between w-full text-left rounded-lg transition-all {selectedTableIndex === i ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-surface-container-high/30 border border-transparent text-on-surface hover:bg-surface-container-high/60'}"
              >
                <button type="button" class="flex-1 min-w-0 text-left p-3 cursor-pointer" aria-pressed={selectedTableIndex === i} onclick={() => (selectedTableIndex = i)}>
                  <span class="block text-sm font-bold truncate">{table.name}</span>
                </button>
                <div class="flex items-center gap-3 pr-3">
                  <span class="text-2xs font-semibold bg-on-surface/5 px-2 py-0.5 rounded-md text-on-surface-variant/80">{t.tierCount(table.tiers.length)}</span>
                  <button type="button" onclick={() => deleteSanctionTable(i)} aria-label="{t.deleteConfirm} {table.name}" class="text-on-surface-variant/40 hover:text-error transition-colors cursor-pointer">
                    <Papicon icon="trash" size={14} />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Éditeur -->
        <div class="flex-1 space-y-4 min-w-0">
          {#if tables.length === 0}
            <div class="h-full min-h-[160px] flex flex-col items-center justify-center text-center space-y-2">
              <Papicon icon="alert-triangle" size={32} class="text-on-surface-variant/40" />
              <p class="text-sm font-bold text-on-surface-variant">{t.noScales}</p>
              <p class="text-xs text-on-surface-variant">{t.addScaleHint}</p>
            </div>
          {:else}
            {@const currentTable = tables[selectedTableIndex]}
            {#if currentTable}
              <div class="flex flex-row items-center justify-between gap-4 border-b border-outline-variant/10 pb-3">
                <div class="flex items-center gap-4">
                  <input
                    bind:value={currentTable.name}
                    aria-label={t.scaleName}
                    class="text-lg font-semibold bg-transparent border-none text-on-surface focus:ring-0 px-0 py-0 w-48"
                  />
                  <span class="text-xs text-on-surface-variant italic font-medium">{t.clickRename}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-on-surface-variant mr-2">{t.exportScale}</span>
                  <button onclick={() => exportTableToCsv(currentTable)} class="p-2 rounded-xl bg-surface-container-high/40 hover:bg-warning/10 hover:text-warning transition-all text-on-surface-variant flex items-center justify-center cursor-pointer" title={t.exportCsv} aria-label={t.exportCsv}>
                    <Papicon icon="file-text" size={16} />
                  </button>
                  <button onclick={() => exportTableToJson(currentTable)} class="p-2 rounded-xl bg-surface-container-high/40 hover:bg-indigo-500/10 hover:text-indigo-500 transition-all text-on-surface-variant flex items-center justify-center cursor-pointer" title={t.exportJson} aria-label={t.exportJson}>
                    <Papicon icon="code" size={16} />
                  </button>
                </div>
              </div>

              <div class="overflow-x-auto rounded-lg border border-outline-variant/10 bg-surface-container-low/20">
                <table class="w-full text-left border-collapse font-inter text-xs">
                  <thead>
                    <tr class="bg-surface-container-high/40 text-xs font-semibold text-on-surface-variant border-b border-outline-variant/15 select-none">
                      <th class="py-2.5 px-4 w-20 text-center border-r border-outline-variant/10">{t.colTier}</th>
                      <th class="py-2.5 px-4 w-48 border-r border-outline-variant/10">{t.colAction}</th>
                      <th class="py-2.5 px-4 w-48 border-r border-outline-variant/10">{t.colDuration}</th>
                      <th class="py-2.5 px-4 border-r border-outline-variant/10">{t.colReason}</th>
                      <th class="py-2.5 px-2 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/10">
                    {#each currentTable.tiers as tier, tierIdx (tierIdx)}
                      <tr class="group hover:bg-surface-hover/10 transition-colors">
                        <td class="py-2 px-4 font-semibold text-center text-primary/80 select-none bg-surface-container-high/15 border-r border-outline-variant/10">T{tier.level}</td>
                        <td class="py-1.5 px-3 border-r border-outline-variant/10">
                          <select
                            bind:value={tier.action}
                            aria-label="{t.colAction} T{tier.level}"
                            class="w-full bg-transparent font-bold py-1.5 px-2 rounded-lg cursor-pointer outline-hidden focus:bg-surface-container-high/40 border border-transparent focus:border-primary/20 transition-all {ACTION_CLASS[tier.action] ?? ''}"
                          >
                            <option value="WARN" class="text-on-surface bg-surface-container-lowest">{t.actionWarn}</option>
                            <option value="TIMEOUT" class="text-on-surface bg-surface-container-lowest">{t.actionTimeout}</option>
                            <option value="KICK" class="text-on-surface bg-surface-container-lowest">{t.actionKick}</option>
                            <option value="TEMP_BAN" class="text-on-surface bg-surface-container-lowest">{t.actionTempBan}</option>
                            <option value="BAN" class="text-on-surface bg-surface-container-lowest font-bold">{t.actionBan}</option>
                            <option value="SOFTBAN" class="text-on-surface bg-surface-container-lowest">{t.actionSoftban}</option>
                          </select>
                        </td>
                        <td class="py-1.5 px-3 border-r border-outline-variant/10">
                          {#if ['TIMEOUT', 'TEMP_BAN'].includes(tier.action)}
                            {@const initialVal = getDurationValue(tier.durationSeconds)}
                            {@const initialUnit = getDurationUnit(tier.durationSeconds)}
                            <div class="flex items-center gap-1.5 w-full">
                              <input
                                type="number"
                                value={initialVal}
                                aria-label="{t.colDuration} T{tier.level}"
                                oninput={(e) => updateTierDuration(selectedTableIndex, tierIdx, Number(e.currentTarget.value), initialUnit)}
                                class="w-16 text-center py-1 px-1.5 rounded-lg bg-surface-container-high/30 text-on-surface border border-outline-variant/10 focus:border-primary/40 focus:bg-surface-container-high/60 outline-hidden transition-all text-xs font-bold"
                                min="1"
                              />
                              <select
                                value={initialUnit}
                                aria-label="{t.colDuration} T{tier.level}"
                                onchange={(e) => updateTierDuration(selectedTableIndex, tierIdx, initialVal, e.currentTarget.value as 'm' | 'h' | 'd')}
                                class="flex-1 bg-transparent py-1 px-1.5 rounded-lg border border-transparent hover:border-outline-variant/10 focus:border-primary/30 outline-hidden transition-all text-xs font-semibold cursor-pointer"
                              >
                                <option value="m" class="text-on-surface bg-surface-container-lowest">{t.unitMinutes}</option>
                                <option value="h" class="text-on-surface bg-surface-container-lowest">{t.unitHours}</option>
                                <option value="d" class="text-on-surface bg-surface-container-lowest">{t.unitDays}</option>
                              </select>
                            </div>
                          {:else}
                            <div class="h-7 flex items-center justify-center text-2xs font-semibold tracking-wider text-on-surface-variant/30 select-none bg-linear-to-br from-outline-variant/5 to-transparent rounded-lg">{t.na}</div>
                          {/if}
                        </td>
                        <td class="py-1.5 px-3 border-r border-outline-variant/10">
                          <input
                            type="text"
                            bind:value={tier.customReason}
                            aria-label="{t.colReason} T{tier.level}"
                            placeholder={t.reasonPh}
                            class="w-full bg-transparent py-1.5 px-2 rounded-lg border border-transparent hover:border-outline-variant/10 focus:border-primary/30 focus:bg-surface-container-high/30 outline-hidden transition-all text-xs text-on-surface"
                          />
                        </td>
                        <td class="py-1.5 px-2 text-center">
                          {#if currentTable.tiers.length > 1}
                            <button
                              onclick={() => removeTier(selectedTableIndex, tierIdx)}
                              class="text-on-surface-variant/40 hover:text-error active:scale-95 transition-all p-1.5 rounded-lg hover:bg-error/10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer flex items-center justify-center mx-auto"
                              title={t.deleteTier}
                              aria-label="{t.deleteTier} T{tier.level}"
                            >
                              <Papicon icon="trash" size={13} />
                            </button>
                          {/if}
                        </td>
                      </tr>
                    {/each}
                    {#if currentTable.tiers.length < 4}
                      <tr class="bg-surface-container-low/10">
                        <td colspan="5" class="p-0">
                          <button
                            onclick={() => addTier(selectedTableIndex)}
                            class="w-full py-2 text-center text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Papicon icon="plus" size={12} />
                            {t.insertTier}
                          </button>
                        </td>
                      </tr>
                    {/if}
                  </tbody>
                </table>
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </div>
  </section>
</section>

{#snippet toggle(label: string, description: string, checked: boolean, onToggle: (v: boolean) => void)}
  <div class="flex items-center justify-between gap-4">
    <div>
      <p class="text-sm font-semibold text-on-surface">{label}</p>
      <p class="text-xs text-on-surface-variant mt-1">{description}</p>
    </div>
    <ToggleSwitch {checked} {onToggle} ariaLabel={label} />
  </div>
{/snippet}

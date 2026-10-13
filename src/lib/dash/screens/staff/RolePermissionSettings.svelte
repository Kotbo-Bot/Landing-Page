<!--
  Permissions par rôle Discord d'une section. Recopie de
  `lib/components/RolePermissionSettings.svelte` (dashboard) ; le sélecteur de
  rôle à recherche devient un menu déroulant simple.
-->
<script lang="ts">
  import { untrack } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, Papicon } from '$lib/dash/ui';
  import { useStaff, type RoleAccessEntry } from './staffStore.svelte';

  const TEXT = {
    fr: {
      title: 'Permissions par rôle',
      desc: 'Définis les accès propres à chaque rôle Discord.',
      view: 'Voir',
      moderate: 'Modérer',
      configure: 'Configurer',
      delete: 'Supprimer',
      configured: (n: number) => `${n} rôle(s)`,
      empty: 'Aucune restriction : le module suit les permissions par défaut.',
      selectRole: 'Sélectionner un rôle',
      deleteRule: 'Supprimer la règle',
      addRole: 'Ajouter un rôle',
      save: 'Enregistrer les permissions',
    },
    en: {
      title: 'Role permissions',
      desc: 'Define specific access for each Discord role.',
      view: 'View',
      moderate: 'Moderate',
      configure: 'Configure',
      delete: 'Delete',
      configured: (n: number) => `${n} role(s)`,
      empty: 'No restrictions: the module follows the default permissions.',
      selectRole: 'Select a role',
      deleteRule: 'Delete rule',
      addRole: 'Add a role',
      save: 'Save permissions',
    },
  };

  const { featureKey, title = '', description = '' }: { featureKey: string; title?: string; description?: string } = $props();

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);
  const uid = $props.id();

  // Brouillon local, repris du store à l'ouverture de l'onglet.
  let localRoleAccess = $state<RoleAccessEntry[]>(untrack(() => structuredClone($state.snapshot(staff.roleAccess[featureKey] ?? []))));
  let open = $state(false);
  let message = $state('');
  const configuredCount = $derived(localRoleAccess.filter((r) => r.roleId).length);

  type PermKey = 'canView' | 'canModerate' | 'canConfigure' | 'canDelete';
  const permissions = $derived<{ key: PermKey; label: string; icon: string }[]>([
    { key: 'canView', label: t.view, icon: 'eye' },
    { key: 'canModerate', label: t.moderate, icon: 'shield' },
    { key: 'canConfigure', label: t.configure, icon: 'settings' },
    { key: 'canDelete', label: t.delete, icon: 'trash-2' },
  ]);

  function addRole() {
    localRoleAccess = [...localRoleAccess, { roleId: '', canView: true, canModerate: false, canConfigure: false, canDelete: false }];
    message = '';
  }

  function removeRole(index: number) {
    localRoleAccess = localRoleAccess.filter((_, i) => i !== index);
    message = '';
  }

  function handleSave() {
    staff.saveRoleAccess(featureKey, localRoleAccess.filter((r) => r.roleId));
    message = staff.permissionsUpdated;
  }
</script>

<div class="space-y-4">
  <button
    type="button"
    onclick={() => (open = !open)}
    aria-expanded={open}
    aria-controls="{uid}-panel"
    class="w-full flex items-center justify-between gap-4 text-left {open ? 'border-b border-outline-variant/10 pb-4' : ''}"
  >
    <div>
      <h3 class="text-sm font-semibold text-on-surface">{title || t.title}</h3>
      <p class="text-xs text-on-surface-variant mt-1">{description || t.desc}</p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      {#if configuredCount > 0}
        <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">{t.configured(configuredCount)}</span>
      {/if}
      <Papicon icon="chevron-down" size={16} class="text-on-surface-variant transition-transform {open ? 'rotate-180' : ''}" />
    </div>
  </button>

  {#if open}
    <div id="{uid}-panel" class="space-y-4">
      {#if localRoleAccess.length === 0}
        <div class="py-6 text-center bg-surface-container-low/20 rounded-xl border border-dashed border-outline-variant/20">
          <Papicon icon="lock" size={32} class="text-on-surface-variant/20 mb-2 mx-auto" />
          <p class="text-xs font-bold text-on-surface-variant">{t.empty}</p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each localRoleAccess as entry, i (i)}
            <div class="flex flex-row items-center gap-4 p-3 bg-surface-container-low/40 rounded-xl border border-outline-variant/10">
              <div class="w-56">
                <select class="input" aria-label={t.selectRole} bind:value={entry.roleId}>
                  <option value="">{t.selectRole}</option>
                  {#each staff.discordRoles as role (role.id)}<option value={role.id}>@{role.name}</option>{/each}
                </select>
              </div>

              <div class="flex flex-wrap items-center gap-3 flex-1">
                {#each permissions as perm (perm.key)}
                  <button
                    type="button"
                    aria-pressed={entry[perm.key]}
                    onclick={() => (entry[perm.key] = !entry[perm.key])}
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all {entry[perm.key] ? 'bg-primary/10 border-primary/20 text-primary shadow-sm' : 'bg-transparent border-outline-variant/10 text-on-surface-variant/40 hover:border-outline-variant/30'}"
                  >
                    <Papicon icon={perm.icon} size={14} />
                    <span class="text-xs font-semibold">{perm.label}</span>
                  </button>
                {/each}
              </div>

              <button type="button" onclick={() => removeRole(i)} class="p-2.5 text-on-surface-variant/40 hover:text-error hover:bg-error/10 rounded-xl transition-all" title={t.deleteRule} aria-label={t.deleteRule}>
                <Papicon icon="x" size={18} />
              </button>
            </div>
          {/each}
        </div>
      {/if}

      <div class="flex items-center justify-between gap-3">
        <button
          type="button"
          onclick={addRole}
          class="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          <Papicon icon="plus" size={14} />
          {t.addRole}
        </button>
        <div class="flex items-center gap-3">
          {#if message}
            <p class="text-xs font-bold text-success" role="status">{message}</p>
          {/if}
          <Button variant="primary" disabled={localRoleAccess.length > 0 && localRoleAccess.some((r) => !r.roleId)} onclick={handleSave}>{t.save}</Button>
        </div>
      </div>
    </div>
  {/if}
</div>

<!--
  Grades et hiérarchies du staff. Recopie de
  `lib/components/staff/StaffRoles.svelte` (dashboard) : échelle de promotion,
  une colonne par hiérarchie, grades à glisser (souris ou flèches). Pour tenir
  dans l'aperçu, les hiérarchies passent sur une seule rangée et la
  configuration globale (rôles et salons de base) n'est pas reprise.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, EmptyState, Field, Menu, Modal, Papicon, ToggleSwitch } from '$lib/dash/ui';
  import type { StaffHierarchy, StaffRole } from '$lib/dash/types';
  import StaffAvatar from './StaffAvatar.svelte';
  import HierarchyIcon from './HierarchyIcon.svelte';
  import { useStaff, staffName } from './staffStore.svelte';
  import { dialogFocus } from './dialogFocus';

  const TEXT = {
    fr: {
      addGradeHere: 'Ajouter un grade',
      editHierarchy: 'Modifier la hiérarchie',
      deleteHierarchy: 'Supprimer la hiérarchie',
      editRole: 'Modifier le rôle',
      deleteRole: 'Supprimer le rôle',
      moveHint: (name: string) => `Déplacer « ${name} » (glisser, ou flèches haut et bas)`,
      chief: 'Chef',
      custom: 'Rôle personnalisé',
      weight: (level: number) => `Poids : ${level}`,
      nobody: 'Personne',
      roleMenu: (name: string) => `Options du grade ${name}`,
      dropHere: 'Dépose le grade ici',
      summary: (h: number, r: number) => `Hiérarchies : ${h} · grades : ${r}`,
      savingOrder: "Sauvegarde de l'ordre…",
      newHierarchy: 'Nouvelle hiérarchie',
      newRole: 'Nouveau rôle',
      ladderTitle: 'Échelle de promotion',
      ladderHint: "Promouvoir fait monter d'un cran vers la droite.",
      emptyTitle: "Aucun grade pour l'instant",
      emptyDesc: 'Une hiérarchie regroupe des grades : Modération, Support... Commence par en créer une.',
      emptyAction: 'Créer ma première hiérarchie',
      hierarchyMenu: (name: string) => `Options de la hiérarchie ${name}`,
      ledBy: (name: string) => `Dirigée par ${name}`,
      reportsTo: (name: string) => `Rattachée à ${name}`,
      noRolesIn: 'Aucun rôle lié à cette hiérarchie.',
      unlinkedTitle: 'Rôles hors hiérarchie',
      unlinkedDesc: 'Rôles globaux ou non catégorisés',
      noUnlinked: 'Tous les rôles sont associés à une hiérarchie.',
      roleModalSub: 'Un grade du staff, lié ou non à un rôle Discord.',
      linkedDiscordRole: 'Rôle Discord lié',
      discordRoleHint: 'Le grade donne ce rôle sur Discord. Son nom est proposé pour le grade.',
      none: '-- Aucun --',
      noneAlt: '-- Aucune --',
      roleName: 'Nom du rôle',
      phRoleName: 'Saisis un nom de rôle…',
      hierarchyAssoc: 'Hiérarchie associée',
      outOfHierarchy: '-- Aucune (hors hiérarchie) --',
      roleWeight: 'Poids / niveau du rôle',
      weightHint: 'Plus il est élevé, plus le grade est haut.',
      colorOptional: 'Couleur (Hex ou CSS, optionnel)',
      color: 'Couleur (Hex)',
      chiefToggle: 'Chef de hiérarchie',
      chiefHint: "Le titulaire dirige la hiérarchie dans l'organigramme.",
      cancel: 'Annuler',
      nameRequired: "Donne-lui d'abord un nom",
      save: 'Enregistrer',
      createGrade: 'Créer le grade',
      editHierarchyTitle: 'Modifier la hiérarchie',
      hierarchyModalSub: 'Un pôle du staff : modération, support, événements...',
      phHierarchyName: 'Ex: Modération, Animation…',
      preview: 'Aperçu',
      hierarchyName: 'Nom de la hiérarchie',
      description: 'Description',
      phHierarchyDesc: 'Décris le but de cette hiérarchie…',
      emoji: 'Emoji / icône',
      hierarchyRole: 'Rôle Discord responsable',
      responsible: 'Membre responsable',
      parent: 'Hiérarchie supérieure',
    },
    en: {
      addGradeHere: 'Add a grade',
      editHierarchy: 'Edit the hierarchy',
      deleteHierarchy: 'Delete the hierarchy',
      editRole: 'Edit the role',
      deleteRole: 'Delete the role',
      moveHint: (name: string) => `Move « ${name} » (drag, or up and down arrows)`,
      chief: 'Chief',
      custom: 'Custom role',
      weight: (level: number) => `Weight: ${level}`,
      nobody: 'Nobody',
      roleMenu: (name: string) => `Options for grade ${name}`,
      dropHere: 'Drop the grade here',
      summary: (h: number, r: number) => `Hierarchies: ${h} · grades: ${r}`,
      savingOrder: 'Saving order...',
      newHierarchy: 'New Hierarchy',
      newRole: 'New Role',
      ladderTitle: 'Promotion ladder',
      ladderHint: 'Promoting moves one step to the right.',
      emptyTitle: 'No grade yet',
      emptyDesc: 'A hierarchy groups grades: Moderation, Support... Start by creating one.',
      emptyAction: 'Create my first hierarchy',
      hierarchyMenu: (name: string) => `Options for hierarchy ${name}`,
      ledBy: (name: string) => `Led by ${name}`,
      reportsTo: (name: string) => `Reports to ${name}`,
      noRolesIn: 'No role linked to this hierarchy.',
      unlinkedTitle: 'Roles Outside Hierarchy',
      unlinkedDesc: 'Global or uncategorized roles',
      noUnlinked: 'All roles are associated with a hierarchy.',
      roleModalSub: 'A staff grade, linked or not to a Discord role.',
      linkedDiscordRole: 'Linked Discord role',
      discordRoleHint: 'The grade grants this Discord role. Its name is suggested for the grade.',
      none: '-- None --',
      noneAlt: '-- None --',
      roleName: 'Role name',
      phRoleName: 'Enter a role name...',
      hierarchyAssoc: 'Associated hierarchy',
      outOfHierarchy: '-- None (Out of Hierarchy) --',
      roleWeight: 'Role weight / level',
      weightHint: 'The higher it is, the higher the grade.',
      colorOptional: 'Color (Hex or CSS, optional)',
      color: 'Color (Hex)',
      chiefToggle: 'Hierarchy chief',
      chiefHint: 'The holder leads the hierarchy in the org chart.',
      cancel: 'Cancel',
      nameRequired: 'Give it a name first',
      save: 'Save',
      createGrade: 'Create grade',
      editHierarchyTitle: 'Edit the Hierarchy',
      hierarchyModalSub: 'A staff department: moderation, support, events...',
      phHierarchyName: 'E.g: Moderation, Events...',
      preview: 'Preview',
      hierarchyName: 'Hierarchy name',
      description: 'Description',
      phHierarchyDesc: 'Describe the purpose of this hierarchy...',
      emoji: 'Emoji / Icon',
      hierarchyRole: 'Responsible Discord Role',
      responsible: 'Responsible Member',
      parent: 'Parent hierarchy',
    },
  };

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  const canEdit = $derived(staff.canConfigureRoles);
  const ladder = $derived([...staff.orderedRoles].reverse());

  // ── Glisser-déposer ──
  let dragged = $state<string | null>(null);
  let overRole = $state<string | null>(null);
  let overZone = $state<string | null>(null);
  const showUnlinked = $derived(staff.rolesInHierarchy(null).length > 0);

  /** Flèches haut et bas sur la poignée : le même déplacement qu'au glisser. */
  function moveWithKeys(event: KeyboardEvent, role: StaffRole) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const siblings = staff.rolesInHierarchy(role.hierarchyId ?? null);
    const index = siblings.findIndex((r) => r.id === role.id);
    if (event.key === 'ArrowUp' && index > 0) {
      void staff.moveRole(role.id, { beforeRoleId: siblings[index - 1].id, hierarchyId: role.hierarchyId ?? null });
    } else if (event.key === 'ArrowDown' && index >= 0 && index < siblings.length - 1) {
      const after = siblings[index + 2];
      void staff.moveRole(role.id, after ? { beforeRoleId: after.id, hierarchyId: role.hierarchyId ?? null } : { hierarchyId: role.hierarchyId ?? null });
    }
  }

  function endDrag() {
    dragged = null;
    overRole = null;
    overZone = null;
  }

  // ── Grade : création / édition ──
  let roleModal = $state<'create' | 'edit' | null>(null);
  let editing = $state<StaffRole | null>(null);
  let rName = $state('');
  let rDiscord = $state('');
  let rHierarchy = $state('');
  let rLevel = $state(100);
  let rColor = $state('');
  let rChief = $state(false);

  function openCreateRole(hierarchyId = '') {
    editing = null;
    rName = '';
    rDiscord = '';
    rHierarchy = hierarchyId;
    const siblings = staff.rolesInHierarchy(hierarchyId || null);
    rLevel = siblings.length ? Math.max(1, (siblings.at(-1)?.level ?? 20) - 10) : 100;
    rColor = '';
    rChief = false;
    roleModal = 'create';
  }

  function openEditRole(role: StaffRole) {
    editing = role;
    rName = role.name;
    rDiscord = role.discordRoleId || '';
    rHierarchy = role.hierarchyId || '';
    rLevel = role.level;
    rColor = role.color || '';
    rChief = !!role.isResponsable;
    roleModal = 'edit';
  }

  // Choisir un rôle Discord propose son nom comme nom de grade.
  function pickDiscordRole(id: string) {
    rDiscord = id;
    if (roleModal !== 'create') return;
    const name = staff.discordRoleName(id);
    if (name && (!rName || staff.discordRoles.some((r) => r.name === rName))) rName = name;
  }

  async function submitRole() {
    if (!rName.trim()) return;
    const ok =
      roleModal === 'edit' && editing
        ? await staff.updateRole(editing.id, {
            name: rName.trim(),
            level: Number(rLevel),
            color: rColor || null,
            discordRoleId: rDiscord || null,
            hierarchyId: rHierarchy || null,
            isResponsable: rChief,
          })
        : await staff.createRole({ query: rName, discordRoleId: rDiscord, hierarchyId: rHierarchy, isResponsable: rChief, level: rLevel });
    if (ok) roleModal = null;
  }

  // ── Hiérarchie : création / édition ──
  let hModal = $state(false);
  let hEditing = $state<StaffHierarchy | null>(null);
  let hName = $state('');
  let hDesc = $state('');
  let hColor = $state('#3b82f6');
  let hIcon = $state('🔵');
  let hRole = $state('');
  let hResp = $state('');
  let hParent = $state('');

  function openHierarchy(h: StaffHierarchy | null) {
    hEditing = h;
    hName = h?.name ?? '';
    hDesc = h?.description ?? '';
    hColor = h?.color || '#3b82f6';
    hIcon = h?.icon || '🔵';
    hRole = h?.discordRoleId || '';
    hResp = h?.responsableUserId || '';
    hParent = h?.parentHierarchyId || '';
    hModal = true;
  }

  async function submitHierarchy() {
    const ok = await staff.saveHierarchy(
      {
        name: hName.trim(),
        description: hDesc.trim() || null,
        color: hColor,
        icon: hIcon.trim() || null,
        discordRoleId: hRole.trim() || null,
        responsableUserId: hResp.trim() || null,
        parentHierarchyId: hParent || null,
      },
      hEditing?.id ?? null,
    );
    if (ok) hModal = false;
  }

  // ── Clavier : focus à l'ouverture, Échap ferme la fenêtre ──
  const trackFocus = dialogFocus();
  $effect(() => trackFocus(roleModal ? `role:${roleModal}` : hModal ? 'hierarchy' : ''));

  function onWindowKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented || staff.confirmRequest) return;
    roleModal = null;
    hModal = false;
  }

  function hierarchyMenu(h: StaffHierarchy) {
    return [
      { label: t.addGradeHere, icon: 'plus', onselect: () => openCreateRole(h.id) },
      { label: t.editHierarchy, icon: 'edit', onselect: () => openHierarchy(h) },
      { label: t.deleteHierarchy, icon: 'trash-2', onselect: () => void staff.deleteHierarchy(h) },
    ];
  }

  function roleMenu(role: StaffRole) {
    return [
      { label: t.editRole, icon: 'edit', onselect: () => openEditRole(role) },
      { label: t.deleteRole, icon: 'trash-2', onselect: () => void staff.deleteRole(role) },
    ];
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#snippet roleRow(role: StaffRole)}
  {@const holders = staff.membersWithGrade(role.name)}
  <li
    class="role-row"
    class:role-row--over={overRole === role.id && dragged !== role.id}
    class:role-row--dragging={dragged === role.id}
    ondragover={(e) => {
      if (!dragged) return;
      e.preventDefault();
      e.stopPropagation();
      overRole = role.id;
    }}
    ondragleave={() => {
      if (overRole === role.id) overRole = null;
    }}
    ondrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = dragged;
      endDrag();
      if (id) void staff.moveRole(id, { beforeRoleId: role.id, hierarchyId: role.hierarchyId ?? null });
    }}
  >
    {#if canEdit}
      <span
        class="role-handle"
        role="button"
        tabindex="0"
        draggable="true"
        ondragstart={(e) => {
          dragged = role.id;
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', role.id);
          }
        }}
        ondragend={endDrag}
        onkeydown={(e) => moveWithKeys(e, role)}
        aria-label={t.moveHint(role.name)}
        title={t.moveHint(role.name)}
      >
        <Papicon icon="grip-vertical" size={14} />
      </span>
    {/if}
    <span class="h-2.5 w-2.5 shrink-0 rounded-full" style="background: {role.color || 'var(--outline)'}" aria-hidden="true"></span>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="truncate text-sm font-medium text-on-surface">{role.name}</span>
        {#if role.isResponsable}
          <span class="badge badge-warning"><Papicon icon="crown" size={11} />{t.chief}</span>
        {/if}
      </div>
      <p class="truncate text-xs text-on-surface-variant">
        {role.discordRoleId ? `@${staff.discordRoleName(role.discordRoleId)}` : t.custom}{' · '}{t.weight(role.level)}
      </p>
    </div>
    {#if holders.length}
      <span class="flex -space-x-2" title={holders.map((h) => staffName(h)).join(', ')}>
        {#each holders.slice(0, 4) as holder (holder.id)}
          <span class="rounded-full ring-2 ring-surface-container-lowest"><StaffAvatar url={holder.avatarUrl} name={staffName(holder)} userId={holder.userId} size={22} /></span>
        {/each}
        {#if holders.length > 4}
          <span class="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-surface-container-high px-1 text-2xs font-semibold text-on-surface-variant ring-2 ring-surface-container-lowest">+{holders.length - 4}</span>
        {/if}
      </span>
    {:else}
      <span class="text-xs text-on-surface-variant">{t.nobody}</span>
    {/if}
    {#if canEdit}
      <Menu label={t.roleMenu(role.name)} items={roleMenu(role)} />
    {/if}
  </li>
{/snippet}

{#snippet dropZone(id: string, hierarchyId: string | null, roles: StaffRole[], emptyText: string)}
  <ul
    class="role-list"
    class:role-list--over={overZone === id && !!dragged}
    aria-label={emptyText}
    ondragover={(e) => {
      if (!dragged) return;
      e.preventDefault();
      overZone = id;
    }}
    ondragleave={(e) => {
      if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) overZone = null;
    }}
    ondrop={(e) => {
      e.preventDefault();
      const roleId = dragged;
      endDrag();
      if (roleId) void staff.moveRole(roleId, { hierarchyId });
    }}
  >
    {#each roles as role (role.id)}
      {@render roleRow(role)}
    {:else}
      <li class="px-3 py-5 text-center text-xs text-on-surface-variant">{dragged ? t.dropHere : emptyText}</li>
    {/each}
  </ul>
{/snippet}

<div class="space-y-3">
  <!-- Barre d'outils -->
  <div class="flex flex-row items-center justify-between gap-3">
    <p class="text-sm text-on-surface-variant">
      {t.summary(staff.hierarchies.length, staff.roles.length)}
      {#if staff.savingRoleOrder}
        <span class="ml-2 inline-flex items-center gap-1 text-primary"><span class="btn-spinner"></span>{t.savingOrder}</span>
      {/if}
    </p>
    {#if canEdit}
      <div class="flex items-center gap-2">
        <Button icon="layers" onclick={() => openHierarchy(null)}>{t.newHierarchy}</Button>
        <Button variant="primary" icon="plus" onclick={() => openCreateRole('')}>{t.newRole}</Button>
      </div>
    {/if}
  </div>

  <!-- Échelle de promotion -->
  {#if ladder.length > 1}
    <section class="section-card p-4" aria-labelledby="ladder-title">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="ladder-title" class="text-sm font-semibold text-on-surface">{t.ladderTitle}</h3>
        <p class="text-xs text-on-surface-variant">{t.ladderHint}</p>
      </div>
      <ol class="mt-3 flex flex-wrap items-center gap-y-2">
        {#each ladder as role, i (role.id)}
          {@const count = staff.membersWithGrade(role.name).length}
          <li class="flex items-center">
            <span class="ladder-step" style="--step: {staff.gradeColor(role.name) || 'var(--outline)'}">
              <span class="ladder-step__dot" aria-hidden="true"></span>
              {role.name}
              <span class="ladder-step__count tabular-nums">{count}</span>
            </span>
            {#if i < ladder.length - 1}
              <Papicon icon="chevron-right" size={14} class="mx-1 text-on-surface-variant" />
            {/if}
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  {#if staff.hierarchies.length === 0 && staff.roles.length === 0}
    <div class="section-card">
      <EmptyState icon="layers" title={t.emptyTitle} description={t.emptyDesc} actionLabel={t.emptyAction} onAction={() => openHierarchy(null)} />
    </div>
  {:else}
    <div class="grid gap-4 {showUnlinked || staff.orderedHierarchies.length > 3 ? 'grid-cols-4' : 'grid-cols-3'}">
      {#each staff.orderedHierarchies as h (h.id)}
        {@const roles = staff.rolesInHierarchy(h.id)}
        {@const parent = staff.hierarchyById(h.parentHierarchyId)}
        {@const responsable = h.responsableUserId ? staff.memberByUserId(h.responsableUserId) : undefined}
        <section class="section-card flex flex-col" aria-labelledby="h-{h.id}">
          <header class="flex items-start gap-3 px-4 pt-4">
            <HierarchyIcon icon={h.icon} color={h.color} size={36} />
            <div class="min-w-0 flex-1">
              <h3 id="h-{h.id}" class="truncate text-sm font-semibold text-on-surface">{h.name}</h3>
              {#if h.description}
                <p class="line-clamp-2 text-xs text-on-surface-variant">{h.description}</p>
              {/if}
            </div>
            {#if canEdit}
              <Menu label={t.hierarchyMenu(h.name)} items={hierarchyMenu(h)} />
            {/if}
          </header>
          {#if responsable || parent}
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pt-3 text-xs text-on-surface-variant">
              {#if responsable}
                <span class="inline-flex items-center gap-1.5">
                  <StaffAvatar url={responsable.avatarUrl} name={staffName(responsable)} userId={responsable.userId} size={18} />
                  {t.ledBy(staffName(responsable))}
                </span>
              {/if}
              {#if parent}
                <span class="inline-flex items-center gap-1"><Papicon icon="git-branch" size={12} />{t.reportsTo(parent.name)}</span>
              {/if}
            </div>
          {/if}
          <div class="flex-1 p-3">
            {@render dropZone(h.id, h.id, roles, t.noRolesIn)}
          </div>
          {#if canEdit}
            <div class="border-t border-outline-variant px-3 py-2">
              <Button variant="ghost" size="sm" icon="plus" onclick={() => openCreateRole(h.id)}>{t.addGradeHere}</Button>
            </div>
          {/if}
        </section>
      {/each}

      <!-- Hors hiérarchie : la colonne n'apparaît que si un grade y est rangé, faute de place dans l'aperçu. -->
      {#if showUnlinked}
      <section class="flex flex-col rounded-xl border border-dashed border-outline-variant" aria-labelledby="h-unlinked">
        <header class="px-4 pt-4">
          <h3 id="h-unlinked" class="text-sm font-semibold text-on-surface">{t.unlinkedTitle}</h3>
          <p class="text-xs text-on-surface-variant">{t.unlinkedDesc}</p>
        </header>
        <div class="flex-1 p-3">
          {@render dropZone('unlinked', null, staff.rolesInHierarchy(null), t.noUnlinked)}
        </div>
      </section>
      {/if}
    </div>
  {/if}
</div>

<!-- Grade -->
<Modal open={roleModal !== null} onClose={() => (roleModal = null)} title={roleModal === 'edit' ? t.editRole : t.newRole} subtitle={t.roleModalSub}>
  <div class="space-y-4 p-5">
    <Field label={t.linkedDiscordRole} hint={t.discordRoleHint}>
      {#snippet children(id, describedBy)}
        <select {id} aria-describedby={describedBy} class="input" value={rDiscord} onchange={(e) => pickDiscordRole((e.currentTarget as HTMLSelectElement).value)}>
          <option value="">{t.none}</option>
          {#each staff.discordRoles as dr (dr.id)}<option value={dr.id}>@{dr.name}</option>{/each}
        </select>
      {/snippet}
    </Field>
    <Field label={t.roleName} required>
      {#snippet children(id)}
        <input {id} class="input" type="text" placeholder={t.phRoleName} bind:value={rName} />
      {/snippet}
    </Field>
    <div class="grid grid-cols-2 gap-4">
      <Field label={t.hierarchyAssoc}>
        {#snippet children(id)}
          <select {id} class="input" bind:value={rHierarchy}>
            <option value="">{t.outOfHierarchy}</option>
            {#each staff.orderedHierarchies as h (h.id)}<option value={h.id}>{h.name}</option>{/each}
          </select>
        {/snippet}
      </Field>
      <Field label={t.roleWeight} hint={t.weightHint}>
        {#snippet children(id, describedBy)}
          <input {id} aria-describedby={describedBy} class="input tabular-nums" type="number" min="1" max="10000" bind:value={rLevel} />
        {/snippet}
      </Field>
    </div>
    {#if roleModal === 'edit'}
      <Field label={t.colorOptional}>
        {#snippet children(id)}
          <div class="flex gap-2">
            <input type="color" class="h-9 w-11 cursor-pointer rounded-lg border border-outline-variant bg-surface-container p-1" value={rColor || '#949ba4'} oninput={(e) => (rColor = (e.currentTarget as HTMLInputElement).value)} aria-label={t.color} />
            <input {id} class="input" type="text" placeholder="#3b82f6" bind:value={rColor} />
          </div>
        {/snippet}
      </Field>
    {/if}
    <div class="flex items-start justify-between gap-4 rounded-lg border border-outline-variant px-4 py-3">
      <span>
        <span class="block text-sm font-medium text-on-surface">{t.chiefToggle}</span>
        <span class="block text-xs text-on-surface-variant">{t.chiefHint}</span>
      </span>
      <ToggleSwitch checked={rChief} ariaLabel={t.chiefToggle} onToggle={(v: boolean) => (rChief = v)} />
    </div>
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (roleModal = null)}>{t.cancel}</Button>
      <Button variant="primary" disabled={!rName.trim()} disabledReason={t.nameRequired} onexplain={(reason) => staff.toast('warning', reason)} onclick={submitRole}>
        {roleModal === 'edit' ? t.save : t.createGrade}
      </Button>
    </div>
  {/snippet}
</Modal>

<!-- Hiérarchie -->
<Modal open={hModal} onClose={() => (hModal = false)} title={hEditing ? t.editHierarchyTitle : t.newHierarchy} subtitle={t.hierarchyModalSub}>
  <div class="space-y-4 p-5">
    <div class="flex items-center gap-3 rounded-lg bg-surface-container px-3 py-3">
      <HierarchyIcon icon={hIcon} color={hColor} size={40} />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-on-surface">{hName || t.phHierarchyName}</p>
        <p class="truncate text-xs text-on-surface-variant">{hDesc || t.preview}</p>
      </div>
    </div>
    <Field label={t.hierarchyName} required>
      {#snippet children(id)}
        <input {id} class="input" type="text" placeholder={t.phHierarchyName} bind:value={hName} />
      {/snippet}
    </Field>
    <Field label={t.description}>
      {#snippet children(id)}
        <textarea {id} class="input resize-none" rows="2" placeholder={t.phHierarchyDesc} bind:value={hDesc}></textarea>
      {/snippet}
    </Field>
    <div class="grid grid-cols-2 gap-4">
      <Field label={t.color}>
        {#snippet children(id)}
          <div class="flex gap-2">
            <input type="color" class="h-9 w-11 cursor-pointer rounded-lg border border-outline-variant bg-surface-container p-1" bind:value={hColor} aria-label={t.color} />
            <input {id} class="input" type="text" bind:value={hColor} />
          </div>
        {/snippet}
      </Field>
      <Field label={t.emoji}>
        {#snippet children(id)}
          <input {id} class="input" type="text" placeholder="🔵, 🛡️, 🎭..." bind:value={hIcon} />
        {/snippet}
      </Field>
    </div>
    <Field label={t.hierarchyRole}>
      {#snippet children(id)}
        <select {id} class="input" bind:value={hRole}>
          <option value="">{t.none}</option>
          {#each staff.discordRoles as dr (dr.id)}<option value={dr.id}>{dr.name}</option>{/each}
        </select>
      {/snippet}
    </Field>
    <div class="grid grid-cols-2 gap-4">
      <Field label={t.responsible}>
        {#snippet children(id)}
          <select {id} class="input" bind:value={hResp}>
            <option value="">{t.none}</option>
            {#each staff.activeMembers as member (member.id)}<option value={member.userId}>{staffName(member)}</option>{/each}
          </select>
        {/snippet}
      </Field>
      <Field label={t.parent}>
        {#snippet children(id)}
          <select {id} class="input" bind:value={hParent}>
            <option value="">{t.noneAlt}</option>
            {#each staff.orderedHierarchies.filter((x) => x.id !== hEditing?.id) as x (x.id)}<option value={x.id}>{x.name}</option>{/each}
          </select>
        {/snippet}
      </Field>
    </div>
  </div>
  {#snippet footer()}
    <div class="flex justify-end gap-2">
      <Button variant="ghost" onclick={() => (hModal = false)}>{t.cancel}</Button>
      <Button variant="primary" disabled={!hName.trim()} disabledReason={t.nameRequired} onexplain={(reason) => staff.toast('warning', reason)} onclick={submitHierarchy}>{t.save}</Button>
    </div>
  {/snippet}
</Modal>

<style>
  .role-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-height: 3rem;
    padding: 2px;
    border-radius: 0.625rem;
    border: 1px dashed transparent;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  .role-list--over {
    border-color: color-mix(in srgb, var(--primary-color) 45%, transparent);
    background: color-mix(in srgb, var(--primary-color) 5%, transparent);
  }

  .role-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.375rem 0.5rem 0.375rem 0.375rem;
    border-radius: 0.5rem;
    transition: background-color 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
  }
  .role-row:hover {
    background: var(--surface-hover);
  }
  .role-row--over {
    box-shadow: inset 0 2px 0 var(--primary-color);
  }
  .role-row--dragging {
    opacity: 0.4;
  }

  .role-handle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    color: var(--on-surface-variant);
    cursor: grab;
  }
  .role-handle:active {
    cursor: grabbing;
  }
  .role-handle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
  @media (hover: hover) {
    .role-handle {
      opacity: 0.35;
      transition: opacity 0.12s ease;
    }
    .role-row:hover .role-handle,
    .role-handle:focus-visible {
      opacity: 1;
    }
  }

  .ladder-step {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.375rem 0.25rem 0.625rem;
    border-radius: 9999px;
    border: 1px solid var(--outline-variant);
    font-size: 0.8125rem;
    color: var(--on-surface);
    background: var(--surface-container-lowest);
  }
  .ladder-step__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--step);
  }
  .ladder-step__count {
    min-width: 1.25rem;
    padding: 0 0.3rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 600;
    text-align: center;
    color: var(--on-surface-variant);
    background: var(--surface-container);
  }
</style>

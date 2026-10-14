<!--
  Annuaire du staff. Recopie de `lib/components/staff/StaffDirectory.svelte`
  (dashboard) : les classes responsives sont posées telles qu'elles rendent à
  la largeur de l'aperçu (tableau, toutes colonnes), la liste téléphone en moins.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, EmptyState, FilterPills, Menu, Papicon } from '$lib/dash/ui';
  import type { StaffMember } from '$lib/dash/types';
  import StaffAvatar from './StaffAvatar.svelte';
  import GradeChip from './GradeChip.svelte';
  import WarnMeter from './WarnMeter.svelte';
  import HierarchyIcon from './HierarchyIcon.svelte';
  import { useStaff, staffName } from './staffStore.svelte';
  import { memberMenuItems } from './memberActions';
  import { formatNumber, formatTenure, formatVoice, formatDate } from './format';

  const TEXT = {
    fr: {
      all: 'Tous',
      active: 'Actifs',
      suspended: 'Suspendus',
      tutors: 'Tuteurs',
      warned: 'Avertis',
      search: 'Chercher un membre du staff',
      filter: 'Filtrer',
      sortLabel: 'Trier par',
      sortBy: (what: string) => `Trier : ${what}`,
      sortGrade: 'Grade',
      sortName: 'Nom',
      sortTenure: 'Ancienneté',
      sortActivity: 'Activité',
      add: 'Ajouter un membre',
      noMatchTitle: 'Aucun résultat',
      noMatchDesc: 'Essaie un autre nom ou retire un filtre.',
      reset: 'Effacer les filtres',
      emptyTitle: 'Aucun membre dans le staff',
      emptyDesc: 'Ajoute un premier membre avec « Ajouter un membre ».',
      emptyAction: 'Ajouter mon premier membre',
      colMember: 'Membre',
      colGrade: 'Grade',
      colHierarchies: 'Hiérarchies',
      colActivity: 'Activité',
      colDiscipline: 'Avertissements',
      colTenure: 'Ancienneté',
      colActions: 'Actions',
      open: (name: string) => `Ouvrir la fiche de ${name}`,
      tutor: 'Tuteur',
      suspendedSince: (date: string) => `Suspendu depuis le ${date}`,
      msg: 'msg',
      promote: 'Promouvoir',
      demote: 'Rétrograder',
      gradeMax: 'Grade maximum atteint',
      gradeMin: 'Grade minimum atteint',
      menu: (name: string) => `Actions pour ${name}`,
    },
    en: {
      all: 'All',
      active: 'Active',
      suspended: 'Suspended',
      tutors: 'Tutors',
      warned: 'Warned',
      search: 'Search a staff member',
      filter: 'Filter',
      sortLabel: 'Sort by',
      sortBy: (what: string) => `Sort: ${what}`,
      sortGrade: 'Grade',
      sortName: 'Name',
      sortTenure: 'Tenure',
      sortActivity: 'Activity',
      add: 'Add a member',
      noMatchTitle: 'No results',
      noMatchDesc: 'Try another name or remove a filter.',
      reset: 'Clear filters',
      emptyTitle: 'No staff members',
      emptyDesc: 'Add a first member with “Add a member”.',
      emptyAction: 'Add my first member',
      colMember: 'Member',
      colGrade: 'Grade',
      colHierarchies: 'Hierarchies',
      colActivity: 'Activity',
      colDiscipline: 'Warnings',
      colTenure: 'Tenure',
      colActions: 'Actions',
      open: (name: string) => `Open ${name}'s profile`,
      tutor: 'Tutor',
      suspendedSince: (date: string) => `Suspended since ${date}`,
      msg: 'msg',
      promote: 'Promote',
      demote: 'Demote',
      gradeMax: 'Maximum grade reached',
      gradeMin: 'Minimum grade reached',
      menu: (name: string) => `Actions for ${name}`,
    },
  };

  const { openCase }: { openCase?: (userId: string, name: string) => void } = $props();

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  type Filter = 'all' | 'active' | 'suspended' | 'tutors' | 'warned';
  type Sort = 'grade' | 'name' | 'tenure' | 'activity';

  let query = $state('');
  let filter = $state<Filter>('all');
  let sort = $state<Sort>('grade');

  const threshold = $derived(staff.config.warnsToDemote || 3);
  const members = $derived(staff.activeMembers);

  const counts = $derived({
    all: members.length,
    active: members.filter((s) => !s.suspendedAt).length,
    suspended: members.filter((s) => !!s.suspendedAt).length,
    tutors: members.filter((s) => s.isTutor).length,
    warned: members.filter((s) => (s.warnings?.length ?? 0) > 0).length,
  });

  const filterOptions = $derived(
    [
      { value: 'all' as const, label: t.all, count: counts.all },
      { value: 'active' as const, label: t.active, count: counts.active },
      { value: 'suspended' as const, label: t.suspended, count: counts.suspended },
      { value: 'tutors' as const, label: t.tutors, count: counts.tutors },
      { value: 'warned' as const, label: t.warned, count: counts.warned },
    ].filter((option) => option.value === 'all' || option.value === 'active' || option.count > 0 || option.value === filter),
  );

  const visible = $derived.by(() => {
    const q = query.trim().toLowerCase();
    const list = members.filter((member) => {
      if (filter === 'active' && member.suspendedAt) return false;
      if (filter === 'suspended' && !member.suspendedAt) return false;
      if (filter === 'tutors' && !member.isTutor) return false;
      if (filter === 'warned' && !member.warnings?.length) return false;
      if (!q) return true;
      return [member.displayName, member.username, member.userTag, member.userId, member.grade].some((value) => value?.toLowerCase().includes(q));
    });
    const byGrade = (a: StaffMember, b: StaffMember) => {
      const ia = staff.gradeIndex(a.grade);
      const ib = staff.gradeIndex(b.grade);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    };
    return list.sort((a, b) => {
      if (sort === 'name') return staffName(a).localeCompare(staffName(b));
      if (sort === 'tenure') return new Date(a.joinedStaffAt).getTime() - new Date(b.joinedStaffAt).getTime();
      if (sort === 'activity') return (b.stats?.totalMessages ?? 0) - (a.stats?.totalMessages ?? 0);
      return byGrade(a, b) || staffName(a).localeCompare(staffName(b));
    });
  });

  const dense = $derived(visible.length > 6);

  function open(member: StaffMember) {
    openCase?.(member.userId, staffName(member));
  }

  function onRowKey(event: KeyboardEvent, member: StaffMember) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open(member);
    }
  }

  function resetFilters() {
    query = '';
    filter = 'all';
  }
</script>

{#snippet hierarchyStack(member: StaffMember)}
  {#if member.hierarchyGrades?.length}
    <span class="flex items-center -space-x-1.5">
      {#each member.hierarchyGrades.slice(0, 3) as grade (grade.id)}
        {@const hierarchy = staff.hierarchyById(grade.hierarchyId)}
        <span class="rounded-lg ring-2 ring-surface-container-lowest" title="{hierarchy?.name ?? ''} · {grade.grade}">
          <HierarchyIcon icon={hierarchy?.icon} color={hierarchy?.color} size={24} />
        </span>
      {/each}
      {#if member.hierarchyGrades.length === 1}
        {@const only = staff.hierarchyById(member.hierarchyGrades[0].hierarchyId)}
        <span class="pl-3 text-sm text-on-surface-variant truncate">{only?.name ?? ''}</span>
      {/if}
    </span>
  {:else}
    <span class="text-sm text-on-surface-variant">-</span>
  {/if}
{/snippet}

{#snippet quickActions(member: StaffMember)}
  <div class="flex items-center justify-end gap-0.5">
    {#if staff.canManageSettings}
      <!-- Le clic sur ces boutons ne doit pas ouvrir la fiche. -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <span class="mr-1 flex items-center gap-1" onclick={(e) => e.stopPropagation()}>
        <Button
          variant="secondary"
          size={dense ? 'sm' : 'md'}
          icon="chevrons-up"
          aria-label="{t.promote} {staffName(member)}"
          title={t.promote}
          disabled={!staff.canPromote(member)}
          disabledReason={t.gradeMax}
          onexplain={(reason) => staff.toast('warning', reason)}
          onclick={() => staff.shiftGrade(member, 'up')}
        />
        <Button
          variant="secondary"
          size={dense ? 'sm' : 'md'}
          icon="chevrons-down"
          aria-label="{t.demote} {staffName(member)}"
          title={t.demote}
          disabled={!staff.canDemote(member)}
          disabledReason={t.gradeMin}
          onexplain={(reason) => staff.toast('warning', reason)}
          onclick={() => staff.shiftGrade(member, 'down')}
        />
      </span>
    {/if}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
      <Menu label={t.menu(staffName(member))} items={memberMenuItems(staff, member)} />
    </span>
  </div>
{/snippet}

<div class="space-y-4">
  <!-- Barre d'outils -->
  <div class="flex flex-row items-center gap-3">
    <div class="relative max-w-sm flex-1">
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
        <Papicon icon="search" size={15} />
      </span>
      <input type="search" class="input" style="padding-left: 2.25rem;" placeholder={t.search} aria-label={t.search} bind:value={query} />
    </div>
    <FilterPills label={t.filter} options={filterOptions} value={filter} onchange={(v) => (filter = v)} />
    <div class="ml-auto flex flex-wrap items-center gap-2">
      <select class="input h-9 py-0 pr-8 text-sm" style="width: auto;" aria-label={t.sortLabel} bind:value={sort}>
        <option value="grade">{t.sortBy(t.sortGrade)}</option>
        <option value="name">{t.sortBy(t.sortName)}</option>
        <option value="tenure">{t.sortBy(t.sortTenure)}</option>
        <option value="activity">{t.sortBy(t.sortActivity)}</option>
      </select>
      {#if staff.canConfigureDirectory}
        <Button variant="primary" icon="plus" onclick={() => (staff.dialogs.addMember = true)}>{t.add}</Button>
      {/if}
    </div>
  </div>

  {#if members.length === 0}
    <div class="section-card">
      <EmptyState icon="users" title={t.emptyTitle} description={t.emptyDesc} actionLabel={t.emptyAction} onAction={() => (staff.dialogs.addMember = true)} />
    </div>
  {:else if visible.length === 0}
    <div class="section-card">
      <EmptyState icon="search" title={t.noMatchTitle} description={t.noMatchDesc}>
        {#snippet action()}
          <Button variant="secondary" icon="rotate-ccw" onclick={resetFilters}>{t.reset}</Button>
        {/snippet}
      </EmptyState>
    </div>
  {:else}
    <!-- Sans overflow-hidden (le dashboard l'a) : le menu « ... » s'ouvre en absolu et serait coupé par la carte. -->
    <div class="section-card">
      <table class="staff-table w-full" class:staff-table--dense={dense}>
        <thead>
          <tr>
            <th scope="col">{t.colMember}</th>
            <th scope="col">{t.colGrade}</th>
            <th scope="col">{t.colHierarchies}</th>
            <th scope="col">{t.colActivity}</th>
            <th scope="col">{t.colDiscipline}</th>
            <th scope="col">{t.colTenure}</th>
            <th scope="col"><span class="sr-only">{t.colActions}</span></th>
          </tr>
        </thead>
        <tbody>
          {#each visible as member (member.id)}
            <tr
              class="staff-row"
              class:staff-row--suspended={!!member.suspendedAt}
              class:staff-row--static={!openCase}
              tabindex={openCase ? 0 : undefined}
              aria-label={openCase ? t.open(staffName(member)) : undefined}
              onclick={() => open(member)}
              onkeydown={(e) => onRowKey(e, member)}
            >
              <td>
                <div class="flex min-w-0 items-center gap-3">
                  <StaffAvatar url={member.avatarUrl} name={staffName(member)} userId={member.userId} size={32} dimmed={!!member.suspendedAt} />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="truncate text-sm font-medium text-on-surface">{staffName(member)}</span>
                      {#if member.isTutor}
                        <span class="text-primary" title={t.tutor}><Papicon icon="user-check" size={13} /></span>
                      {/if}
                    </div>
                    {#if member.suspendedAt}
                      <span class="text-xs text-warning">{t.suspendedSince(formatDate(member.suspendedAt))}</span>
                    {:else}
                      <span class="block truncate text-xs text-on-surface-variant">@{member.username || member.userTag || member.userId}</span>
                    {/if}
                  </div>
                </div>
              </td>
              <td><GradeChip name={member.grade} color={staff.gradeColor(member.grade)} /></td>
              <td>{@render hierarchyStack(member)}</td>
              <td>
                {#if member.stats}
                  <span class="text-sm tabular-nums text-on-surface">{formatNumber(member.stats.totalMessages)}</span>
                  <span class="text-xs text-on-surface-variant"> {t.msg} · {formatVoice(member.stats.totalVoiceMinutes)}</span>
                {:else}
                  <span class="text-sm text-on-surface-variant">-</span>
                {/if}
              </td>
              <td><WarnMeter count={member.warnings?.length ?? 0} {threshold} /></td>
              <td>
                <span class="text-sm text-on-surface" title={formatDate(member.joinedStaffAt)}>{formatTenure(member.joinedStaffAt)}</span>
              </td>
              <td class="whitespace-nowrap text-right">{@render quickActions(member)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .staff-table {
    border-collapse: collapse;
    text-align: left;
  }
  .staff-table th {
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--on-surface-variant);
    background: var(--surface-container);
    border-bottom: 1px solid var(--outline-variant);
    white-space: nowrap;
  }
  /* Le menu partagé choisit son sens d'après la fenêtre, pas d'après le cadre :
     dans l'annuaire il s'ouvre toujours vers le haut, où il a la place. */
  .staff-table :global([role='menu']) {
    top: auto !important;
    bottom: calc(100% + 8px) !important;
  }
  .staff-table th:first-child {
    border-top-left-radius: calc(0.75rem - 1px);
  }
  .staff-table th:last-child {
    border-top-right-radius: calc(0.75rem - 1px);
  }
  .staff-table td {
    padding: 0.5rem 1rem;
    vertical-align: middle;
    border-bottom: 1px solid var(--outline-variant);
  }
  /* Plus de six lignes : l'aperçu n'a pas la hauteur, les lignes se resserrent. */
  .staff-table--dense td {
    padding-top: 0.1875rem;
    padding-bottom: 0.1875rem;
  }
  .staff-table tbody tr:last-child td {
    border-bottom: none;
  }
  .staff-row {
    cursor: pointer;
    transition: background-color 0.12s ease;
  }
  .staff-row:hover,
  .staff-row:focus-visible {
    background: var(--surface-hover);
  }
  .staff-row:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  .staff-row--static {
    cursor: default;
  }
  .staff-row--suspended td:not(:last-child) {
    opacity: 0.75;
  }
</style>

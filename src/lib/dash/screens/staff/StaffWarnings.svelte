<!--
  Registre des avertissements du staff. Recopie de
  `lib/components/staff/StaffWarnings.svelte` (dashboard), mise en page de la
  largeur de l'aperçu.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, Callout, EmptyState, FilterPills, Papicon } from '$lib/dash/ui';
  import StaffAvatar from './StaffAvatar.svelte';
  import WarnMeter from './WarnMeter.svelte';
  import { useStaff, staffName, type StaffWarning } from './staffStore.svelte';
  import { formatDate, formatRelative } from './format';

  const TEXT = {
    fr: {
      nearTitle: (n: number) => `Membres proches du seuil : ${n}`,
      nearDesc: (n: number) => `Encore un avertissement et ils atteignent le seuil de rétrogradation (${n}).`,
      search: 'Chercher un membre, une raison',
      filter: 'Filtrer',
      inForce: 'En vigueur',
      expired: 'Expirés',
      all: 'Tous',
      newWarning: 'Nouvel avertissement',
      emptyTitle: 'Aucun avertissement actif',
      emptyDesc: "Personne dans le staff n'a d'avertissement en cours.",
      noMatchTitle: 'Aucun résultat',
      noActive: 'Aucun avertissement en vigueur. Les expirés restent dans le filtre « Expirés ».',
      noMatchDesc: 'Essaie un autre nom ou retire un filtre.',
      showAll: 'Voir tous les avertissements',
      by: (name: string) => `par ${name}`,
      expires: (when: string) => `expire ${when}`,
      active: 'Actif',
      expiredBadge: 'Expiré',
      delete: "Supprimer l'avertissement",
    },
    en: {
      nearTitle: (n: number) => `Members near the threshold: ${n}`,
      nearDesc: (n: number) => `One more warning and they reach the demotion threshold (${n}).`,
      search: 'Search a member, a reason',
      filter: 'Filter',
      inForce: 'In force',
      expired: 'Expired',
      all: 'All',
      newWarning: 'New warning',
      emptyTitle: 'No active warning',
      emptyDesc: 'Nobody on the staff has an active warning.',
      noMatchTitle: 'No results',
      noActive: 'No warning in force. Expired ones stay under « Expired ».',
      noMatchDesc: 'Try another name or remove a filter.',
      showAll: 'Show all warnings',
      by: (name: string) => `by ${name}`,
      expires: (when: string) => `expires ${when}`,
      active: 'Active',
      expiredBadge: 'Expired',
      delete: 'Delete the warning',
    },
  };

  const { openCase }: { openCase?: (userId: string, name: string) => void } = $props();

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  type Filter = 'active' | 'expired' | 'all';
  let filter = $state<Filter>('active');
  let query = $state('');

  const threshold = $derived(staff.config.warnsToDemote || 3);

  const counts = $derived({
    active: staff.warnings.filter((w) => w.isActive).length,
    expired: staff.warnings.filter((w) => !w.isActive).length,
    all: staff.warnings.length,
  });

  const nearThreshold = $derived(
    staff.activeMembers
      .filter((member) => (member.warnings?.length ?? 0) > 0 && (member.warnings?.length ?? 0) >= threshold - 1)
      .sort((a, b) => (b.warnings?.length ?? 0) - (a.warnings?.length ?? 0)),
  );

  const visible = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return staff.warnings
      .filter((w) => (filter === 'all' ? true : filter === 'active' ? w.isActive : !w.isActive))
      .filter((w) => !q || [w.staffDisplayName, w.reason, w.issuedByTag, w.staffUserId].some((v) => v?.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  function memberOf(warning: StaffWarning) {
    return staff.memberByUserId(warning.staffUserId);
  }
</script>

<div class="space-y-4">
  {#if nearThreshold.length > 0}
    <Callout variant="warning" title={t.nearTitle(nearThreshold.length)}>
      {t.nearDesc(threshold)}
      {#snippet actions()}
        {#each nearThreshold.slice(0, 4) as member (member.id)}
          <button type="button" class="near-chip" onclick={() => openCase?.(member.userId, staffName(member))}>
            <StaffAvatar url={member.avatarUrl} name={staffName(member)} userId={member.userId} size={20} />
            <span class="text-sm text-on-surface">{staffName(member)}</span>
            <WarnMeter count={member.warnings?.length ?? 0} {threshold} />
          </button>
        {/each}
      {/snippet}
    </Callout>
  {/if}

  <div class="flex flex-row items-center gap-3">
    <div class="relative max-w-sm flex-1">
      <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-on-surface-variant"><Papicon icon="search" size={15} /></span>
      <input type="search" class="input" style="padding-left: 2.25rem;" placeholder={t.search} aria-label={t.search} bind:value={query} />
    </div>
    <FilterPills
      label={t.filter}
      value={filter}
      onchange={(v) => (filter = v)}
      options={[
        { value: 'active', label: t.inForce, count: counts.active },
        { value: 'expired', label: t.expired, count: counts.expired },
        { value: 'all', label: t.all, count: counts.all },
      ]}
    />
    {#if staff.canModerate}
      <Button variant="primary" icon="plus" class="ml-auto" onclick={() => (staff.dialogs.warn = { userId: '' })}>{t.newWarning}</Button>
    {/if}
  </div>

  {#if staff.warnings.length === 0}
    <div class="section-card">
      <EmptyState icon="shield-check" title={t.emptyTitle} description={t.emptyDesc} actionLabel={t.newWarning} onAction={() => (staff.dialogs.warn = { userId: '' })} />
    </div>
  {:else if visible.length === 0}
    <div class="section-card">
      <EmptyState
        icon="search"
        title={t.noMatchTitle}
        description={filter === 'active' ? t.noActive : t.noMatchDesc}
        actionLabel={t.showAll}
        actionIcon="list"
        onAction={() => {
          query = '';
          filter = 'all';
        }}
      />
    </div>
  {:else}
    <ul class="section-card divide-y divide-outline-variant overflow-hidden">
      {#each visible as warning (warning.id)}
        {@const member = memberOf(warning)}
        <li class="warn-row" class:warn-row--expired={!warning.isActive}>
          <button
            type="button"
            class="flex w-56 min-w-0 shrink-0 items-center gap-3 rounded-lg text-left"
            onclick={() => openCase?.(warning.staffUserId, warning.staffDisplayName || staffName(member))}
            disabled={!openCase}
          >
            <StaffAvatar url={warning.staffAvatarUrl ?? member?.avatarUrl} name={warning.staffDisplayName ?? staffName(member)} userId={warning.staffUserId} size={32} />
            <span class="min-w-0">
              <span class="block truncate text-sm font-medium text-on-surface">{warning.staffDisplayName || staffName(member)}</span>
              <span class="block truncate text-xs text-on-surface-variant">{member?.grade ?? warning.staffUserId}</span>
            </span>
          </button>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-on-surface">{warning.reason}</p>
            <p class="mt-0.5 text-xs text-on-surface-variant">
              {#if warning.issuedByTag}{t.by(warning.issuedByTag)} · {/if}
              <time datetime={warning.createdAt} title={formatDate(warning.createdAt)}>{formatRelative(warning.createdAt)}</time>
              {#if warning.isActive && warning.expiresAt}
                · {t.expires(formatRelative(warning.expiresAt))}
              {/if}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-3">
            {#if warning.isActive}
              <span class="badge badge-warning">{t.active}</span>
            {:else}
              <span class="badge badge-neutral">{t.expiredBadge}</span>
            {/if}
            {#if staff.canModerate}
              <Button variant="ghost" size="sm" icon="trash-2" aria-label={t.delete} title={t.delete} onclick={() => staff.deleteWarning(warning)} />
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .warn-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.25rem;
    padding: 0.875rem 1rem;
  }
  .warn-row--expired > :not(:last-child) {
    opacity: 0.65;
  }
  .near-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.625rem 0.25rem 0.25rem;
    border-radius: 9999px;
    border: 1px solid var(--outline-variant);
    background: var(--surface-container-lowest);
    transition: background-color 0.15s ease;
  }
  .near-chip:hover {
    background: var(--surface-hover);
  }
</style>

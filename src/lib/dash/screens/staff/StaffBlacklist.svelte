<!--
  Liste noire du staff : qui ne peut plus revenir, pourquoi, et jusqu'à quand.
  Recopie de `lib/components/staff/StaffBlacklist.svelte` (dashboard).
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, EmptyState } from '$lib/dash/ui';
  import StaffAvatar from './StaffAvatar.svelte';
  import { useStaff, staffName } from './staffStore.svelte';
  import { formatDate, formatRelative } from './format';

  const TEXT = {
    fr: {
      desc: "Coupe net tout accès d'un utilisateur à l'équipe staff.",
      add: 'Mettre en liste noire',
      emptyTitle: 'Liste noire vide',
      emptyDesc: "Personne n'est dans la liste noire du staff.",
      until: (when: string) => `jusqu'à ${when}`,
      permanent: 'Permanent',
      remove: 'Retirer de la liste noire',
    },
    en: {
      desc: "Instantly cut off a user's access to the Staff team.",
      add: 'Add to blocklist',
      emptyTitle: 'Empty blocklist',
      emptyDesc: 'Nobody is on the staff blocklist.',
      until: (when: string) => `until ${when}`,
      permanent: 'Permanent',
      remove: 'Remove from the blocklist',
    },
  };

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  const rows = $derived(staff.blacklistedMembers.map((member) => ({ member, entry: member.blacklistEntries![0] })));
</script>

<div class="space-y-4">
  <div class="flex flex-row items-center justify-between gap-3">
    <p class="text-sm text-on-surface-variant">{t.desc}</p>
    {#if staff.canModerate}
      <Button variant="danger" icon="slash" onclick={() => (staff.dialogs.blacklist = { userId: '' })}>{t.add}</Button>
    {/if}
  </div>

  {#if rows.length === 0}
    <div class="section-card">
      <EmptyState icon="user-x" title={t.emptyTitle} description={t.emptyDesc} actionLabel={t.add} actionIcon="slash" onAction={() => (staff.dialogs.blacklist = { userId: '' })} />
    </div>
  {:else}
    <ul class="section-card divide-y divide-outline-variant overflow-hidden">
      {#each rows as { member, entry } (member.id)}
        <li class="flex flex-row items-center gap-5 px-4 py-3.5">
          <div class="flex w-56 min-w-0 shrink-0 items-center gap-3">
            <StaffAvatar url={member.avatarUrl} name={staffName(member)} userId={member.userId} size={32} dimmed />
            <span class="min-w-0">
              <span class="block truncate text-sm font-medium text-on-surface">{staffName(member)}</span>
              <span class="block truncate text-xs text-on-surface-variant">@{member.username || member.userId}</span>
            </span>
          </div>
          <p class="min-w-0 flex-1 text-sm text-on-surface">{entry?.reason || '-'}</p>
          <div class="flex shrink-0 items-center gap-3">
            {#if entry?.endDate}
              <span class="badge badge-neutral" title={formatDate(entry.endDate)}>{t.until(formatRelative(entry.endDate))}</span>
            {:else}
              <span class="badge badge-danger">{t.permanent}</span>
            {/if}
            {#if staff.canModerate}
              <Button variant="ghost" size="sm" icon="rotate-ccw" onclick={() => staff.liftBlacklist(member)}>{t.remove}</Button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

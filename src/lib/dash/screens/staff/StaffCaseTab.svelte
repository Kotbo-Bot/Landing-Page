<!--
  Onglet « Staff » du dossier membre, quand on l'ouvre depuis l'écran Équipe :
  grade et actions rapides, chiffres, discipline, hiérarchies et parcours.
  Recopie de `lib/components/staff/StaffCaseTab.svelte` (dashboard).
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Button, Menu, Papicon } from '$lib/dash/ui';
  import WarnMeter from './WarnMeter.svelte';
  import HierarchyIcon from './HierarchyIcon.svelte';
  import { useStaff, staffName } from './staffStore.svelte';
  import { memberMenuItems } from './memberActions';
  import { formatDate, formatNumber, formatRelative, formatTenure, formatVoice, weekTrend } from './format';

  const TEXT = {
    fr: {
      warning: 'Avertissement',
      warningExpired: 'Avertissement expiré',
      by: (name: string) => `par ${name}`,
      suspended: 'Suspendu',
      joinedHierarchy: (name: string) => `Rejoint ${name}`,
      becomes: (grade: string) => `Passe ${grade}`,
      joined: 'Entre dans le staff',
      tutor: 'Tuteur',
      suspendedSince: (date: string) => `Suspendu depuis le ${date}`,
      factJoined: 'Entré dans le staff',
      factGradeSince: 'Grade actuel depuis',
      gradeMin: 'Grade minimum atteint',
      gradeMax: 'Grade maximum atteint',
      demote: 'Rétrograder',
      promote: 'Promouvoir',
      menu: (name: string) => `Actions pour ${name}`,
      brief: 'En bref',
      messages: 'Messages',
      voice: 'Vocal',
      sanctionsGiven: 'Sanctions données',
      score: 'Score progression',
      pace: 'Rythme (7 j)',
      vsMonth: (avg: number, trend: string) => `${avg}/j sur le mois · ${trend}`,
      tenureCol: 'Ancienneté',
      hierarchies: 'Hiérarchies',
      edit: 'Modifier',
      noSecondary: "Ce membre n'appartient à aucune hiérarchie secondaire.",
      timeline: 'Parcours',
      tenure: (d: string) => `Dans le staff depuis ${d}`,
      discipline: 'Discipline',
      thresholdSentence: (demote: number, blacklist: number) => `Rétrogradation à ${demote} avertissements actifs, liste noire à ${blacklist}.`,
      modeAuto: 'Kotbo applique la sanction seul.',
      modeValidation: 'La sanction attend une validation.',
      expires: (when: string) => `expire ${when}`,
      warn: 'Avertir',
    },
    en: {
      warning: 'Warning',
      warningExpired: 'Expired warning',
      by: (name: string) => `by ${name}`,
      suspended: 'Suspended',
      joinedHierarchy: (name: string) => `Joins ${name}`,
      becomes: (grade: string) => `Becomes ${grade}`,
      joined: 'Joins the staff',
      tutor: 'Tutor',
      suspendedSince: (date: string) => `Suspended since ${date}`,
      factJoined: 'Joined staff',
      factGradeSince: 'Current grade since',
      gradeMin: 'Minimum grade reached',
      gradeMax: 'Maximum grade reached',
      demote: 'Demote',
      promote: 'Promote',
      menu: (name: string) => `Actions for ${name}`,
      brief: 'At a glance',
      messages: 'Messages',
      voice: 'Voice',
      sanctionsGiven: 'Sanctions issued',
      score: 'Progression Score',
      pace: 'Pace (7 d)',
      vsMonth: (avg: number, trend: string) => `${avg}/d over the month · ${trend}`,
      tenureCol: 'Tenure',
      hierarchies: 'Hierarchies',
      edit: 'Edit',
      noSecondary: 'This member does not belong to any secondary hierarchy.',
      timeline: 'History',
      tenure: (d: string) => `On staff for ${d}`,
      discipline: 'Discipline',
      thresholdSentence: (demote: number, blacklist: number) => `Demotion at ${demote} active warnings, blacklist at ${blacklist}.`,
      modeAuto: 'Kotbo applies the sanction on its own.',
      modeValidation: 'The sanction waits for approval.',
      expires: (when: string) => `expires ${when}`,
      warn: 'Warn',
    },
  };

  const { userId }: { userId: string } = $props();

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);
  const explain = (reason: string) => staff.toast('warning', reason);

  const member = $derived(staff.memberByUserId(userId));
  const metric = $derived(staff.metricFor(userId));
  const trend = $derived(metric ? weekTrend(metric.avg7d, metric.avg30d) : null);
  const threshold = $derived(staff.config.warnsToDemote || 3);
  const gradeColor = $derived(member ? staff.gradeColor(member.grade) : null);

  type TimelineEvent = { at: string; icon: string; tone: 'neutral' | 'warning' | 'danger' | 'primary'; title: string; detail?: string };

  const timeline = $derived.by((): TimelineEvent[] => {
    if (!member) return [];
    const events: TimelineEvent[] = [];
    for (const warning of staff.warnings.filter((w) => w.staffUserId === userId)) {
      events.push({
        at: warning.createdAt,
        icon: 'alert-triangle',
        tone: warning.isActive ? 'warning' : 'neutral',
        title: warning.isActive ? t.warning : t.warningExpired,
        detail: warning.reason + (warning.issuedByTag ? ` · ${t.by(warning.issuedByTag)}` : ''),
      });
    }
    if (member.suspendedAt) {
      events.push({ at: String(member.suspendedAt), icon: 'pause', tone: 'danger', title: t.suspended, detail: member.suspendedReason || undefined });
    }
    for (const grade of member.hierarchyGrades ?? []) {
      const hierarchy = staff.hierarchyById(grade.hierarchyId);
      if (grade.joinedAt) {
        events.push({ at: String(grade.joinedAt), icon: 'git-branch', tone: 'neutral', title: t.joinedHierarchy(hierarchy?.name ?? ''), detail: grade.grade });
      }
    }
    if (member.currentRoleStartedAt && member.currentRoleStartedAt !== member.joinedStaffAt) {
      events.push({ at: String(member.currentRoleStartedAt), icon: 'chevrons-up', tone: 'primary', title: t.becomes(member.grade) });
    }
    if (member.joinedStaffAt) {
      events.push({ at: String(member.joinedStaffAt), icon: 'user-plus', tone: 'primary', title: t.joined });
    }
    return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  });
</script>

{#if member}
  <div class="space-y-4">
    <!-- Grade et actions -->
    <section class="sc-card flex flex-wrap items-center justify-between gap-4 p-4">
      <div class="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
        <span class="sc-chip" style="color: {gradeColor || 'var(--primary-color)'}; background: color-mix(in srgb, {gradeColor || 'var(--primary-color)'} 12%, transparent);">
          <Papicon icon="shield" size={13} />{member.grade}
        </span>
        {#if member.isTutor}
          <span class="sc-chip bg-primary/10 text-primary"><Papicon icon="user-check" size={12} />{t.tutor}</span>
        {/if}
        {#if member.suspendedAt}
          <span class="sc-chip bg-warning/10 text-warning"><Papicon icon="pause" size={12} />{t.suspendedSince(formatDate(member.suspendedAt))}</span>
        {/if}
        <dl class="flex flex-wrap gap-x-5 gap-y-1 text-xs">
          <div class="flex gap-1"><dt class="text-on-surface-variant">{t.factJoined}</dt><dd class="text-on-surface">{formatDate(member.joinedStaffAt)}</dd></div>
          <div class="flex gap-1"><dt class="text-on-surface-variant">{t.factGradeSince}</dt><dd class="text-on-surface">{formatDate(member.currentRoleStartedAt)}</dd></div>
        </dl>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        {#if staff.canManageSettings}
          <Button size="sm" icon="chevrons-down" disabled={!staff.canDemote(member)} disabledReason={t.gradeMin} onexplain={explain} onclick={() => staff.shiftGrade(member, 'down')}>{t.demote}</Button>
          <Button size="sm" variant="primary" icon="chevrons-up" disabled={!staff.canPromote(member)} disabledReason={t.gradeMax} onexplain={explain} onclick={() => staff.shiftGrade(member, 'up')}>{t.promote}</Button>
        {/if}
        <Menu label={t.menu(staffName(member))} items={memberMenuItems(staff, member)} />
      </div>
    </section>

    <div class="grid gap-4 grid-cols-[16rem_minmax(0,1fr)_18rem]">
      <!-- En bref -->
      <div class="space-y-4">
        <section class="sc-card">
          <h4 class="sc-title">{t.brief}</h4>
          <dl class="sc-brief">
            <div><dt>{t.messages}</dt><dd>{formatNumber(member.stats?.totalMessages)}</dd></div>
            <div><dt>{t.voice}</dt><dd>{formatVoice(member.stats?.totalVoiceMinutes)}</dd></div>
            <div><dt>{t.sanctionsGiven}</dt><dd>{formatNumber(member.stats?.sanctionsIssued)}</dd></div>
            {#if metric}
              <div><dt>{t.score}</dt><dd>{metric.progressionScore}/100</dd></div>
              <div>
                <dt>{t.pace}</dt>
                <dd class={trend !== null && trend <= -50 ? 'text-warning' : ''}>
                  {metric.avg7d}
                  <span>{t.vsMonth(metric.avg30d, trend === null ? '-' : `${trend > 0 ? '+' : ''}${trend} %`)}</span>
                </dd>
              </div>
            {/if}
            <div><dt>{t.tenureCol}</dt><dd>{formatTenure(member.joinedStaffAt)}</dd></div>
          </dl>
        </section>

        <section class="sc-card">
          <div class="flex items-center justify-between pr-3">
            <h4 class="sc-title">{t.hierarchies}</h4>
            {#if staff.canManageSettings}
              <Button size="sm" variant="ghost" onclick={() => (staff.dialogs.grades = member.userId)}>{t.edit}</Button>
            {/if}
          </div>
          {#if member.hierarchyGrades?.length}
            <ul class="space-y-2 px-4 pb-4 pt-1">
              {#each member.hierarchyGrades as grade (grade.id)}
                {@const hierarchy = staff.hierarchyById(grade.hierarchyId)}
                <li class="flex items-center gap-3">
                  <HierarchyIcon icon={hierarchy?.icon} color={hierarchy?.color} size={28} />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-on-surface">{hierarchy?.name ?? ''}</span>
                    <span class="block truncate text-xs text-on-surface-variant">{grade.grade}</span>
                  </span>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="px-4 pb-4 pt-1 text-sm text-on-surface-variant">{t.noSecondary}</p>
          {/if}
        </section>
      </div>

      <!-- Parcours -->
      <section class="sc-card min-w-0">
        <h4 class="sc-title">{t.timeline}</h4>
        <p class="-mt-2 px-4 text-xs text-on-surface-variant">{t.tenure(formatTenure(member.joinedStaffAt))}</p>
        <ol class="px-4 pb-2 pt-4">
          {#each timeline as event, i (i)}
            <li class="sc-event sc-event--{event.tone}">
              <span class="sc-event__dot" aria-hidden="true"><Papicon icon={event.icon} size={12} /></span>
              <div class="min-w-0 flex-1 pb-4">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span class="text-sm text-on-surface">{event.title}</span>
                  <time class="text-2xs tabular-nums text-on-surface-variant" datetime={event.at} title={formatDate(event.at)}>{formatRelative(event.at)}</time>
                </div>
                {#if event.detail}
                  <p class="mt-0.5 wrap-break-word text-sm text-on-surface-variant">{event.detail}</p>
                {/if}
              </div>
            </li>
          {/each}
        </ol>
      </section>

      <!-- Discipline -->
      <section class="sc-card">
        <h4 class="sc-title">{t.discipline}</h4>
        <div class="space-y-3 px-4 pb-4">
          <WarnMeter count={member.warnings?.length ?? 0} {threshold} />
          <p class="text-xs text-on-surface-variant">
            {t.thresholdSentence(staff.config.warnsToDemote, staff.config.warnsToBlacklist)}
            {staff.config.actionMode === 'auto' ? t.modeAuto : t.modeValidation}
          </p>
          {#if member.warnings?.length}
            <ul class="space-y-2 border-t border-outline-variant pt-3">
              {#each member.warnings as warning (warning.id)}
                <li>
                  <p class="text-sm text-on-surface">{warning.reason}</p>
                  {#if warning.expiresAt}
                    <p class="text-xs text-on-surface-variant">{t.expires(formatRelative(warning.expiresAt))}</p>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
          {#if staff.canModerate}
            <Button size="sm" fullWidth icon="alert-triangle" onclick={() => (staff.dialogs.warn = { userId: member.userId })}>{t.warn}</Button>
          {/if}
        </div>
      </section>
    </div>
  </div>
{/if}

<style>
  .sc-card {
    border: 1px solid var(--outline-variant);
    border-radius: 0.75rem;
    background: var(--surface-container-lowest);
  }
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
  .sc-brief {
    display: flex;
    flex-direction: column;
    padding-bottom: 0.25rem;
  }
  .sc-brief > div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.55rem 1rem;
    border-top: 1px solid color-mix(in srgb, var(--outline-variant) 50%, transparent);
  }
  .sc-brief dt {
    font-size: 0.8125rem;
    color: var(--on-surface-variant);
  }
  .sc-brief dd {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--on-surface);
    font-variant-numeric: tabular-nums;
  }
  .sc-brief dd span {
    font-size: 0.6875rem;
    font-weight: 400;
    color: var(--on-surface-variant);
  }
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
</style>

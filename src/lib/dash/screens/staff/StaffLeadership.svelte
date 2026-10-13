<!--
  Suivi d'activité du staff : qui décroche cette semaine, qui progresse.
  Recopie de `lib/components/staff/StaffLeadership.svelte` (dashboard). Le
  graphique Chart.js du dashboard est redessiné en HTML (mêmes barres, mêmes
  couleurs) : le site ne charge pas Chart.js.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Callout, EmptyState, FilterPills, Papicon } from '$lib/dash/ui';
  import StaffAvatar from './StaffAvatar.svelte';
  import GradeChip from './GradeChip.svelte';
  import { useStaff, staffName, type LeadershipMetric } from './staffStore.svelte';
  import { weekTrend } from './format';

  const TEXT = {
    fr: {
      emptyTitle: "Pas encore assez d'activité",
      emptyDesc: "Les chiffres apparaissent dès que le staff a quelques jours d'activité.",
      inactiveTitle: (n: number) => `Baisse d'activité cette semaine (${n})`,
      inactiveDesc: (names: string) => `Activité de la semaine sous la moitié de leur moyenne du mois : ${names}.`,
      chartTitle: "Comparaison d'Activité",
      chartDesc: 'Messages par jour : moyenne du mois en gris, de la semaine en couleur.',
      avgScore: 'Score moyen',
      weekVsMonth: 'Semaine vs mois',
      tracked: 'Membres suivis',
      inDecline: 'En baisse',
      avg30: 'Moyenne 30j',
      avg7: 'Moyenne 7j',
      tableTitle: 'Activité par membre',
      sortLabel: 'Trier par',
      sortAlerts: "Alertes d'abord",
      sortScore: 'Score',
      sortActivity: 'Activité',
      inactivity: 'INACTIVITÉ DÉTECTÉE',
      steady: 'Stable',
    },
    en: {
      emptyTitle: 'Not enough activity yet',
      emptyDesc: 'Figures appear once the staff has a few days of activity.',
      inactiveTitle: (n: number) => `Activity drop this week (${n})`,
      inactiveDesc: (names: string) => `This week's activity is under half their monthly average: ${names}.`,
      chartTitle: 'Activity Comparison',
      chartDesc: 'Messages per day: monthly average in grey, weekly in colour.',
      avgScore: 'Average score',
      weekVsMonth: 'Week vs month',
      tracked: 'Members tracked',
      inDecline: 'Declining',
      avg30: '30d Average',
      avg7: '7d Average',
      tableTitle: 'Activity per member',
      sortLabel: 'Sort by',
      sortAlerts: 'Alerts first',
      sortScore: 'Score',
      sortActivity: 'Activity',
      inactivity: 'INACTIVITY DETECTED',
      steady: 'Steady',
    },
  };

  const { openCase }: { openCase?: (userId: string, name: string) => void } = $props();

  const staff = useStaff();
  const t = $derived(TEXT[getLocale()]);

  type Sort = 'alerts' | 'score' | 'activity';
  let sort = $state<Sort>('alerts');

  const rows = $derived.by(() => {
    const list = staff.leadership.map((metric) => ({ metric, member: staff.memberByUserId(metric.staffUserId), trend: weekTrend(metric.avg7d, metric.avg30d) }));
    return list.sort((a, b) => {
      if (sort === 'score') return b.metric.progressionScore - a.metric.progressionScore;
      if (sort === 'activity') return b.metric.avg30d - a.metric.avg30d;
      return Number(b.metric.hasInactivityAlert) - Number(a.metric.hasInactivityAlert) || (a.trend ?? 0) - (b.trend ?? 0);
    });
  });

  const alerts = $derived(rows.filter((row) => row.metric.hasInactivityAlert));
  const avgScore = $derived(rows.length ? Math.round(rows.reduce((s, r) => s + r.metric.progressionScore, 0) / rows.length) : 0);
  const teamTrend = $derived.by(() => {
    const week = staff.leadership.reduce((s, x) => s + x.avg7d, 0);
    const month = staff.leadership.reduce((s, x) => s + x.avg30d, 0);
    return weekTrend(week, month);
  });

  function label(metric: LeadershipMetric) {
    const member = staff.memberByUserId(metric.staffUserId);
    return member ? staffName(member) : metric.staffUserId;
  }

  /** Échelle du graphique : un pas rond au-dessus de la plus grande valeur. */
  const chartMax = $derived(Math.max(10, Math.ceil(Math.max(0, ...staff.leadership.flatMap((x) => [x.avg30d, x.avg7d])) / 10) * 10));
  const ticks = $derived(Array.from({ length: chartMax / 10 + 1 }, (_, i) => i * 10));
</script>

<div class="space-y-4">
  {#if staff.leadership.length === 0}
    <div class="section-card">
      <EmptyState icon="activity" title={t.emptyTitle} description={t.emptyDesc} />
    </div>
  {:else}
    {#if alerts.length > 0}
      <Callout variant="warning" icon="trending-down" title={t.inactiveTitle(alerts.length)}>
        {t.inactiveDesc(alerts.slice(0, 3).map((a) => (a.member ? staffName(a.member) : a.metric.staffUserId)).join(', '))}
      </Callout>
    {/if}

    <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-start gap-4">
      <!-- Synthèse et graphique -->
      <section class="section-card" aria-labelledby="lead-summary">
        <header class="px-5 pt-4">
          <h3 id="lead-summary" class="text-sm font-semibold text-on-surface">{t.chartTitle}</h3>
          <p class="text-xs text-on-surface-variant">{t.chartDesc}</p>
        </header>
        <dl class="grid grid-cols-4 gap-x-4 px-5 pt-3">
          {#each [
            { label: t.avgScore, value: `${avgScore}`, suffix: '/100', tone: '' },
            { label: t.weekVsMonth, value: teamTrend === null ? '-' : `${teamTrend > 0 ? '+' : ''}${teamTrend} %`, suffix: '', tone: teamTrend !== null && teamTrend < -20 ? 'text-warning' : '' },
            { label: t.tracked, value: String(rows.length), suffix: '', tone: '' },
            { label: t.inDecline, value: String(alerts.length), suffix: '', tone: alerts.length ? 'text-warning' : '' },
          ] as stat (stat.label)}
            <div class="min-w-0 border-l border-outline-variant pl-4 first:border-l-0 first:pl-0">
              <dt class="truncate text-xs text-on-surface-variant">{stat.label}</dt>
              <dd class="mt-0.5 text-xl font-semibold tabular-nums tracking-tight text-on-surface {stat.tone}">
                {stat.value}{#if stat.suffix}<span class="text-sm font-normal text-on-surface-variant">{stat.suffix}</span>{/if}
              </dd>
            </div>
          {/each}
        </dl>
        <div class="px-5 pb-4 pt-3">
          <div class="chart" role="img" aria-label="{t.chartTitle} : {staff.leadership.map((x) => `${label(x)} ${x.avg30d} / ${x.avg7d}`).join(', ')}">
            <div class="chart__legend" aria-hidden="true">
              <span><i style="background: rgba(148, 155, 164, 0.45)"></i>{t.avg30}</span>
              <span><i style="background: rgba(99, 102, 241, 0.85)"></i>{t.avg7}</span>
            </div>
            <div class="chart__body" aria-hidden="true" style="--step: {100 / (ticks.length - 1)}%">
              {#each staff.leadership as metric (metric.staffUserId)}
                <span class="chart__label">{label(metric)}</span>
                <span class="chart__bars">
                  <span class="chart__bar" style="width: {(metric.avg30d / chartMax) * 100}%; background: rgba(148, 155, 164, 0.45)"></span>
                  <span class="chart__bar" style="width: {(metric.avg7d / chartMax) * 100}%; background: rgba(99, 102, 241, 0.85)"></span>
                </span>
              {/each}
              <span></span>
              <span class="chart__ticks">
                {#each ticks as tick (tick)}<span style="left: {(tick / chartMax) * 100}%">{tick}</span>{/each}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Classement -->
      <section class="section-card overflow-hidden" aria-labelledby="lead-table">
        <header class="flex flex-row items-center justify-between gap-3 border-b border-outline-variant px-5 py-3">
          <h3 id="lead-table" class="text-sm font-semibold text-on-surface">{t.tableTitle}</h3>
          <FilterPills
            label={t.sortLabel}
            value={sort}
            onchange={(v) => (sort = v)}
            options={[
              { value: 'alerts', label: t.sortAlerts },
              { value: 'score', label: t.sortScore },
              { value: 'activity', label: t.sortActivity },
            ]}
          />
        </header>
        <ul class="divide-y divide-outline-variant">
          {#each rows as { metric, member, trend } (metric.staffUserId)}
            <li>
              <button type="button" class="lead-row" onclick={() => openCase?.(metric.staffUserId, label(metric))} disabled={!openCase}>
                <span class="flex w-48 min-w-0 shrink-0 items-center gap-2.5">
                  <StaffAvatar url={member?.avatarUrl} name={label(metric)} userId={metric.staffUserId} size={24} />
                  <span class="flex min-w-0 items-baseline gap-2">
                    <span class="truncate text-sm font-medium text-on-surface">{label(metric)}</span>
                    {#if member}<GradeChip small name={member.grade} color={staff.gradeColor(member.grade)} />{/if}
                  </span>
                </span>
                <span class="flex min-w-0 flex-1 items-center gap-2">
                  <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                    <span class="block h-full rounded-full bg-primary" style="width: {Math.min(100, metric.progressionScore)}%"></span>
                  </span>
                  <span class="w-7 text-right text-sm tabular-nums text-on-surface">{metric.progressionScore}</span>
                </span>
                <span class="flex shrink-0 items-center justify-end gap-3 text-sm">
                  <span class="inline-flex items-center gap-1 tabular-nums text-on-surface-variant" title="{t.avg30} / {t.avg7}">{metric.avg30d}<Papicon icon="arrow-right" size={11} /><span class="text-on-surface">{metric.avg7d}</span></span>
                  {#if metric.hasInactivityAlert}
                    <span class="badge badge-warning"><Papicon icon="trending-down" size={12} />{trend !== null ? `${trend} %` : t.inactivity}</span>
                  {:else if trend !== null && trend > 10}
                    <span class="badge badge-success"><Papicon icon="trending-up" size={12} />+{trend} %</span>
                  {:else}
                    <span class="badge badge-neutral">{t.steady}</span>
                  {/if}
                </span>
              </button>
            </li>
          {/each}
        </ul>
      </section>
    </div>
  {/if}
</div>

<style>
  .lead-row {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1.25rem;
    text-align: left;
    transition: background-color 0.12s ease;
  }
  .lead-row:not(:disabled):hover {
    background: var(--surface-hover);
  }

  /* Le graphique en barres horizontales du dashboard (Chart.js, indexAxis: 'y'). */
  .chart {
    font-size: 0.6875rem;
    color: var(--on-surface-variant);
  }
  .chart__legend {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .chart__legend span {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }
  .chart__legend i {
    width: 2rem;
    height: 0.625rem;
    border-radius: 2px;
  }
  .chart__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
    row-gap: 0.25rem;
    align-items: center;
  }
  .chart__label {
    text-align: right;
  }
  .chart__bars {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 1px 0;
    border-left: 1px solid var(--outline-variant);
    background-image: linear-gradient(to right, var(--outline-variant) 1px, transparent 1px);
    background-size: var(--step) 100%;
  }
  .chart__bar {
    display: block;
    height: 7px;
    border-radius: 0 4px 4px 0;
  }
  .chart__ticks {
    position: relative;
    height: 1rem;
  }
  .chart__ticks span {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
  }
</style>

<!--
  Performance du support : des tuiles de chiffres clés qui pilotent la courbe
  du dessous (écart et mini-courbe dans chacune), la période d'avant en
  pointillés, puis les chiffres de la file.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketPerformance.svelte`
  (branche `recette`), allégée pour tenir dans le cadre :
  - `MetricTabs` et `Sparkline` sont recopiés ici (balisage et styles) ;
  - le graphique (Chart.js dans le dashboard, `TimeSeriesChart`) est redessiné
    en SVG : barres pour les volumes, ligne pour les délais et la note, période
    d'avant en pointillés, axe des dates ;
  - le tableau par membre du staff et les classements par type, étiquette et
    note ne sont pas repris : ils ne tiennent pas sous la courbe à 720 px.
  Les chiffres viennent des données de démo et suivent la période choisie.
-->
<script lang="ts">
  import { FilterPills, SectionCard, Papicon, type FilterOption } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { buildStats } from '$lib/dash/fixtures/tickets';

  const TEXT = {
    fr: {
      period7: '7 jours',
      period30: '30 jours',
      period90: '90 jours',
      created: 'Tickets ouverts',
      closed: 'Fermés',
      firstResponse: '1re réponse',
      resolution: 'Résolution',
      csat: 'Satisfaction',
      csatCount: (count: number) => `${count} avis`,
      p90: (time: string) => `90 % sous ${time}`,
      previous: "Période d'avant",
      sla: 'Objectifs tenus',
      slaHint: (first: string, resolution: string) => `réponse ${first} · résolution ${resolution}`,
      backlog: 'En cours',
      unassigned: 'Non attribués',
      waiting: 'À traiter',
      breached: 'Hors délai',
      unanswered: 'Restés sans réponse',
      unansweredHint: (count: number) => `Tickets de la période où le staff a dû être relancé (${count} relance(s)). Active la relance dans Paramètres › Inactivité.`,
      oldest: 'Plus ancien en cours',
      intro: 'Délais en médiane, avec le 90e centile pour repérer les tickets oubliés.',
      compare: "Comparer à la période d'avant",
      period: 'Période',
      performance: 'Performance',
      vsPrevious: "vs période d'avant",
      seconds: (count: string) => `${count} s`,
      minutes: (count: string) => `${count} min`,
      hours: (count: string) => `${count} h`,
      hoursMinutes: (hours: string, minutes: string) => `${hours} h ${minutes}`,
      deltaNew: 'nouveau',
    },
    en: {
      period7: '7 days',
      period30: '30 days',
      period90: '90 days',
      created: 'Tickets opened',
      closed: 'Closed',
      firstResponse: 'First reply',
      resolution: 'Resolution',
      csat: 'Satisfaction',
      csatCount: (count: number) => `${count} ratings`,
      p90: (time: string) => `90% under ${time}`,
      previous: 'Previous period',
      sla: 'Targets met',
      slaHint: (first: string, resolution: string) => `reply ${first} · resolution ${resolution}`,
      backlog: 'Open now',
      unassigned: 'Unassigned',
      waiting: 'Needs reply',
      breached: 'Overdue',
      unanswered: 'Left unanswered',
      unansweredHint: (count: number) => `Tickets in this period where staff had to be reminded (${count} reminder(s)). Turn reminders on in Settings › Inactivity.`,
      oldest: 'Oldest open',
      intro: 'Median times, with the 90th percentile to spot forgotten tickets.',
      compare: 'Compare with previous period',
      period: 'Period',
      performance: 'Performance',
      vsPrevious: 'vs previous period',
      seconds: (count: string) => `${count} s`,
      minutes: (count: string) => `${count} min`,
      hours: (count: string) => `${count} h`,
      hoursMinutes: (hours: string, minutes: string) => `${hours} h ${minutes}`,
      deltaNew: 'new',
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const dateLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-GB');

  type Period = '7' | '30' | '90';
  let period = $state<Period>('30');
  let compare = $state(true);
  const stats = $derived(buildStats(Number(period)));

  const periodOptions: FilterOption<Period>[] = $derived([
    { value: '7', label: t.period7 },
    { value: '30', label: t.period30 },
    { value: '90', label: t.period90 },
  ]);

  // ── Mise en forme (`analyticsFormat.ts`) ──────────────
  const fmtNumber = (n: number) => n.toLocaleString(dateLocale);
  const fmtPct = (value: number) => `${Number(value.toFixed(1)).toLocaleString(dateLocale, { maximumFractionDigits: 1 })} %`;
  function fmtDuration(seconds: number): string {
    const s = Math.max(0, Math.round(seconds));
    if (s < 60) return t.seconds(fmtNumber(s));
    if (s < 3600) return t.minutes(fmtNumber(Math.round(s / 60)));
    const h = Math.floor(s / 3600);
    const min = Math.round((s % 3600) / 60);
    return min > 0 ? t.hoursMinutes(fmtNumber(h), String(min).padStart(2, '0')) : t.hours(fmtNumber(h));
  }
  function fmtDelta(delta: number | null): string {
    if (delta === null) return t.deltaNew;
    const rounded = Number(delta.toFixed(1));
    if (rounded === 0) return '=';
    const sign = rounded > 0 ? '+' : '−';
    return `${sign}${Math.abs(rounded).toLocaleString(dateLocale, { maximumFractionDigits: 1 })} %`;
  }
  const shortDate = (key: string) => new Date(`${key}T12:00:00Z`).toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' });
  const relativeDelta = (value: number, previous: number) => (previous === 0 ? (value === 0 ? 0 : null) : ((value - previous) / previous) * 100);

  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)] ?? 0;
  };
  const p90 = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.9)] ?? 0;
  };
  const average = (values: number[]) => sum(values) / Math.max(1, values.length);

  /** Minutes en durée lisible, à l'échelle utile. */
  const duration = (minutes: number) => fmtDuration(minutes * 60);
  const rating = (value: number) => `${value.toLocaleString(dateLocale, { maximumFractionDigits: 1 })}/5`;

  // ── Tuiles qui pilotent la courbe ─────────────────────
  type MetricId = 'created' | 'closed' | 'firstResponse' | 'resolution' | 'satisfaction';
  let active = $state<MetricId>('created');
  const SERIES = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)'];

  type Tile = { id: string; label: string; value: string; delta?: number | null; invert?: boolean; spark?: number[]; color?: string; hint?: string };

  const tiles: Tile[] = $derived.by(() => {
    const c = stats.current;
    const p = stats.previous;
    return [
      { id: 'created', label: t.created, value: fmtNumber(sum(c.created)), color: SERIES[0], delta: relativeDelta(sum(c.created), sum(p.created)), spark: c.created },
      { id: 'closed', label: t.closed, value: fmtNumber(sum(c.closed)), color: SERIES[1], delta: relativeDelta(sum(c.closed), sum(p.closed)), spark: c.closed },
      {
        id: 'firstResponse', label: t.firstResponse, value: duration(median(c.firstResponse)), color: SERIES[2],
        hint: t.p90(duration(p90(c.firstResponse))),
        // Un délai qui monte est une mauvaise nouvelle.
        invert: true, delta: relativeDelta(median(c.firstResponse), median(p.firstResponse)), spark: c.firstResponse,
      },
      {
        id: 'resolution', label: t.resolution, value: duration(median(c.resolution)), color: SERIES[3],
        hint: t.p90(duration(p90(c.resolution))),
        invert: true, delta: relativeDelta(median(c.resolution), median(p.resolution)), spark: c.resolution,
      },
      {
        id: 'satisfaction', label: t.csat, value: rating(average(c.satisfaction)), color: SERIES[4],
        hint: t.csatCount(Math.round(stats.days * 2.9)),
        delta: relativeDelta(average(c.satisfaction), average(p.satisfaction)), spark: c.satisfaction,
      },
    ];
  });

  // ── Chiffres de la file, sans courbe ──────────────────
  const queueTiles: Tile[] = $derived([
    { id: 'sla', label: t.sla, value: fmtPct(91.4), hint: t.slaHint(fmtPct(91.4), fmtPct(86.2)) },
    { id: 'active', label: t.backlog, value: fmtNumber(4) },
    { id: 'unassigned', label: t.unassigned, value: fmtNumber(2) },
    { id: 'waiting', label: t.waiting, value: fmtNumber(3) },
    { id: 'breached', label: t.breached, value: fmtNumber(1) },
    { id: 'unanswered', label: t.unanswered, value: fmtNumber(Math.round(2 * stats.days / 30)), hint: t.unansweredHint(Math.round(3 * stats.days / 30)) },
    { id: 'oldest', label: t.oldest, value: duration(26 * 60) },
  ]);

  function tone(metric: Tile): 'up' | 'down' | 'flat' {
    const d = metric.delta;
    if (d === undefined || d === null || Math.abs(d) < 0.05) return 'flat';
    return d > 0 ? 'up' : 'down';
  }

  function good(metric: Tile): boolean | null {
    const direction = tone(metric);
    if (direction === 'flat') return null;
    return (direction === 'up') !== Boolean(metric.invert);
  }

  function onTileKeydown(event: KeyboardEvent, index: number) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const nextIndex = (index + delta + tiles.length) % tiles.length;
    active = tiles[nextIndex].id as MetricId;
    const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  }

  // ── Mini-courbe (`Sparkline.svelte`) ──────────────────
  function sparkPoints(values: number[], width = 64, height = 22) {
    const PAD = 1.5;
    const max = Math.max(...values);
    const min = Math.min(0, ...values);
    const spread = max - min || 1;
    const step = (width - PAD * 2) / (values.length - 1);
    return values.map((v, i) => [PAD + i * step, height - PAD - ((v - min) / spread) * (height - PAD * 2)] as const);
  }

  // ── Courbe principale ─────────────────────────────────
  const CHART_W = 1000;
  const CHART_H = 150;
  const chart = $derived.by(() => {
    const tile = tiles.find((x) => x.id === active)!;
    const current = stats.current[active];
    const previous = stats.previous[active];
    const isCount = active === 'created' || active === 'closed';
    const max = Math.max(1, ...current, ...(compare ? previous : [])) * 1.1;
    const n = current.length;
    const slot = CHART_W / n;
    const y = (v: number) => CHART_H - (v / max) * CHART_H;
    const x = (i: number) => slot * i + slot / 2;
    const line = (values: number[]) => values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const format = active === 'satisfaction' ? rating : isCount ? fmtNumber : duration;
    const every = Math.max(1, Math.ceil(n / 7));
    return {
      color: tile.color ?? SERIES[0],
      label: tile.label,
      isCount,
      bars: current.map((v, i) => ({ x: slot * i + slot * 0.18, w: slot * 0.64, y: y(v), h: CHART_H - y(v) })),
      main: line(current),
      previous: compare ? line(previous) : null,
      grid: [0.25, 0.5, 0.75, 1].map((f) => ({ y: CHART_H - f * (CHART_H / 1.1), label: format(Math.round((max / 1.1) * f * 10) / 10) })),
      ticks: stats.dates.map((d, i) => ({ i, label: shortDate(d) })).filter((tick) => tick.i % every === 0),
      slot,
    };
  });
</script>

{#snippet tileContent(metric: Tile, selected: boolean, verdict: boolean | null)}
  <span class="metric-tab__label">{metric.label}</span>
  <span class="metric-tab__row">
    <span class="metric-tab__value">{metric.value}</span>
    {#if metric.spark && metric.spark.length > 1}
      {@const pts = sparkPoints(metric.spark)}
      {@const color = selected ? 'var(--metric-color)' : 'var(--series-neutral)'}
      <svg class="sparkline" viewBox="0 0 64 22" width="64" height="22" aria-hidden="true" focusable="false">
        <path d="M{pts[0][0]},22 L{pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' L')} L{pts[pts.length - 1][0]},22 Z" style="fill: {color}; opacity: 0.12;" />
        <polyline points={pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(' ')} style="stroke: {color};" fill="none" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
      </svg>
    {/if}
  </span>
  {#if compare && metric.delta !== undefined}
    <span class="metric-tab__delta {verdict === true ? 'text-success' : verdict === false ? 'text-error' : 'text-on-surface-variant'}">
      {#if tone(metric) !== 'flat'}
        <Papicon icon={tone(metric) === 'up' ? 'trending-up' : 'trending-down'} size={12} />
      {/if}
      {fmtDelta(metric.delta ?? null)}
      <span class="text-on-surface-variant font-normal">{t.vsPrevious}</span>
    </span>
  {/if}
{/snippet}

<div class="flex flex-col gap-4">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <p class="text-body-sm text-on-surface-variant">{t.intro}</p>
    <div class="flex flex-wrap items-center gap-3">
      <label class="flex items-center gap-2 text-body-sm text-on-surface-variant">
        <input type="checkbox" bind:checked={compare} />
        {t.compare}
      </label>
      <FilterPills label={t.period} options={periodOptions} value={period} onchange={(value) => (period = value)} />
    </div>
  </div>

  <div class="flex flex-col gap-4">
    <SectionCard>
      <div class="flex flex-col gap-4">
        <div class="metric-tabs" role="tablist" aria-label={t.performance}>
          {#each tiles as metric, index (metric.id)}
            {@const selected = metric.id === active}
            <button
              type="button"
              role="tab"
              class="metric-tab"
              aria-selected={selected}
              tabindex={selected ? 0 : -1}
              title={metric.hint || undefined}
              style="--metric-color: {metric.color ?? 'var(--series-1)'};"
              onclick={() => (active = metric.id as MetricId)}
              onkeydown={(e) => onTileKeydown(e, index)}
            >
              {@render tileContent(metric, selected, good(metric))}
            </button>
          {/each}
        </div>

        <figure class="ts-chart" aria-label={chart.label}>
          <div class="ts-chart__plot">
            <div class="ts-chart__axis" aria-hidden="true">
              {#each chart.grid as line (line.y)}
                <span style="top: {(line.y / CHART_H) * 100}%">{line.label}</span>
              {/each}
            </div>
            <svg viewBox="0 0 {CHART_W} {CHART_H}" preserveAspectRatio="none" class="ts-chart__svg" aria-hidden="true">
              {#each chart.grid as line (line.y)}
                <line x1="0" x2={CHART_W} y1={line.y} y2={line.y} class="ts-chart__grid" vector-effect="non-scaling-stroke" />
              {/each}
              {#if chart.isCount}
                {#each chart.bars as bar, i (i)}
                  <rect x={bar.x} y={bar.y} width={bar.w} height={bar.h} rx="2" style="fill: {chart.color};" />
                {/each}
              {:else}
                <polyline points={chart.main} fill="none" style="stroke: {chart.color};" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
              {/if}
              {#if chart.previous}
                <polyline points={chart.previous} fill="none" class="ts-chart__previous" stroke-width="1.5" stroke-dasharray="4 4" vector-effect="non-scaling-stroke" />
              {/if}
            </svg>
          </div>
          <div class="ts-chart__ticks" aria-hidden="true">
            {#each chart.ticks as tick (tick.i)}
              <span style="left: {((tick.i + 0.5) / stats.dates.length) * 100}%">{tick.label}</span>
            {/each}
          </div>
          <figcaption class="ts-chart__legend">
            <span><i style="background: {chart.color};"></i>{chart.label}</span>
            {#if compare}<span><i class="ts-chart__legend-previous"></i>{t.previous}</span>{/if}
          </figcaption>
        </figure>
      </div>
    </SectionCard>

    <ul class="metric-tabs" aria-label={t.backlog}>
      {#each queueTiles as metric (metric.id)}
        <li class="metric-tab metric-tab--static" title={metric.hint || undefined}>
          {@render tileContent(metric, true, good(metric))}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .metric-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
    border: 1px solid var(--color-outline-variant);
    border-radius: 0.75rem;
    background: var(--color-surface-container-low);
    overflow: hidden;
  }
  .metric-tab {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    padding: 0.875rem 1rem 0.875rem;
    text-align: left;
    border-right: 1px solid var(--color-outline-variant);
    border-bottom: 1px solid var(--color-outline-variant);
    margin: 0 -1px -1px 0;
    transition: background-color 120ms ease;
  }
  .metric-tab::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: transparent;
  }
  .metric-tab:hover {
    background: var(--color-surface-container);
  }
  .metric-tab[aria-selected='true'] {
    background: var(--color-surface-container);
  }
  .metric-tab[aria-selected='true']::before {
    background: var(--metric-color);
  }
  .metric-tab--static,
  .metric-tab--static:hover {
    background: transparent;
  }
  .metric-tab:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
  .metric-tab__label {
    font-size: 0.8125rem;
    color: var(--color-on-surface-variant);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .metric-tab__row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
    min-width: 0;
  }
  .metric-tab__value {
    font-family: var(--font-headline);
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.15;
    color: var(--color-on-surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .metric-tab__delta {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .sparkline {
    display: block;
    flex-shrink: 0;
  }

  /* Courbe : axe des valeurs à gauche, dates dessous, légende. */
  .ts-chart {
    margin: 0;
  }
  .ts-chart__plot {
    position: relative;
    height: 150px;
    margin-left: 3.5rem;
  }
  .ts-chart__svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .ts-chart__grid {
    stroke: var(--color-outline-variant);
    stroke-width: 1;
  }
  .ts-chart__previous {
    stroke: var(--series-neutral);
  }
  .ts-chart__axis span {
    position: absolute;
    right: calc(100% + 0.5rem);
    transform: translateY(-50%);
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .ts-chart__ticks {
    position: relative;
    height: 1.25rem;
    margin: 0.35rem 0 0 3.5rem;
  }
  .ts-chart__ticks span {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.6875rem;
    color: var(--color-on-surface-variant);
    white-space: nowrap;
  }
  .ts-chart__legend {
    display: flex;
    gap: 1rem;
    margin: 0.25rem 0 0 3.5rem;
    font-size: 0.75rem;
    color: var(--color-on-surface-variant);
  }
  .ts-chart__legend span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .ts-chart__legend i {
    display: inline-block;
    width: 0.75rem;
    height: 0.2rem;
    border-radius: 999px;
  }
  .ts-chart__legend-previous {
    background: repeating-linear-gradient(90deg, var(--series-neutral) 0 3px, transparent 3px 6px);
  }
</style>

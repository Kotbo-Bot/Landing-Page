<!--
  Recopie de `analytics/MetricTabs.svelte` et `analytics/Sparkline.svelte`
  (dashboard, branche `recette`) : les tuiles de chiffres qui pilotent la
  courbe du dessous. La mini-courbe est posée ici plutôt qu'en composant à part.
-->
<script lang="ts" module>
  export interface MetricTab {
    id: string;
    label: string;
    value: string;
    delta?: number | null;
    invert?: boolean;
    spark?: number[];
    color?: string;
  }
</script>

<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { fmtDelta } from './format';

  const TEXT = {
    fr: { vsPrevious: "vs période d'avant" },
    en: { vsPrevious: 'vs previous period' },
  };

  const {
    metrics,
    active,
    onchange,
    compare = false,
    label,
  }: {
    metrics: MetricTab[];
    active: string;
    onchange: (id: string) => void;
    compare?: boolean;
    label: string;
  } = $props();

  const t = $derived(TEXT[getLocale()]);

  function tone(metric: MetricTab): 'up' | 'down' | 'flat' {
    const d = metric.delta;
    if (d === undefined || d === null || Math.abs(d) < 0.05) return 'flat';
    return d > 0 ? 'up' : 'down';
  }

  function good(metric: MetricTab): boolean | null {
    const tn = tone(metric);
    if (tn === 'flat') return null;
    return (tn === 'up') !== Boolean(metric.invert);
  }

  function onKeydown(event: KeyboardEvent, index: number) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = metrics[(index + delta + metrics.length) % metrics.length];
    if (!next) return;
    onchange(next.id);
    const buttons = (event.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[(index + delta + metrics.length) % metrics.length]?.focus();
  }

  const W = 64;
  const H = 22;
  const PAD = 1.5;

  function sparkPoints(values: number[]): Array<readonly [number, number]> {
    if (values.length < 2) return [];
    const max = Math.max(...values);
    const min = Math.min(0, ...values);
    const span = max - min || 1;
    const step = (W - PAD * 2) / (values.length - 1);
    return values.map((v, i) => [PAD + i * step, H - PAD - ((v - min) / span) * (H - PAD * 2)] as const);
  }
</script>

<div class="metric-tabs" role="tablist" aria-label={label}>
  {#each metrics as metric, index (metric.id)}
    {@const selected = metric.id === active}
    {@const verdict = good(metric)}
    {@const points = sparkPoints(metric.spark ?? [])}
    {@const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
    {@const color = selected ? 'var(--metric-color)' : 'var(--series-neutral)'}
    <button
      type="button"
      role="tab"
      class="metric-tab"
      aria-selected={selected}
      tabindex={selected ? 0 : -1}
      style="--metric-color: {metric.color ?? 'var(--series-1)'};"
      onclick={() => onchange(metric.id)}
      onkeydown={(e) => onKeydown(e, index)}
    >
      <span class="metric-tab__label">{metric.label}</span>
      <span class="metric-tab__row">
        <span class="metric-tab__value">{metric.value}</span>
        {#if points.length > 0}
          <svg class="sparkline" viewBox="0 0 {W} {H}" width={W} height={H} aria-hidden="true" focusable="false">
            <path d="M{points[0]![0].toFixed(1)},{H} L{line.replaceAll(' ', ' L')} L{points[points.length - 1]![0].toFixed(1)},{H} Z" style="fill: {color}; opacity: 0.12;" />
            <polyline points={line} style="stroke: {color};" fill="none" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
          </svg>
        {/if}
      </span>
      {#if compare && metric.delta !== undefined}
        <span class="metric-tab__delta {verdict === true ? 'text-success' : verdict === false ? 'text-error' : 'text-on-surface-variant'}">
          {#if tone(metric) !== 'flat'}
            <Papicon icon={tone(metric) === 'up' ? 'trending-up' : 'trending-down'} size={12} />
          {/if}
          {fmtDelta(metric.delta ?? null, 'pct')}
          <span class="text-on-surface-variant font-normal">{t.vsPrevious}</span>
        </span>
      {/if}
    </button>
  {/each}
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
  .metric-tab:hover,
  .metric-tab[aria-selected='true'] {
    background: var(--color-surface-container);
  }
  .metric-tab[aria-selected='true']::before {
    background: var(--metric-color);
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
    overflow: visible;
  }
</style>

<!--
  Courbe du dossier membre, à la place de `analytics/TimeSeriesChart.svelte`
  (dashboard, branche `recette`). Le dashboard la dessine avec Chart.js ; le
  site n'embarque pas cette bibliothèque pour une seule courbe : même rendu en
  SVG (aire et trait de la mesure, période d'avant en pointillés neutres,
  grille horizontale, légende en bas, infobulle du jour au survol).
-->
<script lang="ts">
  const {
    labels,
    main,
    previous = null,
    format = (v: number) => String(v),
    height = 200,
  }: {
    labels: string[];
    main: { label: string; values: number[]; color: string };
    previous?: { label: string; values: number[] } | null;
    format?: (value: number) => string;
    height?: number;
  } = $props();

  let width = $state(600);
  let hover = $state<number | null>(null);

  const LEFT = 44;
  const RIGHT = 8;
  const TOP = 8;
  const BOTTOM = 22;
  const LEGEND = $derived(previous ? 24 : 0);

  const plotH = $derived(height - TOP - BOTTOM - LEGEND);
  const plotW = $derived(Math.max(10, width - LEFT - RIGHT));

  /** Échelle « ronde » à 5 graduations au plus, comme Chart.js. */
  const ticks = $derived.by(() => {
    const max = Math.max(1, ...main.values, ...(previous?.values ?? []));
    const raw = max / 4;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((s) => s >= raw) ?? raw;
    const top = Math.ceil(max / step) * step;
    return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  });
  const yMax = $derived(ticks[ticks.length - 1] || 1);

  const x = (i: number) => LEFT + (labels.length > 1 ? (i / (labels.length - 1)) * plotW : 0);
  const y = (v: number) => TOP + plotH - (v / yMax) * plotH;

  /** Trait lissé (tension 0.25) : courbes de Bézier entre points voisins. */
  function path(values: number[]): string {
    const pts = values.map((v, i) => [x(i), y(v)] as const);
    if (pts.length === 0) return '';
    let d = `M${pts[0]![0]},${pts[0]![1]}`;
    for (let i = 1; i < pts.length; i += 1) {
      const p0 = pts[i - 2] ?? pts[i - 1]!;
      const p1 = pts[i - 1]!;
      const p2 = pts[i]!;
      const p3 = pts[i + 1] ?? p2;
      const k = 0.25 / 1.5;
      const c1x = p1[0] + (p2[0] - p0[0]) * k;
      const c1y = Math.min(TOP + plotH, p1[1] + (p2[1] - p0[1]) * k);
      const c2x = p2[0] - (p3[0] - p1[0]) * k;
      const c2y = Math.min(TOP + plotH, p2[1] - (p3[1] - p1[1]) * k);
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  const mainPath = $derived(path(main.values));
  const areaPath = $derived(`${mainPath} L${x(main.values.length - 1)},${TOP + plotH} L${x(0)},${TOP + plotH} Z`);
  const prevPath = $derived(previous ? path(previous.values) : '');

  /** Au plus 8 dates sous l'axe, moins si la place manque (l'`autoSkip` de Chart.js). */
  const xTicks = $derived.by(() => {
    const n = labels.length;
    const fit = Math.max(2, Math.min(8, Math.floor(plotW / 64)));
    const every = Math.max(1, Math.ceil(n / fit));
    return labels.map((label, i) => ({ label, i })).filter(({ i }) => i % every === 0);
  });

  function onmove(event: PointerEvent) {
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const scale = rect.width / width || 1;
    const px = (event.clientX - rect.left) / scale;
    const i = Math.round(((px - LEFT) / plotW) * (labels.length - 1));
    hover = i >= 0 && i < labels.length ? i : null;
  }
</script>

<div class="relative" bind:clientWidth={width} style="height: {height}px">
  <svg {width} height={height - LEGEND} role="img" aria-label={main.label} onpointermove={onmove} onpointerleave={() => (hover = null)}>
    {#each ticks as tick (tick)}
      <line x1={LEFT} x2={LEFT + plotW} y1={y(tick)} y2={y(tick)} stroke="var(--color-outline-variant)" />
      <text x={LEFT - 8} y={y(tick)} dy="0.32em" text-anchor="end" class="tick">{format(tick)}</text>
    {/each}
    <line x1={LEFT} x2={LEFT + plotW} y1={TOP + plotH} y2={TOP + plotH} stroke="var(--color-outline-variant)" />
    {#each xTicks as tick (tick.i)}
      <text x={x(tick.i)} y={TOP + plotH + 15} text-anchor="middle" class="tick">{tick.label}</text>
    {/each}

    <path d={areaPath} style="fill: {main.color}; fill-opacity: 0.1;" />
    {#if previous}
      <path d={prevPath} fill="none" stroke="var(--series-neutral)" stroke-width="1.5" stroke-dasharray="5 4" />
    {/if}
    <path d={mainPath} fill="none" style="stroke: {main.color};" stroke-width="2" />

    {#if hover !== null}
      <line x1={x(hover)} x2={x(hover)} y1={TOP} y2={TOP + plotH} stroke="var(--color-outline)" stroke-opacity="0.5" />
      <circle cx={x(hover)} cy={y(main.values[hover] ?? 0)} r="4" style="fill: {main.color};" />
    {/if}

  </svg>
  {#if previous}
    <div class="legend" style="height: {LEGEND}px">
      <span><i style="background: {main.color};"></i>{main.label}</span>
      <span><i style="background: var(--series-neutral);"></i>{previous.label}</span>
    </div>
  {/if}

  {#if hover !== null}
    <div class="tooltip" style="left: {Math.min(x(hover) + 10, width - 170)}px; top: {TOP}px">
      <p class="font-semibold">{labels[hover]}</p>
      <p>{main.label} : {format(main.values[hover] ?? 0)}</p>
      {#if previous}<p class="opacity-80">{previous.label} : {format(previous.values[hover] ?? 0)}</p>{/if}
    </div>
  {/if}
</div>

<style>
  svg {
    display: block;
    overflow: visible;
  }
  .tick {
    font-size: 11px;
    fill: var(--color-on-surface-variant);
  }
  .legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 11px;
    color: var(--color-on-surface-variant);
  }
  .legend i {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 0.375rem;
    vertical-align: -1px;
  }
  .tooltip {
    position: absolute;
    pointer-events: none;
    min-width: 9rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.375rem;
    background: rgba(0, 0, 0, 0.82);
    color: #fff;
    font-size: 0.75rem;
    line-height: 1.35;
  }
</style>

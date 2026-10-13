<!--
  Réseau d'interactions du dossier membre, d'après `charts/InteractionTree.svelte`
  (dashboard, branche `recette`), thème sombre. Simplifié : les contacts sont
  posés en cercle autour du membre au lieu de passer par la simulation de
  forces, et la molette ne zoome pas (sur le site, elle fait défiler la page).
  Restent le glisser pour déplacer, les boutons recentrer et zoom, le survol
  qui isole les liens, la fiche du contact et l'ouverture de son dossier.
-->
<script lang="ts">
  import Papicon from '$lib/dash/Papicon.svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { MemberCaseInteractionEdge, MemberCaseInteractionNode } from '$lib/dash/types';

  const TEXT = {
    fr: {
      title: "Réseau d'interactions",
      summary: (members: number, connections: number) => `${members} membres · ${connections} connexions`,
      recenter: 'Recentrer',
      zoomIn: 'Zoom +',
      zoomOut: 'Zoom -',
      mentions: 'Mentions',
      replies: 'Réponses',
      reactions: 'Réactions',
      mainUser: 'Utilisateur principal',
      connectionsCount: (n: number) => `${n} connexion(s)`,
      total: 'Total des interactions',
      close: 'Fermer',
      empty: 'Aucune interaction détectée',
    },
    en: {
      title: 'Interaction Network',
      summary: (members: number, connections: number) => `${members} members · ${connections} connections`,
      recenter: 'Recenter',
      zoomIn: 'Zoom +',
      zoomOut: 'Zoom -',
      mentions: 'Mentions',
      replies: 'Replies',
      reactions: 'Reactions',
      mainUser: 'Main user',
      connectionsCount: (n: number) => `${n} connection(s)`,
      total: 'Total interactions',
      close: 'Close',
      empty: 'No interaction detected',
    },
  };

  const {
    nodes = [],
    edges = [],
    onSelectNode = (_id: string) => {},
  }: {
    nodes: MemberCaseInteractionNode[];
    edges: MemberCaseInteractionEdge[];
    onSelectNode?: (id: string) => void;
  } = $props();

  const t = $derived(TEXT[getLocale()]);

  let width = $state(600);
  let height = $state(320);
  let panX = $state(0);
  let panY = $state(0);
  let zoom = $state(1);
  let dragging = $state(false);
  let start = { x: 0, y: 0 };
  let hoveredId = $state<string | null>(null);
  let selectedId = $state<string | null>(null);

  const center = $derived(nodes.find((n) => n.type === 'user') ?? nodes[0]);

  const weights = $derived(
    new Map(nodes.map((n) => [n.id, edges.filter((e) => e.from === n.id || e.to === n.id).reduce((s, e) => s + e.count, 0)])),
  );

  /** Le membre au centre, ses contacts en cercle, les plus proches en haut. */
  const placed = $derived.by(() => {
    const others = nodes.filter((n) => n.id !== center?.id).sort((a, b) => (weights.get(b.id) ?? 0) - (weights.get(a.id) ?? 0));
    const max = Math.max(1, ...others.map((n) => weights.get(n.id) ?? 0));
    const rx = width * 0.3;
    const ry = height * 0.3;
    const cx = width / 2;
    const cy = height / 2 + 12;
    return [
      ...(center ? [{ ...center, x: cx, y: cy, radius: 28, isCenter: true }] : []),
      ...others.map((n, i) => {
        // Départ en haut à droite : le titre occupe le coin haut gauche.
        const angle = -Math.PI / 3 + (i / others.length) * Math.PI * 2;
        const w = (weights.get(n.id) ?? 0) / max;
        return { ...n, x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry, radius: Math.max(12, 10 + w * 18), isCenter: false };
      }),
    ];
  });

  /** Une ligne par paire, colorée par le type d'échange dominant. */
  const links = $derived.by(() => {
    const pairs = new Map<string, { from: string; to: string; mention: number; reply: number; reaction: number }>();
    for (const e of edges) {
      const key = [e.from, e.to].sort().join('|');
      const entry = pairs.get(key) ?? { from: e.from, to: e.to, mention: 0, reply: 0, reaction: 0 };
      entry[e.type] += e.count;
      pairs.set(key, entry);
    }
    const list = [...pairs.values()];
    const maxTotal = Math.max(1, ...list.map((l) => l.mention + l.reply + l.reaction));
    return list.flatMap((l) => {
      const a = placed.find((n) => n.id === l.from);
      const b = placed.find((n) => n.id === l.to);
      if (!a || !b) return [];
      const total = l.mention + l.reply + l.reaction;
      const strongest = l.reply >= l.mention && l.reply >= l.reaction ? 'reply' : l.reaction > l.mention ? 'reaction' : 'mention';
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const sx = a.x + ux * a.radius;
      const sy = a.y + uy * a.radius;
      const tx = b.x - ux * b.radius;
      const ty = b.y - uy * b.radius;
      const bend = Math.min(dist * 0.15, 30);
      const cpx = (sx + tx) / 2 + -uy * bend;
      const cpy = (sy + ty) / 2 + ux * bend;
      const dimmed = hoveredId ? l.from !== hoveredId && l.to !== hoveredId : false;
      const color = strongest === 'reply' ? '#a78bfa' : strongest === 'reaction' ? '#34d399' : '#3b82f6';
      return [{ ...l, d: `M ${sx} ${sy} Q ${cpx} ${cpy} ${tx} ${ty}`, dimmed, color, strength: total / maxTotal }];
    });
  });

  const selected = $derived(placed.find((n) => n.id === selectedId) ?? null);
  const selectedStats = $derived.by(() => {
    if (!selectedId) return null;
    let mentions = 0;
    let replies = 0;
    let reactions = 0;
    const peers = new Set<string>();
    for (const e of edges) {
      if (e.from !== selectedId && e.to !== selectedId) continue;
      if (e.type === 'mention') mentions += e.count;
      if (e.type === 'reply') replies += e.count;
      if (e.type === 'reaction') reactions += e.count;
      peers.add(e.from === selectedId ? e.to : e.from);
    }
    return { mentions, replies, reactions, total: mentions + replies + reactions, connections: peers.size };
  });

  function choose(node: (typeof placed)[number]) {
    selectedId = selectedId === node.id ? null : node.id;
    if (!node.isCenter) onSelectNode(node.id);
  }

  function reset() {
    panX = 0;
    panY = 0;
    zoom = 1;
    selectedId = null;
    hoveredId = null;
  }
</script>

<svelte:window onpointermove={(e) => { if (dragging) { panX = e.clientX - start.x; panY = e.clientY - start.y; } }} onpointerup={() => (dragging = false)} />

<div class="graph relative h-full w-full select-none overflow-hidden rounded-xl" bind:clientWidth={width} bind:clientHeight={height}>
  {#if nodes.length === 0}
    <div class="graph-empty absolute inset-0 flex flex-col items-center justify-center">
      <Papicon icon="share-2" size={48} />
      <p class="mt-4 text-body-sm font-medium">{t.empty}</p>
    </div>
  {:else}
    <div class="pointer-events-none absolute left-5 top-4 z-10 flex flex-col">
      <div class="flex items-center gap-2">
        <span class="graph-icon"><Papicon icon="share-2" size={18} /></span>
        <h4 class="graph-title text-sm font-semibold tracking-wide">{t.title}</h4>
      </div>
      <span class="graph-subtitle mt-0.5 text-2xs">{t.summary(nodes.length, links.length)}</span>
    </div>

    <div class="absolute right-5 top-4 z-20 flex items-center gap-1.5">
      <button type="button" class="graph-btn" title={t.recenter} aria-label={t.recenter} onclick={reset}><Papicon icon="rotate-ccw" size={14} /></button>
      <button type="button" class="graph-btn" title={t.zoomIn} aria-label={t.zoomIn} onclick={() => (zoom = Math.min(zoom * 1.25, 3))}><Papicon icon="zoom-in" size={14} /></button>
      <button type="button" class="graph-btn" title={t.zoomOut} aria-label={t.zoomOut} onclick={() => (zoom = Math.max(zoom / 1.25, 0.3))}><Papicon icon="zoom-out" size={14} /></button>
    </div>

    <div class="pointer-events-none absolute bottom-4 right-5 z-10 flex items-center gap-3">
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full" style="background:#3b82f6"></span><span class="graph-legend text-xs font-semibold">{t.mentions}</span></span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full" style="background:#a78bfa"></span><span class="graph-legend text-xs font-semibold">{t.replies}</span></span>
      <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full" style="background:#34d399"></span><span class="graph-legend text-xs font-semibold">{t.reactions}</span></span>
    </div>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg
      class="h-full w-full {dragging ? 'cursor-grabbing' : 'cursor-grab'}"
      onpointerdown={(e) => { if (e.button === 0) { dragging = true; start = { x: e.clientX - panX, y: e.clientY - panY }; } }}
    >
      <g transform="translate({panX}, {panY}) translate({width / 2}, {height / 2}) scale({zoom}) translate({-width / 2}, {-height / 2})">
        {#each links as link (link.from + link.to)}
          <path
            d={link.d}
            fill="none"
            stroke={link.color}
            stroke-width={Math.max(1.5, 1.5 + link.strength * 3.5)}
            stroke-opacity={link.dimmed ? 0.04 : hoveredId ? 0.8 : 0.2 + link.strength * 0.3}
            stroke-linecap="round"
          />
        {/each}
        {#each placed as node (node.id)}
          {@const active = hoveredId === node.id || selectedId === node.id}
          <!-- svelte-ignore a11y_mouse_events_have_key_events -->
          <g
            transform="translate({node.x}, {node.y})"
            class="node cursor-pointer"
            opacity={hoveredId && !active && !links.some((l) => (l.from === hoveredId || l.to === hoveredId) && (l.from === node.id || l.to === node.id)) ? 0.15 : 1}
            role="button"
            tabindex="0"
            aria-label={node.label}
            onpointerdown={(e) => e.stopPropagation()}
            onmouseover={() => (hoveredId = node.id)}
            onmouseout={() => (hoveredId = null)}
            onfocus={() => (hoveredId = node.id)}
            onblur={() => (hoveredId = null)}
            onclick={() => choose(node)}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(node); } }}
          >
            {#if active}
              <circle r={node.radius + 6} fill="none" class="ring {selectedId === node.id ? 'ring--selected' : ''}" stroke-width="2" />
            {/if}
            <circle r={node.radius} class="node-base {node.isCenter ? 'node-center' : ''}" stroke-width={node.isCenter ? 2.5 : 1.5} />
            <clipPath id="it-clip-{node.id}"><circle r={node.radius - 1.5} /></clipPath>
            {#if node.avatar}
              <image href={node.avatar} x={-node.radius} y={-node.radius} width={node.radius * 2} height={node.radius * 2} clip-path="url(#it-clip-{node.id})" preserveAspectRatio="xMidYMid slice" />
            {/if}
            {#if active || node.isCenter}
              {@const half = Math.max(40, node.label.length * 3.5) + 8}
              <g transform="translate(0, {node.radius + 14})">
                <rect x={-half} y="-9" width={half * 2} height="18" rx="9" class="label-bg" />
                <text text-anchor="middle" dy="0.35em" class="label-text" font-size="9" font-weight="600">{node.label}</text>
              </g>
            {/if}
          </g>
        {/each}
      </g>
    </svg>

    {#if selected && selectedStats}
      <div class="panel absolute bottom-4 left-4 z-20 w-72">
        <div class="flex items-center gap-2.5">
          {#if selected.avatar}<img src={selected.avatar} alt="" class="h-9 w-9 rounded-full" />{/if}
          <div class="flex min-w-0 flex-col">
            <span class="panel-name truncate text-xs font-semibold">{selected.label}</span>
            <span class="panel-role text-2xs">{selected.isCenter ? t.mainUser : t.connectionsCount(selectedStats.connections)}</span>
          </div>
          <button type="button" class="panel-close ml-auto rounded-md p-1" aria-label={t.close} onclick={() => (selectedId = null)}><Papicon icon="x" size={14} /></button>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-1.5 text-center">
          {#each [[t.mentions, selectedStats.mentions], [t.replies, selectedStats.replies], [t.reactions, selectedStats.reactions]] as [label, value] (label)}
            <div class="stat"><span class="stat-label text-2xs font-medium">{label}</span><span class="stat-value text-sm font-bold">{value}</span></div>
          {/each}
        </div>
        <div class="total mt-2.5 flex items-center justify-between pt-2 text-2xs">
          <span class="stat-label font-medium">{t.total}</span>
          <span class="total-value font-bold">{selectedStats.total}</span>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .graph {
    background: rgba(15, 17, 24, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .graph-empty { color: rgba(255, 255, 255, 0.15); }
  .graph-icon { color: #3b82f6; }
  .graph-title {
    background: linear-gradient(90deg, #3b82f6, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .graph-subtitle { color: rgba(255, 255, 255, 0.45); }
  .graph-legend { color: rgba(255, 255, 255, 0.5); }
  .graph-btn {
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(30, 41, 59, 0.6);
    color: rgba(255, 255, 255, 0.6);
  }
  .graph-btn:hover { background: rgba(51, 65, 85, 0.8); color: rgba(255, 255, 255, 0.85); }
  .graph-btn:focus-visible, .node:focus-visible, .panel-close:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
  .node:focus { outline: none; }
  .node-base { fill: #1a1f2e; stroke: #334155; }
  .node-center { stroke: #3b82f6; }
  .ring { stroke: #60a5fa; }
  .ring--selected { stroke: #a78bfa; }
  .label-bg { fill: rgba(11, 15, 25, 0.92); stroke: rgba(255, 255, 255, 0.08); }
  .label-text { fill: #f1f5f9; }
  .panel {
    padding: 0.875rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(15, 23, 42, 0.95);
    box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.5);
  }
  .panel-name { color: #f1f5f9; }
  .panel-role { color: #a78bfa; }
  .panel-close { color: rgba(255, 255, 255, 0.5); }
  .panel-close:hover { background: rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.8); }
  .stat {
    display: flex;
    flex-direction: column;
    padding: 0.375rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.03);
  }
  .stat-label { color: rgba(255, 255, 255, 0.5); }
  .stat-value { color: #f1f5f9; }
  .total { border-top: 1px solid rgba(255, 255, 255, 0.06); }
  .total-value { color: #a78bfa; }
</style>

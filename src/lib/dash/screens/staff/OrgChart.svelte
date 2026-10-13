<!--
  Organigramme du staff. Recopie de `lib/components/OrgChart.svelte`
  (dashboard). Dans le dashboard il défile en largeur ; ici l'arbre entier est
  réduit pour tenir dans le cadre de l'aperçu (vue d'ensemble), sans défilement.
-->
<script lang="ts">
  import { getLocale } from '$lib/i18n/state.svelte';
  import { Papicon } from '$lib/dash/ui';
  import HierarchyNode, { type HierarchyTreeNode } from './HierarchyNode.svelte';

  const TEXT = {
    fr: { emptyTitle: 'Aucune hiérarchie à afficher', emptyDesc: "Crée des hiérarchies et place-y des rôles pour voir l'organigramme.", chief: 'Resp staff global', unknown: 'Nom inconnu' },
    en: { emptyTitle: 'No hierarchy to display', emptyDesc: 'Create hierarchies and add roles to see the org chart.', chief: 'Global Staff Head', unknown: 'Unknown Name' },
  };

  type HierarchySchema = {
    chiefStaff: { userId?: string | null; roleId?: string | null; name?: string | null } | null;
    hierarchies: Array<Omit<HierarchyTreeNode, 'children'> & { sortOrder?: number | null }>;
  };

  const { schema, height = 410 }: { schema: HierarchySchema; height?: number } = $props();

  const t = $derived(TEXT[getLocale()]);

  type Node = HierarchyTreeNode & { sortOrder?: number | null };

  function buildHierarchyTree(): Node[] {
    const nodeMap = new Map<string, Node>();
    for (const hierarchy of schema?.hierarchies ?? []) nodeMap.set(hierarchy.id, { ...hierarchy, children: [] });
    const roots: Node[] = [];
    for (const node of nodeMap.values()) {
      const parentNode = node.parentHierarchyId ? nodeMap.get(node.parentHierarchyId) : null;
      if (parentNode) parentNode.children.push(node);
      else roots.push(node);
    }
    const sortNodes = (nodes: Node[]): Node[] => {
      nodes.sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.name.localeCompare(right.name));
      nodes.forEach((node) => (node.children = sortNodes(node.children as Node[])));
      return nodes;
    };
    return sortNodes(roots);
  }

  const hierarchyTree = $derived(buildHierarchyTree());

  // ── Mise à l'échelle : l'arbre mesuré à sa taille réelle, réduit pour tenir dans le cadre. ──
  let frame = $state<HTMLDivElement | null>(null);
  let canvas = $state<HTMLDivElement | null>(null);
  let scale = $state(1);
  let natural = $state({ width: 0, height: 0 });

  $effect(() => {
    if (!frame || !canvas) return;
    const measure = () => {
      if (!frame || !canvas) return;
      const w = canvas.scrollWidth;
      const h = canvas.scrollHeight;
      natural = { width: w, height: h };
      scale = Math.min(1, (frame.clientWidth - 32) / w, (frame.clientHeight - 32) / h);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    observer.observe(frame);
    return () => observer.disconnect();
  });
</script>

<div bind:this={frame} class="org-chart-container relative overflow-hidden select-none" style="height: {height}px;">
  {#if !schema || !schema.hierarchies || schema.hierarchies.length === 0}
    <div class="m-8 flex flex-col items-center justify-center py-14 text-on-surface-variant/30 border-2 border-dashed border-outline-variant/10 rounded-xl bg-surface-container-low/20">
      <div class="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center mb-6 shadow-inner opacity-50">
        <Papicon icon="schema" size={32} />
      </div>
      <h3 class="text-xl font-semibold tracking-tight text-on-surface/40">{t.emptyTitle}</h3>
      <p class="mt-2 text-xs opacity-50">{t.emptyDesc}</p>
    </div>
  {:else}
    <div
      class="absolute left-1/2 top-4 origin-top"
      style="width: {natural.width}px; transform: translateX(-50%) scale({scale});"
    >
      <div bind:this={canvas} class="tree-canvas flex flex-col items-center min-w-max px-8 pt-8 pb-2">
        {#if schema.chiefStaff && (schema.chiefStaff.name || schema.chiefStaff.userId)}
          <div class="chief-staff-node mb-8 flex flex-col items-center">
            <div class="chief-staff-card group relative p-6 pt-8 rounded-2xl bg-linear-to-br from-amber-500/10 to-yellow-600/5 border border-warning/30 backdrop-blur-md max-w-sm text-center">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg border border-warning/30 group-hover:scale-110 transition-transform duration-300">
                <Papicon icon="crown" size={22} />
              </div>
              <div class="mt-2">
                <span class="px-2.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20 text-xs font-semibold">{t.chief}</span>
                <p class="text-lg font-bold text-on-surface mt-2 tracking-tight">{schema.chiefStaff.name || t.unknown}</p>
                {#if schema.chiefStaff.userId}
                  <span class="text-2xs font-mono text-on-surface-variant/40 bg-surface-container-high/40 px-2 py-0.5 rounded-md mt-1.5 inline-block">ID: {schema.chiefStaff.userId}</span>
                {/if}
              </div>
            </div>
            <div class="vertical-connector bg-linear-to-b from-amber-500/40 to-outline-variant"></div>
          </div>
        {/if}

        <div class="hierarchies-tree flex items-start gap-12 relative">
          {#each hierarchyTree as hierarchy (hierarchy.id)}
            <div class="flex-1 flex justify-center">
              <HierarchyNode node={hierarchy} isRoot={true} />
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .org-chart-container {
    background-image: radial-gradient(var(--outline-variant) 1px, transparent 1px);
    background-size: 24px 24px;
    background-color: var(--surface-container-lowest);
    border-radius: var(--radius-xl, 0.75rem);
    border: 1px solid var(--outline-variant);
  }
  .chief-staff-node {
    position: relative;
  }
  .chief-staff-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px -6px rgba(245, 158, 11, 0.12), inset 0 0 12px rgba(245, 158, 11, 0.02);
  }
  .chief-staff-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px -6px rgba(245, 158, 11, 0.22), inset 0 0 16px rgba(245, 158, 11, 0.08);
    border-color: rgba(245, 158, 11, 0.5);
  }
  .vertical-connector {
    width: 2px;
    height: 48px;
  }
  .hierarchies-tree {
    padding-top: 0.5rem;
  }
</style>

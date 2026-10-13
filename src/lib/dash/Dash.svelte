<!--
  Le cadre d'un écran du dashboard recopié sur le site.

  Il charge le thème sombre de dash.kotbo.fr (`dash.css`) et pose la classe
  `.dash` sous laquelle ce thème est enfermé : à l'intérieur, les classes
  recopiées du dashboard (`section-card`, `btn btn-primary`,
  `text-on-surface-variant`…) rendent comme là-bas ; à l'extérieur, rien ne
  change. Importer le CSS ici plutôt que dans le layout le garde hors des pages
  qui n'affichent aucun écran.

    <Dash class="rounded-xl border border-white/10 p-6">
      <ModulePage title={t.title}>…</ModulePage>
    </Dash>

  Une fenêtre (`ui/Modal`) s'ouvre en `position: absolute` : poser `relative`
  sur ce cadre, ou sur l'élément qu'elle doit recouvrir.
-->
<script lang="ts">
  import './dash.css';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  const {
    class: className = '',
    children,
    ...rest
  }: { class?: string; children?: Snippet } & Omit<HTMLAttributes<HTMLDivElement>, 'class'> = $props();
</script>

<div class="dash {className}" {...rest}>
  {@render children?.()}
</div>

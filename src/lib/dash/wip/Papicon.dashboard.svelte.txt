<!--
  L'icône du dashboard, recopiée de `Kotbo/apps/dashboard/src/lib/components/Papicon.svelte`
  (branche `recette`) pour que les écrans reconstitués aient exactement ses pictos.

  Même résolution que là-bas : le nom passe par la table d'alias du dashboard
  (`dash/icons/papicons.ts`) ; si Papicons dessine l'icône, on trace ses
  chemins, sinon on retombe sur Lucide (`dash/icons/lucide.ts`), puis sur le
  point d'interrogation. Le dashboard déroule un composant React pour obtenir
  les chemins ; ici ils sont déjà extraits (`dash/icons/papiconPaths.ts`).

  Même interface aussi : `icon` (ou `name`), `size`, `class` (ou `className`,
  `class_`), `style`. Les écrans du site qui passaient `icon`, `size` et
  `class` n'ont rien à changer.
-->
<script lang="ts">
  import { toPapiconsName } from '$lib/dash/icons/papicons';
  import { PAPICON_PATHS } from '$lib/dash/icons/papiconPaths';
  import { getLucideIcon } from '$lib/dash/icons/lucide';

  const {
    icon = '',
    name = '',
    size = 24,
    class: className = '',
    className: classNameAlias = '',
    class_: legacyClassName = '',
    style = ''
  }: {
    icon?: string;
    name?: string;
    size?: number;
    class?: string;
    className?: string;
    class_?: string;
    style?: string;
    children?: import('svelte').Snippet;
  } = $props();

  const requestedIcon = $derived(typeof icon === 'string' && icon ? icon : name);
  const mergedClassName = $derived(`${className} ${classNameAlias} ${legacyClassName}`.trim());
  const iconName = $derived(toPapiconsName(requestedIcon));
  const paths = $derived(PAPICON_PATHS[iconName] ?? null);

  const LucideComponent = $derived(getLucideIcon(requestedIcon));

  // Une icône posée dans un conteneur flex se fait écraser dès que la place
  // manque : elle garde ses attributs width/height mais flex-shrink la réduit
  // quand même. Le style de l'appelant passe après, il reste donc prioritaire.
  const mergedStyle = $derived(`flex-shrink:0;${style}`);
</script>

{#if paths && paths.length > 0}
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={mergedClassName}
    style={mergedStyle}
    aria-hidden="true"
  >
    {#each paths as path, i (i)}
      <path d={path.d} fill="currentColor" fill-rule={path.fillRule} clip-rule={path.clipRule} />
    {/each}
  </svg>
{:else}
  <!-- Le dashboard passe `stroke-width={2.25}`, mais lucide-svelte réécrit
       l'attribut avec son `strokeWidth` (2) : le trait réel est de 2, gardé ici. -->
  <LucideComponent {size} class={mergedClassName} style={mergedStyle} />
{/if}

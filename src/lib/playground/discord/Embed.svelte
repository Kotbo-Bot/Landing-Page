<script lang="ts">
  /**
   * Un embed Discord : liseré de couleur, titre, corps, champs, pied.
   *
   * Le liseré porte ici une information (la couleur du module qui parle), pas
   * une décoration : c'est la convention de Discord, que les membres lisent
   * déjà.
   */
  import type { Snippet } from 'svelte';

  interface Field {
    name: string;
    value: string;
    inline?: boolean;
  }

  interface Props {
    color?: string;
    title?: string;
    icon?: string;
    fields?: Field[];
    footer?: string;
    thumbnail?: string;
    children?: Snippet;
    actions?: Snippet;
  }

  const { color = '#5865f2', title, icon, fields = [], footer, thumbnail, children, actions }: Props = $props();
</script>

<div class="mt-1.5 max-w-128">
  <div class="flex rounded bg-[#2b2d31]" style="border-left: 4px solid {color}">
    <div class="min-w-0 flex-1 px-3.5 py-3">
      {#if title}
        <p class="flex items-center gap-1.5 font-semibold leading-snug text-[#f2f3f5]">
          {#if icon}<img src={icon} alt="" width="18" height="18" class="h-4.5 w-4.5" />{/if}
          {title}
        </p>
      {/if}
      {#if children}
        <div class="mt-1 text-sm leading-relaxed text-[#dbdee1]">{@render children()}</div>
      {/if}
      {#if fields.length > 0}
        <dl class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {#each fields as field (field.name)}
            <div class={field.inline === false ? 'col-span-full' : ''}>
              <dt class="text-xs font-semibold text-[#f2f3f5]">{field.name}</dt>
              <dd class="text-sm text-[#dbdee1]">{field.value}</dd>
            </div>
          {/each}
        </dl>
      {/if}
      {#if footer}
        <p class="mt-2 text-xs text-[#949ba4]">{footer}</p>
      {/if}
    </div>
    {#if thumbnail}
      <img src={thumbnail} alt="" width="56" height="56" class="m-3 h-14 w-14 shrink-0 rounded" />
    {/if}
  </div>
  {#if actions}
    <div class="mt-2 flex flex-wrap gap-2">{@render actions()}</div>
  {/if}
</div>

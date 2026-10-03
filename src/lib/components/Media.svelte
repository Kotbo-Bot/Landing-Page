<script lang="ts">
  /**
   * Affiche un média réel s'il a été fourni, sinon le rendu de repli.
   *
   * Voir `data/media.ts` pour la liste des emplacements. Une vidéo ne se lit
   * jamais d'elle-même quand le visiteur a demandé moins de mouvement : il voit
   * l'image `poster` et garde les contrôles.
   */
  import type { Snippet } from 'svelte';
  import { base } from '$app/paths';
  import { MEDIA, type MediaKey, type MediaSlot } from '$lib/data/media';
  import { getLocale } from '$lib/i18n/state.svelte';

  interface Props {
    name: MediaKey;
    class?: string;
    /** Ce qui s'affiche tant que le fichier manque. Sans repli, rien ne s'affiche. */
    fallback?: Snippet;
  }

  const { name, class: className = '', fallback }: Props = $props();

  const media = $derived<MediaSlot>(MEDIA[name]);
  const alt = $derived(media.alt[getLocale()]);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function url(path: string | null | undefined): string | undefined {
    if (!path) return undefined;
    return path.startsWith('http') ? path : `${base}${path}`;
  }
</script>

{#if media.src}
  {#if media.kind === 'video'}
    <video
      src={url(media.src)}
      poster={url(media.poster)}
      width={media.width}
      height={media.height}
      autoplay={!reduce}
      muted
      loop
      playsinline
      controls={reduce}
      aria-label={alt}
      class="h-auto w-full {className}"
    ></video>
  {:else}
    <img src={url(media.src)} {alt} width={media.width} height={media.height} loading="lazy" class="h-auto w-full {className}" />
  {/if}
{:else if fallback}
  {@render fallback()}
{/if}

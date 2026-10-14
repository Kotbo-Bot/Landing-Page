<script lang="ts">
  /**
   * Un écran du dashboard (`dash/screens`) posé dans la page, à l'échelle.
   *
   * Les écrans sont dessinés à la taille du dashboard puis réduits à la largeur
   * disponible. Sous 0,6 les cibles deviennent trop petites pour un doigt :
   * l'écran reste visible mais n'est plus manipulable (`inert`), et la note du
   * dessous renvoie vers la démo complète. L'écran garde la nuit en mode clair
   * (`stay-dark`) : c'est un vrai écran sombre.
   */
  import type { Snippet } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';

  const { children }: { children: Snippet } = $props();

  const TEXT = {
    fr: {
      demo: 'Fouiller le vrai dashboard, sans compte',
      fictive: 'Le vrai dashboard, sur un serveur de démo aux membres fictifs. Clique, rien ne part nulle part',
      small: 'Aperçu en miniature : l’écran se manipule sur un écran plus large, ou dans la démo complète',
    },
    en: {
      demo: 'Dig through the real dashboard, no account',
      fictive: 'The real dashboard, on a demo server with fictional members. Click around, nothing gets sent',
      small: 'Thumbnail preview: the screen is playable on a wider display, or in the full demo',
    },
  };
  const t = $derived(TEXT[getLocale()]);

  const STAGE_W = 1180;
  const STAGE_H = 720;
  let frameWidth = $state(STAGE_W);
  const scale = $derived(Math.min(1, frameWidth / STAGE_W));
  const playable = $derived(scale >= 0.6);
</script>

<div class="stay-dark overflow-hidden rounded-xl border border-line bg-night" bind:clientWidth={frameWidth} style="height: {STAGE_H * scale}px">
  <div class="origin-top-left" style="width: {STAGE_W}px; height: {STAGE_H}px; transform: scale({scale})" inert={!playable}>
    {@render children()}
  </div>
</div>
<p class="px-3 pb-1 pt-3 text-sm text-fog">
  {playable ? t.fictive : t.small}
  {#if !playable}<a href="/demo/" class="ml-1 font-semibold text-ink underline decoration-ink/30 underline-offset-4">{t.demo}</a>{/if}
</p>

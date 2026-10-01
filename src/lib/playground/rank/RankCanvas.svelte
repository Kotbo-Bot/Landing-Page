<script lang="ts">
  /**
   * La carte de rang en `<canvas>`, redessinée à chaque changement.
   *
   * Le canevas garde la résolution de la carte du bot (934 × 282) et se réduit
   * en CSS : c'est ce fichier-là, et pas une capture, que le visiteur
   * télécharge.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import {
    BACKGROUNDS,
    CARD_HEIGHT,
    CARD_WIDTH,
    drawCard,
    loadFont,
    loadImage,
    type AchievementId,
    type FontId,
  } from './draw';

  interface Props {
    name: string;
    tag: string;
    level: number;
    progress: number;
    rank: number;
    backgroundId: string;
    font: FontId;
    /** URL locale (objet `blob:`) ou `null` pour l'avatar à initiales. */
    avatarSrc: string | null;
    badges: AchievementId[];
    title?: AchievementId | null;
    label: string;
    canvas?: HTMLCanvasElement | null;
  }

  let {
    name,
    tag,
    level,
    progress,
    rank,
    backgroundId,
    font,
    avatarSrc,
    badges,
    title = null,
    label,
    canvas = $bindable(null),
  }: Props = $props();

  let avatar = $state<HTMLImageElement | null>(null);
  let fontReady = $state(0);

  $effect(() => {
    const src = avatarSrc;
    if (!src) {
      avatar = null;
      return;
    }
    let cancelled = false;
    void loadImage(src).then((img) => {
      if (!cancelled) avatar = img;
    });
    return () => {
      cancelled = true;
    };
  });

  $effect(() => {
    const id = font;
    void loadFont(id).then(() => (fontReady += 1));
  });

  $effect(() => {
    void fontReady;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    drawCard(ctx, {
      name,
      tag,
      level,
      progress,
      rank,
      background: BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0],
      font,
      avatar,
      badges: [...badges],
      title,
      locale: getLocale(),
    });
  });
</script>

<canvas
  bind:this={canvas}
  width={CARD_WIDTH}
  height={CARD_HEIGHT}
  aria-label={label}
  class="block h-auto w-full rounded-2xl">{label}</canvas
>

<script lang="ts">
  /**
   * « Et après le clic ? » : la vidéo de l'installation guidée.
   *
   * N'existe que si la boucle a été fournie (`data/media.ts`,
   * `setupWalkthrough`). Sans elle, la zone n'a rien à montrer de réel et ne
   * s'affiche pas : la reconstituer en HTML reviendrait à promettre un écran
   * qu'on n'a pas vu.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import { MEDIA } from '$lib/data/media';
  import Media from '$lib/components/Media.svelte';

  const TEXT = {
    fr: {
      title: 'Et après le clic ?',
      body: 'Tu choisis ton serveur, Kotbo le rejoint, et l’installation guidée reprend les réglages que tu viens de faire. Voilà à quoi elle ressemble.',
    },
    en: {
      title: 'And after the click?',
      body: 'You pick your server, Kotbo joins it, and the guided setup picks up the settings you just made. This is what it looks like.',
    },
  };

  const t = $derived(TEXT[getLocale()]);
</script>

{#if MEDIA.setupWalkthrough.src}
  <section aria-labelledby="after-title" class="py-20">
    <div class="mx-auto grid max-w-360 items-center gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <div>
        <h2 id="after-title" class="font-headline text-4xl font-extrabold tracking-tight text-gray-900">{t.title}</h2>
        <p class="mt-4 text-lg leading-relaxed text-gray-700">{t.body}</p>
      </div>
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_70px_-25px_rgba(17,24,39,0.35)]">
        <Media name="setupWalkthrough" />
      </div>
    </div>
  </section>
{/if}

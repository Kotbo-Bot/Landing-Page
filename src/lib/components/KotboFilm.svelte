<script lang="ts">
  /**
   * Le film de présentation de Kotbo, puis le bouton de la démo du dashboard.
   *
   * Une minute pour tout le produit : les six familles de modules filmées sur
   * le vrai dashboard de démo, le serveur MCP, les widgets de profil, puis les
   * 51 modules. Le film est rendu par `motion/` (Remotion) et auto-hébergé dans
   * `static/media/` : aucun lecteur ni script tiers (CLAUDE.md, `funnel.ts`).
   *
   * Seule boucle de la page, exception validée à MOTION 3 (DESIGN.md) : il se
   * lit sans son quand il est à l'écran, se met en pause dès qu'il en sort, et
   * le visiteur garde la main (Pause). Avec `prefers-reduced-motion`, rien ne
   * part tout seul : l'affiche reste, le bouton lance le film.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { FILM } from '$lib/data/media';
  import { getLocale } from '$lib/i18n/state.svelte';

  const TEXT = {
    fr: {
      label: 'Film de présentation de Kotbo, une minute, sans voix off',
      summary:
        'Le film montre, sur le vrai dashboard de démo : la modération (AutoMod, sanctions, un spam réglé dans Discord), la gestion du staff (annuaire, planning), la communauté (niveaux, économie), les logs, la santé des salons et Pulse, un agent IA qui pilote le serveur par le serveur MCP, les widgets sur le profil Discord, puis les 51 modules.',
      pause: 'Mettre en pause',
      play: 'Lire',
      start: 'Lire le film',
      soundOn: 'Activer le son',
      soundOff: 'Couper le son',
      note: 'Démo : écrans du vrai dashboard, membres fictifs.',
      button: 'Ouvrir la démo du dashboard',
    },
    en: {
      label: 'Kotbo product film, one minute, no voice-over',
      summary:
        'The film shows, on the real demo dashboard: moderation (AutoMod, sanctions, spam handled in Discord), staff management (directory, planning), community (levels, economy), logs, channel health and Pulse, an AI agent running the server through the MCP server, widgets on the Discord profile, then all 51 modules.',
      pause: 'Pause',
      play: 'Play',
      start: 'Play the film',
      soundOn: 'Turn sound on',
      soundOff: 'Mute',
      note: 'Demo: real dashboard screens, fictional members.',
      button: 'Open the dashboard demo',
    },
  };

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const files = $derived(FILM.files[locale]);

  let video = $state<HTMLVideoElement>();
  let playing = $state(false);
  let started = $state(false);
  /** Le visiteur a mis en pause : on ne relance pas au retour à l'écran. */
  let held = $state(false);
  let muted = $state(true);
  let reduced = $state(false);
  let visible = false;

  function play() {
    video?.play().catch(() => {
      // Lecture refusée par le navigateur : l'affiche et le bouton Lire restent.
    });
  }

  function toggle() {
    if (!video) return;
    if (video.paused) {
      held = false;
      play();
    } else {
      held = true;
      video.pause();
    }
  }

  // Changement de langue : on recharge la bonne version, au même état de lecture.
  let loaded = '';
  $effect(() => {
    const current = files.mp4;
    if (!video || loaded === current) return;
    const first = loaded === '';
    loaded = current;
    if (first) return;
    const wasPlaying = playing;
    video.load();
    if (wasPlaying) play();
  });

  onMount(() => {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    held = reduced;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!video) return;
        if (visible && !held) play();
        else if (!visible) video.pause();
      },
      { threshold: 0.4 },
    );
    if (video) observer.observe(video);
    return () => observer.disconnect();
  });
</script>

<!-- Largeur bornée par la hauteur d'écran : vidéo (16/9) et barre de boutons tiennent
     ensemble sous l'en-tête, même sur un portable de 768 px de haut. -->
<div class="mx-auto max-w-[min(100%,calc((100svh-13rem)*16/9))] overflow-hidden rounded-2xl border-2 border-gray-200 bg-board">
  <p id="kotbo-film-summary" class="sr-only">{t.summary}</p>
  <!-- svelte-ignore a11y_media_has_caption : le film est muet, sans voix ; son contenu est résumé juste au-dessus. -->
  <video
    bind:this={video}
    class="block aspect-video w-full bg-board"
    width={FILM.width}
    height={FILM.height}
    poster="{base}{files.poster}"
    preload="none"
    playsinline
    loop
    {muted}
    aria-label={t.label}
    aria-describedby="kotbo-film-summary"
    onplay={() => (playing = started = true)}
    onpause={() => (playing = false)}
  >
    <source src="{base}{files.mp4}" type="video/mp4" />
  </video>

  <div class="flex flex-col gap-3 border-t-2 border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
    <div class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onclick={toggle}
        class="min-h-11 shrink-0 rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        {playing ? t.pause : started || !reduced ? t.play : t.start}
      </button>
      {#if FILM.music}
        <button
          type="button"
          onclick={() => (muted = !muted)}
          aria-pressed={!muted}
          class="min-h-11 shrink-0 rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          {muted ? t.soundOn : t.soundOff}
        </button>
      {/if}
      <p class="text-sm text-gray-600">{t.note}</p>
    </div>
    <a
      href="/demo/"
      class="inline-flex min-h-13 w-full items-center justify-center rounded-xl bg-gray-900 px-7 text-base font-bold text-white transition-colors hover:bg-black sm:w-auto"
    >
      {t.button}
    </a>
  </div>
</div>

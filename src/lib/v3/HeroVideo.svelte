<script lang="ts">
  /**
   * Le film de 20 s du héros, hébergé sur Vimeo.
   *
   * Lu en mode `background` : lecture auto, muette, en boucle, sans le lecteur
   * de Vimeo. Nos deux boutons (pause, son) le pilotent par `postMessage`, sans
   * charger le script de Vimeo : la règle « aucun script tiers » tient pour la
   * page, et `dnt=1` empêche le lecteur de poser ses cookies de mesure (la page
   * reste dans l'exemption de la CNIL, voir `funnel.ts`).
   *
   * Le bouton pause est obligatoire (WCAG 2.2.2 : une animation de plus de
   * 5 s doit pouvoir s'arrêter), et le film part en pause quand le visiteur a
   * demandé moins de mouvement. Le cadre reste masqué tant que le film ne joue
   * pas : ni le chargement noir du lecteur, ni son écran « connectez-vous »
   * si la vidéo n'est pas publique sur Vimeo (elle doit être « non
   * répertoriée » ou publique, intégrable sur kotbo.fr). Les boutons
   * n'apparaissent qu'avec elle.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';

  const ORIGIN = 'https://player.vimeo.com';
  const SRC = `${ORIGIN}/video/1235376117?background=1&dnt=1&autopause=0&app_id=58479`;

  const TEXT = {
    fr: { title: 'Kotbo en 20 secondes', pause: 'Mettre le film en pause', play: 'Lancer le film', mute: 'Couper le son', unmute: 'Activer le son' },
    en: { title: 'Kotbo in 20 seconds', pause: 'Pause the film', play: 'Play the film', mute: 'Mute', unmute: 'Turn sound on' },
  };
  const t = $derived(TEXT[getLocale()]);

  let frame = $state<HTMLIFrameElement | null>(null);
  let ready = $state(false);
  let playing = $state(true);
  let muted = $state(true);

  function send(method: string, value?: unknown) {
    // Un objet, pas du JSON en texte : le lecteur ignore les abonnements en texte.
    frame?.contentWindow?.postMessage(value === undefined ? { method } : { method, value }, ORIGIN);
  }

  function togglePlay() {
    playing = !playing;
    send(playing ? 'play' : 'pause');
  }

  function toggleSound() {
    muted = !muted;
    send('setMuted', muted);
    if (!muted) send('setVolume', 1);
    if (!muted && !playing) togglePlay();
  }

  // Le lecteur peut annoncer `ready` avant que la page n'écoute : on
  // s'abonne aussi au chargement du cadre (par `addEventListener` : un
  // `onload` Svelte deviendrait un gestionnaire en ligne, bloqué par la CSP).
  // S'abonner deux fois est sans effet.
  function listen() {
    send('addEventListener', 'timeupdate');
  }

  onMount(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || e.source !== frame?.contentWindow) return;
      let data: { event?: string };
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data.event === 'ready') {
        listen();
      } else if (data.event === 'timeupdate' && !ready) {
        // Première image : le film tourne vraiment.
        ready = true;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
          playing = false;
          send('pause');
        }
      }
    };
    window.addEventListener('message', onMessage);
    frame?.addEventListener('load', listen);
    listen();
    return () => {
      window.removeEventListener('message', onMessage);
      frame?.removeEventListener('load', listen);
    };
  });
</script>

<figure class="group relative overflow-hidden rounded-2xl border border-line-2 bg-night-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
  <div class="relative aspect-video">
    <div aria-hidden="true" class="absolute inset-0 grid place-items-center transition-opacity duration-500 {ready ? 'opacity-0' : 'opacity-100'}">
      <img src="{base}/favicon.svg" alt="" width="56" height="56" class="h-14 w-14 rounded-2xl opacity-60" />
    </div>
    <iframe
      bind:this={frame}
      src={SRC}
      title={t.title}
      allow="autoplay; fullscreen; picture-in-picture"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="eager"
      tabindex="-1"
      class="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 {ready ? 'opacity-100' : 'opacity-0'}"
    ></iframe>
  </div>

  {#if ready}
    <div class="absolute bottom-2 right-2 flex gap-2 sm:bottom-3 sm:right-3">
      <button
        type="button"
        onclick={toggleSound}
        aria-label={muted ? t.unmute : t.mute}
        class="grid h-11 w-11 place-items-center rounded-full bg-night/80 text-ink backdrop-blur-md transition-colors hover:bg-night"
      >
        {#if muted}
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M11 5 6 9H3v6h3l5 4V5ZM22 9l-6 6M16 9l6 6" /></svg>
        {:else}
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M11 5 6 9H3v6h3l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
        {/if}
      </button>
      <button
        type="button"
        onclick={togglePlay}
        aria-label={playing ? t.pause : t.play}
        class="grid h-11 w-11 place-items-center rounded-full bg-night/80 text-ink backdrop-blur-md transition-colors hover:bg-night"
      >
        {#if playing}
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
        {:else}
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-5 w-5"><path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
        {/if}
      </button>
    </div>
  {/if}
</figure>

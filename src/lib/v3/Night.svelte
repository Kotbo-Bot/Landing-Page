<script lang="ts">
  /**
   * Le problème, dit comme le fondateur le vit : son téléphone à 2 h 47.
   *
   * À droite, un écran verrouillé d'iPhone le plus fidèle possible (barre
   * d'état, notifications groupées, raccourcis du bas). Quand la zone arrive à
   * l'écran, la nuit se joue : les notifications tombent une à une et le
   * téléphone vibre, comme chez lui. Les phrases reprennent la façon dont les
   * admins l'écrivent sous les tutos Discord.
   *
   * À gauche, le bilan de la même nuit, ligne par ligne : chaque galère, puis
   * ce que Kotbo en a fait quand le visiteur bascule « Avec Kotbo ». Chaque
   * ligne nomme le module qui l'a réglée, et chaque module existe dans le bot
   * (anti-raid, appels de ban, prise en charge des tickets, absences et
   * planning du staff). Le téléphone passe en mode Sommeil et ne garde que le
   * compte rendu de Kotbo.
   *
   * C'est une scène, annoncée comme telle : les pseudos sont fictifs et aucun
   * bot concurrent n'y est nommé. Avec moins de mouvement demandé, tout est
   * affiché d'un coup, sans vibration.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type App = 'discord' | 'tickets' | 'sheet' | 'kotbo';
  type Notif = { app: App; title: string; sub?: string; body: string; time: string };
  type Row = { problem: string; fix: string; module: string; at: string };

  const TEXT = {
    fr: {
      title: 'Tu voulais un serveur pour traîner avec ta commu. T’as fini SAV de six bots.',
      intro:
        'Plus ton serveur grossit, plus tu tiens seul tout ce qui se passe derrière : le staff, les sanctions, les tickets. Et ça tombe toujours la nuit.',
      without: 'Sans Kotbo',
      with: 'Avec Kotbo',
      switchLabel: 'Comparer la nuit sans et avec Kotbo',
      chaosHead: 'Ta nuit, sans Kotbo',
      calmHead: 'La même nuit, avec Kotbo',
      lockDate: 'samedi 13 juin',
      focus: 'Sommeil',
      scene: 'Scène fictive',
      sceneChaos: 'Scène fictive : l’écran verrouillé d’un fondateur à 2 h 47, sans Kotbo.',
      sceneCalm: 'Scène fictive : le même écran, avec Kotbo.',
      more: (n: number) => `${n} autres notifications`,
      sleep: 'Rendors-toi.',
      rows: [
        { problem: 'Un raid tombe sur #général', fix: 'Raid bloqué à 02:13, 38 comptes sortis', module: 'Anti-raid', at: '02:47' },
        { problem: 'Maxou conteste son ban en MP', fix: 'Maxou a fait appel, tu tranches demain', module: 'Appels de ban', at: '02:44' },
        { problem: 'Le ticket #148 attend depuis 3 h', fix: 'Ticket #148 pris par Lena à 01:52', module: 'Tickets', at: '02:38' },
        { problem: 'Enzo annonce son absence en MP', fix: 'Absence d’Enzo posée, à valider', module: 'Absences', at: '02:26' },
        { problem: 'Le planning vit dans un tableur', fix: 'Planning du staff généré tout seul', module: 'Planning', at: '02:09' },
      ] as Row[],
      chaos: [
        { app: 'discord', title: 'Lucas (modo)', sub: '#général', body: 'frr y’a un raid là je fais quoi ?? @Fonda', time: 'maintenant' },
        { app: 'discord', title: 'Maxou', sub: 'Message privé', body: 'pk j’suis ban ?? j’ai rien fait, c’est un abus de pouvoir', time: 'il y a 3 min' },
        { app: 'tickets', title: 'Ticket #148', body: 'Toujours sans réponse depuis 3 h', time: 'il y a 9 min' },
        { app: 'discord', title: 'Enzo (modo)', sub: 'Message privé', body: 'jsuis pas là ce week-end, dis-le aux autres stp', time: 'il y a 21 min' },
        { app: 'sheet', title: 'planning_staff_FINAL_v3', body: 'Inès a modifié 14 cellules', time: 'il y a 38 min' },
      ] as Notif[],
      calm: [
        { app: 'kotbo', title: 'Raid bloqué à 02:13', sub: '#staff-logs', body: '38 comptes sortis automatiquement. Le rapport t’attend dans le dashboard.', time: 'il y a 34 min' },
        { app: 'kotbo', title: 'Résumé de la nuit', sub: '#staff-logs', body: '1 ticket pris par Lena · 1 appel de ban · 1 absence à valider', time: 'il y a 7 min' },
      ] as Notif[],
    },
    en: {
      title: 'You wanted a server to hang out with your people. You ended up as tech support for six bots.',
      intro:
        'The bigger your server gets, the more you hold everything behind the scenes alone: the staff, the sanctions, the tickets. And it always hits at night.',
      without: 'Without Kotbo',
      with: 'With Kotbo',
      switchLabel: 'Compare the night without and with Kotbo',
      chaosHead: 'Your night, without Kotbo',
      calmHead: 'The same night, with Kotbo',
      lockDate: 'Saturday, June 13',
      focus: 'Sleep',
      scene: 'Fictional scene',
      sceneChaos: 'Fictional scene: a server owner’s lock screen at 2:47 a.m., without Kotbo.',
      sceneCalm: 'Fictional scene: the same screen, with Kotbo.',
      more: (n: number) => `${n} more notifications`,
      sleep: 'Go back to sleep.',
      rows: [
        { problem: 'A raid hits #general', fix: 'Raid blocked at 02:13, 38 accounts removed', module: 'Anti-raid', at: '02:47' },
        { problem: 'Maxou disputes his ban in DMs', fix: 'Maxou filed an appeal, you decide tomorrow', module: 'Ban appeals', at: '02:44' },
        { problem: 'Ticket #148 has waited 3 hours', fix: 'Ticket #148 claimed by Lena at 01:52', module: 'Tickets', at: '02:38' },
        { problem: 'Enzo announces time off in DMs', fix: 'Enzo’s time off logged, to approve', module: 'Time off', at: '02:26' },
        { problem: 'The schedule lives in a spreadsheet', fix: 'Staff schedule generated on its own', module: 'Schedule', at: '02:09' },
      ] as Row[],
      chaos: [
        { app: 'discord', title: 'Lucas (mod)', sub: '#general', body: 'bro we’re getting raided what do i do?? @Owner', time: 'now' },
        { app: 'discord', title: 'Maxou', sub: 'Direct message', body: 'why am i banned?? i did nothing, this is power abuse', time: '3m ago' },
        { app: 'tickets', title: 'Ticket #148', body: 'Still unanswered after 3 hours', time: '9m ago' },
        { app: 'discord', title: 'Enzo (mod)', sub: 'Direct message', body: 'i’m out this weekend, tell the others pls', time: '21m ago' },
        { app: 'sheet', title: 'staff_schedule_FINAL_v3', body: 'Inès edited 14 cells', time: '38m ago' },
      ] as Notif[],
      calm: [
        { app: 'kotbo', title: 'Raid blocked at 02:13', sub: '#staff-logs', body: '38 accounts removed automatically. The report is waiting in the dashboard.', time: '34m ago' },
        { app: 'kotbo', title: 'Night recap', sub: '#staff-logs', body: '1 ticket claimed by Lena · 1 ban appeal · 1 time-off request', time: '7m ago' },
      ] as Notif[],
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const HIDDEN_COUNT = 37;

  let calm = $state(false);
  // Combien de notifications de la nuit sont arrivées. Elles arrivent de la
  // plus ancienne à la plus récente, la plus récente en haut.
  let arrived = $state(0);
  let buzz = $state(0);
  let section = $state<HTMLElement | null>(null);
  let frame = $state<HTMLElement | null>(null);

  // Chaque notification fait vibrer le téléphone, comme posé sur une table.
  $effect(() => {
    if (buzz === 0 || !frame) return;
    frame.animate(
      [
        { transform: 'translate(0, 0) rotate(0)' },
        { transform: 'translate(-2px, 0) rotate(-0.6deg)' },
        { transform: 'translate(2px, 0) rotate(0.6deg)' },
        { transform: 'translate(-2px, 0) rotate(-0.4deg)' },
        { transform: 'translate(2px, 0) rotate(0.4deg)' },
        { transform: 'translate(0, 0) rotate(0)' },
      ],
      { duration: 360, easing: 'linear' },
    );
  });

  const chaosShown = $derived(t.chaos.slice(t.chaos.length - arrived));
  const list = $derived(calm ? t.calm : chaosShown);
  const night = $derived(!calm && arrived === t.chaos.length);

  function play() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      arrived = t.chaos.length;
      return;
    }
    const timer = setInterval(() => {
      if (calm || arrived >= t.chaos.length) return clearInterval(timer);
      arrived += 1;
      buzz += 1;
    }, 900);
  }

  function choose(next: boolean) {
    calm = next;
    // Retour à la nuit : tout est déjà tombé, pas de nouvelle attente.
    if (!next) arrived = t.chaos.length;
  }

  onMount(() => {
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        play();
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  });
</script>

{#snippet appIcon(app: App)}
  {#if app === 'discord'}
    <span class="grid h-[2.15rem] w-[2.15rem] shrink-0 place-items-center rounded-[0.6rem] bg-[#5865f2]">
      <svg viewBox="0 0 24 24" class="h-5 w-5 fill-white"><path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.3 18.3 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.7 19.7 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1-.01-.13l.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0l.37.3a.08.08 0 0 1 0 .13c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .08.03 19.8 19.8 0 0 0 6-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z" /></svg>
    </span>
  {:else if app === 'tickets'}
    <span class="grid h-[2.15rem] w-[2.15rem] shrink-0 place-items-center rounded-[0.6rem] bg-[#3f3f46]">
      <svg viewBox="0 0 24 24" class="h-[1.1rem] w-[1.1rem]"><path fill="none" stroke="white" stroke-width="2" stroke-linejoin="round" d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8Z" /><path stroke="white" stroke-width="2" stroke-dasharray="2 2" d="M15 7v10" /></svg>
    </span>
  {:else if app === 'sheet'}
    <span class="grid h-[2.15rem] w-[2.15rem] shrink-0 place-items-center rounded-[0.6rem] bg-[#16a34a]">
      <svg viewBox="0 0 24 24" class="h-[1.1rem] w-[1.1rem]"><rect x="4" y="3" width="16" height="18" rx="2" fill="white" /><path stroke="#16a34a" stroke-width="1.6" d="M4 9h16M4 15h16M11 3v18" /></svg>
    </span>
  {:else}
    <img src="{base}/favicon.svg" alt="" width="34" height="34" class="h-[2.15rem] w-[2.15rem] shrink-0 rounded-[0.6rem]" />
  {/if}
{/snippet}

<section bind:this={section} id="nuit" aria-labelledby="night-title" class="relative overflow-hidden bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="nuit" /></div>

  <div class="mx-auto grid max-w-7xl gap-10 px-4 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-x-20 lg:gap-y-8 lg:pt-20">
    <div class="lg:col-start-1 lg:row-start-1 lg:self-end">
      <h2 id="night-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.4rem]">
        {t.title}
      </h2>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-mist">{t.intro}</p>

      <!-- La bascule : le seul geste de la zone. La pastille glisse d'un côté à l'autre. -->
      <div role="group" aria-label={t.switchLabel} class="relative mt-10 grid max-w-sm grid-cols-2 rounded-full border border-line-2 bg-night-2 p-1 text-sm font-semibold">
        <span
          aria-hidden="true"
          class="thumb absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full {calm ? 'translate-x-full bg-[#4f46e5]' : 'bg-alarm'}"
        ></span>
        <button type="button" aria-pressed={!calm} onclick={() => choose(false)} class="relative min-h-11 rounded-full transition-colors {!calm ? 'text-night' : 'text-fog hover:text-white'}">{t.without}</button>
        <button type="button" aria-pressed={calm} onclick={() => choose(true)} class="relative min-h-11 rounded-full transition-colors {calm ? 'text-white' : 'text-fog hover:text-white'}">{t.with}</button>
      </div>
    </div>

    <div class="mx-auto w-full max-w-[20rem] sm:max-w-[22.5rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
      <!-- Le téléphone : une scène, annoncée comme telle avant son contenu. -->
      <figure aria-labelledby="night-scene" class="relative">
        <figcaption id="night-scene" class="sr-only">{calm ? t.sceneCalm : t.sceneChaos}</figcaption>

        <!-- Les boutons de la tranche. -->
        <span aria-hidden="true" class="absolute -left-[3px] top-[18%] h-7 w-[3px] rounded-l bg-[#3a3a40]"></span>
        <span aria-hidden="true" class="absolute -left-[3px] top-[26%] h-12 w-[3px] rounded-l bg-[#3a3a40]"></span>
        <span aria-hidden="true" class="absolute -left-[3px] top-[34%] h-12 w-[3px] rounded-l bg-[#3a3a40]"></span>
        <span aria-hidden="true" class="absolute -right-[3px] top-[28%] h-16 w-[3px] rounded-r bg-[#3a3a40]"></span>

          <div bind:this={frame} class="rounded-[3.4rem] bg-gradient-to-b from-[#4a4a50] via-[#2a2a2e] to-[#3a3a3f] p-[3px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
            <div class="rounded-[3.25rem] bg-black p-[10px]">
              <div class="screen relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] text-white">
                <!-- Fonds d'écran : la nuit rouge, puis la nuit calme. -->
                <div aria-hidden="true" class="absolute inset-0 transition-opacity duration-700" style="background: radial-gradient(120% 70% at 50% 0%, #4a1212 0%, #1c0808 50%, #0b0505 100%); opacity: {calm ? 0 : 1}"></div>
                <div aria-hidden="true" class="absolute inset-0 transition-opacity duration-700" style="background: radial-gradient(120% 70% at 50% 0%, #25215e 0%, #0e0c24 52%, #05050c 100%); opacity: {calm ? 1 : 0}"></div>

                <div class="relative flex h-full flex-col">
                  <!-- Barre d'état et Dynamic Island. -->
                  <div aria-hidden="true" class="relative flex h-12 shrink-0 items-center justify-end gap-1.5 px-7 pt-1">
                    <span class="absolute left-1/2 top-2.5 h-[1.55rem] w-[6.2rem] -translate-x-1/2 rounded-full bg-black"></span>
                    <svg viewBox="0 0 18 12" class="h-[0.7rem] w-[1.05rem] fill-white"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" opacity=".35" /></svg>
                    <svg viewBox="0 0 16 12" class="h-[0.7rem] w-[0.95rem] fill-white"><path d="M8 2.3c2.4 0 4.6.9 6.2 2.5l1.1-1.1A10.3 10.3 0 0 0 8 .7 10.3 10.3 0 0 0 .7 3.7l1.1 1.1A8.7 8.7 0 0 1 8 2.3Zm0 3.2c1.5 0 2.9.6 3.9 1.6L13 6a7 7 0 0 0-10 0l1.1 1.1c1-1 2.4-1.6 3.9-1.6Zm0 3.2c-.7 0-1.3.3-1.8.7L8 11.2l1.8-1.8c-.5-.4-1.1-.7-1.8-.7Z" /></svg>
                    <span class="ml-0.5 flex items-center gap-[1px]">
                      <span class="relative h-[0.72rem] w-[1.45rem] rounded-[0.25rem] border border-white/45 p-[1.5px]">
                        <span class="block h-full rounded-[0.12rem] transition-[width,background] duration-700 {calm ? 'w-[78%] bg-white' : 'w-[12%] bg-alarm'}"></span>
                      </span>
                      <span class="h-1 w-[1.5px] rounded-r bg-white/45"></span>
                    </span>
                  </div>

                  <!-- Cadenas, date, heure, mode de concentration. -->
                  <div class="shrink-0 text-center">
                    <svg aria-hidden="true" viewBox="0 0 24 24" class="mx-auto h-4 w-4 fill-white/85"><path d="M7 10V7a5 5 0 0 1 10 0v3h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10H7Zm2 0h6V7a3 3 0 0 0-6 0v3Z" /></svg>
                    <p class="mt-1.5 text-[0.95rem] font-semibold text-white/80">{t.lockDate}</p>
                    <p class="clock -mt-1 font-display text-[5.4rem] font-bold leading-none tracking-[-0.02em] tabular-nums text-white/95">2:47</p>
                    <div class="mt-2 flex h-6 justify-center">
                      {#if calm}
                        <span class="focus inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 text-[0.75rem] font-semibold text-[#c7c2ff] backdrop-blur-md">
                          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-current"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8Z" /></svg>
                          {t.focus}
                        </span>
                      {/if}
                    </div>
                  </div>

                  <!-- Les notifications. -->
                  <ul class="mt-auto space-y-1.5 px-2.5 pb-2">
                    {#each list as n (n.title)}
                      <li class="notif flex gap-2.5 rounded-[1.35rem] bg-white/[0.13] px-3 py-2.5 backdrop-blur-xl">
                        {@render appIcon(n.app)}
                        <div class="min-w-0 flex-1">
                          <p class="flex items-baseline justify-between gap-2">
                            <span class="truncate text-[0.82rem] font-semibold leading-tight">{n.title}</span>
                            <span class="shrink-0 text-[0.7rem] text-white/55">{n.time}</span>
                          </p>
                          {#if n.sub}<p class="truncate text-[0.72rem] leading-tight text-white/60">{n.sub}</p>{/if}
                          <p class="line-clamp-2 text-[0.8rem] leading-snug text-white/90">{n.body}</p>
                        </div>
                      </li>
                    {/each}
                  </ul>

                  <!-- La pile repliée : le reste de la nuit. -->
                  <div class="h-10 shrink-0 px-2.5">
                    {#if night}
                      <div class="stack relative">
                        <div class="mx-2 h-2.5 rounded-b-[1rem] bg-white/[0.09]"></div>
                        <div class="mx-5 h-2 rounded-b-[0.9rem] bg-white/[0.05]"></div>
                        <p class="mt-1 text-center text-[0.7rem] font-medium text-white/55">{t.more(HIDDEN_COUNT)}</p>
                      </div>
                    {:else if calm}
                      <p class="sleep text-center font-display text-2xl font-extrabold">{t.sleep}</p>
                    {/if}
                  </div>

                  <!-- Lampe, appareil photo, barre d'accueil. -->
                  <div aria-hidden="true" class="flex shrink-0 items-center justify-between px-10 pb-2 pt-1">
                    <span class="grid h-11 w-11 place-items-center rounded-full bg-white/12 backdrop-blur-md">
                      <svg viewBox="0 0 24 24" class="h-5 w-5 fill-white"><path d="M8 2h8v4l-2 3v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9L8 6V2Zm4 9.5a1 1 0 0 0-1 1v1.5a1 1 0 0 0 2 0v-1.5a1 1 0 0 0-1-1Z" /></svg>
                    </span>
                    <span class="grid h-11 w-11 place-items-center rounded-full bg-white/12 backdrop-blur-md">
                      <svg viewBox="0 0 24 24" class="h-5 w-5 fill-white"><path d="M9.2 4h5.6l1.5 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.7l1.5-2ZM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /></svg>
                    </span>
                  </div>
                  <span aria-hidden="true" class="mx-auto mb-2 h-[5px] w-32 shrink-0 rounded-full bg-white/85"></span>
                </div>
              </div>
            </div>
          </div>
      </figure>
      <p class="mt-4 text-center text-xs text-fog" aria-hidden="true">{t.scene}</p>
    </div>

    <div class="lg:col-start-1 lg:row-start-2 lg:self-start">
      <!-- Le bilan de la nuit : la même liste, avant puis après. -->
      <div class="max-w-xl overflow-hidden rounded-2xl border border-line bg-night-2">
        <p class="border-b border-line px-5 py-3 text-xs font-semibold uppercase tracking-wide {calm ? 'text-glow' : 'text-alarm'}">
          {calm ? t.calmHead : t.chaosHead}
        </p>
        <ul class="divide-y divide-line">
          {#each t.rows as row, i (row.module)}
            <li class="flex items-center gap-3.5 px-5 py-3.5">
              {#if calm}
                <span class="mark grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ok/15 text-ok" style="--i: {i}" aria-hidden="true">
                  <svg viewBox="0 0 24 24" class="h-3.5 w-3.5"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                </span>
              {:else}
                <span class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-alarm/15" aria-hidden="true"><span class="h-2 w-2 rounded-full bg-alarm"></span></span>
              {/if}
              {#key calm}
                <span class="line min-w-0 flex-1 text-[15px] {calm ? 'text-white' : 'text-mist'}" style="--i: {i}">{calm ? row.fix : row.problem}</span>
              {/key}
              {#if calm}
                <span class="hidden shrink-0 rounded-md bg-[#4f46e5]/20 px-2 py-0.5 text-xs font-semibold text-glow sm:block">{row.module}</span>
              {:else}
                <span class="shrink-0 text-xs tabular-nums text-fog">{row.at}</span>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  .thumb {
    transition:
      transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
      background-color 420ms ease;
  }
  .notif {
    animation: notif-in 520ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .line,
  .mark {
    animation: line-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 80ms);
  }
  .stack,
  .focus,
  .sleep {
    animation: line-in 500ms ease both 200ms;
  }
  @keyframes notif-in {
    from {
      opacity: 0;
      transform: translateY(-14px) scale(0.96);
    }
  }
  @keyframes line-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .notif,
    .line,
    .mark,
    .stack,
    .focus,
    .sleep {
      animation: none;
    }
  }
</style>

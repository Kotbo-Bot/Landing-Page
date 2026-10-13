<script lang="ts">
  /**
   * Le problème, dit comme le fondateur le vit : son téléphone à 2 h 47.
   *
   * Les notifications sont celles qu'un serveur qui a grandi produit chaque
   * nuit (raid, ban contesté, ticket oublié, absence annoncée en MP, tableur du
   * staff). Les phrases reprennent la façon dont les admins l'écrivent sous
   * les tutos Discord. Le visiteur bascule « Avec Kotbo » et la pile se réduit
   * à ce que Kotbo poste dans le salon du staff : la preuve que le problème a
   * été traité, pas une alerte de plus.
   *
   * C'est une scène, annoncée comme telle : les pseudos sont fictifs et aucun
   * bot concurrent n'y est nommé.
   */
  import { getLocale } from '$lib/i18n/state.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Notif = { app: string; title: string; body: string; tone?: 'alarm' | 'ok' | 'muted' };

  const TEXT = {
    fr: {
      title: 'Tu voulais un serveur pour traîner avec ta commu. T’as fini SAV de six bots.',
      intro:
        'Plus ton serveur grossit, plus tu tiens seul tout ce qui se passe derrière : le staff, les sanctions, les tickets. Et ça tombe toujours la nuit.',
      hint: 'Bascule pour voir la même nuit avec Kotbo :',
      without: 'Sans Kotbo',
      with: 'Avec Kotbo',
      switchLabel: 'Comparer la nuit sans et avec Kotbo',
      lockDate: 'samedi 14 juin',
      scene: 'scène fictive',
      sceneChaos: 'Scène fictive : l’écran verrouillé d’un fondateur à 2 h 47, sans Kotbo.',
      sceneCalm: 'Scène fictive : le même écran, avec Kotbo.',
      sleep: 'Rendors-toi.',
      now: 'maintenant',
      ago: (m: number) => `il y a ${m} min`,
      chaos: [
        { app: 'Discord · #général', title: 'Lucas (modo)', body: 'frr y’a un raid là je fais quoi ?? @Fonda', tone: 'alarm' },
        { app: 'Discord · MP', title: 'Maxou', body: 'pk j’suis ban ?? j’ai rien fait, c’est un abus de pouvoir', tone: 'alarm' },
        { app: 'Bot de tickets', title: 'Ticket #148', body: 'Toujours sans réponse depuis 3 h' },
        { app: 'Discord · MP', title: 'Enzo (modo)', body: 'jsuis pas là ce week-end, dis-le aux autres stp' },
        { app: 'Tableur', title: 'planning_staff_FINAL_v3', body: 'Inès a modifié 14 cellules' },
      ] as Notif[],
      calm: [
        { app: 'Discord · Kotbo dans #staff-logs', title: 'Raid bloqué à 02:13', body: '38 comptes sortis automatiquement. Le rapport complet t’attend dans le dashboard.', tone: 'ok' },
        { app: 'Discord · Kotbo dans #staff-logs', title: 'Résumé de la nuit', body: '2 tickets pris par Lena · 1 absence à valider (Enzo, ce week-end) · chaque sanction a son motif', tone: 'muted' },
      ] as Notif[],
    },
    en: {
      title: 'You wanted a server to hang out with your people. You ended up as tech support for six bots.',
      intro:
        'The bigger your server gets, the more you hold everything behind the scenes alone: the staff, the sanctions, the tickets. And it always hits at night.',
      hint: 'Flip it to see the same night with Kotbo:',
      without: 'Without Kotbo',
      with: 'With Kotbo',
      switchLabel: 'Compare the night without and with Kotbo',
      lockDate: 'Saturday, June 14',
      scene: 'fictional scene',
      sceneChaos: 'Fictional scene: a server owner’s lock screen at 2:47 a.m., without Kotbo.',
      sceneCalm: 'Fictional scene: the same screen, with Kotbo.',
      sleep: 'Go back to sleep.',
      now: 'now',
      ago: (m: number) => `${m}m ago`,
      chaos: [
        { app: 'Discord · #general', title: 'Lucas (mod)', body: 'bro we’re getting raided what do i do?? @Owner', tone: 'alarm' },
        { app: 'Discord · DM', title: 'Maxou', body: 'why am i banned?? i did nothing, this is power abuse', tone: 'alarm' },
        { app: 'Ticket bot', title: 'Ticket #148', body: 'Still unanswered after 3 hours' },
        { app: 'Discord · DM', title: 'Enzo (mod)', body: 'i’m out this weekend, tell the others pls' },
        { app: 'Spreadsheet', title: 'staff_schedule_FINAL_v3', body: 'Inès edited 14 cells' },
      ] as Notif[],
      calm: [
        { app: 'Discord · Kotbo in #staff-logs', title: 'Raid blocked at 02:13', body: '38 accounts removed automatically. The full report is waiting in the dashboard.', tone: 'ok' },
        { app: 'Discord · Kotbo in #staff-logs', title: 'Night recap', body: '2 tickets claimed by Lena · 1 time-off request to approve (Enzo, this weekend) · every sanction has its reason', tone: 'muted' },
      ] as Notif[],
    },
  };

  const t = $derived(TEXT[getLocale()]);
  let calm = $state(false);
  const list = $derived(calm ? t.calm : t.chaos);
</script>

<section id="nuit" aria-labelledby="night-title" class="relative bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="sticky top-0 z-20 bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="nuit" /></div>
  </div>
  <div class="mx-auto pt-14 lg:pt-20 grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
    <div>
      <h2 id="night-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
        {t.title}
      </h2>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-mist">{t.intro}</p>
      <p class="mt-10 font-semibold text-white">{t.hint}</p>
      <!-- La bascule : le seul geste de la zone. -->
      <div role="group" aria-label={t.switchLabel} class="mt-3 grid max-w-sm grid-cols-2 rounded-full border border-line-2 bg-night-2 p-1 text-sm font-semibold">
        <button
          type="button"
          aria-pressed={!calm}
          onclick={() => (calm = false)}
          class="min-h-10 rounded-full transition-colors {!calm ? 'bg-alarm text-night' : 'text-fog hover:text-white'}"
        >{t.without}</button>
        <button
          type="button"
          aria-pressed={calm}
          onclick={() => (calm = true)}
          class="min-h-10 rounded-full transition-colors {calm ? 'bg-[#4f46e5] text-white' : 'text-fog hover:text-white'}"
        >{t.with}</button>
      </div>

    </div>

    <div class="mx-auto w-full max-w-[24rem]">

      <!-- Le téléphone : une scène, annoncée comme telle avant son contenu. -->
      <figure aria-labelledby="night-scene" class="relative rounded-[2.75rem] border border-line-2 bg-black p-2.5">
        <figcaption id="night-scene" class="sr-only">{calm ? t.sceneCalm : t.sceneChaos}</figcaption>
        <div
          class="relative min-h-[40rem] overflow-hidden rounded-[2.25rem] pb-20 transition-[background] duration-700"
          style="background: {calm ? '#14132b' : '#1f0e0e'}"
        >
          <div aria-hidden="true" class="mx-auto mt-2.5 h-6 w-24 rounded-full bg-black"></div>
          <div class="mt-4 text-center text-white">
            <p class="text-sm font-medium text-white/70">{t.lockDate}</p>
            <p class="font-display text-7xl font-semibold tabular-nums tracking-tight">2:47</p>
          </div>

          <ul class="mt-5 space-y-2 px-3">
            {#each list as n, i (n.title)}
              <li
                class="notif rounded-2xl bg-white/10 px-3.5 py-2.5 backdrop-blur-md"
                style="--i: {i}"
              >
                <p class="flex items-center justify-between gap-2 text-[11px] font-medium uppercase tracking-wide text-white/55">
                  <span class="truncate">{n.app}</span>
                  <span class="shrink-0 normal-case tracking-normal">{i === 0 ? t.now : t.ago(i * 4)}</span>
                </p>
                <p class="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
                  {#if n.tone === 'alarm'}<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-alarm" aria-hidden="true"></span>{/if}
                  {#if n.tone === 'ok'}<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-ok" aria-hidden="true"></span>{/if}
                  {n.title}
                </p>
                <p class="text-[13px] leading-snug text-white/80">{n.body}</p>
              </li>
            {/each}
          </ul>

          {#if calm}
            <p class="sleep absolute inset-x-0 bottom-10 text-center font-display text-3xl font-extrabold text-white">{t.sleep}</p>
          {/if}
        </div>
      </figure>
      <p class="mt-3 text-center text-xs text-fog" aria-hidden="true">{t.scene}</p>
    </div>
  </div>
</section>

<style>
  .notif {
    animation: notif-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i) * 70ms);
  }
  .sleep {
    animation: notif-in 600ms ease both 300ms;
  }
  @keyframes notif-in {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.97);
    }
  }
</style>

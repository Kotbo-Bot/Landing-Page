<script lang="ts">
  /**
   * « T'as quel genre de serveur ? » : la question « c'est pour moi ? ».
   *
   * Quatre profils, ceux qui reviennent chez les admins qui installent un bot
   * de gestion : serveur RP, communauté gaming, serveur de créateur, grosse
   * communauté. Un choix montre ce que l'installation guidée proposera de
   * monter, et l'écrit dans le kit (`playground/kit.svelte.ts`) : vocation,
   * niveau de modération, pistes. Le bouton d'invitation l'emporte jusqu'au
   * dashboard, qui ne le redemande pas.
   *
   * Les salons listés sont une proposition, annoncée comme telle : rien n'est
   * créé tant que le staff n'a pas validé l'installation.
   */
  import { onMount } from 'svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { track } from '$lib/funnel';
  import { builder, TRACK_KEYS, type ModerationLevel, type ThemeKey, type TrackKey } from '$lib/playground/kit.svelte';
  import AddButton from './AddButton.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Profile = 'rp' | 'gaming' | 'creator' | 'big';

  const KITS: Record<Profile, { theme: ThemeKey; moderation: ModerationLevel; tracks: TrackKey[] }> = {
    rp: { theme: 'communaute', moderation: 'strict', tracks: ['greeting', 'rules', 'tickets', 'moderation', 'staff', 'logs'] },
    gaming: { theme: 'gaming', moderation: 'standard', tracks: ['greeting', 'tickets', 'moderation', 'levels', 'economy'] },
    creator: { theme: 'creation', moderation: 'standard', tracks: ['greeting', 'rules', 'moderation', 'levels', 'animation'] },
    big: { theme: 'entraide', moderation: 'strict', tracks: ['greeting', 'rules', 'tickets', 'moderation', 'staff', 'logs', 'levels'] },
  };

  const TEXT = {
    fr: {
      title: 'T’as quel genre de serveur ?',
      intro: 'Choisis, et regarde ce que Kotbo te prépare. Ton choix suit le bouton jusqu’à l’install, t’auras pas à le refaire.',
      pickLabel: 'Ton type de serveur',
      profiles: {
        rp: {
          label: 'Serveur RP / FiveM',
          pitch: 'Gros staff, plaintes, candidatures, sanctions contestées. Ici tout doit être tracé.',
          channels: ['📜 règlement', '📩 candidatures', '🎫 plaintes', '🎫 remboursements', '🛡️ staff-only', '🗓️ absences-staff', '🚨 sanctions-logs'],
          roles: ['Fondateur', 'Gérant staff', 'Modérateur', 'Support', 'Staff en test'],
        },
        gaming: {
          label: 'Commu gaming / esport',
          pitch: 'Des membres qui grind, des giveaways, des clans. Et zéro raid pendant les tournois.',
          channels: ['👋 bienvenue', '🏆 classement', '🎁 giveaways', '⚔️ clans', '💰 boutique', '🎫 support', '🚨 logs'],
          roles: ['Fondateur', 'Admin', 'Modérateur', 'Animateur'],
        },
        creator: {
          label: 'Streamer / créateur',
          pitch: 'Ta commu vit pendant tes lives, et doit tenir quand t’es pas là.',
          channels: ['🔴 annonces-live', '👋 bienvenue', '📜 règlement', '⭐ niveaux', '🎉 événements', '💡 suggestions'],
          roles: ['Créateur', 'Modérateur', 'VIP', 'Abonné'],
        },
        big: {
          label: 'Grosse commu / asso',
          pitch: 'Des milliers de membres, une vraie équipe, des process. Le mode ERP.',
          channels: ['👋 accueil', '📜 règlement', '🎫 support', '🛡️ staff', '📅 réunions', '🗓️ absences', '🚨 logs'],
          roles: ['Direction', 'Responsables', 'Modérateurs', 'Helpers', 'Recrues'],
        },
      } as Record<Profile, { label: string; pitch: string; channels: string[]; roles: string[] }>,
      tracks: {
        greeting: 'Accueil',
        rules: 'Règlement',
        tickets: 'Tickets',
        moderation: 'Modération',
        levels: 'Niveaux',
        economy: 'Économie',
        animation: 'Animation',
        staff: 'Gestion du staff',
        logs: 'Logs',
      } as Record<TrackKey, string>,
      moderation: { light: 'Modération légère', standard: 'Modération standard', strict: 'Modération stricte' } as Record<ModerationLevel, string>,
      channels: 'Salons proposés',
      modules: 'Modules activés',
      roles: 'Hiérarchie staff',
      proposal: 'Proposition de l’install guidée. Rien n’est créé sans ta validation.',
      empty: 'Choisis un profil à gauche.',
    },
    en: {
      title: 'What kind of server you running?',
      intro: 'Pick one and see what Kotbo gets ready for you. Your choice follows the button all the way to setup, you won’t redo it.',
      pickLabel: 'Your server type',
      profiles: {
        rp: {
          label: 'RP / FiveM server',
          pitch: 'Big staff, complaints, applications, disputed sanctions. Everything needs a paper trail.',
          channels: ['📜 rules', '📩 applications', '🎫 complaints', '🎫 refunds', '🛡️ staff-only', '🗓️ staff-time-off', '🚨 sanction-logs'],
          roles: ['Founder', 'Staff manager', 'Moderator', 'Support', 'Trial staff'],
        },
        gaming: {
          label: 'Gaming / esports community',
          pitch: 'Members who grind, giveaways, clans. And zero raids during tournaments.',
          channels: ['👋 welcome', '🏆 leaderboard', '🎁 giveaways', '⚔️ clans', '💰 shop', '🎫 support', '🚨 logs'],
          roles: ['Founder', 'Admin', 'Moderator', 'Event host'],
        },
        creator: {
          label: 'Streamer / creator',
          pitch: 'Your community lives during your streams, and has to hold up when you’re offline.',
          channels: ['🔴 live-alerts', '👋 welcome', '📜 rules', '⭐ levels', '🎉 events', '💡 suggestions'],
          roles: ['Creator', 'Moderator', 'VIP', 'Subscriber'],
        },
        big: {
          label: 'Big community / org',
          pitch: 'Thousands of members, a real team, real processes. ERP mode.',
          channels: ['👋 lobby', '📜 rules', '🎫 support', '🛡️ staff', '📅 meetings', '🗓️ time-off', '🚨 logs'],
          roles: ['Leadership', 'Leads', 'Moderators', 'Helpers', 'Recruits'],
        },
      } as Record<Profile, { label: string; pitch: string; channels: string[]; roles: string[] }>,
      tracks: {
        greeting: 'Welcome',
        rules: 'Rules',
        tickets: 'Tickets',
        moderation: 'Moderation',
        levels: 'Levels',
        economy: 'Economy',
        animation: 'Events',
        staff: 'Staff management',
        logs: 'Logs',
      } as Record<TrackKey, string>,
      moderation: { light: 'Light moderation', standard: 'Standard moderation', strict: 'Strict moderation' } as Record<ModerationLevel, string>,
      channels: 'Suggested channels',
      modules: 'Modules turned on',
      roles: 'Staff hierarchy',
      proposal: 'Guided setup proposal. Nothing is created until you confirm.',
      empty: 'Pick a profile on the left.',
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const PROFILES: Profile[] = ['rp', 'gaming', 'creator', 'big'];
  let profile = $state<Profile>('rp');
  let started = false;

  function choose(next: Profile) {
    profile = next;
    const kit = KITS[next];
    builder.setTheme(kit.theme);
    builder.kit.tracks = TRACK_KEYS.filter((k) => kit.tracks.includes(k));
    builder.kit.tracksEdited = false;
    // `setModeration` enregistre le kit (touch) : il passe en dernier.
    builder.setModeration(kit.moderation);
    if (!started) {
      started = true;
      track('playground_started', { content: 'setup' });
    }
  }

  onMount(() => builder.hydrate());

  const kit = $derived(KITS[profile]);
  const p = $derived(t.profiles[profile]);
</script>

<section id="setup" aria-labelledby="setup-title" class="bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="sticky top-16 z-20 bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="setup" /></div>
  </div>
  <div class="mx-auto pt-14 lg:pt-20 max-w-7xl px-4 sm:px-6">
    <div class="max-w-3xl">
      <h2 id="setup-title" class="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist">{t.intro}</p>
    </div>

    <div class="mt-14 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10">
      <div role="radiogroup" aria-label={t.pickLabel} class="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {#each PROFILES as key (key)}
          {@const on = profile === key}
          <button
            type="button"
            role="radio"
            aria-checked={on}
            onclick={() => choose(key)}
            class="group flex min-h-16 items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors {on
              ? 'border-glow/60 bg-[#4f46e5]/15'
              : 'border-line-2 bg-night-2 hover:border-fog'}"
          >
            <span>
              <span class="block font-display text-lg font-bold text-white">{t.profiles[key].label}</span>
              {#if on}<span class="block text-sm text-mist">{t.profiles[key].pitch}</span>{/if}
            </span>
          </button>
        {/each}
      </div>

      {#key profile}
        <div class="setup-out grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <!-- Côté Discord : la colonne de salons -->
          <div class="bg-[#2b2d31] p-4">
            <p class="px-2 text-xs font-semibold uppercase tracking-wide text-[#949ba4]">{t.channels}</p>
            <ul class="mt-2 space-y-0.5">
              {#each p.channels as channel, i (channel)}
                <li class="chan rounded-md px-2 py-1.5 text-[15px] text-[#b5bac1]" style="--i: {i}">
                  <span class="text-[#80848e]" aria-hidden="true">#</span> {channel}
                </li>
              {/each}
            </ul>
          </div>

          <!-- Côté dashboard -->
          <div class="flex flex-col gap-7 bg-night-2 p-6 sm:p-8">
            <div>
              <p class="text-sm font-semibold text-fog">{t.modules}</p>
              <ul class="mt-3 flex flex-wrap gap-2">
                {#each kit.tracks as tr, i (tr)}
                  <li class="chan rounded-lg bg-[#4f46e5]/20 px-3 py-1.5 text-sm font-semibold text-glow" style="--i: {i}">✓ {t.tracks[tr]}</li>
                {/each}
                <li class="chan rounded-lg bg-night-4 px-3 py-1.5 text-sm font-semibold text-mist" style="--i: {kit.tracks.length}">{t.moderation[kit.moderation]}</li>
              </ul>
            </div>
            <div>
              <p class="text-sm font-semibold text-fog">{t.roles}</p>
              <ol class="mt-3 space-y-1.5">
                {#each p.roles as role, i (role)}
                  <li class="chan flex items-center gap-3 text-white" style="--i: {i}; padding-left: {i * 14}px">
                    <span class="h-2.5 w-2.5 shrink-0 rounded-full" style="background: hsl({245 - i * 28} 80% 70%)" aria-hidden="true"></span>
                    {role}
                  </li>
                {/each}
              </ol>
            </div>
            <div class="mt-auto flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p class="max-w-xs text-xs text-fog">{t.proposal}</p>
              <AddButton content="setup" />
            </div>
          </div>
        </div>
      {/key}
    </div>
  </div>
</section>

<style>
  .setup-out {
    animation: fade 300ms ease both;
  }
  .chan {
    animation: fade 320ms ease both;
    animation-delay: calc(var(--i) * 45ms);
  }
  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
  }
</style>

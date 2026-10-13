<script lang="ts">
  /**
   * Les modules, en mosaïque.
   *
   * Cinq cases montrent un module en action (ce que le bot poste, ce que le
   * staff voit), la dernière déroule les 51 noms du catalogue. Chaque case qui
   * a sa page fonctionnalité y mène avec un lien qui dit ce qu'il y a au bout :
   * c'est le maillage que Google suit depuis l'accueil.
   *
   * La carte de rang est la vraie : `RankCanvas` dessine avec le code du bot
   * (dimensions, fonds, courbe d'XP). Le bouton « +XP » la fait monter, rien
   * d'autre ne bouge sans le visiteur. Les journaux et le ticket sont des
   * extraits fictifs, annoncés comme tels.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, STAFF_ROUTE } from '$lib/i18n/routes';
  import { ktb } from '$lib/playground/discord/theme';
  import RankCanvas from '$lib/playground/rank/RankCanvas.svelte';
  import MockStaff from '$lib/components/mockups/MockStaff.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  const SLUGS = {
    automod: { fr: 'automod-discord', en: 'discord-automod' },
    alts: { fr: 'detection-doubles-comptes', en: 'alt-account-detection' },
    logs: { fr: 'logs-discord', en: 'discord-logs' },
    tickets: { fr: 'tickets-discord', en: 'discord-tickets' },
    levels: { fr: 'niveaux-xp', en: 'leveling-xp' },
  };

  const TEXT = {
    fr: {
      title: 'Les 51 modules sont tous dans l’abonnement, et les prochains aussi.',
      intro: 'Tu actives ce dont ton serveur a besoin depuis le dashboard, et tu coupes le reste. Clique sur un module pour le voir tourner.',
      sample: 'extrait fictif',
      mod: {
        title: 'Modération & anti-raid',
        text: 'AutoMod, anti-raid, doubles comptes, sanctions graduées. Kotbo réagit en secondes, ton staff lit le rapport au réveil.',
        log: [
          ['02:13:04', 'raid détecté · 38 comptes en 9 s', 'alarm'],
          ['02:13:05', 'mode raid activé, invitations coupées', 'amber'],
          ['02:13:22', '38 comptes expulsés', 'ok'],
          ['02:13:23', 'double compte repéré : @maxou_2 → @maxou', 'amber'],
          ['02:14:00', 'rapport posté dans #staff-logs', 'ok'],
        ],
        links: [
          { slug: 'automod', label: 'AutoMod Discord' },
          { slug: 'alts', label: 'Détection des doubles comptes' },
        ],
      },
      tickets: {
        title: 'Tickets',
        text: 'Le membre clique, un fil privé s’ouvre, et le staff prend le ticket en un clic depuis Discord ou le dashboard. Le transcript reste.',
        embedTitle: 'Ticket #149 · Signalement',
        embedBody: 'Ouvert par Sarah. En attente d’un membre du staff.',
        claim: 'Prendre',
        close: 'Fermer',
        link: 'Le bot ticket Discord',
      },
      levels: {
        title: 'Niveaux & carte de rang',
        text: 'XP texte et vocal, rôles de niveau, et une carte que tes membres ont envie de poster. Ce rendu-là, c’est le vrai.',
        xp: '+ XP',
        cardName: 'Toi',
        cardLabel: (lvl: number) => `Carte de rang Kotbo, niveau ${lvl}`,
        link: 'Niveaux et XP sur Discord',
      },
      logs: {
        title: 'Logs',
        text: 'Message supprimé, rôle retiré, pseudo changé : Kotbo note qui l’a fait et quand, avec l’avant et l’après.',
        lines: ['Lena a retiré @VIP à Kylian', 'message supprimé dans #général', 'Zenox → Zen0x (pseudo)'],
        link: 'Les logs Discord',
      },
      staff: {
        title: 'Staff',
        text: 'Recrutement, absences, réunions, évaluations et hiérarchie. C’est le module qui fait de Kotbo un vrai outil de gestion d’équipe.',
        link: 'La gestion du staff',
      },
      rest: {
        title: 'Et 45 autres',
        text: 'Économie, giveaways, clans, quêtes, alertes YouTube et Twitch, traduction auto, formulaires, et un serveur MCP pour brancher une IA sur ton serveur.',
        all: 'Voir les 51 modules',
        names: [
          'Économie & RPG', 'Giveaways', 'Accueil & départ', 'Règlement', 'Rôles par réaction', 'Clans', 'Saisons', 'Quêtes',
          'Événements & quiz', 'Suggestions', 'YouTube', 'Twitch', 'Réseaux sociaux', 'Traduction auto', 'Formulaires',
          'Auto-réponses', 'Analytics', 'Appels de ban', 'Vérification', 'Marché entre membres', 'Réputation', 'Drops',
          'Prestige', 'Actualités & RSS', 'Automatisations', 'Serveur staff', 'Serveur MCP (IA)',
        ],
      },
    },
    en: {
      title: 'All 51 modules come with the subscription, and so will the next ones.',
      intro: 'Turn on what your server needs from the dashboard and switch off the rest. Click a module to see it run.',
      sample: 'fictional sample',
      mod: {
        title: 'Moderation & anti-raid',
        text: 'AutoMod, anti-raid, alt accounts, graduated sanctions. Kotbo reacts in seconds, your staff reads the report in the morning.',
        log: [
          ['02:13:04', 'raid detected · 38 accounts in 9 s', 'alarm'],
          ['02:13:05', 'raid mode on, invites paused', 'amber'],
          ['02:13:22', '38 accounts kicked', 'ok'],
          ['02:13:23', 'alt spotted: @maxou_2 → @maxou', 'amber'],
          ['02:14:00', 'report posted in #staff-logs', 'ok'],
        ],
        links: [
          { slug: 'automod', label: 'Discord AutoMod' },
          { slug: 'alts', label: 'Alt account detection' },
        ],
      },
      tickets: {
        title: 'Tickets',
        text: 'The member clicks, a private thread opens, and staff claim it in one click from Discord or the dashboard. The transcript stays.',
        embedTitle: 'Ticket #149 · Report',
        embedBody: 'Opened by Sarah. Waiting for a staff member.',
        claim: 'Claim',
        close: 'Close',
        link: 'The Discord ticket bot',
      },
      levels: {
        title: 'Levels & rank card',
        text: 'Text and voice XP, level roles, and a card your members actually want to post. This render is the real one.',
        xp: '+ XP',
        cardName: 'You',
        cardLabel: (lvl: number) => `Kotbo rank card, level ${lvl}`,
        link: 'Discord levels and XP',
      },
      logs: {
        title: 'Logs',
        text: 'Deleted message, removed role, changed nickname: Kotbo logs who did it and when, with the before and after.',
        lines: ['Lena removed @VIP from Kylian', 'message deleted in #general', 'Zenox → Zen0x (nickname)'],
        link: 'Discord logs',
      },
      staff: {
        title: 'Staff',
        text: 'Recruitment, time off, meetings, reviews and hierarchy. This is the module that turns Kotbo into a real team tool.',
        link: 'Staff management',
      },
      rest: {
        title: 'And 45 more',
        text: 'Economy, giveaways, clans, quests, YouTube and Twitch alerts, auto-translate, forms, and an MCP server to plug an AI into your server.',
        all: 'See all 51 modules',
        names: [
          'Economy & RPG', 'Giveaways', 'Welcome & goodbye', 'Rules', 'Reaction roles', 'Clans', 'Seasons', 'Quests',
          'Events & quizzes', 'Suggestions', 'YouTube', 'Twitch', 'Social media', 'Auto-translate', 'Forms',
          'Auto-replies', 'Analytics', 'Ban appeals', 'Verification', 'Member market', 'Reputation', 'Drops',
          'Prestige', 'News & RSS', 'Automations', 'Staff server', 'MCP server (AI)',
        ],
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());
  const link = (slug: keyof typeof SLUGS) => `${base}${featurePath(SLUGS[slug], locale)}`;

  let level = $state(7);
  let progress = $state(0.62);
  let bump = $state(false);

  function addXp() {
    progress += 0.21;
    if (progress >= 1) {
      progress -= 1;
      level += 1;
      bump = true;
      setTimeout(() => (bump = false), 700);
    }
  }

  const TONE: Record<string, string> = { alarm: 'text-alarm', amber: 'text-amber', ok: 'text-ok' };

  type Key = 'mod' | 'tickets' | 'levels' | 'logs' | 'staff' | 'rest';
  const KEYS: Key[] = ['mod', 'tickets', 'levels', 'staff', 'logs', 'rest'];
  const ICONS: Record<Key, string> = { mod: 'shield', tickets: 'ticket', levels: 'level', logs: 'info', staff: 'mod', rest: 'star' };
  let active = $state<Key>('mod');
</script>

<section id="modules" aria-labelledby="arsenal-title" class="bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="sticky top-16 z-20 bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="modules" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-3xl">
      <h2 id="arsenal-title" class="font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist text-pretty">{t.intro}</p>
    </div>

    <div class="mt-14 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <ul class="border-t border-line">
        {#each KEYS as key (key)}
          {@const on = active === key}
          <li class="border-b border-line">
            <button
              type="button"
              aria-expanded={on}
              onclick={() => (active = key)}
              class="group flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span class="font-display text-2xl font-extrabold tracking-tight transition-colors {on ? 'text-white' : 'text-mist group-hover:text-white'}">{t[key].title}</span>
              <img src={ktb(ICONS[key])} alt="" width="28" height="28" class="h-7 w-7 shrink-0 transition-opacity {on ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}" />
            </button>
            {#if on}
              <div class="pb-6">
                <p class="max-w-lg leading-relaxed text-mist">{t[key].text}</p>
                <div class="mt-5 lg:hidden">{@render preview(key)}</div>
                {@render links(key)}
              </div>
            {/if}
          </li>
        {/each}
      </ul>

      <div class="hidden lg:block">
        <div class="sticky top-36">
          {#key active}
            <div class="arsenal-in">{@render preview(active)}</div>
          {/key}
        </div>
      </div>
    </div>
  </div>
</section>

{#snippet links(key: Key)}
  <p class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
    {#if key === 'mod'}
      {#each t.mod.links as l (l.slug)}
        <a href={link(l.slug as keyof typeof SLUGS)} class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{l.label}</a>
      {/each}
    {:else if key === 'tickets'}
      <a href={link('tickets')} class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.tickets.link}</a>
    {:else if key === 'levels'}
      <a href={link('levels')} class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.levels.link}</a>
    {:else if key === 'logs'}
      <a href={link('logs')} class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.logs.link}</a>
    {:else if key === 'staff'}
      <a href="{base}{STAFF_ROUTE[locale]}" class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.staff.link}</a>
    {:else}
      <a href="{base}{locale === 'fr' ? '/fonctionnalites' : '/en/features'}" class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.rest.all}</a>
    {/if}
  </p>
{/snippet}

{#snippet preview(key: Key)}
  {#if key === 'mod'}
    <div class="overflow-x-auto rounded-2xl bg-black p-5 font-mono text-[12.5px] leading-6 sm:text-sm">
      {#each t.mod.log as [time, text, tone] (time)}
        <p class="flex gap-3 whitespace-nowrap"><span class="shrink-0 text-fog">[{time}]</span><span class={TONE[tone]}>{text}</span></p>
      {/each}
      <p class="mt-3 text-[10px] uppercase text-fog">{t.sample}</p>
    </div>
  {:else if key === 'tickets'}
    <div class="rounded-2xl bg-[#313338] p-5">
      <div class="flex gap-3">
        <img src="{base}/favicon.svg" alt="" width="40" height="40" class="h-10 w-10 rounded-full" />
        <div class="min-w-0 flex-1">
          <p class="flex items-center gap-1.5"><span class="font-semibold text-white">Kotbo</span><span class="rounded bg-blurple px-1 text-[10px] font-semibold leading-4 text-white">APP</span></p>
          <div class="mt-1.5 rounded border-l-4 border-[#eb459e] bg-[#2b2d31] p-4 text-sm text-[#dbdee1]">
            <p class="font-semibold text-white">{t.tickets.embedTitle}</p>
            <p class="mt-1">{t.tickets.embedBody}</p>
          </div>
          <div class="mt-2 flex gap-2" aria-hidden="true">
            <span class="rounded bg-[#248046] px-4 py-1.5 text-sm font-medium text-white">{t.tickets.claim}</span>
            <span class="rounded bg-[#da373c] px-4 py-1.5 text-sm font-medium text-white">{t.tickets.close}</span>
          </div>
        </div>
      </div>
      <p class="mt-4 font-mono text-[10px] uppercase text-[#949ba4]">{t.sample}</p>
    </div>
  {:else if key === 'levels'}
    <div>
      <div class="rounded-2xl bg-[#1e1f22] p-2.5 transition-transform {bump ? 'scale-[1.02]' : ''}">
        <RankCanvas
          name={t.levels.cardName}
          tag="@{t.levels.cardName.toLowerCase()}"
          {level}
          {progress}
          rank={3}
          backgroundId="aurora"
          font="default"
          avatarSrc={null}
          badges={['quests_50']}
          label={t.levels.cardLabel(level)}
        />
      </div>
      <button type="button" onclick={addXp} class="mt-4 min-h-11 rounded-lg bg-night-4 px-5 font-mono text-sm font-bold text-white transition-colors hover:bg-[#4f46e5]">
        {t.levels.xp}
      </button>
    </div>
  {:else if key === 'logs'}
    <ul class="space-y-2 rounded-2xl bg-black p-5 font-mono text-[13px]">
      {#each t.logs.lines as line (line)}
        <li class="rounded-md bg-night-3 px-3 py-2 text-mist">{line}</li>
      {/each}
      <li class="pt-1 text-[10px] uppercase text-fog">{t.sample}</li>
    </ul>
  {:else if key === 'staff'}
    <div class="dash-dark overflow-hidden rounded-2xl border border-line">
      <div class="flex h-[26rem] flex-col"><MockStaff /></div>
    </div>
  {:else}
    <ul class="flex flex-wrap gap-2">
      {#each t.rest.names as name (name)}
        <li class="rounded-full border border-line-2 px-3.5 py-1.5 text-sm text-mist">{name}</li>
      {/each}
    </ul>
  {/if}
{/snippet}

<style>
  .arsenal-in {
    animation: arsenal-in 320ms ease both;
  }
  @keyframes arsenal-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
</style>

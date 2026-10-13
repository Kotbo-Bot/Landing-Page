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
  import { reveal } from '$lib/actions/reveal';
  import { ktb } from '$lib/playground/discord/theme';
  import RankCanvas from '$lib/playground/rank/RankCanvas.svelte';

  const SLUGS = {
    automod: { fr: 'automod-discord', en: 'discord-automod' },
    alts: { fr: 'detection-doubles-comptes', en: 'alt-account-detection' },
    logs: { fr: 'logs-discord', en: 'discord-logs' },
    tickets: { fr: 'tickets-discord', en: 'discord-tickets' },
    levels: { fr: 'niveaux-xp', en: 'leveling-xp' },
  };

  const TEXT = {
    fr: {
      kicker: '/modules',
      title: '51 modules. Un seul bot. Zéro option payante en plus.',
      intro: 'Tout est inclus dans l’abonnement, même ce qui sortira plus tard. Tu actives ce que tu veux depuis le dashboard.',
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
        text: 'Un bouton, un fil privé, un transcript. Le staff prend le ticket en un clic, depuis Discord ou le dashboard.',
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
        text: 'Message supprimé, rôle modifié, pseudo changé : qui, quand, avant, après.',
        lines: ['Lena a retiré @VIP à Kylian', 'message supprimé dans #général', 'Zenox → Zen0x (pseudo)'],
        link: 'Les logs Discord',
      },
      staff: {
        title: 'Staff',
        text: 'Recrutement, absences, réunions, évaluations, hiérarchie. Le module que les autres bots n’ont pas.',
        link: 'La gestion du staff',
      },
      rest: {
        title: 'Et tout le reste',
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
      kicker: '/modules',
      title: '51 modules. One bot. Zero paid add-ons.',
      intro: 'Everything is in the subscription, even what ships later. Turn on what you want from the dashboard.',
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
        text: 'One button, one private thread, one transcript. Staff claim a ticket in a click, from Discord or the dashboard.',
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
        text: 'Deleted message, edited role, changed nickname: who, when, before, after.',
        lines: ['Lena removed @VIP from Kylian', 'message deleted in #general', 'Zenox → Zen0x (nickname)'],
        link: 'Discord logs',
      },
      staff: {
        title: 'Staff',
        text: 'Recruitment, time off, meetings, reviews, hierarchy. The module other bots don’t have.',
        link: 'Staff management',
      },
      rest: {
        title: 'And everything else',
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
</script>

<section id="modules" aria-labelledby="arsenal-title" class="border-t border-line bg-night-2 py-24 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div use:reveal={{ direction: 'up' }} class="max-w-3xl">
      <p class="font-mono text-sm text-glow">{t.kicker}</p>
      <h2 id="arsenal-title" class="mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist">{t.intro}</p>
    </div>

    <div class="mt-14 grid gap-4 lg:grid-cols-6">
      <!-- Modération : la plus grande case, c'est ce qu'on installe en premier -->
      <article use:reveal={{ direction: 'up' }} class="flex flex-col rounded-3xl border border-line bg-night p-6 sm:p-8 lg:col-span-4">
        <div class="flex items-center gap-3">
          <img src={ktb('shield')} alt="" width="28" height="28" class="h-7 w-7" />
          <h3 class="font-display text-2xl font-extrabold text-white">{t.mod.title}</h3>
        </div>
        <p class="mt-3 max-w-xl text-fog">{t.mod.text}</p>
        <div class="mt-6 flex-1 rounded-xl border border-line bg-black/60 p-4 font-mono text-[12.5px] leading-6 sm:text-sm">
          {#each t.mod.log as [time, text, tone] (time)}
            <p class="flex gap-3"><span class="shrink-0 text-fog">[{time}]</span><span class={TONE[tone]}>{text}</span></p>
          {/each}
          <p class="mt-2 text-[10px] uppercase text-fog/80">{t.sample}</p>
        </div>
        <p class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {#each t.mod.links as l (l.slug)}
            <a href={link(l.slug as keyof typeof SLUGS)} class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{l.label}</a>
          {/each}
        </p>
      </article>

      <!-- Tickets -->
      <article use:reveal={{ direction: 'up', delay: 80 }} class="flex flex-col rounded-3xl border border-line bg-night p-6 sm:p-8 lg:col-span-2">
        <div class="flex items-center gap-3">
          <img src={ktb('ticket')} alt="" width="28" height="28" class="h-7 w-7" />
          <h3 class="font-display text-2xl font-extrabold text-white">{t.tickets.title}</h3>
        </div>
        <p class="mt-3 text-fog">{t.tickets.text}</p>
        <div class="mt-6 flex-1 rounded-lg border-l-4 border-[#eb459e] bg-[#2b2d31] p-4 text-sm text-[#dbdee1]">
          <p class="font-semibold text-white">{t.tickets.embedTitle}</p>
          <p class="mt-1">{t.tickets.embedBody}</p>
          <div class="mt-3 flex gap-2" aria-hidden="true">
            <span class="rounded bg-[#248046] px-3 py-1.5 text-xs font-semibold text-white">{t.tickets.claim}</span>
            <span class="rounded bg-[#da373c] px-3 py-1.5 text-xs font-semibold text-white">{t.tickets.close}</span>
          </div>
        </div>
        <a href={link('tickets')} class="mt-5 text-sm font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.tickets.link}</a>
      </article>

      <!-- Niveaux : la carte du bot -->
      <article use:reveal={{ direction: 'up' }} class="flex flex-col rounded-3xl border border-line bg-night p-6 sm:p-8 lg:col-span-3">
        <div class="flex items-center gap-3">
          <img src={ktb('level')} alt="" width="28" height="28" class="h-7 w-7" />
          <h3 class="font-display text-2xl font-extrabold text-white">{t.levels.title}</h3>
        </div>
        <p class="mt-3 text-fog">{t.levels.text}</p>
        <div class="mt-6 rounded-2xl bg-[#1e1f22] p-2.5 transition-transform {bump ? 'scale-[1.02]' : ''}">
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
        <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
          <a href={link('levels')} class="text-sm font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.levels.link}</a>
          <button type="button" onclick={addXp} class="min-h-10 rounded-lg bg-night-4 px-4 font-mono text-sm font-bold text-white transition-colors hover:bg-[#4f46e5]">
            {t.levels.xp}
          </button>
        </div>
      </article>

      <!-- Logs + Staff, empilés -->
      <div class="grid gap-4 lg:col-span-3">
        <article use:reveal={{ direction: 'up', delay: 80 }} class="rounded-3xl border border-line bg-night p-6 sm:p-8">
          <div class="flex items-center gap-3">
            <img src={ktb('info')} alt="" width="28" height="28" class="h-7 w-7" />
            <h3 class="font-display text-2xl font-extrabold text-white">{t.logs.title}</h3>
          </div>
          <p class="mt-3 text-fog">{t.logs.text}</p>
          <ul class="mt-4 space-y-1.5 font-mono text-[12.5px]">
            {#each t.logs.lines as line (line)}
              <li class="truncate rounded-md bg-night-3 px-3 py-1.5 text-mist">{line}</li>
            {/each}
          </ul>
          <a href={link('logs')} class="mt-5 inline-block text-sm font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.logs.link}</a>
        </article>
        <article use:reveal={{ direction: 'up', delay: 140 }} class="rounded-3xl border border-glow/30 bg-[#4f46e5]/10 p-6 sm:p-8">
          <div class="flex items-center gap-3">
            <img src={ktb('mod')} alt="" width="28" height="28" class="h-7 w-7" />
            <h3 class="font-display text-2xl font-extrabold text-white">{t.staff.title}</h3>
          </div>
          <p class="mt-3 text-mist">{t.staff.text}</p>
          <a href="{base}{STAFF_ROUTE[locale]}" class="mt-5 inline-block text-sm font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.staff.link}</a>
        </article>
      </div>

      <!-- Le reste du catalogue -->
      <article use:reveal={{ direction: 'up' }} class="rounded-3xl border border-line bg-night p-6 sm:p-8 lg:col-span-6">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h3 class="font-display text-2xl font-extrabold text-white">{t.rest.title}</h3>
          <a href="{base}{locale === 'fr' ? '/fonctionnalites' : '/en/features'}" class="text-sm font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.rest.all}</a>
        </div>
        <ul class="mt-6 flex flex-wrap gap-2">
          {#each t.rest.names as name (name)}
            <li class="rounded-full border border-line-2 px-3.5 py-1.5 text-sm text-mist">{name}</li>
          {/each}
        </ul>
      </article>
    </div>
  </div>
</section>

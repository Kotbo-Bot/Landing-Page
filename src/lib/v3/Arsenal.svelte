<script lang="ts">
  /**
   * Les modules : cinq en action, puis le catalogue entier.
   *
   * Cinq onglets montrent un module en marche (le journal de l'anti-raid, un
   * ticket, la carte de rang, un giveaway, les logs), le dernier ouvre le
   * catalogue rangé comme dans le dashboard (`modules.ts`), une catégorie à
   * la fois : les 58 d'un bloc se lisaient comme un mur. Le staff n'a pas d'onglet :
   * le QG, juste au-dessus, montre déjà ses vrais écrans.
   *
   * Chaque aperçu se joue et rien ne bouge sans le visiteur. Le ticket reprend
   * les boutons et les messages du bot (`ticketService.ts`), les logs ses
   * embeds (`advancedLogs.ts`, `logDispatch.ts`), le giveaway ses textes par
   * défaut (`giveawayAppearance.ts`), la carte de rang son code de
   * dessin (`RankCanvas`). Les membres sont fictifs, annoncés comme tels.
   *
   * Un module qui a sa page fonctionnalité y mène : c'est le maillage que
   * Google suit depuis l'accueil. Les liens se cherchent dans `FEATURES`, une
   * page dépubliée disparaît donc d'ici sans lien mort.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { featurePath, STAFF_ROUTE } from '$lib/i18n/routes';
  import { FEATURES } from '$lib/data/features';
  import { ktb } from '$lib/playground/discord/theme';
  import Embed from '$lib/playground/discord/Embed.svelte';
  import DcButton from '$lib/playground/discord/DcButton.svelte';
  import RankCanvas from '$lib/playground/rank/RankCanvas.svelte';
  import ChannelHeader from './ChannelHeader.svelte';
  import { CATALOG, MODULE_COUNT } from './modules';

  type LogKey = 'edit' | 'delete' | 'roles';

  const TEXT = {
    fr: {
      title: `Les ${MODULE_COUNT} modules sont tous dans l’abonnement, et les prochains aussi`,
      intro: 'Tu actives ce dont ton serveur a besoin depuis le dashboard, et tu coupes le reste. Ouvre un module pour le voir tourner',
      sample: 'démo, membres fictifs',
      mod: {
        title: 'Modération & anti-raid',
        text: 'AutoMod, anti-raid, doubles comptes, sanctions graduées. Kotbo réagit en secondes, ton staff lit le rapport au réveil',
        log: [
          ['02:13:04', 'raid détecté · 38 comptes en 9 s', 'alarm'],
          ['02:13:05', 'mode raid activé, invitations coupées', 'amber'],
          ['02:13:22', '38 comptes expulsés', 'ok'],
          ['02:13:23', 'double compte repéré : @maxou_2 → @maxou', 'amber'],
          ['02:14:00', 'rapport posté dans #staff-logs', 'ok'],
        ],
      },
      tickets: {
        title: 'Tickets',
        text: 'Le membre ouvre un ticket, ton staff le prend en un clic depuis Discord ou le dashboard, et le transcript reste après la fermeture',
        channel: '#ticket-149',
        openTitle: 'Ticket #149 · Signalement',
        author: 'Auteur',
        reason: 'Raison',
        reasonValue: 'Signalement',
        description: 'Description',
        descriptionValue: 'Un membre m’envoie des liens chelous en MP',
        claim: 'Prendre en charge',
        close: 'Fermer',
        claimedTitle: 'Pris en charge',
        claimedBody: 'Ce ticket est désormais pris en charge par @toi.',
        closedTitle: 'Ticket Fermé',
        closedBody: 'Le ticket a été fermé par @toi. Le personnel peut le réouvrir, l’archiver en lecture seule sans rien perdre, le protéger contre la suppression, ou le supprimer définitivement.',
        replay: 'Rejouer',
        status: { open: 'Ticket ouvert, en attente du staff', claimed: 'Ticket pris en charge', closed: 'Ticket fermé' },
      },
      levels: {
        title: 'Niveaux & carte de rang',
        text: 'XP texte et vocal, rôles de niveau, et une carte que tes membres ont envie de poster. Ce rendu-là, c’est le vrai',
        xp: '+ XP',
        cardName: 'Toi',
        cardLabel: (lvl: number) => `Carte de rang Kotbo, niveau ${lvl}`,
      },
      giveaways: {
        title: 'Giveaways',
        text: 'Un bouton pour participer, un deuxième clic pour se retirer, et le tirage tombe tout seul à la fin. Tu peux aussi fermer la porte aux doubles comptes',
        channel: '#giveaways',
        prize: 'GIVEAWAY : Nitro 1 mois',
        cta: 'Cliquez sur le bouton ci-dessous pour participer !',
        ends: 'Fin :',
        endsValue: 'dans 2 jours',
        winners: 'Nombre de gagnants :',
        entrants: 'Participants :',
        footer: 'ID : 8f3a2c',
        join: 'Rejoindre',
        joined: 'Inscription validée ! Bonne chance !',
        left: 'Vous vous êtes retiré du giveaway.',
        ephemeral: 'Seul toi peux voir ce message',
        status: (n: number) => `${n} participants`,
      },
      logs: {
        title: 'Logs',
        text: 'Message modifié, message supprimé, rôle retiré : Kotbo note qui l’a fait et quand, avec l’avant et l’après',
        channel: '#logs',
        listLabel: 'Entrées du journal',
        entries: {
          edit: {
            row: 'Zenox a modifié un message',
            title: 'Message modifié',
            color: '#f4a261',
            icon: 'msg',
            fields: [
              { name: 'Salon', value: '#général' },
              { name: 'Auteur', value: '@zenox' },
              { name: 'Avant', value: 'je te file mon compte si tu me passes modo', inline: false },
              { name: 'Après', value: 'ok', inline: false },
            ],
          },
          delete: {
            row: 'Lena a supprimé un message de Kylian',
            title: 'Message supprimé',
            color: '#e63946',
            icon: 'cross',
            fields: [
              { name: 'Salon', value: '#général' },
              { name: 'Auteur', value: '@kylian' },
              { name: 'Supprimé par', value: '@lena' },
              { name: 'Contenu', value: 'NITRO GRATUIT pour les 50 premiers, clique vite', inline: false },
            ],
          },
          roles: {
            row: 'Lena a retiré @VIP à Kylian',
            title: 'Rôles membre modifiés',
            color: '#6d597a',
            icon: 'profile',
            fields: [
              { name: 'Membre', value: '@kylian', inline: false },
              { name: 'Changements', value: 'Rôles ajoutés : Aucun\nRôles retirés : @VIP', inline: false },
            ],
            footer: 'Action réalisée par lena',
          },
        } as Record<LogKey, { row: string; title: string; color: string; icon: string; fields: { name: string; value: string; inline?: boolean }[]; footer?: string }>,
      },
      all: {
        title: `Les ${MODULE_COUNT}, par catégorie`,
        text: 'Rangés comme dans le dashboard. Choisis une catégorie, ceux en bleu ont leur page',
        catsLabel: 'Catégories de modules',
                staffNote: 'leurs écrans sont dans le QG',
        hub: `Voir les fonctionnalités en détail`,
      },
    },
    en: {
      title: `All ${MODULE_COUNT} modules come with the subscription, and so will the next ones`,
      intro: 'Turn on what your server needs from the dashboard and switch off the rest. Open a module to see it run',
      sample: 'demo, fictional members',
      mod: {
        title: 'Moderation & anti-raid',
        text: 'AutoMod, anti-raid, alt accounts, graduated sanctions. Kotbo reacts in seconds, your staff reads the report in the morning',
        log: [
          ['02:13:04', 'raid detected · 38 accounts in 9 s', 'alarm'],
          ['02:13:05', 'raid mode on, invites paused', 'amber'],
          ['02:13:22', '38 accounts kicked', 'ok'],
          ['02:13:23', 'alt spotted: @maxou_2 → @maxou', 'amber'],
          ['02:14:00', 'report posted in #staff-logs', 'ok'],
        ],
      },
      tickets: {
        title: 'Tickets',
        text: 'A member opens a ticket, your staff claim it in one click from Discord or the dashboard, and the transcript stays after it’s closed',
        channel: '#ticket-149',
        openTitle: 'Ticket #149 · Report',
        author: 'Author',
        reason: 'Reason',
        reasonValue: 'Report',
        description: 'Description',
        descriptionValue: 'Someone keeps DMing me sketchy links',
        claim: 'Claim',
        close: 'Close',
        claimedTitle: 'Claimed',
        claimedBody: 'This ticket is now handled by @you.',
        closedTitle: 'Ticket Closed',
        closedBody: 'The ticket was closed by @you. Staff can reopen it, archive it read-only without losing anything, protect it from deletion, or delete it for good.',
        replay: 'Replay',
        status: { open: 'Ticket open, waiting for staff', claimed: 'Ticket claimed', closed: 'Ticket closed' },
      },
      levels: {
        title: 'Levels & rank card',
        text: 'Text and voice XP, level roles, and a card your members actually want to post. This render is the real one',
        xp: '+ XP',
        cardName: 'You',
        cardLabel: (lvl: number) => `Kotbo rank card, level ${lvl}`,
      },
      giveaways: {
        title: 'Giveaways',
        text: 'One button to enter, a second click to back out, and the draw happens on its own at the end. You can also keep alt accounts out',
        channel: '#giveaways',
        prize: 'GIVEAWAY: 1 month of Nitro',
        cta: 'Click the button below to enter!',
        ends: 'Ends:',
        endsValue: 'in 2 days',
        winners: 'Winners:',
        entrants: 'Entrants:',
        footer: 'ID: 8f3a2c',
        join: 'Enter',
        joined: 'You are in! Good luck!',
        left: 'You have withdrawn from the giveaway.',
        ephemeral: 'Only you can see this',
        status: (n: number) => `${n} entrants`,
      },
      logs: {
        title: 'Logs',
        text: 'Edited message, deleted message, removed role: Kotbo logs who did it and when, with the before and after',
        channel: '#logs',
        listLabel: 'Log entries',
        entries: {
          edit: {
            row: 'Zenox edited a message',
            title: 'Message edited',
            color: '#f4a261',
            icon: 'msg',
            fields: [
              { name: 'Channel', value: '#general' },
              { name: 'Author', value: '@zenox' },
              { name: 'Before', value: 'i’ll give you my account if you make me mod', inline: false },
              { name: 'After', value: 'ok', inline: false },
            ],
          },
          delete: {
            row: 'Lena deleted a message from Kylian',
            title: 'Message deleted',
            color: '#e63946',
            icon: 'cross',
            fields: [
              { name: 'Channel', value: '#general' },
              { name: 'Author', value: '@kylian' },
              { name: 'Deleted by', value: '@lena' },
              { name: 'Content', value: 'FREE NITRO for the first 50, click fast', inline: false },
            ],
          },
          roles: {
            row: 'Lena removed @VIP from Kylian',
            title: 'Member roles updated',
            color: '#6d597a',
            icon: 'profile',
            fields: [
              { name: 'Member', value: '@kylian', inline: false },
              { name: 'Changes', value: 'Roles added: None\nRoles removed: @VIP', inline: false },
            ],
            footer: 'Action taken by lena',
          },
        } as Record<LogKey, { row: string; title: string; color: string; icon: string; fields: { name: string; value: string; inline?: boolean }[]; footer?: string }>,
      },
      all: {
        title: `All ${MODULE_COUNT}, by category`,
        text: 'Sorted the way the dashboard sorts them. Pick a category, the blue ones have their own page',
        catsLabel: 'Module categories',
                staffNote: 'their screens are in the HQ',
        hub: 'See the features in detail',
      },
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const locale = $derived(getLocale());

  /** La page fonctionnalité d'un module, si elle est publiée. */
  function pageOf(key: string, frName?: string): string | null {
    const page = FEATURES.find((f) => f.key === key || (frName !== undefined && f.modules.includes(frName)));
    return page ? `${base}${featurePath(page.slug, locale)}` : null;
  }

  /** Les liens sous chaque onglet : modules du registre, dans l'ordre. */
  const LINKS: Record<Exclude<Key, 'all'>, string[]> = {
    mod: ['automod', 'double_accounts'],
    tickets: ['tickets'],
    levels: ['leveling'],
    giveaways: ['giveaways'],
    logs: ['logs'],
  };
  const nameOf = (key: string) => CATALOG.flatMap((c) => c.modules).find((mod) => mod.key === key)?.name[locale] ?? key;

  // Niveaux
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

  // Ticket
  let ticket = $state<'open' | 'claimed' | 'closed'>('open');

  // Giveaway : le bouton du bot inscrit, puis désinscrit au clic suivant.
  let entrants = $state(47);
  let entered = $state(false);
  let reply = $state<'joined' | 'left' | null>(null);

  function toggleEntry() {
    entered = !entered;
    entrants += entered ? 1 : -1;
    reply = entered ? 'joined' : 'left';
  }

  // Catalogue : une catégorie à la fois
  let category = $state(CATALOG[0].key);

  // Logs
  let log = $state<LogKey>('edit');
  const LOG_KEYS: LogKey[] = ['edit', 'delete', 'roles'];

  const TONE: Record<string, string> = { alarm: 'text-alarm', amber: 'text-amber', ok: 'text-ok' };

  type Key = 'mod' | 'tickets' | 'levels' | 'giveaways' | 'logs' | 'all';
  const KEYS: Key[] = ['mod', 'tickets', 'levels', 'giveaways', 'logs', 'all'];
  const ICONS: Record<Key, string> = { mod: 'shield', tickets: 'ticket', levels: 'level', giveaways: 'trophy', logs: 'info', all: 'star' };
  let active = $state<Key>('mod');
</script>

<section id="modules" aria-labelledby="arsenal-title" class="bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="modules" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <div class="max-w-3xl">
      <h2 id="arsenal-title" class="font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-balance text-ink sm:text-5xl lg:text-6xl">{t.title}</h2>
      <p class="mt-6 text-lg text-mist text-pretty">{t.intro}</p>
    </div>

    <div class="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
      <ul class="self-start border-t border-line">
        {#each KEYS as key (key)}
          {@const on = active === key}
          <li class="border-b border-line">
            <button
              type="button"
              aria-expanded={on}
              aria-controls="mod-{key}"
              onclick={() => (active = key)}
              class="group flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span class="font-display text-2xl font-extrabold tracking-tight transition-colors {on ? 'text-ink' : 'text-mist group-hover:text-ink'}">{t[key].title}</span>
              <img src={ktb(ICONS[key])} alt="" width="28" height="28" class="h-7 w-7 shrink-0 transition-opacity {on ? 'opacity-100' : 'opacity-40 group-hover:opacity-70'}" />
            </button>
            <!-- Le texte et les liens de chaque module restent dans la page,
                 masqués tant que l'onglet est fermé : les moteurs les lisent
                 tous. L'aperçu, lui, ne se monte qu'à l'ouverture, sauf le
                 catalogue, qui n'est que du texte. -->
            <div id="mod-{key}" class="pb-6" hidden={!on}>
              <p class="max-w-lg leading-relaxed text-mist">{t[key].text}</p>
              {#if on || key === 'all'}<div class="mt-5 lg:hidden">{@render preview(key)}</div>{/if}
              {@render links(key)}
            </div>
          </li>
        {/each}
      </ul>

      <div class="hidden lg:block">
        <div class="sticky top-24">
          {#key active}
            <div class="arsenal-in">{@render preview(active)}</div>
          {/key}
        </div>
      </div>
    </div>
  </div>
</section>

{#snippet links(key: Key)}
  {#if key === 'all'}
    <p class="mt-5 text-sm font-semibold">
      <a href="{base}{locale === 'fr' ? '/fonctionnalites' : '/en/features'}" class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{t.all.hub}</a>
    </p>
  {:else}
    {@const pages = LINKS[key].map((k) => ({ k, href: pageOf(k) })).filter((p) => p.href)}
    {#if pages.length > 0}
      <p class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
        {#each pages as p (p.k)}
          <a href={p.href} class="text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{nameOf(p.k)}</a>
        {/each}
      </p>
    {/if}
  {/if}
{/snippet}

{#snippet discordHead(channel: string)}
  <p class="mb-3 flex items-center justify-between gap-3 border-b border-black/30 pb-3 text-sm">
    <span class="font-semibold text-[#f2f3f5]">{channel}</span>
    <span class="font-mono text-[10px] uppercase text-[#949ba4]">{t.sample}</span>
  </p>
{/snippet}

{#snippet kotbo(time: string)}
  <p class="flex items-center gap-1.5">
    <span class="font-semibold text-ink">Kotbo</span>
    <span class="rounded bg-blurple px-1 text-[10px] font-semibold leading-4 text-white">APP</span>
    <span class="text-xs text-[#949ba4]">{time}</span>
  </p>
{/snippet}

{#snippet preview(key: Key)}
  {#if key === 'mod'}
    <div class="stay-dark rounded-2xl bg-black p-5 font-mono text-[12.5px] leading-6 sm:text-sm">
      {#each t.mod.log as [time, text, tone] (time)}
        <p class="flex gap-3"><span class="shrink-0 text-fog">[{time}]</span><span class="min-w-0 break-words {TONE[tone]}">{text}</span></p>
      {/each}
      <p class="mt-3 text-[10px] uppercase text-fog">{t.sample}</p>
    </div>
  {:else if key === 'tickets'}
    <div class="stay-dark rounded-2xl bg-[#313338] p-5">
      {@render discordHead(t.tickets.channel)}
      <div class="flex gap-3">
        <img src="{base}/favicon.svg" alt="" width="40" height="40" class="h-10 w-10 shrink-0 rounded-full" />
        <div class="min-w-0 flex-1">
          {@render kotbo('14:02')}
          <Embed
            color="#5865f2"
            icon={ktb('ticket')}
            title={t.tickets.openTitle}
            fields={[
              { name: t.tickets.author, value: '@sarah' },
              { name: t.tickets.reason, value: t.tickets.reasonValue },
              { name: t.tickets.description, value: t.tickets.descriptionValue, inline: false },
            ]}
          >
            {#snippet actions()}
              <DcButton tone="primary" disabled={ticket !== 'open'} onclick={() => (ticket = 'claimed')}>{t.tickets.claim}</DcButton>
              <DcButton tone="danger" disabled={ticket === 'closed'} onclick={() => (ticket = 'closed')}>{t.tickets.close}</DcButton>
            {/snippet}
          </Embed>

          {#if ticket !== 'open'}
            <div class="arsenal-in mt-4">
              {@render kotbo('14:03')}
              <Embed color="#248046" icon={ktb('check')} title={t.tickets.claimedTitle}>{t.tickets.claimedBody}</Embed>
            </div>
          {/if}
          {#if ticket === 'closed'}
            <div class="arsenal-in mt-4">
              {@render kotbo('14:11')}
              <Embed color="#da373c" icon={ktb('lock')} title={t.tickets.closedTitle}>{t.tickets.closedBody}</Embed>
            </div>
          {/if}
        </div>
      </div>
      <p class="sr-only" role="status">{t.tickets.status[ticket]}</p>
    </div>
    {#if ticket === 'closed'}
      <button type="button" onclick={() => (ticket = 'open')} class="mt-4 min-h-11 rounded-lg bg-night-4 px-5 text-sm font-semibold text-ink transition-colors hover:bg-line-2">
        {t.tickets.replay}
      </button>
    {/if}
  {:else if key === 'levels'}
    <div>
      <div class="stay-dark rounded-2xl bg-[#1e1f22] p-2.5 transition-transform {bump ? 'scale-[1.02]' : ''}">
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
      <p class="sr-only" role="status">{t.levels.cardLabel(level)}</p>
      <button type="button" onclick={addXp} class="mt-4 min-h-11 rounded-lg bg-night-4 px-5 font-mono text-sm font-bold text-ink transition-colors hover:bg-[#4f46e5] hover:text-white">
        {t.levels.xp}
      </button>
    </div>
  {:else if key === 'giveaways'}
    <div class="stay-dark rounded-2xl bg-[#313338] p-5">
      {@render discordHead(t.giveaways.channel)}
      <div class="flex gap-3">
        <img src="{base}/favicon.svg" alt="" width="40" height="40" class="h-10 w-10 shrink-0 rounded-full" />
        <div class="min-w-0 flex-1">
          {@render kotbo('18:00')}
          <Embed color="#5865f2" title={t.giveaways.prize} footer={t.giveaways.footer}>
            <p>{t.giveaways.cta}</p>
            <p class="mt-2"><strong class="text-[#f2f3f5]">{t.giveaways.ends}</strong> {t.giveaways.endsValue}</p>
            <p><strong class="text-[#f2f3f5]">{t.giveaways.winners}</strong> 1</p>
            <p><strong class="text-[#f2f3f5]">{t.giveaways.entrants}</strong> <span class="tabular-nums">{entrants}</span></p>
            {#snippet actions()}
              <DcButton tone="primary" onclick={toggleEntry}>{t.giveaways.join}</DcButton>
            {/snippet}
          </Embed>
          {#if reply}
            {#key reply}
              <div class="arsenal-in mt-4">
                {@render kotbo('18:02')}
                <p class="mt-1 text-sm text-[#dbdee1]">{reply === 'joined' ? t.giveaways.joined : t.giveaways.left}</p>
                <p class="mt-1 text-xs text-[#949ba4]">{t.giveaways.ephemeral}</p>
              </div>
            {/key}
          {/if}
        </div>
      </div>
      <p class="sr-only" role="status">{t.giveaways.status(entrants)}</p>
    </div>
  {:else if key === 'logs'}
    {@const entry = t.logs.entries[log]}
    <div class="stay-dark rounded-2xl bg-[#313338] p-5">
      {@render discordHead(t.logs.channel)}
      <div role="group" aria-label={t.logs.listLabel} class="flex flex-col gap-1">
        {#each LOG_KEYS as k (k)}
          {@const on = log === k}
          <button
            type="button"
            aria-pressed={on}
            onclick={() => (log = k)}
            class="flex min-h-11 items-center gap-3 rounded-md px-3 text-left text-sm transition-colors {on ? 'bg-[#404249] text-[#f2f3f5]' : 'text-[#b5bac1] hover:bg-[#393c41] hover:text-[#dbdee1]'}"
          >
            <img src={ktb(t.logs.entries[k].icon)} alt="" width="18" height="18" class="h-4.5 w-4.5 shrink-0" />
            <span class="min-w-0 flex-1 truncate">{t.logs.entries[k].row}</span>
          </button>
        {/each}
      </div>
      {#key log}
        <div class="arsenal-in mt-4 flex gap-3">
          <img src="{base}/favicon.svg" alt="" width="40" height="40" class="h-10 w-10 shrink-0 rounded-full" />
          <div class="min-w-0 flex-1">
            {@render kotbo('02:31')}
            <Embed color={entry.color} title={entry.title} fields={entry.fields} footer={entry.footer} />
          </div>
        </div>
      {/key}
    </div>
  {:else}
    <div>
      <div role="group" aria-label={t.all.catsLabel} class="flex flex-wrap gap-2">
        {#each CATALOG as cat (cat.key)}
          {@const on = category === cat.key}
          <button
            type="button"
            aria-pressed={on}
            onclick={() => (category = cat.key)}
            class="min-h-11 rounded-lg px-4 text-sm font-semibold transition-colors {on ? 'bg-ink text-night' : 'bg-night-3 text-mist hover:bg-night-4 hover:text-ink'}"
          >
            {cat.label[locale]} <span class="ml-1 font-normal tabular-nums {on ? 'text-night/60' : 'text-fog'}">{cat.modules.length}</span>
          </button>
        {/each}
      </div>
      <!-- Les six catégories sont dans la page, une seule affichée : les 58
           noms restent lisibles par les moteurs. -->
      {#each CATALOG as cat (cat.key)}
        <div class="arsenal-in mt-6 rounded-2xl border border-line p-5" hidden={cat.key !== category}>
          <h3 class="font-display text-lg font-extrabold text-ink">
            {#if cat.key === 'staff'}
              <a href="{base}{STAFF_ROUTE[locale]}" class="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">{cat.label[locale]}</a>
              <span class="ml-2 font-sans text-sm font-normal text-fog">{t.all.staffNote}</span>
            {:else}
              {cat.label[locale]}
            {/if}
          </h3>
          <ul class="mt-4 flex flex-wrap gap-2">
            {#each cat.modules as mod (mod.key)}
              {@const href = pageOf(mod.key, mod.name.fr)}
              <li>
                {#if href}
                  <a {href} class="block rounded-md border border-glow/40 px-2.5 py-1 text-sm text-glow transition-colors hover:border-glow hover:bg-glow/10">{mod.name[locale]}</a>
                {:else}
                  <span class="block rounded-md border border-line-2 px-2.5 py-1 text-sm text-mist">{mod.name[locale]}</span>
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
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
  @media (prefers-reduced-motion: reduce) {
    .arsenal-in {
      animation: none;
    }
  }
</style>

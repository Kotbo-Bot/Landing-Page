<script lang="ts">
  /**
   * La confiance : ce qu'un co-fondateur demande avant d'ajouter un bot.
   *
   * Les quatre peurs qui reviennent chez les admins (le bot qui nuke le
   * serveur, les données, le support en anglais, les niveaux perdus) avec la
   * réponse vérifiable : la liste des permissions de l'invitation
   * (`api/hono/routes/public/invite.ts` côté bot, sans Administrateur),
   * l'hébergement et le DPA, l'import des niveaux (voir `faq.js`).
   *
   * Les serveurs qui utilisent Kotbo viennent de l'API, avec leur nombre de
   * membres à jour. L'API muette, la liste disparaît : jamais de chiffre écrit
   * à la main.
   */
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import { reveal } from '$lib/actions/reveal';
  import { publicStats } from '$lib/data/stats.svelte';
  import { ktb } from '$lib/playground/discord/theme';

  const TEXT = {
    fr: {
      kicker: 'checklist du co-fonda',
      title: 'Les questions que ton co-fonda va poser. Avec les réponses.',
      items: [
        { icon: 'lock', q: '« Il demande les droits admin ? »', a: 'Non. Discord t’affiche chaque permission une par une, et chacune sert un module. Pas de case Administrateur.' },
        { icon: 'shield', q: '« Nos données partent où ? »', a: 'Hébergées en Union européenne, RGPD, accord de sous-traitance dispo. Et ce site ne pose aucun traceur.', href: '/dpa', link: 'Lire le DPA' },
        { icon: 'msg', q: '« Si ça bug, on parle à qui ? »', a: 'À l’équipe qui code le bot, en français, sur Discord. Le dashboard est en français aussi, pas traduit à l’arrache.' },
        { icon: 'level', q: '« On perd les niveaux de MEE6 ? »', a: 'Non. Tu importes le classement de ton ancien bot, et Kotbo peut caler sa courbe d’XP sur celle de MEE6.' },
      ],
      servers: 'Ils tournent déjà avec Kotbo',
      members: (n: string) => `${n} membres`,
    },
    en: {
      kicker: 'co-founder checklist',
      title: 'The questions your co-founder is going to ask. With the answers.',
      items: [
        { icon: 'lock', q: '“Does it ask for admin?”', a: 'No. Discord shows you every permission one by one, and each one powers a module. No Administrator box.' },
        { icon: 'shield', q: '“Where does our data go?”', a: 'Hosted in the European Union, GDPR, data processing agreement available. And this site sets zero trackers.', href: '/dpa', link: 'Read the DPA' },
        { icon: 'msg', q: '“If it breaks, who do we talk to?”', a: 'The team that builds the bot, on Discord. The whole thing is French-made, with an English dashboard too.' },
        { icon: 'level', q: '“Do we lose our MEE6 levels?”', a: 'No. Import your old bot’s leaderboard, and Kotbo can match its XP curve to MEE6’s.' },
      ],
      servers: 'Already running on Kotbo',
      members: (n: string) => `${n} members`,
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const servers = $derived((publicStats.data?.servers ?? []).slice(0, 8));
  const fmt = (n: number) => n.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/\u202f/g, '\u00a0');

  onMount(() => void publicStats.load());
</script>

<section id="confiance" aria-labelledby="trust-title" class="border-t border-line bg-night-2 py-24 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div use:reveal={{ direction: 'up' }} class="max-w-3xl">
      <p class="font-mono text-sm text-glow">{t.kicker}</p>
      <h2 id="trust-title" class="mt-4 font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-white sm:text-5xl">{t.title}</h2>
    </div>

    <ul class="mt-14 grid gap-4 md:grid-cols-2">
      {#each t.items as item, i (item.q)}
        <li use:reveal={{ direction: 'up', delay: i * 60 }} class="flex gap-5 rounded-3xl border border-line bg-night p-6 sm:p-8">
          <img src={ktb(item.icon)} alt="" width="32" height="32" class="h-8 w-8 shrink-0" />
          <div>
            <p class="font-display text-xl font-bold text-white">{item.q}</p>
            <p class="mt-2 leading-relaxed text-fog">{item.a}</p>
            {#if item.href}
              <a href="{base}{item.href}" class="mt-3 inline-block text-sm font-semibold text-glow underline decoration-glow/30 underline-offset-4 hover:decoration-glow">{item.link}</a>
            {/if}
          </div>
        </li>
      {/each}
    </ul>

    {#if servers.length > 0}
      <div use:reveal={{ direction: 'up' }} class="mt-16">
        <h3 class="text-sm font-semibold text-fog">{t.servers}</h3>
        <ul class="mt-5 flex flex-wrap gap-3">
          {#each servers as server (server.name)}
            <li class="flex items-center gap-3 rounded-2xl border border-line bg-night py-2.5 pl-2.5 pr-5">
              {#if server.iconUrl}
                <img
                  src={server.iconUrl}
                  alt=""
                  width="40"
                  height="40"
                  loading="lazy"
                  class="h-10 w-10 rounded-xl bg-night-3 object-cover"
                  onerror={(e) => ((e.currentTarget as HTMLImageElement).src = `${base}/favicon.svg`)}
                />
              {:else}
                <span aria-hidden="true" class="grid h-10 w-10 place-items-center rounded-xl bg-[#4f46e5]/20 text-sm font-bold text-glow">{server.name.slice(0, 2)}</span>
              {/if}
              <span>
                <span class="block max-w-48 truncate font-semibold text-white">{server.name}</span>
                <span class="block text-xs tabular-nums text-fog">{t.members(fmt(server.memberCount))}</span>
              </span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</section>

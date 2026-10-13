<script lang="ts">
  /**
   * La confiance, sous forme de conversation : ta co-fondatrice pose les
   * questions qu'on se pose avant d'ajouter un bot de plus, tu réponds.
   *
   * Les quatre peurs viennent des commentaires d'admins sous les tutos de bots
   * (le bot qui nuke le serveur, les données, le support, les niveaux perdus).
   * Chaque réponse est vérifiable : la liste des permissions de l'invitation
   * (`api/hono/routes/public/invite.ts` côté bot, sans Administrateur),
   * l'hébergement et le DPA, l'import des niveaux (voir `faq.js`). La
   * conversation est annoncée fictive.
   *
   * Les serveurs qui utilisent Kotbo sont dans le héros, à côté du bouton.
   */
  import { base } from '$app/paths';
  import { getLocale } from '$lib/i18n/state.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Line = { who: 'ines' | 'you'; text: string; link?: { href: string; label: string } };

  const TEXT = {
    fr: {
      title: 'Ta co-fonda va te poser ces questions. Voilà quoi répondre.',
      ines: 'Inès',
      inesRole: 'co-fonda',
      you: 'toi',
      today: (m: number) => `Aujourd’hui à 21:${String(14 + m).padStart(2, '0')}`,
      fictive: 'conversation fictive',
      fictiveLong: 'Conversation fictive entre toi et ta co-fondatrice, Inès.',
      lines: [
        { who: 'ines', text: 'attends avant d’ajouter un énième bot. il demande les droits admin ?' },
        { who: 'you', text: 'non. discord affiche chaque permission une par une et y’a pas la case administrateur. chaque perm sert un module' },
        { who: 'ines', text: 'et nos données elles partent où' },
        { who: 'you', text: 'hébergées en UE, RGPD, ils ont un accord de sous-traitance. et leur site pose aucun traceur', link: { href: '/dpa', label: 'le DPA' } },
        { who: 'ines', text: 'si ça bug on parle à qui ? encore un support en anglais qui répond dans 3 jours ?' },
        { who: 'you', text: 'non, c’est l’équipe qui code le bot, en français, sur leur discord' },
        { who: 'ines', text: 'dernier truc. les membres perdent leurs niveaux mee6 ?' },
        { who: 'you', text: 'non on importe le classement. et la courbe d’xp peut être calée sur celle de mee6, les paliers bougent pas' },
        { who: 'ines', text: 'ok vas-y ajoute-le' },
      ] as Line[],
    },
    en: {
      title: 'Your co-founder will ask you these. Here’s what to answer.',
      ines: 'Inès',
      inesRole: 'co-founder',
      you: 'you',
      today: (m: number) => `Today at 9:${String(14 + m).padStart(2, '0')} PM`,
      fictive: 'fictional conversation',
      fictiveLong: 'Fictional conversation between you and your co-founder, Inès.',
      lines: [
        { who: 'ines', text: 'wait before we add yet another bot. does it ask for admin?' },
        { who: 'you', text: 'no. discord lists every permission one by one and there’s no administrator box. each perm powers a module' },
        { who: 'ines', text: 'and where does our data go' },
        { who: 'you', text: 'hosted in the EU, GDPR, they have a data processing agreement. and their site runs zero trackers', link: { href: '/dpa', label: 'the DPA' } },
        { who: 'ines', text: 'if it breaks who do we talk to? another english support that answers in 3 days?' },
        { who: 'you', text: 'nah, it’s the team that builds the bot, on their discord' },
        { who: 'ines', text: 'last thing. do members lose their mee6 levels?' },
        { who: 'you', text: 'no we import the leaderboard. and the xp curve can match mee6’s so the tiers don’t move' },
        { who: 'ines', text: 'ok go add it' },
      ] as Line[],
    },
  };

  const t = $derived(TEXT[getLocale()]);
  const fmt = (n: number) => n.toLocaleString(getLocale() === 'fr' ? 'fr-FR' : 'en-US').replace(/ /g, ' ');

  /** Deux messages d'affilée du même auteur se regroupent, comme dans Discord. */
  const grouped = $derived(t.lines.map((line, i) => ({ ...line, head: i === 0 || t.lines[i - 1].who !== line.who })));

</script>

<section id="confiance" aria-labelledby="trust-title" class="relative bg-night-2 pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night-2/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="confiance" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <h2 id="trust-title" class="max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-5xl">{t.title}</h2>

    <div class="mt-12 max-w-3xl">
      <figure aria-labelledby="trust-fict">
      <figcaption id="trust-fict" class="sr-only">{t.fictiveLong}</figcaption>
      <ol class="space-y-0.5">
        {#each grouped as line, i (i)}
          <li class="flex gap-4 rounded-md px-2 py-0.5 hover:bg-white/[0.02] {line.head ? 'mt-5 first:mt-0' : ''}">
            <span class="w-10 shrink-0">
              {#if line.head}
                <span
                  aria-hidden="true"
                  class="mt-0.5 grid h-10 w-10 place-items-center rounded-full text-sm font-bold {line.who === 'ines' ? 'bg-[#be185d] text-white' : 'bg-[#4f46e5] text-white'}"
                >{line.who === 'ines' ? 'IN' : t.you.slice(0, 2).toUpperCase()}</span>
              {/if}
            </span>
            <div class="min-w-0">
              {#if line.head}
                <p class="flex flex-wrap items-baseline gap-x-2">
                  <span class="font-semibold {line.who === 'ines' ? 'text-[#f9a8d4]' : 'text-glow'}">{line.who === 'ines' ? t.ines : t.you}</span>
                  {#if line.who === 'ines'}<span class="rounded bg-night-4 px-1 text-[11px] font-medium text-mist">{t.inesRole}</span>{/if}
                  <span class="text-xs text-fog">{t.today(Math.floor(i / 2))}</span>
                </p>
              {/if}
              <p class="text-[16px] leading-relaxed text-[#dbdee1]">
                {line.text}
                {#if line.link}
                  · <a href="{base}{line.link.href}" class="text-[#00a8fc] underline underline-offset-2">{line.link.label}</a>
                {/if}
              </p>
            </div>
          </li>
        {/each}
      </ol>
      </figure>
      <p class="mt-6 pl-16 text-xs text-fog" aria-hidden="true">{t.fictive}</p>
    </div>
  </div>
</section>

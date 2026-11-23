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
  import { DiscordUI } from '@arcscord/discord-ui-svelte';
  import { defineTheme } from '@arcscord/discord-ui-svelte/themes';
  import Message from '$lib/playground/discord/Message.svelte';
  import ChannelHeader from './ChannelHeader.svelte';

  type Line = { who: 'ines' | 'you'; text: string; link?: { href: string; label: string } };

  const TEXT = {
    fr: {
      title: 'Ta co-fonda va te poser ces questions. Voilà quoi répondre',
      ines: 'Inès',
      inesRole: 'co-fonda',
      you: 'toi',
      today: (m: number) => `Aujourd’hui à 21:${String(14 + m).padStart(2, '0')}`,
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
      title: 'Your co-founder will ask you these. Here’s what to answer',
      ines: 'Inès',
      inesRole: 'co-founder',
      you: 'you',
      today: (m: number) => `Today at 9:${String(14 + m).padStart(2, '0')} PM`,
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
  const conversationTheme = defineTheme({
    name: 'kotbo-conversation',
    extends: 'ash',
    tokens: {
      background: 'transparent',
      focusBackground: 'transparent',
      text: 'var(--color-mist)',
      strong: 'var(--color-ink)',
      muted: 'var(--color-fog)',
      authorTagBackground: 'var(--color-night-4)',
      link: 'var(--color-glow)',
    },
  });
</script>

<section id="confiance" aria-labelledby="trust-title" class="relative bg-night pb-16 sm:pb-24 lg:pb-32">
  <div class="bg-night/95 backdrop-blur-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6"><ChannelHeader id="confiance" /></div>
  </div>
  <div class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:pt-20">
    <h2 id="trust-title" class="max-w-3xl font-display text-4xl font-black leading-[1.02] tracking-[-0.02em] text-balance text-ink sm:text-5xl">{t.title}</h2>

    <div class="mt-12 max-w-3xl">
      <figure aria-labelledby="trust-fict">
      <figcaption id="trust-fict" class="sr-only">{t.fictiveLong}</figcaption>
      <DiscordUI theme={conversationTheme} class="trust-conversation"
        locale={getLocale() === 'fr' ? 'fr-FR' : 'en-US'} timeZone="Europe/Zurich">
        <ol class="space-y-0.5">
          {#each t.lines as line, i (i)}
            <li class:cofounder={line.who === 'ines'}>
              <Message author={line.who === 'ines' ? t.ines : t.you}
                tag={line.who === 'ines' ? t.inesRole : undefined}
                time={t.today(Math.floor(i / 2))}>
                {line.text}
                {#if line.link}
                  · <a href="{base}{line.link.href}" class="underline underline-offset-2">{line.link.label}</a>
                {/if}
              </Message>
            </li>
          {/each}
        </ol>
      </DiscordUI>
      </figure>
    </div>
  </div>
</section>

<style>
  :global(.trust-conversation.arcscord-discord-ui) {
    font-family: var(--font-sans);
    color-scheme: inherit;
    --conversation-cofounder: #f9a8d4;
  }

  :global([data-theme='light'] .trust-conversation) {
    --conversation-cofounder: #be185d;
  }

  :global(.trust-conversation .dui-author-name) {
    color: var(--color-glow);
  }

  .cofounder :global(.dui-author-name) {
    color: var(--conversation-cofounder);
  }
</style>

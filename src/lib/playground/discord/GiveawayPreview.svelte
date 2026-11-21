<script module lang="ts">
  export interface GiveawayPreviewState {
    entered: boolean;
    reply: 'joined' | 'left' | null;
  }
</script>

<script lang="ts">
  import { ChannelHeader, MessageComponents, ReplyPreview, type MessageAuthor, type MessageComponent } from '@arcscord/discord-ui-svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Message from './Message.svelte';
  import Surface from './Surface.svelte';
  import { KOTBO_AVATAR } from './theme';

  const { demo }: { demo: GiveawayPreviewState } = $props();
  const TEXT = {
    fr: {
      prize: 'GIVEAWAY: nitro 1 mois', birthday: 'Pour les 2 ans de kotbo !',
      cta: 'Cliquez sur le bouton ci-dessous pour participer !',
      ends: 'Fin :', endsValue: 'dans 2 jours', winners: 'Gagnants :', entrants: 'Participants :',
      join: 'Rejoindre', joined: 'Inscription validée ! Bonne chance !', left: 'Vous vous êtes retiré du giveaway.',
      see: 'Cliquez pour voir le message', ephemeral: 'Seul toi peux voir ce message', dismiss: 'Masquer le message',
      edited: '(modifié)', status: (count: number) => `${count} participants`,
    },
    en: {
      prize: 'GIVEAWAY: 1 month of nitro', birthday: 'For Kotbo’s 2nd anniversary!',
      cta: 'Click the button below to enter!',
      ends: 'Ends:', endsValue: 'in 2 days', winners: 'Winners:', entrants: 'Entrants:',
      join: 'Enter', joined: 'You are in! Good luck!', left: 'You have withdrawn from the giveaway.',
      see: 'Click to see message', ephemeral: 'Only you can see this', dismiss: 'Dismiss message',
      edited: '(edited)', status: (count: number) => `${count} entrants`,
    },
  };
  const t = $derived(TEXT[getLocale()]);
  const entrants = $derived(47 + Number(demo.entered));
  const messageId = '1573788163409977365';
  const giveawayId = 'cmwqtr2p50014cv17qsvi8b4m';
  const author: MessageAuthor = { id: '1511444476562903143', displayName: 'Kotbo', bot: true, verified: true, avatarUrl: KOTBO_AVATAR };
  let originalMessage: HTMLDivElement;
  const components: MessageComponent[] = $derived([
    {
      id: '1', kind: 'container', accentColor: '#5865f2',
      components: [
        { id: '2', kind: 'text-display', content: `### ${t.prize}` },
        { id: '3', kind: 'text-display', content: `${t.birthday}\n\n${t.cta}\n\n**${t.ends}** ${t.endsValue}\n**${t.winners}** 3\n**${t.entrants}** ${entrants}` },
        { id: '4', kind: 'separator', spacing: 'small', divider: false },
        { id: '5', kind: 'text-display', content: `-# ID: ${giveawayId}` },
      ],
    },
    {
      id: '6', kind: 'action-row',
      buttons: [{ id: `giveaway_join:${giveawayId}`, kind: 'button', style: 'primary', label: t.join }],
    },
  ]);

  function toggleEntry() {
    demo.entered = !demo.entered;
    demo.reply = demo.entered ? 'joined' : 'left';
  }

  function showOriginal() {
    originalMessage.scrollIntoView({ block: 'nearest' });
    originalMessage.focus({ preventScroll: true });
  }
</script>

<Surface class="overflow-hidden rounded-2xl">
  <ChannelHeader name="giveaways" />
  <div bind:this={originalMessage} tabindex="-1" class="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blurple">
    <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="18:00">
      <MessageComponents {components} onButtonClick={toggleEntry} />
      {#snippet footer()}<p class="dui-timestamp mt-2">{t.edited}</p>{/snippet}
    </Message>
  </div>
  {#if demo.reply}
    <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="18:02" ephemeral>
      {#snippet reply()}
        <button type="button" onclick={showOriginal} aria-label={t.see} class="giveaway-reply block w-full rounded text-left focus-visible:outline-2 focus-visible:outline-blurple">
          <ReplyPreview reply={{ messageId, author, content: t.see }} />
        </button>
      {/snippet}
      <p>{demo.reply === 'joined' ? t.joined : t.left}</p>
      {#snippet footer()}
        <div class="dui-ephemeral-notice">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" stroke-width="2" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
            <path d="m4 21 16-18" stroke="currentColor" stroke-width="2" />
          </svg>
          <span>{t.ephemeral}</span><span aria-hidden="true">·</span>
          <button type="button" class="dui-ephemeral-dismiss" onclick={() => (demo.reply = null)}>{t.dismiss}</button>
        </div>
      {/snippet}
    </Message>
  {/if}
  <p class="sr-only" role="status">{t.status(entrants)}</p>
</Surface>

<style>
  .giveaway-reply :global(.dui-reply-content) {
    color: var(--discord-ui-text);
    font-style: italic;
  }
</style>

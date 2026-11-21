<script module lang="ts">
  export interface TicketPreviewState {
    ticketState: 'open' | 'claimed' | 'closed';
    claimed: boolean;
    events: ('claimed' | 'closed' | 'reopened')[];
    archived: boolean;
    locked: boolean;
    deleted: boolean;
    response: 'archived' | 'locked' | 'unlocked' | null;
  }
</script>

<script lang="ts">
  import { ChannelHeader, MessageComponents } from '@arcscord/discord-ui-svelte';
  import { getLocale } from '$lib/i18n/state.svelte';
  import Surface from './Surface.svelte';
  import Message from './Message.svelte';
  import { KOTBO_AVATAR } from './theme';
  import { EXAMPLE_TICKET_ID, EXAMPLE_VIEWER_ID, ticketComponents } from './ticketMessages';

  const TEXT = {
    fr: {
      you: 'toi', replay: 'Rejouer', reopened: '🔓 Ticket réouvert.',
      archived: '📦 Ticket archivé en lecture seule.', locked: '🔐 Ticket protégé contre la suppression.',
      unlocked: '🔓 Protection contre la suppression retirée.', deleted: '🗑️ Ticket supprimé.',
      open: 'Ticket ouvert, en attente du staff', claimed: 'Ticket pris en charge', closed: 'Ticket fermé',
    },
    en: {
      you: 'you', replay: 'Replay', reopened: '🔓 Ticket reopened.',
      archived: '📦 Ticket archived read-only.', locked: '🔐 Ticket protected from deletion.',
      unlocked: '🔓 Deletion protection removed.', deleted: '🗑️ Ticket deleted.',
      open: 'Ticket open, waiting for staff', claimed: 'Ticket claimed', closed: 'Ticket closed',
    },
  };
  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const { demo }: { demo: TicketPreviewState } = $props();
  const entities = $derived({ users: { [EXAMPLE_VIEWER_ID]: { name: t.you } } });
  const options = $derived({ ticketId: EXAMPLE_TICKET_ID, userId: EXAMPLE_VIEWER_ID });

  function reset() {
    demo.ticketState = 'open';
    demo.claimed = false;
    demo.events = [];
    demo.archived = false;
    demo.locked = false;
    demo.deleted = false;
    demo.response = null;
  }

  function interact(id: string) {
    demo.response = null;
    switch (id) {
      case 'claim':
        demo.claimed = true;
        demo.ticketState = 'claimed';
        demo.events.push('claimed');
        break;
      case 'close':
        demo.ticketState = 'closed';
        demo.events.push('closed');
        break;
      case 'reopen':
        demo.ticketState = 'open';
        demo.claimed = false;
        demo.events.push('reopened');
        break;
      case 'archive':
        demo.archived = true;
        demo.response = 'archived';
        break;
      case 'lock':
        demo.locked = !demo.locked;
        demo.response = demo.locked ? 'locked' : 'unlocked';
        break;
      case 'delete':
        if (demo.locked) demo.response = 'locked';
        else demo.deleted = true;
        break;
    }
  }
</script>

<Surface {entities} class="overflow-hidden rounded-2xl">
  <ChannelHeader name="ticket-149" />
  {#if demo.deleted}
    <p role="status" class="p-4">{t.deleted}</p>
  {:else}
    <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="20:13" mentioned>
      <MessageComponents components={ticketComponents('open', locale, { ...options, claimed: demo.claimed, disabled: demo.ticketState === 'closed' })} onButtonClick={interact} />
    </Message>
    {#each demo.events as event, index (index)}
      <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="20:33" mentioned={event !== 'reopened'} enter>
        {#if event === 'reopened'}
          <p>{t.reopened}</p>
        {:else}
          <MessageComponents
            components={ticketComponents(event, locale, {
              ...options,
              disabled: demo.archived || demo.ticketState !== 'closed' || index !== demo.events.length - 1,
            })}
            onButtonClick={interact}
          />
        {/if}
      </Message>
    {/each}
    {#if demo.response}
      <Message author="Kotbo" bot avatar={KOTBO_AVATAR} time="20:33" ephemeral>
        <p role="status">{t[demo.response]}</p>
      </Message>
    {/if}
    <p class="sr-only" role="status">{t[demo.ticketState]}</p>
  {/if}
</Surface>
{#if demo.events.length > 0 || demo.deleted}
  <button type="button" onclick={reset} class="mt-4 min-h-11 rounded-lg bg-night-4 px-5 text-sm font-semibold text-ink transition-colors hover:bg-line-2">{t.replay}</button>
{/if}

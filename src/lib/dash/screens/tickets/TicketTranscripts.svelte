<!--
  Transcriptions des tickets fermés.

  Recopie de `Kotbo/apps/dashboard/src/lib/components/tickets/TicketTranscripts.svelte`
  (branche `recette`), tableau d'écran large seulement. La liste se déduit des
  tickets fermés de la démo. « Consulter » ouvre dans le dashboard la page de
  la transcription, dans un nouvel onglet ; ici il ouvre le ticket fermé dans
  la boîte de réception. La suppression retire la ligne après confirmation.
-->
<script lang="ts">
  import { Button, Papicon } from '$lib/dash/ui';
  import { getLocale } from '$lib/i18n/state.svelte';
  import type { DemoTicket } from '$lib/dash/fixtures/tickets';
  import type { Ask } from './confirm';

  const TEXT = {
    fr: {
      title: 'Transcriptions',
      desc: 'Historique des transcriptions de tickets et de salons.',
      empty: 'Aucune transcription',
      channel: 'Salon',
      type: 'Type',
      period: 'Période',
      generated: 'Généré le',
      action: 'Action',
      badgeTicket: 'Ticket',
      view: 'Consulter',
      delete: 'Supprimer',
      deleteTitle: (channel: string) => `Supprimer la transcription #${channel} ?`,
      deleteDesc: 'Elle disparaît du tableau de bord et son lien ne marchera plus.',
    },
    en: {
      title: 'Transcripts',
      desc: 'History of ticket and channel transcripts.',
      empty: 'No transcript',
      channel: 'Channel',
      type: 'Type',
      period: 'Period',
      generated: 'Generated on',
      action: 'Action',
      badgeTicket: 'Ticket',
      view: 'View',
      delete: 'Delete',
      deleteTitle: (channel: string) => `Delete transcript #${channel}?`,
      deleteDesc: 'It disappears from the dashboard and its link will stop working.',
    },
  };

  const {
    tickets,
    onopen,
    ask,
  }: {
    tickets: DemoTicket[];
    /** Ouvre le ticket transcrit dans la boîte de réception. */
    onopen: (ticketId: string) => void;
    ask: Ask;
  } = $props();

  const locale = $derived(getLocale());
  const t = $derived(TEXT[locale]);
  const dateLocale = $derived(locale === 'fr' ? 'fr-FR' : 'en-GB');

  let removed = $state<string[]>([]);

  const transcripts = $derived(
    tickets
      .filter((ticket) => (ticket.status === 'CLOSED' || ticket.status === 'ARCHIVED') && ticket.closedAt && !removed.includes(ticket.id))
      .sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime())
      .map((ticket) => ({ id: ticket.id, channelName: ticket.channelName, startTime: ticket.createdAt, endTime: ticket.closedAt!, createdAt: ticket.closedAt! })),
  );

  async function removeTranscript(transcript: { id: string; channelName: string }) {
    const confirmed = await ask({ title: t.deleteTitle(transcript.channelName), description: t.deleteDesc, confirmLabel: t.delete, variant: 'danger' });
    if (confirmed) removed = [...removed, transcript.id];
  }
</script>

<div class="bg-surface-container-low/40 border border-outline-variant/10 rounded-xl p-6 flex flex-col min-h-[40vh]">
  <div class="mb-4">
    <h3 class="text-lg font-semibold text-on-surface">{t.title}</h3>
    <p class="text-on-surface-variant text-xs mt-0.5">{t.desc}</p>
  </div>

  {#if transcripts.length === 0}
    <div class="flex flex-col items-center justify-center py-16 text-on-surface-variant/30">
      <Papicon icon="inbox" size={36} class="opacity-50 mb-2" />
      <p class="text-xs font-bold">{t.empty}</p>
    </div>
  {:else}
    <div class="overflow-x-auto w-full">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-outline-variant/15 text-xs font-medium text-on-surface-variant">
            <th class="py-3 px-4">{t.channel}</th>
            <th class="py-3 px-4">{t.type}</th>
            <th class="py-3 px-4">{t.period}</th>
            <th class="py-3 px-4">{t.generated}</th>
            <th class="py-3 px-4 text-right">{t.action}</th>
          </tr>
        </thead>
        <tbody>
          {#each transcripts as transcript (transcript.id)}
            <tr class="border-b border-outline-variant/10 hover:bg-white/5 transition-colors">
              <td class="py-3 px-4 font-mono text-sm font-bold text-on-surface">
                <span class="text-primary/70">#</span>{transcript.channelName}
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-2xs font-semibold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">{t.badgeTicket}</span>
              </td>
              <td class="py-3 px-4 text-xs text-on-surface-variant">
                {new Date(transcript.startTime).toLocaleDateString(dateLocale)} - {new Date(transcript.endTime).toLocaleDateString(dateLocale)}
              </td>
              <td class="py-3 px-4 text-xs text-on-surface-variant">
                {new Date(transcript.createdAt).toLocaleDateString(dateLocale)}
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-2">
                  <Button size="sm" icon="external-link" onclick={() => onopen(transcript.id)}>{t.view}</Button>
                  <Button variant="danger" size="sm" icon="trash" aria-label={t.delete} onclick={() => removeTranscript(transcript)} />
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

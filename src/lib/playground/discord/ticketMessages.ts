import type { ButtonView, MessageComponent } from '@arcscord/discord-ui-svelte';

export type TicketMessageKind = 'open' | 'claimed' | 'closed';
export const EXAMPLE_TICKET_ID = 'cmwqscl42000fcv17krmt8wga';
export const EXAMPLE_VIEWER_ID = '457144873859022858';

const TEXT = {
  fr: {
    title: "🎫 Ticket d'Assistance · Ouvrir un ticket",
    welcome: (user: string) => `Bonjour <@${user}> !\nLe personnel va prendre en charge votre demande rapidement. En attendant, merci de bien détailler vos questions ou explications.`,
    description: 'Description du problème :',
    claimed: '✅ Pris en charge',
    claimedBody: (user: string) => `Ce ticket est désormais pris en charge par <@${user}>.`,
    closed: '🔒 Ticket Fermé',
    closedBody: (user: string) => `Le ticket a été fermé par <@${user}>.\n\nLe personnel peut le réouvrir, l'archiver en lecture seule sans rien perdre, le protéger contre la suppression, ou le supprimer définitivement.`,
    claim: 'Prendre en charge', close: 'Fermer',
    reopen: 'Réouvrir', archive: 'Archiver', lock: 'Verrouiller', delete: 'Supprimer',
  },
  en: {
    title: '🎫 Support Ticket · Open a ticket',
    welcome: (user: string) => `Hello <@${user}>!\nStaff will handle your request shortly. In the meantime, please describe your questions or issue in detail.`,
    description: 'Problem description:',
    claimed: '✅ Claimed',
    claimedBody: (user: string) => `This ticket is now handled by <@${user}>.`,
    closed: '🔒 Ticket Closed',
    closedBody: (user: string) => `The ticket was closed by <@${user}>.\n\nStaff can reopen it, archive it read-only without losing anything, protect it from deletion, or delete it permanently.`,
    claim: 'Claim', close: 'Close',
    reopen: 'Reopen', archive: 'Archive', lock: 'Lock', delete: 'Delete',
  },
};

/** The dashboard cast uses local IDs. Give mention tokens stable numeric demo IDs. */
export function ticketMentionId(userId: string): string {
  return userId.replace(/^demo-/, '90000000000000');
}

/** Components V2 layouts from the supplied ticket exports, with localized demo data. */
export function ticketComponents(kind: TicketMessageKind, locale: 'fr' | 'en', options: {
  ticketId: string;
  userId: string;
  staffId?: string;
  description?: string;
  disabled?: boolean;
  claimed?: boolean;
}): MessageComponent[] {
  const t = TEXT[locale];
  const staff = options.staffId ?? options.userId;
  const title = kind === 'open' ? t.title : kind === 'claimed' ? t.claimed : t.closed;
  const content = kind === 'open'
    ? `${t.welcome(options.userId)}\n\n**${t.description}**\n${options.description ?? 'non'}`
    : kind === 'claimed' ? t.claimedBody(staff) : t.closedBody(staff);
  const components: MessageComponent[] = [{
    id: 'container', kind: 'container',
    accentColor: kind === 'open' ? '#5865f2' : kind === 'claimed' ? '#57f287' : '#ed4245',
    components: [
      { id: 'title', kind: 'text-display', content: `### ${title}` },
      { id: 'body', kind: 'text-display', content },
      ...(kind === 'closed' ? [] : [
        { id: 'spacing', kind: 'separator' as const, divider: false, spacing: 'small' as const },
        { id: 'footer', kind: 'text-display' as const, content: kind === 'open'
          ? `-# Kotbo · Ticket ID: ${options.ticketId}` : '-# Kotbo • Assistant V2' },
      ]),
    ],
  }];
  if (kind === 'claimed') return components;
  const buttons: ButtonView[] = kind === 'open' ? [
    { id: 'claim', kind: 'button', label: t.claim, style: 'primary', emoji: { name: '🛠️' }, disabled: options.claimed },
    { id: 'close', kind: 'button', label: t.close, style: 'danger', emoji: { name: '🔒' } },
  ] : [
    { id: 'reopen', kind: 'button', label: t.reopen, style: 'success', emoji: { name: '🔓' } },
    { id: 'archive', kind: 'button', label: t.archive, style: 'secondary', emoji: { name: '📦' } },
    { id: 'lock', kind: 'button', label: t.lock, style: 'secondary', emoji: { name: '🔐' } },
    { id: 'delete', kind: 'button', label: t.delete, style: 'danger', emoji: { name: '🗑️' } },
  ];
  components.push({ id: 'actions', kind: 'action-row', buttons: buttons.map(button => ({
    ...button, disabled: options.disabled || button.disabled,
  })) });
  return components;
}

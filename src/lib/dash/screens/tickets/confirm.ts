/** Confirmation demandée par un onglet à la page (le `confirmDialog` du dashboard). */
export type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'danger' | 'warning' | 'default';
};

export type Ask = (request: ConfirmRequest) => Promise<boolean>;

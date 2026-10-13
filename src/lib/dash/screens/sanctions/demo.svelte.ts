/**
 * L'état de l'écran Sanctions : ce que le dashboard lit dans `dashboardStore`
 * et dans l'API (`/sanctions`, `/appeals`…), tenu ici en mémoire.
 *
 * Les onglets le partagent : archiver la sanction d'Arka depuis sa
 * contestation la montre archivée dans l'historique. Les fenêtres de
 * confirmation (`confirmDialog`) et les notifications (`toast`) du dashboard
 * passent aussi par ici, et l'écran les affiche dans son cadre.
 */
import {
  DEMO_APPEALS,
  DEMO_BLACKLIST,
  DEMO_REPORTS,
  DEMO_SANCTIONS,
  DEMO_SCALES,
  DEMO_SETTINGS,
} from '$lib/dash/fixtures/sanctions';

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel: string;
  variant?: 'danger' | 'warning' | 'default';
};

export type ToastItem = { id: number; type: 'success' | 'error'; message: string };

export class SanctionsDemo {
  sanctions = $state(structuredClone(DEMO_SANCTIONS));
  reports = $state(structuredClone(DEMO_REPORTS));
  appeals = $state(structuredClone(DEMO_APPEALS));
  blacklist = $state(structuredClone(DEMO_BLACKLIST));
  settings = $state({ ...DEMO_SETTINGS });
  scales = $state(structuredClone(DEMO_SCALES));

  /** Dossier membre ouvert (`MemberCaseModal`). */
  caseUserId = $state<string | null>(null);

  confirm = $state<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null);
  toasts = $state<ToastItem[]>([]);
  #toastId = 0;

  ask(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirm = { ...options, resolve };
    });
  }

  answer(ok: boolean) {
    const pending = this.confirm;
    this.confirm = null;
    pending?.resolve(ok);
  }

  toast(type: ToastItem['type'], message: string) {
    const id = ++this.#toastId;
    // Une notification à la fois : l'écran est petit.
    this.toasts = [{ id, type, message }];
    setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter((entry) => entry.id !== id);
  }

  /** Verdict d'une sanction contestée, appliqué à la sanction elle-même. */
  applyOutcome(sanctionId: string, outcome: string, note: string | null) {
    const sanction = this.sanctions.find((entry) => entry.id === sanctionId);
    if (!sanction) return;
    if (outcome === 'ARCHIVED') {
      sanction.archivedAt = new Date().toISOString();
      sanction.archiveReason = note ? { fr: note, en: note } : null;
    } else if (outcome === 'LOCKED') {
      sanction.appealable = false;
      sanction.appealLockReason = note ? { fr: note, en: note } : null;
    } else if (outcome === 'DELETED') {
      this.sanctions = this.sanctions.filter((entry) => entry.id !== sanctionId);
      this.reports = this.reports.filter((entry) => entry.sanctionId !== sanctionId);
    }
  }
}

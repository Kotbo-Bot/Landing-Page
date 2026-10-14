/**
 * Ce que le visiteur change dans un dossier membre : sanctions posées, note,
 * comptes liés ou déliés, vérification demandée, rapport retouché.
 *
 * Gardé hors du composant, par membre, pour qu'un dossier fermé puis rouvert
 * (depuis la liste ou un autre écran) montre encore ce qu'on y a fait. Rien ne
 * part ailleurs : la page rechargée repart des fixtures.
 */
import type { DashboardSanctionType, LinkedAccountItem } from '$lib/dash/types';
import { STAFF } from '$lib/dash/cast';

/** Le compte connecté au dashboard de démo : la fondatrice, qui a tous les droits. */
export const VIEWER = STAFF.lena;

export type AddedSanction = {
  id: string;
  type: DashboardSanctionType;
  createdAt: string;
  /** null : le motif par défaut du dashboard, traduit à l'affichage. */
  reason: string | null;
  durationSeconds: number | null;
};

export type ReportEdit = {
  incidentAt: string;
  sanctionDurationLabel: string | null;
  ruleIds: string[];
  detailedReason: string;
  additionalNotes: string | null;
};

export type CaseEdits = {
  sanctions: AddedSanction[];
  note: string | null;
  linked: LinkedAccountItem[];
  unlinked: string[];
  verificationAt: string | null;
  /** Expulsé ou banni pendant la démo : le dossier le montre parti. */
  removed: boolean;
  reports: Record<string, ReportEdit>;
};

export const caseEdits = $state<Record<string, CaseEdits>>({});

/** Les retouches d'un membre, créées au premier changement. */
export function editsOf(userId: string): CaseEdits {
  caseEdits[userId] ??= { sanctions: [], note: null, linked: [], unlinked: [], verificationAt: null, removed: false, reports: {} };
  return caseEdits[userId]!;
}

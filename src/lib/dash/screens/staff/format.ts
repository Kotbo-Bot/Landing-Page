/**
 * Dates et nombres de l'écran Équipe. Recopie de
 * `lib/components/staff/format.ts` (dashboard, branche `recette`).
 */
import { getLocale } from '$lib/i18n/state.svelte';

const TEXT = {
  fr: {
    min: (n: number) => `${n} min`,
    hour: (n: number) => `${n} h`,
    day: (n: number) => `${n} j`,
    in: (d: string) => `dans ${d}`,
    ago: (d: string) => `il y a ${d}`,
    tenureDays: (n: number) => `${n} j`,
    tenureMonths: (n: number) => `${n} mois`,
    tenureYears: (n: number) => `${n} an(s)`,
  },
  en: {
    min: (n: number) => `${n} min`,
    hour: (n: number) => `${n} h`,
    day: (n: number) => `${n} d`,
    in: (d: string) => `in ${d}`,
    ago: (d: string) => `${d} ago`,
    tenureDays: (n: number) => `${n} d`,
    tenureMonths: (n: number) => `${n} mo`,
    tenureYears: (n: number) => `${n} yr`,
  },
};

const t = () => TEXT[getLocale()];
const dateLocale = () => (getLocale() === 'fr' ? 'fr-FR' : 'en-US');

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short', year: 'numeric' });
}

/** « il y a 3 j », puis la date au-delà d'un mois. */
export function formatRelative(value: string | Date | null | undefined): string {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  if (Number.isNaN(diff)) return '';
  const future = diff < 0;
  const minutes = Math.max(1, Math.round(Math.abs(diff) / 60000));
  if (minutes >= 60 * 24 * 30) return formatDate(value);
  const unit =
    minutes < 60 ? t().min(minutes)
    : minutes < 60 * 24 ? t().hour(Math.round(minutes / 60))
    : t().day(Math.round(minutes / 1440));
  return future ? t().in(unit) : t().ago(unit);
}

/** Ancienneté lisible : « 8 mois », « 1 an ». */
export function formatTenure(value: string | Date | null | undefined): string {
  if (!value) return '';
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
  if (days < 31) return t().tenureDays(days);
  if (days < 365) return t().tenureMonths(Math.floor(days / 30.4));
  return t().tenureYears(Math.floor(days / 365));
}

export function formatNumber(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString(dateLocale());
}

/** Minutes de vocal en heures arrondies. */
export function formatVoice(minutes: number | null | undefined): string {
  const total = minutes ?? 0;
  if (total < 60) return t().min(total);
  return t().hour(Math.round(total / 60));
}

/** Écart de la semaine à la moyenne du mois, en pourcentage. */
export function weekTrend(avg7d: number, avg30d: number): number | null {
  if (!avg30d) return null;
  return Math.round(((avg7d - avg30d) / avg30d) * 100);
}

/**
 * Formats des chiffres et dates du dossier membre, recopiés de
 * `analytics/analyticsFormat.ts` et `sanctions/formatters.ts` (dashboard,
 * branche `recette`). Les libellés passent par `TEXT`, le site étant bilingue.
 */
import { getLocale, type Locale } from '$lib/i18n/state.svelte';

const TEXT = {
  fr: {
    minutes: (n: string) => `${n} min`,
    hours: (n: string) => `${n} h`,
    points: (v: string) => `${v} pts`,
    isNew: 'nouveau',
    types: { WARN: 'Avertissement', KICK: 'Expulsion', TIMEOUT: 'Exclusion temporaire', TEMP_BAN: 'Bannissement temporaire', BAN: 'Bannissement définitif' } as Record<string, string>,
  },
  en: {
    minutes: (n: string) => `${n} min`,
    hours: (n: string) => `${n} h`,
    points: (v: string) => `${v} pts`,
    isNew: 'new',
    types: { WARN: 'Warning (Warn)', KICK: 'Kick', TIMEOUT: 'Mute / Timeout (TO)', TEMP_BAN: 'Temporary ban', BAN: 'Permanent ban' } as Record<string, string>,
  },
};

export function dateLocale(locale: Locale = getLocale()): string {
  return locale === 'fr' ? 'fr-FR' : 'en-GB';
}

export function fmtNumber(n: number | null | undefined): string {
  return (n ?? 0).toLocaleString(dateLocale());
}

export function fmtPct(value: number, digits = 1): string {
  const rounded = Number(value.toFixed(digits));
  return `${rounded.toLocaleString(dateLocale(), { maximumFractionDigits: digits })} %`;
}

export function pct(part: number, whole: number): number {
  return whole > 0 ? (part / whole) * 100 : 0;
}

/** Minutes lues en heures : « 2 940 h », ou « 45 min » sous l'heure. */
export function fmtMinutes(minutes: number | null | undefined): string {
  const t = TEXT[getLocale()];
  const value = minutes ?? 0;
  if (value < 60) return t.minutes(fmtNumber(Math.round(value)));
  return t.hours(fmtNumber(Math.round(value / 60)));
}

/** Écart signé : « +12 % », « −3 pts », « = ». */
export function fmtDelta(delta: number | null, unit: 'pct' | 'pts' | 'abs'): string {
  const t = TEXT[getLocale()];
  if (delta === null) return t.isNew;
  const rounded = Number(delta.toFixed(1));
  if (rounded === 0) return '=';
  const sign = rounded > 0 ? '+' : '−';
  const abs = Math.abs(rounded).toLocaleString(dateLocale(), { maximumFractionDigits: 1 });
  if (unit === 'abs') return `${sign}${abs}`;
  return unit === 'pct' ? `${sign}${abs} %` : t.points(`${sign}${abs}`);
}

export function shortDate(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  return d.toLocaleDateString(dateLocale(), { day: 'numeric', month: 'short' });
}

export function relativeDelta(value: number, previous: number): number | null {
  if (previous === 0) return value === 0 ? 0 : null;
  return ((value - previous) / previous) * 100;
}

/** Libellé d'un type de sanction (`typeLabel` du dashboard). */
export function typeLabel(value: string): string {
  return TEXT[getLocale()].types[value] ?? value;
}

export const SERIES = [
  'var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)',
  'var(--series-5)', 'var(--series-6)', 'var(--series-7)', 'var(--series-8)',
] as const;
export const SERIES_NEUTRAL = 'var(--series-neutral)';

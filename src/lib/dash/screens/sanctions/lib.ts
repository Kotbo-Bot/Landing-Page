/**
 * Aides de l'écran Sanctions, recopiées du dashboard (dépôt `Kotbo`, branche
 * `recette`) :
 * - tri et filtres : `lib/sanctions/filterSort.ts`, tel quel ;
 * - libellés : `lib/sanctions/formatters.ts`, avec les textes du catalogue
 *   `messages/{fr,en}.json` au lieu de `m.*()` ;
 * - icône d'un article du règlement : `reportRuleIcon` de `lib/sanctions/reportRules.ts`.
 */
import type { Locale } from '$lib/i18n/state.svelte';
import type { DemoSanction, L } from '$lib/dash/fixtures/sanctions';

export type SortField = 'date' | 'duration' | 'type' | 'status' | 'target' | 'moderator';
export type SortDirection = 'asc' | 'desc';

export interface SanctionFilters {
  statuses: string[];
  types: string[];
  moderators: string[];
  targets: string[];
}

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export function filterSanctions(sanctions: DemoSanction[], filters: SanctionFilters): DemoSanction[] {
  return sanctions.filter((sanction) => {
    if (filters.statuses.length > 0 && !filters.statuses.includes(sanction.status)) return false;
    if (filters.types.length > 0 && !filters.types.includes(sanction.type)) return false;
    if (filters.moderators.length > 0 && !filters.moderators.includes(sanction.moderatorUserId)) return false;
    if (filters.targets.length > 0 && !filters.targets.includes(sanction.targetUserId)) return false;
    return true;
  });
}

export function sortSanctions(sanctions: DemoSanction[], sortOptions: SortOption[]): DemoSanction[] {
  if (sortOptions.length === 0) return sanctions;

  return [...sanctions].sort((a, b) => {
    for (const { field, direction } of sortOptions) {
      let compareResult = 0;
      switch (field) {
        case 'date':
          compareResult = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'duration':
          compareResult = (a.durationSeconds || 0) - (b.durationSeconds || 0);
          break;
        case 'type':
          compareResult = a.type.localeCompare(b.type);
          break;
        case 'status':
          compareResult = a.status.localeCompare(b.status);
          break;
        case 'target':
          compareResult = a.targetTag.localeCompare(b.targetTag);
          break;
        case 'moderator':
          compareResult = a.moderatorTag.localeCompare(b.moderatorTag);
          break;
      }
      if (compareResult !== 0) return direction === 'asc' ? compareResult : -compareResult;
    }
    return 0;
  });
}

export function filterAndSortSanctions(sanctions: DemoSanction[], filters: SanctionFilters, sortOptions: SortOption[]): DemoSanction[] {
  return sortSanctions(filterSanctions(sanctions, filters), sortOptions);
}

const TYPE_TEXT = {
  fr: { WARN: 'Avertissement', KICK: 'Expulsion', TIMEOUT: 'Exclusion temporaire', TEMP_BAN: 'Bannissement temporaire', BAN: 'Bannissement définitif' },
  en: { WARN: 'Warning (Warn)', KICK: 'Kick', TIMEOUT: 'Mute / Timeout (TO)', TEMP_BAN: 'Temporary ban', BAN: 'Permanent ban' },
} as const;

const STATUS_TEXT = {
  fr: { resolved: 'Terminée', failed: 'Échec' },
  en: { resolved: 'Resolved', failed: 'Failed' },
} as const;

export function typeLabel(value: string, locale: Locale): string {
  return (TYPE_TEXT[locale] as Record<string, string>)[value] ?? value;
}

export function statusLabel(value: string, locale: Locale): string {
  // « Active » est écrit en dur dans le dashboard, dans les deux langues.
  if (value === 'ACTIVE') return 'Active';
  if (value === 'RESOLVED') return STATUS_TEXT[locale].resolved;
  return STATUS_TEXT[locale].failed;
}

/** Le dashboard écrit « j » dans les deux langues ; ici « d » en anglais. */
export function durationLabel(seconds: number | null, locale: Locale): string {
  if (!seconds) return 'N/A';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}${locale === 'fr' ? 'j' : 'd'}`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.length > 0 ? parts.join(' ') : `${seconds}s`;
}

export function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return new Date().toISOString().slice(0, 16);
  return new Date(value).toISOString().slice(0, 16);
}

export function dateLocale(locale: Locale): string {
  return locale === 'fr' ? 'fr-FR' : 'en-US';
}

/** Texte de démo dans la langue affichée. */
export function tr(value: L | string | null | undefined, locale: Locale): string {
  if (value == null) return '';
  return typeof value === 'string' ? value : value[locale];
}

const EMOJI_ICON_MAP: Record<string, string> = {
  '⚠️': 'warning',
  '⚠': 'warning',
  '⛔': 'block',
  '🚫': 'block',
  '✅': 'check_circle',
  '❌': 'close',
  '📝': 'edit_note',
  '📌': 'push_pin',
  '⌛': 'hourglass_top',
  '⏳': 'hourglass_bottom',
};

export function reportRuleIcon(rule: { emoji: string | null; label: string; details: string }): string {
  const emoji = rule.emoji?.trim();
  if (emoji && EMOJI_ICON_MAP[emoji]) return EMOJI_ICON_MAP[emoji];
  const sourceText = `${rule.label} ${rule.details}`.toLowerCase();
  if (sourceText.includes('danger') || sourceText.includes('risque')) return 'warning';
  if (sourceText.includes('spam') || sourceText.includes('publicité')) return 'campaign';
  if (sourceText.includes('harc') || sourceText.includes('menace')) return 'report';
  if (sourceText.includes('insulte') || sourceText.includes('provocation')) return 'sentiment_dissatisfied';
  if (sourceText.includes('fuite') || sourceText.includes('confident')) return 'lock';
  return 'gavel';
}

export function sanitizeEvidenceLinks(value: string[]): string[] {
  return value.map((entry) => entry.trim()).filter((entry) => /^https?:\/\//i.test(entry));
}

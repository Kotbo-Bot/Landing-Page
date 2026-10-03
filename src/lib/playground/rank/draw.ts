/**
 * La carte de rang, dessinée dans le navigateur.
 *
 * Reprise de `renderRankCard` (bot, `services/progression/levelingService.ts`)
 * : mêmes dimensions, mêmes positions, mêmes fonds, même courbe d'XP. Le rendu
 * est local pour une raison qui n'est pas technique : le pseudo et la photo
 * que le visiteur saisit ne quittent jamais son navigateur, et la page reste
 * dans l'exemption de consentement (voir `funnel.ts`).
 *
 * Ce qui diffère du bot, et pourquoi :
 * - pas de cadres d'avatar ni de motifs de fond : ce sont des récompenses que
 *   les membres débloquent, les offrir ici les viderait de leur sens ;
 * - les badges de succès ne sont pas dessinés, pour la même raison.
 */
import { base } from '$app/paths';

export const CARD_WIDTH = 934;
export const CARD_HEIGHT = 282;

interface Stop {
  offset: number;
  color: string;
}

export interface Background {
  id: string;
  label: { fr: string; en: string };
  gradient: Stop[];
  accent: Stop[];
  backdrop: string;
}

/** Recopiés de `packages/shared/src/rankCard/presets.ts`. */
export const BACKGROUNDS: Background[] = [
  {
    id: 'default',
    label: { fr: 'Kotbo', en: 'Kotbo' },
    gradient: [{ offset: 0, color: '#0a0d13' }, { offset: 0.5, color: '#0f1219' }, { offset: 1, color: '#0a0d13' }],
    accent: [{ offset: 0, color: '#5865f2' }, { offset: 0.5, color: '#7b68ee' }, { offset: 1, color: '#57f287' }],
    backdrop: '#0a0d13',
  },
  {
    id: 'midnight',
    label: { fr: 'Minuit', en: 'Midnight' },
    gradient: [{ offset: 0, color: '#05070f' }, { offset: 1, color: '#101a33' }],
    accent: [{ offset: 0, color: '#1d4ed8' }, { offset: 1, color: '#60a5fa' }],
    backdrop: '#05070f',
  },
  {
    id: 'sunset',
    label: { fr: 'Coucher de soleil', en: 'Sunset' },
    gradient: [{ offset: 0, color: '#1b0b12' }, { offset: 1, color: '#3a1220' }],
    accent: [{ offset: 0, color: '#f97316' }, { offset: 1, color: '#ec4899' }],
    backdrop: '#1b0b12',
  },
  {
    id: 'forest',
    label: { fr: 'Forêt', en: 'Forest' },
    gradient: [{ offset: 0, color: '#06120c' }, { offset: 1, color: '#0d2418' }],
    accent: [{ offset: 0, color: '#16a34a' }, { offset: 1, color: '#a3e635' }],
    backdrop: '#06120c',
  },
  {
    id: 'crimson',
    label: { fr: 'Cramoisi', en: 'Crimson' },
    gradient: [{ offset: 0, color: '#140506' }, { offset: 1, color: '#2e0a10' }],
    accent: [{ offset: 0, color: '#b91c1c' }, { offset: 1, color: '#f87171' }],
    backdrop: '#140506',
  },
  {
    id: 'aurora',
    label: { fr: 'Aurore', en: 'Aurora' },
    gradient: [{ offset: 0, color: '#050b14' }, { offset: 0.5, color: '#0a1a24' }, { offset: 1, color: '#0b1020' }],
    accent: [{ offset: 0, color: '#2dd4bf' }, { offset: 1, color: '#a78bfa' }],
    backdrop: '#050b14',
  },
  {
    id: 'gold',
    label: { fr: 'Or', en: 'Gold' },
    gradient: [{ offset: 0, color: '#12100a' }, { offset: 1, color: '#241d0c' }],
    accent: [{ offset: 0, color: '#b45309' }, { offset: 1, color: '#fde047' }],
    backdrop: '#12100a',
  },
  {
    id: 'ocean',
    label: { fr: 'Océan', en: 'Ocean' },
    gradient: [{ offset: 0, color: '#04121a' }, { offset: 1, color: '#07293a' }],
    accent: [{ offset: 0, color: '#0284c7' }, { offset: 1, color: '#22d3ee' }],
    backdrop: '#04121a',
  },
  {
    id: 'candy',
    label: { fr: 'Bonbon', en: 'Candy' },
    gradient: [{ offset: 0, color: '#160b1f' }, { offset: 1, color: '#2a0f33' }],
    accent: [{ offset: 0, color: '#d946ef' }, { offset: 1, color: '#38bdf8' }],
    backdrop: '#160b1f',
  },
];

/** Les polices de la carte du bot (`static/rank/fonts`, SIL OFL 1.1). */
export const FONTS = [
  { id: 'default', family: 'sans-serif', file: null, label: { fr: 'Par défaut', en: 'Default' } },
  { id: 'poppins', family: 'KotboRank Poppins', file: 'poppins', label: { fr: 'Poppins', en: 'Poppins' } },
  { id: 'kanit', family: 'KotboRank Kanit', file: 'kanit', label: { fr: 'Kanit', en: 'Kanit' } },
  { id: 'barlow', family: 'KotboRank Barlow', file: 'barlow', label: { fr: 'Barlow', en: 'Barlow' } },
  { id: 'lato', family: 'KotboRank Lato', file: 'lato', label: { fr: 'Lato', en: 'Lato' } },
  { id: 'arvo', family: 'KotboRank Arvo', file: 'arvo', label: { fr: 'Arvo', en: 'Arvo' } },
  { id: 'ptserif', family: 'KotboRank PT Serif', file: 'ptserif', label: { fr: 'PT Serif', en: 'PT Serif' } },
  { id: 'spacemono', family: 'KotboRank Space Mono', file: 'spacemono', label: { fr: 'Space Mono', en: 'Space Mono' } },
] as const;
export type FontId = (typeof FONTS)[number]['id'];

const loadedFonts = new Map<string, Promise<void>>();

/** Charge une police de la carte à la demande. Un échec retombe sur la police système. */
export function loadFont(id: FontId): Promise<void> {
  const font = FONTS.find((f) => f.id === id);
  if (!font?.file || typeof FontFace === 'undefined') return Promise.resolve();

  let pending = loadedFonts.get(id);
  if (!pending) {
    const face = new FontFace(font.family, `url(${base}/rank/fonts/${font.file}.woff2)`, { weight: '700' });
    pending = face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
      })
      .catch(() => {
        // Police indisponible : la carte se dessine avec la police système.
      });
    loadedFonts.set(id, pending);
  }
  return pending;
}

// ── Succès ────────────────────────────────────────────────────────────────
//
// Recopiés de `packages/shared/src/rankCard/achievements.ts` : mêmes tracés,
// mêmes paliers, mêmes couleurs. Sont écartés « Staff Kotbo » et les succès
// que l'équipe attribue à la main (testeur, contributeur, chercheur de bug) :
// les laisser poser sur une carte téléchargée permettrait de fabriquer une
// fausse carte de l'équipe.

type Tier = 'bronze' | 'silver' | 'gold';

const TIER_COLORS: Record<Tier, string[]> = {
  bronze: ['#f0b27a', '#a0522d'],
  silver: ['#f1f5f9', '#94a3b8'],
  gold: ['#fde68a', '#d97706'],
};

const BADGE_ICONS = {
  gem: 'M6 3h12l4 6-10 12L2 9l4-6z',
  gift: 'M3 8h8v4H3zM13 8h8v4h-8zM4 13h7v8H4zM13 13h7v8h-7zM12 7.5C10 3 6 4 7.5 6.5 8.3 7.8 10.5 8 12 8c1.5 0 3.7-.2 4.5-1.5C18 4 14 3 12 7.5z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  shield: 'M12 2l8 3v6c0 5.5-3.4 9.7-8 11-4.6-1.3-8-5.5-8-11V5l8-3z',
  peak: 'M2 20L9 7l4 6 3-4 6 11H2z',
  trophy: 'M7 3h10v6a5 5 0 0 1-10 0V3zM17 4h4v3c0 2.4-1.8 4.3-4.2 4.5l.2-2c1.3-.3 2-1.2 2-2.5V6h-2zM7 4H3v3c0 2.4 1.8 4.3 4.2 4.5l-.2-2C5.7 9.2 5 8.3 5 7V6h2zM11 14h2v4h-2zM7 19h10v3H7z',
  heart: 'M12 21l-1.5-1.4C5.4 15 2 11.9 2 8.1 2 5 4.4 2.6 7.5 2.6c1.7 0 3.4.8 4.5 2.1 1.1-1.3 2.8-2.1 4.5-2.1C19.6 2.6 22 5 22 8.1c0 3.8-3.4 6.9-8.5 11.5L12 21z',
  star: 'M12 2.5l2.53 6.52 6.98.39-5.42 4.42 1.79 6.76L12 16.8l-5.88 3.79 1.79-6.76-5.42-4.42 6.98-.39L12 2.5z',
  target: 'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 1 1 0-14zm0 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z',
} as const;

export interface Achievement {
  id: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
  title: { fr: string; en: string };
  tier: Tier;
  icon: keyof typeof BADGE_ICONS;
  /** Niveau requis, pour les succès de niveau : l'atelier suit le curseur. */
  minLevel?: number;
}

export const ACHIEVEMENTS = [
  { id: 'level_25', label: { fr: 'Habitué', en: 'Regular' }, description: { fr: 'Atteindre le niveau 25 sur un serveur.', en: 'Reach level 25 on a server.' }, title: { fr: 'Habitué', en: 'Regular' }, tier: 'bronze', icon: 'bolt', minLevel: 25 },
  { id: 'level_50', label: { fr: 'Vétéran', en: 'Veteran' }, description: { fr: 'Atteindre le niveau 50 sur un serveur.', en: 'Reach level 50 on a server.' }, title: { fr: 'Vétéran', en: 'Veteran' }, tier: 'silver', icon: 'shield', minLevel: 50 },
  { id: 'level_100', label: { fr: 'Légende', en: 'Legend' }, description: { fr: 'Atteindre le niveau 100 sur un serveur.', en: 'Reach level 100 on a server.' }, title: { fr: 'Légende', en: 'Legend' }, tier: 'gold', icon: 'peak', minLevel: 100 },
  { id: 'first_place', label: { fr: 'Numéro un', en: 'Number one' }, description: { fr: "Être premier du classement d'XP d'un serveur d'au moins 10 membres.", en: 'Top the XP leaderboard of a server with at least 10 members.' }, title: { fr: 'Numéro un', en: 'Number one' }, tier: 'gold', icon: 'trophy' },
  { id: 'reputation_50', label: { fr: 'Apprécié', en: 'Appreciated' }, description: { fr: 'Recevoir 50 points de réputation.', en: 'Receive 50 reputation points.' }, title: { fr: 'Apprécié', en: 'Appreciated' }, tier: 'silver', icon: 'heart' },
  { id: 'starboard_10', label: { fr: 'Étoile', en: 'Star' }, description: { fr: 'Voir 10 de ses messages mis en avant sur un starboard.', en: 'Get 10 of your messages featured on a starboard.' }, title: { fr: 'Étoile', en: 'Star' }, tier: 'silver', icon: 'star' },
  { id: 'quests_50', label: { fr: 'Aventurier', en: 'Adventurer' }, description: { fr: 'Terminer 50 quêtes.', en: 'Complete 50 quests.' }, title: { fr: 'Aventurier', en: 'Adventurer' }, tier: 'bronze', icon: 'target' },
  { id: 'supporter_1', label: { fr: 'Soutien', en: 'Supporter' }, description: { fr: 'Payer un abonnement Kotbo depuis 1 mois.', en: 'Pay for a Kotbo subscription for 1 month.' }, title: { fr: 'Soutien', en: 'Supporter' }, tier: 'bronze', icon: 'gem' },
  { id: 'supporter_6', label: { fr: 'Mécène', en: 'Patron' }, description: { fr: 'Payer un abonnement Kotbo depuis 6 mois.', en: 'Pay for a Kotbo subscription for 6 months.' }, title: { fr: 'Mécène', en: 'Patron' }, tier: 'silver', icon: 'gem' },
  { id: 'supporter_12', label: { fr: 'Grand mécène', en: 'Grand patron' }, description: { fr: 'Payer un abonnement Kotbo depuis 12 mois.', en: 'Pay for a Kotbo subscription for 12 months.' }, title: { fr: 'Grand mécène', en: 'Grand patron' }, tier: 'gold', icon: 'gem' },
  { id: 'gift_giver', label: { fr: 'Bienfaiteur', en: 'Benefactor' }, description: { fr: 'Offrir Kotbo à un serveur.', en: 'Gift Kotbo to a server.' }, title: { fr: 'Bienfaiteur', en: 'Benefactor' }, tier: 'gold', icon: 'gift' },
] as const satisfies readonly Achievement[];

export type AchievementId = (typeof ACHIEVEMENTS)[number]['id'];
/** Le catalogue, typé pour être parcouru : `minLevel` n'existe que sur certains succès. */
export const ACHIEVEMENT_LIST = ACHIEVEMENTS as readonly (Achievement & { id: AchievementId })[];
export const MAX_BADGES = 3;

export function achievement(id: string): Achievement | null {
  return (ACHIEVEMENTS as readonly Achievement[]).find((a) => a.id === id) ?? null;
}

/** Un succès de niveau ne se pose qu'au niveau requis, comme dans le bot. */
export function isAchievementReachable(item: Achievement, level: number): boolean {
  return item.minLevel === undefined || level >= item.minLevel;
}

const BADGE_RADIUS = 15;
const BADGE_GAP = 10;
const badgePaths = new Map<string, Path2D>();

/** Les pastilles de succès, comme `drawRankCardBadges` côté bot. */
function drawBadges(ctx: CanvasRenderingContext2D, ids: readonly string[], startX: number, centerY: number): void {
  let cx = startX + BADGE_RADIUS;
  for (const id of ids) {
    const item = achievement(id);
    if (!item) continue;
    const colors = TIER_COLORS[item.tier];
    const stops = colors.map((color, i) => ({ offset: colors.length === 1 ? 0 : i / (colors.length - 1), color }));

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, centerY, BADGE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient(ctx, cx - BADGE_RADIUS, centerY - BADGE_RADIUS, cx + BADGE_RADIUS, centerY + BADGE_RADIUS, stops);
    ctx.stroke();

    const size = BADGE_RADIUS * 1.2;
    let path = badgePaths.get(item.icon);
    if (!path) {
      path = new Path2D(BADGE_ICONS[item.icon]);
      badgePaths.set(item.icon, path);
    }
    ctx.translate(cx - size / 2, centerY - size / 2);
    ctx.scale(size / 24, size / 24);
    ctx.fillStyle = gradient(ctx, 0, 0, 24, 24, stops);
    ctx.fill(path, 'evenodd');
    ctx.restore();

    cx += BADGE_RADIUS * 2 + BADGE_GAP;
  }
}

/** Couleurs d'un palier, pour l'atelier (pastilles cliquables). */
export function tierColors(item: Achievement): string[] {
  return TIER_COLORS[item.tier];
}

/** Tracé SVG d'un succès, pour l'atelier. */
export function badgePath(item: Achievement): string {
  return BADGE_ICONS[item.icon];
}

/** Courbe par défaut du bot (`DEFAULT_LEVEL_CURVE`) : 100·n² + 200·n. */
export function xpForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.round(100 * level * level + 200 * level);
}

export interface CardInput {
  name: string;
  tag: string;
  level: number;
  /** Avancement dans le niveau, de 0 à 1. */
  progress: number;
  rank: number;
  background: Background;
  font: FontId;
  avatar: HTMLImageElement | null;
  /** Succès affichés en pastilles sous le pseudo, trois au plus. */
  badges: AchievementId[];
  /** Succès porté comme titre : il remplace le `@pseudo`, dans la teinte de son palier. */
  title: AchievementId | null;
  locale: 'fr' | 'en';
}

const LABELS = {
  fr: {
    level: (n: number) => `Niveau ${n}`,
    rank: (n: number) => `${n}${n === 1 ? 'er' : 'e'} du serveur`,
    remaining: (xp: string, next: number) => `Encore ${xp} XP pour le niveau ${next}`,
    locale: 'fr-FR',
  },
  en: {
    level: (n: number) => `Level ${n}`,
    rank: (n: number) => `#${n} on this server`,
    remaining: (xp: string, next: number) => `${xp} XP to level ${next}`,
    locale: 'en-US',
  },
};

function gradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, stops: Stop[]) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const s of stops) g.addColorStop(s.offset, s.color);
  return g;
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > max) out = out.slice(0, -1);
  return `${out}…`;
}

export function drawCard(ctx: CanvasRenderingContext2D, input: CardInput): void {
  const W = CARD_WIDTH;
  const H = CARD_HEIGHT;
  const labels = LABELS[input.locale];
  const bg = input.background;
  const family = FONTS.find((f) => f.id === input.font)?.family ?? 'sans-serif';
  const stack = family === 'sans-serif' ? 'sans-serif' : `"${family}", sans-serif`;

  ctx.clearRect(0, 0, W, H);

  // Fond.
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, 16);
  ctx.fillStyle = gradient(ctx, 0, 0, W, H, bg.gradient);
  ctx.fill();
  ctx.restore();

  // Avatar.
  const cx = 115;
  const cy = 130;
  const r = 62;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  ctx.fillStyle = gradient(ctx, cx - r, cy - r, cx + r, cy + r, bg.accent);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  if (input.avatar) {
    ctx.drawImage(input.avatar, cx - r, cy - r, r * 2, r * 2);
  } else {
    ctx.fillStyle = bg.accent[0].color;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((input.name.trim() || '?').slice(0, 2).toUpperCase(), cx, cy + 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  ctx.restore();

  // Pastille de statut.
  ctx.beginPath();
  ctx.arc(cx + 45, cy + 45, 14, 0, Math.PI * 2);
  ctx.fillStyle = bg.backdrop;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 45, cy + 45, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#3ba55d';
  ctx.fill();

  // Niveau et rang, mesurés d'abord : ils bornent la place du pseudo.
  const rightX = W - 45;
  const levelText = labels.level(input.level);
  const rankText = labels.rank(input.rank);
  ctx.font = 'bold 26px sans-serif';
  const levelW = ctx.measureText(levelText).width;
  ctx.font = '16px sans-serif';
  const rankW = ctx.measureText(rankText).width;
  const rightLeft = rightX - Math.max(levelW, rankW);

  const nameX = 210;
  const identityMax = rightLeft - nameX - 24;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 30px ${stack}`;
  ctx.fillText(fit(ctx, input.name.trim() || '?', identityMax), nameX, 80);

  // Un titre de succès prend la place du tag, dans la teinte de son palier.
  const title = input.title ? achievement(input.title) : null;
  ctx.fillStyle = title ? TIER_COLORS[title.tier][0] : '#8b949e';
  ctx.font = title ? 'bold 17px sans-serif' : '17px sans-serif';
  ctx.fillText(fit(ctx, title ? title.title[input.locale] : input.tag, identityMax), nameX, 106);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(levelText, rightX, 76);
  ctx.fillStyle = '#8b949e';
  ctx.font = '16px sans-serif';
  ctx.fillText(rankText, rightX, 104);

  // XP.
  const prev = xpForLevel(input.level - 1);
  const next = xpForLevel(input.level);
  const span = Math.max(1, next - prev);
  const inLevel = Math.round(span * Math.min(1, Math.max(0, input.progress)));
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `${inLevel.toLocaleString(labels.locale)} / ${span.toLocaleString(labels.locale)} XP`,
    rightX,
    155,
  );
  ctx.textAlign = 'left';

  drawBadges(ctx, input.badges, nameX, 140);

  // Barre de progression.
  const barX = nameX;
  const barY = 175;
  const barW = W - nameX - 45;
  const barH = 22;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, barH / 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  const filled = Math.max(barH, barW * Math.min(1, Math.max(0, input.progress)));
  ctx.beginPath();
  ctx.roundRect(barX, barY, filled, barH, barH / 2);
  ctx.fillStyle = gradient(ctx, barX, 0, barX + barW, 0, bg.accent);
  ctx.fill();

  const remaining = span - inLevel;
  if (remaining > 0) {
    ctx.fillStyle = '#8b949e';
    ctx.font = '14px sans-serif';
    ctx.fillText(labels.remaining(remaining.toLocaleString(labels.locale), input.level + 1), nameX, barY + barH + 30);
  }
}

/** Charge une image locale ou du site. Résout `null` si elle ne se charge pas. */
export function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

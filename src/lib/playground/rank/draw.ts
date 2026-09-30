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
  emojis: HTMLImageElement[];
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

  const emojiBand = input.emojis.length > 0 ? input.emojis.length * 26 + 10 : 0;
  ctx.fillStyle = '#8b949e';
  ctx.font = '17px sans-serif';
  const tag = fit(ctx, input.tag, identityMax - emojiBand);
  ctx.fillText(tag, nameX, 106);
  const tagW = ctx.measureText(tag).width;
  input.emojis.forEach((img, i) => {
    ctx.drawImage(img, nameX + tagW + 16 + i * 26, 88, 22, 22);
  });

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

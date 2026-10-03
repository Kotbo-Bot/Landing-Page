/**
 * Les briques du film, reprises de la direction artistique du site (DESIGN.md) :
 * le tableau piqué de points, l'encre, l'indigo réservé au moment clé, le
 * rouge marqueur pour ce qui déraille, Manrope pour les titres, Inter pour
 * l'interface, Caveat pour les annotations. Les surfaces Discord gardent les
 * couleurs de Discord.
 */
import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const C = {
  board: '#f8f9fa',
  dot: '#d1d5db',
  ink: '#111827',
  text: '#1f2937',
  muted: '#4b5563',
  line: '#e5e7eb',
  accent: '#4f46e5',
  marker: '#ff4d4d',
  red700: '#b91c1c',
  postit: '#fdfd96',
  dc: { rail: '#1e1f22', sidebar: '#2b2d31', chat: '#313338', text: '#dbdee1', heading: '#f2f3f5', muted: '#949ba4', blurple: '#5865f2' },
} as const;

export const F = {
  head: 'Manrope, sans-serif',
  body: 'Inter, sans-serif',
  hand: 'Caveat, cursive',
  mono: 'ui-monospace, Consolas, monospace',
} as const;

const FONTS: [string, string, string][] = [
  ['Manrope', 'manrope-latin-800-normal.woff2', '800'],
  ['Manrope', 'manrope-latin-700-normal.woff2', '700'],
  ['Inter', 'inter-latin-400-normal.woff2', '400'],
  ['Inter', 'inter-latin-500-normal.woff2', '500'],
  ['Inter', 'inter-latin-600-normal.woff2', '600'],
  ['Inter', 'inter-latin-700-normal.woff2', '700'],
  ['Caveat', 'caveat-latin-700-normal.woff2', '700'],
];

/** Les polices du site, chargées avant la première image. */
export function loadFonts() {
  if (typeof document === 'undefined') return;
  const handle = delayRender('fonts');
  Promise.all(
    FONTS.map(([family, file, weight]) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, { weight }).load().then((face) => document.fonts.add(face)),
    ),
  ).then(() => continueRender(handle));
}

export const ease = Easing.bezier(0.45, 0, 0.2, 1);
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Une valeur qui passe de `a` à `b` entre deux images, adoucie. */
export function tween(frame: number, start: number, dur: number, a: number, b: number) {
  return interpolate(frame, [start, start + dur], [a, b], { ...clamp, easing: ease });
}

export function useSpring(delay = 0, damping = 18) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass: 0.7 } });
}

export const ktb = (name: string) => staticFile(`ktb/ktb_${name}.png`);

/** Le tableau : la surface claire piquée de points du site. */
export const Board: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <AbsoluteFill
    style={{
      background: dark ? C.ink : C.board,
      backgroundImage: dark ? undefined : `radial-gradient(${C.dot} 2px, transparent 2px)`,
      backgroundSize: '40px 40px',
      fontFamily: F.body,
      color: dark ? '#fff' : C.text,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Un titre dont les mots montent un à un, chacun derrière son masque. */
export const Rise: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, size = 88, color = C.ink, width, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        fontFamily: F.head,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: '-0.025em',
        color,
        width,
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {text.split(' ').map((word, i) => {
        const p = spring({ frame: frame - delay - i * 3, fps, config: { damping: 16, mass: 0.6 } });
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.08 }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)` }}>{word}</span>
          </span>
        );
      })}
    </div>
  );
};

/** L'annotation au marqueur : la voix du visiteur, jamais une information. */
export const Note: React.FC<{ text: string; delay?: number; rotate?: number; style?: React.CSSProperties }> = ({
  text,
  delay = 0,
  rotate = -3,
  style,
}) => {
  const p = useSpring(delay, 14);
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: F.hand,
        fontWeight: 700,
        fontSize: 54,
        color: C.text,
        background: C.postit,
        padding: '14px 26px 18px',
        boxShadow: '3px 6px 10px rgba(0,0,0,0.12)',
        transform: `rotate(${rotate}deg) scale(${0.6 + p * 0.4})`,
        opacity: p,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export interface Cam {
  /** Point visé, en fraction de la capture (0 à 1). */
  x: number;
  y: number;
  /** 1 : la capture tient toute la largeur de la fenêtre. */
  zoom: number;
}

/**
 * Une capture du vrai dashboard, filmée : la caméra glisse d'un cadrage à
 * l'autre. La capture ne laisse jamais de bord vide dans la fenêtre.
 */
export const Shot: React.FC<{
  src: string;
  w: number;
  h: number;
  from: Cam;
  to: Cam;
  start?: number;
  dur: number;
}> = ({ src, w, h, from, to, start = 0, dur }) => {
  const frame = useCurrentFrame();
  const t = tween(frame, start, dur, 0, 1);
  const zoom = from.zoom + (to.zoom - from.zoom) * t;
  const fx = from.x + (to.x - from.x) * t;
  const fy = from.y + (to.y - from.y) * t;
  const imgW = w * zoom;
  const imgH = imgW * 0.625;
  const left = Math.min(0, Math.max(w - imgW, w / 2 - fx * imgW));
  const top = Math.min(0, Math.max(h - imgH, h / 2 - fy * imgH));
  return (
    <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', background: '#fff' }}>
      <Img src={src} style={{ position: 'absolute', width: imgW, height: imgH, left, top }} />
    </div>
  );
};

/** La fenêtre du dashboard : une barre d'adresse sobre, la carte du site (16 px). */
export const Window: React.FC<{
  url: string;
  w: number;
  h: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ url, w, h, children, style }) => (
  <div
    style={{
      position: 'absolute',
      width: w,
      borderRadius: 18,
      overflow: 'hidden',
      background: '#fff',
      border: `2px solid ${C.line}`,
      boxShadow: '0 50px 100px -30px rgba(17,24,39,0.35)',
      ...style,
    }}
  >
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 20px',
        background: '#f9fafb',
        borderBottom: `2px solid ${C.line}`,
        fontSize: 20,
        fontWeight: 600,
        color: C.muted,
      }}
    >
      <Img src={staticFile('logo.svg')} style={{ width: 24, height: 24 }} />
      {url}
    </div>
    <div style={{ position: 'relative', height: h, overflow: 'hidden' }}>{children}</div>
  </div>
);

/** La liste des modules d'une famille, qui se coche nom par nom. */
export const Ticker: React.FC<{
  label: string;
  modules: readonly string[];
  delay?: number;
  every?: number;
  columns?: number;
  size?: number;
}> = ({ label, modules, delay = 0, every = 5, columns = 1, size = 30 }) => {
  const frame = useCurrentFrame();
  const head = tween(frame, delay, 12, 0, 1);
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.muted, opacity: head, marginBottom: 18 }}>
        {label} · {modules.length}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, auto)`, columnGap: 40, rowGap: size * 0.32 }}>
        {modules.map((name, i) => {
          const at = delay + 8 + i * every;
          const p = tween(frame, at, 10, 0, 1);
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: size,
                fontWeight: 600,
                color: C.text,
                opacity: p,
                transform: `translateX(${(1 - p) * -24}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <Img src={ktb('check')} style={{ width: size * 0.8, height: size * 0.8 }} />
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Le logo de Kotbo, monté pièce par pièce : socle, fût, ailes, point. */
export const Logo: React.FC<{ size: number; delay?: number }> = ({ size, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number, damping = 12) => spring({ frame: frame - delay - d, fps, config: { damping, mass: 0.6 } });
  const base = s(0, 14);
  const bar = s(6);
  const top = s(11);
  const bottom = s(15);
  const dot = s(20, 8);
  return (
    <svg viewBox="20 20 160 160" width={size} height={size}>
      <rect
        x="20"
        y="20"
        width="160"
        height="160"
        rx="40"
        fill="#00264d"
        stroke="#00e5ff"
        strokeOpacity="0.7"
        strokeWidth="3"
        style={{ transformOrigin: '100px 100px', transform: `scale(${0.5 + base * 0.5}) rotate(${(1 - base) * -12}deg)`, opacity: base }}
      />
      <g transform="translate(65, 60)" fill="white">
        <rect x="0" y="0" width="14" height="80" rx="7" style={{ transformOrigin: '7px 80px', transform: `scaleY(${bar})` }} />
        <path
          d="M14 25 C 30 25, 55 10, 55 10 C 55 10, 60 20, 45 35 C 35 45, 14 50, 14 50 Z"
          style={{ transformOrigin: '14px 37px', transform: `rotate(${(1 - top) * -40}deg) scale(${top})`, opacity: top }}
        />
        <path
          d="M14 55 C 30 55, 60 70, 60 70 C 60 70, 55 85, 40 80 C 30 75, 14 65, 14 65 Z"
          style={{ transformOrigin: '14px 60px', transform: `rotate(${(1 - bottom) * 40}deg) scale(${bottom})`, opacity: bottom }}
        />
        <circle cx="70" cy="40" r="7" style={{ transformOrigin: '70px 40px', transform: `scale(${dot})` }} />
      </g>
    </svg>
  );
};

/** Le curseur, qui glisse d'un point à l'autre puis appuie. */
export const Cursor: React.FC<{ from: [number, number]; to: [number, number]; start: number; dur?: number; press?: number }> = ({
  from,
  to,
  start,
  dur = 24,
  press,
}) => {
  const frame = useCurrentFrame();
  const t = tween(frame, start, dur, 0, 1);
  const x = from[0] + (to[0] - from[0]) * t;
  const y = from[1] + (to[1] - from[1]) * t;
  const opacity = tween(frame, start - 6, 8, 0, 1);
  const down = press !== undefined && frame >= press && frame < press + 6 ? 0.82 : 1;
  const ring = press !== undefined ? tween(frame, press, 16, 0, 1) : 0;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none' }}>
      {press !== undefined && frame >= press && (
        <div
          style={{
            position: 'absolute',
            left: -30,
            top: -30,
            width: 60,
            height: 60,
            borderRadius: 999,
            border: `4px solid ${C.ink}`,
            opacity: 0.5 * (1 - ring),
            transform: `scale(${0.3 + ring * 1.6})`,
          }}
        />
      )}
      <svg width="46" height="46" viewBox="0 0 24 24" style={{ transform: `scale(${down})`, transformOrigin: '4px 3px' }}>
        <path d="M4 2.5v17.2l4.6-4.3 3.1 6.9 3.2-1.4-3.1-6.8h6.4z" fill={C.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Avatar à initiales, comme ceux des aperçus du site : pas de visage inventé. */
export const Avatar: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: color,
      color: '#fff',
      display: 'grid',
      placeItems: 'center',
      fontFamily: F.body,
      fontWeight: 800,
      fontSize: size * 0.36,
      flexShrink: 0,
    }}
  >
    {name.slice(0, 2).toUpperCase()}
  </div>
);

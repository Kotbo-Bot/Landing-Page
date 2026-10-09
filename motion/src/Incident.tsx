/**
 * La boucle de la fiche top.gg : un incident de modération géré de bout en bout,
 * 21 s à 30 images par seconde, sans raccord visible entre la fin et le début.
 *
 *   1. Un lien piégé tombe dans #général (souligné au marqueur rouge).
 *   2. L'auto-modération le retire, Kotbo le signale dans le salon.
 *   3. La fiche du membre s'ouvre : historique, sanction passée, note du staff.
 *   4. Avertissement appliqué en deux clics, l'historique se met à jour.
 *   5. La vraie page des logs : la ligne de l'avertissement, entourée.
 *
 * Le rail de gauche suit l'étape en cours, pour qui arrive au milieu de la boucle.
 * Les noms (Vantar, Lena) sont ceux du dashboard de démo filmé dans `logs`.
 */
import React from 'react';
import { AbsoluteFill, Img, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Avatar, Board, C, F, Shot, Window, clamp, ease, ktb, loadFonts, tween } from './ui';

loadFonts();

export const INCIDENT_FRAMES = 630;

/** Début de chaque étape, puis la remise à zéro de la boucle. */
const STEP = [30, 100, 180, 300, 420] as const;
const RESET = 576;

const STEPS = ['Un lien piégé tombe', "L'automod le retire", 'La fiche membre parle', 'Sanction en deux clics', 'Tout est tracé'];

/* Géométrie de la scène (composition 1600 × 900). */
const WIN = { left: 620, top: 70, w: 920, h: 600 };
const BAR = 54; // barre d'adresse de <Window> + sa bordure
const BTN = { x: 678, y: 40, w: 210, h: 58 };
const MENU = { x: 678, y: 108, w: 210, item: 52 };

const at = (x: number, y: number): [number, number] => [WIN.left + x, WIN.top + BAR + y];

export const Incident: React.FC = () => {
  const frame = useCurrentFrame();
  const reset = tween(frame, RESET + 10, 30, 0, 1);
  return (
    <Board>
      <Rail frame={frame} reset={reset} />
      <DiscordPanel frame={frame} />
      <MemberWindow frame={frame} />
      <LogsWindow frame={frame} />
      <Pointer frame={frame} />
    </Board>
  );
};

/* ── Rail des étapes ──────────────────────────────────────────────────── */

const Rail: React.FC<{ frame: number; reset: number }> = ({ frame, reset }) => {
  const progress = interpolate(frame, [STEP[0], STEP[4]], [0, 1], { ...clamp, easing: ease }) * (1 - reset);
  const ROW = 92;
  return (
    <div style={{ position: 'absolute', left: 70, top: 92, width: 480 }}>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.muted }}>Modération avec Kotbo</div>
      <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 54, lineHeight: 1.05, letterSpacing: '-0.025em', color: C.ink, marginTop: 10 }}>
        Un incident, géré de A à Z
      </div>

      <div style={{ position: 'relative', marginTop: 56 }}>
        {/* La ligne de progression, derrière les pastilles. */}
        <div style={{ position: 'absolute', left: 21, top: 22, width: 4, height: ROW * 4, background: C.line, borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: 21, top: 22, width: 4, height: ROW * 4 * progress, background: C.accent, borderRadius: 4 }} />

        {STEPS.map((label, i) => {
          const on = tween(frame, STEP[i], 12, 0, 1) * (1 - reset);
          const done = (i < 4 ? tween(frame, STEP[i + 1], 12, 0, 1) : 0) * (1 - reset);
          const current = on * (1 - done);
          return (
            <div key={label} style={{ position: 'relative', height: ROW, display: 'flex', alignItems: 'flex-start', gap: 22 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  flexShrink: 0,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  background: interpolateColors(on, [0, 1], ['#ffffff', C.accent]),
                  border: `3px solid ${interpolateColors(on, [0, 1], [C.line, C.accent])}`,
                  color: interpolateColors(on, [0, 1], ['#9ca3af', '#ffffff']),
                  fontFamily: F.head,
                  fontWeight: 800,
                  fontSize: 22,
                  transform: `scale(${1 + current * 0.12})`,
                  boxShadow: current > 0.01 ? `0 0 0 ${current * 9}px rgba(79,70,229,0.14)` : 'none',
                }}
              >
                {done > 0.5 ? <Img src={ktb('check')} style={{ width: 26, height: 26, filter: 'brightness(0) invert(1)' }} /> : i + 1}
              </div>
              <div
                style={{
                  paddingTop: 4,
                  fontSize: 31,
                  fontWeight: 600,
                  color: interpolateColors(on - done * 0.45, [0, 0.55, 1], ['#9ca3af', C.muted, C.ink]),
                  transform: `translateX(${current * 6}px)`,
                }}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: 760, display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.head, fontWeight: 800, fontSize: 26, color: C.ink }}>
        <Img src={staticFile('logo.svg')} style={{ width: 34, height: 34 }} />
        kotbo.fr
      </div>
    </div>
  );
};

/* ── 1 et 2 : Discord ─────────────────────────────────────────────────── */

const Msg: React.FC<{
  author: string;
  color: string;
  time: string;
  avatar: React.ReactNode;
  bot?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ author, color, time, avatar, bot, children, style }) => (
  <div style={{ display: 'flex', gap: 18, padding: '10px 26px', ...style }}>
    {avatar}
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 26, color }}>{author}</span>
        {bot && <span style={{ background: C.dc.blurple, color: '#fff', fontSize: 15, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>APP</span>}
        <span style={{ fontSize: 18, color: C.dc.muted }}>{time}</span>
      </div>
      <div style={{ fontSize: 26, color: C.dc.text, lineHeight: 1.4 }}>{children}</div>
    </div>
  </div>
);

const DiscordPanel: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const sp = (from: number, damping = 18) => spring({ frame: frame - from, fps, config: { damping, mass: 0.7 } });

  // Le message piégé : arrive, se fait souligner, barrer, puis se replie.
  const spam = frame >= STEP[0] + 6 ? sp(STEP[0] + 6) : 0;
  const underline = tween(frame, STEP[0] + 34, 16, 0, 1);
  const strike = tween(frame, STEP[1] + 4, 12, 0, 1);
  const fold = tween(frame, STEP[1] + 24, 16, 0, 1);
  // L'avis de Kotbo, retiré pendant la remise à zéro pour revenir à l'image 0.
  const bot = frame >= STEP[1] + 30 ? sp(STEP[1] + 30) : 0;
  const botOut = tween(frame, RESET, 14, 0, 1);

  // Le panneau recule quand la fiche membre arrive, puis revient en fin de boucle.
  const back = tween(frame, STEP[2], 26, 0, 1) * (1 - tween(frame, RESET + 14, 34, 0, 1));

  return (
    <div
      style={{
        position: 'absolute',
        left: 600,
        top: 112,
        width: 900,
        height: 600,
        borderRadius: 16,
        overflow: 'hidden',
        background: C.dc.chat,
        boxShadow: '0 50px 100px -30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        transformOrigin: 'left center',
        transform: `translateX(${back * -70}px) scale(${1 - back * 0.08})`,
        filter: `brightness(${1 - back * 0.25})`,
      }}
    >
      <div style={{ height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 26px', borderBottom: `2px solid ${C.dc.rail}`, fontSize: 26, fontWeight: 600, color: C.dc.heading }}>
        <span style={{ color: C.dc.muted, fontWeight: 500, fontSize: 32 }}>#</span>
        général
        <span style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 500, color: C.dc.muted }}>Atelier Nova</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 22 }}>
        <Msg author="Tom" color="#5eead4" time="12:14" avatar={<Avatar name="Tom" size={52} color="#0f766e" />}>
          quelqu'un pour une game ce soir ?
        </Msg>
        <Msg author="Léoxyz" color="#93c5fd" time="12:14" avatar={<Avatar name="Léo" size={52} color="#0e7490" />}>
          go 21h, je ramène Cyril
        </Msg>

        <div style={{ maxHeight: 120 * (1 - fold), overflow: 'hidden', opacity: spam * (1 - fold) }}>
          <Msg
            author="vantar"
            color={C.dc.heading}
            time="12:15"
            avatar={<Avatar name="Va" size={52} color="#be185d" />}
            style={{ transform: `translateY(${(1 - spam) * 24}px)`, opacity: 1 - strike * 0.45 }}
          >
            <span style={{ position: 'relative' }}>
              Nitro offert aux 50 premiers{' '}
              <span style={{ position: 'relative', color: '#00a8fc' }}>
                nitro-gift.xyz/claim
                <span style={{ position: 'absolute', left: -4, right: -4, bottom: -6, height: 5, background: C.marker, borderRadius: 4, transformOrigin: 'left', transform: `scaleX(${underline}) rotate(-1deg)` }} />
              </span>
              <span style={{ position: 'absolute', left: 0, top: '52%', height: 4, width: `${strike * 100}%`, background: C.dc.text, borderRadius: 4 }} />
            </span>
          </Msg>
        </div>

        <div style={{ maxHeight: 150 * (1 - botOut), overflow: 'hidden', opacity: bot * (1 - botOut) }}>
          <Msg
            author="Kotbo"
            color={C.dc.heading}
            bot
            time="12:15"
            avatar={<Img src={staticFile('logo.svg')} style={{ width: 52, height: 52 }} />}
            style={{ transform: `translateY(${(1 - bot) * 20}px)` }}
          >
            <div style={{ marginTop: 6, background: C.dc.sidebar, borderLeft: '6px solid #f23f43', borderRadius: 6, padding: '12px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <Img src={ktb('shield')} style={{ width: 34, height: 34 }} />
              <div>
                <div style={{ fontWeight: 700, color: C.dc.heading, fontSize: 24 }}>Lien suspect supprimé</div>
                <div style={{ fontSize: 20, color: C.dc.muted }}>Message de @vantar retiré · auto-modération</div>
              </div>
            </div>
          </Msg>
        </div>
      </div>
    </div>
  );
};

/* ── 3 et 4 : la fiche membre ─────────────────────────────────────────── */

const HISTORY = [
  { icon: 'shield', when: "Aujourd'hui, 12:15", what: 'Lien suspect supprimé', by: 'auto-modération', hot: true },
  { icon: 'mute', when: '30/09', what: 'Mise en sourdine, 1 h', by: 'par @lena' },
  { icon: 'online', when: '27/09', what: 'A rejoint le serveur', by: 'Atelier Nova' },
];

const Row: React.FC<{ icon: string; when: string; what: string; by: string; hot?: boolean; style?: React.CSSProperties }> = ({ icon, when, what, by, hot, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 78, padding: '0 18px', borderRadius: 14, background: hot ? '#fef2f2' : '#f9fafb', border: `2px solid ${hot ? '#fecaca' : C.line}`, ...style }}>
    <Img src={ktb(icon)} style={{ width: 34, height: 34, flexShrink: 0 }} />
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap' }}>{what}</div>
      <div style={{ fontSize: 18, color: C.muted, whiteSpace: 'nowrap' }}>
        {when} · {by}
      </div>
    </div>
  </div>
);

const MemberWindow: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const sp = (from: number, damping = 18) => (frame >= from ? spring({ frame: frame - from, fps, config: { damping, mass: 0.7 } }) : 0);

  const enter = sp(STEP[2] + 4, 20);
  const leave = tween(frame, STEP[4], 22, 0, 1);
  if (enter === 0 || leave >= 1) return null;

  const part = (i: number) => sp(STEP[2] + 18 + i * 7);
  const menuOpen = frame >= STEP[3] + 34 && frame < STEP[3] + 62;
  const menu = menuOpen ? sp(STEP[3] + 34, 22) : 0;
  const pressedBtn = frame >= STEP[3] + 32 && frame < STEP[3] + 38;
  const pressedItem = frame >= STEP[3] + 60 && frame < STEP[3] + 66;
  const warn = sp(STEP[3] + 70, 16);
  const toast = sp(STEP[3] + 66, 18) * (1 - tween(frame, STEP[3] + 108, 14, 0, 1));
  const ROWH = 92;

  return (
    <Window
      url="dash.kotbo.fr/members/vantar"
      w={WIN.w}
      h={WIN.h}
      style={{
        left: WIN.left,
        top: WIN.top,
        opacity: enter * (1 - leave),
        transform: `translateX(${(1 - enter) * 520}px) translateY(${leave * -40}px)`,
      }}
    >
      <AbsoluteFill style={{ background: '#fff', fontFamily: F.body }}>
        {/* En-tête */}
        <div style={{ position: 'absolute', left: 32, top: 30, display: 'flex', alignItems: 'center', gap: 22, opacity: part(0) }}>
          <div style={{ position: 'relative' }}>
            <Avatar name="Va" size={92} color="#be185d" />
            <div style={{ position: 'absolute', right: 2, bottom: 2, width: 22, height: 22, borderRadius: 999, background: '#23a55a', border: '4px solid #fff' }} />
          </div>
          <div>
            <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 40, color: C.ink, lineHeight: 1.1 }}>Vantar</div>
            <div style={{ fontSize: 20, color: C.muted, marginTop: 4 }}>@vantar · membre depuis 7 jours</div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: BTN.x,
            top: BTN.y,
            width: BTN.w,
            height: BTN.h,
            borderRadius: 14,
            background: C.ink,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 22,
            fontWeight: 700,
            opacity: part(0),
            transform: `scale(${pressedBtn ? 0.95 : 1})`,
          }}
        >
          <Img src={ktb('ban')} style={{ width: 26, height: 26, filter: 'brightness(0) invert(1)' }} />
          Sanctionner
        </div>

        {/* Chiffres */}
        <div style={{ position: 'absolute', left: 32, top: 152, display: 'flex', gap: 12, opacity: part(1), transform: `translateY(${(1 - part(1)) * 14}px)` }}>
          {[
            ['msg', '214 messages'],
            ['warn', warn > 0.5 ? '2 sanctions' : '1 sanction'],
            ['clock', 'actif à l’instant'],
          ].map(([icon, text]) => (
            <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 999, border: `2px solid ${C.line}`, fontSize: 20, fontWeight: 600, color: C.text }}>
              <Img src={ktb(icon)} style={{ width: 24, height: 24 }} />
              {text}
            </div>
          ))}
        </div>

        {/* Historique : la nouvelle ligne pousse les autres. */}
        <div style={{ position: 'absolute', left: 32, top: 232, width: 500, opacity: part(2) }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.muted, marginBottom: 14 }}>Historique</div>
          <div style={{ position: 'relative', height: ROWH * 4 }}>
            <Row
              icon="warn"
              when="Aujourd'hui, 12:17"
              what="Avertissement : spam de liens"
              by="par toi"
              style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: warn, transform: `translateY(${(1 - warn) * -16}px) scale(${0.96 + warn * 0.04})`, background: '#eef2ff', borderColor: '#c7d2fe' }}
            />
            {HISTORY.map((h, i) => (
              <Row key={h.what} {...h} style={{ position: 'absolute', left: 0, right: 0, top: (i + warn) * ROWH, opacity: part(3 + i) * (i === HISTORY.length - 1 ? 1 - warn : 1) }} />
            ))}
          </div>
        </div>

        {/* Note interne */}
        <div style={{ position: 'absolute', left: 560, top: 232, width: 328, opacity: part(4), transform: `translateY(${(1 - part(4)) * 14}px)` }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.muted, marginBottom: 14 }}>Note interne</div>
          <div style={{ background: '#fffbeb', border: '2px solid #fde68a', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 700, color: '#92400e' }}>
              <Avatar name="Le" size={30} color="#7c3aed" />
              @lena · 30/09
            </div>
            <div style={{ marginTop: 10, fontSize: 21, lineHeight: 1.4, color: C.text }}>Déjà signalé pour de la pub en MP. À surveiller.</div>
          </div>
        </div>

        {/* Menu de sanction */}
        {menu > 0 && (
          <div
            style={{
              position: 'absolute',
              left: MENU.x,
              top: MENU.y,
              width: MENU.w,
              background: '#fff',
              border: `2px solid ${C.line}`,
              borderRadius: 14,
              padding: 6,
              boxShadow: '0 24px 40px -16px rgba(17,24,39,0.3)',
              opacity: menu,
              transform: `translateY(${(1 - menu) * -10}px)`,
              transformOrigin: 'top center',
            }}
          >
            {[
              ['warn', 'Avertissement'],
              ['mute', 'Sourdine'],
              ['ban', 'Bannissement'],
            ].map(([icon, text], i) => (
              <div
                key={text}
                style={{
                  height: MENU.item - 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '0 12px',
                  borderRadius: 10,
                  fontSize: 20,
                  fontWeight: 600,
                  color: C.text,
                  background: i === 0 && frame >= STEP[3] + 52 ? (pressedItem ? '#e0e7ff' : '#eef2ff') : 'transparent',
                }}
              >
                <Img src={ktb(icon)} style={{ width: 24, height: 24 }} />
                {text}
              </div>
            ))}
          </div>
        )}

        {/* Confirmation, sous la note pour ne rien masquer de l'historique. */}
        {toast > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 560,
              width: 328,
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 20px',
              borderRadius: 14,
              background: C.ink,
              color: '#fff',
              opacity: toast,
              transform: `translateY(${(1 - toast) * 24}px)`,
              boxShadow: '0 24px 40px -16px rgba(17,24,39,0.45)',
            }}
          >
            <Img src={ktb('check')} style={{ width: 30, height: 30, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 21, fontWeight: 700 }}>Avertissement appliqué</div>
              <div style={{ fontSize: 18, color: '#9ca3af' }}>@vantar prévenu en MP</div>
            </div>
          </div>
        )}
      </AbsoluteFill>
    </Window>
  );
};

/* ── 5 : les logs ─────────────────────────────────────────────────────── */

const CAM_FROM = { x: 0.5, y: 0.45, zoom: 1 };
const CAM_TO = { x: 0.67, y: 0.6, zoom: 3.4 };
const CAM_START = STEP[4] + 14;
const CAM_DUR = 84;

/** Où tombe un point de la capture dans la fenêtre, avec le cadrage final (même calcul que <Shot>). */
function onScreen(fx: number, fy: number) {
  const imgW = WIN.w * CAM_TO.zoom;
  const imgH = imgW * 0.625;
  const left = Math.min(0, Math.max(WIN.w - imgW, WIN.w / 2 - CAM_TO.x * imgW));
  const top = Math.min(0, Math.max(WIN.h - imgH, WIN.h / 2 - CAM_TO.y * imgH));
  return [left + fx * imgW, top + fy * imgH] as const;
}

const LogsWindow: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const enter = frame >= STEP[4] + 6 ? spring({ frame: frame - STEP[4] - 6, fps, config: { damping: 20, mass: 0.7 } }) : 0;
  const leave = tween(frame, RESET, 16, 0, 1);
  if (enter === 0 || leave >= 1) return null;

  // La ligne « Vantar averti : spam de liens en #général » de la capture.
  const [x1, y] = onScreen(0.648, 0.553);
  const [x2] = onScreen(0.803, 0.553);
  const ring = tween(frame, CAM_START + CAM_DUR + 4, 22, 0, 1);
  const note = frame >= CAM_START + CAM_DUR + 22 ? spring({ frame: frame - CAM_START - CAM_DUR - 22, fps, config: { damping: 14, mass: 0.6 } }) : 0;
  const cx = (x1 + x2) / 2;
  const rx = (x2 - x1) / 2 + 26;

  return (
    <>
      <Window
        url="dash.kotbo.fr/logs"
        w={WIN.w}
        h={WIN.h}
        style={{ left: WIN.left, top: WIN.top, opacity: enter * (1 - leave), transform: `translateY(${(1 - enter) * 90 + leave * 30}px)` }}
      >
        <Shot src={staticFile('shots/fr/logs.png')} w={WIN.w} h={WIN.h} from={CAM_FROM} to={CAM_TO} start={CAM_START} dur={CAM_DUR} />
        <svg width={WIN.w} height={WIN.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <ellipse
            cx={cx}
            cy={y}
            rx={rx}
            ry={44}
            fill="none"
            stroke={C.accent}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1.08 1"
            strokeDashoffset={1.08 - ring * 1.08}
            transform={`rotate(-2 ${cx} ${y})`}
          />
        </svg>
      </Window>
      {note > 0 && (
        <div
          style={{
            position: 'absolute',
            // À cheval sur le bas de la fenêtre : ne masque aucune ligne des logs.
            left: WIN.left + x1 - 20,
            top: WIN.top + BAR + WIN.h - 34,
            fontFamily: F.hand,
            fontWeight: 700,
            fontSize: 44,
            color: C.text,
            background: C.postit,
            padding: '10px 22px 14px',
            boxShadow: '3px 6px 10px rgba(0,0,0,0.12)',
            transform: `rotate(-3deg) scale(${0.6 + note * 0.4})`,
            opacity: note * (1 - leave),
            whiteSpace: 'nowrap',
          }}
        >
          et tout le staff le voit
        </div>
      )}
    </>
  );
};

/* ── Le curseur de l'étape 4 ──────────────────────────────────────────── */

const Pointer: React.FC<{ frame: number }> = ({ frame }) => {
  const s = STEP[3];
  const start: [number, number] = [1480, 860];
  const btn = at(BTN.x + BTN.w * 0.55, BTN.y + BTN.h * 0.6);
  const item = at(MENU.x + 80, MENU.y + 6 + (MENU.item - 6) / 2);
  const times = [s + 4, s + 30, s + 44, s + 58, s + 90, s + 112];
  if (frame < times[0] - 8 || frame > times[5] + 10) return null;
  const opts = { ...clamp, easing: ease };
  const x = interpolate(frame, times.slice(0, 5), [start[0], btn[0], btn[0], item[0], item[0] + 120], opts);
  const y = interpolate(frame, times.slice(0, 5), [start[1], btn[1], btn[1], item[1], item[1] + 220], opts);
  const opacity = tween(frame, times[0] - 8, 10, 0, 1) * (1 - tween(frame, times[4], 18, 0, 1));
  const presses = [s + 32, s + 60];
  const down = presses.some((p) => frame >= p && frame < p + 6) ? 0.82 : 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none' }}>
      {presses.map((p) => {
        if (frame < p || frame > p + 18) return null;
        const r = tween(frame, p, 16, 0, 1);
        return (
          <div
            key={p}
            style={{ position: 'absolute', left: -28, top: -28, width: 56, height: 56, borderRadius: 999, border: `4px solid ${C.accent}`, opacity: 0.6 * (1 - r), transform: `scale(${0.3 + r * 1.5})` }}
          />
        );
      })}
      <svg width="42" height="42" viewBox="0 0 24 24" style={{ transform: `scale(${down})`, transformOrigin: '4px 3px' }}>
        <path d="M4 2.5v17.2l4.6-4.3 3.1 6.9 3.2-1.4-3.1-6.8h6.4z" fill={C.ink} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

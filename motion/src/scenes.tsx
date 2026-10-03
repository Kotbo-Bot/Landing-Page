/**
 * Les scènes du film, dans l'ordre. Chacune a sa composition (RHYTHM 3 de
 * DESIGN.md) : fenêtre à droite, fenêtre à gauche, carte posée sur la fenêtre,
 * éventail de trois fenêtres, aplat encre pour le MCP, profil Discord, mur de
 * modules. Le texte à l'écran reste gros : le film est aussi vu à 390 px.
 */
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import type { Locale, Text } from './text';
import { Avatar, Board, C, F, Logo, Note, Rise, Shot, Ticker, Window, clamp, ktb, tween, useSpring } from './ui';
import { interpolate } from 'remotion';

interface SceneProps {
  t: Text;
  locale: Locale;
}

const shot = (locale: Locale, name: string) => staticFile(`shots/${locale}/${name}.png`);
const group = (t: Text, key: string) => t.groups.find((g) => g.key === key)!;

/* ── 1. Ouverture ─────────────────────────────────────────────────────── */

export const Intro: React.FC<SceneProps> = ({ t }) => (
  <Board>
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Logo size={210} delay={4} />
      <Rise text="Kotbo" size={150} delay={22} style={{ marginTop: 28, justifyContent: 'center' }} />
      <Rise text={t.intro.tagline} size={60} delay={58} color={C.muted} style={{ marginTop: 18, justifyContent: 'center', fontWeight: 700 }} />
    </AbsoluteFill>
  </Board>
);

/* ── 2. Modération ────────────────────────────────────────────────────── */

const DiscordMessage: React.FC<{
  author: string;
  color?: string;
  bot?: boolean;
  time: string;
  children: React.ReactNode;
  avatar: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ author, color = C.dc.heading, bot, time, children, avatar, style }) => (
  <div style={{ display: 'flex', gap: 20, padding: '12px 28px', ...style }}>
    {avatar}
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 28, color }}>{author}</span>
        {bot && <span style={{ background: C.dc.blurple, color: '#fff', fontSize: 16, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>APP</span>}
        <span style={{ fontSize: 20, color: C.dc.muted }}>{time}</span>
      </div>
      <div style={{ fontSize: 28, color: C.dc.text, lineHeight: 1.4 }}>{children}</div>
    </div>
  </div>
);

export const Moderation: React.FC<SceneProps> = ({ t, locale }) => {
  const frame = useCurrentFrame();
  const g = group(t, 'moderation');
  const card = useSpring(36);
  const cardOut = tween(frame, 150, 18, 0, 1);
  const strike = tween(frame, 68, 12, 0, 1);
  const bot = useSpring(84);
  const swap = tween(frame, 128, 14, 0, 1);
  return (
    <Board>
      <div style={{ position: 'absolute', left: 120, top: 150, width: 640 }}>
        <Rise text={t.moderation.title} size={80} delay={4} />
        <div style={{ marginTop: 56 }}>
          <Ticker label={g.label} modules={g.modules} delay={26} every={6} size={30} />
        </div>
      </div>

      <Window url={swap < 0.5 ? 'dash.kotbo.fr/security/filters' : 'dash.kotbo.fr/security/sanctions'} w={1000} h={640} style={{ left: 820, top: 160 }}>
        <AbsoluteFill style={{ opacity: 1 - swap }}>
          <Shot src={shot(locale, 'filters')} w={1000} h={640} from={{ x: 0.55, y: 0.35, zoom: 1.05 }} to={{ x: 0.62, y: 0.45, zoom: 1.7 }} dur={140} />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: swap }}>
          <Shot src={shot(locale, 'sanctions')} w={1000} h={640} from={{ x: 0.5, y: 0.72, zoom: 1.45 }} to={{ x: 0.45, y: 0.8, zoom: 1.85 }} start={128} dur={140} />
        </AbsoluteFill>
      </Window>

      {/* Ce qui se passe dans Discord pendant ce temps. */}
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 600,
          width: 820,
          borderRadius: 12,
          background: C.dc.chat,
          padding: '14px 0',
          boxShadow: '0 40px 80px -25px rgba(0,0,0,0.55)',
          opacity: card * (1 - cardOut),
          transform: `translateY(${(1 - card) * 60 + cardOut * 80}px)`,
        }}
      >
        <DiscordMessage author="fr33-nitro" color={C.dc.muted} time={t.moderation.today} avatar={<Avatar name="fr" size={56} color="#be185d" />} style={{ opacity: 1 - strike * 0.5 }}>
          <span style={{ position: 'relative' }}>
            {t.moderation.spam}
            <span style={{ position: 'absolute', left: 0, top: '52%', height: 4, width: `${strike * 100}%`, background: C.marker, borderRadius: 4 }} />
          </span>
        </DiscordMessage>
        {frame >= 84 && (
          <DiscordMessage
            author="Kotbo"
            bot
            time={t.moderation.today}
            avatar={<Img src={staticFile('logo.svg')} style={{ width: 56, height: 56 }} />}
            style={{ opacity: bot, transform: `translateY(${(1 - bot) * 16}px)` }}
          >
            <div style={{ marginTop: 6, background: C.dc.sidebar, borderLeft: '6px solid #f23f43', borderRadius: 6, padding: '12px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
              <Img src={ktb('mute')} style={{ width: 30, height: 30 }} />
              {t.moderation.done}
            </div>
          </DiscordMessage>
        )}
      </div>

      <Note text={t.moderation.note} delay={104} rotate={3} style={{ right: 70, top: 60 }} />
    </Board>
  );
};

/* ── 3. Staff ─────────────────────────────────────────────────────────── */

export const Staff: React.FC<SceneProps> = ({ t, locale }) => {
  const frame = useCurrentFrame();
  const g = group(t, 'staff');
  const front = useSpring(0);
  const back = useSpring(10);
  const away = tween(frame, 118, 22, 0, 1);
  return (
    <Board>
      <Window url="dash.kotbo.fr/planning" w={980} h={612} style={{ left: 190, top: 230, opacity: back, transform: `translateX(${(1 - back) * -80}px)` }}>
        <Shot src={shot(locale, 'planning')} w={980} h={612} from={{ x: 0.55, y: 0.4, zoom: 1.2 }} to={{ x: 0.6, y: 0.42, zoom: 1.6 }} start={110} dur={120} />
      </Window>
      <Window
        url="dash.kotbo.fr/staff-management/members"
        w={980}
        h={612}
        style={{
          left: 110,
          top: 160,
          opacity: front * (1 - away),
          transform: `translateX(${(1 - front) * -120 - away * 260}px) translateY(${away * 40}px)`,
        }}
      >
        <Shot src={shot(locale, 'staff')} w={980} h={612} from={{ x: 0.5, y: 0.45, zoom: 1.1 }} to={{ x: 0.5, y: 0.75, zoom: 1.6 }} dur={120} />
      </Window>

      <div style={{ position: 'absolute', left: 1240, top: 150, width: 600 }}>
        <Rise text={t.staff.title} size={80} delay={8} />
        <div style={{ marginTop: 56 }}>
          <Ticker label={g.label} modules={g.modules} delay={26} every={6} size={30} />
        </div>
      </div>
      <Note text={t.staff.note} delay={90} rotate={-4} style={{ left: 640, top: 880 }} />
    </Board>
  );
};

/* ── 4. Communauté ────────────────────────────────────────────────────── */

const Float: React.FC<{ icon: string; text: string; at: number; x: number; y: number }> = ({ icon, text, at, x, y }) => {
  const frame = useCurrentFrame();
  const p = tween(frame, at, 40, 0, 1);
  const opacity = interpolate(p, [0, 0.15, 0.7, 1], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y - p * 90,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#fff',
        border: `2px solid ${C.line}`,
        borderRadius: 999,
        padding: '10px 22px',
        fontSize: 30,
        fontWeight: 700,
        color: C.ink,
        boxShadow: '0 12px 24px -12px rgba(17,24,39,0.3)',
      }}
    >
      <Img src={ktb(icon)} style={{ width: 34, height: 34 }} />
      {text}
    </div>
  );
};

export const Community: React.FC<SceneProps> = ({ t, locale }) => {
  const frame = useCurrentFrame();
  const g = group(t, 'community');
  const win = useSpring(0);
  const card = useSpring(56);
  const xp = tween(frame, 84, 46, 0.32, 1);
  return (
    <Board>
      <div style={{ position: 'absolute', left: 120, top: 120, width: 720 }}>
        <Rise text={t.community.title} size={80} delay={4} />
        <div style={{ marginTop: 48 }}>
          <Ticker label={g.label} modules={g.modules} delay={22} every={3} columns={2} size={26} />
        </div>
      </div>

      <Window url="dash.kotbo.fr/leveling" w={940} h={588} style={{ left: 880, top: 140, opacity: win, transform: `translateY(${(1 - win) * 60}px)` }}>
        <Shot src={shot(locale, 'leveling')} w={940} h={588} from={{ x: 0.6, y: 0.45, zoom: 1.1 }} to={{ x: 0.62, y: 0.55, zoom: 1.55 }} dur={200} />
      </Window>

      {/* La carte de rang de Noé, dans Discord. */}
      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 700,
          width: 720,
          background: C.dc.chat,
          borderRadius: 14,
          padding: 28,
          display: 'flex',
          gap: 26,
          alignItems: 'center',
          boxShadow: '0 40px 80px -25px rgba(0,0,0,0.55)',
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px)`,
        }}
      >
        <Avatar name="Noé" size={110} color="#ca8a04" />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 40, color: C.dc.heading }}>Noé</span>
            <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 36, color: '#f0b232' }}>{t.community.level}</span>
          </div>
          <div style={{ marginTop: 18, height: 18, borderRadius: 999, background: C.dc.rail, overflow: 'hidden' }}>
            <div style={{ width: `${xp * 100}%`, height: '100%', borderRadius: 999, background: '#f0b232' }} />
          </div>
        </div>
      </div>

      <Float icon="xp" text={t.community.xp} at={86} x={1560} y={640} />
      <Float icon="coins" text={t.community.coins} at={112} x={1380} y={650} />
      <Note text={t.community.note} delay={130} rotate={-3} style={{ right: 80, top: 30 }} />
    </Board>
  );
};

/* ── 5. Contenu, intégrations, cross-serveur ──────────────────────────── */

const FAN = [
  { name: 'logs', url: 'dash.kotbo.fr/logs', cam: { x: 0.6, y: 0.55, zoom: 1.7 }, left: 110 },
  { name: 'channelhealth', url: 'dash.kotbo.fr/channel-health', cam: { x: 0.6, y: 0.5, zoom: 1.5 }, left: 640 },
  { name: 'pulse', url: 'dash.kotbo.fr/pulse', cam: { x: 0.45, y: 0.5, zoom: 1.6 }, left: 1170 },
];

export const Content: React.FC<SceneProps> = ({ t, locale }) => {
  const groups = [group(t, 'content'), group(t, 'integrations'), group(t, 'cross')];
  return (
    <Board>
      <div style={{ position: 'absolute', left: 120, top: 70 }}>
        <Rise text={t.content.title} size={80} delay={2} />
      </div>
      {FAN.map((win, i) => (
        <FanWindow key={win.name} index={i} {...win} src={shot(locale, win.name)} />
      ))}
      <div style={{ position: 'absolute', left: 120, top: 690, display: 'flex', gap: 80 }}>
        <Ticker label={groups[0].label} modules={groups[0].modules} delay={70} every={3} columns={2} size={24} />
        <Ticker label={groups[1].label} modules={groups[1].modules} delay={100} every={3} size={24} />
        <Ticker label={groups[2].label} modules={groups[2].modules} delay={122} every={3} size={24} />
      </div>
      <Note text={t.content.note} delay={150} rotate={3} style={{ left: 1300, top: 50 }} />
    </Board>
  );
};

const FanWindow: React.FC<{ index: number; src: string; url: string; cam: { x: number; y: number; zoom: number }; left: number }> = ({
  index,
  src,
  url,
  cam,
  left,
}) => {
  const p = useSpring(14 + index * 16);
  return (
    <Window url={url} w={640} h={400} style={{ left, top: 220 + index * 10, opacity: p, transform: `translateY(${(1 - p) * 120}px)` }}>
      <Shot src={src} w={640} h={400} from={{ ...cam, zoom: cam.zoom * 0.8 }} to={cam} start={14 + index * 16} dur={150} />
    </Window>
  );
};

/* ── 6. MCP ───────────────────────────────────────────────────────────── */

const TOOLS = ['generate_server_digest', 'get_sanctions', 'apply_sanction'];

/** Le texte qui s'écrit, caractère par caractère. */
const typed = (text: string, frame: number, start: number, perFrame = 1.6) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * perFrame)));

export const Mcp: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const panel = useSpring(10);
  const endpoint = useSpring(150);
  return (
    <Board dark>
      <div style={{ position: 'absolute', left: 120, top: 170, width: 760 }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: '#a5b4fc', opacity: tween(frame, 0, 12, 0, 1) }}>{t.mcp.kicker}</div>
        <Rise text={t.mcp.title} size={84} delay={6} color="#fff" style={{ marginTop: 18 }} />
        <div style={{ marginTop: 34, fontSize: 32, lineHeight: 1.45, color: '#d1d5db', opacity: tween(frame, 40, 16, 0, 1) }}>{t.mcp.sub}</div>
        {/* L'adresse que le dashboard donne à coller dans le client IA (page API MCP). */}
        <div
          style={{
            marginTop: 52,
            borderRadius: 16,
            border: '2px solid #374151',
            background: '#0b1120',
            padding: '22px 26px',
            opacity: endpoint,
            transform: `translateY(${(1 - endpoint) * 30}px)`,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 600, color: '#9ca3af' }}>{t.mcp.endpoint}</div>
          <div style={{ marginTop: 10, fontFamily: F.mono, fontSize: 30, color: '#e5e7eb' }}>/api/mcp/900000000000000001</div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 990,
          top: 150,
          width: 810,
          minHeight: 560,
          borderRadius: 22,
          background: '#1f2937',
          border: '2px solid #374151',
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          opacity: panel,
          transform: `translateY(${(1 - panel) * 50}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, color: '#e5e7eb' }}>
          <Img src={ktb('settings')} style={{ width: 34, height: 34 }} />
          {t.mcp.agent}
          <span style={{ marginLeft: 'auto', fontSize: 20, fontWeight: 600, color: '#9ca3af' }}>MCP · dash.kotbo.fr</span>
        </div>

        {frame >= 28 && (
          <div style={{ alignSelf: 'flex-end', maxWidth: 620, background: C.accent, color: '#fff', borderRadius: '22px 22px 6px 22px', padding: '20px 26px', fontSize: 30, lineHeight: 1.4 }}>
            {typed(t.mcp.prompt, frame, 28)}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TOOLS.map((tool, i) => {
            const at = 104 + i * 26;
            if (frame < at) return null;
            const done = frame >= at + 16;
            return (
              <div
                key={tool}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: '#111827',
                  border: '2px solid #374151',
                  borderRadius: 12,
                  padding: '14px 20px',
                  opacity: tween(frame, at, 8, 0, 1),
                }}
              >
                <Img src={ktb(done ? 'check' : 'clock')} style={{ width: 32, height: 32 }} />
                <span style={{ fontFamily: F.mono, fontSize: 28, color: '#e5e7eb' }}>{tool}</span>
                <span style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 600, color: done ? '#86efac' : '#9ca3af' }}>{done ? t.mcp.done : '…'}</span>
              </div>
            );
          })}
        </div>

        {frame >= 196 && (
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <Img src={staticFile('logo.svg')} style={{ width: 52, height: 52, flexShrink: 0 }} />
            <div style={{ background: '#374151', color: '#f3f4f6', borderRadius: '6px 22px 22px 22px', padding: '20px 26px', fontSize: 30, lineHeight: 1.45 }}>
              {typed(t.mcp.answer, frame, 196, 1.8)}
            </div>
          </div>
        )}
      </div>
    </Board>
  );
};

/* ── 7. Widgets de profil ─────────────────────────────────────────────── */

const ROW_ICONS = ['msg', 'voice', 'level', 'shield'];

export const Widgets: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const card = useSpring(6);
  return (
    <Board>
      <div style={{ position: 'absolute', left: 120, top: 330, width: 820 }}>
        <Rise text={t.widgets.title} size={88} delay={4} />
      </div>
      <Note text={t.widgets.note} delay={70} rotate={-3} style={{ left: 150, top: 700 }} />

      <div
        style={{
          position: 'absolute',
          left: 1080,
          top: 110,
          width: 640,
          borderRadius: 16,
          overflow: 'hidden',
          background: C.dc.sidebar,
          boxShadow: '0 50px 100px -30px rgba(0,0,0,0.55)',
          opacity: card,
          transform: `translateX(${(1 - card) * 140}px)`,
        }}
      >
        <div style={{ height: 150, background: C.dc.blurple }} />
        <div style={{ padding: '0 36px 36px' }}>
          <div style={{ marginTop: -70, width: 140, height: 140, borderRadius: 999, border: `10px solid ${C.dc.sidebar}`, overflow: 'hidden' }}>
            <Avatar name="Arka" size={120} color="#0e7490" />
          </div>
          <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 44, color: C.dc.heading, marginTop: 12 }}>Arka</div>
          <div style={{ fontSize: 24, color: C.dc.muted }}>{t.widgets.member}</div>
          <div style={{ marginTop: 26, background: C.dc.rail, borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 700, color: C.dc.heading, marginBottom: 14 }}>
              <Img src={staticFile('logo.svg')} style={{ width: 30, height: 30 }} />
              Kotbo
            </div>
            {t.widgets.rows.map(([label, value], i) => {
              const p = tween(frame, 30 + i * 12, 12, 0, 1);
              return (
                <div
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', fontSize: 28, color: C.dc.text, opacity: p, transform: `translateX(${(1 - p) * 20}px)` }}
                >
                  <Img src={ktb(ROW_ICONS[i])} style={{ width: 32, height: 32 }} />
                  {label}
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: C.dc.heading }}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Board>
  );
};

/* ── 8. Le mur des 51 modules ─────────────────────────────────────────── */

export const Finale: React.FC<SceneProps> = ({ t }) => {
  const frame = useCurrentFrame();
  const all = t.groups.flatMap((g) => g.modules);
  const dim = tween(frame, 96, 24, 1, 0.05);
  const cta = useSpring(170);
  return (
    <Board>
      <AbsoluteFill style={{ padding: '70px 90px', flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: '18px 34px', opacity: dim }}>
        {all.map((name, i) => {
          const p = tween(frame, i * 1.6, 8, 0, 1);
          return (
            <span key={name} style={{ fontFamily: F.head, fontWeight: 800, fontSize: 44, color: C.ink, opacity: p, transform: `scale(${0.8 + p * 0.2})` }}>
              {name}
            </span>
          );
        })}
      </AbsoluteFill>

      {frame >= 104 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Logo size={150} delay={104} />
          <Rise text={t.finale.count} size={130} delay={116} style={{ marginTop: 26, justifyContent: 'center' }} />
          <Rise text={t.finale.line} size={130} delay={132} color={C.accent} style={{ justifyContent: 'center' }} />
          <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 36, opacity: cta, transform: `translateY(${(1 - cta) * 24}px)` }}>
            <div style={{ background: C.ink, color: '#fff', borderRadius: 16, padding: '24px 40px', fontSize: 36, fontWeight: 700 }}>{t.finale.cta}</div>
            <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: 40, color: C.ink }}>kotbo.fr</div>
          </div>
        </AbsoluteFill>
      )}
    </Board>
  );
};



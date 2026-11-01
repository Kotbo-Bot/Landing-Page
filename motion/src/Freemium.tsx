/**
 * Le clip de l'offre gratuite (15 s, 1920 × 1080), pour le billet
 * `/blog/kotbo-gratuit` et les réseaux.
 *
 * Quatre temps : l'annonce, les deux colonnes (gratuit, offre complète), la
 * sécurité jamais payante, le prix. Les listes sont recopiées de `FREE_MODULES`
 * (`packages/contracts/src/types/plans.ts`, dépôt produit) et raccourcies : le
 * billet donne la liste complète.
 */
import React from 'react';
import { AbsoluteFill, Img, Sequence, useCurrentFrame } from 'remotion';
import { Board, C, F, Logo, Note, Rise, Ticker, ktb, loadFonts, tween, useSpring } from './ui';
import type { Locale } from './text';

loadFonts();

export const FREEMIUM_FRAMES = 450;

const TEXT = {
  fr: {
    title: 'Kotbo devient gratuit.',
    sub: 'Sans limite de durée, sans carte bancaire.',
    note: 'attends… gratuit ?',
    freeLabel: 'Gratuit',
    free: ['Sanctions & AutoMod', 'Anti-raid & vérification', 'Logs Discord', 'Accueil & règlement', 'Niveaux & XP', 'Tickets', 'Giveaways & événements', 'Analytics', 'YouTube & Twitch'],
    fullLabel: 'Offre complète',
    full: ['Toute la gestion du staff', 'IA de modération AegisAI', 'Site de ta communauté', 'Saisons & clans', 'Économie & RPG', 'Serveur MCP', 'Cross-serveur'],
    safety: 'La sécurité ne sera jamais payante.',
    safetySub: 'Sanctions, AutoMod, anti-raid, vérification et logs restent gratuits.',
    price: 'Offre complète dès 2,50 €/mois',
    trial: 'Gratuit sans carte · 15 jours d’essai de l’offre complète',
  },
  en: {
    title: 'Kotbo goes free.',
    sub: 'No time limit, no credit card.',
    note: 'wait… free?',
    freeLabel: 'Free',
    free: ['Sanctions & AutoMod', 'Anti-raid & verification', 'Discord logs', 'Welcome & rules', 'Levels & XP', 'Tickets', 'Giveaways & events', 'Analytics', 'YouTube & Twitch'],
    fullLabel: 'Full plan',
    full: ['Full staff management', 'AegisAI moderation', 'Your community website', 'Seasons & clans', 'Economy & RPG', 'MCP server', 'Cross-server'],
    safety: 'Security will never be paid.',
    safetySub: 'Sanctions, AutoMod, anti-raid, verification and logs stay free.',
    price: 'Full plan from €2.50/month',
    trial: 'Free, no card · 15-day trial of the full plan',
  },
} as const;

// Un type, pas une interface : Composition exige une signature d'index.
export type FreemiumProps = { locale: Locale };

/** Une scène qui entre et sort en fondu, pour enchaîner sans coupe sèche. */
const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(tween(frame, 0, 10, 0, 1), tween(frame, dur - 10, 10, 1, 0));
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Announce: React.FC<{ t: (typeof TEXT)[Locale] }> = ({ t }) => {
  const frame = useCurrentFrame();
  return (
    <Board>
      <div style={{ position: 'absolute', left: 160, top: 300 }}>
        <Logo size={120} />
        <Rise text={t.title} delay={12} size={150} style={{ marginTop: 50 }} />
        <div style={{ marginTop: 30, fontSize: 46, fontWeight: 500, color: C.muted, opacity: tween(frame, 34, 14, 0, 1) }}>{t.sub}</div>
      </div>
      <Note text={t.note} delay={48} rotate={-5} style={{ left: 1320, top: 360 }} />
    </Board>
  );
};

const Columns: React.FC<{ t: (typeof TEXT)[Locale] }> = ({ t }) => {
  const frame = useCurrentFrame();
  // Le panneau de droite arrive une fois la colonne gratuite cochée.
  const right = useSpring(62, 16);
  return (
    <Board>
      <div style={{ position: 'absolute', left: 160, top: 170 }}>
        <Ticker label={t.freeLabel} modules={t.free} delay={4} every={5} size={44} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 140,
          width: 780,
          padding: '30px 44px 40px',
          borderRadius: 28,
          background: C.ink,
          color: '#fff',
          opacity: right,
          transform: `translateY(${(1 - right) * 40}px)`,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: '#a5b4fc', marginBottom: 22 }}>{t.fullLabel} · {t.full.length}</div>
        {t.full.map((name, i) => {
          const p = tween(frame, 74 + i * 6, 10, 0, 1);
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontSize: 44,
                fontWeight: 600,
                lineHeight: 1.45,
                opacity: p,
                transform: `translateX(${(1 - p) * -24}px)`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ width: 14, height: 14, borderRadius: 999, background: C.accent, flexShrink: 0 }} />
              {name}
            </div>
          );
        })}
      </div>
    </Board>
  );
};

const Safety: React.FC<{ t: (typeof TEXT)[Locale] }> = ({ t }) => {
  const frame = useCurrentFrame();
  const shield = useSpring(4, 10);
  return (
    <Board dark>
      <div style={{ position: 'absolute', left: 160, top: 330 }}>
        <Img src={ktb('check')} style={{ width: 110, height: 110, transform: `scale(${shield})` }} />
        <Rise text={t.safety} delay={10} size={110} color="#fff" width={1600} style={{ marginTop: 40 }} />
        <div style={{ marginTop: 30, fontSize: 40, fontWeight: 500, color: '#d1d5db', opacity: tween(frame, 30, 14, 0, 1) }}>{t.safetySub}</div>
      </div>
    </Board>
  );
};

const Outro: React.FC<{ t: (typeof TEXT)[Locale] }> = ({ t }) => {
  const frame = useCurrentFrame();
  const line = (at: number) => ({ opacity: tween(frame, at, 14, 0, 1), transform: `translateY(${tween(frame, at, 14, 20, 0)}px)` });
  return (
    <Board>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Logo size={150} />
        <div style={{ marginTop: 44, fontFamily: F.head, fontWeight: 800, fontSize: 96, letterSpacing: '-0.025em', color: C.ink, ...line(18) }}>{t.price}</div>
        <div style={{ marginTop: 22, fontSize: 44, fontWeight: 600, color: C.accent, ...line(30) }}>{t.trial}</div>
        <div style={{ marginTop: 70, fontSize: 40, fontWeight: 700, color: C.ink, ...line(44) }}>kotbo.fr</div>
      </AbsoluteFill>
    </Board>
  );
};

export const Freemium: React.FC<FreemiumProps> = ({ locale }) => {
  const t = TEXT[locale];
  return (
    <AbsoluteFill style={{ background: C.board }}>
      <Sequence durationInFrames={100}>
        <Fade dur={100}><Announce t={t} /></Fade>
      </Sequence>
      <Sequence from={90} durationInFrames={170}>
        <Fade dur={170}><Columns t={t} /></Fade>
      </Sequence>
      <Sequence from={250} durationInFrames={95}>
        <Fade dur={95}><Safety t={t} /></Fade>
      </Sequence>
      <Sequence from={335} durationInFrames={115}>
        <Outro t={t} />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * L'image des aperçus de lien (`og:image`, 1200 × 630) et les icônes du site.
 *
 * Discord, X, Slack ou LinkedIn affichent cette image sous le titre quand on
 * colle un lien kotbo.fr. Discord la réduit à environ 400 px de large : le
 * titre reste donc très gros, et rien d'important ne touche les bords, que
 * certains réseaux rognent.
 *
 * Mêmes matières que le film : le tableau piqué de points, une vraie capture
 * du dashboard dans sa fenêtre, une seule annotation au marqueur.
 */
import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';
import { TEXT, type Locale } from './text';
import { Board, C, F, Logo, Note, Shot, Window, loadFonts } from './ui';

loadFonts();

/** Image où le logo a fini de se monter (le point arrive en dernier, vers 50). */
export const BANNER_FRAME = 90;
export const BANNER_FRAMES = BANNER_FRAME + 1;

export interface BannerProps {
  locale: Locale;
}

export const Banner: React.FC<BannerProps> = ({ locale }) => {
  const t = TEXT[locale].banner;
  return (
    <Board>
      <div style={{ position: 'absolute', left: 64, top: 64, width: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Logo size={72} />
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 44, letterSpacing: '-0.02em', color: C.ink }}>Kotbo</span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: F.head,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: C.ink,
          }}
        >
          {t.title}
        </div>
        <div style={{ marginTop: 26, fontSize: 25, lineHeight: 1.4, fontWeight: 500, color: C.muted, width: 480 }}>{t.line}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 64,
          bottom: 56,
          fontSize: 24,
          fontWeight: 700,
          color: C.ink,
        }}
      >
        kotbo.fr
      </div>

      <Window url="dash.kotbo.fr" w={620} h={520} style={{ left: 640, top: 92 }}>
        <Shot
          src={staticFile(`shots/${locale}/home.png`)}
          w={620}
          h={520}
          from={{ x: 0, y: 0, zoom: 1.6 }}
          to={{ x: 0, y: 0, zoom: 1.6 }}
          dur={1}
        />
      </Window>

      <Note text={t.note} rotate={-4} style={{ left: 690, top: 492, fontSize: 34, padding: '10px 20px 12px' }} />
    </Board>
  );
};

/**
 * Le logo seul, pour `apple-touch-icon` et le `logo` des données structurées.
 * `bleed` remplit les coins : iOS arrondit lui-même l'icône et noircirait la
 * transparence.
 */
export const Icon: React.FC<{ bleed: boolean }> = ({ bleed }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: bleed ? '#00264d' : 'transparent' }}>
    {/* Sans flexShrink, la boîte ramène le logo à 512 et le liseré reste visible. */}
    <div style={{ flexShrink: 0 }}>
      <Logo size={bleed ? 640 : 512} />
    </div>
  </AbsoluteFill>
);

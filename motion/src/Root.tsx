import React from 'react';
import { Composition } from 'remotion';
import { FILM_FRAMES, Film, type FilmProps } from './Film';
import { INCIDENT_FRAMES, Incident } from './Incident';
import { BANNER_FRAMES, Banner, Icon, type BannerProps } from './Banner';

export const Root: React.FC = () => (
  <>
    {(['fr', 'en'] as const).map((locale) => (
      <Composition<any, FilmProps>
        key={locale}
        id={`kotbo-${locale}`}
        component={Film}
        durationInFrames={FILM_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ locale, music: false }}
      />
    ))}
    <Composition id="topgg-incident" component={Incident} durationInFrames={INCIDENT_FRAMES} fps={30} width={1600} height={900} />
    {(['fr', 'en'] as const).map((locale) => (
      <Composition<any, BannerProps>
        key={locale}
        id={`og-${locale}`}
        component={Banner}
        durationInFrames={BANNER_FRAMES}
        fps={30}
        width={1200}
        height={630}
        defaultProps={{ locale }}
      />
    ))}
    <Composition id="icon" component={Icon} durationInFrames={BANNER_FRAMES} fps={30} width={512} height={512} defaultProps={{ bleed: false }} />
    <Composition id="icon-bleed" component={Icon} durationInFrames={BANNER_FRAMES} fps={30} width={512} height={512} defaultProps={{ bleed: true }} />
  </>
);

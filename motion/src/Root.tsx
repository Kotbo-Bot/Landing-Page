import React from 'react';
import { Composition } from 'remotion';
import { FILM_FRAMES, Film, type FilmProps } from './Film';

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
  </>
);

/**
 * Le film : huit scènes enchaînées, 60 s à 30 images par seconde.
 *
 * Les durées comptent les chevauchements des transitions (15 images chacune) :
 * 150 + 270 + 240 + 240 + 240 + 330 + 180 + 255 - 7 × 15 = 1 800 images.
 * La musique n'est posée que si `public/music.mp3` existe (voir render.mjs).
 */
import React from 'react';
import { Audio, interpolate, staticFile, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { TEXT, type Locale } from './text';
import { loadFonts } from './ui';
import { Community, Content, Finale, Intro, Mcp, Moderation, Staff, Widgets } from './scenes';

loadFonts();

export const FILM_FRAMES = 1800;
const T = linearTiming({ durationInFrames: 15 });

export type FilmProps = {
  locale: Locale;
  music: boolean;
};

export const Film: React.FC<FilmProps> = ({ locale, music }) => {
  const t = TEXT[locale];
  const { durationInFrames } = useVideoConfig();
  const p = { t, locale };
  return (
    <>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}>
          <Intro {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={T} />
        <TransitionSeries.Sequence durationInFrames={270}>
          <Moderation {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-left' })} timing={T} />
        <TransitionSeries.Sequence durationInFrames={240}>
          <Staff {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={T} />
        <TransitionSeries.Sequence durationInFrames={240}>
          <Community {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: 'from-right' })} timing={T} />
        <TransitionSeries.Sequence durationInFrames={240}>
          <Content {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={330}>
          <Mcp {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={180}>
          <Widgets {...p} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={T} />
        <TransitionSeries.Sequence durationInFrames={255}>
          <Finale {...p} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {music && (
        <Audio
          src={staticFile('music.mp3')}
          volume={(f) => interpolate(f, [0, 30, durationInFrames - 45, durationInFrames], [0, 0.8, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      )}
    </>
  );
};

import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial, FONT } from '../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as SH from './shots';

// HOAX: while the forwarded message spreads, the picture goes cold and jittery, a DITERUSKAN chip blinks and a share
// count climbs. FREEZE (the cliffhanger, a callback to "matahari berhenti"): the sun holds while a clock runs the day.
const hoaxLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.25 * lv}) hue-rotate(${-12 * lv}deg) contrast(${1 + 0.08 * lv})`,
  jitter: 3,
  Overlay: ({ f, p }) => (
    <g>
      <HudChip x={56} y={150} f={f} label="DITERUSKAN" icon="dot" />
      <text x={1024} y={176} textAnchor="end" fontFamily={FONT.ui} fontSize={40} fill="#FF6A5A">
        {`${Math.round(1000 * Math.pow(p, 1.5)).toString()}rb x`}
      </text>
    </g>
  ),
};
const freezeLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.12 * lv}) sepia(${0.12 * lv})`,
  Overlay: ({ f, p }) => {
    const h = 6 + 17 * p;
    const read = `${String(Math.floor(h) % 24).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`;
    return (
      <g>
        <HudChip x={56} y={150} f={f} label="MATAHARI DIAM" icon="pause" />
        <Dial x={540} y={1640} r={110} size={52} p={h / 24} readout={read} />
      </g>
    );
  },
};

const { FRAME, ...shots } = SH;
export const dajjal1 = defineEpisode('DajjalEp1', {
  timeline: timeline as Timeline,
  shots,
  looks: { hoax: hoaxLook, freeze: freezeLook },
  frame: FRAME,
  words, // burned-in subtitles, synced to the voice
  noCaptions: ['S7'], // the title card already says it
});

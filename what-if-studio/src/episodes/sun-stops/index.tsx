import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial } from '../../engine';
import timeline from './timeline.json';
import words from './words.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, FRAME } from './shots';

// The "power" here is the sun standing still. FREEZE: the picture holds warm and a touch harder, a chip says the
// sun has stopped, and a clock in the corner reads the time it is (five, nine, midnight) while the sun hasn't moved.
const READ = ['17:00', '21:00', '00:00'];
const freezeLook: LookDef = {
  grade: (lv) => `saturate(${1 + 0.12 * lv}) contrast(${1 + 0.06 * lv}) sepia(${0.12 * lv})`,
  Overlay: ({ f, n }) => (
    <g>
      <HudChip x={56} y={150} f={f} label="MATAHARI DIAM" icon="pause" />
      <Dial x={540} y={1640} r={110} size={52} p={[17 / 24, 21 / 24, 1][Math.min(n, 2)]} readout={READ[Math.min(n, 2)]} />
    </g>
  ),
};

export const sunStops = defineEpisode('SunStops', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 },
  looks: { freeze: freezeLook },
  frame: FRAME,
  words, // burned-in subtitles, synced to the voice
  noCaptions: ['S9'], // the title card already says it
});

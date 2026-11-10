import React from 'react';
import { backOut, clamp } from './anim';
import { FONT } from './fonts';
import { STUDIO } from '../studio.config';

// Burned-in subtitles, synced word by word to the voice (words.json from voice.py). The line is a short phrase of two
// to four words that breaks at punctuation; the word being spoken lights up yellow and pops a little. Placed in the
// lower third of the 9:16 frame, above the platform's own buttons and captions.

export type Word = { w: string; s: number; e: number; p?: string };
type Phrase = { words: Word[]; s: number; e: number };

const MAX_WORDS = 4;
const MAX_CHARS = 18;

/** Splits the words into caption phrases: a break after . ? ! : , or when the line would grow too long. */
export const phrases = (words: Word[]): Phrase[] => {
  const out: Phrase[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    cur = [];
  };
  for (const w of words) {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    if (cur.length && (cur.length >= MAX_WORDS || len > MAX_CHARS)) flush();
    cur.push(w);
    if (/[.?!:,;…]/.test(w.p ?? '')) flush();
  }
  flush();
  // hold each phrase until the next one starts (at most 0.5 s), so the line doesn't blink off in short pauses
  for (let i = 0; i < out.length; i++) {
    const next = out[i + 1];
    out[i].e = next ? Math.min(next.s, out[i].e + 0.5) : out[i].e + 0.6;
  }
  return out;
};

/** What a word shows on screen: itself, plus a joining hyphen ("Al-Kahfi") or the ? and ! that end it. */
const shown = (w: Word) => w.w + ((w.p ?? '').includes('-') ? '-' : '') + ((w.p ?? '').match(/[?!]/)?.[0] ?? '');

export const Captions: React.FC<{ f: number; fps: number; list: Phrase[]; y?: number; size?: number }> = ({ f, fps, list, y, size = 84 }) => {
  const sec = f / fps;
  const ph = list.find((p) => sec >= p.s && sec < p.e);
  if (!ph) return null;
  const W = STUDIO.width;
  const H = STUDIO.height;
  const cy = y ?? H * 0.7;
  const inP = backOut(clamp(((sec - ph.s) * fps) / 5));
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <g transform={`translate(${W / 2} ${cy}) scale(${0.9 + 0.1 * inP})`} opacity={clamp(inP * 2)}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} stroke="#120E1C" strokeWidth={size * 0.2} strokeLinejoin="round" paintOrder="stroke" style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.55))' }}>
          {ph.words.map((w, i) => {
            const on = sec >= w.s && sec < (ph.words[i + 1]?.s ?? ph.e);
            const hyph = shown(ph.words[i - 1] ?? { w: '', s: 0, e: 0 }).endsWith('-');
            return (
              <tspan key={i} fill={on ? '#FFE27A' : '#FFFFFF'}>
                {(i && !hyph ? ' ' : '') + shown(w)}
              </tspan>
            );
          })}
        </text>
      </g>
    </svg>
  );
};

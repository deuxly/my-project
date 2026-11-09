import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { STUDIO } from '../studio.config';

// Three faces: a heavy display face for the title card, a mono for on-screen readouts (timers, labels, chips),
// and a handwriting face for chalk and notes. The Google faces load at render time (they need a connection);
// a local title face from studio.config.ts loads from public/ and works offline.

// Loaded from public/fonts (the latin files of the Google faces), so a render needs no connection.
const LOCAL: [string, string, string][] = [
  ['Bricolage Grotesque', '600', 'fonts/BricolageGrotesque-600.woff2'],
  ['Bricolage Grotesque', '700', 'fonts/BricolageGrotesque-700.woff2'],
  ['Bricolage Grotesque', '800', 'fonts/BricolageGrotesque-800.woff2'],
  ['Fragment Mono', '400', 'fonts/FragmentMono-400.woff2'],
  ['Kalam', '400', 'fonts/Kalam-400.woff2'],
  ['Kalam', '700', 'fonts/Kalam-700.woff2'],
];
for (const [family, weight, file] of LOCAL) loadFont({ family, url: staticFile(file), weight });
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Bricolage Grotesque',
  ui: 'Fragment Mono',
  hand: 'Kalam',
};

import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, rnd, camT, LOOKS, LEG_LEN, HEAD, reachAngle,
  Kitchen, KitchenIsland, KITCHEN, stand, Tabletop, Rooftop, Bedroom, BedDuvet, bedSit, Schematic, SCH, Arrow, SchLabel, CountUp, DrawOn,
  AlarmClock, Foreground, Glow, FONT, backOut, LightVeil, Dust, FocusRings, ShotProps,
} from '../../engine';

// "Gimana kalau matahari tiba-tiba ngga bergerak?" Fourteen shots on three sets (rooftop, kitchen, bedroom with the
// sun in its window) and the schematic. The cold open is the dream: the sun stands still, the day never ends. The
// turn is the physics: a sun that stands still means an Earth that stopped turning, and you didn't.
// East is screen right everywhere, so the final wind and debris run to the right.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const ROOF_FEET = 840;
const SUN = { x: 1220, y: 640 }; // where the sun freezes over the city, every rooftop wide

const roofPose = (x: number, s: number, extra: Partial<Pose> = {}): Partial<Pose> => ({ x, y: ROOF_FEET - LEG_LEN * s, scale: s, ...extra });

// ---------- S1: wide, the roof at five: Pip and Mo, the sun low over the city ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...roofPose(840, 0.62), yaw: 0.5, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 12, p: {} },
    { f: 18, p: { armR: { a: 118, b: 0 }, handR: 'point' }, ease: easeOut },
    { f: 21, p: { armR: { a: 112, b: 0 } } },
  ]);
  const mo = poseAt(t, [{ f: 0, p: { ...roofPose(1010, 0.62), yaw: 0.35, look: 0.6, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } } }]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 1000]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Rooftop t={t + 20} sunX={SUN.x} sunY={SUN.y - 26 + t * 0.5} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={PIP} pose={{ ...pip, handR: t >= 16 ? 'point' : 'open', ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Foreground blur={10}>
        <path d="M -40 1100 L -40 860 Q 120 820 300 900 L 360 1100 Z" fill="#120C18" />
        <rect x={1640} y={760} width={120} height={360} fill="#100A16" />
      </Foreground>
    </g>
  );
};

// ---------- S2: medium, low angle: Pip looks up into the sun; on "berhenti" it stops dead, the birds freeze ----------
const S2_STOP = 25; // just after "berhenti", so the stop answers the word
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const live = Math.min(t, S2_STOP); // the world's clock stops with the sun
  const pose = poseAt(t, [
    { f: 0, p: { x: 780, y: 800, scale: 1.8, yaw: 0.55, look: 0.9, headTilt: -10, armL: { a: 12, b: -6 }, armR: { a: 18, b: -10 } } },
    { f: S2_STOP + 1, p: {} },
    { f: S2_STOP + 4, p: { headTilt: -4, tilt: -3, armR: { a: 40, b: 30 } }, ease: easeOut },
    { f: S2_STOP + 7, p: { headTilt: -6, tilt: -2 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [S2_STOP + 3, 'shock']]);
  const sunY = 520 + live * 0.9;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [S2_STOP, 1.04], [len, 1.05]]))}>
      <Rooftop t={live + 66} sunX={1300} sunY={sunY} low={260} />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
      {t >= S2_STOP ? (
        <g opacity={clamp((t - S2_STOP) / 3) * (1 - clamp((t - S2_STOP - 14) / 8))}>
          <circle cx={1300} cy={sunY} r={200 + (t - S2_STOP) * 4} fill="none" stroke="#FFE7B3" strokeWidth={6} opacity={0.6} />
          <circle cx={1300} cy={sunY} r={230 + (t - S2_STOP) * 7} fill="none" stroke="#FFE7B3" strokeWidth={3} opacity={0.35} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S3: medium two-shot at the parapet: the gold never ends; Mo cheers ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [{ f: 0, p: { ...roofPose(780, 1.25), yaw: 0.45, look: 0.7, armL: { a: 30, b: 50 }, armR: { a: 36, b: 60 } } }, { f: 20, p: { headTilt: 5 } }]);
  const mo = poseAt(t, [
    { f: 0, p: { ...roofPose(930, 1.25), yaw: -0.25, look: -0.5, armL: { a: 24, b: 30 }, armR: { a: 24, b: 30 } } },
    { f: 5, p: { squash: 0.05 } },
    { f: 11, p: { armL: { a: 155, b: 10 }, armR: { a: 150, b: 14 }, squash: -0.04, look: 0.4 }, ease: easeOut },
    { f: 15, p: { armL: { a: 146, b: 16 }, armR: { a: 142, b: 18 }, squash: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 925]]), 560, kf(t, [[0, 1.75], [len, 1.82]]))}>
      <Rooftop t={200} sunX={SUN.x} sunY={SUN.y - 30} />
      <Glow x={SUN.x} y={SUN.y - 30} r={520} o={0.35} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S4: wide, the kitchen at nine: the clock says night, the window says afternoon ----------
const S4_PIP = stand(KITCHEN, 0.42, 0.4);
const S4_MO = stand(KITCHEN, 0.62, 0.4);
const CLOCK = KITCHEN.P(0.695, 0.15, 0);
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: S4_PIP.x, y: S4_PIP.y, scale: S4_PIP.scale, yaw: 0.35, look: 0.9, headTilt: -6, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 8, p: {} },
    { f: 13, p: { yaw: -0.5, look: -0.9, headTilt: 0 }, ease: easeOut },
  ]);
  const mo = poseAt(t, [{ f: 0, p: { x: S4_MO.x, y: S4_MO.y, scale: S4_MO.scale, yaw: -0.5, look: -0.8, armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 } } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Kitchen t={t + 40} id="k4" veil={0.36} clock={21} />
      <Glow x={CLOCK.x} y={CLOCK.y} r={90} o={0.4} />
      {/* the sun, still up in the window at nine at night: a hot bloom and a shaft across the room */}
      <polygon points="660,540 930,540 1260,1080 300,1080" fill="url(#kitShaft)" opacity={0.6} />
      <Glow x={860} y={520} r={460} o={0.6} />
      <Glow x={860} y={520} r={140} o={0.8} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [10, 'worried']]) }} rimId="rimL" shadow={0} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'worried']]) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <Foreground blur={10}>
        <path d="M 1500 1100 Q 1520 860 1640 820 Q 1760 800 1820 900 L 1900 1100 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S5: macro insert: the kitchen clock at nine, in a hard bar of sunlight ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const c = { x: 940, y: 540 };
  const r = 300;
  const sec = Math.floor((t + 4) / 10) * 6 + 6 * easeOut(clamp((((t + 4) % 10) - 0) / 3)) - 6; // the second hand still ticks
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#4A4A42" />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={-200} y={-200 + i * 110} width={2320} height={4} fill="#3E3E38" />
      ))}
      {/* the sun's bar across the wall from the window (frame left), the clock in it */}
      <polygon points="-200,180 2120,-120 2120,560 -200,980" fill="#FFB46A" opacity={0.28} style={{ mixBlendMode: 'screen' }} />
      <polygon points="-200,300 2120,40 2120,380 -200,800" fill="#FFD9A0" opacity={0.2} style={{ mixBlendMode: 'screen' }} />
      <circle cx={c.x + 26} cy={c.y + 30} r={r + 10} fill="#000" opacity={0.35} />
      <circle cx={c.x} cy={c.y} r={r} fill="#EFE2CC" />
      <circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#1E1824" strokeWidth={46} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const k = i % 3 === 0 ? 46 : 24;
        return <path key={i} d={`M ${c.x + Math.sin(a) * (r - 40)} ${c.y - Math.cos(a) * (r - 40)} L ${c.x + Math.sin(a) * (r - 40 - k)} ${c.y - Math.cos(a) * (r - 40 - k)}`} stroke="#1E1824" strokeWidth={i % 3 === 0 ? 14 : 8} strokeLinecap="round" />;
      })}
      <g stroke="#1E1824" strokeLinecap="round">
        <path d={`M ${c.x} ${c.y} L ${c.x} ${c.y - 150}`} strokeWidth={26} transform={`rotate(270 ${c.x} ${c.y})`} />
        <path d={`M ${c.x} ${c.y} L ${c.x} ${c.y - 220}`} strokeWidth={16} transform={`rotate(0 ${c.x} ${c.y})`} />
      </g>
      <path d={`M ${c.x} ${c.y + 40} L ${c.x} ${c.y - 230}`} stroke="#D9483B" strokeWidth={6} strokeLinecap="round" transform={`rotate(${sec + 120} ${c.x} ${c.y})`} />
      <circle cx={c.x} cy={c.y} r={16} fill="#D9483B" />
      {/* glass glare and the sun's hot edge on the rim */}
      <path d={`M ${c.x - 200} ${c.y - 150} Q ${c.x - 60} ${c.y - 250} ${c.x + 120} ${c.y - 230}`} stroke="#FFFFFF" strokeWidth={18} fill="none" opacity={0.35} strokeLinecap="round" />
      <path d={`M ${c.x - 290} ${c.y - 80} A ${r} ${r} 0 0 1 ${c.x - 60} ${c.y - 294}`} stroke="#FFC98A" strokeWidth={8} fill="none" opacity={0.8} />
      <Glow x={c.x - 300} y={c.y - 200} r={520} o={0.35} />
      <Dust t={t + 30} seed={41} x0={200} y0={100} w={1500} h={600} n={22} o={0.5} />
    </g>
  );
};

// ---------- S6: wide, the bedroom at midnight: the sun pours in, Pip sits up in bed ----------
const S6_SIT = bedSit(0.22);
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: S6_SIT.x, y: S6_SIT.y, scale: S6_SIT.scale, yaw: 0.55, look: 0.9, armL: { a: 30, b: 40 }, armR: { a: 34, b: 40 } } },
    { f: 14, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Bedroom t={t + 60} id="b6" duvet={false} clock="00:00" lamp={0} sun veil={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]), blink: 0.35 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <Foreground blur={10}>
        <path d="M -40 1100 L -40 700 Q 60 680 120 760 L 200 1100 Z" fill="#100C18" />
      </Foreground>
    </g>
  );
};

// ---------- S7: top-down insert: the bedside clock reads 00:00, a bar of sunlight across it ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${-3 + t * 0.08}) scale(${1 + t * 0.003}) translate(-960 -540)`}>
    <Tabletop edge={1400} wood="#5E4A44" grain="#4E3C37" />
    <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0610" opacity={0.25} />
    {/* the lamp's base, a glass of water, a book: all caught in the sun's bar */}
    <circle cx={1480} cy={300} r={150} fill="#2A2026" />
    <circle cx={1480} cy={300} r={60} fill="#3A2E34" />
    <circle cx={430} cy={760} r={92} fill="#BFD6FF" opacity={0.35} />
    <circle cx={430} cy={760} r={70} fill="#DDEBFF" opacity={0.35} />
    <g transform="rotate(12 1450 820)">
      <rect x={1240} y={700} width={430} height={300} rx={10} fill="#2F6E69" />
      <rect x={1240} y={700} width={30} height={300} fill="#265A56" />
    </g>
    <AlarmClock x={930} y={640} s={3.2} text="00:00" />
    <polygon points="-200,320 2120,60 2120,420 -200,760" fill="#FFB46A" opacity={0.3} style={{ mixBlendMode: 'screen' }} />
    <polygon points="-200,420 2120,170 2120,300 -200,620" fill="#FFE2B0" opacity={0.22} style={{ mixBlendMode: 'screen' }} />
    <Glow x={200} y={500} r={700} o={0.4} />
    <Dust t={t + 70} seed={43} x0={100} y0={150} w={1700} h={500} n={18} o={0.5} />
  </g>
);

// ---------- S8: close-up: Pip in bed, squinting into the sun, can't sleep ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.04 * clamp(t / len));
  const head = { x: 820, y: 600 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.35, look: 0.6, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    headTilt: kf(t, [[0, 4], [14, -3], [len, -4]]), ...faceAt(t, [[0, 'tired']]), blink: kf(t, [[0, 0.45], [12, 0.6], [16, 0.3], [len, 0.4]]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-900 -560) scale(2)">
          <Bedroom t={t + 90} id="b8" duvet clock="00:00" lamp={0} sun veil={0.3} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.2} />
      {/* the pillow behind his head */}
      <ellipse cx={760} cy={760} rx={520} ry={190} fill="#D8D0C0" />
      <ellipse cx={760} cy={730} rx={480} ry={140} fill="#E6E0D2" />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {/* the duvet pulled up to his chin */}
      <path d="M -40 1100 L -40 860 Q 400 800 820 860 Q 1300 920 1960 820 L 1960 1100 Z" fill="#4E5E92" />
      <path d="M -40 870 Q 400 810 820 870 Q 1300 930 1960 830" stroke="#FFC98A" strokeWidth={6} fill="none" opacity={0.5} />
      <Glow x={1700} y={380} r={700} o={0.55} />
    </g>
  );
};

// ---------- S9: the title, wide on the roof: the sun stuck over the city ----------
const S9World: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [{ f: 0, p: { ...roofPose(860, 0.6), yaw: 0.45, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } }]);
  const mo = poseAt(t, [{ f: 0, p: { ...roofPose(1000, 0.6), yaw: 0.3, look: 0.7, armL: { a: 20, b: 30 }, armR: { a: 20, b: 30 } } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={200} sunX={SUN.x} sunY={SUN.y - 30} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};
export const S9: React.FC<ShotProps> = (p) => (
  <g>
    <S9World {...p} />
    <S9Title t={p.t} x={1000} y={-20} />
  </g>
);
/** The title for a vertical frame: three stacked lines, popping on one after another, the last one pulsing. */
export const S9Title: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= 40 && t < 52 ? 1 + 0.12 * Math.sin(((t - 40) / 12) * Math.PI) : 1;
  const line = (txt: string, dy: number, size: number, fill: string, d: number, k = 1, glow = false) => (
    <g transform={`translate(${x} ${y + dy}) scale(${pop(d) * k})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={size > 80 ? 800 : 600} fontSize={size} letterSpacing={size > 80 ? 0 : 4} fill={fill} stroke="#1A1230" strokeWidth={size > 80 ? 12 : 8} paintOrder="stroke" style={glow ? { filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.55))' } : undefined}>
        {txt}
      </text>
    </g>
  );
  return (
    <g>
      {line('BAGAIMANA KALAU', 0, 58, '#F6EFE3', 2)}
      {line('MATAHARI', 128, 132, '#FF8A3D', 5, 1, true)}
      {line('BERHENTI?', 258, 132, '#FFE27A', 8, pulse, true)}
    </g>
  );
};

// ---------- the schematics' Earth ----------
// From above the North Pole the Earth turns counterclockwise. Continents are loose blobs scattered over the disc.
const BLOBS = Array.from({ length: 7 }).map((_, i) => ({ rho: 0.25 + rnd(71, i) * 0.6, phi: i * 0.9 + rnd(72, i), size: 0.12 + rnd(73, i) * 0.12, seed: 80 + i }));
const blobPath = (cx: number, cy: number, r: number, seed: number) => {
  const n = 9;
  const pts = Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = r * (0.7 + rnd(seed, i) * 0.5);
    return [cx + Math.cos(a) * k, cy + Math.sin(a) * k];
  });
  return `M ${pts.map((p) => p.join(' ')).join(' L ')} Z`;
};
const INDO_PHI = -0.4; // Indonesia's place on the rim (it sits near the equator, the disc's edge)
const TopGlobe: React.FC<{ x: number; y: number; r: number; rot: number; id: string }> = ({ x, y, r, rot, id }) => {
  const a = INDO_PHI - rot;
  const me = { x: x + Math.cos(a) * r * 0.9, y: y + Math.sin(a) * r * 0.9 };
  return (
    <g>
      <defs>
        <clipPath id={`${id}c`}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <circle cx={x} cy={y} r={r} fill="#16304E" />
      <g clipPath={`url(#${id}c)`}>
        {BLOBS.map((b, i) => {
          const ang = b.phi - rot;
          return <path key={i} d={blobPath(x + Math.cos(ang) * b.rho * r, y + Math.sin(ang) * b.rho * r, b.size * r, b.seed)} fill="#3E6E58" stroke={SCH.line} strokeWidth={3} opacity={0.9} />;
        })}
        <path d={blobPath(me.x, me.y, r * 0.08, 91)} fill="#3E6E58" stroke={SCH.line} strokeWidth={3} />
        {/* the night half, away from the sun above */}
        <rect x={x - r} y={y} width={2 * r} height={r} fill="#050A14" opacity={0.6} />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={SCH.line} strokeWidth={6} />
      <circle cx={x} cy={y} r={8} fill={SCH.line} />
      <circle cx={me.x} cy={me.y} r={14} fill={SCH.live} style={{ filter: `drop-shadow(0 0 10px ${SCH.glow})` }} />
    </g>
  );
};

// ---------- S10: schematic: the Earth from above, spinning, then braking to a dead stop ----------
const S10_STOP = 80; // "berhenti" lands at about t 76
const spinAngle = (t: number) => {
  const w0 = 0.06; // radians a frame
  const tt = Math.min(Math.max(t, 0), S10_STOP);
  return w0 * (tt - (tt * tt) / (2 * S10_STOP));
};
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const rot = spinAngle(t);
  const spinning = 1 - clamp((t - S10_STOP + 10) / 10);
  const g = { x: 960, y: 640, r: 300 };
  const sun = { x: 960, y: -60 };
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sch10" />
      {/* the sun, above, its light falling down the frame onto the globe */}
      <circle cx={sun.x} cy={sun.y} r={120} fill={SCH.live} style={{ filter: `drop-shadow(0 0 40px ${SCH.glow})` }} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <path key={i} d={`M ${sun.x + Math.cos(a) * 145} ${sun.y + Math.sin(a) * 145} L ${sun.x + Math.cos(a) * 180} ${sun.y + Math.sin(a) * 180}`} stroke={SCH.live} strokeWidth={8} strokeLinecap="round" />;
      })}
      <SchLabel x={sun.x + 210} y={sun.y + 12} t={t - 4} text="MATAHARI" size={34} color={SCH.dim} anchor="start" />
      {[-1, 0, 1].map((i) => (
        <path key={i} d={`M ${sun.x + i * 110} 150 L ${sun.x + i * 110} 290`} stroke={SCH.live} strokeWidth={3} strokeDasharray="14 14" opacity={0.5} strokeDashoffset={-t * 2} />
      ))}
      <TopGlobe x={g.x} y={g.y} r={g.r} rot={rot} id="tg10" />
      {/* the spin arrows round the rim, fading as it stops */}
      <g opacity={spinning} transform={`rotate(${(-rot * 180) / Math.PI} ${g.x} ${g.y})`}>
        {[0, 1].map((i) => {
          const a0 = Math.PI * (0.15 + i);
          const a1 = a0 + 1.6;
          const R = g.r + 50;
          const p0 = { x: g.x + Math.cos(a0) * R, y: g.y + Math.sin(a0) * R };
          const p1 = { x: g.x + Math.cos(a1) * R, y: g.y + Math.sin(a1) * R };
          return (
            <g key={i}>
              <path d={`M ${p1.x} ${p1.y} A ${R} ${R} 0 0 0 ${p0.x} ${p0.y}`} stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" />
              <circle cx={p0.x} cy={p0.y} r={12} fill={SCH.line} />
            </g>
          );
        })}
      </g>
      <SchLabel x={g.x} y={-250} t={t - 2} text="BUMI, DARI ATAS KUTUB UTARA" size={36} color={SCH.dim} />
      {t < S10_STOP ? (
        <SchLabel x={g.x} y={1110} t={t - 8} text="BERPUTAR" size={64} />
      ) : (
        <SchLabel x={g.x} y={1120} t={t - S10_STOP} text="BERHENTI" size={88} color={SCH.live} />
      )}
    </g>
  );
};

// ---------- S11: close-up on the roof: Pip, realising ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.2 * (1 + 0.05 * clamp(t / len));
  const head = { x: 1060, y: 640 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: -0.3, look: kf(t, [[0, -0.2], [8, -0.8]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    headTilt: kf(t, [[0, 0], [10, -5]]), ...faceAt(t, [[0, 'worried'], [12, 'shock']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -560) scale(2)">
          <Rooftop t={200} sunX={SUN.x} sunY={SUN.y - 30} low={180} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
      <g transform={`translate(${head.x} ${head.y - 40}) scale(0.4) translate(${-head.x} ${-head.y + 40})`}>
        <FocusRings x={head.x} y={head.y - 40} t={t - 10} />
      </g>
    </g>
  );
};

// ---------- S12: schematic: Indonesia on the globe; you keep going east at over 1,600 km/h ----------
const ISLANDS: [number, number, number, number, number][] = [
  // dx, dy (from the globe centre, in r), rx, ry (in r), rotation: Sumatra, Java, Borneo, Sulawesi, Papua
  [-0.32, -0.02, 0.15, 0.04, 35],
  [-0.12, 0.11, 0.14, 0.03, 5],
  [-0.06, -0.08, 0.1, 0.08, 0],
  [0.12, -0.02, 0.05, 0.08, 20],
  [0.36, 0.05, 0.13, 0.06, 10],
];
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const g = { x: 960, y: 300, r: 300 };
  const me = { x: g.x - 0.12 * g.r, y: g.y + 0.11 * g.r };
  const fly = easeInOut(clamp((t - 62) / 30)); // the dot leaves the globe, still going east
  const dot = { x: me.x + fly * 800, y: me.y };
  const fmt = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t + 108} id="sch12" />
      <defs>
        <clipPath id="sg12">
          <circle cx={g.x} cy={g.y} r={g.r} />
        </clipPath>
      </defs>
      <circle cx={g.x} cy={g.y} r={g.r} fill="#16304E" />
      <g clipPath="url(#sg12)">
        {[-0.66, -0.33, 0.33, 0.66].map((k, i) => (
          <path key={`la${i}`} d={`M ${g.x - g.r} ${g.y + k * g.r} L ${g.x + g.r} ${g.y + k * g.r}`} stroke={SCH.dim} strokeWidth={2} opacity={0.6} />
        ))}
        {[0.35, 0.7].map((k, i) => (
          <ellipse key={`me${i}`} cx={g.x} cy={g.y} rx={k * g.r} ry={g.r} fill="none" stroke={SCH.dim} strokeWidth={2} opacity={0.6} />
        ))}
        {ISLANDS.map(([dx, dy, rx, ry, rot], i) => (
          <ellipse key={i} cx={g.x + dx * g.r} cy={g.y + dy * g.r} rx={rx * g.r} ry={ry * g.r} fill="#3E6E58" stroke={SCH.line} strokeWidth={3} transform={`rotate(${rot} ${g.x + dx * g.r} ${g.y + dy * g.r})`} />
        ))}
      </g>
      <path d={`M ${g.x - g.r} ${g.y} L ${g.x + g.r} ${g.y}`} stroke={SCH.live} strokeWidth={3} strokeDasharray="12 10" opacity={0.8} />
      <circle cx={g.x} cy={g.y} r={g.r} fill="none" stroke={SCH.line} strokeWidth={6} />
      <SchLabel x={g.x + g.r - 10} y={g.y - 14} t={t - 2} text="KHATULISTIWA" size={24} color={SCH.dim} anchor="end" />
      <SchLabel x={g.x} y={-120} t={t - 4} text="BUMI BERHENTI" size={40} color={SCH.dim} />
      {/* the arrow east from Indonesia, then the dot (you) keeps going along it */}
      <Arrow x0={me.x + 30} y0={me.y} x1={1430} y1={me.y} t={t - 14} dur={10} color={SCH.live} bend={0} />
      {fly > 0 ? (
        <g>
          {[1, 2, 3, 4].map((i) => (
            <circle key={i} cx={dot.x - i * 26 * fly} cy={dot.y} r={16 - i * 3} fill={SCH.live} opacity={0.5 - i * 0.1} />
          ))}
        </g>
      ) : null}
      <circle cx={dot.x} cy={dot.y} r={18} fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      <SchLabel x={me.x} y={me.y + 60} t={t - 6} text="KAMU" size={34} />
      <SchLabel x={960} y={770} t={t - 26} text="LEBIH DARI" size={48} color={SCH.dim} />
      <CountUp x={960} y={930} t={t - 30} to={1600} dur={36} size={170} format={fmt} />
      <SchLabel x={960} y={1040} t={t - 64} text="KM / JAM" size={64} />
      <SchLabel x={960} y={1160} t={t - 74} text="KE TIMUR  →" size={44} color={SCH.live} />
    </g>
  );
};

// ---------- S13: extreme close-up: "Itu nyata." Pip, scared; the light turns red ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.4 * (1 + 0.05 * clamp(t / len));
  const head = { x: 960, y: 720 };
  const red = 0.25 + 0.5 * clamp(t / len);
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.1, look: 0.1, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-600 -560) scale(2)">
          <Rooftop t={200} sunX={SUN.x - 220} sunY={SUN.y - 40} red={red} low={180} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId={t > len * 0.4 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- S14: wide, low angle: red sky; the ground stops, everything else goes east. Pip grabs the parapet ----------
const S14_S = 1.1;
const S14_HIP = { x: 900, y: 905 - LEG_LEN * S14_S };
const DEBRIS = Array.from({ length: 26 }).map((_, i) => ({ y: 120 + rnd(101, i) * 760, x0: -300 + rnd(102, i) * 1400, v: 60 + rnd(103, i) * 70, k: i % 4, s: 0.6 + rnd(104, i) * 0.9 }));
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const wind = easeOut(clamp((t - 18) / 6)); // the gust hits just after "Pegangan", as he grips
  const base = { ...basePose, x: S14_HIP.x, y: S14_HIP.y, scale: S14_S };
  const grabL = reachAngle({ ...base, tilt: -14 }, { x: 820, y: 836 });
  const grabR = reachAngle({ ...base, tilt: -14 }, { x: 960, y: 836 });
  const pose = poseAt(t, [
    { f: 0, p: { ...base, yaw: -0.3, look: -0.4, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } } },
    { f: 3, p: { tilt: 6, armL: { a: 60, b: 30 }, armR: { a: 60, b: 30 } }, ease: easeOut },
    { f: 8, p: { tilt: -14, armL: { a: grabL, b: 0 }, armR: { a: grabR, b: 0 }, squash: 0.06 }, ease: easeOut },
    { f: 12, p: { tilt: -11, squash: 0.03 } },
  ]);
  const jit = Math.sin(t * 2.3) * 1.5 * wind;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 520], [len, 505]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={200} sunX={SUN.x} sunY={SUN.y - 30} red={1} low={40} lightsOut={clamp((t - 4) / 16)} />
      {/* wind streaks and debris, all running east (right) */}
      <g opacity={wind}>
        {DEBRIS.map((d, i) => {
          const x = ((d.x0 + t * d.v) % 2600) - 300;
          const y = d.y + Math.sin(t / 3 + i) * 8;
          if (d.k === 0) return <rect key={i} x={x} y={y} width={46 * d.s} height={34 * d.s} fill="#E9DCC0" opacity={0.8} transform={`rotate(${t * 25 + i * 40} ${x} ${y})`} />;
          if (d.k === 1) return <ellipse key={i} cx={x} cy={y} rx={16 * d.s} ry={8 * d.s} fill="#3F5E44" transform={`rotate(${t * 30 + i * 50} ${x} ${y})`} />;
          return <path key={i} d={`M ${x} ${y} L ${x - 220 * d.s} ${y}`} stroke="#FFD0B0" strokeWidth={3} opacity={0.45} strokeLinecap="round" />;
        })}
      </g>
      <Hero look={PIP} pose={{ ...pose, x: pose.x + jit, sway: 1.5 * wind, ...faceAt(t, [[0, 'worried'], [4, 'shock']]) }} rimId="rimRed" shadow={0} />
      <Foreground blur={6}>
        {Array.from({ length: 6 }).map((_, i) => {
          const x = ((rnd(110, i) * 2400 + t * 140) % 2600) - 300;
          const y = 180 + rnd(111, i) * 700;
          return <path key={i} d={`M ${x} ${y} L ${x - 420} ${y}`} stroke="#FFC0A0" strokeWidth={8} opacity={0.35 * wind} strokeLinecap="round" />;
        })}
      </Foreground>
    </g>
  );
};

// ---------- the 9:16 frame: where each shot's vertical crop sits (screen x, y, zoom; see engine Framing) ----------
export const FRAME = {
  S1: { x: 990, y: 600, z: 0.9 },
  S2: { x: 1040, y: 540, z: 0.75 },
  S3: { x: 820, y: 600, z: 0.68 },
  S4: { x: 1000, y: 560, z: 0.9 },
  S5: { x: 940, y: 540, z: 0.85 },
  S6: { x: 900, y: 560, z: 0.75 },
  S7: { x: 930, y: 620, z: 0.6 },
  S8: { x: 880, y: 560, z: 0.95 },
  S9: { x: 1000, y: 540, z: 0.75 },
  S10: { x: 960, y: 420, z: 0.62 },
  S11: { x: 1040, y: 560, z: 0.9 },
  S12: { x: 960, y: 520, z: 0.62 },
  S13: { x: 960, y: 560, z: 0.7 },
  S14: { x: 900, y: 520, z: 0.7 },
};

import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, backOut, rnd, camT, LOOKS, LEG_LEN, HEAD, reachAngle,
  Rooftop, Bedroom, BedDuvet, bedSit, bedTop, Study, Desk, Tabletop, OpenBook, Schematic, SCH, SchLabel, CountUp, Tag,
  LivingRoom, SofaFront, CoffeeTable, sofaSit, LIVING, stand, Foreground, Glow, Dust, FONT, ShotProps,
} from '../../engine';

// "Kabar Dajjal", episode 1: "Kamu mendengar kabar Dajjal akan segera muncul." Twenty-six shots on the bedroom at night,
// a phone, the rooftop, the study, the schematic, the new living room and a TV. The MC is the user's own main character
// (LOOKS.mc), the hero of every episode. Respect rules: no prophet is ever drawn; the Dajjal is never shown, only a
// smiling man on a TV with half his face in shadow; the mushaf is drawn closed, never with invented Arabic text.

const MC = LOOKS.mc;
const SIS = LOOKS.sis;
const IBU = LOOKS.momHijab;
const SUIT = LOOKS.suit;
const ROOF_FEET = 840;
const roofPose = (x: number, s: number, extra: Partial<Pose> = {}): Partial<Pose> => ({ x, y: ROOF_FEET - LEG_LEN * s, scale: s, ...extra });

/** A sleeve and mitten coming into an insert from off frame (the MC's dark hoodie). */
const Arm: React.FC<{ hand: { x: number; y: number }; from: { x: number; y: number }; rot: number; s?: number; open?: boolean }> = ({ hand, from, rot, s = 4.8, open = false }) => (
  <g filter="url(#rimR)">
    <path d={`M ${hand.x} ${hand.y} L ${from.x} ${from.y}`} stroke={MC.line} strokeWidth={26 * s} strokeLinecap="round" />
    <path d={`M ${hand.x} ${hand.y} L ${from.x} ${from.y}`} stroke={MC.jacket} strokeWidth={22 * s} strokeLinecap="round" />
    <g transform={`translate(${hand.x} ${hand.y}) rotate(${rot}) scale(${s})`}>
      {open ? (
        <g>
          <ellipse cx={10} cy={3} rx={5.5} ry={9} transform="rotate(-28 10 3)" fill={MC.hand} stroke={MC.line} strokeWidth={2.4} />
          <ellipse cx={0} cy={10} rx={11} ry={15} fill={MC.hand} stroke={MC.line} strokeWidth={2.6} />
        </g>
      ) : (
        <g>
          <rect x={-4} y={10} width={8} height={24} rx={4} fill={MC.hand} stroke={MC.line} strokeWidth={2.4} />
          <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={MC.hand} stroke={MC.line} strokeWidth={2.6} strokeLinejoin="round" />
          <ellipse cx={10} cy={6} rx={4.5} ry={7} fill={MC.hand} stroke={MC.line} strokeWidth={2.4} />
        </g>
      )}
    </g>
  </g>
);

/** The phone's chat screen: a family group, a forwarded message popping in. Drawn at (x, y) centre, w wide. */
const ChatPhone: React.FC<{ x: number; y: number; w: number; t: number; msgAt: number; rot?: number }> = ({ x, y, w, t, msgAt, rot = 0 }) => {
  const h = w * 2.05;
  const pop = backOut(clamp((t - msgAt) / 7));
  const pad = w * 0.06;
  const sx = -w / 2 + pad;
  const sw = w - 2 * pad;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={w * 1.3} fill="url(#g3cool)" opacity={0.5} style={{ mixBlendMode: 'screen' }} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#141319" stroke="#3A3846" strokeWidth={w * 0.015} />
      <rect x={sx} y={-h / 2 + pad} width={sw} height={h - 2 * pad} rx={w * 0.1} fill="#101820" />
      {/* the header: group avatar and name */}
      <rect x={sx} y={-h / 2 + pad} width={sw} height={w * 0.3} rx={w * 0.1} fill="#1C2A36" />
      <circle cx={sx + w * 0.13} cy={-h / 2 + pad + w * 0.15} r={w * 0.08} fill="#C9A44A" />
      <text x={sx + w * 0.25} y={-h / 2 + pad + w * 0.14} fontFamily={FONT.ui} fontSize={w * 0.065} fill="#F6EFE3">
        KELUARGA BESAR
      </text>
      <text x={sx + w * 0.25} y={-h / 2 + pad + w * 0.22} fontFamily={FONT.ui} fontSize={w * 0.045} fill="#7E8DA6">
        34 anggota
      </text>
      {/* earlier, ordinary messages */}
      <rect x={sx + w * 0.05} y={-h * 0.28} width={sw * 0.55} height={w * 0.12} rx={w * 0.04} fill="#22303C" />
      <rect x={sx + sw * 0.36} y={-h * 0.18} width={sw * 0.58} height={w * 0.12} rx={w * 0.04} fill="#2E4A3E" />
      <rect x={sx + w * 0.05} y={-h * 0.08} width={sw * 0.4} height={w * 0.12} rx={w * 0.04} fill="#22303C" />
      {/* the forwarded message */}
      {t >= msgAt ? (
        <g transform={`translate(${sx + w * 0.05} ${h * 0.04}) scale(${pop})`}>
          <rect width={sw * 0.88} height={w * 0.62} rx={w * 0.05} fill="#2A3A48" stroke="#E4544A" strokeWidth={w * 0.012} />
          <text x={w * 0.05} y={w * 0.09} fontFamily={FONT.ui} fontSize={w * 0.045} fill="#9FB0C8">
            {'>> Diteruskan berkali2'}
          </text>
          <text x={w * 0.05} y={w * 0.22} fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.085} fill="#FF6A5A">
            DAJJAL MUNCUL
          </text>
          <text x={w * 0.05} y={w * 0.32} fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.085} fill="#FF6A5A">
            MINGGU INI!!!
          </text>
          <text x={w * 0.05} y={w * 0.45} fontFamily={FONT.title} fontWeight={700} fontSize={w * 0.058} fill="#F6EFE3">
            SEBARKAN SEBELUM
          </text>
          <text x={w * 0.05} y={w * 0.54} fontFamily={FONT.title} fontWeight={700} fontSize={w * 0.058} fill="#F6EFE3">
            DIHAPUS!!
          </text>
        </g>
      ) : null}
      <rect x={-w * 0.12} y={-h / 2 + w * 0.02} width={w * 0.24} height={w * 0.03} rx={w * 0.015} fill="#000" />
    </g>
  );
};

// ---------- S1: wide, the bedroom at 02:00: MC asleep, the room dark ----------
const SLEEP = bedTop(0.2, 0.06);
const sleeper = (t: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x: SLEEP.x, y: SLEEP.y - HEAD.y * bedSit(0.2).scale - 10, scale: bedSit(0.2).scale, yaw: 0.2, look: 0.3, blink: 1, headTilt: -14 + Math.sin(t / 14) * 1.5, expr: 'neutral', ...extra,
});
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 880]]), 600, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Bedroom t={t + 20} id="b1" duvet={false} clock="02:00" lamp={0} veil={0.55} />
    <defs>
      <clipPath id="s1sleep">
        <rect x={0} y={-2000} width={1920} height={SLEEP.y + 2010} />
      </clipPath>
    </defs>
    <g clipPath="url(#s1sleep)">
      <Hero look={MC} pose={sleeper(t)} rimId="rimBlue" shadow={0} />
    </g>
    <BedDuvet from={0.09} knees={0.5} />
    <Foreground blur={10}>
      <path d="M 1500 1100 L 1520 760 Q 1600 720 1700 760 L 1760 1100 Z" fill="#0E0C16" />
    </Foreground>
  </g>
);

// ---------- S2: insert, high over the nightstand: the phone lights up and buzzes ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const on = clamp((t - 18) / 3);
  const buzz = t > 18 ? Math.sin(t * 2.6) * 6 * (0.5 + 0.5 * Math.sin(t / 3)) : 0;
  return (
    <g transform={`translate(960 540) rotate(${-4 + t * 0.06}) scale(${1 + t * 0.003}) translate(-960 -540)`}>
      <Tabletop edge={1400} wood="#4A3A36" grain="#3E302C" />
      <rect x={-300} y={-300} width={2520} height={1680} fill="#05040A" opacity={0.55} />
      <g transform={`translate(${buzz} 0) rotate(${buzz * 0.4} 960 560)`}>
        <rect x={810} y={260} width={300} height={600} rx={44} fill="#141319" stroke="#3A3846" strokeWidth={5} />
        <rect x={826} y={276} width={268} height={568} rx={34} fill="#0B0A10" />
        {on > 0 ? (
          <g opacity={on}>
            <rect x={826} y={276} width={268} height={568} rx={34} fill="#22324A" />
            <text x={960} y={380} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={64} fill="#F6EFE3">
              02:00
            </text>
            <rect x={846} y={440} width={228} height={110} rx={20} fill="#F6EFE3" opacity={0.92} />
            <text x={862} y={478} fontFamily={FONT.ui} fontSize={20} fill="#1D2033">
              KELUARGA BESAR
            </text>
            <text x={862} y={512} fontFamily={FONT.ui} fontSize={18} fill="#C0392B">
              1 pesan diteruskan
            </text>
          </g>
        ) : null}
      </g>
      {on > 0 ? <Glow x={960} y={560} r={520} kind="cool" o={0.55 * on} /> : null}
      {t > 18
        ? [-1, 1].map((sd) => (
            <g key={sd} stroke="#CFE6FF" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.8 * (0.5 + 0.5 * Math.sin(t / 2))}>
              <path d={`M ${960 + sd * 190} 470 q ${sd * 20} 60 0 120`} />
              <path d={`M ${960 + sd * 230} 440 q ${sd * 30} 90 0 180`} />
            </g>
          ))
        : null}
      {/* the glass of water and the clock at the edge */}
      <circle cx={1380} cy={780} r={90} fill="#BFD6FF" opacity={0.18} />
      <rect x={420} y={640} width={260} height={130} rx={24} fill="#24202C" />
      <text x={550} y={730} textAnchor="middle" fontFamily={FONT.ui} fontSize={64} fill="#FF5A4A" opacity={0.85}>
        02:00
      </text>
    </g>
  );
};

// ---------- S3: macro insert: the group chat, the forwarded message pops in ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#07060C" />
    <ChatPhone x={960} y={kf(t, [[0, 560], [len, 540]])} w={kf(t, [[0, 500], [len, 540]])} t={t} msgAt={34} rot={-3} />
    <Arm hand={{ x: 1230, y: 900 }} from={{ x: 1500, y: 1500 }} rot={20} s={6} />
  </g>
);

// ---------- S4: close-up: MC sits up, face lit blue by the phone, eyes wide ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.05 * clamp(t / len));
  const head = { x: 960, y: 600 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc + kf(t, [[0, 40], [5, 0]], easeOut), scale: sc, yaw: 0.05, look: 0, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'shock']]), sway: 4 };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -560) scale(2)">
          <Bedroom t={t + 70} id="b4" clock="02:00" lamp={0} veil={0.6} />
        </g>
      </g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#05040C" opacity={0.45} />
      <Hero look={MC} pose={pose} rimId="rimBlue" shadow={0} />
      {/* the phone's light from below */}
      <Glow x={960} y={1100} r={700} kind="cool" o={0.7} />
      <rect x={760} y={1020} width={400} height={300} rx={40} fill="#141319" stroke="#3A3846" strokeWidth={6} />
    </g>
  );
};

// ---------- S5: schematic: phones lighting up in a wave, the share counter running ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const fmt = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sch5" />
      {Array.from({ length: 7 }).map((_, r) =>
        Array.from({ length: 6 }).map((__, c) => {
          const x = 960 + (c - 2.5) * 140;
          const y = -60 + r * 120;
          const d = Math.hypot(c - 2.5, r - 3) * 4;
          const on = clamp((t - d) / 4);
          return (
            <g key={`${r}-${c}`}>
              <rect x={x - 30} y={y - 50} width={60} height={100} rx={12} fill={on > 0 ? '#22324A' : 'none'} stroke={on > 0 ? SCH.live : SCH.dim} strokeWidth={4} />
              {on > 0 ? <rect x={x - 20} y={y - 30} width={40} height={18} rx={5} fill="#FF6A5A" opacity={on} /> : null}
            </g>
          );
        }),
      )}
      <rect x={480} y={820} width={960} height={300} fill={SCH.ground} opacity={0.85} />
      <CountUp x={960} y={1000} t={t - 4} to={1000000} dur={40} size={130} format={fmt} />
      <SchLabel x={960} y={1080} t={t - 8} text="KALI DIBAGIKAN" size={52} />
    </g>
  );
};

// ---------- S6: wide, the city in the morning: sirens, smoke, every window lit ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Rooftop t={t + 40} sunX={1180} sunY={540} red={0.25} cityLit={2.8} />
    {/* smoke columns rising from the city */}
    <g filter="url(#blur16)">
      {[[700, 0], [1260, 1], [980, 2]].map(([x, i]) => (
        <g key={i}>
          {Array.from({ length: 5 }).map((_, k) => (
            <ellipse key={k} cx={x + Math.sin(t / 10 + k + i) * 20 + k * 14} cy={720 - k * 90 - ((t * 1.2) % 90)} rx={50 + k * 22} ry={40 + k * 14} fill="#3A3040" opacity={0.6 - k * 0.08} />
          ))}
        </g>
      ))}
    </g>
    {/* sirens at street level */}
    {[[820, 0], [1100, 1], [1350, 2]].map(([x, i]) => {
      const blue = Math.floor(t / 4 + i) % 2 === 0;
      return <Glow key={i} x={x} y={780} r={120} kind={blue ? 'cool' : 'red'} o={0.8} />;
    })}
    <Foreground blur={10}>
      <rect x={1640} y={720} width={220} height={400} fill="#100A16" />
    </Foreground>
  </g>
);

// ---------- S7: the title, wide on the roof: MC alone above the city ----------
const S7World: React.FC<ShotProps> = ({ t, len }) => {
  const mc = poseAt(t, [{ f: 0, p: { ...roofPose(960, 0.62), yaw: 0.35, look: 0.6, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } }, { f: 40, p: { headTilt: 4 } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={t + 120} sunX={1160} sunY={620} red={0.15} cityLit={2} />
      <Hero look={MC} pose={{ ...mc, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};
const TitleStack: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= 34 && t < 46 ? 1 + 0.12 * Math.sin(((t - 34) / 12) * Math.PI) : 1;
  const line = (txt: string, dy: number, size: number, fill: string, d: number, k = 1, glow = false) => (
    <g transform={`translate(${x} ${y + dy}) scale(${pop(d) * k})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={size > 80 ? 800 : 600} fontSize={size} letterSpacing={size > 80 ? 0 : 4} fill={fill} stroke="#1A1230" strokeWidth={size > 80 ? 12 : 8} paintOrder="stroke" style={glow ? { filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.55))' } : undefined}>
        {txt}
      </text>
    </g>
  );
  return (
    <g>
      {line('BAGAIMANA KALAU', 0, 56, '#F6EFE3', 2)}
      {line('DAJJAL', 136, 150, '#FFE27A', 5, pulse, true)}
      {line('SEGERA MUNCUL?', 246, 88, '#FF8A3D', 8, 1, true)}
    </g>
  );
};
export const S7: React.FC<ShotProps> = (p) => (
  <g>
    <S7World {...p} />
    <TitleStack t={p.t} x={960} y={-40} />
  </g>
);

// ---------- S8: medium, the study at night: MC at his desk breathes out, calm ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 712, yaw: 0.35, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 40, b: 40 }, tilt: 2 } },
    { f: 10, p: { tilt: 4, headTilt: 4 } },
    { f: 22, p: { tilt: -2, headTilt: -2 }, ease: easeOut },
    { f: 40, p: { tilt: 0, headTilt: 0, look: 0.8 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), 590, kf(t, [[0, 1.75], [len, 1.85]]))}>
      <Study t={t + 60} id="st8" night />
      <Hero look={MC} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [18, 'neutral']]), blink: t > 12 && t < 18 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      <Foreground blur={10}>
        <path d="M 1500 1000 Q 1380 800 1430 600 Q 1470 800 1580 980 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S9: top-down insert: an open book of hadith, a finger running down the page ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const hand = { x: kf(t, [[0, 1240], [10, 1080], [70, 1070]]), y: kf(t, [[0, 900], [10, 520], [70, 640]]) };
  return (
    <g transform={`translate(960 540) rotate(${-2 + t * 0.04}) scale(${1 + t * 0.002}) translate(-960 -540)`}>
      <Tabletop edge={1400} />
      <Glow x={1100} y={360} r={760} o={0.4} />
      <OpenBook x={960} y={760} w={1100} rot={-3} cover="#2F5A4A" />
      {/* lines of text on the pages, as plain strokes */}
      {[0, 1].map((side) =>
        Array.from({ length: 9 }).map((_, i) => (
          <path key={`${side}${i}`} d={`M ${side ? 1000 : 480} ${400 + i * 34} L ${side ? 1420 : 900} ${400 + i * 34 - (side ? 6 : -6)}`} stroke="#8A7E6A" strokeWidth={8} strokeLinecap="round" opacity={0.6} transform="rotate(-3 960 560)" />
        )),
      )}
      <rect x={990} y={kf(t, [[0, 520], [50, 620]]) - 18} width={460} height={36} fill="#FFE27A" opacity={0.35 * clamp((t - 30) / 6)} transform="rotate(-3 960 560)" />
      <Arm hand={hand} from={{ x: hand.x + 500, y: hand.y + 900 }} rot={-20} s={5} />
      <Tag x={960} y={230} t={t - 70} text="HR. MUSLIM 2937" w={540} />
    </g>
  );
};

// ---------- S10: schematic: forty day cells pop on ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t + 40} id="sch10" />
    <SchLabel x={960} y={-140} t={t} text="DAJJAL TINGGAL DI BUMI" size={40} color={SCH.dim} />
    {Array.from({ length: 40 }).map((_, i) => {
      const c = i % 5;
      const r = Math.floor(i / 5);
      const at = 4 + i * 0.9;
      const s = backOut(clamp((t - at) / 5));
      const x = 960 + (c - 2) * 130;
      const y = -10 + r * 110;
      return s > 0 ? (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x={-52} y={-40} width={104} height={80} rx={10} fill={i < 3 ? '#3A2418' : '#18263A'} stroke={i < 3 ? SCH.live : SCH.line} strokeWidth={4} />
          <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={i < 3 ? SCH.live : SCH.line}>
            {i + 1}
          </text>
        </g>
      ) : null;
    })}
    <SchLabel x={960} y={1010} t={t - 44} text="40 HARI" size={110} color={SCH.live} />
  </g>
);

// ---------- S11-S13: schematic: the first three days stretch: a year, a month, a week ----------
const BARS = [
  { label: 'HARI 1', eq: '= 1 TAHUN', len: 800 },
  { label: 'HARI 2', eq: '= 1 BULAN', len: 420 },
  { label: 'HARI 3', eq: '= 1 MINGGU', len: 180 },
];
const Bars: React.FC<{ t: number; len: number; focus: number }> = ({ t, len, focus }) => (
  <g transform={`translate(960 ${300 + focus * 60}) scale(${kf(t, [[0, 1.04], [len, 1.1]])}) translate(-960 ${-300 - focus * 60})`}>
    <Schematic t={t + 110 + focus * 50} id={`schb${focus}`} />
    <SchLabel x={960} y={-140} t={99} text="SATU HARI SEPERTI..." size={40} color={SCH.dim} />
    {BARS.map((b, i) => {
      if (i > focus) return null;
      const p = i < focus ? 1 : easeOut(clamp((t - 4) / 24));
      const y = 40 + i * 300;
      const x0 = 960 - 400;
      return (
        <g key={i} opacity={i === focus ? 1 : 0.45}>
          <text x={x0} y={y} fontFamily={FONT.ui} fontSize={44} fill={SCH.line}>
            {b.label}
          </text>
          <rect x={x0} y={y + 30} width={b.len * p} height={70} rx={12} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow})` }} />
          {/* the sun crawling along the bar: the day that won't end */}
          <circle cx={x0 + b.len * p} cy={y + 65} r={26} fill="#FFE27A" />
          {p > 0.6 ? (
            <text x={x0} y={y + 160} fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#FFE27A" opacity={clamp((p - 0.6) / 0.2)}>
              {b.eq}
            </text>
          ) : null}
        </g>
      );
    })}
    {focus === 2 ? (
      <g opacity={clamp((t - 30) / 6)}>
        <text x={560} y={960} fontFamily={FONT.ui} fontSize={36} fill={SCH.dim}>
          HARI BIASA
        </text>
        <rect x={560} y={985} width={24} height={50} rx={6} fill={SCH.line} />
      </g>
    ) : null}
  </g>
);
export const S11: React.FC<ShotProps> = ({ t, len }) => <Bars t={t} len={len} focus={0} />;
export const S12: React.FC<ShotProps> = ({ t, len }) => <Bars t={t} len={len} focus={1} />;
export const S13: React.FC<ShotProps> = ({ t, len }) => <Bars t={t} len={len} focus={2} />;

// ---------- S14: extreme close-up: MC, serious: "Itu nyata." ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.2 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 700 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.15, look: 0.2, headTilt: kf(t, [[0, 0], [8, 4], [14, 0]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'neutral']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -600) scale(2)">
          <Study t={t + 120} id="st14" night />
        </g>
      </g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#07040C" opacity={0.25} />
      <Hero look={MC} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S15, S16: the calendar: the forwarded date circled; then stamped out ----------
const Calendar: React.FC<{ t: number; stamp: number }> = ({ t, stamp }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#14101C" />
    <Glow x={960} y={400} r={800} o={0.25} />
    <rect x={560} y={60} width={800} height={900} rx={30} fill="#EFE6D2" />
    <rect x={560} y={60} width={800} height={160} rx={30} fill="#C0392B" />
    <rect x={560} y={180} width={800} height={40} fill="#C0392B" />
    <text x={960} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#F6EFE3">
      MINGGU INI
    </text>
    {Array.from({ length: 35 }).map((_, i) => {
      const c = i % 7;
      const r = Math.floor(i / 7);
      return (
        <text key={i} x={620 + c * 112} y={320 + r * 130} fontFamily={FONT.ui} fontSize={44} fill="#3A3446" opacity={i < 30 ? 1 : 0.3}>
          {(i % 30) + 1}
        </text>
      );
    })}
    {/* the day the message named, circled, a question mark beside it */}
    <circle cx={1012} cy={565} r={70} fill="none" stroke="#C0392B" strokeWidth={10} strokeDasharray={440} strokeDashoffset={440 * (1 - clamp((t - 2) / 10))} />
    <text x={1110} y={530} fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#C0392B" opacity={clamp((t - 8) / 4)}>
      ?
    </text>
    {stamp > 0 ? (
      <g transform={`translate(960 560) rotate(-12) scale(${(1.6 - 0.6 * backOut(clamp(stamp))) * 0.85})`} opacity={clamp(stamp * 3)}>
        <rect x={-400} y={-110} width={800} height={220} rx={20} fill="#EFE6D2" fillOpacity={0.85} stroke="#E4382A" strokeWidth={16} />
        <text y={-6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#E4382A">
          TIDAK ADA
        </text>
        <text y={84} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#E4382A">
          DALILNYA
        </text>
      </g>
    ) : null}
  </g>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${2 - t * 0.04}) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
    <Calendar t={t} stamp={0} />
  </g>
);
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 560) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -560)`}>
    <Calendar t={40} stamp={(t - 22) / 6} />
  </g>
);

// ---------- S17: wide, the living room at night: the family on the sofa, the TV's flicker on them ----------
const SIT_MC = sofaSit(0.48);
const SIT_SIS = sofaSit(0.33);
const SIT_IBU = sofaSit(0.62);
const sat = (p: { x: number; y: number; scale: number }, k = 1, extra: Partial<Pose> = {}): Partial<Pose> => ({
  x: p.x, y: p.y + (1 - k) * 60 * p.scale, scale: p.scale * k, armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 }, ...extra,
});
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
    <LivingRoom t={t + 10} id="lv17" />
    <Hero look={IBU} pose={{ ...basePose, ...sat(SIT_IBU, 1, { yaw: -0.1, look: 0 }), ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0} />
    <Hero look={MC} pose={{ ...basePose, ...sat(SIT_MC, 1, { yaw: 0, look: 0.1 }), ...faceAt(t, [[0, 'neutral'], [40, 'worried']]) }} rimId="rimBlue" shadow={0} />
    <Hero look={SIS} pose={{ ...basePose, ...sat(SIT_SIS, 0.72, { yaw: 0.1, look: 0.2 }), ...faceAt(t, [[0, 'neutral']]) }} rimId="rimBlue" shadow={0} />
    <SofaFront />
    <CoffeeTable />
    <Foreground blur={10}>
      <path d="M -40 1100 L -40 860 Q 200 820 420 900 L 480 1100 Z" fill="#0E0C16" />
    </Foreground>
  </g>
);

// ---------- S18: the TV: a smiling man in a suit, half his face in shadow, arms opening ----------
const TVFrame: React.FC<{ children: React.ReactNode; t: number; glitch?: number }> = ({ children, t, glitch = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0810" />
    <defs>
      <clipPath id="tvclip">
        <rect x={500} y={-120} width={920} height={1320} rx={20} />
      </clipPath>
    </defs>
    <rect x={480} y={-140} width={960} height={1360} rx={34} fill="#141218" stroke="#2A2632" strokeWidth={8} />
    <g clipPath="url(#tvclip)">
      <g transform={glitch > 0 ? `translate(${Math.sin(t * 7.1) * 30 * glitch} 0)` : undefined}>{children}</g>
      {/* scanlines and a little glare */}
      {Array.from({ length: 66 }).map((_, i) => (
        <rect key={i} x={500} y={-120 + i * 20} width={920} height={3} fill="#000" opacity={0.18} />
      ))}
      {glitch > 0
        ? Array.from({ length: 6 }).map((_, i) => (
            <rect key={`g${i}`} x={500} y={-120 + rnd(Math.floor(t), i) * 1320} width={920} height={20 + rnd(Math.floor(t) + 3, i) * 60} fill={i % 2 ? '#FF3A5A' : '#3AE0FF'} opacity={0.35 * glitch} style={{ mixBlendMode: 'screen' }} />
          ))
        : null}
      <path d="M 520 -100 L 900 -100 L 520 400 Z" fill="#FFFFFF" opacity={0.04} />
    </g>
    <Glow x={960} y={540} r={900} kind="cool" o={0.18} />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.6;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 820, scale: sc, yaw: 0, look: 0, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 8, p: {} },
    { f: 18, p: { armL: { a: 70, b: 10 }, armR: { a: 70, b: 10 } }, ease: easeOut },
    { f: 22, p: { armL: { a: 66, b: 12 }, armR: { a: 66, b: 12 } } },
  ]);
  const head = { x: 960, y: 820 + HEAD.y * sc };
  const heaven = clamp((t - 46) / 10);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <TVFrame t={t}>
        <rect x={500} y={-120} width={920} height={1320} fill="#2A1420" />
        <Glow x={960} y={300} r={700} kind="red" o={0.5} />
        <Glow x={960} y={300} r={700} o={0.6 * heaven} />
        <Hero look={SUIT} pose={{ ...pose, expr: 'smug', look: 0 }} rimId="rimR" shadow={0} />
        {/* half his face in shadow: one eye is never seen */}
        <path d={`M ${head.x + 6} ${head.y - HEAD.r * sc - 10} A ${HEAD.r * sc + 10} ${HEAD.r * sc + 10} 0 0 1 ${head.x + 6} ${head.y + HEAD.r * sc + 10} Z`} fill="#050308" opacity={0.82} />
        {/* the lower third: LIVE */}
        <rect x={610} y={1000} width={330} height={70} rx={10} fill="#C0392B" />
        <text x={775} y={1048} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">
          SIARAN LANGSUNG
        </text>
      </TVFrame>
    </g>
  );
};

// ---------- S19: the TV: his paradise (a green garden) glitches into fire ----------
const Garden: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={500} y={-120} width={920} height={1320} fill="#9ED8C8" />
    <rect x={500} y={-120} width={920} height={600} fill="#CFEFE2" />
    <circle cx={1180} cy={120} r={110} fill="#FFF3C8" opacity={0.9} />
    <path d="M 500 560 Q 760 420 1000 520 Q 1220 600 1420 480 L 1420 1200 L 500 1200 Z" fill="#5FB07A" />
    <path d="M 500 760 Q 820 640 1100 760 Q 1300 840 1420 760 L 1420 1200 L 500 1200 Z" fill="#3E8C5A" />
    {[[640, 640], [820, 600], [1260, 620], [1080, 700]].map(([x, y], i) => (
      <g key={i} transform={`rotate(${Math.sin(t / 10 + i) * 2} ${x} ${y})`}>
        <rect x={x - 10} y={y - 20} width={20} height={120} fill="#5A3A2A" />
        <circle cx={x} cy={y - 60} r={80} fill="#2E7A4A" />
        <circle cx={x - 30} cy={y - 90} r={50} fill="#4AA06A" />
      </g>
    ))}
    <ellipse cx={960} cy={980} rx={240} ry={60} fill="#7FD4FF" opacity={0.8} />
  </g>
);
const Fire: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={500} y={-120} width={920} height={1320} fill="#2A0808" />
    <Glow x={960} y={900} r={900} kind="red" o={0.9} />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 520 + i * 68;
      const h = 380 + rnd(9, i) * 380 + Math.sin(t / 2 + i) * 80;
      return <path key={i} d={`M ${x - 60} 1200 Q ${x - 40} ${1200 - h * 0.5} ${x} ${1200 - h} Q ${x + 40} ${1200 - h * 0.5} ${x + 60} 1200 Z`} fill={i % 2 ? '#FF6A2A' : '#FFB43A'} opacity={0.85} />;
    })}
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 540 + i * 92;
      const h = 220 + rnd(11, i) * 200 + Math.sin(t / 1.6 + i * 2) * 50;
      return <path key={`b${i}`} d={`M ${x - 30} 1200 Q ${x - 20} ${1200 - h * 0.5} ${x} ${1200 - h} Q ${x + 20} ${1200 - h * 0.5} ${x + 30} 1200 Z`} fill="#FFE27A" opacity={0.8} />;
    })}
  </g>
);
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const flip = 92; // just after "neraka"
  const g = t >= flip - 6 && t < flip + 10 ? 1 - Math.abs(t - flip) / 10 : 0;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.02], [len, 1.1]])}) translate(-960 -540)`}>
      <TVFrame t={t} glitch={g}>{t < flip ? <Garden t={t} /> : <Fire t={t} />}</TVFrame>
      <Tag x={960} y={1300} t={t - 16} text="HR. BUKHARI 3338" w={560} />
    </g>
  );
};

// ---------- S20: medium, the living room: his little sister tugs at his hoodie ----------
const SIS_STAND = stand(LIVING, 0.36, 0.34);
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const sisBase: Pose = { ...basePose, x: SIS_STAND.x, y: SIS_STAND.y + LEG_LEN * SIS_STAND.scale * 0.3, scale: SIS_STAND.scale * 0.7, yaw: 0.5, look: 0.8 };
  const grab = reachAngle(sisBase, { x: SIT_MC.x - 30, y: SIT_MC.y - 60 * SIT_MC.scale });
  const sis = poseAt(t, [
    { f: 0, p: { ...sisBase, armR: { a: 20, b: 20 }, armL: { a: 14, b: -6 } } },
    { f: 6, p: { armR: { a: grab, b: 0 } }, ease: easeOut },
    { f: 10, p: { armR: { a: grab - 6, b: 6 }, tilt: -3 } },
    { f: 14, p: { armR: { a: grab, b: 0 }, tilt: 0 } },
  ]);
  const mc = poseAt(t, [
    { f: 0, p: { ...sat(SIT_MC, 1, { yaw: 0.1, look: 0.3 }) } },
    { f: 10, p: {} },
    { f: 16, p: { yaw: -0.4, look: -0.8, headTilt: -8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 905]]), 560, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <LivingRoom t={t + 100} id="lv20" tv={0.8} />
      <Hero look={MC} pose={{ ...basePose, ...mc, ...faceAt(t, [[0, 'worried'], [14, 'neutral']]) }} rimId="rimBlue" shadow={0} />
      <SofaFront />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0.6} />
    </g>
  );
};

// ---------- S21: close-up: sis, scared ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.4 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 620 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.7, headTilt: kf(t, [[0, 4], [len, 8]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried']]), sway: Math.sin(t / 3) * 4 };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-800 -540) scale(2)">
          <LivingRoom t={t + 150} id="lv21" />
        </g>
      </g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#07040C" opacity={0.2} />
      <Hero look={SIS} pose={pose} rimId="rimBlue" shadow={0} />
    </g>
  );
};

// ---------- S22: two-shot on the sofa: MC with the closed mushaf on his lap, teaching her ----------
const Mushaf: React.FC<{ x: number; y: number; w: number; rot?: number }> = ({ x, y, w, rot = 0 }) => {
  const h = w * 0.72;
  const star = (r: number) =>
    Array.from({ length: 16 })
      .map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const k = i % 2 ? r * 0.62 : r;
        return `${Math.cos(a) * k},${Math.sin(a) * k}`;
      })
      .join(' ');
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + w * 0.02} y={-h / 2 + w * 0.03} width={w} height={h} rx={w * 0.03} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.03} fill="#1F5A44" stroke="#C9A44A" strokeWidth={w * 0.012} />
      <rect x={-w / 2 + w * 0.06} y={-h / 2 + w * 0.06} width={w - w * 0.12} height={h - w * 0.12} rx={w * 0.02} fill="none" stroke="#C9A44A" strokeWidth={w * 0.008} />
      <polygon points={star(w * 0.18)} fill="#C9A44A" />
      <polygon points={star(w * 0.11)} fill="#1F5A44" />
      <circle r={w * 0.04} fill="#E9C46A" />
      <path d={`M ${-w / 2 + w * 0.02} ${-h / 2 + w * 0.05} L ${-w / 2 + w * 0.02} ${h / 2 - w * 0.05}`} stroke="#E9C46A" strokeWidth={w * 0.01} opacity={0.6} />
    </g>
  );
};
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const mc = sat(SIT_MC, 1, { yaw: -0.35, look: -0.7, headTilt: -10, armL: { a: 40, b: 70 }, armR: { a: 40, b: 70 } });
  const sis = sat(sofaSit(0.39), 0.72, { yaw: 0.4, look: 0.7, headTilt: 6 });
  const lap = { x: SIT_MC.x, y: SIT_MC.y - 20 * SIT_MC.scale };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 910]]), kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1.9], [len, 2.05]]))}>
      <LivingRoom t={t + 200} id="lv22" tv={0.25} />
      <Hero look={SIS} pose={{ ...basePose, ...sis, ...faceAt(t, [[0, 'worried'], [50, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Hero look={MC} pose={{ ...basePose, ...mc, ...faceAt(t, [[0, 'neutral']]), blink: Math.floor(t / 40) % 2 && t % 40 < 4 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <SofaFront />
      <Mushaf x={lap.x} y={lap.y} w={120 * SIT_MC.scale} rot={-6} />
      <Glow x={lap.x} y={lap.y} r={220} o={0.35} />
    </g>
  );
};

// ---------- S23: macro insert: the mushaf, green and gold; tag AL-KAHFI 1-10 ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${-2 + t * 0.05}) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#2A2232" />
    <Glow x={960} y={380} r={900} o={0.45} />
    <Mushaf x={960} y={560} w={760} rot={-4} />
    <Arm hand={{ x: 600, y: 800 }} from={{ x: 180, y: 1500 }} rot={150} s={5} open />
    <Arm hand={{ x: 1320, y: 780 }} from={{ x: 1760, y: 1500 }} rot={-150} s={5} open />
    <Dust t={t + 30} seed={53} x0={500} y0={100} w={900} h={600} n={16} o={0.5} />
    <Tag x={960} y={1150} t={t - 6} text="AL-KAHFI 1-10" w={520} />
  </g>
);

// ---------- S24: wide, the roof at dawn: the sun rises over the city ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const mc = poseAt(t, [{ f: 0, p: { ...roofPose(900, 0.62), yaw: 0.45, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.0], [len, 1.05]]))}>
      <Rooftop t={t + 300} sunX={1120} sunY={kf(t, [[0, 820], [len, 700]], easeOut)} />
      <Hero look={MC} pose={{ ...mc, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- S25: wide, time-lapse: the clouds and birds race through the day, the sun stays ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const mc = poseAt(t, [
    { f: 0, p: { ...roofPose(900, 0.62), yaw: 0.45, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 20, p: { yaw: -0.2, look: -0.6 } },
    { f: 36, p: { yaw: 0.45, look: 0.9, headTilt: -6 } },
  ]);
  return (
    <g transform={camT(960, 530, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Rooftop t={300 + t * 14} sunX={1120} sunY={700} />
      <Hero look={MC} pose={{ ...mc, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- S26: extreme close-up: MC stares at the sun; BERSAMBUNG ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 5.6 * (1 + 0.05 * clamp(t / len));
  const head = { x: 920, y: 640 };
  const red = 0.4 * clamp(t / len);
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.35, look: 0.8, headTilt: -6, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'shock']]) };
  const card = backOut(clamp((t - 12) / 9));
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -560) scale(2)">
          <Rooftop t={400} sunX={1120} sunY={700} red={red} low={180} />
        </g>
      </g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#07040C" opacity={0.2} />
      <Hero look={MC} pose={pose} rimId={t > len * 0.5 ? 'rimRed' : 'rimR'} shadow={0} />
      <g transform={`translate(960 1120) scale(${card})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFE27A" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">
          BERSAMBUNG
        </text>
        <text y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3" stroke="#1A1230" strokeWidth={6} paintOrder="stroke">
          EPISODE 2 SEGERA
        </text>
      </g>
    </g>
  );
};

// ---------- the 9:16 frame: where each shot's vertical crop sits (screen x, y, zoom) ----------
export const FRAME = {
  S1: { x: 860, y: 560, z: 0.8 },
  S2: { x: 960, y: 560, z: 0.95 },
  S3: { x: 960, y: 560, z: 0.78 },
  S4: { x: 960, y: 600, z: 0.85 },
  S5: { x: 960, y: 480, z: 0.6 },
  S6: { x: 1020, y: 520, z: 0.75 },
  S7: { x: 980, y: 540, z: 0.7 },
  S8: { x: 960, y: 560, z: 0.9 },
  S9: { x: 960, y: 560, z: 0.7 },
  S10: { x: 960, y: 440, z: 0.62 },
  S11: { x: 960, y: 420, z: 0.62 },
  S12: { x: 960, y: 420, z: 0.62 },
  S13: { x: 960, y: 420, z: 0.62 },
  S14: { x: 960, y: 560, z: 0.75 },
  S15: { x: 960, y: 520, z: 0.62 },
  S16: { x: 960, y: 540, z: 0.62 },
  S17: { x: 960, y: 560, z: 0.65 },
  S18: { x: 960, y: 540, z: 0.75 },
  S19: { x: 960, y: 560, z: 0.72 },
  S20: { x: 900, y: 600, z: 0.85 },
  S21: { x: 960, y: 560, z: 0.95 },
  S22: { x: 900, y: 600, z: 0.85 },
  S23: { x: 960, y: 620, z: 0.65 },
  S24: { x: 1000, y: 520, z: 0.75 },
  S25: { x: 1000, y: 520, z: 0.75 },
  S26: { x: 940, y: 600, z: 0.7 },
};

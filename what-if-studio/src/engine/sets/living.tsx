import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { Glow, LightVeil, Dust, Cone } from '../light';
import { RoomShell, BackWindow, WallFrame, FloorShadow, FloorPlant, WallClock } from '../furnish';

// The living room at night, built with the room kit for the series: a sofa against the back wall where the family sits
// facing camera, the TV off screen toward us (its cool flicker is the key light on their faces), a night window behind
// the sofa, a floor lamp on the left, shelves, a wall clock, a plant, a rug and a low coffee table in front.
// Characters on the sofa: draw <LivingRoom />, the characters at sofaSit(u), then <SofaFront /> and <CoffeeTable />.
export const LIVING = makeRoom({ x: 960, y: 480 }, { x0: 470, x1: 1450, y0: 300, y1: 760 }, 3.4);

const SOFA = { u0: 0.2, u1: 0.72, seat: 0.8, back: 0.56, w0: 0.02, w1: 0.2 };
const FLOOR_LAMP = { u: 0.08, w: 0.16 };

/** Hip point and scale for someone sitting on the sofa at u (0.25 to 0.68): hips on the seat, legs hidden by its front. */
export const sofaSit = (u: number, k = 0.62) => {
  const p = LIVING.P(u, SOFA.seat - 0.02, 0.12);
  const scale = (k * 0.92 * (LIVING.back.y1 - LIVING.back.y0) * LIVING.s(0.12)) / 378;
  return { x: p.x, y: p.y + 6 * scale, scale };
};
/** Where the floor lamp's bulb is. */
export const livingLamp = () => {
  const p = LIVING.P(FLOOR_LAMP.u, 1, FLOOR_LAMP.w);
  const s = LIVING.s(FLOOR_LAMP.w);
  return { x: p.x, y: p.y - 300 * s };
};

/** The sofa's seat front and arms: drawn after the characters, it hides their legs. */
export const SofaFront: React.FC = () => {
  const r = LIVING;
  return (
    <g>
      <Box r={r} u={[SOFA.u0 + 0.02, SOFA.u1 - 0.02]} v={[SOFA.seat, 0.9]} w={[SOFA.w1 - 0.02, SOFA.w1]} front="#4A3E5A" top="#5A4C6C" />
      <Box r={r} u={[SOFA.u0 + 0.02, SOFA.u1 - 0.02]} v={[0.9, 1]} w={[SOFA.w1 - 0.03, SOFA.w1 - 0.01]} front="#3A3048" />
      {/* the two arms */}
      <Box r={r} u={[SOFA.u0, SOFA.u0 + 0.05]} v={[0.7, 1]} w={[SOFA.w0, SOFA.w1 + 0.01]} front="#54466A" top="#64547C" side="#433858" rim />
      <Box r={r} u={[SOFA.u1 - 0.05, SOFA.u1]} v={[0.7, 1]} w={[SOFA.w0, SOFA.w1 + 0.01]} front="#54466A" top="#64547C" side="#433858" rim />
      {/* the seam between the two cushions */}
      {(() => {
        const a = r.P(0.46, SOFA.seat, SOFA.w1);
        const b = r.P(0.46, 0.9, SOFA.w1);
        return <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#3A3048" strokeWidth={3} />;
      })()}
    </g>
  );
};

/** The low coffee table in front of the sofa, with a glass, a bowl and a remote. */
export const CoffeeTable: React.FC = () => {
  const r = LIVING;
  const top = 0.86;
  const g = r.P(0.36, top, 0.42);
  const b = r.P(0.52, top, 0.4);
  const rm = r.P(0.6, top, 0.44);
  const k = r.s(0.42);
  return (
    <g>
      <FloorShadow r={r} u={[0.28, 0.66]} w={[0.34, 0.48]} o={0.4} />
      <Box r={r} u={[0.28, 0.66]} v={[top, top + 0.025]} w={[0.34, 0.48]} front="#4A3630" top="#6A4E44" side="#3A2A26" rim />
      {[[0.3, 0.36], [0.64, 0.36], [0.3, 0.46], [0.64, 0.46]].map(([u, w], i) => (
        <Box key={i} r={r} u={[u - 0.008, u + 0.008]} v={[top + 0.025, 1]} w={[w - 0.01, w]} front="#2E221E" />
      ))}
      <path d={`M ${g.x - 9 * k} ${g.y - 30 * k} L ${g.x + 9 * k} ${g.y - 30 * k} L ${g.x + 7 * k} ${g.y} L ${g.x - 7 * k} ${g.y} Z`} fill="#BFD6FF" opacity={0.5} />
      <ellipse cx={b.x} cy={b.y - 8 * k} rx={34 * k} ry={10 * k} fill="#C96A4A" />
      <path d={`M ${b.x - 34 * k} ${b.y - 8 * k} Q ${b.x} ${b.y + 18 * k} ${b.x + 34 * k} ${b.y - 8 * k}`} fill="#A8523A" />
      {[-12, 2, 14].map((dx, i) => (
        <circle key={i} cx={b.x + dx * k} cy={b.y - 14 * k} r={9 * k} fill={i === 1 ? '#E9C46A' : '#D9534F'} />
      ))}
      <rect x={rm.x - 26 * k} y={rm.y - 8 * k} width={52 * k} height={12 * k} rx={5 * k} fill="#1E1C24" transform={`rotate(-8 ${rm.x} ${rm.y})`} />
    </g>
  );
};

/** The living room at night. `tv` (0..1) is how bright the off-screen TV's flicker is; `lamp` the floor lamp. */
export const LivingRoom: React.FC<{ t: number; id?: string; veil?: number; tv?: number; lamp?: number; red?: number }> = ({ t, id = 'liv', veil = 0.45, tv = 1, lamp = 1, red = 0 }) => {
  const r = LIVING;
  const { P, Q } = r;
  const L = livingLamp();
  const flick = tv * (0.75 + 0.25 * Math.sin(t / 2.3) * Math.sin(t / 5.1 + 1) + 0.1 * (rnd(7, Math.floor(t / 3)) - 0.5));
  return (
    <g>
      <RoomShell r={r} id={id} floor="boards" wall="#3E3A50" side="#322E42" floorC="#2C2230" ceiling="#1A1726" lines="#221B26" />
      {/* the window behind the sofa: night, the moon, the lit city */}
      <BackWindow r={r} id={`${id}w`} t={t} x0={900} x1={1260} y0={350} y1={540} sun={{ x: 1180, y: 400 }} cols={3} night red={red} />
      {/* framed pictures and a wall clock on the back wall, left of the window */}
      <WallFrame x={560} y={380} w={130} h={96} art={0} />
      <WallFrame x={720} y={370} w={86} h={110} art={2} />
      <WallClock x={P(0.86, 0.14, 0).x} y={P(0.86, 0.14, 0).y} r={26} t={t} />
      {/* shelves on the left wall with books and a radio */}
      <Box r={r} u={[0, 0.02]} v={[0.34, 0.36]} w={[0.2, 0.5]} front="#5B4038" side="#4A322C" top="#6A4C42" />
      <Box r={r} u={[0, 0.02]} v={[0.5, 0.52]} w={[0.2, 0.5]} front="#5B4038" side="#4A322C" top="#6A4C42" />
      {Array.from({ length: 9 }).map((_, i) => {
        const w = 0.22 + i * 0.03;
        const a = P(0.005, 0.34, w);
        const b = P(0.005, 0.34, w + 0.022);
        const h = (60 + rnd(31, i) * 30) * r.s(w) * 0.6;
        return <polygon key={`bk${i}`} points={`${a.x},${a.y} ${b.x},${b.y} ${b.x},${b.y - h} ${a.x},${a.y - h}`} fill={['#8A4A40', '#3E6E58', '#C9A44A', '#4A5A8A', '#7A5A6A'][i % 5]} />;
      })}
      {/* the sofa's back and seat (its front and arms come after the characters) */}
      <FloorShadow r={r} u={[SOFA.u0, SOFA.u1]} w={[SOFA.w0, SOFA.w1 + 0.02]} o={0.45} />
      <Box r={r} u={[SOFA.u0 + 0.02, SOFA.u1 - 0.02]} v={[SOFA.back, SOFA.seat]} w={[SOFA.w0, SOFA.w0 + 0.05]} front="#54466A" top="#64547C" rim />
      {[0.27, 0.6].map((u, i) => {
        const a = P(u, SOFA.back + 0.04, SOFA.w0 + 0.06);
        const s = r.s(0.08);
        return <rect key={`cu${i}`} x={a.x - 50 * s} y={a.y} width={100 * s} height={70 * s} rx={16 * s} fill={i ? '#C9A44A' : '#3E6E6A'} transform={`rotate(${i ? 8 : -8} ${a.x} ${a.y + 35 * s})`} />;
      })}
      <polygon points={Q([[SOFA.u0 + 0.02, SOFA.seat, SOFA.w0 + 0.05], [SOFA.u1 - 0.02, SOFA.seat, SOFA.w0 + 0.05], [SOFA.u1 - 0.02, SOFA.seat, SOFA.w1 - 0.02], [SOFA.u0 + 0.02, SOFA.seat, SOFA.w1 - 0.02]])} fill="#5E5076" />
      {/* the floor lamp on the left and a plant on the right */}
      {(() => {
        const b = P(FLOOR_LAMP.u, 1, FLOOR_LAMP.w);
        const s = r.s(FLOOR_LAMP.w);
        return (
          <g>
            <ellipse cx={b.x} cy={b.y} rx={34 * s} ry={8 * s} fill="#1E1824" />
            <path d={`M ${b.x} ${b.y} L ${b.x} ${L.y + 20 * s}`} stroke="#1E1824" strokeWidth={6 * s} />
            <path d={`M ${L.x - 34 * s} ${L.y - 30 * s} L ${L.x + 34 * s} ${L.y - 30 * s} L ${L.x + 48 * s} ${L.y + 24 * s} L ${L.x - 48 * s} ${L.y + 24 * s} Z`} fill={lamp > 0.3 ? '#F2D2A0' : '#6A5A50'} />
            <Cone d={`M ${L.x - 46 * s} ${L.y + 24 * s} L ${L.x + 46 * s} ${L.y + 24 * s} L ${L.x + 200 * s} ${b.y} L ${L.x - 200 * s} ${b.y} Z`} o={0.5 * lamp} />
          </g>
        );
      })()}
      <FloorPlant r={r} u={0.86} w={0.2} size={1.1} />
      {/* the rug */}
      <polygon points={Q([[0.18, 1, 0.26], [0.78, 1, 0.26], [0.82, 1, 0.62], [0.14, 1, 0.62]])} fill="#5A3A44" />
      <polygon points={Q([[0.21, 1, 0.29], [0.75, 1, 0.29], [0.78, 1, 0.59], [0.17, 1, 0.59]])} fill="none" stroke="#7A5260" strokeWidth={5} />
      {/* contrast pass, then the lights on top */}
      <LightVeil id={`${id}veil`} lights={[[L.x, L.y + 20, 420 * lamp + 60], [1080, 445, 260], [960, 760, 520 * (0.4 + 0.6 * tv)]]} o={veil} />
      <Glow x={L.x} y={L.y} r={260} o={0.55 * lamp} />
      <Glow x={L.x} y={L.y + 6} r={90} o={0.5 * lamp} />
      {/* the TV's flicker from camera: a cool wash over the sofa */}
      <Glow x={960} y={700} r={620} kind="cool" o={0.32 * flick} />
      <Glow x={1180} y={400} r={140} kind="cool" o={0.25} />
      <Dust t={t} seed={23} x0={L.x - 160} y0={L.y} w={320} h={300} n={12} o={0.35 * lamp} />
      <path d={`M ${P(0, 0.08, 0).x} ${P(0, 0.08, 0).y} L ${P(1, 0.08, 0).x} ${P(1, 0.08, 0).y}`} stroke={S3.trim} strokeWidth={2} opacity={0.4} />
    </g>
  );
};

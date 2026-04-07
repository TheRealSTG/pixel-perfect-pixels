import React from "react";

interface FlowerProps {
  color?: string;
  accentColor?: string;
  scale?: number;
  rotation?: number;
  x?: number;
  y?: number;
  style?: "flat" | "botanical" | "pixel";
}

// Helper: darken/lighten a hex color
const shadeColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

/* ─── Rose ──────────────────────────────────────────── */
export const Rose: React.FC<FlowerProps> = ({
  color = "#E8A0B4", accentColor = "#D4708A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const id = `rose-${x}-${y}`;
  const dark = shadeColor(color, -30);
  const light = shadeColor(color, 40);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-2" y="10" width="4" height="20" fill="#5A8A5A" />
          {[[-8,-8],[-4,-12],[0,-12],[4,-8],[-4,-8],[0,-8],[-8,-4],[-4,-4],[0,-4],[4,-4],[-4,0],[0,0],[4,0],[0,4]].map(([px,py],i) => (
            <rect key={i} x={px} y={py} width="4" height="4" fill={(Math.abs(px!)+Math.abs(py!)) < 8 ? accentColor : color} />
          ))}
        </>
      ) : (
        <>
          <defs>
            <radialGradient id={`${id}-g`} cx="40%" cy="35%">
              <stop offset="0%" stopColor={light} />
              <stop offset="60%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
            <radialGradient id={`${id}-inner`} cx="50%" cy="40%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={shadeColor(accentColor, -25)} />
            </radialGradient>
          </defs>
          {/* Stem with natural curve */}
          <path d="M 0 8 Q -2 18, 1 28 Q 3 36, 0 42" stroke="#4A7A4A" strokeWidth={style === "botanical" ? 1.5 : 2.2} fill="none" strokeLinecap="round" />
          {/* Thorns */}
          <path d="M 0 20 L -3 17 L -1 19" fill="#4A7A4A" />
          <path d="M 1 30 L 4 27 L 2 29" fill="#4A7A4A" />
          {/* Leaves with veins */}
          <path d="M -1 22 Q -12 16, -8 8 Q -4 14, -1 22" fill="#6BA06B" opacity={0.85} />
          <path d="M -5 15 Q -8 12, -7 10" stroke="#4A7A4A" strokeWidth={0.4} fill="none" opacity={0.5} />
          <path d="M 2 32 Q 12 26, 10 18 Q 6 24, 2 32" fill="#7BAF7B" opacity={0.75} />
          <path d="M 6 25 Q 9 22, 9 20" stroke="#4A7A4A" strokeWidth={0.4} fill="none" opacity={0.5} />
          {/* Outer petals — curved, overlapping */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <path key={angle}
              d={`M 0 0 Q ${-5 - i % 2} ${-8} , ${-3} ${-13} Q 0 ${-15 - i % 2}, 3 ${-13} Q ${5 + i % 2} ${-8}, 0 0`}
              fill={`url(#${id}-g)`}
              transform={`rotate(${angle}, 0, 0)`} opacity={0.82}
              stroke={style === "botanical" ? dark : "none"} strokeWidth={0.5} />
          ))}
          {/* Mid petals — tighter curl */}
          {[36, 108, 180, 252, 324].map((angle) => (
            <path key={angle}
              d={`M 0 0 Q -3.5 -5, -2 -9 Q 0 -11, 2 -9 Q 3.5 -5, 0 0`}
              fill={`url(#${id}-inner)`}
              transform={`rotate(${angle}, 0, 0)`} opacity={0.85} />
          ))}
          {/* Center spiral */}
          <path d="M -1.5 -1 Q -2 -3.5, 0 -4.5 Q 2 -3.5, 1.5 -1 Q 0.5 0.5, -1.5 -1" fill={accentColor} opacity={0.9} />
          <path d="M -0.5 -1 Q -0.8 -2.5, 0 -3 Q 0.8 -2.5, 0.5 -1 Z" fill={dark} opacity={0.6} />
          {/* Highlight */}
          <ellipse cx="-2" cy="-5" rx="1.5" ry="2.5" fill="white" opacity={0.12} transform="rotate(-20, -2, -5)" />
        </>
      )}
    </g>
  );
};

/* ─── Peony ──────────────────────────────────────────── */
export const Peony: React.FC<FlowerProps> = ({
  color = "#F5E1E8", accentColor = "#E8C4D0",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const id = `peony-${x}-${y}`;
  const dark = shadeColor(color, -20);
  const light = shadeColor(color, 30);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-2" y="10" width="4" height="20" fill="#5A8A5A" />
          {[[-8,-8],[-4,-12],[0,-12],[4,-8],[-8,-4],[-4,-8],[0,-8],[4,-4],[-8,0],[-4,-4],[0,-4],[4,0],[-4,0],[0,0],[4,4],[0,4]].map(([px,py],i) => (
            <rect key={i} x={px} y={py} width="4" height="4"
              fill={(Math.abs(px!)+Math.abs(py!)) < 8 ? accentColor : color} />
          ))}
        </>
      ) : (
        <>
          <defs>
            <radialGradient id={`${id}-g`} cx="45%" cy="40%">
              <stop offset="0%" stopColor={light} />
              <stop offset="55%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          <path d="M 0 12 Q -2 24, 1 34 Q 2 40, 0 44" stroke="#4A7A4A" strokeWidth={style === "botanical" ? 1.8 : 2.8} fill="none" strokeLinecap="round" />
          <path d="M -1 26 Q -14 18, -10 10 Q -6 16, -1 26" fill="#6BA06B" opacity={0.75} />
          <path d="M -7 18 Q -10 14, -9 12" stroke="#3A6A3A" strokeWidth={0.3} fill="none" opacity={0.5} />
          {/* Outer ruffled petals */}
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
            <path key={`o-${angle}`}
              d={`M 0 0 Q ${-6 - i % 3} ${-6}, ${-5} ${-12 - i % 2} Q ${-1} ${-15}, 0 ${-14} Q 1 ${-15}, 5 ${-12 - i % 2} Q ${6 + i % 3} ${-6}, 0 0`}
              fill={`url(#${id}-g)`}
              transform={`rotate(${angle}, 0, 0)`} opacity={0.58}
              stroke={style === "botanical" ? dark : "none"} strokeWidth={0.35} />
          ))}
          {/* Inner ruffled petals */}
          {[20, 65, 110, 155, 200, 245, 290, 335].map((angle) => (
            <path key={`i-${angle}`}
              d={`M 0 0 Q -3.5 -3.5, -3 -7.5 Q 0 -9.5, 3 -7.5 Q 3.5 -3.5, 0 0`}
              fill={accentColor} transform={`rotate(${angle}, 0, 0)`} opacity={0.7}
              stroke={style === "botanical" ? shadeColor(accentColor, -20) : "none"} strokeWidth={0.25} />
          ))}
          {/* Tight center */}
          {[0, 90, 180, 270].map((a) => (
            <path key={`c-${a}`}
              d={`M 0 0 Q -1.5 -1.5, -1 -4 Q 0 -5, 1 -4 Q 1.5 -1.5, 0 0`}
              fill={color} transform={`rotate(${a}, 0, 0)`} opacity={0.9} />
          ))}
          <circle cx="0" cy="-0.5" r="2" fill="#F0D8A8" opacity={0.45} />
          <ellipse cx="1.5" cy="-4" rx="1" ry="2" fill="white" opacity={0.1} transform="rotate(-15, 1.5, -4)" />
        </>
      )}
    </g>
  );
};

/* ─── Tulip ──────────────────────────────────────────── */
export const Tulip: React.FC<FlowerProps> = ({
  color = "#E06080", accentColor = "#C84060",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const id = `tulip-${x}-${y}`;
  const dark = shadeColor(color, -30);
  const light = shadeColor(color, 35);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-2" y="8" width="4" height="24" fill="#5A8A5A" />
          {[[-6,-8],[-2,-12],[2,-8],[-6,-4],[-2,-8],[2,-4],[-2,-4],[-2,0]].map(([px,py],i)=>(
            <rect key={i} x={px} y={py} width="4" height="4" fill={i<3?color:accentColor} />
          ))}
        </>
      ) : (
        <>
          <defs>
            <linearGradient id={`${id}-g`} x1="0" y1="1" x2="0.3" y2="0">
              <stop offset="0%" stopColor={dark} />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor={light} />
            </linearGradient>
          </defs>
          <path d="M 0 8 Q -1 20, 1 35 Q 2 42, 0 46" stroke="#4A7A4A" strokeWidth={style === "botanical" ? 1.5 : 2.5} fill="none" strokeLinecap="round" />
          {/* Long curved leaf */}
          <path d="M 0 35 Q -16 22, -10 10 Q -6 18, 0 35" fill="#5A8A5A" opacity={0.75} />
          <path d="M -8 22 Q -12 16, -10 12" stroke="#3A6A3A" strokeWidth={0.4} fill="none" opacity={0.4} />
          <path d="M 0 42 Q 14 30, 11 18 Q 7 26, 0 42" fill="#6BA06B" opacity={0.65} />
          {/* Left petal */}
          <path d={`M -7 4 Q -10 -4, -6 -12 Q -3 -16, 0 -14 L 0 6 Q -3 6, -7 4`}
            fill={`url(#${id}-g)`} stroke={style === "botanical" ? dark : "none"} strokeWidth={0.5} />
          {/* Right petal */}
          <path d={`M 7 4 Q 10 -4, 6 -12 Q 3 -16, 0 -14 L 0 6 Q 3 6, 7 4`}
            fill={`url(#${id}-g)`} stroke={style === "botanical" ? dark : "none"} strokeWidth={0.5} />
          {/* Center petal (behind) */}
          <path d={`M -4 5 Q -5 -4, -1 -14 Q 0 -16, 1 -14 Q 5 -4, 4 5 Z`}
            fill={accentColor} opacity={0.7} />
          {/* Petal veins */}
          <path d="M -3 2 Q -4 -4, -3 -10" stroke={dark} strokeWidth={0.25} fill="none" opacity={0.3} />
          <path d="M 3 2 Q 4 -4, 3 -10" stroke={dark} strokeWidth={0.25} fill="none" opacity={0.3} />
          {/* Highlight */}
          <path d="M -4 -2 Q -5 -6, -4 -10" stroke="white" strokeWidth={0.8} fill="none" opacity={0.12} strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

/* ─── Sunflower ──────────────────────────────────────── */
export const Sunflower: React.FC<FlowerProps> = ({
  color = "#F4C430", accentColor = "#E0A800",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const id = `sun-${x}-${y}`;
  const dark = shadeColor(color, -25);
  const light = shadeColor(color, 30);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-2" y="10" width="4" height="24" fill="#5A8A5A" />
          {[[-4,-12],[0,-12],[-8,-8],[-4,-8],[0,-8],[4,-8],[-8,-4],[-4,-4],[0,-4],[4,-4],[-4,0],[0,0],[4,0],[0,4]].map(([px,py],i)=>(
            <rect key={i} x={px} y={py} width="4" height="4" fill={(Math.abs(px!)+Math.abs(py!))<6?"#6B4226":color} />
          ))}
        </>
      ) : (
        <>
          <defs>
            <radialGradient id={`${id}-cg`} cx="40%" cy="35%">
              <stop offset="0%" stopColor="#8B5A3C" />
              <stop offset="50%" stopColor="#6B4226" />
              <stop offset="100%" stopColor="#4A2A12" />
            </radialGradient>
            <linearGradient id={`${id}-pg`} x1="0" y1="1" x2="0.2" y2="0">
              <stop offset="0%" stopColor={dark} />
              <stop offset="50%" stopColor={color} />
              <stop offset="90%" stopColor={light} />
            </linearGradient>
          </defs>
          {/* Thick stem */}
          <path d="M 0 14 Q -2 28, 1 40 Q 2 46, 0 50" stroke="#3A6A3A" strokeWidth={style === "botanical" ? 2.5 : 3.5} fill="none" strokeLinecap="round" />
          {/* Large leaves */}
          <path d="M 0 30 Q -18 20, -14 10 Q -8 18, 0 30" fill="#4A7A4A" opacity={0.75} />
          <path d="M -7 20 Q -12 14, -12 12" stroke="#3A5A3A" strokeWidth={0.5} fill="none" opacity={0.4} />
          <path d="M 0 40 Q 16 30, 13 20 Q 8 28, 0 40" fill="#5A8A5A" opacity={0.65} />
          <path d="M 7 30 Q 11 24, 11 22" stroke="#3A5A3A" strokeWidth={0.5} fill="none" opacity={0.4} />
          {/* Outer petals — pointed, natural shapes */}
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (360 / 18) * i;
            const wobble = (i % 3) * 0.5;
            return (
              <path key={i}
                d={`M 0 0 Q ${-2.5 - wobble} ${-5}, ${-2} ${-12 - wobble} Q 0 ${-15 - wobble}, ${2} ${-12 - wobble} Q ${2.5 + wobble} ${-5}, 0 0`}
                fill={`url(#${id}-pg)`}
                transform={`rotate(${a}, 0, 0)`}
                stroke={style === "botanical" ? dark : "none"} strokeWidth={0.3}
                opacity={0.88} />
            );
          })}
          {/* Inner petals */}
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (360 / 14) * i + 10;
            return (
              <path key={`inner-${i}`}
                d={`M 0 0 Q -1.8 -3, -1.2 -8 Q 0 -10, 1.2 -8 Q 1.8 -3, 0 0`}
                fill={accentColor}
                transform={`rotate(${a}, 0, 0)`} opacity={0.75} />
            );
          })}
          {/* Center disc with seed pattern */}
          <circle cx="0" cy="0" r="6.5" fill={`url(#${id}-cg)`} />
          <circle cx="0" cy="0" r="5" fill="#7B5236" opacity={0.6} />
          {/* Seed dots in spiral */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = i * 137.5 * Math.PI / 180;
            const r = 1 + Math.sqrt(i) * 1.1;
            if (r > 5.5) return null;
            return (
              <circle key={`s-${i}`}
                cx={Math.cos(angle) * r} cy={Math.sin(angle) * r}
                r={0.55} fill="#3A2010" opacity={0.5} />
            );
          })}
          {/* Highlight */}
          <ellipse cx="-2" cy="-2" rx="2" ry="2.5" fill="white" opacity={0.08} />
        </>
      )}
    </g>
  );
};

/* ─── Lavender ──────────────────────────────────────── */
export const Lavender: React.FC<FlowerProps> = ({
  color = "#9B7FBF", accentColor = "#7B5FA0",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const dark = shadeColor(color, -20);
  const light = shadeColor(color, 30);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-1" y="6" width="2" height="28" fill="#5A8A5A" />
          {[-10,-7,-4,-1,2].map((py)=>(
            <React.Fragment key={py}>
              <rect x="-3" y={py} width="3" height="2" fill={color} />
              <rect x="0" y={py} width="3" height="2" fill={accentColor} />
            </React.Fragment>
          ))}
        </>
      ) : (
        <>
          {/* Slender stem */}
          <path d="M 0 5 Q -1 14, 1 26 Q 2 34, 0 42" stroke="#6A8A5A" strokeWidth={style === "botanical" ? 1 : 1.3} fill="none" strokeLinecap="round" />
          {/* Tiny leaves */}
          <path d="M 0 22 Q -6 18, -4 14 Q -2 17, 0 22" fill="#6A8A5A" opacity={0.6} />
          <path d="M 1 28 Q 6 24, 5 20 Q 3 23, 1 28" fill="#7A9A6A" opacity={0.55} />
          {/* Flower buds — tubular pairs */}
          {[-15, -12, -9, -6, -3, 0].map((py, i) => {
            const sz = 1.2 + (5 - i) * 0.25;
            return (
              <React.Fragment key={py}>
                {/* Left bud */}
                <path d={`M -0.5 ${py} Q ${-sz * 2} ${py - 1}, ${-sz * 2.2} ${py - 0.5} Q ${-sz * 2} ${py + 1}, -0.5 ${py}`}
                  fill={i % 2 === 0 ? color : light} opacity={0.85}
                  stroke={style === "botanical" ? dark : "none"} strokeWidth={0.25} />
                {/* Right bud */}
                <path d={`M 0.5 ${py} Q ${sz * 2} ${py - 1}, ${sz * 2.2} ${py - 0.5} Q ${sz * 2} ${py + 1}, 0.5 ${py}`}
                  fill={i % 2 === 0 ? accentColor : color} opacity={0.85}
                  stroke={style === "botanical" ? dark : "none"} strokeWidth={0.25} />
                {/* Tiny highlight */}
                <ellipse cx={-sz * 1.2} cy={py - 0.3} rx={0.4} ry={0.3} fill="white" opacity={0.1} />
              </React.Fragment>
            );
          })}
          {/* Tip bud */}
          <path d="M 0 -17 Q -1 -19, 0 -20 Q 1 -19, 0 -17" fill={accentColor} opacity={0.7} />
        </>
      )}
    </g>
  );
};

/* ─── Eucalyptus ──────────────────────────────────────── */
export const Eucalyptus: React.FC<FlowerProps> = ({
  color = "#7BAF7B", accentColor = "#5A8A5A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const dark = shadeColor(color, -25);
  const light = shadeColor(color, 25);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-1" y="-10" width="2" height="40" fill={accentColor} />
          {[-8,-2,4,10,16].map((py,i)=>(
            <rect key={py} x={i%2===0?-5:2} y={py} width="4" height="3" fill={color} />
          ))}
        </>
      ) : (
        <>
          {/* Gracefully curved stem */}
          <path d="M 0 -12 Q -2 4, 1 20 Q 2 30, 0 38" stroke={accentColor} strokeWidth={style === "botanical" ? 1 : 1.3} fill="none" strokeLinecap="round" />
          {/* Alternating round leaves with veins */}
          {[-10, -4, 2, 8, 14, 20, 26].map((py, i) => {
            const side = i % 2 === 0 ? -1 : 1;
            const fill = i < 3 ? light : color;
            return (
              <g key={py}>
                <ellipse
                  cx={side * 5} cy={py}
                  rx={4.2} ry={3.5}
                  fill={fill} opacity={0.7}
                  transform={`rotate(${side * -15}, ${side * 5}, ${py})`}
                  stroke={style === "botanical" ? dark : "none"} strokeWidth={0.4} />
                {/* Leaf vein */}
                <line x1={side * 2} y1={py} x2={side * 8} y2={py}
                  stroke={dark} strokeWidth={0.3} opacity={0.3} />
                {/* Highlight */}
                <ellipse cx={side * 4} cy={py - 1} rx={1.5} ry={1} fill="white" opacity={0.08}
                  transform={`rotate(${side * -15}, ${side * 4}, ${py - 1})`} />
              </g>
            );
          })}
        </>
      )}
    </g>
  );
};

/* ─── Daisy ──────────────────────────────────────────── */
export const Daisy: React.FC<FlowerProps> = ({
  color = "#FFFFFF", accentColor = "#F4D03F",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const id = `daisy-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-1" y="8" width="2" height="22" fill="#5A8A5A" />
          {[[-4,-8],[0,-10],[4,-8],[-6,-4],[6,-4],[-4,0],[4,0],[0,4],[0,-4]].map(([px,py],i)=>(
            <rect key={i} x={px} y={py} width="4" height="4" fill={i===8?accentColor:color} />
          ))}
        </>
      ) : (
        <>
          <defs>
            <radialGradient id={`${id}-cg`} cx="40%" cy="35%">
              <stop offset="0%" stopColor="#F8E060" />
              <stop offset="100%" stopColor={accentColor} />
            </radialGradient>
          </defs>
          <path d="M 0 6 Q -1 18, 1 30 Q 1 36, 0 40" stroke="#4A7A4A" strokeWidth={style === "botanical" ? 1.2 : 2} fill="none" strokeLinecap="round" />
          <path d="M 0 26 Q -10 20, -7 12 Q -4 18, 0 26" fill="#6BA06B" opacity={0.7} />
          <path d="M -4 19 Q -7 15, -6 13" stroke="#3A5A3A" strokeWidth={0.3} fill="none" opacity={0.4} />
          {/* Petals — elongated with slight notch */}
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (360 / 14) * i;
            const wobble = i % 3 === 0 ? 0.5 : 0;
            return (
              <path key={i}
                d={`M 0 0 Q ${-2 - wobble} ${-4}, ${-1.5} ${-9} Q 0 ${-11}, 1.5 ${-9} Q ${2 + wobble} ${-4}, 0 0`}
                fill={color}
                transform={`rotate(${a}, 0, 0)`}
                stroke={style === "botanical" ? "#DDD" : "none"} strokeWidth={0.3} opacity={0.9} />
            );
          })}
          {/* Center dome */}
          <circle cx="0" cy="0" r="4.2" fill={`url(#${id}-cg)`} />
          <circle cx="0" cy="0" r="2.8" fill="#E8C830" opacity={0.6} />
          {/* Pollen texture */}
          {Array.from({ length: 10 }).map((_, i) => {
            const a2 = i * 36 * Math.PI / 180;
            const r = 1.5 + (i % 3) * 0.5;
            return <circle key={i} cx={Math.cos(a2) * r} cy={Math.sin(a2) * r} r={0.35} fill="#D4A020" opacity={0.5} />;
          })}
          <ellipse cx="-1" cy="-1" rx="1.5" ry="1.5" fill="white" opacity={0.1} />
        </>
      )}
    </g>
  );
};

/* ─── Hyacinth ──────────────────────────────────────── */
export const Hyacinth: React.FC<FlowerProps> = ({
  color = "#7B68AE", accentColor = "#5B4890",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const light = shadeColor(color, 30);
  const dark = shadeColor(accentColor, -15);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-2" y="8" width="4" height="22" fill="#5A8A5A" />
          {[[-4,-12],[-4,-8],[0,-12],[0,-8],[4,-12],[4,-8],[-4,-4],[0,-4],[4,-4],[0,0]].map(([px,py],i)=>(
            <rect key={i} x={px} y={py} width="4" height="4" fill={i%2===0?color:accentColor} />
          ))}
        </>
      ) : (
        <>
          <path d="M 0 6 Q -1 18, 1 32 Q 2 38, 0 44" stroke="#4A7A4A" strokeWidth={style === "botanical" ? 2 : 2.8} fill="none" strokeLinecap="round" />
          {/* Large strap leaves */}
          <path d="M -1 30 Q -14 16, -8 4 Q -4 14, -1 30" fill="#5A8A5A" opacity={0.65} />
          <path d="M -6 17 Q -10 10, -8 6" stroke="#3A5A3A" strokeWidth={0.4} fill="none" opacity={0.4} />
          <path d="M 1 34 Q 12 22, 9 10 Q 5 20, 1 34" fill="#6BA06B" opacity={0.55} />
          {/* Star-shaped florets in clusters */}
          {[-18, -14, -10, -6, -2, 2].map((py, row) => {
            const w = 2.5 + row * 0.7;
            const cols = row < 2 ? 2 : 3;
            return (
              <React.Fragment key={py}>
                {Array.from({ length: cols }).map((_, col) => {
                  const cx = (col - (cols - 1) / 2) * w;
                  return (
                    <g key={col}>
                      {/* 4-petal star */}
                      {[0, 90, 45, 135].map((a) => (
                        <ellipse key={a} cx={cx} cy={py} rx={0.8} ry={2}
                          fill={a < 90 ? color : light}
                          transform={`rotate(${a}, ${cx}, ${py})`} opacity={0.8}
                          stroke={style === "botanical" ? dark : "none"} strokeWidth={0.2} />
                      ))}
                      <circle cx={cx} cy={py} r={0.6} fill={light} opacity={0.7} />
                    </g>
                  );
                })}
              </React.Fragment>
            );
          })}
        </>
      )}
    </g>
  );
};

/* ─── Ranunculus ──────────────────────────────────────── */
export const Ranunculus: React.FC<FlowerProps> = ({
  color = "#F0A0A0", accentColor = "#D07070",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const id = `ran-${x}-${y}`;
  const dark = shadeColor(color, -25);
  const light = shadeColor(color, 30);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-2" y="10" width="4" height="20" fill="#5A8A5A" />
          {[[-6,-10],[-2,-12],[2,-10],[-8,-6],[-4,-8],[0,-8],[4,-6],[-6,-2],[-2,-4],[2,-4],[6,-2],[-4,0],[0,0],[4,0],[0,4]].map(([px,py],i)=>(
            <rect key={i} x={px} y={py} width="4" height="4" fill={i%3===0?accentColor:color} />
          ))}
        </>
      ) : (
        <>
          <defs>
            <radialGradient id={`${id}-g`} cx="40%" cy="35%">
              <stop offset="0%" stopColor={light} />
              <stop offset="60%" stopColor={color} />
              <stop offset="100%" stopColor={dark} />
            </radialGradient>
          </defs>
          <path d="M 0 10 Q -2 20, 1 32 Q 2 38, 0 42" stroke="#4A7A4A" strokeWidth={style === "botanical" ? 1.5 : 2.2} fill="none" strokeLinecap="round" />
          <path d="M 0 28 Q -12 20, -8 12 Q -5 18, 0 28" fill="#6BA06B" opacity={0.7} />
          {/* Many layered round petals — signature ranunculus look */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path key={`o3-${a}`}
              d={`M 0 0 Q -5 -5, -4 -10 Q 0 -13, 4 -10 Q 5 -5, 0 0`}
              fill={`url(#${id}-g)`} transform={`rotate(${a}, 0, 0)`} opacity={0.48}
              stroke={style === "botanical" ? dark : "none"} strokeWidth={0.25} />
          ))}
          {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => (
            <path key={`o2-${a}`}
              d={`M 0 0 Q -3.5 -3, -3 -7.5 Q 0 -9.5, 3 -7.5 Q 3.5 -3, 0 0`}
              fill={accentColor} transform={`rotate(${a}, 0, 0)`} opacity={0.6}
              stroke={style === "botanical" ? dark : "none"} strokeWidth={0.2} />
          ))}
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={`o1-${a}`}
              d={`M 0 0 Q -2 -2, -1.5 -5 Q 0 -6.5, 1.5 -5 Q 2 -2, 0 0`}
              fill={color} transform={`rotate(${a}, 0, 0)`} opacity={0.85} />
          ))}
          <circle cx="0" cy="-0.5" r="2" fill="#E8D090" opacity={0.5} />
          <ellipse cx="-1.5" cy="-4" rx="1" ry="1.5" fill="white" opacity={0.1} transform="rotate(-20, -1.5, -4)" />
        </>
      )}
    </g>
  );
};

/* ─── Cherry Blossom ──────────────────────────────────── */
export const CherryBlossom: React.FC<FlowerProps> = ({
  color = "#FFB7C5", accentColor = "#E8899A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const dark = shadeColor(color, -20);
  const light = shadeColor(color, 30);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-1" y="6" width="2" height="24" fill="#8B6040" />
          {[[-4,-8],[0,-10],[4,-8],[-2,-4],[2,-4],[0,0]].map(([px,py],i)=>(
            <rect key={i} x={px} y={py} width="4" height="4" fill={i<3?color:accentColor} />
          ))}
        </>
      ) : (
        <>
          {/* Woody branch */}
          <path d="M 0 6 Q 3 14, 2 24 Q 1 30, 0 36" stroke="#7A5030" strokeWidth={style === "botanical" ? 1.2 : 1.8} fill="none" strokeLinecap="round" />
          <path d="M 1 18 Q -4 14, -3 10" stroke="#7A5030" strokeWidth={0.8} fill="none" strokeLinecap="round" />
          {/* 5 heart-shaped petals */}
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a}
              d={`M 0 0 Q -3 -3, -4 -7 Q -3 -10, -1 -9.5 L 0 -8 L 1 -9.5 Q 3 -10, 4 -7 Q 3 -3, 0 0`}
              fill={color} transform={`rotate(${a}, 0, 0)`}
              stroke={style === "botanical" ? dark : "none"} strokeWidth={0.4} opacity={0.85} />
          ))}
          {/* Petal vein */}
          {[0, 72, 144, 216, 288].map((a) => (
            <line key={`v-${a}`} x1="0" y1="0" x2="0" y2="-6"
              stroke={dark} strokeWidth={0.2} transform={`rotate(${a}, 0, 0)`} opacity={0.2} />
          ))}
          {/* Stamen */}
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <g key={`s-${a}`} transform={`rotate(${a}, 0, 0)`}>
              <line x1="0" y1="0" x2="0" y2="-4" stroke={accentColor} strokeWidth={0.35} opacity={0.5} />
              <circle cx="0" cy="-4.2" r="0.6" fill="#C06070" opacity={0.7} />
            </g>
          ))}
          <circle cx="0" cy="0" r="1.5" fill={light} opacity={0.4} />
          <ellipse cx="-1.5" cy="-4" rx="0.8" ry="1.2" fill="white" opacity={0.12} transform="rotate(-25, -1.5, -4)" />
        </>
      )}
    </g>
  );
};

/* ─── Baby's Breath ──────────────────────────────────── */
export const BabysBreath: React.FC<FlowerProps> = ({
  color = "#FFFFFF", accentColor = "#E8E0D8",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-1" y="4" width="2" height="22" fill="#8AA878" />
        {[[-4,-6],[0,-8],[4,-6],[-2,-2],[2,-2],[0,2]].map(([px,py],i)=>(
          <rect key={i} x={px} y={py} width="2" height="2" fill={color} />
        ))}
      </>
    ) : (
      <>
        <path d="M 0 4 Q -1 12, 0 30" stroke="#8AA878" strokeWidth={0.8} fill="none" strokeLinecap="round" />
        {/* Delicate branching with tiny 5-dot flowers */}
        {[
          { bx: -8, by: -8, stems: [[-13,-14],[-7,-17],[-10,-10],[-5,-12]] },
          { bx: 7, by: -4, stems: [[11,-10],[9,-14],[5,-8],[12,-7]] },
          { bx: -3, by: -12, stems: [[-7,-18],[-1,-21],[3,-17],[-4,-14]] },
          { bx: 5, by: -10, stems: [[9,-16],[6,-19],[3,-13],[8,-12]] },
          { bx: -5, by: -2, stems: [[-9,-6],[-7,-10],[-3,-5]] },
        ].map((branch, bi) => (
          <React.Fragment key={bi}>
            <line x1="0" y1={branch.by + 12} x2={branch.bx} y2={branch.by}
              stroke="#8AA878" strokeWidth={0.45} opacity={0.7} />
            {branch.stems.map(([sx,sy], si) => (
              <React.Fragment key={si}>
                <line x1={branch.bx} y1={branch.by} x2={sx} y2={sy}
                  stroke="#A0B890" strokeWidth={0.25} opacity={0.6} />
                {/* Tiny multi-petal flower */}
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx={sx} cy={sy! - 1} rx={0.5} ry={0.9}
                    fill={color} transform={`rotate(${a}, ${sx}, ${sy})`} opacity={0.8} />
                ))}
                <circle cx={sx} cy={sy} r={0.4} fill={accentColor} opacity={0.5} />
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </>
    )}
  </g>
);

/* ─── Fern ──────────────────────────────────────────── */
export const Fern: React.FC<FlowerProps> = ({
  color = "#5A8A5A", accentColor = "#3A6A3A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => {
  const light = shadeColor(color, 20);
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {style === "pixel" ? (
        <>
          <rect x="-1" y="-8" width="2" height="36" fill={accentColor} />
          {[-6,-2,2,6,10,14].map((py,i)=>(
            <React.Fragment key={py}>
              <rect x={i%2===0?-6:-1} y={py} width="5" height="2" fill={color} />
              <rect x={i%2===0?1:-6} y={py} width="5" height="2" fill={color} opacity={0.7} />
            </React.Fragment>
          ))}
        </>
      ) : (
        <>
          {/* Central frond with slight curve */}
          <path d="M 0 -14 Q -1 4, 1 22 Q 2 30, 0 38" stroke={accentColor} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          {/* Alternating pinnae with sub-leaflets */}
          {[-12, -8, -4, 0, 4, 8, 12, 16, 20, 24].map((py, i) => {
            const side = i % 2 === 0 ? -1 : 1;
            const length = 9 - Math.abs(py + 2) * 0.22;
            if (length < 2) return null;
            return (
              <g key={py}>
                {/* Main pinna */}
                <path
                  d={`M 0 ${py} Q ${side * length * 0.5} ${py - 2.5}, ${side * length} ${py - 1.5} Q ${side * length * 0.6} ${py + 0.5}, 0 ${py}`}
                  fill={i < 4 ? light : color} opacity={0.7}
                  stroke={style === "botanical" ? accentColor : "none"} strokeWidth={0.3} />
                {/* Sub-leaflets */}
                {length > 4 && (
                  <>
                    <path d={`M ${side * length * 0.4} ${py - 1} Q ${side * length * 0.5} ${py - 3}, ${side * length * 0.6} ${py - 2.5} Q ${side * length * 0.5} ${py - 0.5}, ${side * length * 0.4} ${py - 1}`}
                      fill={color} opacity={0.5} />
                    <path d={`M ${side * length * 0.6} ${py - 1.5} Q ${side * length * 0.7} ${py - 3.5}, ${side * length * 0.85} ${py - 3} Q ${side * length * 0.75} ${py - 1}, ${side * length * 0.6} ${py - 1.5}`}
                      fill={color} opacity={0.45} />
                  </>
                )}
                {/* Pinna vein */}
                <line x1={0} y1={py} x2={side * length * 0.8} y2={py - 1}
                  stroke={accentColor} strokeWidth={0.2} opacity={0.3} />
              </g>
            );
          })}
        </>
      )}
    </g>
  );
};

export const flowerComponents = {
  rose: Rose,
  peony: Peony,
  tulip: Tulip,
  sunflower: Sunflower,
  lavender: Lavender,
  eucalyptus: Eucalyptus,
  daisy: Daisy,
  hyacinth: Hyacinth,
  ranunculus: Ranunculus,
  cherry_blossom: CherryBlossom,
  babys_breath: BabysBreath,
  fern: Fern,
} as const;

export type FlowerType = keyof typeof flowerComponents;

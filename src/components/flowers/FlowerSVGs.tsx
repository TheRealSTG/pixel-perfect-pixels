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

/* ─── Rose ──────────────────────────────────────────── */
export const Rose: React.FC<FlowerProps> = ({
  color = "#E8A0B4", accentColor = "#D4708A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Long curved stem */}
        <path d={`M 0 8 Q 2 22, 1 40`} stroke="#5A8A5A" strokeWidth={style === "botanical" ? 1.5 : 2.2} fill="none" strokeLinecap="round" />
        {/* Thorns */}
        <line x1="1" y1="18" x2="4" y2="15" stroke="#5A8A5A" strokeWidth={1} />
        <line x1="1" y1="28" x2="-3" y2="25" stroke="#5A8A5A" strokeWidth={1} />
        {/* Leaves */}
        <path d="M -1 22 Q -10 18, -7 12 Q -4 16, -1 22" fill="#7BAF7B" opacity={0.8} />
        <path d="M 2 30 Q 10 26, 8 20 Q 5 24, 2 30" fill="#6BA06B" opacity={0.7} />
        {/* Outer petals - layered spiral */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="0" cy="-7" rx={style==="botanical"?5.5:6.5} ry={style==="botanical"?9:10}
            fill={color} transform={`rotate(${angle}, 0, 0)`} opacity={0.85}
            stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.5} />
        ))}
        {/* Mid petals - tighter */}
        {[36, 108, 180, 252, 324].map((angle) => (
          <ellipse key={angle} cx="0" cy="-4.5" rx={3.5} ry={6} fill={accentColor}
            transform={`rotate(${angle}, 0, 0)`} opacity={0.85} />
        ))}
        {/* Inner spiral center */}
        <path d="M -1 -1 Q -2 -4, 0 -5 Q 2 -4, 1 -1 Q 0 0, -1 -1" fill={accentColor} opacity={0.9} />
        <circle cx="0" cy="-1" r="2" fill={accentColor} opacity={0.6} />
      </>
    )}
  </g>
);

/* ─── Peony ──────────────────────────────────────────── */
export const Peony: React.FC<FlowerProps> = ({
  color = "#F5E1E8", accentColor = "#E8C4D0",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-2" y="10" width="4" height="20" fill="#5A8A5A" />
        {[[-8,-8],[-4,-12],[0,-12],[4,-8],[-8,-4],[-4,-8],[0,-8],[4,-4],[-8,0],[-4,-4],[0,-4],[4,0],[-4,0],[0,0],[4,4],[0,4]].map(([px,py],i) => (
          <rect key={i} x={px} y={py} width="4" height="4"
            fill={(Math.abs(px!)+Math.abs(py!)) < 8 ? accentColor : color}
            opacity={(Math.abs(px!)+Math.abs(py!)) > 16 ? 0 : 1} />
        ))}
      </>
    ) : (
      <>
        <path d={`M 0 12 Q -1 25, 0 42`} stroke="#5A8A5A" strokeWidth={style === "botanical" ? 1.8 : 2.8} fill="none" strokeLinecap="round" />
        <path d="M -1 26 Q -12 20, -9 14 Q -5 18, -1 26" fill="#7BAF7B" opacity={0.7} />
        {/* Many ruffled outer petals — distinctive peony fullness */}
        {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
          <ellipse key={`o-${angle}`} cx="0" cy={-8 - (i % 2) * 2}
            rx={style==="botanical"?7:8} ry={style==="botanical"?10:11}
            fill={color} transform={`rotate(${angle}, 0, 0)`} opacity={0.65}
            stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.4} />
        ))}
        {/* Inner ruffled petals */}
        {[20, 65, 110, 155, 200, 245, 290, 335].map((angle) => (
          <ellipse key={`i-${angle}`} cx="0" cy="-5" rx={4.5} ry={6.5}
            fill={accentColor} transform={`rotate(${angle}, 0, 0)`} opacity={0.75} />
        ))}
        {/* Tight inner cluster */}
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={`c-${a}`} cx="0" cy="-2" rx={2} ry={3.5}
            fill={color} transform={`rotate(${a}, 0, 0)`} opacity={0.9} />
        ))}
        <circle cx="0" cy="0" r="2.5" fill="#F0D8A8" opacity={0.5} />
      </>
    )}
  </g>
);

/* ─── Tulip ──────────────────────────────────────────── */
export const Tulip: React.FC<FlowerProps> = ({
  color = "#E06080", accentColor = "#C84060",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Tall straight stem — tulip characteristic */}
        <line x1="0" y1="8" x2="0" y2="45" stroke="#5A8A5A" strokeWidth={style==="botanical"?1.5:2.5} strokeLinecap="round" />
        {/* Long leaf wrapping stem */}
        <path d="M 0 35 Q -14 22, -8 10 Q -5 18, 0 35" fill="#6BA06B" opacity={0.7} />
        <path d="M 0 40 Q 12 28, 9 18 Q 6 26, 0 40" fill="#7BAF7B" opacity={0.6} />
        {/* Cup-shaped petals — 3 visible in classic tulip form */}
        <path d={`M -7 2 Q -9 -8, -3 -14 Q 0 -16, 0 -14 L 0 6 Q -4 5, -7 2`}
          fill={color} stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.5} />
        <path d={`M 7 2 Q 9 -8, 3 -14 Q 0 -16, 0 -14 L 0 6 Q 4 5, 7 2`}
          fill={color} stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.5} />
        <path d={`M -4 3 Q -4 -6, 0 -13 Q 4 -6, 4 3 Z`}
          fill={accentColor} opacity={0.7} />
      </>
    )}
  </g>
);

/* ─── Sunflower ──────────────────────────────────────── */
export const Sunflower: React.FC<FlowerProps> = ({
  color = "#F4C430", accentColor = "#E0A800",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Thick sturdy stem */}
        <path d={`M 0 14 Q 1 28, 0 48`} stroke="#5A8A5A" strokeWidth={style==="botanical"?2.5:3.5} fill="none" strokeLinecap="round" />
        {/* Large heart-shaped leaves */}
        <path d="M 0 30 Q -16 22, -12 14 Q -8 20, 0 30" fill="#5A8A5A" opacity={0.7} />
        <path d="M 0 38 Q 14 30, 11 22 Q 7 28, 0 38" fill="#6BA06B" opacity={0.6} />
        {/* Outer pointed petals — sunflower signature */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (360 / 16) * i;
          return (
            <path key={i}
              d={`M 0 0 L -2 -10 Q 0 -14, 2 -10 Z`}
              fill={i % 2 === 0 ? color : accentColor}
              transform={`rotate(${a}, 0, 0)`}
              stroke={style==="botanical"?"#C89020":"none"} strokeWidth={0.3} />
          );
        })}
        {/* Inner shorter petals */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (360 / 16) * i + 11.25;
          return (
            <path key={`inner-${i}`}
              d={`M 0 0 L -1.5 -7 Q 0 -9.5, 1.5 -7 Z`}
              fill={i % 2 === 0 ? accentColor : color}
              transform={`rotate(${a}, 0, 0)`} opacity={0.8} />
          );
        })}
        {/* Fibonacci center */}
        <circle cx="0" cy="0" r="6" fill="#6B4226" />
        <circle cx="0" cy="0" r="4.5" fill="#8B5A3C" opacity={0.7} />
        {/* Center dots for seed texture */}
        {[[-2,-2],[1,-2],[-1,0],[2,1],[-2,2],[0,2],[1,-1]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r={0.6} fill="#4A2A12" opacity={0.5} />
        ))}
      </>
    )}
  </g>
);

/* ─── Lavender ──────────────────────────────────────── */
export const Lavender: React.FC<FlowerProps> = ({
  color = "#9B7FBF", accentColor = "#7B5FA0",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Thin graceful stem — signature lavender curve */}
        <path d={`M 0 5 Q 1 18, 0 42`} stroke="#7A9A6A" strokeWidth={style==="botanical"?1:1.3} fill="none" strokeLinecap="round" />
        {/* Tiny narrow leaves */}
        <line x1="-1" y1="25" x2="-5" y2="20" stroke="#7A9A6A" strokeWidth={0.8} />
        <line x1="1" y1="30" x2="5" y2="26" stroke="#7A9A6A" strokeWidth={0.8} />
        {/* Flower spike — tiny paired buds getting smaller toward tip */}
        {[-14, -11, -8, -5, -2, 1].map((py, i) => {
          const sz = 1 + (5 - i) * 0.3;
          return (
            <React.Fragment key={py}>
              <ellipse cx={-2.2} cy={py} rx={sz} ry={sz * 0.7}
                fill={i % 2 === 0 ? color : accentColor} opacity={0.85}
                stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.3} />
              <ellipse cx={2.2} cy={py} rx={sz} ry={sz * 0.7}
                fill={i % 2 === 0 ? accentColor : color} opacity={0.85}
                stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.3} />
            </React.Fragment>
          );
        })}
        {/* Top bud */}
        <ellipse cx={0} cy={-16} rx={1.2} ry={1.5} fill={accentColor} opacity={0.7} />
      </>
    )}
  </g>
);

/* ─── Eucalyptus ──────────────────────────────────────── */
export const Eucalyptus: React.FC<FlowerProps> = ({
  color = "#7BAF7B", accentColor = "#5A8A5A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Thin woody stem */}
        <path d={`M 0 -12 Q -1 8, 0 38`} stroke={accentColor} strokeWidth={style==="botanical"?1:1.3} fill="none" strokeLinecap="round" />
        {/* Round alternating leaves — signature eucalyptus */}
        {[-10, -4, 2, 8, 14, 20, 26].map((py, i) => (
          <ellipse key={py}
            cx={i % 2 === 0 ? -5 : 5} cy={py}
            rx={4} ry={3.2}
            fill={color} opacity={i < 3 ? 0.6 : 0.75}
            transform={`rotate(${i % 2 === 0 ? -15 : 15}, ${i % 2 === 0 ? -5 : 5}, ${py})`}
            stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.4} />
        ))}
      </>
    )}
  </g>
);

/* ─── Daisy ──────────────────────────────────────────── */
export const Daisy: React.FC<FlowerProps> = ({
  color = "#FFFFFF", accentColor = "#F4D03F",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        <line x1="0" y1="6" x2="0" y2="38" stroke="#5A8A5A" strokeWidth={style==="botanical"?1.2:2} strokeLinecap="round" />
        <path d="M 0 25 Q -8 20, -6 14 Q -3 18, 0 25" fill="#7BAF7B" opacity={0.7} />
        {/* Thin elongated petals — daisy signature */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (360 / 12) * i;
          return (
            <ellipse key={i} cx="0" cy="-8" rx={2} ry={7}
              fill={color} transform={`rotate(${a}, 0, 0)`}
              stroke={style==="botanical"?"#DDD":"none"} strokeWidth={0.3} opacity={0.9} />
          );
        })}
        <circle cx="0" cy="0" r="4" fill={accentColor} />
        <circle cx="0" cy="0" r="2.5" fill="#E8C020" opacity={0.7} />
      </>
    )}
  </g>
);

/* ─── Hyacinth ──────────────────────────────────────── */
export const Hyacinth: React.FC<FlowerProps> = ({
  color = "#7B68AE", accentColor = "#5B4890",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Thick stem */}
        <line x1="0" y1="6" x2="0" y2="42" stroke="#5A8A5A" strokeWidth={style==="botanical"?2:2.8} strokeLinecap="round" />
        {/* Wide strap leaves */}
        <path d="M -1 30 Q -12 18, -6 8 Q -3 16, -1 30" fill="#6BA06B" opacity={0.6} />
        <path d="M 1 34 Q 10 22, 7 12 Q 4 20, 1 34" fill="#7BAF7B" opacity={0.5} />
        {/* Dense flower cluster — signature conical spike */}
        {[-16,-12,-8,-4,0].map((py, row) => {
          const w = 3 + row * 0.8;
          return (
            <React.Fragment key={py}>
              {[-1, 0, 1].map((col) => (
                <circle key={col} cx={col * w} cy={py}
                  r={2.2 - row * 0.15} fill={col === 0 ? accentColor : color}
                  opacity={0.8}
                  stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.3} />
              ))}
            </React.Fragment>
          );
        })}
      </>
    )}
  </g>
);

/* ─── Ranunculus ──────────────────────────────────────── */
export const Ranunculus: React.FC<FlowerProps> = ({
  color = "#F0A0A0", accentColor = "#D07070",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        <path d={`M 0 10 Q -1 22, 0 40`} stroke="#5A8A5A" strokeWidth={style==="botanical"?1.5:2.2} fill="none" strokeLinecap="round" />
        <path d="M 0 28 Q -10 22, -7 16 Q -4 20, 0 28" fill="#7BAF7B" opacity={0.7} />
        {/* Many concentric petal layers — ranunculus signature */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <ellipse key={`o3-${a}`} cx="0" cy="-7" rx={7} ry={9.5}
            fill={color} transform={`rotate(${a}, 0, 0)`} opacity={0.5}
            stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.3} />
        ))}
        {[22, 67, 112, 157, 202, 247, 292, 337].map((a) => (
          <ellipse key={`o2-${a}`} cx="0" cy="-5" rx={5} ry={7}
            fill={accentColor} transform={`rotate(${a}, 0, 0)`} opacity={0.6} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={`o1-${a}`} cx="0" cy="-3" rx={3} ry={4.5}
            fill={color} transform={`rotate(${a}, 0, 0)`} opacity={0.8} />
        ))}
        <circle cx="0" cy="0" r="2.5" fill="#E8D090" opacity={0.6} />
      </>
    )}
  </g>
);

/* ─── Cherry Blossom ──────────────────────────────────── */
export const CherryBlossom: React.FC<FlowerProps> = ({
  color = "#FFB7C5", accentColor = "#E8899A",
  scale = 1, rotation = 0, x = 0, y = 0, style = "flat",
}) => (
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
        {/* Woody branch stem */}
        <path d={`M 0 6 Q 3 16, 1 35`} stroke="#8B6040" strokeWidth={style==="botanical"?1.2:1.8} fill="none" strokeLinecap="round" />
        <line x1="1" y1="20" x2="-4" y2="16" stroke="#8B6040" strokeWidth={0.8} />
        {/* 5 notched petals — cherry blossom signature */}
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a}
            d={`M 0 0 Q -4 -7, -2 -10 L 0 -8 L 2 -10 Q 4 -7, 0 0`}
            fill={color} transform={`rotate(${a}, 0, 0)`}
            stroke={style==="botanical"?accentColor:"none"} strokeWidth={0.4} opacity={0.85} />
        ))}
        {/* Stamens */}
        {[0, 72, 144, 216, 288].map((a) => (
          <line key={`s-${a}`} x1="0" y1="0" x2="0" y2="-4"
            stroke={accentColor} strokeWidth={0.4} transform={`rotate(${a+36}, 0, 0)`} opacity={0.6} />
        ))}
        <circle cx="0" cy="0" r="1.8" fill={accentColor} opacity={0.5} />
        {/* Small dots at stamen tips */}
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={`d-${a}`} cx="0" cy="-4" r="0.5" fill="#C06070"
            transform={`rotate(${a+36}, 0, 0)`} opacity={0.7} />
        ))}
      </>
    )}
  </g>
);

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
} as const;

export type FlowerType = keyof typeof flowerComponents;

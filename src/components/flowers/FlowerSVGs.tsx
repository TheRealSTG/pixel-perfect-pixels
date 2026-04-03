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

export const Rose: React.FC<FlowerProps> = ({
  color = "#E8A0B4",
  accentColor = "#D4708A",
  scale = 1,
  rotation = 0,
  x = 0,
  y = 0,
  style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        {/* Pixel rose */}
        <rect x="-2" y="10" width="4" height="20" fill="#5A8A5A" />
        <rect x="-8" y="-8" width="4" height="4" fill={color} />
        <rect x="-4" y="-12" width="4" height="4" fill={color} />
        <rect x="0" y="-12" width="4" height="4" fill={accentColor} />
        <rect x="4" y="-8" width="4" height="4" fill={color} />
        <rect x="-4" y="-8" width="4" height="4" fill={accentColor} />
        <rect x="0" y="-8" width="4" height="4" fill={color} />
        <rect x="-8" y="-4" width="4" height="4" fill={color} />
        <rect x="-4" y="-4" width="4" height="4" fill={color} />
        <rect x="0" y="-4" width="4" height="4" fill={accentColor} />
        <rect x="4" y="-4" width="4" height="4" fill={color} />
        <rect x="-4" y="0" width="4" height="4" fill={color} />
        <rect x="0" y="0" width="4" height="4" fill={color} />
        <rect x="4" y="0" width="4" height="4" fill={color} />
        <rect x="0" y="4" width="4" height="4" fill={color} />
      </>
    ) : (
      <>
        {/* Stem */}
        <line x1="0" y1="8" x2="0" y2="35" stroke="#5A8A5A" strokeWidth={style === "botanical" ? 1.5 : 2.5} strokeLinecap="round" />
        {/* Leaves on stem */}
        <ellipse cx="-6" cy="20" rx="4" ry="2" fill="#7BAF7B" transform="rotate(-30, -6, 20)" opacity={0.8} />
        <ellipse cx="5" cy="26" rx="3.5" ry="1.8" fill="#7BAF7B" transform="rotate(25, 5, 26)" opacity={0.8} />
        {/* Outer petals */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-8"
            rx={style === "botanical" ? 6 : 7}
            ry={style === "botanical" ? 9 : 10}
            fill={color}
            transform={`rotate(${angle}, 0, 0)`}
            opacity={0.85}
            stroke={style === "botanical" ? accentColor : "none"}
            strokeWidth={style === "botanical" ? 0.5 : 0}
          />
        ))}
        {/* Inner petals */}
        {[30, 90, 150, 210, 270, 330].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-5"
            rx={4}
            ry={6}
            fill={accentColor}
            transform={`rotate(${angle}, 0, 0)`}
            opacity={0.9}
          />
        ))}
        {/* Center */}
        <circle cx="0" cy="0" r="3" fill={accentColor} opacity={0.7} />
      </>
    )}
  </g>
);

export const Peony: React.FC<FlowerProps> = ({
  color = "#F5E1E8",
  accentColor = "#E8C4D0",
  scale = 1,
  rotation = 0,
  x = 0,
  y = 0,
  style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-2" y="10" width="4" height="20" fill="#5A8A5A" />
        {[-8, -4, 0, 4].map((px) =>
          [-12, -8, -4, 0, 4].map((py) => (
            <rect key={`${px}-${py}`} x={px} y={py} width="4" height="4"
              fill={Math.abs(px) + Math.abs(py) < 10 ? accentColor : color}
              opacity={Math.abs(px) + Math.abs(py) > 14 ? 0 : 1}
            />
          ))
        )}
      </>
    ) : (
      <>
        <line x1="0" y1="10" x2="0" y2="35" stroke="#5A8A5A" strokeWidth={style === "botanical" ? 1.5 : 2.5} strokeLinecap="round" />
        <ellipse cx="-7" cy="22" rx="5" ry="2.5" fill="#7BAF7B" transform="rotate(-35, -7, 22)" opacity={0.7} />
        {/* Many layered petals for fullness */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={`o-${angle}`}
            cx="0"
            cy="-9"
            rx={style === "botanical" ? 8 : 9}
            ry={style === "botanical" ? 11 : 12}
            fill={color}
            transform={`rotate(${angle}, 0, 0)`}
            opacity={0.7}
            stroke={style === "botanical" ? accentColor : "none"}
            strokeWidth={style === "botanical" ? 0.4 : 0}
          />
        ))}
        {[20, 70, 120, 170, 220, 270, 320].map((angle) => (
          <ellipse
            key={`i-${angle}`}
            cx="0"
            cy="-6"
            rx={5}
            ry={7}
            fill={accentColor}
            transform={`rotate(${angle}, 0, 0)`}
            opacity={0.8}
          />
        ))}
        <circle cx="0" cy="0" r="4" fill="#F0D8A8" opacity={0.6} />
      </>
    )}
  </g>
);

export const Tulip: React.FC<FlowerProps> = ({
  color = "#E06080",
  accentColor = "#C84060",
  scale = 1,
  rotation = 0,
  x = 0,
  y = 0,
  style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-2" y="8" width="4" height="24" fill="#5A8A5A" />
        <rect x="-6" y="-8" width="4" height="4" fill={color} />
        <rect x="-2" y="-12" width="4" height="4" fill={color} />
        <rect x="2" y="-8" width="4" height="4" fill={color} />
        <rect x="-6" y="-4" width="4" height="4" fill={accentColor} />
        <rect x="-2" y="-8" width="4" height="4" fill={accentColor} />
        <rect x="2" y="-4" width="4" height="4" fill={accentColor} />
        <rect x="-2" y="-4" width="4" height="4" fill={color} />
        <rect x="-2" y="0" width="4" height="4" fill={color} />
      </>
    ) : (
      <>
        <line x1="0" y1="8" x2="0" y2="38" stroke="#5A8A5A" strokeWidth={style === "botanical" ? 1.5 : 2.5} strokeLinecap="round" />
        <ellipse cx="-7" cy="25" rx="6" ry="2" fill="#6BA06B" transform="rotate(-40, -7, 25)" opacity={0.7} />
        {/* Cup-shaped petals */}
        <ellipse cx="-5" cy="-4" rx="6" ry="12" fill={color} transform="rotate(-10, -5, -4)"
          stroke={style === "botanical" ? accentColor : "none"} strokeWidth={0.5} />
        <ellipse cx="5" cy="-4" rx="6" ry="12" fill={color} transform="rotate(10, 5, -4)"
          stroke={style === "botanical" ? accentColor : "none"} strokeWidth={0.5} />
        <ellipse cx="0" cy="-5" rx="4" ry="11" fill={accentColor} opacity={0.7} />
      </>
    )}
  </g>
);

export const Sunflower: React.FC<FlowerProps> = ({
  color = "#F4C430",
  accentColor = "#E0A800",
  scale = 1,
  rotation = 0,
  x = 0,
  y = 0,
  style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-2" y="10" width="4" height="24" fill="#5A8A5A" />
        {[[-4, -12], [0, -12], [-8, -8], [-4, -8], [0, -8], [4, -8],
          [-8, -4], [-4, -4], [0, -4], [4, -4], [-4, 0], [0, 0], [4, 0],
          [0, 4]].map(([px, py], i) => (
          <rect key={i} x={px} y={py} width="4" height="4"
            fill={Math.abs(px!) + Math.abs(py!) < 6 ? "#6B4226" : color} />
        ))}
      </>
    ) : (
      <>
        <line x1="0" y1="12" x2="0" y2="40" stroke="#5A8A5A" strokeWidth={style === "botanical" ? 2 : 3} strokeLinecap="round" />
        <ellipse cx="-9" cy="28" rx="7" ry="3" fill="#6BA06B" transform="rotate(-30, -9, 28)" opacity={0.7} />
        {/* Petals */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (360 / 14) * i;
          return (
            <ellipse
              key={i}
              cx="0"
              cy="-11"
              rx={style === "botanical" ? 3 : 3.5}
              ry={style === "botanical" ? 9 : 10}
              fill={i % 2 === 0 ? color : accentColor}
              transform={`rotate(${angle}, 0, 0)`}
              stroke={style === "botanical" ? "#C89020" : "none"}
              strokeWidth={0.4}
            />
          );
        })}
        {/* Center */}
        <circle cx="0" cy="0" r="6" fill="#6B4226" />
        <circle cx="0" cy="0" r="4" fill="#8B5A3C" opacity={0.6} />
      </>
    )}
  </g>
);

export const Lavender: React.FC<FlowerProps> = ({
  color = "#9B7FBF",
  accentColor = "#7B5FA0",
  scale = 1,
  rotation = 0,
  x = 0,
  y = 0,
  style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-1" y="6" width="2" height="28" fill="#5A8A5A" />
        {[-10, -7, -4, -1, 2].map((py) => (
          <React.Fragment key={py}>
            <rect x="-3" y={py} width="3" height="2" fill={color} />
            <rect x="0" y={py} width="3" height="2" fill={accentColor} />
          </React.Fragment>
        ))}
      </>
    ) : (
      <>
        <line x1="0" y1="4" x2="0" y2="38" stroke="#5A8A5A" strokeWidth={style === "botanical" ? 1 : 1.5} strokeLinecap="round" />
        {/* Tiny paired buds along the stem */}
        {[-12, -8, -4, 0, 4].map((py, i) => (
          <React.Fragment key={py}>
            <ellipse cx={-2.5} cy={py} rx={2.5} ry={1.8} fill={i % 2 === 0 ? color : accentColor}
              stroke={style === "botanical" ? accentColor : "none"} strokeWidth={0.3} opacity={0.9} />
            <ellipse cx={2.5} cy={py} rx={2.5} ry={1.8} fill={i % 2 === 0 ? accentColor : color}
              stroke={style === "botanical" ? accentColor : "none"} strokeWidth={0.3} opacity={0.9} />
          </React.Fragment>
        ))}
      </>
    )}
  </g>
);

export const Eucalyptus: React.FC<FlowerProps> = ({
  color = "#7BAF7B",
  accentColor = "#5A8A5A",
  scale = 1,
  rotation = 0,
  x = 0,
  y = 0,
  style = "flat",
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
    {style === "pixel" ? (
      <>
        <rect x="-1" y="-10" width="2" height="40" fill={accentColor} />
        {[-8, -2, 4, 10, 16].map((py, i) => (
          <rect key={py} x={i % 2 === 0 ? -5 : 2} y={py} width="4" height="3" fill={color} />
        ))}
      </>
    ) : (
      <>
        <line x1="0" y1="-14" x2="0" y2="35" stroke={accentColor} strokeWidth={style === "botanical" ? 1 : 1.5} strokeLinecap="round" />
        {[-10, -4, 2, 8, 14, 20].map((py, i) => (
          <ellipse
            key={py}
            cx={i % 2 === 0 ? -5 : 5}
            cy={py}
            rx={4.5}
            ry={3}
            fill={color}
            opacity={0.75}
            transform={`rotate(${i % 2 === 0 ? -20 : 20}, ${i % 2 === 0 ? -5 : 5}, ${py})`}
            stroke={style === "botanical" ? accentColor : "none"}
            strokeWidth={0.4}
          />
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
} as const;

export type FlowerType = keyof typeof flowerComponents;

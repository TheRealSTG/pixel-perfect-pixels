import React, { useState, useEffect } from "react";
import { flowerComponents } from "@/components/flowers/FlowerSVGs";
import type { ArtStyle } from "@/lib/bouquet-data";

interface FlowerPlacement {
  type: keyof typeof flowerComponents;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  accentColor: string;
  delay: number;
}

interface Props {
  flowers: FlowerPlacement[];
  wrapColor: string;
  wrapAccent: string;
  artStyle: ArtStyle;
  animated?: boolean;
}

const BouquetCanvas: React.FC<Props> = ({ flowers, wrapColor, wrapAccent, artStyle, animated = true }) => {
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : flowers.length);

  useEffect(() => {
    if (!animated) return;
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    flowers.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount((c) => c + 1), 200 + i * 120));
    });
    return () => timers.forEach(clearTimeout);
  }, [flowers, animated]);

  const styleVariant = artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";

  return (
    <svg viewBox="-120 -160 240 300" className="w-full h-auto max-w-xs sm:max-w-sm mx-auto" role="img" aria-label="Your bouquet">
      {/* Stems converging to wrap — each flower gets its own curved stem */}
      {flowers.slice(0, visibleCount).map((f, i) => {
        const stemBottom = 75;
        const convergeX = f.x * 0.1;
        const midY = (f.y + stemBottom) / 2;
        return (
          <path
            key={`stem-${i}`}
            d={`M ${f.x} ${f.y + 12 * f.scale} Q ${f.x * 0.6} ${midY}, ${convergeX} ${stemBottom}`}
            stroke="#5A8A5A"
            strokeWidth={styleVariant === "pixel" ? 2 : 1.2 + f.scale * 0.3}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
        );
      })}

      {/* Wrapping paper — more detailed */}
      <path
        d={`M -32 55 Q -40 75, -22 100 L 22 100 Q 40 75, 32 55 Z`}
        fill={wrapColor}
        stroke={wrapAccent}
        strokeWidth={1.2}
        opacity={0.92}
      />
      {/* Paper fold lines */}
      <path d="M -15 60 Q -18 78, -12 95" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.4} />
      <path d="M 15 60 Q 18 78, 12 95" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.4} />
      {/* Ribbon bow */}
      <ellipse cx="0" cy="54" rx="14" ry="5" fill={wrapAccent} opacity={0.75} />
      <path d="M -6 54 Q -12 48, -4 46 Q 0 50, -6 54" fill={wrapAccent} opacity={0.6} />
      <path d="M 6 54 Q 12 48, 4 46 Q 0 50, 6 54" fill={wrapAccent} opacity={0.6} />

      {/* Flowers */}
      {flowers.slice(0, visibleCount).map((f, i) => {
        const FlowerComp = flowerComponents[f.type];
        return (
          <g
            key={i}
            style={{
              animation: animated ? `bouquet-pop 0.4s ease-out forwards` : undefined,
              opacity: animated ? 0 : 1,
              animationDelay: animated ? `${f.delay}s` : undefined,
            }}
          >
            <FlowerComp
              x={f.x}
              y={f.y}
              scale={f.scale}
              rotation={f.rotation}
              color={f.color}
              accentColor={f.accentColor}
              style={styleVariant}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default BouquetCanvas;

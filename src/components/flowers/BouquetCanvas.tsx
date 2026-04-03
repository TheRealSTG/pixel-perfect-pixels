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
    <svg viewBox="-100 -140 200 240" className="w-full h-auto max-w-xs sm:max-w-sm mx-auto" role="img" aria-label="Your bouquet">
      {/* Stems converging */}
      {flowers.slice(0, visibleCount).map((f, i) => (
        <line
          key={`stem-${i}`}
          x1={f.x}
          y1={f.y + 15 * f.scale}
          x2={f.x * 0.15}
          y2={80}
          stroke="#5A8A5A"
          strokeWidth={styleVariant === "pixel" ? 2 : 1.5}
          strokeLinecap="round"
          opacity={0.4}
        />
      ))}

      {/* Wrapping paper */}
      <path
        d={`M -28 60 Q -35 80, -20 95 L 20 95 Q 35 80, 28 60 Z`}
        fill={wrapColor}
        stroke={wrapAccent}
        strokeWidth={1}
        opacity={0.9}
      />
      {/* Ribbon */}
      <ellipse cx="0" cy="58" rx="12" ry="4" fill={wrapAccent} opacity={0.7} />

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

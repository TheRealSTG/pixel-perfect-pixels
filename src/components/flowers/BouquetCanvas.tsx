import React, { useState, useEffect } from "react";
import { flowerComponents } from "@/components/flowers/FlowerSVGs";
import type { ArtStyle } from "@/lib/bouquet-data";
import type { BouquetLayer, WrapStyle } from "@/lib/bouquet-engine";

interface FlowerPlacement {
  type: keyof typeof flowerComponents;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
  accentColor: string;
  delay: number;
  layer?: BouquetLayer;
}

interface Props {
  flowers: FlowerPlacement[];
  wrapColor: string;
  wrapAccent: string;
  artStyle: ArtStyle;
  animated?: boolean;
  wrapStyle?: WrapStyle;
}

const BouquetCanvas: React.FC<Props> = ({ flowers, wrapColor, wrapAccent, artStyle, animated = true, wrapStyle = "paper" }) => {
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : flowers.length);

  useEffect(() => {
    if (!animated) return;
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    flowers.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount((c) => c + 1), 200 + i * 100));
    });
    return () => timers.forEach(clearTimeout);
  }, [flowers, animated]);

  const styleVariant = artStyle === "pixel" ? "pixel" : artStyle === "botanical" ? "botanical" : "flat";

  // Sort flowers by layer: back → mid → front
  const layerOrder: Record<string, number> = { back: 0, mid: 1, front: 2 };
  const sortedFlowers = [...flowers].sort((a, b) => {
    const la = layerOrder[a.layer || "mid"] ?? 1;
    const lb = layerOrder[b.layer || "mid"] ?? 1;
    if (la !== lb) return la - lb;
    return a.y - b.y; // within same layer, back-to-front by y
  });

  const renderWrap = () => {
    switch (wrapStyle) {
      case "kraft":
        return (
          <>
            <path d="M -35 50 Q -44 72, -24 105 L 24 105 Q 44 72, 35 50 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.5} opacity={0.95} />
            <path d="M -18 55 Q -22 75, -14 98" stroke={wrapAccent} strokeWidth={0.7} fill="none" opacity={0.3} />
            <path d="M 18 55 Q 22 75, 14 98" stroke={wrapAccent} strokeWidth={0.7} fill="none" opacity={0.3} />
            <path d="M 0 55 Q 0 75, 0 98" stroke={wrapAccent} strokeWidth={0.4} fill="none" opacity={0.2} />
            {/* Twine bow */}
            <path d="M -10 50 Q -16 42, -6 40 Q 0 46, -10 50" stroke={wrapAccent} strokeWidth={0.8} fill="none" opacity={0.5} />
            <path d="M 10 50 Q 16 42, 6 40 Q 0 46, 10 50" stroke={wrapAccent} strokeWidth={0.8} fill="none" opacity={0.5} />
            <circle cx="0" cy="49" r="2" fill={wrapAccent} opacity={0.6} />
          </>
        );
      case "tissue":
        return (
          <>
            {/* Ruffled tissue paper edges */}
            <path d="M -38 48 Q -42 36, -30 32 Q -35 44, -28 50 Q -34 42, -38 48" fill={wrapColor} opacity={0.5} />
            <path d="M 38 48 Q 42 36, 30 32 Q 35 44, 28 50 Q 34 42, 38 48" fill={wrapColor} opacity={0.5} />
            <path d="M -34 50 Q -42 72, -22 105 L 22 105 Q 42 72, 34 50 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.85} />
            <path d="M -20 55 Q -24 75, -16 98" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.25} />
            <path d="M 20 55 Q 24 75, 16 98" stroke={wrapAccent} strokeWidth={0.3} fill="none" opacity={0.25} />
            {/* Satin ribbon */}
            <rect x="-16" y="48" width="32" height="4" rx="2" fill={wrapAccent} opacity={0.7} />
            <path d="M -8 50 Q -14 42, -5 40 Q 0 46, -8 50" fill={wrapAccent} opacity={0.5} />
            <path d="M 8 50 Q 14 42, 5 40 Q 0 46, 8 50" fill={wrapAccent} opacity={0.5} />
          </>
        );
      case "burlap":
        return (
          <>
            <path d="M -33 52 Q -40 72, -20 102 L 20 102 Q 40 72, 33 52 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.8} opacity={0.9} />
            {/* Burlap texture lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h-${i}`} x1="-28" y1={56 + i * 6} x2="28" y2={56 + i * 6}
                stroke={wrapAccent} strokeWidth={0.3} opacity={0.2} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`v-${i}`} x1={-20 + i * 8} y1="54" x2={-18 + i * 8} y2="100"
                stroke={wrapAccent} strokeWidth={0.3} opacity={0.15} />
            ))}
            {/* Rustic twine */}
            <ellipse cx="0" cy="52" rx="12" ry="3" fill="none" stroke={wrapAccent} strokeWidth={1} opacity={0.6} />
          </>
        );
      case "vase":
        return (
          <>
            {/* Glass vase */}
            <path d="M -18 45 Q -22 65, -20 95 Q -18 102, 0 104 Q 18 102, 20 95 Q 22 65, 18 45 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1} opacity={0.6} />
            {/* Water line */}
            <path d="M -19 70 Q 0 68, 19 70 L 20 95 Q 18 102, 0 104 Q -18 102, -20 95 Z"
              fill="#C8E0E8" opacity={0.25} />
            {/* Glass highlight */}
            <path d="M -14 50 Q -15 65, -14 90" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.3} fill="none" strokeLinecap="round" />
            {/* Rim */}
            <ellipse cx="0" cy="45" rx="18" ry="4" fill={wrapColor} stroke={wrapAccent} strokeWidth={0.8} opacity={0.7} />
          </>
        );
      default: // paper
        return (
          <>
            <path d="M -32 55 Q -40 75, -22 100 L 22 100 Q 40 75, 32 55 Z"
              fill={wrapColor} stroke={wrapAccent} strokeWidth={1.2} opacity={0.92} />
            <path d="M -15 60 Q -18 78, -12 95" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.4} />
            <path d="M 15 60 Q 18 78, 12 95" stroke={wrapAccent} strokeWidth={0.5} fill="none" opacity={0.4} />
            <ellipse cx="0" cy="54" rx="14" ry="5" fill={wrapAccent} opacity={0.75} />
            <path d="M -6 54 Q -12 48, -4 46 Q 0 50, -6 54" fill={wrapAccent} opacity={0.6} />
            <path d="M 6 54 Q 12 48, 4 46 Q 0 50, 6 54" fill={wrapAccent} opacity={0.6} />
          </>
        );
    }
  };

  // Stem length varies by layer
  const getStemBottom = (layer?: BouquetLayer) => {
    switch (layer) {
      case "back": return 65;
      case "front": return 80;
      default: return 72;
    }
  };

  return (
    <svg viewBox="-120 -160 240 300" className="w-full h-auto max-w-xs sm:max-w-sm mx-auto" role="img" aria-label="Your bouquet">
      {/* Back layer stems */}
      {sortedFlowers.slice(0, visibleCount).map((f, i) => {
        const stemBottom = getStemBottom(f.layer);
        const convergeX = f.x * 0.08;
        const midY = (f.y + stemBottom) / 2;
        return (
          <path
            key={`stem-${i}`}
            d={`M ${f.x} ${f.y + 12 * f.scale} Q ${f.x * 0.5} ${midY}, ${convergeX} ${stemBottom}`}
            stroke={f.type === "cherry_blossom" ? "#8B6040" : "#5A8A5A"}
            strokeWidth={f.layer === "front" ? 1.5 + f.scale * 0.3 : 0.8 + f.scale * 0.2}
            strokeLinecap="round"
            fill="none"
            opacity={f.layer === "back" ? 0.35 : f.layer === "front" ? 0.55 : 0.4}
          />
        );
      })}

      {/* Wrap */}
      {renderWrap()}

      {/* Flowers by layer */}
      {sortedFlowers.slice(0, visibleCount).map((f, i) => {
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
